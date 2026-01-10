
import React from 'react';
import { User } from '@supabase/supabase-js';
import { signOut } from '../services/supabaseService';

interface NavbarProps {
  toggleTheme: () => void;
  isDarkMode: boolean;
  onHome?: () => void;
  user: User | null;
  language: 'ur' | 'en';
  toggleLanguage: () => void;
  onLoginClick: () => void;
  onAdminClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ 
  toggleTheme, 
  isDarkMode, 
  onHome, 
  user, 
  language, 
  toggleLanguage, 
  onLoginClick, 
  onAdminClick 
}) => {
  return (
    <nav className="sticky top-0 z-[100] w-full bg-[#044434] dark:bg-emerald-950 border-b border-emerald-800/30 shadow-lg px-4 md:px-6 py-3 transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand/Logo Section */}
        <div className="flex items-center gap-2">
          <button 
            onClick={onHome}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition-all border border-white/5 shadow-sm active:scale-95 text-white/90"
            title={language === 'ur' ? "ہوم پیج" : "Home"}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </button>
          
          <button onClick={onHome} className="flex items-center gap-3 group transition-opacity active:scale-[0.98] mx-2">
            <span className={`text-[#f0b90b] font-extrabold text-xl md:text-2xl drop-shadow-sm mt-1 group-hover:text-amber-400 transition-colors ${language === 'ur' ? 'urdu' : ''}`}>
              {language === 'ur' ? 'البصيرة' : 'Al Baseerah'}
            </span>
          </button>
        </div>

        {/* Navigation Links */}
        <div className="hidden lg:flex items-center gap-8 text-white/90 font-bold">
          <a href="#" onClick={(e) => {e.preventDefault(); onHome?.();}} className={`hover:text-amber-400 transition-colors ${language === 'ur' ? 'urdu' : 'text-sm'}`}>
            {language === 'ur' ? 'مرکزِ تحقیق' : 'Research Center'}
          </a>
          
          <button 
            onClick={onAdminClick}
            className={`px-4 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 rounded-lg transition-all border border-amber-500/30 text-amber-400 flex items-center gap-2 ${language === 'ur' ? 'urdu' : 'text-sm'}`}
          >
            <span>{language === 'ur' ? 'ڈیش بورڈ' : 'Dashboard'}</span>
            <span className="text-xs">⚙️</span>
          </button>
          
          <a href="#" className={`hover:text-amber-400 transition-colors ${language === 'ur' ? 'urdu' : 'text-sm'}`}>
            {language === 'ur' ? 'کتب خانہ' : 'Library'}
          </a>
        </div>

        {/* Actions Section */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
               <div className={`hidden md:flex flex-col items-end text-[10px] text-white/60 font-bold ${language === 'ur' ? 'urdu' : ''}`}>
                  <span>{language === 'ur' ? 'خوش آمدید' : 'Welcome'}</span>
                  <span className="text-amber-400 text-xs">{user.email?.split('@')[0]}</span>
               </div>
               <button 
                 onClick={() => signOut()}
                 className={`px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-sm font-bold transition-all shadow-md active:scale-95 flex items-center gap-2 ${language === 'ur' ? 'urdu' : ''}`}
                 title={language === 'ur' ? "سائن آؤٹ کریں" : "Sign Out"}
               >
                 <span>{language === 'ur' ? 'لاگ آؤٹ' : 'Log Out'}</span>
                 <span className="text-lg">🚪</span>
               </button>
            </div>
          ) : (
            <button 
              onClick={onLoginClick}
              className={`px-5 py-2 bg-amber-500 hover:bg-amber-400 text-[#044434] font-bold rounded-xl text-sm md:text-base transition-all shadow-lg active:scale-95 ${language === 'ur' ? 'urdu' : ''}`}
            >
              {language === 'ur' ? 'لاگ ان' : 'Login'}
            </button>
          )}

          {/* Language Toggle Button */}
          <button 
            onClick={toggleLanguage}
            className="px-3 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] md:text-xs font-bold transition-all active:scale-95"
            title={language === 'ur' ? "English میں دیکھیں" : "اردو میں دیکھیں"}
          >
            {language === 'ur' ? 'English' : 'اردو'}
          </button>

          {/* Theme Toggle Button */}
          <button 
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition-all border border-white/5 shadow-sm active:scale-95 flex items-center justify-center transition-all duration-300"
            aria-label={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDarkMode ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-400 animate-in zoom-in-50 duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white animate-in zoom-in-50 duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
