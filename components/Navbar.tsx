
import React from 'react';

interface NavbarProps {
  toggleTheme: () => void;
  isDarkMode: boolean;
  onHome?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ toggleTheme, isDarkMode, onHome }) => {
  return (
    <nav className="sticky top-0 z-[100] w-full bg-[#044434] dark:bg-emerald-950 border-b border-emerald-800/30 shadow-lg px-6 py-3 transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand/Logo Section */}
        <div className="flex items-center gap-2">
          {/* Home Button inside rounded box */}
          <button 
            onClick={onHome}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition-all border border-white/5 shadow-sm active:scale-95 text-white/90"
            title="ہوم پیج"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </button>
          
          <button onClick={onHome} className="flex items-center gap-3 group transition-opacity active:scale-[0.98] ml-2">
            <span className="text-[#f0b90b] urdu font-extrabold text-xl md:text-2xl drop-shadow-sm mt-1 group-hover:text-amber-400 transition-colors">البصيرة</span>
          </button>
        </div>

        {/* Navigation Links */}
        <div className="hidden lg:flex items-center gap-10 text-white/90 urdu text-base font-bold">
          <a href="#" className="hover:text-amber-400 transition-colors">مرکزِ تحقیق</a>
          <a href="#" className="hover:text-amber-400 transition-colors">کتب خانہ</a>
          <a href="#" className="hover:text-amber-400 transition-colors">ہمارے بارے میں</a>
        </div>

        {/* Actions Section */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle Button */}
          <button 
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition-all border border-white/5 shadow-sm active:scale-95 flex items-center justify-center transition-all duration-300"
            aria-label={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            title={isDarkMode ? "روشن موڈ" : "تاریک موڈ"}
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
