import { useState, useEffect } from 'react';
import DesktopSenderRegister from './DesktopSenderRegister';
import MobileSenderRegister from './MobileSenderRegister.jsx';

 const SenderRegisterController = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return isMobile ? <MobileSenderRegister /> : <DesktopSenderRegister />;
};

export default SenderRegisterController;