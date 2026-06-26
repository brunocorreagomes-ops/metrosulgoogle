import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";
import { 
  Play, 
  Pause,
  X, 
  ExternalLink, 
  Volume2, 
  VolumeX, 
  Clock, 
  ChevronDown, 
  Calendar, 
  Compass, 
  Sparkles,
  ArrowRight,
  Monitor,
  Disc,
  Smartphone
} from "lucide-react";
import { Language, translations } from "../locales";

// The official release date and link configs
const RELEASE_DATE = "2026-07-31";
const PRESAVE_URL = "https://ffm.to/6rdp19";

// Premium Apple-like ScrollReveal transition wrapper
function ScrollReveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 35, filter: "blur(12px)", scale: 0.99 }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 1.4, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

// Staggered cinematic receiver characters reveal
function StaggeredPhrase({ phrase, isActive }: { phrase: string; isActive: boolean }) {
  const words = phrase.split(" ");
  let charIndex = 0; // for stagger delay
  
  return (
    <div className="flex flex-wrap justify-center items-center gap-x-[0.3em] gap-y-[0.1em] select-none text-center w-full max-w-full">
      {words.map((word, wIdx) => {
        const letters = word.split("");
        return (
          <span key={wIdx} className="inline-block whitespace-nowrap">
            {letters.map((char, lIdx) => {
              const currentIdx = charIndex++;
              return (
                <motion.span
                  key={lIdx}
                  initial={{ opacity: 0, filter: "blur(10px)", y: 5 }}
                  animate={isActive 
                    ? { opacity: 1, filter: "blur(0px)", y: 0 } 
                    : { opacity: 0.1, filter: "blur(5px)", y: -3 }
                  }
                  transition={{
                    duration: 0.9,
                    delay: isActive ? currentIdx * 0.035 : 0,
                    ease: [0.16, 1, 0.3, 1]
                  }}
                  className="inline-block"
                >
                  {char}
                </motion.span>
              );
            })}
          </span>
        );
      })}
    </div>
  );
}

interface ArchitectOfOverflowPageProps {
  lang?: Language;
  setLang?: (lang: Language) => void;
}

export default function ArchitectOfOverflowPage({ lang = "en", setLang }: ArchitectOfOverflowPageProps) {
  const t = translations[lang];
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isReleased, setIsReleased] = useState(false);
  const [showTeaser, setShowTeaser] = useState(false);
  const [testReleased, setTestReleased] = useState(false);
  const [isPlayingTeaser, setIsPlayingTeaser] = useState(false);
  const [activeTab, setActiveTab] = useState<"desktop" | "mobile">("desktop");
  const [soundEnabled, setSoundEnabled] = useState(false);

  // Teaser Video states and refs
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [videoMuted, setVideoMuted] = useState(true);
  const [videoProgress, setVideoProgress] = useState(0);
  const [videoPlaying, setVideoPlaying] = useState(true);
  const [videoDuration, setVideoDuration] = useState(15);
  const [videoCurrentTime, setVideoCurrentTime] = useState(0);
  const [videoError, setVideoError] = useState(false);
  const ambientWasEnabledRef = useRef(false);

  const handleOpenTeaser = () => {
    triggerSound("confirm");
    setShowTeaser(true);
    setIsPlayingTeaser(true);
    setVideoError(false);
    
    ambientWasEnabledRef.current = soundEnabled;
    if (soundEnabled && gainRef.current) {
      // Lower ambient background volume to extremely low level
      gainRef.current.gain.setValueAtTime(0.005, audioCtxRef.current?.currentTime || 0);
    }
  };

  const handleCloseTeaser = () => {
    triggerSound("click");
    setShowTeaser(false);
    setIsPlayingTeaser(false);
    
    if (ambientWasEnabledRef.current && gainRef.current) {
      // Restore ambient background volume
      gainRef.current.gain.setValueAtTime(0.06, audioCtxRef.current?.currentTime || 0);
    }
  };

  // Lock body scroll and register escape key to close teaser
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleCloseTeaser();
      }
    };

    if (showTeaser) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [showTeaser]);

  // Sound Synth engine for absolute immersion (Cercle / Anyma feel)
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const filterRef = useRef<BiquadFilterNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  // Intersection scroll tracking for Section 04: Transmission
  const [scrollProgress, setScrollProgress] = useState(0);
  const transmissionContainerRef = useRef<HTMLDivElement | null>(null);

  // Active phrase index for Section 04, controlled by IntersectionObserver with rootMargin: "-40% 0px -40% 0px"
  const [activeIndex, setActiveIndex] = useState(-1);
  const sentinelsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observerOptions = {
      root: null, // viewport
      rootMargin: "-40% 0px -40% 0px", // 20% center band
      threshold: 0
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = sentinelsRef.current.indexOf(entry.target as HTMLDivElement);
          if (index !== -1) {
            setActiveIndex(index);
          }
        } else {
          const index = sentinelsRef.current.indexOf(entry.target as HTMLDivElement);
          if (index !== -1) {
            setActiveIndex((prev) => (prev === index ? -1 : prev));
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe each sentinel
    sentinelsRef.current.forEach((sentinel) => {
      if (sentinel) {
        observer.observe(sentinel);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  // Force reset scroll to top on component load/mount and disable auto scroll restoration
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      try {
        window.history.scrollRestoration = "manual";
      } catch (e) {
        console.warn("Could not set scrollRestoration to manual:", e);
      }
    }

    const resetScroll = () => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTo(0, 0);
      document.body.scrollTo(0, 0);
    };

    resetScroll();

    // Sequence of resets to guarantee starting at the top regardless of initial render or image load timings
    const intervals = [10, 30, 80, 150, 300, 500];
    const timers = intervals.map(ms => setTimeout(resetScroll, ms));

    return () => {
      timers.forEach(clearTimeout);
    };
  }, []);

  useEffect(() => {
    // Scroll progress handler for immersive text transitions
    const handleScroll = () => {
      if (!transmissionContainerRef.current) return;
      const rect = transmissionContainerRef.current.getBoundingClientRect();
      const elementHeight = rect.height;
      const viewportHeight = window.innerHeight;
      
      // Calculate how far down we have scrolled through Section 04
      const scrolled = -rect.top;
      const totalScrollable = elementHeight - viewportHeight;
      
      if (totalScrollable > 0) {
        const progress = Math.max(0, Math.min(1, scrolled / totalScrollable));
        setScrollProgress(progress);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Countdown timer logic
  useEffect(() => {
    const checkTime = () => {
      const now = new Date().getTime();
      const target = new Date(`${RELEASE_DATE}T00:00:00Z`).getTime();
      const diff = target - now;

      if (diff <= 0) {
        setIsReleased(true);
      } else {
        setIsReleased(false);
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds });
      }
    };

    checkTime();
    const interval = setInterval(checkTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // High-fidelity synthesized Web Audio triggers
  const triggerSound = (type: "click" | "tick" | "confirm") => {
    if (!soundEnabled || !audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    if (ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }
    try {
      if (type === "click") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(1000, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(250, ctx.currentTime + 0.025);
        gain.gain.setValueAtTime(0.006, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.025);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.03);
      } else if (type === "tick") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(160, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.05);
        gain.gain.setValueAtTime(0.012, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.05);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.06);
      } else if (type === "confirm") {
        const now = ctx.currentTime;
        // Harmonic deep signal resonance chord
        [220, 329.63, 440, 659.25].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, now + idx * 0.04);
          gain.gain.setValueAtTime(0, now);
          gain.gain.linearRampToValueAtTime(0.015, now + idx * 0.04 + 0.04);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.4);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(now + 1.5);
        });
      }
    } catch (e) {
      console.warn("Error synthesizing interaction sound:", e);
    }
  };

  // Ambient sound synth toggle
  const toggleSound = () => {
    if (!soundEnabled) {
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioContextClass();
        audioCtxRef.current = ctx;

        // Low humming bass drone
        const osc = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(55, ctx.currentTime); // A1 note
        
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(140, ctx.currentTime);
        filter.Q.setValueAtTime(4, ctx.currentTime);

        gain.gain.setValueAtTime(0.06, ctx.currentTime);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        
        oscRef.current = osc;
        filterRef.current = filter;
        gainRef.current = gain;
        setSoundEnabled(true);

        // Slow modulation of frequency for organic feel
        const modInterval = setInterval(() => {
          if (filterRef.current && ctx) {
            const t = ctx.currentTime;
            filterRef.current.frequency.exponentialRampToValueAtTime(
              110 + Math.sin(t * 0.4) * 30,
              t + 1
            );
          }
        }, 1000);

        (window as any).__modInterval = modInterval;

        // Trigger safe initial feedback tone
        setTimeout(() => {
          triggerSound("confirm");
        }, 100);

      } catch (err) {
        console.warn("Audio Context init failed:", err);
      }
    } else {
      cleanupAudio();
    }
  };

  const cleanupAudio = () => {
    if (oscRef.current) {
      try {
        oscRef.current.stop();
      } catch (e) {}
    }
    if (audioCtxRef.current) {
      try {
        audioCtxRef.current.close();
      } catch (e) {}
    }
    if ((window as any).__modInterval) {
      clearInterval((window as any).__modInterval);
    }
    oscRef.current = null;
    audioCtxRef.current = null;
    setSoundEnabled(false);
  };

  useEffect(() => {
    return () => cleanupAudio();
  }, []);

  const toggleVideoPlay = () => {
    if (!videoRef.current) return;
    triggerSound("click");
    if (videoPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch(() => {});
    }
  };

  const toggleVideoMute = () => {
    if (!videoRef.current) return;
    triggerSound("click");
    videoRef.current.muted = !videoMuted;
    setVideoMuted(!videoMuted);
  };

  // Transmission phrases for Section 04
  const transmissionPhrases = [
    "SIGNAL DETECTED",
    "FREQUENCY: ABUNDANCE",
    "REWRITE THE CODE",
    "MATCH THE VIBRATION",
    "WATCH ME CREATE",
    "ARCHITECT OF OVERFLOW",
    "CODE ACCEPTED"
  ];

  const prevActiveIndexRef = useRef(-1);

  // Sound clicker on scroll trigger transition
  useEffect(() => {
    if (activeIndex !== prevActiveIndexRef.current) {
      if (prevActiveIndexRef.current !== -1 && activeIndex !== -1) {
        triggerSound("tick");
      }
      prevActiveIndexRef.current = activeIndex;
    }
  }, [activeIndex, soundEnabled]);

  // Helper to calculate opacity and blur for each phrase based on activeIndex (IntersectionObserver controlled)
  const getPhraseStyle = (index: number) => {
    const isActive = activeIndex === index;
    
    return {
      opacity: isActive ? 1 : 0,
      filter: isActive ? "blur(0px)" : "blur(12px)",
      transform: isActive ? "scale(1)" : "scale(0.96)",
      letterSpacing: isActive ? "0.2em" : "0.15em",
      pointerEvents: (isActive ? "auto" : "none") as any,
      transition: "opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), filter 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), letter-spacing 0.6s cubic-bezier(0.16, 1, 0.3, 1)"
    };
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans overflow-x-hidden selection:bg-[#FFAA00]/30 selection:text-white relative">
      
      {/* 2. Ambient depth texture layers */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden mix-blend-overlay">
        {/* Subtle base64 visual noise */}
        <div 
          className="absolute inset-0 opacity-[0.015]" 
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 250 250' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
          }}
        />
        {/* Cinematic vertical scanlines */}
        <div 
          className="absolute inset-0 opacity-[0.012]" 
          style={{
            backgroundImage: "linear-gradient(rgba(18, 16, 22, 0) 50%, rgba(255, 255, 255, 0.1) 50%)",
            backgroundSize: "100% 4px"
          }}
        />
      </div>

      {/* Soft cinematic vignette gradient over depth */}
      <div className="fixed inset-0 pointer-events-none z-[1] bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.85)_100%)]" />

      {/* Top Floating Mini Header */}
      <nav className="fixed top-0 left-0 w-full z-50 px-6 py-5 md:px-12 flex flex-col sm:flex-row items-center justify-between bg-gradient-to-b from-black/85 to-transparent backdrop-blur-md border-b border-white/[0.03] gap-4 sm:gap-0">
        <div className="flex items-center gap-6">
          <a 
            href="/"
            onMouseEnter={() => triggerSound("click")}
            onClick={(e) => {
              e.preventDefault();
              window.location.hash = "";
              window.history.pushState({}, "", window.location.pathname);
              window.dispatchEvent(new Event("popstate"));
            }}
            className="font-display text-[11px] tracking-[0.4em] text-white hover:text-[#009DFF] transition-all flex items-center gap-2 font-light group"
          >
            <span>M<span className="text-[#009DFF]">≡</span>TRO SUL</span>
          </a>
          <span className="h-3 w-[1px] bg-white/10 hidden md:block" />
          <span className="font-mono text-[11px] text-[#FFB31A] tracking-[0.14em] uppercase hidden md:inline-block animate-pulse font-medium">
            // LIVE TRANSMISSION PORTAL
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          {/* Elegant Minimal Language Picker */}
          <div className="flex items-center gap-1 font-mono text-[11px] bg-white/[0.02] border border-white/5 py-1.5 px-3 rounded-full text-neutral-400">
            <button 
              onClick={() => setLang?.("pt")}
              className="cursor-pointer hover:text-white transition-colors py-0.5 px-1.5 rounded text-[10px] sm:text-[11px]"
              style={{ 
                color: lang === "pt" ? "#FFB31A" : undefined,
                fontWeight: lang === "pt" ? "bold" : undefined,
                background: lang === "pt" ? "rgba(255,255,255,0.03)" : undefined
              }}
            >
              PT
            </button>
            <span className="text-neutral-700 font-light text-[10px] select-none">|</span>
            <button 
              onClick={() => setLang?.("en")}
              className="cursor-pointer hover:text-white transition-colors py-0.5 px-1.5 rounded text-[10px] sm:text-[11px]"
              style={{ 
                color: lang === "en" ? "#FFB31A" : undefined,
                fontWeight: lang === "en" ? "bold" : undefined,
                background: lang === "en" ? "rgba(255,255,255,0.03)" : undefined
              }}
            >
              EN
            </button>
            <span className="text-neutral-700 font-light text-[10px] select-none">|</span>
            <button 
              onClick={() => setLang?.("es")}
              className="cursor-pointer hover:text-white transition-colors py-0.5 px-1.5 rounded text-[10px] sm:text-[11px]"
              style={{ 
                color: lang === "es" ? "#FFB31A" : undefined,
                fontWeight: lang === "es" ? "bold" : undefined,
                background: lang === "es" ? "rgba(255,255,255,0.03)" : undefined
              }}
            >
              ES
            </button>
          </div>

          {/* Immersive Sound controller */}
          <button
            onClick={toggleSound}
            onMouseEnter={() => triggerSound("click")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border font-mono text-[11px] tracking-wider transition-all duration-300 cursor-pointer ${
              soundEnabled
                ? "bg-[#FFAA00]/12 border-[#FFAA00]/50 text-[#FFB31A] font-medium"
                : "bg-white/5 border-white/10 text-neutral-400 hover:text-white hover:border-white/20"
            }`}
          >
            {soundEnabled ? <Volume2 size={11} className="animate-bounce" /> : <VolumeX size={11} />}
            <span>{soundEnabled ? t.aooAudioActive : t.aooAudioOff}</span>
          </button>

          {/* Home Link */}
          <a
            href="/"
            onMouseEnter={() => triggerSound("click")}
            onClick={(e) => {
              e.preventDefault();
              window.location.hash = "";
              window.history.pushState({}, "", window.location.pathname);
              window.dispatchEvent(new Event("popstate"));
            }}
            className="px-4 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-[10px] font-mono tracking-widest transition-all duration-300 cursor-pointer"
          >
            {t.aooMainSystem}
          </a>
        </div>
      </nav>

      {/* SECTION 01: Full-Screen Hero */}
      <section className="relative min-h-screen w-full flex flex-col items-center justify-center text-center px-4 pt-24 pb-44 overflow-hidden z-10">
        
        {/* Subtle background visual elements */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-gradient-to-tr from-[#009DFF]/4 to-[#FFAA00]/4 blur-[160px]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:40px_40px] opacity-15" />
        </div>

        {/* 1. Large Floating Symmetrical Metro Sul Symbol with extremely subtle breathing motion */}
        <div className="relative z-10 w-full max-w-[220px] sm:max-w-[280px] md:max-w-[340px] aspect-square flex items-center justify-center select-none group">
          <motion.div
            animate={{ 
              scale: [1, 1.02, 1],
              opacity: [0.93, 1, 0.93]
            }}
            transition={{ 
              duration: 8, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="w-full h-full relative flex items-center justify-center"
          >
            {/* Outer soft breathing halo glow */}
            <motion.div 
              animate={{ opacity: [0.03, 0.07, 0.03] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute w-[220px] h-[220px] rounded-full bg-gradient-to-r from-[#009DFF] to-[#FFAA00] blur-[60px]" 
            />
            
            <svg 
              viewBox="0 0 100 100" 
              className="w-[85%] h-[85%] drop-shadow-[0_0_35px_rgba(0,157,255,0.08)] group-hover:drop-shadow-[0_0_50px_rgba(255,136,0,0.15)] transition-all duration-1000"
            >
              <defs>
                <linearGradient id="heroBlueArc" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#009DFF" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="#37D8FF" stopOpacity="0.35" />
                </linearGradient>
                <linearGradient id="heroOrangeArc" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#FFAA00" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="#FF4500" stopOpacity="0.35" />
                </linearGradient>
              </defs>

              {/* Central bars */}
              <motion.rect x="43" y="38" width="1.8" height="34" rx="0.9" fill="#FFFFFF" className="opacity-80" animate={{ height: [34, 31, 34], y: [38, 39.5, 38] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} />
              <motion.rect x="49" y="26" width="2" height="51" rx="1" fill="#FFAA00" className="opacity-95" animate={{ height: [51, 53, 51], y: [26, 25, 26] }} transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut" }} />
              <motion.rect x="55.2" y="38" width="1.8" height="34" rx="0.9" fill="#FFFFFF" className="opacity-80" animate={{ height: [34, 32.5, 34], y: [38, 38.75, 38] }} transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }} />

              {/* Symmetrical Left blue arc */}
              <motion.path 
                d="M 37 14 A 39 39 0 0 0 37 86" 
                fill="none" 
                stroke="url(#heroBlueArc)" 
                strokeWidth="2.2" 
                strokeLinecap="round"
                animate={{ opacity: [0.75, 0.9, 0.75] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              />

              {/* Symmetrical Right orange arc */}
              <motion.path 
                d="M 63 14 A 39 39 0 0 1 63 86" 
                fill="none" 
                stroke="url(#heroOrangeArc)" 
                strokeWidth="2.2" 
                strokeLinecap="round"
                animate={{ opacity: [0.75, 0.9, 0.75] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
              />
            </svg>
          </motion.div>
        </div>

        {/* Headline, Subheadline and Info */}
        <div className="relative z-10 space-y-4 md:space-y-6 max-w-2xl px-6">
          <div className="space-y-2 md:space-y-3">
            <span className="font-mono text-[9px] tracking-[0.4em] text-[#009DFF] uppercase font-semibold block">
              // ORIGINAL SIGNAL PHASE
            </span>
            <h1 className="font-display text-4.5xl sm:text-5.5xl md:text-7xl font-bold tracking-tight text-white uppercase leading-none">
              ARCHITECT OF OVERFLOW
            </h1>
            <p className="font-mono text-[10px] md:text-xs text-neutral-400 tracking-[0.25em] max-w-lg mx-auto leading-relaxed">
              {t.aooFirstTransmission}
            </p>
          </div>

          {/* Prominent Hero Release Date */}
          <div className="inline-flex flex-col sm:flex-row items-center gap-2 sm:gap-4 px-6 py-2.5 sm:px-7 sm:py-3 rounded-full bg-[#FFAA00]/[0.03] border border-[#FFB31A]/35 font-mono tracking-widest mt-4 mb-2 sm:mt-6 sm:mb-4 shadow-[0_0_20px_rgba(255,170,0,0.05)]">
            <span className="text-[10px] sm:text-[11px] text-[#FFC14D] font-bold tracking-[0.2em] flex items-center gap-1.5 uppercase pl-[0.2em]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#FFC14D] animate-pulse" />
              {lang === "pt" ? "ALINHAMENTO GLOBAL" : lang === "es" ? "ALINEACIÓN GLOBAL" : "ALIGNMENT TARGET"}
            </span>
            <span className="hidden sm:inline text-neutral-700">|</span>
            <span className="text-sm sm:text-base font-bold text-white tracking-[0.25em] pl-[0.25em]">
              31 JULY 2026
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2 sm:pt-4">
            <a 
              href={PRESAVE_URL}
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => triggerSound("click")}
              onClick={() => triggerSound("confirm")}
              className="w-full sm:w-auto px-10 py-4 rounded-full text-xs font-mono tracking-widest font-bold bg-white text-black hover:bg-neutral-200 flex items-center justify-center gap-2.5 transition-all duration-300 hover:shadow-[0_0_35px_rgba(255,255,255,0.22)] hover:-translate-y-0.5 cursor-pointer"
            >
              <span>
                {isReleased || testReleased 
                  ? (lang === "pt" ? "OUVIR AGORA" : lang === "es" ? "ESCUCHAR AHORA" : "LISTEN NOW") 
                  : "JOIN THE SIGNAL"}
              </span>
              <ArrowRight size={12} />
            </a>
            
            <button
              onClick={handleOpenTeaser}
              onMouseEnter={() => triggerSound("click")}
              className="w-full sm:w-auto px-8 py-4 rounded-full text-xs font-mono tracking-widest font-bold bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white flex items-center justify-center gap-2.5 transition-all duration-300 cursor-pointer hover:-translate-y-0.5"
            >
              <Play size={11} className="fill-current" />
              <span>{t.aooWatchTeaser.toUpperCase()}</span>
            </button>
          </div>
        </div>

        {/* Ambient Chevron scroll down indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 opacity-60 animate-pulse" style={{ animationDuration: "3s" }}>
          <span className="font-mono text-[13px] sm:text-[15px] md:text-[18px] tracking-[0.28em] leading-[1.3] text-[#FFC14D] uppercase font-medium pl-[0.28em]">SCROLL ENGINE</span>
          <ChevronDown size={16} className="text-[#FFC14D]" />
        </div>
      </section>

      {/* SECTION 02: Live Countdown */}
      <section className="relative py-20 md:py-28 w-full border-t border-white/[0.03] bg-gradient-to-b from-black to-[#050508] flex flex-col items-center justify-center overflow-hidden z-10">
        
        {/* Soft blue glow backdrop behind countdown */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 w-[280px] h-[280px] md:w-[440px] md:h-[440px] mx-auto rounded-full bg-[#009DFF]/[0.05] blur-[90px] md:blur-[130px] pointer-events-none" />

        {/* Release State Debug Switcher */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
          <button
            onClick={() => {
              triggerSound("click");
              setTestReleased(!testReleased);
            }}
            className="px-3 py-1 rounded bg-white/5 border border-white/10 text-[8px] font-mono tracking-wider text-neutral-400 hover:text-white transition-all cursor-pointer"
          >
            [SIMULATE {testReleased ? "PRE-RELEASE" : "POST-RELEASE"}]
          </button>
        </div>

        <div className="max-w-4xl mx-auto px-6 text-center space-y-12 relative z-10">
          <ScrollReveal>
            <div className="space-y-4">
              <span className="font-mono text-[15px] md:text-[19px] tracking-[0.28em] leading-[1.3] text-[#FFC14D] uppercase font-medium block pl-[0.28em]">
                // TEMPORAL VECTOR COUNTDOWN
              </span>
              <div className="flex flex-col items-center justify-center space-y-1 py-1">
                <span className="font-mono text-[10px] tracking-[0.25em] text-neutral-500 font-bold uppercase pl-[0.25em]">RELEASE DATE</span>
                <span className="font-display text-xl sm:text-2xl font-black tracking-[0.2em] text-[#FFC14D] pl-[0.2em]">31 JULY 2026</span>
              </div>
              <h2 className="text-xs font-mono text-neutral-400 tracking-[0.25em] uppercase pl-[0.25em]">
                RESONANCE ENVELOPE SYNCHRONIZATION
              </h2>
            </div>
          </ScrollReveal>

          <AnimatePresence mode="wait">
            {isReleased || testReleased ? (
              <motion.div 
                key="released"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="py-10 space-y-4"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[10px] tracking-widest uppercase">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>{t.aooSignalActive}</span>
                </div>
                <h3 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-white uppercase">
                  {t.aooTransmissionLive}
                </h3>
              </motion.div>
            ) : (
              <motion.div 
                key="countdown"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10 max-w-4.5xl mx-auto"
              >
                {[
                  { label: t.aooDays.toUpperCase(), value: timeLeft.days },
                  { label: t.aooHours.toUpperCase(), value: timeLeft.hours },
                  { label: t.aooMinutes.toUpperCase(), value: timeLeft.minutes },
                  { label: t.aooSeconds.toUpperCase(), value: timeLeft.seconds }
                ].map((item, index) => (
                  <div key={index} className="space-y-2 text-center p-8 md:p-10 rounded-2xl bg-[#09090c] border border-white/[0.06] shadow-inner relative group">
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-[#FFAA00]/5 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none" />
                    <div className="font-display text-5xl sm:text-6xl md:text-7xl font-extralight tracking-tight text-white">
                      {String(item.value).padStart(2, "0")}
                    </div>
                    <div className="text-[9.5px] font-mono text-neutral-500 tracking-[0.2em] font-semibold uppercase">
                      {item.label}
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* SECTION 03: Artwork Gallery Component */}
      <section className="py-16 md:py-20 w-full bg-gradient-to-b from-[#050508] to-black flex flex-col items-center justify-center z-10 relative">
        
        {/* Blue/orange balanced glow backdrop behind artwork */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[200px] h-[200px] md:w-[320px] md:h-[320px] rounded-full bg-[#009DFF]/[0.04] blur-[80px] md:blur-[110px] pointer-events-none" />
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[200px] h-[200px] md:w-[320px] md:h-[320px] rounded-full bg-[#FFAA00]/[0.03] blur-[80px] md:blur-[110px] pointer-events-none" />

        <div className="max-w-xl mx-auto px-6 text-center space-y-10">
          <ScrollReveal>
            <div className="space-y-2">
              <span className="font-mono text-[9px] tracking-[0.3em] text-[#009DFF] uppercase font-semibold block">
                // PHYSICAL FREQUENCY OBJECT
              </span>
              <h2 className="text-xs font-mono text-neutral-400 tracking-[0.25em] uppercase">
                TRANSMISSION COVER MATRIX
              </h2>
            </div>
          </ScrollReveal>

          {/* Symmetrical Floating Frame for Gallery Object */}
          <ScrollReveal delay={0.2}>
            <motion.div 
              whileHover={{ y: -10, scale: 1.01 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              onMouseEnter={() => triggerSound("click")}
              className="w-full aspect-square max-w-[340px] md:max-w-[400px] mx-auto rounded-3xl bg-[#0a0a0d] border border-white/[0.08] shadow-[0_30px_70px_rgba(0,0,0,0.95)] p-5 relative overflow-hidden group cursor-grab active:cursor-grabbing"
            >
              {/* Glossy overlay sheen */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/[0.015] to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              
              {/* Gallery object inner artwork */}
              <div className="w-full h-full rounded-2xl overflow-hidden bg-black border border-white/[0.04] relative flex flex-col justify-between p-6">
                
                {/* Radial warm lighting inside */}
                <div className="absolute inset-0 bg-radial-gradient pointer-events-none" 
                  style={{
                    background: "radial-gradient(circle at 50% 50%, rgba(255, 136, 0, 0.08) 0%, rgba(0, 157, 255, 0.04) 60%, transparent 100%)"
                  }}
                />

                <div className="text-center z-10 pt-1">
                  <span className="font-display text-[10px] tracking-[0.5em] font-light text-white pl-[0.5em] uppercase opacity-75">
                    METRO SUL
                  </span>
                </div>

                {/* Graphic container */}
                <div className="flex-1 w-full flex items-center justify-center">
                  <svg viewBox="0 0 100 100" className="w-[65%] h-[65%] drop-shadow-[0_0_30px_rgba(255,136,0,0.12)]">
                    <motion.rect x="44.5" y="40" width="1.5" height="30" rx="0.75" fill="#FFFFFF" className="opacity-70" animate={{ height: [30, 27, 30], y: [40, 41.5, 40] }} transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }} />
                    <motion.rect x="49.2" y="29" width="1.6" height="42" rx="0.8" fill="#FFAA00" className="opacity-90" animate={{ height: [42, 45, 42], y: [29, 27.5, 29] }} transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }} />
                    <motion.rect x="54" y="40" width="1.5" height="30" rx="0.75" fill="#FFFFFF" className="opacity-70" animate={{ height: [30, 28, 30], y: [40, 41, 40] }} transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }} />
                    <path d="M 39 20 A 32 32 0 0 0 39 80" fill="none" stroke="#009DFF" strokeWidth="2" strokeLinecap="round" className="opacity-80" />
                    <path d="M 61 20 A 32 32 0 0 1 61 80" fill="none" stroke="#FFAA00" strokeWidth="2" strokeLinecap="round" className="opacity-80" />
                  </svg>
                </div>

                <div className="text-center z-10 pb-1 flex flex-col items-center gap-1">
                  <span className="font-display text-[7.5px] tracking-[0.4em] text-white/80 pl-[0.4em] uppercase font-semibold">
                    ARCHITECT OF OVERFLOW
                  </span>
                </div>
              </div>
            </motion.div>
          </ScrollReveal>

          {/* Fine Editorial Caption */}
          <div className="space-y-1 text-center font-mono text-[9px] text-neutral-500 uppercase tracking-[0.25em]">
            <p className="text-neutral-400">Metro Sul</p>
            <p className="text-neutral-300 font-bold">Architect of Overflow</p>
            <p className="text-neutral-600">// CAT1927582 // MTS-003</p>
          </div>
        </div>
      </section>

      {/* SECTION 04: Cinematic Scrolling Transmission */}
      <section 
        ref={transmissionContainerRef}
        className="relative h-[290vh] w-full bg-black flex flex-col justify-start"
      >
        {/* Sentinels for IntersectionObserver tracking with -40% 0px -40% 0px rootMargin (middle 20% viewport band) */}
        {transmissionPhrases.map((_, idx) => (
          <div
            key={idx}
            ref={(el) => {
              sentinelsRef.current[idx] = el;
            }}
            className="absolute left-0 right-0 h-1 pointer-events-none"
            style={{ top: `${50 + idx * 31}vh` }}
          />
        ))}

        {/* Sticky viewport frame to anchor the cinematic typography */}
        <div className="sticky top-0 left-0 w-full h-[100dvh] flex flex-col items-center justify-center overflow-hidden z-10">
          
          {/* Amber signal glow backdrop behind transmission/code */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[460px] md:h-[460px] mx-auto rounded-full bg-[#FFAA00]/[0.045] blur-[100px] md:blur-[140px] pointer-events-none" />

          {/* Subtle horizontal signal waves */}
          <div className="absolute inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#FFAA00]/12 to-transparent top-[45%] pointer-events-none" />
          <div className="absolute inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#009DFF]/8 to-transparent top-[55%] pointer-events-none" />

          {/* Interactive instruction tag - mathematically centered */}
          <div className="absolute top-24 left-1/2 -translate-x-1/2 font-mono text-[15px] md:text-[19px] text-[#FFC14D] tracking-[0.28em] leading-[1.3] font-medium uppercase text-center whitespace-nowrap z-20 pl-[0.28em]">
            {t.aooScrollSlowly}
          </div>

          {/* Sticky target anchor viewport */}
          <div className="w-full max-w-4xl px-6 relative flex items-center justify-center h-48">
            {transmissionPhrases.map((phrase, idx) => {
              const isCurrentActive = activeIndex === idx;
              return (
                <div
                  key={idx}
                  style={{
                    ...getPhraseStyle(idx),
                    fontSize: "clamp(1.5rem, 5vw, 4.5rem)",
                    maxWidth: "92vw",
                    overflowWrap: "normal",
                    wordBreak: "normal"
                  }}
                  className="absolute font-display font-black text-center text-white uppercase select-none font-bold tracking-[0.15em] leading-[1.05]"
                >
                  <StaggeredPhrase phrase={phrase} isActive={isCurrentActive} />
                </div>
              );
            })}
          </div>

          {/* Subtle frequency signal line continuing downward from the center */}
          <motion.div 
            style={{ 
              opacity: scrollProgress > 0.90 ? Math.min(1, (scrollProgress - 0.90) * 10.0) : 0,
              scaleY: scrollProgress > 0.90 ? Math.min(1, (scrollProgress - 0.90) * 8.0) : 0,
              originY: 0
            }}
            className="absolute top-[50%] left-1/2 -translate-x-1/2 w-[1px] h-[30vh] bg-gradient-to-b from-[#FFAA00] via-[#009DFF]/60 to-transparent z-15 pointer-events-none"
          />

          {/* Elegant HUD tracking meter - mathematically centered */}
          <div className="absolute bottom-36 left-1/2 -translate-x-1/2 w-44 h-[2px] bg-white/[0.04] rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#009DFF] to-[#FFAA00] transition-all duration-100 ease-out" 
              style={{ width: `${scrollProgress * 100}%` }}
            />
          </div>

          {/* Symmetrical vertical signal path / continuation indicator that fades in at the end of the scroll - mathematically centered */}
          <motion.div 
            style={{ 
              opacity: scrollProgress > 0.90 ? Math.min(1, (scrollProgress - 0.90) * 8.0) : 0,
              y: scrollProgress > 0.90 ? 0 : 25
            }}
            transition={{ ease: "easeOut" }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3.5 z-20 pointer-events-auto"
          >
            <button 
              onClick={(e) => {
                e.preventDefault();
                triggerSound("confirm");
                const target = document.getElementById("editorial-section");
                if (target) {
                  target.scrollIntoView({ behavior: "smooth" });
                }
              }}
              onMouseEnter={() => triggerSound("tick")}
              className="font-mono text-[11px] tracking-[0.18em] text-[#FFB31A] hover:text-[#009DFF] uppercase font-bold pl-[0.18em] transition-all duration-300 bg-black/70 hover:bg-black/90 border border-[#FFAA00]/35 hover:border-[#009DFF]/50 px-5 py-2.5 rounded-full cursor-pointer hover:shadow-[0_0_15px_rgba(0,157,255,0.22)] active:scale-95 flex items-center gap-2 whitespace-nowrap"
            >
              {t.aooContinueToReleaseNotes.toUpperCase()}
            </button>
            <div className="relative flex flex-col items-center h-16 w-8 pointer-events-none">
              {/* Vertical thin frequency line using the Metro Sul palette */}
              <div className="w-[1px] h-16 bg-gradient-to-b from-[#FFAA00] via-[#009DFF] to-transparent" />
              {/* Subtle pulsing dot moving downward along the line - mathematically centered */}
              <motion.div 
                animate={{ y: [0, 52, 0] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-gradient-to-r from-[#FFAA00] to-[#009DFF] shadow-[0_0_10px_#009DFF] z-10"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 05: About the Release & Preview */}
      <section 
        id="editorial-section" 
        className="min-h-screen w-full bg-gradient-to-b from-black via-[#040407] to-black border-t border-white/[0.02] flex flex-col items-center justify-center relative z-10 py-16 md:py-24"
      >
        {/* Calmer white/blue glow backdrop in editorial/about section */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/3 w-[240px] h-[240px] md:w-[380px] md:h-[380px] rounded-full bg-white/[0.02] blur-[90px] md:blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/3 left-1/2 -translate-x-1/2 translate-y-1/3 w-[200px] h-[200px] md:w-[300px] md:h-[300px] rounded-full bg-[#009DFF]/[0.03] blur-[90px] md:blur-[120px] pointer-events-none" />
        
        {/* Visual signal path thread continuation at the top of Section 05: Minimal "Signal Evolution" Connector */}
        <div className="w-full flex flex-col items-center mb-8 relative z-20">
          <div className="w-[1px] h-12 md:h-16 bg-gradient-to-b from-transparent via-[#009DFF]/30 to-[#FFAA00]/40" />
          <motion.div 
            animate={{ scale: [0.95, 1.15, 0.95], opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 2.2, repeat: Infinity }}
            className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-[#009DFF] to-[#FFAA00] shadow-[0_0_8px_#FFAA00]"
          />
          <span className="font-mono text-[14px] md:text-[17px] tracking-[0.28em] leading-[1.3] text-[#FFC14D] uppercase font-medium mt-3 pl-[0.28em] text-center">
            SIGNAL EVOLUTION
          </span>
          <div className="w-[1px] h-8 md:h-10 bg-gradient-to-b from-[#FFAA00]/40 to-transparent mt-3" />
        </div>

        <div className="max-w-2xl mx-auto px-8 space-y-10 relative z-10 w-full">
          
          <ScrollReveal>
            <div className="space-y-2 text-center md:text-left">
              <span className="font-mono text-[14px] md:text-[17px] tracking-[0.28em] leading-[1.3] text-[#FFC14D] uppercase font-medium block pl-[0.28em] text-center md:text-left">
                // EDITORIAL PROTOCOL
              </span>
              <h2 className="text-xs font-mono text-neutral-400 tracking-[0.25em] uppercase">
                {lang === "pt" ? "SOBRE O LANÇAMENTO" : lang === "es" ? "SOBRE EL LANZAMIENTO" : "ABOUT THE RELEASE"}
              </h2>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.25}>
            <div className="space-y-6 font-sans font-light leading-relaxed text-neutral-300 text-base md:text-lg text-left border-l border-white/10 pl-6 md:pl-10">
              <p className="font-semibold text-white">
                {t.aooOpensNewCreative}
              </p>
              <p className="text-neutral-400">
                {t.aooBlendingDescription}
              </p>
            </div>
          </ScrollReveal>

          {/* Spec panel details */}
          <ScrollReveal delay={0.4}>
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/5 font-mono text-[9px] text-neutral-500 uppercase tracking-widest text-center">
              <div className="space-y-1">
                <span className="block text-neutral-600">BPM</span>
                <span className="text-neutral-300 font-bold">124 BPM</span>
              </div>
              <div className="space-y-1 border-x border-white/5">
                <span className="block text-neutral-600">{lang === "pt" ? "TOM" : lang === "es" ? "TONALIDAD" : "KEY"}</span>
                <span className="text-neutral-300 font-bold">{lang === "pt" ? "LÁ MENOR" : lang === "es" ? "LA MENOR" : "A MINOR"}</span>
              </div>
              <div className="space-y-1">
                <span className="block text-neutral-600">{lang === "pt" ? "RESOLUÇÃO" : lang === "es" ? "RESOLUCIÓN" : "RESOLUTION"}</span>
                <span className="text-neutral-300 font-bold">24-BIT / 96KHZ</span>
              </div>
            </div>
          </ScrollReveal>

          {/* Integrated Preview Portal Widget with clean spacing */}
          <div className="pt-10 border-t border-white/5 space-y-6">
            <ScrollReveal>
              <div className="space-y-2 text-center">
                <span className="font-mono text-[9px] tracking-[0.3em] text-[#009DFF] uppercase font-semibold block">
                  // PREVIEW PORTAL WIDGET
                </span>
                <h2 className="text-xs font-mono text-neutral-400 tracking-[0.25em] uppercase">
                  SPOTIFY BROADCAST CHANNEL
                </h2>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <AnimatePresence mode="wait">
                {isReleased || testReleased ? (
                  <motion.div
                    key="spotify-player"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="w-full max-w-[640px] mx-auto rounded-3xl overflow-hidden bg-neutral-900/40 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] animate-pulse-subtle"
                  >
                    {/* Embedded actual Metro Sul Spotify Player widget */}
                    <iframe 
                      src="https://open.spotify.com/embed/album/3F10JFx7wrz3scGyBUY3ES?utm_source=generator&theme=0" 
                      width="100%" 
                      height="352" 
                      frameBorder="0" 
                      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                      loading="lazy"
                      className="rounded-3xl border-0"
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="spotify-placeholder"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="max-w-lg mx-auto py-10 px-8 rounded-3xl bg-[#09090c]/80 border border-white/[0.04] shadow-inner space-y-6 flex flex-col items-center"
                  >
                    <div className="p-4 rounded-full bg-white/[0.02] border border-white/5 text-[#FFAA00] animate-pulse">
                      <Disc size={32} className="animate-spin" style={{ animationDuration: "12s" }} />
                    </div>
                    <div className="space-y-2 text-center">
                      <h3 className="font-mono text-xs tracking-[0.3em] font-bold text-white uppercase">
                        {t.aooAvailableJuly31}
                      </h3>
                      <p className="font-sans text-[11px] text-neutral-400 max-w-xs mx-auto leading-relaxed">
                        {t.aooSpotifyNotice}
                      </p>
                    </div>
                    
                    <a 
                      href={PRESAVE_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      onMouseEnter={() => triggerSound("click")}
                      onClick={() => triggerSound("confirm")}
                      className="px-6 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-[10px] font-mono tracking-widest text-neutral-300 transition-all cursor-pointer inline-flex items-center gap-2 hover:shadow-[0_0_15px_rgba(255,170,0,0.15)]"
                    >
                      <span>
                        {lang === "pt" 
                          ? "NOTIFICAR VIA SMARTLINK" 
                          : lang === "es" 
                            ? "NOTIFICAR VÍA SMARTLINK" 
                            : "NOTIFY VIA SMARTLINK"}
                      </span>
                      <ExternalLink size={10} />
                    </a>
                  </motion.div>
                )}
              </AnimatePresence>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* SECTION 07: Final CTA */}
      <section className="py-20 w-full bg-gradient-to-b from-black to-[#050508] border-t border-white/[0.02] flex flex-col items-center justify-center text-center px-4 relative overflow-hidden z-10">
        
        {/* Symmetrical glowing backdrop */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full bg-gradient-to-t from-[#FFAA00]/5 to-transparent blur-[120px] pointer-events-none" />

        <div className="max-w-xl mx-auto space-y-10 relative z-10">
          
          <ScrollReveal>
            {/* Symmetrical Metro Sul miniature symbol */}
            <div className="w-16 h-16 mx-auto relative select-none">
              <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_20px_rgba(255,136,0,0.2)]">
                <circle cx="50" cy="50" r="30" fill="none" stroke="rgba(255, 170, 0, 0.15)" strokeWidth="1" />
                <line x1="50" y1="30" x2="50" y2="70" stroke="#FFAA00" strokeWidth="2.5" />
                <path d="M 40 35 A 18 18 0 0 0 40 65" fill="none" stroke="#009DFF" strokeWidth="2" />
                <path d="M 60 35 A 18 18 0 0 1 60 65" fill="none" stroke="#FFAA00" strokeWidth="2" />
              </svg>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div className="space-y-4">
              <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-white uppercase">
                Join the Signal
              </h2>
              <p className="font-mono text-[9px] text-neutral-400 tracking-[0.3em] uppercase max-w-xs mx-auto leading-relaxed">
                {lang === "pt" 
                  ? "Garanta seu link direto para a sequência de alinhamento." 
                  : lang === "es" 
                    ? "Asegura tu enlace directo a la secuencia de alineación." 
                    : "Secure your direct link to the alignment sequence."}
              </p>
              
              {/* Campaign statement */}
              <div className="pt-4 pb-1">
                <span className="font-display text-xl sm:text-2xl md:text-3xl font-black tracking-[0.25em] text-white bg-gradient-to-r from-white via-[#FFB31A] to-white bg-clip-text text-transparent block pl-[0.25em]">
                  ARRIVING 31 JULY 2026
                </span>
              </div>
            </div>
          </ScrollReveal>

          {/* 6. Wider & taller Join the Signal button with premium blue/orange hover glow */}
          <ScrollReveal delay={0.35}>
            <a 
              href={PRESAVE_URL}
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => triggerSound("click")}
              onClick={() => triggerSound("confirm")}
              className="inline-flex px-14 py-5 rounded-full text-xs font-mono tracking-widest font-bold bg-gradient-to-r from-[#FFAA00] to-[#FF5500] text-white hover:opacity-90 shadow-[0_0_30px_rgba(255,136,0,0.25)] hover:shadow-[0_0_45px_rgba(255,136,0,0.35),0_0_20px_rgba(0,157,255,0.15)] transition-all duration-300 hover:scale-[1.03] hover:-translate-y-0.5 cursor-pointer border border-white/10"
            >
              {isReleased || testReleased 
                ? (lang === "pt" ? "OUVIR NO SPOTIFY" : lang === "es" ? "ESCUCHAR EN SPOTIFY" : "LISTEN ON SPOTIFY") 
                : (lang === "pt" ? "SALVAR NO SPOTIFY" : lang === "es" ? "PRE-GUARDAR EN SPOTIFY" : "PRE-SAVE ON SPOTIFY")}
            </a>
          </ScrollReveal>

          {/* Small footer */}
          <div className="pt-12 space-y-2">
            <p className="font-mono text-[11.5px] text-[#FFB31A] tracking-[0.22em] uppercase font-bold">
              Frequency becomes form.
            </p>
            <p className="font-mono text-[8px] text-neutral-600 tracking-widest uppercase">
              METRO SUL // ALL RIGHTS RESERVED © {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </section>

      {/* TEASER CINEMATIC MODAL */}
      <AnimatePresence>
        {showTeaser && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(24px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)", transition: { duration: 0.2 } }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={handleCloseTeaser}
            className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-4 md:p-6 select-none cursor-pointer"
          >
            {/* Custom Scan Line Animation Style */}
            <style>{`
              @keyframes video-scan {
                0% { top: 0%; }
                100% { top: 100%; }
              }
              .animate-video-scan {
                animation: video-scan 4s infinite linear;
              }
            `}</style>

            {/* Top-Right Close Button - Easy to tap on mobile, clearly visible */}
            <button
              onClick={handleCloseTeaser}
              onMouseEnter={() => triggerSound("click")}
              className="absolute top-4 right-4 md:top-6 md:right-6 z-50 p-4 rounded-full bg-black/40 hover:bg-white/15 border border-white/15 backdrop-blur-md text-white/80 hover:text-white transition-all cursor-pointer hover:scale-105 active:scale-95 flex items-center justify-center"
              aria-label="Close Teaser"
            >
              <X size={24} />
            </button>

            {/* Center Cinematic Container with scale and opacity animations */}
            <motion.div 
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0, transition: { duration: 0.2 } }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className="flex flex-col items-center justify-center w-full max-w-md cursor-default"
            >
              
              {/* Title & Transmission Caption ABOVE the video */}
              <div className="text-center space-y-1.5 mb-5">
                <h4 className="font-display text-xl sm:text-2xl tracking-[0.22em] text-white font-black uppercase leading-none">
                  ARCHITECT OF OVERFLOW
                </h4>
                <div className="flex items-center justify-center gap-3 font-mono text-[11px] tracking-[0.18em] text-[#FFB31A] uppercase font-bold">
                  <span>OFFICIAL PREVIEW</span>
                  <span className="text-neutral-700 font-light">|</span>
                  <span className="text-white">31 JULY 2026</span>
                </div>
              </div>

              {/* Vertical 9:16 Video Area */}
              <div className="relative w-[85vw] max-w-[340px] sm:max-w-[360px] aspect-[9/16] rounded-2xl bg-neutral-950 border border-white/10 shadow-[0_0_60px_rgba(255,170,0,0.15)] overflow-hidden group">
                
                {/* CRT Scanline effect overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,3px_100%] pointer-events-none z-20 opacity-35" />
                
                {/* Ambient glow backing */}
                <div className="absolute inset-0 bg-radial-gradient z-0 pointer-events-none" 
                  style={{
                    background: "radial-gradient(circle at 50% 50%, rgba(255, 170, 0, 0.04) 0%, rgba(0, 157, 255, 0.02) 60%, transparent 100%)"
                  }}
                />

                {videoError ? (
                  /* Premium Placeholder if Video Fails to Load / Not Available */
                  <div className="absolute inset-0 bg-neutral-950 flex flex-col items-center justify-between p-6 overflow-hidden z-10">
                    {/* Matrix lines */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:24px_24px] opacity-20" />
                    
                    {/* Sweep Line */}
                    <div className="absolute inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#FFB31A]/30 to-transparent top-0 animate-video-scan pointer-events-none" />
                    
                    {/* HUD Header */}
                    <div className="w-full flex justify-between items-center text-[8px] font-mono text-neutral-500 tracking-wider">
                      <span>MTS // CHANN-03</span>
                      <span className="text-[#FFB31A] font-bold tracking-[0.15em] animate-pulse">// OFFLINE CAPTURE</span>
                    </div>

                    {/* Center symbol */}
                    <div className="relative flex flex-col items-center justify-center my-auto space-y-4">
                      <div className="w-24 h-24 relative flex items-center justify-center">
                        <motion.div 
                          animate={{ rotate: 360 }}
                          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                          className="absolute inset-0 rounded-full border border-dashed border-white/10"
                        />
                        <motion.div 
                          animate={{ rotate: -360 }}
                          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                          className="absolute w-18 h-18 rounded-full border border-[#009DFF]/15"
                        />
                        <div className="w-12 h-12 rounded-full bg-neutral-900 border border-white/5 flex items-center justify-center shadow-[0_0_15px_rgba(255,170,0,0.08)]">
                          <svg viewBox="0 0 100 100" className="w-6 h-6">
                            <rect x="49" y="24" width="2" height="52" rx="1" fill="#FFB31A" className="opacity-90" />
                            <path d="M 38 28 A 22 22 0 0 0 38 72" fill="none" stroke="#009DFF" strokeWidth="2" strokeLinecap="round" className="opacity-80" />
                            <path d="M 62 28 A 22 22 0 0 1 62 72" fill="none" stroke="#FFB31A" strokeWidth="2" strokeLinecap="round" className="opacity-80" />
                          </svg>
                        </div>
                      </div>
                      
                      <div className="text-center space-y-1">
                        <span className="font-mono text-[10px] tracking-[0.2em] text-[#FFB31A] font-bold block animate-pulse">
                          TEASER SIGNAL LOADING
                        </span>
                        <span className="font-mono text-[7px] tracking-[0.1em] text-neutral-500 block uppercase">
                          RESONANCE ACTIVE // MTS-003
                        </span>
                      </div>
                    </div>

                    {/* HUD Footer */}
                    <div className="w-full flex flex-col gap-1 font-mono text-[7px] text-neutral-600 tracking-wider">
                      <div className="w-full h-[1px] bg-white/5" />
                      <div className="flex justify-between">
                        <span>PIPELINE: LOCKED</span>
                        <span>V_0.8B</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Video Stream Element */
                  <div className="absolute inset-0 w-full h-full z-10 cursor-pointer" onClick={toggleVideoPlay}>
                    <video
                      ref={videoRef}
                      src="/assets/architect-of-overflow-teaser.mp4"
                      className="w-full h-full object-cover animate-fade-in"
                      autoPlay
                      muted={videoMuted}
                      loop
                      playsInline
                      onPlay={() => setVideoPlaying(true)}
                      onPause={() => setVideoPlaying(false)}
                      onError={() => setVideoError(true)}
                      onTimeUpdate={() => {
                        if (videoRef.current) {
                          setVideoCurrentTime(videoRef.current.currentTime);
                          setVideoProgress((videoRef.current.currentTime / (videoRef.current.duration || 1)) * 100);
                        }
                      }}
                      onLoadedMetadata={() => {
                        if (videoRef.current) {
                          setVideoDuration(videoRef.current.duration || 15);
                        }
                      }}
                    />

                    {/* HUD Top-Bar Overlay on Video */}
                    <div className="absolute top-0 inset-x-0 bg-gradient-to-b from-black/80 to-transparent p-4 z-20 flex justify-between items-center font-mono text-[8px] text-neutral-300 tracking-wider">
                      <span>MTS // TRANS-STREAM</span>
                      <span className="font-bold text-[#FFB31A] tracking-widest flex items-center gap-1.5 bg-black/40 px-2 py-0.5 rounded border border-white/5">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#FFB31A] animate-ping" />
                        OFFICIAL PREVIEW
                      </span>
                    </div>

                    {/* Center Play Icon Overlay (visible when paused) */}
                    <AnimatePresence>
                      {!videoPlaying && (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="absolute inset-0 flex items-center justify-center bg-black/40 z-20"
                        >
                          <div className="w-14 h-14 rounded-full bg-black/60 border border-white/15 backdrop-blur-md flex items-center justify-center shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                            <Play size={18} className="fill-white text-white ml-1" />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Interactive HUD Controls Overlay */}
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4 z-20 flex flex-col gap-2.5">
                      {/* Subtle Progress Bar */}
                      <div 
                        className="w-full h-1 bg-white/10 rounded-full overflow-hidden cursor-pointer relative"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!videoRef.current || !videoDuration) return;
                          const rect = e.currentTarget.getBoundingClientRect();
                          const clickX = e.clientX - rect.left;
                          const percentage = clickX / rect.width;
                          videoRef.current.currentTime = percentage * videoDuration;
                        }}
                      >
                        <div 
                          className="h-full bg-gradient-to-r from-[#009DFF] to-[#FFB31A] transition-all duration-100"
                          style={{ width: `${videoProgress}%` }}
                        />
                      </div>

                      {/* Controls Bottom Row */}
                      <div className="flex justify-between items-center text-[9px] font-mono text-neutral-300">
                        <div className="flex items-center gap-3">
                          {/* Play/Pause Toggle */}
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleVideoPlay();
                            }}
                            className="p-1 text-white hover:text-[#FFB31A] transition-colors cursor-pointer"
                          >
                            {videoPlaying ? <Pause size={12} /> : <Play size={12} className="fill-current" />}
                          </button>

                          {/* Sound Mute/Unmute Toggle */}
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleVideoMute();
                            }}
                            className="p-1 text-white hover:text-[#FFB31A] transition-colors cursor-pointer flex items-center gap-1"
                          >
                            {videoMuted ? (
                              <>
                                <VolumeX size={12} className="text-red-500" />
                                <span className="text-[7.5px] text-red-500 uppercase font-bold">MUTED</span>
                              </>
                            ) : (
                              <>
                                <Volume2 size={12} className="text-[#FFB31A]" />
                                <span className="text-[7.5px] text-[#FFB31A] uppercase font-bold">AUDIO</span>
                              </>
                            )}
                          </button>
                        </div>

                        {/* Current Time / Duration Counter */}
                        <div className="tracking-widest text-neutral-400">
                          {Math.floor(videoCurrentTime)}s / {Math.floor(videoDuration)}s
                        </div>
                      </div>
                    </div>

                  </div>
                )}

              </div>

              {/* Running Time BELOW the video */}
              <div className="mt-5 text-center">
                <p className="font-mono text-[11px] text-[#FFB31A] tracking-[0.18em] uppercase font-semibold">
                  Running Time • 00:12
                </p>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

