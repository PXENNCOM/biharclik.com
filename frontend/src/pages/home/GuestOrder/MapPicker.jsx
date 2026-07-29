import { useState, useEffect, useRef } from 'react';
import { BiCurrentLocation, BiX, BiCheck, BiLoaderAlt } from 'react-icons/bi';

const ISTANBUL_BOUNDS = [[40.80, 27.95], [41.40, 29.60]];
const inIstanbul = (lat, lng) =>
  lat >= ISTANBUL_BOUNDS[0][0] && lat <= ISTANBUL_BOUNDS[1][0] &&
  lng >= ISTANBUL_BOUNDS[0][1] && lng <= ISTANBUL_BOUNDS[1][1];

// Koordinattan adres metni çek (OpenStreetMap Nominatim, ücretsiz, key gerekmez)
const reverseGeocode = async (lat, lng) => {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1&accept-language=tr`
    );
    if (!res.ok) return null;
    const json = await res.json();
    if (!json || !json.address) return null;

    const a = json.address;
    // Sokak/mahalle/bina no gibi kısımları birleştirip anlamlı bir adres metni oluştur
    const parts = [
      [a.road, a.house_number].filter(Boolean).join(' '),
      a.neighbourhood || a.suburb || a.quarter,
      a.city_district || a.town || a.city,
    ].filter(Boolean);

    return parts.length ? parts.join(', ') : json.display_name || null;
  } catch {
    return null;
  }
};

export const MapPicker = ({ onSelect, onClose, initialLat, initialLng }) => {
  const mapRef = useRef(null);
  const mapInst = useRef(null);
  const markerRef = useRef(null);
  const [hasCoords, setHasCoords] = useState(!!(initialLat && initialLng));
  const coordsRef = useRef(
    initialLat && initialLng ? { lat: initialLat, lng: initialLng } : null
  );
  const [outOfBoundsMsg, setOutOfBoundsMsg] = useState(false);
  const [confirming, setConfirming] = useState(false);

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
      const map = L.map(mapRef.current, {
        center: [lat, lng],
        zoom: 12,
        maxBounds: ISTANBUL_BOUNDS,
        maxBoundsViscosity: 1.0,
        minZoom: 10,
        zoomControl: false,
      });
      L.control.zoom({ position: 'bottomright' }).addTo(map);
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19, subdomains: 'abcd'
      }).addTo(map);

      const pinIcon = L.divIcon({
        className: '',
        html: `<div style="width:36px;height:36px;border-radius:50% 50% 50% 0;background:#FBCF2D;border:3px solid #111827;transform:rotate(-45deg);box-shadow:0 4px 12px rgba(0,0,0,0.3);"></div>`,
        iconSize: [36, 36], iconAnchor: [18, 36],
      });

      const addMarker = (lt, ln) => {
        if (markerRef.current) {
          markerRef.current.setLatLng([lt, ln]);
        } else {
          markerRef.current = L.marker([lt, ln], { icon: pinIcon, draggable: true }).addTo(map);
          markerRef.current.on('dragend', (e) => {
            const p = e.target.getLatLng();
            if (!inIstanbul(p.lat, p.lng)) {
              const clampedLat = Math.min(Math.max(p.lat, ISTANBUL_BOUNDS[0][0]), ISTANBUL_BOUNDS[1][0]);
              const clampedLng = Math.min(Math.max(p.lng, ISTANBUL_BOUNDS[0][1]), ISTANBUL_BOUNDS[1][1]);
              markerRef.current.setLatLng([clampedLat, clampedLng]);
              coordsRef.current = { lat: clampedLat, lng: clampedLng };
              setHasCoords(true);
              setOutOfBoundsMsg(true);
              setTimeout(() => setOutOfBoundsMsg(false), 2000);
            } else {
              coordsRef.current = { lat: p.lat, lng: p.lng };
              setHasCoords(true);
            }
          });
        }
      };

      if (initialLat && initialLng) addMarker(initialLat, initialLng);
      map.on('click', (e) => {
        const { lat: lt, lng: ln } = e.latlng;
        if (!inIstanbul(lt, ln)) {
          setOutOfBoundsMsg(true);
          setTimeout(() => setOutOfBoundsMsg(false), 2000);
          return;
        }
        coordsRef.current = { lat: lt, lng: ln };
        setHasCoords(true);
        addMarker(lt, ln);
      });
      mapInst.current = map;

      setTimeout(() => map.invalidateSize(), 100);
    });

    return () => {
      if (mapInst.current) { mapInst.current.remove(); mapInst.current = null; markerRef.current = null; }
    };
  }, []);

  const handleMyLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      let lt = pos.coords.latitude;
      let ln = pos.coords.longitude;
      if (!inIstanbul(lt, ln)) {
        setOutOfBoundsMsg(true);
        setTimeout(() => setOutOfBoundsMsg(false), 2500);
        if (mapInst.current) mapInst.current.flyTo([41.015, 28.979], 11);
        return;
      }
      coordsRef.current = { lat: lt, lng: ln };
      setHasCoords(true);
      if (mapInst.current) {
        mapInst.current.flyTo([lt, ln], 15);
        const L = window.L;
        const pinIcon = L.divIcon({
          className: '',
          html: `<div style="width:36px;height:36px;border-radius:50% 50% 50% 0;background:#FBCF2D;border:3px solid #111827;transform:rotate(-45deg);box-shadow:0 4px 12px rgba(0,0,0,0.3);"></div>`,
          iconSize: [36, 36], iconAnchor: [18, 36],
        });
        if (markerRef.current) {
          markerRef.current.setLatLng([lt, ln]);
        } else {
          markerRef.current = L.marker([lt, ln], { icon: pinIcon, draggable: true }).addTo(mapInst.current);
        }
      }
    });
  };

  const handleConfirm = async () => {
    if (!coordsRef.current || confirming) return;
    setConfirming(true);
    const address = await reverseGeocode(coordsRef.current.lat, coordsRef.current.lng);
    setConfirming(false);
    onSelect({ ...coordsRef.current, address }); // address bulunamazsa null gelir, index.jsx bunu handle ediyor
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-white">
      <div ref={mapRef} style={{ width: '100%', height: '100%' }} />

      <button
        onClick={onClose}
        className="absolute top-4 left-4 z-[1000] w-11 h-11 rounded-full bg-white shadow-lg border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-all"
      >
        <BiX size={22} className="text-gray-700" />
      </button>

      <button
        onClick={handleMyLocation}
        className="absolute top-4 right-4 z-[1000] flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl shadow-lg border border-gray-100 text-[12px] font-black text-gray-700 hover:bg-gray-50 transition-all"
      >
        <BiCurrentLocation size={17} className="text-[#FBCF2D]" /> Konumumu Bul
      </button>

      {!hasCoords && !outOfBoundsMsg && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-[1000] bg-gray-900/85 text-white text-[12px] font-bold px-5 py-2.5 rounded-full backdrop-blur-sm whitespace-nowrap">
          Haritaya dokunarak konum seçin
        </div>
      )}
      {outOfBoundsMsg && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-[1000] bg-red-500/90 text-white text-[12px] font-bold px-5 py-2.5 rounded-full backdrop-blur-sm whitespace-nowrap">
          Sadece İstanbul sınırları içinden konum seçebilirsiniz
        </div>
      )}

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[1000] flex gap-3">
        <button
          onClick={onClose}
          className="h-12 px-6 rounded-full bg-white shadow-lg border border-gray-200 text-[13px] font-black text-gray-600 hover:bg-gray-50 transition-all"
        >
          İptal
        </button>
        <button
          onClick={handleConfirm}
          disabled={!hasCoords || confirming}
          className="h-12 px-7 rounded-full bg-[#FBCF2D] shadow-lg text-gray-900 text-[13px] font-black hover:bg-yellow-300 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2 min-w-[160px] justify-center"
        >
          {confirming ? (
            <><BiLoaderAlt size={17} className="animate-spin" /> Adres Bulunuyor...</>
          ) : (
            <><BiCheck size={17} /> Konumu Onayla</>
          )}
        </button>
      </div>
    </div>
  );
};