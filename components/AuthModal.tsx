
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
          className={`absolute top-6 ${isUrdu ? 'left-6' : 'right-6'} text-emerald-900/30 dark:text-emerald-100/30 hover:text-emerald-600 transition-colors`}
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
          <p className={`text-emerald-700/60 dark:text-emerald-400/60 mt-2 ${isUrdu ? 'urdu' : 'text-sm'}`}>
            {isLogin 
              ? (isUrdu ? 'اپنی علمی تحقیق جاری رکھنے کے لیے داخل ہوں' : 'Sign in to continue your linguistic research') 
              : (isUrdu ? 'اپنے علمی سفر کا آغاز کریں' : 'Start your scholarly journey')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className={`block text-emerald-800 dark:text-emerald-200 font-bold px-2 ${isUrdu ? 'urdu text-right' : 'text-left text-sm'}`}>
              {isUrdu ? 'ای میل' : 'Email Address'}
            </label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-6 py-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-100 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all ${isUrdu ? 'text-right' : 'text-left'}`}
              placeholder="example@mail.com"
            />
          </div>

          <div className="space-y-2">
            <label className={`block text-emerald-800 dark:text-emerald-200 font-bold px-2 ${isUrdu ? 'urdu text-right' : 'text-left text-sm'}`}>
              {isUrdu ? 'پاس ورڈ' : 'Password'}
            </label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-6 py-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-100 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all ${isUrdu ? 'text-right' : 'text-left'}`}
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className={`p-4 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 text-sm rounded-xl text-center ${isUrdu ? 'urdu' : ''}`}>
              {error}
            </div>
          )}

          <button 
            type="submit"
            disabled={loading}
            className={`w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold transition-all shadow-lg flex items-center justify-center gap-3 ${isUrdu ? 'urdu text-xl' : 'text-lg'}`}
          >
            {loading ? (
               <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              isLogin 
                ? (isUrdu ? 'داخل ہوں' : 'Login') 
                : (isUrdu ? 'سائن اپ' : 'Sign Up')
            )}
          </button>
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
