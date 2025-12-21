import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { deliveryService } from '../../services/deliveryService';

// Header Bileşeni
import { ModernHeader } from '../common/ModernHeader';

// YENİ: Ortak Modal Bileşeni
import { StatusModal } from '../../components/common/ActionModals';

import { 
  BiArrowBack, 
  BiFilter, 
  BiSearch, 
  BiCalendar, 
  BiMoney, 
  BiPackage, 
  BiMap, 
  BiX,
  BiCheckCircle,
  BiTimeFive,
  BiXCircle,
  BiPhone
} from 'react-icons/bi';

export const StudentHistoryPage = () => {
  const navigate = useNavigate();
  
  // Veri State'leri
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // UI State'leri
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false); // İsim karışıklığını önlemek için showModal -> showDetailModal
  const [showFilters, setShowFilters] = useState(false); 

  // Popup State'i
  const [popup, setPopup] = useState({ isOpen: false, type: 'success', title: '', message: '' });

  // Filtreler
  const [filters, setFilters] = useState({
    status: '',
    dateFrom: '',
    dateTo: '',
    minAmount: '',
    maxAmount: '',
  });

  // İstatistikler
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    totalEarnings: 0,
  });

  useEffect(() => {
    fetchHistory();
  }, [filters]);

  // Helper: Popup Göster
  const showStatus = (type, title, message) => {
    setPopup({ isOpen: true, type, title, message });
  };

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await deliveryService.getMyJobs();
      const jobsData = response.data.data?.jobs || response.data.jobs || response.data.deliveries || [];
      
      // Filtreleme Mantığı
      let filtered = jobsData.filter(job => {
        if (filters.status && job.status !== filters.status) return false;
        if (filters.dateFrom && new Date(job.created_at) < new Date(filters.dateFrom)) return false;
        if (filters.dateTo && new Date(job.created_at) > new Date(filters.dateTo)) return false;
        if (filters.minAmount && parseFloat(job.payment_amount || 0) < parseFloat(filters.minAmount)) return false;
        if (filters.maxAmount && parseFloat(job.payment_amount || 0) > parseFloat(filters.maxAmount)) return false;
        return true;
      });

      // Yeniden Eskiye Sıralama
      filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      setDeliveries(filtered);

      // İstatistikleri hesapla
      const completedJobs = filtered.filter(j => j.status === 'completed');
      const totalEarnings = completedJobs.reduce((sum, j) => sum + parseFloat(j.payment_amount || 0), 0);
      
      setStats({
        total: filtered.length,
        completed: completedJobs.length,
        totalEarnings: totalEarnings,
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Geçmiş yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (deliveryId) => {
    try {
      const response = await deliveryService.getDeliveryDetail(deliveryId);
      const deliveryData = response.data.data || response.data;
      setSelectedDelivery(deliveryData);
      setShowDetailModal(true);
    } catch (err) {
      // Alert yerine modern popup kullanıyoruz
      showStatus('error', 'Hata', err.response?.data?.message || 'Detay yüklenemedi');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(amount || 0);
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: { bg: 'bg-amber-100', text: 'text-amber-800', icon: <BiTimeFive /> },
      accepted: { bg: 'bg-blue-100', text: 'text-blue-800', icon: <BiCheckCircle /> },
      in_progress: { bg: 'bg-indigo-100', text: 'text-indigo-800', icon: <BiMap /> },
      completed: { bg: 'bg-emerald-100', text: 'text-emerald-800', icon: <BiCheckCircle /> },
      cancelled: { bg: 'bg-red-100', text: 'text-red-800', icon: <BiXCircle /> },
    };
    const current = styles[status] || styles.pending;
    
    const labels = {
        pending: 'Beklemede',
        accepted: 'Kabul Edildi',
        in_progress: 'Taşınıyor',
        completed: 'Tamamlandı',
        cancelled: 'İptal',
    };

    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${current.bg} ${current.text}`}>
        {current.icon}
        {labels[status] || status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-yellow-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-20 relative">
      
      {/* --- MODAL ENTEGRASYONU --- */}
      <StatusModal 
        isOpen={popup.isOpen} 
        type={popup.type} 
        title={popup.title} 
        message={popup.message} 
        onClose={() => setPopup({ ...popup, isOpen: false })} 
      />

      {/* --- HEADER --- */}
      <ModernHeader 
        title="Geçmiş İşlemler"
        subtitle={`Toplam ${stats.total} kayıt bulundu`}
        showBackButton={true}
        onBackClick={() => navigate('/student/dashboard')}
        onLogout={() => navigate('/login')} 
      />

      <main className="max-w-7xl mx-auto px-5 pt-6">
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl mb-6 flex items-center gap-3">
            <BiXCircle size={24} />
            {error}
          </div>
        )}

        {/* --- ÜST İSTATİSTİKLER (Grid) --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {/* Toplam Kazanç */}
            <div className="bg-yellow-400 p-5 rounded-3xl shadow-lg shadow-yellow-200 relative overflow-hidden">
                <div className="relative z-10">
                    <p className="text-sm font-bold text-gray-800 opacity-80 mb-1">Toplam Kazanç</p>
                    <p className="text-3xl font-black text-gray-900">{formatCurrency(stats.totalEarnings)}</p>
                </div>
                <BiMoney className="absolute -bottom-4 -right-4 text-yellow-500 opacity-50 w-24 h-24" />
            </div>

            {/* Tamamlanan */}
            <div className="bg-gray-900 p-5 rounded-3xl shadow-lg text-white relative overflow-hidden">
                <div className="relative z-10">
                    <p className="text-sm font-bold text-gray-400 mb-1">Başarılı Teslimat</p>
                    <p className="text-3xl font-black">{stats.completed}</p>
                </div>
                <BiCheckCircle className="absolute -bottom-4 -right-4 text-gray-700 opacity-50 w-24 h-24" />
            </div>

             {/* Toplam İş */}
             <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden">
                <div className="relative z-10">
                    <p className="text-sm font-bold text-gray-500 mb-1">Toplam İş Kaydı</p>
                    <p className="text-3xl font-black text-gray-900">{stats.total}</p>
                </div>
                <BiPackage className="absolute -bottom-4 -right-4 text-gray-100 w-24 h-24" />
            </div>
        </div>

        {/* --- FİLTRE ALANI --- */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 mb-6">
            <div 
                className="flex justify-between items-center cursor-pointer md:cursor-default"
                onClick={() => setShowFilters(!showFilters)}
            >
                <div className="flex items-center gap-2 text-gray-900 font-bold">
                    <BiFilter size={20} />
                    <span>Filtreleme Seçenekleri</span>
                </div>
                <div className="md:hidden text-gray-400 font-medium text-sm">
                    {showFilters ? 'Gizle' : 'Göster'}
                </div>
            </div>

            <div className={`mt-4 grid grid-cols-1 md:grid-cols-5 gap-4 ${showFilters ? 'block' : 'hidden md:grid'}`}>
                 {/* Filtre Inputları - Aynı Kaldı */}
                 <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Durum</label>
                    <select
                        className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-yellow-400 focus:border-yellow-400 block p-2.5 font-medium"
                        value={filters.status}
                        onChange={(e) => setFilters({...filters, status: e.target.value})}
                    >
                        <option value="">Tümü</option>
                        <option value="completed">Tamamlandı</option>
                        <option value="accepted">Kabul Edildi</option>
                        <option value="cancelled">İptal</option>
                    </select>
                 </div>
                 
                 <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Başlangıç</label>
                    <input
                        type="date"
                        className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-yellow-400 focus:border-yellow-400 block p-2.5"
                        value={filters.dateFrom}
                        onChange={(e) => setFilters({...filters, dateFrom: e.target.value})}
                    />
                 </div>
                 <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Bitiş</label>
                    <input
                        type="date"
                        className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-yellow-400 focus:border-yellow-400 block p-2.5"
                        value={filters.dateTo}
                        onChange={(e) => setFilters({...filters, dateTo: e.target.value})}
                    />
                 </div>

                 <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Min Tutar (₺)</label>
                    <input
                        type="number"
                        placeholder="0"
                        className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-yellow-400 focus:border-yellow-400 block p-2.5"
                        value={filters.minAmount}
                        onChange={(e) => setFilters({...filters, minAmount: e.target.value})}
                    />
                 </div>
                 <div className="flex items-end">
                    <button
                        onClick={() => setFilters({status: '', dateFrom: '', dateTo: '', minAmount: '', maxAmount: ''})}
                        className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold rounded-xl transition text-sm"
                    >
                        Temizle
                    </button>
                 </div>
            </div>
        </div>

        {/* --- LİSTE GÖRÜNÜMÜ --- */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          {deliveries.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BiSearch size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Kayıt Bulunamadı</h3>
              <p className="text-gray-500">Seçili kriterlere uygun işlem geçmişi yok.</p>
            </div>
          ) : (
            <>
                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Sipariş No</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Tarih</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Güzergah</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Tutar</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Durum</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">İşlem</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                        {deliveries.map((delivery) => (
                            <tr key={delivery.id} className="hover:bg-gray-50 transition-colors group">
                            <td className="px-6 py-4 font-mono text-sm font-medium text-gray-600">#{delivery.order_number}</td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                                {new Date(delivery.created_at).toLocaleDateString('tr-TR')}
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold text-gray-900">{delivery.pickup_district}</span>
                                    <span className="text-xs text-gray-400">↓</span>
                                    <span className="text-sm font-bold text-gray-900">{delivery.delivery_district}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-sm font-black text-gray-900">
                                {formatCurrency(delivery.payment_amount)}
                            </td>
                            <td className="px-6 py-4">
                                {getStatusBadge(delivery.status)}
                            </td>
                            <td className="px-6 py-4">
                                <button
                                onClick={() => handleViewDetails(delivery.id)}
                                className="text-gray-400 hover:text-gray-900 font-bold text-sm flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                                >
                                Detay <BiArrowBack className="rotate-180" />
                                </button>
                            </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden divide-y divide-gray-100">
                    {deliveries.map((delivery) => (
                         <div key={delivery.id} className="p-5 active:bg-gray-50" onClick={() => handleViewDetails(delivery.id)}>
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <span className="font-mono text-xs text-gray-400">#{delivery.order_number}</span>
                                    <h3 className="font-bold text-gray-900 text-lg">{formatCurrency(delivery.payment_amount)}</h3>
                                </div>
                                {getStatusBadge(delivery.status)}
                            </div>
                            
                            <div className="border-l-2 border-dashed border-gray-200 ml-1 pl-3 space-y-3 my-3">
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase">Nereden</p>
                                    <p className="text-sm font-medium text-gray-900 line-clamp-1">{delivery.pickup_district}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase">Nereye</p>
                                    <p className="text-sm font-medium text-gray-900 line-clamp-1">{delivery.delivery_district}</p>
                                </div>
                            </div>

                            <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-50">
                                <span className="text-xs text-gray-500 flex items-center gap-1">
                                    <BiCalendar /> {new Date(delivery.created_at).toLocaleDateString('tr-TR')}
                                </span>
                                <button className="text-sm font-bold text-gray-900">İncele →</button>
                            </div>
                         </div>
                    ))}
                </div>
            </>
          )}
        </div>
      </main>

      {/* --- DETAY MODAL --- */}
      {showDetailModal && selectedDelivery && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
                <div>
                    <h2 className="text-xl font-black text-gray-900">Sipariş Detayı</h2>
                    <p className="font-mono text-sm text-gray-500">#{selectedDelivery.order_number}</p>
                </div>
                <button 
                    onClick={() => setShowDetailModal(false)}
                    className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition"
                >
                    <BiX size={24} />
                </button>
            </div>

            <div className="p-6 space-y-6">
                {/* Durum ve Tutar */}
                <div className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl">
                    <div>
                        <p className="text-xs font-bold text-gray-500 uppercase mb-1">Durum</p>
                        {getStatusBadge(selectedDelivery.status)}
                    </div>
                    <div className="text-right">
                        <p className="text-xs font-bold text-gray-500 uppercase mb-1">Tutar</p>
                        <p className="text-2xl font-black text-gray-900">{formatCurrency(selectedDelivery.payment_amount)}</p>
                    </div>
                </div>

                {/* Rota */}
                <div className="space-y-4">
                     <div className="relative pl-6 border-l-2 border-gray-200 ml-2">
                        {/* Alış */}
                        <div className="mb-6 relative">
                            <span className="absolute -left-[31px] top-1 w-4 h-4 bg-white border-4 border-yellow-500 rounded-full"></span>
                            <p className="text-xs font-bold text-gray-400 uppercase">Alış Adresi</p>
                            <p className="font-bold text-gray-900">{selectedDelivery.pickup_district}</p>
                            <p className="text-sm text-gray-600">{selectedDelivery.pickup_address}</p>
                        </div>
                        {/* Teslim */}
                        <div className="relative">
                            <span className="absolute -left-[31px] top-1 w-4 h-4 bg-gray-900 border-2 border-gray-900 rounded-full"></span>
                            <p className="text-xs font-bold text-gray-400 uppercase">Teslim Adresi</p>
                            <p className="font-bold text-gray-900">{selectedDelivery.delivery_district}</p>
                            <p className="text-sm text-gray-600">{selectedDelivery.delivery_address}</p>
                        </div>
                     </div>
                </div>

                {/* Gönderici İletişim Bilgileri */}
                <div className="bg-white p-4 rounded-2xl border border-gray-200">
                  <div className="flex items-start gap-3">
                    <div className="bg-yellow-100 p-2 rounded-lg text-yellow-700 shadow-sm">
                      <BiPhone size={20} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-gray-900 mb-2">Gönderici İletişim</p>
                      
                      {/* Telefon */}
                      {selectedDelivery.sender_phone && (
                        <a 
                          href={`tel:${selectedDelivery.sender_phone}`}
                          className="flex items-center gap-2 text-sm text-gray-700 hover:text-yellow-600 font-medium transition group"
                        >
                          <BiPhone className="text-yellow-600 group-hover:scale-110 transition" />
                          <span className="group-hover:underline">{selectedDelivery.sender_phone}</span>
                        </a>
                      )}
                      {!selectedDelivery.sender_phone && (
                        <p className="text-xs text-gray-400 italic">Telefon bilgisi mevcut değil</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Paket Bilgileri */}
                <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
                    <div className="flex items-start gap-3">
                        <div className="bg-white p-2 rounded-lg text-blue-600 shadow-sm">
                            <BiPackage size={20} />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-blue-900 mb-0.5">Paket İçeriği</p>
                            <p className="text-sm text-blue-800 leading-relaxed">
                                {selectedDelivery.package_description || 'Belirtilmemiş'}
                            </p>
                        </div>
                    </div>
                </div>

                 {/* Notlar */}
                 {selectedDelivery.notes && (
                    <div>
                        <p className="text-xs font-bold text-gray-500 uppercase mb-2">Müşteri Notu</p>
                        <p className="text-sm text-gray-600 italic bg-gray-50 p-3 rounded-xl border border-gray-100">
                            "{selectedDelivery.notes}"
                        </p>
                    </div>
                )}

                <button
                    onClick={() => setShowDetailModal(false)}
                    className="w-full py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-black transition shadow-lg shadow-gray-200"
                >
                    Kapat
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};