import { useState, useEffect } from 'react';
import { BiMapPin } from 'react-icons/bi';

const ISTANBUL_DISTRICTS = [
  'Kadıköy', 'Beşiktaş', 'Şişli', 'Üsküdar', 'Fatih',
  'Bakırköy', 'Maltepe', 'Ataşehir', 'Sarıyer', 'Başakşehir',
  'Beyoğlu', 'Kartal', 'Pendik', 'Ümraniye', 'Kağıthane',
];

export const TypewriterDistricts = () => {
  const [currentText, setCurrentText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(100);

  useEffect(() => {
    const fullText = ISTANBUL_DISTRICTS[currentIndex];

    const handleType = () => {
      if (isDeleting) {
        setCurrentText(fullText.substring(0, currentText.length - 1));
        setTypingSpeed(40); // Silme biraz daha hızlı
      } else {
        setCurrentText(fullText.substring(0, currentText.length + 1));
        setTypingSpeed(100);
      }

      if (!isDeleting && currentText === fullText) {
        setTimeout(() => setIsDeleting(true), 2500); // Kelime bittiğinde daha uzun bekle
      } else if (isDeleting && currentText === '') {
        setIsDeleting(false);
        setCurrentIndex((prev) => (prev + 1) % ISTANBUL_DISTRICTS.length);
      }
    };

    const timer = setTimeout(handleType, typingSpeed);
    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentIndex, typingSpeed]);

  return (
    <div className="group flex items-center gap-2.5 px-4 py-2 bg-white/60 backdrop-blur-md border border-gray-100 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all hover:border-yellow-200">
      {/* Pulse Efektli İkon Konteynırı */}
      <div className="relative flex items-center justify-center">
        <div className="absolute inset-0 bg-yellow-400/20 rounded-full animate-ping" />
        <BiMapPin className="relative text-[#FBCF2D] shrink-0" size={18} />
      </div>

      <div className="flex items-center gap-1.5 overflow-hidden">
        {/* Mobilde "Bölgeler:" olarak kısalır, desktopta tam metin */}
        <span className="text-[11px] md:text-xs text-gray-400 font-bold uppercase tracking-wider whitespace-nowrap">
          <span className="md:hidden">Bölgeler:</span>
          <span className="hidden md:inline">Aktif Teslimat Bölgeleri:</span>
        </span>

        {/* Yazı Alanı */}
        <div className="flex items-center min-w-[80px] md:min-w-[110px]">
          <span className="text-xs md:text-sm font-black text-gray-900 tracking-tight">
            {currentText}
          </span>
          <span className="inline-block w-1 h-3.5 bg-[#FBCF2D] ml-1 rounded-full animate-pulse shadow-[0_0_8px_rgba(251,207,45,0.6)]" />
        </div>
      </div>
    </div>
  );
};