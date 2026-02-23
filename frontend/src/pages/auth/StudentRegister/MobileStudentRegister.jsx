import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../../services/authService';
import { PhoneVerificationModal } from '../../../components/common/PhoneVerificationModal';
import { KvkkModal } from '../../../components/common/KvkkModal';
import { motion } from 'framer-motion';

import { 
  BiUser, BiIdCard, BiCalendar, BiEnvelope, BiPhone, 
  BiLockAlt, BiBuilding, BiBook, BiCloudUpload, 
  BiCreditCard, BiMap, BiCheckCircle, BiLoaderAlt,
  BiErrorCircle, BiChevronLeft
} from 'react-icons/bi';

import LogoImage from '../../../assets/yellow_logo.png'; 

 const MobileStudentRegister = () => {
  const [formData, setFormData] = useState({
    email: '', phone: '', password: '', password_confirm: '',
    first_name: '', last_name: '', tc_no: '', birth_date: '',
    iban: '', address: '', university: '', department: '',
    kvkk_accepted: false, terms_accepted: false,
  });
  const [studentDocument, setStudentDocument] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState(null); 
  const [showKvkkModal, setShowKvkkModal] = useState(false);
  const [kvkkModalType, setKvkkModalType] = useState('aydinlatma');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [showPhoneModal, setShowPhoneModal] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleFileChange = (e, setFile) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { setError('Dosya boyutu 5MB\'dan büyük olamaz'); return; }
      setFile(file);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!phoneVerified) { setError('Lütfen telefon numaranızı doğrulayın'); return; }
    if (formData.password !== formData.password_confirm) { setError('Şifreler eşleşmiyor'); return; }
    if (!profilePhoto || !studentDocument) { setError('Lütfen profil fotoğrafı ve öğrenci belgesini yükleyin'); return; }
    
    setLoading(true);
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => data.append(key, formData[key]));
      data.append('student_document', studentDocument);
      data.append('profile_photo', profilePhoto);
      await authService.registerStudent(data);
      navigate('/register/success');
    } catch (err) {
      setError(err.response?.data?.message || 'Kayıt başarısız');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#111827] font-sans overflow-x-hidden">
      
      {/* ÜST HEADER */}
      <div className="px-6 pt-12 pb-16 lg:pb-24 relative max-w-7xl mx-auto w-full">
        <div className="flex justify-between items-center mb-8">
          <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white active:scale-90 transition-transform">
            <BiChevronLeft size={28} />
          </button>
          <motion.div initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
            <img src={LogoImage} alt="Logo" className="h-10 lg:h-12 w-auto object-contain" />
          </motion.div>
          <div className="w-10"></div>
        </div>

        <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="text-center lg:text-left">
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">Öğrenci Kaydı</h1>
        </motion.div>
      </div>

      {/* FORM KARTI */}
      <motion.div 
        initial={{ y: 100 }} animate={{ y: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="flex-1 bg-white rounded-t-[40px] lg:rounded-[40px] px-6 lg:px-12 pt-10 pb-12 shadow-2xl mt-[-30px] z-10 w-full lg:max-w-4xl lg:mx-auto lg:mb-10"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs font-bold flex items-center gap-2 uppercase tracking-tight">
              <BiErrorCircle size={20} /> {error}
            </div>
          )}

          {/* 1. PROFİL FOTOĞRAFI (BAŞTA) */}
          <div className="max-w-sm mx-auto">
             <FileUpload label="PROFİL FOTOĞRAFI" icon={<BiUser size={24}/>} file={profilePhoto} id="profile_photo" onChange={(e) => handleFileChange(e, setProfilePhoto)} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 border-t border-gray-50 pt-6">
            <p className="lg:col-span-2 text-[10px] font-black text-gray-400 tracking-[0.2em] mb-2 uppercase">Kişisel Bilgiler</p>
            <ModernInput icon={<BiUser />} label="AD" name="first_name" value={formData.first_name} onChange={handleChange} placeholder="Adınız" />
            <ModernInput icon={<BiUser />} label="SOYAD" name="last_name" value={formData.last_name} onChange={handleChange} placeholder="Soyadınız" />
            <ModernInput icon={<BiIdCard />} label="TC KİMLİK" name="tc_no" value={formData.tc_no} onChange={handleChange} maxLength="11" placeholder="11 haneli" />
            <ModernInput icon={<BiCalendar />} label="DOĞUM TARİHİ" name="birth_date" type="date" value={formData.birth_date} onChange={handleChange} />
            
            <p className="lg:col-span-2 text-[10px] font-black text-gray-400 tracking-[0.2em] mt-4 mb-2 uppercase">Eğitim Bilgileri</p>
            <ModernInput icon={<BiBuilding />} label="ÜNİVERSİTE" name="university" value={formData.university} onChange={handleChange} placeholder="Üniversiteniz" />
            <ModernInput icon={<BiBook />} label="BÖLÜM" name="department" value={formData.department} onChange={handleChange} placeholder="Bölümünüz" />
            
            {/* ÖĞRENCİ BELGESİ (Eğitim Kısmının Altı) */}
            <div className="lg:col-span-2 py-2">
                <FileUpload label="ÖĞRENCİ BELGESİ (PDF veya JPG)" icon={<BiCloudUpload size={24}/>} file={studentDocument} id="student_doc" onChange={(e) => handleFileChange(e, setStudentDocument)} />
            </div>

            <p className="lg:col-span-2 text-[10px] font-black text-gray-400 tracking-[0.2em] mt-4 mb-2 uppercase">İletişim Bilgileri</p>
            <ModernInput icon={<BiEnvelope />} label="E-POSTA" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="ornek@edu.tr" />
            
            <div className="flex gap-2 items-end">
              <div className="flex-1">
                <ModernInput icon={<BiPhone />} label="TELEFON" name="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="05XX..." />
              </div>
              {!phoneVerified && (
                <button type="button" onClick={() => setShowPhoneModal(true)} className="bg-gray-900 text-white p-4 rounded-2xl hover:bg-black active:scale-95 transition-all">
                  <BiCheckCircle size={24} />
                </button>
              )}
            </div>

            <p className="lg:col-span-2 text-[10px] font-black text-gray-400 tracking-[0.2em] mt-4 mb-2 uppercase">Ödeme & Adres</p>
            <div className="lg:col-span-2">
              <ModernInput icon={<BiCreditCard />} label="IBAN NUMARASI" name="iban" value={formData.iban} onChange={handleChange} placeholder="TR00..." />
            </div>
            <div className="lg:col-span-2">
              <div className="border border-gray-100 rounded-2xl p-3 shadow-sm focus-within:ring-2 focus-within:ring-yellow-400/50 transition-all bg-white text-gray-800">
                <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1 ml-1">İKAMETGAH ADRESİ</label>
                <div className="flex gap-3">
                  <BiMap className="text-gray-400 mt-1" size={20} />
                  <textarea name="address" rows="2" className="w-full bg-transparent text-sm font-semibold outline-none placeholder-gray-300 resize-none" placeholder="Açık adresiniz..." value={formData.address} onChange={handleChange} />
                </div>
              </div>
            </div>

            <p className="lg:col-span-2 text-[10px] font-black text-gray-400 tracking-[0.2em] mt-4 mb-2 uppercase">Güvenlik</p>
            <ModernInput icon={<BiLockAlt />} label="ŞİFRE" name="password" type="password" value={formData.password} onChange={handleChange} placeholder="••••" />
            <ModernInput icon={<BiLockAlt />} label="TEKRAR" name="password_confirm" type="password" value={formData.password_confirm} onChange={handleChange} placeholder="••••" />
          </div>

          {/* ONAYLAR VE BUTON */}
          <div className="max-w-md mx-auto space-y-4 pt-8 border-t border-gray-50">
            <ApprovalCheckbox label="KVKK AYDINLATMA METNİ" onClick={() => { setKvkkModalType('aydinlatma'); setShowKvkkModal(true); }} checked={formData.kvkk_accepted} onChange={handleChange} name="kvkk_accepted" />
            <ApprovalCheckbox label="KULLANIM KOŞULLARI" onClick={() => { setKvkkModalType('kosullar'); setShowKvkkModal(true); }} checked={formData.terms_accepted} onChange={handleChange} name="terms_accepted" />

            <button type="submit" disabled={loading} className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-extrabold rounded-2xl py-5 transition-all active:scale-[0.98] shadow-xl shadow-yellow-400/20 uppercase tracking-widest text-sm">
              {loading ? <BiLoaderAlt className="animate-spin" size={24} /> : "Kaydı Tamamla"}
            </button>
            <p className="text-center text-[10px] font-bold text-gray-400 pt-2 tracking-widest uppercase">
              Zaten hesabın var mı? <Link to="/login" className="text-yellow-600 hover:underline">Giriş Yap</Link>
            </p>
          </div>
        </form>
      </motion.div>

      <PhoneVerificationModal isOpen={showPhoneModal} phoneNumber={formData.phone} onVerified={() => { setPhoneVerified(true); setShowPhoneModal(false); }} onClose={() => setShowPhoneModal(false)} />
      <KvkkModal isOpen={showKvkkModal} onClose={() => setShowKvkkModal(false)} type={kvkkModalType} />
    </div>
  );
};

// --- YARDIMCI BİLEŞENLER ---

const ModernInput = ({ icon, label, name, type = "text", value, onChange, placeholder, maxLength }) => (
  <div className="border border-gray-100 rounded-2xl p-3 shadow-sm focus-within:ring-2 focus-within:ring-yellow-400/50 transition-all bg-white h-full">
    <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-0.5 ml-1">{label}</label>
    <div className="flex items-center gap-3">
      <span className="text-gray-400">{icon}</span>
      <input type={type} name={name} required maxLength={maxLength} className="w-full bg-transparent text-sm font-semibold text-gray-800 outline-none placeholder-gray-300" placeholder={placeholder} value={value} onChange={onChange} />
    </div>
  </div>
);

const FileUpload = ({ label, icon, file, id, onChange }) => (
  <div className="group">
    <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-2 ml-1">{label}</label>
    <div className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer ${file ? 'border-green-400 bg-green-50' : 'border-gray-100 hover:border-yellow-400 bg-white'}`}>
      <input type="file" onChange={onChange} className="hidden" id={id} />
      <label htmlFor={id} className="cursor-pointer flex flex-col items-center">
        {file ? (
          <div className="text-green-600 flex flex-col items-center">
            <BiCheckCircle size={32} />
            <span className="text-[11px] font-bold mt-2 truncate w-full px-2">{file.name}</span>
          </div>
        ) : (
          <div className="text-gray-400 flex flex-col items-center group-hover:text-yellow-600">
            {icon}
            <span className="text-[11px] font-bold mt-2 uppercase">Belge Seç</span>
          </div>
        )}
      </label>
    </div>
  </div>
);

const ApprovalCheckbox = ({ name, checked, onChange, label, onClick }) => (
  <div className="flex items-center gap-3">
    <label className="relative flex items-center cursor-pointer">
      <input type="checkbox" name={name} checked={checked} onChange={onChange} className="peer h-5 w-5 appearance-none rounded-lg border-2 border-gray-100 checked:bg-yellow-400 checked:border-yellow-400" />
      <BiCheckCircle className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100" size={14} />
    </label>
    <button type="button" onClick={onClick} className="text-[10px] font-bold text-gray-400 hover:text-yellow-600 uppercase tracking-tighter text-left">
      {label} <span className="underline italic lowercase text-blue-400">(Oku ve Onayla)</span>
    </button>
  </div>
);


export default MobileStudentRegister