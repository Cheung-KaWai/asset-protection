export interface ModelConfig {
  id: string;
  name: string;
  url: string;
}

export const AVAILABLE_MODELS: ModelConfig[] = [
  {
    id: "chair",
    name: "Chair",
    url: "/blender-compressed/chair-transformed.glb.gz",
  },
  {
    id: "chair2",
    name: "Chair 2",
    url: "/chair2.glb.gz",
  },
];

export const DEFAULT_MODEL = AVAILABLE_MODELS[0];
