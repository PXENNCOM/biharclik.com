const ApiResponse = require('../utils/response.util');

const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return ApiResponse.unauthorized(res, 'Kullanıcı bilgisi bulunamadı');
    }

    if (!allowedRoles.includes(req.user.role)) {
      return ApiResponse.forbidden(res, 'Bu işlem için yetkiniz yok');
    }

    next();
  };
};

module.exports = roleMiddleware;
