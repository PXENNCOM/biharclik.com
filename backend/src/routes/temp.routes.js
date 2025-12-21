const express = require('express');
const router = express.Router();
const BcryptUtil = require('../shared/utils/bcrypt.util');

// GEÇİCİ - Şifre hash oluşturucu
router.post('/generate-hash', async (req, res) => {
  try {
    const { password } = req.body;
    const hash = await BcryptUtil.hash(password);
    
    res.json({
      success: true,
      password: password,
      hash: hash
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
