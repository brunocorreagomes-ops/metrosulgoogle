import React, { useEffect, useRef } from "react";

interface OrbitalPortalProps {
  intensity: number;
}

export default function OrbitalPortal({ intensity }: OrbitalPortalProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: false });
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 480);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 480);

    const handleResize = () => {
      if (!canvasRef.current) return;
      width = canvasRef.current.width = canvasRef.current.parentElement?.clientWidth || 480;
      height = canvasRef.current.height = canvasRef.current.parentElement?.clientHeight || 480;
    };

    window.addEventListener("resize", handleResize);

    // Minimal elegant particle definition
    interface DustParticle {
      x: number;
      y: number;
      r: number;
      angle: number;
      speed: number;
      size: number;
      alpha: number;
      color: "blue" | "orange";
    }

    let particles: DustParticle[] = [];

    const spawnParticle = (color: "blue" | "orange") => {
      particles.push({
        x: 0,
        y: 0,
        r: Math.random() * Math.min(width, height) * 0.45,
        angle: Math.random() * Math.PI * 2,
        speed: 0.001 + Math.random() * 0.002, // very slow
        size: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.4 + 0.1,
        color
      });
    };

    // Pre-populate minimal particles
    for (let i = 0; i < 40; i++) {
      spawnParticle(Math.random() > 0.5 ? "blue" : "orange");
    }

    let audioSmoothed = 1.0;
    let globalRotation = 0;

    const draw = () => {
      // Cinematic dark trail backplate
      ctx.fillStyle = "rgba(1, 2, 4, 0.1)"; // Very deep dark midnight
      ctx.fillRect(0, 0, width, height);

      const time = Date.now() * 0.001;

      // Read audio analyzer if available
      let currentAudioVal = 1.0;
      const analyser = (window as any).__metroAnalyser;
      if (analyser) {
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const avg = sum / bufferLength;
        currentAudioVal = 1.0 + (avg / 64) * intensity;
      }

      audioSmoothed += (currentAudioVal - audioSmoothed) * 0.05; // Very smooth ease
      globalRotation += 0.001 * audioSmoothed; // Slow elegant rotation

      const cx = width / 2;
      const cy = height / 2;
      const baseRadius = Math.min(width, height) * 0.3;

      // Draw minimal particles
      particles.forEach((p) => {
        p.angle += p.speed * (p.color === "blue" ? 1 : -1) * audioSmoothed;
        p.x = cx + Math.cos(p.angle) * p.r;
        p.y = cy + Math.sin(p.angle) * p.r;
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        const pulseAlpha = p.alpha * (0.6 + 0.4 * Math.sin(time * 2 + p.angle));
        ctx.fillStyle = p.color === "blue" ? `rgba(0, 157, 255, ${pulseAlpha})` : `rgba(255, 136, 0, ${pulseAlpha})`;
        ctx.fill();
      });

      // Subtle rising golden light suggesting abundance
      const goldenGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, baseRadius * 1.5);
      goldenGlow.addColorStop(0, `rgba(255, 170, 0, ${0.03 * audioSmoothed})`); // Very subtle central gold
      goldenGlow.addColorStop(1, "rgba(255, 170, 0, 0)");
      ctx.fillStyle = goldenGlow;
      ctx.fillRect(0, 0, width, height);

      // Elegant arcs (left blue, right amber)
      ctx.shadowBlur = 10 * audioSmoothed;

      // Blue arc
      ctx.shadowColor = "rgba(0, 157, 255, 0.4)";
      ctx.strokeStyle = "rgba(0, 157, 255, 0.4)"; // Soft blue line
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      // Rotate slowly with the system
      ctx.arc(cx, cy, baseRadius, Math.PI * 0.6 + globalRotation, Math.PI * 1.4 + globalRotation);
      ctx.stroke();

      // Amber arc
      ctx.shadowColor = "rgba(255, 136, 0, 0.4)";
      ctx.strokeStyle = "rgba(255, 136, 0, 0.4)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(cx, cy, baseRadius, -Math.PI * 0.4 + globalRotation, Math.PI * 0.4 + globalRotation);
      ctx.stroke();

      ctx.shadowBlur = 0; // Reset

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
    };
  }, [intensity]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex items-center justify-center select-none cursor-default group"
    >
      {/* Background Interactive Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 block w-full h-full pointer-events-none z-0"
      />

      {/* Cinematic central design overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 text-center select-none px-4">
        
        {/* METRO SUL logo text and symbol elements styled minimally */}
        <div className="absolute flex flex-col items-center justify-center pointer-events-none select-none">

          {/* Central Logo Symbol: Blue/orange circular arcs with three vertical bars at center */}
          <div className="relative w-32 h-32 flex items-center justify-center transition-all duration-1000 group-hover:scale-[1.02] mb-4">
            <svg width="112" height="112" viewBox="0 0 100 100" className="drop-shadow-[0_0_20px_rgba(0,157,255,0.15)] transition-all duration-700 group-hover:drop-shadow-[0_0_30px_rgba(255,136,0,0.2)]">
              {/* Left blue arc */}
              <path 
                d="M 38 10 A 42 42 0 0 0 38 90" 
                fill="none" 
                stroke="#009DFF" 
                strokeWidth="4" 
                strokeLinecap="round" 
                className="opacity-80"
              />
              {/* Right orange/amber arc */}
              <path 
                d="M 62 10 A 42 42 0 0 1 62 90" 
                fill="none" 
                stroke="#FF8800" 
                strokeWidth="4" 
                strokeLinecap="round" 
                className="opacity-80"
              />
              {/* Three vertical bars pulsing softly */}
              <rect x="42" y="30" width="2" height="40" rx="1" fill="#FFFFFF" className="opacity-70 group-hover:opacity-100 transition-opacity duration-1000" />
              <rect x="49" y="20" width="2" height="60" rx="1" fill="#FFC000" className="opacity-90 group-hover:opacity-100 transition-opacity duration-1000 drop-shadow-[0_0_8px_rgba(255,192,0,0.5)]" />
              <rect x="56" y="30" width="2" height="40" rx="1" fill="#FFFFFF" className="opacity-70 group-hover:opacity-100 transition-opacity duration-1000" />
            </svg>
          </div>

          <h2 className="font-display text-2xl sm:text-3xl font-light tracking-[0.45em] pl-[0.45em] uppercase leading-none mt-2 text-white/90">
            M<span className="text-[#009DFF]/90 font-medium">≡</span>TRO SUL
          </h2>

          <span className="font-mono text-[8px] text-neutral-500 uppercase tracking-[0.5em] mt-6 group-hover:text-neutral-400 transition-colors duration-1000">
            FREQUENCY // ABUNDANCE
          </span>
        </div>
      </div>
    </div>
  );
}
