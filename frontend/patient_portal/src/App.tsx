import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useParams } from 'react-router-dom';
import { Search, MapPin, Star, Clock, Video, CheckCircle2, AlertCircle, Calendar } from 'lucide-react';
import { format, addDays } from 'date-fns';

// Mocked Data from the Backend `BookingService`
const mockDoctors = [
  {
    id: 'doc-1',
    name: 'Dr. Sarah Jenkins',
    specialization: 'Cardiology',
    hospital: 'MediFlow Central',
    experienceYears: 12,
    consultationFee: 150.00,
    rating: '4.8',
    reviewCount: 342,
    modes: 'IN_PERSON, VIDEO',
    nextSlot: 'Today, 02:30 PM',
    imageUrl: 'https://i.pravatar.cc/150?u=sarah',
    about: 'Dr. Jenkins specializes in preventative cardiology and heart failure management with over a decade of clinical experience.',
  },
  {
    id: 'doc-2',
    name: 'Dr. Michael Chen',
    specialization: 'Dermatology',
    hospital: 'Downtown Clinic',
    experienceYears: 8,
    consultationFee: 100.00,
    rating: '4.9',
    reviewCount: 128,
    modes: 'VIDEO',
    nextSlot: 'Tomorrow, 10:00 AM',
    imageUrl: 'https://i.pravatar.cc/150?u=michael',
    about: 'Expert in clinical dermatology, specializing in acne treatment, skin cancer screening, and cosmetic procedures.'
  }
];

// Discovery & Search Page
const DiscoveryPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState(mockDoctors);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    setSearchQuery(q);
    if (!q) {
      setResults(mockDoctors);
    } else {
      setResults(mockDoctors.filter(d => 
        d.name.toLowerCase().includes(q.toLowerCase()) || 
        d.specialization.toLowerCase().includes(q.toLowerCase())
      ));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Search Section */}
      <div className="bg-primary-600 pb-24 pt-12 px-6">
         <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-extrabold text-white mb-6 text-center tracking-tight">
               Find the right doctor, right now.
            </h1>
            <div className="bg-white rounded-2xl p-2 shadow-xl flex items-center gap-4">
               <div className="flex-1 flex items-center gap-3 px-4 border-r border-slate-200">
                  <Search className="w-5 h-5 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Search doctors, specialties, or symptoms (e.g., fever, skin rash)..." 
                    className="search-input"
                    value={searchQuery}
                    onChange={handleSearch}
                  />
               </div>
               <div className="hidden md:flex flex-1 items-center gap-3 px-4">
                  <MapPin className="w-5 h-5 text-slate-400" />
                  <input type="text" placeholder="Location or Zip Code" className="search-input" />
               </div>
               <button className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-3 rounded-xl font-bold transition-colors">
                 Search
               </button>
            </div>
         </div>
      </div>

      {/* Results Section */}
      <div className="max-w-4xl mx-auto -mt-12 px-6 pb-20">
         <div className="flex flex-col gap-6">
            {results.map(doc => (
               <div key={doc.id} className="booking-card flex flex-col md:flex-row gap-6 items-start md:items-center">
                  <img src={doc.imageUrl} alt={doc.name} className="w-24 h-24 rounded-full object-cover border-4 border-primary-50" />
                  <div className="flex-1">
                     <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-xl font-bold flex items-center gap-2">
                             {doc.name} 
                             <CheckCircle2 className="w-4 h-4 text-primary-500" />
                          </h3>
                          <p className="text-primary-600 font-medium">{doc.specialization} • {doc.experienceYears} Years Exp.</p>
                        </div>
                        <div className="text-right">
                           <p className="text-lg font-bold">${doc.consultationFee}</p>
                           <p className="text-xs text-slate-500">Consultation Fee</p>
                        </div>
                     </div>
                     
                     <div className="flex items-center gap-4 mt-3 text-sm text-slate-600">
                        <div className="flex items-center gap-1">
                           <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                           <span className="font-bold">{doc.rating}</span>
                           <span>({doc.reviewCount} reviews)</span>
                        </div>
                        <div className="flex items-center gap-1">
                           <MapPin className="w-4 h-4" />
                           {doc.hospital}
                        </div>
                     </div>

                     <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100">
                        <div className="flex items-center gap-2 text-sm">
                           <Clock className="w-4 h-4 text-emerald-500" />
                           <span className="font-medium text-emerald-600">Next Slot: {doc.nextSlot}</span>
                        </div>
                        <div className="flex gap-3">
                           {doc.modes.includes('VIDEO') && (
                             <span className="flex items-center gap-1 text-xs font-semibold px-2 py-1 bg-purple-50 text-purple-600 rounded-md">
                               <Video className="w-3 h-3" /> Telemedicine
                             </span>
                           )}
                           <button 
                              onClick={() => navigate(`/doctor/${doc.id}`)}
                              className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2 rounded-xl text-sm font-bold transition-colors shadow-sm"
                           >
                              Book Appointment
                           </button>
                        </div>
                     </div>
                  </div>
               </div>
            ))}

            {results.length === 0 && (
               <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
                  <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-slate-700">No doctors found</h3>
                  <p className="text-slate-500">Try adjusting your symptoms or specialty search.</p>
               </div>
            )}
         </div>
      </div>
    </div>
  );
};

// Doctor Profile & Booking Flow
const DoctorProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const doctor = mockDoctors.find(d => d.id === id) || mockDoctors[0];

  const [bookingStep, setBookingStep] = useState(1); // 1: Profile/Slots, 2: Patient Details, 3: Confirmation
  const [selectedMode, setSelectedMode] = useState('IN_PERSON');
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  
  // Generate mock 7 day calendar
  const today = new Date();
  const calendarDays = Array.from({length: 7}).map((_, i) => addDays(today, i));
  const [selectedDate, setSelectedDate] = useState(calendarDays[0]);

  const mockTimeSlots = ['09:00 AM', '09:15 AM', '09:30 AM', '10:00 AM', '10:15 AM', '11:30 AM'];

  const handleHoldSlot = (time: string) => {
     setSelectedSlot(time);
     setBookingStep(2); // Move to patient details
  };

  const handleConfirmBooking = () => {
     setBookingStep(3); // Confirmation
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
       {/* Header */}
       <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
          <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
             <button onClick={() => navigate('/')} className="text-sm font-bold text-slate-500 hover:text-slate-900">
                ← Back to Search
             </button>
             <h2 className="font-bold text-lg text-slate-800">Doctor Profile</h2>
             <div className="w-8"></div>
          </div>
       </header>

       <div className="max-w-5xl mx-auto px-6 mt-8 flex flex-col lg:flex-row gap-8">
          
          {/* Left Column: Doctor Details */}
          <div className="flex-1 space-y-6">
             <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-6">
                <img src={doctor.imageUrl} className="w-32 h-32 rounded-2xl object-cover shadow-sm" alt={doctor.name} />
                <div>
                   <h1 className="text-2xl font-extrabold flex items-center gap-2">
                       {doctor.name} <CheckCircle2 className="w-5 h-5 text-primary-500" />
                   </h1>
                   <p className="text-primary-600 font-medium text-lg mt-1">{doctor.specialization}</p>
                   <div className="flex items-center gap-4 mt-4 text-sm text-slate-600">
                      <div className="flex items-center gap-1 bg-yellow-50 text-yellow-700 px-2 py-1 rounded-md font-bold">
                         <Star className="w-4 h-4 fill-yellow-400" /> {doctor.rating}
                      </div>
                      <span className="font-medium">{doctor.experienceYears} Years Experience</span>
                      <span>{doctor.hospital}</span>
                   </div>
                </div>
             </div>

             <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-lg mb-3">About the Doctor</h3>
                <p className="text-slate-600 leading-relaxed">{doctor.about}</p>
             </div>

             <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-lg mb-3">Consultation Fees</h3>
                <div className="flex gap-4">
                   <div className="flex-1 border border-primary-100 bg-primary-50 rounded-xl p-4 flex justify-between items-center">
                      <span className="font-medium text-primary-800">In-Person Visit</span>
                      <span className="font-bold text-lg">${doctor.consultationFee}</span>
                   </div>
                   {doctor.modes.includes('VIDEO') && (
                     <div className="flex-1 border border-purple-100 bg-purple-50 rounded-xl p-4 flex justify-between items-center">
                        <span className="font-medium text-purple-800">Telemedicine</span>
                        <span className="font-bold text-lg">${doctor.consultationFee * 0.8}</span>
                     </div>
                   )}
                </div>
             </div>
          </div>

          {/* Right Column: Booking Widget */}
          <div className="w-full lg:w-[400px]">
             <div className="bg-white rounded-2xl border border-slate-200 shadow-lg sticky top-24 overflow-hidden">
                
                {bookingStep === 1 && (
                  <>
                     <div className="bg-slate-900 p-4 text-white">
                        <h3 className="font-bold text-lg flex items-center gap-2">
                           <Calendar className="w-5 h-5" /> Schedule Appointment
                        </h3>
                     </div>
                     <div className="p-6">
                        <p className="font-bold text-sm mb-3">1. Select Consultation Mode</p>
                        <div className="flex gap-3 mb-6">
                           <button onClick={() => setSelectedMode('IN_PERSON')} className={`flex-1 py-2 text-sm font-bold border rounded-xl transition-all ${selectedMode === 'IN_PERSON' ? 'border-primary-500 bg-primary-50 text-primary-700 ring-2 ring-primary-500/20' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                              Clinic Visit
                           </button>
                           {doctor.modes.includes('VIDEO') && (
                              <button onClick={() => setSelectedMode('VIDEO')} className={`flex-1 flex items-center justify-center gap-1 py-2 text-sm font-bold border rounded-xl transition-all ${selectedMode === 'VIDEO' ? 'border-purple-500 bg-purple-50 text-purple-700 ring-2 ring-purple-500/20' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                                 <Video className="w-4 h-4" /> Video Call
                              </button>
                           )}
                        </div>

                        <p className="font-bold text-sm mb-3">2. Select a Date</p>
                        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
                           {calendarDays.map((date, i) => (
                              <button 
                                key={i}
                                onClick={() => setSelectedDate(date)}
                                className={`flex flex-col items-center justify-center min-w-[64px] h-[72px] rounded-2xl border transition-all ${selectedDate.toDateString() === date.toDateString() ? 'bg-slate-900 border-slate-900 text-white shadow-md' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}`}
                              >
                                 <span className="text-xs font-semibold uppercase">{format(date, 'eee')}</span>
                                 <span className="text-lg font-bold">{format(date, 'dd')}</span>
                              </button>
                           ))}
                        </div>

                        <p className="font-bold text-sm mb-3 mt-2">3. Available Slots (Morning Session)</p>
                        <div className="grid grid-cols-3 gap-3">
                           {mockTimeSlots.slice(0, 3).map((time, i) => (
                               <button key={i} onClick={() => handleHoldSlot(time)} className="slot-btn slot-available">
                                  {time}
                               </button>
                           ))}
                        </div>

                        <p className="font-bold text-sm mb-3 mt-6">Afternoon Session</p>
                        <div className="grid grid-cols-3 gap-3">
                           {mockTimeSlots.slice(3).map((time, i) => (
                               <button key={i} onClick={() => handleHoldSlot(time)} className={`slot-btn ${i === 1 ? 'slot-fast' : 'slot-available'}`}>
                                  {time}
                               </button>
                           ))}
                           <button disabled className="slot-btn slot-booked">11:45 AM</button>
                        </div>
                     </div>
                  </>
                )}

                {bookingStep === 2 && (
                   <div className="p-6">
                      <div className="bg-orange-50 border border-orange-200 text-orange-800 px-4 py-3 rounded-xl mb-6 text-sm flex items-start gap-3">
                         <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                         <div>
                            <span className="font-bold block">Slot Held!</span>
                            Your slot on <strong>{format(selectedDate, 'MMM dd')} at {selectedSlot}</strong> is reserved for 5:00 minutes. Please complete your booking.
                         </div>
                      </div>

                      <h3 className="font-bold text-lg mb-4">Patient Information</h3>
                      <div className="space-y-4">
                         <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">Full Name</label>
                            <input type="text" defaultValue="John Doe" className="w-full border border-slate-300 rounded-lg px-4 py-2" />
                         </div>
                         <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">Reason for visit (Optional)</label>
                            <textarea className="w-full border border-slate-300 rounded-lg px-4 py-2 h-20" placeholder="E.g., High fever and chills..."></textarea>
                         </div>
                      </div>

                      <div className="mt-8 border-t border-slate-200 pt-6">
                         <div className="flex justify-between items-center mb-6">
                            <span className="font-bold text-lg text-slate-800">Total Fee</span>
                            <span className="font-extrabold text-2xl text-slate-900">${selectedMode === 'VIDEO' ? doctor.consultationFee * 0.8 : doctor.consultationFee}</span>
                         </div>
                         <button onClick={handleConfirmBooking} className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 rounded-xl shadow-lg transition-colors">
                            Pay & Confirm Booking
                         </button>
                         <button onClick={() => setBookingStep(1)} className="w-full text-center mt-4 text-sm font-bold text-slate-500 hover:text-slate-800">
                            Cancel
                         </button>
                      </div>
                   </div>
                )}

                {bookingStep === 3 && (
                   <div className="p-8 text-center">
                      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                         <CheckCircle2 className="w-10 h-10 text-green-500" />
                      </div>
                      <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Booking Confirmed!</h2>
                      <p className="text-slate-600 mb-8">Your appointment with {doctor.name} has been successfully scheduled.</p>
                      
                      <div className="bg-slate-50 rounded-xl p-4 text-left border border-slate-200 mb-8">
                         <div className="flex justify-between border-b border-slate-200 pb-3 mb-3">
                            <div>
                               <p className="text-xs font-bold text-slate-500 uppercase">Token Number</p>
                               <p className="text-xl font-black text-primary-600">A-24</p>
                            </div>
                            <div className="text-right">
                               <p className="text-xs font-bold text-slate-500 uppercase">Expected Time</p>
                               <p className="text-lg font-bold text-slate-800">{selectedSlot}</p>
                            </div>
                         </div>
                         <p className="text-sm text-slate-600 font-medium">{format(selectedDate, 'MMMM do, yyyy')} • {selectedMode === 'VIDEO' ? 'Telemedicine Video Call' : 'Hospital Visit'}</p>
                      </div>

                      <button onClick={() => navigate('/')} className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition-colors">
                         View Dashboard
                      </button>
                   </div>
                )}

             </div>
          </div>
       </div>

    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DiscoveryPage />} />
        <Route path="/doctor/:id" element={<DoctorProfilePage />} />
      </Routes>
    </Router>
  );
}

export default App;
