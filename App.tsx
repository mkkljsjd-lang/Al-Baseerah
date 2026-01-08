
import React, { useState, useCallback, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import Header from './components/Header';
import ScopeSelector from './components/ScopeSelector';
import ResultDisplay from './components/ResultDisplay';
import RecentSearches from './components/RecentSearches';
import DigitalLibrary from './components/DigitalLibrary';
import { AnalysisScope, AnalysisResult } from './types';
import { analyzeWord } from './services/geminiService';

const LOADING_MESSAGES = [
  "مادہ اور جڑ کی تلاش جاری ہے...",
  "نحوی اور صرفی قواعد کا تجزیہ ہو رہا ہے...",
  "قرآنی سیاق و سباق کا مطالعہ کیا جا رہا ہے...",
  "لغوی اور اصطلاحی تحقیق کی جا رہی ہے...",
  "نتائج کو ترتیب دیا جا رہا ہے..."
];

const HISTORY_KEY = 'mutawalli_search_history';

const App: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedScope, setSelectedScope] = useState<AnalysisScope | undefined>();
  const [loading, setLoading] = useState(false);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  const loadingIntervalRef = useRef<number | null>(null);

  // Load history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem(HISTORY_KEY);
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to load history", e);
      }
    }
  }, []);

  // Update localStorage when history changes
  useEffect(() => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  useEffect(() => {
    if (loading) {
      loadingIntervalRef.current = window.setInterval(() => {
        setLoadingMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
      }, 2500);
    } else {
      if (loadingIntervalRef.current) clearInterval(loadingIntervalRef.current);
      setLoadingMessageIndex(0);
    }
    return () => {
      if (loadingIntervalRef.current) clearInterval(loadingIntervalRef.current);
    };
  }, [loading]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const handleSearch = useCallback((word: string) => {
    setSearchTerm(word);
    setResult(null);
    setError(null);
    setSelectedScope(undefined);
    // Smooth scroll to top when starting a new search if result was showing
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleBack = useCallback(() => {
    setResult(null);
    setSelectedScope(undefined);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleHome = useCallback(() => {
    setSearchTerm('');
    setResult(null);
    setSelectedScope(undefined);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const addToHistory = (word: string) => {
    setHistory(prev => {
      // Remove word if it already exists to move it to the front
      const filtered = prev.filter(item => item !== word);
      // Keep only last 10 items
      const newHistory = [word, ...filtered].slice(0, 10);
      return newHistory;
    });
  };

  const removeFromHistory = (word: string) => {
    setHistory(prev => prev.filter(item => item !== word));
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const handleScopeSelect = async (scope: AnalysisScope) => {
    if (!searchTerm) {
      setError("براہ کرم پہلے کوئی لفظ لکھیں۔");
      return;
    }
    
    setSelectedScope(scope);
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await analyzeWord(searchTerm, scope);
      setResult({
        ...data,
        scope,
        word: searchTerm
      });
      // Add to history only on successful analysis
      addToHistory(searchTerm);
    } catch (err: any) {
      console.error("Analysis failed:", err);
      setError(`تحقیق کے دوران غلطی پیش آئی: ${err.message || "سرور سے رابطہ نہیں ہو سکا۔"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-20 selection:bg-emerald-100 dark:selection:bg-emerald-800 selection:text-emerald-900 dark:selection:text-emerald-100 transition-colors duration-300">
      <Navbar toggleTheme={toggleTheme} isDarkMode={isDarkMode} onHome={handleHome} />
      
      {/* Search Input is now integrated into the Header as requested */}
      <Header onSearch={handleSearch} loading={loading} />
      
      <main className="container mx-auto px-4 py-8 md:py-12">
        {!loading && !result && (
          <div className="max-w-4xl mx-auto text-center mb-10 md:mb-16 animate-in fade-in duration-500">
            <p className="text-xl md:text-2xl text-emerald-800/80 dark:text-emerald-200/80 mb-8 md:mb-12 font-medium leading-relaxed max-w-2xl mx-auto urdu px-2">
              قرآنِ کریم اور احادیثِ نبوی کے لسانی اسرار و رموز کو جدید صرفی و نحوی تحقیق کے ذریعے تلاش کریں۔
            </p>
            
            {!searchTerm && (
              <>
                <RecentSearches 
                  history={history} 
                  onSelect={handleSearch} 
                  onRemove={removeFromHistory} 
                  onClear={clearHistory}
                  disabled={loading}
                />
                <DigitalLibrary />
              </>
            )}
            
            {searchTerm && !result && (
              <div className="animate-in fade-in slide-in-from-top-6 duration-700 fill-mode-both mt-8 md:mt-12">
                {/* Step 2 Label Styling based on screenshot */}
                <div className="inline-block bg-amber-50 dark:bg-amber-900/20 text-amber-900 dark:text-amber-200 px-10 py-3 rounded-full text-base md:text-xl font-bold mb-6 md:mb-8 urdu border border-amber-200 dark:border-amber-700/50 shadow-sm">
                  مرحلہ 2: تحقیق کا دائرہ منتخب کریں
                </div>
                
                <ScopeSelector 
                  onSelect={handleScopeSelect} 
                  selectedScope={selectedScope} 
                  disabled={loading} 
                />
              </div>
            )}
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-16 md:py-24 animate-in fade-in duration-500">
            <div className="relative mb-12 md:mb-16">
              <div className="w-24 h-24 md:w-32 md:h-32 border-[8px] md:border-[12px] border-emerald-100 dark:border-emerald-900/50 rounded-full shadow-inner"></div>
              <div className="w-24 h-24 md:w-32 md:h-32 border-[8px] md:border-[12px] border-emerald-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0 shadow-lg"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                 <div className="w-3 h-3 md:w-4 md:h-4 bg-amber-500 rounded-full animate-ping"></div>
              </div>
            </div>
            
            <div className="text-center space-y-4 md:space-y-6 max-w-lg px-4">
              <div className="space-y-2">
                <p className="text-emerald-700 dark:text-emerald-400 font-bold urdu text-2xl md:text-3xl transition-all duration-500">
                  {LOADING_MESSAGES[loadingMessageIndex]}
                </p>
                <p className="text-emerald-900/60 dark:text-emerald-100/40 urdu text-lg md:text-xl">برائے مہربانی تھوڑا انتظار کریں</p>
              </div>
              
              <div className="pt-6 md:pt-8 flex flex-col items-center">
                <div className="w-40 md:w-48 h-1 bg-emerald-100 dark:bg-emerald-900 rounded-full overflow-hidden">
                   <div className="h-full bg-emerald-600 animate-[loading-bar_2s_ease-in-out_infinite]"></div>
                </div>
                <p className="mt-4 text-emerald-900/30 dark:text-emerald-100/20 uppercase tracking-[0.4em] text-[8px] md:text-[10px] font-black">
                  Mutawalli Linguistic Engine v2.5
                </p>
              </div>
            </div>
          </div>
        )}

        {error && !loading && (
          <div className="max-w-xl mx-auto bg-red-50 dark:bg-red-950/20 border-2 border-red-100 dark:border-red-900/30 text-red-800 dark:text-red-200 px-6 py-6 md:px-8 rounded-3xl text-center mb-12 shadow-sm animate-in zoom-in-95 duration-300">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mx-auto mb-4 text-xl">⚠️</div>
            <p className="font-bold text-base md:text-lg mb-1 urdu text-xl md:text-2xl">تجزیہ رک گیا ہے</p>
            <p className="text-xs md:text-sm opacity-80 urdu">{error}</p>
            <button 
              onClick={() => {setError(null); setSearchTerm('');}} 
              className="mt-6 px-6 py-2 bg-red-600 dark:bg-red-700 text-white rounded-full font-bold text-xs md:text-sm hover:bg-red-700 dark:hover:bg-red-600 transition-colors urdu"
            >
              دوبارہ کوشش کریں
            </button>
          </div>
        )}

        {result && !loading && <ResultDisplay result={result} onBack={handleBack} />}

        {!searchTerm && !loading && !result && (
          <div className="max-w-4xl mx-auto mt-16 md:mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
            <div className="bg-white dark:bg-emerald-900/40 p-6 md:p-8 rounded-2xl md:rounded-3xl border border-emerald-50 dark:border-emerald-800 shadow-sm hover:shadow-md transition-all group">
              <div className="text-3xl md:text-4xl mb-3 md:mb-4 group-hover:scale-110 transition-transform duration-300">📜</div>
              <h4 className="font-extrabold text-emerald-900 dark:text-emerald-100 mb-2 urdu text-base md:text-lg">قرآنی سیاق</h4>
              <p className="text-xs md:text-sm text-emerald-700/60 dark:text-emerald-300/60 leading-relaxed urdu">وحیِ الٰہی اور سنتِ نبوی میں الفاظ کے مادوں کی گہری تلاش۔</p>
            </div>
            <div className="bg-white dark:bg-emerald-900/40 p-6 md:p-8 rounded-2xl md:rounded-3xl border border-emerald-50 dark:border-emerald-800 shadow-sm hover:shadow-md transition-all group">
              <div className="text-3xl md:text-4xl mb-3 md:mb-4 group-hover:scale-110 transition-transform duration-300">⚖️</div>
              <h4 className="font-extrabold text-emerald-900 dark:text-emerald-100 mb-2 urdu text-base md:text-lg">درست اوزان</h4>
              <p className="text-xs md:text-sm text-emerald-700/60 dark:text-emerald-300/60 leading-relaxed urdu">کلاسیکی اصولوں کے تحت ہر مشتق لفظ کا درست صرفی وزن۔</p>
            </div>
            <div className="bg-white dark:bg-emerald-900/40 p-6 md:p-8 rounded-2xl md:rounded-3xl border border-emerald-50 dark:border-emerald-800 shadow-sm hover:shadow-md transition-all group">
              <div className="text-3xl md:text-4xl mb-3 md:mb-4 group-hover:scale-110 transition-transform duration-300">🔗</div>
              <h4 className="font-extrabold text-emerald-900 dark:text-emerald-100 mb-2 urdu text-base md:text-lg">نحوی زنجیریں</h4>
              <p className="text-xs md:text-sm text-emerald-700/60 dark:text-emerald-300/60 leading-relaxed urdu">عربی نحو میں ہر حرف اور لفظ کے کردار کو گہرائی سے سمجھیں۔</p>
            </div>
          </div>
        )}
      </main>

      <footer className="fixed bottom-0 left-0 right-0 bg-white/60 dark:bg-emerald-950/60 backdrop-blur-xl border-t border-emerald-100/50 dark:border-emerald-800/50 py-3 md:py-4 text-center text-[8px] md:text-[10px] text-emerald-900/40 dark:text-emerald-100/40 font-bold uppercase tracking-[0.2em] transition-colors duration-300 z-50 urdu">
        &copy; {new Date().getFullYear()} متولی - اسلامی لسانی ذہانت
      </footer>

      <style>{`
        @keyframes loading-bar {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(0); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default App;
