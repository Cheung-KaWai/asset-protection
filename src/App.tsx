import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Chair, ChairControls, ChairProvider } from "./components/Chair";
import {
  CacheTest,
  CacheTestControls,
  CacheTestProvider,
} from "./components/CacheTest";

export const App = () => {
  const [testMode, setTestMode] = useState<"simple" | "advanced">("simple");

  return (
    <div className="flex h-svh w-svw items-center justify-center bg-amber-50">
      {/* Test mode selector */}
      <div className="absolute top-6 right-6 z-50 w-48">
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
          {/* Header */}
          <div className="border-b border-gray-200 px-3 py-2">
            <h4 className="m-0 text-xs font-semibold text-gray-900">
              Test Mode
            </h4>
          </div>

          {/* Content */}
          <div className="space-y-2 p-3">
            <button
              onClick={() => setTestMode("simple")}
              className={`w-full rounded px-3 py-2 text-xs font-medium transition-colors ${
                testMode === "simple"
                  ? "bg-gray-900 text-white hover:bg-gray-800"
                  : "bg-gray-100 text-gray-900 hover:bg-gray-200"
              }`}
            >
              Simple Toggle
            </button>
            <button
              onClick={() => setTestMode("advanced")}
              className={`w-full rounded px-3 py-2 text-xs font-medium transition-colors ${
                testMode === "advanced"
                  ? "bg-gray-900 text-white hover:bg-gray-800"
                  : "bg-gray-100 text-gray-900 hover:bg-gray-200"
              }`}
            >
              Multiple Instances
            </button>
          </div>
        </div>
      </div>

      {/* Render controls outside Canvas */}
      {testMode === "simple" ? (
        <ChairProvider>
          <ChairControls />
          <Canvas>
            <Chair />
            <OrbitControls />
          </Canvas>
        </ChairProvider>
      ) : (
        <CacheTestProvider>
          <CacheTestControls />
          <Canvas>
            <CacheTest />
            <OrbitControls />
          </Canvas>
        </CacheTestProvider>
      )}
    </div>
  );
};
