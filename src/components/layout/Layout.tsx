import { FluidProvider } from "@/context/FluidProvider";
import { updateScroll } from "@/lib/lenis";
import { AnimatePresence } from "framer-motion";
import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import FluidEffect from "../effects/FluidEffect";
import ScrollToTopButton from "../ui/ScrollToTopButton";
import Footer from "./Footer";
const Layout: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    const updateScrollAfterRender = () => {
      requestAnimationFrame(() => {
        updateScroll();
      });
    };
    updateScrollAfterRender();
    window.addEventListener("load", updateScrollAfterRender);
    return () => {
      window.removeEventListener("load", updateScrollAfterRender);
    };
  }, [location.pathname]);

  return (
    <>
      <FluidProvider>
        <FluidEffect />
      </FluidProvider>
      {/* Header теперь находится в App.tsx и рендерится над Layout */}
      {/* ИЗМЕНЕНИЕ: Убираем pt-20 отсюда */}
      <main id="main-content" className="flex-grow">
        <AnimatePresence mode="wait">
          <Outlet key={location.pathname} />
        </AnimatePresence>
      </main>
      <Footer />
      <ScrollToTopButton />
    </>
  );
};

export default Layout;
