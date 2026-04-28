import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LanguageContext';
import { Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useAuth();
  const { t } = useLang();
  const location = useLocation();

  if (!isLoggedIn) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-medical-blue/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-10 h-10 text-medical-blue" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
            {t('lock_title')}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8">
            {t('lock_desc')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/login"
              state={{ from: location.pathname }}
              className="btn-primary px-8 py-3 text-base font-bold rounded-xl shadow-lg"
            >
              {t('lock_login')}
            </Link>
            <Link
              to="/signup"
              className="px-8 py-3 text-base font-bold rounded-xl border-2 border-medical-blue text-medical-blue dark:border-medical-teal dark:text-medical-teal hover:bg-medical-blue hover:text-white dark:hover:bg-medical-teal dark:hover:text-white transition-all"
            >
              {t('lock_create')}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
