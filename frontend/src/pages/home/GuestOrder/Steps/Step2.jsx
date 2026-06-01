import { useState } from 'react';
import { BiMapPin, BiUser, BiPhone, BiMap, BiX, BiCheck } from 'react-icons/bi';
import { ISTANBUL_DISTRICTS, formatPhone, isValidPhone } from '../constants';

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

export const Step2 = ({ data, onChange, errors, onOpenMap }) => {
  const [samePhone, setSamePhone] = useState(
    data.delivery_contact_phone !== '' && data.delivery_contact_phone === data.pickup_contact_phone
  );

  const handleSamePhone = (checked) => {
    setSamePhone(checked);
    onChange('delivery_contact_phone', checked ? data.pickup_contact_phone : '');
  };

  return (
    <div className="flex flex-col gap-5">
      <Field label="Teslimat Adresi" error={errors.delivery_address}>
        <Textarea placeholder="Tam adres (mahalle, sokak, bina no, kat, daire...)" value={data.delivery_address} onChange={e => onChange('delivery_address', e.target.value)} error={errors.delivery_address} />
      </Field>
      <Field label="Teslimat İlçesi" error={errors.delivery_district}>
        <Select icon={BiMapPin} value={data.delivery_district} onChange={e => onChange('delivery_district', e.target.value)} error={errors.delivery_district}>
          <option value="">İlçe seçiniz</option>
          {ISTANBUL_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
        </Select>
      </Field>
      <Field label="Harita Konumu (İsteğe Bağlı)">
        {data.delivery_latitude && data.delivery_longitude ? (
          <LocationBadge lat={data.delivery_latitude} lng={data.delivery_longitude} onClear={() => { onChange('delivery_latitude', null); onChange('delivery_longitude', null); }} />
        ) : (
          <button type="button" onClick={() => onOpenMap('delivery')} className="flex items-center gap-3 h-12 px-4 rounded-2xl border border-dashed border-gray-200 bg-gray-50 text-gray-400 text-[11px] font-black uppercase tracking-wider hover:border-[#FBCF2D] hover:text-gray-700 transition-all w-full">
            <BiMap size={16} /> Haritadan Konum İşaretle
          </button>
        )}
      </Field>
      <Field label="Alıcı Adı" error={errors.delivery_contact_name}>
        <Input icon={BiUser} placeholder="Teslim edilecek kişi" value={data.delivery_contact_name} onChange={e => onChange('delivery_contact_name', e.target.value)} error={errors.delivery_contact_name} />
      </Field>
      <div className="flex flex-col gap-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Alıcı Telefonu</label>
        <button type="button" onClick={() => handleSamePhone(!samePhone)} className={`flex items-center gap-3 h-10 px-4 rounded-2xl border text-[11px] font-bold transition-all w-full text-left ${samePhone ? 'border-[#FBCF2D] bg-[#FBCF2D]/8 text-gray-700' : 'border-gray-100 bg-gray-50 text-gray-400 hover:border-gray-200'}`}>
          <div className={`w-4 h-4 rounded flex items-center justify-center border-2 shrink-0 transition-all ${samePhone ? 'bg-[#FBCF2D] border-[#FBCF2D]' : 'border-gray-300'}`}>
            {samePhone && <BiCheck size={11} className="text-gray-900" />}
          </div>
          Gönderici telefonu ile aranabilir {data.pickup_contact_phone ? `(${data.pickup_contact_phone})` : ''}
        </button>
        {!samePhone && (
          <Input icon={BiPhone} placeholder="05xxxxxxxxx" value={data.delivery_contact_phone} onChange={e => onChange('delivery_contact_phone', formatPhone(e.target.value))} error={errors.delivery_contact_phone} type="tel" maxLength={11} />
        )}
        {errors.delivery_contact_phone && <p className="text-[10px] text-red-500 font-bold">{errors.delivery_contact_phone}</p>}
      </div>
      <Field label="Teslimat Notu (İsteğe Bağlı)">
        <Textarea placeholder="Zili çalmayın, komşuya bırakın vs." value={data.delivery_notes} onChange={e => onChange('delivery_notes', e.target.value)} rows={2} />
      </Field>
    </div>
  );
};