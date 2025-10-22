import { useEffect, useRef } from "react";
import { Group } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import pako from "pako";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

const dracoPath = "https://www.gstatic.com/draco/versioned/decoders/1.5.7/";

const loader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath(dracoPath);
loader.setDRACOLoader(dracoLoader);

export const GzipModel = ({ url }: { url: string }) => {
  const ref = useRef<Group>(null);

  useEffect(() => {
    let isCancelled = false;

    async function loadModel() {
      try {
        const res = await fetch(url);
        const buf = await res.arrayBuffer();

        // Check if cancelled before processing
        if (isCancelled) return;

        // ✅ Detect gzip header directly from buffer
        const isGzipped = new Uint8Array(buf, 0, 2)[0] === 0x1f && new Uint8Array(buf, 0, 2)[1] === 0x8b;

        // Decompress only if needed
        const finalBuffer = isGzipped ? pako.ungzip(new Uint8Array(buf)).buffer : buf;

        // Check if cancelled before parsing
        if (isCancelled) return;

        loader.parse(finalBuffer, "", (gltf) => {
          if (!isCancelled && ref.current) {
            ref.current.add(gltf.scene);
          }
        });
      } catch (err) {
        if (!isCancelled) {
          console.error("Gzipped model load failed:", err);
        }
      }
    }

    loadModel();

    // Cleanup function to prevent memory leaks
    return () => {
      isCancelled = true;
    };
  }, [url]);

  return <group ref={ref} />;
};
