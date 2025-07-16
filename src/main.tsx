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

import { ThemeProvider } from "./context/ThemeProvider";


// Base styles (Tailwind directives)
import "./styles/base.css";
// Global styles (resets, typography, etc.)
import "./styles/globals.css";
// Browser/device specific fixes
import "./styles/fixes.css";
// Modern design system and animations
import "./styles/modern-design.css";
// Mobile menu styles
import "./styles/mobile-menu.css";
// Стили для хедера
import "./styles/header-glow.css";

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
              <ParallaxProvider>
                <App />
              </ParallaxProvider>
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
