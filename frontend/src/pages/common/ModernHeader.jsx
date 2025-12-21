import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BiLogOut, BiUser, BiArrowBack, BiBell } from 'react-icons/bi';
import Logo from '../../assets/logo.png';

export const ModernHeader = ({ title, subtitle, user, showBackButton, onBackClick, onLogout, onProfileClick }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      navigate(-1); // Varsayılan olarak bir önceki sayfaya döner
    }
  };

  const handleProfile = () => {
    if (onProfileClick) {
      onProfileClick();
    } else {
      navigate('/profile');
    }
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      // Varsayılan bir logout fonksiyonu da buraya eklenebilir
      console.warn("ModernHeader: onLogout prop'u sağlanmadı.");
    }
  };

  return (
    <header className="top-0 z-20">
      <div className="max-w-7xl mx-auto px-5 py-4 flex justify-between items-center">

        {/* Sol Kısım: Başlık ve Geri Butonu */}
        <div className="flex items-center gap-4">
          {showBackButton && (
            <button
              onClick={handleBack}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
            >
              <BiArrowBack size={20} />
            </button>
          )}
          <div>
            <img
              src={Logo}
              alt="biHarçlık"
              className="h-12 md:h-10 w-auto object-contain"
            />
          </div>
        </div>

        {/* Sağ Kısım: Profil ve Çıkış Butonları */}
        <div className="flex items-center gap-3">
          {user && ( // Sadece user prop'u varsa profil butonunu göster
            <button
              onClick={handleProfile}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition text-gray-700"
            >
              <BiUser size={20} />
            </button>
          )}
          <button
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition text-gray-700"
          >
            <BiBell size={20} />
          </button>

          <button
            onClick={handleLogout}
            className="p-2 rounded-full bg-red-50 hover:bg-red-100 transition text-red-600"
          >
            <BiLogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};