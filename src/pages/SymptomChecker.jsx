import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, X, Activity, AlertTriangle, ChevronRight, CheckCircle2, User, Info } from 'lucide-react';
import { useLang } from '../context/LanguageContext';

const SYMPTOM_CATEGORIES = {
  "Head & Neck": [
    "Headache", "Dizziness", "Vision changes", "Earache", "Sinus pressure", 
    "Sore throat", "Stiff neck", "Hair loss", "Jaw pain"
  ],
  "Chest & Back": [
    "Chest pain", "Shortness of breath", "Heart palpitations", "Cough", 
    "Upper back pain", "Lower back pain", "Rib pain"
  ],
  "Abdomen & Pelvis": [
    "Abdominal pain", "Nausea", "Vomiting", "Heartburn", "Diarrhea", 
    "Constipation", "Bloating", "Pelvic pain", "Painful urination"
  ],
  "Arms & Legs": [
    "Joint pain", "Muscle ache", "Swelling", "Numbness or tingling", 
    "Weakness", "Knee pain", "Shoulder pain", "Foot pain"
  ],
  "Skin & General": [
    "Fever", "Fatigue", "Chills", "Sweating", "Weight loss", 
    "Loss of appetite", "Rash", "Itching", "Bruising easily", "Insomnia"
  ]
};

// Detailed Interactive Body Map Component (WebMD Style)
const BodyMap = ({ activeCategory, setActiveCategory }) => {
  const isSelected = (cat) => activeCategory === cat;
  
  const getStyle = (cat) => {
    const selected = isSelected(cat);
    return `cursor-pointer transition-all duration-300 ${
      selected 
        ? 'fill-medical-teal stroke-medical-blue stroke-[3px] drop-shadow-md z-10' 
        : 'fill-[#e2e8f0] dark:fill-slate-700 stroke-slate-300 dark:stroke-slate-600 stroke-[1.5px] hover:fill-medical-blue/30 dark:hover:fill-medical-teal/40'
    }`;
  };

  return (
    <div className="relative w-full max-w-[280px] mx-auto py-6">
      {/* High-quality anatomical dummy SVG */}
      <svg viewBox="0 0 200 450" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
        
        {/* Head & Neck */}
        <g onClick={() => setActiveCategory("Head & Neck")} className={getStyle("Head & Neck")}>
          <ellipse cx="100" cy="35" rx="28" ry="35" />
          <path d="M 85 60 C 85 80, 115 80, 115 60 Z" />
        </g>

        {/* Chest & Upper Back */}
        <g onClick={() => setActiveCategory("Chest & Back")} className={getStyle("Chest & Back")}>
          <path d="M 70 80 C 100 70, 100 70, 130 80 C 145 90, 140 135, 135 150 L 65 150 C 60 135, 55 90, 70 80 Z" />
        </g>

        {/* Abdomen & Pelvis */}
        <g onClick={() => setActiveCategory("Abdomen & Pelvis")} className={getStyle("Abdomen & Pelvis")}>
          <path d="M 65 150 L 135 150 C 135 180, 130 210, 125 230 L 100 245 L 75 230 C 70 210, 65 180, 65 150 Z" />
        </g>

        {/* Arms (Left & Right) */}
        <g onClick={() => setActiveCategory("Arms & Legs")} className={getStyle("Arms & Legs")}>
          {/* Left Arm */}
          <path d="M 65 85 C 45 90, 35 130, 30 170 C 25 210, 35 240, 30 250 C 25 260, 20 270, 25 275 C 30 280, 35 270, 35 260 C 45 230, 45 190, 60 140 Z" />
          {/* Right Arm */}
          <path d="M 135 85 C 155 90, 165 130, 170 170 C 175 210, 165 240, 170 250 C 175 260, 180 270, 175 275 C 170 280, 165 270, 165 260 C 155 230, 155 190, 140 140 Z" />
        </g>

        {/* Legs (Left & Right) */}
        <g onClick={() => setActiveCategory("Arms & Legs")} className={getStyle("Arms & Legs")}>
          {/* Left Leg */}
          <path d="M 75 230 C 65 270, 55 330, 60 380 C 62 400, 60 415, 60 425 C 60 435, 75 435, 75 425 C 75 410, 75 390, 85 340 C 90 315, 95 285, 100 245 Z" />
          {/* Right Leg */}
          <path d="M 125 230 C 135 270, 145 330, 140 380 C 138 400, 140 415, 140 425 C 140 435, 125 435, 125 425 C 125 410, 125 390, 115 340 C 110 315, 105 285, 100 245 Z" />
        </g>
      </svg>

      <div className="text-center mt-6 text-sm font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 py-2 rounded-xl">
        Click a body region to focus
      </div>
    </div>
  );
};

const SymptomChecker = () => {
  const { t } = useLang();
  const [step, setStep] = useState(1);
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState("Head & Neck");
  const [symptoms, setSymptoms] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);

  const handleAddSymptom = (name) => {
    if (!symptoms.find(s => s.name === name)) {
      setSymptoms([...symptoms, { name, days: 1 }]);
      setSearchTerm('');
    }
  };

  const handleRemoveSymptom = (name) => {
    setSymptoms(symptoms.filter(s => s.name !== name));
  };

  const updateSymptomDays = (name, days) => {
    setSymptoms(symptoms.map(s => s.name === name ? { ...s, days: parseInt(days) || 1 } : s));
  };

  const analyzeSymptoms = () => {
    setIsAnalyzing(true);
    // Enhanced mock AI processing with descriptions
    setTimeout(() => {
      setIsAnalyzing(false);
      setStep(3);
      
      const hasChestPain = symptoms.some(s => s.name === "Chest pain" || s.name === "Shortness of breath");
      const hasAbdominal = symptoms.some(s => ["Abdominal pain", "Nausea", "Vomiting", "Diarrhea"].includes(s.name));
      const hasFever = symptoms.some(s => s.name === "Fever" || s.name === "Chills");
      
      let conditions = [];
      let severity = "Moderate";
      let recommendation = "Rest and monitor your symptoms. Consult a physician if they worsen.";

      if (hasChestPain) {
        severity = "Severe";
        conditions = [
          { name: "Angina / Cardiac Event", probability: 75, description: "Reduced blood flow to the heart muscle causing intense chest pain or pressure." },
          { name: "Respiratory Infection", probability: 60, description: "An infection of the lungs or airways, potentially leading to pneumonia." },
          { name: "Severe Acid Reflux", probability: 40, description: "Stomach acid flowing back into the esophagus, mimicking chest pain." }
        ];
        recommendation = "URGENT: Your symptoms may indicate a serious condition. Please seek immediate emergency medical care.";
      } else if (hasAbdominal && hasFever) {
        severity = "Moderate";
        conditions = [
          { name: "Gastroenteritis (Stomach Flu)", probability: 85, description: "Intestinal infection marked by diarrhea, cramps, nausea, vomiting, and fever." },
          { name: "Food Poisoning", probability: 70, description: "Illness caused by eating contaminated food, leading to severe gastrointestinal distress." },
          { name: "Appendicitis (Early)", probability: 30, description: "Inflammation of the appendix. Often begins with pain around the belly button that moves lower right." }
        ];
        recommendation = "Stay hydrated and rest. If pain becomes severe or localized to the lower right abdomen, seek immediate care.";
      } else if (hasFever) {
        severity = "Mild";
        conditions = [
          { name: "Viral Infection", probability: 80, description: "A systemic response to a viral invader, causing elevated body temperature and malaise." },
          { name: "Seasonal Flu", probability: 65, description: "A highly contagious respiratory illness caused by influenza viruses." },
          { name: "Common Cold", probability: 45, description: "A harmless viral infection of your nose and throat." }
        ];
      } else {
        severity = "Mild";
        conditions = [
          { name: "General Fatigue / Stress", probability: 70, description: "Physical or mental exhaustion from overexertion or anxiety." },
          { name: "Vitamin Deficiency", probability: 50, description: "Lack of essential nutrients like Iron or Vitamin D causing systemic symptoms." },
          { name: "Mild Viral Infection", probability: 40, description: "An early-stage or very mild bodily response to a pathogen." }
        ];
      }

      setResults({ severity, conditions, recommendation });
    }, 2500);
  };

  const allSymptomsFlat = useMemo(() => {
    return Object.values(SYMPTOM_CATEGORIES).flat();
  }, []);

  const filteredSearchSymptoms = useMemo(() => {
    if (!searchTerm) return [];
    return allSymptomsFlat.filter(s => 
      s.toLowerCase().includes(searchTerm.toLowerCase()) && 
      !symptoms.find(selected => selected.name === s)
    );
  }, [searchTerm, allSymptomsFlat, symptoms]);

  const currentCategorySymptoms = SYMPTOM_CATEGORIES[activeCategory].filter(s => 
    !symptoms.find(selected => selected.name === s)
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
          {t('symptoms_title')}
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          {t('symptoms_sub')}
        </p>
      </div>

      <div className="card p-6 md:p-8">
        {/* Progress Bar */}
        <div className="flex items-center justify-between mb-8 relative">
          <div className="absolute left-0 top-1/2 w-full h-1 bg-slate-100 dark:bg-slate-700 -z-10 -translate-y-1/2"></div>
          <div 
            className="absolute left-0 top-1/2 h-1 bg-medical-teal -z-10 -translate-y-1/2 transition-all duration-500"
            style={{ width: `${(step - 1) * 50}%` }}
          ></div>
          
          {[1, 2, 3].map((num) => (
            <div 
              key={num} 
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-4 ${
                step >= num 
                  ? 'bg-medical-teal border-white dark:border-slate-800 text-white' 
                  : 'bg-slate-100 dark:bg-slate-700 border-white dark:border-slate-800 text-slate-400'
              }`}
            >
              {step > num ? <CheckCircle2 className="w-5 h-5" /> : num}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h2 className="text-xl font-semibold mb-6 dark:text-white">Patient Profile</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Age</label>
                  <input 
                    type="number" 
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full p-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-medical-teal outline-none"
                    placeholder="Enter your age"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Biological Sex</label>
                  <select 
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full p-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-medical-teal outline-none"
                  >
                    <option value="">Select...</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
              </div>
              <button 
                onClick={() => setStep(2)}
                disabled={!age || !gender}
                className="btn-primary w-full md:w-auto flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ml-auto"
              >
                Continue <ChevronRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h2 className="text-xl font-semibold mb-6 dark:text-white">Identify Your Symptoms</h2>
              
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Left: Body Map & Selection */}
                <div className="w-full lg:w-3/5">
                  <div className="flex flex-col sm:flex-row gap-8">
                    
                    {/* SVG Body Map */}
                    <div className="w-full sm:w-1/3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center p-4">
                      <BodyMap activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
                      
                      {/* Mobile friendly category buttons for general/skin which aren't on map */}
                      <button 
                        onClick={() => setActiveCategory("Skin & General")}
                        className={`mt-4 px-4 py-2 text-sm rounded-full w-full font-bold transition-all border ${
                          activeCategory === "Skin & General" 
                            ? 'bg-medical-teal text-white border-medical-teal' 
                            : 'bg-white text-slate-600 border-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600 hover:border-medical-teal'
                        }`}
                      >
                        Skin & General
                      </button>
                    </div>

                    <div className="w-full sm:w-2/3 space-y-4">
                      {/* Global Search */}
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input 
                          type="text" 
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full p-3 pl-10 border border-slate-200 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-medical-teal outline-none shadow-inner"
                          placeholder="Search for any symptom globally..."
                        />
                        
                        {searchTerm && (
                          <div className="absolute z-20 w-full mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl shadow-xl max-h-60 overflow-y-auto">
                            {filteredSearchSymptoms.length > 0 ? (
                              filteredSearchSymptoms.map(s => (
                                <button
                                  key={s}
                                  onClick={() => handleAddSymptom(s)}
                                  className="w-full text-left p-3 hover:bg-slate-50 dark:hover:bg-slate-700 flex justify-between items-center dark:text-white border-b border-slate-100 dark:border-slate-700 last:border-0"
                                >
                                  {s} <Plus className="w-4 h-4 text-medical-teal" />
                                </button>
                              ))
                            ) : (
                              <div className="p-4 text-slate-500 text-center">No matching symptoms found.</div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Active Category Symptoms List */}
                      {!searchTerm && (
                        <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-white dark:bg-slate-800">
                          <div className="bg-medical-blue text-white px-4 py-3 font-bold flex justify-between items-center">
                            {activeCategory}
                            <span className="bg-white/20 text-xs px-2 py-1 rounded-full">{currentCategorySymptoms.length} available</span>
                          </div>
                          <div className="p-4 max-h-[250px] overflow-y-auto custom-scrollbar">
                            <div className="grid grid-cols-1 gap-2">
                              {currentCategorySymptoms.map(s => (
                                <button
                                  key={s}
                                  onClick={() => handleAddSymptom(s)}
                                  className="text-left px-3 py-2 rounded-lg border border-slate-100 dark:border-slate-700 hover:border-medical-teal dark:hover:border-medical-teal hover:bg-medical-teal/5 dark:text-slate-200 text-sm flex justify-between items-center group transition-all"
                                >
                                  {s} <Plus className="w-4 h-4 text-slate-300 group-hover:text-medical-teal" />
                                </button>
                              ))}
                              {currentCategorySymptoms.length === 0 && (
                                <p className="text-center text-slate-500 py-4 text-sm">All common symptoms in this area selected.</p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Selected Symptoms Cart */}
                <div className="w-full lg:w-2/5 flex flex-col h-full min-h-[300px]">
                  <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 flex-1 shadow-inner flex flex-col">
                    <h3 className="font-bold text-slate-800 dark:text-white mb-4 border-b border-slate-200 dark:border-slate-700 pb-2 flex justify-between items-center">
                      Selected Symptoms
                      <span className="bg-medical-teal text-white text-xs px-2 py-1 rounded-full">{symptoms.length}</span>
                    </h3>
                    
                    {symptoms.length === 0 ? (
                      <div className="flex-1 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 p-6 text-center">
                        <User className="w-12 h-12 mb-3 opacity-20" />
                        <p>No symptoms selected yet.</p>
                        <p className="text-sm mt-1">Click the body map or search.</p>
                      </div>
                    ) : (
                      <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-2">
                        {symptoms.map(s => (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            key={s.name} 
                            className="p-3 bg-white dark:bg-slate-700 rounded-lg shadow-sm border border-slate-100 dark:border-slate-600"
                          >
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-bold text-medical-blue dark:text-white text-sm">{s.name}</span>
                              <button 
                                onClick={() => handleRemoveSymptom(s.name)}
                                className="text-slate-400 hover:text-alert-danger transition-colors p-1 bg-slate-50 hover:bg-alert-danger/10 rounded"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                            <div className="flex items-center gap-2">
                              <label className="text-xs text-slate-500 dark:text-slate-400 font-medium">Duration:</label>
                              <div className="flex items-center bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded">
                                <input 
                                  type="number" 
                                  min="1"
                                  value={s.days}
                                  onChange={(e) => updateSymptomDays(s.name, e.target.value)}
                                  className="w-12 p-1 text-xs text-center dark:bg-transparent dark:text-white outline-none font-bold"
                                />
                                <span className="text-xs text-slate-500 pr-2">days</span>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-between mt-8 pt-6 border-t border-slate-100 dark:border-slate-700">
                <button 
                  onClick={() => setStep(1)}
                  className="btn-secondary"
                >
                  Back
                </button>
                <button 
                  onClick={analyzeSymptoms}
                  disabled={symptoms.length === 0 || isAnalyzing}
                  className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transition-all px-8 py-3"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Analyzing...
                    </>
                  ) : (
                    <>Analyze Symptoms <Activity className="w-5 h-5" /></>
                  )}
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && results && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className={`border-l-4 p-4 rounded-r-lg mb-8 flex items-start gap-3 shadow-sm ${
                results.severity === 'Severe' 
                  ? 'bg-alert-danger/10 border-alert-danger text-alert-danger' 
                  : 'bg-alert-warning/10 border-alert-warning text-alert-warning'
              }`}>
                <AlertTriangle className="w-6 h-6 shrink-0" />
                <p className="text-sm">
                  <strong className="block mb-1">Disclaimer</strong>
                  This AI-generated analysis is for informational purposes only. It is NOT a substitute for professional medical advice, diagnosis, or treatment.
                </p>
              </div>

              <div className="mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <h2 className="text-2xl font-bold dark:text-white">Analysis Results</h2>
                  <span className={`px-4 py-1.5 rounded-full text-sm font-bold border ${
                    results.severity === 'Severe' 
                      ? 'bg-alert-danger/10 text-alert-danger border-alert-danger' 
                      : results.severity === 'Moderate'
                      ? 'bg-alert-warning/10 text-alert-warning border-alert-warning'
                      : 'bg-medical-teal/10 text-medical-teal border-medical-teal'
                  }`}>
                    {results.severity} Severity
                  </span>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-slate-700 dark:text-slate-300">Top Predicted Conditions:</h3>
                  {results.conditions.map((condition, idx) => (
                    <div key={idx} className="p-5 border border-slate-100 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 shadow-sm transition-all hover:shadow-md">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3">
                        <span className="font-bold text-lg dark:text-white">{condition.name}</span>
                        <span className={`text-sm font-bold px-3 py-1 rounded-full ${
                          condition.probability > 70 ? 'bg-alert-danger/10 text-alert-danger' : condition.probability > 40 ? 'bg-alert-warning/10 text-alert-warning' : 'bg-medical-teal/10 text-medical-teal'
                        }`}>
                          {condition.probability}% Match
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg flex items-start gap-2">
                        <Info className="w-4 h-4 text-medical-blue mt-0.5 shrink-0" />
                        {condition.description}
                      </p>
                      <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <motion.div 
                          className={`h-full ${
                            condition.probability > 70 ? 'bg-alert-danger' : condition.probability > 40 ? 'bg-alert-warning' : 'bg-medical-teal'
                          }`}
                          initial={{ width: 0 }}
                          animate={{ width: `${condition.probability}%` }}
                          transition={{ duration: 1, delay: 0.2 + (idx * 0.1) }}
                        ></motion.div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-medical-blue/5 to-medical-teal/5 p-6 rounded-2xl border border-medical-blue/10 dark:from-slate-800 dark:to-slate-800 dark:border-slate-700 shadow-inner">
                <h3 className="font-bold text-medical-blue dark:text-medical-teal mb-3 text-lg">Recommended Action Plan:</h3>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-lg font-medium">{results.recommendation}</p>
                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  <button className="btn-primary flex-1 py-3 text-lg shadow-lg hover:shadow-xl transition-all">Find a Doctor Nearby</button>
                  <button onClick={() => {setStep(1); setSymptoms([]);}} className="btn-secondary flex-1 py-3">Start New Analysis</button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SymptomChecker;
