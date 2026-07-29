import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Navbar } from '../Navbar';
import { HeroSection } from '../HeroSection';
import { Footer } from '../Footer';
import { WhatsAppButton } from '../../../components/common/WhatsAppButton';


export const KurumsalPage = () => {
  const [activeTab, setActiveTab] = useState('hakkimizda');
  const location = useLocation();

  const tabs = [
    { id: 'hakkimizda', name: 'Hakkımızda' },
    { id: 'teslimat', name: 'Teslimat ve İade' },
    { id: 'gizlilik', name: 'Gizlilik Sözleşmesi' },
    { id: 'satis', name: 'Mesafeli Satış' },
    { id: 'iletisim', name: 'İletişim' },
  ];

  // URL'deki ?tab= parametresini dinleyerek sekmeyi otomatik değiştirir
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tabParam = searchParams.get('tab');
    if (tabParam && tabs.some(t => t.id === tabParam)) {
      setActiveTab(tabParam);
    }
    // Sekme değiştiğinde sayfayı otomatik olarak en yukarı kaydırır
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div className="w-full min-h-screen bg-white flex flex-col">

      {/* ÜST BİLEŞENLER */}
      <Navbar />
      <HeroSection />
      <WhatsAppButton />

      {/* ORTA KURUMSAL ALAN */}
      <div className="w-full flex-1 py-16 px-4 md:px-16 lg:px-44 text-gray-800 flex flex-col items-start">
        <div className="w-full max-w-7xl text-left">

          {/* Sayfa Başlığı */}
          <header className="mb-10 text-left">
            <h1 className="text-xl font-bold text-gray-900 uppercase tracking-wider">
              Kurumsal Bilgiler
            </h1>
            <div className="h-px bg-gray-100 w-16 mt-4" />
          </header>

          {/* Üst Sekme Navigasyonu (Yatay Kaydırılabilir Mobil Uyumlu) */}
          <nav className="w-full flex flex-nowrap overflow-x-auto gap-x-8 gap-y-3 border-b border-gray-100 pb-4 mb-10 justify-start items-center select-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`text-[11px] md:text-xs font-semibold uppercase tracking-wider transition-colors duration-200 relative pb-4 -mb-[17px] whitespace-nowrap shrink-0 ${isActive
                      ? 'text-gray-900 font-bold border-b-2 border-[#FBCF2D]'
                      : 'text-gray-400 hover:text-gray-900'
                    }`}
                >
                  {tab.name}
                </button>
              );
            })}
          </nav>

          {/* Metin İçerikleri */}
          <main className="text-sm leading-relaxed text-gray-600 space-y-8 antialiased text-left max-w-4xl">

            {/* 1. HAKKIMIZDA */}
            {activeTab === 'hakkimizda' && (
              <section className="space-y-6">
                <div>
                  <h2 className="text-base font-bold text-gray-900 mb-2">Biz Kimiz?</h2>
                  <p>
                    biharçlık, İstanbul'un dinamik enerjisini üniversite gençliğinin potansiyeliyle birleştiren yenilikçi bir teknoloji platformudur. Biz bir kargo ya da lojistik firması değiliz; şehir içi kısa mesafeli teslimat ihtiyacı olan göndericiler ile ek gelir elde etmek isteyen üniversite öğrencilerini güvenli, kimlik doğrulamalı bir dijital ortamda buluşturan aracı bir pazar yeriyiz.
                  </p>
                </div>

                <div>
                  <h2 className="text-base font-bold text-gray-900 mb-2">Amacımız ve Vizyonumuz</h2>
                  <p>
                    İstanbul gibi büyük bir metropolde, bireysel veya kurumsal göndericilerin "hızlı, ekonomik ve çevre dostu" teslimat beklentilerine pratik bir çözüm sunuyoruz. Bunu yaparken, geleceğimiz olan üniversite öğrencilerinin ders programlarını aksatmadan, kendi özgür zaman planlamalarıyla yaya kurye olarak ek gelir elde etmelerine imkan sağlıyoruz.
                  </p>
                </div>

                <div>
                  <h2 className="text-base font-bold text-gray-900 mb-2">Güvenlik ve Doğrulama</h2>
                  <p className="mb-3">
                    Platform üzerindeki tüm işlemler kayıt altındadır ve izlenebilirdir. Hizmeti kullanmaya başlamadan önce hem Gönderici hem de Öğrenci Kurye telefon numarası doğrulamasından geçer; Öğrenci Kuryeler ayrıca güncel öğrenci belgesi ve profil fotoğrafı onayı ile sisteme kabul edilir.
                  </p>
                  <p className="mb-3">
                    Her gönderi için, içeriğin yasal ve taşınmaya uygun olduğuna ilişkin bir beyan alınır. Uyuşturucu ve uyarıcı maddeler, ateşli silah ve mühimmat, kaçak veya sahte ürünler, nakit para ve değerli kıymetler, alkol ve tütün ürünleri, canlı hayvanlar ile tehlikeli, yanıcı veya patlayıcı maddeler platform üzerinden taşınamaz.
                  </p>
                  <p className="mb-3">
                    Öğrenci Kuryeler, beyan edilen içerikle uyuşmayan veya şüpheli gördükleri bir gönderiyi teslim almayı reddedebilir ve durumu uygulama üzerinden platforma bildirebilir. Bu bildirimler değerlendirilir; gerekli görülen hallerde ilgili sipariş askıya alınabilir ve kullanıcı hesabı incelemeye alınabilir.
                  </p>
                  <p>
                    Teslimat süreci teslimat boyunca kayıt altına alınır. Tüm kayıtlar, ilgili mevzuat kapsamında yetkili mercilerin usulüne uygun taleplerine yanıt verebilmek amacıyla güvenli şekilde saklanır.
                  </p>
                </div>

                <div>
                  <h2 className="text-base font-bold text-gray-900 mb-4">Neden biharçlık?</h2>
                  <ul className="space-y-3">
                    <li>
                      <strong className="text-gray-900">Öğrenci Odaklı:</strong> Platformumuz, tamamen öğrencilerin bütçelerine katkı sağlamak ve onlara esnek bir çalışma modeli sunmak amacıyla geliştirilmiştir.
                    </li>
                    <li>
                      <strong className="text-gray-900">Hızlı ve Ekonomik:</strong> Yakın mesafeli paketlerinizi, trafiğe takılmayan yaya kuryerimizle en uygun maliyetle ve hızla alıcısına ulaştırıyoruz.
                    </li>
                    <li>
                      <strong className="text-gray-900">Çevre Dostu:</strong> Karbon ayak izi bırakmayan yaya kurye modelimizle, daha temiz ve sürdürülebilir bir İstanbul geleceğine katkıda bulunuyoruz.
                    </li>
                    <li>
                      <strong className="text-gray-900">Şeffaf ve Kayıtlı:</strong> Kimlik doğrulaması yapılmamış kullanıcı veya kayıt altına alınmamış teslimat süreci bulunmaz; her işlem baştan sona izlenebilirdir.
                    </li>
                  </ul>
                </div>

                <p className="pt-4 border-t border-gray-50 font-medium text-gray-900 italic">
                  bi harçlık, dayanışmanın, teknolojinin ve gençliğin gücüyle büyüyen; güvenliği ve şeffaflığı önceliği haline getiren bir topluluk hareketidir!
                </p>
              </section>
            )}

            {/* 2. TESLİMAT VE İADE ŞARTLARI */}
            {activeTab === 'teslimat' && (
              <section className="space-y-6">
                <h2 className="text-base font-bold text-gray-900 uppercase tracking-wide border-b border-gray-50 pb-2">TESLİMAT VE İADE ŞARTLARI</h2>

                <div>
                  <h3 className="font-bold text-gray-900 mb-2">1. Taraflar ve Tanımlar</h3>
                  <p className="mb-2">İşbu sözleşmede;</p>
                  <ul className="space-y-2">
                    <li><strong className="text-gray-950">Platform (biharçlık):</strong> Göndericiler ile öğrenci kuryeleri dijital ortamda bir araya getiren aracı web uygulamasını,</li>
                    <li><strong className="text-gray-950">Gönderici:</strong> Platform üzerinden kısa mesafeli teslimat talebi oluşturan bireysel veya kurumsal kullanıcıyı,</li>
                    <li><strong className="text-gray-950">Öğrenci Kurye:</strong> Platforma kayıtlı olan, kendi nam ve hesabına yaya olarak teslimat hizmeti sunan bağımsız üniversite öğrencisini,</li>
                    <li><strong className="text-gray-950">Gönderi:</strong> Gönderici tarafından kuryeye teslim edilen, hukuka ve taşınma şartlarına uygun paket/evrakı ifade eder.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-gray-900 mb-2">2. Platformun Hukuki Statüsü ve Sorumsuzluk Beyanı</h3>
                  <p className="mb-3">bi harçlık, bir kargo şirketi, lojistik firması, kurye acentesi veya taşımacı değildir.</p>
                  <p className="mb-3">Platform, yalnızca Gönderici ile Öğrenci Kurye'yi bir araya getiren, 6563 sayılı Elektronik Ticaretin Düzenlenmesi Hakkında Kanun uyarınca bir "Aracı Hizmet Sağlayıcı"dır.</p>
                  <p>bi harçlık, platform üzerinden anlaşılan taşıma ilişkisinin bir tarafı değildir. Bu nedenle; gönderinin gecikmesi, kaybolması, çalınması, hasar görmesi, kırılması veya içeriğinin eksilmesi gibi durumlarda platformun hiçbir hukuki, cezai veya mali sorumluluğu bulunmamaktadır. Tüm sorumluluk hukuken taşıma ilişkisinin taraflarına (Gönderici ve Öğrenci Kurye) aittir.</p>
                </div>

                <div>
                  <h3 className="font-bold text-gray-900 mb-2">3. Teslimat Şartları ve Yasaklar</h3>
                  <ul className="space-y-3">
                    <li><strong className="text-gray-900">Taşıma İlişkisi:</strong> Teslimat süreci, Öğrenci Kurye'nin Gönderici'den paketi fiziksel olarak teslim almasıyla başlar ve alıcıya ulaştırmasıyla son bulur.</li>
                    <li><strong className="text-gray-900">İçerik Beyanı:</strong> Gönderici, sipariş oluştururken paketin içeriğini doğru ve eksiksiz beyan etmekle yükümlüdür. Bu beyan, teslimat sürecinin kayıtlı bir parçasıdır.</li>
                    <li><strong className="text-gray-900">Yasaklı Gönderiler:</strong> Uyuşturucu ve uyarıcı maddeler, ateşli silah ve mühimmat, kaçak veya sahte ürünler, nakit para ve değerli kıymetler, alkol ve tütün ürünleri, canlı hayvanlar, yanıcı/patlayıcı/parlayıcı maddeler ve taşınması lisansa tabi olan hiçbir madde platform aracılığıyla taşınamaz. Gönderici, paketin içeriğinin yasalara uygun olduğunu taahhüt eder. İçerik nedeniyle doğabilecek her türlü idari ve cezai sorumluluk Gönderici'ye aittir.</li>
                    <li><strong className="text-gray-900">Kontrol ve Bildirim Yükümlülüğü:</strong> Gönderici, paketi kuryeye güvenli ve korunaklı bir şekilde, içeriğine ilişkin doğru beyanla teslim etmekle; Öğrenci Kurye ise teslim aldığı paketi makul bir özenle taşımakla yükümlüdür. Platform, gönderi içeriklerinin Gönderici beyanına uygunluğunu fiziksel olarak denetlemekle yükümlü olmamakla birlikte, Öğrenci Kurye veya üçüncü kişiler tarafından bildirilen şüpheli durumları değerlendirme, ilgili siparişi askıya alma, ilgili hesabı inceleme ve gerekli hallerde yetkili mercilere bildirimde bulunma hakkını saklı tutar.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-gray-900 mb-2">4. İptal ve Ücret İade Şartları</h3>
                  <p className="mb-3">Platform üzerinden oluşturulan teslimat taleplerine ilişkin iptal ve iade koşulları şu şekildedir:</p>
                  <ul className="space-y-3">
                    <li><strong className="text-gray-900">• Kurye Atanmadan Önce İptal:</strong> Gönderici, oluşturduğu teslimat talebine henüz bir Öğrenci Kurye atanmamışsa, talebi panel üzerinden ücretsiz olarak iptal edebilir. Bu durumda tahsil edilen tutarın tamamı (varsa banka komisyonları hariç) Gönderici'nin kartına iade edilir.</li>
                    <li><strong className="text-gray-900">• Kurye Atandıktan Sonra İptal:</strong> Bir Öğrenci Kurye talebi kabul edip teslimat noktasına doğru harekete geçtikten sonra Gönderici tarafından yapılan iptallerde, kuryenin emeğini korumak adına iade yapılmaz veya platform tarafından belirlenen minimum bir "Hizmet/Yol Bedeli" kesilerek kalan tutar iade edilir.</li>
                    <li><strong className="text-gray-900">• Teslimatın Gerçekleşememesi Durumu:</strong> Alıcının adreste bulunamaması, yanlış adres verilmesi veya alıcının gönderiyi kabul etmemesi durumlarında teslimat başarısız sayılır. Bu durumda ücret iadesi yapılmaz. Gönderinin çıkış noktasına geri getirilmesi talebi, yeni bir teslimat işlemine ve ücrete tabidir.</li>
                    <li><strong className="text-gray-900">• Hizmet Kusurlarında İade:</strong> Gönderici ile Öğrenci Kurye arasında teslimatın süresi veya şekliyle ilgili yaşanabilecek uyuşmazlıklarda (örneğin geç teslimat), platform bir taşımacılık taahhüdünde bulunmadığı için ücret iade garantisi vermez.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-gray-900 mb-2">5. Mücbir Sebepler</h3>
                  <p>Hava muhalefeti (aşırı yağış, fırtına vb.), İstanbul trafiğindeki olağanüstü aksamalar, toplu taşıma grevleri, doğal afetler veya teknik altyapı kesintileri gibi mücbir sebeplerden ötürü teslimatların gecikmesi veya iptal olması durumunda biharçlık veya bağımsız Öğrenci Kurye sorumlu tutulamaz.</p>
                </div>
              </section>
            )}

            {/* 3. GİZLİLİK SÖZLEŞMESİ VE POLİTİKASI */}
            {activeTab === 'gizlilik' && (
              <section className="space-y-6">
                <h2 className="text-base font-bold text-gray-900 uppercase tracking-wide border-b border-gray-50 pb-2">GİZLİLİK SÖZLEŞMESİ VE POLİTİKASI</h2>
                <p>biharçlık, platformumuzu ziyaret eden veya kullanan tüm kullanıcılarımızın (Gönderici ve Öğrenci Kurye) gizliliğini korumayı ve kişisel verilerin güvenliğini sağlamayı taahhüt eder. İşbu Gizlilik Sözleşmesi, hangi verilerin toplandığını, nasıl kullanıldığını ve bu verilere ilişkin haklarınızı açıklamaktadır.</p>
                <p className="font-medium text-gray-900">Platformu kullanarak, işbu sözleşmede belirtilen uygulamaları kabul etmiş sayılır her bir kullanıcı.</p>

                <div>
                  <h3 className="font-bold text-gray-900 mb-2">1. Toplanan Veriler ve Toplanma Yöntemleri</h3>
                  <p className="mb-3">Platform, hizmetlerin sağlıklı bir şekilde yürütülebilmesi, tarafların bir araya getirilmesi ve güvenlik amacıyla aşağıdaki verileri toplar:</p>
                  <ul className="space-y-3">
                    <li><strong className="text-gray-900">• Kimlik ve İletişim Bilgileri:</strong> Ad-soyad, e-posta adresi, telefon numarası.</li>
                    <li><strong className="text-gray-900">• Öğrenci Kurye Doğrulama Bilgileri:</strong> Üniversite öğrencisi olunduğunu kanıtlayan öğrenci belgesi, profil fotoğrafı ve kurye doğrulama süreçleri için gerekli temel belgeler.</li>
                    <li><strong className="text-gray-900">• Finansal Bilgiler:</strong> Göndericilerin ödeme yapabilmesi için kullanılan kart bilgileri (Bu bilgiler doğrudan BDDK onaylı lisanslı ödeme kuruluşu altyapısında saklanır, bi harçlık sunucularında tutulmaz). Öğrenci Kuryelerin kazanç aktarımları için IBAN ve banka hesap bilgileri.</li>
                    <li><strong className="text-gray-900">• Kullanım ve Teknik Veriler:</strong> Platforma giriş yapılan cihaz bilgileri, IP adresi, tarayıcı türü ve çerezler (cookies) aracılığıyla toplanan analitik veriler.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-gray-900 mb-2">2. Verilerin Kullanım Amaçları</h3>
                  <p className="mb-2">Toplanan kişisel veriler yalnızca aşağıdaki amaçlar doğrultusunda işlenir:</p>
                  <ul className="list-disc pl-5 space-y-1.5">
                    <li>Gönderici ile Öğrenci Kurye arasında köprü oluşturmak ve kısa mesafeli teslimat sürecini teknik olarak yürütmek,</li>
                    <li>Platform içi güvenliği sağlamak, kimlik doğrulamasını yürütmek ve sahte/kötü niyetli üyelikleri engellemek,</li>
                    <li>Ödemelerin güvenli bir şekilde tahsil edilmesini ve Öğrenci Kuryelerin kazançlarının ilgili hesaplara aktarılmasını koordine etmek,</li>
                    <li>Sistem performansını analiz etmek, kullanıcı deneyimini iyileştirmek ve teknik aksaklıkları gidermek,</li>
                    <li>Yasal mevzuattan kaynaklanan bilgi paylaşımı ve resmi kurumların taleplerini yerine getirmek.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-gray-900 mb-2">3. Üçüncü Taraflarla Veri Paylaşımı ve Sorumluluk Sınırı</h3>
                  <p className="mb-3"><strong className="text-gray-900">Hizmetin Doğası Gereği Paylaşım:</strong> Teslimatın gerçekleşebilmesi adına, Gönderici'nin ad-soyad, adres ve telefon bilgileri ilgili Öğrenci Kurye ile; kuryenin ad-soyad, profil fotoğrafı ise Gönderici ile yalnızca ilgili teslimat süresince paylaşılır.</p>
                  <p className="mb-3"><strong className="text-gray-900">Platform Dışı Kullanım Sorumsuzluğu:</strong> Taraflar (Gönderici ve Öğrenci Kurye), teslimat vesilesiyle öğrendikleri kişisel verileri (isim, telefon, adres vb.) yalnızca teslimatın tamamlanması amacıyla kullanabilirler. Teslimat bittikten sonra bu verilerin taraflarca kaydedilmesi, arşivlenmesi, üçüncü şahıslara verilmesi veya taciz/reklam vb. amaçlarla kullanılması durumunda doğacak tüm hukuki ve cezai sorumluluk veriyi kötüye kullanan tarafa aittir; biharçlık bu durumlardan sorumlu tutulamaz.</p>
                  <p><strong className="text-gray-900">Yasal Zorunluluklar:</strong> Hukuki uyuşmazlıklarda veya resmi makamların (Emniyet, Mahkemeler vb.) usulüne uygun taleplerinde veriler yasal sınırlar dahilinde resmi mercilerle paylaşılır.</p>
                </div>

                <div>
                  <h3 className="font-bold text-gray-900 mb-2">4. Veri Güvenliği ve Saklama Süresi</h3>
                  <p className="mb-3">biharçlık, verilerinizin kaybolmasını, kötüye kullanılmasını veya yetkisiz erişimini engellemek için endüstri standardı güvenlik önlemleri (SSL sertifikaları, şifrelenmiş veri tabanları ve güvenli sunucu altyapıları) kullanır.</p>
                  <p>Kişisel verileriniz, platformdaki üyeliğiniz devam ettiği sürece ve üyeliğiniz sona erdikten sonra dahi yasal saklama süreleri (mali kayıtlar, hukuki zamanaşımları vb.) boyunca güvenli bir şekilde arşivlenir ve bu süre sonunda imha edilir.</p>
                </div>

                <div>
                  <h3 className="font-bold text-gray-900 mb-2">5. Çerezler (Cookies)</h3>
                  <p>Web uygulamamız, kullanıcı deneyiminizi kişiselleştirmek, oturumunuzu açık tutmak ve platform trafiğini analiz etmek amacıyla çerezler kullanmaktadır. Tarayıcı ayarlarınızdan çerez tercihlerinizi değiştirebilirsiniz; ancak çerezlerin kapatılması durumunda platformun bazı fonksiyonları düzgün çalışmayabilir.</p>
                </div>

                <div>
                  <h3 className="font-bold text-gray-900 mb-2">6. Kullanıcı Hakları (KVKK Kapsamında)</h3>
                  <p>6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) uyarınca platformumuza başvurarak; verilerinizin işlenip işlenmediğini öğrenme, işlenmişse bilgi talep etme, işlenme amacına uygun kullanılıp kullanılmadığını öğrenme, eksik veya yanlış işlenmişse düzeltilmesini isteme ve verilerinizin silinmesini (hesabınızın kapatılmasıyla birlikte) talep etme haklarına sahipsiniz.</p>
                </div>

                <div>
                  <h3 className="font-bold text-gray-900 mb-2">7. Değişiklikler ve Yürürlük</h3>
                  <p>biharçlık, işbu Gizlilik Sözleşmesi'ni platformun dinamiklerine veya değişen yasal mevzuatlara göre güncelleme hakkını saklı tutar. Yapılan güncellemeler web sitesinde yayınlandığı andan itibaren yürürlüğe girer.</p>
                </div>
              </section>
            )}

            {/* 4. MESAFELİ SATIŞ SÖZLEŞMESİ */}
            {activeTab === 'satis' && (
              <section className="space-y-6">
                <h2 className="text-base font-bold text-gray-900 uppercase tracking-wide border-b border-gray-50 pb-2">MESAFELİ SATIŞ SÖZLEŞMESİ</h2>

                <div>
                  <h3 className="font-bold text-gray-900 mb-2">1. Taraflar</h3>
                  <div className="space-y-2">
                    <p><strong className="text-gray-900">1.1. Hizmet Sağlayıcı (Aracı Hizmet Sağlayıcı)</strong></p>
                    <p>
                      Ticari Marka / Platform Adı: biharçlık<br />
                      Web Adresi: biharclik.com<br />
                      E-posta: info@biharclik.com<br />
                      Adres: YAVUZTÜRK MAH. SÜTÇÜYOLU SK. NO: 40 İÇ KAPI NO: 4  ÜSKÜDAR/ İSTANBUL</p>

                    <p><strong className="text-gray-900">1.2. Alıcı (Gönderici / Tüketici)</strong></p>
                    <p>Platform üzerinden kısa mesafeli teslimat hizmeti siparişi veren, üyelik bilgileri ve faturada yer alan ad, soyad, adres ve iletişim bilgilerine sahip kullanıcıdır (Bundan sonra "Gönderici" olarak anılacaktır).</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-gray-900 mb-2">2. Sözleşmenin Konusu ve Kapsamı</h3>
                  <p>İşbu Sözleşme'nin konusu; Gönderici'nin, Platform'a ait web uygulaması üzerinden elektronik ortamda siparişini verdiği, aşağıda nitelikleri ve hizmet bedeli belirtilen "Aracılık ve Yakın Mesafe Teslimat Eşleştirme Hizmeti"nin satışı ve ifası ile ilgili olarak 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği hükümleri uyarınca tarafların hak ve yükümlülüklerinin belirlenmesidir.</p>
                </div>

                <div>
                  <h3 className="font-bold text-gray-900 mb-2">3. Hizmetin Niteliği ve Ödeme Bilgileri</h3>
                  <ul className="space-y-2">
                    <li><strong className="text-gray-900">• Hizmetin Tanımı:</strong> Gönderici tarafından sisteme girilen paketin/gönderinin, yaya Öğrenci Kurye ile eşleştirilerek alıcı adresine ulaştırılmasına aracılık edilmesi hizmetidir.</li>
                    <li><strong className="text-gray-900">• Hizmet Bedeli:</strong> Sipariş anında Gönderici'ye panelde gösterilen ve onaylanan, vergiler dahil toplam teslimat tutarıdır.</li>
                    <li><strong className="text-gray-900">• Ödeme Şekli:</strong> Kredi Kartı / Banka Kartı (Lisanslı ödeme kuruluşu altyapısı ile tahsil edilir).</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-gray-900 mb-2">4. Platformun Rolü ve Sorumsuzluk Beyanı</h3>
                  <p>biharçlık, 6563 sayılı Elektronik Ticaretin Düzenlenmesi Hakkında Kanun uyarınca bir Aracı Hizmet Sağlayıcıdır. Platform, bağımsız Öğrenci Kuryeler ile Göndericileri bir araya getiren bir pazar yeri (marketplace) modelidir. Fiziksel taşıma faaliyeti doğrudan bağımsız Öğrenci Kurye tarafından gerçekleştirildiğinden; taşıma esnasında meydana gelebilecek paket hasarları, kayıplar, gecikmeler veya kurye davranışlarından doğabilecek zararlardan Platform doğrudan veya dolaylı olarak sorumlu tutulamaz. Gönderici, bu sözleşmeyi onaylayarak taşımacılık hizmetinin asıl muhatabının Öğrenci Kurye olduğunu kabul eder.</p>
                </div>

                <div>
                  <h3 className="font-bold text-gray-900 mb-2">5. İfa, İptal ve İade Koşulları</h3>
                  <ul className="space-y-3">
                    <li><strong className="text-gray-900">• Hizmetin Başlaması:</strong> Gönderici'nin talebi onaylandığı ve sisteme bir Öğrenci Kurye atandığı an hizmet fiilen ifa edilmeye başlanmış sayılır.</li>
                    <li><strong className="text-gray-900">• Kurye Atanmadan Önce İptal:</strong> Gönderici, henüz bir kurye eşleşmesi gerçekleşmeden siparişi iptal ederse, ücretin tamamı kartına iade edilir.</li>
                    <li><strong className="text-gray-900">• Kurye Atandıktan Sonra İptal:</strong> Siparişe bir Öğrenci Kurye atandıktan ve kurye teslimat noktasına yöneldikten sonra yapılacak iptallerde, kuryenin emeği ve zaman kaybı gözetilerek ücret iadesi yapılmaz veya platformca belirlenen minimum hizmet/yol bedeli kesilerek kalan tutar iade edilir.</li>
                    <li><strong className="text-gray-900">• Adreste Bulunamama / Hatalı Adres:</strong> Alıcının adreste bulunamaması veya Gönderici'nin hatalı adres beyan etmesi nedeniyle teslimatın tamamlanamaması durumunda hizmet kusursuz ifa edilmiş sayılır ve ücret iadesi yapılmaz.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-gray-900 mb-2">6. Cayma Hakkının İstisnası</h3>
                  <p>6 Mart 2015 tarihli Mesafeli Sözleşmeler Yönetmeliği'nin "Cayma Hakkının İstisnaları" başlıklı 15. maddesinin (g) bendi uyarınca; "Belirli bir tarihte veya dönemde yapılması gereken, konaklama, eşya taşıma, araç kiralama, yiyecek-içecek tedariki ve eğlence veya dinlenme amacıyla yapılan boş zamanın değerlendirilmesine ilişkin sözleşmelerde" Tüketici cayma hakkını kullanamaz. Anlık ve kısa mesafeli kurye/eşya taşıma niteliğindeki bu hizmet, cayma hakkının istisnası kapsamında olduğundan, hizmet siparişi verildikten ve kurye atandıktan sonra Gönderici'nin "hizmetten caydım" diyerek şartsız ücret iadesi talep etme hakkı bulunmamaktadır.</p>
                </div>

                <div>
                  <h3 className="font-bold text-gray-900 mb-2">7. Genel Hükümler</h3>
                  <p className="mb-3">Gönderici, Platform üzerinde sözleşme konusu hizmetin temel nitelikleri, satış fiyatı ve ödeme şekli ile teslimata ilişkin ön bilgileri okup bilgi sahibi olduğunu ve elektronik ortamda gerekli teyidi verdiğini kabul eder.</p>
                  <p>Platform, mücbir sebepler (hava muhalefeti, sistem kesintileri, doğal afetler vb.) nedeniyle hizmetin ifa edilememesi durumunda durumu Gönderici'ye bildirmekle yükümlüdür. Bu durumda Gönderici siparişin iptal edilmesini seçebilir ve ücret iade edilir.</p>
                </div>

                <div>
                  <h3 className="font-bold text-gray-900 mb-2">8. Uyuşmazlıkların Çözümü</h3>
                  <p>İşbu Mesafeli Satış Sözleşmesi'nin uygulanmasında, Sanayi ve Teknoloji Bakanlığı ile Ticaret Bakanlığı tarafından ilan edilen değere kadar Gönderici'nin yerleşim yerindeki Tüketici Hakem Heyetleri ve Tüketici Mahkemeleri yetkilidir.</p>
                </div>

                <div>
                  <h3 className="font-bold text-gray-900 mb-2">9. Yürürlük</h3>
                  <p>Gönderici, Platform üzerinden siparişini onayladığı andan itibaren işbu sözleşmenin tüm şartlarını kabul etmiş sayılır. Sözleşme, siparişin tamamlanması ve hizmetin ifası ile kendiliğinden sona erer.</p>
                </div>
              </section>
            )}

           <div className="space-y-1">
  <h3 className="font-bold text-gray-900">E-Posta Adresi</h3>
  <p className="text-gray-600 hover:text-gray-900 transition-colors">
    <a href="mailto:info@biharclik.com">info@biharclik.com</a>
  </p>
</div>

<div className="space-y-1">
  <h3 className="font-bold text-gray-900">Telefon</h3>
  <p className="text-gray-600 hover:text-gray-900 transition-colors">
    <a href="tel:+905534126034">0553 412 60 34</a>
  </p>
</div>

<div className="space-y-1">
  <h3 className="font-bold text-gray-900">Çalışma Saatleri</h3>
  <p className="text-gray-600">Pazartesi — Pazar: 09:00 - 22:00</p>
</div>

<div className="space-y-1 md:col-span-2">
  <h3 className="font-bold text-gray-900">Kurumsal Adres</h3>
  <p className="text-gray-600">YAVUZTÜRK MAH. SÜTÇÜYOLU SK. NO: 40 İÇ KAPI NO: 4 YOK/ ÜSKÜDAR/ İSTANBUL</p>
</div>
          </main>
        </div>
      </div>

      {/* ALT BİLEŞEN */}
      <Footer />
    </div>
  );
};