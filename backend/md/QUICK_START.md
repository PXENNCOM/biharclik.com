# 🚀 Hızlı Başlangıç Rehberi

## 1️⃣ Projeyi Çıkart ve Bağımlılıkları Yükle

```bash
# Projeyi çıkart
tar -xzf yaya-kurye-backend.tar.gz
cd yaya-kurye-backend

# Bağımlılıkları yükle
npm install
```

## 2️⃣ Database'i Hazırla

### phpMyAdmin'i aç: `http://localhost/phpmyadmin`

### Veritabanını oluştur:

**SQL sekmesine git ve çalıştır:**

```sql
CREATE DATABASE dernek_system CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Tabloları oluştur:

1. Sol menüden `dernek_system` database'ini seç
2. SQL sekmesine git
3. `src/database/migrations/000_all_tables.sql` dosyasının içeriğini kopyala-yapıştır
4. "Çalıştır" butonuna tıkla

✅ 5 tablo oluşturulmuş olmalı:
- users
- students
- individual_senders
- corporate_senders
- refresh_tokens

## 3️⃣ Uygulamayı Başlat

```bash
npm run dev
```

✅ Terminal şunu görmeli:
```
Server is running on port 3001
Environment: development
API: http://localhost:3001/api
Database connection established successfully
```

## 4️⃣ Test Et

### Postman veya Thunder Client ile:

**Health Check:**
```http
GET http://localhost:3001/api/health
```

**Öğrenci Kayıt:**
```http
POST http://localhost:3001/api/auth/register/student
Content-Type: application/json

{
  "email": "test@university.edu.tr",
  "phone": "05551234567",
  "password": "123456",
  "password_confirm": "123456",
  "first_name": "Test",
  "last_name": "User",
  "tc_no": "12345678901",
  "birth_date": "2000-01-15",
  "iban": "TR123456789012345678901234",
  "address": "İstanbul, Türkiye",
  "university": "İstanbul Üniversitesi",
  "kvkk_accepted": true,
  "terms_accepted": true
}
```

## 🎯 Port ve Database Bilgileri

- **API Port:** 3001
- **Database:** dernek_system
- **MySQL Port (Local):** 3307
- **MySQL User:** root
- **MySQL Password:** 123456

## ⚠️ Production'a Geçerken

`.env` dosyasında şunları değiştir:

```env
NODE_ENV=production
DB_HOST=mysql
DB_PORT=3306
```

## 🐛 Sorun mu var?

1. MySQL servisinin çalıştığından emin ol
2. Port 3307'nin açık olduğunu kontrol et
3. Database adının `dernek_system` olduğunu kontrol et
4. `.env` dosyasındaki bilgilerin doğru olduğunu kontrol et

## 📚 Detaylı Dokümantasyon

Tüm endpoint'ler ve detaylı açıklamalar için `README.md` dosyasına bak.
