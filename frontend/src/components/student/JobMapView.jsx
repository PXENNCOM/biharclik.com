import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { BiPackage, BiNavigation, BiCurrentLocation, BiCheckCircle, BiChevronRight, BiMap, BiX } from 'react-icons/bi';

// Leaflet marker ikonlarını düzelt
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker ikonları
const createIcon = (color) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="background-color: ${color}; width: 30px; height: 30px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
  });
};

const pickupIcon = createIcon('#facc15'); // Sarı (alış)
const deliveryIcon = createIcon('#1f2937'); // Gri (teslim)

// Harita merkezi güncelleme komponenti
const RecenterMap = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, 12);
    }
  }, [center, map]);
  return null;
};

// Mesafe hesaplama (Haversine formülü)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Dünya yarıçapı (km)
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

export const JobMapView = ({ jobs, onAcceptJob, formatCurrency, userLocation, onGetLocation, hasActiveJob }) => {
  const [selectedJob, setSelectedJob] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailJob, setDetailJob] = useState(null);
  const defaultCenter = [41.0082, 28.9784]; // İstanbul merkez
  const [mapCenter, setMapCenter] = useState(userLocation || defaultCenter);

  useEffect(() => {
    if (userLocation) {
      setMapCenter(userLocation);
    }
  }, [userLocation]);

  // Konum varsa kullan, yoksa varsayılan merkez
  const center = userLocation || mapCenter;

  const handleShowJobRoute = (job) => {
    setDetailJob(job);
    setShowDetailModal(true);
  };

  return (
    <div className="space-y-4">
      
      {/* Mevcut Konumumu Al Butonu */}
      <div className="flex justify-between items-center">
        <p className="text-sm font-medium text-gray-600">
          {jobs.length} iş haritada görüntüleniyor
        </p>
        <button
          onClick={onGetLocation}
          className="flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium rounded-xl transition text-sm"
        >
          <BiCurrentLocation size={18} />
          Konumumu Al
        </button>
      </div>

      {/* Harita */}
      <div className="rounded-3xl overflow-hidden border-2 border-gray-200 h-[600px] relative shadow-lg">
        <MapContainer
          center={center}
          zoom={12}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          <RecenterMap center={center} />

          {/* Kullanıcı konumu marker */}
          {userLocation && (
            <Marker position={userLocation} icon={L.divIcon({
              className: 'user-location-marker',
              html: '<div style="width: 20px; height: 20px; background: #3b82f6; border: 3px solid white; border-radius: 50%; box-shadow: 0 2px 8px rgba(59,130,246,0.5);"></div>',
              iconSize: [20, 20],
              iconAnchor: [10, 10],
            })}>
              <Popup>
                <div className="text-center font-bold text-sm">
                  📍 Sen Buradasın
                </div>
              </Popup>
            </Marker>
          )}

          {/* İşler için marker'lar */}
          {jobs.map((job) => {
            // Koordinat kontrolü
            const hasPickupCoords = job.pickup_latitude && job.pickup_longitude;
            const hasDeliveryCoords = job.delivery_latitude && job.delivery_longitude;

            if (!hasPickupCoords && !hasDeliveryCoords) return null;

            const distance = userLocation && hasPickupCoords
              ? calculateDistance(
                  userLocation[0],
                  userLocation[1],
                  job.pickup_latitude,
                  job.pickup_longitude
                ).toFixed(1)
              : null;

            return (
              <div key={job.id}>
                {/* Alış Marker */}
                {hasPickupCoords && (
                  <Marker
                    position={[job.pickup_latitude, job.pickup_longitude]}
                    icon={pickupIcon}
                    eventHandlers={{
                      click: () => setSelectedJob(job),
                    }}
                  >
                    <Popup>
                        <div className="p-2 min-w-[250px] max-h-[400px] overflow-y-auto">
                            <div className="flex justify-between items-start mb-3">
                          <span className="text-xs font-bold text-gray-400">#{job.order_number}</span>
                          <span className="text-lg font-black text-gray-900">{formatCurrency(job.payment_amount)}</span>
                        </div>

                        <div className="space-y-3 mb-4">
                          <div>
                            <span className="text-[9px] font-bold text-yellow-600 uppercase tracking-wider block mb-1">📍 Alış</span>
                            <p className="text-sm font-bold text-gray-900">{job.pickup_district}</p>
                            <p className="text-xs text-gray-500 line-clamp-1">{job.pickup_address}</p>
                          </div>

                          <div>
                            <span className="text-[9px] font-bold text-gray-600 uppercase tracking-wider block mb-1">📦 Teslim</span>
                            <p className="text-sm font-bold text-gray-900">{job.delivery_district}</p>
                            <p className="text-xs text-gray-500 line-clamp-1">{job.delivery_address}</p>
                          </div>

                          <div className="flex items-center gap-2 text-xs text-gray-600 bg-gray-50 p-2 rounded-lg">
                            <BiPackage />
                            <span>{job.package_description}</span>
                          </div>

                          {distance && (
                            <div className="text-xs font-bold text-blue-600 bg-blue-50 p-2 rounded-lg text-center">
                              📍 {distance} km uzakta
                            </div>
                          )}
                        </div>

                      <div className="space-y-2">
  {/* ⭐ Aktif iş varsa uyarı */}
  {hasActiveJob && (
    <div className="w-full py-2 bg-amber-50 text-amber-700 text-xs font-bold rounded-lg text-center border border-amber-200">
      ⚠️ Aktif işinizi önce tamamlayın
    </div>
  )}

  {/* Haritada Gör Butonu */}
  <button
    onClick={() => handleShowJobRoute(job)}
    disabled={hasActiveJob}
    className={`w-full py-2.5 font-bold rounded-xl transition text-sm flex items-center justify-center gap-2 ${
      hasActiveJob
        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
        : 'bg-blue-50 hover:bg-blue-100 text-blue-700'
    }`}
  >
    <BiMap size={16} />
    <span>Rotayı Haritada Gör</span>
  </button>

  {/* İşi Kabul Et Butonu */}
  <button
    onClick={() => onAcceptJob(job.id)}
    disabled={hasActiveJob}
    className={`w-full py-2.5 font-bold rounded-xl transition text-sm flex items-center justify-center gap-2 ${
      hasActiveJob
        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
        : 'bg-gray-900 hover:bg-black text-white'
    }`}
  >
    <span>{hasActiveJob ? 'İş Alınamaz' : 'İşi Kabul Et'}</span>
    <BiCheckCircle size={16} />
  </button>
</div>
                      </div>
                    </Popup>
                  </Marker>
                )}               
              </div>
            );
          })}
        </MapContainer>

        {/* Harita üstünde bilgi */}
        <div className="absolute top-4 left-4 z-[1000] bg-white/95 backdrop-blur-sm px-4 py-2.5 rounded-xl shadow-lg">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <span className="text-xs font-bold text-gray-700">Alış</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-gray-900"></div>
              <span className="text-xs font-bold text-gray-700">Teslim</span>
            </div>
            {userLocation && (
              <div className="flex items-center gap-1.5 pl-2 border-l border-gray-200">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-xs font-bold text-gray-700">Konumun</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Koordinatsız İşler Uyarısı */}
      {jobs.some(j => !j.pickup_latitude || !j.delivery_latitude) && (
        <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-xl text-sm text-yellow-800">
          ⚠️ Bazı işlerin konum bilgisi eksik, haritada görünmeyebilir.
        </div>
      )}

      {/* İŞ DETAY HARİTASI MODAL */}
{showDetailModal && detailJob && (
<div className="fixed inset-0 h-screen w-screen bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 animate-in fade-in duration-200">
    <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-black text-gray-900">İş Rotası</h2>
                <p className="text-sm text-gray-500 mt-1">#{detailJob.order_number} - {formatCurrency(detailJob.payment_amount)}</p>
              </div>
              <button 
                onClick={() => setShowDetailModal(false)}
                className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition"
              >
                <BiX size={24} />
              </button>
            </div>

            {/* Harita */}
            <div className="h-[500px] relative">
              {detailJob.pickup_latitude && detailJob.pickup_longitude ? (
                <MapContainer
                  center={[detailJob.pickup_latitude, detailJob.pickup_longitude]}
                  zoom={13}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; OpenStreetMap'
                  />

                  {/* Alış Marker */}
                  <Marker
                    position={[detailJob.pickup_latitude, detailJob.pickup_longitude]}
                    icon={pickupIcon}
                  >
                    <Popup>
                      <div className="text-center">
                        <p className="font-bold text-yellow-700">📍 Alış Noktası</p>
                        <p className="text-sm font-bold">{detailJob.pickup_district}</p>
                        <p className="text-xs text-gray-500">{detailJob.pickup_address}</p>
                      </div>
                    </Popup>
                  </Marker>

                  {/* Teslim Marker */}
                  {detailJob.delivery_latitude && detailJob.delivery_longitude && (
                    <>
                      <Marker
                        position={[detailJob.delivery_latitude, detailJob.delivery_longitude]}
                        icon={deliveryIcon}
                      >
                        <Popup>
                          <div className="text-center">
                            <p className="font-bold text-gray-700">📦 Teslim Noktası</p>
                            <p className="text-sm font-bold">{detailJob.delivery_district}</p>
                            <p className="text-xs text-gray-500">{detailJob.delivery_address}</p>
                          </div>
                        </Popup>
                      </Marker>

                      {/* Rota Çizgisi */}
                      <Polyline
                        positions={[
                          [detailJob.pickup_latitude, detailJob.pickup_longitude],
                          [detailJob.delivery_latitude, detailJob.delivery_longitude],
                        ]}
                        color="#1f2937"
                        weight={4}
                        dashArray="10, 10"
                        opacity={0.8}
                      />
                    </>
                  )}

                  {/* Kullanıcı konumu */}
                  {userLocation && (
                    <Marker position={userLocation} icon={L.divIcon({
                      className: 'user-location-marker',
                      html: '<div style="width: 20px; height: 20px; background: #3b82f6; border: 3px solid white; border-radius: 50%; box-shadow: 0 2px 8px rgba(59,130,246,0.5);"></div>',
                      iconSize: [20, 20],
                      iconAnchor: [10, 10],
                    })}>
                      <Popup>📍 Sen Buradasın</Popup>
                    </Marker>
                  )}
                </MapContainer>
              ) : (
                <div className="h-full flex items-center justify-center bg-gray-50">
                  <p className="text-gray-500 font-medium">Konum bilgisi mevcut değil</p>
                </div>
              )}
            </div>

            {/* Alt Bilgi */}
           <div className="p-6 bg-gray-50">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
    <div className="bg-white p-4 rounded-2xl border border-gray-100">
      <span className="text-xs font-bold text-yellow-600 uppercase tracking-wider block mb-2">📍 Alış Noktası</span>
      <p className="text-sm font-bold text-gray-900">{detailJob.pickup_district}</p>
      <p className="text-xs text-gray-500 mt-1">{detailJob.pickup_address}</p>
      <div className="flex items-center gap-2 mt-3 text-xs text-gray-600">
        <BiNavigation />
        <span>{detailJob.pickup_contact_name}</span>
      </div>
    </div>

    <div className="bg-white p-4 rounded-2xl border border-gray-100">
      <span className="text-xs font-bold text-gray-600 uppercase tracking-wider block mb-2">📦 Teslim Noktası</span>
      <p className="text-sm font-bold text-gray-900">{detailJob.delivery_district}</p>
      <p className="text-xs text-gray-500 mt-1">{detailJob.delivery_address}</p>
      <div className="flex items-center gap-2 mt-3 text-xs text-gray-600">
        <BiNavigation />
        <span>{detailJob.delivery_contact_name}</span>
      </div>
    </div>
  </div>

  {/* ⭐ Uyarı mesajı - Aktif iş varsa */}
  {hasActiveJob && (
    <div className="w-full py-3 bg-amber-50 text-amber-700 text-sm font-bold rounded-xl text-center border border-amber-200 mb-4">
      ⚠️ Zaten aktif bir işiniz var. Önce mevcut işi tamamlayın.
    </div>
  )}

  {/* Kabul Et Butonu */}
  <button
    onClick={() => {
      setShowDetailModal(false);
      onAcceptJob(detailJob.id);
    }}
    disabled={hasActiveJob}
    className={`w-full py-4 font-bold rounded-2xl transition flex items-center justify-center gap-2 shadow-lg ${
      hasActiveJob
        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
        : 'bg-gray-900 hover:bg-black text-white'
    }`}
  >
    <span>{hasActiveJob ? 'İş Alınamaz' : 'İşi Kabul Et'}</span>
    <BiCheckCircle size={20} />
  </button>
</div>
          </div>
        </div>
      )}
    </div>
  );
};