// import { useGLTF } from "@react-three/drei";
import { GzipModel } from "./GzipModel";

export const Chair = () => {
  // const { scene } = useGLTF("/chair-transformed.glb");
  return (
    <>
      <GzipModel url="/blender-compressed/chair-transformed.glb.gz" />
    </>
  );
};
