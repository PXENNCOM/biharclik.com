import { useState } from 'react';
import { BiCheckCircle, BiXCircle, BiTrash, BiErrorCircle, BiInfoCircle } from 'react-icons/bi';

// 1. Başarı/Hata Bildirim Modalı
export const StatusModal = ({ isOpen, type = 'success', title, message, onClose }) => {
  if (!isOpen) return null;
  const isSuccess = type === 'success';
  
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6 transform transition-all scale-100">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${isSuccess ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
          {isSuccess ? <BiCheckCircle size={28} /> : <BiXCircle size={28} />}
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-500 text-sm mb-6">{message}</p>
        <button onClick={onClose} className="w-full py-3 bg-gray-900 text-white font-bold rounded-2xl hover:bg-black transition">
          Tamam
        </button>
      </div>
    </div>
  );
};

// 2. İptal İşlemi Modalı (Prompt yerine)
export const CancelOrderModal = ({ isOpen, onClose, onConfirm, isLoading, title = "İptal Et", message }) => {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!reason || reason.trim().length < 10) {
      setError('Lütfen en az 10 karakterlik bir açıklama girin.');
      return;
    }
    onConfirm(reason);
    setReason('');
    setError('');
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <BiTrash className="text-red-500" /> {title}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><BiXCircle size={24} /></button>
        </div>
        
        <p className="text-sm text-gray-500 mb-4">
          {message || "Bu işlem geri alınamaz. Lütfen iptal nedenini detaylı bir şekilde belirtin."}
        </p>

        <textarea 
          className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition h-24 resize-none"
          placeholder="Örn: Vazgeçtim çünkü..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
        
        {error && <p className="text-red-500 text-xs mt-2 font-medium flex items-center gap-1"><BiErrorCircle /> {error}</p>}

        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition">
            Vazgeç
          </button>
          <button 
            onClick={handleSubmit} 
            disabled={isLoading}
            className="flex-1 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition flex items-center justify-center gap-2"
          >
            {isLoading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : 'Onayla'}
          </button>
        </div>
      </div>
    </div>
  );
};

// 3. Genel Onay Modalı (Confirm yerine)
export const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, confirmText = "Evet, Devam Et", cancelText = "Vazgeç", isDanger = false }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${isDanger ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'}`}>
          <BiInfoCircle size={28} />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-500 text-sm mb-6">{message}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition">
            {cancelText}
          </button>
          <button 
            onClick={onConfirm} 
            className={`flex-1 py-3 text-white font-bold rounded-xl transition ${isDanger ? 'bg-red-600 hover:bg-red-700' : 'bg-yellow-500 hover:bg-yellow-600'}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};