# 🚀 FRONTEND QUICK START

## 📦 KURULUM (3 Adım)

### 1. Projeyi Çıkart
```bash
tar -xzf yaya-kurye-frontend.tar.gz
cd yaya-kurye-frontend
```

### 2. Bağımlılıkları Yükle
```bash
npm install
```

### 3. Başlat
```bash
npm run dev
```

✅ Frontend: `http://localhost:5173`

---

## 🧪 TEST

### A) Backend Hazır mı?
```bash
# Backend çalışıyor olmalı
cd yaya-kurye-backend
npm run dev
# Port 3001'de çalışmalı
```

### B) Frontend Testi

**1. Tarayıcıda Aç**
```
http://localhost:5173
```

Login sayfasını görmelisin

**2. Öğrenci Kayıt Test**
- "Öğrenci Kayıt" linkine tıkla
- Formu doldur
- Bir PDF/JPG dosyası yükle
- "Kayıt Ol" butonuna tıkla
- ✅ "Kayıt Başarılı" sayfasını görmelisin

**3. Login Test**
- Admin ile giriş yap:
  - Email: `admin@yayakurye.com`
  - Şifre: `admin123`
- ✅ Admin dashboard'a yönlendirilmelisin

**4. Öğrenci Login**
- Kayıt ettiğin öğrenciyle giriş yap
- ⚠️ Admin onayı gerekli, onaylanmazsa hata alırsın
- Önce admin ile onaylaman lazım (Postman'den)

---

## 🎯 MEVCUT SAYFALAR

### ✅ Hazır Sayfalar
1. **Login** - `/login`
2. **Öğrenci Kayıt** - `/register/student` (belge yükleme ile)
3. **Kayıt Başarılı** - `/register/success`
4. **Öğrenci Dashboard** - `/student/dashboard`
5. **Gönderici Dashboard** - `/sender/dashboard`
6. **Admin Dashboard** - `/admin/dashboard`

### 🔜 Yapılacak Sayfalar
- Öğrenci: Müsait işler listesi
- Öğrenci: İş detayı ve kabul etme
- Gönderici: İş oluşturma formu
- Gönderici: Siparişler listesi
- Admin: Öğrenci listesi + onaylama
- Profil sayfaları
- Geçmiş sayfaları

---

## 🎨 TEKNOLOJİLER

- **React 18** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Routing
- **Axios** - API calls
- **Context API** - State management

---

## 🔐 AUTH SİSTEMİ

### Token Yönetimi
- Access token → localStorage
- Refresh token → localStorage
- Otomatik token yenileme
- 401 hatalarında auto logout

### Protected Routes
```jsx
<ProtectedRoute allowedRoles={['student']}>
  <StudentDashboard />
</ProtectedRoute>
```

Sadece öğrenci erişebilir!

---

## 🐛 SORUN GİDERME

### CORS Hatası
Backend'de CORS açık mı kontrol et:
```js
// src/app.js
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
```

### API Hatası
- Backend çalışıyor mu? (Port 3001)
- `.env` dosyasında URL doğru mu?
  ```
  VITE_API_URL=http://localhost:3001/api
  ```

### Dosya Yükleme Hatası
- Dosya 5MB'dan küçük mü?
- JPG/PNG/PDF mi?
- Backend'de multer çalışıyor mu?

### Sayfa Boş
- Browser Console'u aç (F12)
- Hataları kontrol et
- Network sekmesinde request'leri gör

---

## 📸 EKRAN GÖRÜNTÜLERİ

### Login Sayfası
- Modern gradient background
- Email/telefon ile giriş
- Öğrenci/Gönderici kayıt linkleri

### Öğrenci Kayıt
- Multi-step form
- Belge yükleme (drag & drop)
- Form validation
- Success feedback

### Dashboard
- İstatistik kartları
- Liste görünümü
- Responsive design

---

## 🎯 SONRAKİ ADIMLAR

1. **Backend'i Başlat** (Port 3001)
2. **Frontend'i Başlat** (Port 5173)
3. **Test Et:**
   - Öğrenci kayıt yap
   - Login yap
   - Dashboard'u gör

4. **Sonraki Özellikler:**
   - Öğrenci: İş listesi yapacağız
   - Gönderici: İş oluşturma
   - Admin: Onaylama sistemi

---

## 💪 HAZIRSAN BAŞLA!

```bash
# Terminal 1 - Backend
cd yaya-kurye-backend
npm run dev

# Terminal 2 - Frontend
cd yaya-kurye-frontend
npm run dev

# Tarayıcı
http://localhost:5173
```

**Frontend %30 hazır!** 🎉

Login, Register ve temel dashboard'lar çalışıyor.
Şimdi özellik eklemeye başlayabiliriz!
