import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import api from '../../services/api';

// Modern Header
import { ModernHeader } from '../common/ModernHeader';

// İkonlar
import { 
  BiCalendar, 
  BiTrendingUp, 
  BiWallet, 
  BiPackage, 
  BiUser, 
  BiTimeFive, 
  BiCheckCircle, 
  BiXCircle, 
  BiTrophy, 
  BiPrinter,
  BiFilterAlt,
  BiStore,
  BiGroup
} from 'react-icons/bi';

export const AdminReportsPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Data
  const [deliveries, setDeliveries] = useState([]);
  const [students, setStudents] = useState([]);
  const [senders, setSenders] = useState([]);
  
  // Period filter
  const [period, setPeriod] = useState('all'); // all, today, week, month, custom
  const [customDateFrom, setCustomDateFrom] = useState('');
  const [customDateTo, setCustomDateTo] = useState('');
  
  // Stats
  const [stats, setStats] = useState({
    // İşler
    totalDeliveries: 0,
    pendingDeliveries: 0,
    completedDeliveries: 0,
    cancelledDeliveries: 0,
    
    // Gelir
    totalRevenue: 0,
    todayRevenue: 0,
    weekRevenue: 0,
    monthRevenue: 0,
    selectedPeriodRevenue: 0,
    
    // Ödemeler
    pendingPayments: 0, // Bekleyen öğrenci ödemeleri
    paidToStudents: 0,
    
    // Kullanıcılar
    totalStudents: 0,
    activeStudents: 0,
    totalSenders: 0,
    activeSenders: 0,
    
    // En iyi performans
    topStudent: null,
    topSender: null,
  });

  useEffect(() => {
    fetchAllData();
  }, []);

  useEffect(() => {
    if (deliveries.length > 0) {
      calculateStats();
    }
  }, [period, customDateFrom, customDateTo, deliveries]);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      
      const deliveriesRes = await api.get('/deliveries/admin/all');
      const deliveriesData = deliveriesRes.data.data?.deliveries || deliveriesRes.data.deliveries || [];
      setDeliveries(deliveriesData);
      
      const studentsRes = await adminService.getAllStudents({ limit: 1000 });
      const studentsData = studentsRes.data.data?.students || studentsRes.data.students || [];
      setStudents(studentsData);
      
      const sendersRes = await adminService.getAllSenders({ limit: 1000 });
      const sendersData = sendersRes.data.data?.senders || sendersRes.data.senders || [];
      setSenders(sendersData);
      
    } catch (err) {
      setError(err.response?.data?.message || 'Veriler yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const getFilteredDeliveries = () => {
    const now = new Date();
    let filtered = deliveries;

    if (period === 'today') {
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      filtered = deliveries.filter(d => new Date(d.created_at) >= today);
    } else if (period === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      filtered = deliveries.filter(d => new Date(d.created_at) >= weekAgo);
    } else if (period === 'month') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      filtered = deliveries.filter(d => new Date(d.created_at) >= monthAgo);
    } else if (period === 'custom') {
      if (customDateFrom) {
        filtered = filtered.filter(d => new Date(d.created_at) >= new Date(customDateFrom));
      }
      if (customDateTo) {
        filtered = filtered.filter(d => new Date(d.created_at) <= new Date(customDateTo));
      }
    }

    return filtered;
  };

  const calculateStats = () => {
    const filtered = getFilteredDeliveries();
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // İş istatistikleri
    const completed = filtered.filter(d => d.status === 'completed');
    const selectedPeriodRevenue = completed.reduce((sum, d) => sum + parseFloat(d.payment_amount || 0), 0);

    // Genel Gelirler (Filtreden bağımsız özet için)
    const totalRevenue = deliveries.filter(d => d.status === 'completed').reduce((sum, d) => sum + parseFloat(d.payment_amount || 0), 0);
    
    const todayDeliveries = deliveries.filter(d => new Date(d.created_at) >= today && d.status === 'completed');
    const todayRevenue = todayDeliveries.reduce((sum, d) => sum + parseFloat(d.payment_amount || 0), 0);

    const weekDeliveries = deliveries.filter(d => new Date(d.created_at) >= weekAgo && d.status === 'completed');
    const weekRevenue = weekDeliveries.reduce((sum, d) => sum + parseFloat(d.payment_amount || 0), 0);

    const monthDeliveries = deliveries.filter(d => new Date(d.created_at) >= monthAgo && d.status === 'completed');
    const monthRevenue = monthDeliveries.reduce((sum, d) => sum + parseFloat(d.payment_amount || 0), 0);

    // Ödeme istatistikleri
    const pendingPayments = deliveries
      .filter(d => d.status === 'completed' && d.payment_status === 'sender_paid')
      .reduce((sum, d) => sum + parseFloat(d.payment_amount || 0), 0);

    const paidToStudents = deliveries
      .filter(d => d.payment_status === 'student_paid')
      .reduce((sum, d) => sum + parseFloat(d.payment_amount || 0), 0);

    // Kullanıcı istatistikleri
    const activeStudents = students.filter(s => s.is_active).length;
    const activeSenders = senders.filter(s => s.is_active).length;

    // En iyi performans
    const studentDeliveries = {};
    deliveries.forEach(d => {
      if (d.student_user_id && d.status === 'completed') {
        studentDeliveries[d.student_user_id] = (studentDeliveries[d.student_user_id] || 0) + 1;
      }
    });
    const topStudentId = Object.keys(studentDeliveries).sort((a, b) => 
      studentDeliveries[b] - studentDeliveries[a]
    )[0];
    const topStudent = students.find(s => s.id === parseInt(topStudentId));

    const senderOrders = {};
    deliveries.forEach(d => {
      if (d.sender_user_id) {
        senderOrders[d.sender_user_id] = (senderOrders[d.sender_user_id] || 0) + 1;
      }
    });
    const topSenderId = Object.keys(senderOrders).sort((a, b) => 
      senderOrders[b] - senderOrders[a]
    )[0];
    const topSender = senders.find(s => s.id === parseInt(topSenderId));

    setStats({
      totalDeliveries: filtered.length,
      pendingDeliveries: filtered.filter(d => d.status === 'pending').length,
      completedDeliveries: completed.length,
      cancelledDeliveries: filtered.filter(d => d.status === 'cancelled').length,
      
      totalRevenue,
      todayRevenue,
      weekRevenue,
      monthRevenue,
      selectedPeriodRevenue,
      
      pendingPayments,
      paidToStudents,
      
      totalStudents: students.length,
      activeStudents,
      totalSenders: senders.length,
      activeSenders,
      
      topStudent: topStudent ? {
        name: `${topStudent.first_name} ${topStudent.last_name}`,
        count: studentDeliveries[topStudentId]
      } : null,
      topSender: topSender ? {
        name: topSender.company_name || `${topSender.first_name} ${topSender.last_name}`,
        count: senderOrders[topSenderId]
      } : null,
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(amount || 0);
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
        title="Raporlar & Analiz"
        onLogout={() => navigate('/login')}
        onProfileClick={() => navigate('/profile')}
        showBackButton={true}
        onBackClick={() => navigate('/admin/dashboard')}
      />

      <main className="max-w-7xl mx-auto px-5 pt-6">
        
        {/* --- FİLTRELEME ALANI --- */}
        <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 mb-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-2 px-2">
                    <BiFilterAlt className="text-gray-400" size={20} />
                    <span className="text-sm font-bold text-gray-500 uppercase">Dönem Seçimi:</span>
                </div>
                
                <div className="flex bg-gray-100 p-1 rounded-2xl w-full md:w-auto overflow-x-auto">
                    {['all', 'today', 'week', 'month', 'custom'].map((p) => (
                        <button
                            key={p}
                            onClick={() => setPeriod(p)}
                            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                                period === p 
                                ? 'bg-white text-gray-900 shadow-sm' 
                                : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            {p === 'all' && 'Tümü'}
                            {p === 'today' && 'Bugün'}
                            {p === 'week' && 'Bu Hafta'}
                            {p === 'month' && 'Bu Ay'}
                            {p === 'custom' && 'Özel Tarih'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Özel Tarih Seçimi */}
            {period === 'custom' && (
                <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-100 animate-in slide-in-from-top-2">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">Başlangıç</label>
                        <input type="date" className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2 text-sm" value={customDateFrom} onChange={(e) => setCustomDateFrom(e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">Bitiş</label>
                        <input type="date" className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2 text-sm" value={customDateTo} onChange={(e) => setCustomDateTo(e.target.value)} />
                    </div>
                </div>
            )}
        </div>

        {/* --- ANA İSTATİSTİKLER (GELİR) --- */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
             {/* Seçili Dönem Ciro (SARI - HERO) */}
             <div className="md:col-span-2 bg-yellow-400 p-6 rounded-3xl shadow-lg shadow-yellow-200 relative overflow-hidden flex flex-col justify-between h-full">
                 <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-1 opacity-90">
                        <BiTrendingUp size={24} />
                        <span className="font-bold text-gray-900">Seçili Dönem Ciro</span>
                    </div>
                    <p className="text-5xl font-black text-gray-900">{formatCurrency(stats.selectedPeriodRevenue)}</p>
                 </div>
                 <div className="relative z-10 mt-4 text-sm font-medium text-gray-800/80">
                    {stats.completedDeliveries} adet başarılı işlemden
                 </div>
                 {/* Dekoratif */}
                 <BiWallet className="absolute -bottom-8 -right-8 w-48 h-48 text-white opacity-20 rotate-12" />
             </div>

             {/* Hızlı Özet Kartları */}
             <div className="md:col-span-2 grid grid-cols-2 gap-4">
                 <StatsCard 
                    title="Bugün" 
                    value={formatCurrency(stats.todayRevenue)} 
                    icon={<BiCalendar />}
                    color="bg-gray-900 text-white"
                 />
                 <StatsCard 
                    title="Bu Hafta" 
                    value={formatCurrency(stats.weekRevenue)} 
                    icon={<BiCalendar />}
                    color="bg-white text-gray-900 border border-gray-200"
                 />
                 <StatsCard 
                    title="Bu Ay" 
                    value={formatCurrency(stats.monthRevenue)} 
                    icon={<BiCalendar />}
                    color="bg-white text-gray-900 border border-gray-200"
                 />
                 <StatsCard 
                    title="Toplam Ciro" 
                    value={formatCurrency(stats.totalRevenue)} 
                    icon={<BiWallet />}
                    color="bg-green-50 text-green-700 border border-green-100"
                 />
             </div>
        </div>

        {/* --- OPERASYONEL DURUM --- */}
        <h2 className="text-lg font-bold text-gray-900 mb-4 px-1 flex items-center gap-2">
            <BiPackage /> Operasyonel Durum
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
             <StatusCard label="Toplam İş" value={stats.totalDeliveries} color="bg-blue-50 text-blue-700" icon={<BiPackage/>} />
             <StatusCard label="Bekleyen" value={stats.pendingDeliveries} color="bg-yellow-50 text-yellow-700" icon={<BiTimeFive/>} />
             <StatusCard label="Tamamlanan" value={stats.completedDeliveries} color="bg-green-50 text-green-700" icon={<BiCheckCircle/>} />
             <StatusCard label="İptal" value={stats.cancelledDeliveries} color="bg-red-50 text-red-700" icon={<BiXCircle/>} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
             {/* Ödeme Durumu */}
             <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                 <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <span className="p-2 bg-purple-100 text-purple-700 rounded-lg"><BiWallet size={20}/></span>
                    Ödeme Havuzu
                 </h3>
                 <div className="space-y-4">
                     <div className="flex justify-between items-center p-4 bg-yellow-50 border border-yellow-100 rounded-2xl">
                        <div>
                            <p className="text-xs font-bold text-yellow-700 uppercase">Öğrenciye Ödenecek</p>
                            <p className="text-2xl font-black text-gray-900">{formatCurrency(stats.pendingPayments)}</p>
                        </div>
                        <div className="text-right">
                            <button className="text-xs font-bold text-yellow-700 underline hover:text-yellow-900">Detaylar</button>
                        </div>
                     </div>
                     <div className="flex justify-between items-center p-4 bg-green-50 border border-green-100 rounded-2xl">
                        <div>
                            <p className="text-xs font-bold text-green-700 uppercase">Toplam Ödenen</p>
                            <p className="text-2xl font-black text-gray-900">{formatCurrency(stats.paidToStudents)}</p>
                        </div>
                     </div>
                 </div>
             </div>

             {/* En İyiler (Winners) */}
             <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <span className="p-2 bg-yellow-100 text-yellow-700 rounded-lg"><BiTrophy size={20}/></span>
                    Dönemin Yıldızları
                 </h3>
                 <div className="grid grid-cols-2 gap-4">
                     {/* Top Student */}
                     <div className="text-center p-4 rounded-2xl border border-gray-100 bg-gray-50">
                         <div className="w-12 h-12 mx-auto bg-white rounded-full shadow-sm flex items-center justify-center text-2xl mb-3">🎒</div>
                         <p className="text-xs font-bold text-gray-400 uppercase">En Hızlı Kurye</p>
                         {stats.topStudent ? (
                             <>
                                <p className="font-bold text-gray-900 mt-1">{stats.topStudent.name}</p>
                                <span className="inline-block mt-2 bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded-lg">
                                    {stats.topStudent.count} Teslimat
                                </span>
                             </>
                         ) : <p className="text-sm text-gray-400 mt-2">-</p>}
                     </div>

                      {/* Top Sender */}
                      <div className="text-center p-4 rounded-2xl border border-gray-100 bg-gray-50">
                         <div className="w-12 h-12 mx-auto bg-white rounded-full shadow-sm flex items-center justify-center text-2xl mb-3">📦</div>
                         <p className="text-xs font-bold text-gray-400 uppercase">En Aktif Gönderici</p>
                         {stats.topSender ? (
                             <>
                                <p className="font-bold text-gray-900 mt-1">{stats.topSender.name}</p>
                                <span className="inline-block mt-2 bg-gray-900 text-white text-xs font-bold px-2 py-1 rounded-lg">
                                    {stats.topSender.count} Sipariş
                                </span>
                             </>
                         ) : <p className="text-sm text-gray-400 mt-2">-</p>}
                     </div>
                 </div>
             </div>
        </div>

         {/* Kullanıcı Özet & Print */}
         <div className="bg-gray-900 rounded-3xl p-6 text-white flex flex-col md:flex-row justify-between items-center gap-6 shadow-lg">
            <div className="flex gap-8">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-white/10 rounded-xl"><BiGroup size={24}/></div>
                    <div>
                        <p className="text-2xl font-bold">{stats.totalStudents}</p>
                        <p className="text-xs text-gray-400">Toplam Öğrenci</p>
                    </div>
                </div>
                <div className="w-px bg-gray-700 h-12"></div>
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-white/10 rounded-xl"><BiStore size={24}/></div>
                    <div>
                        <p className="text-2xl font-bold">{stats.totalSenders}</p>
                        <p className="text-xs text-gray-400">Toplam Gönderici</p>
                    </div>
                </div>
            </div>
            
            <button 
                onClick={() => window.print()}
                className="px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-black font-bold rounded-xl transition flex items-center gap-2"
            >
                <BiPrinter /> Raporu Yazdır
            </button>
         </div>

      </main>
    </div>
  );
};

// --- YARDIMCI BİLEŞENLER ---

const StatsCard = ({ title, value, icon, color }) => (
    <div className={`p-4 rounded-2xl flex flex-col justify-between ${color}`}>
        <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-bold uppercase opacity-70">{title}</span>
            <span className="opacity-50">{icon}</span>
        </div>
        <p className="text-lg font-black">{value}</p>
    </div>
);

const StatusCard = ({ label, value, color, icon }) => (
    <div className={`p-4 rounded-2xl border flex items-center gap-3 ${color} bg-opacity-50 border-opacity-20`}>
        <div className="text-xl opacity-80">{icon}</div>
        <div>
            <p className="text-2xl font-black">{value}</p>
            <p className="text-xs font-bold uppercase opacity-70">{label}</p>
        </div>
    </div>
);