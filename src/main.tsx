import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ParallaxProvider } from 'react-scroll-parallax';
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ParallaxProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ParallaxProvider>
  </StrictMode>
);
