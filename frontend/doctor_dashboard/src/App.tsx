import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Activity, Clock, FileText, Activity as VitalsIcon, ChevronRight, LogOut, CheckCircle, Video, Bot, Play, Mic, MicOff, VideoOff, PhoneOff } from 'lucide-react';

const DoctorDashboard = () => {
  const [activeTab, setActiveTab] = useState<'queue' | 'consultation' | 'telemedicine'>('queue');
  const [videoState, setVideoState] = useState({ mic: true, cam: true });
  
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col justify-between">
        <div>
          <div className="h-16 flex items-center justify-center border-b border-white/10">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-teal-400 bg-clip-text text-transparent">
              MediFlow Dr.
            </h1>
          </div>
          <nav className="mt-6 px-4 flex flex-col gap-2">
            <button 
              onClick={() => setActiveTab('queue')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors w-full text-left ${activeTab === 'queue' ? 'bg-primary-600 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
            >
              <Activity className="w-5 h-5" />
              My Queue
            </button>
            <button 
              onClick={() => setActiveTab('consultation')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors w-full text-left ${activeTab === 'consultation' ? 'bg-primary-600 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
            >
              <FileText className="w-5 h-5" />
              In-Person Charting
            </button>
            <button 
              onClick={() => setActiveTab('telemedicine')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors w-full text-left ${activeTab === 'telemedicine' ? 'bg-primary-600 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
            >
              <Video className="w-5 h-5" />
              Telemedicine Consult
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
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            {activeTab === 'queue' && 'Waiting Room Dashboard'}
            {activeTab === 'consultation' && 'Clinical Charting Workspace'}
            {activeTab === 'telemedicine' && <><Video className="w-5 h-5 text-red-500 animate-pulse" /> Telemedicine Call</>}
          </h2>
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-3">
               <div className="w-9 h-9 bg-gradient-to-br from-primary-600 to-indigo-800 rounded-full flex items-center justify-center text-white font-bold shadow-sm">
                 SJ
               </div>
               <div className="flex flex-col">
                  <span className="font-semibold text-sm text-gray-900 leading-tight">Dr. Sarah Jenkins</span>
                  <span className="text-xs text-primary-600 font-medium">Cardiology</span>
               </div>
             </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="flex-1 overflow-y-auto p-8">
          
          {activeTab === 'queue' ? (
             <div className="max-w-4xl mx-auto">
               <div className="flex justify-between items-center mb-6">
                 <div>
                   <h3 className="text-2xl font-bold text-gray-900">Patient Queue</h3>
                   <p className="text-gray-500 mt-1">Status: Accepting patients. Avg Consultation Time: 12m</p>
                 </div>
               </div>
               
               <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                 <div className="divide-y divide-gray-100">
                   
                   {/* In Consultation */}
                   <div className="p-5 bg-blue-50/30 flex items-center justify-between relative overflow-hidden">
                     <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-500"></div>
                     <div className="flex items-center gap-4">
                       <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-blue-100 flex items-center justify-center font-bold text-xl text-blue-600">
                         42
                       </div>
                       <div>
                         <p className="text-sm text-blue-600 font-bold uppercase tracking-wider mb-0.5">In Consultation</p>
                         <h4 className="text-lg font-bold text-gray-900">John Doe</h4>
                         <p className="text-sm text-gray-500">Started 10 mins ago</p>
                       </div>
                     </div>
                     <button 
                       onClick={() => setActiveTab('consultation')}
                       className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium shadow-md shadow-blue-500/20 transition-colors flex items-center gap-2"
                     >
                       Resume Chart
                       <ChevronRight className="w-4 h-4" />
                     </button>
                   </div>

                   {/* Waiting Patient */}
                   <div className="p-5 flex items-center justify-between hover:bg-gray-50 transition-colors">
                     <div className="flex items-center gap-4">
                       <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center font-bold text-xl text-orange-600">
                         43
                       </div>
                       <div>
                         <h4 className="text-lg font-bold text-gray-900">Alice Smith</h4>
                         <div className="flex items-center gap-2 mt-0.5">
                           <span className="text-sm text-gray-500">Walk-in</span>
                           <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                           <span className="text-sm font-medium text-orange-600 flex items-center gap-1">
                             <Clock className="w-3.5 h-3.5" /> ETA: 2 mins
                           </span>
                         </div>
                       </div>
                     </div>
                     <button className="bg-white border text-gray-500 border-gray-200 hover:bg-gray-50 px-4 py-2 rounded-lg font-medium transition-colors">
                       View Profile
                     </button>
                   </div>

                 </div>
               </div>
             </div>
          ) : (
             <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left Column: EMR View */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Patient Header */}
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">John Doe</h3>
                        <p className="text-gray-500 mt-1">Male, 45 yrs • Token #42 • BP history: Elevated</p>
                      </div>
                      <div className="px-3 py-1 bg-red-100 text-red-700 font-medium text-sm rounded-lg flex gap-2 items-center">
                        <Activity className="w-4 h-4" />
                        Penicillin Allergy
                      </div>
                    </div>
                  </div>

                  {/* SOAP Notes */}
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                    <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                       <FileText className="w-5 h-5 text-primary-500" />
                       SOAP Notes
                    </h4>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Subjective (Symptoms)</label>
                        <textarea className="form-input" rows={2} placeholder="Patient complains of..."></textarea>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Objective (Findings)</label>
                        <textarea className="form-input" rows={2} placeholder="Physical examination reveals..."></textarea>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1">ICD-10 Diagnosis</label>
                          <input type="text" className="form-input" placeholder="e.g. I10 (Hypertension)" />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1">Assessment</label>
                          <input type="text" className="form-input" placeholder="Primary impression..." />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Plan (Treatment)</label>
                        <textarea className="form-input" rows={2} placeholder="Treatment plan moving forward..."></textarea>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Vitals & Actions */}
                <div className="space-y-6">
                  {/* Vitals Entry */}
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                     <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                       <VitalsIcon className="w-5 h-5 text-green-500" />
                       Today's Vitals
                     </h4>
                     <div className="grid grid-cols-2 gap-3">
                       <div>
                         <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Blood Pressure</label>
                         <input type="text" className="form-input p-2 text-sm" placeholder="120/80" />
                       </div>
                       <div>
                         <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Heart Rate</label>
                         <input type="text" className="form-input p-2 text-sm" placeholder="72 bpm" />
                       </div>
                       <div>
                         <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Temperature</label>
                         <input type="text" className="form-input p-2 text-sm" placeholder="98.6 °F" />
                       </div>
                       <div>
                         <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">SpO2</label>
                         <input type="text" className="form-input p-2 text-sm" placeholder="99 %" />
                       </div>
                     </div>
                  </div>

                  {/* Actions */}
                  <div className="bg-gradient-to-br from-primary-600 to-indigo-700 p-6 rounded-2xl shadow-lg text-white">
                     <h4 className="text-lg font-bold mb-4">Complete Consultation</h4>
                     <p className="text-primary-100 text-sm mb-6">This will finalize the EMR, send the digital prescription to the pharmacy, and update the live queue ETA.</p>
                     <button 
                       className="w-full bg-white text-primary-700 hover:bg-gray-50 py-3 rounded-xl font-bold transition-colors flex justify-center items-center gap-2 shadow-sm"
                     >
                       <CheckCircle className="w-5 h-5" />
                       Submit & Call Next
                     </button>
                  </div>
                </div>

             </div>
          )}

          {activeTab === 'telemedicine' && (
             <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-8rem)]">
                {/* Left Pane: Video Streaming (Mocked WebRTC) */}
                <div className="bg-slate-900 rounded-2xl shadow-xl overflow-hidden relative flex flex-col justify-between border border-slate-800">
                   <div className="absolute top-4 left-4 z-10 flex gap-2">
                     <span className="bg-red-500/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-2 tracking-wide">
                        <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                        LIVE
                     </span>
                     <span className="bg-black/50 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5" /> 12:45
                     </span>
                   </div>

                   {/* Main Caller View (Patient) */}
                   <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-t from-slate-900 via-slate-800 to-slate-900">
                      <div className="w-32 h-32 rounded-full bg-slate-700 flex items-center justify-center shadow-lg border-4 border-slate-600 mb-4">
                         <span className="text-4xl text-slate-400">P</span>
                      </div>
                      <h3 className="text-white text-xl font-medium">Patient: Alice Smith</h3>
                      <p className="text-slate-400 text-sm mt-1">Connecting video feed...</p>
                   </div>
                   
                   {/* Self-View (PIP mockup) */}
                   <div className="absolute top-4 border-2 border-slate-700 right-4 w-32 h-40 bg-slate-800 rounded-xl overflow-hidden shadow-2xl flex items-center justify-center">
                     <span className="text-xs text-slate-500 font-medium">Dr. Jenkins</span>
                   </div>

                   {/* WebRTC Controls Bar */}
                   <div className="bg-slate-900/95 backdrop-blur-lg border-t border-white/5 p-4 pb-6 flex justify-center gap-4 py-5">
                      <button 
                        onClick={() => setVideoState(prev => ({ ...prev, mic: !prev.mic }))}
                        className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${videoState.mic ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-red-500 text-white'}`}
                      >
                         {videoState.mic ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
                      </button>
                      
                      <button 
                        onClick={() => setVideoState(prev => ({ ...prev, cam: !prev.cam }))}
                        className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${videoState.cam ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-red-500 text-white'}`}
                      >
                         {videoState.cam ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
                      </button>

                      <button className="w-14 h-14 rounded-full flex items-center justify-center bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-900/50 transition-all">
                         <PhoneOff className="w-6 h-6" />
                      </button>
                   </div>
                </div>

                {/* Right Pane: Telemedicine Charting & AI Assessment */}
                <div className="flex flex-col gap-6 overflow-y-auto pr-2 pb-4">
                  {/* AI Risk Screener Pane */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl shadow-sm border border-blue-100">
                     <div className="flex justify-between items-center mb-4">
                       <h4 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                         <Bot className="w-6 h-6 text-primary-600" />
                         AI Health & Meta-Profile Engine
                       </h4>
                       <button className="bg-white border text-primary-600 border-primary-200 shadow-sm hover:bg-primary-50 px-4 py-1.5 rounded-lg text-sm font-bold transition-colors flex items-center gap-2">
                         <Play className="w-4 h-4 fill-primary-600" />
                         Run Fast-Predict Model
                       </button>
                     </div>
                     <p className="text-sm text-gray-600 mb-4">
                       Uses Fast-Predict Python microservice to aggregate patient vitals against known ML clinical risk indicators for Cardio and Endocrine systems.
                     </p>
                     
                     <div className="grid grid-cols-2 gap-4">
                       <div className="bg-white p-4 rounded-xl shadow-sm border border-blue-100/50">
                          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Diabetes Risk</p>
                          <div className="flex items-end gap-2">
                            <span className="text-3xl font-bold text-orange-500 tracking-tight">42.5%</span>
                            <span className="text-sm text-gray-500 font-medium pb-1.5">Elevated</span>
                          </div>
                       </div>
                       <div className="bg-white p-4 rounded-xl shadow-sm border border-blue-100/50">
                          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">CVD Risk (10yr)</p>
                          <div className="flex items-end gap-2">
                            <span className="text-3xl font-bold text-green-500 tracking-tight">14.0%</span>
                            <span className="text-sm text-gray-500 font-medium pb-1.5">Nominal</span>
                          </div>
                       </div>
                     </div>
                  </div>

                  {/* Standard Charting during call summary */}
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex-1">
                    <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                       <FileText className="w-5 h-5 text-gray-500" />
                       Tele-Consultation Notes
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Symptoms Discussed</label>
                        <textarea className="form-input" rows={3} placeholder="Live transcriber (Mocked) active..."></textarea>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">E-Prescription Draft</label>
                        <textarea className="form-input" rows={2} placeholder="Type medicine names to search..."></textarea>
                      </div>
                    </div>

                    <div className="mt-6 border-t border-gray-100 pt-6 flex justify-end">
                      <button className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2.5 rounded-lg font-bold shadow-md shadow-primary-500/20 transition-all flex items-center gap-2">
                         <CheckCircle className="w-5 h-5" />
                         Finalize Tele-visit & Send eRx
                      </button>
                    </div>
                  </div>
                </div>
             </div>
          )}

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
        <Route path="/dashboard" element={<DoctorDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
