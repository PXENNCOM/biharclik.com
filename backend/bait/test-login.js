// test-login.js
const bcrypt = require('bcryptjs');

const plainPassword = '123456'; // girdiğin şifre
const hashFromDB = '$2b$10$azjzYDo6BUL/odY5zEMz3eSndAVkBFS2joFEvyGF4gLIugI6tDOuu'; // DB'deki password_hash kolonunun tam değeri

bcrypt.compare(plainPassword, hashFromDB, (err, result) => {
  console.log('Eşleşiyor mu:', result); // true veya false
});