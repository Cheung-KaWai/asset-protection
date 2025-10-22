import { Suspense } from "react";
import { useGzipModel } from "../hooks/useGzipModel";

export const GzipModel = ({ url }: { url: string }) => {
  const { scene } = useGzipModel(url);

  return (
    <>
      <Suspense>{scene && <primitive object={scene} />}</Suspense>
    </>
  );
};
