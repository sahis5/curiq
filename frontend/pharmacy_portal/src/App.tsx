import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Pill, CheckCircle, PackageOpen, LayoutGrid, Clock, LogOut, FileText, Check } from 'lucide-react';

const PharmacyDashboard = () => {
  const [activeTab, setActiveTab] = useState<'pending' | 'dispensed'>('pending');
  
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-emerald-900 text-white flex flex-col justify-between">
        <div>
          <div className="h-16 flex items-center justify-center border-b border-white/10">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Pill className="text-emerald-400 w-6 h-6" />
              MediPharmacy
            </h1>
          </div>
          <nav className="mt-6 px-4 flex flex-col gap-2">
            <button 
              onClick={() => setActiveTab('pending')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors w-full text-left ${activeTab === 'pending' ? 'bg-emerald-600 text-white' : 'text-emerald-200 hover:bg-white/5 hover:text-white'}`}
            >
              <Clock className="w-5 h-5" />
              Pending E-Rxs
            </button>
            <button 
              onClick={() => setActiveTab('dispensed')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors w-full text-left ${activeTab === 'dispensed' ? 'bg-emerald-600 text-white' : 'text-emerald-200 hover:bg-white/5 hover:text-white'}`}
            >
              <PackageOpen className="w-5 h-5" />
              Dispensed History
            </button>
            <button 
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors w-full text-left text-emerald-200 hover:bg-white/5 hover:text-white`}
            >
              <LayoutGrid className="w-5 h-5" />
              Inventory Config
            </button>
          </nav>
        </div>
        <div className="p-4 border-t border-white/10">
          <button className="flex items-center gap-3 px-4 py-3 w-full text-emerald-200 hover:bg-red-500/10 hover:text-red-400 rounded-xl font-medium transition-colors text-left">
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
            {activeTab === 'pending' ? 'Live Prescription Feed' : 'Dispensing Logs'}
          </h2>
          <div className="flex items-center gap-3">
             <div className="w-9 h-9 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold shadow-sm">
               PH
             </div>
             <div className="flex flex-col">
                <span className="font-semibold text-sm text-gray-900 leading-tight">Central Pharmacy</span>
                <span className="text-xs text-primary-600 font-medium">Pharmacist on Duty: Mike</span>
             </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="flex-1 overflow-y-auto p-8">
          
          <div className="max-w-5xl mx-auto">
             <div className="flex justify-between items-center mb-6">
               <div>
                 <h3 className="text-2xl font-bold text-gray-900">Incoming Orders</h3>
                 <p className="text-gray-500 mt-1">E-Prescriptions sent automatically from consultation rooms.</p>
               </div>
             </div>

             {/* Prescription Card */}
             <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 overflow-hidden mb-6">
               {/* Patient Info Bar */}
               <div className="bg-emerald-50/50 p-5 border-b border-emerald-100 flex justify-between items-center">
                 <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-emerald-100 flex items-center justify-center font-bold text-gray-400">
                     <FileText className="w-6 h-6 text-emerald-600" />
                   </div>
                   <div>
                     <div className="flex gap-2 items-center mb-0.5">
                       <h4 className="text-lg font-bold text-gray-900">John Doe</h4>
                       <span className="pill-badge">Male, 45 yrs</span>
                       <span className="pill-badge bg-blue-100 text-blue-800">Dr. Sarah Jenkins</span>
                     </div>
                     <p className="text-sm text-gray-500 font-medium tracking-wide">
                        PRE-20260315-0941
                     </p>
                   </div>
                 </div>
                 <div className="text-right">
                    <p className="text-sm text-gray-500 font-medium mb-1">Time Rcvd</p>
                    <p className="text-sm font-bold text-gray-900">10:45 AM (2m ago)</p>
                 </div>
               </div>
               
               {/* Medicine List */}
               <div className="p-6">
                 <div className="mb-4 flex items-center gap-2">
                   <CheckCircle className="w-5 h-5 text-emerald-500" />
                   <span className="font-semibold text-emerald-700 text-sm">Automated Drug Interaction Check: Passed (0 alerts)</span>
                 </div>
                 
                 <div className="border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                   <table className="w-full text-left text-sm text-gray-500">
                     <thead className="bg-gray-50 text-gray-700 font-bold uppercase text-xs">
                       <tr>
                         <th className="px-6 py-3 border-b border-gray-100">Medicine Name</th>
                         <th className="px-6 py-3 border-b border-gray-100">Dosage</th>
                         <th className="px-6 py-3 border-b border-gray-100">Frequency</th>
                         <th className="px-6 py-3 border-b border-gray-100">Duration</th>
                         <th className="px-6 py-3 border-b border-gray-100 text-right">Inventory</th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-gray-50 font-medium">
                       <tr className="hover:bg-gray-50/50">
                         <td className="px-6 py-4 text-gray-900">Lisinopril</td>
                         <td className="px-6 py-4">10 mg</td>
                         <td className="px-6 py-4">1-0-0 (Morning)</td>
                         <td className="px-6 py-4">30 days</td>
                         <td className="px-6 py-4 text-right text-emerald-600">In Stock (350)</td>
                       </tr>
                       <tr className="hover:bg-gray-50/50">
                         <td className="px-6 py-4 text-gray-900">Atorvastatin</td>
                         <td className="px-6 py-4">20 mg</td>
                         <td className="px-6 py-4">0-0-1 (Night)</td>
                         <td className="px-6 py-4">30 days</td>
                         <td className="px-6 py-4 text-right text-emerald-600">In Stock (120)</td>
                       </tr>
                     </tbody>
                   </table>
                 </div>

                 {/* Action Bar */}
                 <div className="mt-6 flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <div className="text-sm text-gray-600">
                      Total medicines: <strong className="text-gray-900">2</strong>
                    </div>
                    <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-lg font-bold shadow-md shadow-emerald-500/20 transition-all flex items-center gap-2">
                       <Check className="w-5 h-5" />
                       Verify & Dispense
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
        <Route path="/dashboard" element={<PharmacyDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
