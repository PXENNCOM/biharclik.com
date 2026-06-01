export const ISTANBUL_DISTRICTS = [
  'Adalar', 'Arnavutköy', 'Ataşehir', 'Avcılar', 'Bağcılar', 'Bahçelievler',
  'Bakırköy', 'Başakşehir', 'Bayrampaşa', 'Beşiktaş', 'Beykoz', 'Beylikdüzü',
  'Beyoğlu', 'Büyükçekmece', 'Çatalca', 'Çekmeköy', 'Esenler', 'Esenyurt',
  'Eyüpsultan', 'Fatih', 'Gaziosmanpaşa', 'Güngören', 'Kadıköy', 'Kağıthane',
  'Kartal', 'Küçükçekmece', 'Maltepe', 'Pendik', 'Sancaktepe', 'Sarıyer',
  'Silivri', 'Sultanbeyli', 'Sultangazi', 'Şile', 'Şişli', 'Tuzla', 'Ümraniye',
  'Üsküdar', 'Zeytinburnu',
];

export const PACKAGE_SIZES = [
  { value: 'small', label: 'Küçük', desc: 'Zarf, kitap, küçük kutu', icon: '📦' },
  { value: 'medium', label: 'Orta', desc: 'Ayakkabı kutusu büyüklüğü', icon: '🗃️' },
  { value: 'large', label: 'Büyük', desc: 'Sırt çantasına sığan max', icon: '🧳' },
];

export const STEPS = ['Bilgileriniz', 'Alış Noktası', 'Teslimat Noktası', 'Paket & Harçlık', 'Ödeme'];

export const MIN_AMOUNT = 350;

export const INITIAL_DATA = {
  guest_name: '', guest_email: '', guest_phone: '',
  pickup_address: '', pickup_district: '',
  pickup_latitude: null, pickup_longitude: null,
  pickup_contact_name: '', pickup_contact_phone: '', pickup_notes: '',
  delivery_address: '', delivery_district: '',
  delivery_latitude: null, delivery_longitude: null,
  delivery_contact_name: '', delivery_contact_phone: '', delivery_notes: '',
  package_description: '', package_size: 'small', payment_amount: '', notes: '',
};

export const formatPhone = (v) => v.replace(/\D/g, '').slice(0, 11);
export const isValidPhone = (p) => /^(05)[0-9]{9}$/.test(p);
export const isValidEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

export const validateStep = (step, data) => {
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