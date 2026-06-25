import { useFeatureFlag, usePerformanceTier, useTheme } from "@/hooks";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import React, { useRef } from "react";

interface ScrollNumberProps {
  number: string;
  className?: string;
}

const ScrollNumber: React.FC<ScrollNumberProps> = ({ number, className = "" }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const tier = usePerformanceTier();
  const { theme } = useTheme();

  const isTouchDevice = typeof window !== "undefined" ? "ontouchstart" in window || navigator.maxTouchPoints > 0 : false;
  const isAnimEnabled = !isTouchDevice && useFeatureFlag("scrollNumberAnimation", tier !== "low");

  const inView = useInView(containerRef, { once: false, margin: "200px" });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 1", "end 0.6"],
  });

  const clipPath = useTransform(scrollYProgress, [0, 1], ["inset(100% 0 0 0)", "inset(0% 0 0 0)"]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 1], [0, 1, 0.9]);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="text-blue-500/10 dark:text-cyan-400/10 select-none">{number}</div>

      {isAnimEnabled && inView ? (
        <motion.div
          className="absolute inset-0 select-none will-change-transform"
          style={{
            clipPath,
            opacity,
            color: theme === "dark" ? "#22d3ee" : "#0ea5e9",
          }}
        >
          {number}
        </motion.div>
      ) : (
        <div
          className="absolute inset-0 select-none"
          style={{
            color: theme === "dark" ? "#22d3ee" : "#0ea5e9",
            opacity: 0.9,
          }}
        >
          {number}
        </div>
      )}
    </div>
  );
};

export default ScrollNumber;