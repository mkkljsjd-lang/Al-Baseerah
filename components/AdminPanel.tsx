
import React, { useState, useEffect } from 'react';
import { getAllInquiries, getAllHistory, getAllCache, signOut } from '../services/supabaseService';

interface AdminPanelProps {
  onClose: () => void;
  language: 'ur' | 'en';
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onClose, language }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminUser, setAdminUser] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'inquiries' | 'history' | 'cache'>('inquiries');
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isUrdu = language === 'ur';

  // Admin Credentials
  const ADMIN_CREDENTIALS = {
    user: 'admin',
    pass: 'admin786'
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminUser === ADMIN_CREDENTIALS.user && adminPass === ADMIN_CREDENTIALS.pass) {
      setIsAuthenticated(true);
      setLoginError(null);
    } else {
      setLoginError(isUrdu ? 'غلط یوزر نیم یا پاس ورڈ!' : 'Invalid username or password!');
    }
  };

  const fetchData = async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    setError(null);
    try {
      let result;
      if (activeTab === 'inquiries') result = await getAllInquiries();
      else if (activeTab === 'history') result = await getAllHistory();
      else result = await getAllCache();
      setData(result);
    } catch (err: any) {
      setError(err.message || (isUrdu ? 'ڈیٹا حاصل کرنے میں غلطی پیش آئی۔' : 'Error fetching data.'));
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      onClose();
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [activeTab, isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-[300] bg-[#044434]/95 backdrop-blur-2xl flex items-center justify-center p-4">
        <div className="bg-white dark:bg-emerald-900 w-full max-w-md rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative animate-in zoom-in-95 duration-300 border border-emerald-500/20">
          <button 
            onClick={onClose}
            className={`absolute top-6 ${isUrdu ? 'left-6' : 'right-6'} text-emerald-900/30 dark:text-emerald-100/30 hover:text-emerald-600 transition-colors`}
          >
            ✕
          </button>

          <div className="text-center mb-8">
            <div className="text-5xl mb-4">🛡️</div>
            <h2 className={`text-3xl font-bold text-emerald-900 dark:text-emerald-100 ${isUrdu ? 'urdu' : ''}`}>
              {isUrdu ? 'انتظامی رسائی' : 'Admin Access'}
            </h2>
            <p className={`text-emerald-700/60 dark:text-emerald-400/60 mt-2 ${isUrdu ? 'urdu' : 'text-sm'}`}>
              {isUrdu ? 'آگے بڑھنے کے لیے ایڈمن اسناد درج کریں۔' : 'Enter admin credentials to proceed.'}
            </p>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-6">
            <div className="space-y-2">
              <label className={`block text-emerald-800 dark:text-emerald-200 font-bold px-2 ${isUrdu ? 'urdu text-right' : 'text-left text-sm'}`}>
                {isUrdu ? 'یوزر نیم' : 'Username'}
              </label>
              <input 
                type="text" 
                required
                value={adminUser}
                onChange={(e) => setAdminUser(e.target.value)}
                className={`w-full px-6 py-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-100 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all ${isUrdu ? 'text-right' : 'text-left'}`}
                placeholder={isUrdu ? 'یوزر نیم لکھیں' : 'Enter username'}
              />
            </div>

            <div className="space-y-2">
              <label className={`block text-emerald-800 dark:text-emerald-200 font-bold px-2 ${isUrdu ? 'urdu text-right' : 'text-left text-sm'}`}>
                {isUrdu ? 'پاس ورڈ' : 'Password'}
              </label>
              <input 
                type="password" 
                required
                value={adminPass}
                onChange={(e) => setAdminPass(e.target.value)}
                className={`w-full px-6 py-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-100 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all ${isUrdu ? 'text-right' : 'text-left'}`}
                placeholder="••••••••"
              />
            </div>

            {loginError && (
              <div className={`p-4 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 text-sm rounded-xl text-center font-bold ${isUrdu ? 'urdu' : ''}`}>
                {loginError}
              </div>
            )}

            <button 
              type="submit"
              className={`w-full py-4 bg-amber-500 hover:bg-amber-400 text-[#044434] rounded-2xl font-black transition-all shadow-lg flex items-center justify-center gap-3 active:scale-95 ${isUrdu ? 'urdu text-xl' : 'text-lg'}`}
            >
              {isUrdu ? 'داخل ہوں' : 'Login to Dashboard'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[200] bg-emerald-950/90 backdrop-blur-xl flex flex-col p-4 md:p-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className={`flex items-center justify-between mb-8 max-w-7xl mx-auto w-full ${isUrdu ? 'flex-row' : 'flex-row-reverse'}`}>
        <div className="flex items-center gap-4">
          <button 
            onClick={onClose}
            className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all border border-white/5"
            title={isUrdu ? "بند کریں" : "Close"}
          >
            ✕
          </button>
          
          <button 
            onClick={handleLogout}
            className={`px-4 py-2 bg-red-500/20 hover:bg-red-500/40 border border-red-500/30 text-red-200 rounded-xl font-bold transition-all flex items-center gap-2 ${isUrdu ? 'urdu text-sm' : 'text-xs'}`}
          >
            <span>{isUrdu ? 'لاگ آؤٹ' : 'Logout'}</span>
            <span>🚪</span>
          </button>
        </div>

        <h1 className={`text-2xl md:text-3xl font-black text-white flex items-center gap-3 ${isUrdu ? 'urdu' : ''}`}>
          {isUrdu ? 'انتظامی ڈیش بورڈ' : 'Admin Dashboard'} ⚙️
        </h1>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto w-full mb-6">
        <div className="flex gap-2 p-1 bg-emerald-900/40 rounded-2xl border border-emerald-800/50">
          <button 
            onClick={() => setActiveTab('inquiries')}
            className={`flex-1 py-3 font-bold rounded-xl transition-all ${activeTab === 'inquiries' ? 'bg-emerald-600 text-white shadow-lg' : 'text-emerald-300 hover:bg-emerald-800/40'} ${isUrdu ? 'urdu' : 'text-sm'}`}
          >
            {isUrdu ? 'پیغامات (Inquiries)' : 'Inquiries'}
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-3 font-bold rounded-xl transition-all ${activeTab === 'history' ? 'bg-emerald-600 text-white shadow-lg' : 'text-emerald-300 hover:bg-emerald-800/40'} ${isUrdu ? 'urdu' : 'text-sm'}`}
          >
            {isUrdu ? 'سرچ ہسٹری (History)' : 'History'}
          </button>
          <button 
            onClick={() => setActiveTab('cache')}
            className={`flex-1 py-3 font-bold rounded-xl transition-all ${activeTab === 'cache' ? 'bg-emerald-600 text-white shadow-lg' : 'text-emerald-300 hover:bg-emerald-800/40'} ${isUrdu ? 'urdu' : 'text-sm'}`}
          >
            {isUrdu ? 'کیش ریسرچ (Cache)' : 'Cache'}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto w-full flex-1 bg-white/5 border border-emerald-800/50 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center text-emerald-400">
            <div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mb-4"></div>
            <span className={isUrdu ? 'urdu text-xl' : ''}>{isUrdu ? 'لوڈنگ ہو رہی ہے...' : 'Loading Data...'}</span>
          </div>
        ) : error ? (
          <div className="flex-1 flex flex-col items-center justify-center text-red-400 p-8 text-center">
            <div className="text-4xl mb-4">⚠️</div>
            <p className={isUrdu ? 'urdu text-xl' : ''}>{error}</p>
          </div>
        ) : (
          <div className="overflow-auto flex-1 p-4 md:p-6">
            <table className={`w-full text-right border-collapse ${isUrdu ? 'urdu' : 'text-sm'}`} dir={isUrdu ? 'rtl' : 'ltr'}>
              <thead>
                <tr className="border-b border-emerald-800 text-emerald-400">
                  <th className="p-4">{isUrdu ? 'آئی ڈی' : 'ID'}</th>
                  {activeTab === 'inquiries' && <>
                    <th className="p-4">{isUrdu ? 'نام' : 'Name'}</th>
                    <th className="p-4">{isUrdu ? 'ای میل' : 'Email'}</th>
                    <th className="p-4">{isUrdu ? 'پیغام' : 'Message'}</th>
                  </>}
                  {activeTab === 'history' && <>
                    <th className="p-4">{isUrdu ? 'لفظ' : 'Word'}</th>
                    <th className="p-4">{isUrdu ? 'صارف آئی ڈی' : 'User ID'}</th>
                  </>}
                  {activeTab === 'cache' && <>
                    <th className="p-4">{isUrdu ? 'لفظ' : 'Word'}</th>
                    <th className="p-4">{isUrdu ? 'دائرہ' : 'Scope'}</th>
                  </>}
                  <th className="p-4">{isUrdu ? 'تاریخ' : 'Date'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-800/30 text-emerald-100">
                {data.map((item) => (
                  <tr key={item.id} className="hover:bg-emerald-800/20 transition-colors">
                    <td className="p-4 font-mono text-xs opacity-40">{item.id}</td>
                    {activeTab === 'inquiries' && <>
                      <td className="p-4 font-bold">{item.name}</td>
                      <td className="p-4 text-emerald-400/80">{item.email}</td>
                      <td className="p-4 max-w-xs">{item.message}</td>
                    </>}
                    {activeTab === 'history' && <>
                      <td className="p-4 arabic text-2xl">{item.word}</td>
                      <td className="p-4 font-mono text-[10px] opacity-40">{item.user_id || 'Public'}</td>
                    </>}
                    {activeTab === 'cache' && <>
                      <td className="p-4 arabic text-2xl">{item.word}</td>
                      <td className="p-4 text-xs font-black uppercase tracking-tighter text-emerald-500">{item.scope}</td>
                    </>}
                    <td className="p-4 text-xs opacity-60">
                      {new Date(item.created_at).toLocaleString(isUrdu ? 'ur-PK' : 'en-US')}
                    </td>
                  </tr>
                ))}
                {data.length === 0 && (
                  <tr>
                    <td colSpan={10} className={`p-12 text-center text-emerald-700 text-2xl italic ${isUrdu ? 'urdu' : ''}`}>
                      {isUrdu ? 'کوئی ڈیٹا موجود نہیں ہے۔' : 'No data available.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <footer className={`mt-6 text-center text-emerald-700 text-xs font-bold uppercase tracking-widest ${isUrdu ? 'urdu' : ''}`}>
        {isUrdu ? 'البصیرہ - انتظامی کنٹرول پینل v1.0' : 'Al-Baseerah Admin Control Panel v1.1'}
      </footer>
    </div>
  );
};

export default AdminPanel;
