import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/authService';

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
  BiErrorCircle,
  BiBriefcase
} from 'react-icons/bi';

// 🖼️ Görseller (Login ile aynı görseli veya farklı bir kurye görselini kullanabilirsiniz)
import LogoImage from '../../assets/yellow_logo.png'; 
import HeroImage from '../../assets/login-hero.png'; 

export const SenderRegisterPage = () => {
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

    if (formData.password !== formData.password_confirm) {
      setError('Şifreler eşleşmiyor');
      return;
    }

    if (!formData.kvkk_accepted || !formData.terms_accepted) {
      setError('KVKK ve kullanım koşullarını kabul etmelisiniz');
      return;
    }

    setLoading(true);

    try {
      const data = {
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        password_confirm: formData.password_confirm,
        account_type: accountType,
        kvkk_accepted: formData.kvkk_accepted,
        terms_accepted: formData.terms_accepted,
      };

      if (accountType === 'individual') {
        data.first_name = formData.first_name;
        data.last_name = formData.last_name;
        data.tc_no = formData.tc_no;
        data.billing_address = formData.billing_address;
      } else {
        data.company_name = formData.company_name;
        data.tax_office = formData.tax_office;
        data.tax_number = formData.tax_number;
        data.billing_address = formData.billing_address;
      }

      const response = await authService.registerSender(data);
      // Kayıt sonrası logic (Token kaydetme vs.)
      const { user, access_token, refresh_token } = response.data;
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);

      navigate('/sender/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Kayıt başarısız');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white font-sans text-gray-900">
      
      {/* --- SOL TARAF: MARKA & GÖRSEL --- */}
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

            
      {/* --- SAĞ TARAF: FORM ALANI --- */}
      {/* Sol taraf fixed olduğu için sağ tarafa margin-left ekliyoruz (lg:ml-[41.666%]) */}
      <div className="lg:w-7/12 lg:ml-[41.666%] w-full bg-white min-h-screen flex items-center justify-center py-12 px-6 sm:px-12">
        <div className="w-full max-w-2xl">
            
            {/* Mobil Header (Sadece mobilde görünür) */}
            <div className="lg:hidden text-center mb-8">
                 <img src={LogoImage} alt="Biharçlık Logo" className="h-10 w-auto mx-auto mb-4" />
            </div>

            <div className="mb-10 text-center lg:text-left">
                <h2 className="text-3xl font-bold text-gray-900 mb-2 font-heading">Gönderici Hesabı Oluştur</h2>
                <p className="text-gray-500 font-medium">
                    Bilgilerinizi girerek saniyeler içinde kayıt olun.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                 {error && (
                    <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-4 rounded-xl text-sm font-bold flex items-center gap-2 animate-pulse">
                        <BiErrorCircle size={24} />
                        {error}
                    </div>
                )}

                {/* 1. HESAP TİPİ SEÇİMİ (Kart Tasarımı) */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3 ml-1">Hesap Türü</label>
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            type="button"
                            onClick={() => setAccountType('individual')}
                            className={`p-4 rounded-xl border transition-all duration-200 flex items-center gap-3 ${
                            accountType === 'individual'
                                ? 'border-yellow-400 bg-yellow-50 text-gray-900 ring-1 ring-yellow-400'
                                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-600'
                            }`}
                        >
                            <div className={`p-2 rounded-lg ${accountType === 'individual' ? 'bg-yellow-400 text-white' : 'bg-gray-100 text-gray-500'}`}>
                                <BiUser size={20} />
                            </div>
                            <div className="text-left">
                                <span className="block font-bold text-sm">Bireysel</span>
                                <span className="text-xs opacity-70">Şahıs hesabı</span>
                            </div>
                        </button>

                        <button
                            type="button"
                            onClick={() => setAccountType('corporate')}
                            className={`p-4 rounded-xl border transition-all duration-200 flex items-center gap-3 ${
                            accountType === 'corporate'
                                ? 'border-yellow-400 bg-yellow-50 text-gray-900 ring-1 ring-yellow-400'
                                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-600'
                            }`}
                        >
                            <div className={`p-2 rounded-lg ${accountType === 'corporate' ? 'bg-yellow-400 text-white' : 'bg-gray-100 text-gray-500'}`}>
                                <BiBuilding size={20} />
                            </div>
                            <div className="text-left">
                                <span className="block font-bold text-sm">Kurumsal</span>
                                <span className="text-xs opacity-70">Firma hesabı</span>
                            </div>
                        </button>
                    </div>
                </div>

                {/* 2. KİMLİK / FİRMA BİLGİLERİ */}
                <div className="space-y-5">
                    
                    {/* BİREYSEL FORM */}
                    {accountType === 'individual' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <InputGroup icon={<BiUser />} label="Ad" name="first_name" value={formData.first_name} onChange={handleChange} placeholder="Adınız" />
                            <InputGroup icon={<BiUser />} label="Soyad" name="last_name" value={formData.last_name} onChange={handleChange} placeholder="Soyadınız" />
                            <div className="md:col-span-2">
                                <InputGroup icon={<BiIdCard />} label="TC Kimlik No" name="tc_no" value={formData.tc_no} onChange={handleChange} maxLength="11" placeholder="11 haneli TC" />
                            </div>
                        </div>
                    )}

                    {/* KURUMSAL FORM */}
                    {accountType === 'corporate' && (
                        <div className="space-y-5">
                            <InputGroup icon={<BiBuilding />} label="Firma Adı" name="company_name" value={formData.company_name} onChange={handleChange} placeholder="Şirket Ünvanı A.Ş." />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <InputGroup icon={<BiMap />} label="Vergi Dairesi" name="tax_office" value={formData.tax_office} onChange={handleChange} placeholder="Daire Adı" />
                                <InputGroup icon={<BiIdCard />} label="Vergi No" name="tax_number" value={formData.tax_number} onChange={handleChange} maxLength="10" placeholder="10 haneli Vergi No" />
                            </div>
                        </div>
                    )}
                </div>

                {/* 3. İLETİŞİM & ADRES */}
                <div className="space-y-5 pt-4 border-t border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <InputGroup icon={<BiEnvelope />} label="E-posta" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="ornek@email.com" />
                        <InputGroup icon={<BiPhone />} label="Telefon" name="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="0555..." />
                    </div>
                    <div className="group">
                         <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Fatura Adresi</label>
                         <div className="relative">
                             <div className="absolute top-3.5 left-3.5 pointer-events-none text-gray-400"><BiMap size={20} /></div>
                             <textarea 
                                name="billing_address" 
                                rows="3" 
                                required 
                                className="w-full bg-white text-gray-900 text-sm rounded-xl border border-gray-300 focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/20 block pl-11 p-3.5 transition-all outline-none font-medium placeholder-gray-400 resize-none"
                                placeholder="Tam fatura adresi..."
                                value={formData.billing_address}
                                onChange={handleChange}
                            />
                         </div>
                    </div>
                </div>

                {/* 4. GÜVENLİK */}
                <div className="space-y-5 pt-4 border-t border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <InputGroup icon={<BiLockAlt />} label="Şifre" name="password" type="password" value={formData.password} onChange={handleChange} placeholder="******" />
                        <InputGroup icon={<BiCheckCircle />} label="Şifre Tekrar" name="password_confirm" type="password" value={formData.password_confirm} onChange={handleChange} placeholder="******" />
                    </div>
                </div>

                {/* ONAYLAR */}
                <div className="space-y-3 pt-2">
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
                        Kayıt Yapılıyor...
                    </>
                    ) : (
                    <>
                        Hesabı Oluştur <BiRightArrowAlt size={20} />
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