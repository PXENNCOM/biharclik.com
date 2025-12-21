import React from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { BiX, BiCheckCircle, BiMap, BiNavigation, BiTimeFive, BiUser } from 'react-icons/bi';

// --- LEAFLET ICON KONFİGÜRASYONU ---
// Leaflet'in varsayılan ikon sorununu çözer ve özel markerlar oluşturur
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const createCustomIcon = (color) => {
  return L.divIcon({
    className: 'custom-marker-pin',
    html: `
      <div style="
        background-color: ${color};
        width: 32px;
        height: 32px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 4px 12px rgba(0,0,0,0.4);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          width: 8px;
          height: 8px;
          background-color: white;
          border-radius: 50%;
          transform: rotate(45deg);
        "></div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32], // İğnenin ucu
    popupAnchor: [0, -32],
  });
};

const pickupIcon = createCustomIcon('#f59e0b'); // Sarı (Amber-500)
const deliveryIcon = createCustomIcon('#111827'); // Siyah (Gray-900)
const userIcon = L.divIcon({
  className: 'user-location',
  html: '<div style="width: 24px; height: 24px; background: #3b82f6; border: 4px solid white; border-radius: 50%; box-shadow: 0 0 0 2px #3b82f6; animation: pulse 2s infinite;"></div>',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

export const JobRouteModal = ({ isOpen, onClose, job, userLocation, onAccept, formatCurrency }) => {
  if (!isOpen || !job) return null;

  // Harita merkezini belirle (Varsayılan: Alış noktası, yoksa İstanbul merkezi)
  const centerLat = job.pickup_latitude || 41.0082;
  const centerLng = job.pickup_longitude || 28.9784;

  const hasCoordinates = job.pickup_latitude && job.pickup_longitude && job.delivery_latitude && job.delivery_longitude;

  return (
    <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-[10000] p-4 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-5xl h-[85vh] rounded-[2rem] shadow-2xl flex flex-col md:flex-row overflow-hidden relative">
        
        {/* --- SOL TARAF: HARİTA (Mobilde Üstte) --- */}
        <div className="w-full md:w-2/3 h-1/2 md:h-full relative bg-gray-100">
            {/* Harita Üstü Bilgi Hapı */}
            <div className="absolute top-4 left-4 z-[1000] bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-md border border-gray-200 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <span className="text-xs font-bold text-gray-700">Canlı Rota Önizleme</span>
            </div>

            {job.pickup_latitude ? (
                <MapContainer
                    center={[centerLat, centerLng]}
                    zoom={13}
                    style={{ height: '100%', width: '100%' }}
                    zoomControl={false}
                >
                    <TileLayer
                        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    />

                    {/* Alış Noktası */}
                    <Marker position={[job.pickup_latitude, job.pickup_longitude]} icon={pickupIcon}>
                        <Popup className="font-sans font-bold">📍 Alış: {job.pickup_district}</Popup>
                    </Marker>

                    {/* Teslim Noktası (Varsa) */}
                    {job.delivery_latitude && job.delivery_longitude && (
                        <>
                            <Marker position={[job.delivery_latitude, job.delivery_longitude]} icon={deliveryIcon}>
                                <Popup className="font-sans font-bold">🏁 Teslim: {job.delivery_district}</Popup>
                            </Marker>
                            {/* Çizgi */}
                            <Polyline
                                positions={[
                                    [job.pickup_latitude, job.pickup_longitude],
                                    [job.delivery_latitude, job.delivery_longitude],
                                ]}
                                color="#1f2937" // Gray-900
                                weight={4}
                                dashArray="8, 8"
                                opacity={0.7}
                            />
                        </>
                    )}

                    {/* Kullanıcı Konumu */}
                    {userLocation && (
                        <Marker position={userLocation} icon={userIcon}>
                            <Popup>Siz Buradasınız</Popup>
                        </Marker>
                    )}
                </MapContainer>
            ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-400">
                    <BiMap size={48} className="mb-2 opacity-50" />
                    <p className="font-medium">Harita verisi mevcut değil</p>
                </div>
            )}

             {/* Kapat Butonu (Harita üzerinde) */}
             <button 
                onClick={onClose}
                className="absolute top-4 right-4 z-[1000] p-3 bg-white hover:bg-gray-100 text-gray-900 rounded-full shadow-lg transition-transform hover:scale-110"
            >
                <BiX size={24} />
            </button>
        </div>

        {/* --- SAĞ TARAF: DETAYLAR (Mobilde Altta) --- */}
        <div className="w-full md:w-1/3 h-1/2 md:h-full bg-white flex flex-col border-l border-gray-100">
            
            {/* Header */}
            <div className="p-6 border-b border-gray-50">
                <div className="flex items-center gap-2 mb-2">
                    <span className="px-3 py-1 bg-gray-900 text-white text-[10px] font-bold uppercase tracking-wider rounded-full">
                        #{job.order_number}
                    </span>
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-[10px] font-bold uppercase tracking-wider rounded-full flex items-center gap-1">
                        <BiTimeFive /> Müsait
                    </span>
                </div>
                <h2 className="text-3xl font-black text-gray-900 tracking-tight">
                    {formatCurrency(job.payment_amount)}
                </h2>
                <p className="text-sm text-gray-500 mt-1 font-medium">Tahmini Kazanç</p>
            </div>

            {/* Rota Timeline */}
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                <div className="relative pl-6 border-l-2 border-dashed border-gray-200 ml-3 space-y-8">
                    
                    {/* Alış */}
                    <div className="relative group">
                        <span className="absolute -left-[31px] top-1 w-4 h-4 bg-white border-4 border-yellow-500 rounded-full shadow-sm group-hover:scale-125 transition-transform"></span>
                        <div>
                            <p className="text-xs font-extrabold text-yellow-600 uppercase tracking-widest mb-1">ALIŞ NOKTASI</p>
                            <h3 className="text-lg font-bold text-gray-900 leading-tight">{job.pickup_district}</h3>
                            <p className="text-sm text-gray-500 mt-1 leading-relaxed">{job.pickup_address}</p>
                            {job.pickup_contact_name && (
                                <div className="flex items-center gap-2 mt-2 text-xs font-bold text-gray-400 bg-gray-50 p-2 rounded-lg w-fit">
                                    <BiUser /> {job.pickup_contact_name}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Teslim */}
                    <div className="relative group">
                        <span className="absolute -left-[31px] top-1 w-4 h-4 bg-gray-900 border-2 border-gray-900 rounded-full shadow-sm group-hover:scale-125 transition-transform"></span>
                        <div>
                            <p className="text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-1">TESLİM NOKTASI</p>
                            <h3 className="text-lg font-bold text-gray-900 leading-tight">{job.delivery_district}</h3>
                            <p className="text-sm text-gray-500 mt-1 leading-relaxed">{job.delivery_address}</p>
                             {job.delivery_contact_name && (
                                <div className="flex items-center gap-2 mt-2 text-xs font-bold text-gray-400 bg-gray-50 p-2 rounded-lg w-fit">
                                    <BiUser /> {job.delivery_contact_name}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Paket Detayı */}
                <div className="mt-8 bg-blue-50 p-4 rounded-2xl border border-blue-100">
                     <h4 className="text-blue-900 font-bold text-sm mb-1 flex items-center gap-2">
                        <BiNavigation /> Paket Detayı
                     </h4>
                     <p className="text-blue-800 text-sm">{job.package_description}</p>
                </div>
            </div>

            {/* Footer Action */}
            <div className="p-6 border-t border-gray-50 bg-gray-50">
                <button 
                    onClick={() => onAccept(job.id)}
                    className="w-full py-4 bg-gray-900 hover:bg-black text-white font-bold rounded-2xl shadow-lg shadow-gray-300 hover:shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3 text-lg"
                >
                    <span>Görevi Kabul Et</span>
                    <BiCheckCircle size={24} className="text-green-400" />
                </button>
            </div>

        </div>
      </div>
    </div>
  );
};