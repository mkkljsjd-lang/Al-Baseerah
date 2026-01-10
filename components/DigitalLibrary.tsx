
import React from 'react';
import BookCover from './BookCover';

interface DigitalLibraryProps {
  language: 'ur' | 'en';
}

const DigitalLibrary: React.FC<DigitalLibraryProps> = ({ language }) => {
  const isUrdu = language === 'ur';

  const books = [
    { 
      title: isUrdu ? 'القرآن الکریم - لغوی تحقیق' : 'The Holy Quran - Lexical Analysis', 
      icon: '☪️', 
      color: 'emerald' as const, 
      author: isUrdu ? 'منسوب اِلى مرکز البحث' : 'Research Center' 
    },
    { 
      title: isUrdu ? 'نحو میر - آسان شرح' : 'Nahw Mir - Easy Explanation', 
      icon: '📏', 
      color: 'blue' as const, 
      author: isUrdu ? 'سید شریف جرجانی' : 'Sayyid Sharif Jurjani' 
    },
    { 
      title: isUrdu ? 'صرفِ بہائی - جامع گردانیں' : 'Sarf-e-Bahai - Conjugations', 
      icon: '🔄', 
      color: 'amber' as const, 
      author: isUrdu ? 'شیخ بہاؤ الدین عاملی' : 'Sheikh Bahauddin Amili' 
    },
    { 
      title: isUrdu ? 'لغات القرآن - جدید ایڈیشن' : 'Quran Dictionary - New Edition', 
      icon: '📖', 
      color: 'crimson' as const, 
      author: isUrdu ? 'مرکزِ لغت' : 'Lexicon Center' 
    }
  ];

  return (
    <div className="w-full max-w-5xl mx-auto mt-12 md:mt-20 mb-12 md:mb-20 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 px-2 md:px-0">
      <div className={`flex items-center justify-between mb-8 md:mb-10 ${isUrdu ? 'flex-row' : 'flex-row-reverse'}`}>
        <div className={`h-[1px] flex-1 bg-gradient-to-l ${isUrdu ? 'from-emerald-100 dark:from-emerald-800' : 'to-emerald-100 dark:to-emerald-800'} to-transparent`}></div>
        <h3 className={`text-xl md:text-2xl font-black text-emerald-900 dark:text-emerald-100 mx-4 md:mx-8 flex items-center gap-2 md:gap-3 ${isUrdu ? 'urdu' : ''}`}>
          <span className="text-amber-500">📚</span>
          {isUrdu ? 'ڈیجیٹل کتب خانہ' : 'Digital Library'}
        </h3>
        <div className={`h-[1px] flex-1 bg-gradient-to-r ${isUrdu ? 'from-emerald-100 dark:from-emerald-800' : 'to-emerald-100 dark:to-emerald-800'} to-transparent`}></div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
        {books.map((book, i) => (
          <div key={i} className="flex flex-col items-center">
            <BookCover {...book} language={language} />
            <button className={`mt-3 md:mt-4 text-[10px] md:text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:text-amber-600 transition-colors uppercase tracking-widest border border-emerald-100 dark:border-emerald-800 px-2.5 md:px-3 py-1 rounded-full ${isUrdu ? 'urdu' : ''}`}>
              {isUrdu ? 'مطالعہ کریں' : 'Read'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DigitalLibrary;
