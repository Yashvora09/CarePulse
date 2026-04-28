import { createContext, useContext, useState } from 'react';

const LanguageContext = createContext(null);

export const TRANSLATIONS = {
  en: {
    // Navbar
    nav_home: 'Home',
    nav_features: 'Features',
    nav_about: 'About',
    nav_testimonials: 'Testimonials',
    nav_login: 'Login',
    nav_signup: 'Sign Up',
    nav_logout: 'Logout',
    nav_app_title: 'CarePulse Apps',
    nav_health_tools: 'Health Tools',
    nav_drawer_footer: 'CarePulse v1.0 · Your Health Companion',
    nav_create_account: 'Create Free Account',

    // App features (drawer)
    feat_symptoms: 'Symptom Checker',
    feat_reports: 'Reports Analyzer',
    feat_doctors: 'Find Doctors',
    feat_medicines: 'Medicines',
    feat_reminders: 'Reminders',
    feat_facilities: 'Facilities',

    // Protected route lock screen
    lock_title: 'Login Required',
    lock_desc: 'Please log in or create a free account to access this feature. Only the Symptom Checker is available without an account.',
    lock_login: 'Login',
    lock_create: 'Create Free Account',

    // Home page
    home_hero_badge: 'AI-Powered Healthcare',
    home_hero_title: 'Your Complete',
    home_hero_title2: 'Health Companion',
    home_hero_sub: 'Advanced symptom analysis, instant doctor booking, AI report translation, and real-time facility locator — all in one secure platform.',
    home_hero_cta: 'Start for Free',
    home_hero_cta2: 'Learn More',
    home_features_title: 'Everything you need for better health',
    home_features_sub: 'CarePulse combines cutting-edge AI with a beautiful, easy-to-use interface to give you a complete health management solution.',
    home_trusted: 'Trusted by thousands of patients and doctors',
    home_testimonials_title: 'What our users say',
    home_cta_title: 'Start your health journey today',
    home_cta_sub: 'Join CarePulse and take control of your health with AI-powered tools.',
    home_cta_btn: 'Get Started Free',

    // Login
    login_welcome: 'Welcome Back',
    login_sub: 'Sign in to access your health dashboard',
    login_email: 'Email Address',
    login_password: 'Password',
    login_forgot: 'Forgot password?',
    login_btn: 'Sign In',
    login_no_acc: "Don't have an account?",
    login_signup_link: 'Sign up for free',
    login_err_fields: 'Please enter both email and password.',
    login_err_short: 'Password must be at least 4 characters.',

    // Signup
    signup_title: 'Create an Account',
    signup_sub: 'Join CarePulse and manage your health',
    signup_name: 'Full Name',
    signup_email: 'Email Address',
    signup_password: 'Password',
    signup_min: 'Minimum 6 characters',
    signup_btn: 'Create Account',
    signup_have_acc: 'Already have an account?',
    signup_signin: 'Sign in instead',
    signup_err_fields: 'Please fill in all fields.',
    signup_err_short: 'Password must be at least 6 characters.',

    // Profile
    profile_complete: 'Complete your profile',
    profile_not_set: 'Not set',
    profile_none_recorded: 'None recorded yet',
    profile_blood: 'Blood Group',
    profile_height: 'Height',
    profile_weight: 'Weight',
    profile_age: 'Age',
    profile_allergies: 'Allergies',
    profile_conditions: 'Chronic Conditions',
    profile_emergency: 'Emergency Contact',
    profile_health: 'Health Details',
    profile_welcome: 'Welcome',
    profile_welcome_sub: 'Your health dashboard is ready. Start by exploring the app features — check your symptoms, find a doctor, search medicines, or upload a medical report for AI analysis.',
    profile_bmi: 'BMI Status',
    profile_bmi_sub: 'Complete profile to calculate',
    profile_next_appt: 'Next Appt',
    profile_no_appt: 'No appointment booked',
    profile_next_dose: 'Next Dose',
    profile_no_reminder: 'No reminders set',

    // Symptom Checker
    symptoms_title: 'AI Symptom Checker',
    symptoms_sub: 'Describe your symptoms and our AI will help identify possible conditions.',

    // Appointments
    appt_title: 'Find a Doctor',
    appt_sub: 'Book appointments with top-rated specialists near you.',
    appt_detect: 'Detect My Location',
    appt_locating: 'Locating...',
    appt_found: 'Nearby Doctors Found',
    appt_search: 'Search by name or specialty...',
    appt_book: 'Book',
    appt_available: 'Available Today',
    appt_next: 'Next Available: Tom',

    // Medicines
    medicines_title: 'Medicine Encyclopedia',
    medicines_sub: 'Search any drug or medicine for detailed clinical information.',
    medicines_search: 'Search medicines, drugs...',
    medicines_btn: 'Search',

    // Reminders
    reminders_title: 'Medicine Reminders',
    reminders_sub: 'Never miss a dose with smart reminders.',

    // Facilities
    facilities_title: 'Nearby Facilities',
    facilities_sub: 'Locate hospitals, clinics, and pharmacies near you.',

    // Report Analyzer
    analyzer_title: 'AI Medical Report Analyzer',
    analyzer_sub: 'Upload your lab results, X-Rays, or MRI reports for clinical-grade AI analysis.',
    analyzer_drag: 'Drag & Drop your report here',
    analyzer_supports: 'Supports PDF, JPG, PNG up to 20MB',
    analyzer_browse: 'Browse Files',
    analyzer_analyzing: 'Analyzing Report...',
    analyzer_another: 'Analyze Another',
    analyzer_download: 'Download Report',
  },

  hi: {
    // Navbar
    nav_home: 'होम',
    nav_features: 'विशेषताएं',
    nav_about: 'हमारे बारे में',
    nav_testimonials: 'समीक्षाएं',
    nav_login: 'लॉगिन',
    nav_signup: 'साइन अप',
    nav_logout: 'लॉगआउट',
    nav_app_title: 'CarePulse ऐप्स',
    nav_health_tools: 'स्वास्थ्य उपकरण',
    nav_drawer_footer: 'CarePulse v1.0 · आपका स्वास्थ्य साथी',
    nav_create_account: 'मुफ़्त खाता बनाएं',

    // App features (drawer)
    feat_symptoms: 'लक्षण जाँचकर्ता',
    feat_reports: 'रिपोर्ट विश्लेषक',
    feat_doctors: 'डॉक्टर खोजें',
    feat_medicines: 'दवाइयाँ',
    feat_reminders: 'रिमाइंडर',
    feat_facilities: 'सुविधाएं',

    // Protected route lock screen
    lock_title: 'लॉगिन आवश्यक है',
    lock_desc: 'इस सुविधा को एक्सेस करने के लिए कृपया लॉगिन करें या मुफ़्त खाता बनाएं। केवल लक्षण जाँचकर्ता बिना खाते के उपलब्ध है।',
    lock_login: 'लॉगिन',
    lock_create: 'मुफ़्त खाता बनाएं',

    // Home page
    home_hero_badge: 'AI-संचालित स्वास्थ्य सेवा',
    home_hero_title: 'आपका संपूर्ण',
    home_hero_title2: 'स्वास्थ्य साथी',
    home_hero_sub: 'उन्नत लक्षण विश्लेषण, तुरंत डॉक्टर बुकिंग, AI रिपोर्ट अनुवाद, और रियल-टाइम सुविधा लोकेटर — सब एक सुरक्षित प्लेटफ़ॉर्म पर।',
    home_hero_cta: 'मुफ़्त शुरू करें',
    home_hero_cta2: 'और जानें',
    home_features_title: 'बेहतर स्वास्थ्य के लिए सब कुछ',
    home_features_sub: 'CarePulse अत्याधुनिक AI को एक सुंदर, उपयोग में आसान इंटरफ़ेस के साथ जोड़कर आपको एक पूर्ण स्वास्थ्य प्रबंधन समाधान देता है।',
    home_trusted: 'हजारों मरीजों और डॉक्टरों द्वारा विश्वसनीय',
    home_testimonials_title: 'हमारे उपयोगकर्ता क्या कहते हैं',
    home_cta_title: 'आज अपनी स्वास्थ्य यात्रा शुरू करें',
    home_cta_sub: 'CarePulse से जुड़ें और AI-संचालित उपकरणों से अपने स्वास्थ्य की देखभाल करें।',
    home_cta_btn: 'मुफ़्त शुरू करें',

    // Login
    login_welcome: 'वापसी पर स्वागत है',
    login_sub: 'अपने स्वास्थ्य डैशबोर्ड तक पहुँचने के लिए साइन इन करें',
    login_email: 'ईमेल पता',
    login_password: 'पासवर्ड',
    login_forgot: 'पासवर्ड भूल गए?',
    login_btn: 'साइन इन करें',
    login_no_acc: 'खाता नहीं है?',
    login_signup_link: 'मुफ़्त साइन अप करें',
    login_err_fields: 'कृपया ईमेल और पासवर्ड दोनों दर्ज करें।',
    login_err_short: 'पासवर्ड कम से कम 4 अक्षर का होना चाहिए।',

    // Signup
    signup_title: 'खाता बनाएं',
    signup_sub: 'CarePulse से जुड़ें और अपने स्वास्थ्य का प्रबंधन करें',
    signup_name: 'पूरा नाम',
    signup_email: 'ईमेल पता',
    signup_password: 'पासवर्ड',
    signup_min: 'न्यूनतम 6 अक्षर',
    signup_btn: 'खाता बनाएं',
    signup_have_acc: 'पहले से खाता है?',
    signup_signin: 'साइन इन करें',
    signup_err_fields: 'कृपया सभी फ़ील्ड भरें।',
    signup_err_short: 'पासवर्ड कम से कम 6 अक्षर का होना चाहिए।',

    // Profile
    profile_complete: 'अपनी प्रोफ़ाइल पूरी करें',
    profile_not_set: 'सेट नहीं है',
    profile_none_recorded: 'अभी तक कोई रिकॉर्ड नहीं',
    profile_blood: 'रक्त समूह',
    profile_height: 'ऊंचाई',
    profile_weight: 'वजन',
    profile_age: 'आयु',
    profile_allergies: 'एलर्जी',
    profile_conditions: 'पुरानी बीमारियां',
    profile_emergency: 'आपातकालीन संपर्क',
    profile_health: 'स्वास्थ्य विवरण',
    profile_welcome: 'स्वागत है',
    profile_welcome_sub: 'आपका स्वास्थ्य डैशबोर्ड तैयार है। लक्षण जाँचें, डॉक्टर खोजें, दवाइयाँ सर्च करें, या AI विश्लेषण के लिए रिपोर्ट अपलोड करें।',
    profile_bmi: 'BMI स्थिति',
    profile_bmi_sub: 'गणना के लिए प्रोफ़ाइल पूरी करें',
    profile_next_appt: 'अगली अपॉइंटमेंट',
    profile_no_appt: 'कोई अपॉइंटमेंट बुक नहीं',
    profile_next_dose: 'अगली खुराक',
    profile_no_reminder: 'कोई रिमाइंडर नहीं',

    // Symptom Checker
    symptoms_title: 'AI लक्षण जाँचकर्ता',
    symptoms_sub: 'अपने लक्षण बताएं और हमारी AI संभावित स्थितियाँ पहचानने में मदद करेगी।',

    // Appointments
    appt_title: 'डॉक्टर खोजें',
    appt_sub: 'अपने पास के शीर्ष-रेटेड विशेषज्ञों के साथ अपॉइंटमेंट बुक करें।',
    appt_detect: 'मेरा स्थान जानें',
    appt_locating: 'स्थान खोज रहे हैं...',
    appt_found: 'नज़दीकी डॉक्टर मिले',
    appt_search: 'नाम या विशेषता से खोजें...',
    appt_book: 'बुक करें',
    appt_available: 'आज उपलब्ध',
    appt_next: 'अगली उपलब्धता: कल',

    // Medicines
    medicines_title: 'दवाई विश्वकोश',
    medicines_sub: 'किसी भी दवा या औषधि की विस्तृत जानकारी खोजें।',
    medicines_search: 'दवाइयाँ, ड्रग्स खोजें...',
    medicines_btn: 'खोजें',

    // Reminders
    reminders_title: 'दवाई रिमाइंडर',
    reminders_sub: 'स्मार्ट रिमाइंडर से कोई खुराक न छूटे।',

    // Facilities
    facilities_title: 'नज़दीकी सुविधाएं',
    facilities_sub: 'अपने पास अस्पताल, क्लिनिक और फार्मेसी खोजें।',

    // Report Analyzer
    analyzer_title: 'AI मेडिकल रिपोर्ट विश्लेषक',
    analyzer_sub: 'क्लिनिकल-ग्रेड AI विश्लेषण के लिए अपनी लैब रिपोर्ट, X-Ray या MRI अपलोड करें।',
    analyzer_drag: 'अपनी रिपोर्ट यहाँ खींचें और छोड़ें',
    analyzer_supports: 'PDF, JPG, PNG 20MB तक समर्थित',
    analyzer_browse: 'फ़ाइलें ब्राउज़ करें',
    analyzer_analyzing: 'रिपोर्ट का विश्लेषण हो रहा है...',
    analyzer_another: 'दूसरी फ़ाइल विश्लेषण करें',
    analyzer_download: 'रिपोर्ट डाउनलोड करें',
  }
};

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => localStorage.getItem('carepulse_lang') || 'en');

  const toggleLang = () => {
    const next = lang === 'en' ? 'hi' : 'en';
    setLang(next);
    localStorage.setItem('carepulse_lang', next);
  };

  const t = (key) => TRANSLATIONS[lang]?.[key] ?? TRANSLATIONS.en[key] ?? key;

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLang = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLang must be used inside LanguageProvider');
  return ctx;
};
