import { Link } from 'react-router-dom';
import { BiPlus, BiUser, BiNavigation, BiMenuAltLeft } from 'react-icons/bi';
import LogoIcon from '../../assets/logo.png';

export const Navbar = () => (
  <header className="fixed top-4 md:top-6 left-0 right-0 md:left-1/2 md:-translate-x-1/2 z-50 px-4 md:px-0 w-full md:w-max">
    {/* Ana Navigasyon Konteyneri */}
    <nav className="flex items-center justify-between md:justify-start gap-3 md:gap-6 py-2.5 md:py-3 px-3 md:px-6 bg-white border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.06)] rounded-2xl md:rounded-full backdrop-blur-lg bg-white/95">
      
      {/* 1. Bölüm: Logo ve Mobil Menü */}
      <div className="flex items-center gap-2 md:gap-4">
        <Link to="/" className="w-10 h-10 bg-[#FBCF2D] rounded-full flex items-center justify-center shadow-sm flex-shrink-0 transition-transform active:scale-95">
          <img src={LogoIcon} alt="B" className="w-5 h-5 object-contain brightness-0 invert" />
        </Link>
        
        {/* Masaüstü Linkleri (Mobilde Gizli) */}
        <div className="hidden md:flex items-center gap-2 border-l border-gray-100 pl-4">
          <a href="#nasil-calisir" title="Nasıl Çalışır?" className="text-gray-400 hover:text-gray-900 p-2 rounded-full hover:bg-gray-50 transition-all">
            <BiNavigation size={22} />
          </a>
          <a href="#sss" title="Soru & Cevap" className="text-gray-400 hover:text-gray-900 p-2 rounded-full hover:bg-gray-50 transition-all">
            <BiMenuAltLeft size={22} />
          </a>
        </div>
      </div>

      {/* Ortadaki Ayırıcı Çizgi (Mobilde Gizli) */}
      <div className="hidden md:block w-px h-8 bg-gray-100" />

      {/* 2. Bölüm: Aksiyonlar */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* İlan Ver (Mobilde Metin Kısaltıldı veya Gizlendi) */}
        <Link 
          to="/hesap-olustur/gonderici" 
          className="group flex items-center gap-2 h-10 md:h-11 px-4 md:px-5 bg-gray-900 text-[#FBCF2D] rounded-xl md:rounded-full transition-all active:scale-95 shadow-lg shadow-gray-900/10"
        >
          <BiPlus size={20} className="transition-transform group-hover:rotate-90 shrink-0" />
          <span className="text-[11px] md:text-xs font-black text-white group-hover:text-[#FBCF2D] whitespace-nowrap">
            {/* Mobilde kısa, masaüstünde uzun metin */}
            <span className="md:hidden uppercase tracking-tight">Hızlı Gönder</span>
            <span className="hidden md:inline">Hızlı Gönderi Oluştur</span>
          </span>
        </Link>
        
        {/* Profil / Giriş */}
        <Link 
          to="/login" 
          className="w-10 h-10 md:w-11 md:h-11 border-2 border-gray-100 text-gray-500 rounded-xl md:rounded-full flex items-center justify-center transition-all active:bg-gray-100 hover:border-[#FBCF2D]"
          title="Giriş Yap"
        >
          <BiUser size={20} />
        </Link>
      </div>

    </nav>
  </header>
);