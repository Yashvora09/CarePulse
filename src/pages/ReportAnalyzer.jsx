import { useState, useCallback } from 'react';
import { UploadCloud, FileText, AlertCircle, CheckCircle, Activity, Download, Pill, Shield, Apple, Zap, Heart, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from '../context/LanguageContext';

const RISK_COLORS = {
  Low:      { bg: 'bg-emerald-50 dark:bg-emerald-900/20', border: 'border-emerald-200 dark:border-emerald-700', text: 'text-emerald-700 dark:text-emerald-400', dot: 'bg-emerald-500' },
  Moderate: { bg: 'bg-amber-50 dark:bg-amber-900/20',   border: 'border-amber-200 dark:border-amber-700',   text: 'text-amber-700 dark:text-amber-400',   dot: 'bg-amber-500' },
  High:     { bg: 'bg-orange-50 dark:bg-orange-900/20', border: 'border-orange-200 dark:border-orange-700', text: 'text-orange-700 dark:text-orange-400', dot: 'bg-orange-500' },
  Critical: { bg: 'bg-red-50 dark:bg-red-900/20',       border: 'border-red-200 dark:border-red-700',       text: 'text-red-700 dark:text-red-400',       dot: 'bg-red-500' },
};

const STATUS_CONFIG = {
  'normal':       { bar: 'bg-emerald-500', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-700' },
  'high':         { bar: 'bg-amber-500',   badge: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-700' },
  'low':          { bar: 'bg-blue-500',    badge: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-700' },
  'critical-high':{ bar: 'bg-red-600',     badge: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-700' },
  'critical-low': { bar: 'bg-red-600',     badge: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-700' },
  'abnormal':     { bar: 'bg-orange-500',  badge: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-700' },
};

const ReportAnalyzer = () => {
  const { t } = useLang();
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('idle');
  const [results, setResults] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [activeTab, setActiveTab] = useState('summary');

  const handleDrag = useCallback((e) => {
    e.preventDefault(); e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault(); e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) handleFileSelect(e.dataTransfer.files[0]);
  }, []);

  const handleFileSelect = async (selectedFile) => {
    setFile(selectedFile);
    setStatus('processing');
    setErrorMsg('');
    setActiveTab('summary');
    const formData = new FormData();
    formData.append('report', selectedFile);
    try {
      const response = await fetch('http://localhost:5000/api/analyze', { method: 'POST', body: formData });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to analyze report');
      setResults(data);
      setStatus('complete');
    } catch (error) {
      setErrorMsg(error.message);
      setStatus('idle');
    }
  };

  const resetAnalyzer = () => { setStatus('idle'); setFile(null); setResults(null); };
  const downloadReport = () => window.print();

  const risk = results?.overallRisk;
  const riskStyle = RISK_COLORS[risk] || RISK_COLORS.Low;

  const TABS = [
    { id: 'summary',    label: 'Summary',    icon: FileText },
    { id: 'biomarkers', label: 'Biomarkers', icon: Activity },
    { id: 'conditions', label: 'Conditions', icon: Shield },
    { id: 'nutrition',  label: 'Nutrition',  icon: Apple },
    { id: 'lifestyle',  label: 'Lifestyle',  icon: Heart },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {status !== 'complete' && (
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            {t('analyzer_title')}
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            {t('analyzer_sub')}
          </p>
        </div>
      )}

      {errorMsg && (
        <div className="max-w-2xl mx-auto mb-8 bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-center gap-3">
          <AlertCircle className="w-6 h-6 shrink-0" />
          <div><h4 className="font-bold">Analysis Failed</h4><p className="text-sm">{errorMsg}</p></div>
        </div>
      )}

      <AnimatePresence mode="wait">
        {status === 'idle' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
            className={`max-w-4xl mx-auto border-2 border-dashed rounded-3xl p-12 text-center transition-all ${dragActive ? 'border-medical-teal bg-medical-teal/5' : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800'}`}
            onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
          >
            <div className="w-20 h-20 bg-medical-blue/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <UploadCloud className="w-10 h-10 text-medical-blue dark:text-medical-teal" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{t('analyzer_drag')}</h3>
            <p className="text-slate-500 mb-6">{t('analyzer_supports')}</p>
            <input type="file" id="file-upload" className="hidden" accept=".pdf,image/*" onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])} />
            <button className="btn-primary" onClick={() => document.getElementById('file-upload').click()}>
              {t('analyzer_browse')}
            </button>
          </motion.div>
        )}

        {status === 'processing' && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="card p-12 text-center max-w-2xl mx-auto">
            <div className="text-center">
              <div className="inline-block relative">
                <div className="w-16 h-16 border-4 border-slate-200 dark:border-slate-700 border-t-medical-blue rounded-full animate-spin"></div>
                <Activity className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-medical-blue animate-pulse" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-6 mb-2">{t('analyzer_analyzing')}</h3>
              <p className="text-slate-500 animate-pulse">Running clinical algorithms...</p>
            </div>
            <div className="max-w-md mx-auto mt-8 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
              <motion.div className="h-full bg-gradient-to-r from-medical-blue to-medical-teal" initial={{ width: '0%' }} animate={{ width: '100%' }} transition={{ duration: 6, ease: 'linear' }} />
            </div>
          </motion.div>
        )}

        {status === 'complete' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="card p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-medical-blue to-blue-900 text-white shadow-xl">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-white/10 rounded-2xl border border-white/20">
                  <FileText className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-2xl flex items-center gap-2">
                    {file?.name || 'Medical Report'} <CheckCircle className="w-6 h-6 text-medical-teal" />
                  </h3>
                  <p className="text-medical-teal font-bold uppercase tracking-widest text-sm mt-1">{results?.type}</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border font-bold text-sm ${riskStyle.bg} ${riskStyle.border} ${riskStyle.text}`}>
                  <span className={`w-2.5 h-2.5 rounded-full ${riskStyle.dot}`}></span>
                  {risk} Risk
                </div>
                <button onClick={resetAnalyzer} className="text-sm font-bold text-medical-blue bg-white hover:bg-slate-50 px-6 py-2.5 rounded-xl shadow-lg">
                  Analyze Another
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-1 space-y-3">
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-3 shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col gap-1">
                  {TABS.map(tab => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-3 p-3 rounded-xl font-semibold transition-all text-left text-sm ${activeTab === tab.id ? 'bg-medical-blue text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}
                    >
                      <tab.icon className="w-4 h-4" /> {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-3">
                <AnimatePresence mode="wait">
                  {activeTab === 'summary' && (
                    <motion.div key="summary" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="card p-8 min-h-[400px]">
                      <h2 className="text-2xl font-bold dark:text-white mb-6 border-b border-slate-100 dark:border-slate-700 pb-4">Clinical Summary</h2>
                      <p className="text-slate-700 dark:text-slate-300 leading-loose text-base bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-700">
                        {results?.summary}
                      </p>
                      <h2 className="text-2xl font-bold dark:text-white mb-6 border-b border-slate-100 dark:border-slate-700 pb-4">Key Biomarker Findings</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {results?.findings?.map((finding, idx) => {
                          const cfg = STATUS_CONFIG[finding.status] || STATUS_CONFIG.normal;
                          return (
                            <div key={idx} className="p-5 rounded-2xl border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                              <div className={`absolute top-0 left-0 w-1.5 h-full ${cfg.bar} rounded-l-2xl`}></div>
                              <div className="pl-3">
                                <div className="flex justify-between items-start mb-2 gap-2">
                                  <h4 className="font-bold text-slate-900 dark:text-white">{finding.name}</h4>
                                  <span className={`text-xs px-2 py-1 rounded-md border font-bold uppercase shrink-0 ${cfg.badge}`}>{finding.status}</span>
                                </div>
                                <div className="flex items-baseline gap-3 mb-2">
                                  <span className="text-xl font-bold text-slate-800 dark:text-slate-100">{finding.value}</span>
                                  {finding.referenceRange && <span className="text-xs text-slate-400 dark:text-slate-500">Ref: {finding.referenceRange}</span>}
                                </div>
                                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{finding.meaning}</p>
                                {finding.actionNeeded && (
                                  <div className="mt-2 flex items-center gap-1 text-xs font-bold text-red-600 dark:text-red-400">
                                    <AlertCircle className="w-3 h-3" /> Requires medical attention
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'conditions' && (
                    <motion.div key="conditions" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="card p-8 min-h-[400px]">
                      <h2 className="text-2xl font-bold dark:text-white mb-2 border-b border-slate-100 dark:border-slate-700 pb-4">Possible Conditions</h2>
                      <p className="text-xs text-slate-400 mb-6 italic">Based on detected abnormalities — not a diagnosis. Always consult a physician.</p>
                      {!results?.possibleConditions?.length ? (
                        <div className="text-center py-16 text-slate-400">
                          <CheckCircle className="w-12 h-12 mx-auto mb-3 text-emerald-400" />
                          <p className="font-semibold">No notable conditions suggested</p>
                          <p className="text-sm mt-1">Your findings appear within normal ranges.</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {results.possibleConditions.map((cond, idx) => (
                            <div key={idx} className="p-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="font-bold text-slate-900 dark:text-white text-lg">{cond.name}</h4>
                                <span className={`text-xs px-3 py-1 rounded-full font-bold border ${
                                  cond.likelihood === 'Likely' ? 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400' :
                                  cond.likelihood === 'Probable' ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400' :
                                  'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400'
                                }`}>{cond.likelihood}</span>
                              </div>
                              <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
                                <Activity className="w-4 h-4 text-medical-teal shrink-0" /> Based on: {cond.basedOn}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}

                  {activeTab === 'nutrition' && (
                    <motion.div key="nutrition" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="card p-8 bg-gradient-to-br from-medical-teal/5 to-transparent min-h-[400px]">
                      <h2 className="text-2xl font-bold text-medical-blue dark:text-white mb-6 flex items-center gap-3 border-b border-medical-teal/20 pb-4">
                        <Apple className="w-8 h-8 text-medical-teal" /> Personalized Nutrition Plan
                      </h2>
                      <div className="space-y-5">
                        {results?.nutritionPlan?.map((plan, idx) => (
                          <div key={idx} className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row gap-5">
                            <div className="shrink-0 w-12 h-12 bg-medical-teal/10 rounded-2xl flex items-center justify-center text-medical-teal font-bold text-lg border border-medical-teal/20">{idx + 1}</div>
                            <div className="flex-1">
                              <h4 className="font-bold text-slate-900 dark:text-white text-lg">{plan.nutrient}</h4>
                              <p className="text-medical-teal font-medium mb-3 mt-0.5 text-sm">{plan.reason}</p>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-xl border border-slate-100 dark:border-slate-600">
                                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Recommended Foods</span>
                                  <span className="text-slate-700 dark:text-slate-300 font-medium text-sm">{plan.foods}</span>
                                </div>
                                <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-xl border border-slate-100 dark:border-slate-600">
                                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Action Step</span>
                                  <span className="text-slate-700 dark:text-slate-300 font-medium text-sm">{plan.action}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'lifestyle' && (
                    <motion.div key="lifestyle" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="card p-8 min-h-[400px]">
                      <h2 className="text-2xl font-bold dark:text-white mb-6 flex items-center gap-3 border-b border-slate-100 dark:border-slate-700 pb-4">
                        <Heart className="w-7 h-7 text-red-400" /> Lifestyle Recommendations
                      </h2>
                      <div className="space-y-4">
                        {results?.lifestyleRecommendations?.map((rec, idx) => (
                          <div key={idx} className="flex items-start gap-4 p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                            <div className="shrink-0 w-10 h-10 rounded-xl bg-medical-blue/10 dark:bg-medical-teal/10 flex items-center justify-center">
                              <Zap className="w-5 h-5 text-medical-blue dark:text-medical-teal" />
                            </div>
                            <p className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed">{rec}</p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReportAnalyzer;
