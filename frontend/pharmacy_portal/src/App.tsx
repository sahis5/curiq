import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Pill, CheckCircle, PackageOpen, Clock, LogOut, Check } from 'lucide-react';
import { motion } from 'framer-motion';

const API = 'http://localhost:3000';

const PharmacyDashboard = ({ user, handleLogout }: { user?: any; handleLogout: () => void }) => {
  const [activeTab, setActiveTab] = useState<'pending' | 'dispensed'>('pending');
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [dispensed, setDispensed] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPrescriptions = async () => {
    try {
      const res = await fetch(`${API}/prescriptions/pending`);
      const data = await res.json();
      setPrescriptions(data);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => {
    fetchPrescriptions();
    const interval = setInterval(fetchPrescriptions, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleDispense = async (id: string) => {
    try {
      await fetch(`${API}/prescriptions/${id}/dispense`, { method: 'PATCH' });
      const item = prescriptions.find(p => p.id === id);
      if (item) setDispensed(prev => [...prev, { ...item, dispensedAt: new Date() }]);
      setPrescriptions(prev => prev.filter(p => p.id !== id));
    } catch (e) { console.error(e); }
  };
  
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <motion.aside 
        initial={{ x: -250 }}
        animate={{ x: 0 }}
        className="w-60 bg-emerald-950 text-white flex flex-col justify-between z-20"
      >
        <div>
          <div className="h-14 flex items-center justify-center border-b border-white/10">
            <h1 className="text-lg font-bold flex items-center gap-2">
              <Pill className="text-emerald-400 w-5 h-5" /> MediPharmacy
            </h1>
          </div>
          <nav className="mt-4 px-3 flex flex-col gap-1">
            <button onClick={() => setActiveTab('pending')} className={`flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium text-sm w-full text-left ${activeTab === 'pending' ? 'bg-emerald-600 text-white' : 'text-emerald-200 hover:bg-white/5'}`}>
              <Clock className="w-4 h-4" /> Pending ({prescriptions.length})
            </button>
            <button onClick={() => setActiveTab('dispensed')} className={`flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium text-sm w-full text-left ${activeTab === 'dispensed' ? 'bg-emerald-600 text-white' : 'text-emerald-200 hover:bg-white/5'}`}>
              <PackageOpen className="w-4 h-4" /> Dispensed ({dispensed.length})
            </button>
          </nav>
        </div>
        <div className="p-3 border-t border-white/10">
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2.5 w-full text-emerald-200 hover:bg-red-500/10 hover:text-red-400 rounded-lg font-medium text-sm">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </motion.aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6">
          <h2 className="text-lg font-bold text-slate-800">Pharmacy Portal</h2>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">PH</div>
            <span className="font-semibold text-sm text-slate-700">Pharmacist Station</span>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-slate-900 mb-1">{activeTab === 'pending' ? 'Pending E-Prescriptions' : 'Dispensed History'}</h3>
            <p className="text-slate-500 text-sm mb-6">
              {activeTab === 'pending' ? `${prescriptions.length} prescriptions awaiting dispensing • Auto-refreshes` : `${dispensed.length} completed today`}
            </p>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full"></div>
              </div>
            ) : activeTab === 'pending' ? (
              <div className="space-y-4">
                {prescriptions.map((rx: any) => {
                  const medicines = Array.isArray(rx.medicinesJson) ? rx.medicinesJson : [];
                  return (
                    <motion.div key={rx.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-bold text-slate-900">{rx.emrRecord?.patient?.name || 'Unknown Patient'}</h4>
                          <p className="text-sm text-slate-500">Prescribed by {rx.emrRecord?.doctor?.name || 'Unknown'} • {new Date(rx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                        <div className="flex items-center gap-1.5 bg-amber-50 text-amber-700 text-xs font-bold px-2.5 py-1 rounded border border-amber-200">
                          <Clock className="w-3 h-3" /> Pending
                        </div>
                      </div>
                      <div className="bg-slate-50 rounded-lg p-4 mb-4 border border-slate-100">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Medicines</p>
                        <div className="space-y-2">
                          {medicines.map((med: any, i: number) => (
                            <div key={i} className="flex justify-between text-sm">
                              <span className="font-semibold text-slate-800">{med.name} {med.dosage}</span>
                              <span className="text-slate-500">{med.frequency} • {med.duration}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      {rx.drugCheckPassed && (
                        <div className="flex items-center gap-1.5 text-emerald-600 text-xs font-bold mb-3">
                          <CheckCircle className="w-3.5 h-3.5" /> Drug interaction check passed
                        </div>
                      )}
                      <button onClick={() => handleDispense(rx.id)} className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-colors">
                        <Check className="w-4 h-4" /> Mark as Dispensed
                      </button>
                    </motion.div>
                  );
                })}
                {prescriptions.length === 0 && (
                  <div className="text-center py-16 text-slate-400">
                    <Pill className="w-10 h-10 mx-auto mb-3 opacity-50" />
                    <p className="font-semibold">No pending prescriptions</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {dispensed.map((rx: any) => (
                  <div key={rx.id} className="bg-white rounded-xl border border-slate-200 p-4 flex justify-between items-center opacity-60">
                    <div>
                      <p className="font-semibold text-slate-800 text-sm">{rx.emrRecord?.patient?.name}</p>
                      <p className="text-xs text-slate-500">{Array.isArray(rx.medicinesJson) ? rx.medicinesJson.length : 0} medicines dispensed</p>
                    </div>
                    <div className="flex items-center gap-1.5 text-emerald-600 text-xs font-bold">
                      <CheckCircle className="w-4 h-4" /> Dispensed
                    </div>
                  </div>
                ))}
                {dispensed.length === 0 && (
                  <div className="text-center py-16 text-slate-400">
                    <PackageOpen className="w-10 h-10 mx-auto mb-3 opacity-50" />
                    <p className="font-semibold">No dispensed prescriptions yet</p>
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
    const saved = localStorage.getItem('medi_pharmacy_portal_auth');
    return saved ? JSON.parse(saved) : null;
  });

  const handleLogout = () => {
    localStorage.removeItem('medi_pharmacy_portal_auth');
    setAuthData(null);
  };

  if (!authData) {
    return <LoginScreen 
      onLogin={(data) => { localStorage.setItem('medi_pharmacy_portal_auth', JSON.stringify(data)); setAuthData(data); }} 
      roleContext="STAFF" title="Pharmacy Portal" subtitle="Sign in to manage prescriptions." 
    />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<PharmacyDashboard user={authData.user} handleLogout={handleLogout} />} />
      </Routes>
    </Router>
  );
}

export default App;

