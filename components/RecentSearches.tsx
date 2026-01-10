
import React from 'react';

interface RecentSearchesProps {
  history: string[];
  onSelect: (word: string) => void;
  onRemove: (word: string) => void;
  onClear: () => void;
  disabled?: boolean;
  language: 'ur' | 'en';
}

const RecentSearches: React.FC<RecentSearchesProps> = ({ history, onSelect, onRemove, onClear, disabled, language }) => {
  if (history.length === 0) return null;

  const isUrdu = language === 'ur';

  return (
    <div className="w-full max-w-3xl mx-auto mt-8 animate-in fade-in slide-in-from-top-4 duration-500">
      <div className={`flex items-center justify-between mb-4 px-2 ${isUrdu ? 'flex-row-reverse' : 'flex-row'}`}>
        <button 
          onClick={onClear}
          className={`text-xs font-bold text-red-500/60 hover:text-red-500 dark:text-red-400/40 dark:hover:text-red-400 transition-colors uppercase tracking-widest ${isUrdu ? 'urdu' : ''}`}
          disabled={disabled}
        >
          {isUrdu ? 'تاریخ ختم کریں' : 'Clear History'}
        </button>
        <h3 className={`text-sm font-black text-emerald-900/40 dark:text-emerald-100/30 uppercase tracking-[0.2em] flex items-center gap-2 ${isUrdu ? 'urdu flex-row-reverse' : ''}`}>
          {isUrdu ? 'حالیہ تلاشیں' : 'Recent Searches'}
          <span className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-800 flex items-center justify-center text-[8px] font-black text-emerald-600 dark:text-emerald-400">
            {history.length}
          </span>
        </h3>
      </div>
      
      <div className={`flex flex-wrap gap-3 ${isUrdu ? 'justify-end' : 'justify-start'}`}>
        {history.map((term, index) => (
          <div 
            key={`${term}-${index}`}
            className="group relative flex items-center"
          >
            <button
              onClick={() => onSelect(term)}
              disabled={disabled}
              className={`
                px-5 py-2 rounded-2xl bg-white dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-800/50 shadow-sm hover:shadow-md transition-all arabic text-xl text-emerald-800 dark:text-emerald-200 hover:text-emerald-600 dark:hover:text-emerald-100 hover:border-emerald-300 dark:hover:border-emerald-600
                ${disabled ? 'opacity-50 cursor-wait' : 'cursor-pointer'}
              `}
            >
              {term}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove(term);
              }}
              disabled={disabled}
              className={`absolute -top-1 ${isUrdu ? '-left-1' : '-right-1'} w-5 h-5 bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100 transition-opacity shadow-sm border border-white dark:border-emerald-900`}
              title={isUrdu ? "حذف کریں" : "Delete"}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentSearches;
