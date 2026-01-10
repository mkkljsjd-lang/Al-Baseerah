
import React, { useState } from 'react';
import { signIn, signUp } from '../services/supabaseService';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  language: 'ur' | 'en';
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess, language }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const isUrdu = language === 'ur';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error: authError } = isLogin 
        ? await signIn(email, password)
        : await signUp(email, password);

      if (authError) throw authError;
      
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || (isUrdu ? 'خرابی پیش آگئی' : 'An error occurred'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-emerald-950/80 backdrop-blur-md">
      <div className="bg-white dark:bg-emerald-900 w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl relative animate-in zoom-in-95 duration-300">
        <button 
          onClick={onClose}
          className={`absolute top-6 ${isUrdu ? 'left-6' : 'right-6'} text-emerald-900/30 dark:text-emerald-100/30 hover:text-emerald-600 transition-colors z-10`}
        >
          ✕
        </button>

        <div className="text-center mb-8">
          <div className="text-4xl mb-4">🔑</div>
          <h2 className={`text-3xl font-bold text-emerald-900 dark:text-emerald-100 ${isUrdu ? 'urdu' : ''}`}>
            {isLogin 
              ? (isUrdu ? 'لاگ ان کریں' : 'Login') 
              : (isUrdu ? 'اکاؤنٹ بنائیں' : 'Create Account')}
          </h2>
          <div className="mt-3 space-y-1">
            <p className={`text-emerald-700/60 dark:text-emerald-400/60 ${isUrdu ? 'urdu' : 'text-sm'}`}>
              {isUrdu 
                ? 'آپ اپنا کوئی بھی عام ای میل استعمال کر سکتے ہیں۔' 
                : 'You can use any personal email to register.'}
            </p>
          </div>
          
          {/* Sync Info Note */}
          <div className={`mt-4 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center gap-2 justify-center ${isUrdu ? 'flex-row-reverse' : ''}`}>
            <span className="text-lg">🔄</span>
            <p className={`text-[10px] md:text-xs font-bold text-amber-700 dark:text-amber-400 ${isUrdu ? 'urdu' : ''}`}>
              {isUrdu 
                ? 'لاگ ان کرنے سے آپ کی ریسرچ تمام ڈیوائسز پر محفوظ رہے گی۔' 
                : 'Logging in keeps your research synced across all devices.'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className={`block text-emerald-800 dark:text-emerald-200 font-bold px-2 ${isUrdu ? 'urdu text-right' : 'text-left text-xs'}`}>
              {isUrdu ? 'ای میل' : 'Email Address'}
            </label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-5 py-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-100 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all ${isUrdu ? 'text-right' : 'text-left'}`}
              placeholder="example@mail.com"
            />
          </div>

          <div className="space-y-1.5">
            <label className={`block text-emerald-800 dark:text-emerald-200 font-bold px-2 ${isUrdu ? 'urdu text-right' : 'text-left text-xs'}`}>
              {isUrdu ? 'پاس ورڈ' : 'Password'}
            </label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-5 py-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-100 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all ${isUrdu ? 'text-right' : 'text-left'}`}
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className={`p-3 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 text-xs rounded-xl text-center ${isUrdu ? 'urdu' : ''}`}>
              {error}
            </div>
          )}

          <div className="pt-2 space-y-3">
            <button 
              type="submit"
              disabled={loading}
              className={`w-full py-4 bg-emerald-700 hover:bg-emerald-600 text-white rounded-2xl font-bold transition-all shadow-lg flex items-center justify-center gap-3 ${isUrdu ? 'urdu text-xl' : 'text-lg'}`}
            >
              {loading ? (
                 <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                isLogin 
                  ? (isUrdu ? 'داخل ہوں' : 'Login') 
                  : (isUrdu ? 'سائن اپ' : 'Sign Up')
              )}
            </button>

            {/* Prominent Guest Option */}
            <div className="relative py-2 flex items-center justify-center">
               <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-emerald-100 dark:border-emerald-800"></div></div>
               <span className={`relative px-3 bg-white dark:bg-emerald-900 text-[10px] text-emerald-400 font-bold uppercase ${isUrdu ? 'urdu' : ''}`}>
                 {isUrdu ? 'یا' : 'OR'}
               </span>
            </div>

            <button 
              type="button"
              onClick={onClose}
              className={`w-full py-4 bg-emerald-50 dark:bg-emerald-800/20 text-emerald-700 dark:text-emerald-300 rounded-2xl font-bold hover:bg-emerald-100 dark:hover:bg-emerald-800 transition-all border-2 border-dashed border-emerald-200 dark:border-emerald-700 ${isUrdu ? 'urdu text-lg' : 'text-base'}`}
            >
              {isUrdu ? 'بغیر اکاؤنٹ کے استعمال کریں (مہمان)' : 'Continue as Guest (No Login)'}
            </button>
          </div>
        </form>

        <div className="mt-8 text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className={`text-emerald-700 dark:text-emerald-400 font-bold hover:underline ${isUrdu ? 'urdu' : 'text-sm'}`}
          >
            {isLogin 
              ? (isUrdu ? 'نیا اکاؤنٹ بنانا چاہتے ہیں؟' : 'Need a new account? Create one') 
              : (isUrdu ? 'پہلے سے اکاؤنٹ موجود ہے؟ لاگ ان کریں' : 'Already have an account? Login')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
