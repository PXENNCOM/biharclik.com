const mysql = require('mysql2/promise');
const config = require('../config/env');
const logger = require('../shared/utils/logger.util');

let pool = null;

const createPool = () => {
  try {
    pool = mysql.createPool(config.database);
    logger.info('MySQL connection pool created successfully');
    return pool;
  } catch (error) {
    logger.error('Error creating MySQL pool:', error);
    throw error;
  }
};

const getPool = () => {
  if (!pool) {
    return createPool();
  }
  return pool;
};

const query = async (sql, params) => {
  try {
    const connection = await getPool().getConnection();
    try {
      const [results] = await connection.query(sql, params);
      return results;
    } finally {
      connection.release();
    }
  } catch (error) {
    logger.error('Database query error:', error);
    throw error;
  }
};

const transaction = async (callback) => {
  const connection = await getPool().getConnection();
  try {
    await connection.beginTransaction();
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    logger.error('Transaction error:', error);
    throw error;
  } finally {
    connection.release();
  }
};

module.exports = {
  getPool,
  query,
  transaction
};
