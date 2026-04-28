import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Activity, Stethoscope, Search, ShieldCheck, Pill, MapPin, Star, Quote } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useLang } from '../context/LanguageContext';

const Home = () => {
  const { t } = useLang();
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        // slight delay to allow rendering
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location]);

  const features = [
    {
      icon: <Activity className="w-6 h-6 text-medical-teal" />,
      title: t('feat_symptoms'),
      description: "Input your symptoms and get instant AI-driven insights on potential conditions.",
      link: "/symptoms"
    },
    {
      icon: <Search className="w-6 h-6 text-medical-teal" />,
      title: t('feat_reports'),
      description: "Upload your medical reports and get them translated into plain English.",
      link: "/analyzer"
    },
    {
      icon: <Stethoscope className="w-6 h-6 text-medical-teal" />,
      title: t('feat_doctors'),
      description: "Book appointments with top-rated doctors in your area with a few clicks.",
      link: "/appointments"
    },
    {
      icon: <Pill className="w-6 h-6 text-medical-teal" />,
      title: t('feat_medicines'),
      description: "Never miss a dose with our smart medicine reminder system.",
      link: "/reminders"
    },
    {
      icon: <MapPin className="w-6 h-6 text-medical-teal" />,
      title: t('feat_facilities'),
      description: "Locate the nearest hospitals, clinics, and pharmacies instantly.",
      link: "/facilities"
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-medical-teal" />,
      title: "Secure Health Profile",
      description: "Keep all your medical history safely stored in one encrypted dashboard.",
      link: "/profile"
    }
  ];

  const testimonials = [
    {
      quote: "CarePulse has completely transformed how I manage my family's health. The AI report analyzer is a game changer, explaining complex terms simply.",
      author: "Sarah Jenkins",
      role: "Mother & Patient",
      rating: 5,
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop"
    },
    {
      quote: "As a healthcare professional, I appreciate how CarePulse streamlines the appointment process and keeps patient histories secure and accessible.",
      author: "Dr. Michael Chen",
      role: "Cardiologist",
      rating: 5,
      image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop"
    },
    {
      quote: "The medicine reminder feature ensures I never miss a dose. The interface is beautiful, intuitive, and extremely easy to use daily.",
      author: "Elena Rodriguez",
      role: "Regular User",
      rating: 5,
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop"
    }
  ];
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 lg:pt-32 lg:pb-40 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-medical-blue/5 to-medical-teal/5 z-0" />
        
        {/* Animated Heartbeat Background */}
        <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 opacity-10 pointer-events-none overflow-hidden h-64 z-0">
          <svg viewBox="0 0 1000 100" className="w-[200%] h-full animate-[slide_10s_linear_infinite]">
            <polyline 
              points="0,50 400,50 420,20 440,80 460,50 500,50 520,30 530,50 600,50 620,10 650,90 680,50 1000,50" 
              fill="none" 
              stroke="#0A2472" 
              strokeWidth="2"
              className="dark:stroke-white"
            />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="text-left"
            >
              <span className="inline-block py-1 px-3 rounded-full bg-medical-teal/10 text-medical-teal text-sm font-semibold mb-6 shadow-sm border border-medical-teal/20">
                {t('home_hero_badge')}
              </span>
              <h1 className="text-5xl md:text-6xl font-extrabold text-medical-blue dark:text-white tracking-tight mb-6 leading-tight">
                {t('home_hero_title')} <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-medical-blue to-medical-teal">
                  {t('home_hero_title2')}
                </span>
              </h1>
              <p className="mt-4 text-xl text-slate-600 dark:text-slate-300 max-w-2xl mb-10 leading-relaxed">
                {t('home_hero_sub')}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/profile" className="btn-primary text-lg px-8 py-4 flex items-center justify-center gap-2 group shadow-lg shadow-medical-blue/20 hover:shadow-xl hover:shadow-medical-blue/30 transition-all">
                  {t('home_hero_cta')}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/symptoms" className="btn-secondary text-lg px-8 py-4 flex items-center justify-center gap-2 dark:bg-slate-800 dark:text-white dark:border-slate-700 dark:hover:bg-slate-700 shadow-sm hover:shadow-md transition-all">
                  {t('home_hero_cta2')}
                </Link>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800">
                <img 
                  src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=1000&auto=format&fit=crop" 
                  alt="Modern Healthcare" 
                  className="w-full h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                  <div className="text-white">
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    </div>
                    <p className="font-semibold text-lg">{t('home_trusted')}</p>
                  </div>
                </div>
              </div>
              
              {/* Floating Element */}
              <div className="absolute -bottom-6 -left-6 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 animate-[bounce_3s_infinite]">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Data Security</p>
                    <p className="font-bold text-slate-900 dark:text-white">100% Encrypted</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-white dark:bg-slate-900 z-10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-medical-teal font-semibold tracking-wider uppercase text-sm mb-2 block">Our Services</span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              {t('home_features_title')}
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              {t('home_features_sub')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true, margin: "-50px" }}
              >
                <Link to={feature.link} className="block group h-full">
                  <div className="card p-8 h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-2 dark:hover:border-medical-teal/50 bg-white dark:bg-slate-800 relative overflow-hidden border border-slate-100 dark:border-slate-700">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-medical-teal/10 to-transparent rounded-bl-full -z-10 transition-transform group-hover:scale-110" />
                    
                    <div className="w-14 h-14 bg-medical-teal/10 dark:bg-medical-teal/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-inner">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-medical-teal transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Information Section with Image */}
      <section id="about" className="py-24 bg-slate-50 dark:bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="order-2 lg:order-1"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
                Empowering You with <br />
                <span className="text-medical-teal">Data-Driven Insights</span>
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                We believe that understanding your health shouldn't require a medical degree. Our advanced AI breaks down complex medical jargon into simple, actionable insights.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  "Personalized health recommendations based on your profile",
                  "Secure and HIPAA-compliant data storage",
                  "24/7 access to AI symptom checking",
                  "Seamless integration with local healthcare providers"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-medical-teal/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <ShieldCheck className="w-4 h-4 text-medical-teal" />
                    </div>
                    <span className="text-slate-700 dark:text-slate-300">{item}</span>
                  </li>
                ))}
              </ul>
              <Link to="/about" className="text-medical-teal font-semibold flex items-center gap-2 hover:gap-3 transition-all">
                Learn more about our mission <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="order-1 lg:order-2"
            >
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                  alt="Medical Technology" 
                  className="rounded-2xl shadow-2xl w-full object-cover h-[400px] lg:h-[500px]"
                />
                <div className="absolute -inset-4 border-2 border-medical-teal/20 rounded-2xl -z-10 translate-x-4 translate-y-4"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials / Quotes Section */}
      <section id="testimonials" className="py-24 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-medical-teal font-semibold tracking-wider uppercase text-sm mb-2 block">Testimonials</span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              {t('home_testimonials_title')}
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Don't just take our word for it. Here's how CarePulse is making a difference in people's lives.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-8 relative border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-xl transition-shadow flex flex-col"
              >
                <Quote className="absolute top-6 right-6 w-10 h-10 text-medical-teal/20" />
                <div className="flex items-center gap-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-slate-700 dark:text-slate-300 italic mb-8 relative z-10 flex-grow">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center gap-4 mt-auto">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.author} 
                    className="w-14 h-14 rounded-full object-cover border-2 border-medical-teal/20"
                  />
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">{testimonial.author}</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-medical-blue to-medical-teal z-0" />
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] z-0 mix-blend-overlay"></div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center text-white">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">{t('home_cta_title')}</h2>
          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
            {t('home_cta_sub')}
          </p>
          <Link to="/profile" className="inline-flex items-center justify-center gap-2 bg-white text-medical-blue font-bold text-lg px-8 py-4 rounded-xl hover:bg-slate-50 hover:scale-105 transition-all shadow-xl">
            {t('home_cta_btn')} <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slide {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}} />
    </div>
  );
};

export default Home;
