
import React, { useState } from 'react';
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
  onMobileGuideClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ 
  toggleTheme, 
  isDarkMode, 
  onHome, 
  user, 
  language, 
  toggleLanguage, 
  onLoginClick, 
  onAdminClick,
  onMobileGuideClick
}) => {
  const [showCopyFeedback, setShowCopyFeedback] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setShowCopyFeedback(true);
    setTimeout(() => setShowCopyFeedback(false), 2000);
  };

  const handleWhatsAppShare = () => {
    const text = language === 'ur' 
      ? `السلام علیکم! میں نے ایک بہترین عربی اور اردو لسانی تجزیہ کار ایپ "البصیرہ" استعمال کی ہے۔ آپ بھی اسے یہاں دیکھ سکتے ہیں: ${window.location.href}`
      : `Assalam-o-Alaikum! I've been using "Al Baseerah", an advanced Arabic/Urdu Linguistic Analyzer. Check it out here: ${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

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

        {/* Navigation Links - Desktop Only */}
        <div className="hidden lg:flex items-center gap-4 text-white/90 font-bold">
          <button 
            onClick={handleWhatsAppShare}
            className={`px-3 py-1.5 bg-green-600/20 hover:bg-green-600 text-green-400 hover:text-white rounded-lg transition-all border border-green-500/30 flex items-center gap-2 ${language === 'ur' ? 'urdu' : 'text-sm'}`}
          >
            <span>{language === 'ur' ? 'شیئر کریں' : 'Share'}</span>
            <span className="text-lg">💬</span>
          </button>

          <button 
            onClick={onMobileGuideClick}
            className={`px-4 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-lg transition-all border border-emerald-500/30 text-emerald-400 flex items-center gap-2 ${language === 'ur' ? 'urdu' : 'text-sm'}`}
          >
            <span>{language === 'ur' ? 'ایپ حاصل کریں' : 'Get App'}</span>
            <span className="text-xs">📱</span>
          </button>

          <button 
            onClick={handleCopyLink}
            className={`relative px-4 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition-all border border-white/10 text-white flex items-center gap-2 ${language === 'ur' ? 'urdu' : 'text-sm'}`}
          >
            {showCopyFeedback ? (
              <span className="text-amber-400 animate-in fade-in zoom-in-50 duration-300">
                {language === 'ur' ? 'کاپی ہو گیا!' : 'Copied!'}
              </span>
            ) : (
              <>
                <span>{language === 'ur' ? 'لنک کاپی کریں' : 'Copy URL'}</span>
                <span className="text-xs">🔗</span>
              </>
            )}
          </button>
        </div>

        {/* Actions Section - Right Side */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Language Toggle Button */}
          <button 
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all border border-white/5 shadow-sm active:scale-95 group"
            title={language === 'ur' ? "Switch to English" : "اردو میں بدلیں"}
          >
            <span className="text-amber-400 group-hover:rotate-12 transition-transform duration-300">🌐</span>
            <span className={`text-white text-xs md:text-sm font-black tracking-wide ${language === 'en' ? 'urdu' : 'font-sans'}`}>
              {language === 'ur' ? 'English' : 'اردو'}
            </span>
          </button>

          {/* User Auth Section */}
          {user ? (
            <div className="flex items-center gap-3">
               <button 
                 onClick={() => signOut()}
                 className={`hidden md:flex px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-sm font-bold transition-all shadow-md active:scale-95 items-center gap-2 ${language === 'ur' ? 'urdu' : ''}`}
               >
                 <span>{language === 'ur' ? 'لاگ آؤٹ' : 'Log Out'}</span>
                 <span className="text-lg">🚪</span>
               </button>
            </div>
          ) : (
            <button 
              onClick={onLoginClick}
              className={`px-4 md:px-5 py-2 bg-amber-500 hover:bg-amber-400 text-[#044434] font-bold rounded-xl text-sm md:text-base transition-all shadow-lg active:scale-95 ${language === 'ur' ? 'urdu' : ''}`}
            >
              {language === 'ur' ? 'لاگ ان' : 'Login'}
            </button>
          )}

          {/* Theme Toggle Button */}
          <button 
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition-all border border-white/5 shadow-sm active:scale-95 flex items-center justify-center transition-all duration-300"
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
