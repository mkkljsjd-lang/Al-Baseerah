
import React from 'react';
import BookCover from './BookCover';

const DigitalLibrary: React.FC = () => {
  const books = [
    { title: 'القرآن الکریم - لغوی تحقیق', icon: '☪️', color: 'emerald' as const, author: 'منسوب اِلى مرکز البحث' },
    { title: 'نحو میر - آسان شرح', icon: '📏', color: 'blue' as const, author: 'سید شریف جرجانی' },
    { title: 'صرفِ بہائی - جامع گردانیں', icon: '🔄', color: 'amber' as const, author: 'شیخ بہاؤ الدین عاملی' },
    { title: 'لغات القرآن - جدید ایڈیشن', icon: '📖', color: 'crimson' as const, author: 'مرکزِ لغت' }
  ];

  return (
    <div className="w-full max-w-5xl mx-auto mt-12 md:mt-20 mb-12 md:mb-20 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 px-2 md:px-0">
      <div className="flex items-center justify-between mb-8 md:mb-10">
        <div className="h-[1px] flex-1 bg-gradient-to-l from-emerald-100 dark:from-emerald-800 to-transparent"></div>
        <h3 className="urdu text-xl md:text-2xl font-black text-emerald-900 dark:text-emerald-100 mx-4 md:mx-8 flex items-center gap-2 md:gap-3">
          <span className="text-amber-500">📚</span>
          ڈیجیٹل کتب خانہ
        </h3>
        <div className="h-[1px] flex-1 bg-gradient-to-r from-emerald-100 dark:from-emerald-800 to-transparent"></div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
        {books.map((book, i) => (
          <div key={i} className="flex flex-col items-center">
            <BookCover {...book} />
            <button className="mt-3 md:mt-4 urdu text-[10px] md:text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:text-amber-600 transition-colors uppercase tracking-widest border border-emerald-100 dark:border-emerald-800 px-2.5 md:px-3 py-1 rounded-full">
              مطالعہ کریں
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DigitalLibrary;
