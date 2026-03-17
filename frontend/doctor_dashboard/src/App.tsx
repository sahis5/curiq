import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Activity, Clock, FileText, Activity as VitalsIcon, ChevronRight, LogOut, CheckCircle, Video, Bot, Play, Mic, MicOff, VideoOff, PhoneOff, Pill } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API = 'http://localhost:3000';

const DoctorDashboard = ({ user, handleLogout }: { user?: any; handleLogout: () => void }) => {
  const [activeTab, setActiveTab] = useState<'queue' | 'consultation' | 'telemedicine'>('queue');
  const [videoState, setVideoState] = useState({ mic: true, cam: true });
  const [appointments, setAppointments] = useState<any[]>([]);
  const [currentDoctor, setCurrentDoctor] = useState<any>(null);
  
  // Charting form state
  const [subjective, setSubjective] = useState('');
  const [objective, setObjective] = useState('');
  const [icd10, setIcd10] = useState('');
  const [assessment, setAssessment] = useState('');
  const [plan, setPlan] = useState('');
  const [bp, setBp] = useState('');
  const [hr, setHr] = useState('');
  const [temp, setTemp] = useState('');
  const [spo2, setSpo2] = useState('');
  const [rxName, setRxName] = useState('');
  const [rxDosage, setRxDosage] = useState('');
  const [rxFrequency, setRxFrequency] = useState('');
  const [rxDuration, setRxDuration] = useState('');
  const [medicines, setMedicines] = useState<any[]>([]);
  const [labRequired, setLabRequired] = useState(false);
  const [labTestName, setLabTestName] = useState('');
  const [labUrgency, setLabUrgency] = useState('ROUTINE');
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    const fetchQueue = async () => {
      try {
        const doctorId = user?.id || 'doc-1';
        const res = await fetch(`${API}/appointments/today?doctorId=${doctorId}`);
        const data = await res.json();
        setAppointments(data);
        if (data.length > 0) setCurrentDoctor(data[0].doctor);
      } catch (e) { console.error(e); }
    };
    fetchQueue();
    const interval = setInterval(fetchQueue, 5000);
    return () => clearInterval(interval);
  }, [user]);

  const doctorName = user?.name || currentDoctor?.name || 'Doctor';
  const doctorSpec = currentDoctor?.specialization || 'General';
  const initials = doctorName.split(' ').slice(1).map((n: string) => n[0]).join('');
  const firstPatient = appointments[0];
  const waitingPatients = appointments.slice(1);

  const addMedicine = () => {
    if (!rxName || !rxDosage) return;
    setMedicines(prev => [...prev, { name: rxName, dosage: rxDosage, frequency: rxFrequency || 'Once daily', duration: rxDuration || '7 days' }]);
    setRxName(''); setRxDosage(''); setRxFrequency(''); setRxDuration('');
  };

  const removeMedicine = (idx: number) => {
    setMedicines(prev => prev.filter((_, i) => i !== idx));
  };

  const resetForm = () => {
    setSubjective(''); setObjective(''); setIcd10(''); setAssessment(''); setPlan('');
    setBp(''); setHr(''); setTemp(''); setSpo2('');
    setMedicines([]); setRxName(''); setRxDosage(''); setRxFrequency(''); setRxDuration('');
    setLabRequired(false); setLabTestName(''); setLabUrgency('ROUTINE');
    setSubmitSuccess(false);
  };

  const handleSubmitConsultation = async () => {
    if (!firstPatient) return;
    setSubmitting(true);
    
    try {
      const soapNotes = `S: ${subjective}\nO: ${objective}\nA: ${assessment}\nP: ${plan}`;
      const vitalsJson = { bp, hr: parseInt(hr) || 0, temp: parseFloat(temp) || 0, spo2: parseInt(spo2) || 0 };

      // 1. Create EMR Record
      const emrRes = await fetch(`${API}/emr`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId: firstPatient.patientId,
          doctorId: user?.id || firstPatient.doctorId,
          appointmentId: firstPatient.id,
          soapNotes,
          vitalsJson,
          icd10Codes: icd10 ? [icd10] : []
        })
      });
      const emrData = await emrRes.json();

      // 2. Create Prescription (if medicines added)
      if (medicines.length > 0) {
        await fetch(`${API}/prescriptions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ emrRecordId: emrData.id, medicines })
        });
      }

      // 3. Create Lab Order (only if checkbox is checked)
      if (labRequired && labTestName) {
        await fetch(`${API}/lab`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ emrRecordId: emrData.id, testName: labTestName, urgency: labUrgency })
        });
      }

      // 4. Mark Appointment as COMPLETED
      await fetch(`${API}/appointments/${firstPatient.id}/complete`, { method: 'PATCH' });

      setSubmitSuccess(true);
      // After 1.5s, reset the form and switch back to queue
      setTimeout(() => {
        resetForm();
        setActiveTab('queue');
      }, 1500);

    } catch (e) {
      console.error('Failed to submit consultation:', e);
      alert('Failed to submit. Please try again.');
    }
    setSubmitting(false);
  };
  
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Sidebar */}
      <motion.aside 
        initial={{ x: -250 }}
        animate={{ x: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="w-60 bg-slate-900 text-white flex flex-col justify-between z-20"
      >
        <div>
          <div className="h-14 flex items-center justify-center border-b border-white/10">
            <h1 className="text-lg font-bold text-primary-400">Curiq</h1>
          </div>
          <nav className="mt-4 px-3 flex flex-col gap-1">
            <button onClick={() => setActiveTab('queue')} className={`flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium text-sm w-full text-left ${activeTab === 'queue' ? 'bg-primary-600 text-white' : 'text-slate-400 hover:bg-white/5'}`}>
              <Activity className="w-4 h-4" /> My Queue
            </button>
            <button onClick={() => setActiveTab('consultation')} className={`flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium text-sm w-full text-left ${activeTab === 'consultation' ? 'bg-primary-600 text-white' : 'text-slate-400 hover:bg-white/5'}`}>
              <FileText className="w-4 h-4" /> Charting
            </button>
            <button onClick={() => setActiveTab('telemedicine')} className={`flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium text-sm w-full text-left ${activeTab === 'telemedicine' ? 'bg-primary-600 text-white' : 'text-slate-400 hover:bg-white/5'}`}>
              <Video className="w-4 h-4" /> Telemedicine
            </button>
          </nav>
        </div>
        <div className="p-3 border-t border-white/10">
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2.5 w-full text-slate-400 hover:bg-red-500/10 hover:text-red-400 rounded-lg font-medium text-sm">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-10">
          <h2 className="text-lg font-bold text-slate-800">
            {activeTab === 'queue' && 'Waiting Room'}
            {activeTab === 'consultation' && 'Charting'}
            {activeTab === 'telemedicine' && 'Telemedicine'}
          </h2>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">{initials}</div>
            <div className="flex flex-col">
               <span className="font-semibold text-sm text-gray-900 leading-tight">{doctorName}</span>
               <span className="text-xs text-primary-600 font-medium">{doctorSpec}</span>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
          {activeTab === 'queue' && (
             <motion.div key="queue" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="max-w-3xl mx-auto">
               <div className="flex justify-between items-center mb-6">
                 <div>
                   <h3 className="text-2xl font-bold text-slate-900">Patient Queue</h3>
                   <p className="text-slate-500 text-sm mt-1">{appointments.length} patients today • Auto-refreshes</p>
                 </div>
               </div>
               
               <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                 <div className="divide-y divide-slate-100">
                   
                   {firstPatient && (
                     <div className="p-5 bg-primary-50/50 flex items-center justify-between relative">
                       <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-500"></div>
                       <div className="flex items-center gap-4 ml-2">
                         <div className="w-12 h-12 bg-white rounded-xl border border-primary-200 flex items-center justify-center font-bold text-xl text-primary-600">
                           {firstPatient.tokenNumber}
                         </div>
                         <div>
                           <p className="text-xs text-primary-600 font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-pulse"></span>
                              {firstPatient.queueToken?.status === 'IN_CONSULTATION' ? 'In Consultation' : 'Next Up'}
                           </p>
                           <h4 className="text-lg font-bold text-slate-900">{firstPatient.patient.name}</h4>
                           <p className="text-sm text-slate-500">{new Date(firstPatient.slotTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {firstPatient.consultationMode}</p>
                         </div>
                       </div>
                       <button onClick={() => setActiveTab('consultation')} className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all">
                         Start Chart <ChevronRight className="w-4 h-4" />
                       </button>
                     </div>
                   )}

                   {waitingPatients.map((apt: any, idx: number) => (
                     <div key={apt.id} className="p-5 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                       <div className="flex items-center gap-4 ml-2">
                         <div className="w-10 h-10 bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-center font-bold text-slate-600">
                           {apt.tokenNumber}
                         </div>
                         <div>
                           <h4 className="font-semibold text-slate-800">{apt.patient.name}</h4>
                           <div className="flex items-center gap-2 mt-1">
                             <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">{apt.bookingChannel}</span>
                             <span className="text-sm text-amber-600 font-semibold flex items-center gap-1">
                               <Clock className="w-3.5 h-3.5" /> ETA: {(idx + 1) * Math.round((currentDoctor?.avgConsultationTime || 600) / 60)}m
                             </span>
                           </div>
                         </div>
                       </div>
                       <button className="text-sm font-semibold text-slate-500 hover:text-primary-600">View</button>
                     </div>
                   ))}

                   {appointments.length === 0 && (
                     <div className="p-12 text-center text-slate-400">
                       <Activity className="w-8 h-8 mx-auto mb-3 opacity-50" />
                       <p className="font-semibold">No patients in queue</p>
                     </div>
                   )}
                 </div>
               </div>
             </motion.div>
          )}

          {activeTab === 'consultation' && (
             <motion.div key="consultation" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {submitSuccess ? (
                  <div className="lg:col-span-3 flex flex-col items-center justify-center py-20">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }} className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-6">
                      <CheckCircle className="w-10 h-10 text-white" />
                    </motion.div>
                    <h2 className="text-2xl font-bold text-slate-900">Consultation Saved!</h2>
                    <p className="text-slate-500 mt-2">EMR, prescriptions, and lab orders have been synced. Returning to queue...</p>
                  </div>
                ) : (
                  <>
                {/* Left: EMR */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{firstPatient?.patient?.name || 'No Patient'}</h3>
                        <p className="text-gray-500 mt-1">{firstPatient ? `Token #${firstPatient.tokenNumber} • ${firstPatient.consultationMode}` : 'Select a patient from the queue'}</p>
                      </div>
                      {firstPatient?.patient?.allergies && (
                        <div className="px-3 py-1 bg-red-100 text-red-700 font-medium text-xs rounded-lg flex gap-1.5 items-center">
                          <Activity className="w-3.5 h-3.5" /> {firstPatient.patient.allergies}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                       <FileText className="w-5 h-5 text-primary-500" /> SOAP Notes
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Subjective (Symptoms)</label>
                        <textarea className="form-input" rows={2} placeholder="Patient complains of..." value={subjective} onChange={e => setSubjective(e.target.value)}></textarea>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Objective (Findings)</label>
                        <textarea className="form-input" rows={2} placeholder="Physical examination reveals..." value={objective} onChange={e => setObjective(e.target.value)}></textarea>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1">ICD-10 Diagnosis</label>
                          <input type="text" className="form-input" placeholder="e.g. I10 (Hypertension)" value={icd10} onChange={e => setIcd10(e.target.value)} />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1">Assessment</label>
                          <input type="text" className="form-input" placeholder="Impression..." value={assessment} onChange={e => setAssessment(e.target.value)} />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Plan (Treatment)</label>
                        <textarea className="form-input" rows={2} placeholder="Treatment plan..." value={plan} onChange={e => setPlan(e.target.value)}></textarea>
                      </div>
                    </div>
                  </div>

                  {/* Prescription Builder */}
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Pill className="w-5 h-5 text-emerald-500" /> E-Prescription
                    </h4>
                    {medicines.length > 0 && (
                      <div className="mb-4 space-y-2">
                        {medicines.map((med, idx) => (
                          <div key={idx} className="flex items-center justify-between bg-emerald-50 border border-emerald-100 rounded-lg px-4 py-2.5">
                            <div>
                              <span className="font-bold text-slate-800">{med.name}</span>
                              <span className="text-slate-400 mx-2">•</span>
                              <span className="text-sm text-slate-600">{med.dosage}, {med.frequency}, {med.duration}</span>
                            </div>
                            <button onClick={() => removeMedicine(idx)} className="text-red-400 hover:text-red-600 font-bold text-sm">✕</button>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="grid grid-cols-4 gap-3">
                      <input type="text" className="form-input text-sm" placeholder="Medicine name" value={rxName} onChange={e => setRxName(e.target.value)} />
                      <input type="text" className="form-input text-sm" placeholder="Dosage (e.g. 500mg)" value={rxDosage} onChange={e => setRxDosage(e.target.value)} />
                      <input type="text" className="form-input text-sm" placeholder="Frequency" value={rxFrequency} onChange={e => setRxFrequency(e.target.value)} />
                      <input type="text" className="form-input text-sm" placeholder="Duration" value={rxDuration} onChange={e => setRxDuration(e.target.value)} />
                    </div>
                    <button onClick={addMedicine} className="mt-3 text-sm font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
                      + Add Medicine
                    </button>
                  </div>
                </div>

                {/* Right: Vitals & Actions */}
                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                     <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                       <VitalsIcon className="w-5 h-5 text-green-500" /> Vitals
                     </h4>
                     <div className="grid grid-cols-2 gap-3">
                       <div>
                         <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">BP</label>
                         <input type="text" className="form-input p-2 text-sm" placeholder="120/80" value={bp} onChange={e => setBp(e.target.value)} />
                       </div>
                       <div>
                         <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">HR</label>
                         <input type="text" className="form-input p-2 text-sm" placeholder="72 bpm" value={hr} onChange={e => setHr(e.target.value)} />
                       </div>
                       <div>
                         <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">Temp</label>
                         <input type="text" className="form-input p-2 text-sm" placeholder="98.6 °F" value={temp} onChange={e => setTemp(e.target.value)} />
                       </div>
                       <div>
                         <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">SpO2</label>
                         <input type="text" className="form-input p-2 text-sm" placeholder="99 %" value={spo2} onChange={e => setSpo2(e.target.value)} />
                       </div>
                     </div>
                  </div>

                  {/* Lab Test Checkbox */}
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <label className="flex items-center gap-3 cursor-pointer mb-4">
                      <input type="checkbox" checked={labRequired} onChange={e => setLabRequired(e.target.checked)} className="w-5 h-5 rounded border-slate-300 text-primary-600 focus:ring-primary-500" />
                      <span className="font-bold text-gray-900">Lab Test Required</span>
                    </label>
                    {labRequired && (
                      <div className="space-y-3 border-t border-slate-100 pt-4">
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">Test Name</label>
                          <input type="text" className="form-input text-sm" placeholder="e.g. Lipid Panel, CBC" value={labTestName} onChange={e => setLabTestName(e.target.value)} />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">Urgency</label>
                          <select className="form-input text-sm" value={labUrgency} onChange={e => setLabUrgency(e.target.value)}>
                            <option value="ROUTINE">Routine</option>
                            <option value="URGENT">Urgent</option>
                            <option value="STAT">STAT (Immediate)</option>
                          </select>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="bg-primary-600 p-6 rounded-xl text-white">
                     <h4 className="font-bold text-lg mb-3">Complete Consultation</h4>
                     <p className="text-primary-100 text-sm mb-6">Finalize EMR, send prescription to pharmacy{labRequired ? ', send lab order to lab,' : ''} and advance the queue.</p>
                     <button onClick={handleSubmitConsultation} disabled={submitting || !firstPatient} className="w-full bg-white text-primary-700 hover:bg-slate-50 py-3 rounded-xl font-bold flex justify-center items-center gap-2 transition-colors disabled:opacity-50">
                       {submitting ? <div className="w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div> : <><CheckCircle className="w-5 h-5" /> Submit & Call Next</>}
                     </button>
                  </div>
                </div>
                  </>
                )}
             </motion.div>
          )}

          {activeTab === 'telemedicine' && (
             <motion.div key="telemedicine" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-6rem)]">
                {/* Video */}
                <div className="bg-slate-900 rounded-xl shadow-xl overflow-hidden relative flex flex-col justify-between border border-slate-800">
                   <div className="absolute top-4 left-4 z-10 flex gap-2">
                     <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span> LIVE
                     </span>
                     <span className="bg-black/50 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1.5">
                        <Clock className="w-3 h-3" /> 12:45
                     </span>
                   </div>
                   <div className="flex-1 flex flex-col items-center justify-center">
                      <div className="w-24 h-24 rounded-full bg-slate-700 flex items-center justify-center border-2 border-slate-600 mb-3">
                         <span className="text-3xl text-slate-400">P</span>
                      </div>
                      <h3 className="text-white text-lg font-medium">Patient: {firstPatient?.patient?.name || 'Waiting...'}</h3>
                      <p className="text-slate-400 text-sm mt-1">Connecting video feed...</p>
                   </div>
                   <div className="absolute top-4 right-4 w-28 h-36 bg-slate-800 rounded-lg border border-slate-700 flex items-center justify-center">
                     <span className="text-xs text-slate-500">{doctorName}</span>
                   </div>
                   <div className="bg-slate-900 border-t border-white/5 p-4 flex justify-center gap-3">
                      <button onClick={() => setVideoState(prev => ({ ...prev, mic: !prev.mic }))} className={`w-12 h-12 rounded-full flex items-center justify-center ${videoState.mic ? 'bg-slate-800 text-white' : 'bg-red-500 text-white'}`}>
                        {videoState.mic ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                      </button>
                      <button onClick={() => setVideoState(prev => ({ ...prev, cam: !prev.cam }))} className={`w-12 h-12 rounded-full flex items-center justify-center ${videoState.cam ? 'bg-slate-800 text-white' : 'bg-red-500 text-white'}`}>
                        {videoState.cam ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                      </button>
                      <button className="w-12 h-12 rounded-full flex items-center justify-center bg-red-600 text-white">
                         <PhoneOff className="w-5 h-5" />
                      </button>
                   </div>
                </div>

                {/* AI + Notes */}
                <div className="flex flex-col gap-4 overflow-y-auto">
                  <div className="bg-primary-50 p-5 rounded-xl border border-primary-100">
                     <div className="flex justify-between items-center mb-3">
                       <h4 className="font-bold text-gray-900 flex items-center gap-2">
                         <Bot className="w-5 h-5 text-primary-600" /> AI Risk Engine
                       </h4>
                       <button className="bg-white border border-primary-200 text-primary-600 px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5">
                         <Play className="w-3 h-3 fill-primary-600" /> Run Model
                       </button>
                     </div>
                     <div className="grid grid-cols-2 gap-3">
                       <div className="bg-white p-3 rounded-lg border border-primary-100/50">
                          <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Diabetes Risk</p>
                          <span className="text-2xl font-bold text-orange-500">42.5%</span>
                       </div>
                       <div className="bg-white p-3 rounded-lg border border-primary-100/50">
                          <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">CVD Risk</p>
                          <span className="text-2xl font-bold text-green-500">14.0%</span>
                       </div>
                     </div>
                  </div>

                  <div className="bg-white p-5 rounded-xl border border-slate-200 flex-1">
                    <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                       <FileText className="w-4 h-4 text-slate-500" /> Tele-Consultation Notes
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Symptoms</label>
                        <textarea className="form-input text-sm" rows={3} placeholder="Live transcriber active..."></textarea>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">E-Prescription</label>
                        <textarea className="form-input text-sm" rows={2} placeholder="Type medicines..."></textarea>
                      </div>
                    </div>
                    <div className="mt-4 border-t border-slate-100 pt-4 flex justify-end">
                      <button className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2 rounded-lg font-bold text-sm flex items-center gap-2">
                         <CheckCircle className="w-4 h-4" /> Finalize & Send eRx
                      </button>
                    </div>
                  </div>
                </div>
             </motion.div>
          )}
          </AnimatePresence>
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
    const saved = localStorage.getItem('medi_doctor_auth');
    return saved ? JSON.parse(saved) : null;
  });

  const handleLogout = () => {
    localStorage.removeItem('medi_doctor_auth');
    setAuthData(null);
  };

  if (!authData) {
    return <LoginScreen 
      onLogin={(data) => { localStorage.setItem('medi_doctor_auth', JSON.stringify(data)); setAuthData(data); }} 
      roleContext="DOCTOR" title="Doctor Portal" subtitle="Sign in to view your queue." 
    />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<DoctorDashboard user={authData.user} handleLogout={handleLogout} />} />
      </Routes>
    </Router>
  );
}

export default App;
