# Yaya Kurye Platformu - Backend API

İstanbul genelinde faaliyet gösterecek, üniversite öğrencilerini kurye olarak kullanan, tamamen toplu taşıma ve yaya tabanlı bir kurye platformunun backend API'si.

## 🚀 Özellikler

- ✅ JWT tabanlı kimlik doğrulama
- ✅ Öğrenci ve Gönderici (Bireysel/Kurumsal) kayıt sistemi
- ✅ Rol tabanlı yetkilendirme (Student, Sender, Admin)
- ✅ MySQL veritabanı ile güvenli veri saklama
- ✅ Token yenileme (Refresh Token)
- ✅ Input validasyonu (Joi)
- ✅ Rate limiting
- ✅ Security headers (Helmet)
- ✅ CORS desteği
- ✅ Detaylı logging (Winston)
- ✅ Modüler ve ölçeklenebilir mimari

## 📋 Gereksinimler

- Node.js v16 veya üzeri
- MySQL 5.7 veya üzeri
- phpMyAdmin (opsiyonel, veritabanı yönetimi için)

## 🛠️ Kurulum

### 1. Projeyi Klonlayın

```bash
git clone <repository-url>
cd yaya-kurye-backend
```

### 2. Bağımlılıkları Yükleyin

```bash
npm install
```

### 3. Veritabanını Oluşturun

MySQL'e bağlanın ve veritabanını oluşturun:

```sql
CREATE DATABASE dernek_system CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 4. Migration Dosyalarını Çalıştırın

**EN KOLAY YOL:** phpMyAdmin'den `src/database/migrations/000_all_tables.sql` dosyasını çalıştırın (tüm tabloları tek seferde oluşturur)

**VEYA** phpMyAdmin'den veya MySQL CLI'dan sırasıyla şu dosyaları çalıştırın:

```
src/database/migrations/001_create_users_table.sql
src/database/migrations/002_create_students_table.sql
src/database/migrations/003_create_individual_senders_table.sql
src/database/migrations/004_create_corporate_senders_table.sql
src/database/migrations/005_create_refresh_tokens_table.sql
```

### 5. Environment Variables

`.env` dosyasını düzenleyin ve kendi bilgilerinizi girin:

```env
# Server
PORT=3001

# Database (Local)
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=123456
DB_NAME=dernek_system
DB_PORT=3307

# Database (Production)
# DB_HOST=mysql
# DB_PORT=3306

# JWT Secrets
JWT_ACCESS_SECRET=your-super-secret-access-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key
```

### 6. Uygulamayı Başlatın

**Development:**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

API şu adreste çalışacak: `http://localhost:3001`

## 📚 API Endpoints

### Auth Endpoints

#### Öğrenci Kayıt
```http
POST /api/auth/register/student
Content-Type: application/json

{
  "email": "student@university.edu.tr",
  "phone": "05551234567",
  "password": "123456",
  "password_confirm": "123456",
  "first_name": "Ahmet",
  "last_name": "Yılmaz",
  "tc_no": "12345678901",
  "birth_date": "2000-01-15",
  "iban": "TR123456789012345678901234",
  "address": "İstanbul, Türkiye",
  "university": "İstanbul Üniversitesi",
  "kvkk_accepted": true,
  "terms_accepted": true
}
```

#### Gönderici Kayıt (Bireysel)
```http
POST /api/auth/register/sender
Content-Type: application/json

{
  "email": "sender@example.com",
  "phone": "05559876543",
  "password": "123456",
  "password_confirm": "123456",
  "account_type": "individual",
  "first_name": "Mehmet",
  "last_name": "Demir",
  "tc_no": "98765432109",
  "billing_address": "İstanbul, Türkiye",
  "kvkk_accepted": true,
  "terms_accepted": true
}
```

#### Gönderici Kayıt (Kurumsal)
```http
POST /api/auth/register/sender
Content-Type: application/json

{
  "email": "company@example.com",
  "phone": "05551112233",
  "password": "123456",
  "password_confirm": "123456",
  "account_type": "corporate",
  "company_name": "Örnek A.Ş.",
  "tax_office": "Kadıköy",
  "tax_number": "1234567890",
  "billing_address": "İstanbul, Türkiye",
  "kvkk_accepted": true,
  "terms_accepted": true
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "identifier": "student@university.edu.tr", // veya telefon
  "password": "123456"
}

Response:
{
  "success": true,
  "message": "Giriş başarılı",
  "data": {
    "user": {
      "id": 1,
      "email": "student@university.edu.tr",
      "phone": "05551234567",
      "role": "student"
    },
    "access_token": "eyJhbGc...",
    "refresh_token": "eyJhbGc..."
  }
}
```

#### Token Yenile
```http
POST /api/auth/refresh-token
Content-Type: application/json

{
  "refresh_token": "eyJhbGc..."
}
```

#### Logout
```http
POST /api/auth/logout
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "refresh_token": "eyJhbGc..."
}
```

#### Profil Bilgisi (Protected)
```http
GET /api/auth/profile
Authorization: Bearer <access_token>
```

### Health Check
```http
GET /api/health
```

## 🏗️ Proje Yapısı

```
yaya-kurye-backend/
├── src/
│   ├── config/              # Konfigürasyon dosyaları
│   ├── modules/             # Feature-based modüller
│   │   └── auth/           # Auth modülü
│   ├── shared/             # Ortak middleware ve utility'ler
│   ├── database/           # Database bağlantı ve query'ler
│   └── routes/             # Ana route aggregator
├── uploads/                # Dosya yüklemeleri
├── logs/                   # Log dosyaları
├── .env                    # Environment variables
└── server.js              # Uygulama giriş noktası
```

## 🔒 Güvenlik

- Şifreler bcrypt ile hashlenir (10 salt rounds)
- JWT token'lar kullanılır (Access + Refresh)
- Rate limiting aktif (15 dakikada 100 istek)
- Helmet ile güvenlik header'ları
- CORS koruması
- Input validasyonu (Joi)

## 📝 Önemli Notlar

1. **Öğrenci Onayı**: Öğrenciler kayıt olduğunda `admin_approved = FALSE` olur. Admin manuel onay vermeden giriş yapamazlar.

2. **Token Yönetimi**: 
   - Access Token: 15 dakika
   - Refresh Token: 7 gün
   - Refresh token'lar veritabanında saklanır

3. **Doğrulama**: İlk fazda email/telefon doğrulaması devre dışı. Sonradan eklenecek.

## 🚧 Gelecek Özellikler

- [ ] Email doğrulama (Nodemailer)
- [ ] SMS doğrulama (Netgsm/İleti Merkezi)
- [ ] Teslimat modülü
- [ ] Manuel ödeme yönetimi (Admin panel)
- [ ] Öğrenci belge yükleme
- [ ] Bildirim sistemi

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add some amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📄 Lisans

Bu proje özel mülkiyettir. Tüm hakları saklıdır.
