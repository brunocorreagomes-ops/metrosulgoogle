import { useState, useEffect, useRef } from "react";
import { 
  Disc, 
  ChevronDown, 
  Clock, 
  Radio, 
  Terminal, 
  ArrowRight, 
  Compass, 
  Zap, 
  Volume2, 
  VolumeX, 
  Sliders, 
  Activity, 
  Music,
  ExternalLink,
  HelpCircle,
  Menu,
  X,
  Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { AlbumData } from "./types";
import VisualizerCanvas from "./components/VisualizerCanvas";
import OrbitalPortal from "./components/OrbitalPortal";
import SpotifyEmbeds, { ALBUMS } from "./components/SpotifyEmbeds";
import InteractiveSynth from "./components/InteractiveSynth";
import AboutProject from "./components/AboutProject";
import SocialLinks from "./components/SocialLinks";
import { SignalLanguage } from "./components/SignalLanguage";
import { translations, Language } from "./locales";

export default function App() {
  // Set default initial active album to first album ("Beyond Gravity")
  const [activeAlbum, setActiveAlbum] = useState<AlbumData>(ALBUMS[0]);
  const [synthIntensity, setSynthIntensity] = useState<number>(1.0);
  const [timeStr, setTimeStr] = useState<string>("00:00:00 UTC");
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [isBooting, setIsBooting] = useState<boolean>(true);

  // Set up language selection with auto-detection on mount
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem("metrosul_lang");
    if (saved === "pt" || saved === "es" || saved === "en") return saved;
    if (typeof navigator !== "undefined") {
      const browserLangs = navigator.languages || [navigator.language];
      for (const bLang of browserLangs) {
        const normalized = bLang.toLowerCase();
        if (normalized.startsWith("pt")) return "pt";
        if (normalized.startsWith("es")) return "es";
      }
    }
    return "en";
  });

  const t = translations[lang];

  const [bootText, setBootText] = useState<string>("");
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const headerRef = useRef<HTMLElement>(null);
  const audioOnRef = useRef<HTMLButtonElement>(null);
  const pulseDotRef = useRef<HTMLSpanElement>(null);

  const handleLanguageChange = (selected: Language) => {
    setLang(selected);
    localStorage.setItem("metrosul_lang", selected);
  };

  // Retro-cyber system boot simulation sequence
  useEffect(() => {
    const bootSteps = translations[lang].bootSeq;
    const sequence = [
      { delay: 0, text: bootSteps[0] },
      { delay: 250, text: bootSteps[1] },
      { delay: 550, text: bootSteps[2] },
      { delay: 850, text: bootSteps[3] },
      { delay: 1150, text: bootSteps[4] },
      { delay: 1400, text: bootSteps[5] }
    ];

    sequence.forEach((step) => {
      setTimeout(() => {
        setBootText(step.text);
      }, step.delay);
    });

    const endTimeout = setTimeout(() => {
      setIsBooting(false);
    }, 1600);

    return () => {
      clearTimeout(endTimeout);
    };
  }, []);

  // Track window scroll reading progress
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress((window.scrollY / totalHeight) * 100);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    // Run initial calculation
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Live real-time clock to emulate cyber/terminal telemetry
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const utcString = now.toUTCString().slice(17, 25) + " UTC";
      setTimeStr(utcString);
    };
    
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Sync actual volume level audio amplitude to pulsing elements directly in RAF
  useEffect(() => {
    let animFrameId: number;
    let smoothedPulse = 0;

    const trackAudioPulse = () => {
      const analyser = (window as any).__metroAnalyser;
      let targetPulse = 0;
      
      if (analyser && !isMuted) {
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyser.getByteFrequencyData(dataArray);
        
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const average = sum / bufferLength;
        targetPulse = Math.min(1.0, average / 42.0);
      } else {
        // Subtle ambient flow indicator when idle
        targetPulse = 0.12 + Math.sin(Date.now() * 0.002) * 0.08;
      }
      
      smoothedPulse += (targetPulse - smoothedPulse) * 0.15;
      
      if (headerRef.current) {
        headerRef.current.style.borderColor = `rgba(255, 255, 255, ${0.04 + smoothedPulse * 0.18})`;
        
        const navAnchors = headerRef.current.querySelectorAll("nav a");
        navAnchors.forEach((node) => {
          const anchor = node as HTMLAnchorElement;
          anchor.style.textShadow = smoothedPulse > 0.1 ? `0 0 ${4 + smoothedPulse * 12}px ${activeAlbum.colorTheme.primary}cc` : "";
          anchor.style.color = `rgba(163, 163, 163, ${0.65 + smoothedPulse * 0.35})`;
        });
      }
      
      if (audioOnRef.current && !isMuted) {
        audioOnRef.current.style.borderColor = `rgba(0, 240, 255, ${0.15 + smoothedPulse * 0.5})`;
        audioOnRef.current.style.boxShadow = `0 0 ${8 + smoothedPulse * 20}px ${activeAlbum.colorTheme.glow}`;
        audioOnRef.current.style.transform = `scale(${1.0 + smoothedPulse * 0.035})`;
        audioOnRef.current.style.color = `rgba(255, 255, 255, ${0.85 + smoothedPulse * 0.15})`;
      }
      
      if (pulseDotRef.current) {
        pulseDotRef.current.style.transform = `scale(${1.0 + smoothedPulse * 0.7})`;
        pulseDotRef.current.style.opacity = `${0.4 + smoothedPulse * 0.6}`;
      }
      
      animFrameId = requestAnimationFrame(trackAudioPulse);
    };
    
    animFrameId = requestAnimationFrame(trackAudioPulse);
    return () => {
      cancelAnimationFrame(animFrameId);
    };
  }, [isMuted, activeAlbum.colorTheme]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore key events when the user is typing inside input or interactive form elements
      const activeEl = document.activeElement;
      if (
        activeEl &&
        (activeEl.tagName === "INPUT" ||
          activeEl.tagName === "TEXTAREA" ||
          activeEl.getAttribute("contenteditable") === "true")
      ) {
        return;
      }

      const key = e.key.toLowerCase();
      if (key === "m") {
        e.preventDefault();
        const el = document.getElementById("music");
        if (el) el.scrollIntoView({ behavior: "smooth" });
      } else if (key === "s") {
        e.preventDefault();
        const el = document.getElementById("synthesizer");
        if (el) el.scrollIntoView({ behavior: "smooth" });
      } else if (key === "a") {
        e.preventDefault();
        const el = document.getElementById("about");
        if (el) el.scrollIntoView({ behavior: "smooth" });
      } else if (key === "c") {
        e.preventDefault();
        const el = document.getElementById("contact");
        if (el) el.scrollIntoView({ behavior: "smooth" });
      } else if (key === "h") {
        e.preventDefault();
        setShowHelpModal((prev) => !prev);
      } else if (key === "escape") {
        setShowHelpModal(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#030304] overflow-hidden text-[#e2e2e9] selection:bg-neon-blue/30 selection:text-white pb-16">
      
      {/* 1.5s Scanline Retro-Terminal Boot Overlay */}
      <AnimatePresence>
        {isBooting && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="fixed inset-0 z-[9999] bg-[#030304] flex flex-col justify-between p-8 md:p-16 select-none crt-overlay"
          >
            {/* Visual background layers */}
            <div className="pixel-noise-layer" />
            <div className="scanline-emitter" />

            {/* Glowing top label */}
            <div className="flex justify-between items-center z-10">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#009DFF] animate-pulse" />
                <span className="font-mono text-xs text-[#009DFF] tracking-[0.2em]">METROSUL_TELEMETRY_BUS</span>
              </div>
              <span className="font-mono text-xs text-neutral-600">STATE: CONFIG</span>
            </div>

            {/* Central scanning state display */}
            <div className="flex flex-col items-center justify-center text-center space-y-4 max-w-xl mx-auto z-10 my-auto">
              <div className="relative">
                {/* Simulated retro scopes or modular pulse */}
                <div className="h-16 w-16 rounded-full border-2 border-dashed border-[#009DFF]/30 animate-spin flex items-center justify-center mb-6" style={{ animationDuration: "12s" }}>
                  <div className="h-10 w-10 rounded-full border-2 border-[#FF8800]/20 animate-pulse flex items-center justify-center">
                    <div className="h-4 w-4 rounded-full bg-gradient-to-tr from-[#009DFF] to-[#FF8800]" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <p className="font-mono text-[10px] text-[#FF8800] tracking-widest uppercase font-bold">BOOT SEQUENCE IN PROGRESS</p>
                <h2 className="font-mono text-xs md:text-sm text-[#009DFF] tracking-wider min-h-[30px] font-medium transition-all duration-150">
                  {bootText}
                </h2>
              </div>
            </div>

            {/* Bottom logs telemetry */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-[10px] text-neutral-500 z-10 border-t border-white/5 pt-6">
              <div className="flex items-center gap-4">
                <span>SYS_RES: 320KBPS FLAC</span>
                <span className="hidden sm:inline">&middot;</span>
                <span>AUDIO_DRIVE: WEB_AUDIO</span>
              </div>
              <span>&copy; {new Date().getFullYear()} METRO SUL ELECTRONICS.</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Fixed Reading Scroll Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-[2.5px] bg-[#111115] z-[100] pointer-events-none">
        <div 
          className="h-full transition-all duration-150 ease-out shadow-[0_0_8px_currentColor]"
          style={{ 
            width: `${scrollProgress}%`,
            backgroundColor: activeAlbum.colorTheme.primary,
            color: activeAlbum.colorTheme.primary
          }}
        />
      </div>

      {/* Dynamic Background Visualizer Particle Field */}
      <VisualizerCanvas 
        theme={{
          primary: activeAlbum.colorTheme.primary,
          secondary: activeAlbum.colorTheme.secondary,
          glow: activeAlbum.colorTheme.glow
        }}
        intensity={synthIntensity}
      />

      {/* Extreme ambient backplane glowing blobs in absolute blue-left, amber-right symmetry */}
      <div 
        className="absolute top-[2vh] left-[5vw] w-[45vw] h-[45vw] rounded-full blur-[140px] opacity-[0.22] pointer-events-none transition-all duration-1000 z-0"
        style={{
          background: "radial-gradient(circle, #009DFF 0%, transparent 70%)"
        }}
      />
      
      <div 
        className="absolute top-[10vh] right-[5vw] w-[45vw] h-[45vw] rounded-full blur-[160px] opacity-[0.16] pointer-events-none transition-all duration-1000 z-0"
        style={{
          background: "radial-gradient(circle, #FF8800 0%, transparent 70%)"
        }}
      />

      {/* Dynamic scrolling background indicators */}
      <div 
        className="absolute top-[120vh] left-[8vw] w-[40vw] h-[40vw] rounded-full blur-[160px] opacity-[0.15] pointer-events-none transition-all duration-1000 z-0"
        style={{
          background: "radial-gradient(circle, #009DFF 0%, transparent 70%)"
        }}
      />
      
      <div 
        className="absolute top-[130vh] right-[8vw] w-[40vw] h-[40vw] rounded-full blur-[160px] opacity-[0.12] pointer-events-none transition-all duration-1000 z-0"
        style={{
          background: "radial-gradient(circle, #FF8800 0%, transparent 70%)"
        }}
      />

      {/* Geometric cyber grids overlay */}
      <div className="absolute inset-0 cyber-grid opacity-[0.35] pointer-events-none z-[1]" />

      {/* Elegant Header/Navigation bar representing a cybernetic transmission bar */}
      <header ref={headerRef} className="fixed top-0 left-0 right-0 w-full z-50 border-b border-white/[0.03] bg-[#03050A]/85 backdrop-blur-md px-6 md:px-12 py-3.5 shadow-[0_4px_30px_rgba(3,5,10,0.5)]">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-3 shrink-0">
            <span 
              ref={pulseDotRef}
              className="h-2 w-2 rounded-full transition-all duration-300 shadow-[0_0_10px_currentColor] shrink-0"
              style={{ 
                backgroundColor: activeAlbum.colorTheme.primary,
                color: activeAlbum.colorTheme.primary 
              }} 
            />
            <a href="#" className="font-display text-base font-bold tracking-[0.25em] text-white hover:opacity-80 transition-all flex items-center gap-2">
              <span className="text-xs text-neutral-500 font-mono font-normal tracking-tight">[</span>
              <span>METRO SUL</span>
              <span className="text-xs text-neutral-500 font-mono font-normal tracking-tight">]</span>
            </a>
          </div>

          {/* Minimal transmission anchors */}
          <nav className="hidden md:flex items-center gap-9 text-[10px] font-mono tracking-[0.22em] text-neutral-400 font-medium">
            <a href="#music" className="hover:text-white transition-all uppercase relative group py-1 whitespace-nowrap">
              <span className="text-neutral-600 group-hover:text-white transition-colors duration-300 mr-1 opacity-0 group-hover:opacity-100">[</span>
              {t.navReleases}
              <span className="text-neutral-600 group-hover:text-white transition-colors duration-300 ml-1 opacity-0 group-hover:opacity-100">]</span>
            </a>
            <a href="#synthesizer" className="hover:text-white transition-all uppercase relative group py-1 whitespace-nowrap">
              <span className="text-neutral-600 group-hover:text-white transition-colors duration-300 mr-1 opacity-0 group-hover:opacity-100">[</span>
              {t.navSynth}
              <span className="text-neutral-600 group-hover:text-white transition-colors duration-300 ml-1 opacity-0 group-hover:opacity-100">]</span>
            </a>
            <a href="#about" className="hover:text-white transition-all uppercase relative group py-1 whitespace-nowrap">
              <span className="text-neutral-600 group-hover:text-white transition-colors duration-300 mr-1 opacity-0 group-hover:opacity-100">[</span>
              {t.navManifesto}
              <span className="text-neutral-600 group-hover:text-white transition-colors duration-300 ml-1 opacity-0 group-hover:opacity-100">]</span>
            </a>
            <a href="#contact" className="hover:text-white transition-all uppercase relative group py-1 whitespace-nowrap">
              <span className="text-neutral-600 group-hover:text-white transition-colors duration-300 mr-1 opacity-0 group-hover:opacity-100">[</span>
              {t.navInquiries}
              <span className="text-neutral-600 group-hover:text-white transition-colors duration-300 ml-1 opacity-0 group-hover:opacity-100">]</span>
            </a>
          </nav>

          {/* Audio output master controller status */}
          <div className="flex items-center gap-2">
            
            {/* Elegant Minimal Language Picker */}
            <div className="hidden sm:flex items-center gap-1.2 font-mono text-[9px] bg-white/[0.02] border border-white/5 py-1.5 px-3.5 rounded-full text-neutral-400">
              <button 
                onClick={() => handleLanguageChange("pt")}
                className="cursor-pointer hover:text-white transition-colors py-0.5 px-1.5 rounded"
                style={{ 
                  color: lang === "pt" ? activeAlbum.colorTheme.primary : undefined,
                  fontWeight: lang === "pt" ? "bold" : undefined,
                  background: lang === "pt" ? "rgba(255,255,255,0.03)" : undefined
                }}
              >
                PT
              </button>
              <span className="text-neutral-700 font-light text-[8px] select-none">|</span>
              <button 
                onClick={() => handleLanguageChange("en")}
                className="cursor-pointer hover:text-white transition-colors py-0.5 px-1.5 rounded"
                style={{ 
                  color: lang === "en" ? activeAlbum.colorTheme.primary : undefined,
                  fontWeight: lang === "en" ? "bold" : undefined,
                  background: lang === "en" ? "rgba(255,255,255,0.03)" : undefined
                }}
              >
                EN
              </button>
              <span className="text-neutral-700 font-light text-[8px] select-none">|</span>
              <button 
                onClick={() => handleLanguageChange("es")}
                className="cursor-pointer hover:text-white transition-colors py-0.5 px-1.5 rounded"
                style={{ 
                  color: lang === "es" ? activeAlbum.colorTheme.primary : undefined,
                  fontWeight: lang === "es" ? "bold" : undefined,
                  background: lang === "es" ? "rgba(255,255,255,0.03)" : undefined
                }}
              >
                ES
              </button>
            </div>

            <button
              ref={audioOnRef}
              onClick={() => setIsMuted(prev => !prev)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full border font-mono text-[10px] tracking-wider transition-all duration-300 cursor-pointer ${
                isMuted 
                  ? "bg-red-950/20 border-red-500/30 text-red-400 hover:border-red-400/50 hover:bg-red-950/30 font-semibold" 
                  : "bg-white/[0.02] border-white/5 text-neutral-450 hover:border-white/12 hover:text-white hover:bg-white/[0.05]"
              }`}
              title={isMuted ? "Unmute hardware synth" : "Mute hardware synth"}
            >
              {isMuted ? (
                <>
                  <VolumeX size={11} className="text-red-400 animate-pulse" />
                  <span>{t.muted}</span>
                </>
              ) : (
                <>
                  <Volume2 size={11} style={{ color: activeAlbum.colorTheme.primary }} />
                  <span>{t.audioOn}</span>
                </>
              )}
            </button>

            {/* Live telemetry metadata clock */}
            <div className="hidden lg:flex items-center gap-2.5 font-mono text-[10px] text-neutral-400 bg-white/[0.02] border border-white/5 py-1.5 px-3.5 rounded-full">
              <Clock size={11} className="text-neutral-500 animate-pulse" />
              <span>{timeStr}</span>
              <span className="text-neutral-600">|</span>
              <span className="text-emerald-400">{t.sysOnline}</span>
            </div>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setIsMobileMenuOpen(prev => !prev)}
              className="flex md:hidden items-center justify-center p-2 rounded-xl bg-white/[0.02] border border-white/5 text-neutral-400 hover:text-white hover:border-white/15 transition-all duration-300 h-8 w-8 cursor-pointer shrink-0"
              title="Toggle system menu"
            >
              {isMobileMenuOpen ? <X size={13} /> : <Menu size={13} />}
            </button>
          </div>

        </div>
        
        {/* Slidable glowing energy laser running along bottom border representing structural transmission signal */}
        <div 
          className="absolute bottom-0 left-0 h-[1px] bg-gradient-to-r from-transparent via-[#009DFF] to-transparent w-full transition-all duration-1000 opacity-60"
          style={{ 
            backgroundImage: `linear-gradient(to right, transparent 0%, ${activeAlbum.colorTheme.primary} 50%, transparent 100%)`
          }}
        />
      </header>

      {/* Cybernetic Mobile navigation panel overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed top-[65px] left-0 right-0 z-40 bg-neutral-950/95 border-b border-white/[0.04] backdrop-blur-xl px-6 py-5 flex flex-col gap-3 font-mono text-[10px] tracking-[0.2em] text-neutral-400 font-bold select-none"
          >
            <a 
              href="#music" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="hover:text-white transition-colors uppercase py-2 border-b border-white/[0.02] block text-left whitespace-nowrap"
            >
              {t.navReleases}
            </a>
            <a 
              href="#synthesizer" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="hover:text-white transition-colors uppercase py-2 border-b border-white/[0.02] block text-left whitespace-nowrap"
            >
              {t.navSynth}
            </a>
            <a 
              href="#about" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="hover:text-white transition-colors uppercase py-2 border-b border-white/[0.02] block text-left whitespace-nowrap"
            >
              {t.navManifesto}
            </a>
            <a 
              href="#contact" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="hover:text-white transition-colors uppercase py-2 block text-left border-b border-white/[0.02] whitespace-nowrap"
            >
              {t.navInquiries}
            </a>

            {/* Mobile language picker */}
            <div className="flex items-center justify-between pt-3 mt-1 font-mono text-[9px] tracking-widest text-neutral-500 font-bold">
              <span>// LANGUAGE</span>
              <div className="flex items-center gap-3 font-semibold text-neutral-400 tracking-normal">
                <button 
                  onClick={() => { handleLanguageChange("pt"); setIsMobileMenuOpen(false); }}
                  className={`py-1 px-2.5 rounded transition-all leading-none ${lang === "pt" ? "text-neon-blue font-bold bg-white/5 border border-white/5" : "hover:text-white"}`}
                >
                  PT
                </button>
                <button 
                  onClick={() => { handleLanguageChange("en"); setIsMobileMenuOpen(false); }}
                  className={`py-1 px-2.5 rounded transition-all leading-none ${lang === "en" ? "text-neon-blue font-bold bg-white/5 border border-white/5" : "hover:text-white"}`}
                >
                  EN
                </button>
                <button 
                  onClick={() => { handleLanguageChange("es"); setIsMobileMenuOpen(false); }}
                  className={`py-1 px-2.5 rounded transition-all leading-none ${lang === "es" ? "text-neon-blue font-bold bg-white/5 border border-white/5" : "hover:text-white"}`}
                >
                  ES
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page wrapper */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pt-28 md:pt-36 space-y-36">
        
        {/* HERO SECTION */}
        <section id="hero" className="min-h-[72vh] flex flex-col justify-between items-start relative pb-6">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 w-full items-center pt-4">
            
            {/* Left side content panel */}
            <div className="lg:col-span-7 space-y-8">
              
              {/* Tech badges */}
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.02] border border-white/5 font-mono text-[10px] tracking-wider text-neutral-400"
              >
                <Radio size={11} className="text-[#009DFF] animate-ping" />
                <span>{t.vectorActive}</span>
                <span className="text-neutral-600">//</span>
                <span style={{ color: activeAlbum.colorTheme.primary }} className="transition-colors duration-1000">
                  {t.themeLabel}: {activeAlbum.title.toUpperCase()}
                </span>
              </motion.div>

              {/* Colossal Header display typography */}
              <div className="space-y-4">
                <motion.p
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7 }}
                  className="font-display text-xl sm:text-2xl font-bold tracking-[0.2em] text-neutral-400 uppercase"
                >
                  M<span className="text-[#009DFF] drop-shadow-[0_0_12px_rgba(0,157,255,0.4)]">≡</span>TRO SUL
                </motion.p>
                <motion.h1 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.1 }}
                  className="font-display text-5xl sm:text-7xl lg:text-8xl font-bold tracking-[-0.03em] !leading-[0.9] text-white uppercase"
                >
                  {t.heroSub}
                </motion.h1>
              </div>

              {/* Descriptive short intro */}
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.25 }}
                className="font-sans text-base md:text-lg text-neutral-400 leading-relaxed font-light mt-2"
              >
                {t.heroDesc}
              </motion.p>

              {/* Floating anchor call to action */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.35 }}
                className="flex flex-wrap items-center gap-4 pt-6"
              >
                <a 
                  href="https://open.spotify.com/intl-pt/artist/4i7BYCbelBwv59mLCJ0pgk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 rounded-full text-xs font-mono tracking-widest font-bold flex items-center gap-2 group transition-all duration-300 border cursor-pointer"
                  style={{
                    backgroundColor: "#009DFF",
                    borderColor: "#009DFF",
                    color: "#030304",
                    boxShadow: "0 8px 30px -4px rgba(0, 157, 255, 0.45)"
                  }}
                >
                  {t.btnReleases} 
                  <ExternalLink size={13} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>

                <a 
                  href="#music" 
                  className="px-8 py-4 rounded-full text-xs font-mono tracking-widest font-bold text-white border border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/[0.08] flex items-center gap-2 transition-all cursor-pointer"
                >
                  {t.btnSynth}
                  <ArrowRight size={13} className="group-hover:translate-x-1.5 transition-transform text-neutral-400" />
                </a>
              </motion.div>

            </div>

            {/* Right side: Modern interactive Cosmic Orbital Portal visualizer */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.0, ease: "easeOut" }}
              className="lg:col-span-5 w-full h-[460px] sm:h-[600px] flex items-center justify-center rounded-3xl border border-white/[0.02] bg-[#03050A]/40 backdrop-blur-md relative overflow-hidden shadow-2xl p-4 group"
            >
              {/* Subtle inner grid glow backplate */}
              <div 
                className="absolute inset-0 opacity-15 pointer-events-none transition-all duration-1000 z-0 bg-radial-gradient"
                style={{
                  background: `radial-gradient(circle at center, ${activeAlbum.colorTheme.primary} 0%, transparent 70%)`
                }}
              />
              <OrbitalPortal intensity={synthIntensity} />
            </motion.div>

          </div>

          {/* Analog Dashboard / Space Telemetry box */}
          <div className="w-full mt-12 md:mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-b border-white/[0.04] py-6 bg-neutral-950/20 backdrop-blur-sm px-4 rounded-xl">
            <div>
              <span className="block font-mono text-[9px] text-neutral-500 tracking-widest uppercase">{t.flowLabel}</span>
              <span className="font-display font-medium text-sm text-white flex items-center gap-1.5 mt-1">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
                {t.flowValue}
              </span>
            </div>
            <div>
              <span className="block font-mono text-[9px] text-neutral-500 tracking-widest uppercase">{t.scaleLabel}</span>
              <span className="font-mono text-xs text-white uppercase mt-1.5 block">
                {t.scaleValue}
              </span>
            </div>
            <div>
              <span className="block font-mono text-[9px] text-neutral-500 tracking-widest uppercase">{t.gravityLabel}</span>
              <span className="font-display font-medium text-sm text-white flex items-center gap-1.5 mt-1">
                {t.gravityValue}
              </span>
            </div>
            <div>
              <span className="block font-mono text-[9px] text-neutral-500 tracking-widest uppercase">{t.portalsLabel}</span>
              <a 
                href="https://open.spotify.com/intl-pt/artist/4i7BYCbelBwv59mLCJ0pgk" 
                target="_blank" 
                rel="no-referrer"
                className="font-mono text-xs text-neon-blue flex items-center gap-1 mt-1 hover:underline group"
              >
                {t.portalsValue} <ExternalLink size={10} className="group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
              </a>
            </div>
          </div>

          {/* Hero Scroll Down Anchor */}
          <div className="w-full flex justify-center pt-8">
            <a 
              href="#music"
              className="text-neutral-500 hover:text-white transition-colors duration-300 flex flex-col items-center gap-2 font-mono text-[9px] tracking-widest"
            >
              <span>{t.scrollDown}</span>
              <ChevronDown size={14} className="animate-bounce" />
            </a>
          </div>
        </section>

        {/* UPCOMING RELEASE / LATEST SINGLE SECTION */}
        <section id="upcoming" className="scroll-mt-24 space-y-12">
          <div className="relative p-8 md:p-12 rounded-3xl border border-white/5 hover:border-[#009DFF]/30 bg-[#050609]/90 backdrop-blur-md overflow-hidden group transition-all duration-700 hover:z-50 hover:shadow-[0_0_60px_rgba(0,157,255,0.15)] cursor-default">
            {/* Symmetrical left-blue right-amber ambient gradient background inside the card */}
            <div className="absolute -left-32 -top-32 w-80 h-80 rounded-full blur-[100px] opacity-20 pointer-events-none bg-[#009DFF]" />
            <div className="absolute -right-32 -bottom-32 w-80 h-80 rounded-full blur-[100px] opacity-15 pointer-events-none bg-[#FF8800]" />
            
            {/* Delicate high-tech technical grid overlay mask */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none opacity-60" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
              
              {/* Text Description column */}
              <div className="col-span-1 lg:col-span-7 space-y-6 text-left">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.2em] text-[#FFAA00] uppercase font-bold">
                    <span>{t.upcomingLabel}</span>
                  </div>
                  <h3 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight leading-none uppercase">
                    {t.upcomingTitle}
                  </h3>
                  <p className="font-mono text-[10px] text-neutral-500 uppercase tracking-[0.3em]">
                    // MTS-003 // FREQUENCY OVERFLOW
                  </p>
                </div>

                <p className="font-sans text-base md:text-lg text-neutral-300 leading-relaxed font-light">
                  {t.upcomingDesc}
                </p>

                {/* Micro tech parameters list for tactile/editorial feel */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/[0.04] max-w-md font-mono text-[10px] text-neutral-400">
                  <div className="flex flex-col gap-1">
                    <span className="text-neutral-500 uppercase tracking-[0.2em] text-[9px]">// RESONANT BAND</span>
                    <span className="text-neutral-300">528Hz Alignment</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-neutral-500 uppercase tracking-[0.2em] text-[9px] font-semibold">// STATE</span>
                    <span className="text-neutral-300">Conscious Expansion</span>
                  </div>
                </div>

                <div className="pt-6 flex flex-wrap items-center gap-4">
                  <a 
                    href="https://open.spotify.com/intl-pt/artist/4i7BYCbelBwv59mLCJ0pgk"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-8 py-4 rounded-full text-xs font-mono tracking-widest font-bold bg-white text-black hover:bg-neutral-200 flex items-center gap-2 transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:-translate-y-0.5 cursor-pointer"
                  >
                    <span>LISTEN ON SPOTIFY</span>
                    <ExternalLink size={11} />
                  </a>
                  <span className="font-mono text-[9px] uppercase tracking-widest text-neutral-500">
                    *EXCLUSIVE IN-PORTAL TRANSMISSION IN PROGRESS
                  </span>
                </div>
              </div>

              {/* Visual artwork column */}
              <div className="col-span-1 lg:col-span-5 flex justify-center mt-6 lg:mt-0">
                <div className="relative w-72 h-72 md:w-[340px] md:h-[340px] select-none group/art flex items-center justify-center">
                  
                  {/* Floating abstract geometrical overflow diagram */}
                  <div className="absolute inset-0 rounded-3xl border border-white/5 bg-neutral-950/45 p-6 flex flex-col justify-between overflow-hidden shadow-2xl transition-all duration-700 hover:shadow-[0_10px_40px_rgba(0,157,255,0.15)] hover:border-white/10">
                    {/* Golden circle in center pulsing to represent abundance/alignment */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-36 h-36 rounded-full border border-[#FF8800]/15 animate-ping" style={{ animationDuration: "5s" }} />
                      <div className="w-28 h-28 rounded-full border border-dashed border-[#009DFF]/20 animate-spin" style={{ animationDuration: "12s" }} />
                      <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#FFAA00]/25 to-[#009DFF]/25 filter blur-lg animate-pulse" />
                    </div>
                    
                    {/* Corner readouts */}
                    <div className="flex justify-between items-start font-mono text-[9px] text-neutral-500 tracking-wider">
                      <span>[ OVERFLOW_M≡TR_SYS ]</span>
                      <span>MTS-003</span>
                    </div>

                    <div className="w-full flex flex-col items-center justify-center py-12 text-center space-y-2 z-10 scale-105">
                      <span className="font-display text-lg font-bold text-white tracking-[0.4em] uppercase leading-none">
                        ARCHITECT
                      </span>
                      <span className="font-mono text-[9px] text-neutral-400 uppercase tracking-[0.5em] pl-1">
                        OF OVERFLOW
                      </span>
                      <div className="h-[1px] w-16 bg-gradient-to-r from-transparent via-[#009DFF]/40 to-transparent my-3" />
                      <span className="font-mono text-[7px] text-[#FFAA00] uppercase tracking-[0.3em] font-medium leading-none">
                        FREQUENCY 528Hz // HIGHER STATE
                      </span>
                    </div>

                    <div className="flex justify-between items-end font-mono text-[9px] text-neutral-500 tracking-wider">
                      <span>PT: NOVO CICLO</span>
                      <span>EN: NEW CYCLE</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* SIGNAL LANGUAGE MANIFESTO FRAGMENTS */}
        <SignalLanguage />

        {/* SPOTIFY RELEASES SECTION */}
        <section id="music" className="scroll-mt-24 space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Disc size={13} style={{ color: activeAlbum.colorTheme.primary }} />
                <span className="font-mono text-[10px] tracking-widest text-neutral-400 uppercase">{t.vaultLabel}</span>
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-white">
                {t.vaultTitle}
              </h2>
            </div>
            <p className="font-sans text-sm text-neutral-400 max-w-sm leading-relaxed">
              {t.vaultDesc}
            </p>
          </div>

          <SpotifyEmbeds 
            activeAlbum={activeAlbum} 
            onAlbumSelect={(album) => {
              setActiveAlbum(album);
              // Shift canvas gravity pull intensity momentarily when album shifts
              setSynthIntensity(1.5);
              setTimeout(() => setSynthIntensity(1.0), 800);
            }} 
            lang={lang}
          />
        </section>

        {/* MODULAR SYNTHESIZER MODULE */}
        <section id="synthesizer" className="scroll-mt-24 space-y-12">
          <div className="max-w-2xl text-left space-y-3">
            <div className="flex items-center gap-2">
              <Sliders size={13} className="text-neon-sunset" />
              <span className="font-mono text-[10px] tracking-widest text-neutral-400 uppercase">{t.synthLabel}</span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-white">
              {t.synthTitle}
            </h2>
            <p className="font-sans text-sm text-neutral-400 leading-relaxed">
              {t.synthDesc}
            </p>
          </div>

          <InteractiveSynth isMuted={isMuted} lang={lang} />
        </section>

        {/* ABOUT THE PROJECT / MANIFESTO */}
        <section id="about" className="scroll-mt-24">
          <AboutProject lang={lang} />
        </section>

        {/* SOCIAL NETWORKS & INQUIRIES */}
        <section id="contact" className="scroll-mt-24 space-y-12">
          <div className="max-w-xl space-y-3">
            <div className="flex items-center gap-2">
              <Compass size={13} className="text-neon-blue" />
              <span className="font-mono text-[10px] tracking-widest text-neutral-400 uppercase">{t.contactLabel}</span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-white">
              {t.contactTitle}
            </h2>
            <p className="font-sans text-sm text-neutral-400 leading-relaxed">
              {t.contactDesc}
            </p>
          </div>

          <SocialLinks lang={lang} />
        </section>

      </main>

      {/* Footer credit bar */}
      <footer className="mt-32 border-t border-white/[0.04] pt-8 px-6 text-center max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="font-mono text-[10px] text-neutral-500 tracking-wider">
          &copy; {new Date().getFullYear()} METRO SUL. {t.footerCredits}
        </span>
        <div className="flex items-center gap-4 text-[10px] font-mono text-neutral-400">
          <a href="https://open.spotify.com/intl-pt/artist/4i7BYCbelBwv59mLCJ0pgk" target="_blank" rel="no-referrer" className="hover:text-white transition-colors">{lang === "pt" ? "ARTISTA SPOTIFY" : lang === "es" ? "ARTISTA SPOTIFY" : "SPOTIFY ARTIST"}</a>
          <span>&middot;</span>
          <a href="#music" className="hover:text-white transition-colors">{lang === "pt" ? "COFRE" : lang === "es" ? "CÓDICE" : "VAULT"}</a>
          <span>&middot;</span>
          <a href="#synthesizer" className="hover:text-white transition-colors">{lang === "pt" ? "VOLTAGEM" : lang === "es" ? "VOLTAJE" : "VOLTAGE"}</a>
        </div>
      </footer>

      {/* Floating System Guide Trigger */}
      <div className="fixed bottom-6 right-6 z-40 hidden md:block">
        <motion.button
          onClick={() => setShowHelpModal(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-[#0a0a0c]/85 backdrop-blur-md border border-white/5 hover:border-white/15 text-[10px] font-mono text-neutral-400 hover:text-white shadow-[0_15px_30px_-5px_rgba(0,0,0,0.8)] group transition-all cursor-pointer"
        >
          <HelpCircle size={12} className="text-neon-blue animate-pulse" />
          <span>{t.hotkeysBtn}</span>
          <kbd className="px-1.5 py-0.5 rounded bg-neutral-950 border border-white/10 text-[9px] font-bold text-neutral-300 group-hover:border-neon-blue group-hover:text-neon-blue transition-colors">
            H
          </kbd>
        </motion.button>
      </div>

      {/* Immersive Conceptual Help Modal */}
      <AnimatePresence>
        {showHelpModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
            onClick={() => setShowHelpModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="relative w-full max-w-md rounded-3xl border border-white/10 bg-[#0a0a0c]/95 p-6 md:p-8 shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Soft visual custom glow backing */}
              <div 
                className="absolute -top-24 -left-24 w-48 h-48 rounded-full blur-3xl opacity-20 pointer-events-none"
                style={{ backgroundColor: activeAlbum.colorTheme.primary }}
              />

              <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
                <div className="flex items-center gap-2">
                  <Terminal size={14} className="text-neon-blue animate-pulse" />
                  <span className="font-mono text-xs tracking-wider text-neutral-400">{t.modalTerminal}</span>
                </div>
                <button 
                  onClick={() => setShowHelpModal(false)}
                  className="text-neutral-400 hover:text-white transition-colors text-[10px] font-mono border border-white/5 hover:border-white/20 bg-white/5 rounded-md px-2 py-1 cursor-pointer"
                >
                  ESC //
                </button>
              </div>

              <h3 className="font-display text-xl font-semibold text-white tracking-tight mb-2">
                {t.modalTitle}
              </h3>
              <p className="font-sans text-xs text-neutral-400 mb-6 leading-relaxed">
                {t.modalDesc}
              </p>

              {/* Shortcut rows list */}
              <div className="space-y-3 mb-6">
                {[
                  { 
                    key: "H", 
                    desc: lang === "pt" ? "Alternar este guia de comandos de sistema" : lang === "es" ? "Alternar esta guía de comandos de sistema" : "Toggle this system commands guide", 
                    target: "" 
                  },
                  { 
                    key: "M", 
                    desc: lang === "pt" ? "Teletransportar para Crônicas de Ondas Sonoras (Lançamentos)" : lang === "es" ? "Teletransportarse a Crónicas de Ondas (Lanzamientos)" : "Teleport to Soundwave Chronicles (Music)", 
                    target: "music" 
                  },
                  { 
                    key: "S", 
                    desc: lang === "pt" ? "Engajar Sintetizador de Som Tátil (Sintetizador)" : lang === "es" ? "Activar Sintetizador de Sonido Táctil (Sintetizado)" : "Engage Tactile Sound Synthesizer (Synth)", 
                    target: "synthesizer" 
                  },
                  { 
                    key: "A", 
                    desc: lang === "pt" ? "Acessar Manifesto do Som Metro Sul (Sobre)" : lang === "es" ? "Acceder al Manifiesto de Sonido Metro Sul (Sobre)" : "Access Metro Sul Sound Manifesto (About)", 
                    target: "about" 
                  },
                  { 
                    key: "C", 
                    desc: lang === "pt" ? "Proceder para Hub de Contatos da Rede" : lang === "es" ? "Proceder al Hub de Contacto de Red" : "Proceed to Network Contact Hub (Booking)", 
                    target: "contact" 
                  },
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() => {
                      setShowHelpModal(false);
                      // Slight delay to allow modal exit transition to play gracefully
                      setTimeout(() => {
                        if (item.target) {
                          const el = document.getElementById(item.target);
                          if (el) el.scrollIntoView({ behavior: "smooth" });
                        }
                      }, 150);
                    }}
                    className="w-full flex items-center justify-between p-3 rounded-2xl bg-white/[0.01] border border-white/5 hover:border-white/12 hover:bg-white/[0.03] text-left transition-all group cursor-pointer"
                  >
                    <div className="flex items-center gap-3.5">
                      <kbd className="h-6.5 w-6.5 rounded-lg bg-neutral-950 border border-white/10 font-mono text-[10px] font-bold text-center flex items-center justify-center text-white shadow-lg group-hover:border-neon-blue group-hover:text-neon-blue transition-colors">
                        {item.key}
                      </kbd>
                      <span className="text-xs text-neutral-300 group-hover:text-white transition-colors">{item.desc}</span>
                    </div>
                    {item.target && (
                      <span className="font-mono text-[9px] text-neutral-500 group-hover:text-neutral-300 tracking-wider opacity-0 group-hover:opacity-100 transition-all">
                        GO &rarr;
                      </span>
                    )}
                  </button>
                ))}
              </div>

              <div className="text-[9px] font-mono text-center text-neutral-500 border-t border-white/5 pt-4 flex justify-between items-center">
                <span>{t.modalLogStatus}</span>
                <span>{t.modalLogVersion}</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
