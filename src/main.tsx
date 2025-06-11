import React from "react";
import ReactDOM from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { ParallaxProvider } from "react-scroll-parallax";
import App from "./App";
import { FluidProvider } from "./components/effects/FluidContext";
import { ThemeProvider } from "./context/ThemeContext";
import { startLenisRaf } from "./lib/lenis";

// Base styles (Tailwind directives)
import "./styles/base.css";
// Global styles (resets, typography, etc.)
import "./styles/globals.css";
// Browser/device specific fixes
import "./styles/fixes.css";
// Modern design system and animations
import "./styles/modern-design.css";

// Инициализация плавного скроллинга
startLenisRaf();

// Функция для инициализации приложения
const initApp = () => {
  const rootElement = document.getElementById("root");

  if (!rootElement) {
    console.error("Root element not found");
    return;
  }

  // Создаем роутер с поддержкой будущих флагов v7
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route
        path="*"
        element={
          <HelmetProvider>
            <ThemeProvider>
              <FluidProvider>
                <ParallaxProvider>
                  <App />
                </ParallaxProvider>
              </FluidProvider>
            </ThemeProvider>
          </HelmetProvider>
        }
      />,
    ),
    {
      future: {
        v7_relativeSplatPath: true,
      },
    },
  );

  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>,
  );
};

// Запускаем приложение
initApp();
