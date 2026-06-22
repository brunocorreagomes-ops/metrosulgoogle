import React, { useEffect, useRef } from "react";
import { Orbit } from "lucide-react";

interface FaceVisualizerProps {
  colorTheme: {
    primary: string;
    secondary: string;
    glow: string;
  };
  intensity: number; // Linked directly to the synth audio intensity
}

interface ProfileNode {
  y: number; // Normalized height -1.0 (top) to 1.0 (neck)
  x: number; // Normalized horizontal protrusion
}

// Master front profile silhouette lookup points representing an elegant human profile
const PROFILE_SAMPLES: ProfileNode[] = [
  { y: -1.0,  x: -0.55 }, // Back of head
  { y: -0.92, x: -0.22 }, // Curved top back
  { y: -0.80, x: 0.18 },  // Forehead top starting curve
  { y: -0.62, x: 0.38 },  // Forehead main
  { y: -0.44, x: 0.41 },  // Brow ridge
  { y: -0.37, x: 0.30 },  // Nose bridge dip
  { y: -0.22, x: 0.64 },  // Nose tip
  { y: -0.16, x: 0.55 },  // Cheek structure dip
  { y: -0.07, x: 0.40 },  // Upper lip crease
  { y: 0.00,  x: 0.47 },  // Upper lip protrusion
  { y: 0.08,  x: 0.36 },  // Lip separation line
  { y: 0.17,  x: 0.43 },  // Lower lip protrusion
  { y: 0.28,  x: 0.31 },  // Chin cleft dip
  { y: 0.40,  x: 0.44 },  // Chin tip
  { y: 0.53,  x: 0.24 },  // Chin underside
  { y: 0.65,  x: -0.04 }, // Jaw angle line
  { y: 0.78,  x: -0.26 }, // Forward throat/neck
  { y: 0.90,  x: -0.32 }, // Neck line
  { y: 1.00,  x: -0.32 }  // Neck base
];

// Robust color hex / rgb / rgba to rgba string helper
function hexToRgba(colorStr: string, alpha: number): string {
  if (!colorStr) return `rgba(255, 255, 255, ${alpha})`;
  const trimmed = colorStr.trim();
  if (trimmed.startsWith("rgba")) {
    return trimmed.substring(0, trimmed.lastIndexOf(",")) + `, ${alpha})`;
  }
  if (trimmed.startsWith("rgb")) {
    return trimmed.replace("rgb", "rgba").replace(")", `, ${alpha})`);
  }
  
  let hex = trimmed.replace("#", "");
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  const num = parseInt(hex, 16);
  if (isNaN(num)) return `rgba(255, 255, 255, ${alpha})`;
  
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// Helper to interpolate the X protrusion of the silhouette at a specific normalized height Y
function getProfileX(y: number): number {
  if (y <= PROFILE_SAMPLES[0].y) return PROFILE_SAMPLES[0].x;
  if (y >= PROFILE_SAMPLES[PROFILE_SAMPLES.length - 1].y) {
    return PROFILE_SAMPLES[PROFILE_SAMPLES.length - 1].x;
  }

  // Find bounding sample nodes
  for (let i = 0; i < PROFILE_SAMPLES.length - 1; i++) {
    const p1 = PROFILE_SAMPLES[i];
    const p2 = PROFILE_SAMPLES[i + 1];
    if (y >= p1.y && y <= p2.y) {
      const segmentRatio = (y - p1.y) / (p2.y - p1.y);
      return p1.x + (p2.x - p1.x) * segmentRatio;
    }
  }
  return 0;
}

export const FaceVisualizer: React.FC<FaceVisualizerProps> = ({ colorTheme, intensity }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({
    rotY: 0.25, // Start slightly turned to showcase the 3D depth of the profile
    rotX: 0.15,
    mouseX: 0,
    mouseY: 0,
    isHovered: false,
    audioIntensitySmoother: 1.0,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = canvasRef.current.parentElement?.clientWidth || 400);
    let height = (canvas.height = canvasRef.current.parentElement?.clientHeight || 450);

    const handleResize = () => {
      if (!canvasRef.current) return;
      width = canvasRef.current.width = canvasRef.current.parentElement?.clientWidth || 400;
      height = canvasRef.current.height = canvasRef.current.parentElement?.clientHeight || 450;
    };

    const container = containerRef.current;
    const handleMouseMove = (e: MouseEvent) => {
      if (!container) return;
      const rect = container.getBoundingClientRect();
      stateRef.current.mouseX = e.clientX - rect.left - rect.width / 2;
      stateRef.current.mouseY = e.clientY - rect.top - rect.height / 2;
      stateRef.current.isHovered = true;
    };

    const handleMouseLeave = () => {
      stateRef.current.isHovered = false;
    };

    window.addEventListener("resize", handleResize);
    if (container) {
      container.addEventListener("mousemove", handleMouseMove);
      container.addEventListener("mouseleave", handleMouseLeave);
    }

    // Main 3D wireframe draw loop
    const draw = () => {
      if (!ctx || !canvasRef.current) return;

      ctx.clearRect(0, 0, width, height);

      const state = stateRef.current;
      const time = Date.now() * 0.0004;
      
      // Sample actual synthesizer frequency volume if active to deform parameters
      let currentIntensity = intensity;
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
        // Scale so base of 1.0 increases proportionally with synthesizer volume
        currentIntensity = 1.0 + (average / 35) * intensity;
      }

      // Smooth audio parameter intensity
      state.audioIntensitySmoother += (currentIntensity - state.audioIntensitySmoother) * 0.1;
      
      // Steady automatic rotation combined with mouse tilt influence
      const autoRotSpeed = 0.005 + (state.audioIntensitySmoother - 1.0) * 0.012;
      state.rotY += autoRotSpeed;
      
      const targetTiltY = state.rotY + (state.isHovered ? (state.mouseX / width) * 0.45 : 0);
      const targetTiltX = state.rotX + (state.isHovered ? (state.mouseY / height) * 0.35 : 0);

      // Define 3D wireframe head parameters
      const baseRadius = Math.min(width, height) * 0.32;
      const cx = width * 0.52; // Push slightly right to align perfectly
      const cy = height * 0.45;

      const cosY = Math.cos(targetTiltY);
      const sinY = Math.sin(targetTiltY);
      const cosX = Math.cos(targetTiltX);
      const sinX = Math.sin(targetTiltX);

      // Simple 3D projection mathematical transformation (isometric camera matrix projection)
      const project = (x3d: number, y3d: number, z3d: number) => {
        // Rotate on Y axis (left-right)
        const x1 = x3d * cosY - z3d * sinY;
        const z1 = x3d * sinY + z3d * cosY;

        // Rotate on X axis (up-down)
        const y2 = y3d * cosX - z1 * sinX;
        const z2 = y3d * sinX + z1 * cosX;

        // Perspective warp depth scale
        const fov = 600;
        const scale = fov / (fov + z2);

        return {
          x: cx + x1 * scale,
          y: cy + y2 * scale,
          z: z2, // Depth for line color fading
        };
      };

      // Helper to generate coordinates of a slice at height Y
      // yValue is normalized height from -1.0 (top skull) to 1.0 (neck)
      const generateRingPoints = (yValue: number, pointsCount: number) => {
        const points = [];
        const profileX = getProfileX(yValue);

        // Skull properties
        const skullRadiusFactor = Math.sqrt(Math.max(0, 1.0 - yValue * yValue * 0.85));
        const rxSkull = baseRadius * 0.85 * skullRadiusFactor;
        const rzSkull = baseRadius * 0.68 * skullRadiusFactor;
        const skullCenterX = -baseRadius * 0.12 * (1.0 - Math.pow(Math.abs(yValue), 2)); // push skull back more on central nodes

        for (let i = 0; i <= pointsCount; i++) {
          const theta = (i / pointsCount) * Math.PI * 2;
          const cosT = Math.cos(theta);
          const sinT = Math.sin(theta);

          // Default egg-shaped skull base
          let localX = skullCenterX + rxSkull * cosT;
          let localZ = rzSkull * sinT;

          // Perform morphological blending towards the facial profile if we are in the front quadrant (theta ~ 0)
          if (cosT > 0) {
            // blendWeight is strong at center (theta=0) and gracefully diminishes at the sides (theta -> ±PI/2)
            const blendWeight = Math.pow(cosT, 2.2);
            
            // Central face profile projection coordinate (scaled to base radius size)
            const targetFaceX = profileX * baseRadius;

            // Shift cheek elements slightly to smooth the organic profile transition
            localX = (1.0 - blendWeight) * localX + blendWeight * targetFaceX;
            localZ = localZ * (1.0 - blendWeight * 0.42);
          }

          // Dynamic sound-activated ripple wave displacement acting as signal feedback
          if (state.audioIntensitySmoother > 1.05) {
            const rippleFreq = 8.0 + yValue * 4.0;
            const rippleAmp = 10.0 * (state.audioIntensitySmoother - 1.0) * Math.sin(theta * 3.0);
            const displace = Math.sin(yValue * rippleFreq - Date.now() * 0.01) * rippleAmp;
            
            // Warp coordinates outward along normal vector
            localX += cosT * displace;
            localZ += sinT * displace;
          }

          points.push(project(localX, yValue * baseRadius * 1.15, localZ));
        }
        return points;
      };

      // 1. DRAW VERTICAL CONTOUR LINES
      const verticalLineCount = 20;
      const horizontalSteps = 30;
      ctx.lineWidth = 0.5;

      for (let v = 0; v < verticalLineCount; v++) {
        const theta = (v / verticalLineCount) * Math.PI * 2;
        const cosT = Math.cos(theta);
        const sinT = Math.sin(theta);

        const vPoints = [];
        for (let h = 0; h <= horizontalSteps; h++) {
          const yVal = -1.0 + (h / horizontalSteps) * 2.0;
          const profileX = getProfileX(yVal);
          const skullRadiusFactor = Math.sqrt(Math.max(0, 1.0 - yVal * yVal * 0.85));
          const rxSkull = baseRadius * 0.85 * skullRadiusFactor;
          const rzSkull = baseRadius * 0.68 * skullRadiusFactor;
          const skullCenterX = -baseRadius * 0.12 * (1.0 - Math.pow(Math.abs(yVal), 2));

          let localX = skullCenterX + rxSkull * cosT;
          let localZ = rzSkull * sinT;

          if (cosT > 0) {
            const blendWeight = Math.pow(cosT, 2.2);
            const targetFaceX = profileX * baseRadius;
            localX = (1.0 - blendWeight) * localX + blendWeight * targetFaceX;
            localZ = localZ * (1.0 - blendWeight * 0.42);
          }

          // Sound wave warping
          if (state.audioIntensitySmoother > 1.05) {
            const rippleAmp = 8.0 * (state.audioIntensitySmoother - 1.0) * Math.sin(theta * 3.0);
            const displace = Math.sin(yVal * 10 - Date.now() * 0.01) * rippleAmp;
            localX += cosT * displace;
            localZ += sinT * displace;
          }

          vPoints.push(project(localX, yVal * baseRadius * 1.15, localZ));
        }

        // Draw vertical wireframe segments
        for (let i = 0; i < vPoints.length - 1; i++) {
          const p1 = vPoints[i];
          const p2 = vPoints[i + 1];
          const avgZ = (p1.z + p2.z) * 0.5;

          // Fade wireframe grid lines based on 3D depth position to create realistic lighting
          const normalizedZ = Math.max(0, Math.min(1.0, (avgZ + baseRadius) / (2.0 * baseRadius)));
          const alphaFactor = 0.04 + 0.35 * normalizedZ;
          const strokeAlpha = alphaFactor * (0.8 + (intensity - 1.0) * 0.35);
          ctx.strokeStyle = hexToRgba(colorTheme.secondary, strokeAlpha);
          ctx.lineWidth = 0.5 + normalizedZ * 0.6;

          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }

      // 2. DRAW HORIZONTAL CROSS-SECTION CONTOUR RINGS (Latitude lines)
      const latitudeCount = 24;
      for (let l = 0; l <= latitudeCount; l++) {
        const yVal = -0.9 + (l / latitudeCount) * 1.83;
        const ringPoints = generateRingPoints(yVal, 40);

        for (let i = 0; i < ringPoints.length - 1; i++) {
          const p1 = ringPoints[i];
          const p2 = ringPoints[i + 1];
          const avgZ = (p1.z + p2.z) * 0.5;

          const normalizedZ = Math.max(0, Math.min(1.0, (avgZ + baseRadius) / (2.0 * baseRadius)));
          const alphaFactor = 0.05 + 0.42 * normalizedZ;
          const strokeAlpha = alphaFactor * (0.8 + (intensity - 1.0) * 0.35);
          ctx.strokeStyle = hexToRgba(colorTheme.primary, strokeAlpha);
          ctx.lineWidth = 0.6 + normalizedZ * 0.8;

          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }

      // 3. RENDER SUBTLE CYBERNETIC FLOATING POINTS (Glow particles around the face)
      const numNodes = 6;
      for (let n = 0; n < numNodes; n++) {
        const pointPhase = time * 0.4 + n * (Math.PI * 2 / numNodes);
        
        // Target random key facial coordinates
        const faceYRatio = Math.sin(pointPhase) * 0.7;
        const faceX = getProfileX(faceYRatio) * baseRadius + 14 * Math.sin(pointPhase * 2.5);
        const faceZ = Math.cos(pointPhase * 1.5) * baseRadius * 0.3;

        const projectedPoint = project(faceX, faceYRatio * baseRadius * 1.15, faceZ);
        const pointZFactor = Math.max(0.1, Math.min(1.0, (projectedPoint.z + baseRadius) / (2 * baseRadius)));

        ctx.beginPath();
        const nodeRadius = (2.5 + 2 * Math.sin(time + n)) * pointZFactor * (1.0 + (state.audioIntensitySmoother - 1.0) * 0.5);
        ctx.arc(projectedPoint.x, projectedPoint.y, nodeRadius * 2.5, 0, Math.PI * 2);
        
        const grad = ctx.createRadialGradient(projectedPoint.x, projectedPoint.y, 0, projectedPoint.x, projectedPoint.y, nodeRadius * 2.5);
        grad.addColorStop(0, hexToRgba(colorTheme.primary, 0.65 * pointZFactor));
        grad.addColorStop(0.5, hexToRgba(colorTheme.secondary, 0.15 * pointZFactor));
        grad.addColorStop(1, "rgba(0,0,0,0)");
        
        ctx.fillStyle = grad;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(projectedPoint.x, projectedPoint.y, nodeRadius * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${0.43 + 0.5 * pointZFactor})`;
        ctx.fill();
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (container) {
        container.removeEventListener("mousemove", handleMouseMove);
        container.removeEventListener("mouseleave", handleMouseLeave);
      }
      cancelAnimationFrame(animationId);
    };
  }, [colorTheme, intensity]);

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full flex items-center justify-center select-none"
    >
      <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full pointer-events-none" />
      
      {/* Decorative Technical Grid Framing in Corners */}
      <div className="absolute top-4 left-4 font-mono text-[7px] text-neutral-500 tracking-[0.2em] pointer-events-none">
        [PROJ_MODE: sagittal_mesh]
      </div>
      <div className="absolute bottom-4 right-4 font-mono text-[7px] text-neutral-500 tracking-[0.2em] pointer-events-none flex items-center gap-1.5">
        <Orbit size={10} className="animate-spin text-neutral-600" style={{ animationDuration: "12s" }} />
        <span>KINETIC VOLTAGE MAP</span>
      </div>
    </div>
  );
};
