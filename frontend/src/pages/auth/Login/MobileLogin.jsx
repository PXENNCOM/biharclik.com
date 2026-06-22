import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { trackEvent } from '../../../utils/analytics';
import { ForgotPasswordModal } from '../../../components/common/ForgotPasswordModal';


import {
  BiEnvelope,
  BiLockAlt,
  BiLoaderAlt,
  BiErrorCircle,
  BiChevronLeft,
  BiShieldQuarter,
  BiRightArrowAlt
} from 'react-icons/bi';

import { UserPlus, PackageSearch, ArrowRight } from 'lucide-react'; // Premium İkon Seti

import LogoImage from '../../../assets/yellow_logo.png';

const MobileLogin = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState('student');
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setLoading(true);

  try {
    const user = await login(identifier, password);
    trackEvent('Giriş', 'giriş_başarılı', user.role);
    if (user.role === 'student') navigate('/student/dashboard');
    else if (user.role === 'sender') navigate('/sender/dashboard');
    else if (user.role === 'admin') navigate('/admin/dashboard');
  } catch (err) {
    const msg = err.response?.data?.message || 'Giriş yapılamadı. Bilgilerinizi kontrol edin.';
    setError(msg);
    trackEvent('Giriş', 'giriş_hatası', msg);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen flex flex-col bg-[#0F172A] font-sans antialiased selection:bg-yellow-200">

      {/* --- HEADER SECTION --- */}
      <div className="px-8 pt-16 pb-12 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-yellow-400/5 blur-[100px] rounded-full pointer-events-none" />

        <div className="flex justify-between items-center mb-10">
          <button
            onClick={() => navigate(-1)}
            className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-white/80 active:scale-90 transition-all backdrop-blur-md"
          >
            <BiChevronLeft size={30} />
          </button>
          <motion.img
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            src={LogoImage}
            alt="Logo"
            className="h-7 w-auto opacity-90 brightness-200 grayscale"
          />
          <div className="w-12" />
        </div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-light text-white tracking-tight leading-tight">
            Tekrar <span className="font-semibold text-yellow-400">Merhaba</span>
          </h1>
          <p className="text-slate-400 text-sm mt-2">Hesabına giriş yaparak devam et.</p>
        </motion.div>
      </div>

      {/* --- FORM SECTION --- */}
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        transition={{ type: "spring", damping: 30, stiffness: 120 }}
        className="flex-1 bg-[#F8FAFC] rounded-t-[45px] px-8 pt-12 pb-10 shadow-[0_-25px_60px_rgba(0,0,0,0.3)] z-10"
      >
        <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="p-4 rounded-2xl bg-red-50 border border-red-100 text-red-700 text-xs font-bold flex items-center gap-3 shadow-sm"
              >
                <BiErrorCircle size={22} className="shrink-0" />
                <span className="uppercase tracking-tight">{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-4">
            {/* E-posta Girişi */}
            <div className="group transition-all">
              <label className="block text-[9px] font-black text-slate-500 mb-1.5 ml-1 uppercase tracking-widest">E-POSTA ADRESİ</label>
              <div className="relative flex items-center">
                <div className="absolute left-4 text-slate-300 group-focus-within:text-yellow-500 transition-colors font-bold">
                  <BiEnvelope size={20} />
                </div>
                <input
                  type="email" required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="eposta@adresiniz.com"
                  className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-sm font-semibold text-slate-800 outline-none transition-all placeholder:text-slate-300 focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/5 shadow-sm"
                />
              </div>
            </div>

            {/* Şifre Girişi */}
            <div className="group transition-all">
              <label className="block text-[9px] font-black text-slate-500 mb-1.5 ml-1 uppercase tracking-widest">ŞİFRE</label>
              <div className="relative flex items-center">
                <div className="absolute left-4 text-slate-300 group-focus-within:text-yellow-500 transition-colors">
                  <BiLockAlt size={20} />
                </div>
                <input
                  type="password" required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-sm font-semibold text-slate-800 outline-none transition-all placeholder:text-slate-300 focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/5 shadow-sm"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between px-1">
            <label className="flex items-center gap-2 cursor-pointer group">
              <div className="relative flex items-center">
                <input type="checkbox" className="peer h-5 w-5 appearance-none rounded-lg border-2 border-slate-200 checked:bg-yellow-400 checked:border-yellow-400 transition-all" />
                <BiShieldQuarter className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-900 opacity-0 peer-checked:opacity-100 transition-opacity" size={12} />
              </div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-tight group-hover:text-slate-700 transition-colors">Beni Hatırla</span>
            </label>
            <button
              type="button"
              onClick={() => setForgotPasswordOpen(true)}
              className="text-[11px] font-bold text-slate-400 hover:text-yellow-600 transition-colors uppercase tracking-tight underline underline-offset-4"
            >
              Şifremi Unuttum
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-400 hover:bg-[#0F172A] text-white font-bold rounded-2xl py-5 transition-all active:scale-[0.98] shadow-2xl shadow-slate-300 uppercase tracking-[0.2em] text-sm flex items-center justify-center gap-3"
          >
            {loading ? <BiLoaderAlt className="animate-spin" size={24} /> : (
              <>
                <span className="text-black">Giriş Yap</span>
                <BiRightArrowAlt size={22} className="text-black" />
              </>
            )}
          </button>

          {/* AYIRICI */}
          <div className="relative py-8 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100"></div>
            </div>
            <span className="relative px-6 bg-[#F8FAFC] text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
              Veya Kayıt Ol
            </span>
          </div>

          <div className="space-y-6">
            <div className="space-y-3.5 mx-auto max-w-sm">
              <Link
                to="/hesap-olustur/ogrenci"
                className="group relative w-full flex items-center justify-between p-2.5 pr-5 rounded-3xl bg-white border border-slate-100 shadow-sm active:scale-[0.97] transition-all duration-300 hover:border-yellow-400 hover:shadow-lg hover:shadow-yellow-400/5 hover:-translate-y-0.5 overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-400/5 blur-[50px] rounded-full group-hover:bg-yellow-400/10 transition-colors" />

                <div className="flex items-center gap-4 relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-yellow-50 group-hover:border-yellow-100 group-hover:text-yellow-500 transition-all duration-300">
                    <UserPlus size={22} strokeWidth={1.5} /> {/* Lucide icon */}
                  </div>

                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-900 tracking-tight">Öğrenci Hesabı</span>
                    <span className="text-[11px] text-slate-500 mt-0.5">Harçlık Kazanmaya Başla</span>
                  </div>
                </div>

                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 opacity-0 group-hover:opacity-100 group-hover:bg-yellow-50 group-hover:text-yellow-600 transition-all duration-300 relative z-10">
                  <ArrowRight size={18} />
                </div>
              </Link>

              <Link
                to="/hesap-olustur/gonderici"
                className="group relative w-full flex items-center justify-between p-2.5 pr-5 rounded-3xl bg-white border border-slate-100 shadow-sm active:scale-[0.97] transition-all duration-300 hover:border-slate-900 hover:shadow-lg hover:shadow-slate-900/5 hover:-translate-y-0.5 overflow-hidden"
              >
                {/* Arka plan efekti */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-slate-900/5 blur-[50px] rounded-full group-hover:bg-slate-900/10 transition-colors" />

                <div className="flex items-center gap-4 relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-slate-50 group-hover:border-slate-100 group-hover:text-slate-900 transition-all duration-300">
                    <PackageSearch size={22} strokeWidth={1.5} /> {/* Lucide icon */}
                  </div>

                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-900 tracking-tight">Gönderici Hesabı</span>
                    <span className="text-[11px] text-slate-500 mt-0.5">Paket Gönderimi Yap</span>
                  </div>
                </div>

                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 opacity-0 group-hover:opacity-100 group-hover:bg-slate-50 group-hover:text-slate-900 transition-all duration-300 relative z-10">
                  <ArrowRight size={18} />
                </div>
              </Link>
            </div>
          </div>

          <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest pt-10">
            © 2026 Biharçlık • Güvenli Erişim
          </p>
        </form>
      </motion.div>

      <ForgotPasswordModal
        isOpen={forgotPasswordOpen}
        onClose={() => setForgotPasswordOpen(false)}
      />
    </div>
  );
};

export default MobileLogin;