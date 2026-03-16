import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LayoutDashboard, Users, Activity, DollarSign, Clock, Database, Server, Settings, LogOut, TrendingUp, TrendingDown } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from 'recharts';

// Mocked Data representing what the AnalyticsService Backend would return
const mockKPIs = {
  footfall: 1240,
  revenue: 84500,
  activeDoctors: 45,
  avgWaitTimeMins: 14
};

const mockDepartmentRevenue = [
  { name: 'Cardiology', revenue: 24500 },
  { name: 'Neurology', revenue: 18200 },
  { name: 'Pediatrics', revenue: 15800 },
  { name: 'Orthopedics', revenue: 12000 },
  { name: 'General', revenue: 14000 },
];

const COLORS = ['#8b5cf6', '#6366f1', '#ec4899', '#14b8a6', '#f59e0b'];

const DashboardHome = () => {
  return (
    <div className="flex bg-[#0f172a] h-screen overflow-hidden font-sans text-gray-100">
      
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-[#1e293b] flex flex-col justify-between border-r border-slate-800">
        <div>
          <div className="h-16 flex items-center justify-center border-b border-slate-800">
            <h1 className="text-xl font-bold flex items-center gap-2 text-white">
              <Activity className="w-6 h-6 text-primary-500" />
              MediFlow Admin
            </h1>
          </div>
          <nav className="mt-6 px-4 flex flex-col gap-2">
            <button className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium w-full text-left bg-primary-600/20 text-primary-400 border border-primary-500/30 shadow-inner">
              <LayoutDashboard className="w-5 h-5" />
              Overview
            </button>
            <button className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors w-full text-left text-slate-400 hover:bg-slate-800 hover:text-white">
              <Users className="w-5 h-5" />
              Staff Management
            </button>
            <button className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors w-full text-left text-slate-400 hover:bg-slate-800 hover:text-white">
              <Database className="w-5 h-5" />
              Infrastructure
            </button>
            <button className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors w-full text-left text-slate-400 hover:bg-slate-800 hover:text-white">
              <Settings className="w-5 h-5" />
              Global Settings
            </button>
          </nav>
        </div>
        <div className="p-4 border-t border-slate-800">
          <button className="flex items-center gap-3 px-4 py-3 w-full text-slate-400 hover:bg-red-500/10 hover:text-red-400 rounded-xl font-medium transition-colors text-left">
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        
        {/* Top Header */}
        <header className="h-16 bg-[#1e293b]/50 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-8 sticky top-0 z-20">
          <h2 className="text-xl font-semibold text-white tracking-wide">
            Enterprise Command Center
          </h2>
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 px-3 py-1.5 rounded-full">
               <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
               <span className="text-xs font-bold text-green-400 uppercase tracking-wider">All Systems Operational</span>
             </div>
             <div className="w-9 h-9 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold shadow-sm border border-primary-500">
               AD
             </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-8 max-w-7xl mx-auto space-y-8">
          
          {/* KPI Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
             <div className="metric-card">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-slate-400 font-medium text-sm">Today's Revenue</p>
                    <h3 className="text-3xl font-bold text-white mt-1">${mockKPIs.revenue.toLocaleString()}</h3>
                  </div>
                  <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center border border-emerald-500/30 text-emerald-400">
                    <DollarSign className="w-5 h-5" />
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                  <TrendingUp className="w-4 h-4" />
                  +12.5% from yesterday
                </div>
             </div>

             <div className="metric-card">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-slate-400 font-medium text-sm">Total Footfall</p>
                    <h3 className="text-3xl font-bold text-white mt-1">{mockKPIs.footfall.toLocaleString()}</h3>
                  </div>
                  <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center border border-blue-500/30 text-blue-400">
                    <Users className="w-5 h-5" />
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                  <TrendingUp className="w-4 h-4" />
                  +4.2% from average
                </div>
             </div>

             <div className="metric-card">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-slate-400 font-medium text-sm">Avg Wait Time</p>
                    <h3 className="text-3xl font-bold text-white mt-1">{mockKPIs.avgWaitTimeMins} <span className="text-lg text-slate-500">min</span></h3>
                  </div>
                  <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center border border-amber-500/30 text-amber-400">
                    <Clock className="w-5 h-5" />
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                  <TrendingDown className="w-4 h-4" />
                  -2 mins from yesterday
                </div>
             </div>

             <div className="metric-card">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-slate-400 font-medium text-sm">Active Doctors</p>
                    <h3 className="text-3xl font-bold text-white mt-1">{mockKPIs.activeDoctors}</h3>
                  </div>
                  <div className="w-10 h-10 bg-primary-500/20 rounded-xl flex items-center justify-center border border-primary-500/30 text-primary-400">
                    <Activity className="w-5 h-5" />
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                  <TrendingUp className="w-4 h-4" />
                  +2 doctors online
                </div>
             </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
             {/* Revenue Chart */}
             <div className="lg:col-span-2 bg-[#1e293b] border border-slate-700 p-6 rounded-2xl shadow-lg">
                <h3 className="text-lg font-bold text-white mb-6">Revenue by Department (Today)</h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mockDepartmentRevenue} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                      <XAxis dataKey="name" stroke="#94a3b8" tick={{fill: '#94a3b8', fontSize: 12}} />
                      <YAxis stroke="#94a3b8" tick={{fill: '#94a3b8', fontSize: 12}} tickFormatter={(value) => `$${value / 1000}k`} />
                      <RechartsTooltip 
                        cursor={{fill: '#334155', opacity: 0.4}}
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
                        itemStyle={{ color: '#fff' }}
                        formatter={(value: any) => [`$${Number(value).toLocaleString()}`, 'Revenue']}
                      />
                      <Bar dataKey="revenue" radius={[4, 4, 0, 0]}>
                        {mockDepartmentRevenue.map((_entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
             </div>

             {/* System Health Panel */}
             <div className="bg-[#1e293b] border border-slate-700 p-6 rounded-2xl shadow-lg flex flex-col">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <Server className="w-5 h-5 text-slate-400" />
                  System Health
                </h3>
                <div className="flex-1 flex flex-col gap-4">
                  <div className="bg-[#0f172a] p-4 rounded-xl border border-slate-800">
                     <div className="flex justify-between mb-1">
                       <span className="text-sm font-medium text-slate-300">TimescaleDB Postgres</span>
                       <span className="text-xs font-bold text-green-400">12ms</span>
                     </div>
                     <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2">
                        <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '15%' }}></div>
                     </div>
                     <p className="text-xs text-slate-500 mt-2">1.2 GB / 50 GB Used | Load: <span className="text-green-500">Low</span></p>
                  </div>

                  <div className="bg-[#0f172a] p-4 rounded-xl border border-slate-800">
                     <div className="flex justify-between mb-1">
                       <span className="text-sm font-medium text-slate-300">Redis Cache Instance</span>
                       <span className="text-xs font-bold text-green-400">3ms</span>
                     </div>
                     <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2">
                        <div className="bg-primary-500 h-1.5 rounded-full" style={{ width: '45%' }}></div>
                     </div>
                     <p className="text-xs text-slate-500 mt-2">Memory: 450 MB | Hit Rate: <span className="text-primary-400">98.2%</span></p>
                  </div>

                  <div className="bg-[#0f172a] p-4 rounded-xl border border-slate-800">
                     <div className="flex justify-between mb-1">
                       <span className="text-sm font-medium text-slate-300">WebSocket / App Node</span>
                       <span className="text-xs font-bold text-yellow-400">42ms</span>
                     </div>
                     <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2">
                        <div className="bg-yellow-500 h-1.5 rounded-full" style={{ width: '70%' }}></div>
                     </div>
                     <p className="text-xs text-slate-500 mt-2">Active Connections: 1,420 | Load: <span className="text-yellow-500">Elevated</span></p>
                  </div>
                </div>
             </div>
          </div>

        </div>
      </main>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<DashboardHome />} />
      </Routes>
    </Router>
  );
}

export default App;
