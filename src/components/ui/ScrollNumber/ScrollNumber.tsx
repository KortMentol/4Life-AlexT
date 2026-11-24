import { useFeatureFlag, usePerformanceTier } from "@/hooks";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import React, { useRef } from "react";

interface ScrollNumberProps {
  number: string;
  className?: string;
}

const ScrollNumber: React.FC<ScrollNumberProps> = ({ number, className = "" }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const tier = usePerformanceTier();

  const isTouchDevice =
    typeof window !== "undefined" ? "ontouchstart" in window || navigator.maxTouchPoints > 0 : false;
  const isAnimEnabled = !isTouchDevice && useFeatureFlag("scrollNumberAnimation", tier !== "low");

  const inView = useInView(containerRef, { once: false, margin: "200px" });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 1", "end 0.6"],
  });

  const maskY = useTransform(scrollYProgress, [0, 1], ["100%", "0%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["-100%", "0%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 1], [0, 1, 0.9]);

  return (
    <div ref={containerRef} className={`relative select-none ${className}`}>
      <div className="text-cyan-400/10">{number}</div>

      {isAnimEnabled && inView ? (
        <motion.div
          className="absolute inset-0 overflow-hidden pointer-events-none"
          style={{
            y: maskY,
            willChange: "transform",
          }}
        >
          <motion.div
            className="absolute inset-0"
            style={{
              y: textY,
              opacity,
              color: "#22d3ee",
              willChange: "transform, opacity",
            }}
          >
            {number}
          </motion.div>
        </motion.div>
      ) : (
        <div
          className="absolute inset-0"
          style={{
            color: "#22d3ee",
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
