import { useState, useEffect } from 'react';
import { Bell, Plus, Clock, Check, X, Calendar, Settings, Loader2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLang } from '../context/LanguageContext';

const Reminders = () => {
  const { t } = useLang();
  const [showAddForm, setShowAddForm] = useState(false);
  const [reminders, setReminders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Form State
  const [medName, setMedName] = useState('');
  const [dose, setDose] = useState('');
  const [time, setTime] = useState('');
  const [type, setType] = useState('Pill');

  const fetchReminders = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('http://localhost:5000/api/reminders');
      if (!res.ok) throw new Error('Backend not running');
      const data = await res.json();
      setReminders(data);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Could not connect to database. Make sure your Node backend is running on port 5000. Showing offline mock data.');
      // Fallback data if backend is not running
      setReminders([
        { _id: "1", medName: "Amoxicillin", dose: "500mg", time: "08:00 AM", status: "taken", type: "Pill" },
        { _id: "2", medName: "Lisinopril", dose: "10mg", time: "02:00 PM", status: "pending", type: "Tablet" },
        { _id: "3", medName: "Vitamin D3", dose: "1000 IU", time: "08:00 PM", status: "pending", type: "Capsule" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReminders();
  }, []);

  const handleAddReminder = async (e) => {
    e.preventDefault();
    const newReminder = { medName, dose, time, status: 'pending', type };

    try {
      const res = await fetch('http://localhost:5000/api/reminders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReminder)
      });
      
      if (res.ok) {
        fetchReminders(); // Refresh list
      } else {
        // If backend fails, just add to local state for demo purposes
        setReminders([...reminders, { ...newReminder, _id: Date.now().toString() }]);
      }
    } catch (err) {
      setReminders([...reminders, { ...newReminder, _id: Date.now().toString() }]);
    }
    
    setShowAddForm(false);
    setMedName(''); setDose(''); setTime('');
  };

  const markStatus = async (id, status) => {
    // Optimistic UI update
    setReminders(reminders.map(r => r._id === id ? { ...r, status } : r));

    try {
      await fetch(`http://localhost:5000/api/reminders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
    } catch (err) {
      console.error('Failed to sync status update with DB');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-medical-blue dark:text-white">{t('reminders_title')}</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">{t('reminders_sub')}</p>
        </div>
        <button 
          onClick={() => setShowAddForm(true)}
          className="btn-primary flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
        >
          <Plus className="w-5 h-5" /> Add Reminder
        </button>
      </div>

      {error && (
        <div className="bg-alert-warning/10 border border-alert-warning/30 text-alert-warning p-4 rounded-xl flex items-center gap-3 mb-6">
          <AlertCircle className="w-5 h-5" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold dark:text-white mb-4">Today's Schedule</h2>
          
          {isLoading ? (
            <div className="flex flex-col items-center justify-center p-12 text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin text-medical-teal mb-4" />
              <p>Syncing your schedule...</p>
            </div>
          ) : reminders.length === 0 ? (
            <div className="text-center p-12 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
              <Bell className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">No reminders scheduled for today.</p>
            </div>
          ) : (
            reminders.map(reminder => (
              <motion.div 
                key={reminder._id}
                layout
                className={`card p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all ${reminder.status === 'taken' ? 'opacity-60 bg-slate-50 dark:bg-slate-800/50' : 'hover:border-medical-teal'}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${reminder.status === 'taken' ? 'bg-medical-teal/20 text-medical-teal' : 'bg-medical-blue/10 text-medical-blue dark:text-white shadow-sm'}`}>
                    {reminder.status === 'taken' ? <Check className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
                  </div>
                  <div>
                    <h3 className={`text-lg font-bold ${reminder.status === 'taken' ? 'line-through text-slate-500' : 'text-slate-900 dark:text-white'}`}>
                      {reminder.medName}
                    </h3>
                    <p className="text-slate-500 text-sm font-medium">{reminder.dose} • {reminder.type}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                  <div className="text-xl font-bold text-slate-700 dark:text-slate-300 tracking-wide bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-lg">
                    {reminder.time}
                  </div>
                  {reminder.status === 'pending' && (
                    <div className="flex gap-2">
                      <button 
                        onClick={() => markStatus(reminder._id, 'skipped')}
                        className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-alert-danger hover:bg-alert-danger/10 hover:border-alert-danger/20 transition-all"
                        title="Skip dose"
                      >
                        <X className="w-6 h-6" />
                      </button>
                      <button 
                        onClick={() => markStatus(reminder._id, 'taken')}
                        className="p-2 rounded-xl bg-medical-teal/10 text-medical-teal hover:bg-medical-teal hover:text-white transition-all shadow-sm"
                        title="Mark as taken"
                      >
                        <Check className="w-6 h-6" />
                      </button>
                    </div>
                  )}
                  {reminder.status !== 'pending' && (
                    <span className={`text-sm font-bold uppercase tracking-wider px-3 py-1 rounded-full ${reminder.status === 'taken' ? 'bg-medical-teal/10 text-medical-teal' : 'bg-alert-danger/10 text-alert-danger'}`}>
                      {reminder.status}
                    </span>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </div>

        <div className="space-y-6">
          <div className="card p-6 bg-gradient-to-br from-medical-blue to-blue-800 text-white border-none shadow-xl">
            <h3 className="font-semibold mb-2 opacity-90 flex items-center gap-2">
              <Calendar className="w-5 h-5" /> Weekly Adherence
            </h3>
            <div className="text-5xl font-bold mb-6">86%</div>
            <div className="flex justify-between items-end h-28 gap-2">
              {[60, 80, 100, 40, 100, 80, 0].map((height, i) => (
                <div key={i} className="flex-1 bg-white/10 rounded-t relative group cursor-help hover:bg-white/20 transition-colors">
                  <div 
                    className="absolute bottom-0 w-full bg-medical-teal rounded-t transition-all duration-1000"
                    style={{ height: `${height}%` }}
                  ></div>
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs font-bold opacity-70 mt-3">
              <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
            </div>
          </div>

          <div className="card p-6 border-slate-200 dark:border-slate-700">
            <h3 className="font-bold dark:text-white mb-6 flex items-center gap-2 text-lg">
              <Settings className="w-5 h-5 text-slate-400" /> Settings
            </h3>
            <div className="space-y-5">
              <label className="flex items-center justify-between cursor-pointer group">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-medical-teal transition-colors">Push Notifications</span>
                <input type="checkbox" className="toggle toggle-primary" defaultChecked />
              </label>
              <label className="flex items-center justify-between cursor-pointer group">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-medical-teal transition-colors">SMS Alerts</span>
                <input type="checkbox" className="toggle toggle-primary" defaultChecked />
              </label>
              <label className="flex items-center justify-between cursor-pointer group">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-medical-teal transition-colors">Automated Calls</span>
                <input type="checkbox" className="toggle toggle-primary" />
              </label>
            </div>
          </div>
        </div>
      </div>

      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white dark:bg-slate-800 rounded-3xl max-w-md w-full p-8 shadow-2xl border border-slate-100 dark:border-slate-700"
          >
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-bold dark:text-white">Add Medication</h3>
              <button onClick={() => setShowAddForm(false)} className="text-slate-400 hover:text-alert-danger transition-colors bg-slate-50 dark:bg-slate-700 p-2 rounded-full">
                <X className="w-5 h-5"/>
              </button>
            </div>
            
            <form onSubmit={handleAddReminder} className="space-y-5">
              <div>
                <label className="block text-sm font-bold mb-2 text-slate-700 dark:text-slate-300">Medicine Name</label>
                <input 
                  required
                  type="text" 
                  value={medName}
                  onChange={(e) => setMedName(e.target.value)}
                  className="w-full p-4 border border-slate-200 rounded-xl dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-medical-teal outline-none transition-shadow" 
                  placeholder="e.g. Lisinopril" 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-2 text-slate-700 dark:text-slate-300">Dose</label>
                  <input 
                    required
                    type="text" 
                    value={dose}
                    onChange={(e) => setDose(e.target.value)}
                    className="w-full p-4 border border-slate-200 rounded-xl dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-medical-teal outline-none transition-shadow" 
                    placeholder="e.g. 10mg" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2 text-slate-700 dark:text-slate-300">Time</label>
                  <input 
                    required
                    type="time" 
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full p-4 border border-slate-200 rounded-xl dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-medical-teal outline-none transition-shadow" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold mb-2 text-slate-700 dark:text-slate-300">Type</label>
                <select 
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full p-4 border border-slate-200 rounded-xl dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-medical-teal outline-none transition-shadow"
                >
                  <option>Pill</option>
                  <option>Tablet</option>
                  <option>Capsule</option>
                  <option>Liquid</option>
                  <option>Injection</option>
                </select>
              </div>
              <button 
                type="submit"
                className="btn-primary w-full mt-6 py-4 text-lg shadow-lg hover:shadow-xl transition-all"
              >
                Save Reminder
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Reminders;
