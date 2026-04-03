/**
 * @module src/components/sections/PartnershipSection/PartnershipSection.tsx
 * @description Awwwards 2026 Immersive Partnership Section
 * Scroll-driven параллакс, light/dark тема, 60fps на touch high-tier.
 * @author Kort
 * @version 4.0.0
 */

import { usePerformanceTier, useTheme } from "@/hooks";
import { useScroll, useSpring } from "framer-motion";
import React, { useRef } from "react";
import FeaturesGrid from "./FeaturesGrid";
import FinalCTA from "./FinalCTA";
import FloatingParticles from "./FloatingParticles";
import GradientMeshBackground from "./GradientMeshBackground";
import HeroIntro from "./HeroIntro";
import ImmersiveQuote from "./ImmersiveQuote";
import { IS_TOUCH } from "./types";

const PartnershipSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const tier = usePerformanceTier();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // На touch — передаём raw scrollYProgress без useSpring
  // Все дочерние компоненты используют только useTransform (compositor-only)
  // На desktop — useSpring для плавности
  const smoothProgress = IS_TOUCH
    ? scrollYProgress
    : useSpring(scrollYProgress, {
        stiffness: tier === "high" ? 100 : tier === "medium" ? 70 : 50,
        damping: tier === "high" ? 28 : tier === "medium" ? 35 : 40,
        mass: tier === "high" ? 0.5 : tier === "medium" ? 0.8 : 1,
      });

  // Высота секции:
  // low = auto (нет sticky scroll)
  // touch = 320vh (контент короче — меньше скролла)
  // desktop = 380vh (подогнано чтобы не было пустоты после FinalCTA)
  const sectionHeight = tier === "low" ? "auto" : IS_TOUCH ? "320vh" : "380vh";

  return (
    <section ref={containerRef} className="relative bg-transparent" style={{ minHeight: sectionHeight }}>
      {/* Base background — ниже fluid (fluid fixed z:-10) */}
      <div className="absolute inset-0 -z-20 pointer-events-none">
        <div
          className="w-full h-full transition-colors duration-500"
          style={{
            background: isDark ? "#020617" : "#e8f0fe",
          }}
        />
      </div>

      {/* Sticky орбы — выше base, ниже fluid */}
      <div className="sticky top-0 h-screen" style={{ zIndex: -15 }}>
        <GradientMeshBackground scrollYProgress={smoothProgress} tier={tier} isDark={isDark} />
        <FloatingParticles tier={tier} isDark={isDark} />
      </div>

      {/* Контент — выше fluid (z:10) */}
      <div className="relative z-10" style={{ marginTop: "-100vh" }}>
        <HeroIntro scrollYProgress={smoothProgress} tier={tier} isDark={isDark} />
        <ImmersiveQuote scrollYProgress={smoothProgress} tier={tier} isDark={isDark} />
        <FeaturesGrid scrollYProgress={smoothProgress} tier={tier} isDark={isDark} />
        <FinalCTA scrollYProgress={smoothProgress} tier={tier} isDark={isDark} />
      </div>
    </section>
  );
};

export default React.memo(PartnershipSection);
