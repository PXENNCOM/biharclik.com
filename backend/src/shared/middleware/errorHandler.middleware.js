const logger = require('../utils/logger.util');
const ApiResponse = require('../utils/response.util');

const errorHandler = (err, req, res, next) => {
  logger.error('Error:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method
  });

  if (err.name === 'ValidationError') {
    return ApiResponse.validationError(res, err.details);
  }

  if (err.name === 'JsonWebTokenError') {
    return ApiResponse.unauthorized(res, 'Geçersiz token');
  }

  if (err.name === 'TokenExpiredError') {
    return ApiResponse.unauthorized(res, 'Token süresi dolmuş');
  }

  if (err.code === 'ER_DUP_ENTRY') {
    return ApiResponse.error(res, 'Bu kayıt zaten mevcut', 409);
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Sunucu hatası';

  return ApiResponse.error(res, message, statusCode);
};

module.exports = errorHandler;
