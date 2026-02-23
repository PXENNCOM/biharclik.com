import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { motion } from 'framer-motion'; // Animasyon için framer-motion ekledim

import {
  BiEnvelope,
  BiLockAlt,
  BiLoaderAlt,
  BiErrorCircle,
  BiPackage,
  BiUser,
  BiChevronLeft,
} from 'react-icons/bi';

import LogoImage from '../../../assets/yellow_logo.png';

const MobileLogin = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState('student'); // Başlangıçta öğrenci seçili


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
    <div className="min-h-screen flex flex-col bg-[#111827] font-sans overflow-x-hidden">
      
      {/* ÜST HEADER ALANI */}
      <div className="px-6 pt-12 pb-8 relative bg-[#111827]">
        <div className="flex justify-between items-center mb-8">
          <button 
            onClick={() => navigate(-1)} 
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white active:scale-90 transition-transform"
          >
            <BiChevronLeft size={28} />
          </button>

          {/* ANIMASYONLU LOGO */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ 
              y: [0, -5, 0], // Hafif yukarı aşağı süzülme animasyonu
              opacity: 1 
            }}
            transition={{ 
              y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
              opacity: { duration: 0.5 }
            }}
          >
            <img src={LogoImage} alt="Logo" className="h-10 w-auto object-contain drop-shadow-[0_0_10px_rgba(250,204,21,0.3)]" />
          </motion.div>
          
          <div className="w-10"></div> {/* Dengeli durması için boş div */}
        </div>

        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
        </motion.div>
      </div>

      {/* BEYAZ FORM KARTI */}
      <motion.div 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="flex-1 bg-white rounded-t-[40px] px-6 pt-10 pb-8 shadow-2xl mt-[-20px] z-10"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs flex items-center gap-2">
              <BiErrorCircle size={18} />
              {error}
            </div>
          )}

          {/* Email Girişi */}
          <div className="border border-gray-100 rounded-2xl p-3 shadow-sm focus-within:ring-2 focus-within:ring-yellow-400/50 transition-all">
            <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1 ml-1">E-POSTA ADRESİ</label>
            <div className="flex items-center gap-3">
              <BiEnvelope className="text-gray-400" size={22} />
              <input
                type="text"
                required
                className="w-full bg-transparent text-sm font-semibold text-gray-800 outline-none placeholder-gray-300"
                placeholder="ornek@email.com"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
              />
            </div>
          </div>

          {/* Şifre Girişi */}
          <div className="border border-gray-100 rounded-2xl p-3 shadow-sm focus-within:ring-2 focus-within:ring-yellow-400/50 transition-all">
            <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1 ml-1">ŞİFRE</label>
            <div className="flex items-center gap-3">
              <BiLockAlt className="text-gray-400" size={22} />
              <input
                type="password"
                required
                className="w-full bg-transparent text-sm font-semibold text-gray-800 outline-none placeholder-gray-300"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between px-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-yellow-400 focus:ring-yellow-400" />
              <span className="text-xs font-semibold text-gray-500">Beni Hatırla</span>
            </label>
            <a href="#" className="text-xs font-bold text-gray-400 hover:text-yellow-600">Şifremi Unuttum?</a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold rounded-2xl py-4 transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-yellow-400/20"
          >
            {loading ? <BiLoaderAlt className="animate-spin" size={22} /> : "Giriş Yap"}
          </button>
        </form>

        {/* AYIRICI */}
        <div className="relative my-10 text-center">
          <div className="absolute inset-0 flex items-center text-gray-100">
            <div className="w-full border-t border-gray-100"></div>
          </div>
          <span className="relative px-4 bg-white text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            Veya Kayıt Ol
          </span>
        </div>

        {/* ÖĞRENCİ / GÖNDERİCİ SEÇİMİ */}
<div className="bg-gray-100 p-1.5 rounded-[24px] flex mb-10 relative overflow-hidden">
  {/* Hareketli Sarı Arka Plan */}
  <motion.div 
    animate={{ x: selectedRole === 'student' ? '0%' : '100%' }}
    transition={{ type: "spring", stiffness: 300, damping: 30 }}
    className="absolute top-1.5 left-1.5 w-[calc(50%-6px)] bottom-1.5 bg-yellow-400 rounded-[18px] shadow-sm z-0"
  />

  {/* Öğrenci Butonu */}
  <Link
    to="/register/student"
    onMouseEnter={() => setSelectedRole('student')}
    className={`relative z-10 flex-1 flex items-center justify-center gap-2 py-3 rounded-[18px] transition-colors duration-300 ${
      selectedRole === 'student' ? 'text-gray-900' : 'text-gray-500'
    }`}
  >
    <BiUser size={18} />
    <span className="text-xs font-black uppercase tracking-tight">Öğrenci</span>
  </Link>
  
  {/* Gönderici Butonu */}
  <Link
    to="/register/sender"
    onMouseEnter={() => setSelectedRole('sender')}
    className={`relative z-10 flex-1 flex items-center justify-center gap-2 py-3 rounded-[18px] transition-colors duration-300 ${
      selectedRole === 'sender' ? 'text-gray-900' : 'text-gray-500'
    }`}
  >
    <BiPackage size={18} />
    <span className="text-xs font-black uppercase tracking-tight">Gönderici</span>
  </Link>
</div>

        <p className="text-center text-xs font-medium text-gray-400">
          © 2026 Biharçlık. Tüm hakları saklıdır.
        </p>
      </motion.div>
    </div>
  );
};

export default MobileLogin;