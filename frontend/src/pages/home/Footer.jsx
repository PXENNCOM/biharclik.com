import { Link } from 'react-router-dom';

export const Footer = () => (
  <footer className="w-full px-6 py-12 bg-white flex flex-col items-center">
    
    {/* Üst İnce Çizgi ve Şehir Vurgusu */}
    <div className="w-full max-w-4xl flex items-center gap-4 mb-8">
      <div className="h-px flex-1 bg-gray-100" />
      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 whitespace-nowrap">
        BİHARÇLIK.COM
      </span>
      <div className="h-px flex-1 bg-gray-100" />
    </div>

    {/* Navigasyon Linkleri */}
    <nav className="flex flex-wrap justify-center gap-x-8 gap-y-4 mb-8">
      {[
        { name: 'İletişim', path: '/kurumsal?tab=iletisim' },
        { name: 'Hakkımızda', path: '/kurumsal?tab=hakkimizda' },
        { name: 'Teslimat ve İade Şartları', path: '/kurumsal?tab=teslimat' },
        { name: 'Gizlilik Sözleşmesi', path: '/kurumsal?tab=gizlilik' },
        { name: 'Mesafeli Satış Sözleşmesi', path: '/kurumsal?tab=satis' },
      ].map((link) => (
        <Link 
          key={link.name} 
          to={link.path} 
          className="text-[11px] font-bold text-gray-400 hover:text-gray-900 transition-colors tracking-tight"
        >
          {link.name}
        </Link>
      ))}
    </nav>

    {/* Marka ve Telif: Minimalist Dikey Yerleşim */}
    <div className="flex flex-col items-center gap-1 mb-6">
      <div className="text-[13px] font-black text-gray-900 tracking-tighter mb-1">
        <img src="/logo.png" alt="Biharçlık Logo" className="w-8 h-auto" />
      </div>
      <p className="text-[9px] font-medium text-gray-300 uppercase tracking-widest">
        © 2026 — Tüm Hakları Saklıdır.
      </p>
    </div>

    {/* Güvenli Ödeme Logoları (iyzico & Kartlar) */}
    <div className="w-full max-w-md flex justify-center items-center opacity-100">
      <img 
        src="/logo_band_colored@3x.png" 
        alt="Güvenli Ödeme Yöntemleri" 
        className="h-6 md:h-7 w-auto object-contain"
      />
    </div>

    {/* Alt Süsleme: Metro Hattı İzlenimi */}
    <div className="mt-6 flex gap-1.5">
      <div className="w-1.5 h-1.5 rounded-full bg-gray-100" />
      <div className="w-1.5 h-1.5 rounded-full bg-[#FBCF2D]" />
      <div className="w-1.5 h-1.5 rounded-full bg-gray-100" />
    </div>
  </footer>
);