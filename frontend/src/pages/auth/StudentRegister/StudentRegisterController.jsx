import { useState, useEffect } from 'react';
import DesktopStudentRegister from './DesktopStudentRegister';
import MobileStudentRegister from './MobileStudentRegister';

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

  return isMobile ? <MobileStudentRegister /> : <DesktopStudentRegister />;
};

export default SenderRegisterController;