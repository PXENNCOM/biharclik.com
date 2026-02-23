import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../../services/authService';
import { PhoneVerificationModal } from '../../../components/common/PhoneVerificationModal';
import { KvkkModal } from '../../../components/common/KvkkModal';
import { motion, AnimatePresence } from 'framer-motion';

import {
  BiUser,
  BiBuilding,
  BiEnvelope,
  BiPhone,
  BiLockAlt,
  BiIdCard,
  BiMap,
  BiCheckCircle,
  BiLoaderAlt,
  BiErrorCircle,
  BiChevronLeft,
  BiPackage
} from 'react-icons/bi';

import LogoImage from '../../../assets/yellow_logo.png';

const MobileSenderRegister = () => {
  const [accountType, setAccountType] = useState('individual'); // 'individual' or 'corporate'
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: '',
    password_confirm: '',
    first_name: '',
    last_name: '',
    tc_no: '',
    company_name: '',
    tax_office: '',
    tax_number: '',
    billing_address: '',
    kvkk_accepted: false,
    terms_accepted: false,
  });
  
  const [showKvkkModal, setShowKvkkModal] = useState(false);
  const [kvkkModalType, setKvkkModalType] = useState('aydinlatma');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
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

    if (!formData.kvkk_accepted || !formData.terms_accepted) {
      setError('Lütfen sözleşmeleri onaylayın');
      return;
    }

    setLoading(true);

    try {
      const data = { ...formData, account_type: accountType };
      await authService.registerSender(data);
      navigate('/sender/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Kayıt başarısız');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#111827] font-sans overflow-x-hidden">
      
      {/* ÜST HEADER */}
      <div className="px-6 pt-12 pb-16 relative max-w-7xl mx-auto w-full">
        <div className="flex justify-between items-center mb-8">
          <button 
            onClick={() => navigate(-1)} 
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white active:scale-90 transition-transform"
          >
            <BiChevronLeft size={28} />
          </button>
          <motion.div initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
            <img src={LogoImage} alt="Logo" className="h-10 w-auto object-contain" />
          </motion.div>
          <div className="w-10"></div>
        </div>

        <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="text-center lg:text-left">
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2 tracking-tight">Gönderici Kaydı</h1>
          <p className="text-gray-400 text-sm">Hemen hesabını oluştur ve paketini gönder.</p>
        </motion.div>
      </div>

      {/* FORM KARTI */}
      <motion.div 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="flex-1 bg-white rounded-t-[40px] lg:rounded-[40px] px-6 lg:px-12 pt-10 pb-12 shadow-2xl mt-[-30px] z-10 w-full lg:max-w-4xl lg:mx-auto lg:mb-10"
      >
        
        {/* HESAP TİPİ SEÇİCİ */}
        <div className="bg-gray-100 p-1.5 rounded-[24px] flex mb-10 relative overflow-hidden">
          <motion.div 
            animate={{ x: accountType === 'individual' ? '0%' : '100%' }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute top-1.5 left-1.5 w-[calc(50%-6px)] bottom-1.5 bg-yellow-400 rounded-[18px] shadow-sm z-0"
          />
          <button 
            type="button"
            onClick={() => setAccountType('individual')}
            className={`relative z-10 flex-1 py-3 text-xs font-black uppercase tracking-tight transition-colors duration-300 ${accountType === 'individual' ? 'text-white' : 'text-gray-500'}`}
          >
            Bireysel
          </button>
          <button 
            type="button"
            onClick={() => setAccountType('corporate')}
            className={`relative z-10 flex-1 py-3 text-xs font-black uppercase tracking-tight transition-colors duration-300 ${accountType === 'corporate' ? 'text-white' : 'text-gray-500'}`}
          >
            Kurumsal
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs font-bold flex items-center gap-2 uppercase tracking-tight">
              <BiErrorCircle size={20} /> {error}
            </div>
          )}

          <AnimatePresence mode="wait">
            {accountType === 'individual' ? (
              <motion.div key="ind" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <ModernInput icon={<BiUser />} label="AD" name="first_name" value={formData.first_name} onChange={handleChange} placeholder="Adınız" />
                    <ModernInput icon={<BiUser />} label="SOYAD" name="last_name" value={formData.last_name} onChange={handleChange} placeholder="Soyadınız" />
                </div>
                <ModernInput icon={<BiIdCard />} label="TC KİMLİK NO" name="tc_no" value={formData.tc_no} onChange={handleChange} maxLength="11" placeholder="11 Haneli" />
              </motion.div>
            ) : (
              <motion.div key="corp" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-4">
                <ModernInput icon={<BiBuilding />} label="FİRMA ADI" name="company_name" value={formData.company_name} onChange={handleChange} placeholder="Şirket Ünvanı" />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <ModernInput icon={<BiMap />} label="VERGİ DAİRESİ" name="tax_office" value={formData.tax_office} onChange={handleChange} placeholder="Daire" />
                    <ModernInput icon={<BiIdCard />} label="VERGİ NO" name="tax_number" value={formData.tax_number} onChange={handleChange} maxLength="10" placeholder="10 Haneli" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="pt-2 border-t border-gray-50 space-y-4">
            <ModernInput icon={<BiEnvelope />} label="E-POSTA" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="ornek@email.com" />
            
            <div className="flex gap-2 items-end">
              <div className="flex-1">
                <ModernInput icon={<BiPhone />} label="TELEFON" name="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="05XX..." />
              </div>
              {!phoneVerified && (
                <button 
                  type="button" 
                  onClick={() => setShowPhoneModal(true)}
                  className="bg-gray-900 text-white p-4 rounded-2xl active:scale-95 transition-transform shadow-lg"
                >
                  <BiCheckCircle size={24} />
                </button>
              )}
            </div>

            <div className="border border-gray-100 rounded-2xl p-3 shadow-sm focus-within:ring-2 focus-within:ring-yellow-400/50 transition-all bg-white">
                <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1 ml-1">FATURA ADRESİ</label>
                <div className="flex gap-3">
                    <BiMap className="text-gray-400 mt-1" size={20} />
                    <textarea 
                        name="billing_address" 
                        rows="2" 
                        className="w-full bg-transparent text-sm font-semibold text-gray-800 outline-none placeholder-gray-300 resize-none"
                        placeholder="Adresinizi buraya yazın..."
                        value={formData.billing_address}
                        onChange={handleChange}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <ModernInput icon={<BiLockAlt />} label="ŞİFRE" name="password" type="password" value={formData.password} onChange={handleChange} placeholder="••••" />
                <ModernInput icon={<BiLockAlt />} label="TEKRAR" name="password_confirm" type="password" value={formData.password_confirm} onChange={handleChange} placeholder="••••" />
            </div>
          </div>

          {/* ONAYLAR */}
          <div className="max-w-md mx-auto space-y-4 pt-4">
            <ApprovalCheckbox 
              name="kvkk_accepted" 
              checked={formData.kvkk_accepted} 
              onChange={handleChange} 
              label="KVKK metnini" 
              onClick={() => { setKvkkModalType('aydinlatma'); setShowKvkkModal(true); }}
            />
            <ApprovalCheckbox 
              name="terms_accepted" 
              checked={formData.terms_accepted} 
              onChange={handleChange} 
              label="Kullanım koşullarını" 
              onClick={() => { setKvkkModalType('kosullar'); setShowKvkkModal(true); }}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-extrabold rounded-2xl py-5 mt-4 transition-all active:scale-[0.98] shadow-xl shadow-yellow-400/20 uppercase tracking-widest text-sm"
            >
              {loading ? <BiLoaderAlt className="animate-spin mx-auto" size={24} /> : "Kaydı Tamamla"}
            </button>

            <p className="text-center text-[10px] font-bold text-gray-400 pt-4 tracking-widest uppercase">
              Hesabınız var mı? <Link to="/login" className="text-yellow-600 hover:underline">Giriş Yap</Link>
            </p>
          </div>
        </form>
      </motion.div>

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

const ModernInput = ({ icon, label, name, type = "text", value, onChange, placeholder, maxLength }) => (
  <div className="border border-gray-100 rounded-2xl p-3 shadow-sm focus-within:ring-2 focus-within:ring-yellow-400/50 transition-all bg-white h-full">
    <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-0.5 ml-1">{label}</label>
    <div className="flex items-center gap-3">
      <span className="text-gray-400">{icon}</span>
      <input
        type={type}
        name={name}
        required
        maxLength={maxLength}
        className="w-full bg-transparent text-sm font-semibold text-gray-800 outline-none placeholder-gray-300"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  </div>
);

const ApprovalCheckbox = ({ name, checked, onChange, label, onClick }) => (
  <div className="flex items-center gap-3">
    <label className="relative flex items-center cursor-pointer">
      <input 
        type="checkbox" 
        name={name} 
        checked={checked} 
        onChange={onChange} 
        className="peer h-5 w-5 appearance-none rounded-lg border-2 border-gray-100 checked:bg-yellow-400 checked:border-yellow-400 transition-all" 
      />
      <BiCheckCircle className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100" size={14} />
    </label>
    <button type="button" onClick={onClick} className="text-[11px] font-bold text-gray-500 hover:text-yellow-600 uppercase tracking-tight text-left transition-colors">
      {label} <span className="underline italic lowercase text-blue-500 font-medium">(oku ve onayla)</span>
    </button>
  </div>
);

export default MobileSenderRegister;