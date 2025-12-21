// Dosya: /src/pages/common/SupportPage.jsx

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supportService } from '../../services/supportService';
import { deliveryService } from '../../services/deliveryService';

// Components
import { ModernHeader } from './ModernHeader';
import { StatusModal } from '../../components/common/ActionModals';

// Icons
import { 
  BiPlus, 
  BiMessageDetail, 
  BiPackage, 
  BiTimeFive,
  BiCheckCircle,
  BiXCircle,
  BiChevronRight,
  BiSend,
  BiArrowBack,
  BiUser,
  BiInfoCircle
} from 'react-icons/bi';

export const SupportPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  // State'ler
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [myDeliveries, setMyDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [popup, setPopup] = useState({ isOpen: false, type: 'success', title: '', message: '' });
  
  // Filters
  const [filter, setFilter] = useState('all');
  
  // Form Data
  const [formData, setFormData] = useState({
    category: '',
    message: '',
    delivery_id: null
  });
  const [formLoading, setFormLoading] = useState(false);
  
  // Mesaj Gönderme
  const [newMessage, setNewMessage] = useState('');
  const [messageLoading, setMessageLoading] = useState(false);

  useEffect(() => {
    fetchTickets();
    fetchMyDeliveries();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const response = await supportService.getMyTickets({ limit: 50 });
      const ticketsData = response.data.tickets || response.data || [];
      setTickets(ticketsData);
    } catch (err) {
      setError(err.response?.data?.message || 'Talepler yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const fetchMyDeliveries = async () => {
    try {
      const response = user.role === 'student' 
        ? await deliveryService.getMyJobs()
        : await deliveryService.getMyOrders();
      
      const deliveriesData = response.data.data || response.data;
      setMyDeliveries(deliveriesData.jobs || deliveriesData.deliveries || deliveriesData.orders || []);
    } catch (err) {
      console.error('Deliveries fetch error:', err);
    }
  };

  const showStatus = (type, title, message) => {
    setPopup({ isOpen: true, type, title, message });
  };

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    
    if (!formData.category || !formData.message) {
      showStatus('error', 'Hata', 'Kategori ve mesaj zorunludur');
      return;
    }

    if (formData.message.length < 10) {
      showStatus('error', 'Hata', 'Mesaj en az 10 karakter olmalıdır');
      return;
    }

    try {
      setFormLoading(true);
      await supportService.createTicket({
        category: formData.category,
        message: formData.message,
        delivery_id: formData.delivery_id || null
      });
      
      showStatus('success', 'Başarılı', 'Destek talebiniz oluşturuldu. En kısa sürede size dönüş yapılacaktır.');
      setShowCreateModal(false);
      setFormData({ category: '', message: '', delivery_id: null });
      fetchTickets();
    } catch (err) {
      showStatus('error', 'Hata', err.response?.data?.message || 'Talep oluşturulamadı');
    } finally {
      setFormLoading(false);
    }
  };

  const handleViewTicket = async (ticketId) => {
    try {
      const response = await supportService.getTicketDetail(ticketId);
      const ticketData = response.data || response;
      setSelectedTicket(ticketData);
    } catch (err) {
      showStatus('error', 'Hata', err.response?.data?.message || 'Talep detayı yüklenemedi');
    }
  };

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
      showStatus('success', 'Gönderildi', 'Mesajınız iletildi');
    } catch (err) {
      showStatus('error', 'Hata', err.response?.data?.message || 'Mesaj gönderilemedi');
    } finally {
      setMessageLoading(false);
    }
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

  const getStatusBadge = (status) => {
    const config = {
      open: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: <BiTimeFive />, label: 'Açık' },
      answered: { color: 'bg-blue-100 text-blue-800 border-blue-200', icon: <BiMessageDetail />, label: 'Yanıtlandı' },
      waiting_user: { color: 'bg-purple-100 text-purple-800 border-purple-200', icon: <BiTimeFive />, label: 'Bekliyor' },
      resolved: { color: 'bg-green-100 text-green-800 border-green-200', icon: <BiCheckCircle />, label: 'Çözüldü' },
      closed: { color: 'bg-gray-100 text-gray-800 border-gray-200', icon: <BiXCircle />, label: 'Kapalı' }
    };
    const current = config[status] || config.open;
    return (
      <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${current.color}`}>
        {current.icon} 
        <span className="hidden sm:inline">{current.label}</span>
      </span>
    );
  };

  const filteredTickets = tickets.filter(ticket => {
    if (filter === 'all') return true;
    if (filter === 'open') return ['open', 'answered', 'waiting_user'].includes(ticket.status);
    if (filter === 'closed') return ['resolved', 'closed'].includes(ticket.status);
    return true;
  });

  // Statlar
  const stats = {
    total: tickets.length,
    open: tickets.filter(t => ['open', 'answered', 'waiting_user'].includes(t.status)).length,
    closed: tickets.filter(t => ['resolved', 'closed'].includes(t.status)).length,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  // Detay Görünümü
  if (selectedTicket) {
    return (
      <div className="min-h-screen bg-gray-50 pb-24 md:pb-10">
        <StatusModal 
          isOpen={popup.isOpen} 
          {...popup} 
          onClose={() => setPopup({ ...popup, isOpen: false })} 
        />

        <ModernHeader 
          title="Destek Talebi"
          user={user}
          onLogout={() => { logout(); navigate('/login'); }}
          onProfileClick={() => navigate('/profile')}
          showBackButton={true}
          onBack={() => setSelectedTicket(null)}
        />

        {/* Desktop: 2 Kolon, Mobile: 1 Kolon */}
        <main className="max-w-7xl mx-auto px-4 md:px-6 pt-4 md:pt-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* SOL PANEL - Ticket Bilgileri (Desktop'ta sticky) */}
            <div className="lg:col-span-4">
              <div className="lg:sticky lg:top-24 space-y-4">
                {/* Ticket Header */}
                <div className="bg-white rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="font-mono text-xs md:text-sm font-bold text-gray-400">
                      #{selectedTicket.ticket_number}
                    </span>
                    {getStatusBadge(selectedTicket.status)}
                  </div>
                  
                  <div className="space-y-3">
                    <InfoRow label="Kategori" value={getCategoryLabel(selectedTicket.category)} />
                    <InfoRow label="Oluşturma" value={new Date(selectedTicket.created_at).toLocaleDateString('tr-TR')} />
                    {selectedTicket.order_number && (
                      <InfoRow label="Teslimat" value={`#${selectedTicket.order_number}`} />
                    )}
                    {selectedTicket.closed_at && (
                      <InfoRow label="Kapatılma" value={new Date(selectedTicket.closed_at).toLocaleDateString('tr-TR')} />
                    )}
                  </div>
                </div>

                {/* Yardım Kutusu */}
                <div className="hidden lg:block bg-blue-50 rounded-2xl p-6 border border-blue-100">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                      <BiInfoCircle size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm mb-1">Destek Hakkında</h4>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        Destek ekibimiz size en kısa sürede dönüş yapacaktır. Ortalama yanıt süresi 2-4 saattir.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SAĞ PANEL - Mesajlar */}
            <div className="lg:col-span-8">
              {/* Mesajlar */}
              <div className="bg-white rounded-2xl md:rounded-3xl shadow-sm border border-gray-100 mb-4">
                <div className="p-4 md:p-6 border-b border-gray-100">
                  <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    <BiMessageDetail /> Mesajlaşma
                  </h3>
                </div>
                <div className="p-4 md:p-6 space-y-3 md:space-y-4 max-h-[500px] lg:max-h-[600px] overflow-y-auto">
                  {selectedTicket.messages && selectedTicket.messages.map((msg) => (
                    <div 
                      key={msg.id} 
                      className={`flex ${msg.is_admin_reply ? 'justify-start' : 'justify-end'}`}
                    >
                      <div className={`
                        max-w-[85%] lg:max-w-[70%]
                        ${msg.is_admin_reply ? 'bg-blue-50 text-blue-900' : 'bg-gray-900 text-white'} 
                        rounded-2xl p-3 md:p-4
                      `}>
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`
                            w-6 h-6 rounded-full 
                            ${msg.is_admin_reply ? 'bg-blue-200' : 'bg-yellow-400'} 
                            flex items-center justify-center text-xs font-bold
                          `}>
                            {msg.is_admin_reply ? '👨‍💼' : <BiUser />}
                          </div>
                          <span className="text-[10px] md:text-xs font-bold opacity-80">
                            {msg.sender_name}
                          </span>
                        </div>
                        <p className="text-xs md:text-sm leading-relaxed whitespace-pre-wrap break-words">
                          {msg.message}
                        </p>
                        <div className="text-[9px] md:text-[10px] opacity-60 mt-2">
                          {new Date(msg.created_at).toLocaleString('tr-TR')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mesaj Gönder */}
              {selectedTicket.status !== 'closed' && (
                <form onSubmit={handleSendMessage} className="bg-white rounded-2xl md:rounded-3xl p-3 md:p-4 shadow-sm border border-gray-100">
                  <div className="flex flex-col lg:flex-row gap-2 md:gap-3">
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Mesajınızı yazın..."
                      className="flex-1 px-3 md:px-4 py-2 md:py-3 border border-gray-200 rounded-xl md:rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none text-sm md:text-base"
                      rows="2"
                      disabled={messageLoading}
                    />
                    <button
                      type="submit"
                      disabled={messageLoading || !newMessage.trim()}
                      className="w-full lg:w-auto px-4 md:px-6 py-2.5 md:py-3 bg-gray-900 hover:bg-black text-white font-bold rounded-xl md:rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm md:text-base"
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

  // Liste Görünümü - 2 KOLONLU LAYOUT
  return (
    <div className="min-h-screen bg-gray-50 pb-24 md:pb-10">
      <StatusModal 
        isOpen={popup.isOpen} 
        {...popup} 
        onClose={() => setPopup({ ...popup, isOpen: false })} 
      />

      <ModernHeader 
        title="Destek"
        user={user}
        onLogout={() => { logout(); navigate('/login'); }}
        onProfileClick={() => navigate('/profile')}
        showBackButton={true}
        onBack={() => navigate(-1)}
      />

      <main className="max-w-7xl mx-auto px-4 md:px-6 pt-4 md:pt-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 md:p-4 rounded-xl md:rounded-2xl mb-4 md:mb-6 flex items-center gap-2 md:gap-3 text-sm md:text-base">
            <BiXCircle size={20} className="md:w-6 md:h-6 flex-shrink-0" /> 
            <span className="text-xs md:text-sm">{error}</span>
          </div>
        )}

        {/* Desktop: 2 Kolon, Mobile: 1 Kolon */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* SOL PANEL - İstatistikler & Hızlı Erişim */}
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-24 space-y-4 md:space-y-6">
              
              {/* Yeni Talep Butonu */}
              <button
                onClick={() => setShowCreateModal(true)}
                className="w-full py-3 md:py-4 bg-gray-900 hover:bg-black text-white font-bold rounded-2xl md:rounded-3xl shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-transform text-sm md:text-base"
              >
                <BiPlus size={20} className="md:w-6 md:h-6" /> 
                <span>Yeni Destek Talebi</span>
              </button>

              {/* İstatistikler */}
              <div className="grid grid-cols-3 gap-3">
                <StatCard label="Toplam" value={stats.total} color="bg-gray-100 text-gray-700" />
                <StatCard label="Açık" value={stats.open} color="bg-yellow-100 text-yellow-700" />
                <StatCard label="Kapalı" value={stats.closed} color="bg-green-100 text-green-700" />
              </div>

              {/* Bilgi Kutusu */}
              <div className="hidden lg:block bg-yellow-50 rounded-2xl md:rounded-3xl p-6 border border-yellow-100">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-yellow-100 rounded-lg text-yellow-700 shrink-0">
                    <BiInfoCircle size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm mb-2">Nasıl Yardımcı Olabiliriz?</h4>
                    <ul className="text-xs text-gray-600 space-y-1.5">
                      <li>• Teslimat sorunları</li>
                      <li>• Ödeme soruları</li>
                      <li>• Hesap ayarları</li>
                      <li>• Teknik destek</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SAĞ PANEL - Ticket Listesi */}
          <div className="lg:col-span-8">
            
            {/* Filtreler */}
            <div className="flex bg-white p-1 rounded-xl md:rounded-2xl shadow-sm border border-gray-100 mb-4 md:mb-6">
              <FilterButton active={filter === 'all'} onClick={() => setFilter('all')}>
                <span className="hidden sm:inline">Tümü </span>({stats.total})
              </FilterButton>
              <FilterButton active={filter === 'open'} onClick={() => setFilter('open')}>
                <span className="hidden sm:inline">Açık </span>({stats.open})
              </FilterButton>
              <FilterButton active={filter === 'closed'} onClick={() => setFilter('closed')}>
                <span className="hidden sm:inline">Kapalı </span>({stats.closed})
              </FilterButton>
            </div>

            {/* Ticket Listesi */}
            {filteredTickets.length === 0 ? (
              <div className="text-center py-12 md:py-16 bg-white rounded-2xl md:rounded-3xl border-2 border-dashed border-gray-100">
                <BiMessageDetail size={40} className="md:w-12 md:h-12 text-gray-300 mx-auto mb-3 md:mb-4" />
                <h3 className="text-base md:text-lg font-bold text-gray-900">Henüz Talep Yok</h3>
                <p className="text-gray-500 mt-1 text-xs md:text-sm px-4">
                  Bir sorun yaşıyorsanız destek talebi oluşturabilirsiniz.
                </p>
              </div>
            ) : (
              <div className="space-y-3 md:space-y-4">
                {filteredTickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    onClick={() => handleViewTicket(ticket.id)}
                    className="bg-white rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer group"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="font-mono text-xs md:text-sm font-bold text-gray-400">
                            #{ticket.ticket_number}
                          </span>
                          {getStatusBadge(ticket.status)}
                        </div>
                        <span className="inline-block px-2.5 md:px-3 py-1 md:py-1.5 bg-gray-50 text-gray-700 text-xs md:text-sm font-bold rounded-lg truncate max-w-full">
                          {getCategoryLabel(ticket.category)}
                        </span>
                      </div>
                      <BiChevronRight className="text-gray-400 group-hover:text-gray-900 transition-colors flex-shrink-0 ml-2" size={20} />
                    </div>

                    <p className="text-gray-600 text-xs md:text-sm line-clamp-2 mb-3 break-words">
                      {ticket.first_message}
                    </p>

                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 text-[10px] md:text-xs text-gray-400">
                      <div className="flex items-center gap-3 md:gap-4">
                        <span>{new Date(ticket.created_at).toLocaleDateString('tr-TR')}</span>
                        <span className="flex items-center gap-1">
                          <BiMessageDetail size={14} /> {ticket.message_count}
                        </span>
                      </div>
                      {ticket.unread_count > 0 && (
                        <span className="bg-yellow-400 text-gray-900 px-2 py-1 rounded-full text-[10px] md:text-xs font-bold w-fit">
                          {ticket.unread_count} yeni
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </main>

      {/* Create Ticket Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl md:rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-4 md:p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
              <h2 className="text-lg md:text-xl font-black text-gray-900">Yeni Destek Talebi</h2>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition"
              >
                <BiXCircle size={20} className="md:w-6 md:h-6" />
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="p-4 md:p-6 space-y-4 md:space-y-5">
              <div>
                <label className="block text-xs md:text-sm font-bold text-gray-700 mb-2">
                  Konu <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 md:px-4 py-2.5 md:py-3 border border-gray-200 rounded-xl md:rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm md:text-base"
                  required
                >
                  <option value="">Seçiniz</option>
                  <option value="delivery">🚚 Teslimat Sorunu</option>
                  <option value="payment">💳 Ödeme Sorunu</option>
                  <option value="account">👤 Hesap/Profil</option>
                  <option value="technical">⚙️ Teknik Sorun</option>
                  <option value="other">❓ Diğer</option>
                </select>
              </div>

              <div>
                <label className="block text-xs md:text-sm font-bold text-gray-700 mb-2">
                  Mesaj <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Sorununuzu detaylı açıklayın... (En az 10 karakter)"
                  className="w-full px-3 md:px-4 py-2.5 md:py-3 border border-gray-200 rounded-xl md:rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none text-sm md:text-base"
                  rows="5"
                  minLength="10"
                  required
                />
                <p className="text-[10px] md:text-xs text-gray-400 mt-1">
                  {formData.message.length}/2000 karakter
                </p>
              </div>

              {myDeliveries.length > 0 && (
                <div>
                  <label className="block text-xs md:text-sm font-bold text-gray-700 mb-2">
                    Teslimat (Opsiyonel)
                  </label>
                  <select
                    value={formData.delivery_id || ''}
                    onChange={(e) => setFormData({ ...formData, delivery_id: e.target.value || null })}
                    className="w-full px-3 md:px-4 py-2.5 md:py-3 border border-gray-200 rounded-xl md:rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm md:text-base"
                  >
                    <option value="">Teslimatla ilgiliyse seçin</option>
                    {myDeliveries.map((delivery) => (
                      <option key={delivery.id} value={delivery.id}>
                        #{delivery.order_number} - {delivery.pickup_district} → {delivery.delivery_district}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-2 md:gap-3 pt-2 md:pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="w-full sm:flex-1 py-2.5 md:py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl md:rounded-2xl transition text-sm md:text-base"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="w-full sm:flex-1 py-2.5 md:py-3 bg-gray-900 hover:bg-black text-white font-bold rounded-xl md:rounded-2xl transition disabled:opacity-50 text-sm md:text-base"
                >
                  {formLoading ? 'Oluşturuluyor...' : 'Talep Oluştur'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper Components
const FilterButton = ({ active, onClick, children }) => (
  <button 
    onClick={onClick} 
    className={`
      flex-1 py-2.5 md:py-3 text-xs md:text-sm font-bold rounded-lg md:rounded-xl transition-all 
      ${active ? 'bg-gray-900 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}
    `}
  >
    {children}
  </button>
);

const StatCard = ({ label, value, color }) => (
  <div className={`${color} rounded-xl md:rounded-2xl p-3 md:p-4 text-center`}>
    <div className="text-2xl md:text-3xl font-black mb-1">{value}</div>
    <div className="text-[10px] md:text-xs font-bold uppercase opacity-80">{label}</div>
  </div>
);

const InfoRow = ({ label, value }) => (
  <div className="flex justify-between items-center text-sm py-2 border-b border-gray-50 last:border-0">
    <span className="text-gray-500 font-medium">{label}</span>
    <span className="text-gray-900 font-bold text-right break-words max-w-[60%]">{value}</span>
  </div>
);