import { useState, useEffect, useRef } from 'react';
import { BiX, BiPhone, BiCheckCircle, BiLoaderAlt, BiErrorCircle } from 'react-icons/bi';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { auth } from '../../config/firebase.config';
import { trackEvent } from '../../utils/analytics';

export const PhoneVerificationModal = ({ isOpen, phoneNumber, onVerified, onClose, mode = 'register' }) => {
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState('send');
  const [timer, setTimer] = useState(60);
  const recaptchaVerifierRef = useRef(null);

  // Modal kapandığında temizle
  useEffect(() => {
    if (!isOpen) {
      cleanup();
      setStep('send');
      setCode('');
      setError('');
      setConfirmationResult(null);
      setTimer(60);
      return;
    }

    initRecaptcha();

    return () => {
      cleanup();
    };
  }, [isOpen]);

  // Timer countdown
  useEffect(() => {
    if (step !== 'verify' || timer <= 0) return;
    const interval = setInterval(() => setTimer(prev => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [step, timer]);

  const cleanup = () => {
    if (recaptchaVerifierRef.current) {
      try {
        recaptchaVerifierRef.current.clear();
      } catch (e) {
        // ignore
      }
      recaptchaVerifierRef.current = null;
    }
    // Global temizlik
    if (window.recaptchaVerifier) {
      try {
        window.recaptchaVerifier.clear();
      } catch (e) {
        // ignore
      }
      window.recaptchaVerifier = null;
    }
  };

  const initRecaptcha = () => {
    cleanup();
    try {
      const verifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: () => {
          console.log('reCAPTCHA çözüldü');
        },
        'expired-callback': () => {
          console.log('reCAPTCHA süresi doldu, yeniden başlatılıyor...');
          initRecaptcha();
        },
      });
      recaptchaVerifierRef.current = verifier;
      window.recaptchaVerifier = verifier;
    } catch (err) {
      console.error('reCAPTCHA init hatası:', err);
      setError('Doğrulama servisi başlatılamadı. Sayfayı yenileyin.');
    }
  };

  const formatPhone = (phone) => {
    const cleaned = String(phone).replace(/[\s\-().]/g, '');
    if (cleaned.startsWith('+90')) return cleaned;
    if (cleaned.startsWith('90') && cleaned.length === 12) return '+' + cleaned;
    if (cleaned.startsWith('0')) return '+90' + cleaned.substring(1);
    return '+90' + cleaned;
  };

  const sendVerificationCode = async () => {
    setLoading(true);
    setError('');

    try {
      const formattedPhone = formatPhone(phoneNumber);
      console.log('SMS gönderiliyor:', formattedPhone);

      if (!recaptchaVerifierRef.current) {
        initRecaptcha();
        await new Promise(res => setTimeout(res, 500));
      }

      const confirmation = await signInWithPhoneNumber(
        auth,
        formattedPhone,
        recaptchaVerifierRef.current
      );

      console.log('SMS başarıyla gönderildi');
      setConfirmationResult(confirmation);
      setStep('verify');
      setTimer(60);
      setError('');
      trackEvent('Telefon', 'sms_gonderildi');

    } catch (err) {
      console.error('SMS gönderme hatası:', { code: err.code, message: err.message });
      trackEvent('Telefon', 'sms_hatasi', err.code || err.message);

      // reCAPTCHA'yı sıfırla, bir sonraki denemede taze başlasın
      initRecaptcha();

      let msg = 'SMS gönderilemedi. Lütfen tekrar deneyin.';
      if (err.code === 'auth/invalid-phone-number')    msg = 'Geçersiz telefon numarası formatı.';
      else if (err.code === 'auth/too-many-requests')  msg = 'Çok fazla deneme yapıldı. Lütfen 1 saat sonra tekrar deneyin.';
      else if (err.code === 'auth/quota-exceeded')     msg = 'SMS kotası doldu. Lütfen destek ekibiyle iletişime geçin.';
      else if (err.code === 'auth/captcha-check-failed' || err.code === 'auth/invalid-app-credential')
        msg = 'Güvenlik doğrulaması başarısız. Lütfen birkaç dakika sonra tekrar deneyin.';
      else if (err.code === 'auth/internal-error')     msg = 'Sunucu geçici olarak yanıt vermiyor. Lütfen tekrar deneyin.';
      else if (err.code === 'auth/network-request-failed') msg = 'Bağlantı hatası. İnternet bağlantınızı kontrol edin.';
      else if (err.message) msg = err.message;

      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async () => {
    if (code.length !== 6) { setError('Lütfen 6 haneli kodu girin'); return; }
    if (!confirmationResult) { setError('Önce SMS kodu gönderin'); return; }

    setLoading(true);
    setError('');

    try {
      const result = await confirmationResult.confirm(code);
      console.log('Firebase doğrulaması başarılı');

      const firebaseIdToken = await result.user.getIdToken();

      if (mode === 'register') {
        try {
          const { authService } = await import('../../services/authService');
          await authService.verifyPhoneNumber(firebaseIdToken);
          console.log('Backend phone_verified güncellendi');
        } catch (backendErr) {
          console.error('Backend güncelleme hatası:', backendErr);
          trackEvent('Telefon', 'backend_dogrulama_hatasi', backendErr?.message);
        }
      }

      trackEvent('Telefon', 'dogrulama_tamamlandi');
      onVerified(firebaseIdToken);

    } catch (err) {
      console.error('Kod doğrulama hatası:', err);
      trackEvent('Telefon', 'kod_hatasi', err.code);

      let msg = 'Kod doğrulanamadı. Lütfen tekrar deneyin.';
      if (err.code === 'auth/invalid-verification-code') msg = 'Hatalı kod. Lütfen kontrol edin.';
      else if (err.code === 'auth/code-expired')         msg = 'Kodun süresi doldu. Yeni kod gönderin.';

      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = () => {
    setStep('send');
    setCode('');
    setError('');
    setConfirmationResult(null);
    initRecaptcha();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 relative max-h-[90vh] overflow-y-auto">

        {/* Invisible reCAPTCHA container */}
        <div id="recaptcha-container"></div>

        {/* Kapat */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition"
        >
          <BiX size={24} className="text-gray-400" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BiPhone size={32} className="text-yellow-600" />
          </div>
          <h3 className="text-2xl font-black text-gray-900">Telefon Doğrulama</h3>
          <p className="text-gray-500 mt-2">
            {step === 'send'
              ? `${phoneNumber} numarasına SMS göndereceğiz`
              : 'Telefonunuza gelen 6 haneli kodu girin'}
          </p>
        </div>

        {/* Hata */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm mb-4 flex items-center gap-2">
            <BiErrorCircle className="flex-shrink-0" size={20} />
            {error}
          </div>
        )}

        {/* STEP: SMS Gönder */}
        {step === 'send' && (
          <button
            onClick={sendVerificationCode}
            disabled={loading}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-4 rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <BiLoaderAlt className="animate-spin" size={20} />
                SMS Gönderiliyor...
              </>
            ) : (
              <>
                <BiPhone size={20} />
                SMS Kodu Gönder
              </>
            )}
          </button>
        )}

        {/* STEP: Kod Girişi */}
        {step === 'verify' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Doğrulama Kodu</label>
              <input
                type="text"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                placeholder="123456"
                className="w-full text-center text-2xl font-bold tracking-widest border-2 border-gray-200 rounded-xl p-4 focus:border-yellow-400 focus:outline-none"
                autoFocus
              />
            </div>

            <div className="text-center">
              {timer > 0 ? (
                <p className="text-sm text-gray-500">
                  Kod tekrar gönderilebilir: <span className="font-bold text-yellow-600">{timer}s</span>
                </p>
              ) : (
                <button
                  onClick={handleResend}
                  className="text-sm text-yellow-600 font-bold hover:underline"
                >
                  Kodu Tekrar Gönder
                </button>
              )}
            </div>

            <button
              onClick={verifyCode}
              disabled={loading || code.length !== 6}
              className="w-full bg-gray-900 hover:bg-black text-white font-bold py-4 rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <BiLoaderAlt className="animate-spin" size={20} />
                  Doğrulanıyor...
                </>
              ) : (
                <>
                  <BiCheckCircle size={20} />
                  Doğrula
                </>
              )}
            </button>
          </div>
        )}

      </div>
    </div>
  );
};