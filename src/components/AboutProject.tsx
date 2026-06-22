import { Cpu, Zap, Eye, Disc, Terminal, Shield, Workflow, Layers, ChevronRight, Activity, ShieldAlert, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";

interface SpecsItem {
  label: string;
  value: string;
  category: string;
}

const METRO_SPECS: SpecsItem[] = [
  { label: "Core Synthesis", value: "Eurorack Semi-Modular Loops", category: "Hardware" },
  { label: "Mastering Level", value: "Dynamic -14 LUFS Clean Analog Desk", category: "Signal" },
  { label: "Temporal Tempo", value: "125 BPM — 138 BPM Modular Shifts", category: "Timing" },
  { label: "Space Modulators", value: "Binaural Stereo Delay (Chronos Loop)", category: "Acoustics" },
  { label: "Vocal Sub-layers", value: "Laser-Processed Formants & Noise", category: "Synthesis" },
  { label: "Visual Identity", value: "Bioluminescent Dark Cybernetics", category: "Aesthetics" }
];

// Helper to translate colors safely to rgba for custom chromatic aberration text shadows
function hexToRgba(colorStr: string, alpha: number): string {
  if (!colorStr) return `rgba(255, 255, 255, ${alpha})`;
  const trimmed = colorStr.trim();
  if (trimmed.startsWith("rgba")) {
    return trimmed.substring(0, trimmed.lastIndexOf(",")) + `, ${alpha})`;
  }
  if (trimmed.startsWith("rgb")) {
    return trimmed.replace("rgb", "rgba").replace(")", `, ${alpha})`);
  }
  
  let hex = trimmed.replace("#", "");
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  const num = parseInt(hex, 16);
  if (isNaN(num)) return `rgba(255, 255, 255, ${alpha})`;
  
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// ScramblerWord sub-component that glitches text on hover, click, or global signal events.
function ScramblerWord({ 
  children, 
  globalTriggerId, 
  scrambleChance = 0.25 
}: { 
  children: string; 
  globalTriggerId: number; 
  scrambleChance?: number; 
}) {
  const [displayText, setDisplayText] = useState(children);
  const [isGlitching, setIsGlitching] = useState(false);
  const [hovered, setHovered] = useState(false);

  const performGlitch = () => {
    if (isGlitching) return;
    setIsGlitching(true);
    let iterations = 0;
    const original = children;
    const glitchChars = "XØ█▓▒░¶§%!@#$^*()_-+=<>?/[]{}";

    const interval = setInterval(() => {
      setDisplayText(
        original
          .split("")
          .map((char, index) => {
            if (char === " ") return " ";
            // Gradually transition back to original text
            if (index < iterations - 2) {
              return original[index];
            }
            if (Math.random() < 0.45) {
              return glitchChars[Math.floor(Math.random() * glitchChars.length)];
            }
            return char;
          })
          .join("")
      );

      iterations += 0.82;
      if (iterations >= original.length + 3) {
        clearInterval(interval);
        setDisplayText(original);
        setIsGlitching(false);
      }
    }, 30);
  };

  // Trigger based on global signal destabilization
  useEffect(() => {
    if (globalTriggerId > 0 && Math.random() < scrambleChance) {
      // Small staggered timeout to look organic
      const timer = setTimeout(performGlitch, Math.random() * 400);
      return () => clearTimeout(timer);
    }
  }, [globalTriggerId]);

  return (
    <span
      onMouseEnter={() => {
        setHovered(true);
        performGlitch();
      }}
      onMouseLeave={() => setHovered(false)}
      onClick={performGlitch}
      className={`inline-block cursor-pointer font-medium transition-all duration-150 decoration-cyan-400/40 relative select-all selection:bg-cyan-400 selection:text-black ${
        hovered 
          ? "text-cyan-400 scale-[1.02] border-b border-cyan-500/30" 
          : "text-neutral-200 border-b border-transparent hover:text-cyan-300"
      }`}
      style={{
        textShadow: hovered 
          ? `0 0 8px rgba(0,240,255,0.6), -1.5px 0 #ff455b, 1.5px 0 #7000ff` 
          : "none"
      }}
    >
      {displayText}
    </span>
  );
}

export default function AboutProject() {
  const [globalTriggerId, setGlobalTriggerId] = useState(0);
  const [signalState, setSignalState] = useState<"STABLE" | "DEGRADED" | "CRITICAL">("STABLE");
  const [integrityPercent, setIntegrityPercent] = useState(100);

  const destabilizeSignal = () => {
    setGlobalTriggerId(prev => prev + 1);
    
    // Cycle signal state with randomized text structural decay
    if (signalState === "STABLE") {
      setSignalState("DEGRADED");
      setIntegrityPercent(64);
    } else if (signalState === "DEGRADED") {
      setSignalState("CRITICAL");
      setIntegrityPercent(27);
    } else {
      setSignalState("STABLE");
      setIntegrityPercent(100);
    }
  };

  const resetSignal = () => {
    setGlobalTriggerId(prev => prev + 1);
    setSignalState("STABLE");
    setIntegrityPercent(100);
  };

  return (
    <div className="relative w-full z-10 space-y-12">
      
      {/* Narrative grid row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left side: short, high-impact intro statement & Signal Simulator Deck */}
        <div className="lg:col-span-5 space-y-5">
          <div className="flex items-center gap-2">
            <span className="h-[1px] w-8 bg-neon-blue" />
            <span className="font-mono text-xs tracking-wider text-neon-blue uppercase">METRO SUL MANIFESTO</span>
          </div>
          
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white tracking-tight leading-tight uppercase">
            Sonic architectures constructed for the deep cybernetic underground.
          </h2>

          {/* Interactive Controller Deck */}
          <div className="p-5 rounded-lg border border-white/10 bg-neutral-950/70 backdrop-blur-md space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.04] pb-2">
              <span className="font-mono text-[9px] text-neutral-400 block tracking-widest">
                SIGNAL INTERFERENCE CONSOLE
              </span>
              <span className="flex items-center gap-1.5 font-mono text-[8px]">
                <span className={`h-1.5 w-1.5 rounded-full ${
                  signalState === "STABLE" ? "bg-green-500 animate-pulse" :
                  signalState === "DEGRADED" ? "bg-amber-500 animate-ping" : "bg-red-500 animate-ping"
                }`} />
                {signalState}
              </span>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-neutral-400">DATA_INTEGRITY</span>
                <span className={`${
                  integrityPercent > 80 ? "text-[#00f0ff]" :
                  integrityPercent > 40 ? "text-amber-400" : "text-red-500 font-bold"
                }`}>
                  {integrityPercent}% {integrityPercent < 100 && "// COMPROMISED"}
                </span>
              </div>
              <div className="h-1.5 w-full bg-neutral-900 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: "100%" }}
                  animate={{ width: `${integrityPercent}%` }}
                  transition={{ type: "spring", stiffness: 100 }}
                  className={`h-full ${
                    integrityPercent > 80 ? "bg-gradient-to-r from-cyan-500 to-indigo-500" :
                    integrityPercent > 40 ? "bg-amber-500" : "bg-red-500"
                  }`}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={destabilizeSignal}
                className="px-3 py-2 rounded border border-white/10 hover:border-white/20 bg-neutral-900/60 hover:bg-neutral-900 text-[10px] font-mono tracking-widest text-white transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Activity size={10} className="text-cyan-400 animate-pulse" />
                DEGRADE SIGNAL
              </button>
              
              <button
                onClick={resetSignal}
                className="px-3 py-2 rounded border border-white/10 hover:border-white/20 bg-[#00f0ff]/5 hover:bg-[#00f0ff]/10 text-[10px] font-mono tracking-widest text-[#00f0ff] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RotateCcw size={10} />
                RESET MATRIX
              </button>
            </div>

            <div className="text-[9px] font-mono text-neutral-500 text-center leading-relaxed">
              *Interactive: Hover or click words in the bio panel to manifest manual decryption glitches and chromatic aberrations.
            </div>
          </div>
        </div>

        {/* Right side: Detailed bio copy with immersive word scramble units */}
        <div className="lg:col-span-7 space-y-6 font-sans text-sm text-neutral-400 leading-relaxed md:pt-4 selection:bg-[#00f0ff] selection:text-black">
          <p className="border-l-2 border-white/5 pl-4 py-1">
            <strong className="text-white font-medium select-none">
              <ScramblerWord globalTriggerId={globalTriggerId} scrambleChance={0.9}>Metro Sul</ScramblerWord>
            </strong> is an experimental international electronic music project exploring the micro-thresholds where{" "}
            <ScramblerWord globalTriggerId={globalTriggerId} scrambleChance={0.4}>organic lifeforms</ScramblerWord> collide with{" "}
            <ScramblerWord globalTriggerId={globalTriggerId} scrambleChance={0.5}>sterile machine algorithms</ScramblerWord>. Fusing deep{" "}
            <ScramblerWord globalTriggerId={globalTriggerId} scrambleChance={0.35}>modular techno</ScramblerWord>, high-contrast{" "}
            <ScramblerWord globalTriggerId={globalTriggerId} scrambleChance={0.45}>sub-bass modulations</ScramblerWord>, and cinematic deep-space atmospheres, the core system hosts an{" "}
            <ScramblerWord globalTriggerId={globalTriggerId} scrambleChance={0.3}>auditory bridge</ScramblerWord> between pure{" "}
            <ScramblerWord globalTriggerId={globalTriggerId} scrambleChance={0.2}>digital code</ScramblerWord> and{" "}
            <ScramblerWord globalTriggerId={globalTriggerId} scrambleChance={0.5}>biological gravity cells</ScramblerWord>.
          </p>
          <p className="border-l-2 border-white/5 pl-4 py-1">
            Rooted in minimalist{" "}
            <ScramblerWord globalTriggerId={globalTriggerId} scrambleChance={0.4}>dark aesthetics</ScramblerWord> and highly spatialized{" "}
            <ScramblerWord globalTriggerId={globalTriggerId} scrambleChance={0.3}>multiphonic acoustics</ScramblerWord>, the project rejects standard commercial hooks in favor of{" "}
            <ScramblerWord globalTriggerId={globalTriggerId} scrambleChance={0.5}>progressive structural loops</ScramblerWord>. Every wave is crafted to examine physical constraints:{" "}
            <ScramblerWord globalTriggerId={globalTriggerId} scrambleChance={0.4}>weightless atmospheric drift</ScramblerWord>, kinetic machine friction, and the relentless{" "}
            <ScramblerWord globalTriggerId={globalTriggerId} scrambleChance={0.45}>nature of temporal metrics</ScramblerWord> as expressed through{" "}
            <ScramblerWord globalTriggerId={globalTriggerId} scrambleChance={0.35}>linear clock oscillations</ScramblerWord> versus{" "}
            <ScramblerWord globalTriggerId={globalTriggerId} scrambleChance={0.5}>frames of electronic suspension</ScramblerWord>.
          </p>
          <p className="border-l-2 border-white/5 pl-4 py-1">
            Through absolute focus on{" "}
            <ScramblerWord globalTriggerId={globalTriggerId} scrambleChance={0.3}>acoustic engineering</ScramblerWord> standards, Metro Sul manifests an interactive sensory terrain where synthesizers aren&apos;t simply activated—they are{" "}
            <ScramblerWord globalTriggerId={globalTriggerId} scrambleChance={0.7}>warped</ScramblerWord>,{" "}
            <ScramblerWord globalTriggerId={globalTriggerId} scrambleChance={0.7}>distorted</ScramblerWord>, and{" "}
            <ScramblerWord globalTriggerId={globalTriggerId} scrambleChance={0.6}>modularly pressurized</ScramblerWord> to redefine deep electronic spatial storytelling.
          </p>
        </div>

      </div>

      {/* Futuristic Spec Sheet / Grid Blocks */}
      <div className="border border-white/10 rounded-lg bg-[#070709]/80 backdrop-blur-md p-6 md:p-8">
        <div className="flex items-center gap-2 mb-6 pb-4 border-b border-white/5">
          <Terminal size={14} className="text-neon-blue" />
          <h3 className="font-mono text-xs font-semibold tracking-widest text-[#00f0ff]">
            SYSTEM_SPECIFICATION // SIGNAL_SPECTRUM
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {METRO_SPECS.map((spec, i) => (
            <div 
              key={i}
              className="p-4 rounded-md bg-neutral-950/40 border border-white/5 hover:border-white/15 hover:bg-neutral-900/10 transition-all flex flex-col justify-between group cursor-pointer"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[9px] uppercase tracking-widest text-neutral-500">
                  {spec.category}
                </span>
                <span className="h-1 w-1 rounded-full bg-neutral-800 group-hover:bg-cyan-400 transition-colors" />
              </div>
              
              <h4 className="font-mono text-[10px] text-neutral-400 mb-1 uppercase tracking-wider">
                {spec.label}
              </h4>
              <p className="font-mono text-xs text-white font-medium">
                {spec.value}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

