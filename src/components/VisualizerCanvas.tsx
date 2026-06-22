import { useEffect, useRef } from "react";

interface VisualizerCanvasProps {
  theme: {
    primary: string;
    secondary: string;
    glow: string;
  };
  intensity?: number;
}

export default function VisualizerCanvas({ theme, intensity = 1.0 }: VisualizerCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, active: false, targetX: 0, targetY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Holographic wireframe 3D globe rotation orientations
    let rotX = 0.38;
    let rotY = 0.0;
    const rotZ = -0.12;

    let globeCx = width * 0.5;
    let globeCy = height * 0.5;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    // Trace particles array and variables for tracking velocity
    const traceParticles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      alpha: number;
      size: number;
      life: number;
      maxLife: number;
    }> = [];

    let lastMouseX = 0;
    let lastMouseY = 0;
    let hasLastMouse = false;

    const handleMouseMove = (e: MouseEvent) => {
      const targetX = e.clientX;
      const targetY = e.clientY;
      mouseRef.current.targetX = targetX;
      mouseRef.current.targetY = targetY;
      mouseRef.current.active = true;

      // Spawn trace particles with velocity influenced by drag direction
      let dx = 0;
      let dy = 0;
      if (hasLastMouse) {
        dx = targetX - lastMouseX;
        dy = targetY - lastMouseY;
      }
      lastMouseX = targetX;
      lastMouseY = targetY;
      hasLastMouse = true;

      const speed = Math.sqrt(dx * dx + dy * dy);
      if (speed > 1) {
        const spawnCount = Math.min(4, Math.ceil(speed / 6));
        for (let s = 0; s < spawnCount; s++) {
          const angle = Math.random() * Math.PI * 2;
          const dispersion = Math.random() * 1.5 + 0.3;
          traceParticles.push({
            x: targetX,
            y: targetY,
            vx: dx * -0.1 + Math.cos(angle) * dispersion,
            vy: dy * -0.1 + Math.sin(angle) * dispersion,
            alpha: 1.0,
            size: Math.random() * 2.5 + 1.2,
            life: 0,
            maxLife: 35 + Math.random() * 25
          });
        }
      }
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
      hasLastMouse = false;
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    // Smooth color hex tracker (to prevent immediate snap when color changes)
    let currentPrimary = theme.primary;
    let currentSecondary = theme.secondary;

    const parseColor = (color: string) => {
      if (color.startsWith("rgb")) {
        const matches = color.match(/\d+/g);
        if (matches && matches.length >= 3) {
          return {
            r: parseInt(matches[0], 10),
            g: parseInt(matches[1], 10),
            b: parseInt(matches[2], 10)
          };
        }
      }

      const sanitized = color.replace("#", "");
      if (sanitized.length === 3) {
        const r = parseInt(sanitized[0] + sanitized[0], 16) || 0;
        const g = parseInt(sanitized[1] + sanitized[1], 16) || 0;
        const b = parseInt(sanitized[2] + sanitized[2], 16) || 0;
        return { r, g, b };
      }

      const r = parseInt(sanitized.substring(0, 2), 16) || 0;
      const g = parseInt(sanitized.substring(2, 4), 16) || 0;
      const b = parseInt(sanitized.substring(4, 6), 16) || 0;
      return { r, g, b };
    };

    const lerpColor = (start: string, end: string, amt: number) => {
      const s = parseColor(start);
      const e = parseColor(end);
      const r = Math.round(s.r + (e.r - s.r) * amt);
      const g = Math.round(s.g + (e.g - s.g) * amt);
      const b = Math.round(s.b + (e.b - s.b) * amt);
      return `rgb(${r}, ${g}, ${b})`;
    };

    let activePrimaryColor = theme.primary;
    let activeSecondaryColor = theme.secondary;

    const draw = () => {
      // Lerp colors for a beautiful visual transition between albums
      activePrimaryColor = lerpColor(activePrimaryColor, theme.primary, 0.05);
      activeSecondaryColor = lerpColor(activeSecondaryColor, theme.secondary, 0.05);

      // Deep trail decay backplate (keeps it dark but with cybernetic trail memory)
      ctx.fillStyle = "rgba(3, 3, 4, 0.08)";
      ctx.fillRect(0, 0, width, height);

      // Check for global synthesizer analyser node to drive reactive dimensions
      let audioParamIntensity = 1.0;
      const analyser = (window as any).__metroAnalyser;
      if (analyser) {
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyser.getByteFrequencyData(dataArray);

        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const average = sum / bufferLength; // 0 to 255
        // Scale so base is 1.0, and swells with synthesizer amplitude output
        audioParamIntensity = 1.0 + (average / 38) * intensity;
      }

      // Dynamic timeline tick
      const time = Date.now() * 0.0004;

      // Smooth mouse coordinate tracking
      const mouse = mouseRef.current;
      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;

      // Slowly update continuous rotations (not drawing the globe, but keeping values updated or simplified)
      // Update and draw mouse trace particles
      for (let i = traceParticles.length - 1; i >= 0; i--) {
        const tp = traceParticles[i];
        tp.life++;
        if (tp.life >= tp.maxLife) {
          traceParticles.splice(i, 1);
          continue;
        }

        const t = tp.life / tp.maxLife;
        const tpAlpha = 1.0 - t;

        // Subtle gravitational pull towards smooth coordinates of the mouse
        const dx = mouse.x - tp.x;
        const dy = mouse.y - tp.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        let gravityPullX = 0;
        let gravityPullY = 0;
        if (dist > 5) {
          // Gravitational pull reacts dynamically to spatial synth output intensity
          const pullStrength = 0.06 * audioParamIntensity;
          gravityPullX = (dx / dist) * pullStrength;
          gravityPullY = (dy / dist) * pullStrength;

          // Gentle vortex/swirl orbit around mouse pointer
          const swirlStrength = 0.04 * audioParamIntensity;
          gravityPullX += (-dy / dist) * swirlStrength;
          gravityPullY += (dx / dist) * swirlStrength;
        }

        // Apply friction and integrating physics with synth-enhanced noise vibration
        tp.vx = tp.vx * 0.94 + gravityPullX + (Math.random() - 0.5) * 0.15 * audioParamIntensity;
        tp.vy = tp.vy * 0.94 + gravityPullY + (Math.random() - 0.5) * 0.15 * audioParamIntensity;
        tp.x += tp.vx;
        tp.y += tp.vy;

        // Render glowing trail node
        const rad = tp.size * (1 - t * 0.55) * Math.max(0.7, audioParamIntensity * 0.6);
        ctx.beginPath();
        ctx.arc(tp.x, tp.y, rad * 3, 0, Math.PI * 2);
        const grad = ctx.createRadialGradient(tp.x, tp.y, 0, tp.x, tp.y, rad * 3);
        
        // Safely insert alphas into dynamic color strings
        const activePrimaryRGBA = activePrimaryColor.replace("rgb", "rgba").replace(")", `, ${tpAlpha * 0.85})`);
        const activeSecondaryRGBA = activeSecondaryColor.replace("rgb", "rgba").replace(")", `, ${tpAlpha * 0.25})`);
        
        grad.addColorStop(0, activePrimaryRGBA);
        grad.addColorStop(0.5, activeSecondaryRGBA);
        grad.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = grad;
        ctx.fill();

        // Sharp central speck for cosmic trace spark
        ctx.beginPath();
        ctx.arc(tp.x, tp.y, rad * 0.45, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${tpAlpha * 0.9})`;
        ctx.fill();
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationId);
    };
  }, [theme, intensity]);

  return (
    <canvas
      id="gravity-canvas"
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full pointer-events-none z-0"
    />
  );
}
