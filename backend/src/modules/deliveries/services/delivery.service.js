const DeliveryQueries = require('../../../database/queries/delivery.queries');
const { USER_ROLES } = require('../../../config/constants');


class DeliveryService {
  // YENİ İŞ OLUŞTUR (Sadece Gönderici)
  static async createDelivery(userId, data) {
    // Sipariş numarası oluştur
    const orderNumber = await DeliveryQueries.generateOrderNumber();

    const deliveryData = {
      order_number: orderNumber,
      sender_user_id: userId,
      ...data
    };

    const deliveryId = await DeliveryQueries.createDelivery(deliveryData);
    const delivery = await DeliveryQueries.findById(deliveryId);

    return delivery;
  }

  // MÜSAİT İŞLER (Sadece Öğrenci)
  static async getAvailableJobs(filters) {
    return await DeliveryQueries.findAvailableJobs(filters);
  }

  // GÖNDERİCİNİN SİPARİŞLERİ
  static async getMySenderOrders(userId, filters) {
    return await DeliveryQueries.findBySenderId(userId, filters);
  }

  // ÖĞRENCİNİN İŞLERİ
  static async getMyStudentJobs(userId, filters) {
    return await DeliveryQueries.findByStudentId(userId, filters);
  }

  // İŞ DETAYI
  static async getDeliveryById(deliveryId, userId, userRole) {
    const delivery = await DeliveryQueries.findById(deliveryId);

    if (!delivery) {
      throw new Error('İş bulunamadı');
    }

    // Yetki kontrolü
    if (userRole === USER_ROLES.SENDER && delivery.sender_user_id !== userId) {
      throw new Error('Bu işi görme yetkiniz yok');
    }

    if (userRole === USER_ROLES.STUDENT && delivery.student_user_id !== userId && delivery.status !== 'pending') {
      throw new Error('Bu işi görme yetkiniz yok');
    }

    return delivery;
  }

// İŞİ KABUL ET (Sadece Öğrenci)
static async acceptJob(deliveryId, studentId) {
  // 1. İşi kontrol et
  const delivery = await DeliveryQueries.findById(deliveryId);

  if (!delivery) {
    throw new Error('İş bulunamadı');
  }

  if (delivery.status !== 'pending') {
    throw new Error('Bu iş zaten alınmış');
  }

  // 2. ⭐ YENİ: Öğrencinin aktif işi var mı kontrol et
  const activeJobs = await DeliveryQueries.findByStudentId(studentId, {
    status: ['accepted', 'in_progress']
  });

  if (activeJobs && activeJobs.length > 0) {
    throw new Error(
      `Zaten aktif bir işiniz var (${activeJobs[0].order_number}). Önce mevcut işi tamamlayın.`
    );
  }

  // 3. İşi kabul et
  const success = await DeliveryQueries.acceptJob(deliveryId, studentId);

  if (!success) {
    throw new Error('İş kabul edilemedi');
  }

  return await DeliveryQueries.findById(deliveryId);
}

  // İŞE BAŞLA (Sadece Öğrenci)
  static async startJob(deliveryId, studentId) {
    const delivery = await DeliveryQueries.findById(deliveryId);

    if (!delivery) {
      throw new Error('İş bulunamadı');
    }

    if (delivery.student_user_id !== studentId) {
      throw new Error('Bu iş size ait değil');
    }

    if (delivery.status !== 'accepted') {
      throw new Error('Bu işe başlanamaz. Önce kabul edilmeli.');
    }

    // Admin ödemeyi aldı mı kontrol et
    if (delivery.payment_status !== 'sender_paid') {
      throw new Error('Admin henüz gönderici ödemesini almadı. Lütfen bekleyin.');
    }

    const success = await DeliveryQueries.startJob(deliveryId, studentId);

    if (!success) {
      throw new Error('İşe başlanamadı');
    }

    return await DeliveryQueries.findById(deliveryId);
  }

  // İŞİ TAMAMLA (Sadece Öğrenci)
  static async completeJob(deliveryId, studentId) {
    const delivery = await DeliveryQueries.findById(deliveryId);

    if (!delivery) {
      throw new Error('İş bulunamadı');
    }

    if (delivery.student_user_id !== studentId) {
      throw new Error('Bu iş size ait değil');
    }

    if (delivery.status !== 'in_progress') {
      throw new Error('Bu iş tamamlanamaz. İş devam ediyor olmalı.');
    }

    const success = await DeliveryQueries.completeJob(deliveryId, studentId);

    if (!success) {
      throw new Error('İş tamamlanamadı');
    }

    return await DeliveryQueries.findById(deliveryId);
  }

  // İŞİ İPTAL ET (Sadece Gönderici)
  static async cancelJob(deliveryId, userId, reason) {
    const delivery = await DeliveryQueries.findById(deliveryId);

    if (!delivery) {
      throw new Error('İş bulunamadı');
    }

    if (delivery.sender_user_id !== userId) {
      throw new Error('Bu işi iptal etme yetkiniz yok');
    }

    if (!['pending', 'accepted'].includes(delivery.status)) {
      throw new Error('Bu iş iptal edilemez. Sadece bekleyen veya kabul edilmiş işler iptal edilebilir.');
    }

    const success = await DeliveryQueries.cancelJob(deliveryId, userId, reason);

    if (!success) {
      throw new Error('İş iptal edilemedi');
    }

    return await DeliveryQueries.findById(deliveryId);
  }

  // ÖDEME DURUMU GÜNCELLE (Sadece Admin)
  static async updatePaymentStatus(deliveryId, updates) {
    const delivery = await DeliveryQueries.findById(deliveryId);

    if (!delivery) {
      throw new Error('İş bulunamadı');
    }

    await DeliveryQueries.updatePaymentStatus(deliveryId, updates);
    return await DeliveryQueries.findById(deliveryId);
  }

  // TÜM İŞLER (Sadece Admin)
  static async getAllDeliveries(filters) {
    return await DeliveryQueries.findAll(filters);
  }

  // İSTATİSTİKLER (Sadece Admin)
  static async getStats() {
    return await DeliveryQueries.getStats();
  }
}

module.exports = DeliveryService;
