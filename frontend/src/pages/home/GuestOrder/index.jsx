import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Zap, ShieldCheck, Headset } from 'lucide-react';
import { BiChevronRight, BiChevronLeft, BiCreditCard } from 'react-icons/bi';

import { StepIndicator } from './StepIndicator';
import { MapPicker } from './MapPicker';
import { Step0 } from './Steps/Step0';
import { Step1 } from './Steps/Step1';
import { Step2 } from './Steps/Step2';
import { Step3 } from './Steps/Step3';
import { Step4 } from './Steps/Step4';
import { STEPS, MIN_AMOUNT, INITIAL_DATA, validateStep } from './constants';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export const GuestOrderSection = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [data, setData] = useState(INITIAL_DATA);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [mapTarget, setMapTarget] = useState(null);
  const [checkoutFormContent, setCheckoutFormContent] = useState(null);
  const [currentOrderNumber, setCurrentOrderNumber] = useState(null);

  const onChange = (key, val) => {
    setData(prev => ({ ...prev, [key]: val }));
    if (errors[key]) setErrors(prev => { const e = { ...prev }; delete e[key]; return e; });
  };

  const next = () => {
    const errs = validateStep(step, data);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setStep(s => s + 1);
  };

  const back = () => { setErrors({}); setStep(s => s - 1); };

  const handleMapSelect = (coords) => {
    if (mapTarget === 'pickup') {
      onChange('pickup_latitude', coords.lat);
      onChange('pickup_longitude', coords.lng);
    } else {
      onChange('delivery_latitude', coords.lat);
      onChange('delivery_longitude', coords.lng);
    }
    setMapTarget(null);
  };

  const submitAndPay = async () => {
    console.log('API_URL:', API_URL); // ⭐
    const errs = validateStep(3, data);
    console.log('Validasyon hataları:', errs);  // ⭐
    console.log('Data:', data);                  // ⭐
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    setApiError('');

    try {
      console.log('İstek atılıyor...'); // ⭐
      console.log('İstek atılıyor...');
const rawRes = await fetch(`${API_URL}/deliveries/guest`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    guest_name: data.guest_name,
    guest_phone: data.guest_phone || data.pickup_contact_phone,
    pickup_address: data.pickup_address,
    pickup_district: data.pickup_district,
    pickup_latitude: data.pickup_latitude,
    pickup_longitude: data.pickup_longitude,
    pickup_contact_name: data.pickup_contact_name,
    pickup_contact_phone: data.pickup_contact_phone,
    pickup_notes: data.pickup_notes || null,
    delivery_address: data.delivery_address,
    delivery_district: data.delivery_district,
    delivery_latitude: data.delivery_latitude,
    delivery_longitude: data.delivery_longitude,
    delivery_contact_name: data.delivery_contact_name,
    delivery_contact_phone: data.delivery_contact_phone,
    delivery_notes: data.delivery_notes || null,
    package_description: data.package_description,
    package_size: data.package_size,
    payment_amount: Number(data.payment_amount),
    notes: data.notes || null,
  })
});
const deliveryRes = { data: await rawRes.json() };
console.log('✅ Delivery:', deliveryRes.data);


      const delivery = deliveryRes.data.data;
      if (!delivery || !delivery.id) throw new Error('Sipariş oluşturulamadı');

      setCurrentOrderNumber(delivery.order_number);

      // 2. Payment initialize
      const nameParts = data.guest_name.trim().split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ') || nameParts[0];

      const paymentRes = await axios.post(`${API_URL}/payments/initialize-guest/${delivery.id}`, {
        name: firstName,
        surname: lastName,
        email: data.guest_email,
        phone: data.pickup_contact_phone,
      });
    console.log('✅ Payment:', paymentRes.data);


      setCheckoutFormContent(paymentRes.data.data.checkoutFormContent);
      setStep(4);

    } catch (err) {
      console.error('❌ Hata:', err.response?.data || err.message); // ⭐
      setApiError(err.response?.data?.message || 'Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  const stepComponents = [
    <Step0 data={data} onChange={onChange} errors={errors} />,
    <Step1 data={data} onChange={onChange} errors={errors} onOpenMap={setMapTarget} />,
    <Step2 data={data} onChange={onChange} errors={errors} onOpenMap={setMapTarget} />,
    <Step3 data={data} onChange={onChange} errors={errors} />,
    <Step4 checkoutFormContent={checkoutFormContent} orderNumber={currentOrderNumber} amount={data.payment_amount} />,
  ];

  return (
    <>
      {mapTarget && (
        <MapPicker
          title={mapTarget === 'pickup' ? 'Alış Noktası Konumu' : 'Teslimat Noktası Konumu'}
          initialLat={mapTarget === 'pickup' ? data.pickup_latitude : data.delivery_latitude}
          initialLng={mapTarget === 'pickup' ? data.pickup_longitude : data.delivery_longitude}
          onSelect={handleMapSelect}
          onClose={() => setMapTarget(null)}
        />
      )}

      <section id="hizli-gonderi" className="py-20 md:py-32 px-4 md:px-6 bg-gray-50/60">
        <div className="max-w-6xl mx-auto">

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 md:mb-16">
            <div>
              <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-gray-900">
                Kayıtsız paket gönder<span className="text-[#FBCF2D]">.</span>
              </h2>
              <p className="text-xs md:text-sm font-medium text-gray-400 mt-3 max-w-md leading-relaxed">
                Hesap oluşturmadan sipariş verin, anında kart ile ödeyin.
              </p>
            </div>
            <div className="w-full max-w-md flex justify-center items-center opacity-75 hover:opacity-100 transition-opacity duration-300">
      <img 
        src="/logo_band_colored@3x.png" 
        alt="Güvenli Ödeme Yöntemleri" 
        className="h-6 md:h-7 w-auto object-contain"
      />
    </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7">
              <div className="bg-white rounded-[2.5rem] p-6 md:p-10 border border-gray-100" style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.03)' }}>
                <StepIndicator current={step} />

                <div className="mb-7">
                  <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#FBCF2D] mb-1">Adım {step + 1} / {STEPS.length}</p>
                  <h3 className="text-xl font-black text-gray-900 tracking-tight">{STEPS[step]}</h3>
                </div>

                {stepComponents[step]}

                {apiError && (
                  <div className="mt-5 p-4 bg-red-50 rounded-2xl border border-red-100">
                    <p className="text-[11px] font-bold text-red-600">{apiError}</p>
                  </div>
                )}

                {/* Step 4'te footer gizle */}
                {step < 4 && (
                  <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-50">
                    {step > 0 ? (
                      <button onClick={back} className="flex items-center gap-2 h-11 px-5 rounded-full border border-gray-200 text-[11px] font-black text-gray-500 uppercase tracking-widest hover:bg-gray-50 transition-all">
                        <BiChevronLeft size={16} /> Geri
                      </button>
                    ) : <div />}

                    {step < 3 ? (
                      <button onClick={next} className="flex items-center gap-2 h-11 px-7 rounded-full bg-gray-900 text-[#FBCF2D] text-[11px] font-black uppercase tracking-widest hover:bg-black transition-all active:scale-95">
                        İleri <BiChevronRight size={16} />
                      </button>
                    ) : (
                      <button onClick={submitAndPay} disabled={loading} className="flex items-center gap-2 h-11 px-7 rounded-full bg-[#FBCF2D] text-gray-900 text-[11px] font-black uppercase tracking-widest hover:bg-yellow-300 transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed">
                        {loading
                          ? <><div className="w-4 h-4 rounded-full border-2 border-gray-900/30 border-t-gray-900 animate-spin" /> Hazırlanıyor...</>
                          : <><BiCreditCard size={16} /> Ödemeye Geç</>
                        }
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col gap-4 lg:sticky lg:top-8">
              <div className="bg-gray-900 rounded-[2rem] p-7">
                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[#FBCF2D] mb-5">Nasıl Çalışır?</p>
                <div className="flex flex-col gap-5">
                  {[
                    { n: '01', t: 'Formu doldurun', d: 'Alış ve teslimat adreslerini girin, harçlık belirleyin.' },
                    { n: '02', t: 'Kart ile ödeyin', d: 'Güvenli iyzico altyapısı ile anında ödeme yapın.' },
                    { n: '03', t: 'Kurye eşleşir', d: 'Güzergahına uyan öğrenci kurye paketi teslim alır.' },
                    { n: '04', t: 'Teslimat tamam', d: 'Paketiniz güvenle ulaşır, kurye harçlığını kazanır.' },
                  ].map((s) => (
                    <div key={s.n} className="flex gap-4">
                      <span className="text-[10px] font-black text-[#FBCF2D]/50 w-6 shrink-0 mt-0.5">{s.n}</span>
                      <div>
                        <p className="text-[11px] font-black text-white mb-0.5">{s.t}</p>
                        <p className="text-[10px] font-medium text-white/40 leading-relaxed">{s.d}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-[#FBCF2D]/10 rounded-[2rem] p-6 border border-[#FBCF2D]/20">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Minimum Harçlık</p>
                <p className="text-3xl font-black text-gray-900 tracking-tighter">{MIN_AMOUNT}₺</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default GuestOrderSection;