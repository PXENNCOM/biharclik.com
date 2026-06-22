import { useState } from 'react';
import { BiX, BiPhone, BiLockAlt, BiLoaderAlt, BiErrorCircle, BiCheckCircle } from 'react-icons/bi';
import { PhoneVerificationModal } from './PhoneVerificationModal';
import { authService } from '../../services/authService';
import { trackEvent } from '../../utils/analytics';

/**
 * Şifremi Unuttum akışı:
 * 1. adım: telefon numarası gir, backend'de kayıtlı mı kontrol et
 * 2. adım: PhoneVerificationModal ile Firebase SMS doğrulaması (mode="reset")
 * 3. adım: yeni şifre gir, Firebase ID token + yeni şifre backend'e gönder
 */
export const ForgotPasswordModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState('phone'); // 'phone' | 'verify' | 'newPassword' | 'success'
  const [phone, setPhone] = useState('');
  const [firebaseIdToken, setFirebaseIdToken] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const resetState = () => {
    setStep('phone');
    setPhone('');
    setFirebaseIdToken(null);
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    setLoading(false);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  // 1. adım: numara kayıtlı mı kontrol et
  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!phone || phone.replace(/\D/g, '').length < 10) {
      setError('Lütfen geçerli bir telefon numarası girin');
      return;
    }

    setLoading(true);
    try {
      await authService.checkPhoneForReset(phone);
      trackEvent('SifremiUnuttum', 'numara_dogrulandi');
      setStep('verify');
    } catch (err) {
      const msg = err.response?.data?.message || 'Bu numarayla kayıtlı bir hesap bulunamadı';
      setError(msg);
      trackEvent('SifremiUnuttum', 'numara_hatasi', msg);
    } finally {
      setLoading(false);
    }
  };

  // 2. adım: SMS doğrulaması tamamlandı, token'ı sakla, yeni şifre adımına geç
  const handlePhoneVerified = (token) => {
    setFirebaseIdToken(token);
    setStep('newPassword');
  };

  // 3. adım: yeni şifreyi backend'e gönder
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 6) {
      setError('Şifre en az 6 karakter olmalı');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Şifreler eşleşmiyor');
      return;
    }

    setLoading(true);
    try {
      await authService.resetPassword(phone, firebaseIdToken, newPassword);
      trackEvent('SifremiUnuttum', 'sifre_guncellendi');
      setStep('success');
    } catch (err) {
      const msg = err.response?.data?.message || 'Şifre güncellenemedi. Lütfen tekrar deneyin.';
      setError(msg);
      trackEvent('SifremiUnuttum', 'sifre_guncelleme_hatasi', msg);
    } finally {
      setLoading(false);
    }
  };

  // SMS doğrulama adımındayken PhoneVerificationModal'ı reset modunda göster
  if (step === 'verify') {
    return (
      <PhoneVerificationModal
        isOpen={true}
        phoneNumber={phone}
        mode="reset"
        onVerified={handlePhoneVerified}
        onClose={() => setStep('phone')}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 relative max-h-[90vh] overflow-y-auto">

        {/* Kapat Butonu */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition"
        >
          <BiX size={24} className="text-gray-400" />
        </button>

        {/* STEP: Telefon Numarası */}
        {step === 'phone' && (
          <>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BiPhone size={32} className="text-yellow-600" />
              </div>
              <h3 className="text-2xl font-black text-gray-900">Şifremi Unuttum</h3>
              <p className="text-gray-500 mt-2">Hesabınıza kayıtlı telefon numarasını girin</p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm mb-4 flex items-center gap-2">
                <BiErrorCircle size={20} className="flex-shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handlePhoneSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Telefon Numarası</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="05XX XXX XX XX"
                  className="w-full bg-white text-gray-900 text-sm rounded-xl border border-gray-300 focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/20 block p-3.5 transition-all duration-200 outline-none placeholder-gray-400 font-medium"
                  autoFocus
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-4 rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <BiLoaderAlt className="animate-spin" size={20} />
                    Kontrol Ediliyor...
                  </>
                ) : (
                  'Devam Et'
                )}
              </button>
            </form>
          </>
        )}

        {/* STEP: Yeni Şifre */}
        {step === 'newPassword' && (
          <>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BiLockAlt size={32} className="text-green-600" />
              </div>
              <h3 className="text-2xl font-black text-gray-900">Yeni Şifre Belirle</h3>
              <p className="text-gray-500 mt-2">Telefon numaranız doğrulandı, şimdi yeni şifrenizi belirleyin</p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm mb-4 flex items-center gap-2">
                <BiErrorCircle size={20} className="flex-shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Yeni Şifre</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-gray-900 transition-colors">
                    <BiLockAlt size={20} />
                  </div>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white text-gray-900 text-sm rounded-xl border border-gray-300 focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/20 block pl-11 p-3.5 transition-all duration-200 outline-none placeholder-gray-400 font-medium"
                    autoFocus
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Yeni Şifre (Tekrar)</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-gray-900 transition-colors">
                    <BiLockAlt size={20} />
                  </div>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white text-gray-900 text-sm rounded-xl border border-gray-300 focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/20 block pl-11 p-3.5 transition-all duration-200 outline-none placeholder-gray-400 font-medium"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gray-900 hover:bg-black text-white font-bold py-4 rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <BiLoaderAlt className="animate-spin" size={20} />
                    Güncelleniyor...
                  </>
                ) : (
                  'Şifreyi Güncelle'
                )}
              </button>
            </form>
          </>
        )}

        {/* STEP: Başarılı */}
        {step === 'success' && (
          <>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BiCheckCircle size={32} className="text-green-600" />
              </div>
              <h3 className="text-2xl font-black text-gray-900">Şifreniz Güncellendi!</h3>
              <p className="text-gray-500 mt-2">Yeni şifrenizle giriş yapabilirsiniz.</p>
            </div>

            <button
              onClick={handleClose}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-4 rounded-xl transition"
            >
              Giriş Sayfasına Dön
            </button>
          </>
        )}

      </div>
    </div>
  );
};