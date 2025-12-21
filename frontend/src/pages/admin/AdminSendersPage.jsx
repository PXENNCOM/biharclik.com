import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../../services/adminService';

// Modern Header
import { ModernHeader } from '../common/ModernHeader';

// İkonlar
import { 
  BiSearch, 
  BiFilterAlt, 
  BiUser, 
  BiBuilding, 
  BiPhone, 
  BiEnvelope, 
  BiMap, 
  BiCheckCircle, 
  BiXCircle, 
  BiShow, 
  BiBlock, 
  BiPackage, 
  BiWallet,
  BiStore,
  BiX
} from 'react-icons/bi';

export const AdminSendersPage = () => {
  const navigate = useNavigate();
  const [senders, setSenders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedSender, setSelectedSender] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
  // Filtreler
  const [filters, setFilters] = useState({
    is_active: undefined,
    sender_type: undefined,
  });

  // İstatistikler (Frontend tarafında hesaplanan basit özet)
  const [stats, setStats] = useState({
    total: 0,
    individual: 0,
    corporate: 0,
    totalSpent: 0
  });

  useEffect(() => {
    fetchSenders();
  }, [filters]);

  const fetchSenders = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAllSenders({
        ...filters,
        limit: 100
      });
      
      const sendersData = response.data.data?.senders || response.data.senders || [];
      setSenders(sendersData);

      // Basit istatistik hesaplama
      setStats({
        total: sendersData.length,
        individual: sendersData.filter(s => s.sender_type === 'individual').length,
        corporate: sendersData.filter(s => s.sender_type === 'corporate').length,
        totalSpent: sendersData.reduce((sum, s) => sum + parseFloat(s.total_spent || 0), 0)
      });

    } catch (err) {
      setError(err.response?.data?.message || 'Göndericiler yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (senderId) => {
    try {
      const response = await adminService.getSenderDetail(senderId);
      const senderData = response.data.data || response.data;
      setSelectedSender(senderData);
      setShowModal(true);
    } catch (err) {
      alert(err.response?.data?.message || 'Detay yüklenemedi');
    }
  };

  const handleToggleStatus = async (senderId, currentStatus) => {
    const newStatus = !currentStatus;
    const action = newStatus ? 'aktif' : 'pasif';
    
    if (!confirm(`Göndericiyi ${action} yapmak istediğinize emin misiniz?`)) return;

    try {
      await adminService.toggleUserStatus(senderId, newStatus);
      // Listeyi yenile
      fetchSenders();
      if (selectedSender && selectedSender.id === senderId) {
          setSelectedSender({...selectedSender, is_active: newStatus});
      }
      // Modal açıksa kapatmaya gerek yok, sadece state güncellendi
    } catch (err) {
      alert(err.response?.data?.message || 'Durum değiştirilemedi');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(amount || 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-yellow-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-20">
      
      {/* Header */}
      <ModernHeader 
        title="Gönderici Yönetimi"
        showBackButton={true}
        onBackClick={() => navigate('/admin/dashboard')}
        onLogout={() => navigate('/login')}
      />

      {/* Content */}
      <main className="max-w-7xl mx-auto px-5 pt-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl mb-6 flex items-center gap-3">
            <BiXCircle size={24} />
            {error}
          </div>
        )}

        {/* --- İSTATİSTİK KARTLARI --- */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatsCard title="Toplam" value={stats.total} icon={<BiStore/>} color="bg-blue-50 text-blue-700" />
            <StatsCard title="Bireysel" value={stats.individual} icon={<BiUser/>} color="bg-purple-50 text-purple-700" />
            <StatsCard title="Kurumsal" value={stats.corporate} icon={<BiBuilding/>} color="bg-orange-50 text-orange-700" />
            <StatsCard title="Toplam Harcama" value={formatCurrency(stats.totalSpent)} icon={<BiWallet/>} color="bg-green-50 text-green-700" />
        </div>

        {/* --- FİLTRELEME ALANI --- */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 mb-6">
             <div className="flex items-center gap-2 mb-4 px-1">
                <BiFilterAlt className="text-gray-500" /> 
                <h3 className="font-bold text-gray-900">Filtreleme Seçenekleri</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Durum */}
                <div className="relative">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Hesap Durumu</label>
                    <select
                        className="w-full pl-4 pr-8 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-yellow-400 outline-none transition appearance-none"
                        value={filters.is_active === undefined ? '' : filters.is_active.toString()}
                        onChange={(e) => setFilters({...filters, is_active: e.target.value === '' ? undefined : e.target.value === 'true'})}
                    >
                        <option value="">Tümü</option>
                        <option value="true">Aktif Göndericiler</option>
                        <option value="false">Pasif Göndericiler</option>
                    </select>
                    <div className="absolute top-9 right-3 pointer-events-none text-gray-400 text-xs">▼</div>
                </div>

                {/* Tip */}
                <div className="relative">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Müşteri Tipi</label>
                    <select
                        className="w-full pl-4 pr-8 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-yellow-400 outline-none transition appearance-none"
                        value={filters.sender_type || ''}
                        onChange={(e) => setFilters({...filters, sender_type: e.target.value === '' ? undefined : e.target.value})}
                    >
                        <option value="">Tümü</option>
                        <option value="individual">Bireysel Müşteri</option>
                        <option value="corporate">Kurumsal Firma</option>
                    </select>
                    <div className="absolute top-9 right-3 pointer-events-none text-gray-400 text-xs">▼</div>
                </div>
            </div>
        </div>

        {/* --- GÖNDERİCİ LİSTESİ --- */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50/50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Gönderici</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Tip</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">İletişim</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Performans</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Durum</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">İşlem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {senders.map((sender) => (
                  <tr key={sender.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                         <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                             sender.sender_type === 'corporate' ? 'bg-gray-900' : 'bg-yellow-400 text-gray-900'
                         }`}>
                            {sender.sender_type === 'corporate' ? <BiBuilding size={18}/> : <BiUser size={18}/>}
                         </div>
                         <div>
                            <div className="font-bold text-gray-900">
                                {sender.first_name ? `${sender.first_name} ${sender.last_name}` : sender.company_name}
                            </div>
                            <div className="text-xs text-gray-400 font-mono">ID: {sender.id}</div>
                         </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wide border ${
                        sender.sender_type === 'corporate' 
                          ? 'bg-gray-100 text-gray-700 border-gray-200' 
                          : 'bg-yellow-50 text-yellow-700 border-yellow-100'
                      }`}>
                        {sender.sender_type === 'corporate' ? '🏢 Kurumsal' : '👤 Bireysel'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{sender.email}</div>
                      <div className="text-xs text-gray-500">{sender.phone}</div>
                    </td>
                    <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-gray-900">{sender.total_orders || 0} Sipariş</span>
                            <span className="text-xs text-gray-400">|</span>
                            <span className="text-sm font-bold text-green-600">{formatCurrency(sender.total_spent)}</span>
                        </div>
                    </td>
                    <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wide ${
                            sender.is_active ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                        }`}>
                            {sender.is_active ? <><BiCheckCircle/> Aktif</> : <><BiXCircle/> Pasif</>}
                        </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                            <button 
                                onClick={() => handleViewDetails(sender.id)}
                                className="p-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:text-blue-600 hover:border-blue-200 transition"
                                title="Detayları Gör"
                            >
                                <BiShow size={18} />
                            </button>
                            <button 
                                onClick={() => handleToggleStatus(sender.id, sender.is_active)}
                                className={`p-2 bg-white border border-gray-200 rounded-lg transition ${
                                    sender.is_active 
                                    ? 'text-red-500 hover:text-red-700 hover:border-red-200' 
                                    : 'text-green-500 hover:text-green-700 hover:border-green-200'
                                }`}
                                title={sender.is_active ? 'Pasife Al' : 'Aktifleştir'}
                            >
                                {sender.is_active ? <BiBlock size={18} /> : <BiCheckCircle size={18} />}
                            </button>
                        </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* --- DETAY MODAL --- */}
      {showModal && selectedSender && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
                 <div className="flex items-center gap-4">
                     <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-md ${
                          selectedSender.sender_type === 'corporate' ? 'bg-gray-900 text-white' : 'bg-yellow-400 text-gray-900'
                     }`}>
                        {selectedSender.sender_type === 'corporate' ? <BiBuilding /> : <BiUser />}
                     </div>
                     <div>
                        <h2 className="text-xl font-black text-gray-900">
                             {selectedSender.first_name ? `${selectedSender.first_name} ${selectedSender.last_name}` : selectedSender.company_name}
                        </h2>
                        <p className="text-sm text-gray-500 font-medium flex items-center gap-2">
                            {selectedSender.sender_type === 'corporate' ? 'Kurumsal Müşteri' : 'Bireysel Müşteri'}
                             <span className={`w-2 h-2 rounded-full ${selectedSender.is_active ? 'bg-green-500' : 'bg-red-500'}`}></span>
                        </p>
                     </div>
                </div>
                <button onClick={() => setShowModal(false)} className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition">
                    <BiX size={24} />
                </button>
            </div>

            <div className="p-6">
              
              {/* Bilgiler Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                 {/* Sol Taraf: İletişim & Kimlik */}
                 <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-sm uppercase tracking-wide">
                        <BiUser className="text-gray-400"/> Hesap Bilgileri
                    </h3>
                    <div className="space-y-3 text-sm">
                        {selectedSender.sender_type === 'individual' ? (
                            <>
                                <InfoRow label="TC No" value={selectedSender.tc_no} mono />
                                <InfoRow label="Ad Soyad" value={`${selectedSender.first_name} ${selectedSender.last_name}`} />
                            </>
                        ) : (
                            <>
                                <InfoRow label="Firma" value={selectedSender.company_name} />
                                <InfoRow label="Vergi D." value={selectedSender.tax_office} />
                                <InfoRow label="Vergi No" value={selectedSender.tax_number} mono />
                            </>
                        )}
                        <div className="h-px bg-gray-200 my-2"></div>
                        <InfoRow label="Email" value={selectedSender.email} />
                        <InfoRow label="Telefon" value={selectedSender.phone} />
                    </div>
                 </div>
                 
                 {/* Sağ Taraf: Adres */}
                 <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                     <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-sm uppercase tracking-wide">
                        <BiMap className="text-gray-400"/> Fatura Adresi
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed bg-white p-3 rounded-xl border border-gray-200">
                        {selectedSender.billing_address || 'Adres girilmemiş.'}
                    </p>
                 </div>
              </div>

              {/* Performans İstatistikleri */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-blue-50 p-4 rounded-2xl text-center border border-blue-100">
                    <p className="text-3xl font-black text-blue-600">{selectedSender.total_orders || 0}</p>
                    <p className="text-xs font-bold text-blue-400 uppercase">Toplam</p>
                </div>
                <div className="bg-green-50 p-4 rounded-2xl text-center border border-green-100">
                    <p className="text-3xl font-black text-green-600">{selectedSender.completed_orders || 0}</p>
                    <p className="text-xs font-bold text-green-400 uppercase">Tamamlanan</p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-2xl text-center border border-yellow-100">
                    <p className="text-xl font-black text-yellow-600 mt-1">{formatCurrency(selectedSender.total_spent)}</p>
                    <p className="text-xs font-bold text-yellow-500 uppercase mt-1">Harcama</p>
                </div>
              </div>

              {/* Aksiyonlar */}
              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button onClick={() => setShowModal(false)} className="flex-1 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition">
                    Kapat
                </button>
                <button
                  onClick={() => handleToggleStatus(selectedSender.id, selectedSender.is_active)}
                  className={`flex-1 py-3.5 font-bold rounded-xl transition flex items-center justify-center gap-2 ${
                    selectedSender.is_active
                      ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
                      : 'bg-green-600 text-white hover:bg-green-700 shadow-lg shadow-green-200'
                  }`}
                >
                  {selectedSender.is_active ? <><BiBlock /> Pasife Al</> : <><BiCheckCircle /> Aktifleştir</>}
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- YARDIMCI BİLEŞENLER ---
const StatsCard = ({ title, value, icon, color }) => (
    <div className={`p-4 rounded-2xl flex flex-col items-start justify-between h-full ${color} bg-opacity-10 border border-opacity-20`}>
        <div className="flex items-center gap-2 mb-2 opacity-80 text-sm font-bold uppercase">
            {icon} {title}
        </div>
        <div className="text-2xl font-black">{value}</div>
    </div>
);

const InfoRow = ({ label, value, mono }) => (
    <div className="flex justify-between items-center">
        <span className="text-gray-500 font-medium">{label}</span>
        <span className={`text-gray-900 font-bold ${mono ? 'font-mono' : ''} text-right truncate max-w-[180px]`}>
            {value || '-'}
        </span>
    </div>
);