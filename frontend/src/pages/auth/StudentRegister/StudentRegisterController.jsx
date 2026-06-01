import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../../services/authService';
import { trackEvent } from '../../../utils/analytics';
import DesktopStudentRegister from './DesktopStudentRegister';
import MobileStudentRegister from './MobileStudentRegister';

const getErrorMessage = (err) => {
  const data = err.response?.data;
  if (data?.errors?.length > 0) return data.errors.map(e => e.message).join(' • ');
  return data?.message || 'Bir hata oluştu';
};

const StudentRegisterController = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [formData, setFormData] = useState({
    email: '', 
    phone: '', 
    password: '', 
    password_confirm: '',
    first_name: '', 
    last_name: '', 
    tc_no: '', 
    birth_date: '',
    iban: '', 
    university: '', 
    // GÜNCELLEME: Artık department değil, department_id tutuyoruz
    department_id: '', 
    kvkk_accepted: false, 
    terms_accepted: false,
  });
  
  const [bolumler, setBolumler] = useState([]); // DB'den gelecek bölümler
  const [studentDocument, setStudentDocument] = useState(null);
  const [showKvkkModal, setShowKvkkModal] = useState(false);
  const [kvkkModalType, setKvkkModalType] = useState('aydinlatma');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [showPhoneModal, setShowPhoneModal] = useState(false);

  const navigate = useNavigate();

  // Ekran boyutu kontrolü ve ilk log
  useEffect(() => {
    trackEvent('Kayıt', 'öğrenci_kayıt_sayfası_açıldı');
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Bölümleri backend'den çek
  useEffect(() => {
    const fetchBolumler = async () => {
      try {
        const res = await authService.getBolumler();
        // BackendApiResponse yapısına göre res.data içindeki veriyi alıyoruz
        setBolumler(res.data || []); 
      } catch (err) {
        console.error("Bölümler yüklenemedi:", err);
      }
    };
    fetchBolumler();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { 
      setError('Dosya boyutu 5MB\'dan büyük olamaz'); 
      return; 
    }
    setStudentDocument(file);
    setError('');
    trackEvent('Kayıt', 'öğrenci_belgesi_yüklendi');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validasyonlar
    if (!phoneVerified) { setError('Lütfen telefon numaranızı doğrulayın'); return; }
    if (formData.password !== formData.password_confirm) { setError('Şifreler eşleşmiyor'); return; }
    if (!formData.department_id) { setError('Lütfen bir bölüm seçiniz'); return; }
    if (!studentDocument) { setError('Lütfen öğrenci belgesini yükleyin'); return; }
    if (!formData.kvkk_accepted || !formData.terms_accepted) { setError('Lütfen yasal metinleri onaylayın'); return; }

    setLoading(true);
    try {
      const data = new FormData();
      
      // FormData hazırlama (department_id otomatik olarak eklenecektir)
      Object.keys(formData).forEach(key => {
        data.append(key, formData[key]);
      });
      
      data.append('student_document', studentDocument);

      await authService.registerStudent(data);
      
      trackEvent('Kayıt', 'öğrenci_kayıt_tamamlandı');
      navigate('/register/success');
    } catch (err) {
      const msg = getErrorMessage(err);
      setError(msg);
      trackEvent('Kayıt', 'öğrenci_kayıt_hatası', msg);
    } finally {
      setLoading(false);
    }
  };

  const props = {
    formData, 
    bolumler, 
    studentDocument, 
    error, 
    loading,
    phoneVerified, 
    showPhoneModal, 
    showKvkkModal, 
    kvkkModalType,
    handleChange, 
    handleFileChange, 
    handleSubmit,
    setShowPhoneModal, 
    setShowKvkkModal, 
    setKvkkModalType,
    onPhoneVerified: () => { setPhoneVerified(true); setShowPhoneModal(false); },
  };

  return isMobile ? <MobileStudentRegister {...props} /> : <DesktopStudentRegister {...props} />;
};

export default StudentRegisterController;