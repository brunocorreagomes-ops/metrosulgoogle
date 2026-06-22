import { useState, useTransition } from "react";
import { Disc, ExternalLink, Music, Sparkles, Orbit, Clock, PlayCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { AlbumData } from "../types";

export const ALBUMS: AlbumData[] = [
  {
    id: "beyond-gravity",
    title: "Beyond Gravity",
    type: "EP",
    releaseYear: 2026,
    spotifyUrl: "https://open.spotify.com/intl-pt/album/3F10JFx7wrz3scGyBUY3ES",
    embedUrl: "https://open.spotify.com/embed/album/3F10JFx7wrz3scGyBUY3ES?utm_source=generator&theme=0",
    colorTheme: {
      primary: "#00f0ff", // Bioluminescent Cyan
      secondary: "#7000ff", // Deep Space Purple
      glow: "rgba(0, 240, 255, 0.15)",
      ambient: "from-[#00f0ff]/10 via-[#7000ff]/5 to-transparent"
    },
    concept: "Hyper-resonance & Gravity Warps",
    description: "An evolutionary leap in deep techno landscapes. 'Beyond Gravity' represents an exploration of modular systems shifting through weightlessness. Fusing organic bioluminescent soundscapes with high-pressure cybernetic bass lines.",
    trackCount: 4,
    atmosphere: "Atmospheric, Ethereal, Heavy Low-Ends",
    tracklist: [
      "Wake The Earth — 5:17",
      "Feel The Earth — 6:15",
      "Break Through — 4:01",
      "Out Of My Head — 6:57"
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
      primary: "#ff455b", // Solar Sunset Crimson
      secondary: "#bd00ff", // Violet Plasma
      glow: "rgba(255, 69, 91, 0.15)",
      ambient: "from-[#ff455b]/10 via-[#bd00ff]/5 to-transparent"
    },
    concept: "Temporal Duality: Chronos vs. Kairos",
    description: "A dual-faceted deep dive into the properties of time. 'VOLTA' explores the mechanical progression of linear schedules (Chronos) versus the opportune, suspended fluid moments of pure existence (Kairos). Intense modular rhythms colliding with dramatic string washes and cosmic stardust sweeps.",
    trackCount: 15,
    atmosphere: "Fast-paced, Relentless, Cinematic Melodics",
    tracklist: [
      "Pressure (9 to 5) — 3:04",
      "Transit — 2:34",
      "Velvet Rope — 3:22",
      "Ignition — 2:56",
      "Syncopate — 2:24",
      "Kairos (The Moment) — 3:24",
      "Chemistry — 2:33",
      "Smoke & Mirrors (Interlude) — 1:38",
      "Second Wind — 2:16",
      "Echoes in the Hall — 2:59",
      "Blue Hour — 3:11",
      "Taxi (The Ride Home) — 1:38",
      "Afters (Apartment 4B) — 1:42",
      "Sunday Morning — 1:11",
      "Cycle (Outro) — 1:23"
    ]
  }
];

interface SpotifyEmbedsProps {
  activeAlbum: AlbumData;
  onAlbumSelect: (album: AlbumData) => void;
}

export default function SpotifyEmbeds({ activeAlbum, onAlbumSelect }: SpotifyEmbedsProps) {
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
                  {album.concept}
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

              {/* Album Metadata & Narrative Description Column */}
              <div className="flex-1 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2 mb-2.5">
                  <Music size={13} style={{ color: activeAlbum.colorTheme.primary }} />
                  <span className="font-mono text-[9px] tracking-widest text-[#00f0ff] uppercase" style={{ color: activeAlbum.colorTheme.primary }}>
                    CONCEPT &amp; NARRATIVE
                  </span>
                </div>
                
                <h3 className="font-display text-xl md:text-2xl font-bold tracking-tight text-white mb-3">
                  {activeAlbum.title}
                </h3>

                <p className="font-sans text-xs md:text-sm text-neutral-400 leading-relaxed mb-5">
                  {activeAlbum.description}
                </p>

                <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4">
                  <div>
                    <span className="block font-mono text-[9px] text-neutral-400 tracking-wider">ATMOSPHERE</span>
                    <span className="text-xs text-white font-medium">{activeAlbum.atmosphere}</span>
                  </div>
                  <div>
                    <span className="block font-mono text-[9px] text-neutral-400 tracking-wider">CORE THEME</span>
                    <span className="text-xs text-white font-medium font-mono" style={{ color: activeAlbum.colorTheme.primary }}>
                      {activeAlbum.id === "beyond-gravity" ? "BIOLUMINESCENT TECH" : "TEMPORAL WARP"}
                    </span>
                  </div>
                </div>
              </div>

            </div>

            {/* Custom Interactive Tracklist Simulation */}
            <div className="mt-8">
              <span className="block font-mono text-[10px] text-neutral-400 tracking-wider mb-3">RELEASE SEQUENCE</span>
              <div className="space-y-1.5 max-h-[300px] overflow-y-auto pr-1 select-none scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                {activeAlbum.tracklist.map((track, idx) => {
                  const parts = track.split(" — ");
                  const title = parts[0];
                  const duration = parts[1] || "";
                  return (
                    <div 
                      key={idx}
                      className="flex items-center justify-between p-2 rounded-lg bg-white/[0.01] hover:bg-white/[0.03] border border-white/[0.02] transition-colors group/track"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs text-neutral-500 w-5 text-right">{String(idx + 1).padStart(2, "0")}</span>
                        <span className="text-xs text-neutral-300 group-hover/track:text-white transition-colors">{title}</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        {duration && (
                          <span className="font-mono text-[10px] text-neutral-400">{duration}</span>
                        )}
                        <PlayCircle size={12} className="text-neutral-500 group-hover/track:text-white transition-opacity duration-300" />
                      </div>
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
              <span className="font-mono text-[10px] text-neutral-400 tracking-widest uppercase">OFFICIAL SPOTIFY PLAYER</span>
              <a
                href={activeAlbum.spotifyUrl}
                target="_blank"
                rel="no-referrer"
                className="text-[11px] font-mono text-neutral-400 hover:text-white transition-colors flex items-center gap-1 hover:underline"
              >
                Open in Spotify <ExternalLink size={10} />
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
                <span className="h-1.5 w-1.5 rounded-full bg-green-500" /> SPOTIFY SYNCED
              </span>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
