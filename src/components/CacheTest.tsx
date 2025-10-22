import { Suspense, useState, createContext, useContext } from "react";
import {
  useGzipModel,
  setCacheEnabled as setGlobalCacheEnabled,
  clearCache,
} from "../hooks/useGzipModel";

// Create a context for sharing cache test state
const CacheTestContext = createContext<{
  instances: string[];
  setInstances: (instances: string[]) => void;
  nextId: number;
  setNextId: (id: number) => void;
  cacheEnabled: boolean;
  setCacheEnabled: (enabled: boolean) => void;
}>({
  instances: [],
  setInstances: () => {},
  nextId: 1,
  setNextId: () => {},
  cacheEnabled: true,
  setCacheEnabled: () => {},
});

const ChairModel = ({ id }: { id: string }) => {
  const { scene, loading, error } = useGzipModel(
    "/blender-compressed/chair-transformed.glb.gz",
  );

  console.log(
    `ChairModel ${id} - scene:`,
    !!scene,
    "loading:",
    loading,
    "error:",
    !!error,
  );

  return (
    <group position={[parseInt(id) * 2, 0, 0]}>
      <Suspense fallback={null}>
        {scene && <primitive object={scene.clone()} />}
      </Suspense>
      {/* Debug info */}
      <mesh position={[0, -1, 0]}>
        <boxGeometry args={[0.1, 0.1, 0.1]} />
        <meshBasicMaterial
          color={loading ? "yellow" : error ? "red" : "green"}
        />
      </mesh>
    </group>
  );
};

export const CacheTest = () => {
  const { instances } = useContext(CacheTestContext);

  console.log("CacheTest rendering with instances:", instances);

  return (
    <>
      {/* Render all chair instances */}
      {instances.map((id) => (
        <ChairModel key={id} id={id} />
      ))}
    </>
  );
};

export const CacheTestControls = () => {
  const {
    instances,
    setInstances,
    nextId,
    setNextId,
    cacheEnabled,
    setCacheEnabled,
  } = useContext(CacheTestContext);

  const addInstance = () => {
    const newInstances = [...instances, nextId.toString()];
    console.log("Adding instance:", nextId, "New instances:", newInstances);
    setInstances(newInstances);
    setNextId(nextId + 1);
  };

  const removeInstance = (id: string) => {
    setInstances(instances.filter((instanceId) => instanceId !== id));
  };

  const clearAll = () => {
    setInstances([]);
  };

  const toggleCache = () => {
    const newCacheState = !cacheEnabled;
    setCacheEnabled(newCacheState); // Update local context state
    setGlobalCacheEnabled(newCacheState); // Update global cache state
  };

  const handleClearCache = () => {
    clearCache();
  };

  return (
    <div className="absolute top-6 left-6 z-50 w-80">
      {/* Main Card */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        {/* Header */}
        <div className="border-b border-gray-200 px-4 py-3">
          <h3 className="m-0 text-sm font-semibold text-gray-900">
            Multiple Instance Controls
          </h3>
          <p className="m-0 mt-1 text-xs text-gray-500">
            Test caching with multiple chairs
          </p>
        </div>

        {/* Content */}
        <div className="space-y-4 p-4">
          {/* Instance Controls */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Chair Instances</span>
              <span className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-700">
                {instances.length} Active
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={addInstance}
                className="rounded bg-gray-900 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-gray-800"
              >
                Add Instance
              </button>

              <button
                onClick={clearAll}
                className="rounded bg-gray-100 px-3 py-2 text-xs font-medium text-gray-900 transition-colors hover:bg-gray-200"
              >
                Clear All
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200"></div>

          {/* Cache Controls */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Cache Settings</span>
              <span
                className={`rounded px-2 py-1 text-xs ${cacheEnabled ? "bg-gray-100 text-gray-700" : "bg-gray-50 text-gray-500"}`}
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
              <span className="text-gray-600">Cache Status:</span>
              <span
                className={`font-medium ${cacheEnabled ? "text-gray-900" : "text-gray-500"}`}
              >
                {cacheEnabled ? "Active" : "Inactive"}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600">Total Instances:</span>
              <span className="font-medium text-gray-900">
                {instances.length}
              </span>
            </div>
          </div>

          {/* Legend */}
          <div className="rounded bg-gray-50 p-3">
            <div className="mb-2 text-xs font-medium text-gray-700">
              Status Legend:
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="flex items-center space-x-1">
                <div className="h-2 w-2 rounded-full bg-gray-400"></div>
                <span className="text-gray-600">Loaded</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="h-2 w-2 rounded-full bg-gray-300"></div>
                <span className="text-gray-600">Loading</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="h-2 w-2 rounded-full bg-gray-500"></div>
                <span className="text-gray-600">Error</span>
              </div>
            </div>
          </div>

          {/* Individual Instance Controls */}
          {instances.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-medium text-gray-700">
                Instance Controls:
              </div>
              <div className="max-h-32 space-y-2 overflow-y-auto">
                {instances.map((id) => (
                  <div
                    key={id}
                    className="flex items-center justify-between rounded bg-gray-50 p-2"
                  >
                    <span className="text-sm font-medium text-gray-700">
                      Chair #{id}
                    </span>
                    <button
                      onClick={() => removeInstance(id)}
                      className="rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-900 transition-colors hover:bg-gray-200"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const CacheTestProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [instances, setInstances] = useState<string[]>([]);
  const [nextId, setNextId] = useState(1);
  const [cacheEnabled, setCacheEnabled] = useState(true);

  return (
    <CacheTestContext.Provider
      value={{
        instances,
        setInstances,
        nextId,
        setNextId,
        cacheEnabled,
        setCacheEnabled,
      }}
    >
      {children}
    </CacheTestContext.Provider>
  );
};
