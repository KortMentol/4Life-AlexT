// src/components/sections/PartnershipSection/PartnershipSection.tsx
/**
 * @module PartnershipSection/PartnershipSection.tsx
 * Root-компонент секции "Партнёрство".
 * ИСПРАВЛЕНИЕ: Удалены "грязные" линейные разделители (1px gradient divider).
 * Теперь блоки разделяются только чистым визуальным ритмом и отступами (Whitespace).
 * @author Geminis AI & Kort
 * @version 14.0.0
 */

import { usePerformanceTier } from "@/hooks/usePerformanceTier";
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

interface PartnershipSectionProps {
  showNavigation?: boolean;
}

const PartnershipSection = memo(({ showNavigation = true }: PartnershipSectionProps) => {
  const tier = usePerformanceTier();
  const palette = getPalette();
  const location = useLocation();

  const isPartnershipPage = location.pathname === "/partnership";

  const [chapter, setChapter] = useState(0);
  const handleChapter = useCallback((n: number) => setChapter(n), []);

  const sectionRef = useRef<HTMLDivElement>(null);
  const sectionInView = useInView(sectionRef, { margin: "0px" });

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
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
        position: "relative",
        transition: "background-color 0.4s ease",
      }}
    >
      {showNavigation && isPartnershipPage && (
        <ChapterNav
          active={chapter}
          tier={tier}
          palette={palette}
          visible={sectionInView}
          chapterRefs={chapterRefs as React.RefObject<HTMLElement | HTMLDivElement | null>[]}
        />
      )}

      <Portal ref={portalRef} tier={tier} palette={palette} onChapter={handleChapter} />

      <Ticker tier={tier} palette={palette} />

      {/* Padding Bottom увеличен для естественного отрыва секций без полос */}
      <div id="partner-foundation" className="scroll-mt-28 pb-16 md:pb-24">
        <Science ref={scienceRef} tier={tier} palette={palette} onChapter={handleChapter} />
      </div>

      <div id="partner-model" className="scroll-mt-28">
        <Model ref={modelRef} tier={tier} palette={palette} onChapter={handleChapter} />
      </div>

      <div id="partner-economics" className="scroll-mt-28">
        <Economics ref={economicsRef} tier={tier} palette={palette} onChapter={handleChapter} />
      </div>

      <div id="partner-invitation" className="scroll-mt-28">
        <Invitation ref={invitationRef} tier={tier} palette={palette} onChapter={handleChapter} />
      </div>
    </div>
  );
});

PartnershipSection.displayName = "PartnershipSection";
export default PartnershipSection;
