// src/components/common/DepartmentSelect.jsx
import React from 'react';
import Select from 'react-select';
import { BiBook } from 'react-icons/bi';

const DepartmentSelect = ({ value, options, onChange }) => {
  // options backend'den [{id, ad}, ...] formatında geliyor, 
  // react-select için [{value, label}, ...] formatına çeviriyoruz.
  const selectOptions = options.map(opt => ({
    value: opt.id,
    label: opt.ad
  }));

  // Mevcut seçili değeri bul
  const selectedValue = selectOptions.find(opt => opt.value === value);

  // Biharçlık Tasarım Dilini (Tailwind) react-select'e entegre ediyoruz
  const customStyles = {
    control: (base, state) => ({
      ...base,
      backgroundColor: 'white',
      borderRadius: '1rem', // rounded-2xl
      borderWidth: '2px',
      borderColor: state.isFocused ? '#facc15' : '#f3f4f6', // yellow-400 : gray-100
      padding: '0.45rem',
      paddingLeft: '2.5rem', // İkon için boşluk
      boxShadow: 'none',
      transition: 'all 0.2s',
      '&:hover': { borderColor: '#facc15' }
    }),
    valueContainer: (base) => ({
      ...base,
      padding: '0px'
    }),
    placeholder: (base) => ({
      ...base,
      color: '#d1d5db', // text-gray-300
      fontWeight: '600',
      fontSize: '0.875rem'
    }),
    singleValue: (base) => ({
      ...base,
      color: '#111827', // text-gray-900
      fontWeight: '700',
      fontSize: '0.875rem'
    }),
    menu: (base) => ({
      ...base,
      borderRadius: '1.25rem',
      overflow: 'hidden',
      boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
      border: '1px solid #f3f4f6',
      zIndex: 50
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected ? '#111827' : state.isFocused ? '#fefce8' : 'white',
      color: state.isSelected ? 'white' : '#111827',
      fontWeight: '700',
      fontSize: '0.75rem',
      padding: '12px',
      cursor: 'pointer',
      '&:active': { backgroundColor: '#facc15' }
    })
  };

  return (
    <div className="group relative">
      <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
        BÖLÜM
      </label>
      
      {/* Sol taraftaki ikon - InputGroup'taki ikonla aynı hizada */}
      <div className="absolute top-[38px] left-4 z-10 text-gray-400 group-focus-within:text-yellow-500 transition-colors">
        <BiBook size={20} />
      </div>

      <Select
        options={selectOptions}
        value={selectedValue}
        // Controller'daki handleChange metodunu bozmamak için e.target simülasyonu yapıyoruz
        onChange={(opt) => onChange({ target: { name: 'department_id', value: opt.value } })}
        placeholder="Bölümünüzü seçin..."
        noOptionsMessage={() => "Bölüm bulunamadı"}
        styles={customStyles}
        className="react-select-container"
        classNamePrefix="react-select"
      />
    </div>
  );
};

export default DepartmentSelect;