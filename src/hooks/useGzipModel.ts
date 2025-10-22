import { useEffect, useState } from "react";
import { Object3D } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import pako from "pako";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

const dracoPath = "https://www.gstatic.com/draco/versioned/decoders/1.5.7/";

const loader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath(dracoPath);
loader.setDRACOLoader(dracoLoader);

// Simple cache for loaded models
const modelCache = new Map<string, Object3D>();

// Global cache toggle
let cacheEnabled = true;

export const setCacheEnabled = (enabled: boolean) => {
  cacheEnabled = enabled;
  console.log(`🗂️ Cache ${enabled ? "enabled" : "disabled"}`);
};

export const clearCache = () => {
  modelCache.clear();
  console.log("🗑️ Cache cleared");
};

interface UseGzipModelReturn {
  scene: Object3D | null;
  loading: boolean;
  error: Error | null;
}

export const useGzipModel = (url: string): UseGzipModelReturn => {
  const [scene, setScene] = useState<Object3D | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isCancelled = false;

    const loadModel = async () => {
      try {
        setLoading(true);
        setError(null);

        // Check cache first (only if caching is enabled)
        if (cacheEnabled && modelCache.has(url)) {
          console.log(`💾 Using cached model: ${url}`);
          setScene(modelCache.get(url)!);
          setLoading(false);
          return;
        }

        console.log(`🔄 Fetching model: ${url}`);
        const res = await fetch(url);
        const buf = await res.arrayBuffer();

        // Check if cancelled before processing
        if (isCancelled) return;

        // ✅ Detect gzip header directly from buffer
        const isGzipped =
          new Uint8Array(buf, 0, 2)[0] === 0x1f &&
          new Uint8Array(buf, 0, 2)[1] === 0x8b;

        // Decompress only if needed
        const finalBuffer = isGzipped
          ? pako.ungzip(new Uint8Array(buf)).buffer
          : buf;

        // Check if cancelled before parsing
        if (isCancelled) return;

        loader.parse(finalBuffer, "", (gltf) => {
          if (!isCancelled) {
            console.log(`✅ Model loaded successfully: ${url}`);
            // Clone the scene for caching (Three.js objects are mutable)
            const clonedScene = gltf.scene.clone();

            // Only cache if caching is enabled
            if (cacheEnabled) {
              modelCache.set(url, clonedScene);
            }

            setScene(clonedScene);
            setLoading(false);
          }
        });
      } catch (err) {
        if (!isCancelled) {
          const error =
            err instanceof Error ? err : new Error("Failed to load model");
          setError(error);
          setLoading(false);
          console.error("Gzipped model load failed:", err);
        }
      }
    };

    loadModel();

    // Cleanup function to prevent memory leaks
    return () => {
      isCancelled = true;
    };
  }, [url]);

  return { scene, loading, error };
};
