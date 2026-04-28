import { useState, useEffect } from 'react';
import { Search, MapPin, Star, Phone, Navigation, Clock, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useLang } from '../context/LanguageContext';

// Fix for default marker icons in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// A component to automatically pan the map to the user's location
function MapUpdater({ center }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

const Facilities = () => {
  const { t } = useLang();
  const [activeTab, setActiveTab] = useState('Hospitals');
  const [searchTerm, setSearchTerm] = useState('');
  const [userLocation, setUserLocation] = useState([40.7128, -74.0060]); // Default to NYC
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [locationLoaded, setLocationLoaded] = useState(false);

  useEffect(() => {
    // Get user location
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
          setLocationLoaded(true);
        },
        (error) => {
          console.error("Error getting location:", error);
          setError("Could not access your location. Showing default map center.");
          setLocationLoaded(true); // Proceed with default
        }
      );
    } else {
      setLocationLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!locationLoaded) return;

    const fetchFacilities = async () => {
      setLoading(true);
      try {
        const amenity = activeTab === 'Hospitals' ? 'hospital' : 'pharmacy';
        
        // Using Overpass API to get real facilities near the coordinates
        let queryOptions = `node["amenity"="${amenity}"](around:10000,${userLocation[0]},${userLocation[1]});`;
        if (activeTab === 'Hospitals') {
           queryOptions += `node["amenity"="clinic"](around:10000,${userLocation[0]},${userLocation[1]});node["amenity"="doctors"](around:10000,${userLocation[0]},${userLocation[1]});`;
        }
        
        const query = `[out:json];(${queryOptions});out body;`;
        
        const response = await fetch(`https://overpass-api.de/api/interpreter`, {
          method: 'POST',
          body: query
        });
        
        if (!response.ok) throw new Error("Failed to fetch facilities data.");
        
        const data = await response.json();
        
        const formattedFacilities = data.elements.map(el => ({
          id: el.id,
          name: el.tags.name || `Unnamed ${activeTab === 'Hospitals' ? 'Clinic' : 'Pharmacy'}`,
          type: el.tags.amenity === 'pharmacy' ? 'Pharmacy' : 'Hospital/Clinic',
          lat: el.lat,
          lon: el.lon,
          address: (el.tags["addr:housenumber"] || el.tags["addr:street"]) 
            ? `${el.tags["addr:housenumber"] || ''} ${el.tags["addr:street"] || ''}`.trim() 
            : "Address not listed",
          phone: el.tags.phone || "Phone not available",
          status: el.tags.opening_hours || "Hours not specified",
          distance: calculateDistance(userLocation[0], userLocation[1], el.lat, el.lon).toFixed(1) + " km",
          rating: (Math.random() * (5 - 3.5) + 3.5).toFixed(1), // Mock rating
          reviews: Math.floor(Math.random() * 500) + 10
        })).filter(f => f.name && !f.name.startsWith('Unnamed')); // Filter completely unnamed
        
        setFacilities(formattedFacilities.sort((a,b) => parseFloat(a.distance) - parseFloat(b.distance)));
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Error fetching real-time data from OpenStreetMap. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchFacilities();
  }, [userLocation, activeTab, locationLoaded]);

  // Haversine formula
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; 
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    return R * c; 
  };

  const filtered = facilities.filter(f => 
    f.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 h-[calc(100vh-4rem)] flex flex-col">
      <div className="mb-6 shrink-0">
        <h1 className="text-3xl font-bold text-medical-blue dark:text-white mb-2">{t('facilities_title')}</h1>
        <p className="text-slate-600 dark:text-slate-400">{t('facilities_sub')}</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 h-full min-h-0">
        {/* Left List View */}
        <div className="w-full lg:w-1/2 flex flex-col gap-4 h-full">
          <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl shrink-0">
            {['Hospitals', 'Pharmacies'].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${activeTab === tab ? 'bg-white dark:bg-slate-700 text-medical-blue dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="relative shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 pl-10 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-medical-teal outline-none shadow-sm"
              placeholder={`Search ${activeTab.toLowerCase()} nearby...`}
            />
          </div>

          {error && (
            <div className="p-4 bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          <div className="flex-1 overflow-y-auto pr-2 space-y-4 pb-20 lg:pb-0">
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-medical-teal"></div>
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center p-8 text-slate-500">
                No {activeTab.toLowerCase()} found nearby. Try widening your search or check your location permissions.
              </div>
            ) : (
              filtered.map((facility, idx) => (
                <motion.div 
                  key={facility.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: Math.min(idx * 0.05, 0.5) }}
                  className="card p-5 hover:border-medical-teal/50 transition-colors group cursor-pointer"
                  onClick={() => setUserLocation([facility.lat, facility.lon])}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-medical-blue transition-colors">
                        {facility.name}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 mt-1">
                        <Star className="w-4 h-4 text-alert-warning fill-alert-warning" />
                        <span className="font-medium text-slate-800 dark:text-slate-200">{facility.rating}</span>
                        <span>({facility.reviews} reviews)</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <MapPin className="w-4 h-4 shrink-0" /> {facility.distance} away • {facility.address}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <Phone className="w-4 h-4 shrink-0" /> {facility.phone}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <Clock className="w-4 h-4 shrink-0" /> {facility.status}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button 
                      className="flex-1 btn-primary py-2 text-sm flex items-center justify-center gap-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(`https://www.google.com/maps/dir/?api=1&destination=${facility.lat},${facility.lon}`);
                      }}
                    >
                      <Navigation className="w-4 h-4" /> Get Directions
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Right Map View */}
        <div className="hidden lg:block lg:w-1/2 h-full rounded-2xl overflow-hidden relative shadow-lg border border-slate-200 dark:border-slate-700 z-0">
          <MapContainer 
            center={userLocation} 
            zoom={13} 
            scrollWheelZoom={true} 
            style={{ height: '100%', width: '100%' }}
          >
            <MapUpdater center={userLocation} />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {/* User Location Marker */}
            <Marker position={userLocation}>
              <Popup>You are here</Popup>
            </Marker>

            {/* Facility Markers */}
            {filtered.map(facility => (
              <Marker key={facility.id} position={[facility.lat, facility.lon]}>
                <Popup>
                  <strong>{facility.name}</strong><br/>
                  {facility.address}<br/>
                  {facility.distance} away
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default Facilities;
