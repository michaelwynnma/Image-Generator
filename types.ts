
export type AspectRatio = "1:1" | "16:9" | "9:16";
export type Resolution = "2K" | "4K";

export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  timestamp: number;
  config: {
    aspectRatio: AspectRatio;
    resolution: Resolution;
  };
}

export interface GenerationSettings {
  aspectRatio: AspectRatio;
  resolution: Resolution;
}
