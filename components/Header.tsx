
import React from 'react';
import SearchInput from './SearchInput';
import { User } from '@supabase/supabase-js';
import { signOut } from '../services/supabaseService';

interface HeaderProps {
  onSearch: (word: string) => void;
  loading: boolean;
  user: User | null;
  language: 'ur' | 'en';
}

const Header: React.FC<HeaderProps> = ({ onSearch, loading, user, language }) => {
  const isUrdu = language === 'ur';

  return (
    <header className="bg-[#044434] dark:bg-emerald-950 text-white py-8 md:py-20 px-4 shadow-xl transition-colors duration-300 relative overflow-hidden">
      {/* User Status Bar in Header */}
      {user && (
        <div className={`absolute top-4 ${language === 'ur' ? 'right-4' : 'left-4'} z-20 animate-in fade-in slide-in-from-top-4 duration-500`}>
          <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-2 pl-4 flex items-center gap-4 shadow-lg group">
            <div className={`flex flex-col ${language === 'ur' ? 'items-end' : 'items-start'}`}>
              <span className={`text-[10px] text-white/50 leading-none ${language === 'ur' ? 'urdu' : ''}`}>
                {language === 'ur' ? 'لاگ ان بذریعہ' : 'Logged in via'}
              </span>
              <span className="text-amber-400 text-xs font-bold font-mono">{user.email}</span>
            </div>
            <button 
              onClick={() => signOut()}
              className="w-10 h-10 bg-red-500/20 hover:bg-red-500 text-white rounded-xl flex items-center justify-center transition-all duration-300 shadow-inner group-hover:shadow-[0_0_15px_rgba(239,68,68,0.4)]"
              title={language === 'ur' ? "لاگ آؤٹ کریں" : "Log Out"}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto flex flex-col items-center relative z-10">
        
        {/* Important Notice for confusion relief */}
        {!user && (
          <div className="mb-6 animate-pulse">
            <div className={`px-4 py-1.5 bg-amber-500/20 border border-amber-500/30 rounded-full text-amber-400 text-[10px] md:text-xs font-bold flex items-center gap-2 ${isUrdu ? 'flex-row-reverse urdu' : ''}`}>
              <span>📢</span>
              <span>
                {isUrdu 
                  ? 'نوٹ: اس ایپ کے لیے کسی خاص گوگل یا AI Studio اکاؤنٹ کی ضرورت نہیں ہے۔' 
                  : 'Note: No specialized Google or AI Studio account required.'}
              </span>
            </div>
          </div>
        )}

        <h2 className={`text-xl md:text-4xl font-bold text-white mb-8 md:mb-12 drop-shadow-md text-center transition-all duration-300 ${language === 'ur' ? 'urdu' : ''}`}>
          {language === 'ur' ? 'لسانی تجزیہ کار' : 'Linguistic Analyzer'}
        </h2>
        
        {/* Search Input area */}
        <div className="w-full max-w-2xl transform transition-all duration-700 animate-in fade-in slide-in-from-bottom-4 px-2 mb-10 md:mb-14">
          <SearchInput onSearch={onSearch} disabled={loading} isHeaderVariant={true} language={language} />
        </div>

        <div className="flex flex-col items-center mb-6 text-center">
            <p className={`text-base md:text-xl text-emerald-100/90 font-medium mb-4 md:mb-6 leading-relaxed max-w-xs md:max-w-2xl ${language === 'ur' ? 'urdu' : ''}`}>
              {language === 'ur' ? 'جدید اسلامی اور عربی قواعد کا جامع تجزیہ کار' : 'Comprehensive Analyzer for Modern Islamic and Arabic Grammar'}
            </p>
            <div className={`flex items-center gap-4 text-amber-500 font-black text-4xl md:text-6xl drop-shadow-sm tracking-wide transition-all ${language === 'ur' ? 'urdu' : ''}`}>
              <span>{language === 'ur' ? 'البصيرة' : 'Al Baseerah'}</span>
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
