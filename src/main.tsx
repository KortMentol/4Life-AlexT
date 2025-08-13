import React from "react";
import ReactDOM from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";
import { ParallaxProvider } from "react-scroll-parallax";
import App from "./App";
import { ThemeProvider } from "./context/ThemeProvider";
import { TransitionProvider } from "./context/TransitionProvider";

// Base styles (Tailwind directives)
import "./styles/base.css";
// Global styles (resets, typography, etc.)
import "./styles/globals.css";
// Browser/device specific fixes
import "./styles/fixes.css";
// Modern design system and animations
import "./styles/modern-design.css";
// Переменные темы и глобальные анимации
import "./styles/animations.css";
import "./styles/theme-variables.css";

// Lenis инициализируется автоматически. Простого импорта любого компонента из ./lib/lenis достаточно.

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
              <TransitionProvider>
                <ParallaxProvider>
                  <App />
                </ParallaxProvider>
              </TransitionProvider>
            </ThemeProvider>
          </HelmetProvider>
        }
      />
    ),
    {
      future: {
        v7_relativeSplatPath: true,
      },
    }
  );

  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
};

// Запускаем приложение
initApp();
