
import React, { useState, useEffect } from 'react';
import { getAllInquiries, getAllHistory, getAllCache, signOut } from '../services/supabaseService';

interface AdminPanelProps {
  onClose: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'inquiries' | 'history' | 'cache'>('inquiries');
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      let result;
      if (activeTab === 'inquiries') result = await getAllInquiries();
      else if (activeTab === 'history') result = await getAllHistory();
      else result = await getAllCache();
      setData(result);
    } catch (err: any) {
      setError(err.message || 'ڈیٹا حاصل کرنے میں غلطی پیش آئی۔');
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
    fetchData();
  }, [activeTab]);

  return (
    <div className="fixed inset-0 z-[200] bg-emerald-950/90 backdrop-blur-xl flex flex-col p-4 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-4">
          <button 
            onClick={onClose}
            className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all border border-white/5"
            title="بند کریں"
          >
            ✕
          </button>
          
          <button 
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500/20 hover:bg-red-500/40 border border-red-500/30 text-red-200 rounded-xl urdu text-sm font-bold transition-all flex items-center gap-2"
          >
            <span>لاگ آؤٹ</span>
            <span>🚪</span>
          </button>
        </div>

        <h1 className="urdu text-2xl md:text-3xl font-black text-white flex items-center gap-3">
          انتظامی ڈیش بورڈ ⚙️
        </h1>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto w-full mb-6">
        <div className="flex gap-2 p-1 bg-emerald-900/40 rounded-2xl border border-emerald-800/50">
          <button 
            onClick={() => setActiveTab('inquiries')}
            className={`flex-1 py-3 urdu font-bold rounded-xl transition-all ${activeTab === 'inquiries' ? 'bg-emerald-600 text-white shadow-lg' : 'text-emerald-300 hover:bg-emerald-800/40'}`}
          >
            پیغامات (Inquiries)
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-3 urdu font-bold rounded-xl transition-all ${activeTab === 'history' ? 'bg-emerald-600 text-white shadow-lg' : 'text-emerald-300 hover:bg-emerald-800/40'}`}
          >
            سرچ ہسٹری (History)
          </button>
          <button 
            onClick={() => setActiveTab('cache')}
            className={`flex-1 py-3 urdu font-bold rounded-xl transition-all ${activeTab === 'cache' ? 'bg-emerald-600 text-white shadow-lg' : 'text-emerald-300 hover:bg-emerald-800/40'}`}
          >
            کیش ریسرچ (Cache)
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto w-full flex-1 bg-white/5 border border-emerald-800/50 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center text-emerald-400">
            <div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mb-4"></div>
            <span className="urdu text-xl">لوڈنگ ہو رہی ہے...</span>
          </div>
        ) : error ? (
          <div className="flex-1 flex flex-col items-center justify-center text-red-400 p-8 text-center">
            <div className="text-4xl mb-4">⚠️</div>
            <p className="urdu text-xl">{error}</p>
          </div>
        ) : (
          <div className="overflow-auto flex-1 p-4 md:p-6">
            <table className="w-full text-right urdu border-collapse">
              <thead>
                <tr className="border-b border-emerald-800 text-emerald-400">
                  <th className="p-4">آئی ڈی</th>
                  {activeTab === 'inquiries' && <>
                    <th className="p-4">نام</th>
                    <th className="p-4">ای میل</th>
                    <th className="p-4">پیغام</th>
                  </>}
                  {activeTab === 'history' && <>
                    <th className="p-4">لفظ</th>
                    <th className="p-4">صارف آئی ڈی</th>
                  </>}
                  {activeTab === 'cache' && <>
                    <th className="p-4">لفظ</th>
                    <th className="p-4">دائرہ</th>
                  </>}
                  <th className="p-4">تاریخ</th>
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
                      {new Date(item.created_at).toLocaleString('ur-PK')}
                    </td>
                  </tr>
                ))}
                {data.length === 0 && (
                  <tr>
                    <td colSpan={10} className="p-12 text-center text-emerald-700 urdu text-2xl italic">کوئی ڈیٹا موجود نہیں ہے۔</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <footer className="mt-6 text-center text-emerald-700 text-xs font-bold uppercase tracking-widest urdu">
        البصیرہ - انتظامی کنٹرول پینل v1.0
      </footer>
    </div>
  );
};

export default AdminPanel;
