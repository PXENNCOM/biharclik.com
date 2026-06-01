
import { useEffect, useRef } from 'react';
import { BiCreditCard } from 'react-icons/bi';

export const Step4 = ({ checkoutFormContent, orderNumber, amount }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!checkoutFormContent || !containerRef.current) return;

    containerRef.current.innerHTML = '';

    const formDiv = document.createElement('div');
    formDiv.id = 'iyzipay-checkout-form';
    formDiv.className = 'responsive';
    containerRef.current.appendChild(formDiv);

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = checkoutFormContent;
    const script = tempDiv.querySelector('script');
    if (script) {
      const newScript = document.createElement('script');
      newScript.type = 'text/javascript';
      newScript.textContent = script.textContent;
      document.head.appendChild(newScript);
    }
  }, [checkoutFormContent]);

  return (
    <div className="flex flex-col gap-5">
      <div className="p-4 bg-gray-900 rounded-2xl flex items-center justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-[#FBCF2D]">Sipariş No</p>
          <p className="text-sm font-black text-white">{orderNumber}</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Ödenecek Tutar</p>
          <p className="text-xl font-black text-[#FBCF2D]">{amount}₺</p>
        </div>
      </div>
      <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex items-start gap-3">
        <BiCreditCard size={18} className="text-blue-500 shrink-0 mt-0.5" />
        <div>
          <p className="text-[11px] font-black text-blue-800 mb-1">Güvenli Ödeme</p>
          <p className="text-[10px] font-medium text-blue-600 leading-relaxed">
            Ödemeniz İyzico altyapısı ile SSL şifreli olarak işlenir. Kart bilgileriniz sistemimizde saklanmaz.
          </p>
        </div>
      </div>
      <div ref={containerRef} className="min-h-[400px]" />
    </div>
  );
};