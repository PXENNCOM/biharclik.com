import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../../services/adminService';

// Modern Header
import { ModernHeader } from '../common/ModernHeader';

// YENİ: Ortak Modal Bileşenleri
import { StatusModal, ConfirmModal } from '../../components/common/ActionModals';

// İkonlar
import {
  BiUser,
  BiTimeFive,
  BiBriefcase,
  BiPackage,
  BiCheckCircle,
  BiX,
  BiFile,
  BiBarChartAlt2,
  BiGroup,
  BiStore,
  BiRightArrowAlt,
  BiSearch,
  BiWallet,
  BiErrorCircle,
  BiEnvelope
} from 'react-icons/bi';

export const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Veri State'leri
  const [stats, setStats] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // UI State'leri
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false); // İsim karışıklığını önlemek için showModal -> showDetailModal

  // Modal State'leri
  const [popup, setPopup] = useState({ isOpen: false, type: 'success', title: '', message: '' });
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => { },
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Dashboard istatistikleri
      const statsResponse = await adminService.getDashboardStats();
      setStats(statsResponse.data.data || statsResponse.data);

      // Onay bekleyen öğrenciler
      const studentsResponse = await adminService.getAllStudents({
        admin_approved: false,
        limit: 10
      });
      const studentsData = studentsResponse.data.data?.students || studentsResponse.data.students || [];
      setStudents(studentsData);
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

  // Onaylama İşlemi
  const handleApprove = (studentId) => {
    setConfirmModal({
      isOpen: true,
      title: 'Öğrenci Onayı',
      message: 'Bu öğrencinin belgelerini kontrol ettiniz mi? Onayladığınızda sisteme erişimi açılacaktır.',
      confirmText: 'Evet, Onayla',
      onConfirm: () => processApprove(studentId)
    });
  };

  const processApprove = async (studentId) => {
    try {
      await adminService.approveStudent(studentId);
      setConfirmModal(prev => ({ ...prev, isOpen: false })); // Confirm modalı kapat
      showStatus('success', 'Başarılı', 'Öğrenci başarıyla onaylandı ve sisteme erişimi açıldı.');

      // Modalı kapat (eğer detaydan onaylandıysa)
      setShowDetailModal(false);

      fetchData(); // Listeyi yenile
    } catch (err) {
      setConfirmModal(prev => ({ ...prev, isOpen: false }));
      showStatus('error', 'Hata', err.response?.data?.message || 'Onaylama işlemi başarısız oldu.');
    }
  };

  const handleViewDetails = async (studentId) => {
    try {
      const response = await adminService.getStudentDetail(studentId);
      const studentData = response.data.data || response.data;
      setSelectedStudent(studentData);
      setShowDetailModal(true);
    } catch (err) {
      showStatus('error', 'Hata', err.response?.data?.message || 'Öğrenci detayları yüklenemedi');
    }
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
        title="Admin Paneli"
        subtitle={`Hoş geldin, ${user?.email}`}
        onLogout={() => { logout(); navigate('/login'); }}
        onProfileClick={() => navigate('/profile')}
      />

      {/* Content */}
      <main className="max-w-7xl mx-auto px-5 pt-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl mb-6 flex items-center gap-3">
            <BiErrorCircle size={24} />
            {error}
          </div>
        )}

        {/* --- HIZLI ERİŞİM MENÜSÜ --- */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <NavButton
            icon={<BiBarChartAlt2 />}
            title="Raporlar"
            desc="Sistem özeti"
            onClick={() => navigate('/admin/reports')}
          />
          <NavButton
            icon={<BiGroup />}
            title="Öğrenciler"
            desc="Kurye yönetimi"
            onClick={() => navigate('/admin/students')}
          />
          <NavButton
            icon={<BiStore />}
            title="Göndericiler"
            desc="Firma yönetimi"
            onClick={() => navigate('/admin/senders')}
          />
          <NavButton
            icon={<BiPackage />}
            title="İşler"
            desc="Tüm teslimatlar"
            onClick={() => navigate('/admin/deliveries')}
          />
          <NavButton
            icon={<BiEnvelope />}
            title="Destek"
            desc="Kullanıcı talepleri"
            onClick={() => navigate('/admin/support')}
          />
        </div>

        {/* --- İSTATİSTİK KARTLARI --- */}
        {stats && (
          <>
            <h2 className="text-lg font-bold text-gray-900 mb-4 px-1">Genel Durum</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">

              {/* Onay Bekleyen (SARI - ÖNEMLİ) */}
              <div className="bg-yellow-400 p-6 rounded-3xl shadow-lg shadow-yellow-200 relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-2 opacity-90 text-gray-900">
                    <BiTimeFive size={22} />
                    <span className="text-sm font-bold">Onay Bekleyen</span>
                  </div>
                  <p className="text-4xl font-black text-gray-900">{stats.pending_students || 0}</p>
                  <p className="text-xs font-bold text-gray-800 mt-1">Öğrenci onayı bekliyor</p>
                </div>
              </div>

              {/* Toplam Öğrenci */}
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-2 text-gray-500">
                  <BiGroup size={22} />
                  <span className="text-sm font-bold">Toplam Öğrenci</span>
                </div>
                <div className="flex items-end gap-2">
                  <p className="text-3xl font-black text-gray-900">{stats.total_students || 0}</p>
                  <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg mb-1">
                    {stats.approved_students || 0} Aktif
                  </span>
                </div>
              </div>

              {/* Finansal Durum (SİYAH) */}
              <div className="bg-gray-900 p-6 rounded-3xl shadow-lg text-white relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-2 opacity-80">
                    <BiWallet size={22} />
                    <span className="text-sm font-bold">Toplam Ciro</span>
                  </div>
                  <p className="text-3xl font-black">{formatCurrency(stats.total_completed_amount)}</p>
                  <p className="text-xs text-gray-400 mt-1">Tamamlanan işlerden</p>
                </div>
              </div>

              {/* İş Durumu */}
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-2 text-gray-500">
                  <BiPackage size={22} />
                  <span className="text-sm font-bold">İş İstatistikleri</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Aktif</span>
                    <span className="font-bold text-blue-600">{stats.active_deliveries || 0}</span>
                  </div>
                  <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-full" style={{ width: '40%' }}></div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Tamamlanan</span>
                    <span className="font-bold text-green-600">{stats.completed_deliveries || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* --- ONAY BEKLEYENLER TABLOSU --- */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
                </span>
                Onay Bekleyen Öğrenciler
              </h2>
              <p className="text-sm text-gray-500 mt-1">Belge kontrolü yapıp onaylayın.</p>
            </div>
            <button
              onClick={() => navigate('/admin/students')}
              className="px-5 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold rounded-xl text-sm transition flex items-center gap-2"
            >
              Tümünü Gör <BiRightArrowAlt />
            </button>
          </div>

          {students.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                <BiCheckCircle size={32} />
              </div>
              <p className="text-gray-900 font-bold">Harika!</p>
              <p className="text-gray-500 text-sm">Onay bekleyen yeni öğrenci yok.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50/50">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Öğrenci</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Üniversite / Bölüm</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Kayıt Tarihi</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">İşlem</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {students.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-yellow-100 text-yellow-700 flex items-center justify-center font-bold text-sm">
                            {student.first_name[0]}{student.last_name[0]}
                          </div>
                          <div>
                            <div className="font-bold text-gray-900">
                              {student.first_name} {student.last_name}
                            </div>
                            <div className="text-xs text-gray-500">{student.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{student.university}</div>
                        <div className="text-xs text-gray-500">{student.department}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 font-medium">
                        {new Date(student.created_at).toLocaleDateString('tr-TR')}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleViewDetails(student.id)}
                            className="px-3 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-bold rounded-lg transition"
                          >
                            Detay
                          </button>
                          <button
                            onClick={() => handleApprove(student.id)}
                            className="px-3 py-2 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-lg transition shadow-md"
                          >
                            Onayla
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* --- DETAIL MODAL --- */}
      {showDetailModal && selectedStudent && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">

            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-yellow-400 flex items-center justify-center text-gray-900 font-black text-xl">
                  {selectedStudent.first_name[0]}{selectedStudent.last_name[0]}
                </div>
                <div>
                  <h2 className="text-xl font-black text-gray-900">
                    {selectedStudent.first_name} {selectedStudent.last_name}
                  </h2>
                  <p className="text-sm text-gray-500 font-medium">
                    Kayıt: {new Date(selectedStudent.created_at).toLocaleDateString('tr-TR')}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowDetailModal(false)}
                className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition"
              >
                <BiX size={24} />
              </button>
            </div>

            <div className="p-6">

              {/* Bilgi Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Kişisel */}
                <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <BiUser className="text-gray-400" /> Kişisel Bilgiler
                  </h3>
                  <div className="space-y-3">
                    <InfoRow label="TC No" value={selectedStudent.tc_no} mono />
                    <InfoRow label="Doğum T." value={new Date(selectedStudent.birth_date).toLocaleDateString('tr-TR')} />
                    <InfoRow label="Telefon" value={selectedStudent.phone} />
                    <InfoRow label="Email" value={selectedStudent.email} />
                  </div>
                </div>

                {/* Eğitim */}
                <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <BiBriefcase className="text-gray-400" /> Eğitim Bilgileri
                  </h3>
                  <div className="space-y-3">
                    <InfoRow label="Üniversite" value={selectedStudent.university} />
                    <InfoRow label="Bölüm" value={selectedStudent.department} />
                  </div>
                </div>
              </div>

              {/* Belge Alanı */}
              {selectedStudent.student_document_url && (
                <div className="mb-8">
                  <h3 className="font-bold text-gray-900 mb-3 px-1">Öğrenci Belgesi</h3>
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-blue-400 transition group bg-white">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                        <BiFile size={24} />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-sm">Öğrenci Belgesi.pdf</p>
                        <p className="text-xs text-gray-400">Belgeyi kontrol ediniz</p>
                      </div>
                    </div>
                    <a
                      href={`https://api.biharclik.com${selectedStudent.student_document_url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition shadow-md shadow-blue-200"
                    >
                      Görüntüle
                    </a>
                  </div>
                </div>
              )}

              {/* Aksiyonlar */}
              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="flex-1 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition"
                >
                  Kapat
                </button>
                {!selectedStudent.admin_approved && (
                  <button
                    onClick={() => handleApprove(selectedStudent.id)}
                    className="flex-1 py-3.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-lg shadow-green-200 transition flex items-center justify-center gap-2"
                  >
                    <BiCheckCircle size={20} />
                    Öğrenciyi Onayla
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- YARDIMCI BİLEŞENLER ---

const NavButton = ({ icon, title, desc, onClick }) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center justify-center p-4 bg-white border border-gray-200 rounded-2xl hover:border-yellow-400 hover:shadow-md transition group text-center h-full"
  >
    <div className="w-10 h-10 rounded-full bg-gray-50 text-gray-600 flex items-center justify-center mb-2 group-hover:bg-yellow-400 group-hover:text-gray-900 transition">
      {icon}
    </div>
    <span className="font-bold text-gray-900 text-sm">{title}</span>
    <span className="text-[10px] text-gray-400">{desc}</span>
  </button>
);

const InfoRow = ({ label, value, mono }) => (
  <div className="flex justify-between items-center text-sm">
    <span className="text-gray-500 font-medium">{label}</span>
    <span className={`text-gray-900 font-bold ${mono ? 'font-mono' : ''} text-right`}>{value}</span>
  </div>
);