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

    // Minimal elegant autonomous micro-particles array
    const ambientParticles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
      speedMult: number;
    }> = [];

    // Pre-populate particles across the outer viewport
    for (let i = 0; i < 35; i++) {
      ambientParticles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.15,
        vy: -0.1 - Math.random() * 0.25,
        size: Math.random() * 1.0 + 0.4,
        alpha: Math.random() * 0.25 + 0.1,
        speedMult: 0.6 + Math.random() * 0.8
      });
    }

    window.addEventListener("resize", handleResize);

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

      // Draw a slow-moving, ultra-thin horizon scan line (futuristic radar scanning)
      const scanY = (time * 160) % (height + 200) - 100;
      if (scanY >= 0 && scanY <= height) {
        ctx.beginPath();
        ctx.moveTo(0, scanY);
        ctx.lineTo(width, scanY);
        ctx.strokeStyle = activePrimaryColor.replace("rgb", "rgba").replace(")", ", 0.04)");
        ctx.lineWidth = 1;
        ctx.stroke();

        // Also a soft horizontal glowing beam accent
        const grad = ctx.createLinearGradient(0, scanY - 30, 0, scanY + 30);
        grad.addColorStop(0, "rgba(0, 0, 0, 0)");
        grad.addColorStop(0.5, activePrimaryColor.replace("rgb", "rgba").replace(")", ", 0.015)"));
        grad.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, scanY - 30, width, 60);
      }

      // Draw faint background grid segments coordinates (purely futuristic/minimalist)
      ctx.strokeStyle = "rgba(255, 255, 255, 0.012)";
      ctx.lineWidth = 0.5;
      const gridSize = 160;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Update and draw ultra-subtle autonomous ambient particles
      for (let i = 0; i < ambientParticles.length; i++) {
        const tp = ambientParticles[i];
        
        // Let them drift and react tiny bit to synthesize amplitude
        tp.y += tp.vy * tp.speedMult * audioParamIntensity;
        tp.x += tp.vx * tp.speedMult * (1.0 + (audioParamIntensity - 1.0) * 0.5);

        // Wrap around when escaping viewport edges
        if (tp.y < -20) {
          tp.y = height + 10;
          tp.x = Math.random() * width;
        }
        if (tp.x < -20 || tp.x > width + 20) {
          tp.x = Math.random() * width;
        }

        // Pulse the speed and alphas with slow trig waves
        const pulseAlpha = tp.alpha * (0.8 + Math.sin(time + i) * 0.2) * (1.0 + (audioParamIntensity - 1.0) * 0.4);

        // Render delicate micro-speck
        ctx.beginPath();
        ctx.arc(tp.x, tp.y, tp.size, 0, Math.PI * 2);
        ctx.fillStyle = activePrimaryColor.replace("rgb", "rgba").replace(")", `, ${pulseAlpha})`);
        ctx.fill();
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", handleResize);
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
