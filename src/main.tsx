import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ParallaxProvider } from 'react-scroll-parallax';
import { HelmetProvider } from 'react-helmet-async';
import Lenis from 'lenis';
import App from "./App.tsx";
import "./index.css";
import "./fixes.css";
import "./styles/animations.css";
import "./styles/modern-design.css";
import { ThemeProvider } from './context/ThemeContext';

// Инициализация плавного скролла
const initSmoothScroll = () => {
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
  });

  function raf(time: number) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);

  // Делаем lenis доступным глобально для других компонентов
  (window as any).lenis = lenis;
};

// Инициализируем плавный скролл
initSmoothScroll();

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