import { PACKAGE_SIZES, MIN_AMOUNT } from '../constants';

const Field = ({ label, error, children, hint }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">{label}</label>
    {children}
    {hint && !error && <p className="text-[10px] text-gray-400 font-medium">{hint}</p>}
    {error && <p className="text-[10px] text-red-500 font-bold">{error}</p>}
  </div>
);

const Textarea = ({ error, ...props }) => (
  <textarea rows={3} className={`w-full px-4 py-3 rounded-2xl border text-sm font-semibold text-gray-900 bg-white outline-none resize-none transition-all placeholder:text-gray-300 ${
    error ? 'border-red-300 bg-red-50/30' : 'border-gray-100 focus:border-[#FBCF2D] focus:shadow-[0_0_0_3px_rgba(251,207,45,0.12)]'
  }`} {...props} />
);

export const Step3 = ({ data, onChange, errors }) => (
  <div className="flex flex-col gap-6">
    <Field label="Paket Boyutu">
      <div className="grid grid-cols-3 gap-3">
        {PACKAGE_SIZES.map(size => (
          <button key={size.value} type="button" onClick={() => onChange('package_size', size.value)}
            className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all text-center ${
              data.package_size === size.value ? 'border-[#FBCF2D] bg-[#FBCF2D]/8 shadow-[0_0_0_3px_rgba(251,207,45,0.12)]' : 'border-gray-100 bg-white hover:border-gray-200'
            }`}>
            <span className="text-2xl">{size.icon}</span>
            <span className="text-[11px] font-black text-gray-900">{size.label}</span>
            <span className="text-[9px] font-medium text-gray-400 leading-tight">{size.desc}</span>
          </button>
        ))}
      </div>
    </Field>
    <Field label="Paket İçeriği" error={errors.package_description}>
      <Textarea placeholder="Ne gönderiyorsunuz? (Belge, kitap, ayakkabı kutusu...)" value={data.package_description} onChange={e => onChange('package_description', e.target.value)} error={errors.package_description} />
    </Field>
    <Field label="Harçlık Tutarı (₺)" error={errors.payment_amount} hint={`Minimum ${MIN_AMOUNT}₺ — kurye için adil bir tutar belirleyin`}>
      <div className={`flex items-center gap-3 h-14 px-4 rounded-2xl border bg-white transition-all ${
        errors.payment_amount ? 'border-red-300 bg-red-50/30' : 'border-gray-100 focus-within:border-[#FBCF2D] focus-within:shadow-[0_0_0_3px_rgba(251,207,45,0.12)]'
      }`}>
        <span className="text-lg font-black text-[#FBCF2D]">₺</span>
        <input type="number" min={MIN_AMOUNT} step={10} placeholder={`${MIN_AMOUNT}`} value={data.payment_amount} onChange={e => onChange('payment_amount', e.target.value)}
          className="flex-1 text-xl font-black text-gray-900 bg-transparent outline-none placeholder:text-gray-200" />
        <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">TL</span>
      </div>
      <div className="flex gap-2 mt-2">
        {[350, 400, 500, 600, 750].map(amt => (
          <button key={amt} type="button" onClick={() => onChange('payment_amount', amt)}
            className={`flex-1 h-8 rounded-xl text-[10px] font-black transition-all ${
              Number(data.payment_amount) === amt ? 'bg-gray-900 text-[#FBCF2D]' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
            }`}>
            {amt}₺
          </button>
        ))}
      </div>
    </Field>
  </div>
);