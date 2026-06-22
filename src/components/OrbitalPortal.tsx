import React, { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Zap, Activity } from "lucide-react";

interface OrbitalPortalProps {
  intensity: number;
}

export default function OrbitalPortal({ intensity }: OrbitalPortalProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Mouse coordinate refs for gravity distortion
  const mouseRef = useRef({ x: 0, y: 0, tx: 0, ty: 0, active: false });

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

    const container = containerRef.current;
    const handleMouseMove = (e: MouseEvent) => {
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const mx = e.clientX - rect.left - rect.width / 2;
      const my = e.clientY - rect.top - rect.height / 2;
      mouseRef.current.tx = mx;
      mouseRef.current.ty = my;
      mouseRef.current.active = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
      mouseRef.current.tx = 0;
      mouseRef.current.ty = 0;
    };

    if (container) {
      container.addEventListener("mousemove", handleMouseMove);
      container.addEventListener("mouseleave", handleMouseLeave);
    }

    // Particle definition
    interface PortalParticle {
      angle: number;
      rOffset: number;
      size: number;
      speed: number;
      alpha: number;
      colorType: "blue" | "orange";
      life: number;
      decay: number;
      tempY: number; // for drifting embers / lightning spikes
      tempX: number;
    }

    // Spawn array
    let particles: PortalParticle[] = [];

    // Helper to spawn a particle
    const spawnParticle = (side: "blue" | "orange") => {
      const isBlue = side === "blue";
      // Blue resides on left half (-Math.PI/2 to Math.PI/2 with rotation, or generally left aspect)
      // We will distribute them with some noise
      const baseAngle = isBlue 
        ? Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.1 // Leftish
        : -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.1; // Rightish

      particles.push({
        angle: baseAngle,
        rOffset: (Math.random() - 0.5) * 22,
        size: Math.random() * 2.5 + 0.8,
        speed: (0.015 + Math.random() * 0.02) * (isBlue ? 0.75 : 1.25), // Orange is quicker, sparks fly
        alpha: Math.random() * 0.8 + 0.2,
        colorType: side,
        life: 1.0,
        decay: 0.01 + Math.random() * 0.022,
        tempY: (Math.random() - 0.5) * 8,
        tempX: (Math.random() - 0.5) * 8
      });
    };

    // Pre-populate particles
    for (let i = 0; i < 180; i++) {
      spawnParticle(Math.random() > 0.5 ? "blue" : "orange");
    }

    // Smooth values
    let audioIntensitySmoothed = 1.0;
    let rotationMultiplier = 1.0;
    let globalRotation = 0;

    // Pulse shockwave tracking
    interface Shockwave {
      r: number;
      alpha: number;
      maxR: number;
      color: string;
    }
    let shockwaves: Shockwave[] = [];

    // Animation Loop
    const draw = () => {
      // Trail effect feedback backplate, creating cinematic motion trails
      ctx.fillStyle = "rgba(3, 5, 10, 0.16)";
      ctx.fillRect(0, 0, width, height);

      const time = Date.now() * 0.001;

      // Read audio analyzer
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
        currentAudioVal = 1.0 + (avg / 32) * intensity;
      }

      audioIntensitySmoothed += (currentAudioVal - audioIntensitySmoothed) * 0.15;

      // Spawn shockwave if there's a huge spike
      if (audioIntensitySmoothed > 1.35 && Math.random() < 0.15) {
        shockwaves.push({
          r: 105,
          alpha: 1.0,
          maxR: 200 + Math.random() * 120,
          color: Math.random() > 0.5 ? "rgba(0, 157, 255, " : "rgba(255, 106, 0, "
        });
      }

      // Smooth mouse interaction
      const mouse = mouseRef.current;
      mouse.x += (mouse.tx - mouse.x) * 0.08;
      mouse.y += (mouse.ty - mouse.y) * 0.08;

      const cx = width / 2;
      const cy = height / 2;
      const baseRadius = Math.min(width, height) * 0.28;

      // Background grid coordinate lines on the portal
      ctx.strokeStyle = "rgba(255, 255, 255, 0.015)";
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.arc(cx, cy, baseRadius * 1.5, 0, Math.PI * 2);
      ctx.stroke();

      // Technical crosshairs
      ctx.strokeStyle = "rgba(255, 255, 255, 0.02)";
      ctx.beginPath();
      // Horizontal
      ctx.moveTo(cx - baseRadius * 1.8, cy);
      ctx.lineTo(cx + baseRadius * 1.8, cy);
      // Vertical
      ctx.moveTo(cx, cy - baseRadius * 1.8);
      ctx.lineTo(cx, cy + baseRadius * 1.8);
      ctx.stroke();

      // Gravity lens / distortion grid lines
      ctx.strokeStyle = "rgba(0, 157, 255, 0.04)";
      ctx.beginPath();
      ctx.arc(cx + mouse.x * 0.15, cy + mouse.y * 0.15, baseRadius * 1.25, 0, Math.PI * 2);
      ctx.stroke();

      // Draw Shockwaves
      shockwaves.forEach((sw, idx) => {
        sw.r += 4 * audioIntensitySmoothed;
        sw.alpha -= 0.025;
        if (sw.alpha <= 0) {
          shockwaves.splice(idx, 1);
          return;
        }

        ctx.strokeStyle = sw.color + sw.alpha * 0.3 + ")";
        ctx.lineWidth = 1.5 + (1.0 - sw.alpha) * 4;
        ctx.beginPath();
        ctx.arc(cx, cy, sw.r, 0, Math.PI * 2);
        ctx.stroke();
      });

      // Slowly rotate the entire system
      globalRotation += 0.003 * audioIntensitySmoothed;

      // Spawn new particles to replenish
      const spawnCount = Math.floor(2 * audioIntensitySmoothed);
      for (let s = 0; s < spawnCount; s++) {
        spawnParticle("blue");
        spawnParticle("orange");
      }

      // Render Orbital Rings behind particles
      // Outer active halo
      ctx.shadowBlur = 0;
      
      // Electric Blue plasma semi-ring
      const blueGrad = ctx.createRadialGradient(cx, cy, baseRadius - 15, cx, cy, baseRadius + 15);
      blueGrad.addColorStop(0, "rgba(0, 157, 255, 0.0)");
      blueGrad.addColorStop(0.5, "rgba(0, 157, 255, 0.25)");
      blueGrad.addColorStop(1, "rgba(0, 157, 255, 0.0)");

      ctx.strokeStyle = blueGrad;
      ctx.lineWidth = 16 * audioIntensitySmoothed;
      ctx.beginPath();
      ctx.arc(cx, cy, baseRadius, Math.PI * 0.45 + globalRotation, Math.PI * 1.55 + globalRotation);
      ctx.stroke();

      // Fire Orange combustion semi-ring
      const orangeGrad = ctx.createRadialGradient(cx, cy, baseRadius - 15, cx, cy, baseRadius + 15);
      orangeGrad.addColorStop(0, "rgba(255, 106, 0, 0.0)");
      orangeGrad.addColorStop(0.5, "rgba(255, 106, 0, 0.25)");
      orangeGrad.addColorStop(1, "rgba(255, 106, 0, 0.0)");

      ctx.strokeStyle = orangeGrad;
      ctx.lineWidth = 15 * audioIntensitySmoothed;
      ctx.beginPath();
      ctx.arc(cx, cy, baseRadius, -Math.PI * 0.45 + globalRotation, Math.PI * 0.55 + globalRotation);
      ctx.stroke();

      // Draw lightning/plasma arcs on the blue side
      if (Math.random() < 0.45 * audioIntensitySmoothed) {
        ctx.strokeStyle = "rgba(55, 216, 255, 0.72)";
        ctx.lineWidth = 0.8 + Math.random() * 1.2;
        ctx.beginPath();

        let arcStart = Math.PI * 0.5 + globalRotation + (Math.random() - 0.5) * 1.5;
        let pArcRadius = baseRadius + (Math.random() - 0.5) * 10;
        let arcX = cx + Math.cos(arcStart) * pArcRadius;
        let arcY = cy + Math.sin(arcStart) * pArcRadius;
        ctx.moveTo(arcX, arcY);

        for (let j = 0; j < 5; j++) {
          arcStart += 0.08;
          const jumpRadius = pArcRadius + (Math.random() - 0.5) * 16;
          const targetX = cx + Math.cos(arcStart) * jumpRadius;
          const targetY = cy + Math.sin(arcStart) * jumpRadius;
          ctx.lineTo(targetX, targetY);
        }
        ctx.stroke();
      }

      // Draw fire solar flares on the orange side
      if (Math.random() < 0.3 * audioIntensitySmoothed) {
        ctx.strokeStyle = "rgba(255, 176, 0, 0.65)";
        ctx.lineWidth = 1.0 + Math.random() * 2;
        ctx.beginPath();

        let flareStart = -Math.PI * 0.5 + globalRotation + (Math.random() - 0.5) * 1.5;
        let pFlareRadius = baseRadius + (Math.random() - 0.5) * 8;
        let flareX = cx + Math.cos(flareStart) * pFlareRadius;
        let flareY = cy + Math.sin(flareStart) * pFlareRadius;
        ctx.moveTo(flareX, flareY);

        for (let j = 0; j < 4; j++) {
          flareStart -= 0.1;
          const shootRadius = pFlareRadius + Math.random() * 24 * audioIntensitySmoothed;
          const targetX = cx + Math.cos(flareStart) * shootRadius;
          const targetY = cy + Math.sin(flareStart) * shootRadius;
          ctx.lineTo(targetX, targetY);
        }
        ctx.stroke();
      }

      // Update and draw orbital portal particles
      particles.forEach((p, idx) => {
        p.life -= p.decay;
        if (p.life <= 0) {
          particles.splice(idx, 1);
          return;
        }

        // Apply orbital rotation
        p.angle += p.speed * audioIntensitySmoothed;

        // Base circular coordinate centered around the portal
        let targetRadius = baseRadius + p.rOffset * (1.0 + (audioIntensitySmoothed - 1.0) * 0.5);
        
        let tx = Math.cos(p.angle) * targetRadius;
        let ty = Math.sin(p.angle) * targetRadius;

        // Apply gravity distortion lens from cursor
        if (mouse.active) {
          const dx = tx - mouse.x;
          const dy = ty - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 180) {
            const force = (1.0 - dist / 180) * 15 * (p.colorType === "blue" ? 1.0 : 0.65); // blue grav attracts more!
            tx -= (dx / dist) * force;
            ty -= (dy / dist) * force;
          }
        }

        // Extra drift sparks
        if (p.colorType === "orange") {
          // Orange flares outward
          tx += Math.cos(p.angle) * (1.0 - p.life) * 44 * audioIntensitySmoothed;
          ty += Math.sin(p.angle) * (1.0 - p.life) * 44 * audioIntensitySmoothed;
          // Upward heat float
          p.tempY -= Math.random() * 0.25;
        } else {
          // Blue implodes / spirals tightly
          tx += Math.cos(p.angle + Math.PI) * (1.0 - p.life) * 12;
          ty += Math.sin(p.angle + Math.PI) * (1.0 - p.life) * 12;
        }

        const finalX = cx + tx + p.tempX;
        const finalY = cy + ty + p.tempY;

        // Draw particle
        ctx.beginPath();
        ctx.arc(finalX, finalY, p.size * (0.3 + p.life * 0.7), 0, Math.PI * 2);

        // Styling based on blue vs orange energy half
        const opacity = p.alpha * p.life * (0.8 + Math.sin(time * 5 + idx) * 0.2);
        if (p.colorType === "blue") {
          ctx.fillStyle = `rgba(55, 216, 255, ${opacity})`;
        } else {
          ctx.fillStyle = `rgba(255, 106, 0, ${opacity})`;
        }
        ctx.fill();

        // Little sparks/stardust
        if (Math.random() < 0.015 && p.life > 0.5) {
          ctx.beginPath();
          ctx.arc(finalX + (Math.random() - 0.5) * 12, finalY + (Math.random() - 0.5) * 12, 0.8, 0, Math.PI * 2);
          ctx.fillStyle = p.colorType === "blue" ? "rgba(244, 248, 255, 0.8)" : "rgba(255, 176, 0, 0.8)";
          ctx.fill();
        }
      });

      // Draw subtle sharp circular orbit coordinate frames
      ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.arc(cx, cy, baseRadius * 0.9, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = "rgba(255, 255, 255, 0.03)";
      ctx.beginPath();
      ctx.arc(cx, cy, baseRadius * 1.1, 0, Math.PI * 2);
      ctx.stroke();

      // Sharp HUD rings in the center that pulse with sound
      ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, baseRadius * 0.4 * (0.95 + (audioIntensitySmoothed - 1.0) * 0.2), 0, Math.PI * 2);
      ctx.stroke();

      // Centered coordinate readout
      ctx.fillStyle = "rgba(141, 154, 173, 0.4)";
      ctx.font = "8px var(--font-mono), monospace";
      ctx.textAlign = "center";
      ctx.fillText(
        `ORBIT_SYS_COORD: [ALT_${Math.round(baseRadius * audioIntensitySmoothed)}//G_CELL_0.8]`,
        cx,
        cy - baseRadius * 1.4
      );

      ctx.fillText(
        `PLASMA_ENERGY: ${Math.round(audioIntensitySmoothed * 100)}% // SPARK_FLARE`,
        cx,
        cy + baseRadius * 1.45
      );

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (container) {
        container.removeEventListener("mousemove", handleMouseMove);
        container.removeEventListener("mouseleave", handleMouseLeave);
      }
      cancelAnimationFrame(animId);
    };
  }, [intensity]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex items-center justify-center select-none cursor-crosshair group"
    >
      {/* Background Interactive Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 block w-full h-full pointer-events-none z-0"
      />

      {/* Futuristic central design overlay representing Metro Sul brand text inside the portal */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 text-center select-none px-4">
        {/* Subtle glowing core */}
        <div className="w-[140px] h-[140px] rounded-full bg-radial-gradient absolute filter blur-xl opacity-20 pointer-events-none" 
          style={{
            background: "radial-gradient(circle, rgba(0, 157, 255, 0.4) 0%, rgba(255, 123, 0, 0.3) 60%, transparent 100%)"
          }}
        />
        
        {/* METRO SUL logo text and symbol elements styled exactly like a beautiful premium album branding */}
        <div className="absolute flex flex-col items-center justify-center pointer-events-none select-none">
          {/* Accent tiny orbital labels */}
          <span className="font-mono text-[7px] text-neutral-400 uppercase tracking-[0.35em] font-medium mb-3.5 transition-all duration-300 group-hover:text-neutral-300">
            [ METRO SUL CORE SYMBOL ]
          </span>

          {/* Central Logo Symbol: Blue/orange circular arcs with three vertical bars at center */}
          <div className="relative w-20 h-20 flex items-center justify-center transition-all duration-700 group-hover:scale-105">
            <svg width="76" height="76" viewBox="0 0 100 100" className="drop-shadow-[0_0_12px_rgba(0,157,255,0.35)]">
              {/* Left blue arc */}
              <path 
                d="M 40 15 A 36 36 0 0 0 40 85" 
                fill="none" 
                stroke="#009DFF" 
                strokeWidth="4.5" 
                strokeLinecap="round" 
                className="transition-all duration-500 group-hover:stroke-[#37D8FF]"
              />
              {/* Right orange/amber arc */}
              <path 
                d="M 60 15 A 36 36 0 0 1 60 85" 
                fill="none" 
                stroke="#FF8800" 
                strokeWidth="4.5" 
                strokeLinecap="round" 
                className="transition-all duration-500 group-hover:stroke-[#FFAA00]"
              />
              {/* Three vertical bars in the center (gold accent + subtle white light) */}
              <rect x="44" y="32" width="2.5" height="36" rx="1.25" fill="#FFFFFF" opacity="0.95" />
              <rect x="49" y="24" width="3" height="52" rx="1.5" fill="#FFC000" opacity="1.0" className="drop-shadow-[0_0_6px_rgba(255,192,0,0.8)]" />
              <rect x="55" y="32" width="2.5" height="36" rx="1.25" fill="#FFFFFF" opacity="0.95" />
            </svg>
          </div>

          <h2 className="font-display text-xl font-bold text-white tracking-[0.45em] pl-[0.45em] uppercase leading-none mt-4 transition-all duration-350">
            M<span className="text-[#009DFF]">≡</span>TRO SUL
          </h2>

          <span className="font-mono text-[6px] text-[#009DFF] group-hover:text-[#FFAA00] transition-colors duration-700 uppercase tracking-[0.3em] mt-3 mt-3.5">
            FREQUENCY // ABUNDANCE
          </span>
        </div>
      </div>

      {/* Decorative Technical Corner Brackets */}
      <div className="absolute top-4 left-4 font-mono text-[6.5px] text-neutral-500 tracking-[0.2em] pointer-events-none uppercase">
        // CHR_PORTAL_CORE_V8
      </div>
      <div className="absolute top-4 right-4 font-mono text-[6.5px] text-neutral-500 tracking-[0.2em] pointer-events-none uppercase">
        COSMIC_ENERGY: LIVE
      </div>
      <div className="absolute bottom-4 left-4 font-mono text-[6.5px] text-neutral-500 tracking-[0.2em] pointer-events-none uppercase flex items-center gap-1">
        <span className="h-1.5 w-1.5 rounded-full bg-[#009DFF] animate-pulse" />
        <span>GRAVITATIONAL_G_CELL</span>
      </div>
      <div className="absolute bottom-4 right-4 font-mono text-[6.5px] text-neutral-500 tracking-[0.2em] pointer-events-none uppercase flex items-center gap-1">
        <span className="h-1.5 w-1.5 rounded-full bg-[#FF6A00] animate-pulse" />
        <span>COMBUSTION_HEAT</span>
      </div>
    </div>
  );
}
