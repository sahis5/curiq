import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Microscope, FlaskConical, CheckCircle, Clock, LogOut, UploadCloud } from 'lucide-react';
import { motion } from 'framer-motion';

const API = 'http://localhost:3000';

const LabDashboard = ({ user, handleLogout }: { user?: any; handleLogout: () => void }) => {
  const [activeTab, setActiveTab] = useState<'pending' | 'completed'>('pending');
  const [orders, setOrders] = useState<any[]>([]);
  const [completed, setCompleted] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API}/lab/pending`);
      const data = await res.json();
      setOrders(data);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleUpload = async (id: string, criticalFlag: boolean) => {
    try {
      const res = await fetch(`${API}/lab/${id}/upload`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resultUrl: '/uploads/results/' + id + '.pdf', criticalFlag }),
      });
      const data = await res.json();
      setCompleted(prev => [...prev, data]);
      setOrders(prev => prev.filter(o => o.id !== id));
    } catch (e) { console.error(e); }
  };
  
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <motion.aside 
        initial={{ x: -250 }}
        animate={{ x: 0 }}
        className="w-60 bg-slate-900 text-white flex flex-col justify-between z-20"
      >
        <div>
          <div className="h-14 flex items-center justify-center border-b border-white/10">
            <h1 className="text-lg font-bold flex items-center gap-2 text-primary-400">
              <Microscope className="w-5 h-5" /> MediLab
            </h1>
          </div>
          <nav className="mt-4 px-3 flex flex-col gap-1">
            <button onClick={() => setActiveTab('pending')} className={`flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium text-sm w-full text-left ${activeTab === 'pending' ? 'bg-primary-600 text-white' : 'text-slate-400 hover:bg-white/5'}`}>
              <Clock className="w-4 h-4" /> Pending ({orders.length})
            </button>
            <button onClick={() => setActiveTab('completed')} className={`flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium text-sm w-full text-left ${activeTab === 'completed' ? 'bg-primary-600 text-white' : 'text-slate-400 hover:bg-white/5'}`}>
              <CheckCircle className="w-4 h-4" /> Completed ({completed.length})
            </button>
          </nav>
        </div>
        <div className="p-3 border-t border-white/10">
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2.5 w-full text-slate-400 hover:bg-red-500/10 hover:text-red-400 rounded-lg font-medium text-sm">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </motion.aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6">
          <h2 className="text-lg font-bold text-slate-800">Lab Portal</h2>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">LT</div>
            <span className="font-semibold text-sm text-slate-700">Lab Technician</span>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-slate-900 mb-1">{activeTab === 'pending' ? 'Pending Lab Orders' : 'Completed Results'}</h3>
            <p className="text-slate-500 text-sm mb-6">{activeTab === 'pending' ? `${orders.length} tests pending • Auto-refreshes` : `${completed.length} completed`}</p>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full"></div>
              </div>
            ) : activeTab === 'pending' ? (
              <div className="space-y-4">
                {orders.map((order: any) => (
                  <motion.div key={order.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-bold text-slate-900">{order.testName}</h4>
                        <p className="text-sm text-slate-500">Patient: {order.emrRecord?.patient?.name || 'Unknown'}</p>
                      </div>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded border ${order.urgency === 'STAT' ? 'bg-red-50 text-red-700 border-red-200 animate-pulse' : order.urgency === 'URGENT' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                        {order.urgency}
                      </span>
                    </div>
                    <div className="flex gap-3 mt-4">
                      <button onClick={() => handleUpload(order.id, false)} className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2">
                        <UploadCloud className="w-4 h-4" /> Upload Normal Result
                      </button>
                      <button onClick={() => handleUpload(order.id, true)} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2">
                        <FlaskConical className="w-4 h-4" /> Flag as Critical
                      </button>
                    </div>
                  </motion.div>
                ))}
                {orders.length === 0 && (
                  <div className="text-center py-16 text-slate-400">
                    <FlaskConical className="w-10 h-10 mx-auto mb-3 opacity-50" />
                    <p className="font-semibold">No pending lab orders</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {completed.map((order: any) => (
                  <div key={order.id} className="bg-white rounded-xl border border-slate-200 p-4 flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-slate-800 text-sm">{order.testName}</p>
                      <p className="text-xs text-slate-500">Patient: {order.emrRecord?.patient?.name}</p>
                    </div>
                    <div className={`flex items-center gap-1.5 text-xs font-bold ${order.criticalFlag ? 'text-red-600' : 'text-emerald-600'}`}>
                      {order.criticalFlag ? <FlaskConical className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                      {order.criticalFlag ? 'CRITICAL' : 'Normal'}
                    </div>
                  </div>
                ))}
                {completed.length === 0 && (
                  <div className="text-center py-16 text-slate-400">
                    <CheckCircle className="w-10 h-10 mx-auto mb-3 opacity-50" />
                    <p className="font-semibold">No results uploaded yet</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};


const LoginScreen = ({ onLogin, roleContext, title, subtitle }: { onLogin: (user: any) => void, roleContext: 'DOCTOR' | 'STAFF', title: string, subtitle: string }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API}/auth/staff/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, type: roleContext }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');
      onLogin(data);
    } catch (err: any) { setError(err.message); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-100">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">{title}</h2>
        <p className="text-slate-500 mb-6 text-sm">{subtitle}</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Email</label><input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-primary-500 focus:bg-white text-sm" placeholder="Enter your email"/></div>
          <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Password</label><input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-primary-500 focus:bg-white text-sm" placeholder="••••••••"/></div>
          {error && <div className="text-red-500 text-sm font-medium">{error}</div>}
          <button disabled={loading} type="submit" className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-md">{loading ? 'Verifying...' : 'Sign In'}</button>
        </form>
      </div>
    </div>
  );
};


function App() {
  const [authData, setAuthData] = useState<any>(() => {
    const saved = localStorage.getItem('medi_lab_portal_auth');
    return saved ? JSON.parse(saved) : null;
  });

  const handleLogout = () => {
    localStorage.removeItem('medi_lab_portal_auth');
    setAuthData(null);
  };

  if (!authData) {
    return <LoginScreen 
      onLogin={(data) => { localStorage.setItem('medi_lab_portal_auth', JSON.stringify(data)); setAuthData(data); }} 
      roleContext="STAFF" title="Lab Portal" subtitle="Sign in to manage lab orders." 
    />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<LabDashboard user={authData.user} handleLogout={handleLogout} />} />
      </Routes>
    </Router>
  );
}

export default App;

