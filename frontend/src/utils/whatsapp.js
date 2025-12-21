
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
  return `https://wa.me/${formattedPhone}?text=${encodedMessage}`;
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
  SENDER_COURIER_ASSIGNED: (orderNumber, courierName, amount, iban) => `
🎉 *Müjde! Kuryeniz Bulundu!*

📦 *Sipariş No:* ${orderNumber}
👤 *Kurye:* ${courierName}
💰 *Ödeme Tutarı:* ${amount} TL

📌 *Ödeme Bilgileri:*
IBAN: ${iban}
Alıcı: Yaya Kurye Sistemi

✅ Ödemenizi yaptıktan sonra lütfen bize bildirin. Onay sonrası kuryeniz yola çıkacaktır.

_Yaya Kurye - Güvenli Teslimat_ 🚀
  `.trim(),

  // Öğrenciye: Ödeme alındı
  STUDENT_PAYMENT_RECEIVED: (orderNumber, pickupDistrict, deliveryDistrict, amount) => `
✅ *Ödeme Alındı! Yola Çıkabilirsin!*

📦 *Sipariş No:* ${orderNumber}
📍 *Nereden:* ${pickupDistrict}
📍 *Nereye:* ${deliveryDistrict}
💰 *Kazancın:* ${amount} TL

🚀 *Şimdi ne yapmalısın?*
1️⃣ Uygulamaya gir
2️⃣ "İşe Başla" butonuna bas
3️⃣ Paketi al ve teslim et

İyi yolculuklar! 🎒

_Yaya Kurye - Güvenli Teslimat_
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