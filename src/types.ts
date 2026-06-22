export interface AlbumData {
  id: string;
  title: string;
  type: "EP" | "ALBUM";
  releaseYear: number;
  spotifyUrl: string;
  embedUrl: string;
  colorTheme: {
    primary: string;
    secondary: string;
    glow: string;
    ambient: string;
  };
  concept: string;
  description: string;
  trackCount: number;
  atmosphere: string;
  tracklist: string[];
}

export interface SynthParameter {
  id: string;
  name: string;
  min: number;
  max: number;
  step: number;
  value: number;
  unit: string;
}

export interface SocialProfile {
  name: string;
  url: string;
  handle: string;
  platform: "instagram" | "tiktok" | "youtube";
}
