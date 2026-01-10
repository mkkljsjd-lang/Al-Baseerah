
import React, { useState } from 'react';
import { submitInquiry } from '../services/supabaseService';

interface InquiryFormProps {
  language: 'ur' | 'en';
}

const InquiryForm: React.FC<InquiryFormProps> = ({ language }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isUrdu = language === 'ur';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await submitInquiry(name, email, message);
      setSuccess(true);
      setName('');
      setEmail('');
      setMessage('');
    } catch (err: any) {
      setError(isUrdu 
        ? 'پیغام بھیجنے میں غلطی پیش آئی۔ براہ کرم دوبارہ کوشش کریں۔' 
        : 'Error sending message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-20 mb-20 px-4">
      <div className="bg-white dark:bg-emerald-900/30 rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-emerald-50 dark:border-emerald-800 transition-all">
        <div className="text-center mb-10">
          <div className="text-4xl mb-4">✍️</div>
          <h2 className={`text-3xl md:text-4xl font-bold text-emerald-900 dark:text-emerald-100 ${isUrdu ? 'urdu' : ''}`}>
            {isUrdu ? 'رابطہ اور تجاویز' : 'Contact & Suggestions'}
          </h2>
          <p className={`text-emerald-700/60 dark:text-emerald-400/60 mt-3 text-lg ${isUrdu ? 'urdu' : ''}`}>
            {isUrdu 
              ? 'آپ کے سوالات اور علمی مشورے ہمارے لیے باعثِ مسرت ہوں گے۔' 
              : 'Your questions and scholarly advice are always welcome.'}
          </p>
        </div>

        {success ? (
          <div className="p-8 bg-emerald-50 dark:bg-emerald-800/20 border-2 border-emerald-200 dark:border-emerald-700 rounded-3xl text-center animate-in zoom-in-95 duration-300">
            <div className="text-5xl mb-4">✅</div>
            <h3 className={`text-2xl font-bold text-emerald-800 dark:text-emerald-200 mb-2 ${isUrdu ? 'urdu' : ''}`}>
              {isUrdu ? 'آپ کا پیغام موصول ہو گیا ہے!' : 'Message Received Successfully!'}
            </h3>
            <p className={`text-emerald-700/60 dark:text-emerald-400/60 ${isUrdu ? 'urdu' : ''}`}>
              {isUrdu ? 'ہم جلد ہی آپ سے رابطہ کریں گے۔ ان شاء اللہ' : 'We will contact you soon. InshaAllah.'}
            </p>
            <button 
              onClick={() => setSuccess(false)}
              className={`mt-6 px-8 py-2 bg-emerald-600 text-white rounded-full font-bold hover:bg-emerald-500 transition-all ${isUrdu ? 'urdu' : ''}`}
            >
              {isUrdu ? 'ایک اور پیغام بھیجیں' : 'Send Another Message'}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className={`block text-emerald-800 dark:text-emerald-200 font-bold px-2 ${isUrdu ? 'urdu text-right' : 'text-left text-sm'}`}>
                  {isUrdu ? 'نام' : 'Name'}
                </label>
                <input 
                  type="text" 
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full px-6 py-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/50 border border-emerald-100 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all ${isUrdu ? 'urdu text-right' : 'text-left'}`}
                  placeholder={isUrdu ? 'آپ کا نام' : 'Your full name'}
                />
              </div>
              <div className="space-y-2">
                <label className={`block text-emerald-800 dark:text-emerald-200 font-bold px-2 ${isUrdu ? 'urdu text-right' : 'text-left text-sm'}`}>
                  {isUrdu ? 'ای میل' : 'Email'}
                </label>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full px-6 py-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/50 border border-emerald-100 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all ${isUrdu ? 'text-right' : 'text-left'}`}
                  placeholder="example@mail.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className={`block text-emerald-800 dark:text-emerald-200 font-bold px-2 ${isUrdu ? 'urdu text-right' : 'text-left text-sm'}`}>
                {isUrdu ? 'پیغام' : 'Message'}
              </label>
              <textarea 
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className={`w-full px-6 py-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/50 border border-emerald-100 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all resize-none ${isUrdu ? 'urdu text-right' : 'text-left'}`}
                placeholder={isUrdu ? 'آپ کی تجویز یا سوال یہاں لکھیں...' : 'Write your suggestion or question here...'}
              ></textarea>
            </div>

            {error && (
              <p className={`text-red-500 text-center font-bold ${isUrdu ? 'urdu' : 'text-sm'}`}>{error}</p>
            )}

            <div className="text-center">
              <button 
                type="submit"
                disabled={loading}
                className={`inline-flex items-center gap-3 px-12 py-4 bg-emerald-700 hover:bg-emerald-600 text-white rounded-2xl font-bold transition-all shadow-lg active:scale-95 disabled:opacity-70 ${isUrdu ? 'urdu text-xl' : 'text-lg'}`}
              >
                {loading ? (
                  <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>{isUrdu ? 'پیغام بھیجیں' : 'Send Message'}</span>
                    <span className="text-2xl">✉️</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default InquiryForm;
