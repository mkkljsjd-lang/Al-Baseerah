
import React from 'react';
import SearchInput from './SearchInput';

interface HeaderProps {
  onSearch: (word: string) => void;
  loading: boolean;
}

const Header: React.FC<HeaderProps> = ({ onSearch, loading }) => {
  return (
    <header className="bg-[#044434] dark:bg-emerald-950 text-white py-8 md:py-20 px-4 shadow-xl transition-colors duration-300 relative overflow-hidden">
      <div className="max-w-6xl mx-auto flex flex-col items-center relative z-10">
        
        {/* Decorative thin line at top */}
        <div className="mb-4 flex items-center justify-center opacity-50">
          <div className="w-12 h-0.5 bg-amber-500 rounded-full"></div>
        </div>

        <h2 className="text-xl md:text-4xl font-bold text-white urdu mb-8 md:mb-12 drop-shadow-md text-center transition-all duration-300">لسانی تجزیہ کار</h2>
        
        {/* Search Input area */}
        <div className="w-full max-w-2xl transform transition-all duration-700 animate-in fade-in slide-in-from-bottom-4 px-2 mb-10 md:mb-14">
          <SearchInput onSearch={onSearch} disabled={loading} isHeaderVariant={true} />
        </div>

        <div className="flex flex-col items-center mb-6 text-center">
            <p className="text-base md:text-xl text-emerald-100/90 font-medium urdu mb-4 md:mb-6 leading-relaxed max-w-xs md:max-w-2xl">جدید اسلامی اور عربی قواعد کا جامع تجزیہ کار</p>
            <div className="flex items-center gap-4 text-amber-500 urdu font-black text-4xl md:text-6xl drop-shadow-sm tracking-wide transition-all">
              <span>البصيرة</span>
            </div>
        </div>

        {/* Thick gold separator bar */}
        <div className="w-16 md:w-24 h-1.5 bg-amber-500 mt-4 md:mt-8 rounded-full shadow-[0_0_20px_rgba(245,158,11,0.6)]"></div>
      </div>
      
      {/* Background gradients and textures */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-emerald-500/20 via-transparent to-transparent z-0 pointer-events-none"></div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl z-0 pointer-events-none"></div>
    </header>
  );
};

export default Header;
