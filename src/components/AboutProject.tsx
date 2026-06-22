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

export default function AboutProject({ lang }: { lang: "en" | "pt" | "es" }) {
  const [globalTriggerId, setGlobalTriggerId] = useState(0);
  const [signalState, setSignalState] = useState<"STABLE" | "DEGRADED" | "CRITICAL" | "ESTÁVEL" | "DEGRADADO" | "CRÍTICO">(
    lang === "pt" ? "ESTÁVEL" : lang === "es" ? "ESTABLE" : "STABLE"
  );
  const [integrityPercent, setIntegrityPercent] = useState(100);

  // Sync state placeholder to active language
  useEffect(() => {
    if (lang === "pt") {
      setSignalState(integrityPercent === 100 ? "ESTÁVEL" : integrityPercent > 40 ? "DEGRADADO" : "CRÍTICO");
    } else if (lang === "es") {
      setSignalState(integrityPercent === 100 ? "ESTABLE" : integrityPercent > 40 ? "DEGRADADO" : "CRÍTICO");
    } else {
      setSignalState(integrityPercent === 100 ? "STABLE" : integrityPercent > 40 ? "DEGRADED" : "CRITICAL");
    }
  }, [lang, integrityPercent]);

  const destabilizeSignal = () => {
    setGlobalTriggerId(prev => prev + 1);
    
    if (integrityPercent === 100) {
      setIntegrityPercent(64);
    } else if (integrityPercent === 64) {
      setIntegrityPercent(27);
    } else {
      setIntegrityPercent(100);
    }
  };

  const resetSignal = () => {
    setGlobalTriggerId(prev => prev + 1);
    setIntegrityPercent(100);
  };

  const getMetroSpecs = () => [
    { 
      label: lang === "pt" ? "Síntese Principal" : lang === "es" ? "Síntesis Núcleo" : "Core Synthesis", 
      value: lang === "pt" ? "Loops Semi-Modulares Eurorack" : lang === "es" ? "Bucles Semimodulares Eurorack" : "Eurorack Semi-Modular Loops", 
      category: lang === "pt" ? "Hardware" : lang === "es" ? "Hardware" : "Hardware" 
    },
    { 
      label: lang === "pt" ? "Nível de Masterização" : lang === "es" ? "Nivel de Masterización" : "Mastering Level", 
      value: lang === "pt" ? "Mesa Analógica Limpa Dinâmica -14 LUFS" : lang === "es" ? "Consola Analógica Limpia Dinámica -14 LUFS" : "Dynamic -14 LUFS Clean Analog Desk", 
      category: lang === "pt" ? "Sinal" : lang === "es" ? "Señal" : "Signal" 
    },
    { 
      label: lang === "pt" ? "Tempo Temporal" : lang === "es" ? "Tempo Temporal" : "Temporal Tempo", 
      value: lang === "pt" ? "Alterações Modulares de 125 BPM — 138 BPM" : lang === "es" ? "Cambios Modulares de 125 BPM — 138 BPM" : "125 BPM — 138 BPM Modular Shifts", 
      category: lang === "pt" ? "Medição" : lang === "es" ? "Alineación" : "Timing" 
    },
    { 
      label: lang === "pt" ? "Moduladores Espaciais" : lang === "es" ? "Moduladores Espaciales" : "Space Modulators", 
      value: lang === "pt" ? "Delay Estéreo Binaural (Chronos Loop)" : lang === "es" ? "Retraso Estéreo Binaural (Bucle Chronos)" : "Binaural Stereo Delay (Chronos Loop)", 
      category: lang === "pt" ? "Acústica" : lang === "es" ? "Acústica" : "Acoustics" 
    },
    { 
      label: lang === "pt" ? "Subcamadas Vocais" : lang === "es" ? "Subcapas Vocales" : "Vocal Sub-layers", 
      value: lang === "pt" ? "Formantes e Ruído Processados a Laser" : lang === "es" ? "Formantes y Ruido Procesados con Láser" : "Laser-Processed Formants & Noise", 
      category: lang === "pt" ? "Síntese" : lang === "es" ? "Síntesis" : "Synthesis" 
    },
    { 
      label: lang === "pt" ? "Identidade Visual" : lang === "es" ? "Identidad Visual" : "Visual Identity", 
      value: lang === "pt" ? "Cibernética Dark Bioluminescente" : lang === "es" ? "Cibernética Oscura Bioluminiscente" : "Bioluminescent Dark Cybernetics", 
      category: lang === "pt" ? "Estética" : lang === "es" ? "Estética" : "Aesthetics" 
    }
  ];

  return (
    <div className="relative w-full z-10 space-y-12">
      
      {/* Narrative grid row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left side: short, high-impact intro statement & Signal Simulator Deck */}
        <div className="lg:col-span-5 space-y-5">
          <div className="flex items-center gap-2">
            <span className="h-[1px] w-8 bg-neon-blue" />
            <span className="font-mono text-xs tracking-wider text-neon-blue uppercase">
              {lang === "pt" ? "MANIFESTO METRO SUL" : lang === "es" ? "MANIFESTO METRO SUL" : "METRO SUL MANIFESTO"}
            </span>
          </div>
          
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white tracking-tight leading-tight uppercase">
            {lang === "pt" 
              ? "Cenários sonoros eletrônicos minimalistas desenhados para espaços imersivos." 
              : lang === "es" 
              ? "Paisajes sonoros electrónicos minimalistas diseñados para espacios inmersivos." 
              : "Minimalist electronic soundscapes designed for immersive spaces."}
          </h2>

          {/* Interactive Controller Deck */}
          <div className="p-5 rounded-lg border border-white/10 bg-neutral-950/70 backdrop-blur-md space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.04] pb-2">
              <span className="font-mono text-[9px] text-neutral-400 block tracking-widest">
                {lang === "pt" ? "CONSOLETE DE INTERFERÊNCIA DE SINAL" : lang === "es" ? "CONSOLA DE INTERFERENCIA DE SEÑAL" : "SIGNAL INTERFERENCE CONSOLE"}
              </span>
              <span className="flex items-center gap-1.5 font-mono text-[8px]">
                <span className={`h-1.5 w-1.5 rounded-full ${
                  integrityPercent === 100 ? "bg-green-500 animate-pulse" :
                  integrityPercent > 40 ? "bg-amber-500 animate-ping" : "bg-red-500 animate-ping"
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
                  {integrityPercent}% {integrityPercent < 100 && (lang === "pt" ? "// COMPROMETIDA" : lang === "es" ? "// COMPROMETIDA" : "// COMPROMISED")}
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
                {lang === "pt" ? "DESESTABILIZAR" : lang === "es" ? "DESESTABILIZAR" : "DEGRADE SIGNAL"}
              </button>
              
              <button
                onClick={resetSignal}
                className="px-3 py-2 rounded border border-white/10 hover:border-white/20 bg-[#00f0ff]/5 hover:bg-[#00f0ff]/10 text-[10px] font-mono tracking-widest text-[#00f0ff] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RotateCcw size={10} />
                {lang === "pt" ? "REINICIAR" : lang === "es" ? "REINICIAR" : "RESET MATRIX"}
              </button>
            </div>

            <div className="text-[9px] font-mono text-neutral-500 text-center leading-relaxed">
              {lang === "pt" 
                ? "*Interativo: Passe o mouse ou clique nas palavras do painel de bio para manifestar falhas manuais de descriptografia." 
                : lang === "es" 
                ? "*Interactivo: Pase el cursor u oprima las palabras para manifestar distorsiones de descifrado manual." 
                : "*Interactive: Hover or click words in the bio panel to manifest manual decryption glitches."}
            </div>
          </div>
        </div>

        {/* Right side: Detailed bio copy with immersive word scramble units */}
        <div className="lg:col-span-7 space-y-6 font-sans text-sm text-neutral-400 leading-relaxed md:pt-4 selection:bg-[#00f0ff] selection:text-black">
          {lang === "pt" ? (
            <>
              <p className="border-l-2 border-white/5 pl-4 py-1">
                <strong className="text-white font-medium select-none">
                  <ScramblerWord globalTriggerId={globalTriggerId} scrambleChance={0.9}>Metro Sul</ScramblerWord>
                </strong> é um projeto de música eletrônica experimental que explora o espaço onde a{" "}
                <ScramblerWord globalTriggerId={globalTriggerId} scrambleChance={0.4}>intuição humana</ScramblerWord> se encontra com os{" "}
                <ScramblerWord globalTriggerId={globalTriggerId} scrambleChance={0.5}>algoritmos mecânicos</ScramblerWord>. Mesclando{" "}
                <ScramblerWord globalTriggerId={globalTriggerId} scrambleChance={0.35}>techno modular</ScramblerWord> profundo, frequências hipnóticas de{" "}
                <ScramblerWord globalTriggerId={globalTriggerId} scrambleChance={0.45}>sub-graves</ScramblerWord> e design espacial, o projeto estabelece uma ponte entre a{" "}
                <ScramblerWord globalTriggerId={globalTriggerId} scrambleChance={0.3}>precisão digital</ScramblerWord> e o puro{" "}
                <ScramblerWord globalTriggerId={globalTriggerId} scrambleChance={0.5}>calor analógico</ScramblerWord>.
              </p>
              <p className="border-l-2 border-white/5 pl-4 py-1">
                O som está enraizado em uma estética{" "}
                <ScramblerWord globalTriggerId={globalTriggerId} scrambleChance={0.4}>dark minimalista</ScramblerWord> e acústica altamente{" "}
                <ScramblerWord globalTriggerId={globalTriggerId} scrambleChance={0.3}>imersiva</ScramblerWord>, priorizando progressões cíclicas sobre ganchos de rádio. Cada padrão é um estudo do contraste:{" "}
                <ScramblerWord globalTriggerId={globalTriggerId} scrambleChance={0.4}>flutuações atmosféricas</ScramblerWord> sem peso, tensões de máquinas e a passagem do{" "}
                <ScramblerWord globalTriggerId={globalTriggerId} scrambleChance={0.35}>tempo rítmico</ScramblerWord>.
              </p>
              <p className="border-l-2 border-white/5 pl-4 py-1">
                Ao cruzar tecnologias interativas com{" "}
                <ScramblerWord globalTriggerId={globalTriggerId} scrambleChance={0.3}>síntese analógica</ScramblerWord>, Metro Sul cria um plano audiovisual imersivo onde os tons são{" "}
                <ScramblerWord globalTriggerId={globalTriggerId} scrambleChance={0.7}>alterados</ScramblerWord>,{" "}
                <ScramblerWord globalTriggerId={globalTriggerId} scrambleChance={0.7}>filtrados</ScramblerWord> e{" "}
                <ScramblerWord globalTriggerId={globalTriggerId} scrambleChance={0.6}>esculpidos</ScramblerWord> ao vivo.
              </p>
            </>
          ) : lang === "es" ? (
            <>
              <p className="border-l-2 border-white/5 pl-4 py-1">
                <strong className="text-white font-medium select-none">
                  <ScramblerWord globalTriggerId={globalTriggerId} scrambleChance={0.9}>Metro Sul</ScramblerWord>
                </strong> es un proyecto de música electrónica experimental que explora el espacio donde la{" "}
                <ScramblerWord globalTriggerId={globalTriggerId} scrambleChance={0.4}>intuición humana</ScramblerWord> se encuentra con los{" "}
                <ScramblerWord globalTriggerId={globalTriggerId} scrambleChance={0.5}>algoritmos mecánicos</ScramblerWord>. Fusionando{" "}
                <ScramblerWord globalTriggerId={globalTriggerId} scrambleChance={0.35}>techno modular</ScramblerWord> profundo, frecuencias hipnóticas de{" "}
                <ScramblerWord globalTriggerId={globalTriggerId} scrambleChance={0.45}>subgraves</ScramblerWord> y diseño espacial, el proyecto tiende un puente entre la{" "}
                <ScramblerWord globalTriggerId={globalTriggerId} scrambleChance={0.3}>precisión digital</ScramblerWord> y la calidez{" "}
                <ScramblerWord globalTriggerId={globalTriggerId} scrambleChance={0.5}>analógica pura</ScramblerWord>.
              </p>
              <p className="border-l-2 border-white/5 pl-4 py-1">
                El sonido está arraigado en una estética{" "}
                <ScramblerWord globalTriggerId={globalTriggerId} scrambleChance={0.4}>oscura minimalista</ScramblerWord> y una acústica altamente{" "}
                <ScramblerWord globalTriggerId={globalTriggerId} scrambleChance={0.3}>inmersiva</ScramblerWord>, priorizando bucles progresivos sobre ganchos comerciales directos. Cada patrón es un estudio del contraste:{" "}
                <ScramblerWord globalTriggerId={globalTriggerId} scrambleChance={0.4}>deriva atmosférica</ScramblerWord> sin peso, tensión de la máquina y flujo del{" "}
                <ScramblerWord globalTriggerId={globalTriggerId} scrambleChance={0.35}>tiempo rítmico</ScramblerWord>.
              </p>
              <p className="border-l-2 border-white/5 pl-4 py-1">
                Al combinar tecnología web interactiva con{" "}
                <ScramblerWord globalTriggerId={globalTriggerId} scrambleChance={0.3}>síntesis analógica</ScramblerWord>, Metro Sul crea un lienzo audiovisual inmersivo donde los sonidos se{" "}
                <ScramblerWord globalTriggerId={globalTriggerId} scrambleChance={0.7}>distorsionan</ScramblerWord>,{" "}
                <ScramblerWord globalTriggerId={globalTriggerId} scrambleChance={0.7}>filtran</ScramblerWord> y{" "}
                <ScramblerWord globalTriggerId={globalTriggerId} scrambleChance={0.6}>esculpen</ScramblerWord> en vivo.
              </p>
            </>
          ) : (
            <>
              <p className="border-l-2 border-white/5 pl-4 py-1">
                <strong className="text-white font-medium select-none">
                  <ScramblerWord globalTriggerId={globalTriggerId} scrambleChance={0.9}>Metro Sul</ScramblerWord>
                </strong> is an experimental electronic music project exploring the space where{" "}
                <ScramblerWord globalTriggerId={globalTriggerId} scrambleChance={0.4}>human intuition</ScramblerWord> meets{" "}
                <ScramblerWord globalTriggerId={globalTriggerId} scrambleChance={0.5}>mechanical algorithms</ScramblerWord>. Fusing deep{" "}
                <ScramblerWord globalTriggerId={globalTriggerId} scrambleChance={0.35}>modular techno</ScramblerWord>, hypnotic{" "}
                <ScramblerWord globalTriggerId={globalTriggerId} scrambleChance={0.45}>sub-bass frequencies</ScramblerWord>, and spatial design, the project bridges{" "}
                <ScramblerWord globalTriggerId={globalTriggerId} scrambleChance={0.3}>digital precision</ScramblerWord> with raw{" "}
                <ScramblerWord globalTriggerId={globalTriggerId} scrambleChance={0.5}>analog warmth</ScramblerWord>.
              </p>
              <p className="border-l-2 border-white/5 pl-4 py-1">
                The sound is rooted in minimalist{" "}
                <ScramblerWord globalTriggerId={globalTriggerId} scrambleChance={0.4}>dark aesthetics</ScramblerWord> and highly immersive{" "}
                <ScramblerWord globalTriggerId={globalTriggerId} scrambleChance={0.3}>acoustics</ScramblerWord>, prioritizing{" "}
                <ScramblerWord globalTriggerId={globalTriggerId} scrambleChance={0.5}>progressive loops</ScramblerWord> over radio hooks. Each pattern is a study of contrast:{" "}
                <ScramblerWord globalTriggerId={globalTriggerId} scrambleChance={0.4}>weightless atmospheric drift</ScramblerWord>, machine tension, and the flow of{" "}
                <ScramblerWord globalTriggerId={globalTriggerId} scrambleChance={0.35}>rhythmic time</ScramblerWord>.
              </p>
              <p className="border-l-2 border-white/5 pl-4 py-1">
                By combining interactive web tech with{" "}
                <ScramblerWord globalTriggerId={globalTriggerId} scrambleChance={0.3}>analog synthesis</ScramblerWord>, Metro Sul creates an immersive audio-visual canvas where sounds are{" "}
                <ScramblerWord globalTriggerId={globalTriggerId} scrambleChance={0.7}>warped</ScramblerWord>,{" "}
                <ScramblerWord globalTriggerId={globalTriggerId} scrambleChance={0.7}>filtered</ScramblerWord>, and{" "}
                <ScramblerWord globalTriggerId={globalTriggerId} scrambleChance={0.6}>sculpted</ScramblerWord> live.
              </p>
            </>
          )}
        </div>

      </div>

      {/* Futuristic Spec Sheet / Grid Blocks */}
      <div className="border border-white/10 rounded-lg bg-[#070709]/80 backdrop-blur-md p-6 md:p-8">
        <div className="flex items-center gap-2 mb-6 pb-4 border-b border-white/5">
          <Terminal size={14} className="text-neon-blue" />
          <h3 className="font-mono text-xs font-semibold tracking-widest text-[#00f0ff]">
            {lang === "pt" ? "ESPECIFICAÇÕES_DE_SISTEMA // ESPECTRO_DE_SINAL" : lang === "es" ? "ESPECIFICACIONES_DE_SISTEMA // ESPECTRO_DE_SEÑAL" : "SYSTEM_SPECIFICATION // SIGNAL_SPECTRUM"}
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {getMetroSpecs().map((spec, i) => (
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

