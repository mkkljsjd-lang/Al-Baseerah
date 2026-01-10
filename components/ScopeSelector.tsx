
import React from 'react';
import { AnalysisScope } from '../types';

interface ScopeSelectorProps {
  onSelect: (scope: AnalysisScope) => void;
  selectedScope?: AnalysisScope;
  disabled?: boolean;
  language: 'ur' | 'en';
}

const ScopeSelector: React.FC<ScopeSelectorProps> = ({ onSelect, selectedScope, disabled, language }) => {
  const isUrdu = language === 'ur';

  const options = [
    {
      id: AnalysisScope.SARF,
      title: isUrdu ? 'علم الصرف' : 'Morphology (Sarf)',
      desc: isUrdu ? 'گردان، صیغہ اور اشتقاق' : 'Conjugation, patterns & derivations',
      icon: '🔄'
    },
    {
      id: AnalysisScope.NAHW,
      title: isUrdu ? 'علم النحو' : 'Syntax (Nahw)',
      desc: isUrdu ? 'نحوی باریکیوں کا مطالعہ' : 'Sentence structure & parsing',
      icon: '📐'
    },
    {
      id: AnalysisScope.QURAN_HADITH,
      title: isUrdu ? 'قرآن و حدیث' : 'Quran & Hadith',
      desc: isUrdu ? 'معنی اور سیاق و سباق کی تحقیق' : 'Contextual research & meanings',
      icon: '📖'
    }
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-2 md:px-0 mt-8">
      {/* Folder Header/Tab */}
      <div className={`flex ${isUrdu ? 'justify-end' : 'justify-start'} ${isUrdu ? 'mr-4 md:mr-8' : 'ml-4 md:ml-8'}`}>
        <div className="bg-gray-200 dark:bg-emerald-900/40 px-6 md:px-10 py-2 md:py-3 rounded-t-3xl border-t border-r border-l border-gray-300/50 dark:border-white/10 shadow-sm">
          <span className={`text-emerald-900 dark:text-emerald-100 font-bold text-sm md:text-lg ${isUrdu ? 'urdu' : ''}`}>
            {isUrdu ? 'جامع لسانی تجزیہ' : 'Comprehensive Linguistic Analysis'}
          </span>
        </div>
      </div>

      {/* The Folder Body Container */}
      <div className={`bg-gray-100/60 dark:bg-white/5 p-4 md:p-10 rounded-b-[2.5rem] ${isUrdu ? 'rounded-tl-[2.5rem]' : 'rounded-tr-[2.5rem]'} shadow-xl border border-gray-300/30 dark:border-white/5 relative overflow-hidden perspective-1000`}>
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cardboard.png')]"></div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 relative z-10">
          {options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => onSelect(opt.id)}
              disabled={disabled}
              className={`
                relative p-8 md:p-10 rounded-2xl md:rounded-3xl border-2 transition-all duration-500 text-center flex flex-col items-center justify-center group overflow-hidden transform-gpu
                ${selectedScope === opt.id 
                  ? 'bg-emerald-50 dark:bg-emerald-900/40 border-emerald-500 dark:border-emerald-400 shadow-xl ring-4 ring-emerald-500/10' 
                  : 'bg-white dark:bg-emerald-950/40 border-transparent shadow-sm hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:translate-y-[-8px] hover:rotate-x-2 hover:brightness-105'}
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-gradient-to-tr from-emerald-400 to-amber-400 transition-opacity duration-500 pointer-events-none"></div>

              <div className={`
                w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center text-3xl md:text-4xl mb-6 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3
                ${selectedScope === opt.id ? 'bg-emerald-600 text-white shadow-lg' : 'bg-gray-50 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300'}
              `}>
                {opt.icon}
              </div>
              
              <h3 className={`font-bold text-emerald-950 dark:text-white mb-2 text-2xl md:text-3xl tracking-tight relative z-10 ${isUrdu ? 'urdu' : ''}`}>
                {opt.title}
              </h3>
              <p className={`text-sm md:text-base text-emerald-700/70 dark:text-emerald-400/70 font-medium max-w-[180px] leading-relaxed relative z-10 ${isUrdu ? 'urdu' : ''}`}>
                {opt.desc}
              </p>
              
              {selectedScope === opt.id && (
                <div className="absolute top-4 right-4 w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
              )}
            </button>
          ))}
        </div>
      </div>
      <style>{`
        .perspective-1000 { perspective: 1000px; }
      `}</style>
    </div>
  );
};

export default ScopeSelector;
