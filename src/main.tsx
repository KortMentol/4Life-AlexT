import ReactDOM from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";
import App from "./App";
import { FluidProvider } from "./context/FluidProvider";
import { TransitionProvider } from "./context/TransitionProvider";

// Import variable fonts
import "@fontsource-variable/manrope";
import "@fontsource-variable/syne";

// Стили
import "./styles/base/animations.css";
import "./styles/base/base.css";
import "./styles/base/fixes.css";
import "./styles/base/modern-design.css";
import "./styles/globals.css";
import "./styles/image-rendering.css";

// Импорт оригинальных картинок продуктов для их упреждающего декодирования на GPU
import renuvoMobile from "@/assets/images/products/MobileVersions/Mobile_renuvo.webp";
import tfPlusMobile from "@/assets/images/products/MobileVersions/Mobile_tf-plus.webp";
import tfTrifactorMobile from "@/assets/images/products/MobileVersions/Mobile_tf-trifactor.webp";

import renuvoPC from "@/assets/images/products/renuvo.webp";
import tfPlusPC from "@/assets/images/products/tf-plus.webp";
import tfTrifactorPC from "@/assets/images/products/tf-trifactor.webp";

if (typeof window !== "undefined" && "scrollRestoration" in window.history) {
  window.history.scrollRestoration = "manual";
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
          <HelmetProvider>
            <FluidProvider>
              <TransitionProvider>
                <App />
              </TransitionProvider>
            </FluidProvider>
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

  ReactDOM.createRoot(rootElement).render(<RouterProvider router={router} />);

  // ─── ИНТЕЛЛЕКТУАЛЬНАЯ ПРЕДЗАГРУЗКА И ДЕКОДИРОВАНИЕ РЕСУРСОВ VITE ───
  const isMobile = window.innerWidth < 768;

  // Очередь критически важных банок продуктов
  const productImages = isMobile
    ? [tfPlusMobile, tfTrifactorMobile, renuvoMobile]
    : [tfPlusPC, tfTrifactorPC, renuvoPC];

  const imagePreloadPromises = productImages.map((src) => {
    return new Promise<void>((resolve) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        if (typeof img.decode === "function") {
          img
            .decode()
            .then(() => resolve())
            .catch(() => resolve());
        } else {
          resolve();
        }
      };
      img.onerror = () => resolve();
    });
  });

  // Параллельно подгружаем JS чанки других страниц для бесшовного роутинга
  const pageChunksPromise = Promise.allSettled([
    import("@/pages/ProductsPage"),
    import("@/pages/AboutPage"),
    import("@/pages/AboutMePage"),
    import("@/pages/ContactPage"),
    import("@/pages/PartnershipPage"),
    import("@/pages/HowToBuyPage"),
  ]);

  // Ждем завершения декодирования картинок и ленивой загрузки чанков
  Promise.allSettled([...imagePreloadPromises, pageChunksPromise]).then(() => {
    window.dispatchEvent(new CustomEvent("app-mounted"));
  });
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}
