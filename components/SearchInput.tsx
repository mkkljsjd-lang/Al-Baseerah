
import React, { useState } from 'react';

interface SearchInputProps {
  onSearch: (word: string) => void;
  disabled?: boolean;
  isHeaderVariant?: boolean;
}

const SearchInput: React.FC<SearchInputProps> = ({ onSearch, disabled, isHeaderVariant = false }) => {
  const [value, setValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onSearch(value.trim());
    }
  };

  return (
    <div className={`w-full max-w-xl mx-auto ${!isHeaderVariant ? 'mb-10' : ''}`}>
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <div className="relative w-full group">
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="عربی لفظ یہاں لکھیں..."
            className={`
              w-full bg-white dark:bg-emerald-900/40 border border-emerald-100 dark:border-emerald-800 rounded-2xl py-3 md:py-4 pr-6 md:pr-8 pl-24 md:pl-36 text-lg md:text-xl shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)] transition-all text-right arabic text-emerald-950 dark:text-emerald-50 placeholder:text-emerald-900/30 dark:placeholder:text-emerald-100/20 placeholder:text-sm md:placeholder:text-base urdu
              ${isHeaderVariant ? 'focus:border-amber-400' : 'focus:border-emerald-500 dark:focus:border-emerald-400'}
              ${disabled 
                ? 'opacity-70 cursor-wait' 
                : 'focus:bg-white dark:focus:bg-emerald-900/60 focus:ring-4 focus:ring-amber-500/5'}
            `}
            disabled={disabled}
            dir="rtl"
          />
          
          <div className="absolute left-1.5 md:left-2 top-1/2 -translate-y-1/2 z-20">
            <button
              type="submit"
              disabled={disabled || !value.trim()}
              className="bg-[#044434] dark:bg-emerald-600 hover:bg-[#065a46] dark:hover:bg-emerald-500 hover:scale-[1.02] active:scale-95 text-white px-4 md:px-8 py-2 md:py-2.5 rounded-xl font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center min-w-[90px] md:min-w-[120px]"
            >
              {disabled ? (
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              ) : (
                <span className="urdu text-sm md:text-lg">تجزیہ کریں</span>
              )}
            </button>
          </div>
        </div>
      </form>
      
      <div className={`mt-4 md:mt-6 flex flex-wrap justify-center items-center gap-3 md:gap-5 transition-opacity duration-300 ${isHeaderVariant ? 'text-white' : 'text-emerald-900/40 dark:text-emerald-100/30'} ${disabled ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
        <span className="urdu text-base md:text-xl font-bold">مثالیں:</span>
        <div className="flex gap-4 md:gap-6 items-center">
          <button 
            type="button"
            className={`arabic text-xl md:text-2xl hover:text-amber-400 transition-all cursor-pointer hover:scale-110 active:scale-90 ${isHeaderVariant ? 'text-white/90' : 'text-emerald-800 dark:text-emerald-300'}`} 
            onClick={() => setValue('الْقُرْآن')}
            disabled={disabled}
          >
            الْقُرْآن
          </button>
          <span className="opacity-40 text-xs">•</span>
          <button 
            type="button"
            className={`arabic text-xl md:text-2xl hover:text-amber-400 transition-all cursor-pointer hover:scale-110 active:scale-90 ${isHeaderVariant ? 'text-white/90' : 'text-emerald-800 dark:text-emerald-300'}`} 
            onClick={() => setValue('كَتَبَ')}
            disabled={disabled}
          >
            كَتَبَ
          </button>
          <span className="opacity-40 text-xs">•</span>
          <button 
            type="button"
            className={`arabic text-xl md:text-2xl hover:text-amber-400 transition-all cursor-pointer hover:scale-110 active:scale-90 ${isHeaderVariant ? 'text-white/90' : 'text-emerald-800 dark:text-emerald-300'}`} 
            onClick={() => setValue('نَصَرَ')}
            disabled={disabled}
          >
            نَصَرَ
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchInput;
