class ApiResponse {
  static success(res, message, data = null, statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data
    });
  }

  static error(res, message, statusCode = 500, errors = null) {
    return res.status(statusCode).json({
      success: false,
      message,
      errors
    });
  }

  static validationError(res, errors) {
    return res.status(400).json({
      success: false,
      message: 'Doğrulama hatası',
      errors
    });
  }

  static unauthorized(res, message = 'Yetkisiz erişim') {
    return res.status(401).json({
      success: false,
      message
    });
  }

  static forbidden(res, message = 'Bu işlem için yetkiniz yok') {
    return res.status(403).json({
      success: false,
      message
    });
  }

  static notFound(res, message = 'Kayıt bulunamadı') {
    return res.status(404).json({
      success: false,
      message
    });
  }
}

module.exports = ApiResponse;
