import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ParallaxProvider } from 'react-scroll-parallax';
import { HelmetProvider } from 'react-helmet-async';
import App from "./App.tsx";
import "./index.css";
import { ThemeProvider } from './context/ThemeContext';

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HelmetProvider>
      <ParallaxProvider>
        <BrowserRouter>
          <ThemeProvider>
            <App />
          </ThemeProvider>
        </BrowserRouter>
      </ParallaxProvider>
    </HelmetProvider>
  </StrictMode>
);
