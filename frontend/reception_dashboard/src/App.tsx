import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Activity, LogOut, Clock, Plus, Bell } from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      {/* Sidebar Navigation */}
      <motion.aside 
        initial={{ x: -250 }}
        animate={{ x: 0 }}
        className="w-64 bg-white border-r border-gray-200 flex flex-col justify-between"
      >
        <div>
          <div className="h-16 flex items-center justify-center border-b border-gray-200">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-teal-500 bg-clip-text text-transparent">
              MediFlow
            </h1>
          </div>
          <nav className="mt-6 px-4">
            <a href="#" className="flex items-center gap-3 px-4 py-3 bg-primary-50 text-primary-700 rounded-xl font-medium transition-colors">
              <Activity className="w-5 h-5" />
              Live Queue
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl font-medium transition-colors mt-2">
              <Users className="w-5 h-5" />
              Patients
            </a>
          </nav>
        </div>
        <div className="p-4 border-t border-gray-200">
          <button className="flex items-center gap-3 px-4 py-3 w-full text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-xl font-medium transition-colors">
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <h2 className="text-xl font-semibold text-gray-800">Live Reception Desk</h2>
          <div className="flex items-center gap-4">
             <button className="relative p-2 text-gray-400 hover:text-primary-600 transition-colors">
               <Bell className="w-6 h-6" />
               <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
             </button>
             <div className="flex items-center gap-3 border-l border-gray-200 pl-4">
               <div className="w-9 h-9 bg-gradient-to-br from-primary-400 to-teal-500 rounded-full flex items-center justify-center text-white font-bold shadow-sm">
                 R
               </div>
               <span className="font-medium text-gray-700">Receptionist Desk 1</span>
             </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-8 bg-[#f8fafc]">
          {/* Top Actions */}
          <div className="flex justify-between items-center mb-8">
             <div>
               <h3 className="text-2xl font-bold text-gray-900">Queue Monitor</h3>
               <p className="text-gray-500 mt-1">Real-time dynamic ETA updates across all departments.</p>
             </div>
             <motion.button 
               whileHover={{ scale: 1.02 }}
               whileTap={{ scale: 0.98 }}
               className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2.5 rounded-xl font-medium shadow-lg shadow-primary-500/30 flex items-center gap-2 transition-all"
             >
               <Plus className="w-5 h-5" />
               New Patient Walk-in
             </motion.button>
          </div>

          {/* Grid of Doctors/Queues */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            
            {/* Queue Card Example */}
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
            >
              <div className="p-5 border-b border-gray-50 flex justify-between items-start">
                <div>
                  <h4 className="text-lg font-bold text-gray-900">Dr. Sarah Jenkins</h4>
                  <p className="text-sm text-primary-600 font-medium">Cardiology</p>
                </div>
                <span className="bg-green-100 text-green-700 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
                  Available
                </span>
              </div>
              
              <div className="p-5 bg-gray-50/50">
                 <div className="flex justify-between items-center mb-4">
                   <div className="text-sm text-gray-500 font-medium flex items-center gap-1.5">
                     <Users className="w-4 h-4" /> 5 Waiting
                   </div>
                   <div className="text-sm text-gray-500 font-medium flex items-center gap-1.5 text-amber-600">
                     <Clock className="w-4 h-4" /> Avg: 12m
                   </div>
                 </div>
                 
                 {/* Current Patient */}
                 <div className="bg-white rounded-xl p-4 border border-blue-100 shadow-sm relative overflow-hidden mb-3">
                   <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>
                   <div className="flex justify-between items-center">
                     <div>
                       <p className="text-xs text-blue-500 font-bold uppercase tracking-wider mb-1">In Consultation</p>
                       <p className="font-semibold text-gray-900">Token #42</p>
                     </div>
                     <div className="text-right">
                       <p className="text-sm text-gray-500">Started</p>
                       <p className="font-medium text-gray-900">10:15 AM</p>
                     </div>
                   </div>
                 </div>

                 {/* Next in Line */}
                 <div className="bg-white rounded-xl p-3 border border-gray-100 flex justify-between items-center">
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-600">
                        #43
                      </div>
                      <span className="font-medium text-gray-700">Next in line</span>
                   </div>
                   <span className="text-sm font-semibold text-primary-600">ETA: 5m</span>
                 </div>
              </div>
            </motion.div>

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
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
