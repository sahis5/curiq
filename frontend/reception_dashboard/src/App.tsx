import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Activity, LogOut, Clock, Plus, Bell } from 'lucide-react';

const API = 'http://localhost:3000';

const Dashboard = ({ handleLogout }: { handleLogout: () => void }) => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    try {
      const res = await fetch(`${API}/appointments/today`);
      const data = await res.json();
      setAppointments(data);
    } catch (e) { console.error('Failed to fetch appointments', e); }
    setLoading(false);
  };

  useEffect(() => {
    fetchAppointments();
    // Poll every 5 seconds for real-time sync
    const interval = setInterval(fetchAppointments, 5000);
    return () => clearInterval(interval);
  }, []);

  // Group appointments by doctor
  const doctorMap = new Map<string, { doctor: any; appointments: any[] }>();
  appointments.forEach((apt) => {
    if (!doctorMap.has(apt.doctorId)) {
      doctorMap.set(apt.doctorId, { doctor: apt.doctor, appointments: [] });
    }
    doctorMap.get(apt.doctorId)!.appointments.push(apt);
  });

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Sidebar */}
      <motion.aside 
        initial={{ x: -250 }}
        animate={{ x: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="w-60 bg-white border-r border-slate-200 flex flex-col justify-between z-20"
      >
        <div>
          <div className="h-14 flex items-center justify-center border-b border-gray-200">
            <h1 className="text-lg font-bold text-primary-600">Curiq</h1>
          </div>
          <nav className="mt-4 px-3">
            <a href="#" className="flex items-center gap-3 px-4 py-2.5 bg-primary-50 text-primary-700 rounded-lg font-medium text-sm">
              <Activity className="w-4 h-4" /> Live Queue
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-2.5 text-gray-600 hover:bg-gray-50 rounded-lg font-medium text-sm mt-1">
              <Users className="w-4 h-4" /> Patients
            </a>
          </nav>
        </div>
        <div className="p-3 border-t border-gray-200">
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2.5 w-full text-gray-500 hover:bg-red-50 hover:text-red-600 rounded-lg font-medium text-sm">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-10">
          <h2 className="text-lg font-bold text-slate-800">Live Reception Desk</h2>
          <div className="flex items-center gap-4">
             <button className="relative p-2 text-slate-400 hover:text-primary-600">
               <Bell className="w-5 h-5" />
               <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
             </button>
             <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
               <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">R</div>
               <span className="font-semibold text-sm text-slate-700">Reception Desk 1</span>
             </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex justify-between items-end mb-6">
             <div>
               <h3 className="text-2xl font-bold text-slate-900 mb-1">Queue Monitor</h3>
               <p className="text-slate-500 text-sm">{appointments.length} appointments today • Auto-refreshes every 5s</p>
             </div>
             <button className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2">
               <Plus className="w-4 h-4" /> New Walk-in
             </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full"></div>
            </div>
          ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {Array.from(doctorMap.values()).map(({ doctor, appointments: docApts }) => (
              <motion.div 
                key={doctor.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
              >
                <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600 font-bold text-sm">
                       {doctor.name.split(' ').slice(1).map((n: string) => n[0]).join('')}
                     </div>
                     <div>
                       <h4 className="font-bold text-slate-900 text-sm">{doctor.name}</h4>
                       <p className="text-xs text-primary-600 font-semibold">{doctor.specialization}</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-1.5 bg-green-50 px-2.5 py-1 rounded-full border border-green-200">
                     <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                     <span className="text-green-700 text-[10px] font-bold uppercase">Active</span>
                  </div>
                </div>
                
                <div className="p-4 bg-slate-50/50">
                   <div className="flex justify-between items-center mb-3 bg-white p-2.5 rounded-lg border border-slate-100 text-xs">
                     <span className="text-slate-600 font-semibold flex items-center gap-1.5">
                       <Users className="w-3.5 h-3.5 text-slate-400" /> {docApts.length} Patients
                     </span>
                     <span className="text-slate-600 font-semibold flex items-center gap-1.5">
                       <Clock className="w-3.5 h-3.5 text-slate-400" /> {Math.round(doctor.avgConsultationTime / 60)}m avg
                     </span>
                   </div>
                   
                   <div className="space-y-2">
                     {docApts.map((apt: any, idx: number) => (
                       <div key={apt.id} className={`bg-white rounded-lg p-3 border text-sm ${idx === 0 ? 'border-primary-200 shadow-sm' : 'border-slate-100'}`}>
                         <div className="flex justify-between items-center">
                           <div>
                             <p className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${idx === 0 ? 'text-primary-500' : 'text-slate-400'}`}>
                               {idx === 0 ? '● In Queue (Next)' : `Waiting #${idx + 1}`}
                             </p>
                             <p className="font-bold text-slate-900">Token <span className="text-primary-600">#{apt.tokenNumber}</span> — {apt.patient.name}</p>
                           </div>
                           <div className="text-right">
                             <p className="text-[10px] font-semibold text-slate-400 uppercase">Time</p>
                             <p className="font-semibold text-slate-700">{new Date(apt.slotTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                           </div>
                         </div>
                       </div>
                     ))}
                   </div>
                </div>
              </motion.div>
            ))}

            {doctorMap.size === 0 && (
              <div className="col-span-full text-center py-16 text-slate-400">
                <Activity className="w-10 h-10 mx-auto mb-3 opacity-50" />
                <p className="font-semibold">No appointments today</p>
              </div>
            )}
          </div>
          )}
        </div>
      </main>
    </div>
  );
};

const LoginScreen = ({ onLogin, roleContext }: { onLogin: (user: any) => void, roleContext: 'DOCTOR' | 'STAFF' }) => {
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
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Reception Dashboard</h2>
        <p className="text-slate-500 mb-6 text-sm">Please sign in to access the active queues.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Email</label><input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-primary-500 focus:bg-white text-sm" placeholder="reception@hospital.com"/></div>
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
    const saved = localStorage.getItem('medi_reception_auth');
    return saved ? JSON.parse(saved) : null;
  });

  const handleLogin = (data: any) => {
    localStorage.setItem('medi_reception_auth', JSON.stringify(data));
    setAuthData(data);
  };

  const handleLogout = () => {
    localStorage.removeItem('medi_reception_auth');
    setAuthData(null);
  };

  if (!authData) {
    return <LoginScreen onLogin={handleLogin} roleContext="STAFF" />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<Dashboard handleLogout={handleLogout} />} />
      </Routes>
    </Router>
  );
}

export default App;
