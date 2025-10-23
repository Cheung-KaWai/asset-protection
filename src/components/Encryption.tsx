import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import { EncryptedChair } from "./EncryptedChair";
export const Encryption = () => {
  return (
    <div className="h-svh w-svw">
      <Canvas>
        <OrbitControls />
        <EncryptedChair />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
};
