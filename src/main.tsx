import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./css/index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <div className="flex justify-center items-center h-screen">
      <h1>Hello World</h1>
    </div>
  </StrictMode>
);
