import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ParallaxProvider } from 'react-scroll-parallax';
import { HelmetProvider } from 'react-helmet-async';
import Lenis from 'lenis';
import App from "./App.tsx";
import "./index.css";
import { ThemeProvider } from './context/ThemeContext';

// Initialize Lenis for smooth scrolling
const initLenis = () => {
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
  });

  // Make lenis available globally for other components
  (window as any).lenis = lenis;

  function raf(time: number) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);
};

// Initialize Lenis after the app is mounted
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    initLenis();
  });
}

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
