import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/authService';
import { PhoneVerificationModal } from '../../components/common/PhoneVerificationModal';

// ✨ BoxIcons
import { 
  BiUser, 
  BiIdCard, 
  BiCalendar, 
  BiEnvelope, 
  BiPhone, 
  BiLockAlt, 
  BiBuilding, 
  BiBook, 
  BiCloudUpload, 
  BiCreditCard, 
  BiMap, 
  BiCheckCircle,
  BiRightArrowAlt, 
  BiErrorCircle, 
  BiLoaderAlt,
  BiWalk, // Öğrenci vurgusu için
} from 'react-icons/bi';

// 🖼️ Görseller
import LogoImage from '../../assets/yellow_logo.png'; 
import HeroImage from '../../assets/login-hero.png'; 

export const StudentRegisterPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: '',
    password_confirm: '',
    first_name: '',
    last_name: '',
    tc_no: '',
    birth_date: '',
    iban: '',
    address: '',
    university: '',
    department: '',
    kvkk_accepted: false,
    terms_accepted: false,
  });
  const [studentDocument, setStudentDocument] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState(null); // ← YENİ
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Telefon doğrulama state'leri
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [showPhoneModal, setShowPhoneModal] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Dosya boyutu 5MB\'dan büyük olamaz');
        e.target.value = '';
        return;
      }
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        setError('Sadece JPG, PNG ve PDF dosyaları yüklenebilir');
        e.target.value = '';
        return;
      }
      setStudentDocument(file);
      setError('');
    }
  };

  const handleProfilePhotoChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    if (file.size > 5 * 1024 * 1024) {
      setError('Dosya boyutu 5MB\'dan büyük olamaz');
      e.target.value = '';
      return;
    }
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Sadece JPG, PNG ve WEBP dosyaları yüklenebilir');
      e.target.value = '';
      return;
    }
    setProfilePhoto(file);
    setError('');
  }
};

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');

  if (!phoneVerified) {
    setError('Lütfen telefon numaranızı doğrulayın');
    return;
  }

  if (formData.password !== formData.password_confirm) {
    setError('Şifreler eşleşmiyor');
    return;
  }

  if (!studentDocument) {
    setError('Öğrenci belgesi zorunludur');
    return;
  }

  if (!profilePhoto) { // ← YENİ
    setError('Profil fotoğrafı zorunludur');
    return;
  }

  if (!formData.kvkk_accepted || !formData.terms_accepted) {
    setError('KVKK ve kullanım koşullarını kabul etmelisiniz');
    return;
  }

  setLoading(true);

  try {
    const data = new FormData();
    Object.keys(formData).forEach(key => {
      data.append(key, formData[key]);
    });
    data.append('student_document', studentDocument);
    data.append('profile_photo', profilePhoto); // ← YENİ

    const response = await authService.registerStudent(data);
      const { user, access_token, refresh_token } = response.data;
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);

      navigate('/register/success', { 
        state: { message: 'Kayıt başarılı! Yönetici onayı sonrası giriş yapabilirsiniz.' }
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Kayıt başarısız');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white font-sans text-gray-900">
      
      {/* --- SOL TARAF: GÖRSEL & MARKA --- */}
      <div className="lg:w-5/12 bg-gray-900 text-white flex flex-col relative overflow-hidden min-h-[200px] lg:min-h-screen lg:fixed lg:left-0 lg:top-0 lg:h-full z-10">
        
        {/* Görsel ve Karartma */}
        <img 
          src={HeroImage} 
          alt="Öğrenci Kurye" 
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
        <div className="absolute inset-0 bg-gray-900/85 z-10"></div>

        {/* Logo Ortalanmış */}
        <div className="relative z-20 flex-1 flex items-center justify-center p-12">
          <img 
            src={LogoImage} 
            alt="Biharçlık Logo" 
            className="w-40 h-auto object-contain drop-shadow-2xl"
          />
        </div>

        {/* Footer */}
       <div className="relative z-20 text-sm text-gray-400 font-medium text-center pb-8">
          © 2025 Biharçlık. Tüm hakları saklıdır.
        </div>
      </div>

      {/* --- SAĞ TARAF: KAYIT FORMU --- */}
      <div className="lg:w-7/12 lg:ml-[41.666%] w-full bg-white min-h-screen flex items-center justify-center py-12 px-6 sm:px-12">
        <div className="w-full max-w-2xl">
            
            {/* Mobil Header */}
            <div className="lg:hidden text-center mb-8">
                 <img src={LogoImage} alt="Biharçlık Logo" className="h-10 w-auto mx-auto mb-4" />
            </div>

            <div className="mb-10 text-center lg:text-left">
                <h2 className="text-3xl font-bold text-gray-900 mb-2 font-heading">Öğrenci Hesabı Oluştur</h2>
                <p className="text-gray-500 font-medium">
                    Formu doldur, hesabın onaylansın ve hemen iş almaya başla.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                 {error && (
                    <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-4 rounded-xl text-sm font-bold flex items-center gap-2 animate-pulse">
                        <BiErrorCircle size={24} />
                        {error}
                    </div>
                )}

                <section>
    
    <div className="group">
        <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Profil Fotoğrafın</label>
        <div className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer group-hover:border-yellow-400 ${profilePhoto ? 'border-green-400 bg-green-50' : 'border-gray-300 bg-white hover:bg-gray-50'}`}>
             <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleProfilePhotoChange}
                className="hidden"
                id="profile_photo"
                required
            />
            <label htmlFor="profile_photo" className="cursor-pointer w-full h-full block">
                {profilePhoto ? (
                    <div className="flex flex-col items-center text-green-700">
                        <BiCheckCircle size={32} className="mb-2" />
                        <span className="font-bold text-sm">{profilePhoto.name}</span>
                        <span className="text-xs opacity-75 mt-1">Fotoğraf yüklendi</span>
                    </div>
                ) : (
                     <div className="flex flex-col items-center text-gray-400 group-hover:text-yellow-600 transition-colors">
                        <BiUser size={32} className="mb-2" />
                        <span className="font-bold text-sm text-gray-700 group-hover:text-yellow-700">Profil Fotoğrafı Yükle</span>
                        <span className="text-xs text-gray-400 mt-1">JPG, PNG veya WEBP (Max 5MB)</span>
                    </div>
                )}
            </label>
        </div>
    </div>
</section>

                {/* 1. KİŞİSEL BİLGİLER */}
                <section>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">
                        Kişisel Bilgiler
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <InputGroup icon={<BiUser />} label="Ad" name="first_name" value={formData.first_name} onChange={handleChange} placeholder="Adınız" />
                        <InputGroup icon={<BiUser />} label="Soyad" name="last_name" value={formData.last_name} onChange={handleChange} placeholder="Soyadınız" />
                        <InputGroup icon={<BiIdCard />} label="TC Kimlik No" name="tc_no" value={formData.tc_no} onChange={handleChange} maxLength="11" placeholder="11 Haneli TC" />
                        <InputGroup icon={<BiCalendar />} label="Doğum Tarihi" name="birth_date" type="date" value={formData.birth_date} onChange={handleChange} />
                    </div>
                </section>

                {/* 2. İLETİŞİM & GÜVENLİK */}
                <section>
                     <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">
                        İletişim & Güvenlik
                    </h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <InputGroup icon={<BiEnvelope />} label="E-posta (Edu)" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="ornek@uni.edu.tr" />
                        <InputGroup icon={<BiPhone />} label="Telefon" name="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="0555..." />
                        
                        {/* TELEFON DOĞRULAMA BUTONU */}
                        <div className="md:col-span-2">
                          {phoneVerified ? (
                            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl flex items-center gap-2 text-sm font-bold">
                              <BiCheckCircle size={20} />
                              Telefon numarası doğrulandı.
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                if (!formData.phone || formData.phone.length < 10) {
                                  setError('Lütfen geçerli bir telefon numarası girin');
                                  return;
                                }
                                setError('');
                                setShowPhoneModal(true);
                              }}
                              className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold py-3 rounded-xl border border-blue-200 transition flex items-center justify-center gap-2 text-sm"
                            >
                              <BiPhone size={18} />
                              Telefonu Doğrula
                            </button>
                          )}
                        </div>

                        <InputGroup icon={<BiLockAlt />} label="Şifre" name="password" type="password" value={formData.password} onChange={handleChange} placeholder="En az 6 karakter" />
                        <InputGroup icon={<BiCheckCircle />} label="Şifre Tekrar" name="password_confirm" type="password" value={formData.password_confirm} onChange={handleChange} placeholder="Şifrenizi doğrulayın" />
                     </div>
                </section>

                

                {/* 3. EĞİTİM & BELGE */}
                <section>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">
                        Eğitim Bilgileri
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                        <InputGroup icon={<BiBuilding />} label="Üniversite" name="university" value={formData.university} onChange={handleChange} placeholder="Okuduğunuz üniversite" />
                        <InputGroup icon={<BiBook />} label="Bölüm" name="department" value={formData.department} onChange={handleChange} placeholder="Bölümünüz" />
                    </div>
                    
                    {/* Dosya Yükleme Alanı */}
                    <div className="group">
                        <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Öğrenci Belgesi</label>
                        <div className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer group-hover:border-yellow-400 ${studentDocument ? 'border-green-400 bg-green-50' : 'border-gray-300 bg-white hover:bg-gray-50'}`}>
                             <input
                                type="file"
                                accept="image/jpeg,image/jpg,image/png,application/pdf"
                                onChange={handleFileChange}
                                className="hidden"
                                id="student_document"
                                required
                            />
                            <label htmlFor="student_document" className="cursor-pointer w-full h-full block">
                                {studentDocument ? (
                                    <div className="flex flex-col items-center text-green-700">
                                        <BiCheckCircle size={32} className="mb-2" />
                                        <span className="font-bold text-sm">{studentDocument.name}</span>
                                        <span className="text-xs opacity-75 mt-1">Dosya yüklendi</span>
                                    </div>
                                ) : (
                                     <div className="flex flex-col items-center text-gray-400 group-hover:text-yellow-600 transition-colors">
                                        <BiCloudUpload size={32} className="mb-2" />
                                        <span className="font-bold text-sm text-gray-700 group-hover:text-yellow-700">Belge Yüklemek İçin Tıkla</span>
                                        <span className="text-xs text-gray-400 mt-1">JPG, PNG veya PDF (Max 5MB)</span>
                                    </div>
                                )}
                            </label>
                        </div>
                    </div>
                </section>

                {/* 4. ÖDEME & ADRES */}
                <section>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">
                        Ödeme & Adres
                    </h3>
                    <div className="space-y-5">
                        <InputGroup icon={<BiCreditCard />} label="IBAN" name="iban" value={formData.iban} onChange={handleChange} placeholder="TR..." />
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Adres</label>
                            <div className="relative group">
                                <div className="absolute top-3.5 left-3.5 pointer-events-none text-gray-400 group-focus-within:text-gray-900 transition-colors"><BiMap size={20} /></div>
                                <textarea 
                                    name="address" 
                                    rows="2" 
                                    required 
                                    className="w-full bg-white text-gray-900 text-sm rounded-xl border border-gray-300 focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/20 block pl-11 p-3.5 transition-all outline-none font-medium placeholder-gray-400 resize-none"
                                    placeholder="Açık adresiniz..."
                                    value={formData.address}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* ONAYLAR */}
                <div className="space-y-3 pt-4">
                    <label className="flex items-start cursor-pointer group select-none">
                        <div className="relative flex items-center mt-0.5">
                            <input type="checkbox" name="kvkk_accepted" required checked={formData.kvkk_accepted} onChange={handleChange} className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-gray-300 transition-all checked:border-yellow-400 checked:bg-yellow-400 hover:border-yellow-400" />
                             <BiCheckCircle className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100" size={14} />
                        </div>
                        <span className="ml-3 text-sm text-gray-600 group-hover:text-gray-900 transition font-medium">KVKK metnini okudum ve kabul ediyorum.</span>
                    </label>
                     <label className="flex items-start cursor-pointer group select-none">
                         <div className="relative flex items-center mt-0.5">
                            <input type="checkbox" name="terms_accepted" required checked={formData.terms_accepted} onChange={handleChange} className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-gray-300 transition-all checked:border-yellow-400 checked:bg-yellow-400 hover:border-yellow-400" />
                             <BiCheckCircle className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100" size={14} />
                        </div>
                        <span className="ml-3 text-sm text-gray-600 group-hover:text-gray-900 transition font-medium">Kullanım koşullarını okudum ve kabul ediyorum.</span>
                    </label>
                </div>

                {/* BUTON */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gray-900 hover:bg-black text-white font-bold rounded-xl py-4 shadow-lg shadow-gray-200 transform transition active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed text-base"
                >
                    {loading ? (
                    <>
                        <BiLoaderAlt className="animate-spin" size={20} />
                        Kaydediliyor...
                    </>
                    ) : (
                    <>
                        Kaydı Tamamla <BiRightArrowAlt size={20} />
                    </>
                    )}
                </button>

                <div className="text-center pt-4 border-t border-gray-100 mt-8">
                    <p className="text-gray-500 font-medium text-sm">
                        Zaten hesabın var mı? <Link to="/login" className="text-gray-900 font-bold hover:text-yellow-500 transition-colors">Giriş Yap</Link>
                    </p>
                </div>

            </form>
        </div>
      </div>

      {/* TELEFON DOĞRULAMA MODAL */}
      <PhoneVerificationModal
        isOpen={showPhoneModal}
        phoneNumber={formData.phone}
        onVerified={() => {
          setPhoneVerified(true);
          setShowPhoneModal(false);
        }}
        onClose={() => setShowPhoneModal(false)}
      />
    </div>
  );
};

// --- YARDIMCI INPUT BİLEŞENİ (YENİ STİL) ---
const InputGroup = ({ icon, label, name, type = "text", value, onChange, placeholder, maxLength }) => (
    <div className="group">
        <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">{label}</label>
        <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-gray-900 transition-colors">
                {icon}
            </div>
            <input
                type={type}
                name={name}
                required
                maxLength={maxLength}
                className="w-full bg-white text-gray-900 text-sm rounded-xl border border-gray-300 focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/20 block pl-11 p-3.5 transition-all duration-200 outline-none font-medium placeholder-gray-400"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
            />
        </div>
    </div>
);