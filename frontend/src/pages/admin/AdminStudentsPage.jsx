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
  BiIdCard, 
  BiPhone, 
  BiEnvelope, 
  BiBuilding, 
  BiBriefcase, 
  BiCheckCircle, 
  BiXCircle, 
  BiShow, 
  BiBlock, 
  BiTrash,
  BiGroup,
  BiTrendingUp,
  BiX
} from 'react-icons/bi';

export const AdminStudentsPage = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
  // Filtreler
  const [filters, setFilters] = useState({
    search: '', 
    university: '',
    status: '', 
    sortBy: 'name' 
  });

  // İstatistikler
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    totalJobs: 0,
    totalEarnings: 0
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, students]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAllStudents({ limit: 1000 });
      const studentsData = response.data.data?.students || response.data.students || [];
      setStudents(studentsData);
    } catch (err) {
      setError(err.response?.data?.message || 'Öğrenciler yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...students];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(s => 
        `${s.first_name || ''} ${s.last_name || ''}`.toLowerCase().includes(searchLower) ||
        (s.email || '').toLowerCase().includes(searchLower) ||
        (s.phone || '').includes(filters.search) ||
        (s.student_number || '').includes(filters.search)
      );
    }

    if (filters.university) {
      filtered = filtered.filter(s => 
        (s.university || '').toLowerCase().includes(filters.university.toLowerCase())
      );
    }

    if (filters.status === 'active') {
      filtered = filtered.filter(s => s.is_active);
    } else if (filters.status === 'inactive') {
      filtered = filtered.filter(s => !s.is_active);
    }

    if (filters.sortBy === 'name') {
      filtered.sort((a, b) => `${a.first_name} ${a.last_name}`.localeCompare(`${b.first_name} ${b.last_name}`));
    } else if (filters.sortBy === 'university') {
      filtered.sort((a, b) => (a.university || '').localeCompare(b.university || ''));
    } else if (filters.sortBy === 'joinDate') {
      filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else if (filters.sortBy === 'jobs') {
      filtered.sort((a, b) => (b.total_jobs || 0) - (a.total_jobs || 0));
    }

    setFilteredStudents(filtered);

    setStats({
      total: students.length,
      active: students.filter(s => s.is_active).length,
      inactive: students.filter(s => !s.is_active).length,
      totalJobs: students.reduce((sum, s) => sum + (s.total_jobs || 0), 0),
      totalEarnings: students.reduce((sum, s) => sum + parseFloat(s.total_earnings || 0), 0)
    });
  };

  const clearFilters = () => {
    setFilters({ search: '', university: '', status: '', sortBy: 'name' });
  };

  const handleViewDetails = (studentId) => {
    const student = students.find(s => s.id === studentId);
    if (student) {
      setSelectedStudent(student);
      setShowModal(true);
    }
  };

  const handleToggleStatus = async (studentId, currentStatus) => {
    if (!confirm(`Bu öğrenciyi ${currentStatus ? 'pasif' : 'aktif'} yapmak istediğinize emin misiniz?`)) return;

    try {
      await adminService.toggleUserStatus(studentId, !currentStatus);      
      fetchStudents(); // Listeyi yenile
      if (selectedStudent && selectedStudent.id === studentId) {
          setSelectedStudent({...selectedStudent, is_active: !currentStatus});
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Güncelleme başarısız');
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
        title="Öğrenci Yönetimi"
        showBackButton={true}
        onBackClick={() => navigate('/admin/dashboard')}
        onLogout={() => navigate('/login')}
      />

      <main className="max-w-7xl mx-auto px-5 pt-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl mb-6 flex items-center gap-3">
            <BiXCircle size={24} />
            {error}
          </div>
        )}

        {/* --- İSTATİSTİK KARTLARI --- */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <StatsCard title="Toplam" value={stats.total} icon={<BiGroup/>} color="bg-blue-50 text-blue-700" />
            <StatsCard title="Aktif" value={stats.active} icon={<BiCheckCircle/>} color="bg-green-50 text-green-700" />
            <StatsCard title="Pasif" value={stats.inactive} icon={<BiXCircle/>} color="bg-red-50 text-red-700" />
            <StatsCard title="Toplam İş" value={stats.totalJobs} icon={<BiBriefcase/>} color="bg-purple-50 text-purple-700" />
            <StatsCard title="Toplam Kazanç" value={formatCurrency(stats.totalEarnings)} icon={<BiTrendingUp/>} color="bg-yellow-50 text-yellow-700" />
        </div>

        {/* --- FİLTRELEME ALANI --- */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 mb-6">
            <div className="flex justify-between items-center mb-4 px-1">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    <BiFilterAlt className="text-gray-500" /> Filtrele & Ara
                </h3>
                <button onClick={clearFilters} className="text-sm font-bold text-red-500 hover:text-red-700 transition">
                    Temizle
                </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Arama */}
                <div className="relative">
                    <BiSearch className="absolute top-3.5 left-3 text-gray-400 pointer-events-none" size={20} />
                    <input 
                        type="text" 
                        placeholder="İsim, E-posta, Tel..." 
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-yellow-400 outline-none transition"
                        value={filters.search}
                        onChange={(e) => setFilters({...filters, search: e.target.value})}
                    />
                </div>

                {/* Üniversite */}
                <div className="relative">
                     <BiBuilding className="absolute top-3.5 left-3 text-gray-400 pointer-events-none" size={20} />
                     <input 
                        type="text" 
                        placeholder="Üniversite Ara..." 
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-yellow-400 outline-none transition"
                        value={filters.university}
                        onChange={(e) => setFilters({...filters, university: e.target.value})}
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
                        <option value="active">Aktif</option>
                        <option value="inactive">Pasif</option>
                    </select>
                    <div className="absolute top-4 right-3 pointer-events-none text-gray-400 text-xs">▼</div>
                </div>

                {/* Sıralama */}
                <div className="relative">
                    <select 
                        className="w-full pl-4 pr-8 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-yellow-400 outline-none transition appearance-none"
                        value={filters.sortBy}
                        onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
                    >
                        <option value="name">İsim (A-Z)</option>
                        <option value="university">Üniversite</option>
                        <option value="joinDate">Kayıt Tarihi</option>
                        <option value="jobs">İş Sayısı</option>
                    </select>
                     <div className="absolute top-4 right-3 pointer-events-none text-gray-400 text-xs">▼</div>
                </div>
            </div>
        </div>

        {/* --- ÖĞRENCİ LİSTESİ --- */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
             {filteredStudents.length === 0 ? (
                <div className="text-center py-16">
                    <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                        <BiUser size={32} />
                    </div>
                    <p className="text-gray-500 font-medium">Kriterlere uygun öğrenci bulunamadı.</p>
                </div>
             ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50/50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Öğrenci</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">İletişim</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Eğitim</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Performans</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Durum</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">İşlem</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredStudents.map((student) => (
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
                                                <div className="text-xs text-gray-400 font-mono">
                                                    #{student.student_number || 'NO-ID'}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-900">{student.email}</div>
                                        <div className="text-xs text-gray-500">{student.phone || '-'}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-gray-900">{student.university || '-'}</div>
                                        <div className="text-xs text-gray-500">{student.department}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-bold text-gray-900">{student.total_jobs || 0} İş</span>
                                            <span className="text-xs text-gray-400">|</span>
                                            <span className="text-sm font-bold text-green-600">{formatCurrency(student.total_earnings)}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wide ${
                                            student.is_active ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                                        }`}>
                                            {student.is_active ? <><BiCheckCircle/> Aktif</> : <><BiXCircle/> Pasif</>}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button 
                                                onClick={() => handleViewDetails(student.id)}
                                                className="p-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:text-blue-600 hover:border-blue-200 transition"
                                                title="Detayları Gör"
                                            >
                                                <BiShow size={18} />
                                            </button>
                                            <button 
                                                onClick={() => handleToggleStatus(student.id, student.is_active)}
                                                className={`p-2 bg-white border border-gray-200 rounded-lg transition ${
                                                    student.is_active 
                                                    ? 'text-red-500 hover:text-red-700 hover:border-red-200' 
                                                    : 'text-green-500 hover:text-green-700 hover:border-green-200'
                                                }`}
                                                title={student.is_active ? 'Pasife Al' : 'Aktifleştir'}
                                            >
                                                {student.is_active ? <BiBlock size={18} /> : <BiCheckCircle size={18} />}
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

      {/* --- DETAY MODAL --- */}
      {showModal && selectedStudent && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
                <div className="flex items-center gap-4">
                     <div className="w-14 h-14 rounded-2xl bg-yellow-400 flex items-center justify-center text-gray-900 font-black text-2xl shadow-lg shadow-yellow-200">
                        {selectedStudent.first_name[0]}{selectedStudent.last_name[0]}
                     </div>
                     <div>
                        <h2 className="text-xl font-black text-gray-900">
                            {selectedStudent.first_name} {selectedStudent.last_name}
                        </h2>
                        <div className="flex items-center gap-2 mt-1">
                             <span className="text-xs font-mono bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                                #{selectedStudent.student_number || 'NO-ID'}
                             </span>
                             <span className={`text-xs font-bold px-2 py-0.5 rounded ${selectedStudent.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {selectedStudent.is_active ? 'Aktif Hesap' : 'Pasif Hesap'}
                             </span>
                        </div>
                     </div>
                </div>
                <button onClick={() => setShowModal(false)} className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition">
                    <BiX size={24} />
                </button>
            </div>

            <div className="p-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {/* Kişisel */}
                    <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-sm uppercase tracking-wide">
                            <BiUser className="text-gray-400"/> Kişisel
                        </h3>
                        <div className="space-y-3 text-sm">
                            <InfoRow label="TC No" value={selectedStudent.tc_no} mono />
                            <InfoRow label="Email" value={selectedStudent.email} />
                            <InfoRow label="Telefon" value={selectedStudent.phone} />
                            <InfoRow label="Doğum T." value={new Date(selectedStudent.birth_date).toLocaleDateString('tr-TR')} />
                        </div>
                    </div>

                    {/* Eğitim */}
                    <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-sm uppercase tracking-wide">
                            <BiBriefcase className="text-gray-400"/> Eğitim
                        </h3>
                        <div className="space-y-3 text-sm">
                            <InfoRow label="Üniversite" value={selectedStudent.university} />
                            <InfoRow label="Bölüm" value={selectedStudent.department} />
                            <InfoRow label="Sınıf" value={selectedStudent.grade || '-'} />
                        </div>
                    </div>
                 </div>

                 {/* Performans Özeti */}
                 <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-blue-50 p-4 rounded-2xl text-center border border-blue-100">
                        <p className="text-3xl font-black text-blue-600">{selectedStudent.total_jobs || 0}</p>
                        <p className="text-xs font-bold text-blue-400 uppercase">Toplam İş</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-2xl text-center border border-green-100">
                        <p className="text-3xl font-black text-green-600">{formatCurrency(selectedStudent.total_earnings)}</p>
                        <p className="text-xs font-bold text-green-500 uppercase">Toplam Kazanç</p>
                    </div>
                 </div>

                 {/* Butonlar */}
                 <div className="flex gap-3">
                    <button
                        onClick={() => handleToggleStatus(selectedStudent.id, selectedStudent.is_active)}
                        className={`flex-1 py-3.5 font-bold rounded-xl transition flex items-center justify-center gap-2 ${
                            selectedStudent.is_active
                            ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
                            : 'bg-green-600 text-white hover:bg-green-700 shadow-lg shadow-green-200'
                        }`}
                    >
                        {selectedStudent.is_active ? <><BiBlock /> Hesabı Pasife Al</> : <><BiCheckCircle /> Hesabı Aktifleştir</>}
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
        <span className={`text-gray-900 font-bold ${mono ? 'font-mono' : ''} text-right truncate max-w-[150px]`}>
            {value || '-'}
        </span>
    </div>
);