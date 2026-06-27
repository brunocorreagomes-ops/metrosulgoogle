import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Language } from "../locales";

interface SectionItem {
  id: string;
  labelEn: string;
  labelPt: string;
  labelEs: string;
  color: string; // Hex color for active state glow
}

const SECTIONS: SectionItem[] = [
  { id: "hero", labelEn: "START", labelPt: "INÍCIO", labelEs: "INICIO", color: "#009DFF" },
  { id: "upcoming", labelEn: "OVERFLOW", labelPt: "OVERFLOW", labelEs: "OVERFLOW", color: "#FFAA00" },
  { id: "manifesto", labelEn: "SIGNAL", labelPt: "SINAL", labelEs: "SEÑAL", color: "#7C3AED" },
  { id: "music", labelEn: "LATEST", labelPt: "LATEST", labelEs: "LATEST", color: "#009DFF" },
  { id: "synthesizer", labelEn: "CONSOLE", labelPt: "CONSOLE", labelEs: "CONSOLA", color: "#FFAA00" },
  { id: "about", labelEn: "ARCHIVE", labelPt: "ARCHIVE", labelEs: "ARCHIVE", color: "#009DFF" },
  { id: "contact", labelEn: "CONTACT", labelPt: "CONTACT", labelEs: "CONTACTO", color: "#FFAA00" },
];

interface ScrollSpyIndicatorProps {
  lang: Language;
  activeSection: string;
}

export default function ScrollSpyIndicator({ lang, activeSection }: ScrollSpyIndicatorProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const getLabel = (sec: SectionItem) => {
    if (lang === "pt") return sec.labelPt;
    if (lang === "es") return sec.labelEs;
    return sec.labelEn;
  };

  return (
    <div 
      className="fixed right-3 md:right-6 top-1/2 -translate-y-1/2 z-40 flex flex-col items-end gap-3.5 md:gap-4.5 pointer-events-none select-none"
      id="scroll-spy-container"
    >
      {SECTIONS.map((sec, idx) => {
        const isActive = activeSection === sec.id;
        const isHovered = hoveredIdx === idx;
        const displayLabel = getLabel(sec);

        return (
          <div
            key={sec.id}
            className="flex items-center gap-3 pointer-events-auto cursor-pointer group py-1.5 pl-4"
            onClick={() => handleScrollTo(sec.id)}
            onMouseEnter={() => setHoveredIdx(idx)}
            onMouseLeave={() => setHoveredIdx(null)}
          >
            {/* Label sliding from right */}
            <AnimatePresence>
              {(isActive || isHovered) && (
                <motion.span
                  initial={{ opacity: 0, x: 10, filter: "blur(4px)" }}
                  animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, x: 8, filter: "blur(2px)" }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="font-mono text-[9px] tracking-[0.25em] font-bold text-right pointer-events-none hidden sm:inline"
                  style={{ 
                    color: isActive ? sec.color : "rgba(255, 255, 255, 0.45)",
                    textShadow: isActive ? `0 0 8px ${sec.color}40` : "none"
                  }}
                >
                  {displayLabel}
                </motion.span>
              )}
            </AnimatePresence>

            {/* Indicator Dot Container */}
            <div className="relative w-5 h-5 flex items-center justify-center">
              {/* Outer glowing halo on active state */}
              {isActive && (
                <motion.div
                  layoutId="activeDotGlow"
                  className="absolute inset-0 rounded-full border border-white/10 z-0"
                  style={{ 
                    borderColor: `${sec.color}35`,
                    boxShadow: `0 0 10px ${sec.color}15, inset 0 0 10px ${sec.color}10` 
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}

              {/* Faint dot connector track (only background vertical lines) */}
              {idx < SECTIONS.length - 1 && (
                <div 
                  className="absolute bottom-[-14px] left-1/2 -translate-x-1/2 w-[0.5px] h-3.5 bg-white/5 pointer-events-none" 
                  style={{ 
                    background: isActive ? `linear-gradient(to bottom, ${sec.color}40, rgba(255,255,255,0.05))` : undefined 
                  }}
                />
              )}

              {/* Core interactive dot */}
              <motion.div
                animate={{
                  scale: isActive ? 1.3 : isHovered ? 1.15 : 1,
                  backgroundColor: isActive ? sec.color : isHovered ? "rgba(255, 255, 255, 0.55)" : "rgba(255, 255, 255, 0.15)",
                  boxShadow: isActive ? `0 0 10px ${sec.color}` : "none"
                }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="w-1.5 h-1.5 rounded-full z-10"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
