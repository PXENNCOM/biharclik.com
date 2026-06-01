const db = require('../../../database/connection');
const ApiResponse = require('../../../shared/utils/response.util');
const logger = require('../../../shared/utils/logger.util');

class BolumController {
  static async getAll(req, res, next) {
    try {
      const rows = await db.query('SELECT id, ad FROM bolumler ORDER BY ad ASC');
      return ApiResponse.success(res, 'Bölümler listelendi', rows);
    } catch (error) {
      logger.error('Bolum getAll error:', error);
      next(error);
    }
  }
}

module.exports = BolumController;