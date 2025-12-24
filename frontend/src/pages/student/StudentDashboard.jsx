import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { deliveryService } from '../../services/deliveryService';
import { userService } from '../../services/userService';

// Bileşenler
import { ModernHeader } from '../common/ModernHeader';
import { StatusModal, ConfirmModal } from '../../components/common/ActionModals';
import { JobRouteModal } from './JobRouteModal';
import { JobMapView } from './JobMapView';
import { TermsAndRulesModal } from '../../components/common/TermsAndRulesPage.jsx';

import Banner from '../../assets/banner.png';

// İkonlar
import {
  BiPackage,
  BiNavigation,
  BiCheckCircle,
  BiChevronRight,
  BiBriefcase,
  BiWallet,
  BiErrorCircle,
  BiTimeFive,
  BiMap,
  BiListUl,
  BiShield
} from 'react-icons/bi';

export const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Veri State'leri
  const [availableJobs, setAvailableJobs] = useState([]);
  const [myJobs, setMyJobs] = useState([]);
  const [history, setHistory] = useState(null);
  const [profileData, setProfileData] = useState(null); // ← YENİ
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // UI State'leri
  const [filter, setFilter] = useState('available');
  const [viewMode, setViewMode] = useState('list');
  const [userLocation, setUserLocation] = useState(null);

  // Modal State'leri
  const [showJobMapModal, setShowJobMapModal] = useState(false);
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [selectedJobForMap, setSelectedJobForMap] = useState(null);
  const [popup, setPopup] = useState({ isOpen: false, type: 'success', title: '', message: '' });
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: '', message: '', onConfirm: () => { } });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
  try {
    setLoading(true);
    const [historyRes, availableRes, myJobsRes, profileRes] = await Promise.all([
      userService.getMyHistory(),
      deliveryService.getAvailableJobs({ limit: 50 }),
      deliveryService.getMyJobs(),
      userService.getMyProfile() // ← YENİ
    ]);

    setHistory(historyRes.data.data || historyRes.data);

    const availableData = availableRes.data.data || availableRes.data;
    setAvailableJobs(availableData.jobs || availableData.deliveries || []);

    const myJobsData = myJobsRes.data.data || myJobsRes.data;
    setMyJobs(myJobsData.jobs || myJobsData.deliveries || []);

    setProfileData(profileRes.data); // ← YENİ

  } catch (err) {
    setError(err.response?.data?.message || 'Veriler yüklenirken bir hata oluştu.');
  } finally {
    setLoading(false);
  }
};

  const showStatus = (type, title, message) => setPopup({ isOpen: true, type, title, message });

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
          showStatus('success', 'Konum Alındı', 'Konumunuz haritada işaretlendi.');
        },
        () => showStatus('error', 'Hata', 'Konum izni verilmedi.')
      );
    } else {
      showStatus('error', 'Hata', 'Tarayıcı desteklemiyor.');
    }
  };

  const handleShowJobMap = (job) => {
    setSelectedJobForMap(job);
    setShowJobMapModal(true);
  };

  // --- İŞ AKSİYONLARI ---
  const handleAcceptJob = (jobId) => {
    const activeJob = myJobs.find(j => ['accepted', 'in_progress'].includes(j.status));
    if (activeJob) {
      showStatus('error', 'Aktif İşiniz Var', `Önce #${activeJob.order_number} işi tamamlayın.`);
      return;
    }
    setConfirmModal({
      isOpen: true,
      title: 'İşi Kabul Et',
      message: 'Bu görevi onaylıyor musunuz?',
      onConfirm: () => processAction(deliveryService.acceptJob, jobId, 'İş Alındı', 'my-jobs')
    });
  };

  const handleStartJob = (jobId) => {
    setConfirmModal({
      isOpen: true,
      title: 'Teslimata Başla',
      message: 'Paketi teslim aldınız mı?',
      onConfirm: () => processAction(deliveryService.startJob, jobId, 'Yolculuk Başladı')
    });
  };

  const handleCompleteJob = (jobId) => {
    setConfirmModal({
      isOpen: true,
      title: 'Teslimatı Tamamla',
      message: 'Paketi teslim ettiniz mi?',
      onConfirm: () => processAction(deliveryService.completeJob, jobId, 'Teslimat Tamamlandı')
    });
  };

  const processAction = async (apiMethod, jobId, successTitle, redirectFilter = null) => {
    try {
      await apiMethod(jobId);
      showStatus('success', successTitle, 'İşlem başarılı.');
      fetchData();
      if (redirectFilter) setFilter(redirectFilter);
      setShowJobMapModal(false);
      setConfirmModal(prev => ({ ...prev, isOpen: false }));
    } catch (err) {
      showStatus('error', 'Hata', err.response?.data?.message || 'İşlem başarısız.');
    }
  };

  const formatCurrency = (amount) => new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(amount || 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-24 md:pb-10">
      <TermsAndRulesModal isOpen={showRulesModal} onClose={() => setShowRulesModal(false)} />
      <StatusModal isOpen={popup.isOpen} {...popup} onClose={() => setPopup({ ...popup, isOpen: false })} />
      <ConfirmModal isOpen={confirmModal.isOpen} {...confirmModal} onCancel={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))} confirmText="Onayla" cancelText="Vazgeç" />
      <JobRouteModal isOpen={showJobMapModal} onClose={() => setShowJobMapModal(false)} job={selectedJobForMap} userLocation={userLocation} onAccept={handleAcceptJob} formatCurrency={formatCurrency} />

      <ModernHeader
        title={`${user?.name || 'Öğrenci'} 👋`}
        subtitle="Hoş geldin,"
        user={profileData} 
        onLogout={() => { logout(); navigate('/login'); }}
        onProfileClick={() => navigate('/profile')}
        showBackButton={false}
      />

      <main className="max-w-7xl mx-auto px-4 md:px-6 pt-4 md:pt-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl mb-4 text-sm flex items-center gap-2">
            <BiErrorCircle size={20} /> {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* --- SOL PANEL (Mobilde Üst Kısım) --- */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-4 md:space-y-6">

            {/* İstatistikler */}
            {history?.summary && (
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-3 md:gap-4">
                <div className="bg-yellow-400 p-4 md:p-6 rounded-2xl md:rounded-3xl shadow-md relative overflow-hidden">
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2 opacity-90">
                      <div className="p-1.5 md:p-2 bg-white/20 rounded-lg"><BiWallet size={18} className="text-gray-900 md:w-6 md:h-6" /></div>
                      <span className="text-xs md:text-sm font-bold text-gray-900">Kazanç</span>
                    </div>
                    <p className="text-2xl md:text-3xl font-black text-gray-900">{formatCurrency(history.summary.total_earnings)}</p>
                    <p className="text-[10px] md:text-xs font-semibold text-gray-800/80 mt-1">Bekleyen: {formatCurrency(history.summary.pending_earnings)}</p>
                  </div>
                  <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-white opacity-20 rounded-full blur-xl"></div>
                </div>

                <div className="bg-gray-900 p-4 md:p-6 rounded-2xl md:rounded-3xl shadow-md text-white relative overflow-hidden">
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2 opacity-80">
                      <div className="p-1.5 md:p-2 bg-white/10 rounded-lg"><BiBriefcase size={18} className="text-white md:w-6 md:h-6" /></div>
                      <span className="text-xs md:text-sm font-bold">Teslimat</span>
                    </div>
                    <div className="flex items-end gap-1">
                      <p className="text-2xl md:text-4xl font-black">{history.summary.completed_jobs || 0}</p>
                      <span className="text-[10px] md:text-sm text-gray-400 mb-1 font-medium">/ {history.summary.total_jobs}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Hızlı Erişim Butonları */}
            <div className="grid grid-cols-3 lg:grid-cols-1 gap-2 md:gap-3">
              <NavButton
                onClick={() => navigate('/student/history')}
                icon={<BiTimeFive size={22} />}
                label="Geçmiş"
                color="gray"
              />
              <NavButton
                onClick={() => navigate('/student/support')}
                icon={<BiBriefcase size={22} />}
                label="Destek"
                color="gray"
              />
              {/* DÜZENLENDİ: Renk 'yellow' yapıldı */}
              <NavButton
                onClick={() => setShowRulesModal(true)}
                icon={<BiShield size={22} />}
                label="Kurallar"
                color="yellow"
              />
            </div>
          </div>

          {/* --- SAĞ PANEL (İş Listesi) --- */}
          <div className="lg:col-span-8">

             <div className="relative w-full h-32 sm:h-48 lg:h-64 rounded-3xl overflow-hidden  border-2 border-dashed border-gray-100   mb-8 group cursor-pointer">
                          <img 
                            src={Banner} 
                            alt="biharçlık banner" 
                            className="w-full h-full object-cover transform transition-transform"
                          />
              </div>
            

            <div className=" top-[68px] md:top-[80px] z-30 bg-gray-50 pt-2 pb-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex bg-white p-1 rounded-xl shadow-sm border border-gray-100 flex-1">
                  <FilterButton active={filter === 'available'} onClick={() => setFilter('available')}>
                    Müsait ({availableJobs.length})
                  </FilterButton>
                  <FilterButton active={filter === 'my-jobs'} onClick={() => setFilter('my-jobs')}>
                    İşlerim ({myJobs.length})
                  </FilterButton>
                </div>

                {filter === 'available' && (
                  <div className="flex bg-white p-1 rounded-xl shadow-sm border border-gray-100 min-w-[140px]">
                    {/* DÜZENLENDİ: İkon boyutu büyütüldü (size={22}) */}
                    <IconButton active={viewMode === 'list'} onClick={() => setViewMode('list')} icon={<BiListUl size={22} />} label="Liste" />
                    <IconButton active={viewMode === 'map'} onClick={() => setViewMode('map')} icon={<BiMap size={22} />} label="Harita" />
                  </div>
                )}
              </div>
            </div>

            {/* İçerik */}
            <div className="space-y-4 md:space-y-6 pb-6">
              {filter === 'available' ? (
                <>
                  {availableJobs.length === 0 ? (
                    <EmptyState icon={<BiPackage size={48} />} message="Şu an müsait paket yok." />
                  ) : viewMode === 'list' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {availableJobs.map(job => (
                        <JobCard
                          key={job.id}
                          job={job}
                          type="available"
                          onAction={() => handleAcceptJob(job.id)}
                          onShowMap={() => handleShowJobMap(job)}
                          formatCurrency={formatCurrency}
                          hasActiveJob={myJobs.some(j => ['accepted', 'in_progress'].includes(j.status))}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="h-[500px] md:h-[600px] rounded-2xl overflow-hidden shadow-sm border border-gray-200">
                      <JobMapView
                        jobs={availableJobs}
                        onAcceptJob={handleAcceptJob}
                        formatCurrency={formatCurrency}
                        userLocation={userLocation}
                        onGetLocation={getUserLocation}
                        hasActiveJob={myJobs.some(j => ['accepted', 'in_progress'].includes(j.status))}
                      />
                    </div>
                  )}
                </>
              ) : (
                <>
                  {myJobs.length === 0 ? (
                    <EmptyState icon={<BiNavigation size={48} />} message="Henüz bir iş almadın." />
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {myJobs.map(job => (
                        <JobCard
                          key={job.id}
                          job={job}
                          type="my-job"
                          onStart={() => handleStartJob(job.id)}
                          onComplete={() => handleCompleteJob(job.id)}
                          onShowMap={() => handleShowJobMap(job)}
                          formatCurrency={formatCurrency}
                        />
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};


const NavButton = ({ onClick, icon, label, color }) => {
  const isBlue = color === 'blue';
  const isYellow = color === 'yellow'; // Sarı renk mantığı eklendi

  let baseClasses = "bg-white border-gray-200 text-gray-700 hover:bg-gray-50";
  let iconBg = "bg-gray-100";

  if (isBlue) {
    baseClasses = "bg-blue-50 border-blue-100 text-blue-700 hover:bg-blue-100";
    iconBg = "bg-white/50";
  } else if (isYellow) {
    // Sarı renk sınıfları
    baseClasses = "bg-yellow-50 border-yellow-200 text-yellow-800 hover:bg-yellow-100";
    iconBg = "bg-yellow-200 text-yellow-900";
  }

  return (
    <button
      onClick={onClick}
      className={`
        flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-1 lg:gap-3 
        p-2 md:p-4 rounded-2xl border shadow-sm transition-all active:scale-95
        ${baseClasses}
      `}
    >
      <div className={`p-2 rounded-full ${iconBg}`}>
        {icon}
      </div>
      <span className="text-[11px] md:text-sm font-bold lg:w-full lg:text-left">{label}</span>
      <BiChevronRight className="hidden lg:block opacity-50" size={20} />
    </button>
  );
};

const FilterButton = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`
      flex-1 py-3 text-sm font-bold rounded-lg transition-all 
      ${active ? 'bg-gray-900 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}
    `}
  >
    {children}
  </button>
);

// DÜZENLENDİ: Padding (py-3) ve text-size artırıldı
const IconButton = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`
      flex-1 px-4 py-3 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2
      ${active ? 'bg-gray-900 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}
    `}
  >
    <span className="text-lg">{icon}</span>
    <span className="hidden sm:inline">{label}</span>
  </button>
);

const EmptyState = ({ icon, message }) => (
  <div className="text-center py-10 bg-white rounded-2xl border border-dashed border-gray-200">
    <div className="mx-auto text-gray-300 mb-2 flex justify-center">{icon}</div>
    <p className="text-gray-500 text-sm font-medium">{message}</p>
  </div>
);

const JobCard = ({ job, type, onAction, onStart, onComplete, onShowMap, formatCurrency, hasActiveJob }) => {
  const hasLocation = job.pickup_latitude && job.pickup_longitude;

  const getStatusColor = (s) => ({
    pending: 'bg-amber-100 text-amber-700 border-amber-200',
    accepted: 'bg-blue-100 text-blue-700 border-blue-200',
    in_progress: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    completed: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    cancelled: 'bg-red-100 text-red-700 border-red-200',
  }[s] || 'bg-gray-100 text-gray-600');

  const getStatusText = (s) => ({
    pending: 'Bekliyor', accepted: 'Kabul Edildi', in_progress: 'Taşınıyor', completed: 'Teslim Edildi', cancelled: 'İptal'
  }[s] || s);

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all flex flex-col h-full relative overflow-hidden">
      {/* Kart Başlığı */}
      <div className="flex justify-between items-start mb-5">
        <div>
          <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
            <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-1 rounded-md uppercase">
              {job.package_size === 'small' ? 'Küçük' : 'Paket'}
            </span>
            {type === 'my-job' && (
              <span className={`text-[10px] font-bold px-2 py-1 rounded-md border ${getStatusColor(job.status)}`}>
                {getStatusText(job.status)}
              </span>
            )}
          </div>
          <h3 className="text-gray-400 font-medium text-xs">#{job.order_number}</h3>
        </div>
        <div className="text-right">
          <span className="block text-xl md:text-2xl font-black text-gray-900 tracking-tight">{formatCurrency(job.payment_amount)}</span>
        </div>
      </div>

      {/* Rota Görseli */}
      <div className="relative pl-3 mb-5 border-l-[2px] border-dashed border-gray-200 ml-1.5 space-y-6 flex-grow">
        {/* Alış */}
        <div className="relative">
          <div className="absolute -left-[20px] top-1.5 w-3 h-3 bg-white border-[3px] border-yellow-500 rounded-full shadow-sm z-10"></div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Alış Noktası</span>
            <span className="text-base font-bold text-gray-900 leading-tight truncate pr-2">{job.pickup_district}</span>
            <span className="text-xs text-gray-500 mt-0.5 line-clamp-1">{job.pickup_address}</span>
          </div>
        </div>
        {/* Teslimat */}
        <div className="relative">
          <div className="absolute -left-[20px] top-1.5 w-3 h-3 bg-gray-900 rounded-full shadow-sm z-10"></div>
          <div className="flex flex-col">
            {/* DÜZENLENDİ: Yazı boyutları büyütüldü */}
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Teslimat</span>
            <span className="text-lg font-bold text-gray-900 leading-tight truncate pr-2">{job.delivery_district}</span>
            <span className="text-sm text-gray-600 mt-0.5 leading-snug line-clamp-2">{job.delivery_address}</span>
          </div>
        </div>
      </div>

      {/* Footer / Aksiyonlar */}
      <div className="mt-auto pt-4 border-t border-gray-50">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400"><BiPackage size={16} /></div>
          <p className="text-xs text-gray-600 line-clamp-1 flex-1">{job.package_description}</p>
        </div>

        {type === 'available' && (
          <div className="grid grid-cols-[auto_1fr] gap-2">
            {hasLocation && (
              <button onClick={onShowMap} disabled={hasActiveJob} className={`px-4 py-3 rounded-xl flex items-center justify-center ${hasActiveJob ? 'bg-gray-100 text-gray-400' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}>
                <BiMap size={20} />
              </button>
            )}
            <button
              onClick={onAction}
              disabled={hasActiveJob}
              className={`
                w-full py-3 font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-transform
                ${hasActiveJob ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-gray-900 text-white hover:bg-black'}
              `}
            >
              <span>{hasActiveJob ? 'Meşgul' : 'Kabul Et'}</span>
              {!hasActiveJob && <BiChevronRight size={18} />}
            </button>
          </div>
        )}

        {type === 'my-job' && (
          <div className="space-y-2">
            {hasLocation && job.status !== 'completed' && (
              <button onClick={onShowMap} className="w-full py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-sm rounded-xl flex items-center justify-center gap-2">
                <BiMap size={18} /> <span>Harita</span>
              </button>
            )}
            {job.status === 'accepted' && (job.payment_status === 'sender_paid' ? (
              <button onClick={onStart} className="w-full py-3 bg-yellow-400 hover:bg-yellow-500 text-black font-bold text-sm rounded-xl shadow-sm active:scale-95">Başla 🚀</button>
            ) : (
              <div className="w-full py-3 bg-amber-50 text-amber-700 text-xs font-bold rounded-xl text-center border border-amber-100">Ödeme Bekleniyor</div>
            ))}
            {job.status === 'in_progress' && (
              <button onClick={onComplete} className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-200/50 flex items-center justify-center gap-2 active:scale-95">
                <span>Teslim Et</span> <BiCheckCircle size={20} />
              </button>
            )}
            {job.status === 'completed' && <div className="w-full py-3 bg-gray-100 text-gray-500 text-xs font-bold rounded-xl text-center">Bitti</div>}
          </div>
        )}
      </div>
    </div>
  );
};