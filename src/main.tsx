import React from "react";
import ReactDOM from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter } from "react-router-dom";
import { ParallaxProvider } from "react-scroll-parallax";
import App from "./App";
import { FluidProvider } from "./components/effects/FluidContext";
import { ThemeProvider } from "./context/ThemeContext";
import "./styles/animations.css";
import "./styles/fixes.css";
import "./styles/icon-shield-fix.css";
import "./styles/index.css";
import "./styles/menu-animations.css";
import "./styles/menu-dividers.css";
import "./styles/modern-design.css";

// Функция для инициализации приложения
const initApp = () => {
  const rootElement = document.getElementById("root");

  if (!rootElement) {
    console.error("Root element not found");
    return;
  }

  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <BrowserRouter>
        <HelmetProvider>
          <ThemeProvider>
            <FluidProvider>
              <ParallaxProvider>
                <App />
              </ParallaxProvider>
            </FluidProvider>
          </ThemeProvider>
        </HelmetProvider>
      </BrowserRouter>
    </React.StrictMode>,
  );
};

// Запускаем приложение
initApp();
