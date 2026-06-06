// import React from "react"; - <React.StrictMode> отключен ниже
import ReactDOM from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import App from "./App";
import { FluidProvider } from "./context/FluidProvider";
import { ThemeProvider } from "./context/ThemeProvider";
import { TransitionProvider } from "./context/TransitionProvider";

// Стили
import "./styles/base/animations.css";
import "./styles/base/base.css";
import "./styles/base/fixes.css";
import "./styles/base/modern-design.css";
import "./styles/globals.css";
import "./styles/image-rendering.css";

// --- AWWWARDS 2026: SCROLL RESTORATION FIX ---
// Отключаем нативное восстановление скролла браузером,
// так как мы используем кастомную логику с двойным RAF и GSAP в RouteChangeHandler.tsx.
// Это предотвращает скачки страницы до появления вуали перехода.
if (typeof window !== "undefined" && "scrollRestoration" in window.history) {
  window.history.scrollRestoration = "manual";
}
// ----------------------------------------------

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
      />,
    ),
    {
      future: {
        v7_relativeSplatPath: true,
      },
    },
  );

  ReactDOM.createRoot(rootElement).render(
    //<React.StrictMode> - временно отключен
    <RouterProvider router={router} />,
    //</React.StrictMode> - временно отключен
  );

  // Preload lazy-loaded page chunks before signaling app is ready
  // HomePage excluded - loaded synchronously in App.tsx for instant FCP
  Promise.allSettled([
    import("@/pages/ProductsPage"),
    import("@/pages/AboutPage"),
    import("@/pages/AboutMePage"),
    import("@/pages/ContactPage"),
    import("@/pages/PartnershipPage"),
    import("@/pages/HowToBuyPage"),
  ]).then(() => {
    // Dispatch event only when all chunks are loaded in RAM
    window.dispatchEvent(new CustomEvent("app-mounted"));
  });
};

// Initialize app when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}
