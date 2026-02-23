import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../../services/authService';
import { PhoneVerificationModal } from '../../../components/common/PhoneVerificationModal';
import { KvkkModal } from '../../../components/common/KvkkModal';
import { motion, AnimatePresence } from 'framer-motion';

// ✨ BoxIcons
import { 
  BiUser, BiIdCard, BiCalendar, BiEnvelope, BiPhone, 
  BiLockAlt, BiBuilding, BiBook, BiCloudUpload, 
  BiCreditCard, BiMap, BiCheckCircle, BiRightArrowAlt, 
  BiLoaderAlt, BiErrorCircle 
} from 'react-icons/bi';

// 🖼️ Görseller
import LogoImage from '../../../assets/yellow_logo.png'; 
import HeroImage from '../../../assets/login-hero.png'; 

const DesktopStudentRegister = () => {
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
  const [profilePhoto, setProfilePhoto] = useState(null); 
  const [showKvkkModal, setShowKvkkModal] = useState(false);
  const [kvkkModalType, setKvkkModalType] = useState('aydinlatma');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Telefon doğrulama ve Modal durumları
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

  const handleFileChange = (e, setFile) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Dosya boyutu 5MB\'dan büyük olamaz');
        return;
      }
      setFile(file);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validasyonlar
    if (!phoneVerified) { setError('Lütfen telefon numaranızı doğrulayın'); return; }
    if (formData.password !== formData.password_confirm) { setError('Şifreler eşleşmiyor'); return; }
    if (!profilePhoto || !studentDocument) { setError('Lütfen profil fotoğrafı ve öğrenci belgesini yükleyin'); return; }
    if (!formData.kvkk_accepted || !formData.terms_accepted) { setError('Lütfen yasal metinleri onaylayın'); return; }

    setLoading(true);

    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => data.append(key, formData[key]));
      data.append('student_document', studentDocument);
      data.append('profile_photo', profilePhoto);

      await authService.registerStudent(data);
      navigate('/register/success');
    } catch (err) {
      setError(err.response?.data?.message || 'Kayıt işlemi başarısız oldu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white font-sans text-gray-900 overflow-x-hidden">
      
      {/* --- SOL TARAF: MARKA ALANI --- */}
      <div className="lg:w-5/12 bg-gray-900 text-white flex flex-col relative overflow-hidden min-h-[300px] lg:min-h-screen lg:fixed lg:left-0 lg:top-0 lg:h-full z-10">
        <img 
          src={HeroImage} 
          alt="Öğrenci Kurye" 
          className="absolute inset-0 w-full h-full object-cover z-0 opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent z-10"></div>
        
        <div className="relative z-20 flex-1 flex flex-col items-center justify-center p-12 text-center">
          <motion.img 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            src={LogoImage} 
            alt="Logo" 
            className="w-48 h-auto mb-6 drop-shadow-2xl"
          />
        </div>

        <div className="relative z-20 text-[10px] text-gray-500 font-bold text-center pb-8 tracking-[0.3em]">
          © 2026 BİHARÇLIK • Campus On-The-Go
        </div>
      </div>

      {/* --- SAĞ TARAF: FORM ALANI --- */}
      <div className="lg:w-7/12 lg:ml-[41.666%] w-full bg-white min-h-screen flex items-center justify-center py-16 px-6 sm:px-12">
        <div className="w-full max-w-2xl">
          
          <div className="mb-12 text-center lg:text-left">
            <h2 className="text-4xl font-black text-gray-900 mb-3 tracking-tight">Hesabını Oluştur</h2>
            <p className="text-gray-500 font-medium italic">Öğrenci kurye topluluğuna katılmak için formu doldur.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10">
            {error && (
              <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="bg-red-50 border-l-4 border-red-500 text-red-700 px-5 py-4 rounded-r-xl text-sm font-bold flex items-center gap-3 shadow-sm">
                <BiErrorCircle size={24} /> {error}
              </motion.div>
            )}

            {/* PROFIL FOTOĞRAFI YÜKLEME */}
            <section>
               <FileSelect 
                id="profile_photo" 
                label="PROFİL FOTOĞRAFIN" 
                icon={<BiUser size={32}/>} 
                file={profilePhoto} 
                onChange={(e) => handleFileChange(e, setProfilePhoto)} 
               />
            </section>

            {/* KİŞİSEL BİLGİLER */}
            <section className="space-y-6 pt-4 border-t border-gray-50">
              <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Kişisel Bilgiler</label>
              <div className="grid grid-cols-2 gap-5">
                <InputGroup icon={<BiUser />} label="AD" name="first_name" value={formData.first_name} onChange={handleChange} placeholder="Adınız" />
                <InputGroup icon={<BiUser />} label="SOYAD" name="last_name" value={formData.last_name} onChange={handleChange} placeholder="Soyadınız" />
                <InputGroup icon={<BiIdCard />} label="TC KİMLİK NO" name="tc_no" value={formData.tc_no} onChange={handleChange} maxLength="11" placeholder="11 haneli numara" />
                <InputGroup icon={<BiCalendar />} label="DOĞUM TARİHİ" name="birth_date" type="date" value={formData.birth_date} onChange={handleChange} />
              </div>
            </section>

            {/* EĞİTİM BİLGİLERİ */}
            <section className="space-y-6 pt-6 border-t border-gray-100">
              <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Eğitim Bilgileri</label>
              <div className="grid grid-cols-2 gap-5 mb-6">
                <InputGroup icon={<BiBuilding />} label="ÜNİVERSİTE" name="university" value={formData.university} onChange={handleChange} placeholder="Üniversiteniz" />
                <InputGroup icon={<BiBook />} label="BÖLÜM" name="department" value={formData.department} onChange={handleChange} placeholder="Bölümünüz" />
              </div>
              <FileSelect 
                id="student_doc" 
                label="ÖĞRENCİ BELGESİ (PDF veya JPG)" 
                icon={<BiCloudUpload size={32}/>} 
                file={studentDocument} 
                onChange={(e) => handleFileChange(e, setStudentDocument)} 
              />
            </section>

            {/* İLETİŞİM & DOĞRULAMA */}
            <section className="space-y-6 pt-6 border-t border-gray-100">
              <div className="grid grid-cols-2 gap-5">
                <InputGroup icon={<BiEnvelope />} label="E-POSTA (ÜNİVERSİTE)" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="ornek@edu.tr" />
                <InputGroup icon={<BiPhone />} label="TELEFON" name="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="05XX XXX XX XX" />
              </div>

              {!phoneVerified ? (
                <button
                  type="button"
                  onClick={() => {
                    if(formData.phone.length < 10) { setError("Lütfen geçerli bir telefon giriniz."); return; }
                    setShowPhoneModal(true);
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
                >
                  <BiPhone size={20} /> Telefonu Doğrula
                </button>
              ) : (
                <div className="bg-green-50 border border-green-200 text-green-700 px-5 py-4 rounded-2xl flex items-center gap-3 font-bold text-sm">
                  <BiCheckCircle size={22} /> Numara Doğrulandı
                </div>
              )}
            </section>

            {/* ÖDEME & ADRES */}
            <section className="space-y-6 pt-6 border-t border-gray-100">
              <InputGroup icon={<BiCreditCard />} label="IBAN NUMARASI" name="iban" value={formData.iban} onChange={handleChange} placeholder="TR00 0000..." />
              <div className="group">
                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">İKAMETGAH ADRESİ</label>
                <div className="relative">
                  <BiMap className="absolute top-4 left-4 text-gray-400" size={20} />
                  <textarea 
                    name="address" 
                    rows="3" 
                    className="w-full bg-white text-gray-900 text-sm rounded-2xl border-2 border-gray-100 focus:border-yellow-400 block pl-12 p-4 transition-all outline-none font-bold placeholder-gray-300 shadow-sm resize-none"
                    placeholder="Tam adresinizi giriniz..."
                    value={formData.address}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </section>

            {/* GÜVENLİK */}
            <div className="grid grid-cols-2 gap-5 pt-6 border-t border-gray-100">
              <InputGroup icon={<BiLockAlt />} label="ŞİFRE" name="password" type="password" value={formData.password} onChange={handleChange} placeholder="••••••" />
              <InputGroup icon={<BiLockAlt />} label="ŞİFRE TEKRAR" name="password_confirm" type="password" value={formData.password_confirm} onChange={handleChange} placeholder="••••••" />
            </div>

            {/* ONAYLAR */}
            <div className="space-y-4 pt-4 bg-gray-50 p-6 rounded-3xl border border-gray-100">
              <ApprovalLink 
                checked={formData.kvkk_accepted} 
                name="kvkk_accepted" 
                onChange={handleChange}
                label="KVKK Aydınlatma Metni'ni" 
                onClick={() => { setKvkkModalType('aydinlatma'); setShowKvkkModal(true); }}
              />
              <ApprovalLink 
                checked={formData.terms_accepted} 
                name="terms_accepted" 
                onChange={handleChange}
                label="Kullanım Koşulları'nı" 
                onClick={() => { setKvkkModalType('kosullar'); setShowKvkkModal(true); }}
              />
            </div>

            {/* SUBMIT BUTONU */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-900 hover:bg-black text-white font-black rounded-2xl py-5 shadow-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-3 text-lg tracking-tight disabled:opacity-50"
            >
              {loading ? <BiLoaderAlt className="animate-spin" size={24} /> : <>KAYDI TAMAMLA <BiRightArrowAlt size={24} /></>}
            </button>

            <div className="text-center pt-6">
              <p className="text-gray-500 font-bold text-sm uppercase tracking-tighter">
                Zaten hesabın var mı? <Link to="/login" className="text-yellow-600 hover:text-yellow-700 underline underline-offset-4 ml-1">Giriş Yap</Link>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* MODALLAR */}
      <PhoneVerificationModal 
        isOpen={showPhoneModal} 
        phoneNumber={formData.phone} 
        onVerified={() => { setPhoneVerified(true); setShowPhoneModal(false); }} 
        onClose={() => setShowPhoneModal(false)} 
      />
      
      <KvkkModal 
        isOpen={showKvkkModal} 
        onClose={() => setShowKvkkModal(false)} 
        type={kvkkModalType} 
      />
    </div>
  );
};

// --- EKSİKSİZ ALT BİLEŞENLER ---

const InputGroup = ({ icon, label, name, type = "text", value, onChange, placeholder, maxLength }) => (
  <div className="group">
    <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">{label}</label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-yellow-500 transition-colors">
        {icon}
      </div>
      <input
        type={type}
        name={name}
        required
        maxLength={maxLength}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-white text-gray-900 text-sm rounded-2xl border-2 border-gray-100 focus:border-yellow-400 block pl-12 p-4 transition-all outline-none font-bold placeholder-gray-300 shadow-sm focus:shadow-yellow-100"
      />
    </div>
  </div>
);

const FileSelect = ({ id, label, icon, file, onChange }) => (
  <div className="group">
    <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">{label}</label>
    <div className={`border-2 border-dashed rounded-3xl p-10 text-center transition-all cursor-pointer ${file ? 'border-green-400 bg-green-50' : 'border-gray-200 bg-white hover:border-yellow-400'}`}>
      <input type="file" onChange={onChange} className="hidden" id={id} />
      <label htmlFor={id} className="cursor-pointer flex flex-col items-center">
        {file ? (
          <div className="text-green-600 font-bold flex flex-col items-center">
            <BiCheckCircle size={40} />
            <span className="text-sm mt-3 truncate max-w-[250px]">{file.name}</span>
            <span className="text-[10px] uppercase mt-1 opacity-60">Değiştirmek için tıkla</span>
          </div>
        ) : (
          <div className="text-gray-400 flex flex-col items-center group-hover:text-yellow-600">
            {icon}
            <span className="text-sm font-bold mt-3 uppercase tracking-tighter">Dosya Seç veya Sürükle</span>
            <span className="text-[10px] mt-1 font-medium">Maksimum 5MB • JPG, PNG, PDF</span>
          </div>
        )}
      </label>
    </div>
  </div>
);

const ApprovalLink = ({ checked, name, onChange, label, onClick }) => (
  <label className="flex items-center gap-4 cursor-pointer group select-none">
    <div className="relative flex items-center">
      <input 
        type="checkbox" 
        name={name} 
        checked={checked} 
        onChange={onChange}
        className="peer h-6 w-6 appearance-none rounded-xl border-2 border-gray-200 checked:bg-yellow-400 checked:border-yellow-400 transition-all cursor-pointer" 
      />
      <BiCheckCircle className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" size={16} />
    </div>
    <span className="text-xs font-bold text-gray-600 group-hover:text-gray-900 transition-colors uppercase tracking-tight leading-relaxed">
      <button type="button" onClick={onClick} className="text-yellow-600 hover:underline underline-offset-2 decoration-2">{label}</button> okudum ve tüm şartları kabul ediyorum.
    </span>
  </label>
);

export default DesktopStudentRegister;