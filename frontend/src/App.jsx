import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Send, Sparkles, Book, User, Bot, X, ExternalLink, ChevronRight, RotateCcw, Compass } from 'lucide-react';

// Use the environment variable if it exists, otherwise use localhost for dev
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const CHAPTER_COUNTS = [47, 72, 43, 42, 29, 47, 30, 28, 34, 42, 55, 20, 35, 27, 20, 24, 28, 78];

const SAMPLE_QUESTIONS = [
  { text: "Finding peace in chaos", icon: "🕉️", desc: "Mindfulness and stability" },
  { text: "Dealing with exam stress", icon: "📖", desc: "Focus and detached action" },
  { text: "Understanding my Duty", icon: "⚔️", desc: "Finding your life's purpose" },
  { text: "Overcoming failure", icon: "🌅", desc: "Resilience and growth" },
];

function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: 'bot', content: "Namaste, seeker. I am Gita GPT. How may I guide your dharma today?" }
  ]);
  const [loading, setLoading] = useState(false);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [activeChapter, setActiveChapter] = useState(1);
  const [selectedVerse, setSelectedVerse] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const chatContainerRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({ top: chatContainerRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, loading]);

  const sendMessage = async (overrideInput) => {
    const queryText = overrideInput || input;
    if (!queryText.trim() || loading) return;
    if (!overrideInput) setInput("");
    setIsLibraryOpen(false);

    const userMsg = { role: 'user', content: queryText };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE}/chat`, { query: queryText });
      setMessages(prev => [...prev, { 
        role: 'bot', 
        content: response.data.answer,
        sources: response.data.references || [] 
      }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'bot', content: "The divine link is momentarily broken. Please ensure the backend is running." }]);
    } finally {
      setLoading(false);
    }
  };

  const openVerse = async (ref) => {
    const match = ref.match(/(\d+)\.(\d+)/);
    if (!match) return;
    const [_, ch, vr] = match;
    try {
      const response = await axios.get(`${API_BASE}/verse/${ch}/${vr}`);
      setSelectedVerse(response.data);
      setIsModalOpen(true);
    } catch (e) {
      alert("Verse not found.");
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCF0] flex flex-col font-serif text-[#3E2723] selection:bg-saffron/30">
      
      {/* GLASSMORPHIC NAVBAR */}
      <nav className="bg-white/90 backdrop-blur-md border-b border-gold/20 py-4 px-6 sticky top-0 z-50 shadow-sm">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.location.reload()}>
            <div className="bg-gradient-to-br from-[#FF9933] to-[#FFD700] p-2 rounded-xl shadow-lg">
              <Sparkles className="text-white w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-[#5D4037] leading-none">Gita<span className="text-[#FF9933]">GPT</span></h1>
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#B8860B] font-bold">The Eternal Voice</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button onClick={() => setMessages([{ role: 'bot', content: "Namaste. How may I guide you?" }])} className="p-2 hover:bg-gold/10 rounded-full transition-colors text-[#8B4513]/50"><RotateCcw size={20}/></button>
            <button 
              onClick={() => setIsLibraryOpen(!isLibraryOpen)}
              className={`flex items-center gap-2 px-5 py-2 rounded-full border-2 transition-all font-bold text-sm ${
                isLibraryOpen ? 'bg-[#5D4037] text-white border-transparent' : 'bg-white text-[#5D4037] border-[#FFD700]/30 hover:border-[#FF9933]'
              }`}
            >
              <Book size={18} /> <span className="hidden sm:inline">{isLibraryOpen ? "Close" : "Library"}</span>
            </button>
          </div>
        </div>
      </nav>

      {/* MODERN LIBRARY DRAWER */}
      {isLibraryOpen && (
        <div className="bg-white/95 border-b border-[#FFD700]/20 shadow-2xl z-40 overflow-hidden animate-in slide-in-from-top duration-500">
          <div className="max-w-5xl mx-auto p-6 flex flex-col md:flex-row gap-8 h-[45vh]">
            <div className="md:w-1/3 overflow-y-auto pr-4 border-r border-gold/10 custom-scrollbar">
              <p className="text-[10px] font-black text-[#FF9933] uppercase tracking-widest mb-4">Select Discourse</p>
              {CHAPTER_COUNTS.map((_, i) => (
                <button
                  key={i} onClick={() => setActiveChapter(i + 1)}
                  className={`w-full text-left px-4 py-3 mb-1 rounded-xl text-sm flex justify-between items-center transition-all ${
                    activeChapter === i + 1 ? 'bg-gradient-to-r from-[#FF9933] to-[#FFD700] text-white shadow-md font-bold' : 'hover:bg-gold/5 text-[#5D4037]'
                  }`}
                >
                  Chapter {i + 1}
                  <ChevronRight size={14} className={activeChapter === i + 1 ? "opacity-100" : "opacity-0"} />
                </button>
              ))}
            </div>
            <div className="md:w-2/3 overflow-y-auto custom-scrollbar">
              <p className="text-[10px] font-black text-[#FF9933] uppercase tracking-widest mb-4">Slokas of Chapter {activeChapter}</p>
              <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 pb-4">
                {Array.from({ length: CHAPTER_COUNTS[activeChapter - 1] }, (_, i) => (
                  <button
                    key={i} onClick={() => openVerse(`${activeChapter}.${i + 1}`)}
                    className="aspect-square flex items-center justify-center border-2 border-gold/10 rounded-xl hover:bg-[#FF9933] hover:text-white hover:border-transparent transition-all text-xs font-bold text-[#5D4037]"
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MAIN CHAT AREA */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 md:p-8 overflow-y-auto custom-scrollbar" ref={chatContainerRef}>
        
        {/* VIBRANT EMPTY STATE */}
        {messages.length <= 1 && !loading && (
          <div className="py-12 flex flex-col items-center animate-in fade-in zoom-in duration-1000">
            <div className="bg-white/50 border border-[#FFD700]/20 p-8 rounded-[3rem] text-center shadow-xl mb-12 max-w-lg">
              <Compass className="w-12 h-12 text-[#FF9933] mx-auto mb-4" />
              <h2 className="text-3xl font-black text-[#5D4037] mb-3">Begin your Reflection</h2>
              <p className="text-sm text-[#8D6E63] leading-relaxed italic">The Gita holds answers for every struggle. Select a path below or type your heart's query.</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              {SAMPLE_QUESTIONS.map((q, i) => (
                <button
                  key={i} onClick={() => sendMessage(q.text)}
                  className="bg-white border-2 border-[#FFD700]/10 p-6 rounded-[2rem] text-left hover:border-[#FF9933] hover:shadow-2xl hover:-translate-y-1 transition-all group flex items-start gap-5 shadow-sm"
                >
                  <div className="text-4xl bg-[#FFF8E1] p-3 rounded-2xl group-hover:bg-[#FF9933]/10 transition-colors">{q.icon}</div>
                  <div>
                    <p className="text-[#5D4037] font-black text-lg group-hover:text-[#FF9933] transition-colors leading-tight">{q.text}</p>
                    <p className="text-[11px] text-[#8D6E63] uppercase tracking-wider mt-1 font-bold">{q.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* CHAT BUBBLES */}
        <div className="space-y-8 pb-40">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-4 duration-500`}>
              <div className={`flex gap-4 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${msg.role === 'user' ? 'bg-[#5D4037]' : 'bg-gradient-to-br from-[#FF9933] to-[#FFD700]'}`}>
                  {msg.role === 'user' ? <User size={20} className="text-white" /> : <Bot size={20} className="text-white" />}
                </div>
                <div className={`p-6 rounded-[2rem] shadow-sm border relative overflow-hidden ${
                  msg.role === 'user' ? 'bg-[#5D4037] text-white border-transparent rounded-tr-none' : 'bg-white border-[#FFD700]/20 rounded-tl-none'
                }`}>
                  {msg.role === 'bot' && <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/paper.png')]"></div>}
                  <p className="leading-relaxed text-[16px] font-medium whitespace-pre-line tracking-tight">{msg.content}</p>
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-5 flex flex-wrap gap-2 pt-4 border-t border-gold/10">
                      {msg.sources.map(src => (
                        <button key={src} onClick={() => openVerse(src)} className="text-[10px] font-black bg-[#FFF8E1] text-[#B8860B] px-3 py-1.5 rounded-full border border-[#FFD700]/30 hover:bg-[#FF9933]/10 flex items-center gap-1.5 uppercase transition-all">
                          {src} <ExternalLink size={10} />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex items-center gap-4 ml-14">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 bg-[#FF9933] rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-[#FF9933] rounded-full animate-bounce [animation-delay:-0.2s]"></div>
                <div className="w-2 h-2 bg-[#FF9933] rounded-full animate-bounce [animation-delay:-0.4s]"></div>
              </div>
              <span className="text-[#B8860B] text-xs font-black uppercase tracking-widest">Consulting Shastras...</span>
            </div>
          )}
        </div>
      </main>

      {/* STICKY INPUT BAR - HIGH VISIBILITY */}
      <footer className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-[#FDFCF0] via-[#FDFCF0] to-transparent p-6 md:pb-12 pt-20 z-40">
        <div className="max-w-3xl mx-auto relative group">
          <input 
            type="text" value={input} onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="What weighs on your heart?"
            className="w-full bg-white border-2 border-[#FFD700]/30 p-5 pr-20 rounded-[2.5rem] shadow-2xl focus:border-[#FF9933] focus:ring-4 focus:ring-[#FF9933]/10 outline-none transition-all placeholder:text-gray-300 font-medium text-lg"
          />
          <button 
            onClick={() => sendMessage()} 
            disabled={loading || !input.trim()} 
            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-4 bg-gradient-to-br from-[#FF9933] to-orange-600 text-white rounded-full shadow-[0_0_20px_rgba(255,153,51,0.4)] hover:shadow-[0_0_25px_rgba(255,153,51,0.6)] hover:-translate-y-[55%] transition-all disabled:grayscale disabled:opacity-50 active:scale-90 z-50"
          >
            <Send size={24} className={loading ? "animate-pulse" : ""} />
          </button>
        </div>
        <p className="text-center mt-4 text-[10px] font-bold text-[#8B4513]/30 uppercase tracking-[0.3em]">
          Wisdom of the Ages • Powered by Gita GPT
        </p>
      </footer>

      {/* SACRED VERSE MODAL */}
      {isModalOpen && selectedVerse && (
        <div className="fixed inset-0 bg-[#3E2723]/90 z-[60] flex items-center justify-center p-4 backdrop-blur-md">
          <div className="bg-white rounded-[3.5rem] w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col border-[12px] border-[#FFD700]/10 shadow-2xl animate-in zoom-in duration-300">
            <div className="p-8 bg-gradient-to-r from-[#5D4037] to-[#3E2723] text-white flex justify-between items-center relative overflow-hidden">
               <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/mandala.png')]"></div>
               <div className="flex items-center gap-4 relative z-10">
                 <div className="bg-[#FF9933] p-3 rounded-2xl shadow-xl"><Book size={24} /></div>
                 <div>
                    <h2 className="text-2xl font-black">Discourse {selectedVerse.chapter}.{selectedVerse.verse}</h2>
                    <p className="text-[10px] uppercase tracking-widest text-[#FFD700] opacity-80 font-bold">Divine Manifestation</p>
                 </div>
               </div>
               <button onClick={() => setIsModalOpen(false)} className="bg-white/10 hover:bg-white/30 p-2.5 rounded-full transition-all relative z-10"><X size={28}/></button>
            </div>
            <div className="p-10 overflow-y-auto custom-scrollbar space-y-12">
              <div className="text-center">
                 <p className="text-4xl font-black text-[#5D4037] leading-[1.4] mb-8 px-4 italic">
                   {selectedVerse.data.split('English Meaning:')[0].replace(/Verse \d+\.\d+:/, '').trim()}
                 </p>
                 <div className="h-1 w-24 bg-gradient-to-r from-transparent via-[#FFD700] to-transparent mx-auto rounded-full"></div>
              </div>
              <div className="space-y-4">
                <h3 className="text-[12px] font-black uppercase text-[#FF9933] tracking-[0.3em]">The Meaning</h3>
                <div className="bg-[#FFF8E1] p-8 rounded-[2.5rem] border-l-[10px] border-[#FF9933] shadow-sm italic text-2xl text-[#5D4037] font-medium leading-snug">
                  "{selectedVerse.data.split('English Meaning:')[1]?.split('Deep Explanation:')[0].trim()}"
                </div>
              </div>
              <div className="space-y-4 pb-4">
                <h3 className="text-[12px] font-black uppercase text-[#FF9933] tracking-[0.3em]">Divine Commentary</h3>
                <p className="text-[#5D4037]/80 leading-relaxed text-xl px-2 font-medium">
                  {selectedVerse.data.split('Deep Explanation:')[1]?.trim()}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;