import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { BiCheckCircle, BiNavigation, BiPackage, BiTargetLock, BiTimeFive } from 'react-icons/bi';

// --- LEAFLET ICON AYARLARI ---
// Leaflet'in varsayılan ikon sorununu çözer
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// --- ÖZEL MARKER ICONLARI ---

// Fiyatı gösteren özel marker
const createPriceMarker = (price) => {
  return L.divIcon({
    className: 'custom-price-marker',
    html: `
      <div style="
        background-color: #111827; 
        color: white;
        font-weight: 800;
        font-size: 12px;
        padding: 6px 10px;
        border-radius: 12px;
        border: 2px solid white;
        box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        white-space: nowrap;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        transform: translate(-50%, -50%);
        font-family: sans-serif;
      ">
        ${price}
        <div style="
          position: absolute;
          bottom: -6px;
          left: 50%;
          transform: translateX(-50%);
          width: 0; 
          height: 0; 
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-top: 6px solid #111827;
        "></div>
      </div>
    `,
    iconSize: [60, 30],
    iconAnchor: [30, 35], // Ucu tam konuma gelsin
    popupAnchor: [0, -35] // Popup biraz yukarıda açılsın
  });
};

// Kullanıcı konumu için yanıp sönen marker
const userIcon = L.divIcon({
  className: 'user-location',
  html: '<div style="width: 20px; height: 20px; background: #3b82f6; border: 3px solid white; border-radius: 50%; box-shadow: 0 0 0 4px rgba(59,130,246,0.3); animation: pulse 2s infinite;"></div>',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

// --- YARDIMCI BİLEŞENLER ---

// Konum değiştiğinde haritayı oraya odaklayan bileşen
const MapRecenter = ({ location }) => {
  const map = useMap();
  useEffect(() => {
    if (location) {
      map.flyTo(location, 14, { duration: 2 }); // 2 saniyelik animasyonla uç
    }
  }, [location, map]);
  return null;
};

export const JobMapView = ({ 
  jobs, 
  onAcceptJob, 
  formatCurrency, 
  userLocation, 
  onGetLocation, 
  hasActiveJob 
}) => {
  
  // Varsayılan Merkez (İstanbul - Fatih)
  const defaultCenter = [41.0082, 28.9784];
  const center = userLocation || defaultCenter;

  // Sadece koordinatı geçerli olan işleri filtrele
  const mapJobs = jobs.filter(j => j.pickup_latitude && j.pickup_longitude);

  return (
    <div className="w-full h-[600px] rounded-[2rem] overflow-hidden shadow-xl border border-gray-200 relative z-0 bg-gray-100">
      
      {/* Konum Bul Butonu (Harita Üzerinde) */}
      <button 
        onClick={onGetLocation}
        className="absolute top-4 right-4 z-[1000] bg-white hover:bg-gray-50 text-gray-800 font-bold p-3 rounded-2xl shadow-lg border border-gray-100 transition-transform active:scale-95 flex items-center gap-2"
        title="Konumumu Bul"
      >
        <BiTargetLock size={22} className="text-blue-600" />
        <span className="text-sm hidden sm:inline">Yakınımda Ara</span>
      </button>

      {/* Lejant / Bilgi Hapı */}
      <div className="absolute top-4 left-4 z-[1000] bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-md border border-gray-200 flex items-center gap-2 pointer-events-none">
         <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
         <span className="text-xs font-bold text-gray-700">{mapJobs.length} Müsait İş</span>
      </div>

      <MapContainer 
        center={center} 
        zoom={12} 
        style={{ height: '100%', width: '100%' }}
        zoomControl={false} // Zoom kontrolünü kaldırdık (temiz görünüm için)
      >
        {/* Harita Katmanı (CartoDB Voyager - Temiz Stil) */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        />

        {/* Harita Kontrolcüsü */}
        <MapRecenter location={userLocation} />

        {/* Kullanıcı Konumu */}
        {userLocation && (
          <Marker position={userLocation} icon={userIcon}>
            <Popup closeButton={false} className="font-bold text-xs">📍 Siz Buradasınız</Popup>
          </Marker>
        )}

        {/* İş Markerları */}
        {mapJobs.map(job => (
          <Marker 
            key={job.id} 
            position={[job.pickup_latitude, job.pickup_longitude]} 
            icon={createPriceMarker(formatCurrency(job.payment_amount))}
          >
            <Popup className="custom-popup-clean" minWidth={280} maxWidth={280} closeButton={false}>
              <div className="p-1 font-sans">
                
                {/* Popup Header */}
                <div className="flex justify-between items-start mb-3 border-b border-gray-100 pb-2">
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Sipariş No</span>
                    <h3 className="text-gray-900 font-extrabold text-sm">#{job.order_number}</h3>
                  </div>
                  <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1">
                    <BiTimeFive /> Hemen
                  </span>
                </div>

                {/* Rota Özeti */}
                <div className="space-y-3 mb-4">
                  {/* Alış */}
                  <div className="flex items-start gap-2.5">
                    <div className="flex flex-col items-center">
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500 shadow-sm"></div>
                        <div className="w-0.5 h-6 bg-gray-200 my-0.5"></div>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">ALIŞ NOKTASI</p>
                      <p className="text-xs font-bold text-gray-900 line-clamp-1">{job.pickup_district}</p>
                      <p className="text-[10px] text-gray-500 line-clamp-1">{job.pickup_address}</p>
                    </div>
                  </div>
                  
                  {/* Teslim */}
                  <div className="flex items-start gap-2.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-gray-900 shadow-sm mt-1"></div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">TESLİM NOKTASI</p>
                      <p className="text-xs font-bold text-gray-900 line-clamp-1">{job.delivery_district}</p>
                      <p className="text-[10px] text-gray-500 line-clamp-1">{job.delivery_address}</p>
                    </div>
                  </div>
                </div>

                {/* Alt Bilgi Kutucukları */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                   <div className="bg-gray-50 p-2 rounded-xl flex flex-col items-center justify-center text-center border border-gray-100">
                      <BiPackage className="text-gray-400 mb-1" size={16} />
                      <span className="text-[10px] font-bold text-gray-600 uppercase">{job.package_size === 'small' ? 'Küçük Boy' : 'Paket'}</span>
                   </div>
                   <div className="bg-gray-50 p-2 rounded-xl flex flex-col items-center justify-center text-center border border-gray-100">
                      <BiNavigation className="text-gray-400 mb-1" size={16} />
                      <span className="text-[10px] font-bold text-gray-600 uppercase">Rota Detayı</span>
                   </div>
                </div>

                {/* Aksiyon Butonu */}
                <button 
                  onClick={() => onAcceptJob(job.id)}
                  disabled={hasActiveJob}
                  className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md ${
                    hasActiveJob 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-gray-900 text-white hover:bg-black hover:shadow-lg'
                  }`}
                >
                  {hasActiveJob ? 'Önce Mevcut İşi Bitir' : 'Görevi Kabul Et'}
                  {!hasActiveJob && <BiCheckCircle size={16} className="text-green-400" />}
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};