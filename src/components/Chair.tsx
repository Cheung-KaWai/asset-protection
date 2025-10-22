// import { useGLTF } from "@react-three/drei";
import { Suspense, useState, createContext, useContext } from "react";
import {
  useGzipModel,
  setCacheEnabled as setGlobalCacheEnabled,
  clearCache,
} from "../hooks/useGzipModel";

// Create a context for sharing visibility state
const ChairVisibilityContext = createContext<{
  isVisible: boolean;
  setIsVisible: (visible: boolean) => void;
  cacheEnabled: boolean;
  setCacheEnabled: (enabled: boolean) => void;
}>({
  isVisible: true,
  setIsVisible: () => {},
  cacheEnabled: true,
  setCacheEnabled: () => {},
});

const ChairModel = () => {
  const { scene } = useGzipModel(
    "/blender-compressed/chair-transformed.glb.gz",
  );

  return (
    <>
      <Suspense>{scene && <primitive object={scene} />}</Suspense>
    </>
  );
};

export const Chair = () => {
  const { isVisible } = useContext(ChairVisibilityContext);

  return (
    <>
      {/* Conditionally render the chair */}
      {isVisible && <ChairModel />}
    </>
  );
};

export const ChairControls = () => {
  const { isVisible, setIsVisible, cacheEnabled, setCacheEnabled } = useContext(
    ChairVisibilityContext,
  );

  const toggleCache = () => {
    const newCacheState = !cacheEnabled;
    setCacheEnabled(newCacheState); // Update local context state
    setGlobalCacheEnabled(newCacheState); // Update global cache state
  };

  const handleClearCache = () => {
    clearCache();
  };

  return (
    <div className="absolute top-6 left-6 z-50 w-72">
      {/* Main Card */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        {/* Header */}
        <div className="border-b border-gray-200 px-4 py-3">
          <h3 className="m-0 text-sm font-semibold text-gray-900">
            Simple Toggle Controls
          </h3>
          <p className="m-0 mt-1 text-xs text-gray-500">
            Test caching with hide/show
          </p>
        </div>

        {/* Content */}
        <div className="space-y-4 p-4">
          {/* Visibility Controls */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Chair Visibility</span>
              <span
                className={`rounded px-2 py-1 text-xs ${isVisible ? "bg-gray-100 text-gray-700" : "bg-gray-50 text-gray-500"}`}
              >
                {isVisible ? "Visible" : "Hidden"}
              </span>
            </div>

            <button
              onClick={() => setIsVisible(!isVisible)}
              className={`w-full rounded px-3 py-2 text-sm font-medium transition-colors ${
                isVisible
                  ? "bg-gray-900 text-white hover:bg-gray-800"
                  : "bg-gray-100 text-gray-900 hover:bg-gray-200"
              }`}
            >
              {isVisible ? "Hide Chair" : "Show Chair"}
            </button>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200"></div>

          {/* Cache Controls */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Cache Settings</span>
              <span
                className={`rounded px-2 py-1 text-xs ${
                  cacheEnabled
                    ? "bg-gray-100 text-green-600 uppercase"
                    : "bg-gray-50 text-red-600 uppercase"
                }`}
              >
                {cacheEnabled ? "Enabled" : "Disabled"}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={toggleCache}
                className={`rounded px-3 py-2 text-xs font-medium transition-colors ${
                  cacheEnabled
                    ? "bg-gray-100 text-gray-900 hover:bg-gray-200"
                    : "bg-gray-900 text-white hover:bg-gray-800"
                }`}
              >
                {cacheEnabled ? "Disable" : "Enable"}
              </button>

              <button
                onClick={handleClearCache}
                className="rounded bg-gray-100 px-3 py-2 text-xs font-medium text-gray-900 transition-colors hover:bg-gray-200"
              >
                Clear Cache
              </button>
            </div>
          </div>

          {/* Status Indicators */}
          <div className="space-y-1 rounded bg-gray-50 p-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600">Model Status:</span>
              <span
                className={`font-medium ${isVisible ? "text-gray-900" : "text-gray-500"}`}
              >
                {isVisible ? "Mounted" : "Unmounted"}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600">Cache Status:</span>
              <span
                className={`font-medium ${cacheEnabled ? "text-gray-900" : "text-gray-500"}`}
              >
                {cacheEnabled ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ChairProvider = ({ children }: { children: React.ReactNode }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [cacheEnabled, setCacheEnabled] = useState(true);

  return (
    <ChairVisibilityContext.Provider
      value={{
        isVisible,
        setIsVisible,
        cacheEnabled,
        setCacheEnabled,
      }}
    >
      {children}
    </ChairVisibilityContext.Provider>
  );
};
