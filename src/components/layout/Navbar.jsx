import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Activity, Bell, Moon, Sun, X, User, LogOut, LayoutGrid, Heart, Stethoscope, Pill, MapPin, FileText, Clock } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLang } from '../../context/LanguageContext';

// App feature links — names translated at render time
const APP_FEATURE_KEYS = [
  { key: 'feat_symptoms', path: '/symptoms', icon: Activity, color: 'text-medical-teal', bg: 'bg-medical-teal/10' },
  { key: 'feat_reports', path: '/analyzer', icon: FileText, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
  { key: 'feat_doctors', path: '/appointments', icon: Stethoscope, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20' },
  { key: 'feat_medicines', path: '/medicines', icon: Pill, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
  { key: 'feat_reminders', path: '/reminders', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20' },
  { key: 'feat_facilities', path: '/facilities', icon: MapPin, color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-900/20' },
];

// Landing-page nav link keys
const NAV_LINK_KEYS = [
  { key: 'nav_home', path: '/' },
  { key: 'nav_features', path: '/#features' },
  { key: 'nav_about', path: '/#about' },
  { key: 'nav_testimonials', path: '/#testimonials' },
];

const Navbar = ({ darkMode, toggleDarkMode }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isLoggedIn, logout } = useAuth();
  const { lang, toggleLang, t } = useLang();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    setDrawerOpen(false);
    navigate('/');
  };

  return (
    <>
      {/* ── Navbar ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">

            {/* Left: App drawer toggle + Logo */}
            <div className="flex items-center gap-3">
              {/* Hamburger / App Grid toggle */}
              <button
                onClick={() => setDrawerOpen(true)}
                aria-label="Open app menu"
                className="p-2 rounded-xl text-slate-500 hover:text-medical-blue hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition-colors"
              >
                <LayoutGrid className="w-5 h-5" />
              </button>

              <Link to="/" className="flex items-center gap-2">
                <div className="bg-medical-blue text-white p-1.5 rounded-lg">
                  <Activity className="w-5 h-5" />
                </div>
                <span className="font-bold text-xl tracking-tight text-medical-blue dark:text-white">
                  CarePulse
                </span>
              </Link>
            </div>

            {/* Centre: Landing nav links (desktop only) */}
            <div className="hidden md:flex items-center gap-1">
              {NAV_LINK_KEYS.map((link) => (
                <Link
                  key={link.key}
                  to={link.path}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(link.path)
                      ? 'text-medical-teal bg-medical-teal/8'
                      : 'text-slate-600 dark:text-slate-300 hover:text-medical-teal hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {t(link.key)}
                </Link>
              ))}
            </div>

            {/* Right: actions */}
            <div className="flex items-center gap-2">
              {/* Language Toggle (Disabled temporarily) */}
              {/* <button
                onClick={toggleLang}
                title={lang === 'en' ? 'Switch to Hindi' : 'Switch to English'}
                className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:border-medical-teal hover:text-medical-teal transition-all"
              >
                <span className="text-base leading-none">{lang === 'en' ? '🇮🇳' : '🇬🇧'}</span>
                {lang === 'en' ? 'हिं' : 'EN'}
              </button> */}
              <button
                onClick={toggleDarkMode}
                className="p-2 text-slate-500 hover:text-medical-blue dark:text-slate-400 dark:hover:text-white transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {isLoggedIn ? (
                <>
                  <button className="relative p-2 text-slate-500 hover:text-medical-blue dark:text-slate-400 dark:hover:text-white transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
                  </button>

                  <Link
                    to="/profile"
                    className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-full bg-medical-blue text-white flex items-center justify-center text-xs font-bold">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 hidden sm:block max-w-[80px] truncate">
                      {user?.name}
                    </span>
                  </Link>

                  <button
                    onClick={handleLogout}
                    title={t('nav_logout')}
                    className="p-2 text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="hidden sm:block font-semibold text-slate-600 hover:text-medical-blue dark:text-slate-300 dark:hover:text-white transition-colors px-3 py-2 text-sm"
                  >
                    {t('nav_login')}
                  </Link>
                  <Link
                    to="/signup"
                    className="flex items-center gap-1.5 btn-primary py-1.5 px-4 rounded-xl text-sm"
                  >
                    <User className="w-4 h-4" />
                    <span className="hidden sm:inline">{t('nav_signup')}</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* ── Side Drawer backdrop ── */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* ── Side Drawer ── */}
      <div
        className={`fixed top-0 left-0 h-full w-72 z-50 bg-white dark:bg-slate-900 shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${
          drawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-medical-blue to-blue-700">
          <div className="flex items-center gap-2 text-white">
            <Heart className="w-5 h-5" />
            <span className="font-bold text-lg">{t('nav_app_title')}</span>
          </div>
          <div className="flex items-center gap-3">
            {/* Language toggle inside drawer (Disabled temporarily) */}
            {/* <button
              onClick={toggleLang}
              className="flex items-center gap-1 px-2 py-1 rounded-md bg-white/20 text-white text-xs font-bold hover:bg-white/30 transition"
            >
              <span>{lang === 'en' ? '🇮🇳' : '🇬🇧'}</span>
              {lang === 'en' ? 'हिं' : 'EN'}
            </button> */}
            <button onClick={() => setDrawerOpen(false)} className="text-white/70 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Feature list */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 px-3 mb-3">
            {t('nav_health_tools')}
          </p>
          <div className="space-y-1">
            {APP_FEATURE_KEYS.map((feature) => (
              <Link
                key={feature.key}
                to={feature.path}
                onClick={() => setDrawerOpen(false)}
                className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group"
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${feature.bg}`}>
                  <feature.icon className={`w-5 h-5 ${feature.color}`} />
                </div>
                <span className="font-semibold text-slate-700 dark:text-slate-200 group-hover:text-medical-blue dark:group-hover:text-medical-teal transition-colors">
                  {t(feature.key)}
                </span>
              </Link>
            ))}
          </div>

          {/* Divider */}
          <div className="border-t border-slate-100 dark:border-slate-800 my-4" />

          {/* Auth actions */}
          {isLoggedIn ? (
            <div className="space-y-1">
              <Link
                to="/profile"
                onClick={() => setDrawerOpen(false)}
                className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="w-9 h-9 rounded-xl bg-medical-blue/10 flex items-center justify-center">
                  <div className="w-6 h-6 rounded-full bg-medical-blue text-white text-xs font-bold flex items-center justify-center">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-slate-700 dark:text-slate-200 text-sm">{user?.name}</p>
                  <p className="text-xs text-slate-400 truncate max-w-[160px]">{user?.email}</p>
                </div>
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 dark:text-red-400 transition-colors"
              >
                <div className="w-9 h-9 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
                  <LogOut className="w-5 h-5" />
                </div>
                <span className="font-semibold">Logout</span>
              </button>
            </div>
          ) : (
            <div className="space-y-2 px-1">
              <Link
                to="/login"
                onClick={() => setDrawerOpen(false)}
                className="w-full block text-center py-2.5 rounded-xl border-2 border-medical-blue text-medical-blue font-bold text-sm hover:bg-medical-blue hover:text-white transition-all"
              >
                {t('nav_login')}
              </Link>
              <Link
                to="/signup"
                onClick={() => setDrawerOpen(false)}
                className="w-full block text-center py-2.5 rounded-xl bg-medical-blue text-white font-bold text-sm hover:bg-blue-700 transition-all"
              >
                {t('nav_create_account')}
              </Link>
            </div>
          )}
        </nav>

        {/* Drawer footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-400">
          {t('nav_drawer_footer')}
        </div>
      </div>
    </>
  );
};

export default Navbar;