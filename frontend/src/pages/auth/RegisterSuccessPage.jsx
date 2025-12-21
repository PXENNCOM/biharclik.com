import { useLocation, useNavigate } from 'react-router-dom';
import { BiCheckCircle, BiRightArrowAlt, BiInfoCircle, BiStar } from 'react-icons/bi';

export const RegisterSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const message = location.state?.message || 'Kaydınız başarıyla alındı!';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 font-sans relative overflow-hidden">
      
      {/* Arka Plan Dekorasyonu */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-yellow-300 rounded-full blur-3xl opacity-20"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-200 rounded-full blur-3xl opacity-20"></div>
      </div>

      {/* Ana Kart */}
      <div className="max-w-md w-full bg-white rounded-[2.5rem] p-8 sm:p-12 shadow-2xl relative z-10 text-center mx-4 border border-gray-100">
        
        {/* İkon Animasyonu */}
        <div className="relative mb-8 inline-block">
            <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-75"></div>
            <div className="relative w-24 h-24 bg-green-100 rounded-full flex items-center justify-center shadow-sm">
                <BiCheckCircle size={48} className="text-green-600" />
            </div>
        </div>

        {/* Başlık ve Mesaj */}
        <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">
          Aramıza Hoş Geldin! 🎉
        </h2>
        <p className="text-gray-500 font-medium mb-8 leading-relaxed">
          {message}
        </p>

        {/* Aksiyon Butonu */}
        <button
          onClick={() => navigate('/login')}
          className="w-full bg-gray-900 hover:bg-black text-white font-bold rounded-2xl py-4 shadow-lg shadow-gray-200 transform transition active:scale-95 flex items-center justify-center gap-2 group"
        >
          <span>Giriş Sayfasına Dön</span>
          <BiRightArrowAlt size={24} className="group-hover:translate-x-1 transition-transform" />
        </button>
        
      </div>
    </div>
  );
};