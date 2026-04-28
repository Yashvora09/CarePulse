import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import Home from './pages/Home';
import SymptomChecker from './pages/SymptomChecker';
import Appointments from './pages/Appointments';
import Medicines from './pages/Medicines';
import Reminders from './pages/Reminders';
import Facilities from './pages/Facilities';
import ReportAnalyzer from './pages/ReportAnalyzer';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Signup from './pages/Signup';
import HealthBot from './components/HealthBot';
import { useState, useEffect } from 'react';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <Router>
      <LanguageProvider>
      <AuthProvider>
        <div className="min-h-screen flex flex-col font-sans text-slate-800 dark:text-slate-100 bg-medical-light dark:bg-slate-900 transition-colors duration-200">
          <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

          <main className="flex-grow pt-16">
            <Routes>
              {/* Public routes — no login needed */}
              <Route path="/" element={<Home />} />
              <Route path="/symptoms" element={<SymptomChecker />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              {/* Protected routes — login required */}
              <Route path="/appointments" element={<ProtectedRoute><Appointments /></ProtectedRoute>} />
              <Route path="/medicines" element={<ProtectedRoute><Medicines /></ProtectedRoute>} />
              <Route path="/reminders" element={<ProtectedRoute><Reminders /></ProtectedRoute>} />
              <Route path="/facilities" element={<ProtectedRoute><Facilities /></ProtectedRoute>} />
              <Route path="/analyzer" element={<ProtectedRoute><ReportAnalyzer /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            </Routes>
          </main>

          <Footer />
          <HealthBot />
        </div>
      </AuthProvider>
      </LanguageProvider>
    </Router>
  );
}

export default App;
