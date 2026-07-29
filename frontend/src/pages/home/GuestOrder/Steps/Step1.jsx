import { useEffect } from 'react';
import { BiMapPin, BiPhone, BiMap, BiCheckCircle } from 'react-icons/bi';
import { ISTANBUL_DISTRICTS, formatPhone } from '../constants';

const Field = ({ label, error, children, hint }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">{label}</label>
    {children}
    {hint && !error && <p className="text-[10px] text-gray-400 font-medium">{hint}</p>}
    {error && <p className="text-[10px] text-red-500 font-bold">{error}</p>}
  </div>
);

const Input = ({ icon: Icon, error, ...props }) => (
  <div className={`flex items-center gap-3 h-12 px-4 rounded-2xl border bg-white transition-all ${
    error ? 'border-red-300 bg-red-50/30' : 'border-gray-100 focus-within:border-[#FBCF2D] focus-within:shadow-[0_0_0_3px_rgba(251,207,45,0.12)]'
  }`}>
    {Icon && <Icon size={16} className={error ? 'text-red-400' : 'text-gray-300'} />}
    <input className="flex-1 text-sm font-semibold text-gray-900 bg-transparent outline-none placeholder:text-gray-300" {...props} />
  </div>
);

const Select = ({ icon: Icon, error, children, ...props }) => (
  <div className={`flex items-center gap-3 h-12 px-4 rounded-2xl border bg-white transition-all ${
    error ? 'border-red-300 bg-red-50/30' : 'border-gray-100 focus-within:border-[#FBCF2D] focus-within:shadow-[0_0_0_3px_rgba(251,207,45,0.12)]'
  }`}>
    {Icon && <Icon size={16} className={error ? 'text-red-400' : 'text-gray-300'} />}
    <select className="flex-1 text-sm font-semibold text-gray-900 bg-transparent outline-none appearance-none cursor-pointer" {...props}>
      {children}
    </select>
  </div>
);

// Adres alanı: içine gömülü harita ikonu (ekran görüntüsündeki gibi)
const AddressField = ({ value, onChange, error, hasLocation, onOpenMap, placeholder }) => (
  <div className={`relative flex items-center h-12 pl-4 pr-2 rounded-2xl border bg-white transition-all ${
    error ? 'border-red-300 bg-red-50/30' : 'border-gray-100 focus-within:border-[#FBCF2D] focus-within:shadow-[0_0_0_3px_rgba(251,207,45,0.12)]'
  }`}>
    <input
      className="flex-1 text-sm font-semibold text-gray-900 bg-transparent outline-none placeholder:text-gray-300 pr-2"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
    <button
      type="button"
      onClick={onOpenMap}
      title={hasLocation ? 'Konumu değiştir' : 'Haritadan konum seç'}
      className={`shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
        hasLocation ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-400 hover:bg-[#FBCF2D]/15 hover:text-gray-700'
      }`}
    >
      {hasLocation ? <BiCheckCircle size={18} /> : <BiMap size={18} />}
    </button>
  </div>
);

const Textarea = ({ error, ...props }) => (
  <textarea rows={2} className={`w-full px-4 py-3 rounded-2xl border text-sm font-semibold text-gray-900 bg-white outline-none resize-none transition-all placeholder:text-gray-300 ${
    error ? 'border-red-300 bg-red-50/30' : 'border-gray-100 focus:border-[#FBCF2D] focus:shadow-[0_0_0_3px_rgba(251,207,45,0.12)]'
  }`} {...props} />
);

export const Step1 = ({ data, onChange, errors, onOpenMap }) => {
  useEffect(() => {
    if (data.guest_name && data.pickup_contact_name !== data.guest_name) {
      onChange('pickup_contact_name', data.guest_name);
    }
  }, [data.guest_name]);

  const hasPickupLocation = !!(data.pickup_latitude && data.pickup_longitude);

  return (
    <div className="flex flex-col gap-5">
      <Field label="Alış Adresi" error={errors.pickup_address} hint="Sağdaki ikondan haritadan tam konum işaretleyebilirsiniz">
        <AddressField
          placeholder="Sokak, Cadde, Mahalle ya da Site/Plaza bilgisi giriniz"
          value={data.pickup_address}
          onChange={e => onChange('pickup_address', e.target.value)}
          error={errors.pickup_address}
          hasLocation={hasPickupLocation}
          onOpenMap={() => onOpenMap('pickup')}
        />
      </Field>
      <Field label="Alış İlçesi" error={errors.pickup_district}>
        <Select icon={BiMapPin} value={data.pickup_district} onChange={e => onChange('pickup_district', e.target.value)} error={errors.pickup_district}>
          <option value="">İlçe seçiniz</option>
          {ISTANBUL_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
        </Select>
      </Field>
      <Field label="İletişim Telefonu" error={errors.pickup_contact_phone} hint="Bu numara ile sizi arayacağız (05xxxxxxxxx)">
        <Input icon={BiPhone} placeholder="05xxxxxxxxx" value={data.pickup_contact_phone} onChange={e => { const val = formatPhone(e.target.value); onChange('pickup_contact_phone', val); onChange('guest_phone', val); }} error={errors.pickup_contact_phone} type="tel" maxLength={11} />
      </Field>
      <Field label="Alış Notu (İsteğe Bağlı)">
        <Textarea placeholder="Kapıcıya bırakın, zili çalın vs." value={data.pickup_notes} onChange={e => onChange('pickup_notes', e.target.value)} rows={2} />
      </Field>
    </div>
  );
};