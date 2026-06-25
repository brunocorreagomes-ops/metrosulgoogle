import React from "react";
import { motion } from "motion/react";

export default function ArchitectCover() {
  // Generate coordinates for the elegant rising fibers at the bottom
  const fibers = [
    { startX: 20, cpX1: 38, cpX2: 45, opacity: 0.15, strokeWidth: 0.8 },
    { startX: 25, cpX1: 40, cpX2: 46, opacity: 0.25, strokeWidth: 1.0 },
    { startX: 30, cpX1: 42, cpX2: 47, opacity: 0.4, strokeWidth: 1.2 },
    { startX: 35, cpX1: 44, cpX2: 48, opacity: 0.6, strokeWidth: 1.4 },
    { startX: 40, cpX1: 46, cpX2: 49, opacity: 0.8, strokeWidth: 1.6 },
    { startX: 44, cpX1: 48, cpX2: 49.5, opacity: 0.9, strokeWidth: 1.8 },
    { startX: 47, cpX1: 49, cpX2: 49.8, opacity: 1.0, strokeWidth: 2.0 },
    // Center-ish line
    { startX: 50, cpX1: 50, cpX2: 50, opacity: 1.0, strokeWidth: 2.2 },
    // Right side
    { startX: 53, cpX1: 51, cpX2: 50.2, opacity: 1.0, strokeWidth: 2.0 },
    { startX: 56, cpX1: 52, cpX2: 50.5, opacity: 0.9, strokeWidth: 1.8 },
    { startX: 60, cpX1: 54, cpX2: 51, opacity: 0.8, strokeWidth: 1.6 },
    { startX: 65, cpX1: 56, cpX2: 52, opacity: 0.6, strokeWidth: 1.4 },
    { startX: 70, cpX1: 58, cpX2: 53, opacity: 0.4, strokeWidth: 1.2 },
    { startX: 75, cpX1: 60, cpX2: 54, opacity: 0.25, strokeWidth: 1.0 },
    { startX: 80, cpX1: 62, cpX2: 55, opacity: 0.15, strokeWidth: 0.8 },
  ];

  return (
    <div className="relative w-full aspect-square max-w-[360px] mx-auto rounded-2xl overflow-hidden bg-black border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.9)] group/cover flex flex-col justify-between p-6 select-none select-none">
      
      {/* Background radial ambient glows to match the album artwork feel */}
      <div className="absolute inset-0 bg-radial-gradient pointer-events-none" 
        style={{
          background: "radial-gradient(circle at 50% 50%, rgba(255, 136, 0, 0.08) 0%, rgba(0, 157, 255, 0.05) 50%, transparent 100%)"
        }}
      />
      
      {/* Subtle background noise texture */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-40" />

      {/* Top Title: METRO SUL */}
      <div className="text-center z-10 pt-1">
        <h4 className="font-display text-[13px] tracking-[0.55em] font-light text-white pl-[0.55em] uppercase select-none opacity-90 group-hover/cover:opacity-100 transition-opacity duration-500">
          M<span className="text-[#009DFF] font-normal">≡</span>T R O &nbsp; S U L
        </h4>
      </div>

      {/* Main Core Graphic */}
      <div className="relative flex-1 w-full flex items-center justify-center py-2">
        <svg 
          viewBox="0 0 100 100" 
          className="w-full h-full max-w-[240px] drop-shadow-[0_0_35px_rgba(0,157,255,0.15)] transition-all duration-1000 group-hover/cover:drop-shadow-[0_0_50px_rgba(255,136,0,0.25)]"
        >
          {/* Definitions for gorgeous premium gradients and filters */}
          <defs>
            {/* Left Electric Blue Arc Gradient */}
            <linearGradient id="blueArcGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#37D8FF" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#005BFF" stopOpacity="0.9" />
            </linearGradient>

            {/* Right Combustion Orange Arc Gradient */}
            <linearGradient id="orangeArcGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFAA00" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#FF4500" stopOpacity="0.9" />
            </linearGradient>

            {/* Rising fibers gradient: Gold/Orange to white at the top center */}
            <linearGradient id="fiberGrad" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#FF4500" stopOpacity="0" />
              <stop offset="30%" stopColor="#FF8800" stopOpacity="0.5" />
              <stop offset="70%" stopColor="#FFD700" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="1" />
            </linearGradient>

            {/* Ambient center glow */}
            <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFC000" stopOpacity="0.25" />
              <stop offset="40%" stopColor="#FF8800" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Central radial glow */}
          <circle cx="50%" cy="50%" r="35" fill="url(#centerGlow)" pointerEvents="none" className="animate-pulse" style={{ animationDuration: "4s" }} />

          {/* Rising glowing fibers (The stunning tree of light from the bottom) */}
          <g className="opacity-90">
            {fibers.map((f, i) => (
              <motion.path
                key={i}
                d={`M ${f.startX} 98 C ${f.cpX1} 94, ${f.cpX2} 85, 50 78`}
                fill="none"
                stroke="url(#fiberGrad)"
                strokeWidth={f.strokeWidth}
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: f.opacity }}
                transition={{
                  duration: 2 + Math.random() * 1.5,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut",
                  delay: Math.random() * 0.5,
                }}
              />
            ))}
          </g>

          {/* Tiny rising sparks particles above the fiber tips */}
          <g>
            {[...Array(8)].map((_, i) => (
              <motion.circle
                key={i}
                cx={50 + (Math.random() - 0.5) * 6}
                cy={78 - Math.random() * 12}
                r={0.4 + Math.random() * 0.6}
                fill="#FFD700"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: [0, 0.9, 0], y: -15 }}
                transition={{
                  duration: 1.5 + Math.random() * 1,
                  repeat: Infinity,
                  ease: "easeOut",
                  delay: i * 0.25,
                }}
              />
            ))}
          </g>

          {/* Left Electric Blue Symmetrical Arc */}
          <motion.path 
            d="M 38 14 A 39 39 0 0 0 38 86" 
            fill="none" 
            stroke="url(#blueArcGrad)" 
            strokeWidth="3.2" 
            strokeLinecap="round"
            className="drop-shadow-[0_0_10px_rgba(0,157,255,0.7)]"
            animate={{ strokeDashoffset: [0, 5, 0], opacity: [0.85, 1, 0.85] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Right Fire Orange Symmetrical Arc */}
          <motion.path 
            d="M 62 14 A 39 39 0 0 1 62 86" 
            fill="none" 
            stroke="url(#orangeArcGrad)" 
            strokeWidth="3.2" 
            strokeLinecap="round"
            className="drop-shadow-[0_0_10px_rgba(255,69,0,0.7)]"
            animate={{ strokeDashoffset: [0, -5, 0], opacity: [0.85, 1, 0.85] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Three Vertical Bars Pulsing softly like a frequency signal */}
          {/* Left Bar */}
          <motion.rect 
            x="42.5" 
            y="37" 
            width="2" 
            height="36" 
            rx="1" 
            fill="#FFFFFF" 
            className="opacity-90 drop-shadow-[0_0_6px_rgba(255,255,255,0.8)]"
            animate={{ height: [36, 32, 36], y: [37, 39, 37] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          
          {/* Center Bar (Primary golden energy spike) */}
          <motion.rect 
            x="49" 
            y="25" 
            width="2" 
            height="53" 
            rx="1" 
            fill="#FFD700" 
            className="opacity-100 drop-shadow-[0_0_12px_rgba(255,215,0,0.95)]"
            animate={{ height: [53, 56, 53], y: [25, 23.5, 25] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          />
          
          {/* Right Bar */}
          <motion.rect 
            x="55.5" 
            y="37" 
            width="2" 
            height="36" 
            rx="1" 
            fill="#FFFFFF" 
            className="opacity-90 drop-shadow-[0_0_6px_rgba(255,255,255,0.8)]"
            animate={{ height: [36, 34, 36], y: [37, 38, 37] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
          />
        </svg>
      </div>

      {/* Bottom Title: ARCHITECT OF OVERFLOW */}
      <div className="text-center z-10 pb-1 flex flex-col items-center gap-1">
        <h5 className="font-display text-[9px] tracking-[0.45em] font-medium text-white/90 pl-[0.45em] uppercase select-none group-hover/cover:text-white transition-colors">
          ARCHITECT OF OVERFLOW
        </h5>
        <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-[#FF8800]/50 to-transparent opacity-60 group-hover/cover:w-20 transition-all duration-700" />
      </div>

    </div>
  );
}
