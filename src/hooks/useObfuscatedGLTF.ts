import { useState, useEffect, useMemo } from "react";
import {
  GLTFLoader,
  type GLTF,
} from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import type { Object3D } from "three";

type UseObfuscatedGLTFResult = {
  gltf: GLTF | null;
  scene: Object3D | null;
  error: Error | null;
};

const dracoPath = "https://www.gstatic.com/draco/versioned/decoders/1.5.7/";

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath(dracoPath);

const loader = new GLTFLoader();
loader.setDRACOLoader(dracoLoader);

export function useObfuscatedGLTF(url: string | null): UseObfuscatedGLTFResult {
  const [gltf, setGltf] = useState<GLTF | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!url) return;

    let cancelled = false;

    const load = async () => {
      try {
        const response = await fetch(url);
        const data = new Uint8Array(await response.arrayBuffer());

        // Reverse XOR obfuscation
        for (let i = 0; i < data.length; i++) {
          data[i] ^= 0xaa;
        }

        loader.parse(
          data.buffer,
          "",
          (parsed) => {
            if (!cancelled) setGltf(parsed);
          },
          (err) => {
            if (!cancelled)
              setError(err instanceof Error ? err : new Error(err.message));
          },
        );
      } catch (err) {
        if (!cancelled) setError(err as Error);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [url]);

  const scene = useMemo(() => (gltf ? gltf.scene.clone() : null), [gltf]);

  return { gltf, scene, error };
}
