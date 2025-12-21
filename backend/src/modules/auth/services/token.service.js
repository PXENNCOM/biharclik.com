const JwtUtil = require('../../../shared/utils/jwt.util');
const TokenQueries = require('../../../database/queries/token.queries');

class TokenService {
  static async generateTokenPair(user) {
    const payload = {
      id: user.id,
      email: user.email,
      phone: user.phone,
      role: user.role
    };

    const accessToken = JwtUtil.generateAccessToken(payload);
    const refreshToken = JwtUtil.generateRefreshToken(payload);

    // Refresh token'ı veritabanına kaydet
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 gün
    await TokenQueries.saveRefreshToken(user.id, refreshToken, expiresAt);

    return {
      access_token: accessToken,
      refresh_token: refreshToken
    };
  }

  static async refreshAccessToken(refreshToken) {
    // Token'ı doğrula
    const decoded = JwtUtil.verifyRefreshToken(refreshToken);

    // Veritabanında kontrol et
    const tokenRecord = await TokenQueries.findRefreshToken(refreshToken);
    if (!tokenRecord) {
      throw new Error('Geçersiz refresh token');
    }

    // Süresi dolmuş mu?
    if (new Date() > new Date(tokenRecord.expires_at)) {
      await TokenQueries.deleteRefreshToken(refreshToken);
      throw new Error('Refresh token süresi dolmuş');
    }

    // Yeni access token oluştur
    const payload = {
      id: decoded.id,
      email: decoded.email,
      phone: decoded.phone,
      role: decoded.role
    };

    const newAccessToken = JwtUtil.generateAccessToken(payload);

    return {
      access_token: newAccessToken
    };
  }

  static async revokeToken(refreshToken) {
    await TokenQueries.deleteRefreshToken(refreshToken);
  }

  static async revokeAllUserTokens(userId) {
    await TokenQueries.deleteUserTokens(userId);
  }
}

module.exports = TokenService;
