import { useState, useEffect } from 'react';
import { BiX, BiPhone, BiCheckCircle, BiLoaderAlt, BiErrorCircle } from 'react-icons/bi';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { auth } from '../../config/firebase.config';

export const PhoneVerificationModal = ({ isOpen, phoneNumber, onVerified, onClose }) => {
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState('send'); 
  const [timer, setTimer] = useState(60);
  const [recaptchaReady, setRecaptchaReady] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    if (window.recaptchaVerifier) {
      try {
        window.recaptchaVerifier.clear();
      } catch (e) {
        console.log('Önceki reCAPTCHA temizlendi');
      }
      window.recaptchaVerifier = null;
    }

    try {
      const recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'normal',
        callback: () => {
          console.log('reCAPTCHA çözüldü');
          setRecaptchaReady(true);
        },
        'expired-callback': () => {
          console.log('reCAPTCHA süresi doldu');
          setRecaptchaReady(false);
          setError('reCAPTCHA süresi doldu, lütfen tekrar çözün');
        }
      });

      window.recaptchaVerifier = recaptchaVerifier;

      recaptchaVerifier.render().then(() => {
        console.log('reCAPTCHA hazır');
      }).catch((err) => {
        console.error('reCAPTCHA render hatası:', err);
        setError('reCAPTCHA yüklenemedi. Sayfayı yenileyin.');
      });

    } catch (error) {
      console.error('reCAPTCHA oluşturma hatası:', error);
      setError('reCAPTCHA başlatılamadı');
    }

    // Cleanup
    return () => {
      if (window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier.clear();
        } catch (e) {
          // Hata olsa bile devam
        }
        window.recaptchaVerifier = null;
      }
    };
  }, [isOpen]);

  // Timer countdown
  useEffect(() => {
    if (step === 'verify' && timer > 0) {
      const interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [step, timer]);

  // SMS Gönder
  const sendVerificationCode = async () => {
    setLoading(true);
    setError('');

    try {
      // Telefon formatını düzelt
      const formattedPhone = phoneNumber.startsWith('+90') 
        ? phoneNumber 
        : `+90${phoneNumber.substring(1)}`;

      console.log('SMS gönderiliyor:', formattedPhone);

      const appVerifier = window.recaptchaVerifier;
      
      if (!appVerifier) {
        throw new Error('reCAPTCHA hazır değil');
      }

      // Firebase ile SMS gönder
      const confirmation = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
      
      console.log('SMS başarıyla gönderildi');
      
      setConfirmationResult(confirmation);
      setStep('verify');
      setTimer(60);
      
    } catch (err) {
      console.error('SMS gönderme hatası:', err);
      
      // Hata mesajları
      let errorMessage = 'SMS gönderilemedi. Lütfen tekrar deneyin.';
      
      if (err.code === 'auth/invalid-phone-number') {
        errorMessage = 'Geçersiz telefon numarası formatı';
      } else if (err.code === 'auth/too-many-requests') {
        errorMessage = 'Çok fazla deneme yapıldı. Lütfen 1 saat sonra tekrar deneyin.';
      } else if (err.code === 'auth/quota-exceeded') {
        errorMessage = 'SMS kotası doldu. Lütfen destek ekibiyle iletişime geçin.';
      } else if (err.code === 'auth/invalid-app-credential') {
        errorMessage = 'Firebase yapılandırma hatası. Yöneticiyle iletişime geçin.';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      
    } finally {
      setLoading(false);
    }
  };

  // Kodu Doğrula
  const verifyCode = async () => {
    if (code.length !== 6) {
      setError('Lütfen 6 haneli kodu girin');
      return;
    }

    if (!confirmationResult) {
      setError('Önce SMS kodu gönderin');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await confirmationResult.confirm(code);
      
      console.log('Telefon başarıyla doğrulandı!');
      
      // Başarılı! Parent'a bildir
      onVerified();
      
    } catch (err) {
      console.error('Kod doğrulama hatası:', err);
      
      let errorMessage = 'Kod doğrulanamadı';
      
      if (err.code === 'auth/invalid-verification-code') {
        errorMessage = 'Hatalı kod. Lütfen kontrol edin.';
      } else if (err.code === 'auth/code-expired') {
        errorMessage = 'Kod süresi doldu. Yeni kod gönderin.';
      }
      
      setError(errorMessage);
      
    } finally {
      setLoading(false);
    }
  };

  // Modal kapalıysa render etme
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 relative max-h-[90vh] overflow-y-auto">
        
        {/* Kapat Butonu */}
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

        {/* Hata Mesajı */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm mb-4 flex items-center gap-2">
            <BiErrorCircle size={20} />
            {error}
          </div>
        )}

        {/* STEP 1: reCAPTCHA ve SMS Gönder */}
        {step === 'send' && (
          <div className="space-y-4">
            {/* reCAPTCHA Container */}
            <div className="flex justify-center p-4 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
              <div id="recaptcha-container"></div>
            </div>

            {/* SMS Gönder Butonu */}
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
          </div>
        )}

        {/* STEP 2: Kod Girişi */}
        {step === 'verify' && (
          <div className="space-y-4">
            {/* Kod Input */}
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

            {/* Timer */}
            <div className="text-center">
              {timer > 0 ? (
                <p className="text-sm text-gray-500">
                  Kod tekrar gönderilebilir: <span className="font-bold text-yellow-600">{timer}s</span>
                </p>
              ) : (
                <button
                  onClick={() => { 
                    setStep('send'); 
                    setCode(''); 
                    setError('');
                  }}
                  className="text-sm text-yellow-600 font-bold hover:underline"
                >
                  Kodu Tekrar Gönder
                </button>
              )}
            </div>

            {/* Doğrula Butonu */}
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
