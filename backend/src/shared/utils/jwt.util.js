const jwt = require('jsonwebtoken');
const config = require('../../config/env');

class JwtUtil {
  static generateAccessToken(payload) {
    return jwt.sign(payload, config.jwt.accessSecret, {
      expiresIn: config.jwt.accessExpiry
    });
  }

  static generateRefreshToken(payload) {
    return jwt.sign(payload, config.jwt.refreshSecret, {
      expiresIn: config.jwt.refreshExpiry
    });
  }

  static verifyAccessToken(token) {
    try {
      return jwt.verify(token, config.jwt.accessSecret);
    } catch (error) {
      throw new Error('Geçersiz token');
    }
  }

  static verifyRefreshToken(token) {
    try {
      return jwt.verify(token, config.jwt.refreshSecret);
    } catch (error) {
      throw new Error('Geçersiz refresh token');
    }
  }

  static decodeToken(token) {
    return jwt.decode(token);
  }
}

module.exports = JwtUtil;
