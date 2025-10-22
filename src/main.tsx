import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./css/index.css";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Chair } from "./components/Chair";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <div className="flex justify-center items-center h-svh bg-amber-50 w-svw">
      <Canvas>
        <Chair />
        <OrbitControls />
      </Canvas>
    </div>
  </StrictMode>
);
