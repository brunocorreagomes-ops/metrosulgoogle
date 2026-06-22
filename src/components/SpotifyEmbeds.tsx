import { useState, useTransition } from "react";
import { Disc, ExternalLink, Music, Sparkles, Orbit, Clock, PlayCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { AlbumData } from "../types";
import { Language, translations } from "../locales";

export const ALBUMS: AlbumData[] = [
  {
    id: "beyond-gravity",
    title: "Beyond Gravity",
    type: "EP",
    releaseYear: 2026,
    spotifyUrl: "https://open.spotify.com/intl-pt/album/3F10JFx7wrz3scGyBUY3ES",
    embedUrl: "https://open.spotify.com/embed/album/3F10JFx7wrz3scGyBUY3ES?utm_source=generator&theme=0",
    colorTheme: {
      primary: "#009DFF", // Electric Blue
      secondary: "#37D8FF", // Plasma Blue
      glow: "rgba(0, 157, 255, 0.15)",
      ambient: "from-[#009DFF]/15 via-[#37D8FF]/5 to-transparent"
    },
    concept: "Hyper-resonance & Gravity Warps",
    description: "An evolutionary leap in deep techno landscapes. 'Beyond Gravity' represents an exploration of modular systems shifting through weightlessness. Fusing organic bioluminescent soundscapes with high-pressure cybernetic bass lines.",
    trackCount: 4,
    atmosphere: "Atmospheric, Ethereal, Heavy Low-Ends",
    tracklist: [
      {
        title: "Wake The Earth",
        duration: "5:17",
        description: "Bioluminescent textures and a steady modular heartbeat.",
        descriptionPt: "Texturas bioluminescentes e o pulsar firme de um coração modular.",
        descriptionEs: "Texturas bioluminiscentes y el pulso constante de un corazón modular."
      },
      {
        title: "Feel The Earth",
        duration: "6:15",
        description: "Massive sub-bass and deep atmospheric space drifts.",
        descriptionPt: "Sub-grave massivo e flutuações atmosféricas de espaço profundo.",
        descriptionEs: "Subgrave masivo y derivas atmosféricas de espacio profundo."
      },
      {
        title: "Break Through",
        duration: "4:01",
        description: "Fast clock gates triggering high-voltage synth sweeps.",
        descriptionPt: "Gates de clock velozes disparando varreduras de sintetizador de alta voltagem.",
        descriptionEs: "Gates de reloj veloces disparando barridos de sintetizador de alto voltaje."
      },
      {
        title: "Out Of My Head",
        duration: "6:57",
        description: "Continuous hypnotic loop building into weightless warmth.",
        descriptionPt: "Loop hipnótico contínuo evoluindo para um calor sem gravidade.",
        descriptionEs: "Bucle hipnótico continuo evolucionando hacia un calor sin gravedad."
      }
    ]
  },
  {
    id: "volta-chronos",
    title: "VOLTA (Chronos & Kairos)",
    type: "ALBUM",
    releaseYear: 2025,
    spotifyUrl: "https://open.spotify.com/intl-pt/album/316abErdO1WCIfUhM3Tgdb",
    embedUrl: "https://open.spotify.com/embed/album/316abErdO1WCIfUhM3Tgdb?utm_source=generator&theme=0",
    colorTheme: {
      primary: "#FF6A00", // Fire Orange
      secondary: "#FFB000", // Solar Amber
      glow: "rgba(255, 106, 0, 0.15)",
      ambient: "from-[#FF6A00]/15 via-[#FFB000]/5 to-transparent"
    },
    concept: "Temporal Duality: Chronos vs. Kairos",
    description: "A dual-faceted deep dive into the properties of time. 'VOLTA' explores the mechanical progression of linear schedules (Chronos) versus the opportune, suspended fluid moments of pure existence (Kairos).",
    trackCount: 15,
    atmosphere: "Fast-paced, Relentless, Cinematic Melodics",
    tracklist: [
      {
        title: "Pressure (9 to 5)",
        duration: "3:04",
        description: "dry machine percussion, minimalist anxiety, the wall-clock as antagonist.",
        descriptionPt: "percussão seca de máquina, ansiedade minimalista, o relógio de parede como antagonista.",
        descriptionEs: "percusión seca de máquina, ansiedad minimalista, el reloj de pared como antagonista."
      },
      {
        title: "Transit",
        duration: "2:34",
        description: "subway acoustics, blurred city lights, nervous UK Garage swing.",
        descriptionPt: "acústica de metrô, luzes borradas da cidade, balanço nervoso de UK Garage.",
        descriptionEs: "acústica de metro, luces de la ciudad borrosas, balanceo nervioso de UK Garage."
      },
      {
        title: "Velvet Rope",
        duration: "3:22",
        description: "Nu-Disco sophistication, heavy bass lines, whispered vocal fragments.",
        descriptionPt: "sofisticação Nu-Disco, linhas de baixo marcantes, sussurros vocais fragmentados.",
        descriptionEs: "sofisticación de Nu-Disco, líneas de bajo pesadas, fragmentos de voz susurrados."
      },
      {
        title: "Ignition",
        duration: "2:56",
        description: "Piano House euphoria, collective movement.",
        descriptionPt: "euforia Piano House, movimento coletivo.",
        descriptionEs: "euforia de Piano House, movimiento colectivo."
      },
      {
        title: "Syncopate",
        duration: "2:24",
        description: "hypnotic Tech House where the body counts in measures, not hours.",
        descriptionPt: "Tech House hipnótico onde o corpo conta compassos, não horas.",
        descriptionEs: "Tech House hipnótico donde el cuerpo cuenta compases, no horas."
      },
      {
        title: "Kairos (The Moment)",
        duration: "3:24",
        description: "ethereal progressive synthesis and undefined time.",
        descriptionPt: "síntese progressiva etérea e tempo indefinido.",
        descriptionEs: "síntesis progresiva etérea y tiempo indefinido."
      },
      {
        title: "Chemistry",
        duration: "2:33",
        description: "sensual Deep House, human magnetism and the present tense under strobe light.",
        descriptionPt: "Deep House sensual, magnetismo humano e tempo presente sob o estroboscópio.",
        descriptionEs: "Deep House sensual, magnetismo humano y tiempo presente bajo el estroboscopio."
      },
      {
        title: "Smoke & Mirrors (Interlude)",
        duration: "1:38",
        description: "rain, muffled club sound and a pause outside the room.",
        descriptionPt: "chuva, som de clube abafado e uma pausa do lado de fora.",
        descriptionEs: "lluvia, sonido de club amortiguado y una pausa fuera de la sala."
      },
      {
        title: "Second Wind",
        duration: "2:16",
        description: "3 a.m. adrenaline, raw Speed Garage and tired bodies finding voltage again.",
        descriptionPt: "Adrenalina das 3h, Speed Garage bruto e corpos cansados recuperando a voltagem.",
        descriptionEs: "Adrenalina de las 3 a.m., Speed Garage puro y cuerpos cansados encontrando voltaje otra vez."
      },
      {
        title: "Echoes in the Hall",
        duration: "2:59",
        description: "Acid textures and TB-303-like synthesis bending the after-hours into a maze.",
        descriptionPt: "texturas de Acid e síntese estilo TB-303 moldando as altas horas em um labirinto.",
        descriptionEs: "texturas ácidas y síntesis estilo TB-303 transformando el after-hours en un laberinto."
      },
      {
        title: "Blue Hour",
        duration: "3:11",
        description: "bright synthesizers, first light, hope, clarity and end-of-night melancholy.",
        descriptionPt: "sintetizadores brilhantes, primeira luz, esperança, clareza e melancolia do fim de noite.",
        descriptionEs: "sintetizadores brillantes, primera luz, esperanza, claridad y melancolía del fin de noche."
      },
      {
        title: "Taxi (The Ride Home)",
        duration: "1:38",
        description: "Lo-Fi nostalgia and happy exhaustion as the normal city wakes up.",
        descriptionPt: "nostalgia Lo-Fi e exaustão feliz enquanto a cidade normal desperta.",
        descriptionEs: "nostalgia Lo-Fi y agotamiento feliz mientras la ciudad normal se despierta."
      },
      {
        title: "Afters (Apartment 4B)",
        duration: "1:42",
        description: "glitchy minimal sounds, slow drag and elastic time without rules.",
        descriptionPt: "sons minimalistas com glitch, andamento lento e tempo elástico sem regras.",
        descriptionEs: "sonidos de glitch minimalistas, ritmo lento y tiempo elástico sin reglas."
      },
      {
        title: "Sunday Morning",
        duration: "1:11",
        description: "Neo-Soul warmth, physical rest and emotional decompression.",
        descriptionPt: "calor do Neo-Soul, descanso físico e descompressão emocional.",
        descriptionEs: "calidez de Neo-Soul, descanso físico y descompresión emocional."
      },
      {
        title: "Cycle (Outro)",
        duration: "1:23",
        description: "soft strings merging with the mechanical beginning; the clock starts again.",
        descriptionPt: "cordas suaves fundindo-se com o início mecânico; o relógio recomeça.",
        descriptionEs: "cuerdas suaves fusionándose con el inicio mecánico; el reloj comienza de nuevo."
      }
    ]
  }
];

interface SpotifyEmbedsProps {
  activeAlbum: AlbumData;
  onAlbumSelect: (album: AlbumData) => void;
  lang: Language;
}

export default function SpotifyEmbeds({ activeAlbum, onAlbumSelect, lang }: SpotifyEmbedsProps) {
  const [isPending, startTransition] = useTransition();

  const handleAlbumSelect = (album: AlbumData) => {
    startTransition(() => {
      onAlbumSelect(album);
    });
  };

  return (
    <div className="relative w-full z-10 space-y-10">
      
      {/* Target Selector Switchers with Swiss Technical Architecture */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
        {ALBUMS.map((album) => {
          const isActive = activeAlbum.id === album.id;
          const catNo = album.id === "beyond-gravity" ? "MTS-002" : "MTS-001";
          
          return (
            <button
              key={album.id}
              onClick={() => handleAlbumSelect(album)}
              className={`relative p-5 rounded-lg border text-left transition-all duration-200 overflow-hidden group cursor-pointer ${
                isActive
                  ? "bg-neutral-950/90 border-white/15"
                  : "bg-neutral-950/30 border-white/5 hover:border-white/12 hover:bg-neutral-900/30"
              }`}
              style={{
                boxShadow: isActive ? `0 12px 30px -5px ${album.colorTheme.glow}` : "none"
              }}
            >
              {/* Colored background aura hover trigger */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none"
                style={{
                  background: `radial-gradient(circle at 100% 0%, ${album.colorTheme.primary}, transparent 75%)`
                }}
              />

              <div className="flex justify-between items-center mb-3">
                <span className="font-mono text-[9px] tracking-[0.2em] text-neutral-400 flex items-center gap-1.5">
                  <span className="h-1 w-1 rounded-full animate-pulse" style={{ backgroundColor: album.colorTheme.primary }} />
                  {catNo} // {album.type}
                </span>
                <span className="font-mono text-[9px] text-neutral-500">
                  [{album.releaseYear}]
                </span>
              </div>

              <h4 className="font-display text-base font-bold text-white tracking-widest uppercase transition-colors duration-200 flex items-center gap-2">
                {album.title}
                {isActive && (
                  <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: album.colorTheme.primary }} />
                )}
              </h4>
              
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/[0.04]">
                <span className="font-mono text-[9px] text-neutral-400 uppercase tracking-wider truncate max-w-[80%]">
                  {album.id === "beyond-gravity" ? translations[lang].albumBeyondConcept : translations[lang].albumVoltaConcept}
                </span>
                <Disc 
                  size={12} 
                  className={`text-neutral-500 transition-all duration-700 ${
                    isActive ? "animate-spin text-white" : "group-hover:rotate-180"
                  }`}
                  style={{ 
                    animationDuration: "4s",
                    color: isActive ? album.colorTheme.primary : "inherit"
                  }}
                />
              </div>

              {/* Dynamic technical active frame indicator */}
              <div 
                className="absolute bottom-0 left-0 right-0 h-[2.5px] transition-all duration-300"
                style={{
                  transform: isActive ? "scaleX(1)" : "scaleX(0)",
                  backgroundColor: album.colorTheme.primary,
                  boxShadow: `0 0 8px ${album.colorTheme.primary}`
                }}
              />
            </button>
          );
        })}
      </div>

      {/* Dynamic Details Enclosure */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeAlbum.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-4"
        >
          {/* Abstract cover mockup / Narrative description */}
          <div className="lg:col-span-6 flex flex-col justify-between p-6 md:p-8 rounded-3xl border border-white/5 bg-[#0a0a0c]/80 backdrop-blur-md relative overflow-hidden">
            
            {/* Soft decorative blur */}
            <div 
              className="absolute -top-16 -left-16 w-48 h-48 rounded-full blur-3xl opacity-30 pointer-events-none"
              style={{ backgroundColor: activeAlbum.colorTheme.primary }}
            />

            <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
              
              {/* High-Fidelity Interactive Vinyl & Sleeve Mockup */}
              <div className="relative group/vinyl w-32 h-32 md:w-36 md:h-36 flex-shrink-0 select-none">
                
                {/* Concentric Circle Vinyl Record Disc */}
                <div 
                  className="absolute inset-0 rounded-full transition-all duration-700 ease-out translate-x-0 group-hover/vinyl:translate-x-12 xl:group-hover/vinyl:translate-x-14 group-hover/vinyl:rotate-[360deg] shadow-[0_12px_28px_rgba(0,0,0,0.8)] flex items-center justify-center pointer-events-none"
                  style={{
                    background: "repeating-radial-gradient(circle, #0e0f11 0px, #141518 2px, #08090a 4px, #1b1c20 6px, #111215 8px)",
                    boxShadow: "0 0 24px rgba(0,0,0,0.9), inset 0 0 12px rgba(255,255,255,0.06)",
                  }}
                >
                  {/* Subtle light reflections on the physical vinyl grooves */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/[0.04] via-transparent to-white/[0.04] mix-blend-screen" />
                  <div className="absolute inset-0 rounded-full bg-gradient-to-bl from-white/[0.02] via-transparent to-white/[0.02] mix-blend-screen" />
                  
                  {/* Custom Center Record Sticker Label */}
                  <div 
                    className="w-11 h-11 rounded-full flex items-center justify-center relative shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)] border border-neutral-900"
                    style={{
                      background: `radial-gradient(circle, ${activeAlbum.colorTheme.primary}aa, ${activeAlbum.colorTheme.secondary}dd)`
                    }}
                  >
                    {/* Micro detail label print */}
                    <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center">
                      <div className="w-2.5 h-2.5 rounded-full bg-neutral-950 border border-white/20" />
                    </div>
                  </div>

                  {/* Endless slow vinyl spinning effect on hover container */}
                  <span className="hidden group-hover/vinyl:inline absolute inset-0 rounded-full animate-spin border border-white/[0.03]" style={{ animationDuration: "8s" }} />
                </div>

                {/* Main Album Sleeve Cover Card Cover */}
                <div 
                  className="relative w-full h-full rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-br from-neutral-900 to-neutral-950 shadow-[0_8px_24px_rgba(0,0,0,0.5)] transition-all duration-500 group-hover/vinyl:-translate-x-2 z-10"
                >
                  {/* Glowing organic ambient artwork within the sleeve */}
                  <div 
                    className="absolute inset-0 opacity-25 filter blur-md transition-all duration-700 group-hover/vinyl:opacity-40 scale-110"
                    style={{
                      background: `radial-gradient(circle at 60% 40%, ${activeAlbum.colorTheme.primary}, ${activeAlbum.colorTheme.secondary})`
                    }}
                  />
                  
                  {/* Delicate high-tech geometric cybergrid overlay */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:10px_10px]" />
                  
                  {/* Dynamic Abstract Sound Wave Visualizer Graphics */}
                  <div className="absolute bottom-3.5 left-3.5 right-3.5 h-5 flex items-end gap-[1px] opacity-70">
                    {[2, 4, 3, 5, 2, 6, 4, 7, 3, 5, 8, 4, 6, 2, 5, 3, 4, 1].map((lvl, index) => (
                      <div 
                        key={index}
                        className="flex-1 bg-white/30 rounded-full"
                        style={{
                          height: `${lvl * 12}%`,
                          backgroundColor: index % 2 === 0 ? activeAlbum.colorTheme.primary : "#fff"
                        }}
                      />
                    ))}
                  </div>

                  {/* Album Cover Typography & Technical Specs */}
                  <div className="absolute top-3.5 left-3.5 right-3.5 flex flex-col pointer-events-none">
                    <span className="font-mono text-[7px] uppercase tracking-[0.25em] text-neutral-400">{activeAlbum.type} // RESISTANCE</span>
                    <span className="font-display text-[9px] md:text-[10px] uppercase tracking-tight font-bold text-white truncate max-w-[85%] mt-0.5">
                      {activeAlbum.title}
                    </span>
                  </div>

                  <div className="absolute top-3.5 right-3.5">
                    <Orbit size={10} className="text-neutral-500 animate-pulse" />
                  </div>

                  {/* Interactive sleeve border highlights */}
                  <div className="absolute inset-0 border border-white/5 group-hover/vinyl:border-white/15 transition-colors duration-500 rounded-2xl pointer-events-none" />
                </div>

              </div>

              <div className="flex-1 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2 mb-2.5">
                  <Music size={13} style={{ color: activeAlbum.colorTheme.primary }} />
                  <span className="font-mono text-[9px] tracking-widest text-[#00f0ff] uppercase" style={{ color: activeAlbum.colorTheme.primary }}>
                    {translations[lang].embedConceptNarrative}
                  </span>
                </div>
                
                <h3 className="font-display text-xl md:text-2xl font-bold tracking-tight text-white mb-3">
                  {activeAlbum.title}
                </h3>

                <p className="font-sans text-xs md:text-sm text-neutral-400 leading-relaxed mb-5">
                  {activeAlbum.id === "beyond-gravity" ? translations[lang].albumBeyondDesc : translations[lang].albumVoltaDesc}
                </p>

                <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4">
                  <div>
                    <span className="block font-mono text-[9px] text-neutral-400 tracking-wider">{lang === "en" ? "ATMOSPHERE" : lang === "es" ? "ATMÓSFERA" : "ATMOSFERA"}</span>
                    <span className="text-xs text-white font-medium">
                      {activeAlbum.id === "beyond-gravity" ? translations[lang].albumBeyondAtmosphere : translations[lang].albumVoltaAtmosphere}
                    </span>
                  </div>
                  <div>
                    <span className="block font-mono text-[9px] text-neutral-400 tracking-wider">{lang === "en" ? "CORE THEME" : lang === "es" ? "TEMA PRINCIPAL" : "TEMA CENTRAL"}</span>
                    <span className="text-xs text-white font-medium font-mono" style={{ color: activeAlbum.colorTheme.primary }}>
                      {activeAlbum.id === "beyond-gravity" ? translations[lang].albumBeyondCoreTheme : translations[lang].albumVoltaCoreTheme}
                    </span>
                  </div>
                </div>
              </div>

            </div>

            {/* Custom Interactive Tracklist Simulation */}
            <div className="mt-8">
              <span className="block font-mono text-[10px] text-neutral-400 tracking-wider mb-3">{translations[lang].embedReleaseSeq}</span>
              <div className="space-y-1.5 max-h-[300px] overflow-y-auto pr-1 select-none scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                {activeAlbum.tracklist.map((track, idx) => {
                  let title = "";
                  let duration = "";
                  let description = "";

                  if (typeof track === "string") {
                    const parts = track.split(" — ");
                    title = parts[0];
                    duration = parts[1] || "";
                  } else {
                    title = track.title;
                    duration = track.duration;
                    description = lang === "pt" && track.descriptionPt 
                      ? track.descriptionPt 
                      : lang === "es" && track.descriptionEs 
                        ? track.descriptionEs 
                        : (track.description || "");
                  }
                  return (
                    <div 
                      key={idx}
                      className="flex flex-col p-2.5 rounded-lg bg-white/[0.01] hover:bg-white/[0.03] border border-white/[0.02] transition-colors group/track gap-1 text-left"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-xs text-neutral-500 w-5 text-right">{String(idx + 1).padStart(2, "0")}</span>
                          <span className="text-xs text-neutral-300 group-hover/track:text-white transition-colors font-medium">{title}</span>
                        </div>
                        <div className="flex items-center gap-2.5">
                          {duration && (
                            <span className="font-mono text-[10px] text-neutral-400">{duration}</span>
                          )}
                          <PlayCircle size={12} className="text-neutral-500 group-hover/track:text-white transition-opacity duration-300" />
                        </div>
                      </div>
                      {description && (
                        <p className="font-mono text-[9.5px] text-neutral-500 group-hover/track:text-neutral-400 pl-8 leading-relaxed">
                          {description}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Actual Embedded Spotify Playback Widget */}
          <div className="lg:col-span-6 rounded-3xl border border-white/5 bg-[#0a0a0c]/80 backdrop-blur-md p-4 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none z-10" />
            
            <div className="flex items-center justify-between mb-4 px-2">
              <span className="font-mono text-[10px] text-neutral-400 tracking-widest uppercase">{translations[lang].embedPlayerLabel}</span>
              <a
                href={activeAlbum.spotifyUrl}
                target="_blank"
                rel="no-referrer"
                className="text-[11px] font-mono text-neutral-400 hover:text-white transition-colors flex items-center gap-1 hover:underline"
              >
                {translations[lang].embedOpenSpotify} <ExternalLink size={10} />
              </a>
            </div>

            {/* Spotify Embedded Iframe */}
            <div className="w-full h-[352px] md:h-[352px] rounded-2xl overflow-hidden shadow-2xl relative bg-black/60 z-20">
              <iframe
                src={activeAlbum.embedUrl}
                width="100%"
                height="100%"
                frameBorder="0"
                allowFullScreen={false}
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                style={{ border: 0 }}
                loading="lazy"
                title={`${activeAlbum.title} player`}
              />
            </div>

            <div className="mt-4 px-2 flex justify-between items-center text-[10px] font-mono text-neutral-400">
              <span>FORMAT: 320KBPS / FLAC</span>
              <span className="flex items-center gap-1.5 animate-pulse">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500" /> {translations[lang].embedSynced}
              </span>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
