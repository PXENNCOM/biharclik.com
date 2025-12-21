# ✅ YAYA KURYE BACKEND - KURULUM ÖZETİ

## 🎯 Güncellenen Ayarlar

✅ **Port:** 3001  
✅ **Database:** dernek_system  
✅ **MySQL Port:** 3307 (local), 3306 (prod)  
✅ **MySQL User:** root  
✅ **MySQL Pass:** 123456  

## 📋 Kurulum Adımları (3 Dakika)

### 1. Projeyi Çıkart
```bash
tar -xzf yaya-kurye-backend.tar.gz
cd yaya-kurye-backend
npm install
```

### 2. Database Oluştur
phpMyAdmin'de SQL çalıştır:
```sql
CREATE DATABASE dernek_system CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3. Tabloları Oluştur
phpMyAdmin'de `dernek_system` seçili iken:
- `src/database/migrations/000_all_tables.sql` dosyasını çalıştır

### 4. Başlat
```bash
npm run dev
```

### 5. Test Et
```http
GET http://localhost:3001/api/health
```

## 📁 Önemli Dosyalar

- **QUICK_START.md** - Hızlı başlangıç rehberi
- **README.md** - Detaylı dokümantasyon
- **.env** - Environment ayarları (zaten yapılandırılmış)
- **src/database/migrations/000_all_tables.sql** - Tüm tablolar tek dosyada

## 🚀 Production'a Geçiş

`.env` dosyasında değiştir:
```env
NODE_ENV=production
DB_HOST=mysql
DB_PORT=3306
```

## 📚 API Endpoints

Tüm endpoint'ler: `http://localhost:3001/api`

- `POST /api/auth/register/student` - Öğrenci kayıt
- `POST /api/auth/register/sender` - Gönderici kayıt
- `POST /api/auth/login` - Giriş
- `POST /api/auth/logout` - Çıkış
- `POST /api/auth/refresh-token` - Token yenile
- `GET /api/auth/profile` - Profil (protected)

## 🎨 Yapı

```
Modüler Mimari ✅
Service Pattern ✅
Query Pattern ✅
JWT Auth ✅
Validasyon ✅
Error Handling ✅
Logging ✅
Security ✅
```

## 💡 Sonraki Özellikler İçin Hazır

- Delivery modülü eklenebilir
- Admin panel eklenebilir
- File upload eklenebilir
- Email/SMS doğrulama eklenebilir

Her şey hazır! 🚀
