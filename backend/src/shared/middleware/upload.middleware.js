const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Klasörleri oluştur
const studentDocDir = './uploads/students';
const profilePhotoDir = './uploads/profile-photos';

[studentDocDir, profilePhotoDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Storage konfigürasyonu
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Field name'e göre klasör seç
    const dest = file.fieldname === 'profile_photo' ? profilePhotoDir : studentDocDir;
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const prefix = file.fieldname === 'profile_photo' ? 'profile-' : 'student-doc-';
    cb(null, prefix + uniqueSuffix + ext);
  }
});

// Dosya filtresi
const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'profile_photo') {
    // Profil fotoğrafı sadece resim
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Profil fotoğrafı sadece JPG, PNG veya WEBP olabilir'), false);
    }
  } else {
    // Öğrenci belgesi resim veya PDF
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Sadece JPG, PNG ve PDF dosyaları yüklenebilir'), false);
    }
  }
};

// Multer instance
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max
  }
});

// Error handler
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'Dosya boyutu 5MB\'dan büyük olamaz'
      });
    }
    return res.status(400).json({
      success: false,
      message: 'Dosya yükleme hatası: ' + err.message
    });
  }
  
  if (err) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
  
  next();
};

module.exports = {
  upload,
  handleMulterError
};