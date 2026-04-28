import { Link, useNavigate } from 'react-router-dom';
import { Activity, Mail, Lock, User, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LanguageContext';

const Signup = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t } = useLang();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');

  const handleSignup = (e) => {
    e.preventDefault();
    setError('');
    if (!name || !email || !password) {
      setError(t('signup_err_fields'));
      return;
    }
    if (password.length < 6) {
      setError(t('signup_err_short'));
      return;
    }
    // Save auth state (name + email) and redirect
    login({ name, email });
    navigate('/profile', { replace: true });
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-medical-teal/10 mb-4">
            <Activity className="w-8 h-8 text-medical-teal" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{t('signup_title')}</h1>
          <p className="text-slate-500 mt-2">{t('signup_sub')}</p>
        </div>

        <div className="card p-8 shadow-xl">
          {error && (
            <div className="mb-5 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 text-red-600 dark:text-red-400 rounded-xl text-sm font-medium">
              {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSignup}>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t('signup_name')}</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/50 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-medical-teal outline-none transition-all dark:text-white"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t('signup_email')}</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/50 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-medical-teal outline-none transition-all dark:text-white"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t('signup_password')}</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/50 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-medical-teal outline-none transition-all dark:text-white"
                  placeholder="Min. 6 characters"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-xs text-slate-400 mt-1.5">{t('signup_min')}</p>
            </div>

            <button type="submit" className="w-full btn-primary bg-medical-teal hover:bg-teal-600 py-3 flex items-center justify-center gap-2 group mt-4 text-base font-bold">
              {t('signup_btn')} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-slate-700 pt-5">
            {t('signup_have_acc')}{' '}
            <Link to="/login" className="text-medical-blue dark:text-medical-teal font-bold hover:underline">
              {t('signup_signin')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
