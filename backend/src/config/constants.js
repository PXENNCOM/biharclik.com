module.exports = {
  USER_ROLES: {
    STUDENT: 'student',
    SENDER: 'sender',
    ADMIN: 'admin'
  },
  
  SENDER_TYPES: {
    INDIVIDUAL: 'individual',
    CORPORATE: 'corporate'
  },
  
  DELIVERY_STATUS: {
    PENDING: 'pending',
    ACCEPTED: 'accepted',
    IN_PROGRESS: 'in_progress',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled'
  },
  
  PAYMENT_STATUS: {
    WAITING: 'waiting',
    RECEIVED: 'received',
    PAID_TO_STUDENT: 'paid_to_student',
    COMPLETED: 'completed'
  },
  
  PAYMENT_LIMITS: {
    MIN_AMOUNT: 100,
    MAX_AMOUNT: 999999 
  },
  
  ISTANBUL_DISTRICTS: [
    'Adalar', 'Arnavutköy', 'Ataşehir', 'Avcılar', 'Bağcılar', 
    'Bahçelievler', 'Bakırköy', 'Başakşehir', 'Bayrampaşa', 'Beşiktaş',
    'Beykoz', 'Beylikdüzü', 'Beyoğlu', 'Büyükçekmece', 'Çatalca',
    'Çekmeköy', 'Esenler', 'Esenyurt', 'Eyüpsultan', 'Fatih',
    'Gaziosmanpaşa', 'Güngören', 'Kadıköy', 'Kağıthane', 'Kartal',
    'Küçükçekmece', 'Maltepe', 'Pendik', 'Sancaktepe', 'Sarıyer',
    'Silivri', 'Sultanbeyli', 'Sultangazi', 'Şile', 'Şişli',
    'Tuzla', 'Ümraniye', 'Üsküdar', 'Zeytinburnu'
  ],
  
  FILE_TYPES: {
    STUDENT_DOCUMENT: ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'],
    MAX_SIZE: 5 * 1024 * 1024 // 5MB
  }
};
