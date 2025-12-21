# 📦 DELIVERY MODÜLÜ - KURULUM VE TEST REHBERİ

## 🗄️ 1. Database Tablosunu Oluştur

phpMyAdmin'de `dernek_system` database'ini seç ve şu dosyayı çalıştır:

```
src/database/migrations/006_create_deliveries_table.sql
```

Veya direkt SQL'i çalıştır (tablo oluşturma SQL'i dosyada mevcut).

## ✅ 2. Kontroler

```sql
SHOW TABLES;
```

`deliveries` tablosu görünmeli.

```sql
DESCRIBE deliveries;
```

25+ kolon görünmeli (order_number, sender_user_id, pickup_address, vs.)

## 🚀 3. Backend'i Başlat

```bash
npm run dev
```

## 📚 4. API Endpoint'leri

### BASE URL
```
http://localhost:3001/api/deliveries
```

---

## 📤 GÖNDERİCİ İŞLEMLERİ

### 1. Yeni İş Oluştur
```http
POST /api/deliveries
Authorization: Bearer <gönderici_access_token>
Content-Type: application/json

{
  "pickup_address": "Kadıköy Meydanı, Rıhtım Caddesi No:5",
  "pickup_district": "Kadıköy",
  "pickup_contact_name": "Ahmet Yılmaz",
  "pickup_contact_phone": "05551234567",
  "pickup_notes": "Kapıda bekleyeceğim",
  
  "delivery_address": "Taksim Meydanı, İstiklal Caddesi No:123",
  "delivery_district": "Beyoğlu",
  "delivery_contact_name": "Mehmet Demir",
  "delivery_contact_phone": "05559876543",
  "delivery_notes": "3. kat daire 8",
  
  "package_description": "Kitap ve belgeler - A4 boyutunda zarfta",
  "package_size": "small",
  "payment_amount": 75
}
```

**Response:**
```json
{
  "success": true,
  "message": "İş başarıyla oluşturuldu",
  "data": {
    "id": 1,
    "order_number": "YYK-00001",
    "status": "pending",
    "payment_amount": "75.00",
    ...
  }
}
```

### 2. Kendi Siparişlerini Listele
```http
GET /api/deliveries/my-orders
Authorization: Bearer <gönderici_access_token>

# Filtreleme (opsiyonel):
GET /api/deliveries/my-orders?status=pending
GET /api/deliveries/my-orders?status=completed&limit=20
```

### 3. İşi İptal Et
```http
PUT /api/deliveries/:id/cancel
Authorization: Bearer <gönderici_access_token>
Content-Type: application/json

{
  "cancellation_reason": "Artık gereği kalmadı, teşekkürler"
}
```

---

## 🎓 ÖĞRENCİ İŞLEMLERİ

### 1. Müsait İşleri Listele
```http
GET /api/deliveries/available
Authorization: Bearer <öğrenci_access_token>

# Filtreleme (opsiyonel):
GET /api/deliveries/available?pickup_district=Kadıköy
GET /api/deliveries/available?min_amount=50&max_amount=100
GET /api/deliveries/available?delivery_district=Beyoğlu&limit=10
```

### 2. İşi Kabul Et
```http
POST /api/deliveries/:id/accept
Authorization: Bearer <öğrenci_access_token>
```

### 3. İşe Başla (Admin onayından sonra)
```http
PUT /api/deliveries/:id/start
Authorization: Bearer <öğrenci_access_token>
```

### 4. İşi Tamamla
```http
PUT /api/deliveries/:id/complete
Authorization: Bearer <öğrenci_access_token>
```

### 5. Kendi İşlerini Listele
```http
GET /api/deliveries/my-jobs
Authorization: Bearer <öğrenci_access_token>

# Filtreleme:
GET /api/deliveries/my-jobs?status=accepted
GET /api/deliveries/my-jobs?status=in_progress
```

---

## 👨‍💼 ADMIN İŞLEMLERİ

### 1. Tüm İşleri Listele
```http
GET /api/deliveries/admin/all
Authorization: Bearer <admin_access_token>

# Filtreleme:
GET /api/deliveries/admin/all?status=accepted
GET /api/deliveries/admin/all?payment_status=waiting
GET /api/deliveries/admin/all?status=completed&limit=50
```

### 2. İstatistikler
```http
GET /api/deliveries/admin/stats
Authorization: Bearer <admin_access_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "total_deliveries": 25,
    "pending": 5,
    "accepted": 3,
    "in_progress": 2,
    "completed": 12,
    "cancelled": 3,
    "total_completed_amount": "1250.00",
    "avg_payment": "104.17"
  }
}
```

### 3. Ödeme Durumu Güncelle (Manuel Ödeme Yönetimi)
```http
PUT /api/deliveries/:id/payment
Authorization: Bearer <admin_access_token>
Content-Type: application/json

# Gönderici ödemeyi yaptı:
{
  "payment_status": "sender_paid",
  "sender_payment_proof_url": "https://example.com/dekont1.jpg",
  "sender_paid_at": "2025-11-13T10:30:00Z",
  "admin_notes": "Gönderici WhatsApp ile dekont gönderdi. IBAN: TR123..."
}

# Öğrenciye ödeme yapıldı:
{
  "payment_status": "student_paid",
  "student_payment_proof_url": "https://example.com/dekont2.jpg",
  "student_paid_at": "2025-11-13T15:45:00Z",
  "admin_notes": "FAST ile öğrenci hesabına 75 TL gönderildi"
}

# Tüm ödeme süreci tamamlandı:
{
  "payment_status": "completed",
  "admin_notes": "İş tamamlandı, tüm ödemeler yapıldı"
}
```

---

## 🧪 TEST SENARYOSU

### Senaryo: Kadıköy → Beyoğlu Teslimat (75 TL)

**1. Gönderici kayıt olur ve login yapar**
```http
POST /api/auth/register/sender
POST /api/auth/login
```

**2. Gönderici iş oluşturur**
```http
POST /api/deliveries
```
→ Sipariş numarası: YYK-00001
→ Durum: pending
→ payment_status: waiting

**3. Öğrenci müsait işleri görür**
```http
GET /api/deliveries/available
```
→ YYK-00001'i görür (75 TL harçlık)

**4. Öğrenci işi kabul eder**
```http
POST /api/deliveries/1/accept
```
→ Durum: accepted

**5. Admin gönderiden para ister (WhatsApp)**
- Admin göndericinin telefon numarasını alır
- WhatsApp mesajı: "Sipariş: YYK-00001, IBAN: TR123..., 75 TL yatırın"
- Gönderici kendi bankacılık uygulamasından yatırır

**6. Admin ödeme aldı kaydı**
```http
PUT /api/deliveries/1/payment
{
  "payment_status": "sender_paid",
  "sender_paid_at": "2025-11-13T10:30:00Z",
  "admin_notes": "Dekont alındı"
}
```

**7. Admin öğrenciye bildirir (WhatsApp)**
- "Ödeme alındı, işe başlayabilirsin"
- Alış adresi: ...
- Teslimat adresi: ...

**8. Öğrenci işe başlar**
```http
PUT /api/deliveries/1/start
```
→ Durum: in_progress

**9. Öğrenci paketi teslim eder**
```http
PUT /api/deliveries/1/complete
```
→ Durum: completed

**10. Admin öğrenciye ödeme yapar**
- Öğrencinin IBAN'ını alır (zaten kayıttan var)
- FAST/EFT ile 75 TL gönderir
- Dekont screenshot alır

```http
PUT /api/deliveries/1/payment
{
  "payment_status": "completed",
  "student_paid_at": "2025-11-13T15:45:00Z",
  "admin_notes": "75 TL öğrenciye ödendi"
}
```

✅ İş tamamlandı!

---

## 🎯 DURUM AKIŞI

```
pending → accepted → in_progress → completed
   ↓           ↓
cancelled   cancelled
```

## 💰 ÖDEME DURUMU AKIŞI

```
waiting → sender_paid → student_paid → completed
```

---

## 📝 NOTLAR

- Harçlık: 30-200 TL arası
- Paket boyutu: small, medium, large
- İstanbul ilçeleri: 39 ilçe desteklenir
- İlk 10-20 teslimat manuel ödeme ile yönetilir
- Admin WhatsApp üzerinden gönderici ve öğrenci ile iletişim kurar

---

## 🐛 Sorun Giderme

**"Admin henüz gönderici ödemesini almadı" hatası:**
→ Admin önce `payment_status: 'sender_paid'` yapmalı

**"Bu iş artık müsait değil" hatası:**
→ Başka bir öğrenci kabul etmiş

**"Bu işe başlanamaz" hatası:**
→ İş durumu 'accepted' olmalı ve payment_status 'sender_paid' olmalı
