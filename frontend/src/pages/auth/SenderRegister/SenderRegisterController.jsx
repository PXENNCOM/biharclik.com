import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../../services/authService';
import { trackEvent } from '../../../utils/analytics';
import DesktopSenderRegister from './DesktopSenderRegister';
import MobileSenderRegister from './MobileSenderRegister';

const getErrorMessage = (err) => {
  const data = err.response?.data;
  if (data?.errors?.length > 0) return data.errors.map(e => e.message).join(' • ');
  return data?.message || 'Bir hata oluştu';
};

const SenderRegisterController = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [accountType, setAccountType] = useState('individual');
  const [formData, setFormData] = useState({
    email: '', phone: '', password: '', password_confirm: '',
    first_name: '', last_name: '', tc_no: '',
    company_name: '', tax_office: '', tax_number: '',
    billing_address: '', kvkk_accepted: false, terms_accepted: false,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [showKvkkModal, setShowKvkkModal] = useState(false);
  const [kvkkModalType, setKvkkModalType] = useState('aydinlatma');

  const navigate = useNavigate();

  useEffect(() => {
    trackEvent('Kayıt', 'gönderici_kayıt_sayfası_açıldı');
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!phoneVerified) { setError('Lütfen telefon numaranızı doğrulayın'); return; }
    if (formData.password !== formData.password_confirm) { setError('Şifreler eşleşmiyor'); return; }
    if (!formData.kvkk_accepted || !formData.terms_accepted) { setError('Lütfen yasal metinleri onaylayın'); return; }

    setLoading(true);
    try {
      const submitData = {
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        password_confirm: formData.password_confirm,
        account_type: accountType,
        billing_address: formData.billing_address,
        kvkk_accepted: formData.kvkk_accepted,
        terms_accepted: formData.terms_accepted,
      };

      if (accountType === 'individual') {
        submitData.first_name = formData.first_name;
        submitData.last_name = formData.last_name;
        submitData.tc_no = formData.tc_no;
      } else {
        submitData.company_name = formData.company_name;
        submitData.tax_office = formData.tax_office;
        submitData.tax_number = formData.tax_number;
      }

      await authService.registerSender(submitData);
      trackEvent('Kayıt', 'gönderici_kayıt_tamamlandı', accountType);
      navigate('/sender/dashboard');
    } catch (err) {
      const msg = getErrorMessage(err);
      setError(msg);
      trackEvent('Kayıt', 'gönderici_kayıt_hatası', msg);
    } finally {
      setLoading(false);
    }
  };

  const props = {
    formData, accountType, error, loading,
    phoneVerified, showPhoneModal, showKvkkModal, kvkkModalType,
    handleChange, handleSubmit,
    setAccountType, setShowPhoneModal, setShowKvkkModal, setKvkkModalType,
    onPhoneVerified: () => {
      setPhoneVerified(true);
      setShowPhoneModal(false);
    },
  };

  return isMobile ? <MobileSenderRegister {...props} /> : <DesktopSenderRegister {...props} />;
};

export default SenderRegisterController;