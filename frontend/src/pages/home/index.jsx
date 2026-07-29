import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  BiChevronRight, BiCheckDouble, BiMapAlt, BiCrown, 
  BiTime
} from 'react-icons/bi';

import { Navbar }      from './Navbar';
import { HeroSection } from './HeroSection';
import { Footer }      from './Footer';

import img from '../../assets/img.webp'
import GuestOrderSection from './GuestOrder';


// ── DATA ─────────────────────────────────────────────────────────────────────

const studentSteps = [
  { num: '01', title: 'Kayıt', desc: 'Öğrenci belgenle saniyeler içinde topluluğa katıl.' },
  { num: '02', title: 'Seçim', desc: 'Güzergahına uyan en iyi teslimat teklifini seç.' },
  { num: '03', title: 'Yolculuk', desc: 'Zaten gideceğin yere bir paketle eşlik et.' },
  { num: '04', title: 'Kazanç', desc: 'Hafta boyu teslimatlarını yap, kazancını Perşembe günü toplu al.' },
];

const senderSteps = [
  { num: '01', title: 'Tanım', desc: 'Paket içeriğini beyan et ve teslimat adresini gir.' },
  { num: '02', title: 'İlan', desc: 'Öğrenciler için adil bir teslimat ücreti belirle.' },
  { num: '03', title: 'Eşleşme', desc: 'Kimliği doğrulanmış bir öğrenci görüp hemen onaylasın.' },
  { num: '04', title: 'Takip', desc: 'Paketin teslim edildiğinde anında bildirim al.' },
];

const FAQS = [
  { 
    q: 'Platform güvenli mi?', 
    a: 'Evet. Tüm kullanıcılar telefon numarası ve kimlik doğrulamasından geçer. Kuryeler ayrıca öğrenci belgesi ile onaylanır ve profil fotoğrafları kontrol edilir. Her teslimat fotoğraflı onay ile kayıt altına alınır.' 
  },
  { 
    q: 'Hangi ürünler gönderilemez?', 
    a: 'Uyuşturucu ve uyarıcı maddeler, ateşli silah ve mühimmat, kaçak/sahte ürünler, nakit para ve değerli kıymetler, alkol-tütün ürünleri, canlı hayvanlar ve tehlikeli/yanıcı maddeler platform üzerinden gönderilemez. Gönderici, paket içeriğini doğru beyan etmekle yükümlüdür.' 
  },
  { 
    q: 'Şüpheli görünen bir paketi teslim almak zorunda mıyım?', 
    a: 'Hayır. İçeriği beyan ile uyuşmayan, şüpheli görünen veya yasaklı ürün listesine giren bir paketi kurye reddedebilir ve durumu platforma bildirebilir.' 
  },
  { q: 'Kurye olmak için ne gerekiyor?', a: 'Aktif bir üniversite öğrencisi olman yeterli. Kimlik ve öğrenci belgesi onayı sonrası başlayabilirsin.' },
  { q: 'Ne kadar kazanabilirim?', a: 'Teslimat başına minimum 350₺ kazanç elde edersin. Ücreti gönderici belirler.' },
  { q: 'Hangi saatlerde çalışabilirim?', a: 'Tamamen özgürsün. Dersine veya rotana uyan her an ilan alabilirsin.' },
  { q: 'Sadece İstanbul mu?', a: 'Şu an sadece İstanbul içi metro ve metrobüs ağında aktifiz.' },
];

// ── LOCAL SUB-COMPONENTS ─────────────────────────────────────────────────────

const StepCard = ({ step }) => (
  <div className="group relative p-6 md:p-8 rounded-[2rem] bg-white border border-gray-100 transition-all active:scale-[0.98] md:hover:border-[#FBCF2D] md:hover:shadow-[0_20px_40px_rgba(0,0,0,0.02)]">
    <span className="text-[10px] font-black text-[#FBCF2D] tracking-[0.2em] uppercase mb-3 block">{step.num}</span>
    <h3 className="text-base md:text-lg font-black text-gray-900 mb-1">{step.title}</h3>
    <p className="text-[11px] md:text-xs font-medium text-gray-400 leading-relaxed">{step.desc}</p>
  </div>
);

const FaqItem = ({ faq }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-50 last:border-0">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between py-5 md:py-6 text-left transition-all">
        <span className={`text-xs md:text-sm font-bold ${open ? 'text-gray-900' : 'text-gray-500'}`}>{faq.q}</span>
        <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${open ? 'bg-gray-900 text-[#FBCF2D] rotate-45' : 'bg-gray-50 text-gray-400'}`}>
          <BiChevronRight size={18} />
        </div>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${open ? 'max-h-40 pb-5 opacity-100' : 'max-h-0 opacity-0'}`}>
        <p className="text-[11px] md:text-xs font-medium text-gray-400 leading-relaxed border-l-2 border-[#FBCF2D] pl-3 ml-1">{faq.a}</p>
      </div>
    </div>
  );
};

// ── MAIN ─────────────────────────────────────────────────────────────────────

export const HomePage = () => {
  const [activeTab, setActiveTab] = useState('student');
  const steps = activeTab === 'student' ? studentSteps : senderSteps;

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 antialiased selection:bg-[#FBCF2D] selection:text-gray-900">
      <Navbar />
      <HeroSection />
      <GuestOrderSection />

      {/* ── NASIL ÇALIŞIR ── */}
      <section id="nasil-calisir" className="py-16 md:py-32">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 md:mb-16">
            <div className="text-center md:text-left">
              <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-[#FBCF2D] mb-3">Protokol</p>
              <h2 className="text-3xl md:text-4xl font-black tracking-tighter">Süreç nasıl işler?</h2>
            </div>
            
            <div className="flex p-1 bg-gray-50 rounded-2xl border border-gray-100 w-full md:w-fit">
              {['student', 'sender'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl text-[10px] md:text-[11px] font-black uppercase tracking-wider transition-all ${activeTab === tab ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400'}`}
                >
                  {tab === 'student' ? 'Kurye' : 'Gönderici'}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {steps.map((step) => <StepCard key={step.num} step={step} />)}
          </div>
        </div>
      </section>

      {/* ── NEDEN BİHARÇLIK ── */}
      <section id="neden" className="py-10 md:py-20 px-4 md:px-6">
        <div className="max-w-6xl mx-auto bg-gray-900 rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#FBCF2D]/10 rounded-full blur-[100px] -mr-32 -mt-32" />
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20">
            <div className="text-center md:text-left">
              <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-[#FBCF2D] mb-4">Avantajlar</p>
              <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter leading-tight mb-6">
                Eski nesil kurye<br />mantığını unutun<span className="text-[#FBCF2D]">.</span>
              </h2>
              <Link to="/hesap-olustur/ogrenci" className="inline-flex items-center gap-3 text-white text-[10px] md:text-xs font-black uppercase tracking-widest group">
                Hemen Topluluğa Katıl <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-[#FBCF2D] transition-all"><BiChevronRight /></div>
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:gap-x-12 md:gap-y-10">
              {[
                { icon: <BiCheckDouble />, t: '%30 Hizmet bedeli' },
                { icon: <BiMapAlt />, t: 'Özgür Rota' },
                { icon: <BiCrown />, t: 'Onaylı Profil' },
                { icon: <BiTime />, t: '7/24 Destek' },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center md:items-start text-center md:text-left">
                  <div className="text-[#FBCF2D] mb-3 text-xl md:text-2xl">{item.icon}</div>
                  <h4 className="text-white text-[11px] md:text-sm font-black mb-1">{item.t}</h4>
                  <p className="text-white/40 text-[9px] md:text-[11px] font-medium leading-relaxed">{item.d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SSS ── */}
      <section id="sss" className="py-20 md:py-32">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12 md:mb-16">
            <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-[#FBCF2D] mb-3">Yardım Merkezi</p>
            <h2 className="text-3xl md:text-4xl font-black tracking-tighter">Aklınıza takılanlar</h2>
          </div>
          <div className="bg-gray-50/50 rounded-[2rem] p-4 md:p-8 border border-gray-50">
            {FAQS.map((faq, i) => <FaqItem key={i} faq={faq} />)}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="pb-20 md:pb-32 px-4 md:px-6">
  <div className="max-w-6xl mx-auto bg-[#FBCF2D] rounded-[2.5rem] md:rounded-[3rem] px-6 py-16 md:py-24 text-center relative overflow-hidden">
    {/* İçerik Katmanı */}
    <div className="relative z-20">
      <h2 className="text-3xl md:text-6xl font-black text-gray-900 tracking-tighter mb-8 leading-tight">
        Şehrin ritmine<br className="hidden md:block" /> ortak ol.
      </h2>
      <div className="flex flex-col sm:flex-row gap-3 justify-center items-stretch sm:items-center">
        <Link to="/hesap-olustur/ogrenci" className="h-12 md:h-14 px-10 rounded-full bg-gray-900 text-white text-[10px] md:text-[11px] font-black uppercase tracking-widest flex items-center justify-center transition-transform active:scale-95">
          Kurye Ol
        </Link>
        <Link to="/hesap-olustur/gonderici" className="h-12 md:h-14 px-10 rounded-full border-2 border-gray-900/10 text-gray-900 text-[10px] md:text-[11px] font-black uppercase tracking-widest flex items-center justify-center hover:bg-white transition-all active:scale-95">
          İlan Ver
        </Link>
      </div>
    </div>

    {/* Görsel Katmanı */}
    <div className="absolute bottom-0 right-10 z-10 w-[280px] md:w-[400px] pointer-events-none translate-x-10 md:translate-x-0">
      <img 
        src={img} 
        alt="Kurye" 
        className="w-full h-auto block align-bottom"
      />
    </div>
  </div>
</section>

      <Footer />
    </div>
  );
};

export default HomePage;