
export const formatPhoneForWhatsApp = (phone) => {
  if (!phone) return null;
  
  // Sadece rakamları al
  let cleaned = phone.replace(/\D/g, '');
  
  // Başta 0 varsa 90 ile değiştir
  if (cleaned.startsWith('0')) {
    cleaned = '90' + cleaned.slice(1);
  }
  
  // Başta 90 yoksa ekle
  if (!cleaned.startsWith('90')) {
    cleaned = '90' + cleaned;
  }
  
  return cleaned;
};

export const createWhatsAppLink = (phone, message) => {
  const formattedPhone = formatPhoneForWhatsApp(phone);
  
  if (!formattedPhone) {
    console.error('Geçersiz telefon numarası');
    return null;
  }
  
  const encodedMessage = encodeURIComponent(message);
  const link = `https://wa.me/${formattedPhone}?text=${encodedMessage}`;
  
  
  return link;
};

export const openWhatsApp = (phone, message) => {
  const link = createWhatsAppLink(phone, message);
  
  if (!link) {
    alert('Telefon numarası bulunamadı veya geçersiz!');
    return false;
  }
  
  window.open(link, '_blank');
  return true;
};

export const WhatsAppTemplates = {
  // Göndericiye: Kurye bulundu
    SENDER_COURIER_ASSIGNED: (orderNumber, courierName, university, department, amount, iban) => `
*${orderNumber} numaralı siparişiniz onaylandı!*

Kuryeniz *${courierName}*, ${university} ${department} bölümü öğrencisidir. Tüm kuryelerimiz doğrulanmış öğrencilerden oluşuyor.

Ödeme gerçekleştiği anda öğrencimiz yola çıkacaktır, şu an sizi bekliyor.

*Ödeme için IBAN:* ${iban}
*Tutar:* ${amount} TL

biharclik.com
`.trim(),
  // Öğrenciye: Ödeme alındı
  STUDENT_PAYMENT_RECEIVED: (orderNumber, pickupDistrict, pickupAddress, pickupNotes, deliveryDistrict, deliveryAddress, deliveryNotes, amount) => `
*Ödeme alındı, yola çıkabilirsin!*

*Sipariş No:* ${orderNumber}
*Kazancın:* ${amount} TL

*Alış Noktası (${pickupDistrict})*
${pickupAddress}
${pickupNotes ? `Not: ${pickupNotes}` : ''}

*Teslim Noktası (${deliveryDistrict})*
${deliveryAddress}
${deliveryNotes ? `Not: ${deliveryNotes}` : ''}

Uygulamadan "İşe Başla" butonuna basmayı unutma.

İyi yolculuklar!

biharclik.com
`.trim(),

  // Göndericiye: İş tamamlandı
  SENDER_DELIVERY_COMPLETED: (orderNumber, courierName) => `
✅ *Teslimat Tamamlandı!*

📦 *Sipariş No:* ${orderNumber}
👤 *Kurye:* ${courierName}

Paketiniz başarıyla teslim edilmiştir. Bizi tercih ettiğiniz için teşekkür ederiz! 🙏

_Yaya Kurye - Güvenli Teslimat_ 🚀
  `.trim(),

  // Göndericiye: Sipariş iptal
  SENDER_ORDER_CANCELLED: (orderNumber, reason) => `
❌ *Siparişiniz İptal Edildi*

📦 *Sipariş No:* ${orderNumber}
📝 *Sebep:* ${reason}

Herhangi bir sorunuz için bizimle iletişime geçebilirsiniz.

_Yaya Kurye - Güvenli Teslimat_
  `.trim(),
};