import { useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { BiHash, BiShapeTriangle } from 'react-icons/bi';
import { TypewriterDistricts } from './TypewriterDistricts';

// ── İlçeler
const DISTRICTS = [
  { name: 'Beşiktaş',  lat: 41.0422, lng: 29.0083 },
  { name: 'Şişli',     lat: 41.0602, lng: 28.9877 },
  { name: 'Beyoğlu',   lat: 41.0369, lng: 28.9850 },
  { name: 'Fatih',     lat: 41.0186, lng: 28.9397 },
  { name: 'Sarıyer',   lat: 41.1670, lng: 29.0510 },
  { name: 'Kağıthane', lat: 41.0784, lng: 28.9742 },
  { name: 'Bağcılar',  lat: 41.0397, lng: 28.8563 },
  { name: 'Bakırköy',  lat: 40.9819, lng: 28.8771 },
  { name: 'Kadıköy',   lat: 40.9927, lng: 29.0277 },
  { name: 'Üsküdar',   lat: 41.0233, lng: 29.0151 },
  { name: 'Ataşehir',  lat: 40.9923, lng: 29.1244 },
  { name: 'Maltepe',   lat: 40.9344, lng: 29.1318 },
  { name: 'Kartal',    lat: 40.9115, lng: 29.1921 },
  { name: 'Ümraniye',  lat: 41.0165, lng: 29.1239 },
];

const SPAWN_INTERVAL = 2800;
const LIFETIME       = 5500;

const STATS = [
  { val: '350₺', lbl: 'Minimum Sipariş Tutarı' },
  { val: '34',   lbl: 'Aktif Bölge' },
  { val: '%100', lbl: 'Doğrulama' },
];

// ── Sabit ilçe noktası
const dotHtml = () => `
  <div style="display:flex;align-items:center;justify-content:center;pointer-events:none;transform:translate(-50%,-50%);">
    <div style="position:relative;width:8px;height:8px;">
      <div style="
        position:absolute;inset:0;border-radius:50%;
        background:#FBCF2D;opacity:0.2;
        animation:distPulse ${2.5 + Math.random() * 1.5}s ease-out infinite;
        animation-delay:${(Math.random() * 2).toFixed(2)}s;
      "></div>
      <div style="position:absolute;inset:2px;border-radius:50%;background:#FBCF2D;opacity:0.55;"></div>
    </div>
  </div>
`;

// ── Premium paket marker
const packageMarkerHtml = (name) => `
  <div style="
    display:flex;flex-direction:column;align-items:center;
    pointer-events:none;transform:translate(-50%,-100%);
    animation:pkgIn 0.45s cubic-bezier(0.34,1.56,0.64,1) both;
  ">
    <div style="position:relative;">
      <div style="
        position:absolute;top:50%;left:50%;
        width:44px;height:44px;border-radius:50%;
        background:rgba(251,207,45,0.18);
        transform:translate(-50%,-50%);
        animation:pkgRing 1.4s ease-out infinite;
      "></div>
      <div style="
        width:38px;height:38px;border-radius:50%;
        background:#FBCF2D;
        border:2.5px solid rgba(255,255,255,0.9);
        display:flex;align-items:center;justify-content:center;
        box-shadow:0 4px 20px rgba(251,207,45,0.4),0 1px 4px rgba(0,0,0,0.1);
        position:relative;z-index:1;
      ">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style="display:block;">
          <path d="M21 8L12 3L3 8V16L12 21L21 16V8Z" fill="#111827" fill-opacity="0.85"/>
          <path d="M3 8L12 13L21 8" fill="none" stroke="#fff" stroke-width="1.4" stroke-linejoin="round" opacity="0.5"/>
          <line x1="12" y1="13" x2="12" y2="21" stroke="#fff" stroke-width="1.4" opacity="0.4"/>
          <path d="M7.5 5.5L16.5 10.5" stroke="#FBCF2D" stroke-width="1" opacity="0.6" stroke-linecap="round"/>
        </svg>
      </div>
    </div>
    <div style="width:1.5px;height:6px;background:#111827;opacity:0.2;margin-top:2px;border-radius:2px;"></div>
  </div>
`;

    // <div style="
    //   margin-top:5px;
    //   background:rgba(17,24,39,0.82);
    //   backdrop-filter:blur(4px);
    //   color:#fff;font-size:9px;font-weight:700;
    //   padding:3px 9px;border-radius:20px;
    //   white-space:nowrap;letter-spacing:0.04em;
    //   box-shadow:0 2px 8px rgba(0,0,0,0.2);
    // ">${name}</div>

// ── Harita arka plan bileşeni
const MapBackground = () => {
  const mapRef      = useRef(null);
  const mapInstance = useRef(null);
  const markersRef  = useRef([]);
  const timerRef    = useRef(null);

  const loadLeaflet = useCallback(() => new Promise((resolve) => {
    if (window.L) { resolve(); return; }
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id    = 'leaflet-css';
      link.rel   = 'stylesheet';
      link.href  = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }
    const script  = document.createElement('script');
    script.src    = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = resolve;
    document.head.appendChild(script);
  }), []);

  useEffect(() => {
    if (mapInstance.current) return;
    let destroyed = false;

    loadLeaflet().then(() => {
      if (destroyed || !mapRef.current) return;
      const L = window.L;

      const map = L.map(mapRef.current, {
        center:             [41.02, 29.02],
        zoom:               11,
        zoomControl:        false,
        attributionControl: false,
        dragging:           false,
        scrollWheelZoom:    false,
        doubleClickZoom:    false,
        touchZoom:          false,
      });

      // Çok açık tile — içerik okunabilirliği için soluk
      L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png',
        { maxZoom: 19, subdomains: 'abcd', opacity: 0.85 }
      ).addTo(map);

      // Sabit ilçe noktaları
      DISTRICTS.forEach((d) => {
        const icon = L.divIcon({
          className: '',
          html:      dotHtml(),
          iconSize:  [8, 8],
          iconAnchor:[4, 4],
        });
        L.marker([d.lat, d.lng], { icon, interactive: false }).addTo(map);
      });

      mapInstance.current = map;

      // Spawn
      const spawn = () => {
        const d   = DISTRICTS[Math.floor(Math.random() * DISTRICTS.length)];
        const lat = d.lat + (Math.random() - 0.5) * 0.022;
        const lng = d.lng + (Math.random() - 0.5) * 0.022;

        const icon = L.divIcon({
          className: '',
          html:      packageMarkerHtml(d.name),
          iconSize:  [100, 72],
          iconAnchor:[50, 72],
        });

        const marker = L.marker([lat, lng], { icon, zIndexOffset: 200 }).addTo(map);
        markersRef.current.push(marker);

        setTimeout(() => {
          try { map.removeLayer(marker); } catch (_) {}
          markersRef.current = markersRef.current.filter((m) => m !== marker);
        }, LIFETIME);
      };

      spawn();
      timerRef.current = setInterval(spawn, SPAWN_INTERVAL);
    });

    return () => {
      destroyed = true;
      clearInterval(timerRef.current);
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [loadLeaflet]);

  return <div ref={mapRef} style={{ width: '100%', height: '100%' }} />;
};

// ── Ana HeroSection
export const HeroSection = () => (
  <section style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden' }}>

    {/* CSS animasyonları */}
    <style>{`
      @keyframes distPulse {
        0%   { transform:scale(1);   opacity:0.2; }
        55%  { transform:scale(4.5); opacity:0; }
        100% { transform:scale(4.5); opacity:0; }
      }
      @keyframes pkgIn {
        0%   { opacity:0; transform:translate(-50%,-100%) scale(0.25); }
        65%  { opacity:1; transform:translate(-50%,-100%) scale(1.08); }
        100% { opacity:1; transform:translate(-50%,-100%) scale(1); }
      }
      @keyframes pkgRing {
        0%   { transform:translate(-50%,-50%) scale(1);   opacity:0.5; }
        100% { transform:translate(-50%,-50%) scale(2.2); opacity:0; }
      }
    `}</style>

    {/* ── Katman 1: Harita arka plan */}
    <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
      <MapBackground />
    </div>

    {/* ── Katman 2: Beyaz gradient overlay — içeriği okunabilir kılar */}
    <div style={{
      position: 'absolute', inset: 0, zIndex: 1,
      background: 'linear-gradient(to right, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.72) 38%, rgba(255,255,255,0.04) 100%)',
    }} />

    {/* ── Katman 3: Alt gradient — section bitişi */}
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 2,
      height: 120,
      background: 'linear-gradient(to top, rgba(255,255,255,1) 0%, transparent 100%)',
    }} />

    {/* ── Katman 4: İçerik */}
    <div style={{ position: 'relative', zIndex: 3, height: '100%' }}>
      <div className="max-w-6xl mx-auto px-6 h-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center h-full pt-16">

          {/* Sol İçerik */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-3 mb-6 md:mb-8">
              <TypewriterDistricts />
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-gray-900 leading-[1.1] md:leading-[0.95] tracking-[-0.04em] mb-6 md:mb-8">
              Şehri dolaş,<br />
              <span className="text-yellow-400">cebini</span> doldur<span className="text-[#FBCF2D]">.</span>
            </h1>

            <p className="text-sm md:text-base text-gray-500 leading-relaxed max-w-md mb-8 md:mb-10 font-medium">
              Günlük yolculuklarını İstanbul içi teslimat siparişleriyle değerlendir. Her teslimat, kimliği doğrulanmış kullanıcılar arasında arasında gerçekleşir.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12 md:mb-16">
              <Link
                to="/hesap-olustur/ogrenci"
                className="h-14 px-8 rounded-full bg-gray-900 text-white text-xs font-black flex items-center justify-center hover:bg-black transition-all shadow-xl shadow-gray-200"
              >
                Kurye Olarak Başla
              </Link>
              <Link
                to="/hesap-olustur/gonderici"
                className="h-14 px-8 rounded-full border border-gray-200 text-gray-900 text-xs font-black flex items-center justify-center hover:bg-gray-50 transition-all bg-white/70"
                style={{ backdropFilter: 'blur(8px)' }}
              >
                Paket Gönder
              </Link>
            </div>

            <div className="flex justify-between sm:justify-start sm:gap-12 border-t border-gray-100 pt-8 md:pt-10">
              {STATS.map((s) => (
                <div key={s.lbl} className="flex flex-col gap-1">
                  <span className="text-lg md:text-xl font-black text-gray-900 tracking-tighter">{s.val}</span>
                  <span className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest">{s.lbl}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Sağ — ilan kartı (harita üzerinde yüzer) */}
          <div className="lg:col-span-5 relative hidden lg:block">

            {/* Ana Kart */}
            <div
              className="bg-white/80 border border-gray-100 rounded-[2rem] p-8 relative z-10"
              style={{
                backdropFilter: 'blur(16px)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
              }}
            >
              <div className="flex justify-between items-start mb-12">
                <div className="p-3 bg-gray-50 rounded-2xl">
                  <BiHash size={24} className="text-[#FBCF2D]" />
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Durum</span>
                  <p className="text-xs font-black text-green-500">Müsait Paketler (12)</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-2.5 h-2.5 rounded-full border-2 border-[#FBCF2D]" />
                    <div className="w-0.5 h-8 bg-gray-100" />
                    <div className="w-2.5 h-2.5 rounded-full bg-gray-900" />
                  </div>
                  <div className="flex flex-col gap-5">
                    <div>
                      <p className="text-[10px] font-bold text-gray-300 uppercase">Çıkış</p>
                      <p className="text-sm font-black text-gray-900">Üsküdar İskelesi</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-300 uppercase">Varış</p>
                      <p className="text-sm font-black text-gray-900">Beşiktaş (M7 Metro)</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-10 pt-8 border-t border-gray-50 flex justify-between items-center">
                <span className="text-xl font-black text-gray-900">250₺</span>
                <button className="h-10 px-5 bg-[#FBCF2D] rounded-full text-[11px] font-black text-gray-900 hover:scale-105 active:scale-95 transition-all">
                  Detayı Gör
                </button>
              </div>
            </div>

            {/* Canlı Akış Kartı */}
            <div
              className="absolute -bottom-6 -left-6 p-5 bg-gray-900/90 rounded-3xl shadow-2xl z-20"
              style={{ backdropFilter: 'blur(12px)' }}
            >
              <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest mb-2">Son Teslimat</p>
              <div className="flex items-center gap-3">
  {/* İkon yerine Görsel Alanı */}
  <div className="w-8 h-8 rounded-full bg-[#FBCF2D] flex items-center justify-center shrink-0 overflow-hidden">
    <img 
      src="https://konforist.com.tr/erkek/wp-content/uploads/2025/07/kadir-has-universitesi-erkek-yurdu-konforist-ogrenci-yurtlari.webp" 
      alt="Profil" 
      className="w-full h-full object-cover"
    />
  </div>
  
  <p className="text-[11px] font-bold text-white whitespace-nowrap">
    Yunus A. teslimatı tamamladı
  </p>
</div>
            </div>

          </div>
        </div>
      </div>
    </div>
  </section>
);