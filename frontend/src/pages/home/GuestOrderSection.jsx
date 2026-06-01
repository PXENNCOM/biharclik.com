import { useState, useEffect, useRef } from 'react';
import {
  BiPackage, BiMapPin, BiUser, BiPhone,
  BiChevronRight, BiChevronLeft, BiCheck,
  BiSolidTruck, BiCurrentLocation,
  BiMap, BiX, BiEnvelope, BiCreditCard
} from 'react-icons/bi';

import { Zap, ShieldCheck, Headset } from 'lucide-react';

import axios from 'axios';

// ── Sabitler ────────────────────────────────────────────────
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const ISTANBUL_DISTRICTS = [
  'Adalar', 'Arnavutköy', 'Ataşehir', 'Avcılar', 'Bağcılar', 'Bahçelievler',
  'Bakırköy', 'Başakşehir', 'Bayrampaşa', 'Beşiktaş', 'Beykoz', 'Beylikdüzü',
  'Beyoğlu', 'Büyükçekmece', 'Çatalca', 'Çekmeköy', 'Esenler', 'Esenyurt',
  'Eyüpsultan', 'Fatih', 'Gaziosmanpaşa', 'Güngören', 'Kadıköy', 'Kağıthane',
  'Kartal', 'Küçükçekmece', 'Maltepe', 'Pendik', 'Sancaktepe', 'Sarıyer',
  'Silivri', 'Sultanbeyli', 'Sultangazi', 'Şile', 'Şişli', 'Tuzla', 'Ümraniye',
  'Üsküdar', 'Zeytinburnu',
];

const PACKAGE_SIZES = [
  { value: 'small', label: 'Küçük', desc: 'Zarf, kitap, küçük kutu', icon: '📦' },
  { value: 'medium', label: 'Orta', desc: 'Ayakkabı kutusu büyüklüğü', icon: '🗃️' },
  { value: 'large', label: 'Büyük', desc: 'Sırt çantasına sığan max', icon: '🧳' },
];

const STEPS = ['Bilgileriniz', 'Alış Noktası', 'Teslimat Noktası', 'Paket & Harçlık', 'Ödeme'];
const MIN_AMOUNT = 350;

// ── Yardımcı ────────────────────────────────────────────────
const formatPhone = (v) => v.replace(/\D/g, '').slice(0, 11);
const isValidPhone = (p) => /^(05)[0-9]{9}$/.test(p);
const isValidEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

// ── Harita Modal ─────────────────────────────────────────────
const MapPicker = ({ onSelect, onClose, title, initialLat, initialLng }) => {
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
      L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
        { maxZoom: 19, subdomains: 'abcd' }
      ).addTo(map);

      const pinIcon = L.divIcon({
        className: '',
        html: `<div style="width:32px;height:32px;border-radius:50% 50% 50% 0;background:#FBCF2D;border:3px solid #111827;transform:rotate(-45deg);box-shadow:0 4px 12px rgba(0,0,0,0.25);"></div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
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
          <button
            onClick={handleMyLocation}
            className="absolute top-3 right-3 z-[1000] flex items-center gap-2 bg-white px-3 py-2 rounded-xl shadow-lg border border-gray-100 text-[11px] font-black text-gray-700 hover:bg-gray-50 transition-all"
          >
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
            <button onClick={onClose} className="h-10 px-5 rounded-full border border-gray-200 text-[11px] font-black text-gray-500 hover:bg-gray-50 transition-all">
              İptal
            </button>
            <button
              onClick={() => coords && onSelect(coords)}
              disabled={!coords}
              className="h-10 px-6 rounded-full bg-[#FBCF2D] text-gray-900 text-[11px] font-black hover:bg-yellow-300 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Konumu Onayla
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── UI Bileşenleri ───────────────────────────────────────────
const StepIndicator = ({ current }) => (
  <div className="flex items-center justify-center gap-2 mb-10">
    {STEPS.map((label, i) => (
      <div key={i} className="flex items-center gap-2">
        <div className="flex flex-col items-center gap-1.5">
          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black transition-all duration-300 ${
            i < current ? 'bg-gray-900 text-[#FBCF2D]' : i === current ? 'bg-[#FBCF2D] text-gray-900' : 'bg-gray-100 text-gray-400'
          }`}>
            {i < current ? <BiCheck size={14} /> : i + 1}
          </div>
          <span className={`text-[9px] font-black uppercase tracking-wider hidden sm:block ${i === current ? 'text-gray-900' : 'text-gray-300'}`}>{label}</span>
        </div>
        {i < STEPS.length - 1 && (
          <div className={`w-6 sm:w-10 h-px mb-4 transition-all duration-300 ${i < current ? 'bg-gray-900' : 'bg-gray-100'}`} />
        )}
      </div>
    ))}
  </div>
);

const Field = ({ label, error, children, hint }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">{label}</label>
    {children}
    {hint && !error && <p className="text-[10px] text-gray-400 font-medium">{hint}</p>}
    {error && <p className="text-[10px] text-red-500 font-bold">{error}</p>}
  </div>
);

const Input = ({ icon: Icon, error, ...props }) => (
  <div className={`flex items-center gap-3 h-12 px-4 rounded-2xl border bg-white transition-all ${
    error ? 'border-red-300 bg-red-50/30' : 'border-gray-100 focus-within:border-[#FBCF2D] focus-within:shadow-[0_0_0_3px_rgba(251,207,45,0.12)]'
  }`}>
    {Icon && <Icon size={16} className={error ? 'text-red-400' : 'text-gray-300'} />}
    <input className="flex-1 text-sm font-semibold text-gray-900 bg-transparent outline-none placeholder:text-gray-300" {...props} />
  </div>
);

const Select = ({ icon: Icon, error, children, ...props }) => (
  <div className={`flex items-center gap-3 h-12 px-4 rounded-2xl border bg-white transition-all ${
    error ? 'border-red-300 bg-red-50/30' : 'border-gray-100 focus-within:border-[#FBCF2D] focus-within:shadow-[0_0_0_3px_rgba(251,207,45,0.12)]'
  }`}>
    {Icon && <Icon size={16} className={error ? 'text-red-400' : 'text-gray-300'} />}
    <select className="flex-1 text-sm font-semibold text-gray-900 bg-transparent outline-none appearance-none cursor-pointer" {...props}>
      {children}
    </select>
    <BiChevronRight size={14} className="text-gray-300 rotate-90 shrink-0" />
  </div>
);

const Textarea = ({ error, ...props }) => (
  <textarea
    rows={3}
    className={`w-full px-4 py-3 rounded-2xl border text-sm font-semibold text-gray-900 bg-white outline-none resize-none transition-all placeholder:text-gray-300 ${
      error ? 'border-red-300 bg-red-50/30' : 'border-gray-100 focus:border-[#FBCF2D] focus:shadow-[0_0_0_3px_rgba(251,207,45,0.12)]'
    }`}
    {...props}
  />
);

const LocationBadge = ({ lat, lng, onClear }) => (
  <div className="flex items-center justify-between px-4 py-2.5 bg-green-50 border border-green-200 rounded-2xl">
    <div className="flex items-center gap-2">
      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
      <p className="text-[11px] font-bold text-green-700">Konum seçildi — {lat.toFixed(4)}, {lng.toFixed(4)}</p>
    </div>
    <button onClick={onClear} className="text-green-500 hover:text-green-700"><BiX size={16} /></button>
  </div>
);

// ── Adım Formları ────────────────────────────────────────────

const Step0 = ({ data, onChange, errors }) => (
  <div className="flex flex-col gap-5">
    <div className="p-4 bg-[#FBCF2D]/10 rounded-2xl border border-[#FBCF2D]/20">
      <p className="text-[11px] font-bold text-gray-700 leading-relaxed">
        <span className="text-[#FBCF2D] mr-1">★</span>
        Bilgilerinizi girin, ardından kart ile güvenli ödeme yapın. Siparişiniz hemen işleme alınır.dddddd
      </p>
    </div>
    <Field label="Ad Soyad" error={errors.guest_name}>
      <Input
        icon={BiUser}
        placeholder="Adınız ve soyadınız"
        value={data.guest_name}
        onChange={e => onChange('guest_name', e.target.value)}
        error={errors.guest_name}
      />
    </Field>
    <Field label="E-posta" error={errors.guest_email}>
      <Input
        icon={BiEnvelope}
        placeholder="ornek@email.com"
        type="email"
        value={data.guest_email}
        onChange={e => onChange('guest_email', e.target.value)}
        error={errors.guest_email}
      />
    </Field>
  </div>
);

const Step1 = ({ data, onChange, errors, onOpenMap }) => (
  <div className="flex flex-col gap-5">
    <Field label="Alış Adresi" error={errors.pickup_address}>
      <Textarea
        placeholder="Tam adres (mahalle, sokak, bina no, kat, daire...)"
        value={data.pickup_address}
        onChange={e => onChange('pickup_address', e.target.value)}
        error={errors.pickup_address}
      />
    </Field>
    <Field label="Alış İlçesi" error={errors.pickup_district}>
      <Select icon={BiMapPin} value={data.pickup_district} onChange={e => onChange('pickup_district', e.target.value)} error={errors.pickup_district}>
        <option value="">İlçe seçiniz</option>
        {ISTANBUL_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
      </Select>
    </Field>
    <Field label="Harita Konumu (İsteğe Bağlı)">
      {data.pickup_latitude && data.pickup_longitude ? (
        <LocationBadge lat={data.pickup_latitude} lng={data.pickup_longitude} onClear={() => { onChange('pickup_latitude', null); onChange('pickup_longitude', null); }} />
      ) : (
        <button type="button" onClick={() => onOpenMap('pickup')}
          className="flex items-center gap-3 h-12 px-4 rounded-2xl border border-dashed border-gray-200 bg-gray-50 text-gray-400 text-[11px] font-black uppercase tracking-wider hover:border-[#FBCF2D] hover:text-gray-700 transition-all w-full">
          <BiMap size={16} /> Haritadan Konum İşaretle
        </button>
      )}
    </Field>
    <Field label="Yetkili Adı" error={errors.pickup_contact_name}>
      <Input
        icon={BiUser}
        placeholder="Paketi teslim edecek kişi"
        value={data.pickup_contact_name}
        onChange={e => onChange('pickup_contact_name', e.target.value)}
        error={errors.pickup_contact_name}
      />
    </Field>
    <Field label="İletişim Telefonu" error={errors.pickup_contact_phone} hint="Bu numara ile sizi arayacağız (05xxxxxxxxx)">
      <Input
        icon={BiPhone}
        placeholder="05xxxxxxxxx"
        value={data.pickup_contact_phone}
        onChange={e => {
          const val = formatPhone(e.target.value);
          onChange('pickup_contact_phone', val);
          onChange('guest_phone', val);
        }}
        error={errors.pickup_contact_phone}
        type="tel"
        maxLength={11}
      />
    </Field>
    <Field label="Alış Notu (İsteğe Bağlı)">
      <Textarea placeholder="Kapıcıya bırakın, zili çalın vs." value={data.pickup_notes} onChange={e => onChange('pickup_notes', e.target.value)} rows={2} />
    </Field>
  </div>
);

const Step2 = ({ data, onChange, errors, onOpenMap }) => {
  const [samePhone, setSamePhone] = useState(
    data.delivery_contact_phone !== '' && data.delivery_contact_phone === data.pickup_contact_phone
  );

  const handleSamePhone = (checked) => {
    setSamePhone(checked);
    onChange('delivery_contact_phone', checked ? data.pickup_contact_phone : '');
  };

  return (
    <div className="flex flex-col gap-5">
      <Field label="Teslimat Adresi" error={errors.delivery_address}>
        <Textarea
          placeholder="Tam adres (mahalle, sokak, bina no, kat, daire...)"
          value={data.delivery_address}
          onChange={e => onChange('delivery_address', e.target.value)}
          error={errors.delivery_address}
        />
      </Field>
      <Field label="Teslimat İlçesi" error={errors.delivery_district}>
        <Select icon={BiMapPin} value={data.delivery_district} onChange={e => onChange('delivery_district', e.target.value)} error={errors.delivery_district}>
          <option value="">İlçe seçiniz</option>
          {ISTANBUL_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
        </Select>
      </Field>
      <Field label="Harita Konumu (İsteğe Bağlı)">
        {data.delivery_latitude && data.delivery_longitude ? (
          <LocationBadge lat={data.delivery_latitude} lng={data.delivery_longitude} onClear={() => { onChange('delivery_latitude', null); onChange('delivery_longitude', null); }} />
        ) : (
          <button type="button" onClick={() => onOpenMap('delivery')}
            className="flex items-center gap-3 h-12 px-4 rounded-2xl border border-dashed border-gray-200 bg-gray-50 text-gray-400 text-[11px] font-black uppercase tracking-wider hover:border-[#FBCF2D] hover:text-gray-700 transition-all w-full">
            <BiMap size={16} /> Haritadan Konum İşaretle
          </button>
        )}
      </Field>
      <Field label="Alıcı Adı" error={errors.delivery_contact_name}>
        <Input
          icon={BiUser}
          placeholder="Teslim edilecek kişi"
          value={data.delivery_contact_name}
          onChange={e => onChange('delivery_contact_name', e.target.value)}
          error={errors.delivery_contact_name}
        />
      </Field>
      <div className="flex flex-col gap-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Alıcı Telefonu</label>
        <button
          type="button"
          onClick={() => handleSamePhone(!samePhone)}
          className={`flex items-center gap-3 h-10 px-4 rounded-2xl border text-[11px] font-bold transition-all w-full text-left ${
            samePhone ? 'border-[#FBCF2D] bg-[#FBCF2D]/8 text-gray-700' : 'border-gray-100 bg-gray-50 text-gray-400 hover:border-gray-200'
          }`}
        >
          <div className={`w-4 h-4 rounded flex items-center justify-center border-2 shrink-0 transition-all ${samePhone ? 'bg-[#FBCF2D] border-[#FBCF2D]' : 'border-gray-300'}`}>
            {samePhone && <BiCheck size={11} className="text-gray-900" />}
          </div>
          Gönderici telefonu ile aranabilir {data.pickup_contact_phone ? `(${data.pickup_contact_phone})` : ''}
        </button>
        {!samePhone && (
          <Input
            icon={BiPhone}
            placeholder="05xxxxxxxxx"
            value={data.delivery_contact_phone}
            onChange={e => onChange('delivery_contact_phone', formatPhone(e.target.value))}
            error={errors.delivery_contact_phone}
            type="tel"
            maxLength={11}
          />
        )}
        {errors.delivery_contact_phone && <p className="text-[10px] text-red-500 font-bold">{errors.delivery_contact_phone}</p>}
      </div>
      <Field label="Teslimat Notu (İsteğe Bağlı)">
        <Textarea placeholder="Zili çalmayın, komşuya bırakın vs." value={data.delivery_notes} onChange={e => onChange('delivery_notes', e.target.value)} rows={2} />
      </Field>
    </div>
  );
};

const Step3 = ({ data, onChange, errors }) => (
  <div className="flex flex-col gap-6">
    <Field label="Paket Boyutu">
      <div className="grid grid-cols-3 gap-3">
        {PACKAGE_SIZES.map(size => (
          <button key={size.value} type="button" onClick={() => onChange('package_size', size.value)}
            className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all text-center ${
              data.package_size === size.value ? 'border-[#FBCF2D] bg-[#FBCF2D]/8 shadow-[0_0_0_3px_rgba(251,207,45,0.12)]' : 'border-gray-100 bg-white hover:border-gray-200'
            }`}>
            <span className="text-2xl">{size.icon}</span>
            <span className="text-[11px] font-black text-gray-900">{size.label}</span>
            <span className="text-[9px] font-medium text-gray-400 leading-tight">{size.desc}</span>
          </button>
        ))}
      </div>
    </Field>
    <Field label="Paket İçeriği" error={errors.package_description}>
      <Textarea placeholder="Ne gönderiyorsunuz? (Belge, kitap, ayakkabı kutusu...)" value={data.package_description} onChange={e => onChange('package_description', e.target.value)} error={errors.package_description} />
    </Field>
    <Field label="Harçlık Tutarı (₺)" error={errors.payment_amount} hint={`Minimum ${MIN_AMOUNT}₺ — kurye için adil bir tutar belirleyin`}>
      <div className={`flex items-center gap-3 h-14 px-4 rounded-2xl border bg-white transition-all ${
        errors.payment_amount ? 'border-red-300 bg-red-50/30' : 'border-gray-100 focus-within:border-[#FBCF2D] focus-within:shadow-[0_0_0_3px_rgba(251,207,45,0.12)]'
      }`}>
        <span className="text-lg font-black text-[#FBCF2D]">₺</span>
        <input type="number" min={MIN_AMOUNT} step={10} placeholder={`${MIN_AMOUNT}`} value={data.payment_amount} onChange={e => onChange('payment_amount', e.target.value)}
          className="flex-1 text-xl font-black text-gray-900 bg-transparent outline-none placeholder:text-gray-200" />
        <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">TL</span>
      </div>
      <div className="flex gap-2 mt-2">
        {[350, 400, 500, 600, 750].map(amt => (
          <button key={amt} type="button" onClick={() => onChange('payment_amount', amt)}
            className={`flex-1 h-8 rounded-xl text-[10px] font-black transition-all ${
              Number(data.payment_amount) === amt ? 'bg-gray-900 text-[#FBCF2D]' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
            }`}>
            {amt}₺
          </button>
        ))}
      </div>
    </Field>
    <Field label="Genel Not (İsteğe Bağlı)">
      <Textarea placeholder="Eklemek istediğiniz herhangi bir bilgi..." value={data.notes} onChange={e => onChange('notes', e.target.value)} rows={2} />
    </Field>
  </div>
);

// ── Step 4: İyzico Ödeme Formu ───────────────────────────────
const Step4Payment = ({ checkoutFormContent, orderNumber, amount }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!checkoutFormContent || !containerRef.current) return;

    // Önce div'i temizle
    containerRef.current.innerHTML = '';

    // iyzipay-checkout-form div'ini oluştur (iyzico bunu arıyor)
    const formDiv = document.createElement('div');
    formDiv.id = 'iyzipay-checkout-form';
    formDiv.className = 'responsive';
    containerRef.current.appendChild(formDiv);

    // Script'i çıkar ve çalıştır
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = checkoutFormContent;
    const script = tempDiv.querySelector('script');
    if (script) {
      const newScript = document.createElement('script');
      newScript.type = 'text/javascript';
      newScript.textContent = script.textContent;
      document.head.appendChild(newScript);
    }
  }, [checkoutFormContent]);

  return (
    <div className="flex flex-col gap-5">
      <div className="p-4 bg-gray-900 rounded-2xl flex items-center justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-[#FBCF2D]">Sipariş No</p>
          <p className="text-sm font-black text-white">{orderNumber}</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Ödenecek Tutar</p>
          <p className="text-xl font-black text-[#FBCF2D]">{amount}₺</p>
        </div>
      </div>

      <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex items-start gap-3">
        <BiCreditCard size={18} className="text-blue-500 shrink-0 mt-0.5" />
        <div>
          <p className="text-[11px] font-black text-blue-800 mb-1">Güvenli Ödeme</p>
          <p className="text-[10px] font-medium text-blue-600 leading-relaxed">
            Ödemeniz İyzico altyapısı ile SSL şifreli olarak işlenir. Kart bilgileriniz sistemimizde saklanmaz.
          </p>
        </div>
      </div>

      {/* İyzico formu buraya inject olacak */}
      <div ref={containerRef} className="min-h-[400px]" />
    </div>
  );
};

const SuccessScreen = ({ orderNumber, onReset }) => (
  <div className="flex flex-col items-center text-center py-8 gap-6">
    <div className="w-20 h-20 rounded-full bg-[#FBCF2D] flex items-center justify-center shadow-[0_8px_32px_rgba(251,207,45,0.35)]">
      <BiCheck size={40} className="text-gray-900" />
    </div>
    <div>
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#FBCF2D] mb-2">Ödeme Alındı</p>
      <h3 className="text-2xl font-black text-gray-900 tracking-tighter mb-1">{orderNumber}</h3>
      <p className="text-xs font-medium text-gray-400 leading-relaxed max-w-xs mx-auto mt-3">
        Ödemeniz alındı. Siparişiniz onaylandı ve kurye eşleşmesi başladı.
      </p>
    </div>
    <div className="w-full p-5 bg-gray-50 rounded-2xl border border-gray-100 text-left">
      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Sonraki Adımlar</p>
      {['Ödemeniz güvenle alındı', 'Güzergahına uyan kurye eşleşecek', 'Teslimat tamamlandığında bildirim alacaksınız'].map((s, i) => (
        <div key={i} className="flex items-start gap-3 mb-2 last:mb-0">
          <div className="w-5 h-5 rounded-full bg-[#FBCF2D] flex items-center justify-center shrink-0 mt-0.5">
            <span className="text-[9px] font-black text-gray-900">{i + 1}</span>
          </div>
          <p className="text-xs font-semibold text-gray-600">{s}</p>
        </div>
      ))}
    </div>
    <button onClick={onReset} className="text-[11px] font-black text-gray-400 uppercase tracking-widest hover:text-gray-900 transition-colors">
      Yeni Sipariş Ver
    </button>
  </div>
);

// ── Validasyon ───────────────────────────────────────────────
const validateStep = (step, data) => {
  const errs = {};
  if (step === 0) {
    if (!data.guest_name || data.guest_name.trim().length < 2) errs.guest_name = 'Ad soyad en az 2 karakter olmalıdır';
    if (!data.guest_email || !isValidEmail(data.guest_email)) errs.guest_email = 'Geçerli bir e-posta adresi giriniz';
  }
  if (step === 1) {
    if (!data.pickup_address || data.pickup_address.trim().length < 10) errs.pickup_address = 'Alış adresi en az 10 karakter olmalıdır';
    if (!data.pickup_district) errs.pickup_district = 'Alış ilçesi zorunludur';
    if (!data.pickup_contact_name || data.pickup_contact_name.trim().length < 2) errs.pickup_contact_name = 'Yetkili adı en az 2 karakter olmalıdır';
    if (!isValidPhone(data.pickup_contact_phone)) errs.pickup_contact_phone = 'Geçerli bir telefon giriniz (05xxxxxxxxx)';
  }
  if (step === 2) {
    if (!data.delivery_address || data.delivery_address.trim().length < 10) errs.delivery_address = 'Teslimat adresi en az 10 karakter olmalıdır';
    if (!data.delivery_district) errs.delivery_district = 'Teslimat ilçesi zorunludur';
    if (!data.delivery_contact_name || data.delivery_contact_name.trim().length < 2) errs.delivery_contact_name = 'Alıcı adı en az 2 karakter olmalıdır';
    if (!isValidPhone(data.delivery_contact_phone)) errs.delivery_contact_phone = 'Geçerli bir telefon giriniz (05xxxxxxxxx)';
  }
  if (step === 3) {
    if (!data.package_description || data.package_description.trim().length < 3) errs.package_description = 'Paket içeriğini belirtiniz';
    if (!data.payment_amount || Number(data.payment_amount) < MIN_AMOUNT) errs.payment_amount = `Harçlık en az ${MIN_AMOUNT}₺ olmalıdır`;
  }
  return errs;
};

// ── Ana Component ────────────────────────────────────────────
const INITIAL = {
  guest_name: '', guest_email: '', guest_phone: '',
  pickup_address: '', pickup_district: '',
  pickup_latitude: null, pickup_longitude: null,
  pickup_contact_name: '', pickup_contact_phone: '', pickup_notes: '',
  delivery_address: '', delivery_district: '',
  delivery_latitude: null, delivery_longitude: null,
  delivery_contact_name: '', delivery_contact_phone: '', delivery_notes: '',
  package_description: '', package_size: 'small', payment_amount: '', notes: '',
};

export const GuestOrderSection = () => {
  const [step, setStep] = useState(0);
  const [data, setData] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [success, setSuccess] = useState(null);
  const [mapTarget, setMapTarget] = useState(null);

  // Ödeme state'leri
  const [checkoutFormContent, setCheckoutFormContent] = useState(null);
  const [currentOrderNumber, setCurrentOrderNumber] = useState(null);

  const onChange = (key, val) => {
    setData(prev => ({ ...prev, [key]: val }));
    if (errors[key]) setErrors(prev => { const e = { ...prev }; delete e[key]; return e; });
  };

  const next = () => {
    const errs = validateStep(step, data);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setStep(s => s + 1);
  };

  const back = () => { setErrors({}); setStep(s => s - 1); };

  const handleMapSelect = (coords) => {
    if (mapTarget === 'pickup') {
      onChange('pickup_latitude', coords.lat);
      onChange('pickup_longitude', coords.lng);
    } else {
      onChange('delivery_latitude', coords.lat);
      onChange('delivery_longitude', coords.lng);
    }
    setMapTarget(null);
  };

  // Step 3 → 4 geçişi: delivery oluştur + payment initialize
  const submitAndPay = async () => {
    const errs = validateStep(3, data);
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    setApiError('');

    try {
      // 1. Guest delivery oluştur
      const deliveryRes = await axios.post(`${API_URL}/deliveries/guest`, {
        guest_name: data.guest_name,
        guest_phone: data.guest_phone || data.pickup_contact_phone,
        pickup_address: data.pickup_address,
        pickup_district: data.pickup_district,
        pickup_latitude: data.pickup_latitude,
        pickup_longitude: data.pickup_longitude,
        pickup_contact_name: data.pickup_contact_name,
        pickup_contact_phone: data.pickup_contact_phone,
        pickup_notes: data.pickup_notes || null,
        delivery_address: data.delivery_address,
        delivery_district: data.delivery_district,
        delivery_latitude: data.delivery_latitude,
        delivery_longitude: data.delivery_longitude,
        delivery_contact_name: data.delivery_contact_name,
        delivery_contact_phone: data.delivery_contact_phone,
        delivery_notes: data.delivery_notes || null,
        package_description: data.package_description,
        package_size: data.package_size,
        payment_amount: Number(data.payment_amount),
        notes: data.notes || null,
      });

      const delivery = deliveryRes.data.data;
      console.log('Delivery response:', delivery); // ⭐ ekle
      setCurrentOrderNumber(delivery.order_number);

      if (!delivery || !delivery.id) {
  throw new Error('Sipariş oluşturulamadı');
}

const deliveryId = Number(delivery.id);




      // 2. Payment initialize
      const nameParts = data.guest_name.trim().split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ') || nameParts[0];

      const paymentRes = await axios.post(`${API_URL}/payments/initialize-guest/${deliveryId}`, {
        name: firstName,
        surname: lastName,
        email: data.guest_email,
        phone: data.pickup_contact_phone,
      });

      setCheckoutFormContent(paymentRes.data.data.checkoutFormContent);

      // Step 4'e geç
      setStep(4);

    } catch (err) {
      setApiError(err.response?.data?.message || 'Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setStep(0);
    setData(INITIAL);
    setErrors({});
    setSuccess(null);
    setApiError('');
    setCheckoutFormContent(null);
    setCurrentOrderNumber(null);
  };

  const stepComponents = [
    <Step0 data={data} onChange={onChange} errors={errors} />,
    <Step1 data={data} onChange={onChange} errors={errors} onOpenMap={setMapTarget} />,
    <Step2 data={data} onChange={onChange} errors={errors} onOpenMap={setMapTarget} />,
    <Step3 data={data} onChange={onChange} errors={errors} />,
    <Step4Payment checkoutFormContent={checkoutFormContent} orderNumber={currentOrderNumber} amount={data.payment_amount} />,
  ];

  return (
    <>
      {mapTarget && (
        <MapPicker
          title={mapTarget === 'pickup' ? 'Alış Noktası Konumu' : 'Teslimat Noktası Konumu'}
          initialLat={mapTarget === 'pickup' ? data.pickup_latitude : data.delivery_latitude}
          initialLng={mapTarget === 'pickup' ? data.pickup_longitude : data.delivery_longitude}
          onSelect={handleMapSelect}
          onClose={() => setMapTarget(null)}
        />
      )}

      <section id="hizli-gonderi" className="py-20 md:py-32 px-4 md:px-6 bg-gray-50/60">
        <div className="max-w-6xl mx-auto">

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 md:mb-16">
            <div>
              <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-[#FBCF2D] mb-3">Hızlı Sipariş</p>
              <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-gray-900">
                Kayıtsız paket gönder<span className="text-[#FBCF2D]">.</span>
              </h2>
              <p className="text-xs md:text-sm font-medium text-gray-400 mt-3 max-w-md leading-relaxed">
                Hesap oluşturmadan sipariş verin, anında kart ile ödeyin.
              </p>
            </div>
            <div className="flex gap-4 md:gap-8">
              {[
                { icon: <Zap size={20} strokeWidth={2.5} />, label: 'Hızlı' },
                { icon: <ShieldCheck size={20} strokeWidth={2.5} />, label: 'Güvenli' },
                { icon: <Headset size={20} strokeWidth={2.5} />, label: 'Destekli' }
              ].map((f) => (
                <div key={f.label} className="group flex flex-col items-center gap-3">
                  <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-white border border-gray-100 shadow-sm transition-all duration-300 group-hover:shadow-md group-hover:-translate-y-1 group-hover:border-[#FBCF2D]/50">
                    <div className="absolute inset-0 rounded-xl bg-[#FBCF2D] opacity-0 group-hover:opacity-10 blur-xl transition-opacity" />
                    <span className="relative text-gray-900 group-hover:text-[#FBCF2D] transition-colors">{f.icon}</span>
                  </div>
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.15em] group-hover:text-gray-900 transition-colors">{f.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7">
              <div className="bg-white rounded-[2.5rem] p-6 md:p-10 border border-gray-100" style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.03)' }}>
                {success ? (
                  <SuccessScreen orderNumber={success} onReset={reset} />
                ) : (
                  <>
                    <StepIndicator current={step} />
                    <div className="mb-7">
                      <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#FBCF2D] mb-1">Adım {step + 1} / {STEPS.length}</p>
                      <h3 className="text-xl font-black text-gray-900 tracking-tight">{STEPS[step]}</h3>
                    </div>

                    {stepComponents[step]}

                    {apiError && (
                      <div className="mt-5 p-4 bg-red-50 rounded-2xl border border-red-100">
                        <p className="text-[11px] font-bold text-red-600">{apiError}</p>
                      </div>
                    )}

                    {/* Step 4'te footer gizle (iyzico kendi butonunu gösteriyor) */}
                    {step < 4 && (
                      <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-50">
                        {step > 0 ? (
                          <button onClick={back} className="flex items-center gap-2 h-11 px-5 rounded-full border border-gray-200 text-[11px] font-black text-gray-500 uppercase tracking-widest hover:bg-gray-50 transition-all">
                            <BiChevronLeft size={16} /> Geri
                          </button>
                        ) : <div />}

                        {step < 3 ? (
                          <button onClick={next} className="flex items-center gap-2 h-11 px-7 rounded-full bg-gray-900 text-[#FBCF2D] text-[11px] font-black uppercase tracking-widest hover:bg-black transition-all active:scale-95">
                            İleri <BiChevronRight size={16} />
                          </button>
                        ) : (
                          <button onClick={submitAndPay} disabled={loading} className="flex items-center gap-2 h-11 px-7 rounded-full bg-[#FBCF2D] text-gray-900 text-[11px] font-black uppercase tracking-widest hover:bg-yellow-300 transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed">
                            {loading
                              ? <><div className="w-4 h-4 rounded-full border-2 border-gray-900/30 border-t-gray-900 animate-spin" /> Hazırlanıyor...</>
                              : <><BiCreditCard size={16} /> Ödemeye Geç</>
                            }
                          </button>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col gap-4 lg:sticky lg:top-8">
              <div className="bg-gray-900 rounded-[2rem] p-7">
                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[#FBCF2D] mb-5">Nasıl Çalışır?</p>
                <div className="flex flex-col gap-5">
                  {[
                    { n: '01', t: 'Formu doldurun', d: 'Alış ve teslimat adreslerini girin, harçlık belirleyin.' },
                    { n: '02', t: 'Kart ile ödeyin', d: 'Güvenli iyzico altyapısı ile anında ödeme yapın.' },
                    { n: '03', t: 'Kurye eşleşir', d: 'Güzergahına uyan öğrenci kurye paketi teslim alır.' },
                    { n: '04', t: 'Teslimat tamam', d: 'Paketiniz güvenle ulaşır, kurye harçlığını kazanır.' },
                  ].map((s) => (
                    <div key={s.n} className="flex gap-4">
                      <span className="text-[10px] font-black text-[#FBCF2D]/50 w-6 shrink-0 mt-0.5">{s.n}</span>
                      <div>
                        <p className="text-[11px] font-black text-white mb-0.5">{s.t}</p>
                        <p className="text-[10px] font-medium text-white/40 leading-relaxed">{s.d}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#FBCF2D]/10 rounded-[2rem] p-6 border border-[#FBCF2D]/20">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Minimum Harçlık</p>
                <p className="text-3xl font-black text-gray-900 tracking-tighter">{MIN_AMOUNT}₺</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default GuestOrderSection;