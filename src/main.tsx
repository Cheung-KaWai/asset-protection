import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./css/index.css";
import { Encryption } from "./components/Encryption";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Encryption />
  </StrictMode>,
);
