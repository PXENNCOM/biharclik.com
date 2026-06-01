import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BiUser, BiIdCard, BiCalendar, BiEnvelope, BiPhone, 
  BiLockAlt, BiBuilding, BiBook, BiCloudUpload, 
  BiCreditCard, BiCheckCircle, BiLoaderAlt,
  BiErrorCircle, BiChevronLeft, BiShieldQuarter
} from 'react-icons/bi';

import { PhoneVerificationModal } from '../../../components/common/PhoneVerificationModal';
import { KvkkModal } from '../../../components/common/KvkkModal';
// GÜNCELLEME: Yeni bileşeni buraya da import ediyoruz
import DepartmentSelect from '../../../components/common/DepartmentSelect';
import { ISTANBUL_UNIVERSITIES } from '../../../data/istanbul-universities';
import LogoImage from '../../../assets/yellow_logo.png';

const MobileStudentRegister = ({ 
  formData, 
  bolumler, // GÜNCELLEME: Controller'dan gelen liste
  studentDocument, 
  error, 
  loading,
  phoneVerified, 
  showPhoneModal, 
  showKvkkModal, 
  kvkkModalType,
  handleChange, 
  handleFileChange, 
  handleSubmit,
  setShowPhoneModal, 
  setShowKvkkModal, 
  setKvkkModalType, 
  onPhoneVerified
}) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-[#0F172A] font-sans antialiased selection:bg-yellow-200">
      
      {/* --- HEADER SECTION --- */}
      <div className="px-8 pt-12 pb-10 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-yellow-400/10 blur-[100px] rounded-full pointer-events-none" />
        
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

        <motion.div 
          initial={{ opacity: 0, x: -20 }} 
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-light text-white tracking-tight leading-tight">
            Hesabını <span className="font-semibold text-yellow-400">Oluştur</span>
          </h1>
          <p className="text-slate-400 text-sm mt-3 flex items-center gap-2">
            <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
            Yaklaşık 4 dakika sürecek.
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
        <form onSubmit={handleSubmit} className="space-y-10 max-w-md mx-auto">
          
          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="p-4 rounded-2xl bg-red-50 border border-red-100 text-red-700 text-xs font-bold flex items-center gap-3 shadow-sm"
              >
                <BiErrorCircle size={22} className="shrink-0" />
                <span className="uppercase tracking-tight">{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Grup 1: Kimlik */}
          <section className="space-y-4">
            <FormSectionTitle title="Kişisel Bilgiler" />
            <div className="space-y-4">
              <CorporateInput icon={<BiUser />} label="AD" name="first_name" value={formData.first_name} onChange={handleChange} placeholder="Adınız" />
              <CorporateInput icon={<BiUser />} label="SOYAD" name="last_name" value={formData.last_name} onChange={handleChange} placeholder="Soyadınız" />
              <CorporateInput icon={<BiIdCard />} label="T.C. KİMLİK NUMARASI" name="tc_no" value={formData.tc_no} onChange={handleChange} maxLength="11" placeholder="00000000000" inputMode="numeric" />
              <CorporateInput icon={<BiCalendar />} label="DOĞUM TARİHİ" name="birth_date" type="date" value={formData.birth_date} onChange={handleChange} />
            </div>
          </section>

          {/* Grup 2: Eğitim */}
          <section className="space-y-4">
            <FormSectionTitle title="Akademik Doğrulama" />
            <div className="space-y-4">
              <CorporateSelect value={formData.university} onChange={handleChange} />
              
              {/* GÜNCELLEME: Searchable Bölüm Seçici */}
              <DepartmentSelect 
                value={formData.department_id} 
                options={bolumler} 
                onChange={handleChange} 
              />

              <CorporateFileUpload file={studentDocument} onChange={handleFileChange} id="student_doc" label="E-Devlet Öğrenci Belgesi" />
            </div>
          </section>

          {/* Grup 3: İletişim & Finans */}
          <section className="space-y-4">
            <FormSectionTitle title="İletişim ve Ödeme" />
            <div className="space-y-4">
              <CorporateInput icon={<BiEnvelope />} label="KURUMSAL / ŞAHSİ E-POSTA" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="eposta@adresiniz.com" />
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
              <CorporateInput icon={<BiCreditCard />} label="IBAN (HARÇLIK ÖDEMELERİ İÇİN)" name="iban" value={formData.iban} onChange={handleChange} placeholder="TR00..." />
            </div>
          </section>

          {/* Grup 4: Güvenlik */}
          <section className="space-y-4">
            <FormSectionTitle title="Hesap Güvenliği" />
            <div className="space-y-4">
              <CorporateInput icon={<BiLockAlt />} label="GİRİŞ ŞİFRESİ" name="password" type="password" value={formData.password} onChange={handleChange} placeholder="••••••••" />
              <CorporateInput icon={<BiLockAlt />} label="ŞİFRE TEKRAR" name="password_confirm" type="password" value={formData.password_confirm} onChange={handleChange} placeholder="••••••••" />
            </div>
          </section>

          {/* Onaylar */}
          <div className="py-6 space-y-4 bg-slate-50 rounded-3xl p-6 border border-slate-100">
            <CorporateCheckbox label="KVKK Aydınlatma Metni" name="kvkk_accepted" checked={formData.kvkk_accepted} onChange={handleChange} onDetailClick={() => { setKvkkModalType('aydinlatma'); setShowKvkkModal(true); }} />
            <CorporateCheckbox label="Kullanım Koşulları" name="terms_accepted" checked={formData.terms_accepted} onChange={handleChange} onDetailClick={() => { setKvkkModalType('kosullar'); setShowKvkkModal(true); }} />
          </div>

          {/* Submit */}
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

// --- ÖZEL KURUMSAL BİLEŞENLER ---

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

const CorporateSelect = ({ value, onChange }) => (
  <div className="group transition-all">
    <label className="block text-[9px] font-black text-slate-500 mb-1.5 ml-1 uppercase tracking-widest">ÜNİVERSİTE</label>
    <div className="relative flex items-center">
      <div className="absolute left-4 text-slate-300 group-focus-within:text-yellow-500 transition-colors">
        <BiBuilding size={20} />
      </div>
      <select 
        name="university" required value={value} onChange={onChange}
        className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-12 pr-10 text-sm font-semibold text-slate-800 outline-none appearance-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/5 shadow-sm"
      >
        <option value="">Üniversite Seçiniz</option>
        {ISTANBUL_UNIVERSITIES.map(uni => <option key={uni} value={uni}>{uni}</option>)}
      </select>
      <div className="absolute right-4 pointer-events-none text-slate-400">
        <BiChevronLeft size={20} className="-rotate-90" />
      </div>
    </div>
  </div>
);

const CorporateFileUpload = ({ file, id, onChange, label }) => (
  <div className="relative">
    <label className="block text-[9px] font-black text-slate-500 mb-1.5 ml-1 uppercase tracking-widest">{label}</label>
    <label 
      htmlFor={id}
      className={`flex items-center justify-between p-4 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${file ? 'bg-green-50 border-green-200' : 'bg-white border-slate-100 hover:border-yellow-400 hover:bg-yellow-50/30'}`}
    >
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-xl ${file ? 'bg-green-100 text-green-600' : 'bg-slate-50 text-slate-400'}`}>
          <BiCloudUpload size={24} />
        </div>
        <div>
          <p className="text-[11px] font-bold text-slate-700 uppercase tracking-tight">
            {file ? "Belge Yüklendi" : "Belge Seç"}
          </p>
          <p className="text-[9px] text-slate-400 uppercase tracking-tighter">
            {file ? file.name : "PDF, PNG veya JPG"}
          </p>
        </div>
      </div>
      {file && <BiCheckCircle className="text-green-500" size={24} />}
      <input type="file" id={id} onChange={onChange} className="hidden" />
    </label>
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

export default MobileStudentRegister;