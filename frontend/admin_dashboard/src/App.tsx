import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LayoutDashboard, Users, Activity, DollarSign, Clock, Settings, LogOut, TrendingUp, Plus, Edit2, Shield, User, Mail, Lock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from 'recharts';
import { motion } from 'framer-motion';

const API = 'http://localhost:3000';
const COLORS = ['#818cf8', '#6366f1', '#a78bfa', '#c084fc', '#f472b6'];

const StaffManagement = () => {
  const [staff, setStaff] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Form State
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'PHARMACIST', specialization: '' });

  const fetchStaff = async () => {
    try {
      const res = await fetch(`${API}/staff`);
      const data = await res.json();
      setStaff([...data.staff, ...data.doctors]);
    } catch (e) { console.error('Failed to fetch staff', e); }
    setLoading(false);
  };

  useEffect(() => { fetchStaff(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingUser ? `${API}/staff/${editingUser.id}` : `${API}/staff`;
      const method = editingUser ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setIsModalOpen(false);
        setEditingUser(null);
        setFormData({ name: '', email: '', password: '', role: 'PHARMACIST', specialization: '' });
        fetchStaff();
      }
    } catch (e) { console.error('Save failed', e); }
  };

  const openEdit = (user: any) => {
    setEditingUser(user);
    setFormData({ name: user.name, email: user.email, password: '', role: user.role, specialization: user.specialization || '' });
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-white">Employee Management</h3>
        <button onClick={() => { setEditingUser(null); setFormData({ name: '', email: '', password: '', role: 'PHARMACIST', specialization: '' }); setIsModalOpen(true); }} className="bg-primary-600 hover:bg-primary-500 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all">
          <Plus className="w-4 h-4" /> Add Employee
        </button>
      </div>

      <div className="bg-[#1e293b] rounded-2xl border border-slate-700/50 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-400">Loading directory...</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0f172a]/50 text-xs uppercase tracking-wider text-slate-400 font-bold border-b border-slate-700/50">
                <th className="p-4">Employee</th>
                <th className="p-4">Role</th>
                <th className="p-4">Portal Access</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {staff.map((member) => (
                <tr key={member.id} className="hover:bg-white/5 transition-colors group">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center font-bold text-white text-sm">
                        {member.name.substring(0,2).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{member.name}</p>
                        <p className="text-xs text-slate-400">{member.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-slate-700 text-slate-300">
                      <Shield className="w-3.5 h-3.5" /> {member.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-slate-400 font-medium">
                    {member.role === 'DOCTOR' ? 'Doctor Dashboard' : member.role === 'RECEPTIONIST' ? 'Reception Portal' : member.role === 'LAB_TECH' ? 'Lab Portal' : member.role === 'PHARMACIST' ? 'Pharmacy Portal' : 'Admin Console'}
                  </td>
                  <td className="p-4 text-right">
                    <button onClick={() => openEdit(member)} className="p-2 bg-slate-700 hover:bg-primary-600 rounded-lg text-slate-300 hover:text-white transition-colors opacity-0 group-hover:opacity-100">
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-[#1e293b] rounded-2xl border border-slate-700 shadow-2xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-slate-700 flex justify-between items-center">
              <h3 className="text-lg font-bold text-white">{editingUser ? 'Edit Employee' : 'New Employee'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                  <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-[#0f172a] border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 outline-none focus:border-primary-500 text-white text-sm" placeholder="John Doe" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Email Address (Login ID)</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                  <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-[#0f172a] border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 outline-none focus:border-primary-500 text-white text-sm" placeholder="john@hospital.com" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Password {editingUser && '(Leave blank to keep current)'}</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                  <input type={editingUser ? "password" : "text"} required={!editingUser} value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full bg-[#0f172a] border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 outline-none focus:border-primary-500 text-white text-sm" placeholder="SecurePassword123" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Portal Role</label>
                <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full bg-[#0f172a] border border-slate-700 rounded-xl px-4 py-2.5 outline-none focus:border-primary-500 text-white text-sm">
                  <option value="RECEPTIONIST">Receptionist</option>
                  <option value="DOCTOR">Doctor</option>
                  <option value="LAB_TECH">Lab Technician</option>
                  <option value="PHARMACIST">Pharmacist</option>
                  <option value="ADMIN">Administrator</option>
                </select>
              </div>
              {formData.role === 'DOCTOR' && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Specialization</label>
                  <input type="text" value={formData.specialization} onChange={e => setFormData({...formData, specialization: e.target.value})} className="w-full bg-[#0f172a] border border-slate-700 rounded-xl px-4 py-2.5 outline-none focus:border-primary-500 text-white text-sm" placeholder="e.g. Cardiology" />
                </motion.div>
              )}
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-sm transition-colors">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-bold text-sm transition-colors shadow-[0_0_15px_rgba(79,70,229,0.3)]">{editingUser ? 'Update' : 'Create'} User</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};


const DashboardHome = ({ user, handleLogout }: { user?: any, handleLogout: () => void }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'staff'>('dashboard');
  const [kpis, setKpis] = useState<any>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [kpiRes, chartRes] = await Promise.all([
          fetch(`${API}/analytics/kpis`),
          fetch(`${API}/analytics/revenue/department`),
        ]);
        setKpis(await kpiRes.json());
        setChartData(await chartRes.json());
      } catch (e) { console.error(e); }
      setLoading(false);
    };
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  const metrics = kpis ? [
    { label: 'Patient Footfall', value: kpis.footfall, icon: Users, change: '+12%', up: true },
    { label: 'Revenue', value: `₹${(kpis.revenue / 1000).toFixed(1)}K`, icon: DollarSign, change: '+8%', up: true },
    { label: 'Active Doctors', value: kpis.activeDoctors, icon: Activity, change: '', up: true },
    { label: 'Avg Wait Time', value: `${kpis.avgWaitTimeMins}m`, icon: Clock, change: '-3m', up: false },
  ] : [];

  return (
    <div className="flex bg-[#0f172a] h-screen overflow-hidden font-sans text-gray-100 relative">
      <motion.aside 
        initial={{ x: -250 }}
        animate={{ x: 0 }}
        className="w-60 bg-[#1e293b] flex flex-col justify-between border-r border-slate-700/50 z-20"
      >
        <div>
          <div className="h-14 flex items-center justify-center border-b border-slate-700/50">
            <h1 className="text-lg font-bold flex items-center gap-2 text-white">
              <LayoutDashboard className="text-primary-400 w-5 h-5" /> MediAdmin
            </h1>
          </div>
          <nav className="mt-4 px-3 flex flex-col gap-1">
            <button onClick={() => setActiveTab('dashboard')} className={`flex items-center w-full gap-3 px-4 py-2.5 rounded-lg font-medium text-sm transition-colors ${activeTab === 'dashboard' ? 'bg-primary-600/20 text-primary-300' : 'text-slate-400 hover:bg-white/5'}`}>
              <LayoutDashboard className="w-4 h-4" /> Dashboard
            </button>
            <button onClick={() => setActiveTab('staff')} className={`flex items-center w-full gap-3 px-4 py-2.5 rounded-lg font-medium text-sm transition-colors ${activeTab === 'staff' ? 'bg-primary-600/20 text-primary-300' : 'text-slate-400 hover:bg-white/5'}`}>
              <Users className="w-4 h-4" /> Employees
            </button>
            <button className="flex items-center w-full gap-3 px-4 py-2.5 text-slate-400 hover:bg-white/5 rounded-lg font-medium text-sm transition-colors">
              <Settings className="w-4 h-4" /> Settings
            </button>
          </nav>
        </div>
        <div className="p-3 border-t border-slate-700/50">
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2.5 w-full text-slate-400 hover:bg-red-500/10 hover:text-red-400 rounded-lg font-medium text-sm transition-colors">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </motion.aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-14 bg-[#1e293b]/50 border-b border-slate-700/50 flex items-center justify-between px-6">
          <h2 className="text-lg font-bold text-white">{activeTab === 'dashboard' ? 'System Overview' : 'Staff Directory'}</h2>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">{user?.name?.substring(0,1) || 'A'}</div>
            <span className="font-semibold text-sm text-slate-300">{user?.name || 'Administrator'}</span>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'dashboard' ? (
            loading ? (
              <div className="flex items-center justify-center py-20"><div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full"></div></div>
            ) : (
              <div className="max-w-6xl mx-auto space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                  {metrics.map((m, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="metric-card">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{m.label}</p>
                          <p className="text-3xl font-bold text-white">{m.value}</p>
                        </div>
                        <div className="w-10 h-10 bg-primary-500/10 rounded-xl flex items-center justify-center">
                          <m.icon className="w-5 h-5 text-primary-400" />
                        </div>
                      </div>
                      {m.change && (
                        <div className={`mt-3 text-xs font-bold flex items-center gap-1 ${m.up ? 'text-emerald-400' : 'text-amber-400'}`}>
                          <TrendingUp className={`w-3.5 h-3.5 ${!m.up ? 'rotate-180' : ''}`} /> {m.change} from yesterday
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="metric-card">
                  <h3 className="text-lg font-bold text-white mb-4">Revenue by Department</h3>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                        <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
                        <RechartsTooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#f1f5f9' }} />
                        <Bar dataKey="revenue" radius={[6, 6, 0, 0]}>
                          {chartData.map((_: any, i: number) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>
              </div>
            )
          ) : (
            <StaffManagement />
          )}
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
    const saved = localStorage.getItem('medi_admin_dashboard_auth');
    return saved ? JSON.parse(saved) : null;
  });

  if (!authData) {
    return <LoginScreen 
      onLogin={(data) => { localStorage.setItem('medi_admin_dashboard_auth', JSON.stringify(data)); setAuthData(data); }} 
      roleContext="STAFF" title="Admin Dashboard" subtitle="Sign in to view analytics." 
    />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<DashboardHome user={authData.user} handleLogout={() => { localStorage.removeItem('medi_admin_dashboard_auth'); setAuthData(null); }} />} />
      </Routes>
    </Router>
  );
}

export default App;

