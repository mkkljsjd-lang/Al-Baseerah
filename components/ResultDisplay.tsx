
import React from 'react';
import { AnalysisResult, ConjugationRow } from '../types';

interface ResultDisplayProps {
  result: AnalysisResult;
  onBack: () => void;
}

const Card: React.FC<React.PropsWithChildren<{ title: string, icon?: string }>> = ({ title, children, icon }) => (
  <div className="bg-white dark:bg-emerald-900/30 rounded-2xl md:rounded-3xl p-4 md:p-8 shadow-xl border border-emerald-50 dark:border-emerald-800/50 mb-6 md:mb-8 overflow-hidden relative backdrop-blur-sm transition-colors duration-300">
    <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6 border-b border-emerald-50 dark:border-emerald-800/50 pb-3 md:pb-4">
      {icon && <span className="text-xl md:text-2xl">{icon}</span>}
      <h2 className="text-xl md:text-2xl font-bold text-emerald-900 dark:text-emerald-100 urdu">{title}</h2>
    </div>
    {children}
  </div>
);

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, onBack }) => {
  const { quranHadith, nahw, sarf, word } = result;

  const getConjugationLabel = (key: string) => {
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
      <div className="flex flex-col-reverse md:flex-row justify-between items-center mb-6 md:mb-10 gap-4">
        <button
          onClick={onBack}
          className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-2 bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 rounded-full font-bold shadow-sm hover:shadow-md hover:bg-emerald-100 dark:hover:bg-emerald-800 transition-all border border-emerald-100 dark:border-emerald-800"
        >
          <span className="text-lg">←</span>
          <span className="text-sm urdu">پیچھے</span>
        </button>
        <div className="text-center md:text-right">
          <span className="text-[10px] uppercase tracking-[0.3em] text-emerald-600 dark:text-emerald-400 font-black block mb-1 urdu">تحقیق برائے</span>
          <h1 className="text-4xl md:text-6xl arabic text-emerald-800 dark:text-emerald-100 leading-normal">{word}</h1>
        </div>
      </div>

      {quranHadith && (
        <Card title="قرآن و حدیث کی تحقیق" icon="📖">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mb-6 md:mb-8">
            <div className="bg-emerald-50 dark:bg-emerald-800/30 p-4 md:p-6 rounded-2xl flex flex-col items-end">
              <h3 className="text-emerald-700 dark:text-emerald-400 font-bold mb-1 md:mb-2 text-xs uppercase urdu">اردو ترجمہ</h3>
              <p className="text-xl md:text-2xl urdu text-emerald-900 dark:text-emerald-100 text-right w-full">
                {quranHadith.urduTranslation || 'دستیاب نہیں ہے'}
              </p>
            </div>
            <div className="bg-amber-50 dark:bg-amber-900/20 p-4 md:p-6 rounded-2xl flex flex-col items-end">
              <h3 className="text-amber-700 dark:text-amber-400 font-bold mb-1 md:mb-2 text-xs uppercase urdu">لغوی معنی</h3>
              <p className="text-base md:text-lg urdu text-amber-900 dark:text-amber-100 text-right w-full">
                {quranHadith.etymology?.lexicalMeaning || 'دستیاب نہیں ہے'}
              </p>
            </div>
          </div>

          <div className="mb-6 md:mb-8">
            <h3 className="text-xl md:text-2xl font-bold text-emerald-800 dark:text-emerald-300 mb-3 md:mb-4 border-r-4 border-emerald-500 dark:border-emerald-400 pr-3 text-right urdu">تحقیقِ لفظ (Tahqeeq)</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
              <div className="text-center p-3 md:p-4 border border-emerald-100 dark:border-emerald-800 rounded-xl bg-white dark:bg-emerald-900/50 shadow-sm">
                <span className="block text-[10px] md:text-xs text-emerald-400 dark:text-emerald-500 font-bold uppercase mb-1 urdu">مادہ (Root)</span>
                <span className="text-2xl md:text-3xl arabic text-emerald-900 dark:text-emerald-100">{quranHadith.etymology?.root || 'N/A'}</span>
              </div>
              <div className="text-center p-3 md:p-4 border border-emerald-100 dark:border-emerald-800 rounded-xl bg-white dark:bg-emerald-900/50 shadow-sm">
                <span className="block text-[10px] md:text-xs text-emerald-400 dark:text-emerald-500 font-bold uppercase mb-1 urdu">باب (Bab)</span>
                <span className="text-xl md:text-2xl arabic text-emerald-900 dark:text-emerald-100">{quranHadith.etymology?.bab || 'N/A'}</span>
              </div>
              <div className="col-span-2 md:col-span-1 text-center p-3 md:p-4 border border-emerald-100 dark:border-emerald-800 rounded-xl bg-white dark:bg-emerald-900/50 shadow-sm">
                <span className="block text-[10px] md:text-xs text-emerald-400 dark:text-emerald-500 font-bold uppercase mb-1 urdu">وزن (Weight)</span>
                <span className="text-xl md:text-2xl arabic text-emerald-900 dark:text-emerald-100">{sarf?.weight?.wazn || 'N/A'}</span>
              </div>
            </div>
          </div>

          <div className="mb-6 md:mb-8">
            <h3 className="text-xl md:text-2xl font-bold text-emerald-800 dark:text-emerald-300 mb-3 md:mb-4 border-r-4 border-emerald-500 dark:border-emerald-400 pr-3 text-right urdu">قرآن و حدیث کے حوالہ جات</h3>
            <div className="space-y-3 md:space-y-4">
              {quranHadith.references?.map((ref, i) => (
                <div key={i} className="p-3 md:p-4 bg-white dark:bg-emerald-900/40 border-r-4 border-amber-400 dark:border-amber-600 shadow-sm rounded-l-xl text-right">
                  <div className="flex justify-between items-start mb-1 md:mb-2 dir-rtl gap-2">
                    <span className="font-bold text-emerald-900 dark:text-emerald-100 urdu text-sm md:text-base">{ref.source}</span>
                    <span className="text-amber-700 dark:text-amber-500 font-medium text-[10px] md:text-sm urdu">{ref.reference}</span>
                  </div>
                  <p className="text-base md:text-lg text-gray-700 dark:text-emerald-200/80 urdu">{ref.context}</p>
                </div>
              )) || <p className="text-sm text-gray-400 dark:text-gray-500 italic text-right urdu">کوئی حوالہ نہیں ملا۔</p>}
            </div>
          </div>

          <div>
            <h3 className="text-xl md:text-2xl font-bold text-emerald-800 dark:text-emerald-300 mb-3 md:mb-4 border-r-4 border-emerald-500 dark:border-emerald-400 pr-3 text-right urdu">تعلیمی جملے</h3>
            <div className="space-y-3 md:space-y-4">
              {quranHadith.sentences?.map((sent, i) => (
                <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 p-3 md:p-4 border border-emerald-50 dark:border-emerald-800 rounded-2xl hover:bg-emerald-50 dark:hover:bg-emerald-800/40 transition-colors">
                  <p className="arabic text-2xl md:text-4xl text-right text-emerald-900 dark:text-emerald-100 leading-relaxed">{sent.arabic}</p>
                  <p className="urdu text-lg md:text-xl text-right text-gray-700 dark:text-emerald-200 pt-2">{sent.urdu}</p>
                </div>
              )) || <p className="text-sm text-gray-400 dark:text-gray-500 italic text-right urdu">کوئی مثالی جملہ فراہم نہیں کیا گیا۔</p>}
            </div>
          </div>
        </Card>
      )}

      {nahw && (
        <Card title="علم النحو (Syntax)" icon="📐">
          <div className="mb-6 md:mb-8">
            <h3 className="text-xl md:text-2xl font-bold text-emerald-800 dark:text-emerald-300 mb-3 md:mb-4 border-r-4 border-emerald-500 dark:border-emerald-400 pr-3 text-right urdu">نحوی قواعد (Qawa'id)</h3>
            <div className="p-4 md:p-6 bg-emerald-50 dark:bg-emerald-800/30 rounded-2xl">
              <div className="flex items-center justify-end gap-3 md:gap-4 mb-2 md:mb-3">
                <span className="text-2xl md:text-3xl font-bold text-emerald-900 dark:text-emerald-100 arabic">{nahw.rules?.wordType || 'N/A'}</span>
                <span className="px-2 md:px-3 py-0.5 md:py-1 bg-emerald-200 dark:bg-emerald-700 text-emerald-800 dark:text-emerald-100 text-[10px] md:text-xs font-bold rounded-full uppercase urdu">قسم</span>
              </div>
              <p className="urdu text-lg md:text-xl text-emerald-900 dark:text-emerald-200 text-right">{nahw.rules?.characteristics || 'معلومات دستیاب نہیں ہیں۔'}</p>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl md:text-2xl font-bold text-emerald-800 dark:text-emerald-300 mb-3 md:mb-4 border-r-4 border-emerald-500 dark:border-emerald-400 pr-3 text-right urdu">اعراب و ترکیب (Parsing)</h3>
            <div className="p-4 md:p-6 border border-emerald-100 dark:border-emerald-800 rounded-2xl bg-white dark:bg-emerald-900/40">
              <div className="mb-4 flex flex-col items-end">
                <span className="block text-[10px] md:text-xs font-bold text-emerald-400 dark:text-emerald-500 uppercase mb-2 text-right urdu">نمونہ جملہ</span>
                <p className="arabic text-3xl md:text-5xl text-emerald-900 dark:text-emerald-100 bg-emerald-50/30 dark:bg-emerald-800/20 p-3 md:p-4 rounded-xl shadow-inner border border-emerald-50 dark:border-emerald-800/50 text-right leading-relaxed w-full">
                  {nahw.parsing?.sampleSentence || 'N/A'}
                </p>
              </div>
              <div className="mb-2 text-right">
                <span className="inline-block px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 text-xs md:text-sm font-bold rounded mb-3 md:mb-4 urdu">نحوی کردار: {nahw.parsing?.role || 'N/A'}</span>
                <p className="urdu text-lg md:text-xl text-gray-800 dark:text-emerald-200">{nahw.parsing?.explanation || 'وضاحت دستیاب نہیں ہے۔'}</p>
              </div>
            </div>
          </div>
        </Card>
      )}

      {sarf && (
        <Card title="علم الصرف (Morphology)" icon="🔄">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
            <div className="p-4 md:p-5 border border-emerald-100 dark:border-emerald-800 rounded-2xl bg-white dark:bg-emerald-900/40 shadow-sm flex flex-col items-end">
              <h4 className="text-[10px] md:text-xs font-bold text-emerald-400 dark:text-emerald-500 uppercase mb-1 md:mb-2 text-right urdu">ہفت اقسام (Seven Categories)</h4>
              <p className="font-bold text-emerald-800 dark:text-emerald-200 mb-1 arabic text-right text-xl md:text-2xl">{sarf.haftAqsam?.category || 'N/A'}</p>
              <p className="urdu text-sm md:text-base text-gray-600 dark:text-emerald-300/80 text-right">{sarf.haftAqsam?.explanation || ''}</p>
            </div>
            <div className="p-4 md:p-5 border border-emerald-100 dark:border-emerald-800 rounded-2xl bg-white dark:bg-emerald-900/40 shadow-sm flex flex-col items-end">
              <h4 className="text-[10px] md:text-xs font-bold text-emerald-400 dark:text-emerald-500 uppercase mb-1 md:mb-2 text-right urdu">تعلیل (Sound Change)</h4>
              <p className="urdu text-base md:text-lg text-gray-700 dark:text-emerald-200 italic text-right">"{sarf.talil || 'کوئی تبدیلی نہیں ہوئی۔'}"</p>
            </div>
          </div>

          <div className="mb-6 md:mb-8">
            <h3 className="text-xl md:text-2xl font-bold text-emerald-800 dark:text-emerald-300 mb-3 md:mb-4 border-r-4 border-emerald-500 dark:border-emerald-400 pr-3 text-right urdu">گردان (Conjugation)</h3>
            
            <div className="overflow-x-auto rounded-xl border border-emerald-100 dark:border-emerald-800 bg-white dark:bg-emerald-950/20 shadow-inner -mx-4 md:mx-0">
              <table className="w-full text-center border-collapse min-w-[320px]">
                <thead>
                  <tr className="bg-emerald-900 dark:bg-emerald-800 text-white">
                    <th className="p-2 md:p-4 text-xs md:text-sm uppercase font-bold urdu border-l border-emerald-800/50">صیغہ</th>
                    <th className="p-2 md:p-4 text-xs md:text-sm uppercase font-bold urdu border-l border-emerald-800/50">واحد</th>
                    <th className="p-2 md:p-4 text-xs md:text-sm uppercase font-bold urdu border-l border-emerald-800/50">تثنیہ</th>
                    <th className="p-2 md:p-4 text-xs md:text-sm uppercase font-bold urdu">جمع</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-100 dark:divide-emerald-800">
                  {sarf.conjugations && Object.keys(sarf.conjugations).length > 0 ? (
                    (Object.entries(sarf.conjugations) as [string, ConjugationRow[]][]).map(([key, rows]) => (
                      Array.isArray(rows) && rows.length > 0 ? rows.map((row, idx) => (
                        <tr key={`${key}-${idx}`} className="hover:bg-emerald-50 dark:hover:bg-emerald-800/30 transition-colors">
                          <td className="p-2 md:p-4 text-[10px] md:text-sm font-black text-emerald-700 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-800/40 uppercase urdu border-l border-emerald-100 dark:border-emerald-800/50 whitespace-nowrap">
                            {idx === 0 ? getConjugationLabel(key) : ''}
                          </td>
                          <td className="p-2 md:p-4 border-l border-emerald-100 dark:border-emerald-800/50">
                            <div className="flex flex-col items-center">
                              <span className="arabic text-xl md:text-3xl text-emerald-950 dark:text-emerald-50 leading-relaxed">{row.singular || '-'}</span>
                              {row.singularTranslation && (
                                <span className="urdu text-[10px] md:text-sm text-emerald-600 dark:text-emerald-400 mt-1">{row.singularTranslation}</span>
                              )}
                            </div>
                          </td>
                          <td className="p-2 md:p-4 border-l border-emerald-100 dark:border-emerald-800/50">
                            <div className="flex flex-col items-center">
                              <span className="arabic text-xl md:text-3xl text-emerald-950 dark:text-emerald-50 leading-relaxed">{row.dual || '-'}</span>
                              {row.dualTranslation && (
                                <span className="urdu text-[10px] md:text-sm text-emerald-600 dark:text-emerald-400 mt-1">{row.dualTranslation}</span>
                              )}
                            </div>
                          </td>
                          <td className="p-2 md:p-4">
                            <div className="flex flex-col items-center">
                              <span className="arabic text-xl md:text-3xl text-emerald-950 dark:text-emerald-50 leading-relaxed">{row.plural || '-'}</span>
                              {row.pluralTranslation && (
                                <span className="urdu text-[10px] md:text-sm text-emerald-600 dark:text-emerald-400 mt-1">{row.pluralTranslation}</span>
                              )}
                            </div>
                          </td>
                        </tr>
                      )) : null
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="p-8 md:p-12 text-gray-400 dark:text-emerald-600 italic urdu text-center text-lg md:text-xl">گردان کا ڈیٹا دستیاب نہیں ہے۔</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
             <div className="bg-amber-50 dark:bg-amber-900/20 p-4 md:p-6 rounded-2xl flex flex-col items-end">
              <h4 className="text-[10px] md:text-xs font-bold text-amber-700 dark:text-amber-400 uppercase mb-2 md:mb-3 text-right urdu">وزن کا تجزیہ (WAZN ANALYSIS)</h4>
              <p className="text-3xl md:text-5xl arabic text-amber-900 dark:text-amber-100 mb-2 md:mb-3 text-right leading-relaxed w-full">
                {sarf.weight?.wazn || 'N/A'}
              </p>
              <p className="urdu text-sm md:text-base text-amber-800 dark:text-emerald-200 text-right w-full">
                {sarf.weight?.methodology || ''}
              </p>
            </div>
            <div className="bg-emerald-50 dark:bg-emerald-800/30 p-4 md:p-6 rounded-2xl flex flex-col items-end">
              <h4 className="text-[10px] md:text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase mb-2 md:mb-3 text-right urdu">صیغہ اور اعراب</h4>
              <p className="text-lg md:text-xl urdu text-emerald-900 dark:text-emerald-100 text-right w-full">
                {sarf.sighaIrab || 'معلومات دستیاب نہیں ہیں۔'}
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ResultDisplay;
