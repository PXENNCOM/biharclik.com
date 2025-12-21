const app = require('./src/app');
const config = require('./src/config/env');
const logger = require('./src/shared/utils/logger.util');
const db = require('./src/database/connection');

// Database bağlantısını test et
const testDatabaseConnection = async () => {
  try {
    const pool = db.getPool();
    await pool.query('SELECT 1');
    logger.info('Database connection established successfully');
    return true;
  } catch (error) {
    logger.error('Database connection failed:', error);
    return false;
  }
};

// Sunucuyu başlat
const startServer = async () => {
  try {
    // Database bağlantısını test et
    const dbConnected = await testDatabaseConnection();
    if (!dbConnected) {
      logger.error('Cannot start server without database connection');
      process.exit(1);
    }

    // Sunucuyu dinlemeye başla
    const PORT = config.server.port;
    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
      logger.info(`Environment: ${config.server.env}`);
      logger.info(`API: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  const pool = db.getPool();
  await pool.end();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT signal received: closing HTTP server');
  const pool = db.getPool();
  await pool.end();
  process.exit(0);
});

// Sunucuyu başlat
startServer();
