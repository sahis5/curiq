const fs = require('fs');
const path = require('path');

const dashboards = [
  {
    dir: 'doctor_dashboard',
    role: 'DOCTOR',
    title: 'Doctor Portal',
    subtitle: 'Sign in to view your queue.'
  },
  {
    dir: 'pharmacy_portal',
    role: 'STAFF',
    title: 'Pharmacy Portal',
    subtitle: 'Sign in to manage prescriptions.'
  },
  {
    dir: 'lab_portal',
    role: 'STAFF',
    title: 'Lab Portal',
    subtitle: 'Sign in to manage lab orders.'
  },
  {
    dir: 'admin_dashboard',
    role: 'STAFF',
    title: 'Admin Dashboard',
    subtitle: 'Sign in to view analytics.'
  }
];

const loginScreenComponent = (role, title, subtitle) => `
const LoginScreen = ({ onLogin, roleContext, title, subtitle }: { onLogin: (user: any) => void, roleContext: 'DOCTOR' | 'STAFF', title: string, subtitle: string }) => {
  const [email, setEmail] = require('react').useState('');
  const [password, setPassword] = require('react').useState('');
  const [error, setError] = require('react').useState('');
  const [loading, setLoading] = require('react').useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(\`\${API}/auth/staff/login\`, {
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
`;

const appWrapperPattern = (role, title, subtitle, mainComponent, dir) => `
function App() {
  const [authData, setAuthData] = require('react').useState<any>(() => {
    const saved = localStorage.getItem('medi_${dir}_auth');
    return saved ? JSON.parse(saved) : null;
  });

  if (!authData) {
    return <LoginScreen 
      onLogin={(data) => { localStorage.setItem('medi_${dir}_auth', JSON.stringify(data)); setAuthData(data); }} 
      roleContext="${role}" title="${title}" subtitle="${subtitle}" 
    />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<${mainComponent} user={authData.user} />} />
      </Routes>
    </Router>
  );
}

export default App;
`;

dashboards.forEach(d => {
  const filePath = path.join(__dirname, 'frontend', d.dir, 'src', 'App.tsx');
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Only inject if not already injected
  if (!content.includes('LoginScreen')) {
    const mainComponentMatch = content.match(/<Route path="\/dashboard" element={<([A-Za-z0-9_]+) \/>} \/>/);
    const mainComponent = mainComponentMatch ? mainComponentMatch[1] : 'Dashboard';

    // Replace the old App component
    content = content.replace(/function App\(\) \{[\s\S]*?export default App;/m, 
      loginScreenComponent(d.role, d.title, d.subtitle) + '\n' + appWrapperPattern(d.role, d.title, d.subtitle, mainComponent, d.dir)
    );

    // Modify the main component to accept `user` prop
    content = content.replace(new RegExp(`const ${mainComponent} = \\(\\) => \\{`), `const ${mainComponent} = ({ user }: { user?: any }) => {`);

    // For Doctor Dashboard specifically, handle the doc-1 replacement
    if (d.dir === 'doctor_dashboard') {
      content = content.replace(/res = await fetch\(\`\$\{API\}\/appointments\/today\?doctorId=doc-1\`\);/, 
        "const doctorId = user?.id || 'doc-1';\n        const res = await fetch(`${API}/appointments/today?doctorId=${doctorId}`);"
      );
    }
    
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${d.dir}/src/App.tsx`);
  }
});
