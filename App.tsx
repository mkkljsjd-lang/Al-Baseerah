
import React, { useState, useCallback, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import Header from './components/Header';
import ScopeSelector from './components/ScopeSelector';
import ResultDisplay from './components/ResultDisplay';
import RecentSearches from './components/RecentSearches';
import DigitalLibrary from './components/DigitalLibrary';
import AuthModal from './components/AuthModal';
import InquiryForm from './components/InquiryForm';
import AdminPanel from './components/AdminPanel';
import { AnalysisScope, AnalysisResult } from './types';
import { analyzeWord } from './services/geminiService';
import { logSearchHistory, getRecentSearches, getCachedAnalysis, cacheAnalysis, supabase, signOut } from './services/supabaseService';
import { User } from '@supabase/supabase-js';

const LOADING_MESSAGES_UR = [
  "مادہ اور جڑ کی تلاش جاری ہے...",
  "نحوی اور صرفی قواعد کا تجزیہ ہو رہا ہے...",
  "قرآنی سیاق و سباق کا مطالعہ کیا جا رہا ہے...",
  "لغوی اور اصطلاحی تحقیق کی جا رہی ہے...",
  "نتائج کو ترتیب دیا جا رہا ہے..."
];

const LOADING_MESSAGES_EN = [
  "Finding root and pattern...",
  "Analyzing syntactic and morphological rules...",
  "Studying Quranic context...",
  "Lexical and terminological research in progress...",
  "Organizing results..."
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
  const [dbStatus, setDbStatus] = useState<'connected' | 'error' | 'connecting' | 'setup_required'>('connecting');
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [language, setLanguage] = useState<'ur' | 'en'>(() => {
    return (localStorage.getItem('language') as 'ur' | 'en') || 'ur';
  });
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });
  
  // Auth State
  const [user, setUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const loadingIntervalRef = useRef<number | null>(null);

  const loadingMessages = language === 'ur' ? LOADING_MESSAGES_UR : LOADING_MESSAGES_EN;

  // Load history function
  const loadHistory = useCallback(async () => {
    try {
      const sbHistory = await getRecentSearches();
      setHistory(sbHistory);
      setDbStatus('connected');
    } catch (err: any) {
      if (err.message === 'TABLE_MISSING') {
        setDbStatus('setup_required');
      } else {
        setDbStatus('error');
      }
      
      const savedHistory = localStorage.getItem(HISTORY_KEY);
      if (savedHistory) {
        try {
          setHistory(JSON.parse(savedHistory));
        } catch (e) {}
      }
    }
  }, []);

  // Sync Auth State
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      loadHistory();
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      loadHistory(); // Reload history when user logs in/out
    });

    return () => subscription.unsubscribe();
  }, [loadHistory]);

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
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ur' ? 'rtl' : 'ltr';
  }, [language]);

  useEffect(() => {
    if (loading) {
      loadingIntervalRef.current = window.setInterval(() => {
        setLoadingMessageIndex((prev) => (prev + 1) % loadingMessages.length);
      }, 2500);
    } else {
      if (loadingIntervalRef.current) clearInterval(loadingIntervalRef.current);
      setLoadingMessageIndex(0);
    }
    return () => {
      if (loadingIntervalRef.current) clearInterval(loadingIntervalRef.current);
    };
  }, [loading, loadingMessages.length]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);
  const toggleLanguage = () => setLanguage(prev => prev === 'ur' ? 'en' : 'ur');

  const handleSearch = useCallback((word: string) => {
    setSearchTerm(word);
    setResult(null);
    setError(null);
    setSelectedScope(undefined);
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

  const addToHistory = async (word: string) => {
    setHistory(prev => {
      const filtered = prev.filter(item => item !== word);
      const newHistory = [word, ...filtered].slice(0, 10);
      return newHistory;
    });

    if (dbStatus === 'connected') {
      logSearchHistory(word);
    }
    
    localStorage.setItem(HISTORY_KEY, JSON.stringify([word, ...history.filter(i => i !== word)].slice(0, 10)));
  };

  const removeFromHistory = (word: string) => {
    setHistory(prev => prev.filter(item => item !== word));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(HISTORY_KEY);
  };

  const handleScopeSelect = async (scope: AnalysisScope) => {
    if (!searchTerm) {
      setError(language === 'ur' ? "براہ کرم پہلے کوئی لفظ لکھیں۔" : "Please enter a word first.");
      return;
    }
    
    setSelectedScope(scope);
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      if (dbStatus === 'connected') {
        const cached = await getCachedAnalysis(searchTerm, scope);
        if (cached) {
          setResult(cached);
          setLoading(false);
          addToHistory(searchTerm);
          return;
        }
      }

      const data = await analyzeWord(searchTerm, scope);
      const finalResult = {
        ...data,
        scope,
        word: searchTerm
      };

      setResult(finalResult);
      
      if (dbStatus === 'connected') {
        cacheAnalysis(searchTerm, scope, finalResult);
      }
      
      addToHistory(searchTerm);
    } catch (err: any) {
      console.error("Analysis failed:", err);
      setError(language === 'ur' 
        ? `تحقیق کے دوران غلطی پیش آئی: ${err.message || "سرور سے رابطہ نہیں ہو سکا۔"}`
        : `An error occurred during research: ${err.message || "Could not connect to server."}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen pb-20 selection:bg-emerald-100 dark:selection:bg-emerald-800 selection:text-emerald-900 dark:selection:text-emerald-100 transition-colors duration-300 ${language === 'en' ? 'font-sans' : ''}`}>
      <Navbar 
        toggleTheme={toggleTheme} 
        isDarkMode={isDarkMode} 
        onHome={handleHome} 
        user={user}
        language={language}
        toggleLanguage={toggleLanguage}
        onLoginClick={() => setIsAuthModalOpen(true)}
        onAdminClick={() => setIsAdminOpen(true)}
      />
      
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        onSuccess={() => loadHistory()} 
        language={language}
      />
      
      {isAdminOpen && <AdminPanel onClose={() => setIsAdminOpen(false)} />}
      
      <Header onSearch={handleSearch} loading={loading} user={user} language={language} />
      
      <main className="container mx-auto px-4 py-8 md:py-12">
        {!loading && !result && (
          <div className="max-w-4xl mx-auto text-center mb-10 md:mb-16 animate-in fade-in duration-500">
            <p className={`text-xl md:text-2xl text-emerald-800/80 dark:text-emerald-200/80 mb-8 md:mb-12 font-medium leading-relaxed max-w-2xl mx-auto px-2 ${language === 'ur' ? 'urdu' : ''}`}>
              {language === 'ur' 
                ? "قرآنِ کریم اور احادیثِ نبوی کے لسانی اسرار و رموز کو جدید صرفی و نحوی تحقیق کے ذریعے تلاش کریں۔"
                : "Explore the linguistic secrets of the Holy Quran and Hadith through modern morphological and syntactic research."}
            </p>
            
            {!searchTerm && (
              <>
                <RecentSearches 
                  history={history} 
                  onSelect={handleSearch} 
                  onRemove={removeFromHistory} 
                  onClear={clearHistory}
                  disabled={loading}
                  language={language}
                />
                <DigitalLibrary language={language} />
              </>
            )}
            
            {searchTerm && !result && (
              <div className="animate-in fade-in slide-in-from-top-6 duration-700 fill-mode-both mt-8 md:mt-12">
                <div className={`inline-block bg-amber-50 dark:bg-amber-900/20 text-amber-900 dark:text-amber-200 px-10 py-3 rounded-full text-base md:text-xl font-bold mb-6 md:mb-8 border border-amber-200 dark:border-amber-700/50 shadow-sm ${language === 'ur' ? 'urdu' : ''}`}>
                  {language === 'ur' ? "مرحلہ 2: تحقیق کا دائرہ منتخب کریں" : "Step 2: Select Research Scope"}
                </div>
                
                <ScopeSelector 
                  onSelect={handleScopeSelect} 
                  selectedScope={selectedScope} 
                  disabled={loading} 
                  language={language}
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
                <p className={`text-emerald-700 dark:text-emerald-400 font-bold text-2xl md:text-3xl transition-all duration-500 ${language === 'ur' ? 'urdu' : ''}`}>
                  {loadingMessages[loadingMessageIndex]}
                </p>
                <p className={`text-emerald-900/60 dark:text-emerald-100/40 text-lg md:text-xl ${language === 'ur' ? 'urdu' : ''}`}>
                  {language === 'ur' ? "برائے مہربانی تھوڑا انتظار کریں" : "Please wait a moment"}
                </p>
              </div>
            </div>
          </div>
        )}

        {error && !loading && (
          <div className="max-w-xl mx-auto bg-red-50 dark:bg-red-950/20 border-2 border-red-100 dark:border-red-900/30 text-red-800 dark:text-red-200 px-6 py-6 md:px-8 rounded-3xl text-center mb-12 shadow-sm animate-in zoom-in-95 duration-300">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mx-auto mb-4 text-xl">⚠️</div>
            <p className={`font-bold text-base md:text-lg mb-1 text-xl md:text-2xl ${language === 'ur' ? 'urdu' : ''}`}>
              {language === 'ur' ? "تجزیہ رک گیا ہے" : "Analysis Stopped"}
            </p>
            <p className={`text-xs md:text-sm opacity-80 ${language === 'ur' ? 'urdu' : ''}`}>{error}</p>
            <button 
              onClick={() => {setError(null); setSearchTerm('');}} 
              className={`mt-6 px-6 py-2 bg-red-600 dark:bg-red-700 text-white rounded-full font-bold text-xs md:text-sm hover:bg-red-700 dark:hover:bg-red-600 transition-colors ${language === 'ur' ? 'urdu' : ''}`}
            >
              {language === 'ur' ? "دوبارہ کوشش کریں" : "Try Again"}
            </button>
          </div>
        )}

        {result && !loading && <ResultDisplay result={result} onBack={handleBack} language={language} />}

        {!searchTerm && !loading && !result && (
          <>
            <div className="max-w-4xl mx-auto mt-16 md:mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
              <div className="bg-white dark:bg-emerald-900/40 p-6 md:p-8 rounded-2xl md:rounded-3xl border border-emerald-50 dark:border-emerald-800 shadow-sm hover:shadow-md transition-all group">
                <div className="text-3xl md:text-4xl mb-3 md:mb-4 group-hover:scale-110 transition-transform duration-300">📜</div>
                <h4 className={`font-extrabold text-emerald-900 dark:text-emerald-100 mb-2 text-base md:text-lg ${language === 'ur' ? 'urdu' : ''}`}>
                  {language === 'ur' ? "قرآنی سیاق" : "Quranic Context"}
                </h4>
                <p className={`text-xs md:text-sm text-emerald-700/60 dark:text-emerald-300/60 leading-relaxed ${language === 'ur' ? 'urdu' : ''}`}>
                  {language === 'ur' ? "وحیِ الٰہی اور سنتِ نبوی میں الفاظ کے مادوں کی گہری تلاش۔" : "In-depth search for word roots in Divine Revelation and Sunnah."}
                </p>
              </div>
              <div className="bg-white dark:bg-emerald-900/40 p-6 md:p-8 rounded-2xl md:rounded-3xl border border-emerald-50 dark:border-emerald-800 shadow-sm hover:shadow-md transition-all group">
                <div className="text-3xl md:text-4xl mb-3 md:mb-4 group-hover:scale-110 transition-transform duration-300">⚖️</div>
                <h4 className={`font-extrabold text-emerald-900 dark:text-emerald-100 mb-2 text-base md:text-lg ${language === 'ur' ? 'urdu' : ''}`}>
                  {language === 'ur' ? "درست اوزان" : "Correct Scales"}
                </h4>
                <p className={`text-xs md:text-sm text-emerald-700/60 dark:text-emerald-300/60 leading-relaxed ${language === 'ur' ? 'urdu' : ''}`}>
                  {language === 'ur' ? "کلاسیکی اصولوں کے تحت ہر مشتق لفظ کا درست صرفی وزن۔" : "Accurate morphological weights for derived words based on classical principles."}
                </p>
              </div>
              <div className="bg-white dark:bg-emerald-900/40 p-6 md:p-8 rounded-2xl md:rounded-3xl border border-emerald-50 dark:border-emerald-800 shadow-sm hover:shadow-md transition-all group">
                <div className="text-3xl md:text-4xl mb-3 md:mb-4 group-hover:scale-110 transition-transform duration-300">🔗</div>
                <h4 className={`font-extrabold text-emerald-900 dark:text-emerald-100 mb-2 text-base md:text-lg ${language === 'ur' ? 'urdu' : ''}`}>
                  {language === 'ur' ? "نحوی زنجیریں" : "Syntactic Chains"}
                </h4>
                <p className={`text-xs md:text-sm text-emerald-700/60 dark:text-emerald-300/60 leading-relaxed ${language === 'ur' ? 'urdu' : ''}`}>
                  {language === 'ur' ? "عربی نحو میں ہر حرف اور لفظ کے کردار کو گہرائی سے سمجھیں۔" : "Deeply understand the role of every letter and word in Arabic syntax."}
                </p>
              </div>
            </div>
            
            <InquiryForm language={language} />
          </>
        )}
      </main>

      <footer className="fixed bottom-0 left-0 right-0 bg-white/60 dark:bg-emerald-950/60 backdrop-blur-xl border-t border-emerald-100/50 dark:border-emerald-800/50 py-3 md:py-4 text-center transition-colors duration-300 z-50 flex items-center justify-center gap-4">
        <span className={`text-[8px] md:text-[10px] text-emerald-900/40 dark:text-emerald-100/40 font-bold uppercase tracking-[0.2em] ${language === 'ur' ? 'urdu' : ''}`}>
          &copy; {new Date().getFullYear()} {language === 'ur' ? 'متولی - اسلامی لسانی ذہانت' : 'Mutawalli - Islamic Linguistic Intel'}
        </span>
        <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-900/40 rounded-full border border-emerald-100 dark:border-emerald-800">
           <div className={`w-1.5 h-1.5 rounded-full ${dbStatus === 'connected' ? 'bg-emerald-500' : dbStatus === 'setup_required' ? 'bg-blue-500 animate-pulse' : dbStatus === 'error' ? 'bg-red-500' : 'bg-amber-500 animate-pulse'}`}></div>
           <span className="text-[8px] font-black text-emerald-800 dark:text-emerald-300 uppercase tracking-tighter">
             {user ? 'Logged In' : 'Public'} | {dbStatus === 'connected' ? 'Ready' : dbStatus === 'setup_required' ? 'Setup Needed' : 'Offline'}
           </span>
           
           <div className="flex items-center gap-1 ml-2 border-l border-emerald-200 dark:border-emerald-700 pl-2">
             <button 
               onClick={() => setIsAdminOpen(true)}
               className="px-2 py-0.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[8px] font-bold transition-colors"
             >
               Admin ⚙️
             </button>
             
             {user && (
               <button 
                 onClick={() => signOut()}
                 className="px-2 py-0.5 bg-red-600 hover:bg-red-500 text-white rounded text-[8px] font-bold transition-colors"
               >
                 Log Out 🚪
               </button>
             )}
           </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
