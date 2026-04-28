import { useState, useEffect } from 'react';
import { Search, MapPin, Star, Calendar, Clock, Video, User, Navigation, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLang } from '../context/LanguageContext';

const INITIAL_DOCTORS = [
  { id: 1, name: "Dr. Sarah Jenkins", specialty: "Cardiologist", rating: 4.9, reviews: 124, distance: "12.5 miles", available: true, image: "https://ui-avatars.com/api/?name=Sarah+Jenkins&background=0A2472&color=fff&size=128", address: "120 Heart Care Plaza, Suite 4A" },
  { id: 2, name: "Dr. Michael Chen", specialty: "General Practitioner", rating: 4.8, reviews: 312, distance: "8.2 miles", available: true, image: "https://ui-avatars.com/api/?name=Michael+Chen&background=0EAD69&color=fff&size=128", address: "550 Main St, Family Med Clinic" },
  { id: 3, name: "Dr. Emily Rodriguez", specialty: "Dermatologist", rating: 4.7, reviews: 89, distance: "15.0 miles", available: false, image: "https://ui-avatars.com/api/?name=Emily+Rodriguez&background=0A2472&color=fff&size=128", address: "89 Skin Health Ave, North Wing" },
  { id: 4, name: "Dr. James Wilson", specialty: "Neurologist", rating: 4.9, reviews: 201, distance: "20.5 miles", available: true, image: "https://ui-avatars.com/api/?name=James+Wilson&background=0EAD69&color=fff&size=128", address: "200 Brain Institute Blvd, Rm 102" },
  { id: 5, name: "Dr. Olivia Smith", specialty: "Pediatrician", rating: 4.6, reviews: 156, distance: "11.1 miles", available: true, image: "https://ui-avatars.com/api/?name=Olivia+Smith&background=0A2472&color=fff&size=128", address: "15 Childrens Way, South Tower" },
  { id: 6, name: "Dr. David Kim", specialty: "Orthopedics", rating: 4.8, reviews: 178, distance: "16.2 miles", available: true, image: "https://ui-avatars.com/api/?name=David+Kim&background=0EAD69&color=fff&size=128", address: "404 Bone & Joint Center" },
];

const Appointments = () => {
  const { t } = useLang();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [bookingStep, setBookingStep] = useState(0); 
  
  // Location States
  const [doctors, setDoctors] = useState(INITIAL_DOCTORS);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [locationSuccess, setLocationSuccess] = useState(false);

  const filteredDoctors = doctors.filter(d => 
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const detectLocation = () => {
    setIsLocating(true);
    setLocationError('');
    
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        // Simulate finding nearby doctors by randomizing distances to be very close
        setTimeout(() => {
          const nearbyDoctors = INITIAL_DOCTORS.map(doc => {
            // Generate a random distance between 0.5 and 4.0 miles
            const randomDistance = (Math.random() * 3.5 + 0.5).toFixed(1);
            return {
              ...doc,
              distance: `${randomDistance} miles`,
              // Sort value for easy sorting later
              _distVal: parseFloat(randomDistance)
            };
          }).sort((a, b) => a._distVal - b._distVal);
          
          setDoctors(nearbyDoctors);
          setIsLocating(false);
          setLocationSuccess(true);
        }, 1500); // Artificial delay to show the locating animation
      },
      (error) => {
        setLocationError('Unable to retrieve your location. Please check browser permissions.');
        setIsLocating(false);
      }
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-6">
        <div className="text-center lg:text-left mb-4 lg:mb-0">
          <h1 className="text-3xl font-bold text-medical-blue dark:text-white">{t('appointments_title')}</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">{t('appointments_sub')}</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
          {/* Geolocation Button */}
          <button 
            onClick={detectLocation}
            disabled={isLocating || locationSuccess}
            className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold transition-all border ${
              locationSuccess 
                ? 'bg-alert-success/10 text-alert-success border-alert-success/30' 
                : 'bg-white dark:bg-slate-800 text-medical-teal border-slate-200 dark:border-slate-700 hover:border-medical-teal shadow-sm'
            }`}
          >
            {isLocating ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : locationSuccess ? (
              <MapPin className="w-5 h-5" />
            ) : (
              <Navigation className="w-5 h-5" />
            )}
            {isLocating ? 'Locating...' : locationSuccess ? 'Nearby Doctors Found' : 'Detect My Location'}
          </button>

          {/* Search Bar */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 pl-10 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-medical-teal outline-none shadow-sm"
              placeholder="Search by name or specialty..."
            />
          </div>
        </div>
      </div>

      {locationError && (
        <div className="mb-6 p-4 bg-alert-danger/10 text-alert-danger border border-alert-danger/20 rounded-xl text-sm font-medium">
          {locationError}
        </div>
      )}

      <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
        {['All', 'General', 'Cardiology', 'Dermatology', 'Neurology', 'Pediatrics'].map(cat => (
          <button key={cat} className="px-5 py-2 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:border-medical-teal dark:hover:border-medical-teal whitespace-nowrap font-medium shadow-sm">
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.map((doc, idx) => (
          <motion.div 
            key={doc.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="card p-6 flex flex-col h-full hover:border-medical-teal/50 transition-colors cursor-pointer group shadow-sm hover:shadow-md"
            onClick={() => { setSelectedDoctor(doc); setBookingStep(1); }}
          >
            <div className="flex items-start gap-4 mb-4">
              <img src={doc.image} alt={doc.name} className="w-16 h-16 rounded-full object-cover border-2 border-slate-100 dark:border-slate-700 group-hover:border-medical-teal transition-colors" />
              <div>
                <h3 className="font-bold text-lg dark:text-white group-hover:text-medical-teal transition-colors">{doc.name}</h3>
                <p className="text-medical-teal text-sm font-medium">{doc.specialty}</p>
                <div className="flex items-center gap-1 mt-1 text-sm text-slate-500">
                  <Star className="w-4 h-4 text-alert-warning fill-alert-warning" />
                  <span className="font-medium text-slate-700 dark:text-slate-300">{doc.rating}</span>
                  <span>({doc.reviews})</span>
                </div>
              </div>
            </div>
            
            <div className="mt-auto space-y-3">
              <div className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400 font-medium">
                <MapPin className="w-4 h-4 text-medical-teal shrink-0 mt-0.5" /> 
                <span>
                  {doc.distance} away •{' '}
                  <a 
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(doc.address)}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="hover:text-medical-teal hover:underline transition-colors"
                  >
                    {doc.address}
                  </a>
                </span>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
                <span className={`text-sm font-bold px-3 py-1.5 rounded-lg ${doc.available ? 'bg-medical-teal/10 text-medical-teal border border-medical-teal/20' : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400 border border-slate-200 dark:border-slate-600'}`}>
                  {doc.available ? 'Available Today' : 'Next Available: Tom'}
                </span>
                <button className="btn-primary text-sm py-2 px-5 shadow-sm" onClick={(e) => { e.stopPropagation(); setSelectedDoctor(doc); setBookingStep(1); }}>
                  Book
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Booking Modal */}
      {selectedDoctor && bookingStep > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-slate-800 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-700"
          >
            {bookingStep === 1 && (
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold dark:text-white">Select Date & Time</h3>
                  <button onClick={() => setBookingStep(0)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white"><User className="w-5 h-5 hidden" /> x</button>
                </div>
                
                <div className="flex items-center gap-4 mb-6 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                  <img src={selectedDoctor.image} alt={selectedDoctor.name} className="w-12 h-12 rounded-full" />
                  <div>
                    <h4 className="font-semibold dark:text-white">{selectedDoctor.name}</h4>
                    <p className="text-sm text-medical-teal">{selectedDoctor.specialty}</p>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Select Date</label>
                    <input type="date" className="w-full p-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Available Times</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['09:00 AM', '10:30 AM', '01:00 PM', '02:30 PM', '04:00 PM'].map(time => (
                        <button key={time} className="p-2 border border-slate-200 dark:border-slate-600 rounded-lg text-sm hover:border-medical-teal hover:bg-medical-teal/5 dark:text-slate-300 font-medium">
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <button className="btn-primary w-full shadow-md py-3" onClick={() => setBookingStep(2)}>Continue to Confirm</button>
              </div>
            )}

            {bookingStep === 2 && (
              <div className="p-6">
                <h3 className="text-xl font-bold dark:text-white mb-6">Confirm Booking</h3>
                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                    <User className="w-5 h-5 text-medical-teal" /> {selectedDoctor.name}
                  </div>
                  <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                    <Calendar className="w-5 h-5 text-medical-teal" /> Oct 25, 2026
                  </div>
                  <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                    <Clock className="w-5 h-5 text-medical-teal" /> 10:30 AM
                  </div>
                  <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                    <Video className="w-5 h-5 text-medical-teal" /> Video Consultation
                  </div>
                </div>

                <div className="mb-6 p-4 bg-medical-blue/5 rounded-xl border border-medical-blue/10 dark:border-slate-700">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" className="w-5 h-5 rounded text-medical-teal focus:ring-medical-teal" defaultChecked />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Send me a reminder 3 hours before via SMS & Call</span>
                  </label>
                </div>

                <div className="flex gap-4">
                  <button className="btn-secondary flex-1 py-3 font-bold" onClick={() => setBookingStep(1)}>Back</button>
                  <button className="btn-primary flex-1 py-3 font-bold shadow-md" onClick={() => setBookingStep(3)}>Confirm</button>
                </div>
              </div>
            )}

            {bookingStep === 3 && (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-medical-teal/20 text-medical-teal rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 fill-current" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Booking Confirmed!</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-8">Your appointment with {selectedDoctor.name} is scheduled for Oct 25 at 10:30 AM.</p>
                <div className="space-y-3">
                  <button className="btn-secondary w-full flex justify-center items-center gap-2 py-3 font-bold">
                    <Calendar className="w-4 h-4" /> Add to Google Calendar
                  </button>
                  <button className="btn-primary w-full py-3 font-bold shadow-md" onClick={() => { setBookingStep(0); setSelectedDoctor(null); }}>
                    Done
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Appointments;
