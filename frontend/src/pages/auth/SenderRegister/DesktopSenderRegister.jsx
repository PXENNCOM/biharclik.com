import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../../services/authService';
import { PhoneVerificationModal } from '../../../components/common/PhoneVerificationModal';
import { KvkkModal } from '../../../components/common/KvkkModal';
import { motion, AnimatePresence } from 'framer-motion';

// ✨ BoxIcons
import { 
  BiUser, 
  BiBuilding, 
  BiEnvelope, 
  BiPhone, 
  BiLockAlt, 
  BiIdCard, 
  BiMap, 
  BiCheckCircle, 
  BiRightArrowAlt, 
  BiLoaderAlt,
  BiErrorCircle
} from 'react-icons/bi';

// 🖼️ Görseller
import LogoImage from '../../../assets/yellow_logo.png'; 
import HeroImage from '../../../assets/login-hero.png'; 


const getErrorMessage = (err) => {
  const data = err.response?.data;
  if (data?.errors?.length > 0) return data.errors.map(e => e.message).join(' • ');
  return data?.message || 'Bir hata oluştu';
};

const DesktopSenderRegister = () => {
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

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Modallar için State'ler
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [showKvkkModal, setShowKvkkModal] = useState(false);
  const [kvkkModalType, setKvkkModalType] = useState('aydinlatma');

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
      setError('Lütfen yasal metinleri onaylayın');
      return;
    }

    setLoading(true);

    try {
      // API'ye gidecek data objesini hazırla
      const submitData = {
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        password_confirm: formData.password_confirm,
        account_type: accountType,
        billing_address: formData.billing_address,
        kvkk_accepted: formData.kvkk_accepted,
        terms_accepted: formData.terms_accepted,
      };

      if (accountType === 'individual') {
        submitData.first_name = formData.first_name;
        submitData.last_name = formData.last_name;
        submitData.tc_no = formData.tc_no;
      } else {
        submitData.company_name = formData.company_name;
        submitData.tax_office = formData.tax_office;
        submitData.tax_number = formData.tax_number;
      }

      await authService.registerSender(submitData);
      navigate('/sender/dashboard');
    } catch (err) {
  setError(getErrorMessage(err));
} finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white font-sans text-gray-900">
      
      {/* SOL TARAF - Sabit Görsel Alanı */}
      <div className="lg:w-5/12 bg-gray-900 text-white flex flex-col relative overflow-hidden min-h-[300px] lg:min-h-screen lg:fixed lg:left-0 lg:top-0 lg:h-full z-10">
        <img 
          src={HeroImage} 
          alt="Biharçlık Kurye" 
          className="absolute inset-0 w-full h-full object-cover z-0 opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent z-10"></div>
        
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

      {/* SAĞ TARAF - Form Alanı */}
      <div className="lg:w-7/12 lg:ml-[41.666%] w-full bg-white min-h-screen flex items-center justify-center py-16 px-6 sm:px-12">
        <div className="w-full max-w-2xl">
          
          <div className="mb-12 text-center lg:text-left">
            <h2 className="text-4xl font-black text-gray-900 mb-3 tracking-tight">Kayıt Ol</h2>
            <p className="text-gray-500 font-medium">Gönderici olarak hemen harçlık dağıtmaya başla.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="bg-red-50 border-l-4 border-red-500 text-red-700 px-5 py-4 rounded-r-xl text-sm font-bold flex items-center gap-3 shadow-sm">
                <BiErrorCircle size={24} />
                {error}
              </motion.div>
            )}

            {/* HESAP TİPİ SEÇİCİ */}
            <div className="space-y-3">
              <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Hesap Türü Seçiniz</label>
              <div className="grid grid-cols-2 gap-4">
                <AccountTypeBtn 
                  active={accountType === 'individual'} 
                  onClick={() => setAccountType('individual')}
                  icon={<BiUser size={24} />}
                  title="Bireysel"
                  desc="Kişisel gönderiler"
                />
                <AccountTypeBtn 
                  active={accountType === 'corporate'} 
                  onClick={() => setAccountType('corporate')}
                  icon={<BiBuilding size={24} />}
                  title="Kurumsal"
                  desc="Şirket gönderileri"
                />
              </div>
            </div>

            {/* DİNAMİK ALANLAR */}
            <AnimatePresence mode="wait">
              <motion.div
                key={accountType}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {accountType === 'individual' ? (
                  <div className="grid grid-cols-2 gap-5">
                    <InputGroup icon={<BiUser />} label="AD" name="first_name" value={formData.first_name} onChange={handleChange} placeholder="Örn: Ahmet" />
                    <InputGroup icon={<BiUser />} label="SOYAD" name="last_name" value={formData.last_name} onChange={handleChange} placeholder="Örn: Yılmaz" />
                    <div className="col-span-2">
                      <InputGroup icon={<BiIdCard />} label="TC KİMLİK NO" name="tc_no" value={formData.tc_no} onChange={handleChange} maxLength="11" placeholder="11 haneli kimlik numarası" />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <InputGroup icon={<BiBuilding />} label="FİRMA ÜNVANI" name="company_name" value={formData.company_name} onChange={handleChange} placeholder="Örn: Biharçlık Lojistik A.Ş." />
                    <div className="grid grid-cols-2 gap-5">
                      <InputGroup icon={<BiMap />} label="VERGİ DAİRESİ" name="tax_office" value={formData.tax_office} onChange={handleChange} placeholder="Daire adı" />
                      <InputGroup icon={<BiIdCard />} label="VERGİ NUMARASI" name="tax_number" value={formData.tax_number} onChange={handleChange} maxLength="10" placeholder="10 haneli numara" />
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* İLETİŞİM & DOĞRULAMA */}
            <div className="space-y-6 pt-6 border-t border-gray-100">
              <div className="grid grid-cols-2 gap-5">
                <InputGroup icon={<BiEnvelope />} label="E-POSTA" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="iletisim@sirket.com" />
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
                  <BiPhone size={20} /> Numarayı Doğrula
                </button>
              ) : (
                <div className="bg-green-50 border border-green-200 text-green-700 px-5 py-4 rounded-2xl flex items-center gap-3 font-bold text-sm">
                  <BiCheckCircle size={22} /> Telefon Doğrulandı
                </div>
              )}

              <div className="group">
                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">FATURA ADRESİ</label>
                <div className="relative">
                  <BiMap className="absolute top-4 left-4 text-gray-400" size={20} />
                  <textarea 
                    name="billing_address" 
                    rows="3" 
                    className="w-full bg-white text-gray-900 text-sm rounded-2xl border-2 border-gray-100 focus:border-yellow-400 focus:ring-0 block pl-12 p-4 transition-all outline-none font-semibold placeholder-gray-300 resize-none"
                    placeholder="Mahalle, sokak, no, daire..."
                    value={formData.billing_address}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* GÜVENLİK */}
            <div className="grid grid-cols-2 gap-5 pt-6 border-t border-gray-100">
              <InputGroup icon={<BiLockAlt />} label="ŞİFRE" name="password" type="password" value={formData.password} onChange={handleChange} placeholder="••••••" />
              <InputGroup icon={<BiLockAlt />} label="ŞİFRE TEKRAR" name="password_confirm" type="password" value={formData.password_confirm} onChange={handleChange} placeholder="••••••" />
            </div>

            {/* ONAYLAR */}
            <div className="space-y-4 pt-4 bg-gray-50/50 p-6 rounded-3xl border border-gray-100">
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
                label="Kullanım ve Üyelik Koşulları'nı" 
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

// --- YARDIMCI ALT BİLEŞENLER ---

const InputGroup = ({ icon, label, name, type = "text", value, onChange, placeholder, maxLength }) => (
  <div className="group">
    <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">{label}</label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-yellow-500 transition-colors">
        {icon}
      </div>
      <input
        type={type} name={name} required maxLength={maxLength} value={value} onChange={onChange} placeholder={placeholder}
        className="w-full bg-white text-gray-900 text-sm rounded-2xl border-2 border-gray-100 focus:border-yellow-400 block pl-12 p-4 transition-all outline-none font-bold placeholder-gray-300 shadow-sm focus:shadow-yellow-100"
      />
    </div>
  </div>
);

const AccountTypeBtn = ({ active, onClick, icon, title, desc }) => (
  <button
    type="button"
    onClick={onClick}
    className={`p-5 rounded-3xl border-2 text-left transition-all duration-300 flex items-center gap-4 ${
      active ? 'border-yellow-400 bg-yellow-50/50 shadow-lg shadow-yellow-100' : 'border-gray-100 hover:border-gray-200 bg-white shadow-sm'
    }`}
  >
    <div className={`p-3 rounded-2xl ${active ? 'bg-yellow-400 text-white' : 'bg-gray-100 text-gray-400'}`}>
      {icon}
    </div>
    <div>
      <span className={`block font-black text-sm uppercase tracking-tight ${active ? 'text-gray-900' : 'text-gray-500'}`}>{title}</span>
      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{desc}</span>
    </div>
  </button>
);

const ApprovalLink = ({ checked, name, onChange, label, onClick }) => (
  <label className="flex items-center gap-4 cursor-pointer group">
    <div className="relative flex items-center">
      <input 
        type="checkbox" name={name} checked={checked} onChange={onChange}
        className="peer h-6 w-6 appearance-none rounded-xl border-2 border-gray-200 checked:bg-yellow-400 checked:border-yellow-400 transition-all cursor-pointer" 
      />
      <BiCheckCircle className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" size={16} />
    </div>
    <span className="text-xs font-bold text-gray-600 group-hover:text-gray-900 transition-colors">
      <button type="button" onClick={onClick} className="text-yellow-600 hover:underline underline-offset-2 decoration-2">{label}</button> okudum ve kabul ediyorum.
    </span>
  </label>
);

export default DesktopSenderRegister;