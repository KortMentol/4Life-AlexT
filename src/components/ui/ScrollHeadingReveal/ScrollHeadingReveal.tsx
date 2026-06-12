/**
 * @module src/components/ui/ScrollHeadingReveal/ScrollHeadingReveal.tsx
 * @description 21st.dev CharacterV1 with AWWWARDS directional reveals
 * NEW: direction prop for varied entry angles (center/left/right)
 */

import { usePerformanceTier, useTheme } from "@/hooks";
import { motion, useScroll, useTransform } from "framer-motion";
import React, { useEffect, useMemo, useRef, useState } from "react";

interface ScrollHeadingRevealProps {
  children: string;
  className?: string;
  tag?: "h1" | "h2" | "h3" | "h4";
  direction?: "center" | "left" | "right"; // AWWWARDS: directional reveal
  simpleMobile?: boolean; // NEW: Force simple animation on mobile
}

// ═══════════════════════════════════════════════════════════════════════════
// CharacterV1 - HIGH TIER with directional offset
// ═══════════════════════════════════════════════════════════════════════════
const CharacterV1 = ({
  char,
  index,
  centerIndex,
  scrollYProgress,
  direction = "center",
}: {
  char: string;
  index: number;
  centerIndex: number;
  scrollYProgress: any;
  direction?: "center" | "left" | "right";
}) => {
  const isSpace = char === " ";
  const distanceFromCenter = index - centerIndex;

  // AWWWARDS TRICK: Offset entire animation based on direction
  let xStart = distanceFromCenter * 50;
  let rotateStart = distanceFromCenter * 50;
  let rotateYStart = 0; // NEW: Vertical axis rotation (like pages turning)

  if (direction === "left") {
    // Characters fly from LEFT
    xStart = distanceFromCenter * 50 - 200;
    rotateStart = distanceFromCenter * 50 - 75;
    rotateYStart = -90; // Start rotated 90° away from viewer (facing left)
  } else if (direction === "right") {
    // Characters fly from RIGHT
    xStart = distanceFromCenter * 50 + 200;
    rotateStart = distanceFromCenter * 50 + 75;
    rotateYStart = 90; // Start rotated 90° away from viewer (facing right)
  }

  const x = useTransform(scrollYProgress, [0, 0.5], [xStart, 0]);
  const rotateX = useTransform(scrollYProgress, [0, 0.5], [rotateStart, 0]);
  const rotateY = useTransform(scrollYProgress, [0, 0.5], [rotateYStart, 0]); // NEW

  return (
    <motion.span className={`inline-block ${isSpace ? "w-4" : ""}`} style={{ x, rotateX, rotateY, color: "inherit" }}>
      {char}
    </motion.span>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// CharacterMedium - MEDIUM TIER with directional offset
// ═══════════════════════════════════════════════════════════════════════════
const CharacterMedium = ({
  char,
  index,
  centerIndex,
  scrollYProgress,
  direction = "center",
}: {
  char: string;
  index: number;
  centerIndex: number;
  scrollYProgress: any;
  direction?: "center" | "left" | "right";
}) => {
  const isSpace = char === " ";
  const distanceFromCenter = index - centerIndex;

  let xStart = distanceFromCenter * 25;

  if (direction === "left") {
    xStart = distanceFromCenter * 25 - 100;
  } else if (direction === "right") {
    xStart = distanceFromCenter * 25 + 100;
  }

  const x = useTransform(scrollYProgress, [0, 0.5], [xStart, 0]);
  const y = useTransform(scrollYProgress, [0, 0.5], [Math.abs(distanceFromCenter) * 10, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.8, 1]);

  return (
    <motion.span className={`inline-block ${isSpace ? "w-4" : ""}`} style={{ x, y, scale, color: "inherit" }}>
      {char}
    </motion.span>
  );
};

const ScrollHeadingReveal: React.FC<ScrollHeadingRevealProps> = ({
  children,
  className = "",
  tag = "h2",
  direction = "center",
  simpleMobile = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const tier = usePerformanceTier();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [isCssVisible, setIsCssVisible] = useState(false);

  // Dynamic solid color: stark white for dark theme, deep graphite for light theme
  const headingColor = isDark ? "#f8fafc" : "#1e293b";

  const isTouchDevice = useMemo(() => {
    return typeof window !== "undefined" && ("ontouchstart" in window || navigator.maxTouchPoints > 0);
  }, []);

  const activeTier = useMemo(() => {
    if (tier === "low") return "low";
    if (isTouchDevice && simpleMobile) return "low";
    if (isTouchDevice) return "medium";
    return "high";
  }, [tier, isTouchDevice, simpleMobile]);

  // Parse text into structured words and characters to prevent mid-word wrapping
  const { structuredWords, totalChars } = useMemo(() => {
    const wordsArray = children.split(" ");
    let charCounter = 0;
    const structured = wordsArray.map((word) => {
      const chars = word.split("").map((char) => {
        const globalIdx = charCounter;
        charCounter++;
        return { char, globalIdx };
      });
      charCounter++; // Account for space
      return { chars };
    });
    return { structuredWords: structured, totalChars: charCounter - 1 };
  }, [children]);

  const centerIndex = useMemo(() => Math.floor(totalChars / 2), [totalChars]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  useEffect(() => {
    if (activeTier !== "low" || !containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry) {
          setIsCssVisible(entry.isIntersecting);
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [activeTier]);

  const TagElement = tag;

  if (activeTier === "low") {
    return (
      <TagElement
        ref={containerRef}
        className={`typography-${tag} ${className}`}
        style={{
          opacity: isCssVisible ? 1 : 0,
          transform: isCssVisible ? "translateY(0)" : "translateY(20px)",
          transition: "all 0.8s ease-out",
          color: headingColor,
        }}
      >
        {children}
      </TagElement>
    );
  }

  return (
    <TagElement
      ref={containerRef}
      className={`typography-${tag} ${className} flex flex-wrap justify-center overflow-visible`}
      style={{
        perspective: activeTier === "high" ? "500px" : "none",
        color: headingColor,
      }}
    >
      {structuredWords.map((wordData, wordIdx) => (
        <React.Fragment key={wordIdx}>
          <span className="inline-block whitespace-nowrap">
            {wordData.chars.map(({ char, globalIdx }) => {
              if (activeTier === "high") {
                return (
                  <CharacterV1
                    key={globalIdx}
                    char={char}
                    index={globalIdx}
                    centerIndex={centerIndex}
                    scrollYProgress={scrollYProgress}
                    direction={direction}
                  />
                );
              } else {
                return (
                  <CharacterMedium
                    key={globalIdx}
                    char={char}
                    index={globalIdx}
                    centerIndex={centerIndex}
                    scrollYProgress={scrollYProgress}
                    direction={direction}
                  />
                );
              }
            })}
          </span>
          {wordIdx < structuredWords.length - 1 && <span className="inline-block w-[0.27em]" aria-hidden="true" />}
        </React.Fragment>
      ))}
    </TagElement>
  );
};

export default React.memo(ScrollHeadingReveal);
