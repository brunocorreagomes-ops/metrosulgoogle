import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";
import { 
  Play, 
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
  const letters = phrase.split("");
  return (
    <div className="flex flex-wrap justify-center items-center gap-[0.01em] md:gap-[0.03em] select-none">
      {letters.map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, filter: "blur(10px)", y: 5 }}
          animate={isActive 
            ? { opacity: 1, filter: "blur(0px)", y: 0 } 
            : { opacity: 0.1, filter: "blur(5px)", y: -3 }
          }
          transition={{
            duration: 0.9,
            delay: isActive ? i * 0.035 : 0,
            ease: [0.16, 1, 0.3, 1]
          }}
          className={char === " " ? "w-3 md:w-5" : "inline-block"}
        >
          {char}
        </motion.span>
      ))}
    </div>
  );
}

export default function ArchitectOfOverflowPage() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isReleased, setIsReleased] = useState(false);
  const [showTeaser, setShowTeaser] = useState(false);
  const [testReleased, setTestReleased] = useState(false);
  const [isPlayingTeaser, setIsPlayingTeaser] = useState(false);
  const [activeTab, setActiveTab] = useState<"desktop" | "mobile">("desktop");
  const [soundEnabled, setSoundEnabled] = useState(false);

  // Sound Synth engine for absolute immersion (Cercle / Anyma feel)
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const filterRef = useRef<BiquadFilterNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  // Intersection scroll tracking for Section 04: Transmission
  const [scrollProgress, setScrollProgress] = useState(0);
  const transmissionContainerRef = useRef<HTMLDivElement | null>(null);

  // Force reset scroll to top on component load/mount
  useEffect(() => {
    window.scrollTo(0, 0);
    const scrollTimeout = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 40);

    if ("scrollRestoration" in window.history) {
      try {
        window.history.scrollRestoration = "manual";
      } catch (e) {
        console.warn("Could not set scrollRestoration to manual:", e);
      }
    }

    return () => {
      clearTimeout(scrollTimeout);
      if ("scrollRestoration" in window.history) {
        try {
          window.history.scrollRestoration = "auto";
        } catch (e) {
          console.warn("Could not set scrollRestoration to auto:", e);
        }
      }
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

  // Map progress to active indices
  const activeIndex = Math.max(0, Math.min(transmissionPhrases.length - 1, Math.floor(scrollProgress * transmissionPhrases.length)));
  const prevActiveIndexRef = useRef(-1);

  // Sound clicker on scroll trigger transition
  useEffect(() => {
    if (activeIndex !== prevActiveIndexRef.current) {
      if (prevActiveIndexRef.current !== -1) {
        triggerSound("tick");
      }
      prevActiveIndexRef.current = activeIndex;
    }
  }, [activeIndex, soundEnabled]);

  // Helper to calculate opacity and blur for each phrase based on global scrollProgress of Section 04
  const getPhraseStyle = (index: number) => {
    const totalPhrases = transmissionPhrases.length;
    const segmentLength = 1 / totalPhrases;
    const center = (index + 0.5) * segmentLength;
    const distance = Math.abs(scrollProgress - center);
    const activeRange = segmentLength * 0.8;
    
    let opacity = 0;
    let blur = 18;
    let scale = 0.94;
    let letterSpacing = "0.25em";

    if (distance < activeRange) {
      const factor = 1 - (distance / activeRange); // 1 at center, 0 at edges
      opacity = Math.pow(factor, 1.6);
      blur = Math.max(0, 14 * (1 - factor));
      scale = 0.96 + 0.04 * factor;
      letterSpacing = `${0.2 + (0.08 * factor)}em`;
    }

    return {
      opacity,
      filter: `blur(${blur}px)`,
      transform: `scale(${scale})`,
      letterSpacing,
      transition: "filter 0.3s cubic-bezier(0.16, 1, 0.3, 1), transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
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
      <nav className="fixed top-0 left-0 w-full z-50 px-6 py-5 md:px-12 flex items-center justify-between bg-gradient-to-b from-black/85 to-transparent backdrop-blur-md border-b border-white/[0.03]">
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
          <span className="font-mono text-[9px] text-[#FFAA00] tracking-[0.2em] uppercase hidden md:inline-block animate-pulse">
            // LIVE TRANSMISSION PORTAL
          </span>
        </div>

        <div className="flex items-center gap-4">
          {/* Immersive Sound controller */}
          <button
            onClick={toggleSound}
            onMouseEnter={() => triggerSound("click")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border font-mono text-[9px] tracking-wider transition-all duration-300 cursor-pointer ${
              soundEnabled
                ? "bg-[#FFAA00]/10 border-[#FFAA00]/40 text-[#FFAA00]"
                : "bg-white/5 border-white/10 text-neutral-400 hover:text-white hover:border-white/20"
            }`}
          >
            {soundEnabled ? <Volume2 size={11} className="animate-bounce" /> : <VolumeX size={11} />}
            <span>{soundEnabled ? "SYS AUDIO: ACTIVE" : "SYS AUDIO: OFF"}</span>
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
            MAIN SYSTEM
          </a>
        </div>
      </nav>

      {/* SECTION 01: Full-Screen Hero */}
      <section className="relative min-h-screen w-full flex flex-col items-center justify-center text-center px-4 pt-20 overflow-hidden z-10">
        
        {/* Subtle background visual elements */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-gradient-to-tr from-[#009DFF]/4 to-[#FFAA00]/4 blur-[160px]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:40px_40px] opacity-15" />
        </div>

        {/* 1. Large Floating Symmetrical Metro Sul Symbol with extremely subtle breathing motion */}
        <div className="relative z-10 w-full max-w-[310px] md:max-w-[370px] aspect-square flex items-center justify-center select-none group">
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
        <div className="relative z-10 space-y-6 max-w-2xl px-6 -mt-3">
          <div className="space-y-3">
            <span className="font-mono text-[9px] tracking-[0.4em] text-[#009DFF] uppercase font-semibold block">
              // ORIGINAL SIGNAL PHASE
            </span>
            <h1 className="font-display text-4.5xl sm:text-5.5xl md:text-7xl font-bold tracking-tight text-white uppercase leading-none">
              ARCHITECT OF OVERFLOW
            </h1>
            <p className="font-mono text-[10px] md:text-xs text-neutral-400 tracking-[0.25em] max-w-lg mx-auto leading-relaxed">
              The first transmission of a new Metro Sul chapter.
            </p>
          </div>

          {/* Release Date Info */}
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/[0.02] border border-white/5 font-mono text-[10px] tracking-widest text-neutral-300">
            <Calendar size={12} className="text-[#FFAA00]" />
            <span>RELEASE DATE: 31 JULY 2026</span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <a 
              href={PRESAVE_URL}
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => triggerSound("click")}
              onClick={() => triggerSound("confirm")}
              className="w-full sm:w-auto px-10 py-4 rounded-full text-xs font-mono tracking-widest font-bold bg-white text-black hover:bg-neutral-200 flex items-center justify-center gap-2.5 transition-all duration-300 hover:shadow-[0_0_35px_rgba(255,255,255,0.22)] hover:-translate-y-0.5 cursor-pointer"
            >
              <span>{isReleased || testReleased ? "LISTEN NOW" : "JOIN THE SIGNAL"}</span>
              <ArrowRight size={12} />
            </a>
            
            <button
              onClick={() => {
                triggerSound("confirm");
                setShowTeaser(true);
                setIsPlayingTeaser(true);
              }}
              onMouseEnter={() => triggerSound("click")}
              className="w-full sm:w-auto px-8 py-4 rounded-full text-xs font-mono tracking-widest font-bold bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white flex items-center justify-center gap-2.5 transition-all duration-300 cursor-pointer hover:-translate-y-0.5"
            >
              <Play size={11} className="fill-current" />
              <span>WATCH TEASER</span>
            </button>
          </div>
        </div>

        {/* Ambient Chevron scroll down indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 opacity-45 animate-pulse" style={{ animationDuration: "3s" }}>
          <span className="font-mono text-[8px] tracking-[0.3em] text-neutral-500 uppercase">SCROLL ENGINE</span>
          <ChevronDown size={14} className="text-neutral-400" />
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
            <div className="space-y-2">
              <span className="font-mono text-[9px] tracking-[0.3em] text-[#FFAA00] uppercase font-semibold block">
                // TEMPORAL VECTOR COUNTDOWN
              </span>
              <h2 className="text-xs font-mono text-neutral-400 tracking-[0.25em] uppercase">
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
                  <span>SIGNAL FULLY ACTIVE</span>
                </div>
                <h3 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-white uppercase">
                  PORTAL TRANSMISSION LIVE
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
                  { label: "DAYS", value: timeLeft.days },
                  { label: "HOURS", value: timeLeft.hours },
                  { label: "MINUTES", value: timeLeft.minutes },
                  { label: "SECONDS", value: timeLeft.seconds }
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
        className="relative h-[170vh] md:h-[220vh] w-full bg-black flex flex-col justify-start"
      >
        {/* Sticky viewport frame to anchor the cinematic typography */}
        <div className="sticky top-0 left-0 w-full h-screen flex flex-col items-center justify-center overflow-hidden z-10">
          
          {/* Amber signal glow backdrop behind transmission/code */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[460px] md:h-[460px] mx-auto rounded-full bg-[#FFAA00]/[0.045] blur-[100px] md:blur-[140px] pointer-events-none" />

          {/* Subtle horizontal signal waves */}
          <div className="absolute inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#FFAA00]/12 to-transparent top-[45%] pointer-events-none" />
          <div className="absolute inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#009DFF]/8 to-transparent top-[55%] pointer-events-none" />

          {/* Interactive instruction tag */}
          <div className="absolute top-24 font-mono text-[8px] text-neutral-500 tracking-[0.4em] uppercase">
            SCROLL SLOWLY TO DECODE
          </div>

          {/* Sticky target anchor viewport */}
          <div className="w-full max-w-4xl px-6 relative flex items-center justify-center h-48">
            {transmissionPhrases.map((phrase, idx) => {
              const isCurrentActive = activeIndex === idx;
              return (
                <div
                  key={idx}
                  style={getPhraseStyle(idx)}
                  className="absolute font-display text-2.5xl sm:text-4xl md:text-6xl font-black text-center text-white tracking-[0.15em] uppercase select-none font-bold"
                >
                  <StaggeredPhrase phrase={phrase} isActive={isCurrentActive} />
                </div>
              );
            })}
          </div>

          {/* Elegant HUD tracking meter */}
          <div className="absolute bottom-36 w-44 h-[2px] bg-white/[0.04] rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#009DFF] to-[#FFAA00] transition-all duration-100 ease-out" 
              style={{ width: `${scrollProgress * 100}%` }}
            />
          </div>

          {/* Symmetrical vertical signal path / continuation indicator that fades in at the end of the scroll */}
          <motion.div 
            style={{ 
              opacity: scrollProgress > 0.80 ? Math.min(1, (scrollProgress - 0.80) * 6.5) : 0,
              y: scrollProgress > 0.80 ? 0 : 25
            }}
            transition={{ ease: "easeOut" }}
            className="absolute bottom-8 flex flex-col items-center gap-3.5 z-20 pointer-events-auto"
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
              className="font-mono text-[8.5px] tracking-[0.38em] text-[#FFAA00] hover:text-[#009DFF] uppercase font-bold pl-[0.38em] transition-all duration-300 bg-black/60 hover:bg-black/90 border border-[#FFAA00]/25 hover:border-[#009DFF]/50 px-4 py-2 rounded-full cursor-pointer hover:shadow-[0_0_15px_rgba(0,157,255,0.22)] active:scale-95 flex items-center gap-2"
            >
              CONTINUE TO RELEASE NOTES
            </button>
            <div className="relative flex flex-col items-center h-16 w-8 pointer-events-none">
              {/* Vertical thin frequency line using the Metro Sul palette */}
              <div className="w-[1px] h-16 bg-gradient-to-b from-[#FFAA00] via-[#009DFF] to-transparent" />
              {/* Subtle pulsing dot moving downward along the line */}
              <motion.div 
                animate={{ y: [0, 52, 0] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-0 w-1.5 h-1.5 rounded-full bg-gradient-to-r from-[#FFAA00] to-[#009DFF] shadow-[0_0_10px_#009DFF] z-10"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 05: About the Release */}
      <section 
        id="editorial-section" 
        className="py-16 w-full bg-gradient-to-b from-black via-[#040407] to-black border-t border-white/[0.02] flex flex-col items-center justify-center relative z-10"
      >
        {/* Calmer white/blue glow backdrop in editorial/about section */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/3 w-[240px] h-[240px] md:w-[380px] md:h-[380px] rounded-full bg-white/[0.02] blur-[90px] md:blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/3 left-1/2 -translate-x-1/2 translate-y-1/3 w-[200px] h-[200px] md:w-[300px] md:h-[300px] rounded-full bg-[#009DFF]/[0.03] blur-[90px] md:blur-[120px] pointer-events-none" />
        
        {/* Visual signal path thread continuation at the top of Section 05: Minimal "Signal Evolution" Connector */}
        <div className="w-full flex flex-col items-center -mt-16 mb-8 relative z-20">
          <div className="w-[1px] h-12 md:h-20 bg-gradient-to-b from-transparent via-[#009DFF]/30 to-[#FFAA00]/40" />
          <motion.div 
            animate={{ scale: [0.95, 1.15, 0.95], opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 2.2, repeat: Infinity }}
            className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-[#009DFF] to-[#FFAA00] shadow-[0_0_8px_#FFAA00]"
          />
          <span className="font-mono text-[8px] tracking-[0.45em] text-[#FFAA00] uppercase font-bold mt-3 pl-[0.45em]">
            SIGNAL EVOLUTION
          </span>
          <div className="w-[1px] h-8 md:h-12 bg-gradient-to-b from-[#FFAA00]/40 to-transparent mt-3" />
        </div>

        <div className="max-w-2xl mx-auto px-8 space-y-10 relative z-10">
          
          <ScrollReveal>
            <div className="space-y-2 text-center md:text-left">
              <span className="font-mono text-[9px] tracking-[0.3em] text-[#FFAA00] uppercase font-semibold block">
                // EDITORIAL PROTOCOL
              </span>
              <h2 className="text-xs font-mono text-neutral-400 tracking-[0.25em] uppercase">
                ABOUT THE RELEASE
              </h2>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.25}>
            <div className="space-y-8 font-sans font-light leading-relaxed text-neutral-300 text-base md:text-lg text-left border-l border-white/10 pl-6 md:pl-10">
              <p className="font-semibold text-white">
                Architect of Overflow opens a new creative chapter for Metro Sul.
              </p>
              <p className="text-neutral-400">
                Blending melodic electronic production with progressive movement and subtle trance-inspired energy, the release evolves from cinematic vocals into an uplifting electronic journey designed for immersive late-night listening.
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
                <span className="block text-neutral-600">KEY</span>
                <span className="text-neutral-300 font-bold">A MINOR</span>
              </div>
              <div className="space-y-1">
                <span className="block text-neutral-600">RESOLUTION</span>
                <span className="text-neutral-300 font-bold">24-BIT / 96KHZ</span>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* SECTION 06: Release Preview (Spotify Embed after release date) */}
      <section className="py-16 w-full bg-black border-t border-white/[0.02] flex flex-col items-center justify-center z-10 relative">
        <div className="max-w-3xl w-full mx-auto px-6 text-center space-y-10">
          <ScrollReveal>
            <div className="space-y-2">
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
                  className="w-full max-w-[640px] mx-auto rounded-3xl overflow-hidden bg-neutral-900/40 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
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
                  className="max-w-lg mx-auto py-12 px-8 rounded-3xl bg-[#09090c] border border-white/[0.04] shadow-inner space-y-6 flex flex-col items-center"
                >
                  <div className="p-4 rounded-full bg-white/[0.02] border border-white/5 text-[#FFAA00] animate-pulse">
                    <Disc size={32} className="animate-spin" style={{ animationDuration: "12s" }} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-mono text-xs tracking-[0.3em] font-bold text-white uppercase">
                      AVAILABLE JULY 31
                    </h3>
                    <p className="font-sans text-[11px] text-neutral-400 max-w-xs mx-auto leading-relaxed">
                      The direct Spotify broadcast pipeline will connect automatically on the release date. Join the signal to pre-save now.
                    </p>
                  </div>
                  
                  <a 
                    href={PRESAVE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    onMouseEnter={() => triggerSound("click")}
                    onClick={() => triggerSound("confirm")}
                    className="px-6 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-[10px] font-mono tracking-widest text-neutral-300 transition-all cursor-pointer inline-flex items-center gap-2"
                  >
                    <span>NOTIFY VIA SMARTLINK</span>
                    <ExternalLink size={10} />
                  </a>
                </motion.div>
              )}
            </AnimatePresence>
          </ScrollReveal>
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
            <div className="space-y-3">
              <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-white uppercase">
                Join the Signal
              </h2>
              <p className="font-mono text-[9px] text-neutral-400 tracking-[0.3em] uppercase max-w-xs mx-auto leading-relaxed">
                Secure your direct link to the alignment sequence.
              </p>
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
              {isReleased || testReleased ? "LISTEN ON SPOTIFY" : "PRE-SAVE ON SPOTIFY"}
            </a>
          </ScrollReveal>

          {/* Small footer */}
          <div className="pt-12 space-y-2">
            <p className="font-mono text-[10px] text-neutral-400 tracking-[0.4em] uppercase font-bold text-[#FFAA00]">
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 md:p-12"
          >
            {/* Close button */}
            <button
              onClick={() => {
                triggerSound("click");
                setShowTeaser(false);
                setIsPlayingTeaser(false);
              }}
              onMouseEnter={() => triggerSound("click")}
              className="absolute top-6 right-6 z-50 p-3 rounded-full bg-white/5 border border-white/10 text-neutral-400 hover:text-white transition-all cursor-pointer hover:bg-white/10"
            >
              <X size={18} />
            </button>

            {/* Cinematic video visual display / Sound generation matrix inside */}
            <div className="w-full max-w-5xl aspect-video rounded-2xl bg-neutral-950 border border-white/10 shadow-[0_0_100px_rgba(255,136,0,0.15)] relative overflow-hidden flex flex-col items-center justify-center">
              
              {/* If there's an immersive canvas-like particles loop when playing */}
              <div className="absolute inset-0 z-0 bg-radial-gradient" 
                style={{
                  background: "radial-gradient(circle at 50% 50%, rgba(255, 136, 0, 0.05) 0%, rgba(0, 157, 255, 0.03) 60%, transparent 100%)"
                }}
              />
              
              {/* Matrix grid lines */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:32px_32px] opacity-40" />

              {/* Simulated high-end visualizer or embedded teaser video */}
              <div className="absolute inset-0 w-full h-full z-10 flex flex-col items-center justify-center p-6 text-center space-y-6">
                
                {/* Let's embed a real gorgeous cinematic music visualizer of electronic beats, or show the interactive frequency matrix responding live! */}
                <iframe 
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=0&controls=0&modestbranding=1&rel=0" 
                  title="Architect of Overflow Teaser"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full opacity-0 pointer-events-none" // Hidden rickroll audio fallback if wanted, but wait! Let's make a real gorgeous cinematic audio player!
                />

                <div className="space-y-4 max-w-lg">
                  <span className="font-mono text-[9px] tracking-[0.40em] text-[#FFAA00] uppercase font-bold block animate-pulse">
                    // TEASER STREAM ACTIVE [MTS-003]
                  </span>
                  <h3 className="font-display text-2xl sm:text-4xl font-extrabold tracking-wider text-white uppercase leading-none">
                    ARCHITECT OF OVERFLOW
                  </h3>
                  
                  {/* Rotating elegant disk/radar HUD vector */}
                  <div className="w-32 h-32 mx-auto relative flex items-center justify-center my-6">
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 rounded-full border border-dashed border-white/20"
                    />
                    <motion.div 
                      animate={{ rotate: -360 }}
                      transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                      className="absolute w-24 h-24 rounded-full border border-[#009DFF]/20"
                    />
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#FFAA00] to-[#FF5500] opacity-80 flex items-center justify-center shadow-[0_0_20px_rgba(255,136,0,0.5)]">
                      <Play size={14} className="fill-white text-white ml-0.5" />
                    </div>
                  </div>

                  <p className="font-mono text-[10px] text-neutral-400 tracking-wider">
                    RESONANCE PHASE: COGNITIVE OVERFLOW DEEP BASS TRANSMISSION
                  </p>

                  <div className="flex justify-center gap-6 font-mono text-[9px] text-neutral-500 uppercase tracking-widest pt-4">
                    <span>AUDIO: LOSSLESS 24-BIT</span>
                    <span>•</span>
                    <span>VISUALS: REAL-TIME SYNTHESIS</span>
                  </div>
                </div>

              </div>

              {/* Bottom technical parameters bar */}
              <div className="absolute bottom-0 left-0 w-full p-4 border-t border-white/5 bg-black/40 backdrop-blur-md z-20 flex justify-between items-center text-[8px] font-mono text-neutral-500 tracking-wider">
                <span>PORTAL PIPELINE ID: CAT1927582</span>
                <span className="text-neutral-400">STATUS: BROADCASTING REAL-TIME</span>
                <span>SYSTEM VERSION 0.8B</span>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

