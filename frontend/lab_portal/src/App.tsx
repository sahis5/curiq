import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Microscope, FlaskConical, CheckCircle, Clock, LogOut, UploadCloud } from 'lucide-react';

const LabDashboard = () => {
  const [activeTab, setActiveTab] = useState<'pending' | 'completed'>('pending');
  
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col justify-between">
        <div>
          <div className="h-16 flex items-center justify-center border-b border-white/10">
            <h1 className="text-2xl font-bold flex items-center gap-2 text-primary-400">
              <Microscope className="w-6 h-6" />
              MediLab
            </h1>
          </div>
          <nav className="mt-6 px-4 flex flex-col gap-2">
            <button 
              onClick={() => setActiveTab('pending')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors w-full text-left ${activeTab === 'pending' ? 'bg-primary-600 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
            >
              <Clock className="w-5 h-5" />
              Pending Tests
            </button>
            <button 
              onClick={() => setActiveTab('completed')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors w-full text-left ${activeTab === 'completed' ? 'bg-primary-600 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
            >
              <CheckCircle className="w-5 h-5" />
              Completed Results
            </button>
          </nav>
        </div>
        <div className="p-4 border-t border-white/10">
          <button className="flex items-center gap-3 px-4 py-3 w-full text-slate-400 hover:bg-red-500/10 hover:text-red-400 rounded-xl font-medium transition-colors text-left">
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative overflow-hidden bg-[#f8fafc]">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-10 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800">
            {activeTab === 'pending' ? 'Live Order Feed' : 'Uploaded Results'}
          </h2>
          <div className="flex items-center gap-3">
             <div className="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold shadow-sm">
               LT
             </div>
             <div className="flex flex-col">
                <span className="font-semibold text-sm text-gray-900 leading-tight">Central Lab</span>
                <span className="text-xs text-primary-600 font-medium">Technician: Sarah</span>
             </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="flex-1 overflow-y-auto p-8">
          
          <div className="max-w-5xl mx-auto">
             <div className="flex justify-between items-center mb-6">
               <div>
                 <h3 className="text-2xl font-bold text-gray-900">Lab Orders Queue</h3>
                 <p className="text-gray-500 mt-1">Samples mapped to Patient EMR tracking numbers.</p>
               </div>
             </div>

             {/* Order Card */}
             <div className="bg-white rounded-2xl shadow-sm border border-orange-100 overflow-hidden mb-6">
               {/* Patient Info Bar */}
               <div className="bg-orange-50/50 p-5 border-b border-orange-100 flex justify-between items-center">
                 <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-orange-100 flex items-center justify-center font-bold text-gray-400">
                     <FlaskConical className="w-6 h-6 text-primary-600" />
                   </div>
                   <div>
                     <div className="flex gap-2 items-center mb-0.5">
                       <h4 className="text-lg font-bold text-gray-900">Alice Smith</h4>
                       <span className="px-3 py-1 bg-red-100 text-red-800 text-xs font-bold rounded-full uppercase tracking-wider">URGENT (STAT)</span>
                     </div>
                     <p className="text-sm text-gray-500 font-medium tracking-wide">
                        LAB-20260315-1102
                     </p>
                   </div>
                 </div>
                 <div className="text-right">
                    <p className="text-sm text-gray-500 font-medium mb-1">Ordered By</p>
                    <p className="text-sm font-bold text-gray-900">Dr. Sarah Jenkins</p>
                 </div>
               </div>
               
               {/* Test List & Upload Action */}
               <div className="p-6">
                 
                 <div className="border border-gray-100 rounded-xl overflow-hidden shadow-sm mb-6">
                   <table className="w-full text-left text-sm text-gray-500">
                     <thead className="bg-gray-50 text-gray-700 font-bold uppercase text-xs">
                       <tr>
                         <th className="px-6 py-3 border-b border-gray-100">Test Name</th>
                         <th className="px-6 py-3 border-b border-gray-100">Sample Type</th>
                         <th className="px-6 py-3 border-b border-gray-100">Status</th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-gray-50 font-medium">
                       <tr className="hover:bg-gray-50/50">
                         <td className="px-6 py-4 text-gray-900">Comprehensive Metabolic Panel (CMP)</td>
                         <td className="px-6 py-4">Blood Serum</td>
                         <td className="px-6 py-4 text-orange-600">Sample Pending</td>
                       </tr>
                     </tbody>
                   </table>
                 </div>

                 {/* Upload Actions */}
                 <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-50 p-4 rounded-xl border border-gray-100 gap-4">
                    <div className="flex items-center gap-3">
                      <button className="bg-white border text-gray-700 border-gray-200 hover:bg-gray-50 px-5 py-2.5 rounded-lg font-medium shadow-sm transition-colors flex items-center gap-2">
                        <UploadCloud className="w-4 h-4" />
                        Attach PDF Result
                      </button>
                      
                      <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-red-600 p-2 rounded hover:bg-red-50 transition-colors">
                        <input type="checkbox" className="w-4 h-4 text-red-600 focus:ring-red-500 border-gray-300 rounded" />
                        Flag as Critical Value!
                      </label>
                    </div>

                    <button className="w-full sm:w-auto bg-primary-600 hover:bg-primary-700 text-white px-6 py-2.5 rounded-lg font-bold shadow-md shadow-primary-500/20 transition-all flex items-center justify-center gap-2">
                       <CheckCircle className="w-5 h-5" />
                       Submit Results
                    </button>
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
        <Route path="/dashboard" element={<LabDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
