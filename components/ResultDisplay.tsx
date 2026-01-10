
import React from 'react';
import { AnalysisResult, ConjugationRow } from '../types';

// Updated ResultDisplayProps to include language
interface ResultDisplayProps {
  result: AnalysisResult;
  onBack: () => void;
  language: 'ur' | 'en';
}

// Updated Card component to accept language for proper layout and labels
const Card: React.FC<React.PropsWithChildren<{ title: string, icon?: string, language: 'ur' | 'en' }>> = ({ title, children, icon, language }) => (
  <div className="bg-white dark:bg-emerald-900/30 rounded-2xl md:rounded-3xl p-4 md:p-8 shadow-xl border border-emerald-50 dark:border-emerald-800/50 mb-6 md:mb-8 overflow-hidden relative backdrop-blur-sm transition-colors duration-300">
    <div className={`flex items-center gap-2 md:gap-3 mb-4 md:mb-6 border-b border-emerald-50 dark:border-emerald-800/50 pb-3 md:pb-4 ${language === 'ur' ? 'flex-row-reverse' : ''}`}>
      {icon && <span className="text-xl md:text-2xl">{icon}</span>}
      <h2 className={`text-xl md:text-2xl font-bold text-emerald-900 dark:text-emerald-100 ${language === 'ur' ? 'urdu' : ''}`}>{title}</h2>
    </div>
    {children}
  </div>
);

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, onBack, language }) => {
  const { quranHadith, nahw, sarf, word } = result;
  const isUrdu = language === 'ur';

  // Localized labels for conjugation keys
  const getConjugationLabel = (key: string) => {
    if (!isUrdu) {
      const labels: Record<string, string> = {
        madi: 'Past',
        mudari: 'Present',
        amr: 'Command',
        nahi: 'Prohibition',
      };
      return labels[key.toLowerCase()] || key;
    }
    const labels: Record<string, string> = {
      madi: 'ماضی',
      mudari: 'مضارع',
      amr: 'امر',
      nahi: 'نہی',
    };
    return labels[key.toLowerCase()] || key;
  };

  return (
    <div className="w-full max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12 px-2 md:px-0">
      <div className={`flex flex-col-reverse md:flex-row justify-between items-center mb-6 md:mb-10 gap-4 ${isUrdu ? '' : 'md:flex-row'}`}>
        <button
          onClick={onBack}
          className={`w-full md:w-auto flex items-center justify-center gap-2 px-6 py-2 bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 rounded-full font-bold shadow-sm hover:shadow-md hover:bg-emerald-100 dark:hover:bg-emerald-800 transition-all border border-emerald-100 dark:border-emerald-800 ${isUrdu ? 'flex-row-reverse' : ''}`}
        >
          <span className="text-lg">←</span>
          <span className={`text-sm ${isUrdu ? 'urdu' : ''}`}>{isUrdu ? 'پیچھے' : 'Back'}</span>
        </button>
        <div className={isUrdu ? 'text-center md:text-right' : 'text-center md:text-left'}>
          <span className={`text-[10px] uppercase tracking-[0.3em] text-emerald-600 dark:text-emerald-400 font-black block mb-1 ${isUrdu ? 'urdu' : ''}`}>
            {isUrdu ? 'تحقیق برائے' : 'Research for'}
          </span>
          <h1 className="text-4xl md:text-6xl arabic text-emerald-800 dark:text-emerald-100 leading-normal">{word}</h1>
        </div>
      </div>

      {quranHadith && (
        <Card title={isUrdu ? "قرآن و حدیث کی تحقیق" : "Quran & Hadith Analysis"} icon="📖" language={language}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mb-6 md:mb-8">
            <div className={`bg-emerald-50 dark:bg-emerald-800/30 p-4 md:p-6 rounded-2xl flex flex-col ${isUrdu ? 'items-end' : 'items-start'}`}>
              <h3 className={`text-emerald-700 dark:text-emerald-400 font-bold mb-1 md:mb-2 text-xs uppercase ${isUrdu ? 'urdu' : ''}`}>
                {isUrdu ? 'اردو ترجمہ' : 'Urdu Translation'}
              </h3>
              <p className={`text-xl md:text-2xl urdu text-emerald-900 dark:text-emerald-100 ${isUrdu ? 'text-right' : 'text-left'} w-full`}>
                {quranHadith.urduTranslation || (isUrdu ? 'دستیاب نہیں ہے' : 'Not available')}
              </p>
            </div>
            <div className={`bg-amber-50 dark:bg-amber-900/20 p-4 md:p-6 rounded-2xl flex flex-col ${isUrdu ? 'items-end' : 'items-start'}`}>
              <h3 className={`text-amber-700 dark:text-amber-400 font-bold mb-1 md:mb-2 text-xs uppercase ${isUrdu ? 'urdu' : ''}`}>
                {isUrdu ? 'لغوی معنی' : 'Lexical Meaning'}
              </h3>
              <p className={`text-base md:text-lg urdu text-amber-900 dark:text-amber-100 ${isUrdu ? 'text-right' : 'text-left'} w-full`}>
                {quranHadith.etymology?.lexicalMeaning || (isUrdu ? 'دستیاب نہیں ہے' : 'Not available')}
              </p>
            </div>
          </div>

          <div className="mb-6 md:mb-8">
            <h3 className={`text-xl md:text-2xl font-bold text-emerald-800 dark:text-emerald-300 mb-3 md:mb-4 border-emerald-500 dark:border-emerald-400 pr-3 pl-3 ${isUrdu ? 'border-r-4 text-right urdu' : 'border-l-4 text-left'}`}>
              {isUrdu ? 'تحقیقِ لفظ (Tahqeeq)' : 'Word Analysis (Tahqeeq)'}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
              <div className="text-center p-3 md:p-4 border border-emerald-100 dark:border-emerald-800 rounded-xl bg-white dark:bg-emerald-900/50 shadow-sm">
                <span className={`block text-[10px] md:text-xs text-emerald-400 dark:text-emerald-500 font-bold uppercase mb-1 ${isUrdu ? 'urdu' : ''}`}>
                  {isUrdu ? 'مادہ (Root)' : 'Root'}
                </span>
                <span className="text-2xl md:text-3xl arabic text-emerald-900 dark:text-emerald-100">{quranHadith.etymology?.root || 'N/A'}</span>
              </div>
              <div className="text-center p-3 md:p-4 border border-emerald-100 dark:border-emerald-800 rounded-xl bg-white dark:bg-emerald-900/50 shadow-sm">
                <span className={`block text-[10px] md:text-xs text-emerald-400 dark:text-emerald-500 font-bold uppercase mb-1 ${isUrdu ? 'urdu' : ''}`}>
                  {isUrdu ? 'باب (Bab)' : 'Bab'}
                </span>
                <span className="text-xl md:text-2xl arabic text-emerald-900 dark:text-emerald-100">{quranHadith.etymology?.bab || 'N/A'}</span>
              </div>
              <div className="col-span-2 md:col-span-1 text-center p-3 md:p-4 border border-emerald-100 dark:border-emerald-800 rounded-xl bg-white dark:bg-emerald-900/50 shadow-sm">
                <span className={`block text-[10px] md:text-xs text-emerald-400 dark:text-emerald-500 font-bold uppercase mb-1 ${isUrdu ? 'urdu' : ''}`}>
                  {isUrdu ? 'وزن (Weight)' : 'Weight'}
                </span>
                <span className="text-xl md:text-2xl arabic text-emerald-900 dark:text-emerald-100">{sarf?.weight?.wazn || 'N/A'}</span>
              </div>
            </div>
          </div>

          <div className="mb-6 md:mb-8">
            <h3 className={`text-xl md:text-2xl font-bold text-emerald-800 dark:text-emerald-300 mb-3 md:mb-4 border-emerald-500 dark:border-emerald-400 pr-3 pl-3 ${isUrdu ? 'border-r-4 text-right urdu' : 'border-l-4 text-left'}`}>
              {isUrdu ? 'قرآن و حدیث کے حوالہ جات' : 'Quran & Hadith References'}
            </h3>
            <div className="space-y-3 md:space-y-4">
              {quranHadith.references?.map((ref, i) => (
                <div key={i} className={`p-3 md:p-4 bg-white dark:bg-emerald-900/40 border-amber-400 dark:border-amber-600 shadow-sm rounded-l-xl rounded-r-xl ${isUrdu ? 'border-r-4 text-right' : 'border-l-4 text-left'}`}>
                  <div className={`flex justify-between items-start mb-1 md:mb-2 gap-2 ${isUrdu ? 'dir-rtl' : ''}`}>
                    <span className={`font-bold text-emerald-900 dark:text-emerald-100 ${isUrdu ? 'urdu' : ''} text-sm md:text-base`}>{ref.source}</span>
                    <span className={`text-amber-700 dark:text-amber-500 font-medium text-[10px] md:text-sm ${isUrdu ? 'urdu' : ''}`}>{ref.reference}</span>
                  </div>
                  <p className={`text-base md:text-lg text-gray-700 dark:text-emerald-200/80 ${isUrdu ? 'urdu' : ''}`}>{ref.context}</p>
                </div>
              )) || <p className={`text-sm text-gray-400 dark:text-gray-500 italic ${isUrdu ? 'text-right urdu' : 'text-left'}`}>
                {isUrdu ? 'کوئی حوالہ نہیں ملا۔' : 'No references found.'}
              </p>}
            </div>
          </div>

          <div>
            <h3 className={`text-xl md:text-2xl font-bold text-emerald-800 dark:text-emerald-300 mb-3 md:mb-4 border-emerald-500 dark:border-emerald-400 pr-3 pl-3 ${isUrdu ? 'border-r-4 text-right urdu' : 'border-l-4 text-left'}`}>
              {isUrdu ? 'تعلیمی جملے' : 'Educational Sentences'}
            </h3>
            <div className="space-y-3 md:space-y-4">
              {quranHadith.sentences?.map((sent, i) => (
                <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 p-3 md:p-4 border border-emerald-50 dark:border-emerald-800 rounded-2xl hover:bg-emerald-50 dark:hover:bg-emerald-800/40 transition-colors">
                  <p className={`arabic text-2xl md:text-4xl text-emerald-900 dark:text-emerald-100 leading-relaxed ${isUrdu ? 'text-right' : 'text-left'}`}>{sent.arabic}</p>
                  <p className={`urdu text-lg md:text-xl text-gray-700 dark:text-emerald-200 pt-2 ${isUrdu ? 'text-right' : 'text-left'}`}>{sent.urdu}</p>
                </div>
              )) || <p className={`text-sm text-gray-400 dark:text-gray-500 italic ${isUrdu ? 'text-right urdu' : 'text-left'}`}>
                {isUrdu ? 'کوئی مثالی جملہ فراہم نہیں کیا گیا۔' : 'No sample sentences provided.'}
              </p>}
            </div>
          </div>
        </Card>
      )}

      {nahw && (
        <Card title={isUrdu ? "علم النحو (Syntax)" : "Syntax (Nahw)"} icon="📐" language={language}>
          <div className="mb-6 md:mb-8">
            <h3 className={`text-xl md:text-2xl font-bold text-emerald-800 dark:text-emerald-300 mb-3 md:mb-4 border-emerald-500 dark:border-emerald-400 pr-3 pl-3 ${isUrdu ? 'border-r-4 text-right urdu' : 'border-l-4 text-left'}`}>
              {isUrdu ? 'نحوی قواعد (Qawa\'id)' : 'Syntactic Rules (Qawa\'id)'}
            </h3>
            <div className="p-4 md:p-6 bg-emerald-50 dark:bg-emerald-800/30 rounded-2xl">
              <div className={`flex items-center gap-3 md:gap-4 mb-2 md:mb-3 ${isUrdu ? 'justify-end' : 'justify-start'}`}>
                <span className="text-2xl md:text-3xl font-bold text-emerald-900 dark:text-emerald-100 arabic">{nahw.rules?.wordType || 'N/A'}</span>
                <span className={`px-2 md:px-3 py-0.5 md:py-1 bg-emerald-200 dark:bg-emerald-700 text-emerald-800 dark:text-emerald-100 text-[10px] md:text-xs font-bold rounded-full uppercase ${isUrdu ? 'urdu' : ''}`}>
                  {isUrdu ? 'قسم' : 'Type'}
                </span>
              </div>
              <p className={`urdu text-lg md:text-xl text-emerald-900 dark:text-emerald-200 ${isUrdu ? 'text-right' : 'text-left'}`}>
                {nahw.rules?.characteristics || (isUrdu ? 'معلومات دستیاب نہیں ہیں۔' : 'Information not available.')}
              </p>
            </div>
          </div>
          
          <div>
            <h3 className={`text-xl md:text-2xl font-bold text-emerald-800 dark:text-emerald-300 mb-3 md:mb-4 border-emerald-500 dark:border-emerald-400 pr-3 pl-3 ${isUrdu ? 'border-r-4 text-right urdu' : 'border-l-4 text-left'}`}>
              {isUrdu ? 'اعراب و ترکیب (Parsing)' : 'Parsing'}
            </h3>
            <div className="p-4 md:p-6 border border-emerald-100 dark:border-emerald-800 rounded-2xl bg-white dark:bg-emerald-900/40">
              <div className={`mb-4 flex flex-col ${isUrdu ? 'items-end' : 'items-start'}`}>
                <span className={`block text-[10px] md:text-xs font-bold text-emerald-400 dark:text-emerald-500 uppercase mb-2 ${isUrdu ? 'text-right urdu' : 'text-left'}`}>
                  {isUrdu ? 'نمونہ جملہ' : 'Sample Sentence'}
                </span>
                <p className={`arabic text-3xl md:text-5xl text-emerald-900 dark:text-emerald-100 bg-emerald-50/30 dark:bg-emerald-800/20 p-3 md:p-4 rounded-xl shadow-inner border border-emerald-50 dark:border-emerald-800/50 leading-relaxed w-full ${isUrdu ? 'text-right' : 'text-left'}`}>
                  {nahw.parsing?.sampleSentence || 'N/A'}
                </p>
              </div>
              <div className={`mb-2 ${isUrdu ? 'text-right' : 'text-left'}`}>
                <span className={`inline-block px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 text-xs md:text-sm font-bold rounded mb-3 md:mb-4 ${isUrdu ? 'urdu' : ''}`}>
                  {isUrdu ? 'نحوی کردار' : 'Syntactic Role'}: {nahw.parsing?.role || 'N/A'}
                </span>
                <p className={`urdu text-lg md:text-xl text-gray-800 dark:text-emerald-200`}>{nahw.parsing?.explanation || (isUrdu ? 'وضاحت دستیاب نہیں ہے۔' : 'Explanation not available.')}</p>
              </div>
            </div>
          </div>
        </Card>
      )}

      {sarf && (
        <Card title={isUrdu ? "علم الصرف (Morphology)" : "Morphology (Sarf)"} icon="🔄" language={language}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
            <div className={`p-4 md:p-5 border border-emerald-100 dark:border-emerald-800 rounded-2xl bg-white dark:bg-emerald-900/40 shadow-sm flex flex-col ${isUrdu ? 'items-end' : 'items-start'}`}>
              <h4 className={`text-[10px] md:text-xs font-bold text-emerald-400 dark:text-emerald-500 uppercase mb-1 md:mb-2 ${isUrdu ? 'text-right urdu' : 'text-left'}`}>
                {isUrdu ? 'ہفت اقسام (Seven Categories)' : 'Seven Categories (Haft Aqsam)'}
              </h4>
              <p className={`font-bold text-emerald-800 dark:text-emerald-200 mb-1 arabic text-xl md:text-2xl ${isUrdu ? 'text-right' : 'text-left'}`}>{sarf.haftAqsam?.category || 'N/A'}</p>
              <p className={`urdu text-sm md:text-base text-gray-600 dark:text-emerald-300/80 ${isUrdu ? 'text-right' : 'text-left'}`}>{sarf.haftAqsam?.explanation || ''}</p>
            </div>
            <div className={`p-4 md:p-5 border border-emerald-100 dark:border-emerald-800 rounded-2xl bg-white dark:bg-emerald-900/40 shadow-sm flex flex-col ${isUrdu ? 'items-end' : 'items-start'}`}>
              <h4 className={`text-[10px] md:text-xs font-bold text-emerald-400 dark:text-emerald-500 uppercase mb-1 md:mb-2 ${isUrdu ? 'text-right urdu' : 'text-left'}`}>
                {isUrdu ? 'تعلیل (Sound Change)' : 'Sound Change (Ta\'līl)'}
              </h4>
              <p className={`urdu text-base md:text-lg text-gray-700 dark:text-emerald-200 italic ${isUrdu ? 'text-right' : 'text-left'}`}>
                "{sarf.talil || (isUrdu ? 'کوئی تبدیلی نہیں ہوئی۔' : 'No changes occurred.')}"
              </p>
            </div>
          </div>

          <div className="mb-6 md:mb-8">
            <h3 className={`text-xl md:text-2xl font-bold text-emerald-800 dark:text-emerald-300 mb-3 md:mb-4 border-emerald-500 dark:border-emerald-400 pr-3 pl-3 ${isUrdu ? 'border-r-4 text-right urdu' : 'border-l-4 text-left'}`}>
              {isUrdu ? 'گردان (Conjugation)' : 'Conjugation'}
            </h3>
            
            <div className="overflow-x-auto rounded-xl border border-emerald-100 dark:border-emerald-800 bg-white dark:bg-emerald-950/20 shadow-inner -mx-4 md:mx-0">
              <table className={`w-full text-center border-collapse min-w-[320px] ${isUrdu ? 'dir-rtl' : ''}`} dir={isUrdu ? 'rtl' : 'ltr'}>
                <thead>
                  <tr className="bg-emerald-900 dark:bg-emerald-800 text-white">
                    <th className={`p-2 md:p-4 text-xs md:text-sm uppercase font-bold border-emerald-800/50 ${isUrdu ? 'urdu border-l' : 'border-r'}`}>
                      {isUrdu ? 'صیغہ' : 'Form'}
                    </th>
                    <th className={`p-2 md:p-4 text-xs md:text-sm uppercase font-bold border-emerald-800/50 ${isUrdu ? 'urdu border-l' : 'border-r'}`}>
                      {isUrdu ? 'واحد' : 'Singular'}
                    </th>
                    <th className={`p-2 md:p-4 text-xs md:text-sm uppercase font-bold border-emerald-800/50 ${isUrdu ? 'urdu border-l' : 'border-r'}`}>
                      {isUrdu ? 'تثنیہ' : 'Dual'}
                    </th>
                    <th className={`p-2 md:p-4 text-xs md:text-sm uppercase font-bold ${isUrdu ? 'urdu' : ''}`}>
                      {isUrdu ? 'جمع' : 'Plural'}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-100 dark:divide-emerald-800">
                  {sarf.conjugations && Object.keys(sarf.conjugations).length > 0 ? (
                    (Object.entries(sarf.conjugations) as [string, ConjugationRow[]][]).map(([key, rows]) => (
                      Array.isArray(rows) && rows.length > 0 ? rows.map((row, idx) => (
                        <tr key={`${key}-${idx}`} className="hover:bg-emerald-50 dark:hover:bg-emerald-800/30 transition-colors">
                          <td className={`p-2 md:p-4 text-[10px] md:text-sm font-black text-emerald-700 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-800/40 uppercase whitespace-nowrap border-emerald-100 dark:border-emerald-800/50 ${isUrdu ? 'urdu border-l' : 'border-r'}`}>
                            {idx === 0 ? getConjugationLabel(key) : ''}
                          </td>
                          <td className={`p-2 md:p-4 border-emerald-100 dark:border-emerald-800/50 ${isUrdu ? 'border-l' : 'border-r'}`}>
                            <div className="flex flex-col items-center">
                              <span className="arabic text-xl md:text-3xl text-emerald-950 dark:text-emerald-50 leading-relaxed">{row.singular || '-'}</span>
                              {row.singularTranslation && (
                                <span className={`urdu text-[10px] md:text-sm text-emerald-600 dark:text-emerald-400 mt-1`}>{row.singularTranslation}</span>
                              )}
                            </div>
                          </td>
                          <td className={`p-2 md:p-4 border-emerald-100 dark:border-emerald-800/50 ${isUrdu ? 'border-l' : 'border-r'}`}>
                            <div className="flex flex-col items-center">
                              <span className="arabic text-xl md:text-3xl text-emerald-950 dark:text-emerald-50 leading-relaxed">{row.dual || '-'}</span>
                              {row.dualTranslation && (
                                <span className={`urdu text-[10px] md:text-sm text-emerald-600 dark:text-emerald-400 mt-1`}>{row.dualTranslation}</span>
                              )}
                            </div>
                          </td>
                          <td className="p-2 md:p-4">
                            <div className="flex flex-col items-center">
                              <span className="arabic text-xl md:text-3xl text-emerald-950 dark:text-emerald-50 leading-relaxed">{row.plural || '-'}</span>
                              {row.pluralTranslation && (
                                <span className={`urdu text-[10px] md:text-sm text-emerald-600 dark:text-emerald-400 mt-1`}>{row.pluralTranslation}</span>
                              )}
                            </div>
                          </td>
                        </tr>
                      )) : null
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className={`p-8 md:p-12 text-gray-400 dark:text-emerald-600 italic text-center text-lg md:text-xl ${isUrdu ? 'urdu' : ''}`}>
                        {isUrdu ? 'گردان کا ڈیٹا دستیاب نہیں ہے۔' : 'Conjugation data not available.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
             <div className={`bg-amber-50 dark:bg-amber-900/20 p-4 md:p-6 rounded-2xl flex flex-col ${isUrdu ? 'items-end' : 'items-start'}`}>
              <h4 className={`text-[10px] md:text-xs font-bold text-amber-700 dark:text-amber-400 uppercase mb-2 md:mb-3 ${isUrdu ? 'text-right urdu' : 'text-left'}`}>
                {isUrdu ? 'وزن کا تجزیہ (WAZN ANALYSIS)' : 'WAZN ANALYSIS'}
              </h4>
              <p className={`text-3xl md:text-5xl arabic text-amber-900 dark:text-amber-100 mb-2 md:mb-3 leading-relaxed w-full ${isUrdu ? 'text-right' : 'text-left'}`}>
                {sarf.weight?.wazn || 'N/A'}
              </p>
              <p className={`urdu text-sm md:text-base text-amber-800 dark:text-emerald-200 w-full ${isUrdu ? 'text-right' : 'text-left'}`}>
                {sarf.weight?.methodology || ''}
              </p>
            </div>
            <div className={`bg-emerald-50 dark:bg-emerald-800/30 p-4 md:p-6 rounded-2xl flex flex-col ${isUrdu ? 'items-end' : 'items-start'}`}>
              <h4 className={`text-[10px] md:text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase mb-2 md:mb-3 ${isUrdu ? 'text-right urdu' : 'text-left'}`}>
                {isUrdu ? 'صیغہ اور اعراب' : 'Form & Vowels'}
              </h4>
              <p className={`text-lg md:text-xl urdu text-emerald-900 dark:text-emerald-100 w-full ${isUrdu ? 'text-right' : 'text-left'}`}>
                {sarf.sighaIrab || (isUrdu ? 'معلومات دستیاب نہیں ہیں۔' : 'Information not available.')}
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ResultDisplay;
