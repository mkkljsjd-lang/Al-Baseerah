
import React from 'react';

interface BookCoverProps {
  title: string;
  author?: string;
  color?: 'emerald' | 'amber' | 'blue' | 'crimson';
  icon?: string;
  language?: 'ur' | 'en';
}

const BookCover: React.FC<BookCoverProps> = ({ title, author, color = 'emerald', icon = '📖', language = 'ur' }) => {
  const isUrdu = language === 'ur';

  const colorClasses = {
    emerald: 'bg-emerald-800 border-emerald-900 shadow-emerald-950/20',
    amber: 'bg-amber-700 border-amber-800 shadow-amber-900/20',
    blue: 'bg-blue-800 border-blue-900 shadow-blue-950/20',
    crimson: 'bg-red-800 border-red-900 shadow-red-950/20',
  };

  const accentClasses = {
    emerald: 'bg-emerald-400/20',
    amber: 'bg-amber-400/20',
    blue: 'bg-blue-400/20',
    crimson: 'bg-red-400/20',
  };

  const glowShadows = {
    emerald: 'group-hover:shadow-[0_10px_60px_rgba(16,185,129,0.5)]',
    amber: 'group-hover:shadow-[0_10px_60px_rgba(245,158,11,0.6)]',
    blue: 'group-hover:shadow-[0_10px_60px_rgba(59,130,246,0.5)]',
    crimson: 'group-hover:shadow-[0_10px_60px_rgba(239,68,68,0.5)]',
  };

  return (
    <div className="relative group perspective-1200 w-full max-w-[160px] aspect-[2/3] mx-auto transition-transform duration-500 hover:-translate-y-6">
      <div className={`
        relative w-full h-full rounded-r-lg rounded-l-[4px] border-l-8 
        ${colorClasses[color]} 
        ${glowShadows[color]}
        shadow-2xl transition-all duration-700 ease-out
        group-hover:rotate-y-[-42deg] group-hover:scale-[1.12] group-hover:brightness-125 preserve-3d
      `}>
        {/* Spine detail */}
        <div className={`absolute ${isUrdu ? 'left-0' : 'right-0'} top-0 bottom-0 w-1 bg-white/10`}></div>
        
        {/* Content */}
        <div className="absolute inset-0 p-4 flex flex-col items-center justify-between text-center backface-hidden">
          <div className={`w-full h-full border border-white/10 rounded p-2 flex flex-col items-center justify-between`}>
             <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-xl mb-2 transition-transform duration-700 group-hover:scale-125 group-hover:rotate-12">
               {icon}
             </div>
             <div className="flex-1 flex items-center justify-center">
               <h4 className={`text-white text-base font-bold leading-tight line-clamp-3 transition-colors duration-500 ${isUrdu ? 'urdu' : ''}`}>{title}</h4>
             </div>
             {author && (
               <p className={`text-white/40 text-[10px] mt-2 border-t border-white/5 pt-1 w-full ${isUrdu ? 'urdu' : ''}`}>{author}</p>
             )}
          </div>
        </div>

        {/* Texture overlay */}
        <div className="absolute inset-0 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/leather.png')] opacity-30 mix-blend-overlay"></div>
        <div className={`absolute inset-0 pointer-events-none ${accentClasses[color]} rounded-r-lg`}></div>
      </div>
    </div>
  );
};

export default BookCover;
