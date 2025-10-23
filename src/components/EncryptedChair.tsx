import { useObfuscatedGLTF } from "../hooks/useObfuscatedGLTF";

export const EncryptedChair = () => {
  const { scene } = useObfuscatedGLTF(
    "/blender-compressed/chair-transformed-obfuscated.glb",
  );
  return <>{scene && <primitive object={scene} />}</>;
};
