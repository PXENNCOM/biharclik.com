// Dosya: /src/components/common/TermsAndRulesModal.jsx

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
  BiBadgeCheck
} from 'react-icons/bi';

export const TermsAndRulesModal = ({ isOpen, onClose }) => {
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
            <div className="bg-red-50 text-red-600 p-2 rounded-xl">
              <BiShield size={20} className="md:w-6 md:h-6" />
            </div>
            <div>
              <h2 className="text-base md:text-lg font-black text-gray-900 leading-none">Kurallar ve Sorumluluklar</h2>
              <p className="text-[10px] md:text-xs text-gray-500 mt-0.5 md:mt-1">Güvenliğiniz ve yasal haklarınız için okumanız zorunludur</p>
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
                <h3 className="font-black text-red-900 text-sm md:text-base mb-2">⚠️ KRİTİK UYARI</h3>
                <p className="text-xs md:text-sm text-red-800 leading-relaxed font-bold mb-2">
                  Bu platform <strong>6098 sayılı Türk Borçlar Kanunu</strong> ve <strong>5510 sayılı Sosyal Sigortalar Kanunu</strong> kapsamında çalışır. 
                  Aşağıdaki kurallara uymamak yasal sorumluluk doğurur ve platform erişiminiz kalıcı olarak kapatılır.
                </p>
                <p className="text-xs md:text-sm text-red-700 leading-relaxed">
                  Kurye olarak çalışmanız, sigortalı çalışan statüsü oluşturabilir. Gelir kaynağınızın %50'sinden fazlasını bu platformdan kazanmamalısınız.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4 md:space-y-6">

            {/* 1. KABUL EDEMEZSİN - YASAKLI GÖNDERİLER */}
            <section className="bg-white rounded-2xl shadow-sm border-2 border-red-200 overflow-hidden">
              <div className="bg-red-50 p-3 md:p-4 border-b-2 border-red-200 flex items-center gap-3">
                <BiError className="text-red-600 flex-shrink-0" size={20} />
                <h3 className="font-bold text-gray-900 text-sm md:text-base">1. KABUL EDEMEZSİNİZ - Yasaklı Gönderiler</h3>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3 mb-4">
                  <div className="bg-red-50 p-2.5 rounded-lg text-xs font-bold text-red-800 flex items-center gap-2 border border-red-200">
                    <span>💰</span> Para, Çek, Kredi Kartı
                  </div>
                  <div className="bg-red-50 p-2.5 rounded-lg text-xs font-bold text-red-800 flex items-center gap-2 border border-red-200">
                    <span>💎</span> Altın, Mücevher, Değerli Eşya
                  </div>
                  <div className="bg-red-50 p-2.5 rounded-lg text-xs font-bold text-red-800 flex items-center gap-2 border border-red-200">
                    <span>☕</span> Sıvı Gıdalar, Akışkanlar
                  </div>
                  <div className="bg-red-50 p-2.5 rounded-lg text-xs font-bold text-red-800 flex items-center gap-2 border border-red-200">
                    <span>🏺</span> Korumasız Kırılabilir Eşya
                  </div>
                  <div className="bg-red-50 p-2.5 rounded-lg text-xs font-bold text-red-800 flex items-center gap-2 border border-red-200">
                    <span>⛔</span> Yasa Dışı/Uyuşturucu
                  </div>
                  <div className="bg-red-50 p-2.5 rounded-lg text-xs font-bold text-red-800 flex items-center gap-2 border border-red-200">
                    <span>🔪</span> Silah, Kesici Alet
                  </div>
                </div>
                
                <div className="bg-red-100 border-2 border-red-300 rounded-xl p-3 md:p-4 space-y-2">
                  <p className="text-xs md:text-sm text-red-900 font-bold flex items-start gap-2">
                    <BiLock className="flex-shrink-0 mt-0.5" size={16} />
                    <span>Bu kategorideki teslimatları kabul ederseniz YASAL SORUMLULUK size aittir. Polis kontrolünde suçlu duruma düşebilirsiniz.</span>
                  </p>
                  <p className="text-xs md:text-sm text-red-900 font-bold flex items-start gap-2">
                    <BiError className="flex-shrink-0 mt-0.5" size={16} />
                    <span>Şüpheli paket gördüğünüzde RED etme hakkınız vardır. Platform size baskı yapamaz.</span>
                  </p>
                </div>
              </div>
            </section>

            {/* 2. SİGORTA VE SORUMLULUK */}
            <section className="bg-white rounded-2xl shadow-sm border-2 border-orange-200 overflow-hidden">
              <div className="bg-orange-50 p-3 md:p-4 border-b-2 border-orange-200 flex items-center gap-3">
                <BiShield className="text-orange-600 flex-shrink-0" size={20} />
                <h3 className="font-bold text-gray-900 text-sm md:text-base">2. Sigorta ve Hasar Sorumluluğu</h3>
              </div>
              <div className="p-4 space-y-3">
                <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-3 md:p-4">
                  <p className="text-xs md:text-sm text-orange-900 font-bold mb-3">
                    📋 EMANET KURALI (Türk Borçlar Kanunu Md. 561-571)
                  </p>
                  <ul className="space-y-2 text-xs md:text-sm text-orange-800">
                    <li className="flex items-start gap-2">
                      <span className="text-orange-600 font-black">•</span>
                      <span><strong>1.000 TL'ye kadar:</strong> Sigorta YOK, hasar durumunda SİZ sorumlusunuz</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-600 font-black">•</span>
                      <span><strong>1.000-10.000 TL arası:</strong> Mikro sigorta (50-150 TL ücret), hasar durumunda sigorta öder</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-600 font-black">•</span>
                      <span><strong>10.000 TL üzeri:</strong> Tam sigorta zorunlu (400 TL ücret), GPS takip + kamera kaydı</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-red-100 border-2 border-red-300 rounded-xl p-3 md:p-4">
                  <p className="text-xs md:text-sm text-red-900 font-black mb-2">
                    ⚠️ HASAR/KAYIP DURUMUNDA:
                  </p>
                  <p className="text-xs md:text-sm text-red-800 leading-relaxed">
                    Teslimatı kaybederseniz veya hasar verirseniz, <strong>MAL SAHİBİ SİZE DAVA AÇABİLİR</strong>. 
                    Platform aracı konumundadır, yasal sorumluluk kurye (siz) ve göndericiye aittir.
                  </p>
                </div>
              </div>
            </section>

            {/* 3. PAKETLEME SORUMLULUĞU */}
            <section className="bg-white rounded-2xl shadow-sm border-2 border-yellow-200 overflow-hidden">
              <div className="bg-yellow-50 p-3 md:p-4 border-b-2 border-yellow-200 flex items-center gap-3">
                <BiPackage className="text-yellow-600 flex-shrink-0" size={20} />
                <h3 className="font-bold text-gray-900 text-sm md:text-base">3. Paketleme ve Teslim Alma Kuralları</h3>
              </div>
              <div className="p-4 space-y-3">
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 md:p-4">
                  <p className="text-xs md:text-sm text-yellow-900 font-bold mb-2">
                    ✅ KABUL EDEBİLİRSİNİZ:
                  </p>
                  <ul className="space-y-1.5 text-xs md:text-sm text-yellow-800">
                    <li className="flex items-start gap-2">
                      <BiCheckDouble className="text-green-600 flex-shrink-0 mt-0.5" size={16} />
                      <span>Sağlam karton kutu, bantlanmış, ezilmeye dayanıklı</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <BiCheckDouble className="text-green-600 flex-shrink-0 mt-0.5" size={16} />
                      <span>Evrak zarfı, kalın dosya kapağı, bubble wrap korumalı</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <BiCheckDouble className="text-green-600 flex-shrink-0 mt-0.5" size={16} />
                      <span>Toplu taşımada 2-3 saatlik yolculuğa dayanabilecek paket</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-red-50 border-2 border-red-200 rounded-xl p-3 md:p-4">
                  <p className="text-xs md:text-sm text-red-900 font-bold mb-2">
                    ❌ REDDEDİN:
                  </p>
                  <ul className="space-y-1.5 text-xs md:text-sm text-red-800">
                    <li className="flex items-start gap-2">
                      <BiX className="text-red-600 flex-shrink-0 mt-0.5" size={16} />
                      <span>İnce naylon poşet, yırtılabilir zarf, bantlanmamış kutu</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <BiX className="text-red-600 flex-shrink-0 mt-0.5" size={16} />
                      <span>Açık paket, içeriği görünmeyen/bilinmeyen paket</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <BiX className="text-red-600 flex-shrink-0 mt-0.5" size={16} />
                      <span>Islak, yağlı, sızan, kötü kokulu paket</span>
                    </li>
                  </ul>
                  <p className="text-xs md:text-sm text-red-900 font-black mt-3 bg-red-100 p-2 rounded-lg">
                    ⚠️ Yetersiz paketlemeden kaynaklı hasar SİZİN sorumluluğunuz DEĞİLDİR - ama paketi teslim almadan önce kontrol etmezseniz, ispat edemezsiniz!
                  </p>
                </div>
              </div>
            </section>


            {/* 5. YASAL STATÜ UYARISI */}
            <section className="bg-white rounded-2xl shadow-sm border-2 border-blue-200 overflow-hidden">
              <div className="bg-blue-50 p-3 md:p-4 border-b-2 border-blue-200 flex items-center gap-3">
                <BiCopyright className="text-blue-600 flex-shrink-0" size={20} />
                <h3 className="font-bold text-gray-900 text-sm md:text-base">5. Çalışma Statüsü ve Sigorta Uyarısı</h3>
              </div>
              <div className="p-4">
                <div className="bg-blue-100 border-2 border-blue-300 rounded-xl p-3 md:p-4 space-y-3">
                  <p className="text-xs md:text-sm text-blue-900 font-bold">
                    📜 5510 Sayılı Sosyal Sigortalar Kanunu Uyarısı:
                  </p>
                  <ul className="space-y-2 text-xs md:text-sm text-blue-800">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-black">•</span>
                      <span>Bu platform üzerinden aylık geliriniz <strong>toplam gelirinizin %50'sini geçmemelidir</strong></span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-black">•</span>
                      <span>Haftada 30 saat üzeri çalışırsanız SGK tescil zorunluluğu doğar</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-black">•</span>
                      <span>Platform "aracı" konumundadır, işveren değildir - siz bağımsız hizmet sağlayıcısınız</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-black">•</span>
                      <span>Kooperatif üyesi olarak vergi/sigorta sorumluluğu size aittir</span>
                    </li>
                  </ul>
                  <p className="text-xs md:text-sm text-blue-900 font-black bg-blue-200 p-2 md:p-3 rounded-lg mt-3">
                    ⚖️ Aylık 10.000 TL üzeri kazanç elde ederseniz vergi mükellefiyeti başlar. Muhasebeci ile görüşmeniz önerilir.
                  </p>
                </div>
              </div>
            </section>

            <section className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl shadow-lg border-2 border-red-300 overflow-hidden">
              <div className="bg-red-100 p-3 md:p-4 border-b-2 border-red-300 flex items-center gap-3">
                <BiError className="text-red-700 flex-shrink-0" size={20} />
                <h3 className="font-bold text-red-900 text-sm md:text-base">6. KİŞİSEL GÜVENLİK KURALLARI</h3>
              </div>
              <div className="p-4">
                <div className="space-y-2">
                  <p className="text-xs md:text-sm text-red-900 font-bold flex items-start gap-2">
                    <BiLock className="flex-shrink-0 mt-0.5" size={16} />
                    <span>Kimliğinizi göstermeden ÖN ÖDEME istenmesi DOLANDIRICILIKTIR</span>
                  </p>
                  <p className="text-xs md:text-sm text-red-900 font-bold flex items-start gap-2">
                    <BiLock className="flex-shrink-0 mt-0.5" size={16} />
                    <span>Teslimatı başka birine devretmek YASAKTIR - hesabınız kapatılır</span>
                  </p>
                  <p className="text-xs md:text-sm text-red-900 font-bold flex items-start gap-2">
                    <BiLock className="flex-shrink-0 mt-0.5" size={16} />
                    <span>Tehlikeli bölgelerde (gece geç saatler, tenha yerler) teslimat REDDETME HAKKINIZ vardır</span>
                  </p>
                  <p className="text-xs md:text-sm text-red-900 font-bold flex items-start gap-2">
                    <BiLock className="flex-shrink-0 mt-0.5" size={16} />
                    <span>Rahatsız edici/şüpheli davranış durumunda teslimatı bırakıp GÜVENLİK çağırabilirsiniz</span>
                  </p>
                </div>
              </div>
            </section>

            {/* Footer */}
            <div className="text-center pt-4 pb-6 opacity-60">
              <div className="inline-flex items-center gap-1 text-[10px] md:text-xs text-gray-500">
                <BiCopyright size={14} />
                <span>6098 sayılı TBK, 5510 sayılı SGK, 6563 sayılı E-Ticaret Kanunu'na uygundur.</span>
              </div>
            </div>

          </div>
        </div>

        {/* Alt Buton */}
        <div className="p-4 bg-white border-t-2 border-gray-200 sticky bottom-0">
          <button 
            onClick={onClose} 
            className="w-full py-3 md:py-4 bg-[#FBCF2D] hover:bg-black text-white font-bold rounded-xl md:rounded-2xl text-sm md:text-base transition active:scale-95"
          >
            Okudum, Kabul Ediyorum
          </button>
        </div>

      </div>
    </div>
  );
};