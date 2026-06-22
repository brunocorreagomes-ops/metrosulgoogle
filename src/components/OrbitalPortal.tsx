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
        speed: 0.0005 + Math.random() * 0.001, // extremely slow and elegant
        size: Math.random() * 1.2 + 0.3, // smaller and softer
        alpha: Math.random() * 0.2 + 0.05, // very subtle
        color
      });
    };

    // Pre-populate even fewer minimal particles for less clutter
    for (let i = 0; i < 20; i++) {
      spawnParticle(Math.random() > 0.5 ? "blue" : "orange");
    }

    let audioSmoothed = 1.0;
    let globalRotation = 0;

    const draw = () => {
      // Cinematic dark trail backplate
      ctx.fillStyle = "rgba(1, 2, 4, 0.08)"; // Slower fade for smooth energy traces
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

      audioSmoothed += (currentAudioVal - audioSmoothed) * 0.03; // Even smoother ease
      globalRotation += 0.0008 * audioSmoothed; // Ultra slow elegant rotation

      const cx = width / 2;
      const cy = height / 2;
      const baseRadius = Math.min(width, height) * 0.32;

      // Draw minimal particles
      particles.forEach((p) => {
        p.angle += p.speed * (p.color === "blue" ? 1 : -1) * audioSmoothed;
        p.x = cx + Math.cos(p.angle) * p.r;
        p.y = cy + Math.sin(p.angle) * p.r;
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        const pulseAlpha = p.alpha * (0.5 + 0.5 * Math.sin(time + p.angle));
        ctx.fillStyle = p.color === "blue" ? `rgba(0, 157, 255, ${pulseAlpha})` : `rgba(255, 136, 0, ${pulseAlpha})`;
        ctx.fill();
      });

      // Subtle rising golden light suggesting abundance
      const goldenGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, baseRadius * 1.5);
      goldenGlow.addColorStop(0, `rgba(255, 170, 0, ${0.04 * audioSmoothed})`); // Very soft breathing gold
      goldenGlow.addColorStop(1, "rgba(255, 170, 0, 0)");
      ctx.fillStyle = goldenGlow;
      ctx.fillRect(0, 0, width, height);

      // Elegant arcs (left blue, right amber)
      ctx.shadowBlur = 15 * audioSmoothed;

      // Blue arc (made more subtle and minimal)
      ctx.shadowColor = "rgba(0, 157, 255, 0.3)";
      ctx.strokeStyle = "rgba(0, 157, 255, 0.2)"; // Soft, faint blue line
      ctx.lineWidth = 1;
      ctx.beginPath();
      // Rotate slowly with the system
      ctx.arc(cx, cy, baseRadius, Math.PI * 0.65 + globalRotation, Math.PI * 1.35 + globalRotation);
      ctx.stroke();

      // Amber arc (made more subtle and minimal)
      ctx.shadowColor = "rgba(255, 136, 0, 0.3)";
      ctx.strokeStyle = "rgba(255, 136, 0, 0.2)"; // Soft, faint amber line
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, baseRadius, -Math.PI * 0.35 + globalRotation, Math.PI * 0.35 + globalRotation);
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
          <div className="relative w-48 h-48 flex items-center justify-center transition-all duration-1000 group-hover:scale-[1.02]">
            <svg width="160" height="160" viewBox="0 0 100 100" className="drop-shadow-[0_0_25px_rgba(0,157,255,0.2)] transition-all duration-700 group-hover:drop-shadow-[0_0_40px_rgba(255,136,0,0.3)]">
               {/* Left blue arc */}
               <path 
                 d="M 38 10 A 42 42 0 0 0 38 90" 
                 fill="none" 
                 stroke="#009DFF" 
                 strokeWidth="3.5" 
                 strokeLinecap="round" 
                 className="opacity-90"
               />
               {/* Right orange/amber arc */}
               <path 
                 d="M 62 10 A 42 42 0 0 1 62 90" 
                 fill="none" 
                 stroke="#FF8800" 
                 strokeWidth="3.5" 
                 strokeLinecap="round" 
                 className="opacity-90"
               />
               {/* Three vertical bars pulsing softly and bright */}
               <rect x="42.5" y="30" width="2" height="40" rx="1" fill="#FFFFFF" className="opacity-90 group-hover:opacity-100 transition-opacity duration-1000" />
               <rect x="49" y="20" width="2" height="60" rx="1" fill="#FFD700" className="opacity-100 group-hover:opacity-100 transition-opacity duration-1000 drop-shadow-[0_0_12px_rgba(255,215,0,0.8)]" />
               <rect x="55.5" y="30" width="2" height="40" rx="1" fill="#FFFFFF" className="opacity-90 group-hover:opacity-100 transition-opacity duration-1000" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
