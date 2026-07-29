import { useState } from 'react';
import { BiChevronLeft, BiChevronRight, BiCheckCircle, BiCopy } from 'react-icons/bi';
import { Step0 } from './Steps/Step0';
import { Step1 } from './Steps/Step1';
import { Step2 } from './Steps/Step2';
import { Step3 } from './Steps/Step3';
import { StepIndicator } from './StepIndicator';
import { MapPicker } from './MapPicker';
import { INITIAL_DATA, validateStep } from './constants';
import { deliveryService } from '../../../services/deliveryService';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const SuccessScreen = ({ orderNumber }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(orderNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex flex-col items-center justify-center py-14 gap-6 text-center">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
        <BiCheckCircle size={40} className="text-green-600" />
      </div>
      <div>
        <h3 className="text-2xl font-black text-gray-900 mb-2">Siparişiniz Alındı!</h3>
        <p className="text-gray-500 text-sm max-w-sm mx-auto">
          Siparişiniz sisteme kaydedildi. Güzergahına uygun bir kurye en kısa sürede atanacak, sizi arayacağız.
        </p>
      </div>
      <button onClick={handleCopy} className="bg-gray-900 rounded-2xl px-8 py-4 flex items-center gap-4 hover:bg-black transition-all">
        <div className="text-left">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Sipariş No</p>
          <p className="text-xl font-black text-[#FBCF2D]">{orderNumber}</p>
        </div>
        <BiCopy size={18} className="text-gray-500" />
      </button>
      <p className="text-xs text-gray-400">{copied ? 'Kopyalandı ✓' : 'Bu numarayı not alın, takip için kullanabilirsiniz.'}</p>
    </div>
  );
};

const GuestOrder = () => {
  const [step, setStep] = useState(0);
  const [data, setData] = useState(INITIAL_DATA);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [orderNumber, setOrderNumber] = useState(null);
  const [mapTarget, setMapTarget] = useState(null); // 'pickup' | 'delivery' | null

  const onChange = (key, value) => {
    setData(prev => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors(prev => { const e = { ...prev }; delete e[key]; return e; });
  };

  const onOpenMap = (target) => setMapTarget(target);

  const handleMapSelect = ({ lat, lng, address }) => {
  if (mapTarget === 'pickup') {
    onChange('pickup_latitude', lat);
    onChange('pickup_longitude', lng);
    if (address) onChange('pickup_address', address); // adres bulunduysa inputu doldur
  } else if (mapTarget === 'delivery') {
    onChange('delivery_latitude', lat);
    onChange('delivery_longitude', lng);
    if (address) onChange('delivery_address', address);
  }
  setMapTarget(null);
};

  const handleNext = () => {
    const errs = validateStep(step, data);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setStep(s => s + 1);
  };

  const handleBack = () => { setErrors({}); setStep(s => s - 1); };

const handleSubmit = async () => {
  const errs = validateStep(3, data);
  if (Object.keys(errs).length) { setErrors(errs); return; }

  setLoading(true);
  setApiError('');

  try {
    const result = await deliveryService.createGuestDelivery({
      guest_name: data.guest_name,
      guest_phone: data.guest_phone,
      pickup_address: data.pickup_address,
      pickup_district: data.pickup_district,
      pickup_latitude: data.pickup_latitude,
      pickup_longitude: data.pickup_longitude,
      pickup_contact_name: data.pickup_contact_name || data.guest_name,
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
    });

    setOrderNumber(result.data?.order_number);
    setStep(4); // success screen
  } catch (err) {
    setApiError(err.response?.data?.message || err.message || 'Bir hata oluştu. Lütfen tekrar deneyin.');
  } finally {
    setLoading(false);
  }
};

  const isLastStep = step === 3;
  const showFooter = step < 4;

  return (
    <section id="hizli-gonderi" className="py-20 md:py-32 px-4 md:px-6 bg-gray-50/60">
      <div className="max-w-2xl mx-auto">

        <div className="mb-8 text-center">
          <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-gray-900">
            Hızlı paket gönder<span className="text-[#FBCF2D]">.</span>
          </h2>
          <p className="text-sm font-medium text-gray-400 mt-2">
            Üyelik gerektirmez — bilgilerini gir, siparişini oluştur.
          </p>
        </div>

        {step < 4 && <StepIndicator current={step} />}

        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8">
            {step === 0 && <Step0 data={data} onChange={onChange} errors={errors} />}
            {step === 1 && <Step1 data={data} onChange={onChange} errors={errors} onOpenMap={onOpenMap} />}
            {step === 2 && <Step2 data={data} onChange={onChange} errors={errors} onOpenMap={onOpenMap} />}
            {step === 3 && <Step3 data={data} onChange={onChange} errors={errors} />}
            {step === 4 && <SuccessScreen orderNumber={orderNumber} />}

            {apiError && (
              <div className="mt-5 p-4 bg-red-50 rounded-2xl border border-red-100">
                <p className="text-xs font-bold text-red-600">{apiError}</p>
              </div>
            )}
          </div>

          {showFooter && (
            <div className="px-8 py-5 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
              {step > 0 ? (
                <button onClick={handleBack} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-200 transition-all">
                  <BiChevronLeft size={18} /> Geri
                </button>
              ) : <div />}

              {!isLastStep ? (
                <button onClick={handleNext} className="flex items-center gap-2 px-7 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-bold hover:bg-black transition-all shadow-lg shadow-gray-200">
                  Devam Et <BiChevronRight size={18} />
                </button>
              ) : (
                <button onClick={handleSubmit} disabled={loading}
                  className="flex items-center gap-2 px-8 py-2.5 rounded-xl bg-[#FBCF2D] text-gray-900 text-sm font-black hover:bg-yellow-300 transition-all shadow-lg shadow-yellow-100 disabled:opacity-50">
                  {loading ? 'Oluşturuluyor...' : <><BiCheckCircle size={18} /> Siparişi Oluştur</>}
                </button>
              )}
            </div>
          )}
        </div>

      </div>

      {mapTarget && (
        <MapPicker
          title={mapTarget === 'pickup' ? 'Alış Noktası' : 'Teslimat Noktası'}
          initialLat={mapTarget === 'pickup' ? data.pickup_latitude : data.delivery_latitude}
          initialLng={mapTarget === 'pickup' ? data.pickup_longitude : data.delivery_longitude}
          onSelect={handleMapSelect}
          onClose={() => setMapTarget(null)}
        />
      )}
    </section>
  );
};

export default GuestOrder;