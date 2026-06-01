import { useNavigate } from 'react-router-dom';
import { BiLogOut, BiUser, BiArrowBack, BiBell } from 'react-icons/bi';
import Logo from '../../assets/logo.png';

export const ModernHeader = ({ title, subtitle, user, showBackButton, onBackClick, onLogout, onProfileClick }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      navigate(-1);
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
      console.warn("ModernHeader: onLogout prop'u sağlanmadı.");
    }
  };

 const getProfilePhotoUrl = () => {
  if (user?.profile_photo) {
    if (user.profile_photo.startsWith('http')) {
      return user.profile_photo;
    }
    const baseURL = import.meta.env.VITE_BASE_URL || 'http://localhost:3001';
    return `${baseURL}${user.profile_photo}`;
  }
  return null;
};

  const profilePhotoUrl = getProfilePhotoUrl();

  return (
    <header className="top-0 z-20">
      <div className="max-w-7xl mx-auto px-5 py-4 flex justify-between items-center">
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

        <div className="flex items-center gap-3">
          {user && (
            <button
              onClick={handleProfile}
              className="relative rounded-full overflow-hidden ring-2 ring-gray-100 hover:ring-gray-200 transition"
            >
              {profilePhotoUrl ? (
                <img
                  src={profilePhotoUrl}
                  alt="Profil"
                  className="w-9 h-9 object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextElementSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div 
                className={`w-9 h-9 bg-gray-100 flex items-center justify-center text-gray-700 ${profilePhotoUrl ? 'hidden' : 'flex'}`}
              >
                <BiUser size={20} />
              </div>
            </button>
          )}
          <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition text-gray-700">
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