const app = require('./src/app');
const config = require('./src/config/env');
const logger = require('./src/shared/utils/logger.util');
const db = require('./src/database/connection');

console.log('🚀 Starting server...');

// Database bağlantısını test et
const testDatabaseConnection = async () => {
  try {
    console.log('📊 Testing database connection...');
    const pool = db.getPool();
    await pool.query('SELECT 1');
    console.log('✅ Database connection OK');
    logger.info('Database connection established successfully');
    return true;
  } catch (error) {
    console.error('❌ Database error:', error);
    logger.error('Database connection failed:', error);
    return false;
  }
};

const startServer = async () => {
  try {
    console.log('🔍 Checking database...');
    const dbConnected = await testDatabaseConnection();
    
    if (!dbConnected) {
      logger.error('Cannot start server without database connection');
      process.exit(1);
    }

    console.log('🌐 Starting HTTP server...');
    const PORT = config.server.port;
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
      logger.info(`Server is running on port ${PORT}`);
      logger.info(`Environment: ${config.server.env}`);
      logger.info(`API: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('❌ Startup error:', error);
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

console.log('📦 Starting initialization...');
startServer();