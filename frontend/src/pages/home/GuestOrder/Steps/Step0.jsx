import { BiUser } from 'react-icons/bi';

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

export const Step0 = ({ data, onChange, errors }) => (
  <div className="flex flex-col gap-5">
    <div className="p-4 bg-[#FBCF2D]/10 rounded-2xl border border-[#FBCF2D]/20">
      <p className="text-[11px] font-bold text-gray-700 leading-relaxed">
        <span className="text-[#FBCF2D] mr-1">★</span>
        Kurye aramakla uğraşmayın. 45 saniye içinde öğrenci kurye çağırın.
      </p>
    </div>
    <Field label="Ad Soyad" error={errors.guest_name}>
      <Input
        icon={BiUser}
        placeholder="Adınız ve soyadınız"
        value={data.guest_name}
        onChange={e => onChange('guest_name', e.target.value)}
        error={errors.guest_name}
      />
    </Field>
  </div>
);