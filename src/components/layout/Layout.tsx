import { updateScroll } from "@/lib/lenis";
import { AnimatePresence } from "framer-motion";
import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import FluidEffect from "@/components/effects/FluidEffect";
import { ScrollToTopButton } from "@/components/ui";
import Footer from "./Footer";
import CustomScrollbar from "../ui/CustomScrollbar";
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
      <CustomScrollbar />
      <FluidEffect />
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

export default React.memo(Layout);
