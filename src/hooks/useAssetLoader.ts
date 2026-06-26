import { useState, useEffect } from "react";

export function useAssetLoader() {
  const [progress, setProgress] = useState(0);
  const [loadingStep, setLoadingStep] = useState("Initializing system telemetry...");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let isCancelled = false;
    const startTime = Date.now();

    // Set up a promise to watch for document font loading
    let fontsPromise = Promise.resolve();
    if (typeof document !== "undefined" && (document as any).fonts) {
      fontsPromise = (document as any).fonts.ready;
    }

    // Set up a promise for window load / document load
    let docPromise = new Promise<void>((resolve) => {
      if (typeof window === "undefined") {
        resolve();
        return;
      }
      if (document.readyState === "complete") {
        resolve();
      } else {
        window.addEventListener("load", () => resolve(), { once: true });
      }
    });

    // Detect images on page and create loading promises for them
    const getImagesLoadedPromise = () => {
      if (typeof document === "undefined") return Promise.resolve();
      const images = Array.from(document.images);
      if (images.length === 0) return Promise.resolve();

      return Promise.all(
        images.map((img) => {
          if (img.complete) return Promise.resolve();
          return new Promise<void>((resolve) => {
            img.addEventListener("load", () => resolve(), { once: true });
            img.addEventListener("error", () => resolve(), { once: true });
          });
        })
      );
    };

    let fontsLoaded = false;
    let docLoaded = false;
    let imagesLoaded = false;

    fontsPromise.then(() => {
      fontsLoaded = true;
    });

    docPromise.then(() => {
      docLoaded = true;
    });

    // Initial check of images after rendering begins
    setTimeout(() => {
      getImagesLoadedPromise().then(() => {
        imagesLoaded = true;
      });
    }, 50);

    // Dynamic progression simulation running in parallel with actual asset load completions
    const interval = setInterval(() => {
      if (isCancelled) return;

      const timeElapsed = Date.now() - startTime;

      // Base minimum progress that increases over time even if networks are slow
      const timeFactor = Math.min(45, timeElapsed / 35); 

      // Incremental values added when assets are fully verified
      const fontBonus = fontsLoaded ? 20 : 0;
      const docBonus = docLoaded ? 20 : 0;
      const imgBonus = imagesLoaded ? 15 : 0;

      // Sum actual loading metrics
      const actualTarget = Math.round(timeFactor + fontBonus + docBonus + imgBonus);

      setProgress((prev) => {
        if (prev >= 100) return 100;

        // Calculate smooth easing increment
        const diff = actualTarget - prev;
        let increment = 1;

        if (diff > 0) {
          increment = Math.max(1, Math.round(diff * 0.15));
        } else if (docLoaded && fontsLoaded) {
          // If critical assets are ready, speed up progress to 100%
          increment = 4;
        }

        const next = prev + increment;

        // Caps to 99% until document and fonts are fully finished
        if (next >= 100) {
          if (docLoaded && fontsLoaded) {
            return 100;
          }
          return 99;
        }

        return next;
      });
    }, 60);

    return () => {
      isCancelled = true;
      clearInterval(interval);
    };
  }, []);

  // Set descriptive terminal output text matching the loading phases
  useEffect(() => {
    if (progress < 12) {
      setLoadingStep("SYS_BOOT: Initializing system telemetry & registers...");
    } else if (progress < 30) {
      setLoadingStep("FONTS_LOAD: Binding typeface families [Inter, Space Grotesk, Outfit]...");
    } else if (progress < 50) {
      setLoadingStep("AUDIO_ENGINE: Allocating digital audio node buffers & oscillator pipelines...");
    } else if (progress < 70) {
      setLoadingStep("ASSET_BUFFER: Buffering embedded media components & cover coordinates...");
    } else if (progress < 88) {
      setLoadingStep("GPU_PARTICLES: Allocating dynamic float textures for interactive canvas...");
    } else if (progress < 100) {
      setLoadingStep("SYNC_SIGNAL: Tuning phase aligners to live frequency channels...");
    } else {
      setLoadingStep("READY: SYSTEM FULLY ACTIVE. PRESS MAIN SWITCH TO BEGIN TRANSMISSION");
      
      // Remain on READY for 600ms so user can visually appreciate the complete load
      const transitionTimeout = setTimeout(() => {
        setIsReady(true);
      }, 600);
      
      return () => clearTimeout(transitionTimeout);
    }
  }, [progress]);

  return { progress, loadingStep, isReady };
}
