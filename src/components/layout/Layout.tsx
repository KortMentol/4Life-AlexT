/**
 * @module src/components/layout/Layout.tsx
 * @description Root application shell implementing the true Awwwards Sticky Curtain Reveal Footer:
 * A lightweight ResizeObserver keeps <main>'s CSS sticky top at min(0, vh - mainHeight).
 * As soon as the bottom of <main> reaches the bottom of the viewport, the entire page locks in place
 * while <Footer /> (relative z-30) glides smoothly over top of it across all 3 tiers & touch devices.
 */

import { ScrollToTopButton } from "@/components/ui";
import { updateScroll } from "@/lib/lenis";
import { AnimatePresence } from "framer-motion";
import React, { useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import CustomScrollbar from "../ui/CustomScrollbar";
import Footer from "./Footer";

const Layout: React.FC = () => {
  const location = useLocation();
  const mainRef = useRef<HTMLElement>(null);

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

  // Pure compositor Sticky Curtain math: top = min(0, viewportHeight - mainHeight)
  // Zero scroll listeners, zero RAF loops — updates only on actual main height / viewport resize.
  useEffect(() => {
    const mainEl = mainRef.current;
    if (!mainEl) return;

    const syncStickyOffset = () => {
      const vh = window.innerHeight;
      const mainH = mainEl.offsetHeight;
      const stickyTop = Math.min(0, vh - mainH);
      mainEl.style.setProperty("--curtain-sticky-top", `${stickyTop}px`);
    };

    syncStickyOffset();

    const ro = new ResizeObserver(syncStickyOffset);
    ro.observe(mainEl);
    window.addEventListener("resize", syncStickyOffset, { passive: true });

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", syncStickyOffset);
    };
  }, [location.pathname]);

  return (
    <div className="site-curtain-shell relative flex flex-col min-h-[100svh] bg-[#03050a]">
      <CustomScrollbar />
      <main
        ref={mainRef}
        id="main-content"
        style={{
          position: "sticky",
          top: "var(--curtain-sticky-top, 0px)",
        }}
        className="site-curtain-main sticky z-10 flex-grow min-h-[100svh] bg-[#03050a]"
      >
        <AnimatePresence mode="wait">
          <Outlet key={location.pathname} />
        </AnimatePresence>
      </main>
      <Footer />
      <ScrollToTopButton />
    </div>
  );
};

export default React.memo(Layout);