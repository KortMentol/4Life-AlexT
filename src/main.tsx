// 1. Base Tailwind 3.4 layers & theme CSS MUST be imported first before any React components
import "./styles/base/base.css";
import "./styles/base/animations.css";
import "./styles/base/fixes.css";
import "./styles/base/modern-design.css";
import "./styles/globals.css";
import "./styles/image-rendering.css";

// 2. Variable fonts (installed in local node_modules)
import "@fontsource-variable/manrope";
import "@fontsource-variable/syne";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";
import App from "./App";
import { FluidProvider } from "./context/FluidProvider";
import { TransitionProvider } from "./context/TransitionProvider";

gsap.registerPlugin(ScrollTrigger);
if (typeof window !== "undefined") {
  window.ScrollTrigger = ScrollTrigger;
}

declare global {
  interface Window {
    __appMounted?: boolean;
    ScrollTrigger?: typeof ScrollTrigger;
  }
}

if (typeof window !== "undefined" && "scrollRestoration" in window.history) {
  try {
    window.history.scrollRestoration = "manual";
  } catch {
    /* silent */
  }
}

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
          <FluidProvider>
            <TransitionProvider>
              <App />
            </TransitionProvider>
          </FluidProvider>
        }
      />,
    ),
    {
      future: {
        v7_relativeSplatPath: true,
      },
    },
  );

  ReactDOM.createRoot(rootElement).render(<RouterProvider router={router} />);

  window.__appMounted = true;
  window.dispatchEvent(new CustomEvent("app-mounted"));

  // Warm up secondary route chunks gently after first paint so boot never spikes network concurrency
  const schedulePrefetch = () => {
    const loaders = [
      () => import("@/pages/ProductsPage"),
      () => import("@/pages/PartnershipPage"),
      () => import("@/pages/HowToBuyPage"),
      () => import("@/pages/AboutPage"),
      () => import("@/pages/AboutMePage"),
      () => import("@/pages/ContactPage"),
    ];
    loaders.forEach((load, idx) => {
      window.setTimeout(() => {
        void load().catch(() => {});
      }, 1400 + idx * 350);
    });
  };

  if (typeof window.requestIdleCallback === "function") {
    window.requestIdleCallback(schedulePrefetch, { timeout: 2500 });
  } else {
    window.setTimeout(schedulePrefetch, 1200);
  }
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}