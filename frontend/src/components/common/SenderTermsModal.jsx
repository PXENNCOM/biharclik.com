// Dosya: /src/components/common/SenderTermsModal.jsx

import React from 'react';
import { 
  BiShield, 
  BiError, 
  BiMoney, 
  BiPackage, 
  BiCopyright,
  BiInfoCircle,
  BiCheckDouble,
  BiX,
  BiTime,
  BiLock,
  BiMap,
  BiPhoneCall,
  BiCamera
} from 'react-icons/bi';

export const SenderTermsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-0 md:p-4 font-sans">
      <div 
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      <div className="relative bg-white w-full h-full md:h-auto md:max-h-[90vh] md:w-[850px] md:rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-5 border-b border-gray-100 bg-white sticky top-0 z-10">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="bg-blue-50 text-blue-600 p-2 rounded-xl">
              <BiShield size={20} className="md:w-6 md:h-6" />
            </div>
            <div>
              <h2 className="text-base md:text-lg font-black text-gray-900 leading-none">Gönderici Kuralları ve Sorumluluklar</h2>
              <p className="text-[10px] md:text-xs text-gray-500 mt-0.5 md:mt-1">Güvenli teslimat için dikkat edilmesi gerekenler</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 bg-gray-50 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
          >
            <BiX size={24} className="md:w-7 md:h-7" />
          </button>
        </div>

        {/* İçerik */}
        <div className="overflow-y-auto flex-1 p-4 md:p-6 lg:p-8 bg-gray-50">
          
          {/* KRİTİK UYARI */}
          <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-2xl p-4 md:p-5 mb-6 shadow-lg">
            <div className="flex gap-3">
              <BiError className="text-red-600 flex-shrink-0 mt-0.5" size={24} />
              <div>
                <h3 className="font-black text-red-900 text-sm md:text-base mb-2">⚠️ ÖNEMLİ BİLGİLENDİRME</h3>
                <p className="text-xs md:text-sm text-red-800 leading-relaxed font-bold mb-2">
                  Bu platform <strong>6098 sayılı Türk Borçlar Kanunu</strong>, <strong>6563 sayılı E-Ticaret Kanunu</strong> ve 
                  <strong> 6698 sayılı KVKK</strong> kapsamında hizmet verir.
                </p>
                <p className="text-xs md:text-sm text-red-700 leading-relaxed">
                  Platform "aracı hizmet sağlayıcı"dır, işveren veya nakliye şirketi değildir. Öğrenci kurye bağımsız çalışır, 
                  paketleme ve içerik sorumluluğu size aittir.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4 md:space-y-6">

            {/* 1. YASAKLI GÖNDERİLER */}
            <section className="bg-white rounded-2xl shadow-sm border-2 border-red-200 overflow-hidden">
              <div className="bg-red-50 p-3 md:p-4 border-b-2 border-red-200 flex items-center gap-3">
                <BiError className="text-red-600 flex-shrink-0" size={20} />
                <h3 className="font-bold text-gray-900 text-sm md:text-base">1. YASAKLI GÖNDERİLER - Yasal Sorumluluk</h3>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3 mb-4">
                  <div className="bg-red-50 p-2.5 rounded-lg text-xs font-bold text-red-800 flex items-center gap-2 border border-red-200">
                    <span>💰</span> Para, Çek, Kredi Kartı
                  </div>
                  <div className="bg-red-50 p-2.5 rounded-lg text-xs font-bold text-red-800 flex items-center gap-2 border border-red-200">
                    <span>💎</span> Altın, Mücevher (5K+ TL)
                  </div>
                  <div className="bg-red-50 p-2.5 rounded-lg text-xs font-bold text-red-800 flex items-center gap-2 border border-red-200">
                    <span>☕</span> Sıvı Gıda, Alkol
                  </div>
                  <div className="bg-red-50 p-2.5 rounded-lg text-xs font-bold text-red-800 flex items-center gap-2 border border-red-200">
                    <span>💊</span> İlaç, Uyuşturucu
                  </div>
                  <div className="bg-red-50 p-2.5 rounded-lg text-xs font-bold text-red-800 flex items-center gap-2 border border-red-200">
                    <span>🔪</span> Silah, Kesici Alet
                  </div>
                  <div className="bg-red-50 p-2.5 rounded-lg text-xs font-bold text-red-800 flex items-center gap-2 border border-red-200">
                    <span>🐕</span> Canlı Hayvan, Bitki
                  </div>
                </div>
                
                <div className="bg-red-100 border-2 border-red-300 rounded-xl p-3 md:p-4 space-y-2">
                  <p className="text-xs md:text-sm text-red-900 font-bold flex items-start gap-2">
                    <BiLock className="flex-shrink-0 mt-0.5" size={16} />
                    <span>Bu ürünleri göndermek TCK (Türk Ceza Kanunu) kapsamında SUÇ teşkil eder</span>
                  </p>
                  <p className="text-xs md:text-sm text-red-900 font-bold flex items-start gap-2">
                    <BiError className="flex-shrink-0 mt-0.5" size={16} />
                    <span>Polis kontrolünde tespit edilirse YASAL İŞLEM başlatılır</span>
                  </p>
                  <p className="text-xs md:text-sm text-red-900 font-bold flex items-start gap-2">
                    <BiX className="flex-shrink-0 mt-0.5" size={16} />
                    <span>Platform hesabınız KALICI KAPANIR, öğrenci kuryeye verilen zarar sizden tahsil edilir</span>
                  </p>
                </div>
              </div>
            </section>

            {/* 2. PAKETLEME SORUMLULUĞU */}
            <section className="bg-white rounded-2xl shadow-sm border-2 border-orange-200 overflow-hidden">
              <div className="bg-orange-50 p-3 md:p-4 border-b-2 border-orange-200 flex items-center gap-3">
                <BiPackage className="text-orange-600 flex-shrink-0" size={20} />
                <h3 className="font-bold text-gray-900 text-sm md:text-base">2. Paketleme Sorumluluğu - Hasar Riski</h3>
              </div>
              <div className="p-4 space-y-3">
                <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 md:p-4">
                  <p className="text-xs md:text-sm text-orange-900 font-bold mb-3">
                    📦 ÖNEMLİ: Öğrenci kurye TOPLU TAŞIMA kullanır (metro, otobüs, tramvay)
                  </p>
                  <p className="text-xs md:text-sm text-orange-800 mb-3">
                    Paketiniz 2-3 saatlik yolculukta kalabalık, sarsıntı, basınca dayanmalıdır.
                  </p>
                  
                  <div className="space-y-2">
                    <p className="text-xs md:text-sm font-bold text-green-700">✅ KABUL EDİLİR:</p>
                    <ul className="space-y-1.5 text-xs md:text-sm text-gray-700 ml-4">
                      <li>• Sağlam karton kutu (çift kat, bantlanmış)</li>
                      <li>• Bubble wrap, köpük korumalı iç paketleme</li>
                      <li>• "KIRILIR" etiketli sert dış kutu</li>
                      <li>• Su geçirmez naylon (yağmur koruması)</li>
                    </ul>

                    <p className="text-xs md:text-sm font-bold text-red-700 mt-3">❌ REDDEDİLİR:</p>
                    <ul className="space-y-1.5 text-xs md:text-sm text-gray-700 ml-4">
                      <li>• İnce poşet, market torbası</li>
                      <li>• Açık paket, bantlanmamış kutu</li>
                      <li>• Islak, sızan, kötü kokulu paket</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-red-50 border-2 border-red-200 rounded-xl p-3 md:p-4">
                  <p className="text-xs md:text-sm text-red-900 font-black mb-2">
                    ⚠️ HASAR SORUMLULUĞU:
                  </p>
                  <ul className="space-y-1.5 text-xs md:text-sm text-red-800">
                    <li className="flex items-start gap-2">
                      <BiCamera className="flex-shrink-0 mt-0.5" size={16} />
                      <span>Kurye paket durumunu teslim alırken FOTOĞRAFLAR</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <BiError className="flex-shrink-0 mt-0.5" size={16} />
                      <span>Yetersiz paketleme = Hasar sizin hatanız</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <BiX className="flex-shrink-0 mt-0.5" size={16} />
                      <span>Hasar talebiniz REDDEDİLİR</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* 3. ÖDEME VE İPTAL */}
            <section className="bg-white rounded-2xl shadow-sm border-2 border-yellow-200 overflow-hidden">
              <div className="bg-yellow-50 p-3 md:p-4 border-b-2 border-yellow-200 flex items-center gap-3">
                <BiMoney className="text-yellow-600 flex-shrink-0" size={20} />
                <h3 className="font-bold text-gray-900 text-sm md:text-base">3. Ödeme ve İptal - Para Kaybı Riski</h3>
              </div>
              <div className="p-4 space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-2.5 md:p-3 bg-green-50 border border-green-200 rounded-xl text-xs md:text-sm">
                    <span className="text-gray-700 font-medium">Kurye atanmadan önce iptal</span>
                    <span className="font-bold text-green-700 bg-green-100 px-2 md:px-3 py-1 rounded-lg">%100 İADE</span>
                  </div>
                  <div className="flex justify-between items-center p-2.5 md:p-3 bg-yellow-50 border border-yellow-200 rounded-xl text-xs md:text-sm">
                    <span className="text-gray-700 font-medium">Kurye atandıktan sonra iptal</span>
                    <span className="font-bold text-yellow-700 bg-yellow-100 px-2 md:px-3 py-1 rounded-lg">%50 İADE</span>
                  </div>
                  <div className="flex justify-between items-center p-2.5 md:p-3 bg-orange-50 border border-orange-200 rounded-xl text-xs md:text-sm">
                    <span className="text-gray-700 font-medium">Kurye yola çıktıktan sonra</span>
                    <span className="font-bold text-orange-700 bg-orange-100 px-2 md:px-3 py-1 rounded-lg">%30 İADE</span>
                  </div>
                  <div className="flex justify-between items-center p-2.5 md:p-3 bg-red-50 border-2 border-red-300 rounded-xl text-xs md:text-sm">
                    <span className="text-gray-700 font-medium">Kurye teslim aldıktan sonra</span>
                    <span className="font-bold text-red-900 bg-red-200 px-2 md:px-3 py-1 rounded-lg">%0 İADE</span>
                  </div>
                </div>

                <div className="bg-red-100 border-2 border-red-300 rounded-xl p-3 md:p-4">
                  <p className="text-xs md:text-sm text-red-900 font-bold mb-2">🚫 İADE YAPILMAZ:</p>
                  <ul className="space-y-1.5 text-xs md:text-sm text-red-800">
                    <li>• Alıcı adreste yoksa (alıcının hatası)</li>
                    <li>• Paket reddedilirse (içerik sorunu)</li>
                    <li>• Yanlış adres verirseniz (sizin hatanız)</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* 4. ADRES BİLGİLERİ */}
            <section className="bg-white rounded-2xl shadow-sm border-2 border-purple-200 overflow-hidden">
              <div className="bg-purple-50 p-3 md:p-4 border-b-2 border-purple-200 flex items-center gap-3">
                <BiMap className="text-purple-600 flex-shrink-0" size={20} />
                <h3 className="font-bold text-gray-900 text-sm md:text-base">4. Adres Bilgileri - Teslimat Başarısızlığı</h3>
              </div>
              <div className="p-4 space-y-3">
                <div className="bg-purple-50 border border-purple-200 rounded-xl p-3 md:p-4">
                  <p className="text-xs md:text-sm text-purple-900 font-bold mb-3">
                    📍 Öğrenci kurye Google Maps kullanır - Yanlış adres = Teslimat yapamaz
                  </p>
                  
                  <p className="text-xs md:text-sm font-bold text-green-700 mb-2">✅ DOĞRU ADRES:</p>
                  <ul className="space-y-1.5 text-xs md:text-sm text-gray-700 ml-4 mb-3">
                    <li>• Mahalle, sokak, bina no, daire no, kat</li>
                    <li>• "Yeşil kapı", "2. blok" gibi detaylar</li>
                    <li>• Alıcı telefonu (ulaşılamama durumu için)</li>
                    <li>• Alternatif telefon</li>
                  </ul>

                  <p className="text-xs md:text-sm font-bold text-red-700 mb-2">❌ YANLIŞ ADRES:</p>
                  <ul className="space-y-1.5 text-xs md:text-sm text-gray-700 ml-4">
                    <li>• "Kadıköy, Moda tarafları" (belirsiz)</li>
                    <li>• "İşyerim, bilirsin" (kurye bilmez!)</li>
                    <li>• "Eski adresim" (güncel değil)</li>
                    <li>• "Kapıda bekle ararım" (kurye bekleyemez)</li>
                  </ul>
                </div>
              </div>
            </section>

            

            {/* 6. KURYE İLİŞKİLERİ */}
            <section className="bg-white rounded-2xl shadow-sm border-2 border-indigo-200 overflow-hidden">
              <div className="bg-indigo-50 p-3 md:p-4 border-b-2 border-indigo-200 flex items-center gap-3">
                <BiPhoneCall className="text-indigo-600 flex-shrink-0" size={20} />
                <h3 className="font-bold text-gray-900 text-sm md:text-base">6. Kurye İlişkileri - Etik Kurallar</h3>
              </div>
              <div className="p-4 space-y-3">
                <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-3 md:p-4">
                  <p className="text-xs md:text-sm text-indigo-900 font-bold mb-3">
                    👤 Öğrenci kurye BAĞIMSIZ çalışır, işçi değildir
                  </p>
                  
                  <p className="text-xs md:text-sm font-bold text-green-700 mb-2">✅ YAPABİLİRSİNİZ:</p>
                  <ul className="space-y-1.5 text-xs md:text-sm text-gray-700 ml-4 mb-3">
                    <li>• Teslimat durumunu sormak (kibarca)</li>
                    <li>• Paket hasarlıysa fotoğraf istemek</li>
                    <li>• Gecikme varsa bilgi almak</li>
                    <li>• Platformdan şikayet etmek (gerekçe ile)</li>
                  </ul>

                  <p className="text-xs md:text-sm font-bold text-red-700 mb-2">❌ YAPAMAZSINIZ:</p>
                  <ul className="space-y-1.5 text-xs md:text-sm text-gray-700 ml-4">
                    <li>• Bağırmak, hakaret etmek → 30 gün askıya alma</li>
                    <li>• Tehdit etmek → Hesap KAPALI + Yasal işlem</li>
                    <li>• Kurye bilgilerini paylaşmak → KVKK ihlali</li>
                    <li>• Gereksiz şikayet (5+ red) → Kara liste</li>
                  </ul>
                </div>

                <div className="bg-red-50 border-2 border-red-200 rounded-xl p-3 md:p-4">
                  <p className="text-xs md:text-sm text-red-900 font-black mb-2">⚠️ ŞİKAYET SİSTEMİ:</p>
                  <ul className="space-y-1.5 text-xs md:text-sm text-red-800">
                    <li>• Geçerli şikayet: Kurye -100 puan</li>
                    <li>• Asılsız şikayet: Siz -50 puan</li>
                    <li>• Delil gerekir: Fotoğraf, mesaj, ses kaydı</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* 7. KVKK VE GİZLİLİK */}
            <section className="bg-white rounded-2xl shadow-sm border-2 border-pink-200 overflow-hidden">
              <div className="bg-pink-50 p-3 md:p-4 border-b-2 border-pink-200 flex items-center gap-3">
                <BiLock className="text-pink-600 flex-shrink-0" size={20} />
                <h3 className="font-bold text-gray-900 text-sm md:text-base">7. Kişisel Veri Gizliliği (KVKK)</h3>
              </div>
              <div className="p-4">
                <div className="bg-pink-50 border border-pink-200 rounded-xl p-3 md:p-4 space-y-3">
                  <p className="text-xs md:text-sm text-pink-900 font-bold">
                    🔒 6698 sayılı KVKK gereği kurye kişisel verilerinizi korur
                  </p>
                  
                  <div className="bg-red-100 border-2 border-red-300 rounded-xl p-3">
                    <p className="text-xs md:text-sm text-red-900 font-black mb-2">❌ SİZ DE YAPAMAZSINIZ:</p>
                    <ul className="space-y-1.5 text-xs md:text-sm text-red-800">
                      <li>• Kurye kimlik bilgilerini paylaşmak (TC, adres, telefon)</li>
                      <li>• Kurye fotoğrafını sosyal medyada paylaşmak</li>
                      <li>• Kurye hakkında ifşa/dedikodu yapmak</li>
                    </ul>
                  </div>

                  <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                    <p className="text-xs md:text-sm text-red-900 font-black mb-2">🚨 İHLAL SONUÇLARI:</p>
                    <ul className="space-y-1.5 text-xs md:text-sm text-red-800">
                      <li>• KVKK ihlali: 20.000 TL+ ceza (KVKK Kurumu)</li>
                      <li>• Platform hesabı kalıcı KAPALI</li>
                      <li>• Mağdur tarafından tazminat davası</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* 8. PLATFORM SORUMLULUĞU */}
            <section className="bg-white rounded-2xl shadow-sm border-2 border-gray-300 overflow-hidden">
              <div className="bg-gray-50 p-3 md:p-4 border-b-2 border-gray-300 flex items-center gap-3">
                <BiInfoCircle className="text-gray-600 flex-shrink-0" size={20} />
                <h3 className="font-bold text-gray-900 text-sm md:text-base">8. Platform Sorumluluğu - Yasal Sınırlar</h3>
              </div>
              <div className="p-4 space-y-3">
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 md:p-4">
                  <p className="text-xs md:text-sm text-gray-900 font-bold mb-3">
                    ⚖️ Platform "aracı hizmet sağlayıcı"dır (6563 E-Ticaret Kanunu)
                  </p>
                  
                  <p className="text-xs md:text-sm font-bold text-green-700 mb-2">✅ PLATFORM SORUMLUDUR:</p>
                  <ul className="space-y-1.5 text-xs md:text-sm text-gray-700 ml-4 mb-3">
                    <li>• Kurye kimlik doğrulama</li>
                    <li>• Ödeme güvenliği (escrow)</li>
                    <li>• Şikayet arabuluculuğu</li>
                    <li>• Teknik altyapı</li>
                  </ul>

                  <p className="text-xs md:text-sm font-bold text-red-700 mb-2">❌ PLATFORM SORUMLU DEĞİL:</p>
                  <ul className="space-y-1.5 text-xs md:text-sm text-gray-700 ml-4">
                    <li>• Paket hasarı (paketleme sizin sorumluluğunuz)</li>
                    <li>• Teslimat gecikmesi (trafik, kurye durumu)</li>
                    <li>• Kurye-gönderici ihtilafı (yasal süreç)</li>
                    <li>• Yasaklı ürün gönderme (cezai sorumluluk size ait)</li>
                  </ul>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 md:p-4">
                  <p className="text-xs md:text-sm text-yellow-900 font-black">
                    💡 Platform garanti vermez, sigorta almak sizin sorumluluğunuzdur
                  </p>
                </div>
              </div>
            </section>

            {/* Footer */}
            <div className="text-center pt-4 pb-6 opacity-60">
              <div className="inline-flex items-center gap-1 text-[10px] md:text-xs text-gray-500">
                <BiCopyright size={14} />
                <span>6098 TBK, 6563 E-Ticaret, 6698 KVKK, 5510 SGK Kanunlarına uygundur.</span>
              </div>
            </div>

          </div>
        </div>

        {/* Alt Buton */}
        <div className="p-4 bg-white border-t-2 border-gray-200 sticky bottom-0">
          <button 
            onClick={onClose} 
            className="w-full py-3 md:py-4 bg-[#FBCF2D] hover:bg-blue-700 text-white font-bold rounded-xl md:rounded-2xl text-sm md:text-base transition active:scale-95"
          >
            Okudum, Kabul Ediyorum
          </button>
        </div>

      </div>
    </div>
  );
};