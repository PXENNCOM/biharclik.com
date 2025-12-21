import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { deliveryService } from '../../services/deliveryService';
import api from '../../services/api';

// Modern Header
import { ModernHeader } from '../common/ModernHeader';

// YENİ: Ortak Modal Bileşenleri
import { StatusModal, ConfirmModal } from '../../components/common/ActionModals';

// İkonlar
import { 
  BiPackage, 
  BiTimeFive, 
  BiCheckCircle, 
  BiWallet, 
  BiSearch, 
  BiFilterAlt, 
  BiMap, 
  BiUser, 
  BiPhone, 
  BiNavigation,
  BiX,
  BiMoney,
  BiTrendingUp,
  BiShow,
  BiLogoWhatsapp,
  BiErrorCircle
} from 'react-icons/bi';

import { openWhatsApp, WhatsAppTemplates } from '../../utils/whatsapp';

export const AdminDeliveriesPage = () => {
  const navigate = useNavigate();
  
  // Veri State'leri
  const [deliveries, setDeliveries] = useState([]);
  const [filteredDeliveries, setFilteredDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // UI State'leri
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false); // İsim karışıklığını önlemek için showModal -> showDetailModal

  // Modal State'leri
  const [popup, setPopup] = useState({ isOpen: false, type: 'success', title: '', message: '' });
  const [confirmModal, setConfirmModal] = useState({ 
    isOpen: false, 
    title: '', 
    message: '', 
    onConfirm: () => {}, 
  });

  // Filtreler
  const [filters, setFilters] = useState({
    orderNumber: '',
    status: '',
    paymentStatus: '',
    dateFrom: '',
    dateTo: '',
    minAmount: '',
    maxAmount: '',
  });

  // İstatistikler
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    accepted: 0,
    inProgress: 0,
    completed: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    fetchDeliveries();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, deliveries]);

  // Helper: Popup Göster
  const showStatus = (type, title, message) => {
    setPopup({ isOpen: true, type, title, message });
  };

  const applyFilters = () => {
    let filtered = deliveries;

    if (filters.orderNumber) {
      filtered = filtered.filter(d => 
        d.order_number.toLowerCase().includes(filters.orderNumber.toLowerCase())
      );
    }

    if (filters.status) {
      filtered = filtered.filter(d => d.status === filters.status);
    }

    if (filters.paymentStatus) {
      filtered = filtered.filter(d => d.payment_status === filters.paymentStatus);
    }

    if (filters.dateFrom) {
      filtered = filtered.filter(d => new Date(d.created_at) >= new Date(filters.dateFrom));
    }
    if (filters.dateTo) {
      filtered = filtered.filter(d => new Date(d.created_at) <= new Date(filters.dateTo));
    }

    if (filters.minAmount) {
      filtered = filtered.filter(d => parseFloat(d.payment_amount || 0) >= parseFloat(filters.minAmount));
    }
    if (filters.maxAmount) {
      filtered = filtered.filter(d => parseFloat(d.payment_amount || 0) <= parseFloat(filters.maxAmount));
    }

    setFilteredDeliveries(filtered);

    // İstatistikleri hesapla
    const stats = {
      total: filtered.length,
      pending: filtered.filter(d => d.status === 'pending').length,
      accepted: filtered.filter(d => d.status === 'accepted').length,
      inProgress: filtered.filter(d => d.status === 'in_progress').length,
      completed: filtered.filter(d => d.status === 'completed').length,
      totalRevenue: filtered
        .filter(d => d.status === 'completed')
        .reduce((sum, d) => sum + parseFloat(d.payment_amount || 0), 0),
    };
    setStats(stats);
  };

  const clearFilters = () => {
    setFilters({
      orderNumber: '',
      status: '',
      paymentStatus: '',
      dateFrom: '',
      dateTo: '',
      minAmount: '',
      maxAmount: '',
    });
  };

  const fetchDeliveries = async () => {
    try {
      setLoading(true);
      const response = await api.get('/deliveries/admin/all');
      const responseData = response.data.data || response.data;
      const deliveriesData = responseData.deliveries || [];
      
      const transformedDeliveries = deliveriesData.map(delivery => ({
        ...delivery,
        student_name: delivery.student_first_name && delivery.student_last_name
          ? `${delivery.student_first_name} ${delivery.student_last_name}`
          : null
      }));
      
      setDeliveries(transformedDeliveries);
    } catch (err) {
      setError(err.response?.data?.message || 'İşler yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  // WhatsApp Mesaj Gönderme Fonksiyonları
  const sendWhatsAppToSender = (delivery) => {
    if (!delivery.sender_phone) {
      showStatus('error', 'Hata', 'Gönderici telefon numarası bulunamadı!');
      return;
    }

    const message = WhatsAppTemplates.SENDER_COURIER_ASSIGNED(
      delivery.order_number,
      delivery.student_name || 'Kuryeniz',
      formatCurrency(delivery.payment_amount).replace('₺', '').trim(),
      'TR00 0000 0000 0000 0000 0000 00' // IBAN'ı buraya yazın
    );

    openWhatsApp(delivery.sender_phone, message);
  };

  const sendWhatsAppToStudent = (delivery) => {
    if (!delivery.student_phone) {
      showStatus('error', 'Hata', 'Öğrenci telefon numarası bulunamadı!');
      return;
    }

    const message = WhatsAppTemplates.STUDENT_PAYMENT_RECEIVED(
      delivery.order_number,
      delivery.pickup_district,
      delivery.delivery_district,
      formatCurrency(delivery.payment_amount).replace('₺', '').trim()
    );

    openWhatsApp(delivery.student_phone, message);
  };

  const handleViewDetails = async (deliveryId) => {
    try {
      const response = await deliveryService.getDeliveryDetail(deliveryId);
      const deliveryData = response.data.data || response.data;
      
      const transformedData = {
        ...deliveryData,
        student_name: deliveryData.student_first_name && deliveryData.student_last_name
          ? `${deliveryData.student_first_name} ${deliveryData.student_last_name}`
          : null
      };
      
      setSelectedDelivery(transformedData);
      setShowDetailModal(true);
    } catch (err) {
      showStatus('error', 'Hata', err.response?.data?.message || 'Detay yüklenemedi');
    }
  };

  // 1. Gönderici Ödemesi Onayı
  const handleMarkAsPaid = (deliveryId) => {
    setConfirmModal({
      isOpen: true,
      title: 'Ödeme Onayı',
      message: 'Göndericinin ödemeyi yaptığını teyit ediyor musunuz? Bu işlemden sonra öğrenciye bildirim gönderebilirsiniz.',
      confirmText: 'Evet, Onayla',
      onConfirm: () => processMarkAsPaid(deliveryId)
    });
  };

  const processMarkAsPaid = async (deliveryId) => {
    try {
      await api.put(`/deliveries/${deliveryId}/payment`, {
        payment_status: 'sender_paid',
        sender_paid_at: new Date().toISOString()
      });
      
      setConfirmModal(prev => ({ ...prev, isOpen: false }));
      showStatus('success', 'Başarılı', 'Gönderici ödemesi onaylandı!');
      fetchDeliveries();
      setShowDetailModal(false);
    } catch (err) {
      setConfirmModal(prev => ({ ...prev, isOpen: false }));
      showStatus('error', 'Hata', err.response?.data?.message || 'Güncelleme başarısız');
    }
  };

  // 2. Öğrenci Ödemesi Onayı
  const handleMarkAsStudentPaid = (deliveryId) => {
    setConfirmModal({
      isOpen: true,
      title: 'Öğrenci Ödemesi',
      message: 'Öğrenciye hak ediş ödemesini yaptığınızı onaylıyor musunuz?',
      confirmText: 'Evet, Ödendi',
      onConfirm: () => processMarkAsStudentPaid(deliveryId)
    });
  };

  const processMarkAsStudentPaid = async (deliveryId) => {
    try {
      await api.put(`/deliveries/${deliveryId}/payment`, {
        payment_status: 'student_paid',
        student_paid_at: new Date().toISOString()
      });
      
      setConfirmModal(prev => ({ ...prev, isOpen: false }));
      showStatus('success', 'Başarılı', 'Öğrenci ödemesi tamamlandı olarak işaretlendi!');
      fetchDeliveries();
      setShowDetailModal(false);
    } catch (err) {
      setConfirmModal(prev => ({ ...prev, isOpen: false }));
      showStatus('error', 'Hata', err.response?.data?.message || 'Güncelleme başarısız');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(amount || 0);
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: <BiTimeFive /> },
      accepted: { bg: 'bg-blue-100', text: 'text-blue-800', icon: <BiUser /> },
      in_progress: { bg: 'bg-purple-100', text: 'text-purple-800', icon: <BiNavigation /> },
      completed: { bg: 'bg-green-100', text: 'text-green-800', icon: <BiCheckCircle /> },
      cancelled: { bg: 'bg-red-100', text: 'text-red-800', icon: <BiX /> },
    };
    const current = styles[status] || styles.pending;
    
    const labels = {
      pending: 'Bekliyor',
      accepted: 'Kabul Edildi',
      in_progress: 'Taşınıyor',
      completed: 'Tamamlandı',
      cancelled: 'İptal',
    };

    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wide ${current.bg} ${current.text}`}>
        {current.icon}
        {labels[status] || status}
      </span>
    );
  };

  const getPaymentBadge = (status) => {
    const styles = {
      waiting: { bg: 'bg-gray-100', text: 'text-gray-600', label: 'Ödeme Bekliyor' },
      sender_paid: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Gönderici Ödedi' },
      student_paid: { bg: 'bg-green-100', text: 'text-green-800', label: 'Öğrenciye Ödendi' },
    };
    const current = styles[status] || styles.waiting;

    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wide ${current.bg} ${current.text}`}>
        <BiMoney /> {current.label}
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
      
      {/* --- MODALLAR --- */}
      <StatusModal 
        isOpen={popup.isOpen} 
        type={popup.type} 
        title={popup.title} 
        message={popup.message} 
        onClose={() => setPopup({ ...popup, isOpen: false })} 
      />

      <ConfirmModal 
        isOpen={confirmModal.isOpen} 
        title={confirmModal.title} 
        message={confirmModal.message} 
        onConfirm={confirmModal.onConfirm}
        confirmText={confirmModal.confirmText}
        onCancel={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))} 
      />

      {/* Header */}
      <ModernHeader 
        title="İş Yönetimi"
        showBackButton={true}
        onBackClick={() => navigate('/admin/dashboard')}
        onLogout={() => navigate('/login')}
      />

      <main className="max-w-7xl mx-auto px-5 pt-6">
        
        {/* --- İSTATİSTİK KARTLARI --- */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            
            {/* Ciro (Siyah - Hero) */}
            <div className="md:col-span-1 bg-gray-900 p-6 rounded-3xl shadow-lg text-white relative overflow-hidden">
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2 opacity-80">
                        <BiTrendingUp size={20} />
                        <span className="text-sm font-bold uppercase">Toplam Ciro</span>
                    </div>
                    <p className="text-3xl font-black">{formatCurrency(stats.totalRevenue)}</p>
                </div>
            </div>

            {/* Toplam İş (Sarı - Hero) */}
            <div className="md:col-span-1 bg-yellow-400 p-6 rounded-3xl shadow-lg shadow-yellow-200 relative overflow-hidden">
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2 opacity-90 text-gray-900">
                        <BiPackage size={20} />
                        <span className="text-sm font-bold uppercase">Toplam İş</span>
                    </div>
                    <p className="text-3xl font-black text-gray-900">{stats.total}</p>
                </div>
            </div>

            {/* Küçük Özetler */}
            <div className="md:col-span-2 grid grid-cols-4 gap-2">
                <div className="bg-white p-3 rounded-2xl border border-gray-100 text-center flex flex-col justify-center">
                    <p className="text-xs font-bold text-gray-400 uppercase mb-1">Bekleyen</p>
                    <p className="text-xl font-black text-yellow-600">{stats.pending}</p>
                </div>
                <div className="bg-white p-3 rounded-2xl border border-gray-100 text-center flex flex-col justify-center">
                    <p className="text-xs font-bold text-gray-400 uppercase mb-1">Kabul</p>
                    <p className="text-xl font-black text-blue-600">{stats.accepted}</p>
                </div>
                <div className="bg-white p-3 rounded-2xl border border-gray-100 text-center flex flex-col justify-center">
                    <p className="text-xs font-bold text-gray-400 uppercase mb-1">Yolda</p>
                    <p className="text-xl font-black text-purple-600">{stats.inProgress}</p>
                </div>
                <div className="bg-white p-3 rounded-2xl border border-gray-100 text-center flex flex-col justify-center">
                    <p className="text-xs font-bold text-gray-400 uppercase mb-1">Bitti</p>
                    <p className="text-xl font-black text-green-600">{stats.completed}</p>
                </div>
            </div>
        </div>

        {/* --- FİLTRELEME ALANI --- */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 mb-6">
            <div className="flex justify-between items-center mb-4 px-1">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    <BiFilterAlt className="text-gray-500" /> Detaylı Filtreleme
                </h3>
                <button onClick={clearFilters} className="text-sm font-bold text-red-500 hover:text-red-700 transition">
                    Filtreleri Temizle
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Arama */}
                <div className="relative md:col-span-2">
                     <BiSearch className="absolute top-3.5 left-3 text-gray-400 pointer-events-none" size={20} />
                    <input 
                        type="text" 
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-yellow-400 outline-none transition"
                        placeholder="Sipariş No Ara..."
                        value={filters.orderNumber}
                        onChange={(e) => setFilters({...filters, orderNumber: e.target.value})}
                    />
                </div>

                 {/* Durum */}
                 <div className="relative">
                    <select 
                        className="w-full pl-4 pr-8 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-yellow-400 outline-none transition appearance-none"
                        value={filters.status}
                        onChange={(e) => setFilters({...filters, status: e.target.value})}
                    >
                        <option value="">Tüm Durumlar</option>
                        <option value="pending">Bekliyor</option>
                        <option value="accepted">Kabul Edildi</option>
                        <option value="in_progress">Devam Ediyor</option>
                        <option value="completed">Tamamlandı</option>
                        <option value="cancelled">İptal</option>
                    </select>
                    <div className="absolute top-4 right-3 pointer-events-none text-gray-400 text-xs">▼</div>
                </div>

                 {/* Ödeme */}
                 <div className="relative">
                    <select 
                        className="w-full pl-4 pr-8 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-yellow-400 outline-none transition appearance-none"
                        value={filters.paymentStatus}
                        onChange={(e) => setFilters({...filters, paymentStatus: e.target.value})}
                    >
                        <option value="">Tüm Ödemeler</option>
                        <option value="waiting">Bekliyor</option>
                        <option value="sender_paid">Gönderici Ödedi</option>
                        <option value="student_paid">Öğrenciye Ödendi</option>
                    </select>
                    <div className="absolute top-4 right-3 pointer-events-none text-gray-400 text-xs">▼</div>
                </div>
                
                {/* Tarih & Tutar */}
                <div className="grid grid-cols-2 gap-2 md:col-span-2">
                    <input type="date" className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2 text-xs" value={filters.dateFrom} onChange={(e) => setFilters({...filters, dateFrom: e.target.value})} />
                    <input type="date" className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2 text-xs" value={filters.dateTo} onChange={(e) => setFilters({...filters, dateTo: e.target.value})} />
                </div>
                 <div className="grid grid-cols-2 gap-2 md:col-span-2">
                    <input type="number" placeholder="Min ₺" className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2 text-xs" value={filters.minAmount} onChange={(e) => setFilters({...filters, minAmount: e.target.value})} />
                    <input type="number" placeholder="Max ₺" className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2 text-xs" value={filters.maxAmount} onChange={(e) => setFilters({...filters, maxAmount: e.target.value})} />
                </div>
            </div>
        </div>

        {/* --- İŞ LİSTESİ --- */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
           {filteredDeliveries.length === 0 ? (
              <div className="text-center py-16">
                 <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                    <BiPackage size={32} />
                 </div>
                 <p className="text-gray-500 font-medium">Kriterlere uygun iş bulunamadı.</p>
              </div>
           ) : (
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50/50 border-b border-gray-100">
                    <tr>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Sipariş No</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Güzergah</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Tutar</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Kişiler</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Durum</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Ödeme</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">İşlem</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {filteredDeliveries.map((delivery) => (
                    <tr key={delivery.id} className="hover:bg-gray-50 transition-colors group">
                        <td className="px-6 py-4 font-mono text-sm font-medium text-gray-600">
                            {delivery.order_number}
                        </td>
                        <td className="px-6 py-4">
                            <div className="flex flex-col text-sm">
                                <span className="font-bold text-gray-900">{delivery.pickup_district}</span>
                                <span className="text-xs text-gray-400 rotate-90 ml-1 my-0.5 w-fit">➜</span>
                                <span className="font-bold text-gray-900">{delivery.delivery_district}</span>
                            </div>
                        </td>
                         <td className="px-6 py-4 text-sm font-black text-gray-900">
                             {formatCurrency(delivery.payment_amount)}
                        </td>
                        <td className="px-6 py-4 text-xs">
                            <div className="flex flex-col gap-1">
                                <span className="text-gray-500">G: <span className="text-gray-900 font-medium">{delivery.sender_email}</span></span>
                                <span className="text-gray-500">K: <span className="text-blue-600 font-medium">{delivery.student_name || '-'}</span></span>
                            </div>
                        </td>
                        <td className="px-6 py-4">
                            {getStatusBadge(delivery.status)}
                        </td>
                        <td className="px-6 py-4">
                            {getPaymentBadge(delivery.payment_status)}
                        </td>
                        <td className="px-6 py-4 text-right">
                             <button 
                                onClick={() => handleViewDetails(delivery.id)}
                                className="p-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:text-blue-600 hover:border-blue-200 transition"
                                title="Detayları Gör"
                            >
                                <BiShow size={18} />
                            </button>
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
           )}
        </div>
      </main>

      {/* --- DETAY MODAL --- */}
      {showDetailModal && selectedDelivery && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            
             {/* Modal Header */}
             <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
                <div>
                    <h2 className="text-xl font-black text-gray-900">Sipariş Detayı</h2>
                    <p className="font-mono text-sm text-gray-500">{selectedDelivery.order_number}</p>
                </div>
                <button onClick={() => setShowDetailModal(false)} className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition">
                    <BiX size={24} />
                </button>
            </div>

            <div className="p-6">
                 {/* Üst Bar: Durumlar */}
                 <div className="flex flex-wrap gap-3 mb-8 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    {getStatusBadge(selectedDelivery.status)}
                    {getPaymentBadge(selectedDelivery.payment_status)}
                 </div>

                 {/* Visual Timeline Route */}
                 <div className="relative pl-6 border-l-2 border-dashed border-gray-200 ml-3 space-y-8 mb-8">
                     {/* Alış */}
                     <div className="relative">
                         <span className="absolute -left-[31px] top-1 w-4 h-4 bg-white border-4 border-yellow-500 rounded-full"></span>
                         <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
                             <p className="text-xs font-bold text-gray-400 uppercase mb-1">Alış Noktası</p>
                             <p className="font-bold text-gray-900 text-lg">{selectedDelivery.pickup_district}</p>
                             <p className="text-sm text-gray-600 mb-2">{selectedDelivery.pickup_address}</p>
                             <div className="flex items-center gap-3 text-xs text-gray-500 border-t border-gray-100 pt-2">
                                <span className="flex items-center gap-1"><BiUser/> {selectedDelivery.pickup_contact_name}</span>
                                <span className="flex items-center gap-1"><BiPhone/> {selectedDelivery.pickup_contact_phone}</span>
                             </div>
                         </div>
                     </div>
                     
                     {/* Teslim */}
                     <div className="relative">
                         <span className="absolute -left-[31px] top-1 w-4 h-4 bg-gray-900 rounded-full"></span>
                         <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
                             <p className="text-xs font-bold text-gray-400 uppercase mb-1">Teslim Noktası</p>
                             <p className="font-bold text-gray-900 text-lg">{selectedDelivery.delivery_district}</p>
                             <p className="text-sm text-gray-600 mb-2">{selectedDelivery.delivery_address}</p>
                             <div className="flex items-center gap-3 text-xs text-gray-500 border-t border-gray-100 pt-2">
                                <span className="flex items-center gap-1"><BiUser/> {selectedDelivery.delivery_contact_name}</span>
                                <span className="flex items-center gap-1"><BiPhone/> {selectedDelivery.delivery_contact_phone}</span>
                             </div>
                         </div>
                     </div>
                 </div>

                 {/* Kişiler */}
                 <div className="grid grid-cols-2 gap-4 mb-8">
                     <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                         <p className="text-xs font-bold text-blue-500 uppercase mb-2">Gönderici</p>
                         <p className="text-sm font-bold text-gray-900">{selectedDelivery.sender_email || '-'}</p>
                         <p className="text-xs text-gray-500">{selectedDelivery.sender_phone}</p>
                     </div>
                     <div className="p-4 bg-purple-50 rounded-2xl border border-purple-100">
                         <p className="text-xs font-bold text-purple-500 uppercase mb-2">Kurye</p>
                         <p className="text-sm font-bold text-gray-900">{selectedDelivery.student_name || 'Atanmadı'}</p>
                         <p className="text-xs text-gray-500">{selectedDelivery.student_phone}</p>
                     </div>
                 </div>

                 {/* ADMIN AKSİYONLARI (ÖDEME & WHATSAPP) */}
                 <div className="space-y-4 border-t border-gray-100 pt-6">
                    <h3 className="font-bold text-gray-900 flex items-center gap-2">
                        <BiWallet className="text-gray-500" />
                        Admin İşlemleri
                    </h3>
                    
                    {/* 1️⃣ KURYE ATANDI - GÖNDERİCİYE BİLDİR */}
                    {selectedDelivery.status === 'accepted' && selectedDelivery.payment_status === 'waiting' && (
                        <div className="space-y-3">
                        {/* WhatsApp Bildirimi */}
                        <button
                            onClick={() => sendWhatsAppToSender(selectedDelivery)}
                            className="w-full py-3.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition shadow-md flex items-center justify-center gap-2"
                        >
                            <BiLogoWhatsapp size={22} /> 
                            Göndericiye WhatsApp Gönder
                        </button>

                        {/* Ödeme Onayı */}
                        <button
                            onClick={() => handleMarkAsPaid(selectedDelivery.id)}
                            className="w-full py-3.5 bg-yellow-400 hover:bg-yellow-500 text-black font-bold rounded-xl transition shadow-md flex items-center justify-center gap-2"
                        >
                            <BiCheckCircle size={20} /> 
                            Gönderici Ödemesini Onayla
                        </button>

                        {/* Bilgilendirme */}
                        <div className="bg-blue-50 border border-blue-200 p-3 rounded-xl">
                            <p className="text-xs text-blue-800 font-medium">
                            💡 <strong>Adım 1:</strong> WhatsApp ile göndericiye bildir<br/>
                            💡 <strong>Adım 2:</strong> Ödeme geldiğinde "Onayla" butonuna bas
                            </p>
                        </div>
                        </div>
                    )}

                    {/* 2️⃣ GÖNDERİCİ ÖDEDİ - ÖĞRENCİYE BİLDİR */}
                    {selectedDelivery.status === 'accepted' && selectedDelivery.payment_status === 'sender_paid' && (
                        <div className="space-y-3">
                        {/* WhatsApp Bildirimi */}
                        <button
                            onClick={() => sendWhatsAppToStudent(selectedDelivery)}
                            className="w-full py-3.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition shadow-md flex items-center justify-center gap-2"
                        >
                            <BiLogoWhatsapp size={22} /> 
                            Öğrenciye WhatsApp Gönder
                        </button>

                        {/* Bilgilendirme */}
                        <div className="bg-green-50 border border-green-200 p-3 rounded-xl">
                            <p className="text-xs text-green-800 font-medium">
                            ✅ Gönderici ödeme yaptı!<br/>
                            💡 Öğrenciye WhatsApp gönder, iş başlayabilir.
                            </p>
                        </div>
                        </div>
                    )}

                    {/* 3️⃣ İŞ TAMAMLANDI - ÖĞRENCİYE ÖDEME */}
                    {selectedDelivery.status === 'completed' && selectedDelivery.payment_status === 'sender_paid' && (
                        <div className="space-y-3">
                        <button
                            onClick={() => handleMarkAsStudentPaid(selectedDelivery.id)}
                            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition shadow-md flex items-center justify-center gap-2"
                        >
                            <BiWallet size={20} /> 
                            Öğrenciye Ödeme Yapıldı İşaretle
                        </button>

                        <div className="bg-blue-50 border border-blue-200 p-3 rounded-xl">
                            <p className="text-xs text-blue-800 font-medium">
                            💰 İş tamamlandı! Öğrenciye ödeme yap ve işaretle.
                            </p>
                        </div>
                        </div>
                    )}

                    {/* 4️⃣ BAŞKA AKSİYON YOK */}
                    {!(selectedDelivery.status === 'accepted' && selectedDelivery.payment_status === 'waiting') && 
                    !(selectedDelivery.status === 'accepted' && selectedDelivery.payment_status === 'sender_paid') &&
                    !(selectedDelivery.status === 'completed' && selectedDelivery.payment_status === 'sender_paid') && (
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-center">
                        <p className="text-sm text-gray-500 italic">
                            Şu an yapılabilecek bir admin işlemi bulunmuyor.
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                            Durum: {getStatusBadge(selectedDelivery.status)} 
                        </p>
                        </div>
                    )}
                 </div>

                 <div className="mt-4 pt-4 border-t border-gray-100">
                    <button onClick={() => setShowDetailModal(false)} className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition">
                        Pencereyi Kapat
                    </button>
                 </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};