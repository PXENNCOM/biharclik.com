# 📄 ÖĞRENCİ BELGE YÜKLEME REHBERİ

## 🎯 YENİ ÖZELLİKLER

✅ Öğrenci kaydı sırasında belge yükleme zorunlu  
✅ Bölüm bilgisi zorunlu  
✅ Dosya validasyonu (JPG, PNG, PDF - Max 5MB)  
✅ Güvenli dosya adlandırma  
✅ Hata durumunda dosya otomatik siliniyor  

---

## 🗄️ 1. DATABASE GÜNCELLEMESI

phpMyAdmin'de çalıştır:

```sql
ALTER TABLE students 
ADD COLUMN department VARCHAR(255) NULL COMMENT 'Öğrencinin bölümü' AFTER university;

UPDATE students SET department = 'Belirtilmemiş' WHERE department IS NULL;

ALTER TABLE students 
MODIFY COLUMN department VARCHAR(255) NOT NULL;
```

**Kontrol:**
```sql
DESCRIBE students;
```

`department` kolonunu görmelisin.

---

## 📝 2. ÖĞRENCİ KAYIT (Postman)

### ⚠️ ÖNEMLİ: Content-Type Değişti!

Artık `multipart/form-data` kullanmalısın (JSON değil!)

### Postman'de Ayarlar:

**1. Method:** POST  
**2. URL:** `http://localhost:3001/api/auth/register/student`  
**3. Body sekmesi → form-data seç**

### Form Fields:

| KEY (Text/File) | VALUE |
|-----------------|-------|
| email (Text) | `ogrenci@university.edu.tr` |
| phone (Text) | `05551234567` |
| password (Text) | `123456` |
| password_confirm (Text) | `123456` |
| first_name (Text) | `Ahmet` |
| last_name (Text) | `Yılmaz` |
| tc_no (Text) | `12345678901` |
| birth_date (Text) | `2000-01-15` |
| iban (Text) | `TR123456789012345678901234` |
| address (Text) | `İstanbul, Kadıköy` |
| university (Text) | `İstanbul Üniversitesi` |
| **department** (Text) | **`Bilgisayar Mühendisliği`** ← YENİ! |
| kvkk_accepted (Text) | `true` |
| terms_accepted (Text) | `true` |
| **student_document** (File) | **[Dosya Seç]** ← YENİ! |

### student_document Nasıl Eklenir:

1. KEY alanına `student_document` yaz
2. Sağ taraftaki dropdown'dan **File** seç (Text değil!)
3. "Select Files" butonuna tıkla
4. JPG, PNG veya PDF dosyası seç

---

## ✅ BAŞARILI RESPONSE

```json
{
  "success": true,
  "message": "Kayıt başarılı! Hesabınız admin onayı sonrası aktif olacak.",
  "data": {
    "user": {
      "id": 12,
      "email": "ogrenci@university.edu.tr",
      "phone": "05551234567",
      "role": "student"
    },
    "access_token": "eyJhbGc...",
    "refresh_token": "eyJhbGc..."
  }
}
```

---

## ❌ OLASI HATALAR

### 1. Dosya Yüklenmedi
```json
{
  "success": false,
  "message": "Öğrenci belgesi zorunludur"
}
```
**Çözüm:** `student_document` alanını File olarak ekle

### 2. Yanlış Dosya Tipi
```json
{
  "success": false,
  "message": "Sadece JPG, PNG ve PDF dosyaları yüklenebilir"
}
```
**Çözüm:** JPG, PNG veya PDF dosyası yükle

### 3. Dosya Çok Büyük
```json
{
  "success": false,
  "message": "Dosya boyutu 5MB'dan büyük olamaz"
}
```
**Çözüm:** 5MB'dan küçük dosya yükle

### 4. Bölüm Eksik
```json
{
  "success": false,
  "message": "Doğrulama hatası",
  "errors": [
    {
      "field": "department",
      "message": "Bölüm bilgisi zorunludur"
    }
  ]
}
```
**Çözüm:** `department` alanını ekle

---

## 🖼️ 3. YÜKLENEN DOSYAYI GÖRÜNTÜLEME

### Dosya Yolu:
```
/uploads/students/student-doc-1731511234567-123456789.jpg
```

### Tarayıcıda Açma:
```
http://localhost:3001/uploads/students/student-doc-1731511234567-123456789.jpg
```

### Admin Öğrenci Detayında:
```http
GET /api/admin/students/12
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 12,
    "first_name": "Ahmet",
    "last_name": "Yılmaz",
    "university": "İstanbul Üniversitesi",
    "department": "Bilgisayar Mühendisliği",
    "student_document_url": "/uploads/students/student-doc-1731511234567-123456789.jpg",
    "admin_approved": false
  }
}
```

Admin şu URL'den belgeyi görebilir:
```
http://localhost:3001/uploads/students/student-doc-1731511234567-123456789.jpg
```

---

## 📋 4. CURL ÖRNEĞİ (Terminal)

```bash
curl -X POST http://localhost:3001/api/auth/register/student \
  -F "email=ogrenci@test.com" \
  -F "phone=05559998877" \
  -F "password=123456" \
  -F "password_confirm=123456" \
  -F "first_name=Test" \
  -F "last_name=Öğrenci" \
  -F "tc_no=99999999999" \
  -F "birth_date=2000-01-01" \
  -F "iban=TR999999999999999999999999" \
  -F "address=İstanbul Test Adresi" \
  -F "university=Test Üniversitesi" \
  -F "department=Yazılım Mühendisliği" \
  -F "kvkk_accepted=true" \
  -F "terms_accepted=true" \
  -F "student_document=@/path/to/ogrenci-belgesi.pdf"
```

---

## 🔒 5. GÜVENLİK ÖZELLİKLERİ

✅ **Dosya Tipi Kontrolü:** Sadece JPG, PNG, PDF  
✅ **Boyut Limiti:** Max 5MB  
✅ **Güvenli Adlandırma:** Timestamp + random sayı  
✅ **Hata Durumunda Temizlik:** Upload başarısızsa dosya silinir  
✅ **Ayrı Klasör:** Her öğrenci belgesi `/uploads/students/` altında  

---

## 📂 6. DOSYA YAPISI

```
yaya-kurye-backend/
├── uploads/
│   └── students/
│       ├── student-doc-1731511234567-123456789.jpg
│       ├── student-doc-1731511234567-987654321.pdf
│       └── student-doc-1731511234567-456789123.png
```

---

## 🧪 7. TEST SENARYOSU

### Senaryo: Yeni Öğrenci Kaydı

**1. Postman'de form-data ile kayıt ol**
- Tüm alanları doldur
- Bölüm ekle
- Belge yükle

**2. Admin login yap**
```http
POST /api/auth/login
{"identifier": "admin@yayakurye.com", "password": "admin123"}
```

**3. Öğrenciyi listele**
```http
GET /api/admin/students?admin_approved=false
```

**4. Öğrenci detayını gör**
```http
GET /api/admin/students/12
```

**5. Belgeyi tarayıcıda görüntüle**
```
http://localhost:3001/uploads/students/student-doc-xxxxx.jpg
```

**6. Öğrenciyi onayla**
```http
PUT /api/admin/students/12/approve
```

✅ **Tamamlandı!** Öğrenci artık giriş yapıp iş kabul edebilir.

---

## 🎯 ÖZET

**Değişiklikler:**
- ✅ `department` kolonu eklendi (zorunlu)
- ✅ `student_document` dosya yükleme (zorunlu)
- ✅ Multer middleware (dosya yükleme)
- ✅ Form-data desteği
- ✅ Dosya validasyonu
- ✅ Static file serving

**Yeni Zorunlu Alanlar:**
1. `university` (vardı)
2. `department` (yeni!)
3. `student_document` (yeni! - dosya)

**Eski kayıtlar için:**
Mevcut öğrencilere `department = 'Belirtilmemiş'` atandı.
