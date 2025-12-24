// Dosya: /src/pages/common/ProfilePage.jsx

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { userService } from '../../services/userService';
import { StatusModal } from '../../components/common/ActionModals'

// ModernHeader ve İkonlar
import { ModernHeader } from '../common/ModernHeader';
import {
  BiUser,
  BiIdCard,
  BiCalendar,
  BiBuilding,
  BiBook,
  BiCreditCard,
  BiMap,
  BiEnvelope,
  BiPhone,
  BiCheckCircle,
  BiErrorCircle,
  BiEdit,
  BiLock,
  BiX,
  BiSave,
  BiShield
} from 'react-icons/bi';

export const ProfilePage = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Edit modals
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);

  // Form data
  const [editData, setEditData] = useState({});
  const [passwordData, setPasswordData] = useState({
    old_password: '',
    new_password: '',
    new_password_confirm: '',
  });

  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  const [statusModal, setStatusModal] = useState({ isOpen: false, type: 'success', title: '', message: '' });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await userService.getMyProfile();
      const profileData = response.data.data || response.data;
      setProfile(profileData);
      setEditData(profileData);
    } catch (err) {
      setError(err.response?.data?.message || 'Profil yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const handleEditProfile = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormLoading(true);

    try {
      const response = await userService.updateProfile(editData);
      const updatedProfile = response.data.data || response.data;
      setProfile(updatedProfile);
      updateUser(updatedProfile);
      setShowEditProfile(false);
      setStatusModal({ isOpen: true, type: 'success', title: 'Başarılı', message: 'Profil başarıyla güncellendi!' });
    } catch (err) {
      setFormError(err.response?.data?.message || 'Güncelleme başarısız');
    } finally {
      setFormLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setFormError('');

    if (passwordData.new_password !== passwordData.new_password_confirm) {
      setFormError('Yeni şifreler eşleşmiyor');
      return;
    }

    setFormLoading(true);

    try {
      await userService.changePassword(
        passwordData.old_password,
        passwordData.new_password,
        passwordData.new_password_confirm
      );

      setShowChangePassword(false);
      setPasswordData({ old_password: '', new_password: '', new_password_confirm: '' });
      setStatusModal({ isOpen: true, type: 'success', title: 'Başarılı', message: 'Şifre başarıyla değiştirildi!' });
    } catch (err) {
      setFormError(err.response?.data?.message || 'Şifre değiştirilemedi');
    } finally {
      setFormLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-yellow-500"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Profil yüklenemedi</p>
          <button onClick={() => navigate(-1)} className="text-blue-600 hover:underline">
            Geri Dön
          </button>
        </div>
      </div>
    );
  }

  // Avatar için baş harfleri alma
  const getInitials = () => {
    if (profile.first_name && profile.last_name) {
      return `${profile.first_name[0]}${profile.last_name[0]}`.toUpperCase();
    }
    return profile.email ? profile.email.substring(0, 2).toUpperCase() : '??';
  };

  const getProfilePhotoUrl = () => {
    if (profile?.profile_photo) {
      if (profile.profile_photo.startsWith('http')) {
        return profile.profile_photo;
      }
      const baseURL = 'http://localhost:3001';
      return `${baseURL}${profile.profile_photo}`;
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-24 md:pb-10">

      {/* --- HEADER --- */}
      <ModernHeader
        title="Profilim"
        subtitle="Hesap Ayarları ve Bilgiler"
        showBackButton={true}
        onBack={() => navigate(-1)}
        onLogout={() => { logout(); navigate('/login'); }}
      />

      <main className="max-w-7xl mx-auto px-4 md:px-6 pt-4 md:pt-8 space-y-6 md:space-y-8">

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 md:p-4 rounded-xl md:rounded-2xl flex items-center gap-2 md:gap-3 text-sm md:text-base">
            <BiErrorCircle size={20} className="md:w-6 md:h-6 flex-shrink-0" />
            <span className="text-xs md:text-sm">{error}</span>
          </div>
        )}

        {/* --- HERO SECTION --- */}
        <div className="bg-white rounded-2xl md:rounded-3xl shadow-sm border border-gray-100 overflow-hidden">

          {/* Kapak */}
          <div className="h-24 md:h-32 lg:h-40 w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-transparent"></div>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 via-yellow-500 to-transparent"></div>
          </div>

          <div className="px-4 md:px-6 lg:px-8 pb-4 md:pb-6 lg:pb-8">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-4 md:gap-6 -mt-12 md:-mt-16">

              {/* Avatar */}
              <div className="relative shrink-0">
                <div className="w-20 h-20 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-2xl md:rounded-3xl shadow-xl border-4 border-white overflow-hidden">
                  {getProfilePhotoUrl() ? (
                    <img
                      src={getProfilePhotoUrl()}
                      alt="Profil"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextElementSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div
                    className={`w-full h-full bg-yellow-400 flex items-center justify-center text-2xl md:text-3xl lg:text-4xl font-black text-gray-900 ${getProfilePhotoUrl() ? 'hidden' : 'flex'}`}
                  >
                    {getInitials()}
                  </div>
                </div>
                <div className="absolute bottom-0 right-0 md:bottom-1 md:right-1 bg-green-500 border-4 border-white w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 rounded-full"></div>
              </div>

              {/* Info */}
              <div className="flex-1 text-center md:text-left w-full">
                <h1 className="text-xl md:text-2xl lg:text-3xl font-black text-gray-900 mb-1 md:mb-2 line-clamp-1 break-words">
                  {profile.first_name ? `${profile.first_name} ${profile.last_name}` : profile.email}
                </h1>

                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-xs md:text-sm">
                  <span className="px-2.5 md:px-3 py-1 bg-gray-100 text-gray-700 rounded-full font-bold">
                    {user.role === 'student' ? '🎒 Öğrenci Kurye' : '📦 Gönderici'}
                  </span>
                  <span className="hidden md:inline text-gray-300">•</span>
                  <span className="text-gray-500 truncate max-w-[200px] md:max-w-none">{profile.email}</span>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-2 md:gap-3 w-full md:w-auto">
                <button
                  onClick={() => setShowEditProfile(true)}
                  className="flex-1 md:flex-none flex items-center justify-center gap-1.5 md:gap-2 px-3 md:px-5 lg:px-6 py-2 md:py-2.5 lg:py-3 bg-yellow-400 hover:bg-yellow-500 text-gray-900 text-xs md:text-sm font-bold rounded-xl transition-all shadow-sm active:scale-95"
                >
                  <BiEdit size={16} className="md:w-5 md:h-5" />
                  <span>Düzenle</span>
                </button>
                <button
                  onClick={() => setShowChangePassword(true)}
                  className="flex-1 md:flex-none flex items-center justify-center gap-1.5 md:gap-2 px-3 md:px-5 lg:px-6 py-2 md:py-2.5 lg:py-3 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 text-xs md:text-sm font-bold rounded-xl transition-all"
                >
                  <BiShield size={16} className="md:w-5 md:h-5" />
                  <span>Şifre</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* --- GRID LAYOUT --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">

          {/* SOL KOLON */}
          <div className="lg:col-span-2 space-y-4 md:space-y-6 lg:space-y-8">

            {/* Kimlik & Kurumsal */}
            <div className="bg-white rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-4 md:mb-6 lg:mb-8">
                <div className="p-2 md:p-2.5 lg:p-3 bg-yellow-50 text-yellow-600 rounded-xl md:rounded-2xl">
                  {user.role === 'student' ? <BiBook size={20} className="md:w-6 md:h-6" /> : <BiBuilding size={20} className="md:w-6 md:h-6" />}
                </div>
                <h3 className="text-base md:text-lg lg:text-xl font-bold text-gray-900">
                  {user.role === 'student' ? 'Eğitim & Kimlik' : 'Firma Bilgileri'}
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
                {/* Öğrenci */}
                {user.role === 'student' && (
                  <>
                    <InfoGroup icon={<BiIdCard />} label="TC Kimlik No" value={profile.tc_no} />
                    <InfoGroup icon={<BiCalendar />} label="Doğum Tarihi" value={new Date(profile.birth_date).toLocaleDateString('tr-TR')} />
                    <InfoGroup icon={<BiBook />} label="Üniversite" value={profile.university} highlight />
                    <InfoGroup icon={<BiBuilding />} label="Bölüm" value={profile.department} />
                    <div className="md:col-span-2 bg-gray-50 p-3 md:p-4 rounded-xl border border-gray-100 border-dashed flex items-start gap-3">
                      <div className="p-2 md:p-2.5 bg-white rounded-lg shadow-sm text-gray-600 shrink-0">
                        <BiCreditCard size={20} className="md:w-6 md:h-6" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase mb-1">IBAN</p>
                        <p className="font-mono text-xs md:text-sm text-gray-900 font-medium break-all">{profile.iban}</p>
                      </div>
                    </div>
                  </>
                )}

                {/* Gönderici */}
                {user.role === 'sender' && (
                  <>
                    {profile.company_name ? (
                      <>
                        <InfoGroup icon={<BiBuilding />} label="Firma Adı" value={profile.company_name} highlight />
                        <InfoGroup icon={<BiBuilding />} label="Vergi Dairesi" value={profile.tax_office} />
                        <InfoGroup icon={<BiIdCard />} label="Vergi No" value={profile.tax_number} />
                      </>
                    ) : (
                      <>
                        <InfoGroup icon={<BiUser />} label="Ad Soyad" value={`${profile.first_name} ${profile.last_name}`} />
                        <InfoGroup icon={<BiIdCard />} label="TC No" value={profile.tc_no} />
                      </>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Adres */}
            <div className="bg-white rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-4 md:mb-6">
                <div className="p-2 md:p-2.5 lg:p-3 bg-blue-50 text-blue-600 rounded-xl md:rounded-2xl">
                  <BiMap size={20} className="md:w-6 md:h-6" />
                </div>
                <h3 className="text-base md:text-lg lg:text-xl font-bold text-gray-900">
                  {user.role === 'sender' ? 'Fatura Adresi' : 'İkamet Adresi'}
                </h3>
              </div>
              <div className="bg-gray-50 p-4 md:p-5 lg:p-6 rounded-xl md:rounded-2xl border border-gray-100 text-sm md:text-base text-gray-700 leading-relaxed break-words">
                {user.role === 'sender' ? profile.billing_address : profile.address}
              </div>
            </div>
          </div>

          {/* SAĞ KOLON */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8 shadow-sm border border-gray-100 h-full">
              <div className="flex items-center gap-3 mb-4 md:mb-6 lg:mb-8">
                <div className="p-2 md:p-2.5 lg:p-3 bg-purple-50 text-purple-600 rounded-xl md:rounded-2xl">
                  <BiPhone size={20} className="md:w-6 md:h-6" />
                </div>
                <h3 className="text-base md:text-lg lg:text-xl font-bold text-gray-900">İletişim</h3>
              </div>

              <div className="space-y-4 md:space-y-6">
                {/* Email */}
                <div className="group p-3 md:p-4 rounded-xl md:rounded-2xl hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-colors">
                  <div className="flex items-center gap-2 md:gap-3 mb-2">
                    <BiEnvelope className="text-gray-400 group-hover:text-purple-600 transition-colors shrink-0" size={18} />
                    <span className="text-[10px] md:text-xs font-bold text-gray-500 uppercase">E-posta</span>
                  </div>
                  <p className="text-sm md:text-base text-gray-900 font-medium break-all mb-2">{profile.email}</p>
                  {profile.email_verified ? (
                    <Badge type="success" text="Doğrulanmış" />
                  ) : (
                    <Badge type="warning" text="Doğrulanmamış" />
                  )}
                </div>

                <div className="h-px bg-gray-100"></div>

                {/* Phone */}
                <div className="group p-3 md:p-4 rounded-xl md:rounded-2xl hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-colors">
                  <div className="flex items-center gap-2 md:gap-3 mb-2">
                    <BiPhone className="text-gray-400 group-hover:text-purple-600 transition-colors shrink-0" size={18} />
                    <span className="text-[10px] md:text-xs font-bold text-gray-500 uppercase">Telefon</span>
                  </div>
                  <p className="text-sm md:text-base text-gray-900 font-medium mb-2">{profile.phone}</p>
                  {profile.phone_verified ? (
                    <Badge type="success" text="Doğrulanmış" />
                  ) : (
                    <Badge type="warning" text="Doğrulanmamış" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* --- MODAL: PROFIL DÜZENLE --- */}
      {showEditProfile && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl md:rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-4 md:p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
              <div className='flex items-center gap-2 md:gap-3'>
                <div className='p-1.5 md:p-2 bg-yellow-100 rounded-lg text-yellow-700'>
                  <BiEdit size={20} className="md:w-6 md:h-6" />
                </div>
                <h2 className="text-lg md:text-xl font-black text-gray-900">Profili Düzenle</h2>
              </div>
              <button
                onClick={() => setShowEditProfile(false)}
                className="p-2 bg-gray-50 hover:bg-gray-100 rounded-full transition text-gray-500"
              >
                <BiX size={20} className="md:w-6 md:h-6" />
              </button>
            </div>

            <div className="p-4 md:p-6 lg:p-8">
              {formError && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-3 md:p-4 rounded-xl mb-4 md:mb-6 text-xs md:text-sm flex gap-2 items-center">
                  <BiErrorCircle size={18} className="shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <form onSubmit={handleEditProfile} className="space-y-4 md:space-y-6">
                {(user.role === 'student' || (user.role === 'sender' && editData.first_name)) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <InputGroup label="Ad" value={editData.first_name} onChange={(v) => setEditData({ ...editData, first_name: v })} />
                    <InputGroup label="Soyad" value={editData.last_name} onChange={(v) => setEditData({ ...editData, last_name: v })} />
                  </div>
                )}

                {user.role === 'student' && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                      <InputGroup label="Üniversite" value={editData.university} onChange={(v) => setEditData({ ...editData, university: v })} />
                      <InputGroup label="IBAN" value={editData.iban} onChange={(v) => setEditData({ ...editData, iban: v })} isMono />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase ml-1">Adres</label>
                      <textarea
                        rows="3"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 md:p-4 text-xs md:text-sm focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition resize-none outline-none"
                        value={editData.address || ''}
                        onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                      />
                    </div>
                  </>
                )}

                {user.role === 'sender' && editData.company_name && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <InputGroup label="Firma Adı" value={editData.company_name} onChange={(v) => setEditData({ ...editData, company_name: v })} />
                    <InputGroup label="Vergi Dairesi" value={editData.tax_office} onChange={(v) => setEditData({ ...editData, tax_office: v })} />
                  </div>
                )}

                {user.role === 'sender' && (
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Fatura Adresi</label>
                    <textarea
                      rows="3"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 md:p-4 text-xs md:text-sm focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition resize-none outline-none"
                      value={editData.billing_address || ''}
                      onChange={(e) => setEditData({ ...editData, billing_address: e.target.value })}
                    />
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-4 md:pt-6 border-t border-gray-50">
                  <button
                    type="button"
                    onClick={() => setShowEditProfile(false)}
                    className="w-full sm:flex-1 py-3 md:py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition text-sm md:text-base"
                  >
                    Vazgeç
                  </button>
                  <button
                    type="submit"
                    disabled={formLoading}
                    className="w-full sm:flex-1 py-3 md:py-4 bg-yellow-400 hover:bg-yellow-500 text-black font-bold rounded-xl shadow-lg transition disabled:opacity-50 flex items-center justify-center gap-2 text-sm md:text-base"
                  >
                    {formLoading ? 'Kaydediliyor...' : <><BiSave size={18} className="md:w-5 md:h-5" /> Kaydet</>}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL: ŞİFRE DEĞİŞTİR --- */}
      {showChangePassword && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl md:rounded-3xl w-full max-w-md shadow-2xl">
            <div className="p-4 md:p-6 border-b border-gray-100 flex justify-between items-center">
              <div className='flex items-center gap-2 md:gap-3'>
                <div className='p-1.5 md:p-2 bg-gray-100 rounded-lg text-gray-700'>
                  <BiLock size={20} className="md:w-6 md:h-6" />
                </div>
                <h2 className="text-lg md:text-xl font-black text-gray-900">Şifre Değiştir</h2>
              </div>
              <button
                onClick={() => setShowChangePassword(false)}
                className="p-2 bg-gray-50 hover:bg-gray-100 rounded-full transition text-gray-500"
              >
                <BiX size={20} className="md:w-6 md:h-6" />
              </button>
            </div>

            <div className="p-4 md:p-6 lg:p-8">
              {formError && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-3 md:p-4 rounded-xl mb-4 md:mb-6 text-xs md:text-sm">
                  {formError}
                </div>
              )}

              <form onSubmit={handleChangePassword} className="space-y-4 md:space-y-5">
                <InputGroup type="password" label="Mevcut Şifre" value={passwordData.old_password} onChange={(v) => setPasswordData({ ...passwordData, old_password: v })} />
                <div className="h-px bg-gray-100"></div>
                <InputGroup type="password" label="Yeni Şifre" value={passwordData.new_password} onChange={(v) => setPasswordData({ ...passwordData, new_password: v })} />
                <InputGroup type="password" label="Yeni Şifre (Tekrar)" value={passwordData.new_password_confirm} onChange={(v) => setPasswordData({ ...passwordData, new_password_confirm: v })} />

                <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-2 md:pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowChangePassword(false);
                      setPasswordData({ old_password: '', new_password: '', new_password_confirm: '' });
                    }}
                    className="w-full sm:flex-1 py-3 md:py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition text-sm md:text-base"
                  >
                    Vazgeç
                  </button>
                  <button
                    type="submit"
                    disabled={formLoading}
                    className="w-full sm:flex-1 py-3 md:py-4 bg-gray-900 hover:bg-black text-white font-bold rounded-xl shadow-lg transition disabled:opacity-50 text-sm md:text-base"
                  >
                    {formLoading ? '...' : 'Güncelle'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <StatusModal
        isOpen={statusModal.isOpen}
        type={statusModal.type}
        title={statusModal.title}
        message={statusModal.message}
        onClose={() => setStatusModal({ ...statusModal, isOpen: false })}
      />
    </div>
  );
};

// Helper Components
const InfoGroup = ({ icon, label, value, highlight }) => {
  if (!value) return null;
  return (
    <div className="flex items-start gap-2 md:gap-3 lg:gap-4">
      <div className={`mt-0.5 md:mt-1 text-lg md:text-xl shrink-0 ${highlight ? 'text-yellow-600' : 'text-gray-400'}`}>
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] md:text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
          {label}
        </p>
        <p className={`text-sm md:text-base text-gray-900 font-medium break-words ${highlight ? 'font-bold' : ''}`}>
          {value}
        </p>
      </div>
    </div>
  );
};

const Badge = ({ type, text }) => {
  const styles = type === 'success'
    ? "text-green-700 bg-green-50 border-green-200"
    : "text-yellow-700 bg-yellow-50 border-yellow-200";

  const Icon = type === 'success' ? BiCheckCircle : BiErrorCircle;

  return (
    <span className={`inline-flex items-center gap-1 md:gap-1.5 text-[10px] md:text-xs font-bold px-2 md:px-2.5 py-1 md:py-1.5 rounded-lg border ${styles}`}>
      <Icon size={12} className="md:w-3.5 md:h-3.5" /> {text}
    </span>
  );
};

const InputGroup = ({ label, value, onChange, type = "text", isMono }) => (
  <div className="space-y-2">
    <label className="text-xs font-bold text-gray-500 uppercase ml-1">{label}</label>
    <input
      type={type}
      className={`w-full bg-gray-50 border border-gray-200 rounded-xl p-3 md:p-4 text-xs md:text-sm outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition ${isMono ? 'font-mono' : ''}`}
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);