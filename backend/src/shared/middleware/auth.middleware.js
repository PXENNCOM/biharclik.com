const JwtUtil = require('../utils/jwt.util');
const ApiResponse = require('../utils/response.util');

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return ApiResponse.unauthorized(res, 'Token bulunamadı');
    }

    const token = authHeader.substring(7);
    const decoded = JwtUtil.verifyAccessToken(token);

    req.user = decoded;
    next();
  } catch (error) {
    return ApiResponse.unauthorized(res, error.message);
  }
};

module.exports = authMiddleware;
