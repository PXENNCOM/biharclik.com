// Dosya: /src/pages/admin/AdminSupportPage.jsx

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supportService } from '../../services/supportService';

// Components
import { ModernHeader } from '../common/ModernHeader';
import { StatusModal, ConfirmModal } from '../../components/common/ActionModals';

// Icons
import { 
  BiMessageDetail, 
  BiPackage, 
  BiTimeFive,
  BiCheckCircle,
  BiXCircle,
  BiUser,
  BiSend,
  BiFilterAlt,
  BiSearch,
  BiRefresh,
  BiLock,
  BiLockOpen,
  BiErrorCircle,
  BiBarChartAlt2
} from 'react-icons/bi';

export const AdminSupportPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  // State'ler
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Modals
  const [popup, setPopup] = useState({ isOpen: false, type: 'success', title: '', message: '' });
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: '', message: '', onConfirm: () => {} });
  
  // Filters
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    priority: '',
    user_role: '',
    search: ''
  });
  
  // Mesaj Gönderme
  const [newMessage, setNewMessage] = useState('');
  const [messageLoading, setMessageLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [ticketsRes, statsRes] = await Promise.all([
        supportService.getAllTickets({ limit: 100 }),
        supportService.getSupportStats()
      ]);
      
      const ticketsData = ticketsRes.data.tickets || ticketsRes.data || [];
      setTickets(ticketsData);
      
      const statsData = statsRes.data || statsRes;
      setStats(statsData);
    } catch (err) {
      setError(err.response?.data?.message || 'Veri yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const showStatus = (type, title, message) => {
    setPopup({ isOpen: true, type, title, message });
  };

  // Ticket Detayı Aç
  const handleViewTicket = async (ticketId) => {
    try {
      const response = await supportService.getTicketDetail(ticketId);
      const ticketData = response.data || response;
      setSelectedTicket(ticketData);
    } catch (err) {
      showStatus('error', 'Hata', err.response?.data?.message || 'Talep detayı yüklenemedi');
    }
  };

  // Mesaj Gönder
  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim()) {
      showStatus('error', 'Hata', 'Mesaj boş olamaz');
      return;
    }

    try {
      setMessageLoading(true);
      const response = await supportService.addMessage(selectedTicket.id, newMessage.trim());
      const updatedTicket = response.data || response;
      setSelectedTicket(updatedTicket);
      setNewMessage('');
      showStatus('success', 'Gönderildi', 'Yanıtınız iletildi');
      fetchData(); // Listeyi güncelle
    } catch (err) {
      showStatus('error', 'Hata', err.response?.data?.message || 'Mesaj gönderilemedi');
    } finally {
      setMessageLoading(false);
    }
  };

  // Ticket Kapat
  const handleCloseTicket = () => {
    setConfirmModal({
      isOpen: true,
      title: 'Talebi Kapat',
      message: 'Bu talebi kapatmak istediğinizden emin misiniz?',
      onConfirm: async () => {
        try {
          const response = await supportService.closeTicket(selectedTicket.id);
          const updatedTicket = response.data || response;
          setSelectedTicket(updatedTicket);
          setConfirmModal(prev => ({ ...prev, isOpen: false }));
          showStatus('success', 'Kapatıldı', 'Talep başarıyla kapatıldı');
          fetchData();
        } catch (err) {
          setConfirmModal(prev => ({ ...prev, isOpen: false }));
          showStatus('error', 'Hata', err.response?.data?.message || 'Talep kapatılamadı');
        }
      }
    });
  };

  // Ticket Yeniden Aç
  const handleReopenTicket = async () => {
    try {
      const response = await supportService.reopenTicket(selectedTicket.id);
      const updatedTicket = response.data || response;
      setSelectedTicket(updatedTicket);
      showStatus('success', 'Açıldı', 'Talep yeniden açıldı');
      fetchData();
    } catch (err) {
      showStatus('error', 'Hata', err.response?.data?.message || 'Talep açılamadı');
    }
  };

  // Durum Değiştir
  const handleChangeStatus = (newStatus) => {
    setConfirmModal({
      isOpen: true,
      title: 'Durumu Değiştir',
      message: `Talep durumunu "${getStatusLabel(newStatus)}" olarak değiştirmek istediğinizden emin misiniz?`,
      onConfirm: async () => {
        try {
          const response = await supportService.updateTicketStatus(selectedTicket.id, newStatus);
          const updatedTicket = response.data || response;
          setSelectedTicket(updatedTicket);
          setConfirmModal(prev => ({ ...prev, isOpen: false }));
          showStatus('success', 'Güncellendi', 'Talep durumu güncellendi');
          fetchData();
        } catch (err) {
          setConfirmModal(prev => ({ ...prev, isOpen: false }));
          showStatus('error', 'Hata', err.response?.data?.message || 'Durum güncellenemedi');
        }
      }
    });
  };

  const getCategoryLabel = (category) => {
    const labels = {
      delivery: '🚚 Teslimat',
      payment: '💳 Ödeme',
      account: '👤 Hesap',
      technical: '⚙️ Teknik',
      other: '❓ Diğer'
    };
    return labels[category] || category;
  };

  const getStatusLabel = (status) => {
    const labels = {
      open: 'Açık',
      answered: 'Yanıtlandı',
      waiting_user: 'Kullanıcı Bekliyor',
      resolved: 'Çözüldü',
      closed: 'Kapalı'
    };
    return labels[status] || status;
  };

  const getStatusBadge = (status) => {
    const config = {
      open: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: <BiTimeFive />, label: 'Açık' },
      answered: { color: 'bg-blue-100 text-blue-800 border-blue-200', icon: <BiMessageDetail />, label: 'Yanıtlandı' },
      waiting_user: { color: 'bg-purple-100 text-purple-800 border-purple-200', icon: <BiTimeFive />, label: 'Kullanıcı Bekliyor' },
      resolved: { color: 'bg-green-100 text-green-800 border-green-200', icon: <BiCheckCircle />, label: 'Çözüldü' },
      closed: { color: 'bg-gray-100 text-gray-800 border-gray-200', icon: <BiXCircle />, label: 'Kapalı' }
    };
    const current = config[status] || config.open;
    return (
      <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${current.color}`}>
        {current.icon} {current.label}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const config = {
      low: { color: 'bg-gray-100 text-gray-600', label: 'Düşük' },
      normal: { color: 'bg-blue-100 text-blue-700', label: 'Normal' },
      high: { color: 'bg-orange-100 text-orange-700', label: 'Yüksek' },
      urgent: { color: 'bg-red-100 text-red-700', label: 'Acil' }
    };
    const current = config[priority] || config.normal;
    return (
      <span className={`px-2 py-1 rounded-lg text-xs font-bold ${current.color}`}>
        {current.label}
      </span>
    );
  };

  const getUserRoleBadge = (role) => {
    const config = {
      student: { color: 'bg-yellow-100 text-yellow-800', label: 'Öğrenci' },
      sender: { color: 'bg-blue-100 text-blue-800', label: 'Gönderici' }
    };
    const current = config[role] || config.student;
    return (
      <span className={`px-2 py-1 rounded-lg text-xs font-bold ${current.color}`}>
        {current.label}
      </span>
    );
  };

  // Filtreleme
  const filteredTickets = tickets.filter(ticket => {
    if (filters.status && ticket.status !== filters.status) return false;
    if (filters.category && ticket.category !== filters.category) return false;
    if (filters.priority && ticket.priority !== filters.priority) return false;
    if (filters.user_role && ticket.user_role !== filters.user_role) return false;
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesTicketNumber = ticket.ticket_number.toLowerCase().includes(searchLower);
      const matchesUserName = ticket.user_name?.toLowerCase().includes(searchLower);
      const matchesMessage = ticket.first_message?.toLowerCase().includes(searchLower);
      if (!matchesTicketNumber && !matchesUserName && !matchesMessage) return false;
    }
    return true;
  });

  const clearFilters = () => {
    setFilters({ status: '', category: '', priority: '', user_role: '', search: '' });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-yellow-500"></div>
      </div>
    );
  }

  // Detay Görünümü
  if (selectedTicket) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <StatusModal 
          isOpen={popup.isOpen} 
          {...popup} 
          onClose={() => setPopup({ ...popup, isOpen: false })} 
        />

        <ConfirmModal 
          isOpen={confirmModal.isOpen} 
          {...confirmModal} 
          onCancel={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))} 
        />

        <ModernHeader 
          title="Destek Talebi Detayı (Admin)"
          subtitle={`#${selectedTicket.ticket_number}`}
          user={user}
          onLogout={() => { logout(); navigate('/login'); }}
          onProfileClick={() => navigate('/profile')}
          showBackButton={true}
          onBack={() => setSelectedTicket(null)}
        />

        <main className="max-w-6xl mx-auto px-4 pt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Sol Panel - Ticket Bilgileri */}
            <div className="lg:col-span-1 space-y-4">
              {/* Ticket Header */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="font-mono text-sm font-bold text-gray-400">#{selectedTicket.ticket_number}</span>
                  </div>
                  <div className="space-y-2">
                    {getStatusBadge(selectedTicket.status)}
                    {getPriorityBadge(selectedTicket.priority)}
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-gray-100">
                  <InfoRow label="Kategori" value={getCategoryLabel(selectedTicket.category)} />
                  <InfoRow label="Kullanıcı" value={selectedTicket.user_name} badge={getUserRoleBadge(selectedTicket.user_role)} />
                  <InfoRow label="Email" value={selectedTicket.user_email} />
                  <InfoRow label="Telefon" value={selectedTicket.user_phone} />
                  {selectedTicket.order_number && (
                    <InfoRow label="Teslimat" value={`#${selectedTicket.order_number}`} />
                  )}
                  <InfoRow 
                    label="Oluşturma" 
                    value={new Date(selectedTicket.created_at).toLocaleString('tr-TR')} 
                  />
                  {selectedTicket.closed_at && (
                    <InfoRow 
                      label="Kapanma" 
                      value={new Date(selectedTicket.closed_at).toLocaleString('tr-TR')} 
                    />
                  )}
                </div>
              </div>

              {/* Aksiyonlar */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-3">
                <h3 className="font-bold text-gray-900 mb-3">Hızlı İşlemler</h3>
                
                {selectedTicket.status !== 'closed' && (
                  <>
                    <button
                      onClick={() => handleChangeStatus('resolved')}
                      className="w-full py-2.5 bg-green-50 hover:bg-green-100 text-green-700 font-bold rounded-xl text-sm transition flex items-center justify-center gap-2"
                    >
                      <BiCheckCircle /> Çözüldü İşaretle
                    </button>
                    <button
                      onClick={handleCloseTicket}
                      className="w-full py-2.5 bg-gray-900 hover:bg-black text-white font-bold rounded-xl text-sm transition flex items-center justify-center gap-2"
                    >
                      <BiLock /> Talebi Kapat
                    </button>
                  </>
                )}

                {selectedTicket.status === 'closed' && (
                  <button
                    onClick={handleReopenTicket}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition flex items-center justify-center gap-2"
                  >
                    <BiLockOpen /> Yeniden Aç
                  </button>
                )}

                <button
                  onClick={() => setSelectedTicket(null)}
                  className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-sm transition"
                >
                  Listeye Dön
                </button>
              </div>
            </div>

            {/* Sağ Panel - Mesajlar */}
            <div className="lg:col-span-2">
              {/* Mesajlar */}
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 mb-4">
                <div className="p-6 border-b border-gray-100">
                  <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    <BiMessageDetail /> Mesajlaşma Geçmişi
                  </h3>
                </div>
                <div className="p-6 space-y-4 max-h-[500px] overflow-y-auto">
                  {selectedTicket.messages && selectedTicket.messages.map((msg) => (
                    <div 
                      key={msg.id} 
                      className={`flex ${msg.is_admin_reply ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[80%] ${msg.is_admin_reply ? 'bg-gray-900 text-white' : 'bg-blue-50 text-blue-900'} rounded-2xl p-4`}>
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`w-7 h-7 rounded-full ${msg.is_admin_reply ? 'bg-yellow-400 text-gray-900' : 'bg-blue-200 text-blue-900'} flex items-center justify-center text-xs font-bold`}>
                            {msg.is_admin_reply ? '👨‍💼' : <BiUser />}
                          </div>
                          <span className="text-xs font-bold opacity-80">{msg.sender_name}</span>
                        </div>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                        <div className="text-[10px] opacity-60 mt-2">
                          {new Date(msg.created_at).toLocaleString('tr-TR')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mesaj Gönder */}
              {selectedTicket.status !== 'closed' && (
                <form onSubmit={handleSendMessage} className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100">
                  <div className="flex gap-3">
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Yanıtınızı yazın..."
                      className="flex-1 px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none"
                      rows="3"
                      disabled={messageLoading}
                    />
                    <button
                      type="submit"
                      disabled={messageLoading || !newMessage.trim()}
                      className="px-6 py-3 bg-gray-900 hover:bg-black text-white font-bold rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 h-fit"
                    >
                      {messageLoading ? '...' : <><BiSend /> Gönder</>}
                    </button>
                  </div>
                </form>
              )}
            </div>

          </div>
        </main>
      </div>
    );
  }

  // Liste Görünümü
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <StatusModal 
        isOpen={popup.isOpen} 
        {...popup} 
        onClose={() => setPopup({ ...popup, isOpen: false })} 
      />

      <ConfirmModal 
        isOpen={confirmModal.isOpen} 
        {...confirmModal} 
        onCancel={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))} 
      />

      <ModernHeader 
        title="Destek Yönetimi"
        subtitle="Kullanıcı destek taleplerini yönetin"
        user={user}
        onLogout={() => { logout(); navigate('/login'); }}
        onProfileClick={() => navigate('/profile')}
        showBackButton={true}
        onBack={() => navigate('/admin/dashboard')}
      />

      <main className="max-w-7xl mx-auto px-4 pt-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl mb-6 flex items-center gap-3">
            <BiErrorCircle size={24} /> {error}
          </div>
        )}

        {/* İstatistikler */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <StatCard 
              icon={<BiMessageDetail />} 
              label="Toplam" 
              value={stats.total_tickets || 0} 
              color="bg-gray-100 text-gray-700"
            />
            <StatCard 
              icon={<BiTimeFive />} 
              label="Açık" 
              value={stats.open_tickets || 0} 
              color="bg-yellow-100 text-yellow-700"
            />
            <StatCard 
              icon={<BiCheckCircle />} 
              label="Çözüldü" 
              value={stats.resolved_tickets || 0} 
              color="bg-green-100 text-green-700"
            />
            <StatCard 
              icon={<BiXCircle />} 
              label="Kapalı" 
              value={stats.closed_tickets || 0} 
              color="bg-gray-100 text-gray-600"
            />
            <StatCard 
              icon={<BiBarChartAlt2 />} 
              label="Ort. Çözüm" 
              value={stats.avg_resolution_hours ? `${Math.round(stats.avg_resolution_hours)}sa` : '-'} 
              color="bg-blue-100 text-blue-700"
            />
          </div>
        )}

        {/* Filtreler */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <BiFilterAlt /> Filtreler
            </h3>
            {(filters.status || filters.category || filters.priority || filters.user_role || filters.search) && (
              <button
                onClick={clearFilters}
                className="text-sm text-blue-600 hover:text-blue-700 font-bold flex items-center gap-1"
              >
                <BiRefresh /> Temizle
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Arama */}
            <div className="md:col-span-2">
              <div className="relative">
                <BiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  placeholder="Ticket no, kullanıcı veya mesaj ara..."
                  className="w-full pl-12 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
                />
              </div>
            </div>

            {/* Durum */}
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
            >
              <option value="">Tüm Durumlar</option>
              <option value="open">Açık</option>
              <option value="answered">Yanıtlandı</option>
              <option value="waiting_user">Kullanıcı Bekliyor</option>
              <option value="resolved">Çözüldü</option>
              <option value="closed">Kapalı</option>
            </select>

            {/* Kategori */}
            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
            >
              <option value="">Tüm Kategoriler</option>
              <option value="delivery">Teslimat</option>
              <option value="payment">Ödeme</option>
              <option value="account">Hesap</option>
              <option value="technical">Teknik</option>
              <option value="other">Diğer</option>
            </select>

            {/* Öncelik */}
            <select
              value={filters.priority}
              onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
              className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
            >
              <option value="">Tüm Öncelikler</option>
              <option value="urgent">Acil</option>
              <option value="high">Yüksek</option>
              <option value="normal">Normal</option>
              <option value="low">Düşük</option>
            </select>
          </div>
        </div>

        {/* Ticket Listesi */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">
              Destek Talepleri ({filteredTickets.length})
            </h2>
          </div>

          {filteredTickets.length === 0 ? (
            <div className="text-center py-16">
              <BiMessageDetail size={48} className="text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900">Talep Bulunamadı</h3>
              <p className="text-gray-500 mt-1 text-sm">Filtreleri değiştirerek tekrar deneyin.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Ticket</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Kullanıcı</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Kategori</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Durum</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Öncelik</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Mesaj</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Tarih</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredTickets.map((ticket) => (
                    <tr 
                      key={ticket.id} 
                      onClick={() => handleViewTicket(ticket.id)}
                      className="hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-mono text-sm font-bold text-gray-900">
                            #{ticket.ticket_number}
                          </div>
                          {ticket.order_number && (
                            <div className="text-xs text-gray-400">
                              Teslimat: #{ticket.order_number}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-bold text-gray-900 text-sm">{ticket.user_name}</div>
                          <div className="text-xs text-gray-500">{ticket.user_email}</div>
                          <div className="mt-1">{getUserRoleBadge(ticket.user_role)}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-gray-700">
                          {getCategoryLabel(ticket.category)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(ticket.status)}
                      </td>
                      <td className="px-6 py-4">
                        {getPriorityBadge(ticket.priority)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <BiMessageDetail />
                          <span>{ticket.message_count}</span>
                          {ticket.unread_admin_count > 0 && (
                            <span className="bg-yellow-400 text-gray-900 px-2 py-0.5 rounded-full text-xs font-bold">
                              {ticket.unread_admin_count}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(ticket.created_at).toLocaleDateString('tr-TR')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

// Helper Components
const StatCard = ({ icon, label, value, color }) => (
  <div className={`${color} rounded-2xl p-4`}>
    <div className="flex items-center gap-2 mb-2 opacity-80">
      {icon}
      <span className="text-xs font-bold uppercase">{label}</span>
    </div>
    <p className="text-2xl font-black">{value}</p>
  </div>
);

const InfoRow = ({ label, value, badge }) => (
  <div className="flex justify-between items-start text-sm">
    <span className="text-gray-500 font-medium">{label}</span>
    <div className="text-right">
      <span className="text-gray-900 font-bold block">{value}</span>
      {badge && <div className="mt-1">{badge}</div>}
    </div>
  </div>
);