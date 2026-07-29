import { useState, useEffect } from 'react';
import { BiLogoWhatsapp } from 'react-icons/bi';

const WHATSAPP_NUMBER = '905534126034';
const DEFAULT_MESSAGE = 'Merhaba, bir öğrenci kuryemiz aracılığıyla paket göndermek istiyorum.';

export const WhatsAppButton = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [autoShow, setAutoShow] = useState(true); // İlk açılışta göster

  useEffect(() => {
    // İlk gösterimi 3 saniye sonra kapat
    const initialTimeout = setTimeout(() => setAutoShow(false), 3000);

    // Her 10 saniyede bir tekrar göster, 2.5 saniye sonra kapat
    const interval = setInterval(() => {
      setAutoShow(true);
      setTimeout(() => setAutoShow(false), 2500);
    }, 10000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, []);

  const handleClick = () => {
    const encodedMessage = encodeURIComponent(DEFAULT_MESSAGE);
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  const showLabel = isHovered || autoShow;

  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Etiket */}
      <div
        className={`
          bg-gray-900 text-white text-sm font-bold px-4 py-2.5 rounded-2xl shadow-lg
          transition-all duration-500 ease-out whitespace-nowrap
          ${showLabel ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 pointer-events-none'}
        `}
      >
        Hemen paket gönder
      </div>

      {/* Buton */}
      <button
        onClick={handleClick}
        aria-label="WhatsApp ile iletişime geç"
        className="relative w-14 h-14 md:w-16 md:h-16 bg-green-500 hover:bg-green-600 rounded-full shadow-lg shadow-green-500/40 flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
      >
        <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-60"></span>
        <BiLogoWhatsapp size={30} className="relative text-white md:w-8 md:h-8" />
      </button>
    </div>
  );
};

export default WhatsAppButton;