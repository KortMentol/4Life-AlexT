// src/main.tsx

import React from "react";
import ReactDOM from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";
import App from "./App";
import { FluidProvider } from "./context/FluidProvider";
import { ThemeProvider } from "./context/ThemeProvider";
import { TransitionProvider } from "./context/TransitionProvider";

// Стили
import "./styles/base/animations.css";
import "./styles/base/base.css";
import "./styles/base/fixes.css";
import "./styles/base/modern-design.css";
import "./styles/base/theme-variables.css";
import "./styles/globals.css";

const initApp = () => {
  const rootElement = document.getElementById("root");

  if (!rootElement) {
    console.error("Root element not found");
    return;
  }

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route
        path="*"
        element={
          <HelmetProvider>
            <ThemeProvider>
              <FluidProvider>
                <TransitionProvider>
                  <App />
                </TransitionProvider>
              </FluidProvider>
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

initApp();
