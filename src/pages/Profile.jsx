import { User, Activity, Calendar, Pill, Edit3, Mail, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LanguageContext';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { user } = useAuth();
  const { t } = useLang();

  // Derive initials and display name from real auth data
  const displayName = user?.name || 'Guest User';
  const displayEmail = user?.email || '';
  const initials = displayName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  const patientId = '#CP-' + (displayEmail.length > 0
    ? Math.abs(displayEmail.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % 90000 + 10000)
    : '00000');

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">

        {/* Left Sidebar - Personal Info */}
        <div className="w-full lg:w-1/3 space-y-6">
          <div className="card p-6 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-medical-blue to-medical-teal"></div>
            <button className="absolute top-4 right-4 text-white/80 hover:text-white">
              <Edit3 className="w-5 h-5" />
            </button>

            <div className="relative z-10 mt-8">
              {/* Avatar uses real initials */}
              <div className="w-24 h-24 mx-auto rounded-full border-4 border-white dark:border-slate-800 bg-medical-blue flex items-center justify-center mb-4 shadow-lg">
                <span className="text-3xl font-bold text-white">{initials}</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{displayName}</h2>
              {displayEmail && (
                <p className="text-slate-500 text-sm flex items-center justify-center gap-1 mt-1">
                  <Mail className="w-3.5 h-3.5" /> {displayEmail}
                </p>
              )}
              <p className="text-slate-400 text-xs mt-1">Patient ID: {patientId}</p>

              <div className="grid grid-cols-2 gap-4 text-sm mt-6 border-t border-slate-100 dark:border-slate-700 pt-6 text-left">
                <div>
                  <p className="text-slate-500 mb-1">Blood Group</p>
                  <p className="font-semibold text-alert-danger">Not set</p>
                </div>
                <div>
                  <p className="text-slate-500 mb-1">Height</p>
                  <p className="font-semibold dark:text-white">Not set</p>
                </div>
                <div>
                  <p className="text-slate-500 mb-1">Weight</p>
                  <p className="font-semibold dark:text-white">Not set</p>
                </div>
                <div>
                  <p className="text-slate-500 mb-1">Age</p>
                  <p className="font-semibold dark:text-white">Not set</p>
                </div>
              </div>

              <Link
                to="#"
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-medical-teal hover:underline"
              >
                <Edit3 className="w-4 h-4" /> {t('profile_complete')}
              </Link>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="font-bold text-lg dark:text-white mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-medical-teal" /> {t('profile_health')}
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-slate-500 mb-1">{t('profile_allergies')}</p>
                <p className="text-sm text-slate-400 italic">{t('profile_none_recorded')}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">{t('profile_conditions')}</p>
                <p className="text-sm text-slate-400 italic">{t('profile_none_recorded')}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">{t('profile_emergency')}</p>
                <p className="text-sm text-slate-400 italic">{t('profile_not_set')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Content - Dashboard */}
        <div className="w-full lg:w-2/3 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card p-6 bg-gradient-to-br from-medical-blue to-blue-800 text-white">
              <div className="flex items-center gap-3 mb-2 opacity-80">
                <Activity className="w-5 h-5" /> {t('profile_bmi')}
              </div>
              <div className="text-3xl font-bold mb-1">—</div>
              <p className="text-sm font-medium opacity-70">{t('profile_bmi_sub')}</p>
            </div>
            <div className="card p-6 border-l-4 border-l-alert-warning">
              <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400 mb-2">
                <Calendar className="w-5 h-5" /> {t('profile_next_appt')}
              </div>
              <div className="text-xl font-bold dark:text-white mb-1">—</div>
              <p className="text-sm text-slate-400">{t('profile_no_appt')}</p>
            </div>
            <div className="card p-6 border-l-4 border-l-medical-teal">
              <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400 mb-2">
                <Pill className="w-5 h-5" /> {t('profile_next_dose')}
              </div>
              <div className="text-xl font-bold dark:text-white mb-1">—</div>
              <p className="text-sm text-slate-400">{t('profile_no_reminder')}</p>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="font-bold text-xl dark:text-white mb-4">{t('profile_welcome')}, {displayName.split(' ')[0]}! 👋</h3>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
              {t('profile_welcome_sub')}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { label: t('feat_symptoms'), path: '/symptoms', color: 'bg-medical-teal/10 text-medical-teal' },
                { label: t('feat_doctors'), path: '/appointments', color: 'bg-medical-blue/10 text-medical-blue' },
                { label: t('feat_medicines'), path: '/medicines', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
                { label: t('feat_reminders'), path: '/reminders', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
                { label: t('feat_reports'), path: '/analyzer', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
                { label: t('feat_facilities'), path: '/facilities', color: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' },
              ].map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`p-3 rounded-xl text-sm font-semibold text-center transition-all hover:scale-105 ${item.color}`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;
