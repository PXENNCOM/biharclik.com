import { useNavigate } from 'react-router-dom';
import { BiX, BiHome, BiRefresh } from 'react-icons/bi';

export const PaymentFailed = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-[2.5rem] p-8 md:p-12 max-w-md w-full border border-gray-100 text-center"
        style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.06)' }}>

        {/* İkon */}
        <div className="w-24 h-24 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
          <BiX size={48} className="text-red-500" />
        </div>

        {/* Başlık */}
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-red-400 mb-2">Ödeme Başarısız</p>
        <h1 className="text-3xl font-black text-gray-900 tracking-tighter mb-1">Bir sorun oluştu</h1>
        <p className="text-sm font-medium text-gray-400 mt-3 leading-relaxed">
          Ödemeniz işlenemedi. Kart bilgilerinizi kontrol edip tekrar deneyebilirsiniz.
        </p>

        {/* Olası nedenler */}
        <div className="mt-8 p-6 bg-red-50 rounded-2xl border border-red-100 text-left">
          <p className="text-[10px] font-black uppercase tracking-widest text-red-400 mb-4">Olası Nedenler</p>
          {[
            'Kart bilgileri hatalı girilmiş olabilir',
            'Kartınızda yeterli bakiye olmayabilir',
            '3D Secure doğrulaması tamamlanmamış olabilir',
          ].map((s, i) => (
            <div key={i} className="flex items-start gap-3 mb-3 last:mb-0">
              <div className="w-2 h-2 rounded-full bg-red-300 shrink-0 mt-1.5" />
              <p className="text-xs font-semibold text-red-700">{s}</p>
            </div>
          ))}
        </div>

        {/* Butonlar */}
        <div className="mt-6 flex flex-col gap-3">
          <button
            onClick={() => navigate('/#hizli-gonderi')}
            className="w-full h-12 rounded-2xl bg-[#FBCF2D] text-gray-900 text-[11px] font-black uppercase tracking-widest hover:bg-yellow-300 transition-all flex items-center justify-center gap-2"
          >
            <BiRefresh size={16} /> Tekrar Dene
          </button>
          <button
            onClick={() => navigate('/')}
            className="w-full h-12 rounded-2xl border border-gray-200 text-gray-500 text-[11px] font-black uppercase tracking-widest hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
          >
            <BiHome size={16} /> Ana Sayfaya Dön
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailed;