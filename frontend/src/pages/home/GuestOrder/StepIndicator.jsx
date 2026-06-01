import { BiCheck } from 'react-icons/bi';
import { STEPS } from './constants';

export const StepIndicator = ({ current }) => (
  <div className="flex items-center justify-center gap-2 mb-10">
    {STEPS.map((label, i) => (
      <div key={i} className="flex items-center gap-2">
        <div className="flex flex-col items-center gap-1.5">
          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black transition-all duration-300 ${
            i < current ? 'bg-gray-900 text-[#FBCF2D]' : i === current ? 'bg-[#FBCF2D] text-gray-900' : 'bg-gray-100 text-gray-400'
          }`}>
            {i < current ? <BiCheck size={14} /> : i + 1}
          </div>
          <span className={`text-[9px] font-black uppercase tracking-wider hidden sm:block ${i === current ? 'text-gray-900' : 'text-gray-300'}`}>
            {label}
          </span>
        </div>
        {i < STEPS.length - 1 && (
          <div className={`w-6 sm:w-10 h-px mb-4 transition-all duration-300 ${i < current ? 'bg-gray-900' : 'bg-gray-100'}`} />
        )}
      </div>
    ))}
  </div>
);