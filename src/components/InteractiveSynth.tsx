import { useState, useRef, useEffect } from "react";
import { Sliders, Volume2, Sparkles, Radio, Disc, Play, Square, Activity, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Conceptual audio Nodes for Metro Sul modular soundboard
interface SoundNode {
  id: string;
  name: string;
  frequency: number;
  type: OscillatorType;
  color: string;
  desc: string;
  delayTime: number;
  filterQ: number;
}

const CONSTANT_NODES: SoundNode[] = [
  {
    id: "sub-gravity",
    name: "Gravity Sub-Pulse",
    frequency: 65.41, // C2 deep sub-bass
    type: "sine",
    color: "from-[#00f0ff] to-[#7000ff]",
    desc: "Sub-harmonic gravity wave designed for physical low-ends.",
    delayTime: 0.35,
    filterQ: 8,
  },
  {
    id: "chronos-lfo",
    name: "Chronos Portal Synth",
    frequency: 130.81, // C3
    type: "sawtooth",
    color: "from-[#ff455b] to-[#7000ff]",
    desc: "Aggressive time-warped saw sweep with resonant bandpass feedback.",
    delayTime: 0.2,
    filterQ: 14,
  },
  {
    id: "kairos-pad",
    name: "Kairos Organic Echo",
    frequency: 196.00, // G3 cinematic perfect fifth
    type: "triangle",
    color: "from-[#00f0ff] to-[#ff455b]",
    desc: "Serene atmospheric pad with massive depth and dynamic delay.",
    delayTime: 0.6,
    filterQ: 3,
  },
  {
    id: "voltage-lead",
    name: "Voltage Solar Lead",
    frequency: 293.66, // D4
    type: "square",
    color: "from-[#bd00ff] to-[#00f0ff]",
    desc: "Cybernetic high-voltage melody pulse simulating modular patch wiring.",
    delayTime: 0.4,
    filterQ: 10,
  },
  {
    id: "echo-tree",
    name: "Bioluminescent Sine",
    frequency: 392.00, // G4
    type: "sine",
    color: "from-[#00f0ff] to-[#7000ff]",
    desc: "Crystalline resonant chime referencing organic digital forest sounds.",
    delayTime: 0.5,
    filterQ: 15,
  },
  {
    id: "horizon-noise",
    name: "Horizon Resonance Sweep",
    frequency: 87.31, // F2
    type: "sawtooth",
    color: "from-[#ff455b] to-[#bd00ff]",
    desc: "Dense panoramic pad frequency exploring space-horizon borders.",
    delayTime: 0.8,
    filterQ: 6,
  }
];

interface SynthPreset {
  name: string;
  desc: string;
  grid: boolean[][];
  params: {
    cutoff: number;
    resonance: number;
    feedback: number;
    lfoRate: number;
  };
}

const SYNTH_PRESETS: SynthPreset[] = [
  {
    name: "Pressure",
    desc: "Industrial driving modular techno style. Active resonant sweeps, fast low-pass decay, and heavy sub pulses.",
    params: { cutoff: 1800, resonance: 14, feedback: 0.25, lfoRate: 6.5 },
    grid: [
      [true, false, false, false, true, false, false, false],
      [false, false, true, false, false, false, true, false],
      [false, false, false, false, false, false, false, false],
      [true, false, true, false, true, false, true, false],
      [false, true, false, true, false, true, false, true],
      [true, false, false, true, true, false, false, true]
    ]
  },
  {
    name: "Beyond Gravity",
    desc: "Floating interstellar ambient drift. Open relaxed feedback delays, crystalline sub harmonics, and slow waves.",
    params: { cutoff: 1100, resonance: 6, feedback: 0.65, lfoRate: 1.2 },
    grid: [
      [true, false, false, false, false, false, false, false],
      [false, false, false, true, false, false, false, false],
      [true, false, true, false, true, false, true, false],
      [false, false, false, false, false, false, false, false],
      [true, true, true, true, true, true, true, true],
      [false, false, false, false, true, false, false, false]
    ]
  },
  {
    name: "Kairos Dream",
    desc: "Suspended, spacious time travel chords. Gorgeous echoing resonant waves with spatial delay loops.",
    params: { cutoff: 950, resonance: 4, feedback: 0.75, lfoRate: 2.2 },
    grid: [
      [true, false, false, false, true, false, false, false],
      [false, true, false, false, false, true, false, false],
      [false, false, false, true, false, false, false, true],
      [false, false, true, false, false, false, true, false],
      [true, false, false, false, true, false, false, false],
      [false, false, false, false, false, false, false, false]
    ]
  },
  {
    name: "Velvet Groove",
    desc: "Seductive late-night house. Deep syncopated tech-grooves and warm analog warmth oscillations.",
    params: { cutoff: 1450, resonance: 9, feedback: 0.35, lfoRate: 4.0 },
    grid: [
      [true, false, false, false, true, false, false, false],
      [false, false, true, false, false, false, true, false],
      [false, true, false, true, false, true, false, true],
      [false, false, false, false, false, false, false, false],
      [true, false, true, false, true, false, true, false],
      [false, false, false, true, false, false, false, true]
    ]
  },
  {
    name: "Transit Velocity",
    desc: "Rapid mechanical network acceleration. Extremely fast clock rate triggers and high resonance accents.",
    params: { cutoff: 2400, resonance: 16, feedback: 0.15, lfoRate: 10.5 },
    grid: [
      [true, true, false, true, true, true, false, true],
      [false, true, false, false, false, true, false, false],
      [false, false, true, false, false, false, true, false],
      [true, false, true, false, true, false, true, false],
      [false, true, false, true, false, true, false, true],
      [true, false, false, true, true, false, false, true]
    ]
  }
];

interface InteractiveSynthProps {
  isMuted?: boolean;
}

export default function InteractiveSynth({ isMuted = false }: InteractiveSynthProps) {
  const [audioCtx, setAudioCtx] = useState<AudioContext | null>(null);
  const [isPlaying, setIsPlaying] = useState<string | null>(null);
  const [volume, setVolume] = useState<number>(0.4); // 0 to 1
  const [filterCutoff, setFilterCutoff] = useState<number>(1400); // 100 to 4000hz
  const [resonance, setResonance] = useState<number>(8); // 1 to 20
  const [delayFeedback, setDelayFeedback] = useState<number>(0.35); // 0 to 0.9
  const [lfoRate, setLfoRate] = useState<number>(3); // 0.1 to 15 Hz
  const [lfoDepth, setLfoDepth] = useState<number>(400); // 0 to 1000 Hz
  const [activeTab, setActiveTab] = useState<"pads" | "matrix">("pads");
  
  // Matrix sequencer state
  const [sequencerOn, setSequencerOn] = useState<boolean>(false);
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [matrixGrid, setMatrixGrid] = useState<boolean[][]>(
    Array(6).fill(null).map(() => Array(8).fill(false))
  );

  const gainNodeRef = useRef<GainNode | null>(null);
  const filterNodeRef = useRef<BiquadFilterNode | null>(null);
  const delayNodeRef = useRef<DelayNode | null>(null);
  const delayFeedbackNodeRef = useRef<GainNode | null>(null);
  const activeOscillators = useRef<{ [key: string]: { osc: OscillatorNode; gain: GainNode } }>({});
  const sequencerInterval = useRef<NodeJS.Timeout | null>(null);

  // Initialize Audio Context lazily
  const initAudio = () => {
    if (audioCtx) return audioCtx;
    
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      
      // Main Master Gain Node
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(volume, ctx.currentTime);
      
      // Main High-frequency analog lowpass resonant filter
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(filterCutoff, ctx.currentTime);
      filter.Q.setValueAtTime(resonance, ctx.currentTime);

      // Main Echo/Delay feedback unit
      const delay = ctx.createDelay(2.0);
      delay.delayTime.setValueAtTime(0.4, ctx.currentTime);
      
      const delayFeedbackNode = ctx.createGain();
      delayFeedbackNode.gain.setValueAtTime(delayFeedback, ctx.currentTime);

      // Patch the chain: Master Synth Path
      // Osc -> OscGain -> Filter -> MasterGain -> Destination
      // Feed filter into the Delay node
      filter.connect(masterGain);
      
      // Delay loop back configuration
      filter.connect(delay);
      delay.connect(delayFeedbackNode);
      delayFeedbackNode.connect(delay); // loop back
      delayFeedbackNode.connect(masterGain); // feed into main output
      
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64;
      analyser.smoothingTimeConstant = 0.75;
      
      masterGain.connect(analyser);
      analyser.connect(ctx.destination);
      
      (window as any).__metroAnalyser = analyser;

      // Save refs for dynamic parameter knobs sliding
      gainNodeRef.current = masterGain;
      filterNodeRef.current = filter;
      delayNodeRef.current = delay;
      delayFeedbackNodeRef.current = delayFeedbackNode;
      setAudioCtx(ctx);

      return ctx;
    } catch (error) {
      console.error("Audio Context initialization failed", error);
      return null;
    }
  };

  // Sync parameters when changes are made via UI sliders or global mute toggle
  useEffect(() => {
    if (gainNodeRef.current && audioCtx) {
      const targetVolume = isMuted ? 0 : volume;
      gainNodeRef.current.gain.setTargetAtTime(targetVolume, audioCtx.currentTime, 0.05);
    }
  }, [volume, isMuted, audioCtx]);

  useEffect(() => {
    if (filterNodeRef.current && audioCtx) {
      filterNodeRef.current.frequency.setTargetAtTime(filterCutoff, audioCtx.currentTime, 0.05);
      filterNodeRef.current.Q.setTargetAtTime(resonance, audioCtx.currentTime, 0.05);
    }
  }, [filterCutoff, resonance, audioCtx]);

  useEffect(() => {
    if (delayFeedbackNodeRef.current && audioCtx) {
      delayFeedbackNodeRef.current.gain.setTargetAtTime(delayFeedback, audioCtx.currentTime, 0.05);
    }
  }, [delayFeedback, audioCtx]);

  // Handle playing individual nodes
  const triggerNodePlay = (node: SoundNode) => {
    const ctx = initAudio();
    if (!ctx) return;

    // Resume if suspended (browser security policy safeguards)
    if (ctx.state === "suspended") {
      ctx.resume();
    }

    // Stop current instance of this node to prevent multi-clicking overlay saturation
    if (activeOscillators.current[node.id]) {
      try {
        activeOscillators.current[node.id].gain.gain.setValueAtTime(activeOscillators.current[node.id].gain.gain.value, ctx.currentTime);
        activeOscillators.current[node.id].gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.1);
        activeOscillators.current[node.id].osc.stop(ctx.currentTime + 0.15);
      } catch (e) {}
    }

    // Create Oscillator
    const osc = ctx.createOscillator();
    osc.type = node.type;
    osc.frequency.setValueAtTime(node.frequency, ctx.currentTime);

    // Create unique oscillator amp envelope
    const oscGain = ctx.createGain();
    oscGain.gain.setValueAtTime(0, ctx.currentTime);
    oscGain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + 0.05); // Attack
    oscGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.5); // Slow Decay/Sustain drop

    // Patch osc to main lowpass filter
    if (filterNodeRef.current) {
      osc.connect(oscGain);
      oscGain.connect(filterNodeRef.current);
    }

    // Apply LFO micro-pitch modulation for modern analog warmth
    if (lfoRate > 0) {
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.type = "sine";
      lfo.frequency.setValueAtTime(lfoRate, ctx.currentTime);
      lfoGain.gain.setValueAtTime(lfoDepth * 0.05, ctx.currentTime); // Subtle pitch modulation
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      lfo.start();
      lfo.stop(ctx.currentTime + 2.6);
    }

    osc.start();
    osc.stop(ctx.currentTime + 2.5);

    setIsPlaying(node.id);
    activeOscillators.current[node.id] = { osc, gain: oscGain };

    setTimeout(() => {
      setIsPlaying((curr) => (curr === node.id ? null : curr));
    }, 400);
  };

  // Trigger individual transient note for sequencer
  const playSequencerPitch = (frequency: number, type: OscillatorType) => {
    const ctx = audioCtx || initAudio();
    if (!ctx) return;
    if (ctx.state === "suspended") ctx.resume();

    const osc = ctx.createOscillator();
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);

    const oscGain = ctx.createGain();
    oscGain.gain.setValueAtTime(0, ctx.currentTime);
    oscGain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.02);
    oscGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

    if (filterNodeRef.current) {
      osc.connect(oscGain);
      oscGain.connect(filterNodeRef.current);
    }

    osc.start();
    osc.stop(ctx.currentTime + 0.45);
  };

  // Matrix sequencer loops
  useEffect(() => {
    if (sequencerOn) {
      const stepTime = 180; // ~135 BPM equivalent
      sequencerInterval.current = setInterval(() => {
        setCurrentStep((prevStep) => {
          const nextStep = (prevStep + 1) % 8;
          
          // Play active coordinates
          matrixGrid.forEach((row, rowIndex) => {
            if (row[nextStep]) {
              const node = CONSTANT_NODES[rowIndex];
              playSequencerPitch(node.frequency * 1.5, "sawtooth"); // pitch shifted 1 perfect fifth
            }
          });

          return nextStep;
        });
      }, stepTime);
    } else {
      if (sequencerInterval.current) {
        clearInterval(sequencerInterval.current);
      }
    }

    return () => {
      if (sequencerInterval.current) clearInterval(sequencerInterval.current);
    };
  }, [sequencerOn, matrixGrid, audioCtx]);

  const toggleMatrixCell = (row: number, col: number) => {
    initAudio(); // boot context
    const updated = [...matrixGrid];
    updated[row] = [...updated[row]];
    updated[row][col] = !updated[row][col];
    setMatrixGrid(updated);
    setSelectedPreset(null);
  };

  const clearGrid = () => {
    setMatrixGrid(Array(6).fill(null).map(() => Array(8).fill(false)));
    setSelectedPreset(null);
  };

  const applyPreset = (presetIndex: number) => {
    initAudio();
    const preset = SYNTH_PRESETS[presetIndex];
    if (!preset) return;

    setMatrixGrid(preset.grid);
    setFilterCutoff(preset.params.cutoff);
    setResonance(preset.params.resonance);
    setDelayFeedback(preset.params.feedback);
    setLfoRate(preset.params.lfoRate);
    setSelectedPreset(presetIndex);
    setSequencerOn(true);
  };

  return (
    <div id="sonic-synthesizer" className="relative w-full max-w-4xl mx-auto rounded-3xl border border-white/5 bg-[#0a0a0c]/85 p-6 md:p-8 backdrop-blur-xl shadow-2xl overflow-hidden z-10">
      
      {/* Decorative circuit lines */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-radial from-ambient-purple/15 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute -bottom-8 -left-8 w-64 h-64 bg-radial from-neon-blue/10 to-transparent blur-3xl pointer-events-none" />

      {/* Eurorack header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-white/5 pb-5 mb-6 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="h-2 w-2 rounded-full bg-neon-blue animate-pulse" />
            <span className="font-mono text-[10px] tracking-widest text-neutral-400 uppercase">VOLTAGE TERMINAL 0.8B</span>
          </div>
          <h3 className="font-display text-2xl font-semibold tracking-tight text-white flex items-center gap-2">
            Metro Sul Interactive Synth
          </h3>
        </div>

        {/* Console switches */}
        <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/5 self-stretch sm:self-auto justify-center">
          <button
            onClick={() => setActiveTab("pads")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 flex items-center gap-1.5 ${
              activeTab === "pads"
                ? "bg-neon-blue/20 text-white border border-neon-blue/25"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            <Radio size={13} />
            Modular Pads
          </button>
          <button
            onClick={() => setActiveTab("matrix")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 flex items-center gap-1.5 ${
              activeTab === "matrix"
                ? "bg-neon-sunset/20 text-white border border-neon-sunset/25"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            <Sliders size={13} />
            Orbit Sequencer
          </button>
        </div>
      </div>

      {/* Main interface grids */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left hand sound controllers / matrix */}
        <div className="lg:col-span-8 space-y-4">
          {activeTab === "pads" ? (
            <div>
              <p className="text-sm text-neutral-400 mb-4 tracking-wide font-sans leading-relaxed">
                Unlock real wave modulations. Click or tap nodes below to sequence high-resonant sub frequencies and ambient chords live.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {CONSTANT_NODES.map((node) => (
                  <motion.div
                    key={node.id}
                    whileHover={{ scale: 1.015, translateY: -2 }}
                    whileTap={{ scale: 0.985 }}
                    onClick={() => triggerNodePlay(node)}
                    className={`relative p-4 rounded-2xl cursor-pointer border select-none transition-all duration-300 flex flex-col justify-between h-[115px] overflow-hidden ${
                      isPlaying === node.id
                        ? "bg-white/10 border-white/20 shadow-lg shadow-black/80"
                        : "bg-white/[0.02] border-white/5 hover:border-white/15"
                    }`}
                  >
                    {/* Glowing active outline */}
                    {isPlaying === node.id && (
                      <div className="absolute inset-0 border border-neon-blue/30 rounded-2xl animate-pulse" />
                    )}

                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-display font-medium text-white text-[15px]">{node.name}</h4>
                        <span className="font-mono text-[10px] text-neutral-400">{node.type.toUpperCase()} / {node.frequency} Hz</span>
                      </div>
                      <div className={`p-1.5 rounded-lg bg-gradient-to-tr ${node.color} opacity-40 shadow-inner`}>
                        <Activity size={14} className="text-white" />
                      </div>
                    </div>

                    <p className="font-sans text-[11px] text-neutral-400 line-clamp-2 leading-relaxed">
                      {node.desc}
                    </p>

                    {/* Accent glowing horizontal strip */}
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r opacity-50 from-transparent via-current to-transparent" />
                  </motion.div>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <div className="mb-4">
                <p className="text-xs text-neutral-400 tracking-wide font-sans mb-3.5 leading-relaxed">
                  Orbit Step-Matrix Sequencer. Program custom triggers on the node grid below or fire up pre-programmed sound system beats preset for Metro Sul releases.
                </p>
                
                {/* Advanced physical signal presets dock */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/[0.01] p-4 rounded-2xl border border-white/[0.04]">
                  <div>
                    <span className="block font-mono text-[9px] text-neon-blue uppercase tracking-widest mb-2 font-semibold">SIGNAL PATH OVERRIDES (PRESETS)</span>
                    <div className="flex flex-wrap gap-1.5">
                      {SYNTH_PRESETS.map((pst, idx) => (
                        <button
                          key={idx}
                          onClick={() => applyPreset(idx)}
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-mono tracking-tight transition-all duration-300 cursor-pointer ${
                            selectedPreset === idx
                              ? "bg-neon-sunset/20 text-[#ff7961] border border-neon-sunset/40 font-bold shadow-lg shadow-neon-sunset/10"
                              : "bg-white/[0.02] border border-white/5 text-neutral-400 hover:text-white hover:border-white/15"
                          }`}
                          title={pst.desc}
                        >
                          {pst.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
                    <button
                      onClick={() => setSequencerOn(!sequencerOn)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all duration-300 cursor-pointer ${
                        sequencerOn
                          ? "bg-red-500/20 border border-red-500/30 text-rose-400 shadow-md shadow-red-950/20"
                          : "bg-neon-sunset/15 border border-neon-sunset/30 text-neon-sunset hover:bg-neon-sunset/25"
                      }`}
                    >
                      {sequencerOn ? <Square size={11} /> : <Play size={11} />}
                      {sequencerOn ? "STOP ACTIVE" : "START SEQUENCE"}
                    </button>
                    <button
                      onClick={clearGrid}
                      className="text-xs text-neutral-400 hover:text-pink-400 border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                    >
                      Clear Matrix
                    </button>
                  </div>
                </div>
              </div>

              {selectedPreset !== null && (
                <div className="mb-4 p-3 rounded-xl bg-white/[0.01] border border-white/[0.03] text-[11px] text-neutral-400 leading-relaxed font-sans flex items-start gap-2.5 animate-fadeIn">
                  <Sparkles size={12} className="text-neon-sunset shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white font-mono mr-1">Active Pulse:</span>
                    <span>{SYNTH_PRESETS[selectedPreset].desc}</span>
                  </div>
                </div>
              )}

              {/* Grid map */}
              <div className="flex flex-col space-y-1.5 bg-black/40 p-4 rounded-2xl border border-white/5">
                {CONSTANT_NODES.map((rowNode, rIndex) => (
                  <div key={rowNode.id} className="grid grid-cols-12 items-center gap-2">
                    {/* Row Label */}
                    <span className="col-span-3 text-[10px] font-mono text-neutral-400 truncate tracking-tight pr-1" title={rowNode.name}>
                      {rowNode.name.replace(" Metro", "")}
                    </span>
                    
                    {/* Col step triggers */}
                    <div className="col-span-9 grid grid-cols-8 gap-1">
                      {Array(8).fill(null).map((_, cIndex) => {
                        const cellOn = matrixGrid[rIndex][cIndex];
                        const stepActive = sequencerOn && currentStep === cIndex;

                        return (
                          <button
                            key={cIndex}
                            onClick={() => toggleMatrixCell(rIndex, cIndex)}
                            className={`h-[28px] rounded-lg border transition-all relative ${
                              cellOn
                                ? "bg-neon-sunset/35 border-neon-sunset/60 shadow-lg shadow-neon-sunset/15"
                                : "bg-white/[0.01] border-white/5 hover:border-white/15"
                            } ${
                              stepActive ? "ring-1 ring-white/60 ring-offset-2 ring-offset-black" : ""
                            }`}
                          >
                            {stepActive && (
                              <div className="absolute inset-0 bg-white/10 rounded-lg animate-pulse" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right hand parameter sliders */}
        <div className="lg:col-span-4 bg-white/[0.01] border border-white/5 p-5 rounded-2xl space-y-5">
          <div className="flex items-center gap-1.5 border-b border-white/5 pb-2">
            <Sliders size={14} className="text-neon-blue" />
            <h4 className="font-mono text-xs font-semibold tracking-wider text-neutral-200">PATCH CONTROLS</h4>
          </div>

          {/* Master volume knob slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-[11px] font-mono">
              <span className="text-neutral-400 uppercase tracking-widest flex items-center gap-1">
                <Volume2 size={11} /> Master Level
              </span>
              <span className="text-neon-blue">{Math.round(volume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="0.8"
              step="0.01"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-neon-blue"
            />
          </div>

          {/* Lowpass cutoff slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-[11px] font-mono">
              <span className="text-neutral-400 uppercase tracking-widest">Filter Cutoff</span>
              <span className="text-neon-blue">{filterCutoff} Hz</span>
            </div>
            <input
              type="range"
              min="120"
              max="3500"
              step="10"
              value={filterCutoff}
              onChange={(e) => setFilterCutoff(parseInt(e.target.value))}
              className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-neon-blue"
            />
          </div>

          {/* Filter resonance slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-[11px] font-mono">
              <span className="text-neutral-400 uppercase tracking-widest">Resonance (Q)</span>
              <span className="text-neon-blue">{resonance}</span>
            </div>
            <input
              type="range"
              min="1"
              max="20"
              step="0.5"
              value={resonance}
              onChange={(e) => setResonance(parseFloat(e.target.value))}
              className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-neon-blue"
            />
          </div>

          {/* Echo feedback */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-[11px] font-mono">
              <span className="text-neutral-400 uppercase tracking-widest">Echo Feedback</span>
              <span className="text-neon-blue">{Math.round(delayFeedback * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="0.85"
              step="0.05"
              value={delayFeedback}
              onChange={(e) => setDelayFeedback(parseFloat(e.target.value))}
              className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-neon-blue"
            />
          </div>

          {/* LFO Rate selector */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-[11px] font-mono">
              <span className="text-neutral-400 uppercase tracking-widest">LFO Speed</span>
              <span className="text-neon-blue">{lfoRate.toFixed(1)} Hz</span>
            </div>
            <input
              type="range"
              min="0.2"
              max="15"
              step="0.2"
              value={lfoRate}
              onChange={(e) => setLfoRate(parseFloat(e.target.value))}
              className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-neon-blue"
            />
          </div>

          {/* Physical instruction note */}
          <div className="bg-white/[0.02] border border-white/5 p-3 rounded-xl flex items-start gap-2 text-[10px] leading-relaxed text-neutral-400 font-mono">
            <HelpCircle size={14} className="text-neon-blue mt-0.5 shrink-0" />
            <span>
              Real-time calculations construct voltage paths without pre-recorded samples. Dynamic adjustments immediately reshape audio textures.
            </span>
          </div>
        </div>

      </div>

    </div>
  );
}
