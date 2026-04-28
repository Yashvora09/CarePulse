import { Activity, Heart, Github, Twitter, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12 mt-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1 flex flex-col gap-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-medical-teal text-white p-1.5 rounded-lg">
                <Activity className="w-5 h-5" />
              </div>
              <span className="font-bold text-xl tracking-tight text-white">
                CarePulse
              </span>
            </Link>
            <p className="text-sm text-slate-400">
              Your Health, Intelligently Managed. A modern framework for patient-centric healthcare systems.
            </p>
            <div className="flex gap-4 mt-2">
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Features</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/symptoms" className="hover:text-medical-teal transition-colors">Symptom Checker</Link></li>
              <li><Link to="/appointments" className="hover:text-medical-teal transition-colors">Book Doctor</Link></li>
              <li><Link to="/analyzer" className="hover:text-medical-teal transition-colors">Report Analyzer</Link></li>
              <li><Link to="/medicines" className="hover:text-medical-teal transition-colors">Medicines</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-medical-teal transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-medical-teal transition-colors">Health Blog</a></li>
              <li><a href="#" className="hover:text-medical-teal transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-medical-teal transition-colors">Terms of Service</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Disclaimer</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              CarePulse is an informational AI framework and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
            </p>
          </div>
        </div>
        
        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-sm">
          <p>&copy; {new Date().getFullYear()} CarePulse Healthcare. All rights reserved.</p>
          <p className="flex items-center gap-1 mt-2 md:mt-0">
            Made with <Heart className="w-4 h-4 text-alert-danger" fill="currentColor" /> for modern healthcare
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
