import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

export default function SignalConduit() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Track scroll progress of this container across the viewport
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Map the scroll progress to create visual scroll-linked responses
  // The path starts drawing as it enters and finishes as it moves through
  const pathLength = useTransform(scrollYProgress, [0.1, 0.75], [0, 1]);
  
  // Fade in the line as it comes into the center of the viewport and out as it leaves
  const opacity = useTransform(scrollYProgress, [0.05, 0.25, 0.75, 0.95], [0, 1, 1, 0]);
  
  // Map the position of the traveling energy packet to the scroll
  const dotY = useTransform(scrollYProgress, [0.1, 0.75], ["2.5%", "97.5%"]);

  return (
    <div 
      ref={containerRef} 
      className="relative w-full h-44 md:h-64 flex flex-col items-center justify-center overflow-visible select-none my-4"
      id="signal-conduit"
    >
      <style>{`
        @keyframes conduitDashFlow {
          from {
            stroke-dashoffset: 80;
          }
          to {
            stroke-dashoffset: 0;
          }
        }
      `}</style>

      {/* Decorative vertical light field behind the wire */}
      <motion.div 
        style={{ opacity }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <div className="w-[160px] h-[160px] rounded-full bg-gradient-to-b from-[#009DFF]/[0.02] to-[#FFAA00]/[0.02] blur-2xl" />
      </motion.div>

      {/* SVG Canvas for the precision line work */}
      <motion.svg 
        style={{ opacity }}
        className="w-16 h-full overflow-visible z-10"
        viewBox="0 0 40 200"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="conduit-grad-vertical" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#009DFF" />
            <stop offset="50%" stopColor="#7C3AED" />
            <stop offset="100%" stopColor="#FFAA00" />
          </linearGradient>
          <filter id="conduit-glow-filter" x="-50%" y="-20%" width="200%" height="140%">
            <feGaussianBlur stdDeviation="1.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Top node receptor */}
        <circle cx="20" cy="5" r="2" fill="#009DFF" />
        <circle cx="20" cy="5" r="4.5" fill="none" stroke="#009DFF" strokeWidth="0.5" className="opacity-40 animate-ping" style={{ animationDuration: '3s' }} />

        {/* 1. Underlying faint dashed track line (the physical conduit wire) */}
        <line 
          x1="20" 
          y1="5" 
          x2="20" 
          y2="195" 
          stroke="rgba(255, 255, 255, 0.08)" 
          strokeWidth="0.5" 
          strokeDasharray="2 3"
          vectorEffect="non-scaling-stroke"
        />

        {/* 2. Scroll-linked path that draws itself based on user scroll */}
        <motion.path
          d="M 20 5 L 20 195"
          fill="none"
          stroke="url(#conduit-grad-vertical)"
          strokeWidth="0.75"
          style={{ pathLength }}
          filter="url(#conduit-glow-filter)"
          className="opacity-95"
          vectorEffect="non-scaling-stroke"
        />

        {/* 3. Constant flowing electric energy pulse using CSS dash-offset */}
        <path
          d="M 20 5 L 20 195"
          fill="none"
          stroke="url(#conduit-grad-vertical)"
          strokeWidth="1.2"
          strokeDasharray="20 40"
          style={{ 
            animation: 'conduitDashFlow 2.5s linear infinite',
            opacity: 0.75
          }}
          filter="url(#conduit-glow-filter)"
          vectorEffect="non-scaling-stroke"
        />

        {/* Bottom node receptor */}
        <circle cx="20" cy="195" r="2" fill="#FFAA00" />
        <circle cx="20" cy="195" r="4.5" fill="none" stroke="#FFAA00" strokeWidth="0.5" className="opacity-40 animate-ping" style={{ animationDuration: '4s' }} />
      </motion.svg>

      {/* Travelling glow particle that tracks the exact scroll progress */}
      <motion.div
        style={{ 
          top: dotY,
          opacity,
          scale: [0.95, 1.15, 0.95]
        }}
        className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_6px_#009DFF,0_0_12px_#FFAA00] z-20 pointer-events-none"
      />

      {/* Side branching micro glow fields */}
      <div className="absolute left-1/2 -translate-x-1/2 w-24 h-full pointer-events-none z-10 overflow-hidden">
        <div className="absolute top-[25%] left-[20%] w-1 h-1 rounded-full bg-[#009DFF] opacity-20 animate-ping" style={{ animationDuration: '2.5s' }} />
        <div className="absolute top-[75%] right-[20%] w-1 h-1 rounded-full bg-[#FFAA00] opacity-20 animate-ping" style={{ animationDuration: '3.5s' }} />
      </div>
    </div>
  );
}
