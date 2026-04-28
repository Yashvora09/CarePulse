import { useState, useEffect, useRef } from 'react';
import { Search, Bookmark, Pill, AlertOctagon, Info, Loader2, Database } from 'lucide-react';
import { LOCAL_MEDICINES, LOCAL_DRUG_NAMES } from '../data/medicineDataset';
import { useLang } from '../context/LanguageContext';

const Medicines = () => {
  const { t } = useLang();
  const [searchTerm, setSearchTerm] = useState('');
  const [medicines, setMedicines] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [bookmarks, setBookmarks] = useState([]);
  
  // Autocomplete state
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearchingSuggestions, setIsSearchingSuggestions] = useState(false);
  const searchRef = useRef(null);

  const toggleBookmark = (id) => {
    if (bookmarks.includes(id)) {
      setBookmarks(bookmarks.filter(b => b !== id));
    } else {
      setBookmarks([...bookmarks, id]);
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced Autocomplete Fetch
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchTerm.trim().length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      setIsSearchingSuggestions(true);
      try {
        // First: local dataset matches (instant)
        const localMatches = LOCAL_DRUG_NAMES.filter(n => n.includes(searchTerm.toLowerCase()));
        
        // Then: OpenFDA results
        const broadQuery = encodeURIComponent(`"${searchTerm}"`);
        const response = await fetch(`https://api.fda.gov/drug/label.json?search=${broadQuery}&limit=10`);
        const names = new Set(localMatches);
        
        if (response.ok) {
          const data = await response.json();
          data.results.forEach(med => {
            if (med.openfda?.brand_name?.[0]) names.add(med.openfda.brand_name[0].toLowerCase());
            if (med.openfda?.generic_name?.[0]) names.add(med.openfda.generic_name[0].toLowerCase());
          });
        }
        
        setSuggestions(Array.from(names).slice(0, 7));
        setShowSuggestions(names.size > 0);
      } catch (err) {
        // Fall back to local only
        const localMatches = LOCAL_DRUG_NAMES.filter(n => n.includes(searchTerm.toLowerCase()));
        setSuggestions(localMatches.slice(0, 7));
        setShowSuggestions(localMatches.length > 0);
      } finally {
        setIsSearchingSuggestions(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  const searchFDA = async (e, forcedQuery = null) => {
    if (e) e.preventDefault();
    const queryTerm = forcedQuery || searchTerm;
    if (!queryTerm.trim()) return;

    setShowSuggestions(false);
    setIsLoading(true);
    setError('');
    setMedicines([]);
    setSearchTerm(queryTerm); // update input if forced

    try {
      // 1. Check local dataset first
      const localHits = LOCAL_MEDICINES.filter(m =>
        m.name.toLowerCase().includes(queryTerm.toLowerCase()) ||
        m.genericName.toLowerCase().includes(queryTerm.toLowerCase()) ||
        m.class.toLowerCase().includes(queryTerm.toLowerCase())
      );

      // 2. Try OpenFDA
      let fdaMeds = [];
      try {
        const broadQuery = encodeURIComponent(`"${queryTerm}"`);
        const response = await fetch(`https://api.fda.gov/drug/label.json?search=${broadQuery}&limit=15`);
        if (response.ok) {
          const data = await response.json();
          const parsedMedications = data.results.map((med, index) => {
            const id = med.id || 'fda-' + index;
            const brandName = med.openfda?.brand_name?.[0] || 'Unknown Brand';
            const genericName = med.openfda?.generic_name?.[0] || med.openfda?.substance_name?.[0] || 'Unknown Generic Name';
            const pharmClass = med.openfda?.pharm_class_epc?.[0] || 'General Medication';
            const uses = med.indications_and_usage?.[0] || 'Not provided.';
            const dosage = med.dosage_and_administration?.[0] || 'Not listed.';
            const sideEffectsRaw = med.adverse_reactions?.[0] || '';
            const sideEffects = sideEffectsRaw ? [sideEffectsRaw.substring(0, 100) + '...'] : ['Data not available'];
            const warnings = med.boxed_warning?.[0] || med.warnings?.[0] || 'No major warnings listed.';
            const interactionsRaw = med.drug_interactions?.[0] || '';
            const interactions = interactionsRaw ? [interactionsRaw.substring(0, 150) + '...'] : ['Data not available'];
            const isRx = med.openfda?.product_type?.[0]?.includes('PRESCRIPTION') || false;
            return { id, name: brandName, genericName, class: pharmClass, uses: uses.substring(0, 300), dosage: dosage.substring(0, 200), sideEffects, warnings: warnings.substring(0, 300), interactions, prescription: isRx };
          });
          fdaMeds = Array.from(new Map(parsedMedications.map(item => [item.genericName, item])).values());
        }
      } catch (_) { /* FDA failed, local only */ }

      // Merge: local first, then FDA (deduplicate by name)
      const allMeds = [...localHits, ...fdaMeds];
      const seen = new Set();
      const uniqueMeds = allMeds.filter(m => {
        const key = (m.genericName || m.name).toLowerCase();
        if (seen.has(key)) return false;
        seen.add(key); return true;
      });

      if (uniqueMeds.length === 0) throw new Error('No medications found. Try a different name.');
      setMedicines(uniqueMeds);

    } catch (err) {
      setError(err.message || 'Failed to fetch medications.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-block px-3 py-1 bg-medical-teal/10 text-medical-teal text-sm font-bold rounded-full mb-4 border border-medical-teal/20">
          Powered by OpenFDA Database
        </div>
        <h1 className="text-3xl font-bold text-medical-blue dark:text-white mb-4">{t('medicines_title')}</h1>
        <p className="text-slate-600 dark:text-slate-400">{t('medicines_sub')}</p>
        
        <div className="relative mt-8" ref={searchRef}>
          <form onSubmit={(e) => searchFDA(e)} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-6 h-6" />
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => {
                  if (suggestions.length > 0) setShowSuggestions(true);
                }}
                className="w-full p-4 pl-14 text-lg shadow-sm border border-slate-200 dark:border-slate-700 rounded-2xl bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-medical-teal outline-none"
                placeholder={t('medicines_search')}
                autoComplete="off"
              />
              {isSearchingSuggestions && (
                <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 animate-spin text-slate-300" />
              )}
            </div>
            <button 
              type="submit" 
              disabled={isLoading || !searchTerm.trim()}
              className="btn-primary px-8 rounded-2xl disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : t('medicines_btn')}
            </button>
          </form>

          {/* Autocomplete Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <ul className="absolute z-10 w-full mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl overflow-hidden text-left">
              {suggestions.map((suggestion, index) => (
                <li 
                  key={index}
                  onClick={() => searchFDA(null, suggestion)}
                  className="px-5 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer flex items-center gap-3 transition-colors border-b last:border-0 border-slate-100 dark:border-slate-700"
                >
                  <Search className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-700 dark:text-slate-200 capitalize font-medium">{suggestion}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-alert-danger/10 border border-alert-danger/20 text-alert-danger p-4 rounded-xl text-center mb-8">
          {error} Try searching for a different medication name.
        </div>
      )}

      {!isLoading && medicines.length === 0 && !error && (
        <div className="text-center text-slate-400 dark:text-slate-500 py-12">
          <Pill className="w-16 h-16 mx-auto mb-4 opacity-20" />
          <p>Search for a medication to see its details.</p>
        </div>
      )}

      <div className="space-y-6">
        {medicines.map(med => (
          <div key={med.id} className="card p-6 md:p-8 hover:shadow-lg transition-shadow">
            <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6 border-b border-slate-100 dark:border-slate-700 pb-6">
              <div className="flex gap-4">
                <div className="w-16 h-16 rounded-2xl bg-medical-blue/10 flex items-center justify-center shrink-0 border border-medical-blue/20">
                  <Pill className="w-8 h-8 text-medical-blue dark:text-medical-teal" />
                </div>
                <div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white capitalize">{med.name.toLowerCase()}</h2>
                    {med.prescription && (
                      <span className="px-2 py-1 bg-alert-danger/10 text-alert-danger border border-alert-danger/20 text-xs font-bold rounded uppercase tracking-wide">Rx Only</span>
                    )}
                  </div>
                  <p className="text-medical-teal font-bold text-lg capitalize">{med.genericName.toLowerCase()}</p>
                  <p className="text-sm text-slate-500 mt-1 uppercase tracking-wider font-semibold">Class: {med.class}</p>
                </div>
              </div>
              <button 
                onClick={() => toggleBookmark(med.id)}
                className={`p-3 rounded-xl border transition-all ${bookmarks.includes(med.id) ? 'bg-medical-blue/10 border-medical-blue/30 text-medical-blue dark:text-medical-teal shadow-inner' : 'border-slate-200 dark:border-slate-700 text-slate-400 hover:text-medical-blue hover:border-medical-blue/30'}`}
              >
                <Bookmark className={`w-6 h-6 ${bookmarks.includes(med.id) ? 'fill-current' : ''}`} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-xl border border-slate-100 dark:border-slate-700">
                  <h3 className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200 mb-3 text-lg">
                    <Info className="w-5 h-5 text-medical-teal" /> Indications & Usage
                  </h3>
                  <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">{med.uses}</p>
                </div>
                
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-2">Dosage & Administration</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed bg-white dark:bg-slate-800 p-4 border border-slate-200 dark:border-slate-700 rounded-lg">{med.dosage}</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-alert-danger/5 border border-alert-danger/20 rounded-xl p-5 shadow-sm">
                  <h3 className="flex items-center gap-2 font-bold text-alert-danger mb-3 text-lg">
                    <AlertOctagon className="w-5 h-5" /> Serious Warnings
                  </h3>
                  <p className="text-alert-danger/90 text-sm leading-relaxed font-medium">{med.warnings}</p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="border border-slate-200 dark:border-slate-700 p-4 rounded-xl">
                    <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-2 text-sm">Adverse Reactions</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {med.sideEffects[0]}
                    </p>
                  </div>
                  <div className="border border-slate-200 dark:border-slate-700 p-4 rounded-xl">
                    <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-2 text-sm">Drug Interactions</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {med.interactions[0]}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Medicines;
