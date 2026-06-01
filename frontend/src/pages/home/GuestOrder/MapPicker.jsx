import { useState, useEffect, useRef } from 'react';
import { BiCurrentLocation, BiX } from 'react-icons/bi';

export const MapPicker = ({ onSelect, onClose, title, initialLat, initialLng }) => {
  const mapRef = useRef(null);
  const mapInst = useRef(null);
  const markerRef = useRef(null);
  const [coords, setCoords] = useState(
    initialLat && initialLng ? { lat: initialLat, lng: initialLng } : null
  );

  useEffect(() => {
    const loadLeaflet = () => new Promise((resolve) => {
      if (window.L) { resolve(); return; }
      if (!document.getElementById('leaflet-css')) {
        const link = document.createElement('link');
        link.id = 'leaflet-css';
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = resolve;
      document.head.appendChild(script);
    });

    loadLeaflet().then(() => {
      if (!mapRef.current || mapInst.current) return;
      const L = window.L;
      const lat = initialLat || 41.015;
      const lng = initialLng || 28.979;
      const map = L.map(mapRef.current, { center: [lat, lng], zoom: 13 });
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19, subdomains: 'abcd'
      }).addTo(map);

      const pinIcon = L.divIcon({
        className: '',
        html: `<div style="width:32px;height:32px;border-radius:50% 50% 50% 0;background:#FBCF2D;border:3px solid #111827;transform:rotate(-45deg);box-shadow:0 4px 12px rgba(0,0,0,0.25);"></div>`,
        iconSize: [32, 32], iconAnchor: [16, 32],
      });

      const addMarker = (lt, ln) => {
        if (markerRef.current) {
          markerRef.current.setLatLng([lt, ln]);
        } else {
          markerRef.current = L.marker([lt, ln], { icon: pinIcon, draggable: true }).addTo(map);
          markerRef.current.on('dragend', (e) => {
            const p = e.target.getLatLng();
            setCoords({ lat: p.lat, lng: p.lng });
          });
        }
      };

      if (initialLat && initialLng) addMarker(initialLat, initialLng);
      map.on('click', (e) => {
        const { lat: lt, lng: ln } = e.latlng;
        setCoords({ lat: lt, lng: ln });
        addMarker(lt, ln);
      });
      mapInst.current = map;
    });

    return () => {
      if (mapInst.current) { mapInst.current.remove(); mapInst.current = null; markerRef.current = null; }
    };
  }, []);

  const handleMyLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      const lt = pos.coords.latitude;
      const ln = pos.coords.longitude;
      setCoords({ lat: lt, lng: ln });
      if (mapInst.current) {
        mapInst.current.flyTo([lt, ln], 15);
        const L = window.L;
        const pinIcon = L.divIcon({
          className: '',
          html: `<div style="width:32px;height:32px;border-radius:50% 50% 50% 0;background:#FBCF2D;border:3px solid #111827;transform:rotate(-45deg);box-shadow:0 4px 12px rgba(0,0,0,0.25);"></div>`,
          iconSize: [32, 32], iconAnchor: [16, 32],
        });
        if (markerRef.current) {
          markerRef.current.setLatLng([lt, ln]);
        } else {
          markerRef.current = L.marker([lt, ln], { icon: pinIcon, draggable: true }).addTo(mapInst.current);
          markerRef.current.on('dragend', (e) => {
            const p = e.target.getLatLng();
            setCoords({ lat: p.lat, lng: p.lng });
          });
        }
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-[2rem] overflow-hidden w-full max-w-2xl shadow-2xl flex flex-col" style={{ maxHeight: '90vh' }}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-[#FBCF2D]">Konum Seç</p>
            <h3 className="text-sm font-black text-gray-900">{title}</h3>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-all">
            <BiX size={18} />
          </button>
        </div>
        <div className="relative flex-1" style={{ minHeight: 380 }}>
          <div ref={mapRef} style={{ width: '100%', height: '100%', minHeight: 380 }} />
          <button onClick={handleMyLocation} className="absolute top-3 right-3 z-[1000] flex items-center gap-2 bg-white px-3 py-2 rounded-xl shadow-lg border border-gray-100 text-[11px] font-black text-gray-700 hover:bg-gray-50 transition-all">
            <BiCurrentLocation size={16} className="text-[#FBCF2D]" /> Konumumu Bul
          </button>
          {!coords && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-[1000] bg-gray-900/80 text-white text-[11px] font-bold px-4 py-2 rounded-full backdrop-blur-sm whitespace-nowrap">
              Haritaya tıklayarak konum seçin
            </div>
          )}
        </div>
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between gap-4">
          <div>
            {coords
              ? <p className="text-[11px] font-bold text-gray-500">📍 {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}</p>
              : <p className="text-[11px] font-medium text-gray-400">Henüz konum seçilmedi</p>
            }
          </div>
          <div className="flex gap-2">
            <button onClick={onClose} className="h-10 px-5 rounded-full border border-gray-200 text-[11px] font-black text-gray-500 hover:bg-gray-50 transition-all">İptal</button>
            <button onClick={() => coords && onSelect(coords)} disabled={!coords} className="h-10 px-6 rounded-full bg-[#FBCF2D] text-gray-900 text-[11px] font-black hover:bg-yellow-300 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
              Konumu Onayla
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};