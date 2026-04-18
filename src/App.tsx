import React, { useState, useEffect, useCallback } from 'react';
import { 
  User as UserIcon, 
  LogOut, 
  Upload, 
  Search, 
  Table as TableIcon, 
  Database,
  Calendar as CalendarIcon,
  DollarSign,
  Shield,
  UserPlus,
  ArrowRight,
  ClipboardList,
  AlertCircle,
  CheckCircle2,
  Coffee,
  Sun,
  Moon,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Plus,
  Edit2,
  Trash2,
  LayoutDashboard,
  Users,
  Settings as SettingsIcon,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { User, MealRecord } from './types';

// Simple Router Hook
const useHashRouter = () => {
  const [hash, setHash] = useState(window.location.hash || '#login');

  useEffect(() => {
    const handleHashChange = () => setHash(window.location.hash);
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (newHash: string) => {
    window.location.hash = newHash;
  };

  const currentPath = hash.split('?')[0];
  const queryParams = new URLSearchParams(hash.includes('?') ? hash.split('?')[1] : '');
  const currentTab = queryParams.get('tab') || '';

  return { hash, currentPath, currentTab, navigate };
};

export default function App() {
  const { hash, currentPath, currentTab, navigate } = useHashRouter();
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('#login');
  };

  // Auth Guard
  useEffect(() => {
    if (!user && currentPath !== '#login' && currentPath !== '#register') {
      navigate('#login');
    } else if (user && (currentPath === '#login' || currentPath === '#register')) {
      navigate('#dashboard');
    }
  }, [user, currentPath, navigate]);

  return (
    <div className="min-h-screen bg-[#faf8f4] text-[#1a1109] font-sans flex overflow-hidden">
      <AnimatePresence mode="wait">
        {!user ? (
          <div key="auth" className="flex items-center justify-center w-full min-h-screen p-4">
            {currentPath === '#register' ? (
              <RegisterPage onToggle={() => navigate('#login')} />
            ) : (
              <LoginPage onLogin={(u) => { setUser(u); localStorage.setItem('user', JSON.stringify(u)); }} onToggle={() => navigate('#register')} />
            )}
          </div>
        ) : (
          <div key="main" className="flex w-full min-h-screen">
            {/* Sidebar from Screenshot */}
            <aside className="w-[280px] bg-[#1a1109] text-white flex flex-col shadow-2xl z-20 overflow-hidden shrink-0">
              {/* Sidebar Header */}
              <div className="p-6 flex items-center space-x-3 bg-[#1a1109]">
                <div className="w-10 h-10 bg-[#e4a853] rounded-xl flex items-center justify-center shadow-lg">
                  <Database size={20} className="text-[#1a1109]" />
                </div>
                <div>
                  <div className="font-bold text-lg leading-tight tracking-tight text-white">訂餐查詢系統</div>
                  <div className="text-[10px] text-white/50 uppercase tracking-[1px]">管理員</div>
                </div>
              </div>
              
              <nav className="flex flex-col mt-4 px-4 gap-1 flex-1">
                <button 
                  onClick={() => navigate('#dashboard')}
                  className={`flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all ${currentPath === '#dashboard' ? 'bg-[#3d2c1c] text-[#e4a853] shadow-inner' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}
                >
                  <CalendarIcon size={18} />
                  <span className="font-medium">我的訂餐</span>
                </button>

                {user.role === 'admin' && (
                  <>
                    <button 
                      onClick={() => navigate('#admin?tab=accounts')}
                      className={`flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all ${currentPath === '#admin' && currentTab === 'accounts' ? 'bg-[#3d2c1c] text-[#e4a853]' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}
                    >
                      <Users size={18} />
                      <span className="font-medium">帳號管理</span>
                      {currentTab === 'accounts' && <ChevronRight size={14} className="ml-auto opacity-50" />}
                    </button>
                    <button 
                      onClick={() => navigate('#admin?tab=upload')}
                      className={`flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all ${currentPath === '#admin' && currentTab === 'upload' ? 'bg-[#3d2c1c] text-[#e4a853]' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}
                    >
                      <Upload size={18} />
                      <span className="font-medium">上傳訂餐表</span>
                      {currentTab === 'upload' && <ChevronRight size={14} className="ml-auto opacity-50" />}
                    </button>
                    <button 
                      onClick={() => navigate('#admin?tab=summary')}
                      className={`flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all ${currentPath === '#admin' && currentTab === 'summary' ? 'bg-[#3d2c1c] text-[#e4a853]' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}
                    >
                      <LayoutDashboard size={18} />
                      <span className="font-medium">訂餐總覽</span>
                      {currentTab === 'summary' && <ChevronRight size={14} className="ml-auto opacity-50" />}
                    </button>
                    <button 
                      onClick={() => navigate('#admin?tab=settings')}
                      className={`flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all ${currentPath === '#admin' && currentTab === 'settings' ? 'bg-[#3d2c1c] text-[#e4a853]' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}
                    >
                      <SettingsIcon size={18} />
                      <span className="font-medium">價格設定</span>
                      {currentTab === 'settings' && <ChevronRight size={14} className="ml-auto opacity-50" />}
                    </button>
                  </>
                )}
              </nav>

              {/* Sidebar Bottom Profile */}
              <div className="p-4 mt-auto">
                <div className="bg-[#150d06] rounded-2xl p-4 space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-[#e4a853]/10 border border-[#e4a853]/20 rounded-xl flex items-center justify-center">
                      <UserIcon size={20} className="text-[#e4a853]" />
                    </div>
                    <div>
                      <div className="font-bold text-sm tracking-tight text-white">{user.name}</div>
                      <div className="text-[10px] text-white/40">社員編號：{user.staffId}</div>
                    </div>
                  </div>
                  <button 
                    onClick={logout}
                    className="flex items-center space-x-2 text-white/40 hover:text-white text-xs font-medium w-full pt-4 border-t border-white/5 transition-colors"
                  >
                    <LogOut size={14} />
                    <span>登出</span>
                  </button>
                </div>
              </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden bg-[#faf8f4]">
              <div className="flex-1 overflow-y-auto px-10 py-8">
                <AnimatePresence mode="wait">
                  {currentPath === '#admin' && user.role === 'admin' ? (
                    <motion.div
                      key={currentTab}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <AdminPanel tab={currentTab} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="dashboard"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Dashboard user={user} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </main>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- AUTH COMPONENTS ---

function LoginPage({ onLogin, onToggle }: { onLogin: (u: User) => void, onToggle: () => void }) {
  const [staffId, setStaffId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ staffId, password })
      });
      const data = await res.json();
      if (res.ok) onLogin(data.user);
      else setError(data.error);
    } catch (err) {
      setError('連線伺服器失敗');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-natural-card w-full max-w-md p-10 rounded-[32px] shadow-2xl border border-natural-border/30"
    >
      <div className="text-center mb-10">
        <div className="w-16 h-16 bg-natural-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl rotate-6">
          <UserIcon className="text-white w-8 h-8" />
        </div>
        <h2 className="text-3xl font-serif font-bold text-natural-text-main italic -tracking-wide">系統登入</h2>
        <p className="text-natural-text-dim mt-2">輸入您的資料以繼續管理餐飲</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-[2px] text-natural-text-dim mb-2 px-1">職員編號</label>
          <input 
            type="text" 
            value={staffId}
            onChange={(e) => setStaffId(e.target.value)}
            className="w-full bg-natural-bg border border-natural-border/50 rounded-2xl p-4 focus:ring-2 focus:ring-natural-primary transition-all outline-none font-medium"
            placeholder="例如: admin 或 001"
            required
          />
        </div>
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-[2px] text-natural-text-dim mb-2 px-1">密碼</label>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-natural-bg border border-natural-border/50 rounded-2xl p-4 focus:ring-2 focus:ring-natural-primary transition-all outline-none font-medium"
            placeholder="••••••••"
            required
          />
        </div>

        {error && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center space-x-2 text-red-700 text-sm bg-red-50 p-4 rounded-2xl border border-red-100">
            <AlertCircle size={16} />
            <span>{error}</span>
          </motion.div>
        )}

        <button 
          type="submit"
          disabled={loading}
          className="w-full bg-natural-primary text-white p-5 rounded-full font-bold hover:shadow-lg hover:bg-natural-accent transition-all flex items-center justify-center space-x-2 active:scale-[0.98] disabled:opacity-50"
        >
          {loading ? <span>登入中...</span> : (
            <>
              <span>立即登入</span>
              <ArrowRight size={20} />
            </>
          )}
        </button>
      </form>

      <div className="mt-8 pt-8 border-t border-black/5 text-center">
        <button onClick={onToggle} className="text-[#141414]/40 hover:text-[#141414] text-sm font-medium transition-colors underline underline-offset-4">
          尚未擁有帳號? 立即註冊
        </button>
      </div>
    </motion.div>
  );
}

function RegisterPage({ onToggle }: { onToggle: () => void }) {
  const [staffId, setStaffId] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ staffId, name, password })
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
        setTimeout(onToggle, 2000);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('註冊失敗');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-natural-card p-12 rounded-[40px] shadow-2xl border border-natural-border/30 text-center max-w-md w-full">
        <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-green-100">
          <CheckCircle2 className="text-white w-10 h-10" />
        </div>
        <h2 className="text-2xl font-serif font-bold italic text-natural-text-main">註冊成功!</h2>
        <p className="text-natural-text-dim mt-2">正在導向登入頁面...</p>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-natural-card w-full max-w-md p-10 rounded-[40px] shadow-2xl border border-natural-border/30"
    >
      <div className="text-center mb-10">
        <div className="w-16 h-16 bg-natural-accent rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl -rotate-6">
          <UserPlus className="text-white w-8 h-8" />
        </div>
        <h2 className="text-3xl font-serif font-bold italic text-natural-text-main -tracking-wide">同仁註冊</h2>
        <p className="text-natural-text-dim mt-2">建立您的職員帳號以查詢紀錄</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-[2px] text-natural-text-dim mb-2 px-1">職員編號</label>
          <input 
            type="text" 
            value={staffId}
            onChange={(e) => setStaffId(e.target.value)}
            className="w-full bg-natural-bg border border-natural-border/50 rounded-2xl p-4 focus:ring-2 focus:ring-natural-accent transition-all outline-none font-medium text-sm"
            placeholder="例如: S12345"
            required
          />
        </div>
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-[2px] text-natural-text-dim mb-2 px-1">姓名</label>
          <input 
            type="text" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-natural-bg border border-natural-border/50 rounded-2xl p-4 focus:ring-2 focus:ring-natural-accent transition-all outline-none font-medium text-sm"
            placeholder="您的真實姓名"
            required
          />
        </div>
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-[2px] text-natural-text-dim mb-2 px-1">自訂密碼</label>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-natural-bg border border-natural-border/50 rounded-2xl p-4 focus:ring-2 focus:ring-natural-accent transition-all outline-none font-medium text-sm"
            placeholder="請務必牢記此密碼"
            required
          />
        </div>

        {error && (
          <div className="flex items-center space-x-2 text-red-700 text-sm bg-red-50 p-4 rounded-xl border border-red-100">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <button 
          type="submit"
          disabled={loading}
          className="w-full bg-natural-primary text-white p-5 rounded-full font-bold hover:bg-natural-accent transition-all flex items-center justify-center space-x-2 shadow-lg active:scale-[0.98] disabled:opacity-50 mt-4"
        >
          {loading ? <span>處理中...</span> : <><span>建立帳號</span> <ArrowRight size={20} /></>}
        </button>
      </form>

      <div className="mt-8 pt-8 border-t border-natural-border/30 text-center">
        <button onClick={onToggle} className="text-natural-text-dim hover:text-natural-primary text-sm font-medium transition-colors underline underline-offset-4">
          已有帳號? 返回登入
        </button>
      </div>
    </motion.div>
  );
}

// --- MAIN PAGES ---

function Dashboard({ user }: { user: User }) {
  const [records, setRecords] = useState<MealRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewDate, setViewDate] = useState(new Date(2026, 2, 1)); // Default to March 2026 for demo

  const [prices, setPrices] = useState({ '早餐': 40, '午餐': 65, '晚餐': 65 });

  const fetchRecords = useCallback(async () => {
    try {
      const [recordsRes, settingsRes] = await Promise.all([
        fetch(`/api/my-records?staffId=${user.staffId}`),
        fetch('/api/settings')
      ]);
      const recordsData = await recordsRes.json();
      const settingsData = await settingsRes.json();
      
      setRecords(recordsData.records);
      if (settingsData.breakfast_price) {
        setPrices({
          '早餐': Number(settingsData.breakfast_price),
          '午餐': Number(settingsData.lunch_price),
          '晚餐': Number(settingsData.dinner_price)
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [user.staffId]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const filteredRecords = records.filter(r => {
    const d = new Date(r.date);
    return d.getMonth() === viewDate.getMonth() && d.getFullYear() === viewDate.getFullYear();
  });

  const stats = filteredRecords.reduce((acc, r) => {
    let normalizedType: '早餐' | '午餐' | '晚餐' = '午餐';
    if (r.mealType.includes('早餐')) normalizedType = '早餐';
    else if (r.mealType.includes('晚餐')) normalizedType = '晚餐';

    acc[normalizedType] = (acc[normalizedType] || 0) + 1;
    acc.totalCount += 1;
    acc.totalAmount += prices[normalizedType];
    return acc;
  }, { '早餐': 0, '午餐': 0, '晚餐': 0, totalCount: 0, totalAmount: 0 });

  const groupedByDate = filteredRecords.reduce((acc, r) => {
    if (!acc[r.date]) {
      const d = new Date(r.date);
      acc[r.date] = { 
        date: r.date, 
        day: d.getDate(),
        weekday: d.toLocaleDateString('zh-TW', { weekday: 'narrow' }),
        早餐: 0, 午餐: 0, 晚餐: 0 
      };
    }
    let normalizedType: '早餐' | '午餐' | '晚餐' = '午餐';
    if (r.mealType.includes('早餐')) normalizedType = '早餐';
    else if (r.mealType.includes('晚餐')) normalizedType = '晚餐';
    
    acc[r.date][normalizedType] = (acc[r.date][normalizedType] || 0) + 1;
    return acc;
  }, {} as Record<string, any>);

  const sortedDates = Object.values(groupedByDate).sort((a: any, b: any) => a.date.localeCompare(b.date));

  const changeMonth = (offset: number) => {
    const next = new Date(viewDate);
    next.setMonth(next.getMonth() + offset);
    setViewDate(next);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-pulse">
        <div className="w-12 h-12 bg-natural-primary/10 rounded-full mb-4"></div>
        <div className="h-4 w-32 bg-natural-primary/10 rounded"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      {/* Header Info */}
      <div className="space-y-1">
        <h2 className="flex items-center space-x-2 text-2xl font-serif font-bold italic text-natural-text-main">
          <CalendarIcon className="w-6 h-6 text-natural-primary" />
          <span>我的訂餐記錄</span>
        </h2>
        <div className="text-natural-text-dim text-sm px-8 font-medium">
          {user.name} • 社員編號 {user.staffId}
        </div>
      </div>

      {/* Month Selector */}
      <div className="bg-natural-card rounded-[24px] border border-natural-border/30 shadow-sm p-4 flex items-center justify-between">
        <button onClick={() => changeMonth(-1)} className="p-4 hover:bg-natural-bg rounded-xl transition-colors">
          <ChevronLeft size={24} className="text-natural-text-dim" />
        </button>
        <h3 className="text-2xl font-serif italic font-bold text-natural-text-main pb-1">
          {viewDate.getFullYear()} 年 {viewDate.getMonth() + 1} 月
        </h3>
        <button onClick={() => changeMonth(1)} className="p-4 hover:bg-natural-bg rounded-xl transition-colors">
          <ChevronRight size={24} className="text-natural-text-dim" />
        </button>
      </div>

      {/* Top Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: '早餐', count: stats['早餐'], icon: <Coffee size={18} />, color: 'text-amber-600' },
          { label: '午餐', count: stats['午餐'], icon: <Sun size={18} />, color: 'text-yellow-600' },
          { label: '晚餐', count: stats['晚餐'], icon: <Moon size={18} />, color: 'text-blue-600' },
          { label: '本月合計', count: stats.totalCount, icon: <TrendingUp size={18} />, color: 'text-natural-primary' }
        ].map((item, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-natural-card p-6 rounded-[24px] border border-natural-border/30 shadow-sm"
          >
            <div className="flex items-center space-x-2 mb-3">
              <span className={item.color}>{item.icon}</span>
              <span className="text-xs font-bold text-natural-text-dim uppercase tracking-wider">{item.label}</span>
            </div>
            <div className="flex items-baseline space-x-1">
              <span className="text-4xl font-serif font-black text-natural-text-main">{item.count}</span>
              <span className="text-xs font-medium text-natural-text-dim">份</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Detailed Table */}
      <div className="bg-natural-card rounded-[24px] border border-natural-border/30 shadow-sm overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#FAF9F6] text-[10px] font-bold uppercase tracking-[2px] text-natural-text-dim border-b border-natural-border/30">
              <th className="p-6 text-left">日期</th>
              <th className="p-6 text-center">早餐</th>
              <th className="p-6 text-center">午餐</th>
              <th className="p-6 text-center">晚餐</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-natural-bg">
            {sortedDates.map((row: any, i) => (
              <tr key={i} className="hover:bg-natural-bg/20 transition-colors">
                <td className="p-4 px-6">
                  <div className="inline-flex flex-col items-center justify-center w-12 h-14 bg-natural-bg/50 rounded-xl border border-natural-border/10 shadow-inner">
                    <span className="text-lg font-black text-natural-text-main leading-none">{row.day}</span>
                    <span className="text-[9px] font-bold text-natural-text-dim mt-1.5 opacity-60">{row.weekday}</span>
                  </div>
                </td>
                {['早餐', '午餐', '晚餐'].map((key) => (
                  <td key={key} className="p-4 text-center">
                    {row[key] > 0 ? (
                      <div className="w-9 h-9 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-black mx-auto shadow-sm text-sm">
                        {row[key]}
                      </div>
                    ) : (
                      <span className="text-natural-text-dim opacity-10">—</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
            {sortedDates.length === 0 && (
              <tr>
                <td colSpan={4} className="py-24 text-center text-natural-text-dim/30 italic font-serif text-lg">
                  本月尚無任何訂餐明細錄
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Amount Statistics */}
      <div className="bg-natural-card rounded-[32px] border border-natural-border/40 shadow-sm p-10 space-y-8">
        <h3 className="flex items-center space-x-3 text-2xl font-serif font-bold italic text-natural-text-main">
          <span className="w-10 h-10 bg-natural-primary/10 rounded-xl flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-natural-primary" />
          </span>
          <span>訂餐金額統計</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: '早餐', count: stats['早餐'], price: prices['早餐'], color: 'text-amber-900', bgColor: 'bg-amber-50/50' },
            { label: '午餐', count: stats['午餐'], price: prices['午餐'], color: 'text-yellow-900', bgColor: 'bg-yellow-50/30' },
            { label: '晚餐', count: stats['晚餐'], price: prices['晚餐'], color: 'text-blue-900', bgColor: 'bg-blue-50/30' },
            { label: '合計金額', count: stats.totalAmount, isTotal: true, color: 'text-natural-primary', bgColor: 'bg-natural-bg/70' }
          ].map((item, i) => (
            <div key={i} className={`${item.bgColor} p-8 rounded-[28px] border border-natural-border/20 shadow-inner group transition-all hover:border-natural-primary/30`}>
              <div className="text-[10px] uppercase font-bold tracking-widest text-natural-text-dim mb-4 opacity-60">{item.label}</div>
              <div className={`text-4xl font-serif font-black ${item.color} tracking-tighter`}>
                ${(item.isTotal ? item.count : item.count * item.price).toLocaleString()}
              </div>
              {!item.isTotal && (
                <div className="text-[11px] text-natural-text-dim mt-4 font-mono font-medium opacity-50">
                  {item.count} 份 × ${item.price}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="pt-8 text-center border-t border-natural-border/30">
          <p className="text-sm font-serif italic text-natural-text-dim/80">
            共 {sortedDates.length} 天有訂餐記錄 • 本月合計 {stats.totalCount} 份 • 金額 ${stats.totalAmount.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}

function AdminPanel({ tab }: { tab: string }) {
  const [activeTab, setActiveTab] = useState(tab || 'accounts');

  useEffect(() => {
    setActiveTab(tab || 'accounts');
  }, [tab]);

  return (
    <div className="space-y-8">
      {activeTab === 'accounts' && <AdminAccounts />}
      {activeTab === 'upload' && <AdminUpload />}
      {activeTab === 'summary' && <AdminSummary />}
      {activeTab === 'settings' && <AdminSettings />}
    </div>
  );
}

function AdminAccounts() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const resetPassword = async (staffId: string) => {
    const newPass = prompt('請輸入新密碼:');
    if (!newPass) return;
    try {
      const res = await fetch('/api/admin/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ staffId, newPassword: newPass })
      });
      if (res.ok) alert('密碼已重設');
    } catch (err) { alert('操作失敗'); }
  };

  const filteredUsers = users.filter(u => 
    u.staffId.toLowerCase().includes(search.toLowerCase()) || 
    u.name.toLowerCase().includes(search.toLowerCase())
  );

  const staffCount = users.filter(u => u.role === 'staff').length;
  const adminCount = users.filter(u => u.role === 'admin').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-[#3d2c1c]/5 rounded-2xl flex items-center justify-center text-[#3d2c1c]">
            <Users size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#1a1109]">帳號管理</h2>
            <p className="text-sm text-[#1a1109]/40">管理員工登入帳號與對應社員編號</p>
          </div>
        </div>
        <button className="bg-[#3d2c1c] text-[#e4a853] px-6 py-3 rounded-xl font-bold flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all active:scale-95">
          <Plus size={20} />
          <span>新增帳號</span>
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[#1a1109]/30" size={20} />
        <input 
          type="text" 
          placeholder="搜尋姓名、帳號或社員編號..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white border border-[#3d2c1c]/10 rounded-2xl py-4 pl-14 pr-6 text-sm focus:ring-2 focus:ring-[#3d2c1c] outline-none transition-all shadow-sm"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: '員工帳號', count: staffCount, icon: <UserIcon size={24} /> },
          { label: '管理員帳號', count: adminCount, icon: <Shield size={24} /> },
          { label: '帳號總數', count: users.length, icon: <Users size={24} /> }
        ].map((s, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-[#3d2c1c]/5 shadow-sm flex items-center space-x-5">
            <div className="w-14 h-14 bg-[#3d2c1c]/5 rounded-2xl flex items-center justify-center text-[#3d2c1c]">
              {s.icon}
            </div>
            <div>
              <div className="text-3xl font-black text-[#1a1109] leading-none mb-1">{s.count}</div>
              <div className="text-xs font-bold text-[#1a1109]/40 uppercase tracking-widest">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[32px] border border-[#3d2c1c]/5 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-[#faf8f4]/50 border-b border-[#3d2c1c]/5">
              <th className="p-6 text-[10px] font-bold uppercase tracking-[2px] text-[#1a1109]/40">姓名</th>
              <th className="p-6 text-[10px] font-bold uppercase tracking-[2px] text-[#1a1109]/40">帳號</th>
              <th className="p-6 text-[10px] font-bold uppercase tracking-[2px] text-[#1a1109]/40 text-center">社員編號</th>
              <th className="p-6 text-[10px] font-bold uppercase tracking-[2px] text-[#1a1109]/40 text-center">角色</th>
              <th className="p-6 text-[10px] font-bold uppercase tracking-[2px] text-[#1a1109]/40 text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#3d2c1c]/5">
            {filteredUsers.map((u, i) => (
              <tr key={i} className="hover:bg-[#faf8f4]/30 transition-colors">
                <td className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-[#3d2c1c] text-[#e4a853] flex items-center justify-center font-bold text-sm shadow-sm">
                      {u.name.charAt(0)}
                    </div>
                    <span className="font-bold text-[#1a1109]">{u.name}</span>
                  </div>
                </td>
                <td className="p-6 font-mono text-sm text-[#1a1109]/60">{u.staffId}</td>
                <td className="p-6 text-center text-sm font-medium text-[#1a1109]/40">{u.staffId === 'admin' ? 'ADMIN' : '專員'}</td>
                <td className="p-6 text-center">
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase ${u.role === 'admin' ? 'bg-[#3d2c1c]/10 text-[#3d2c1c]' : 'bg-[#e4a853]/10 text-[#e4a853]'}`}>
                    <Shield size={10} className="inline mr-1.5 -mt-0.5" />
                    {u.role === 'admin' ? '管理員' : '一般職員'}
                  </span>
                </td>
                <td className="p-6 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <button onClick={() => resetPassword(u.staffId)} className="p-2 text-[#1a1109]/20 hover:text-[#3d2c1c] hover:bg-[#3d2c1c]/5 rounded-lg transition-all" title="重設密碼">
                      <Edit2 size={18} />
                    </button>
                    <button className="p-2 text-[#1a1109]/20 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all" title="刪除帳號">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredUsers.length === 0 && !loading && (
          <div className="py-20 text-center text-[#1a1109]/20 font-serif italic text-lg">
            尚無相符的帳號資料
          </div>
        )}
      </div>
    </div>
  );
}

function AdminUpload() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    setSuccess(null);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('/api/admin/upload-data', { method: 'POST', body: formData });
      const data = await res.json();
      if (res.ok) setSuccess(`成功解析並更新 ${data.count} 筆訂餐數據`);
      else alert(data.error);
    } catch (err) { alert('上傳失敗'); }
    finally { setLoading(false); }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex items-center space-x-3 mb-10">
        <div className="w-12 h-12 bg-[#3d2c1c]/5 rounded-2xl flex items-center justify-center text-[#3d2c1c]">
          <Upload size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-[#1a1109]">上傳訂餐表</h2>
          <p className="text-sm text-[#1a1109]/40">上傳 Excel 訂餐表，系統將自動解析並更新資料庫</p>
        </div>
      </div>

      <div className="bg-white rounded-[40px] border border-[#3d2c1c]/5 shadow-sm p-8 space-y-6">
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-[#1a1109]/5 rounded-2xl text-[#1a1109]/40">
            <Info size={24} />
          </div>
          <div className="space-y-3">
            <h4 className="font-bold text-lg text-[#1a1109]">上傳說明</h4>
            <ul className="space-y-2 text-sm text-[#1a1109]/60 list-disc pl-4">
              <li>支援格式：Excel (.xlsx、.xls)</li>
              <li>系統將自動解析訂餐表中的社員編號、日期與早/午/晚餐數量</li>
              <li className="text-red-500 font-medium">上傳後將覆蓋同月份的現有訂餐資料</li>
              <li>請確認 Excel 格式與原始訂餐表一致</li>
            </ul>
          </div>
        </div>
      </div>

      <label className={`
        relative group border-2 border-dashed border-[#3d2c1c]/10 rounded-[40px] p-20 flex flex-col items-center justify-center cursor-pointer transition-all hover:border-[#3d2c1c]/30 bg-white shadow-sm
        ${loading ? 'opacity-50 cursor-not-allowed' : ''}
      `}>
        <div className="w-20 h-20 bg-[#3d2c1c]/5 rounded-full flex items-center justify-center text-[#3d2c1c] mb-6 group-hover:scale-110 transition-transform">
          <Upload size={32} />
        </div>
        <div className="text-xl font-bold text-[#1a1109] mb-2">拖曳檔案至此，或點擊選擇</div>
        <div className="text-sm text-[#1a1109]/30">支援 .xlsx、.xls 格式</div>
        <input type="file" className="hidden" accept=".xlsx,.xls" onChange={handleUpload} disabled={loading} />
        
        {loading && (
          <div className="absolute inset-0 bg-white/80 rounded-[40px] flex flex-col items-center justify-center">
            <div className="w-10 h-10 border-4 border-[#3d2c1c]/10 border-t-[#3d2c1c] rounded-full animate-spin mb-4"></div>
            <div className="font-medium text-[#3d2c1c] animate-pulse">正在解析大型數據檔案...</div>
          </div>
        )}
      </label>

      {success && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6 bg-green-50 border border-green-100 rounded-3xl flex items-center space-x-4 text-green-700">
          <CheckCircle2 size={24} />
          <div className="font-bold">{success}</div>
        </motion.div>
      )}
    </div>
  );
}

function AdminSummary() {
  const [summary, setSummary] = useState<any[]>([]);
  const [viewDate, setViewDate] = useState(new Date(2026, 2, 1));
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchSummary = async () => {
    setLoading(true);
    try {
      const month = `${viewDate.getFullYear()}-${String(viewDate.getMonth() + 1).padStart(2, '0')}`;
      const res = await fetch(`/api/admin/summary?month=${month}`);
      const data = await res.json();
      setSummary(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    fetchSummary();
  }, [viewDate]);

  const filtered = summary.filter(s => 
    s.staffId.toLowerCase().includes(search.toLowerCase()) || 
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  const totals = summary.reduce((acc, s) => ({
    早餐: acc.早餐 + (s.breakfastCount || 0),
    午餐: acc.午餐 + (s.lunchCount || 0),
    晚餐: acc.晚餐 + (s.dinnerCount || 0),
    total: acc.total + (s.breakfastCount || 0) + (s.lunchCount || 0) + (s.dinnerCount || 0)
  }), { 早餐: 0, 午餐: 0, 晚餐: 0, total: 0 });

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-12 h-12 bg-[#3d2c1c]/5 rounded-2xl flex items-center justify-center text-[#3d2c1c]">
          <LayoutDashboard size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-[#1a1109]">訂餐總覽</h2>
          <p className="text-sm text-[#1a1109]/40">查看所有員工的當月訂餐統計</p>
        </div>
      </div>

      <div className="bg-white rounded-[24px] border border-[#3d2c1c]/5 shadow-sm p-4 flex items-center justify-between">
        <button onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))} className="p-4 hover:bg-[#faf8f4] rounded-xl transition-colors">
          <ChevronLeft size={24} className="text-[#1a1109]/40" />
        </button>
        <h3 className="text-2xl font-bold text-[#1a1109]">
          {viewDate.getFullYear()} 年 {viewDate.getMonth() + 1} 月
        </h3>
        <button onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))} className="p-4 hover:bg-[#faf8f4] rounded-xl transition-colors">
          <ChevronRight size={24} className="text-[#1a1109]/40" />
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: '早餐合計', count: totals.早餐, color: 'text-amber-600' },
          { label: '午餐合計', count: totals.午餐, color: 'text-green-700' },
          { label: '晚餐合計', count: totals.晚餐, color: 'text-blue-600' },
          { label: '全月總計', count: totals.total, color: 'text-[#3d2c1c]' }
        ].map((s, i) => (
          <div key={i} className="bg-white p-6 rounded-[28px] border border-[#3d2c1c]/5 shadow-sm">
            <div className="text-xs font-bold text-[#1a1109]/40 mb-2">{s.label}</div>
            <div className="flex items-baseline space-x-1">
              <span className={`text-4xl font-black ${s.color}`}>{s.count}</span>
              <span className="text-sm text-[#1a1109]/20 font-medium">份</span>
            </div>
          </div>
        ))}
      </div>

      <div className="relative">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[#1a1109]/30" size={20} />
        <input 
          type="text" 
          placeholder="搜尋社員編號或姓名..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white border border-[#3d2c1c]/10 rounded-2xl py-4 pl-14 pr-6 text-sm outline-none transition-all shadow-sm"
        />
      </div>

      <div className="bg-white rounded-[32px] border border-[#3d2c1c]/5 shadow-sm overflow-hidden min-h-[400px]">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-[#faf8f4]/50 border-b border-[#3d2c1c]/5">
              <th className="p-6 text-[10px] font-bold uppercase tracking-[2px] text-[#1a1109]/40">員工</th>
              <th className="p-6 text-[10px] font-bold uppercase tracking-[2px] text-[#1a1109]/40 text-center">早餐</th>
              <th className="p-6 text-[10px] font-bold uppercase tracking-[2px] text-[#1a1109]/40 text-center">午餐</th>
              <th className="p-6 text-[10px] font-bold uppercase tracking-[2px] text-[#1a1109]/40 text-center">晚餐</th>
              <th className="p-6 text-[10px] font-bold uppercase tracking-[2px] text-[#1a1109]/40 text-right">合計</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#3d2c1c]/5">
            {filtered.map((s, i) => (
              <tr key={i} className="hover:bg-[#faf8f4]/30 transition-colors">
                <td className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-full bg-[#1a1109]/5 flex items-center justify-center font-bold text-xs text-[#1a1109]/40">
                      {i + 1}
                    </div>
                    <div>
                      <div className="font-bold text-[#1a1109]">{s.name}</div>
                      <div className="text-[10px] text-[#1a1109]/40 tracking-tighter">{s.staffId}</div>
                    </div>
                  </div>
                </td>
                <td className="p-6 text-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black mx-auto text-xs ${s.breakfastCount > 0 ? 'bg-amber-100 text-amber-900 border border-amber-200' : 'text-[#1a1109]/5'}`}>
                    {s.breakfastCount > 0 ? s.breakfastCount : '—'}
                  </div>
                </td>
                <td className="p-6 text-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black mx-auto text-xs ${s.lunchCount > 0 ? 'bg-green-100 text-green-900 border border-green-200' : 'text-[#1a1109]/5'}`}>
                    {s.lunchCount > 0 ? s.lunchCount : '—'}
                  </div>
                </td>
                <td className="p-6 text-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black mx-auto text-xs ${s.dinnerCount > 0 ? 'bg-blue-100 text-blue-900 border border-blue-200' : 'text-[#1a1109]/5'}`}>
                    {s.dinnerCount > 0 ? s.dinnerCount : '—'}
                  </div>
                </td>
                <td className="p-6 text-right font-black text-[#1a1109] text-base">
                  {s.breakfastCount + s.lunchCount + s.dinnerCount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {loading && (
          <div className="py-20 flex flex-col items-center justify-center text-[#1a1109]/20 font-serif italic">
            <div className="w-8 h-8 border-2 border-[#1a1109]/10 border-t-[#3d2c1c] rounded-full animate-spin mb-4"></div>
            正在匯總全員月度數據...
          </div>
        )}
      </div>
    </div>
  );
}

function AdminSettings() {
  const [prices, setPrices] = useState({ breakfast_price: '40', lunch_price: '65', dinner_price: '65' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/settings').then(res => res.json()).then(data => {
      if (data.breakfast_price) setPrices(data);
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prices)
      });
      alert('設定已儲存');
    } catch (err) { alert('儲存失敗'); }
    finally { setSaving(false); }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <div className="flex items-center space-x-3 mb-10">
        <div className="w-12 h-12 bg-[#3d2c1c]/5 rounded-2xl flex items-center justify-center text-[#3d2c1c]">
          <SettingsIcon size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-[#1a1109]">價格設定</h2>
          <p className="text-sm text-[#1a1109]/40">調整各餐別的單價設定</p>
        </div>
      </div>

      <div className="bg-white rounded-[40px] border border-[#3d2c1c]/5 shadow-sm p-12 space-y-12">
        <div className="space-y-6">
          {[
            { id: 'breakfast_price', label: '早餐單價 (元)', default: 40 },
            { id: 'lunch_price', label: '午餐單價 (元)', default: 65 },
            { id: 'dinner_price', label: '晚餐單價 (元)', default: 65 }
          ].map((field) => (
            <div key={field.id} className="space-y-2">
              <label className="text-lg font-bold text-[#1a1109] px-1">{field.label}</label>
              <div className="relative group">
                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl text-[#1a1109]/30 font-medium">$</span>
                <input 
                  type="number" 
                  value={prices[field.id as keyof typeof prices]}
                  onChange={(e) => setPrices({ ...prices, [field.id]: e.target.value })}
                  className="w-full bg-[#faf8f4]/50 border border-[#3d2c1c]/10 rounded-2xl py-5 pl-12 pr-6 text-2xl font-bold text-[#1a1109] group-hover:border-[#3d2c1c]/30 focus:ring-4 focus:ring-[#3d2c1c]/5 outline-none transition-all"
                />
              </div>
              <p className="text-xs text-[#1a1109]/30 px-1 font-medium">預設：{field.default} 元</p>
            </div>
          ))}
        </div>

        <button 
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-[#3d2c1c] text-[#e4a853] py-6 rounded-2xl font-bold text-xl flex items-center justify-center space-x-3 shadow-xl hover:shadow-2xl transition-all active:scale-[0.98] disabled:opacity-50"
        >
          {saving ? <div className="w-6 h-6 border-2 border-[#e4a853]/30 border-t-[#e4a853] rounded-full animate-spin"></div> : <Database size={24} />}
          <span>保存設定</span>
        </button>
      </div>
    </div>
  );
}
