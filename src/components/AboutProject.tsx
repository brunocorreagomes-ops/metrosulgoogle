import { Cpu, Zap, Eye, Disc, Terminal, Shield, Workflow, Layers, ChevronRight, Activity, ShieldAlert, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";

interface SpecsItem {
  label: string;
  value: string;
  category: string;
}

const METRO_SPECS: SpecsItem[] = [
  { label: "Core Synthesis", value: "Hardware & Frequency Formants", category: "Hardware" },
  { label: "Mastering Stage", value: "Dynamic -14 LUFS Analog Saturation", category: "Signal" },
  { label: "Temporal Transit", value: "Urban Chronos Loops (125 - 138 BPM)", category: "Timing" },
  { label: "Spatial Architecture", value: "Binaural Stereo Depth & Kairos Reverb", category: "Acoustics" },
  { label: "Sub-layer Vocals", value: "Frequency Resonance & Night Breath", category: "Synthesis" },
  { label: "Visual Identity", value: "Cinematic Blue Hour & Amber Alignment", category: "Aesthetics" }
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
      className={`inline-block cursor-pointer font-medium transition-all duration-150 decoration-[#009DFF]/40 relative select-all selection:bg-[#009DFF] selection:text-black ${
        hovered 
          ? "text-[#009DFF] scale-[1.02] border-b border-[#009DFF]/30" 
          : "text-neutral-200 border-b border-transparent hover:text-[#37D8FF]"
      }`}
      style={{
        textShadow: hovered 
          ? `0 0 8px rgba(0,157,255,0.6), -1.5px 0 #FF8800, 1.5px 0 #009DFF` 
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
      label: lang === "pt" ? "O Relógio Mecânico" : lang === "es" ? "El Reloj Mecánico" : "The Mechanical Clock", 
      value: lang === "pt" ? "Pressão do trabalho, repetição, prazos rígidos e o ritmo seco da máquina." : lang === "es" ? "Presión laboral, repetición, plazos rígidos y el ritmo seco de la máquina." : "Work pressure, repetition, deadlines and dry machine rhythm.", 
      category: lang === "pt" ? "01 // CHRONOS / PRESSÃO" : lang === "es" ? "01 // CHRONOS / PRESIÓN" : "01 // CHRONOS / PRESSURE" 
    },
    { 
      label: lang === "pt" ? "A Rota de Saída" : lang === "es" ? "La Ruta de Escape" : "The Route Out", 
      value: lang === "pt" ? "Acústica do metrô, luzes borradas da cidade, síncope nervosa e movimento urbano." : lang === "es" ? "Acústica del metro, luces borrosas de la ciudad, síncopa nerviosa y movimiento." : "Subway acoustics, blurred city lights, nervous syncopation and movement.", 
      category: lang === "pt" ? "02 // TRÂNSITO / ESCAPE" : lang === "es" ? "02 // TRÁNSITO / ESCAPE" : "02 // TRANSIT / ESCAPE" 
    },
    { 
      label: lang === "pt" ? "O Momento Suspenso" : lang === "es" ? "El Momento Suspendido" : "The Suspended Moment", 
      value: lang === "pt" ? "A energia da pista, frequências sub-graves e o tempo perdendo sua autoridade." : lang === "es" ? "La energía de la pista, frecuencias profundas de subgrave y el tiempo perdiendo su autoridad." : "Dance floor energy, deep frequencies and time losing authority.", 
      category: lang === "pt" ? "03 // KAIROS / LIBERTAÇÃO" : lang === "es" ? "03 // KAIROS / LIBERACIÓN" : "03 // KAIROS / RELEASE" 
    },
    { 
      label: lang === "pt" ? "Distorção da Madrugada" : lang === "es" ? "La Distorsión de la Madrugada" : "The After-Hours Shift", 
      value: lang === "pt" ? "Chuva, fumaça, texturas ácidas, corpos exaustos e a elasticidade do after." : lang === "es" ? "Lluvia, humo, texturas ácidas, cuerpos agotados y la extraña elasticidad de la madrugada." : "Rain, smoke, acid textures, tired bodies and the strange elasticity of the madrugada.", 
      category: lang === "pt" ? "04 // AFTER-HOURS / DISTORÇÃO" : lang === "es" ? "04 // AFTER-HOURS / DISTORSIÓN" : "04 // AFTER-HOURS / DISTORTION" 
    },
    { 
      label: lang === "pt" ? "A Luz da Blue Hour" : lang === "es" ? "La Luz del Amanecer" : "Blue Hour Melancholy", 
      value: lang === "pt" ? "Luz suave do amanhecer, nostalgia lo-fi, o descanso necessário e o recomeço do relógio." : lang === "es" ? "Luz tenue, nostalgia lo-fi, descanso y el inevitable reinicio del reloj." : "Blue hour, soft light, lo-fi nostalgia, rest and the clock starting again.", 
      category: lang === "pt" ? "05 // RETORNO / CICLO" : lang === "es" ? "05 // RETORNO / CICLO" : "05 // RETURN / CYCLE" 
    }
  ];

  return (
    <div className="relative w-full z-10 space-y-12">
      
      {/* Narrative grid row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left side: short, high-impact intro statement & Signal Simulator Deck */}
        <div className="lg:col-span-5 space-y-5">
          <div className="flex items-center gap-2">
            <span className="h-[1px] w-8 bg-gradient-to-r from-[#009DFF] to-[#FF6A00]" />
            <span className="font-mono text-xs tracking-[0.2em] text-[#009DFF] uppercase font-bold">
              {lang === "pt" ? "MANIFESTO METRO SUL" : lang === "es" ? "MANIFESTO METRO SUL" : "METRO SUL MANIFESTO"}
            </span>
          </div>
          
          <h2 className="font-display text-2xl lg:text-3xl font-bold text-white tracking-widest leading-relaxed uppercase">
            {lang === "pt" 
              ? "Frequência transformada em movimento. Arquiteturas eletrônicas para espaços imersivos." 
              : lang === "es" 
              ? "Frecuencia transformada en movimiento. Arquitecturas electrónicas para espacios inmersivos." 
              : "Frequency transformed into movement. Electronic architectures for immersive spaces."}
          </h2>

          {/* Interactive Controller Deck */}
          <div className="p-5 rounded-lg border border-white/10 bg-neutral-950/70 backdrop-blur-md space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.04] pb-2">
               <span className="font-mono text-[9px] text-neutral-400 block tracking-widest">
                 {lang === "pt" ? "CONSOLE DE TRANSMISSÃO" : lang === "es" ? "CONSOLA DE TRANSMISIÓN" : "TRANSMISSION CONSOLE"}
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
                <span className="text-neutral-400">SIGNAL_RESONANCE</span>
                <span className={`${
                  integrityPercent > 80 ? "text-[#009DFF]" :
                  integrityPercent > 40 ? "text-[#FF8800]" : "text-red-500 font-bold"
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
                    integrityPercent > 80 ? "bg-gradient-to-r from-[#009DFF] to-[#37D8FF]" :
                    integrityPercent > 40 ? "bg-[#FF8800]" : "bg-red-500"
                  }`}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={destabilizeSignal}
                className="px-3 py-2 rounded border border-white/10 hover:border-white/20 bg-neutral-900/60 hover:bg-neutral-900 text-[10px] font-mono tracking-widest text-[#FF6A00] hover:text-[#FFB000] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Activity size={10} className="text-[#FF6A00] animate-pulse" />
                {lang === "pt" ? "DESESTABILIZAR" : lang === "es" ? "DESESTABILIZAR" : "DEGRADE SIGNAL"}
              </button>
              
              <button
                onClick={resetSignal}
                className="px-3 py-2 rounded border border-white/10 hover:border-white/20 bg-[#009DFF]/10 hover:bg-[#009DFF]/20 text-[#009DFF] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RotateCcw size={10} className="text-[#009DFF]" />
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
                </strong> transforma a pressão do tempo urbano em movimento eletrônico — da rigidez da jornada de trabalho ao pulso suspenso da noite. O projeto é um espaço em que o relógio mecânico perde a autoridade sobre o corpo, guiando canais de descompressão, trânsito urbano e <ScramblerWord globalTriggerId={globalTriggerId} scrambleChance={0.5}>libertação noturna</ScramblerWord> por meio de batidas analógicas puras e <ScramblerWord globalTriggerId={globalTriggerId} scrambleChance={0.4}>sintetizadores modulares</ScramblerWord>.
              </p>
              <p className="border-l-2 border-white/5 pl-4 py-1">
                O som funde o <ScramblerWord globalTriggerId={globalTriggerId} scrambleChance={0.4}>techno modular agressivo</ScramblerWord> com a melancolia da primeira luz do dia (blue hour). Cada loop é um estudo de contraste: a ansiedade dos prazos diários e o peso das máquinas colidindo com a distorção das altas horas (<ScramblerWord globalTriggerId={globalTriggerId} scrambleChance={0.4}>after-hours</ScramblerWord>) e a elasticidade de madrugadas de <ScramblerWord globalTriggerId={globalTriggerId} scrambleChance={0.45}>imersão total na pista</ScramblerWord>.
              </p>
              <p className="border-l-2 border-white/5 pl-4 py-1">
                Ao cruzar tecnologia web interativa com <ScramblerWord globalTriggerId={globalTriggerId} scrambleChance={0.35}>síntese analógica</ScramblerWord>, Metro Sul cria um plano audiovisual imersivo onde o cansaço do dia é <ScramblerWord globalTriggerId={globalTriggerId} scrambleChance={0.65}>filtrado</ScramblerWord>, <ScramblerWord globalTriggerId={globalTriggerId} scrambleChance={0.7}>reconfigurado</ScramblerWord> e dissolvido através de frequências de <ScramblerWord globalTriggerId={globalTriggerId} scrambleChance={0.5}>sub-graves profundos</ScramblerWord>.
              </p>
              <p className="border-l-2 border-white/5 pl-4 py-1 text-xs text-neutral-500">
                O projeto foi fundado, produzido e performado por seu fundador, produtor e artista, <strong className="text-white font-medium select-none"><ScramblerWord globalTriggerId={globalTriggerId} scrambleChance={0.25}>Bruno Gomes</ScramblerWord></strong>.
              </p>
            </>
          ) : lang === "es" ? (
            <>
              <p className="border-l-2 border-white/5 pl-4 py-1">
                <strong className="text-white font-medium select-none">
                  <ScramblerWord globalTriggerId={globalTriggerId} scrambleChance={0.9}>Metro Sul</ScramblerWord>
                </strong> transforma la presión del tiempo urbano en movimiento electrónico: de la rigidez de la jornada laboral al pulso suspendido de la noche. Se diseña como un proyecto en el que el reloj mecánico deja de controlar el cuerpo, traduciendo la ansiedad del tránsito urbano, los plazos y la <ScramblerWord globalTriggerId={globalTriggerId} scrambleChance={0.5}>liberación nocturna</ScramblerWord> a través de ritmos modulares y <ScramblerWord globalTriggerId={globalTriggerId} scrambleChance={0.4}>síntesis pura</ScramblerWord>.
              </p>
              <p className="border-l-2 border-white/5 pl-4 py-1">
                El sonido fusiona un <ScramblerWord globalTriggerId={globalTriggerId} scrambleChance={0.4}>techno modular potente</ScramblerWord> con la melancolía del amanecer. Cada patrón estudia el contraste: la fricción de los cronogramas rígidos y las rutinas mecánicas chocando con la distorción del <ScramblerWord globalTriggerId={globalTriggerId} scrambleChance={0.4}>after-hours</ScramblerWord> y la extraña elasticidad de la madrugada de <ScramblerWord globalTriggerId={globalTriggerId} scrambleChance={0.45}>inmersión en la pista</ScramblerWord>.
              </p>
              <p className="border-l-2 border-white/5 pl-4 py-1">
                Al cruzar la tecnología web interactiva con la <ScramblerWord globalTriggerId={globalTriggerId} scrambleChance={0.35}>síntesis analógica</ScramblerWord>, Metro Sul crea un lienzo audiovisual inmersivo en el que el cansancio diario se <ScramblerWord globalTriggerId={globalTriggerId} scrambleChance={0.65}>filtra</ScramblerWord>, se <ScramblerWord globalTriggerId={globalTriggerId} scrambleChance={0.7}>altera</ScramblerWord> y se disipa mediante frecuencias de <ScramblerWord globalTriggerId={globalTriggerId} scrambleChance={0.5}>subgraves profundos</ScramblerWord>.
              </p>
              <p className="border-l-2 border-white/5 pl-4 py-1 text-xs text-neutral-500">
                El proyecto fue fundado, producido y realizado por su fundador, productor y artista, <strong className="text-white font-medium select-none"><ScramblerWord globalTriggerId={globalTriggerId} scrambleChance={0.25}>Bruno Gomes</ScramblerWord></strong>.
              </p>
            </>
          ) : (
            <>
              <p className="border-l-2 border-white/5 pl-4 py-1">
                <strong className="text-white font-medium select-none">
                  <ScramblerWord globalTriggerId={globalTriggerId} scrambleChance={0.9}>Metro Sul</ScramblerWord>
                </strong> transforms urban time pressure into electronic motion — from the rigidity of the workday to the suspended pulse of the night. It is a premium electronic music project about the moment the mechanical clock stops controlling the body, translating transit anxiety, deadlines, and <ScramblerWord globalTriggerId={globalTriggerId} scrambleChance={0.5}>nocturnal release</ScramblerWord> into deep modular beats and <ScramblerWord globalTriggerId={globalTriggerId} scrambleChance={0.4}>tactile synthesis</ScramblerWord>.
              </p>
              <p className="border-l-2 border-white/5 pl-4 py-1">
                The sound merges heavy <ScramblerWord globalTriggerId={globalTriggerId} scrambleChance={0.4}>modular techno</ScramblerWord> with blue hour melancholy. Each pattern studies contrast: the friction of daily schedules and machine-like repetition colliding with <ScramblerWord globalTriggerId={globalTriggerId} scrambleChance={0.4}>after-hours distortion</ScramblerWord> and the strange, smoky elasticity of the <ScramblerWord globalTriggerId={globalTriggerId} scrambleChance={0.45}>dance floor immersion</ScramblerWord>.
              </p>
              <p className="border-l-2 border-white/5 pl-4 py-1">
                By crossing interactive web tech with <ScramblerWord globalTriggerId={globalTriggerId} scrambleChance={0.35}>analog synthesis</ScramblerWord>, Metro Sul builds an immersive audio-visual canvas where the fatigue of the workday is <ScramblerWord globalTriggerId={globalTriggerId} scrambleChance={0.65}>filtered</ScramblerWord>, <ScramblerWord globalTriggerId={globalTriggerId} scrambleChance={0.7}>warped</ScramblerWord>, and dissolved back into deep <ScramblerWord globalTriggerId={globalTriggerId} scrambleChance={0.5}>sub-bass frequencies</ScramblerWord>.
              </p>
              <p className="border-l-2 border-white/5 pl-4 py-1 text-xs text-neutral-500">
                The project was founded, produced, and performed by its founder, producer, and artist, <strong className="text-white font-medium select-none"><ScramblerWord globalTriggerId={globalTriggerId} scrambleChance={0.25}>Bruno Gomes</ScramblerWord></strong>.
              </p>
            </>
          )}
        </div>

      </div>

      {/* Futuristic Spec Sheet / Grid Blocks */}
      <div className="border border-white/5 rounded-lg bg-[#07111F]/50 backdrop-blur-md p-6 md:p-8">
        <div className="flex items-center gap-2 mb-6 pb-4 border-b border-white/5">
          <Terminal size={14} className="text-[#009DFF]" />
          <h3 className="font-mono text-xs font-semibold tracking-widest text-[#009DFF]">
            {lang === "pt" ? "O_CICLO_DO_TEMPO_URBANO // CRONOS_E_KAIROS" : lang === "es" ? "EL_CICLO_DEL_TIEMPO_URBANO // CRONOS_Y_KAIROS" : "THE_URBAN_TIME_CYCLE // CHRONOS_AND_KAIROS"}
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
                <span className="h-1 w-1 rounded-full bg-neutral-800 group-hover:bg-[#009DFF] transition-colors" />
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

