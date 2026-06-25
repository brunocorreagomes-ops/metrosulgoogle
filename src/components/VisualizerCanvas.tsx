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

    // Symmetrical frequency analyzer parameters
    const N = 36;
    const barHeights = new Float32Array(N);
    let smoothBass = 0;
    let smoothHigh = 0;

    const draw = () => {
      // Lerp colors for a beautiful visual transition between albums
      activePrimaryColor = lerpColor(activePrimaryColor, theme.primary, 0.05);
      activeSecondaryColor = lerpColor(activeSecondaryColor, theme.secondary, 0.05);

      // Deep trail decay backplate (keeps it dark but with cybernetic trail memory)
      ctx.fillStyle = "rgba(3, 3, 4, 0.08)";
      ctx.fillRect(0, 0, width, height);

      // Check for global synthesizer analyser node to drive reactive dimensions
      let audioParamIntensity = 1.0;
      let bassAvg = 0;
      let highAvg = 0;
      let analyserActive = false;
      const analyser = (window as any).__metroAnalyser;
      let dataArray: Uint8Array | null = null;

      if (analyser) {
        const bufferLength = analyser.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);
        analyser.getByteFrequencyData(dataArray);
        analyserActive = true;

        const len = dataArray.length;
        // Calculate average for bass (lower 20% of spectrum)
        const bassEnd = Math.max(1, Math.floor(len * 0.2));
        let bassSum = 0;
        for (let i = 0; i < bassEnd; i++) {
          bassSum += dataArray[i];
        }
        bassAvg = bassSum / bassEnd;

        // Calculate average for high-end (upper 40% of spectrum)
        const highStart = Math.floor(len * 0.6);
        let highSum = 0;
        for (let i = highStart; i < len; i++) {
          highSum += dataArray[i];
        }
        highAvg = highSum / (len - highStart);

        // Overall average
        let sum = 0;
        for (let i = 0; i < len; i++) {
          sum += dataArray[i];
        }
        const average = sum / len; // 0 to 255
        // Scale so base is 1.0, and swells with synthesizer amplitude output
        audioParamIntensity = 1.0 + (average / 38) * intensity;
      }

      // Smoothly update frequency band coefficients
      smoothBass += (bassAvg - smoothBass) * 0.15;
      smoothHigh += (highAvg - smoothHigh) * 0.15;

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
      // Slight mechanical jitter when deep bass hits!
      const bassJitterFactor = smoothBass / 255;
      const gridJitterX = (Math.random() - 0.5) * bassJitterFactor * 4;
      const gridJitterY = (Math.random() - 0.5) * bassJitterFactor * 4;

      ctx.strokeStyle = `rgba(255, 255, 255, ${0.012 + (bassJitterFactor * 0.02)})`;
      ctx.lineWidth = 0.5 + bassJitterFactor * 0.5;
      const gridSize = 160;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x + gridJitterX, 0);
        ctx.lineTo(x + gridJitterX, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y + gridJitterY);
        ctx.lineTo(width, y + gridJitterY);
        ctx.stroke();
      }

      // Update and draw ultra-subtle autonomous ambient particles
      for (let i = 0; i < ambientParticles.length; i++) {
        const tp = ambientParticles[i];
        
        // Let them drift and react tiny bit to high-frequency sparkles
        const pSpeedCoeff = 1.0 + (smoothHigh / 255) * 3.5;
        tp.y += tp.vy * tp.speedMult * audioParamIntensity * pSpeedCoeff;
        tp.x += tp.vx * tp.speedMult * (1.0 + (audioParamIntensity - 1.0) * 0.5) * pSpeedCoeff;

        // Wrap around when escaping viewport edges
        if (tp.y < -20) {
          tp.y = height + 10;
          tp.x = Math.random() * width;
        }
        if (tp.x < -20 || tp.x > width + 20) {
          tp.x = Math.random() * width;
        }

        // Pulse the speed and alphas with slow trig waves and high-end peaks
        const pulseAlpha = tp.alpha * (0.8 + Math.sin(time + i) * 0.2) * (1.0 + (audioParamIntensity - 1.0) * 0.4) * (1.0 + (smoothHigh / 255) * 0.5);

        // Render delicate micro-speck
        ctx.beginPath();
        ctx.arc(tp.x, tp.y, tp.size * (1.0 + (smoothHigh / 255) * 0.5), 0, Math.PI * 2);
        ctx.fillStyle = activePrimaryColor.replace("rgb", "rgba").replace(")", `, ${pulseAlpha})`);
        ctx.fill();
      }

      // DRAW SYMMETRICAL FREQUENCY SPECTRUM WIDGET
      // Sits beautifully at the bottom of the screen
      const specWidth = Math.min(width * 0.6, 520);
      if (specWidth > 180) { // Only render if we have enough screen space
        const startX = (width - specWidth) / 2;
        const baselineY = height - 100;

        // Draw HUD Frame Panel Background & Borders
        ctx.strokeStyle = "rgba(255, 255, 255, 0.02)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        // Top border
        ctx.moveTo(startX - 20, baselineY - 65);
        ctx.lineTo(startX + specWidth + 20, baselineY - 65);
        // Baseline
        ctx.moveTo(startX - 20, baselineY);
        ctx.lineTo(startX + specWidth + 20, baselineY);
        ctx.stroke();

        // Corner aesthetic bracket marks (left/right bounds)
        ctx.strokeStyle = activePrimaryColor.replace("rgb", "rgba").replace(")", ", 0.2)");
        ctx.beginPath();
        // Left bracket
        ctx.moveTo(startX - 15, baselineY - 55);
        ctx.lineTo(startX - 20, baselineY - 55);
        ctx.lineTo(startX - 20, baselineY - 10);
        ctx.lineTo(startX - 15, baselineY - 10);
        // Right bracket
        ctx.moveTo(startX + specWidth + 15, baselineY - 55);
        ctx.lineTo(startX + specWidth + 20, baselineY - 55);
        ctx.lineTo(startX + specWidth + 20, baselineY - 10);
        ctx.lineTo(startX + specWidth + 15, baselineY - 10);
        ctx.stroke();

        // Technical HUD tags
        ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
        ctx.font = "6.5px var(--font-mono), monospace";
        ctx.fillText("DECIBEL GAIN MAP [CH_01/A]", startX - 18, baselineY - 72);
        
        ctx.textAlign = "right";
        ctx.fillText("REAL-TIME SPECTRUM // MTS-SYS", startX + specWidth + 18, baselineY - 72);
        ctx.textAlign = "left"; // reset

        // Draw Frequency markings below baseline
        ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
        ctx.font = "5.5px var(--font-mono), monospace";
        ctx.textAlign = "center";
        ctx.fillText("20Hz", startX + 5, baselineY + 12);
        ctx.fillText("500Hz", startX + specWidth * 0.25, baselineY + 12);
        ctx.fillText("1.5kHz", startX + specWidth * 0.5, baselineY + 12);
        ctx.fillText("8kHz", startX + specWidth * 0.75, baselineY + 12);
        ctx.fillText("22kHz", startX + specWidth - 5, baselineY + 12);
        ctx.textAlign = "left"; // reset

        // Draw individual bars
        const barGap = 3;
        const barWidth = (specWidth / N) - barGap;

        for (let i = 0; i < N; i++) {
          const bx = startX + i * (barWidth + barGap);

          // Symmetrical distance from center: 0 at center, 1 at ends
          const d = Math.abs(i - (N - 1) / 2) / ((N - 1) / 2);

          let val = 0;
          if (analyserActive && dataArray) {
            // Map distance to specific spectrum indices (lows in center, highs on sides)
            const binIndex = Math.min(dataArray.length - 1, Math.floor(d * dataArray.length));
            val = dataArray[binIndex];
          } else {
            // Slower breathing wave movement when idle
            const waveOffset = i * 0.25;
            const speed = time * 3.2;
            val = (Math.sin(speed + waveOffset) * 0.35 + 0.65) * 16;
          }

          const targetHeight = (val / 255) * 52; // Max height inside HUD is 52px
          
          // Audio visualizer decay dynamics
          if (targetHeight > barHeights[i]) {
            barHeights[i] = targetHeight;
          } else {
            barHeights[i] += (targetHeight - barHeights[i]) * 0.16;
          }

          const hVal = barHeights[i];

          // Linear gradients matching active album theme colors
          const barGrad = ctx.createLinearGradient(bx, baselineY, bx, baselineY - hVal);
          barGrad.addColorStop(0, activeSecondaryColor.replace("rgb", "rgba").replace(")", ", 0.2)"));
          barGrad.addColorStop(0.5, activePrimaryColor.replace("rgb", "rgba").replace(")", ", 0.6)"));
          barGrad.addColorStop(1, activePrimaryColor);

          // Draw vertical frequency bar
          ctx.fillStyle = barGrad;
          ctx.fillRect(bx, baselineY - hVal, barWidth, hVal);

          // Peak indicator dot
          if (hVal > 1) {
            ctx.fillStyle = activePrimaryColor;
            ctx.fillRect(bx, baselineY - hVal - 2, barWidth, 1.5);
          }

          // Faint downward glossy reflection
          const reflectGrad = ctx.createLinearGradient(bx, baselineY + 2, bx, baselineY + 2 + hVal * 0.4);
          reflectGrad.addColorStop(0, activePrimaryColor.replace("rgb", "rgba").replace(")", ", 0.12)"));
          reflectGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
          ctx.fillStyle = reflectGrad;
          ctx.fillRect(bx, baselineY + 2, barWidth, hVal * 0.4);
        }
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
