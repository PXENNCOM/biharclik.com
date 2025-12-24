import { BiX, BiShield, BiFile } from 'react-icons/bi';

export const KvkkModal = ({ isOpen, onClose, type = 'aydinlatma' }) => {
  if (!isOpen) return null;

  const isAydinlatma = type === 'aydinlatma';
  const isPolitika = type === 'politika';
  const isKosullar = type === 'kosullar';

  // Icon ve renk belirleme
  let iconBg = 'bg-blue-100 text-blue-700';
  let icon = <BiShield size={20} className="md:w-6 md:h-6" />;
  let title = 'Aydınlatma Metni';

  if (isPolitika) {
    iconBg = 'bg-purple-100 text-purple-700';
    icon = <BiFile size={20} className="md:w-6 md:h-6" />;
    title = 'Kişisel Veri Politikası';
  } else if (isKosullar) {
    iconBg = 'bg-amber-100 text-amber-700';
    icon = <BiFile size={20} className="md:w-6 md:h-6" />;
    title = 'Kullanım Koşulları';
  }

  return (
    <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl md:rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
        
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 p-4 md:p-6 flex justify-between items-center z-10">
          <div className="flex items-center gap-2 md:gap-3">
            <div className={`p-1.5 md:p-2 rounded-lg ${iconBg}`}>
              {icon}
            </div>
            <h2 className="text-lg md:text-xl font-black text-gray-900">{title}</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 bg-gray-50 hover:bg-gray-100 rounded-full transition text-gray-500"
          >
            <BiX size={20} className="md:w-6 md:h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 md:p-6 lg:p-8">
          {isAydinlatma && <AydinlatmaMetni />}
          {isPolitika && <PolitikaMetni />}
          {isKosullar && <KullanimKosullari />}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4 md:p-6">
          <button
            onClick={onClose}
            className="w-full py-3 md:py-4 bg-gray-900 hover:bg-black text-white font-bold rounded-xl transition text-sm md:text-base"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};

// Aydınlatma Metni İçeriği
const AydinlatmaMetni = () => (
  <div className="prose prose-sm md:prose max-w-none space-y-4 md:space-y-6 text-gray-700">
    <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 md:p-6">
      <h3 className="text-base md:text-lg font-bold text-gray-900 mb-2">biharçlık.com KİŞİSEL VERİLERİN KORUNMASI HAKKINDA AYDINLATMA METNİ</h3>
      <p className="text-xs md:text-sm text-gray-600">
        6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca, veri sorumlusu sıfatıyla biharçlık.com olarak, kişisel verilerinizi aşağıda açıklanan kapsamda işliyoruz:
      </p>
    </div>

    <section>
      <h4 className="text-sm md:text-base font-bold text-gray-900 mb-3">A. Veri Toplama Amacımız</h4>
      <ul className="list-disc list-inside space-y-2 text-xs md:text-sm">
        <li><strong>Göndericiler için:</strong> Sipariş oluşturma, teslimatın takibi ve faturalandırma.</li>
        <li><strong>Kuryeler (Öğrenciler) için:</strong> Öğrenci statüsünün doğrulanması, ödemelerin IBAN aracılığıyla yapılması ve teslimat güvenliği için aktif görev süresince konum takibi.</li>
      </ul>
    </section>

    <section>
      <h4 className="text-sm md:text-base font-bold text-gray-900 mb-3">B. İşlenen Kişisel Veriler</h4>
      <ul className="list-disc list-inside space-y-2 text-xs md:text-sm">
        <li><strong>Kimlik ve İletişim:</strong> Ad-soyad, T.C. Kimlik No (Kurye doğrulaması için), telefon, e-posta.</li>
        <li><strong>Lokasyon:</strong> Kuryenin paket taşıma süresindeki anlık konumu.</li>
        <li><strong>Eğitim:</strong> Kurye adayının öğrenci belgesi ve okul bilgileri.</li>
      </ul>
    </section>

    <section>
      <h4 className="text-sm md:text-base font-bold text-gray-900 mb-3">C. Veri Aktarımı</h4>
      <p className="text-xs md:text-sm">
        Kişisel verileriniz, yalnızca teslimatın tamamlanabilmesi amacıyla ilgili kurye/gönderici ile sınırlı olarak (ad ve telefon) ve ödeme sistemleri altyapı sağlayıcıları ile paylaşılır. Yasal zorunluluk hallerinde yetkili makamlara aktarım yapılabilir.
      </p>
    </section>

    <section>
      <h4 className="text-sm md:text-base font-bold text-gray-900 mb-3">D. Haklarınız</h4>
      <p className="text-xs md:text-sm">
        KVKK'nın 11. maddesi uyarınca; verilerinizin silinmesini, düzeltilmesini veya işlenip işlenmediğini öğrenmeyi her zaman talep edebilirsiniz. İletişim: <a href="mailto:info@biharclik.com" className="text-blue-600 hover:underline font-medium">info@biharclik.com</a>
      </p>
    </section>
  </div>
);

// Politika Metni İçeriği
const PolitikaMetni = () => (
  <div className="prose prose-sm md:prose max-w-none space-y-4 md:space-y-6 text-gray-700">
    <div className="bg-purple-50 border border-purple-100 rounded-xl p-4 md:p-6">
      <h3 className="text-base md:text-lg font-bold text-gray-900 mb-2">biharçlık.com KİŞİSEL VERİ İŞLEME, SAKLAMA VE İMHA POLİTİKASI</h3>
    </div>

    <section>
      <h4 className="text-sm md:text-base font-bold text-gray-900 mb-3">1. GİRİŞ VE KAPSAM</h4>
      <p className="text-xs md:text-sm">
        İşbu politika, biharçlık.com tarafından işletilen dijital platformda toplanan verilerin yönetimi, saklanması ve güvenliğine ilişkin usulleri belirler. Platformumuz, göndericiler ile öğrenci kuryeleri buluşturan bir aracı hizmet sağlayıcıdır.
      </p>
    </section>

    <section>
      <h4 className="text-sm md:text-base font-bold text-gray-900 mb-3">2. VERİ GÜVENLİĞİ VE STRATEJİK TEDBİRLER</h4>
      <ul className="list-disc list-inside space-y-2 text-xs md:text-sm">
        <li><strong>Konum Verisi Güvenliği:</strong> Kuryelerin konum takibi, sadece kurye "Görev Başlat" butonuna bastığında başlar ve "Teslim Edildi" onayı ile sona erer. Bu veriler teslimat güvenliği ispatı için 6 ay saklanır, ardından anonim hale getirilir.</li>
        <li><strong>Öğrenci Belgeleri:</strong> Kurye adayları tarafından yüklenen öğrenci belgeleri, sadece doğrulama amacı güder. Onaylanan hesapların belgeleri fiziksel olarak indirilmez, bulut sunucuda kriptolu (şifreli) olarak tutulur.</li>
        <li><strong>Ödeme Güvenliği:</strong> biharçlık.com kullanıcıların kredi kartı veya ödeme bilgilerini sunucularında tutmaz. Tüm işlemler BDDK lisanslı ödeme kuruluşları (PayTR/iyzico vb.) üzerinden gerçekleşir.</li>
      </ul>
    </section>

    <section>
      <h4 className="text-sm md:text-base font-bold text-gray-900 mb-3">3. SORUMLULUK REDDİ (DISCLAIMER)</h4>
      <ul className="list-disc list-inside space-y-2 text-xs md:text-sm">
        <li><strong>Paket İçeriği:</strong> biharçlık.com, gönderilen paketlerin içeriğinden sorumlu değildir. Gönderici, paket içeriğinin yasalara uygun olduğunu taahhüt eder. Suç teşkil eden içeriklerden biharçlık.com sorumlu tutulamaz.</li>
        <li><strong>Bağımsızlık:</strong> Kuryeler, biharçlık.com'un personeli olmayıp, kendi serbest zamanlarında harçlık kazanmak isteyen bağımsız kullanıcılardır. Platform, taraflar arasındaki hukuki uyuşmazlıklarda aracı kurum sıfatıyla sınırlı sorumluluğa sahiptir.</li>
      </ul>
    </section>

    <section>
      <h4 className="text-sm md:text-base font-bold text-gray-900 mb-3">4. VERİ SAKLAMA SÜRELERİ</h4>
      <ul className="list-disc list-inside space-y-2 text-xs md:text-sm">
        <li><strong>İşlem Kayıtları:</strong> Vergi mevzuatı gereği 10 yıl.</li>
        <li><strong>Kullanıcı İletişim Verileri:</strong> Üyelik devam ettiği sürece.</li>
        <li><strong>Konum Kayıtları:</strong> Teslimat sonrası 6 ay (güvenlik amaçlı).</li>
      </ul>
    </section>

    <section>
      <h4 className="text-sm md:text-base font-bold text-gray-900 mb-3">5. İMHA SÜRECİ</h4>
      <p className="text-xs md:text-sm">
        Üyeliğini silen kullanıcının verileri, yasal bir engel bulunmadığı takdirde 30 gün içerisinde geri döndürülemeyecek şekilde veri tabanımızdan silinir.
      </p>
    </section>
  </div>
);


const KullanimKosullari = () => (
  <div className="prose prose-sm md:prose max-w-none space-y-4 md:space-y-6 text-gray-700">
    <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 md:p-6">
      <h3 className="text-base md:text-lg font-bold text-gray-900 mb-2">biharçlık.com KULLANIM KOŞULLARI VE ŞARTLARI</h3>
      <p className="text-xs md:text-sm text-gray-600">
        Son Güncelleme: 25 Aralık 2025
      </p>
    </div>

    <section>
      <h4 className="text-sm md:text-base font-bold text-gray-900 mb-3">1. TARAFLAR VE TANIMLAR</h4>
      <p className="text-xs md:text-sm mb-2">
        İşbu sözleşme, biharçlık.com web sitesi ve mobil uygulaması (bundan böyle "Platform" olarak anılacaktır) ile Platform'u kullanan Göndericiler ve Kuryeler (bundan böyle "Kullanıcı" olarak anılacaktır) arasında akdedilmiştir.
      </p>
      <ul className="list-disc list-inside space-y-2 text-xs md:text-sm">
        <li><strong>Platform:</strong> biharçlık.com tarafından işletilen, göndericiler ile öğrenci kuryeleri eşleştiren dijital aracı platformdur.</li>
        <li><strong>Gönderici:</strong> Platform üzerinden teslimat talebi oluşturan bireysel veya kurumsal kullanıcıdır.</li>
        <li><strong>Kurye (Öğrenci):</strong> Platform üzerinden teslimat görevlerini kabul eden ve gerçekleştiren öğrenci kullanıcıdır.</li>
        <li><strong>Teslimat:</strong> Göndericinin belirlediği noktadan alıcı adresine paket taşıma hizmetidir.</li>
      </ul>
    </section>

    <section>
      <h4 className="text-sm md:text-base font-bold text-gray-900 mb-3">2. HİZMETİN KAPSAMI VE SINIRLAMALARI</h4>
      <div className="space-y-3 text-xs md:text-sm">
        <p><strong>2.1. Platform Rolü:</strong> biharçlık.com, göndericiler ve kuryeler arasında dijital bir buluşma noktası sağlayan aracı bir platformdur. Platform, taraflar arasındaki teslimat işleminin güvenli şekilde gerçekleşmesi için teknik altyapı sunar ancak taşıma işleminin kendisini gerçekleştirmez.</p>
        
        <p><strong>2.2. Bağımsızlık:</strong> Kuryeler, Platform'un çalışanı değildir. Her kurye, kendi bağımsız kararıyla görev kabul eden ve serbest çalışan bir bireydir. Platform ile kurye arasında işveren-işçi ilişkisi bulunmamaktadır.</p>
        
        <p><strong>2.3. Yasak İçerikler:</strong> Platform üzerinden aşağıdaki içeriklerin taşınması kesinlikle yasaktır:</p>
        <ul className="list-disc list-inside ml-4 space-y-1">
          <li>Uyuşturucu, silah, patlayıcı madde</li>
          <li>Yasal olmayan veya çalıntı eşya</li>
          <li>Tehlikeli kimyasal maddeler</li>
          <li>Canlı hayvan (özel düzenleme gerektiren)</li>
          <li>Mevzuata aykırı herhangi bir ürün</li>
        </ul>
        <p className="mt-2 font-semibold">Gönderici, paket içeriğinin yasalara uygun olduğunu kabul ve taahhüt eder. Aksi durumda tüm hukuki ve cezai sorumluluk göndericiye aittir.</p>
      </div>
    </section>

    <section>
      <h4 className="text-sm md:text-base font-bold text-gray-900 mb-3">3. KULLANICI YÜKÜMLÜLÜKLERI</h4>
      <div className="space-y-3 text-xs md:text-sm">
        <p><strong>3.1. Göndericinin Yükümlülükleri:</strong></p>
        <ul className="list-disc list-inside ml-4 space-y-1">
          <li>Paket içeriğini doğru ve eksiksiz şekilde beyan etmek</li>
          <li>Teslimat adresini net ve doğru vermek</li>
          <li>Kurye ile saygılı iletişim kurmak</li>
          <li>Ödemeyi zamanında gerçekleştirmek</li>
          <li>Paket kaybolması/hasarı durumunda makul sürede bildirmek</li>
        </ul>

        <p className="mt-3"><strong>3.2. Kuryenin Yükümlülükleri:</strong></p>
        <ul className="list-disc list-inside ml-4 space-y-1">
          <li>Kabul ettiği görevleri zamanında tamamlamak</li>
          <li>Paketi özenle taşımak ve zarar vermemek</li>
          <li>Gönderici ve alıcı ile profesyonel iletişim kurmak</li>
          <li>Teslimat sırasında konum paylaşımına izin vermek</li>
          <li>Öğrenci belgelerinin güncel ve geçerli olmasını sağlamak</li>
        </ul>
      </div>
    </section>

    <section>
      <h4 className="text-sm md:text-base font-bold text-gray-900 mb-3">4. FİYATLANDIRMA VE ÖDEME</h4>
      <div className="space-y-2 text-xs md:text-sm">
        <p><strong>4.1. Harçlık Modeli:</strong> Platform, "harçlık modeli" uygular. Gönderici, kurye için uygun gördüğü tutarı belirler. Bu tutar, kuryenin görev başına alacağı ücrettir.</p>
        
        <p><strong>4.2. Komisyon:</strong> Platform, her başarılı teslimat için belirlenen harçlık tutarından %15 hizmet bedeli alır. Kalan tutar doğrudan kuryeye aktarılır.</p>
        
        <p><strong>4.3. Ödeme Yöntemi:</strong> Gönderici, teslimat talebini oluştururken ödemeyi kredi kartı/banka kartı ile gerçekleştirir. Kurye ödemesi, teslimat tamamlandıktan sonra IBAN'ına otomatik olarak aktarılır.</p>
        
        <p><strong>4.4. İade ve İptal:</strong> Kurye görev kabul etmeden önce gönderici talebini iptal edebilir ve ödeme iade edilir. Kurye kabul ettikten sonra iptal, sadece karşılıklı anlaşma ile mümkündür.</p>
      </div>
    </section>

    <section>
      <h4 className="text-sm md:text-base font-bold text-gray-900 mb-3">5. SORUMLULUK SINIRLAMALARI</h4>
      <div className="space-y-2 text-xs md:text-sm">
        <p><strong>5.1. Platform Sorumluluğu:</strong> biharçlık.com, teknik altyapı sağlayan bir aracı platformdur ve aşağıdaki durumlardan sorumlu değildir:</p>
        <ul className="list-disc list-inside ml-4 space-y-1">
          <li>Kurye ve gönderici arasındaki anlaşmazlıklar</li>
          <li>Paket içeriğinin yasadışı olması</li>
          <li>Kuryenin trafik kazası, yaralanma vb. durumları</li>
          <li>Mücbir sebeplerle (doğal afet, salgın vb.) teslimatın yapılamaması</li>
          <li>Kullanıcıların birbirlerine karşı hukuka aykırı davranışları</li>
        </ul>

        <p className="mt-3"><strong>5.2. Kayıp ve Hasar:</strong> Paket kaybolması veya hasar görmesi durumunda, Platform aracılık eder ancak nihai sorumluluk kuryededir. Gönderici, değerli eşyalar için kargo sigortası yaptırabilir (ayrı ücretlidir).</p>

        <p className="mt-3"><strong>5.3. Veri Güvenliği:</strong> Platform, kullanıcı verilerini KVKK uyarınca korur ancak siber saldırı, veri ihlali gibi durumlarda mümkün olan en kısa sürede kullanıcıları bilgilendirir.</p>
      </div>
    </section>

    <section>
      <h4 className="text-sm md:text-base font-bold text-gray-900 mb-3">6. ÜYELİK VE HESAP GÜVENLİĞİ</h4>
      <div className="space-y-2 text-xs md:text-sm">
        <p><strong>6.1. Hesap Sorumluluğu:</strong> Kullanıcı, hesap bilgilerinin güvenliğinden kendisi sorumludur. Şifre paylaşımı, hesap satışı vb. durumlar kesinlikle yasaktır.</p>
        
        <p><strong>6.2. Hesap İptali:</strong> Platform, kullanım koşullarını ihlal eden hesapları önceden haber vermeksizin askıya alabilir veya tamamen kapatabilir.</p>
        
        <p><strong>6.3. Kullanıcı Verileri:</strong> Üyeliğini sonlandıran kullanıcının verileri, KVKK uyarınca 30 gün içinde silinir (yasal saklama zorunluluğu hariç).</p>
      </div>
    </section>

    <section>
      <h4 className="text-sm md:text-base font-bold text-gray-900 mb-3">7. UYUŞMAZLIK ÇÖZÜMÜ</h4>
      <div className="space-y-2 text-xs md:text-sm">
        <p><strong>7.1. İç Çözüm:</strong> Kullanıcılar arası uyuşmazlıklar öncelikle Platform'un destek ekibi aracılığıyla çözülmeye çalışılır.</p>
        
        <p><strong>7.2. Yasal Süreç:</strong> İç çözüm sağlanamazsa, taraflar yasal haklarını saklı tutar. Uyuşmazlıkların çözümünde İstanbul Merkez (Çağlayan) Mahkemeleri ve İcra Daireleri yetkilidir.</p>
        
        <p><strong>7.3. Tüketici Hakları:</strong> Tüketici sıfatını haiz kullanıcılar, Tüketici Hakem Heyetleri ve Tüketici Mahkemelerine başvurabilir.</p>
      </div>
    </section>

    <section>
      <h4 className="text-sm md:text-base font-bold text-gray-900 mb-3">8. DEĞİŞİKLİK VE GÜNCELLEME</h4>
      <p className="text-xs md:text-sm">
        Platform, kullanım koşullarında değişiklik yapma hakkını saklı tutar. Önemli değişiklikler e-posta veya platform bildirimi ile kullanıcılara duyurulur. Değişiklikler yayınlandıktan sonra platformu kullanmaya devam eden kullanıcılar, yeni koşulları kabul etmiş sayılır.
      </p>
    </section>

    <section>
      <h4 className="text-sm md:text-base font-bold text-gray-900 mb-3">9. YÜRÜRLÜK</h4>
      <p className="text-xs md:text-sm">
        İşbu kullanım koşulları, kullanıcının Platform'a kayıt olması ile yürürlüğe girer ve üyelik devam ettiği sürece geçerlidir.
      </p>
    </section>

    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 md:p-6 mt-6">
      <p className="text-xs md:text-sm text-gray-600 font-medium">
        <strong>İletişim:</strong> Kullanım koşulları hakkında sorularınız için <a href="mailto:info@biharclik.com" className="text-blue-600 hover:underline">info@biharclik.com</a> adresinden bize ulaşabilirsiniz.
      </p>
    </div>
  </div>
);





