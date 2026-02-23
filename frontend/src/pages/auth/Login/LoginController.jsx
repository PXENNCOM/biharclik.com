import { useState, useEffect } from 'react';
import DesktopLogin from './DesktopLogin';
import MobileLogin from './MobileLogin';

export const LoginController = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Ekran boyutunu kontrol eden fonksiyon
    const checkScreenSize = () => {
      // 1024px (lg breakpoint) altında mobil görünüm
      setIsMobile(window.innerWidth < 1024);
    };

    // İlk yüklemede kontrol et
    checkScreenSize();

    // Ekran boyutu değiştiğinde kontrol et
    window.addEventListener('resize', checkScreenSize);

    // Cleanup - component unmount olduğunda event listener'ı kaldır
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Ekran boyutuna göre uygun komponenti render et
  return isMobile ? <MobileLogin /> : <DesktopLogin />;
};