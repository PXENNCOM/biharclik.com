import { BiMapPin, BiUser, BiPhone, BiMap, BiX } from 'react-icons/bi';
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

const Textarea = ({ error, ...props }) => (
  <textarea rows={3} className={`w-full px-4 py-3 rounded-2xl border text-sm font-semibold text-gray-900 bg-white outline-none resize-none transition-all placeholder:text-gray-300 ${
    error ? 'border-red-300 bg-red-50/30' : 'border-gray-100 focus:border-[#FBCF2D] focus:shadow-[0_0_0_3px_rgba(251,207,45,0.12)]'
  }`} {...props} />
);

const LocationBadge = ({ lat, lng, onClear }) => (
  <div className="flex items-center justify-between px-4 py-2.5 bg-green-50 border border-green-200 rounded-2xl">
    <div className="flex items-center gap-2">
      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
      <p className="text-[11px] font-bold text-green-700">Konum seçildi — {lat.toFixed(4)}, {lng.toFixed(4)}</p>
    </div>
    <button onClick={onClear} className="text-green-500 hover:text-green-700"><BiX size={16} /></button>
  </div>
);

export const Step1 = ({ data, onChange, errors, onOpenMap }) => (
  <div className="flex flex-col gap-5">
    <Field label="Alış Adresi" error={errors.pickup_address}>
      <Textarea placeholder="Tam adres (mahalle, sokak, bina no, kat, daire...)" value={data.pickup_address} onChange={e => onChange('pickup_address', e.target.value)} error={errors.pickup_address} />
    </Field>
    <Field label="Alış İlçesi" error={errors.pickup_district}>
      <Select icon={BiMapPin} value={data.pickup_district} onChange={e => onChange('pickup_district', e.target.value)} error={errors.pickup_district}>
        <option value="">İlçe seçiniz</option>
        {ISTANBUL_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
      </Select>
    </Field>
    <Field label="Harita Konumu (İsteğe Bağlı)">
      {data.pickup_latitude && data.pickup_longitude ? (
        <LocationBadge lat={data.pickup_latitude} lng={data.pickup_longitude} onClear={() => { onChange('pickup_latitude', null); onChange('pickup_longitude', null); }} />
      ) : (
        <button type="button" onClick={() => onOpenMap('pickup')} className="flex items-center gap-3 h-12 px-4 rounded-2xl border border-dashed border-gray-200 bg-gray-50 text-gray-400 text-[11px] font-black uppercase tracking-wider hover:border-[#FBCF2D] hover:text-gray-700 transition-all w-full">
          <BiMap size={16} /> Haritadan Konum İşaretle
        </button>
      )}
    </Field>
    <Field label="Yetkili Adı" error={errors.pickup_contact_name}>
      <Input icon={BiUser} placeholder="Paketi teslim edecek kişi" value={data.pickup_contact_name} onChange={e => onChange('pickup_contact_name', e.target.value)} error={errors.pickup_contact_name} />
    </Field>
    <Field label="İletişim Telefonu" error={errors.pickup_contact_phone} hint="Bu numara ile sizi arayacağız (05xxxxxxxxx)">
      <Input icon={BiPhone} placeholder="05xxxxxxxxx" value={data.pickup_contact_phone} onChange={e => { const val = formatPhone(e.target.value); onChange('pickup_contact_phone', val); onChange('guest_phone', val); }} error={errors.pickup_contact_phone} type="tel" maxLength={11} />
    </Field>
    <Field label="Alış Notu (İsteğe Bağlı)">
      <Textarea placeholder="Kapıcıya bırakın, zili çalın vs." value={data.pickup_notes} onChange={e => onChange('pickup_notes', e.target.value)} rows={2} />
    </Field>
  </div>
);