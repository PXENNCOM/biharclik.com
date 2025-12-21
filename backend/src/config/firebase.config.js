const admin = require('firebase-admin');
const path = require('path');
const logger = require('../shared/utils/logger.util');

try {
  const serviceAccount = require('./serviceAccountKey.json');

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });

  logger.info('Firebase Admin SDK initialized successfully');
} catch (error) {
  logger.error('Firebase initialization error:', error);
  throw new Error('Firebase yapılandırması başarısız');
}

module.exports = admin;