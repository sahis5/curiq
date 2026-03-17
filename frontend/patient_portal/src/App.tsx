import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useParams } from 'react-router-dom';
import { Search, MapPin, Star, Clock, Video, CheckCircle2, AlertCircle, Calendar, User as UserIcon, LogOut, FileText, Bot } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

const API = 'http://localhost:3000';

// Global Auth Context
const AuthContext = createContext<any>(null);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  useEffect(() => {
    const storedUser = localStorage.getItem('medi_patient_user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const login = (userData: any, token: string) => {
    setUser(userData);
    localStorage.setItem('medi_patient_user', JSON.stringify(userData));
    localStorage.setItem('medi_patient_token', token);
    setAuthModalOpen(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('medi_patient_user');
    localStorage.removeItem('medi_patient_token');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, authModalOpen, setAuthModalOpen, authMode, setAuthMode }}>
      {children}
      <AuthModal />
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

// Header Component
const Header = () => {
  const { user, setAuthModalOpen, setAuthMode, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="absolute top-0 w-full z-50 bg-transparent flex justify-between items-center px-8 py-6">
       <button onClick={() => navigate('/')} className="text-2xl font-black text-white tracking-tight flex items-center gap-2 drop-shadow-md">
          <CheckCircle2 className="w-8 h-8 text-primary-300" /> MediFlow
       </button>
       <div className="flex items-center gap-4">
          {user ? (
             <div className="flex items-center gap-4">
               <button onClick={() => navigate('/profile')} className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full font-bold transition-all text-sm border border-white/20">
                  <UserIcon className="w-4 h-4" /> {user.name}
               </button>
               <button onClick={() => { logout(); navigate('/'); }} className="flex items-center gap-2 bg-red-500/80 hover:bg-red-500 text-white backdrop-blur-md px-4 py-2 rounded-full font-bold transition-all text-sm drop-shadow-md border border-white/10">
                  <LogOut className="w-4 h-4" />
               </button>
             </div>
          ) : (
             <div className="flex gap-3">
                <button onClick={() => { setAuthMode('login'); setAuthModalOpen(true); }} className="text-white hover:text-primary-200 font-bold px-4 py-2 text-sm transition-colors drop-shadow-md">
                   Sign In
                </button>
                <button onClick={() => { setAuthMode('signup'); setAuthModalOpen(true); }} className="bg-white text-primary-600 hover:bg-primary-50 px-5 py-2.5 rounded-full font-bold transition-all shadow-lg hover:scale-105 active:scale-95 text-sm">
                   Get Started
                </button>
             </div>
          )}
       </div>
    </header>
  );
};

// Auth Modal
const AuthModal = () => {
  const { authModalOpen, setAuthModalOpen, authMode, setAuthMode, login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('Male');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!authModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const endpoint = authMode === 'login' ? '/auth/patient/login' : '/auth/patient/signup';
      const body = authMode === 'login' ? { email, password } : { name, email, password, dob, gender };
      
      const res = await fetch(`${API}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Authentication failed');
      
      login(data.user, data.access_token);
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setAuthModalOpen(false)}></div>
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden">
         <div className="p-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-1">{authMode === 'login' ? 'Welcome Back' : 'Create an Account'}</h2>
            <p className="text-slate-500 text-sm mb-6">{authMode === 'login' ? 'Sign in to access your appointments and records.' : 'Join MediFlow to book doctors and view your AI health profile.'}</p>
            
            {error && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm mb-4 font-medium flex items-center gap-2"><AlertCircle className="w-4 h-4" /> {error}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
               {authMode === 'signup' && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Full Name</label>
                      <input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full border border-slate-200 bg-slate-50 focus:bg-white focus:border-primary-500 rounded-xl px-4 py-3 outline-none transition-all text-sm font-medium" placeholder="E.g. John Doe" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Date of Birth</label>
                        <input type="date" required value={dob} onChange={e => setDob(e.target.value)} className="w-full border border-slate-200 bg-slate-50 focus:bg-white focus:border-primary-500 rounded-xl px-4 py-3 outline-none transition-all text-sm font-medium" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Gender</label>
                        <select value={gender} onChange={e => setGender(e.target.value)} className="w-full border border-slate-200 bg-slate-50 focus:bg-white focus:border-primary-500 rounded-xl px-4 py-3 outline-none transition-all text-sm font-medium">
                          <option>Male</option><option>Female</option><option>Other</option>
                        </select>
                      </div>
                    </div>
                  </>
               )}
               <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Email Address</label>
                  <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full border border-slate-200 bg-slate-50 focus:bg-white focus:border-primary-500 rounded-xl px-4 py-3 outline-none transition-all text-sm font-medium" placeholder="you@example.com" />
               </div>
               <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Password</label>
                  <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full border border-slate-200 bg-slate-50 focus:bg-white focus:border-primary-500 rounded-xl px-4 py-3 outline-none transition-all text-sm font-medium" placeholder="••••••••" />
               </div>
               
               <button disabled={loading} type="submit" className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg hover:shadow-primary-500/25 active:scale-[0.98] mt-2 flex justify-center">
                  {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : (authMode === 'login' ? 'Sign In' : 'Create Account')}
               </button>
            </form>

            <div className="mt-6 text-center text-sm font-medium text-slate-500">
               {authMode === 'login' ? "Don't have an account? " : "Already have an account? "}
               <button type="button" onClick={() => { setAuthMode(authMode === 'login' ? 'signup' : 'login'); setError(''); }} className="text-primary-600 hover:text-primary-700 font-bold hover:underline">
                 {authMode === 'login' ? 'Sign Up' : 'Sign In'}
               </button>
            </div>
         </div>
      </motion.div>
    </div>
  );
};

// Profile Page Component
const ProfilePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [history, setHistory] = useState<any[]>([]);
  const [aiRecs, setAiRecs] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    const fetchData = async () => {
      try {
        const [emrRes, aiRes] = await Promise.all([
          fetch(`${API}/emr/patient/${user.id}`),
          fetch(`${API}/ai/recommendations/${user.id}`)
        ]);
        if (emrRes.ok) setHistory(await emrRes.json());
        if (aiRes.ok) setAiRecs(await aiRes.json());
      } catch (e) {
        console.error("Failed to fetch profile data", e);
      }
      setLoading(false);
    };

    fetchData();
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Header />
      <div className="bg-primary-600 pt-24 pb-32 px-6 relative overflow-hidden">
         <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0"><div className="absolute top-[-20%] left-[-10%] w-[50%] h-[150%] bg-primary-500/20 blur-[100px] rounded-full"></div></div>
         <div className="max-w-4xl mx-auto relative z-10 flex items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-xl flex items-center justify-center text-white text-3xl font-black border-4 border-white shadow-xl">
                {user.name[0]}
              </div>
              <div className="text-white">
                 <h1 className="text-4xl font-extrabold mb-1 drop-shadow-md">{user.name}</h1>
                 <p className="text-primary-100 font-medium">{user.email}</p>
              </div>
            </div>
            
            {/* Show Latest Vitals if available */}
            {history.length > 0 && history[0].vitalsJson && (() => {
              const v = history[0].vitalsJson;
              const bpStr = v.bp || `${v.bpSystolic || '--'}/${v.bpDiastolic || '--'}`;
              const hr = v.heartRate || v.hr || '--';
              const temp = v.temperature || v.temp || '--';
              return (
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex gap-6 text-white shadow-lg">
                  <div>
                    <p className="text-xs text-primary-200 font-bold uppercase tracking-wider mb-1">Blood Pressure</p>
                    <p className="text-2xl font-black">{bpStr}</p>
                  </div>
                  <div>
                    <p className="text-xs text-primary-200 font-bold uppercase tracking-wider mb-1">Heart Rate</p>
                    <p className="text-2xl font-black">{hr} <span className="text-sm">bpm</span></p>
                  </div>
                  <div>
                    <p className="text-xs text-primary-200 font-bold uppercase tracking-wider mb-1">Temp</p>
                    <p className="text-2xl font-black">{temp}°F</p>
                  </div>
                </div>
              );
            })()}
         </div>
      </div>

      <div className="max-w-4xl mx-auto -mt-16 px-6 pb-20 relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="md:col-span-2 space-y-6">
            {/* Prescriptions & Records */}
            <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200 p-6">
               <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-6">
                 <FileText className="w-6 h-6 text-emerald-500" /> Prescriptions & Records
               </h3>
               
               {loading ? (
                 <div className="flex justify-center p-8"><div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div></div>
               ) : history.length === 0 ? (
                 <div className="bg-slate-50 rounded-xl border border-slate-200 p-8 text-center">
                    <p className="font-semibold text-slate-500">No medical records available yet.</p>
                 </div>
               ) : (
                 <div className="space-y-4">
                   {history.map((record) => (
                     <div key={record.id} className="border border-slate-100 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                       <div className="bg-slate-50 px-5 py-3 border-b border-slate-100 flex justify-between items-center">
                         <div>
                           <p className="font-bold text-slate-800">{new Date(record.visitDate).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</p>
                           <p className="text-sm font-medium text-primary-600">Dr. {record.doctor?.name} ({record.doctor?.specialization})</p>
                         </div>
                         <div className="text-right">
                           <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 font-bold text-xs px-2.5 py-1 rounded-full uppercase">
                             {record.icd10Code || 'General Consultation'}
                           </span>
                         </div>
                       </div>
                       
                       <div className="p-5">
                         {record.prescriptions && record.prescriptions.length > 0 ? (
                           <div>
                             <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Prescribed Medications</p>
                             <ul className="space-y-3">
                               {record.prescriptions.flatMap((p: any) => p.medicinesJson).map((med: any, idx: number) => (
                                 <li key={idx} className="flex items-start gap-3">
                                   <div className="w-2 h-2 rounded-full bg-primary-400 mt-1.5"></div>
                                   <div>
                                     <p className="font-bold text-slate-800">{med.name} <span className="text-slate-400 font-medium">({med.dosage})</span></p>
                                     <p className="text-sm text-slate-500">{med.timing || med.frequency} for {med.duration}</p>
                                   </div>
                                 </li>
                               ))}
                             </ul>
                           </div>
                         ) : (
                           <p className="text-sm text-slate-500 font-medium italic">No medications prescribed during this visit.</p>
                         )}
                         {record.soapNotes && (
                           <div className="mt-4 pt-4 border-t border-slate-100">
                             <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Doctor's Notes</p>
                             <p className="text-sm text-slate-600">{record.soapNotes}</p>
                           </div>
                         )}
                       </div>
                     </div>
                   ))}
                 </div>
               )}
            </div>
         </div>
         
         {/* AI Recommendations Sidebar */}
         <div className="space-y-6">
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl shadow-xl border border-slate-700 p-6 text-white relative overflow-hidden">
               <div className="absolute right-0 top-0 w-32 h-32 bg-primary-500/20 rounded-full blur-[40px]"></div>
               <div className="absolute left-0 bottom-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-[40px]"></div>
               
               <h3 className="text-lg font-black flex items-center gap-2 mb-2 relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-white to-primary-200">
                 <Bot className="w-6 h-6 text-primary-400" /> AI Lifestyle Guide
               </h3>
               
               {loading ? (
                 <div className="py-12 flex justify-center"><div className="w-6 h-6 border-3 border-primary-500 border-t-transparent rounded-full animate-spin"></div></div>
               ) : !aiRecs ? (
                 <p className="text-sm text-slate-400 font-medium">Unable to load AI recommendations at this time.</p>
               ) : (
                 <div className="relative z-10 space-y-6 mt-6">
                   <p className="text-xs font-medium text-primary-200/80 leading-relaxed italic border-l-2 border-primary-500/50 pl-3">
                     {aiRecs.notes}
                   </p>
                   
                   <div>
                     <h4 className="text-sm font-bold text-emerald-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                       🥗 Diet & Nutrition
                     </h4>
                     <ul className="space-y-3">
                       {(Array.isArray(aiRecs.diet) ? aiRecs.diet : [aiRecs.diet]).map((item: string, i: number) => (
                         <li key={i} className="text-sm text-slate-300 font-medium flex items-start gap-2">
                           <span className="text-emerald-400 mt-0.5">•</span> {item}
                         </li>
                       ))}
                     </ul>
                   </div>

                   <div className="pt-4 border-t border-slate-700/50">
                     <h4 className="text-sm font-bold text-orange-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                       🏃 Workout Plan
                     </h4>
                     <ul className="space-y-3">
                       {(Array.isArray(aiRecs.workout) ? aiRecs.workout : [aiRecs.workout]).map((item: string, i: number) => (
                         <li key={i} className="text-sm text-slate-300 font-medium flex items-start gap-2">
                           <span className="text-orange-400 mt-0.5">•</span> {item}
                         </li>
                       ))}
                     </ul>
                   </div>
                 </div>
               )}
            </div>
         </div>
      </div>
    </div>
  );
};


// Discovery & Search Page — calls real backend
const DiscoveryPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDoctors = useCallback(async (q: string) => {
    setLoading(true);
    try {
      const url = q ? `${API}/bookings/doctors/search?q=${encodeURIComponent(q)}` : `${API}/bookings/doctors/search`;
      const res = await fetch(url);
      const data = await res.json();
      setResults(data);
    } catch (e) { console.error('Failed to fetch doctors', e); }
    setLoading(false);
  }, []);

  useEffect(() => { fetchDoctors(''); }, [fetchDoctors]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    setSearchQuery(q);
    fetchDoctors(q);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      {/* Hero Search Section */}
      <div className="bg-primary-600 pb-24 pt-32 px-6 relative overflow-hidden">
         <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
             <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[150%] bg-primary-500/20 blur-[100px] rounded-full"></div>
         </div>
         <motion.div 
           initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }}
           className="max-w-4xl mx-auto relative z-10"
         >
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-8 text-center tracking-tight leading-tight">
               Find the right doctor, right now.
            </h1>
            <motion.div 
               initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.2 }}
               className="bg-white/90 backdrop-blur-xl rounded-full p-2 shadow-2xl flex items-center gap-4 relative"
            >
               <div className="flex-1 flex items-center gap-3 px-6 border-r border-slate-200">
                  <Search className="w-5 h-5 text-slate-400" />
                  <input type="text" placeholder="Symptoms, specialties, or doctor names..." className="w-full border-none bg-transparent focus:outline-none text-slate-800 placeholder-slate-400 py-4 font-medium" value={searchQuery} onChange={handleSearch} />
               </div>
               <div className="hidden md:flex flex-1 items-center gap-3 px-6">
                  <MapPin className="w-5 h-5 text-slate-400" />
                  <input type="text" placeholder="Location or Zip Code" className="search-input py-4 font-medium text-slate-800 placeholder-slate-400 bg-transparent w-full focus:outline-none" />
               </div>
               <button onClick={() => fetchDoctors(searchQuery)} className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-4 rounded-full font-bold transition-all shadow-lg hover:scale-[1.02] active:scale-95">
                 Search
               </button>
            </motion.div>
         </motion.div>
      </div>

      {/* Results Section */}
      <div className="max-w-4xl mx-auto -mt-12 px-6 pb-20 relative z-10">
         {loading ? (
           <div className="bg-white rounded-xl p-16 text-center shadow-sm border border-slate-100">
             <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-4"></div>
             <p className="text-slate-500 font-medium">Loading doctors...</p>
           </div>
         ) : (
         <motion.div 
           initial="hidden" animate="visible"
           variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }}
           className="flex flex-col gap-6"
         >
            <AnimatePresence>
            {results.map(doc => (
               <motion.div 
                  key={doc.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.4 }} whileHover={{ y: -2 }}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md border border-slate-200 p-6 transition-all"
               >
                  <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                    <div className="relative">
                       <div className="w-20 h-20 rounded-xl bg-primary-100 flex items-center justify-center text-primary-600 text-2xl font-black">
                         {doc.name.split(' ').slice(1).map((n: string) => n[0]).join('')}
                       </div>
                       <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                    </div>
                    <div className="flex-1 w-full">
                       <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-lg font-bold flex items-center gap-2 text-slate-800">{doc.name} <CheckCircle2 className="w-4 h-4 text-primary-500" /></h3>
                            <p className="text-primary-600 font-semibold mt-1">{doc.specialization} <span className="text-slate-400 mx-2">•</span> <span className="text-slate-600 font-medium">{doc.experienceYears} Years Exp.</span></p>
                          </div>
                          <div className="text-right bg-primary-50 p-3 rounded-xl border border-primary-100">
                             <p className="text-xl font-black text-primary-700">₹{doc.consultationFee}</p>
                             <p className="text-xs text-primary-600/70 uppercase tracking-wider font-bold mt-1">Fee</p>
                          </div>
                       </div>
                       
                       <div className="flex items-center gap-4 mt-4 text-sm text-slate-600">
                          {parseFloat(doc.rating) > 0 && (
                            <div className="flex items-center gap-1.5 bg-yellow-50 px-3 py-1.5 rounded-lg border border-yellow-100">
                               <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                               <span className="font-bold text-yellow-700">{doc.rating}</span>
                               <span className="text-yellow-600/70">({doc.reviewCount})</span>
                            </div>
                          )}
                          {doc.modes && (
                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100/50"><span className="font-medium">{doc.modes}</span></div>
                          )}
                       </div>

                       <div className="flex items-center justify-between mt-6 pt-5 border-t border-slate-100">
                          <div className="flex items-center gap-2 text-sm bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">
                             <Clock className="w-4 h-4 text-emerald-500" />
                             <span className="font-bold text-emerald-700">Next: {doc.nextSlot}</span>
                          </div>
                          <div className="flex gap-3">
                             <motion.button whileTap={{ scale: 0.95 }} onClick={() => navigate(`/doctor/${doc.id}`)} className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all">
                                Book Now
                             </motion.button>
                          </div>
                       </div>
                    </div>
                  </div>
               </motion.div>
            ))}
            </AnimatePresence>
            {results.length === 0 && (
               <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-xl p-16 text-center border border-slate-200 shadow-sm mt-8">
                  <AlertCircle className="w-10 h-10 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-slate-800 mb-2">No doctors found</h3>
               </motion.div>
            )}
         </motion.div>
         )}
      </div>
    </div>
  );
};

// Doctor Profile & Booking Flow — calls real backend
const DoctorProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, setAuthModalOpen, setAuthMode } = useAuth();
  const [doctor, setDoctor] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [bookingStep, setBookingStep] = useState(1);
  const [selectedMode, setSelectedMode] = useState('IN_PERSON');
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [holdData, setHoldData] = useState<any>(null);
  const [confirmedData, setConfirmedData] = useState<any>(null);
  
  const today = new Date();
  const calendarDays = Array.from({length: 7}).map((_, i) => addDays(today, i));
  const [selectedDate, setSelectedDate] = useState(calendarDays[0]);

  useEffect(() => {
    const fetchDoctor = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API}/bookings/doctors/${id}`);
        const data = await res.json();
        setDoctor(data);
      } catch (e) { console.error('Failed to fetch doctor', e); }
      setLoading(false);
    };
    fetchDoctor();
  }, [id]);

  const handleHoldSlot = async (time: string) => {
    if (!user) {
      setAuthMode('login');
      setAuthModalOpen(true);
      return;
    }
    setSelectedSlot(time);
    try {
      const res = await fetch(`${API}/bookings/hold`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId: user.id, // Using dynamically logged-in user
          doctorId: id,
          date: format(selectedDate, 'yyyy-MM-dd'),
          time,
          mode: selectedMode,
        }),
      });
      const data = await res.json();
      setHoldData(data);
      setBookingStep(2);
    } catch (e) { console.error('Failed to hold slot', e); alert('Failed to hold slot. Please try again.'); }
  };

  const handleConfirmBooking = async () => {
    if (!holdData?.appointmentId) return;
    try {
      const res = await fetch(`${API}/bookings/confirm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appointmentId: holdData.appointmentId,
          paymentMethod: 'PREPAID',
        }),
      });
      const data = await res.json();
      setConfirmedData(data);
      setBookingStep(3);
    } catch (e) { console.error('Failed to confirm booking', e); alert('Failed to confirm booking.'); }
  };

  if (loading || !doctor) return <div className="min-h-screen bg-slate-50 flex items-center justify-center"><div className="animate-spin w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full"></div></div>;

  const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');
  const daySlots = doctor.next7DaysSlots?.find((s: any) => s.date === selectedDateStr);
  const morningSessions = daySlots?.sessions?.filter((s: any) => s.type === 'MORNING') || [];
  const eveningSessions = daySlots?.sessions?.filter((s: any) => s.type === 'EVENING') || [];
  const morningSlots = morningSessions.flatMap((s: any) => s.slots || []);
  const eveningSlots = eveningSessions.flatMap((s: any) => s.slots || []);

  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-sans relative">
       <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
          <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
             <button onClick={() => navigate('/')} className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-primary-600 transition-colors">← Back</button>
             <h2 className="font-bold text-lg text-slate-800">Doctor Profile</h2>
             <div className="w-16">
               {user && (
                 <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 font-bold flex items-center justify-center text-xs border border-primary-200 mb-0">
                   {user.name && user.name[0]}
                 </div>
               )}
             </div>
          </div>
       </header>

       <div className="max-w-6xl mx-auto px-6 mt-8 flex flex-col lg:flex-row gap-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="flex-1 space-y-6">
             <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-8">
                <div className="w-32 h-32 rounded-xl bg-primary-100 flex items-center justify-center text-primary-600 text-4xl font-black flex-shrink-0">
                  {doctor.name.split(' ').slice(1).map((n: string) => n[0]).join('')}
                </div>
                <div className="text-center sm:text-left flex-1">
                   <h1 className="text-2xl font-bold text-slate-900 flex items-center justify-center sm:justify-start gap-2 mb-1">
                       {doctor.name} <CheckCircle2 className="w-5 h-5 text-primary-500" />
                   </h1>
                   <p className="text-primary-600 font-semibold text-lg mb-4">{doctor.specialization}</p>
                   <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-sm">
                      <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-lg"><Clock className="w-4 h-4 text-slate-500" /><span>{doctor.experienceYears} Years</span></div>
                   </div>
                </div>
             </div>

             <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-lg mb-3 text-slate-800">About</h3>
                <p className="text-slate-600 leading-relaxed">{doctor.about}</p>
             </div>

             <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-lg mb-4 text-slate-800">Consultation Fee</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   <div className="border border-primary-200 bg-primary-50 rounded-xl p-5">
                      <span className="font-semibold text-primary-800 block mb-1">In-Person Visit</span>
                      <span className="font-black text-2xl text-slate-900">₹{doctor.consultationFee}</span>
                   </div>
                   <div className="border border-purple-200 bg-purple-50 rounded-xl p-5">
                      <span className="font-semibold text-purple-800 block mb-1">Telemedicine</span>
                      <span className="font-black text-2xl text-slate-900">₹{(doctor.consultationFee * 0.8).toFixed(0)}</span>
                   </div>
                </div>
             </div>
          </motion.div>

          {/* Right Column: Booking Widget */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="w-full lg:w-[400px]">
             <div className="bg-white rounded-xl border border-slate-200 shadow-sm sticky top-20 overflow-hidden">
                {bookingStep === 1 && (
                  <div>
                     <div className="bg-slate-900 p-5 text-white">
                        <h3 className="font-bold text-lg flex items-center gap-2"><Calendar className="w-5 h-5 text-primary-400" /> Schedule Appointment</h3>
                     </div>
                     <div className="p-6">
                        <p className="font-semibold text-slate-800 mb-3 text-sm">1. Mode</p>
                        <div className="flex gap-3 mb-6">
                           <button onClick={() => setSelectedMode('IN_PERSON')} className={`flex-1 py-2.5 text-sm font-bold border rounded-xl transition-all ${selectedMode === 'IN_PERSON' ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}>Clinic Visit</button>
                           <button onClick={() => setSelectedMode('VIDEO')} className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold border rounded-xl transition-all ${selectedMode === 'VIDEO' ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}><Video className="w-4 h-4" /> Video</button>
                        </div>

                        <p className="font-semibold text-slate-800 mb-3 text-sm">2. Date</p>
                        <div className="flex gap-2 overflow-x-auto pb-3 snap-x">
                           {calendarDays.map((date, i) => (
                              <button key={i} onClick={() => setSelectedDate(date)} className={`snap-center flex flex-col items-center justify-center min-w-[60px] h-[70px] rounded-xl border transition-all text-sm ${selectedDate.toDateString() === date.toDateString() ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'}`}>
                                 <span className="text-[10px] font-bold uppercase tracking-wider mb-1">{format(date, 'eee')}</span>
                                 <span className="text-lg font-bold">{format(date, 'dd')}</span>
                              </button>
                           ))}
                        </div>

                        {morningSlots.length > 0 && (
                          <>
                            <p className="font-semibold text-slate-800 mb-3 mt-4 text-sm">3. Morning Slots</p>
                            <div className="grid grid-cols-3 gap-2">
                               {morningSlots.slice(0, 9).map((time: string, i: number) => (
                                   <button key={i} onClick={() => handleHoldSlot(time)} className="slot-btn slot-available text-xs">{time}</button>
                               ))}
                            </div>
                          </>
                        )}
                        {eveningSlots.length > 0 && (
                          <>
                            <p className="font-semibold text-slate-800 mb-3 mt-5 text-sm">Evening Slots</p>
                            <div className="grid grid-cols-3 gap-2">
                               {eveningSlots.slice(0, 9).map((time: string, i: number) => (
                                   <button key={i} onClick={() => handleHoldSlot(time)} className="slot-btn slot-available text-xs">{time}</button>
                               ))}
                            </div>
                          </>
                        )}
                        {daySlots && !daySlots.available && (<div className="text-center py-8 text-slate-400 text-sm font-medium">No slots available on this day</div>)}
                     </div>
                  </div>
                )}

                {bookingStep === 2 && (
                   <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="p-6">
                      <div className="bg-amber-50 border border-amber-200 text-amber-900 px-4 py-3 rounded-xl mb-6 text-sm flex items-start gap-3">
                         <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                         <div><span className="font-bold block mb-1">Slot Held!</span>Your slot on <strong>{format(selectedDate, 'MMM dd')} at {selectedSlot}</strong> is reserved for 5 minutes.</div>
                      </div>
                      <h3 className="font-bold text-lg mb-4 text-slate-800">Patient Information</h3>
                      <div className="space-y-4">
                         <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Full Name</label>
                            <input type="text" value={user?.name || ''} readOnly className="w-full border border-slate-200 bg-slate-100 rounded-xl px-4 py-2.5 outline-none font-medium text-slate-600 text-sm" />
                         </div>
                         <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Reason for visit</label>
                            <textarea className="w-full border border-slate-200 bg-slate-50 focus:bg-white focus:border-primary-500 rounded-xl px-4 py-2.5 h-20 outline-none transition-all resize-none text-sm" placeholder="E.g., Chest pain and shortness of breath..."></textarea>
                         </div>
                      </div>
                      <div className="mt-6 border-t border-dashed border-slate-200 pt-6">
                         <div className="flex justify-between items-center mb-6 bg-slate-50 p-4 rounded-xl">
                            <span className="font-semibold text-slate-600">Total Fee</span>
                            <span className="font-black text-2xl text-slate-900">₹{selectedMode === 'VIDEO' ? (doctor.consultationFee * 0.8).toFixed(0) : doctor.consultationFee}</span>
                         </div>
                         <button onClick={handleConfirmBooking} className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 rounded-xl transition-all text-sm">Pay & Confirm Booking</button>
                         <button onClick={() => setBookingStep(1)} className="w-full text-center mt-3 text-sm font-semibold text-slate-400 hover:text-slate-700 transition-colors">Cancel & Choose another slot</button>
                      </div>
                   </motion.div>
                )}

                {bookingStep === 3 && (
                   <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="p-8 text-center">
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, delay: 0.1 }} className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle2 className="w-10 h-10 text-white" /></motion.div>
                      <h2 className="text-2xl font-bold text-slate-900 mb-2">Booking Confirmed!</h2>
                      <p className="text-slate-600 mb-8">Your appointment with {doctor.name} has been scheduled.</p>
                      <div className="bg-slate-50 rounded-xl p-6 text-left border border-slate-100 mb-8">
                         <div className="flex justify-between border-b border-dashed border-slate-200 pb-4 mb-4">
                            <div><p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Token Number</p><p className="text-3xl font-black text-primary-600">#{confirmedData?.tokenNumber || '—'}</p></div>
                            <div className="text-right"><p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Time</p><p className="text-lg font-bold text-slate-800">{selectedSlot}</p></div>
                         </div>
                         <p className="text-sm text-slate-600 font-medium text-center">{format(selectedDate, 'MMM do, yyyy')} • {selectedMode === 'VIDEO' ? 'Video Call' : 'Hospital Visit'}</p>
                      </div>
                      <button onClick={() => navigate('/')} className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition-all text-sm">Back to Search</button>
                   </motion.div>
                )}
             </div>
          </motion.div>
       </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<DiscoveryPage />} />
          <Route path="/doctor/:id" element={<DoctorProfilePage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
