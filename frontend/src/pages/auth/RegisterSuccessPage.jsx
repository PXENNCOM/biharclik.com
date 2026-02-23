import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BiCheckCircle, BiChevronLeft, BiRightArrowAlt } from 'react-icons/bi';
import LogoImage from '../../assets/yellow_logo.png';

export const RegisterSuccessPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col items-center">
      
      {/* HEADER */}
      <header className="w-full max-w-7xl px-6 py-8 flex justify-between items-center">
        <button onClick={() => navigate('/login')} className="p-2 text-gray-400 hover:text-black transition-colors">
          <BiChevronLeft size={28} />
        </button>
        <img src={LogoImage} alt="Logo" className="h-7 w-auto" />
        <div className="w-10"></div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 w-full max-w-lg">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="w-full flex flex-col items-center"
        >
          {/* SUCCESS ICON */}
          <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center text-white mb-8 shadow-xl shadow-yellow-200">
            <BiCheckCircle size={44} />
          </div>

          {/* TEXTS - STRICTLY SINGLE LINE */}
          <h2 className="text-2xl font-black text-gray-900 mb-2 whitespace-nowrap">Kayıt İşleminiz Başarılı!</h2>
          <p className="text-gray-500 font-bold text-sm mb-10 whitespace-nowrap">Kaydınız sonuçlandığında sizi bilgilendireceğiz.</p>

          {/* ACTION BUTTON */}
          <button
            onClick={() => navigate('/login')}
            className="w-full bg-gray-900 hover:bg-black text-white font-bold rounded-2xl py-4 transition-all active:scale-95 flex items-center justify-center gap-2 text-xs uppercase tracking-widest"
          >
            Giriş Sayfasına Dön <BiRightArrowAlt size={18} className="text-yellow-400" />
          </button>
        </motion.div>
      </main>

      {/* FOOTER */}
      <footer className="py-8">
        <p className="text-[10px] font-black text-gray-200 uppercase tracking-[0.4em]">Biharçlık • 2026</p>
      </footer>

    </div>
  );
};