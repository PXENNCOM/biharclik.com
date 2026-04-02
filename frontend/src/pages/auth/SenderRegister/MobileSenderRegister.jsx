import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BiUser, BiBuilding, BiEnvelope, BiPhone, BiLockAlt, 
  BiIdCard, BiMap, BiCheckCircle, BiLoaderAlt,
  BiErrorCircle, BiChevronLeft, BiShieldQuarter, BiBuildings
} from 'react-icons/bi';

import { PhoneVerificationModal } from '../../../components/common/PhoneVerificationModal';
import { KvkkModal } from '../../../components/common/KvkkModal';
import LogoImage from '../../../assets/yellow_logo.png';

const MobileSenderRegister = ({ 
  formData, accountType, error, loading,
  phoneVerified, showPhoneModal, showKvkkModal, kvkkModalType,
  handleChange, handleSubmit,
  setAccountType, setShowPhoneModal, setShowKvkkModal, setKvkkModalType, onPhoneVerified
}) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-[#0F172A] font-sans antialiased selection:bg-yellow-200">
      
      {/* --- HEADER SECTION --- */}
      <div className="px-8 pt-12 pb-10 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-yellow-400/5 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="flex justify-between items-center mb-10">
          <button 
            onClick={() => navigate(-1)} 
            className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-white/80 active:scale-90 transition-all backdrop-blur-md"
          >
            <BiChevronLeft size={30} />
          </button>
          <img src={LogoImage} alt="Logo" className="h-6 w-auto opacity-90 brightness-200 grayscale" />
          <div className="w-12" />
        </div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-light text-white tracking-tight leading-tight">
            Gönderici <span className="font-semibold text-yellow-400">Kaydı</span>
          </h1>
          <p className="text-slate-400 text-sm mt-3 flex items-center gap-2">
            <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
            Paketlerinizi güvenle ulaştırın.
          </p>
        </motion.div>
      </div>

      {/* --- FORM SECTION --- */}
      <motion.div 
        initial={{ y: "100%" }} 
        animate={{ y: 0 }} 
        transition={{ type: "spring", damping: 30, stiffness: 120 }}
        className="flex-1 bg-[#F8FAFC] rounded-t-[45px] px-8 pt-12 pb-12 shadow-[0_-25px_60px_rgba(0,0,0,0.3)] z-10"
      >
        {/* HESAP TİPİ SEÇİCİ - Kurumsal Stil */}
        <div className="bg-slate-200/50 p-1.5 rounded-[22px] flex mb-10 relative overflow-hidden max-w-sm mx-auto border border-slate-200 shadow-inner">
          <motion.div 
            animate={{ x: accountType === 'individual' ? '0%' : '100%' }}
            transition={{ type: "spring", stiffness: 350, damping: 35 }}
            className="absolute top-1.5 left-1.5 w-[calc(50%-6px)] bottom-1.5 bg-[#1E293B] rounded-[18px] shadow-lg z-0" 
          />
          <button type="button" onClick={() => setAccountType('individual')}
            className={`relative z-10 flex-1 py-3.5 text-[11px] font-bold uppercase tracking-widest transition-colors duration-500 flex items-center justify-center gap-2 ${accountType === 'individual' ? 'text-white' : 'text-slate-500'}`}>
            <BiUser size={16} /> Bireysel
          </button>
          <button type="button" onClick={() => setAccountType('corporate')}
            className={`relative z-10 flex-1 py-3.5 text-[11px] font-bold uppercase tracking-widest transition-colors duration-500 flex items-center justify-center gap-2 ${accountType === 'corporate' ? 'text-white' : 'text-slate-500'}`}>
            <BiBuildings size={16} /> Kurumsal
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10 max-w-md mx-auto">
          
          <AnimatePresence mode="wait">
            {error && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                className="p-4 rounded-2xl bg-red-50 border border-red-100 text-red-700 text-xs font-bold flex items-center gap-3 shadow-sm">
                <BiErrorCircle size={22} className="shrink-0" />
                <span className="uppercase tracking-tight">{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* DİNAMİK ALANLAR */}
          <AnimatePresence mode="wait">
            {accountType === 'individual' ? (
              <motion.div key="ind" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-5">
                <FormSectionTitle title="Kişisel Bilgiler" />
                <CorporateInput icon={<BiUser />} label="AD" name="first_name" value={formData.first_name} onChange={handleChange} placeholder="Adınız" />
                <CorporateInput icon={<BiUser />} label="SOYAD" name="last_name" value={formData.last_name} onChange={handleChange} placeholder="Soyadınız" />
                <CorporateInput icon={<BiIdCard />} label="T.C. KİMLİK NUMARASI" name="tc_no" value={formData.tc_no} onChange={handleChange} maxLength="11" placeholder="00000000000" inputMode="numeric" />
              </motion.div>
            ) : (
              <motion.div key="corp" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-5">
                <FormSectionTitle title="Firma Bilgileri" />
                <CorporateInput icon={<BiBuilding />} label="FİRMA ÜNVANI" name="company_name" value={formData.company_name} onChange={handleChange} placeholder="Örn: ABC Lojistik A.Ş." />
                <CorporateInput icon={<BiMap />} label="VERGİ DAİRESİ" name="tax_office" value={formData.tax_office} onChange={handleChange} placeholder="Daire Adı" />
                <CorporateInput icon={<BiIdCard />} label="VERGİ NUMARASI" name="tax_number" value={formData.tax_number} onChange={handleChange} maxLength="10" placeholder="10 Haneli No" inputMode="numeric" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* İLETİŞİM & ADRES */}
          <section className="space-y-5">
            <FormSectionTitle title="İletişim ve Fatura" />
            <CorporateInput icon={<BiEnvelope />} label="E-POSTA" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="eposta@adresiniz.com" />
            
            <div className="flex gap-3 items-end">
              <div className="flex-1">
                <CorporateInput icon={<BiPhone />} label="GSM NUMARASI" name="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="05XX" />
              </div>
              <button 
                type="button" 
                onClick={() => setShowPhoneModal(true)}
                className={`p-4 rounded-2xl border transition-all active:scale-95 shadow-sm ${phoneVerified ? 'bg-green-50 border-green-200 text-green-600' : 'bg-slate-900 border-slate-900 text-white hover:bg-black'}`}
              >
                <BiCheckCircle size={28} />
              </button>
            </div>

            <div className="group transition-all">
              <label className="block text-[9px] font-black text-slate-500 mb-1.5 ml-1 uppercase tracking-widest">FATURA ADRESİ</label>
              <div className="relative flex items-start">
                <div className="absolute left-4 top-4 text-slate-300 group-focus-within:text-yellow-500 transition-colors">
                  <BiMap size={20} />
                </div>
                <textarea 
                  name="billing_address" rows="3"
                  className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-sm font-semibold text-slate-800 outline-none transition-all placeholder:text-slate-300 focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/5 shadow-sm resize-none"
                  placeholder="Detaylı fatura adresi..."
                  value={formData.billing_address} onChange={handleChange} 
                />
              </div>
            </div>
          </section>

          {/* GÜVENLİK */}
          <section className="space-y-5">
            <FormSectionTitle title="Erişim Şifresi" />
            <div className="space-y-4">
              <CorporateInput icon={<BiLockAlt />} label="ŞİFRE" name="password" type="password" value={formData.password} onChange={handleChange} placeholder="••••••••" />
              <CorporateInput icon={<BiLockAlt />} label="ŞİFRE TEKRAR" name="password_confirm" type="password" value={formData.password_confirm} onChange={handleChange} placeholder="••••••••" />
            </div>
          </section>

          {/* Onaylar */}
          <div className="py-6 space-y-4 bg-slate-50 rounded-3xl p-6 border border-slate-100">
            <CorporateCheckbox label="KVKK Aydınlatma Metni" name="kvkk_accepted" checked={formData.kvkk_accepted} onChange={handleChange} onDetailClick={() => { setKvkkModalType('aydinlatma'); setShowKvkkModal(true); }} />
            <CorporateCheckbox label="Kullanım Koşulları" name="terms_accepted" checked={formData.terms_accepted} onChange={handleChange} onDetailClick={() => { setKvkkModalType('kosullar'); setShowKvkkModal(true); }} />
          </div>

          <div className="sticky bottom-4">
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#1E293B] hover:bg-[#0F172A] disabled:bg-slate-400 text-white font-bold rounded-2xl py-5 transition-all active:scale-[0.98] shadow-2xl shadow-slate-300 uppercase tracking-[0.2em] text-sm flex items-center justify-center gap-3"
            >
              {loading ? <BiLoaderAlt className="animate-spin" size={24} /> : (
                <>
                  <span>Kaydı Tamamla</span>
                  <BiShieldQuarter className="text-yellow-400" size={20} />
                </>
              )}
            </button>
          </div>

          <p className="text-center text-[11px] font-bold text-slate-400 uppercase tracking-widest">
            Zaten üye misin? <Link to="/login" className="text-slate-900 border-b-2 border-yellow-400 pb-0.5 ml-1">Giriş Yap</Link>
          </p>
        </form>
      </motion.div>

      <PhoneVerificationModal isOpen={showPhoneModal} phoneNumber={formData.phone} onVerified={onPhoneVerified} onClose={() => setShowPhoneModal(false)} />
      <KvkkModal isOpen={showKvkkModal} onClose={() => setShowKvkkModal(false)} type={kvkkModalType} />
    </div>
  );
};

// --- YARDIMCI BİLEŞENLER (Student Register ile aynı standartta) ---

const FormSectionTitle = ({ title }) => (
  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] pl-1 border-l-2 border-yellow-400 ml-1 leading-none h-3 items-center flex">
    {title}
  </h3>
);

const CorporateInput = ({ icon, label, name, type = "text", value, onChange, placeholder, maxLength, inputMode }) => (
  <div className="group transition-all">
    <label className="block text-[9px] font-black text-slate-500 mb-1.5 ml-1 uppercase tracking-widest">{label}</label>
    <div className="relative flex items-center">
      <div className="absolute left-4 text-slate-300 group-focus-within:text-yellow-500 transition-colors">
        {React.cloneElement(icon, { size: 20 })}
      </div>
      <input 
        type={type} name={name} required maxLength={maxLength} inputMode={inputMode}
        value={value} onChange={onChange} placeholder={placeholder}
        className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-sm font-semibold text-slate-800 outline-none transition-all placeholder:text-slate-300 focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/5 shadow-sm"
      />
    </div>
  </div>
);

const CorporateCheckbox = ({ label, checked, onChange, name, onDetailClick }) => (
  <div className="flex items-start gap-3">
    <label className="relative flex items-center cursor-pointer mt-0.5">
      <input 
        type="checkbox" name={name} checked={checked} onChange={onChange}
        className="peer h-5 w-5 appearance-none rounded-md border-2 border-slate-200 checked:bg-yellow-400 checked:border-yellow-400 transition-all shadow-sm" 
      />
      <BiCheckCircle className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-900 opacity-0 peer-checked:opacity-100 transition-opacity" size={14} />
    </label>
    <p className="text-[10px] text-slate-500 font-medium leading-tight">
      {label} okudum ve kabul ediyorum. 
      <button type="button" onClick={onDetailClick} className="ml-1 text-slate-900 font-bold underline decoration-yellow-400 underline-offset-2">İncele</button>
    </p>
  </div>
);

export default MobileSenderRegister;