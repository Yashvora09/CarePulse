import { useState } from 'react';
import { MessageSquare, X, Send, User, Bot, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const HealthBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', content: "Hi there! I'm your CarePulse Assistant. How can I help you today?" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const SUGGESTIONS = [
    "I have a headache",
    "Where is the nearest pharmacy?",
    "Remind me to take my pills"
  ];

  const handleSend = (text) => {
    if (!text.trim()) return;
    
    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      let response = "I can certainly help you navigate CarePulse. Try visiting the Symptom Checker or Booking an Appointment.";
      if (text.toLowerCase().includes('headache') || text.toLowerCase().includes('sick')) {
        response = "I'm sorry you're not feeling well. I recommend using our Symptom Checker for a preliminary analysis, or booking an appointment with a General Practitioner.";
      } else if (text.toLowerCase().includes('pharmacy') || text.toLowerCase().includes('hospital')) {
        response = "You can find nearby medical facilities by navigating to the 'Facilities' tab in the main menu.";
      }

      setMessages(prev => [...prev, { role: 'bot', content: response }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 bg-medical-blue text-white rounded-full shadow-lg flex items-center justify-center z-40 transition-transform ${isOpen ? 'scale-0 opacity-0 pointer-events-none' : ''}`}
      >
        <MessageSquare className="w-6 h-6" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 w-[350px] sm:w-[400px] h-[500px] max-h-[80vh] bg-white dark:bg-slate-800 rounded-2xl shadow-2xl z-50 flex flex-col border border-slate-200 dark:border-slate-700 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-medical-blue p-4 flex justify-between items-center text-white shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold">CarePulse AI</h3>
                  <p className="text-xs text-white/80">Always here to help</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-900/50">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-medical-teal text-white' : 'bg-medical-blue/10 text-medical-blue dark:bg-slate-700 dark:text-white'}`}>
                    {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  <div className={`max-w-[75%] p-3 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-medical-teal text-white rounded-tr-none' : 'bg-white border border-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 rounded-tl-none shadow-sm'}`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-medical-blue/10 flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4 text-medical-blue" />
                  </div>
                  <div className="bg-white border border-slate-200 dark:bg-slate-800 dark:border-slate-700 p-3 rounded-2xl rounded-tl-none shadow-sm flex gap-1 items-center">
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              )}
            </div>

            {/* Suggestions */}
            {messages.length === 1 && !isTyping && (
              <div className="p-3 bg-slate-50 dark:bg-slate-900/50 flex flex-wrap gap-2 shrink-0">
                {SUGGESTIONS.map((text, i) => (
                  <button 
                    key={i}
                    onClick={() => handleSend(text)}
                    className="text-xs px-3 py-1.5 bg-white border border-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 rounded-full hover:border-medical-teal dark:hover:border-medical-teal transition-colors"
                  >
                    {text}
                  </button>
                ))}
              </div>
            )}

            {/* Input Area */}
            <div className="p-3 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 shrink-0">
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
                className="flex items-center gap-2"
              >
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask a health question..."
                  className="flex-1 bg-slate-100 dark:bg-slate-700 dark:text-white rounded-full px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-medical-blue/50"
                />
                <button 
                  type="submit"
                  disabled={!input.trim()}
                  className="w-10 h-10 rounded-full bg-medical-blue text-white flex items-center justify-center shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4 ml-0.5" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default HealthBot;
