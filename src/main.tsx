import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Landing } from "./pages/landing/Landing.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Landing/>
  </StrictMode>
);
