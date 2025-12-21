import React, { useState } from 'react';
import { LocationPicker } from '../../components/sender/LocationPicker';
import { StatusModal } from '../../components/common/ActionModals';
import { 
  BiMap, BiNavigation, BiPackage, BiWallet, BiCheckCircle, 
  BiX, BiChevronRight, BiChevronLeft, BiUser, BiPhone 
} from 'react-icons/bi';

const ISTANBUL_DISTRICTS = [
  'Adalar', 'Arnavutköy', 'Ataşehir', 'Avcılar', 'Bağcılar', 'Bahçelievler',
  'Bakırköy', 'Başakşehir', 'Bayrampaşa', 'Beşiktaş', 'Beykoz', 'Beylikdüzü',
  'Beyoğlu', 'Büyükçekmece', 'Çatalca', 'Çekmeköy', 'Esenler', 'Esenyurt',
  'Eyüpsultan', 'Fatih', 'Gaziosmanpaşa', 'Güngören', 'Kadıköy', 'Kağıthane',
  'Kartal', 'Küçükçekmece', 'Maltepe', 'Pendik', 'Sancaktepe', 'Sarıyer',
  'Silivri', 'Sultanbeyli', 'Sultangazi', 'Şile', 'Şişli', 'Tuzla',
  'Ümraniye', 'Üsküdar', 'Zeytinburnu'
];

export const CreateShipmentModal = ({ onClose, onSubmit, isLoading }) => {
  const [step, setStep] = useState(1);
  
  const [popup, setPopup] = useState({ isOpen: false, type: 'error', title: '', message: '' });

  const [formData, setFormData] = useState({
    pickup_district: '',
    pickup_address: '',
    pickup_contact_name: '',
    pickup_contact_phone: '',
    delivery_district: '',
    delivery_address: '',
    delivery_contact_name: '',
    delivery_contact_phone: '',
    package_description: '',
    package_size: 'small',
    payment_amount: '',
    notes: '',
  });

  const [pickupLocation, setPickupLocation] = useState(null);
  const [deliveryLocation, setDeliveryLocation] = useState(null);

  const showError = (message) => {
    setPopup({ 
        isOpen: true, 
        type: 'error', 
        title: 'Eksik Bilgi', 
        message: message 
    });
  };

  // Telefon formatını düzenle
  const formatPhone = (value) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length > 0 && !numbers.startsWith('0')) {
      return '0' + numbers.slice(0, 10);
    }
    return numbers.slice(0, 11);
  };

  // Telefon validasyonu
  const validatePhone = (phone) => {
    const phoneRegex = /^(05)[0-9]{9}$/;
    return phoneRegex.test(phone);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Telefon alanlarını otomatik formatla
    if (name === 'pickup_contact_phone' || name === 'delivery_contact_phone') {
      setFormData(prev => ({ ...prev, [name]: formatPhone(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleNext = () => {
    // STEP 1 Validasyonları
    if (step === 1) {
        if (!formData.pickup_district || !formData.pickup_contact_name) {
            showError('Lütfen alış noktası için İlçe ve Yetkili Kişi alanlarını doldurun.');
            return;
        }
        
        // Adres uzunluğu kontrolü
        if (!formData.pickup_address || formData.pickup_address.trim().length < 10) {
            showError('Alış adresi en az 10 karakter olmalıdır. Lütfen detaylı adres yazın (Mahalle, Sokak, Bina No vb.).');
            return;
        }
        
        // Telefon kontrolü
        if (!formData.pickup_contact_phone) {
            showError('Lütfen alış noktası telefon numarasını girin.');
            return;
        }
        
        if (!validatePhone(formData.pickup_contact_phone)) {
            showError('Alış telefonu 05 ile başlamalı ve 11 haneli olmalıdır. Örn: 05551234567');
            return;
        }
    }
    
    // STEP 2 Validasyonları
    if (step === 2) {
        if (!formData.delivery_district || !formData.delivery_contact_name) {
            showError('Lütfen teslimat noktası için İlçe ve Alıcı Adı alanlarını doldurun.');
            return;
        }
        
        // Adres uzunluğu kontrolü
        if (!formData.delivery_address || formData.delivery_address.trim().length < 10) {
            showError('Teslimat adresi en az 10 karakter olmalıdır. Lütfen detaylı adres yazın (Mahalle, Sokak, Bina No vb.).');
            return;
        }
        
        // Telefon kontrolü
        if (!formData.delivery_contact_phone) {
            showError('Lütfen teslimat noktası telefon numarasını girin.');
            return;
        }
        
        if (!validatePhone(formData.delivery_contact_phone)) {
            showError('Teslimat telefonu 05 ile başlamalı ve 11 haneli olmalıdır. Örn: 05551234567');
            return;
        }
    }
    
    setStep(prev => prev + 1);
  };

  const handleBack = () => setStep(prev => prev - 1);

  const handleFinalSubmit = () => {
    console.log('🔍 Form verileri:', formData);
    
    // Son validasyonlar
    if (!formData.package_description || formData.package_description.trim().length < 3) {
        showError('Paket açıklaması en az 3 karakter olmalıdır.');
        return;
    }
    
    const amount = parseFloat(formData.payment_amount);
    if (!formData.payment_amount || isNaN(amount) || amount < 100) {
        showError('Harçlık tutarı en az 100 TL olmalıdır.');
        return;
    }

    const finalData = {
        pickup_district: formData.pickup_district,
        pickup_address: formData.pickup_address,
        pickup_contact_name: formData.pickup_contact_name,
        pickup_contact_phone: formData.pickup_contact_phone,
        pickup_notes: formData.pickup_notes || null,
        pickup_latitude: pickupLocation?.lat || null,
        pickup_longitude: pickupLocation?.lng || null,
        
        delivery_district: formData.delivery_district,
        delivery_address: formData.delivery_address,
        delivery_contact_name: formData.delivery_contact_name,
        delivery_contact_phone: formData.delivery_contact_phone,
        delivery_notes: formData.delivery_notes || null,
        delivery_latitude: deliveryLocation?.lat || null,
        delivery_longitude: deliveryLocation?.lng || null,
        
        package_description: formData.package_description,
        package_size: formData.package_size,
        payment_amount: parseFloat(formData.payment_amount),
        notes: formData.notes || null
    };
    
    console.log('📤 Backend\'e gönderilen veri:', finalData);
    
    onSubmit(finalData);
  };

  return (
    <>
    <StatusModal 
        isOpen={popup.isOpen} 
        type={popup.type} 
        title={popup.title} 
        message={popup.message} 
        onClose={() => setPopup({ ...popup, isOpen: false })} 
    />

    <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-[2rem] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden relative">
        
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-white z-10">
          <div>
            <h2 className="text-2xl font-black text-gray-900">Yeni Gönderi</h2>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400 mt-1">
              <span className={step >= 1 ? 'text-yellow-500' : ''}>1. Alış</span>
              <BiChevronRight />
              <span className={step >= 2 ? 'text-gray-900' : ''}>2. Teslim</span>
              <BiChevronRight />
              <span className={step >= 3 ? 'text-green-600' : ''}>3. Detay</span>
            </div>
          </div>
          <button onClick={onClose} className="p-3 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors">
            <BiX size={24} className="text-gray-500" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-100 h-1.5">
            <div 
                className={`h-full transition-all duration-500 ease-out ${
                    step === 1 ? 'w-1/3 bg-yellow-400' : 
                    step === 2 ? 'w-2/3 bg-gray-900' : 'w-full bg-green-500'
                }`}
            ></div>
        </div>

        {/* Body (Scrollable) */}
        <div className="p-8 overflow-y-auto custom-scrollbar flex-1">
          
          {/* STEP 1: ALIŞ BİLGİLERİ */}
          {step === 1 && (
            <div className="space-y-6 animate-in slide-in-from-right-8 duration-300">
              <div className="bg-yellow-50 p-4 rounded-2xl border border-yellow-100 flex items-center gap-3">
                <div className="bg-white p-2 rounded-xl text-yellow-600 shadow-sm"><BiMap size={24} /></div>
                <div>
                    <h3 className="font-bold text-gray-900">Nereden Alınacak?</h3>
                    <p className="text-xs text-gray-500">Kuryenin paketi teslim alacağı konum.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 ml-1">İlçe <span className="text-red-500">*</span></label>
                    <select name="pickup_district" value={formData.pickup_district} onChange={handleChange} className="w-full bg-gray-50 border-0 rounded-xl p-3.5 text-gray-900 font-medium focus:ring-2 focus:ring-yellow-400">
                        <option value="">Seçiniz</option>
                        {ISTANBUL_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                 </div>
                 <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 ml-1">Yetkili Kişi <span className="text-red-500">*</span></label>
                    <div className="relative">
                        <BiUser className="absolute left-3.5 top-4 text-gray-400" />
                        <input type="text" name="pickup_contact_name" placeholder="Ad Soyad" value={formData.pickup_contact_name} onChange={handleChange} className="w-full bg-gray-50 border-0 rounded-xl p-3.5 pl-10 text-gray-900 font-medium focus:ring-2 focus:ring-yellow-400" />
                    </div>
                 </div>
              </div>

              <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 ml-1">Adres Detayı <span className="text-red-500">*</span></label>
                  <textarea 
                      name="pickup_address" 
                      rows="3" 
                      placeholder="Mahalle, Sokak, Bina No, Daire No vb. detaylı yazın..." 
                      value={formData.pickup_address} 
                      onChange={handleChange} 
                      className="w-full bg-gray-50 border-0 rounded-xl p-3.5 text-gray-900 font-medium focus:ring-2 focus:ring-yellow-400 resize-none" 
                  />
                  <p className={`text-xs ml-1 ${formData.pickup_address.length >= 10 ? 'text-green-600' : 'text-gray-400'}`}>
                      {formData.pickup_address.length} / 10 karakter (minimum)
                  </p>
              </div>

              <div className="space-y-1.5">
                 <label className="text-xs font-bold text-gray-500 ml-1">İletişim Telefonu <span className="text-red-500">*</span></label>
                 <div className="relative">
                    <BiPhone className="absolute left-3.5 top-4 text-gray-400" />
                    <input 
                        type="tel" 
                        name="pickup_contact_phone" 
                        placeholder="05551234567" 
                        value={formData.pickup_contact_phone} 
                        onChange={handleChange}
                        maxLength="11"
                        className="w-full bg-gray-50 border-0 rounded-xl p-3.5 pl-10 text-gray-900 font-medium focus:ring-2 focus:ring-yellow-400" 
                    />
                 </div>
                 {formData.pickup_contact_phone && !validatePhone(formData.pickup_contact_phone) && (
                    <p className="text-xs text-red-500 ml-1">05 ile başlamalı, 11 haneli olmalı</p>
                 )}
              </div>

              <div className="pt-2">
                <LocationPicker label="📍 Haritadan Konum İşaretle (Opsiyonel)" value={pickupLocation} onChange={setPickupLocation} />
              </div>
            </div>
          )}

          {/* STEP 2: TESLİM BİLGİLERİ */}
          {step === 2 && (
            <div className="space-y-6 animate-in slide-in-from-right-8 duration-300">
               <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 flex items-center gap-3">
                <div className="bg-white p-2 rounded-xl text-gray-900 shadow-sm"><BiNavigation size={24} /></div>
                <div>
                    <h3 className="font-bold text-gray-900">Nereye Teslim Edilecek?</h3>
                    <p className="text-xs text-gray-500">Paketin ulaşacağı hedef nokta.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 ml-1">İlçe <span className="text-red-500">*</span></label>
                    <select name="delivery_district" value={formData.delivery_district} onChange={handleChange} className="w-full bg-gray-50 border-0 rounded-xl p-3.5 text-gray-900 font-medium focus:ring-2 focus:ring-gray-900">
                        <option value="">Seçiniz</option>
                        {ISTANBUL_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                 </div>
                 <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 ml-1">Alıcı Adı <span className="text-red-500">*</span></label>
                    <div className="relative">
                        <BiUser className="absolute left-3.5 top-4 text-gray-400" />
                        <input type="text" name="delivery_contact_name" placeholder="Ad Soyad" value={formData.delivery_contact_name} onChange={handleChange} className="w-full bg-gray-50 border-0 rounded-xl p-3.5 pl-10 text-gray-900 font-medium focus:ring-2 focus:ring-gray-900" />
                    </div>
                 </div>
              </div>

              <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 ml-1">Adres Detayı <span className="text-red-500">*</span></label>
                  <textarea 
                      name="delivery_address" 
                      rows="3" 
                      placeholder="Mahalle, Sokak, Bina No, Daire No vb. detaylı yazın..." 
                      value={formData.delivery_address} 
                      onChange={handleChange} 
                      className="w-full bg-gray-50 border-0 rounded-xl p-3.5 text-gray-900 font-medium focus:ring-2 focus:ring-gray-900 resize-none" 
                  />
                  <p className={`text-xs ml-1 ${formData.delivery_address.length >= 10 ? 'text-green-600' : 'text-gray-400'}`}>
                      {formData.delivery_address.length} / 10 karakter (minimum)
                  </p>
              </div>

              <div className="space-y-1.5">
                 <label className="text-xs font-bold text-gray-500 ml-1">Alıcı Telefonu <span className="text-red-500">*</span></label>
                 <div className="relative">
                    <BiPhone className="absolute left-3.5 top-4 text-gray-400" />
                    <input 
                        type="tel" 
                        name="delivery_contact_phone" 
                        placeholder="05551234567" 
                        value={formData.delivery_contact_phone} 
                        onChange={handleChange}
                        maxLength="11"
                        className="w-full bg-gray-50 border-0 rounded-xl p-3.5 pl-10 text-gray-900 font-medium focus:ring-2 focus:ring-gray-900" 
                    />
                 </div>
                 {formData.delivery_contact_phone && !validatePhone(formData.delivery_contact_phone) && (
                    <p className="text-xs text-red-500 ml-1">05 ile başlamalı, 11 haneli olmalı</p>
                 )}
              </div>

              <div className="pt-2">
                <LocationPicker label="📍 Teslimat Konumunu İşaretle (Opsiyonel)" value={deliveryLocation} onChange={setDeliveryLocation} />
              </div>
            </div>
          )}

          {/* STEP 3: PAKET VE ÖDEME */}
          {step === 3 && (
             <div className="space-y-6 animate-in slide-in-from-right-8 duration-300">
                <div className="bg-green-50 p-4 rounded-2xl border border-green-100 flex items-center gap-3">
                    <div className="bg-white p-2 rounded-xl text-green-600 shadow-sm"><BiPackage size={24} /></div>
                    <div>
                        <h3 className="font-bold text-gray-900">Paket ve Ödeme</h3>
                        <p className="text-xs text-gray-500">Son detayları belirleyin.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-500 ml-1">Paket İçeriği <span className="text-red-500">*</span></label>
                            <input 
                                type="text" 
                                name="package_description" 
                                placeholder="Örn: Dosya, Anahtar, Evrak..." 
                                value={formData.package_description} 
                                onChange={handleChange} 
                                className="w-full bg-gray-50 border-0 rounded-xl p-3.5 text-gray-900 font-medium focus:ring-2 focus:ring-green-500" 
                            />
                            {formData.package_description && formData.package_description.length < 3 && (
                                <p className="text-xs text-red-500 ml-1">En az 3 karakter olmalı</p>
                            )}
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-500 ml-1">Boyut</label>
                            <select name="package_size" value={formData.package_size} onChange={handleChange} className="w-full bg-gray-50 border-0 rounded-xl p-3.5 text-gray-900 font-medium focus:ring-2 focus:ring-green-500">
                                <option value="small">Küçük (Zarf/Dosya)</option>
                                <option value="medium">Orta (Kutu)</option>
                                <option value="large">Büyük (Koli)</option>
                            </select>
                        </div>
                    </div>

                    <div className="bg-gray-900 p-6 rounded-3xl text-white space-y-4 shadow-lg">
                         <div className="flex items-center gap-2 mb-2">
                            <BiWallet className="text-green-400" size={20} />
                            <span className="font-bold">Kurye Ödemesi</span>
                         </div>
                         <div>
                            <label className="text-xs text-gray-400 block mb-1">Teklif Edilen Tutar (TL) <span className="text-red-400">*</span></label>
                            <input 
                                type="number" 
                                name="payment_amount" 
                                min="100"
                                step="10"
                                placeholder="0.00" 
                                value={formData.payment_amount} 
                                onChange={handleChange} 
                                className="w-full bg-gray-800 border-2 border-gray-700 rounded-xl p-3 text-2xl font-black text-white focus:border-green-500 focus:ring-0 placeholder-gray-600" 
                            />
                            <p className="text-xs text-gray-400 mt-2 text-right">Minimum 100 TL</p>
                            {formData.payment_amount && parseFloat(formData.payment_amount) < 100 && (
                                <p className="text-xs text-red-400 mt-1">En az 100 TL olmalı</p>
                            )}
                         </div>
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 ml-1">Kuryeye Not (Opsiyonel)</label>
                    <textarea name="notes" rows="2" placeholder="Varsa eklemek istedikleriniz..." value={formData.notes} onChange={handleChange} className="w-full bg-gray-50 border-0 rounded-xl p-3.5 text-gray-900 font-medium focus:ring-2 focus:ring-green-500 resize-none" />
                </div>
             </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
            {step > 1 ? (
                 <button onClick={handleBack} className="px-6 py-3 text-gray-600 font-bold hover:bg-gray-200 rounded-xl transition flex items-center gap-2">
                    <BiChevronLeft size={20} /> Geri
                 </button>
            ) : (
                <div className="w-10"></div>
            )}

            {step < 3 ? (
                <button onClick={handleNext} className="px-8 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-black shadow-lg shadow-gray-200 transition flex items-center gap-2">
                    Devam Et <BiChevronRight size={20} />
                </button>
            ) : (
                <button 
                    onClick={handleFinalSubmit} 
                    disabled={isLoading}
                    className="px-10 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 shadow-lg shadow-green-200 transition flex items-center gap-2 disabled:opacity-50"
                >
                    {isLoading ? 'Oluşturuluyor...' : <><BiCheckCircle size={20} /> Siparişi Onayla</>}
                </button>
            )}
        </div>

      </div>
    </div>
    </>
  );
};