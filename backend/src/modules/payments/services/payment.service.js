const Iyzipay = require('iyzipay');
const PaymentQueries = require('../../../database/queries/payment.queries');
const DeliveryQueries = require('../../../database/queries/delivery.queries');

const iyzipay = new Iyzipay({
  apiKey: process.env.IYZICO_API_KEY,
  secretKey: process.env.IYZICO_SECRET_KEY,
  uri: process.env.IYZICO_URI // sandbox: 'https://sandbox-api.iyzipay.com'
});

class PaymentService {

  // -----------------------------------------------
  // 1. ÖDEME FORMU OLUŞTUR (İşveren ödeme başlatır)
  // -----------------------------------------------
  static async initializePayment(deliveryId, userId, buyerInfo) {
    // Delivery'yi çek
    const delivery = await DeliveryQueries.findById(deliveryId);

    if (!delivery) throw new Error('İş bulunamadı');
    if (delivery.sender_user_id !== userId) throw new Error('Bu işe ödeme yapamazsınız');
    if (delivery.payment_status !== 'waiting') throw new Error('Bu iş için zaten ödeme yapılmış');

    const conversationId = `BH-${delivery.order_number}-${Date.now()}`;

    const request = {
      locale: Iyzipay.LOCALE.TR,
      conversationId,
      price: String(delivery.payment_amount),
      paidPrice: String(delivery.payment_amount),
      currency: Iyzipay.CURRENCY.TRY,
      basketId: delivery.order_number,
      paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
      callbackUrl: `${process.env.API_BASE_URL}/api/payments/callback`,

      buyer: {
        id: String(userId),
        name: buyerInfo.name,
        surname: buyerInfo.surname,
        gsmNumber: buyerInfo.phone,
        email: buyerInfo.email,
        identityNumber: buyerInfo.identityNumber || '11111111111', // sandbox için
        lastLoginDate: new Date().toISOString().slice(0, 19).replace('T', ' '),
        registrationDate: new Date().toISOString().slice(0, 19).replace('T', ' '),
        registrationAddress: buyerInfo.address || 'Istanbul',
        ip: buyerInfo.ip,
        city: 'Istanbul',
        country: 'Turkey',
      },

      shippingAddress: {
        contactName: delivery.delivery_contact_name,
        city: 'Istanbul',
        country: 'Turkey',
        address: delivery.delivery_address,
      },

      billingAddress: {
        contactName: buyerInfo.name + ' ' + buyerInfo.surname,
        city: 'Istanbul',
        country: 'Turkey',
        address: buyerInfo.address || 'Istanbul',
      },

      basketItems: [
        {
          id: delivery.order_number,
          name: `BiHarçlık Teslimat - ${delivery.order_number}`,
          category1: 'Teslimat',
          itemType: Iyzipay.BASKET_ITEM_TYPE.VIRTUAL,
          price: String(delivery.payment_amount),
        }
      ]
    };

    // Conversation ID'yi DB'ye kaydet (callback'te bulmak için)
    await DeliveryQueries.updatePaymentStatus(deliveryId, {
      iyzico_conversation_id: conversationId
    });

    console.log('✅ conversationId kaydedildi:', conversationId);


    // İyzico'dan form token al
    return new Promise((resolve, reject) => {
      iyzipay.checkoutFormInitialize.create(request, (err, result) => {
        if (err) return reject(err);
        if (result.status !== 'success') return reject(new Error(result.errorMessage));
        resolve({
          checkoutFormContent: result.checkoutFormContent,
          token: result.token,
          conversationId
        });
      });
    });
  }

  static async initializeGuestPayment(deliveryId, buyerInfo) {
  const delivery = await DeliveryQueries.findById(deliveryId);

  if (!delivery) throw new Error('İş bulunamadı');
  if (!delivery.is_guest) throw new Error('Bu endpoint sadece guest siparişler için');
  if (delivery.payment_status !== 'waiting') throw new Error('Bu iş için zaten ödeme yapılmış');

  const conversationId = `BH-${delivery.order_number}-${Date.now()}`;

  const request = {
    locale: Iyzipay.LOCALE.TR,
    conversationId,
    price: String(delivery.payment_amount),
    paidPrice: String(delivery.payment_amount),
    currency: Iyzipay.CURRENCY.TRY,
    basketId: delivery.order_number,
    paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
    callbackUrl: `${process.env.API_BASE_URL}/api/payments/callback`,

    buyer: {
      id: `guest-${delivery.id}`,
      name: buyerInfo.name,
      surname: buyerInfo.surname || buyerInfo.name,
      gsmNumber: buyerInfo.phone,
      email: buyerInfo.email,
      identityNumber: '11111111111',
      lastLoginDate: new Date().toISOString().slice(0, 19).replace('T', ' '),
      registrationDate: new Date().toISOString().slice(0, 19).replace('T', ' '),
      registrationAddress: 'Istanbul',
      ip: buyerInfo.ip,
      city: 'Istanbul',
      country: 'Turkey',
    },

    shippingAddress: {
      contactName: delivery.delivery_contact_name,
      city: 'Istanbul',
      country: 'Turkey',
      address: delivery.delivery_address,
    },

    billingAddress: {
      contactName: buyerInfo.name,
      city: 'Istanbul',
      country: 'Turkey',
      address: 'Istanbul',
    },

    basketItems: [
      {
        id: delivery.order_number,
        name: `BiHarçlık Teslimat - ${delivery.order_number}`,
        category1: 'Teslimat',
        itemType: Iyzipay.BASKET_ITEM_TYPE.VIRTUAL,
        price: String(delivery.payment_amount),
      }
    ]
  };

  await DeliveryQueries.updatePaymentStatus(deliveryId, {
    iyzico_conversation_id: conversationId
  });

  console.log('✅ conversationId kaydedildi:', conversationId);

  return new Promise((resolve, reject) => {
    iyzipay.checkoutFormInitialize.create(request, (err, result) => {
      if (err) return reject(err);
      if (result.status !== 'success') return reject(new Error(result.errorMessage));
      resolve({
        checkoutFormContent: result.checkoutFormContent,
        token: result.token,
        conversationId
      });
    });
  });
}

  // -----------------------------------------------
  // 2. CALLBACK - İyzico ödeme sonucunu bildirir
  // -----------------------------------------------
  static async handleCallback(token) {
  const result = await new Promise((resolve, reject) => {
    iyzipay.checkoutForm.retrieve({ token }, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });

  console.log('İYZİCO CALLBACK RESULT:', JSON.stringify(result, null, 2));

  if (result.status !== 'success' || result.paymentStatus !== 'SUCCESS') {
    throw new Error(result.errorMessage || 'Ödeme başarısız');
  }

  // ⭐ conversationId yerine basketId kullan
  const orderNumber = result.basketId; // "YYK-00027"
  
  const delivery = await DeliveryQueries.findByOrderNumber(orderNumber);
  if (!delivery) throw new Error('İlgili iş bulunamadı');

  await PaymentQueries.saveIyzicoPayment(
    delivery.id,
    result.paymentId,
    result.token
  );

  return delivery;
}

  // -----------------------------------------------
  // 3. Perşembe ödemesi için bekleyenler
  // -----------------------------------------------
  static async getPendingStudentPayments() {
    return await PaymentQueries.getPendingStudentPayments();
  }
}


module.exports = PaymentService;