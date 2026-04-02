// Dosya: /src/components/common/TermsAndRulesModal.jsx

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldAlert, 
  AlertTriangle, 
  Package, 
  Gavel, 
  Info, 
  CheckCircle2, 
  X, 
  Lock, 
  Scale,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export const TermsAndRulesModal = ({ isOpen, onClose }) => {
  // Modal açıldığında scroll'u en üste zorla
  useEffect(() => {
    if (isOpen) {
      const scrollContainer = document.getElementById('rules-scroll-container');
      if (scrollContainer) scrollContainer.scrollTo(0, 0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-6 antialiased">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" 
        onClick={onClose}
      />

      {/* Modal Container */}
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="relative bg-white w-full h-full md:h-auto md:max-h-[85vh] md:max-w-3xl md:rounded-[40px] shadow-2xl flex flex-col overflow-hidden border border-white/20"
      >
        
        {/* --- HEADER --- */}
        <div className="flex items-center justify-between p-6 md:p-8 border-b border-slate-50 sticky top-0 bg-white/80 backdrop-blur-xl z-20">
          <div className="flex items-center gap-4">
            <div>
              <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">Hukuki Şartlar</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-0.5">Yasal Sorumluluk ve Kullanım Rehberi</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all active:scale-90"
          >
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        {/* --- CONTENT --- */}
        <div 
          id="rules-scroll-container"
          className="overflow-y-auto flex-1 p-6 md:p-10 space-y-12 bg-[#FDFDFD] scroll-smooth"
        >
          
          {/* KRİTİK YASAL UYARI (Apple Tarzı) */}
          <section className="bg-white border-2 border-slate-900 rounded-[32px] p-6 md:p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-slate-900/5 blur-3xl rounded-full" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="text-slate-900" size={20} />
                <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.3em]">Önemli Mevzuat Hatırlatması</h3>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed font-medium">
                Bu platform <strong className="text-slate-900 underline decoration-yellow-400 decoration-2">6098 sayılı Türk Borçlar Kanunu</strong> kapsamında çalışmaktadır. Biharçlık bir işveren değil, bağımsız hizmet sağlayıcılar (öğrenciler) ile göndericileri buluşturan bir aracıdır.
              </p>
              <div className="mt-6 flex items-center gap-2 text-[10px] font-bold text-slate-400 italic">
                <Info size={14} /> 6563 Sayılı E-Ticaret Kanunu'na tabidir.
              </div>
            </div>
          </section>

          {/* MADDELER */}
          <div className="space-y-16">

            {/* Madde 1 */}
            <RuleSection 
              num="01" 
              title="Yasaklı Gönderi Protokolü" 
              icon={<Scale size={20} />}
              desc="Aşağıdaki öğelerin taşınması kesinlikle yasaktır ve tespiti halinde kolluk kuvvetlerine bildirim zorunluluğu vardır."
            >
              <div className="grid grid-cols-2 gap-2 mt-4">
                <ForbiddenItem label="Nakit & Değerli Evrak" />
                <ForbiddenItem label="Altın & Mücevher" />
                <ForbiddenItem label="Yasa Dışı Maddeler" />
                <ForbiddenItem label="Yanıcı & Patlayıcılar" />
                <ForbiddenItem label="Açık Gıda & Sıvılar" />
                <ForbiddenItem label="Kimlik & Pasaport" />
              </div>
            </RuleSection>

            {/* Madde 2 */}
            <RuleSection 
              num="02" 
              title="Emanet ve Sigorta Kapsamı" 
              icon={<ShieldCheck size={20} />}
              desc="Taşıma esnasındaki sorumluluk sınırları YÖK ve TBK mevzuatlarına göre belirlenmiştir."
            >
              <div className="space-y-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <p className="text-xs font-bold text-slate-900 mb-2">Hasar Sorumluluğu:</p>
                  <p className="text-xs text-slate-500 leading-relaxed italic">
                    Belgelememiş veya sigortalanmamış gönderilerde, kurye (öğrenci) taşıma kusuru ispatlandığı takdirde doğrudan sorumludur. Platform arabulucu rolü üstlenir.
                  </p>
                </div>
              </div>
            </RuleSection>

            {/* Madde 3 */}
            <RuleSection 
              num="03" 
              title="Sosyal Güvenlik (SGK) Uyumu" 
              icon={<Gavel size={20} />}
              desc="Hizmet sağlayıcıların çalışma statüsü hakkında kritik bilgilendirme."
            >
              <ul className="space-y-3">
                <CheckItem text="Haftalık 30 saati aşan işlemler SGK tescil zorunluluğu doğurabilir." />
                <CheckItem text="Biharçlık geliriniz, toplam gelirinizin %50'sini geçmemelidir." />
                <CheckItem text="Öğrenci statünüzün korunması için vergi limitlerine dikkat ediniz." />
              </ul>
            </RuleSection>

          </div>

          {/* Final Footer Label */}
          <div className="text-center py-10 opacity-30">
             <p className="text-[9px] font-black uppercase tracking-[0.4em]">Biharçlık • 2026 • İstanbul</p>
          </div>
        </div>

        {/* --- ACTION BUTTON --- */}
        <div className="p-6 md:p-8 bg-white border-t border-slate-50 flex items-center justify-center">
          <button 
            onClick={onClose} 
            className="w-full max-w-sm py-5 bg-slate-900 text-yellow-400 font-black rounded-3xl shadow-2xl shadow-slate-200 active:scale-95 transition-all uppercase tracking-[0.3em] text-[11px] flex items-center justify-center gap-3"
          >
            <span>Şartları Kabul Ediyorum</span>
            <ArrowRight size={18} />
          </button>
        </div>

      </motion.div>
    </div>
  );
};

// --- YARDIMCI BİLEŞENLER ---

const RuleSection = ({ num, title, icon, desc, children }) => (
  <div className="relative">
    <div className="flex items-start gap-6">
      <div className="flex flex-col items-center">
        <span className="text-[10px] font-black text-slate-200 leading-none mb-2">{num}</span>
        <div className="w-[1px] h-full bg-slate-100 absolute top-4" />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2 text-slate-900">
          {icon}
          <h4 className="text-sm font-black uppercase tracking-tight">{title}</h4>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed mb-4">{desc}</p>
        {children}
      </div>
    </div>
  </div>
);

const ForbiddenItem = ({ label }) => (
  <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl">
    <X size={12} className="text-red-400" />
    <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tighter">{label}</span>
  </div>
);

const CheckItem = ({ text }) => (
  <li className="flex items-start gap-3">
    <CheckCircle2 size={16} className="text-yellow-500 mt-0.5" strokeWidth={2.5} />
    <span className="text-xs font-medium text-slate-600 leading-relaxed">{text}</span>
  </li>
);