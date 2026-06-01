import { useSearchParams, useNavigate } from 'react-router-dom';
import { BiCheck, BiHome } from 'react-icons/bi';

export const PaymentSuccess = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const orderNumber = params.get('order') || 'ORD-7241';

  return (
    // min-h-screen yerine dikey padding (py) kullanarak sayfanın aşırı uzamasını engelledik
    <div className="bg-[#fafafa] py-12 md:py-20 px-6 flex justify-center">
      <div className="max-w-[400px] w-full bg-white rounded-[2.5rem] p-8 md:p-10 shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-gray-100">
        
        {/* Üst Kısım */}
        <div className="text-center">
          <div className="inline-flex mb-6">
            <div className="w-16 h-16 rounded-full bg-[#FBCF2D] flex items-center justify-center shadow-[0_4px_20px_rgba(251,207,45,0.3)]">
              <BiCheck size={32} className="text-gray-900" />
            </div>
          </div>

          <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#d4af20] mb-2">İşlem Başarılı</p>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            Ödeme Alındı
          </h1>
          <p className="text-xs font-medium text-gray-400 mt-2 leading-relaxed">
            Siparişiniz sisteme düştü, kurye süreci başladı.
          </p>
        </div>

        {/* Sipariş No - Makbuz Görünümü */}
        <div className="my-8 py-4 px-6 bg-gray-50 rounded-2xl border-dashed border-2 border-gray-100 flex justify-between items-center">
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Takip No</span>
          <span className="text-sm font-black text-gray-900 tracking-widest">{orderNumber}</span>
        </div>

        {/* Adımlar - Daha kompakt yapı */}
        <div className="space-y-4 mb-8">
          {[
            { t: 'Ödeme Onaylandı', s: true },
            { t: 'Kurye Atanıyor', s: false },
            { t: 'SMS Bilgilendirmesi yapılacaktır', s: false }
          ].map((step, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className={`w-1.5 h-1.5 rounded-full ${i === 0 ? 'bg-[#FBCF2D]' : 'bg-gray-200'}`} />
              <span className={`text-[11px] font-bold uppercase tracking-wider ${i === 0 ? 'text-gray-900' : 'text-gray-400'}`}>
                {step.t}
              </span>
            </div>
          ))}
        </div>

        {/* Aksiyon Butonu */}
        <button
          onClick={() => navigate('/')}
          className="w-full h-12 rounded-xl bg-gray-900 text-white transition-all hover:bg-black active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-gray-200"
        >
          <BiHome size={16} className="text-[#FBCF2D]" />
          <span className="text-[11px] font-bold uppercase tracking-widest text-white">Ana Sayfa</span>
        </button>

      </div>
    </div>
  );
};

export default PaymentSuccess;