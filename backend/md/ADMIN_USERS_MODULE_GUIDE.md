# 📚 ADMİN & USERS MODÜL REHBERİ

## 🗄️ Database Kurulumu

phpMyAdmin'de çalıştır:

```sql
-- Silinen kullanıcıları takip için tablo
```

`src/database/migrations/007_create_deleted_users_table.sql` dosyasını çalıştır.

---

## 👨‍💼 ADMİN MODÜLÜ

### BASE URL
```
http://localhost:3001/api/admin
```

**Tüm endpoint'ler admin token gerektirir:**
```
Authorization: Bearer <admin_access_token>
```

---

### 1️⃣ ÖĞRENCİ YÖNETİMİ

#### Tüm Öğrencileri Listele
```http
GET /api/admin/students

# Filtreleme:
GET /api/admin/students?admin_approved=false  # Onay bekleyenler
GET /api/admin/students?admin_approved=true   # Onaylananlar
GET /api/admin/students?is_active=true        # Aktif olanlar
GET /api/admin/students?university=İstanbul   # Üniversiteye göre
GET /api/admin/students?limit=50              # İlk 50
```

**Response:**
```json
{
  "success": true,
  "message": "Öğrenciler listelendi",
  "data": {
    "count": 10,
    "students": [
      {
        "id": 5,
        "email": "test@university.edu.tr",
        "phone": "05551234567",
        "first_name": "Berat",
        "last_name": "Test",
        "university": "Topkapı Üniversitesi",
        "admin_approved": false,
        "is_active": true,
        "total_deliveries": 5,
        "completed_deliveries": 3
      }
    ]
  }
}
```

#### Öğrenci Detayı
```http
GET /api/admin/students/:id
```

#### Öğrenciyi Onayla
```http
PUT /api/admin/students/:id/approve
```

#### Öğrenci Onayını Kaldır
```http
PUT /api/admin/students/:id/unapprove
```

---

### 2️⃣ GÖNDERİCİ YÖNETİMİ

#### Tüm Göndericileri Listele
```http
GET /api/admin/senders
GET /api/admin/senders?limit=50
```

**Response:**
```json
{
  "success": true,
  "data": {
    "count": 5,
    "senders": [
      {
        "id": 8,
        "email": "gonderici@test.com",
        "sender_type": "individual",
        "first_name": "Ahmet",
        "last_name": "Yılmaz",
        "total_orders": 10,
        "completed_orders": 8
      },
      {
        "id": 10,
        "email": "firma@test.com",
        "sender_type": "corporate",
        "company_name": "Test A.Ş.",
        "total_orders": 25,
        "completed_orders": 20
      }
    ]
  }
}
```

#### Gönderici Detayı
```http
GET /api/admin/senders/:id
```

---

### 3️⃣ KULLANICI YÖNETİMİ

#### Kullanıcıyı Aktif/Pasif Yap
```http
PUT /api/admin/users/:id/status
Content-Type: application/json

{
  "is_active": false  # veya true
}
```

#### Kullanıcıyı Sil (Soft Delete)
```http
DELETE /api/admin/users/:id
Content-Type: application/json

{
  "deletion_reason": "Kullanıcı kuralları ihlal etti, spam gönderiyor"
}
```

**Soft Delete Nasıl Çalışır:**
- Kullanıcı `is_active = FALSE` olur
- Email ve telefon `DELETED_X_email` formatına dönüşür
- `deleted_users` tablosuna kayıt düşer
- Aynı email/telefon ile tekrar kayıt olunamaz

---

### 4️⃣ İSTATİSTİKLER

#### Dashboard İstatistikleri
```http
GET /api/admin/dashboard/stats
```

**Response:**
```json
{
  "success": true,
  "data": {
    "total_students": 45,
    "approved_students": 38,
    "pending_students": 7,
    "total_senders": 120,
    "total_deliveries": 350,
    "pending_deliveries": 15,
    "active_deliveries": 8,
    "completed_deliveries": 310,
    "waiting_payments": 12,
    "sender_paid_count": 5,
    "total_completed_amount": "28500.00",
    "avg_delivery_payment": "91.94"
  }
}
```

---

## 👤 USERS MODÜLÜ (Profil & Geçmiş)

### BASE URL
```
http://localhost:3001/api/users
```

**Tüm endpoint'ler kullanıcı token gerektirir:**
```
Authorization: Bearer <user_access_token>
```

---

### 1️⃣ PROFİL İŞLEMLERİ

#### Kendi Profilimi Gör
```http
GET /api/users/profile
```

**Öğrenci Response:**
```json
{
  "success": true,
  "data": {
    "id": 5,
    "email": "test@university.edu.tr",
    "phone": "05551234567",
    "role": "student",
    "first_name": "Berat",
    "last_name": "Test",
    "tc_no": "12345678901",
    "birth_date": "2000-01-15",
    "iban": "TR123456789012345678901234",
    "address": "İstanbul, Türkiye",
    "university": "Topkapı Üniversitesi",
    "admin_approved": true
  }
}
```

#### Profilimi Güncelle
```http
PUT /api/users/profile
Content-Type: application/json

# Öğrenci için:
{
  "first_name": "Yeni",
  "last_name": "İsim",
  "address": "Yeni adres bilgisi en az 10 karakter",
  "iban": "TR999999999999999999999999",
  "university": "Başka Üniversite"
}

# Bireysel Gönderici için:
{
  "first_name": "Yeni",
  "last_name": "İsim",
  "billing_address": "Yeni fatura adresi"
}

# Kurumsal Gönderici için:
{
  "company_name": "Yeni Firma Adı A.Ş.",
  "tax_office": "Yeni Vergi Dairesi",
  "billing_address": "Yeni fatura adresi"
}
```

#### Email Güncelle
```http
PUT /api/users/email
Content-Type: application/json

{
  "email": "yeni@email.com"
}
```

**Not:** Email güncellenince `email_verified = FALSE` olur.

#### Telefon Güncelle
```http
PUT /api/users/phone
Content-Type: application/json

{
  "phone": "05559998877"
}
```

**Not:** Telefon güncellenince `phone_verified = FALSE` olur.

#### Şifre Değiştir
```http
PUT /api/users/password
Content-Type: application/json

{
  "old_password": "123456",
  "new_password": "yenisifre123",
  "new_password_confirm": "yenisifre123"
}
```

---

### 2️⃣ GEÇMİŞ / HISTORY

#### Geçmişimi Gör
```http
GET /api/users/history

# Filtreleme:
GET /api/users/history?status=completed        # Sadece tamamlananlar
GET /api/users/history?from_date=2025-01-01    # Başlangıç tarihi
GET /api/users/history?to_date=2025-12-31      # Bitiş tarihi
GET /api/users/history?limit=100               # İlk 100
```

**Öğrenci Response:**
```json
{
  "success": true,
  "message": "Geçmiş getirildi",
  "data": {
    "summary": {
      "total_jobs": 25,
      "completed_jobs": 20,
      "in_progress_jobs": 2,
      "accepted_jobs": 3,
      "total_earnings": "1850.00",
      "paid_earnings": "1500.00",
      "pending_earnings": "350.00",
      "avg_earning_per_job": "92.50"
    },
    "history": [
      {
        "id": 1,
        "order_number": "YYK-00001",
        "pickup_district": "Kadıköy",
        "delivery_district": "Beyoğlu",
        "payment_amount": "75.00",
        "status": "completed",
        "payment_status": "completed",
        "accepted_at": "2025-11-13T...",
        "completed_at": "2025-11-13T..."
      }
    ]
  }
}
```

**Gönderici Response:**
```json
{
  "success": true,
  "data": {
    "summary": {
      "total_orders": 30,
      "completed_orders": 25,
      "in_progress_orders": 2,
      "pending_orders": 1,
      "cancelled_orders": 2,
      "total_spent": "2450.00",
      "completed_payments": "2100.00",
      "avg_order_amount": "98.00"
    },
    "history": [...]
  }
}
```

---

## 🧪 TEST SENARYOLARI

### Senaryo 1: Admin Öğrenci Onaylama

**1. Admin login yap**
```http
POST /api/auth/login
{ "identifier": "admin@yayakurye.com", "password": "admin123" }
```

**2. Onay bekleyen öğrencileri listele**
```http
GET /api/admin/students?admin_approved=false
```

**3. Bir öğrenciyi onayla**
```http
PUT /api/admin/students/5/approve
```

**4. Öğrenci artık giriş yapıp iş kabul edebilir!**

---

### Senaryo 2: Öğrenci Profil Güncelleme

**1. Öğrenci login**
```http
POST /api/auth/login
```

**2. Profilimi gör**
```http
GET /api/users/profile
```

**3. IBAN güncelle**
```http
PUT /api/users/profile
{ "iban": "TR111111111111111111111111" }
```

**4. Şifre değiştir**
```http
PUT /api/users/password
{
  "old_password": "123456",
  "new_password": "yenisifre",
  "new_password_confirm": "yenisifre"
}
```

---

### Senaryo 3: Teslimat Geçmişi

**Öğrenci:**
```http
GET /api/users/history
```

→ Tüm teslimatlarını, kazancını görür

**Gönderici:**
```http
GET /api/users/history
```

→ Tüm siparişlerini, harcamasını görür

---

### Senaryo 4: Kullanıcı Silme

**1. Admin user'ı sil**
```http
DELETE /api/admin/users/5
{
  "deletion_reason": "Kullanıcı kendisi hesap kapatma istedi"
}
```

**2. Silinen kullanıcı tekrar kayıt olmaya çalışır**
```http
POST /api/auth/register/student
{ "email": "test@university.edu.tr", ... }
```

**Hata alır:**
```json
{
  "success": false,
  "message": "Bu e-posta veya telefon numarası daha önce silinmiş bir hesaba ait. Lütfen farklı bilgiler kullanın."
}
```

---

## 📊 YENİ ENDPOINT'LER ÖZET

### Admin (10 endpoint)
- `GET /api/admin/students` - Öğrenci listesi
- `GET /api/admin/students/:id` - Öğrenci detay
- `PUT /api/admin/students/:id/approve` - Onayla
- `PUT /api/admin/students/:id/unapprove` - Onayı kaldır
- `GET /api/admin/senders` - Gönderici listesi
- `GET /api/admin/senders/:id` - Gönderici detay
- `PUT /api/admin/users/:id/status` - Aktif/pasif
- `DELETE /api/admin/users/:id` - Sil
- `GET /api/admin/dashboard/stats` - İstatistikler

### Users (6 endpoint)
- `GET /api/users/profile` - Profil
- `PUT /api/users/profile` - Profil güncelle
- `PUT /api/users/email` - Email güncelle
- `PUT /api/users/phone` - Telefon güncelle
- `PUT /api/users/password` - Şifre değiştir
- `GET /api/users/history` - Geçmiş

**TOPLAM: 16 yeni endpoint!** 🎉

---

## 🔒 Güvenlik Notları

1. **Soft Delete:** Kullanıcı silinince email/telefon blacklist'e düşer
2. **Email/Phone Unique:** Silinen kullanıcının bilgileri tekrar kullanılamaz
3. **Admin Only:** Tüm admin endpoint'leri sadece admin rolü ile erişilebilir
4. **Password Hash:** Şifreler bcrypt ile hashlenip saklanır
5. **Token Auth:** Tüm işlemler JWT token ile korunur
