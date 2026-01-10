
import React from 'react';

interface MobileGuideProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'ur' | 'en';
}

const MobileGuide: React.FC<MobileGuideProps> = ({ isOpen, onClose, language }) => {
  if (!isOpen) return null;

  const isUrdu = language === 'ur';

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-emerald-950/90 backdrop-blur-xl">
      <div className="bg-white dark:bg-emerald-900 w-full max-w-lg rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative animate-in zoom-in-95 duration-300 border border-emerald-500/20">
        <button 
          onClick={onClose}
          className={`absolute top-6 ${isUrdu ? 'left-6' : 'right-6'} text-emerald-900/30 dark:text-emerald-100/30 hover:text-emerald-600 transition-colors`}
        >
          ✕
        </button>

        <div className="text-center mb-8">
          <div className="text-5xl mb-4">📱</div>
          <h2 className={`text-3xl font-bold text-emerald-900 dark:text-emerald-100 ${isUrdu ? 'urdu' : ''}`}>
            {isUrdu ? 'موبائل ایپ کے طور پر چلائیں' : 'Use as a Mobile App'}
          </h2>
          <p className={`text-emerald-700/60 dark:text-emerald-400/60 mt-2 ${isUrdu ? 'urdu' : 'text-sm'}`}>
            {isUrdu 
              ? 'اسے اپنے موبائل کی ہوم اسکرین پر شامل کریں تاکہ آپ اسے ایک اصلی ایپ کی طرح استعمال کر سکیں۔' 
              : 'Add this to your home screen to use it just like a native app.'}
          </p>
        </div>

        <div className="space-y-8 overflow-y-auto max-h-[60vh] pr-2">
          {/* Android Section */}
          <div className={`p-6 bg-emerald-50 dark:bg-emerald-800/20 rounded-3xl border border-emerald-100 dark:border-emerald-700 ${isUrdu ? 'text-right' : 'text-left'}`}>
            <h3 className={`text-xl font-black text-emerald-800 dark:text-emerald-200 mb-4 flex items-center gap-3 ${isUrdu ? 'flex-row-reverse' : ''}`}>
              <span className="text-2xl">🤖</span>
              <span>Android (Chrome)</span>
            </h3>
            <ol className={`space-y-3 text-emerald-900/80 dark:text-emerald-100/80 list-decimal list-inside ${isUrdu ? 'urdu pr-4' : 'pl-4'}`}>
              <li>{isUrdu ? 'کروم براؤزر میں اوپر موجود تین نقطوں (⋮) پر کلک کریں۔' : 'Open Chrome and tap the three dots (⋮) at the top right.'}</li>
              <li>{isUrdu ? 'فہرست میں سے "Add to Home Screen" یا "Install" پر کلک کریں۔' : 'Select "Add to Home Screen" or "Install App".'}</li>
              <li>{isUrdu ? 'اب یہ آپ کے موبائل مینو میں ایک ایپ کی طرح ظاہر ہوگی۔' : 'The app will now appear on your home screen.'}</li>
            </ol>
          </div>

          {/* iOS Section */}
          <div className={`p-6 bg-amber-50 dark:bg-amber-900/10 rounded-3xl border border-amber-100 dark:border-amber-900/30 ${isUrdu ? 'text-right' : 'text-left'}`}>
            <h3 className={`text-xl font-black text-amber-800 dark:text-amber-200 mb-4 flex items-center gap-3 ${isUrdu ? 'flex-row-reverse' : ''}`}>
              <span className="text-2xl">🍎</span>
              <span>iPhone (Safari)</span>
            </h3>
            <ol className={`space-y-3 text-amber-900/80 dark:text-amber-100/80 list-decimal list-inside ${isUrdu ? 'urdu pr-4' : 'pl-4'}`}>
              <li>{isUrdu ? 'سفاری براؤزر میں نیچے موجود "Share" (تیر والا نشان) پر کلک کریں۔' : 'Tap the "Share" icon (square with arrow) at the bottom of Safari.'}</li>
              <li>{isUrdu ? 'نیچے اسکرول کریں اور "Add to Home Screen" پر کلک کریں۔' : 'Scroll down and tap "Add to Home Screen".'}</li>
              <li>{isUrdu ? 'اوپر دائیں جانب "Add" پر کلک کریں۔' : 'Tap "Add" in the top-right corner.'}</li>
            </ol>
          </div>
        </div>

        <button 
          onClick={onClose}
          className={`w-full mt-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold transition-all shadow-lg ${isUrdu ? 'urdu text-xl' : 'text-lg'}`}
        >
          {isUrdu ? 'ٹھیک ہے، سمجھ گیا' : 'Got it!'}
        </button>
      </div>
    </div>
  );
};

export default MobileGuide;
