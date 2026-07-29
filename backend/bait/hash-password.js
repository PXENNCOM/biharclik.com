// hash-password.js
const bcrypt = require('bcryptjs');

const password = '123456'; // ← buraya istediğin şifreyi yaz
const saltRounds = 10;

bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) { console.error('Hata:', err); return; }
  console.log('\n✅ Hash oluşturuldu:\n');
  console.log(hash);
});