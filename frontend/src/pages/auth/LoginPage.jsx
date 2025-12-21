import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// ✨ BoxIcons
import { 
  BiEnvelope, 
  BiLockAlt, 
  BiRightArrowAlt, 
  BiLoaderAlt, 
  BiErrorCircle,
  BiPackage,
  BiUser
} from 'react-icons/bi';

import LogoImage from '../../assets/yellow_logo.png'; 
import HeroImage from '../../assets/login-hero.png'; 

export const LoginPage = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(identifier, password);
      if (user.role === 'student') navigate('/student/dashboard');
      else if (user.role === 'sender') navigate('/sender/dashboard');
      else if (user.role === 'admin') navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Giriş yapılamadı. Bilgilerinizi kontrol edin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white font-sans text-gray-900">
      
      {/* --- SOL TARAF: MARKA & GÖRSEL ALANI --- */}
      <div className="lg:w-5/12 bg-gray-900 text-white flex flex-col relative overflow-hidden min-h-[300px] lg:min-h-screen">
        
        {/* Görsel ve Karartma */}
        <img 
          src={HeroImage} 
          alt="Kurye teslimat" 
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
        <div className="absolute inset-0 bg-gray-900/80 z-10"></div>

        {/* ✨ LOGO ALANI (ORTALANMIŞ) */}
        {/* flex-1: Boş alanı kapla, flex items-center justify-center: İçeriği tam ortala */}
        <div className="relative z-20 flex-1 flex items-center justify-center p-12">
          <img 
            src={LogoImage} 
            alt="Biharçlık Logo" 
            className="w-48 h-auto object-contain drop-shadow-2xl" // Logo boyutunu w-48 ile büyüttüm, istersen değiştirebilirsin
          />
        </div>

        {/* Footer (Alt Kısım) */}
        <div className="relative z-20 text-sm text-gray-400 font-medium text-center pb-8">
          © 2025 Biharçlık. Tüm hakları saklıdır.
        </div>
      </div>

      {/* --- SAĞ TARAF: FORM ALANI --- */}
      <div className="lg:w-7/12 flex items-center justify-center p-6 sm:p-12 lg:p-24 bg-white relative">
        
        {/* Mobil Görünüm İçin Üst Logo (Sadece küçük ekranda çıkar) */}
        <div className="absolute top-6 left-6 lg:hidden">
             <img src={LogoImage} alt="Biharçlık Logo" className="h-8 w-auto" />
        </div>

        <div className="w-full max-w-[420px] mt-10 lg:mt-0">
          
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-2 font-heading">Tekrar Hoş Geldiniz</h2>
            <p className="text-gray-500 font-medium">Devam etmek için lütfen giriş yapın.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {error && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm flex items-start gap-3 font-medium">
                <BiErrorCircle className="mt-0.5 min-w-[18px]" size={20} />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-5">
              {/* Email Input */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">E-posta veya Telefon</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-gray-900 transition-colors">
                    <BiEnvelope size={20} />
                  </div>
                  <input
                    type="text"
                    required
                    className="w-full bg-white text-gray-900 text-sm rounded-xl border border-gray-300 focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/20 block pl-11 p-3.5 transition-all duration-200 outline-none placeholder-gray-400 font-medium"
                    placeholder="ornek@email.com"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-bold text-gray-700">Şifre</label>
                  <a href="#" className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline">Şifremi unuttum?</a>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-gray-900 transition-colors">
                    <BiLockAlt size={20} />
                  </div>
                  <input
                    type="password"
                    required
                    className="w-full bg-white text-gray-900 text-sm rounded-xl border border-gray-300 focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/20 block pl-11 p-3.5 transition-all duration-200 outline-none placeholder-gray-400 font-medium"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-900 hover:bg-black text-white font-bold rounded-xl py-3.5 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-gray-200"
            >
              {loading ? (
                <>
                  <BiLoaderAlt className="animate-spin" size={20} />
                  Giriş Yapılıyor...
                </>
              ) : (
                <>
                  Giriş Yap <BiRightArrowAlt size={20} />
                </>
              )}
            </button>
          </form>

          {/* Kayıt Ol Alanı */}
          <div className="mt-10 pt-6 border-t border-gray-100">
            <p className="text-center text-sm text-gray-500 mb-4 font-medium">Henüz bir hesabınız yok mu?</p>
            <div className="grid grid-cols-2 gap-3">
              <Link 
                to="/register/student" 
                className="flex items-center justify-center gap-2 p-3 rounded-xl border border-gray-200 text-gray-700 font-bold hover:border-yellow-400 hover:bg-yellow-50 transition-colors group"
              >
                <BiUser className="text-gray-400 group-hover:text-yellow-600 transition-colors" size={20} />
                <span>Öğrenci</span>
              </Link>
              <Link 
                to="/register/sender" 
                className="flex items-center justify-center gap-2 p-3 rounded-xl border border-gray-200 text-gray-700 font-bold hover:border-blue-400 hover:bg-blue-50 transition-colors group"
              >
                <BiPackage className="text-gray-400 group-hover:text-blue-600 transition-colors" size={20} />
                <span>Gönderici</span>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};