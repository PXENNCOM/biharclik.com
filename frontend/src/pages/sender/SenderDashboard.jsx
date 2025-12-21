import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { deliveryService } from '../../services/deliveryService';
import { userService } from '../../services/userService';

// Componentler
import { ModernHeader } from '../common/ModernHeader';
import { CreateShipmentModal } from './CreateShipmentModal';
import { SenderTermsModal } from '../../components/common/SenderTermsModal';

import Banner from '../../assets/banner.png';

// Ortak Modal Bileşenleri
import { StatusModal, CancelOrderModal, ConfirmModal } from '../../components/common/ActionModals';

// İkonlar
import {
  BiPlus, BiPackage, BiUser, BiWallet, BiTimeFive,
  BiCheckCircle, BiXCircle, BiTrash, BiBriefcase, BiNavigation, BiEnvelope, BiShield
} from 'react-icons/bi';

export const SenderDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // --- MODAL STATES ---
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  // Popup Yönetimi State'i
  const [popup, setPopup] = useState({ isOpen: false, type: 'success', title: '', message: '' });

  // İptal Modalı State'i
  const [cancelModal, setCancelModal] = useState({ isOpen: false, orderId: null });
  const [cancelLoading, setCancelLoading] = useState(false);

  // Onay Modalı State'i
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => { },
    data: null
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const historyResponse = await userService.getMyHistory();
      setHistory(historyResponse.data.data || historyResponse.data);

      const ordersResponse = await deliveryService.getMyOrders();
      const ordersData = ordersResponse.data.data || ordersResponse.data;
      setOrders(ordersData.deliveries || ordersData.orders || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Veri yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  // Helper: Popup Göster
  const showStatus = (type, title, message) => {
    setPopup({ isOpen: true, type, title, message });
  };

  // Yeni İş Oluşturma Süreci
  const handleCreateJobSubmit = async (deliveryData) => {
    const amount = parseFloat(deliveryData.payment_amount);
    if (amount < 100) {
      showStatus('error', 'Yetersiz Tutar', 'Harçlık minimum 100 TL olmalıdır.');
      return;
    }

    if (deliveryData.pickup_district === deliveryData.delivery_district) {
      setConfirmModal({
        isOpen: true,
        title: 'Aynı İlçe Uyarısı',
        message: 'Alış ve teslim adresleri aynı ilçede görünüyor. Yine de devam etmek istiyor musunuz?',
        data: deliveryData,
        onConfirm: () => {
          processCreateDelivery(deliveryData);
          setConfirmModal(prev => ({ ...prev, isOpen: false }));
        }
      });
      return;
    }

    processCreateDelivery(deliveryData);
  };

  const processCreateDelivery = async (data) => {
    setFormLoading(true);
    try {
      await deliveryService.createDelivery(data);
      setShowCreateModal(false);
      showStatus('success', 'Harika!', 'İş başarıyla oluşturuldu. Öğrenciler artık görebilir.');
      fetchData();
    } catch (err) {
      showStatus('error', 'Hata', err.response?.data?.message || 'İş oluşturulamadı');
    } finally {
      setFormLoading(false);
    }
  };

  const initiateCancel = (orderId) => {
    setCancelModal({ isOpen: true, orderId });
  };

  const handleCancelConfirm = async (reason) => {
    setCancelLoading(true);
    try {
      await deliveryService.cancelDelivery(cancelModal.orderId, reason.trim());
      setCancelModal({ isOpen: false, orderId: null });
      showStatus('success', 'İptal Edildi', 'Sipariş başarıyla iptal edildi.');
      fetchData();
    } catch (err) {
      showStatus('error', 'Hata', 'İptal işlemi sırasında bir sorun oluştu.');
    } finally {
      setCancelLoading(false);
    }
  };

  const formatCurrency = (amount) => new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(amount || 0);

  const getStatusBadge = (status) => {
    const config = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: <BiTimeFive />, label: 'Bekliyor' },
      accepted: { color: 'bg-blue-100 text-blue-800', icon: <BiUser />, label: 'Kurye Atandı' },
      in_progress: { color: 'bg-purple-100 text-purple-800', icon: <BiNavigation />, label: 'Yolda' },
      completed: { color: 'bg-green-100 text-green-800', icon: <BiCheckCircle />, label: 'Teslim Edildi' },
      cancelled: { color: 'bg-red-100 text-red-800', icon: <BiXCircle />, label: 'İptal' },
    };
    const current = config[status] || config.pending;
    return (
      <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${current.color}`}>
        {current.icon} {current.label}
      </span>
    );
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-10 w-10 border-b-4 border-yellow-500"></div></div>;

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-20 relative">

      {/* --- MODAL YERLEŞİMİ --- */}
      <StatusModal
        isOpen={popup.isOpen}
        type={popup.type}
        title={popup.title}
        message={popup.message}
        onClose={() => setPopup({ ...popup, isOpen: false })}
      />

      <CancelOrderModal
        isOpen={cancelModal.isOpen}
        isLoading={cancelLoading}
        onClose={() => setCancelModal({ isOpen: false, orderId: null })}
        onConfirm={handleCancelConfirm}
        title="Siparişi İptal Et"
      />

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
        confirmText="Evet, Devam Et"
        cancelText="Vazgeç"
      />

      <SenderTermsModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
      />

      {/* --- ANA İÇERİK --- */}

      <ModernHeader
        title="Gönderici Paneli"
        subtitle={`Hoş geldin, ${user?.name || user?.email?.split('@')[0]}`}
        user={user}
        onLogout={() => { logout(); navigate('/login'); }}
        onProfileClick={() => navigate('/profile')}
      />

      <main className="max-w-7xl mx-auto px-5 pt-6">

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl mb-6 flex items-center gap-3">
            <BiXCircle size={24} /> {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* SOL PANEL (ACTIONS) */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
            <button
              onClick={() => setShowCreateModal(true)}
              className="w-full py-4 bg-gray-900 hover:bg-black text-white font-bold rounded-3xl shadow-lg shadow-gray-300 transform transition active:scale-95 flex items-center justify-center gap-2 group"
            >
              <div className="bg-white/20 p-1 rounded-full group-hover:rotate-90 transition-transform">
                <BiPlus size={20} className="text-yellow-400" />
              </div>
              <span>Yeni Gönderi Oluştur</span>
            </button>

            {history?.summary && (
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
                <div className="bg-yellow-400 p-6 rounded-3xl shadow-lg relative overflow-hidden">
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2 opacity-90">
                      <BiWallet size={20} />
                      <span className="text-sm font-bold text-gray-900">Harcamalar</span>
                    </div>
                    <p className="text-2xl font-black text-gray-900">{formatCurrency(history.summary.total_spent)}</p>
                  </div>
                  <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white opacity-20 rounded-full blur-xl"></div>
                </div>

                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <span className="text-sm font-bold text-gray-500 uppercase">Sipariş</span>
                    <BiBriefcase size={24} className="text-gray-300" />
                  </div>
                  <div className="flex items-baseline gap-1 mt-2">
                    <p className="text-3xl font-black text-gray-900">{history.summary.total_orders || 0}</p>
                    <span className="text-xs text-gray-400 font-bold">Toplam</span>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <button 
                onClick={() => navigate('/sender/history')} 
                className="w-full bg-white hover:bg-gray-50 text-gray-600 font-bold py-3 px-6 rounded-2xl border border-gray-200 transition flex items-center gap-3"
              >
              <BiBriefcase /> Geçmiş Siparişlerim
              </button>
              <button
                onClick={() => navigate('/sender/support')}
                className="w-full bg-white hover:bg-gray-50 text-gray-600 font-bold py-3 px-6 rounded-2xl border border-gray-200 transition flex items-center gap-3"
              >
                <BiEnvelope /> Destek Talebi
              </button>
              
              <button
                onClick={() => setShowTermsModal(true)}
                className="w-full bg-[#FBCF2D] text-gray-900 font-bold py-3 px-6 rounded-2xl border transition flex items-center gap-3"
              >
                <BiShield /> Gönderici Kuralları
              </button>
            </div>
          </div>

          <div className="lg:col-span-8">
            
            <div className="relative w-full h-32 sm:h-48 lg:h-64 rounded-3xl overflow-hidden  border-2 border-dashed border-gray-100   mb-8 group cursor-pointer">
              <img 
                src={Banner} 
                alt="biharçlık banner" 
                className="w-full h-full object-cover transform transition-transform"
              />
            </div>

            <div className="flex justify-between items-center mb-6 px-1">
              <h2 className="text-xl font-bold text-gray-900">Aktif Gönderiler</h2>
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border-2 border-dashed border-gray-100">
                <BiPackage size={40} className="text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900">Henüz Sipariş Yok</h3>
                <p className="text-gray-500 mt-1 mb-6 text-sm">Hemen yeni bir gönderi oluşturun.</p>
                <button onClick={() => setShowCreateModal(true)} className="text-blue-600 font-bold hover:underline text-sm">
                  Oluştur
                </button>
              </div>
            ) : (
              <div className="space-y-5">
                {orders.map((order) => (
                  <div key={order.id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all group">
                    <div className="flex justify-between items-start mb-5">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-xs font-bold text-gray-400">#{order.order_number}</span>
                          {getStatusBadge(order.status)}
                        </div>
                        {order.student_name && (
                          <div className="inline-flex items-center gap-1.5 mt-2 text-xs font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded-lg">
                            <BiUser size={12} /> {order.student_name}
                          </div>
                        )}
                      </div>
                      <span className="text-xl font-black text-gray-900">{formatCurrency(order.payment_amount)}</span>
                    </div>

                    <div className="relative pl-4 mb-6 border-l-2 border-dashed border-gray-200 ml-2 space-y-6">
                      <div className="relative">
                        <div className="absolute -left-[23px] top-1 w-3.5 h-3.5 bg-white border-4 border-yellow-500 rounded-full"></div>
                        <div>
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Alış</span>
                          <p className="text-sm font-bold text-gray-900">{order.pickup_district}</p>
                          <p className="text-xs text-gray-500 line-clamp-1">{order.pickup_address}</p>
                        </div>
                      </div>
                      <div className="relative">
                        <div className="absolute -left-[23px] top-1 w-3.5 h-3.5 bg-gray-900 rounded-full"></div>
                        <div>
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Teslim</span>
                          <p className="text-sm font-bold text-gray-900">{order.delivery_district}</p>
                          <p className="text-xs text-gray-500 line-clamp-1">{order.delivery_address}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                      <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                        <BiPackage className="text-gray-400" size={16} />
                        {order.package_description}
                      </div>

                      {order.status === 'pending' && (
                        <button onClick={() => initiateCancel(order.id)} className="text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1">
                          <BiTrash /> İptal
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* CreateShipmentModal */}
      {showCreateModal && (
        <CreateShipmentModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateJobSubmit}
          isLoading={formLoading}
        />
      )}

    </div>
  );
};