/**
 * @module PartnershipSection/PartnershipSection.tsx
 * Root-компонент секции "Партнёрство".
 *
 * Архитектура:
 *  - usePerformanceTier() → tier (high/medium/low)
 *  - useTheme()           → isDark → палитра
 *  - ChapterNav           → фиксированная навигация (desktop, non-touch)
 *  - 5 глав               → Portal → Ticker → Science → Model → Economics → Invitation
 *
 * Tier behaviour:
 *  high   → scramble text, cursor follower, SVG network (12 nodes), animated counters
 *  medium → clip reveals, animated counters, SVG network (7 nodes)
 *  low    → static fade-in only, no springs, no SVG
 */

import { usePerformanceTier } from "@/hooks/usePerformanceTier";
import { useTheme } from "@/hooks/useTheme";
import { useInView } from "framer-motion";
import React, { memo, useCallback, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import Economics from "./chapters/Economics";
import Invitation from "./chapters/Invitation";
import Model from "./chapters/Model";
import Portal from "./chapters/Portal";
import Science from "./chapters/Science";
import { getPalette } from "./constants";
import ChapterNav from "./ui/ChapterNav";
import Ticker from "./ui/Ticker";

const PartnershipSection = memo(() => {
  const tier = usePerformanceTier();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const palette = getPalette(isDark);
  const location = useLocation();

  // ChapterNav показывается только на /partnership странице
  // На HomePage он конфликтует с PageNav
  const isPartnershipPage = location.pathname === "/partnership";

  const [chapter, setChapter] = useState(0);
  const handleChapter = useCallback((n: number) => setChapter(n), []);

  // Отслеживаем видимость секции для ChapterNav
  const sectionRef = useRef<HTMLDivElement>(null);
  const sectionInView = useInView(sectionRef, { margin: "0px" });

  // Refs к главам для кликабельного ChapterNav на /partnership
  const portalRef = useRef<HTMLDivElement>(null);
  const scienceRef = useRef<HTMLElement>(null);
  const modelRef = useRef<HTMLElement>(null);
  const economicsRef = useRef<HTMLElement>(null);
  const invitationRef = useRef<HTMLElement>(null);

  const chapterRefs = [portalRef, scienceRef, modelRef, economicsRef, invitationRef];

  return (
    <div
      ref={sectionRef}
      style={{
        background: palette.bg,
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
        position: "relative",
        transition: "background-color 0.4s ease",
      }}
    >
      {/* ChapterNav — только на /partnership, скрыт когда секция не в viewport */}
      {isPartnershipPage && (
        <ChapterNav
          active={chapter}
          tier={tier}
          palette={palette}
          visible={sectionInView}
          chapterRefs={chapterRefs as React.RefObject<HTMLElement | HTMLDivElement | null>[]}
        />
      )}

      {/* Глава 0 — входной экран */}
      <Portal ref={portalRef} tier={tier} palette={palette} onChapter={handleChapter} />

      {/* Бегущая строка */}
      <Ticker tier={tier} palette={palette} />

      {/* Глава 1 — наука */}
      <Science ref={scienceRef} tier={tier} palette={palette} onChapter={handleChapter} />

      {/* Разделитель */}
      <div
        className="mx-auto"
        style={{
          maxWidth: 1400,
          height: 1,
          background: `linear-gradient(90deg, transparent, ${palette.overlay10}, transparent)`,
        }}
      />

      {/* Глава 2 — модель */}
      <Model ref={modelRef} tier={tier} palette={palette} onChapter={handleChapter} />

      {/* Глава 3 — экономика */}
      <Economics ref={economicsRef} tier={tier} palette={palette} onChapter={handleChapter} />

      {/* Глава 4 — приглашение */}
      <Invitation ref={invitationRef} tier={tier} palette={palette} onChapter={handleChapter} />
    </div>
  );
});

PartnershipSection.displayName = "PartnershipSection";

export default PartnershipSection;
