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
import { CursorRenderer } from "./components/cursor/CursorRenderer";
import { FluidProvider } from "./context/FluidProvider";
import { ThemeProvider } from "./context/ThemeProvider";
import { startLenisRaf } from "./lib/lenis";

// Base styles (Tailwind directives)
import "./styles/base.css";
// Global styles (resets, typography, etc.)
import "./styles/globals.css";
// Browser/device specific fixes
import "./styles/fixes.css";
// Modern design system and animations
import "./styles/modern-design.css";
// Advanced cursor styles
import "./styles/cursor.css";
// Mobile menu styles
import "./styles/mobile-menu.css";

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
              <CursorRenderer>
                <FluidProvider>
                  <ParallaxProvider>
                    <App />
                  </ParallaxProvider>
                </FluidProvider>
              </CursorRenderer>
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
