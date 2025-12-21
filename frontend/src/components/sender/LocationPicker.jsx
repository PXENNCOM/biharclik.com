import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { BiX, BiMap, BiCheckCircle } from 'react-icons/bi';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker ikonu
const selectedLocationIcon = L.divIcon({
  className: 'custom-marker',
  html: `<div style="background-color: #10b981; width: 30px; height: 30px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 3px solid white; box-shadow: 0 2px 8px rgba(16,185,129,0.4);"></div>`,
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});

const LocationMarker = ({ position, setPosition }) => {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });

  return position ? <Marker position={position} icon={selectedLocationIcon} /> : null;
};

const RecenterMap = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, 13);
    }
  }, [center, map]);
  return null;
};

export const LocationPicker = ({ value, onChange, label }) => {
  const [position, setPosition] = useState(value || null);
  const [showMap, setShowMap] = useState(false);
  const defaultCenter = [41.0082, 28.9784]; 

  useEffect(() => {
    if (position && onChange) {
      onChange(position);
    }
  }, [position, onChange]);

  
  return (
    <div className="space-y-3">
      {label && (
        <label className="text-sm font-bold text-gray-700">
          {label}
        </label>
      )}
      
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setShowMap(!showMap)}
          className="flex-1 py-2.5 px-4 bg-gray-900 hover:bg-black text-white font-bold rounded-xl transition-all text-sm flex items-center justify-center gap-2"
        >
          {showMap ? (
            <>
              <BiX size={18} />
              <span>Kapat</span>
            </>
          ) : (
            <>
              <BiMap size={18} />
              <span>Haritadan Seç</span>
            </>
          )}
        </button>

      </div>

      {/* Harita */}
      {showMap && (
        <div className="rounded-3xl overflow-hidden border-2 border-gray-200 h-[450px] relative shadow-lg">
          <MapContainer
            center={position || defaultCenter}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
              attribution='&copy; OpenStreetMap &copy; CARTO'
            />
            <RecenterMap center={position || defaultCenter} />
            <LocationMarker position={position} setPosition={setPosition} />
          </MapContainer>
          
          {/* Harita üstünde bilgi */}
          <div className="absolute top-4 left-4 z-[1000] bg-white/95 backdrop-blur-sm px-4 py-2.5 rounded-xl shadow-lg">
            <p className="text-xs font-bold text-gray-700">
              💡 Haritaya tıklayarak konum seçin
            </p>
          </div>

          {/* Seçilen konum göstergesi */}
          {position && (
            <div className="absolute top-4 right-4 z-[1000] bg-green-500 px-3 py-2 rounded-xl shadow-lg">
              <div className="flex items-center gap-1.5 text-white">
                <BiCheckCircle size={16} />
                <span className="text-xs font-bold">Seçildi</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Seçilen Konum Bilgisi */}
      {position && (
        <div className="bg-green-50 border border-green-200 p-3 rounded-xl">
          <div className="flex items-center gap-2">
            <BiCheckCircle size={20} className="text-green-600" />
            <div>
              <p className="text-sm font-bold text-green-900">
                Konum Seçildi
              </p>
              <p className="text-xs text-green-700 font-mono mt-0.5">
                {position.lat.toFixed(6)}, {position.lng.toFixed(6)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};