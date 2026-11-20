import React, { useRef } from "react";
import { motion, useInView, useReducedMotion, useScroll, useTransform } from "framer-motion";

import { usePerformanceTier } from "@/hooks";

export interface ParallaxImageProps {
  src: string;
  alt: string;
  caption?: string;
  ratio?: "portrait" | "landscape" | "wide" | "square";
  className?: string;
  objectPosition?: string;
  priority?: boolean;
}

const ratioClasses = {
  portrait: "aspect-[4/5]",
  landscape: "aspect-[16/10]",
  wide: "aspect-[16/7]",
  square: "aspect-square",
};

const ParallaxImage: React.FC<ParallaxImageProps> = ({
  src,
  alt,
  caption,
  ratio = "landscape",
  className = "",
  objectPosition = "center",
  priority = false,
}) => {
  const frameRef = useRef<HTMLDivElement>(null);
  const tier = usePerformanceTier();
  const prefersReducedMotion = useReducedMotion();
  const isVisible = useInView(frameRef, { once: true, margin: "-10%" });
  const { scrollYProgress } = useScroll({
    target: frameRef,
    offset: ["start end", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);
  const canParallax = tier === "high" && !prefersReducedMotion;
  const canReveal = tier !== "low" && !prefersReducedMotion;

  return (
    <figure className={`group relative m-0 ${className}`}>
      <div
        ref={frameRef}
        className={`relative isolate overflow-hidden rounded-[1.75rem] border border-white/[0.08] bg-[#050811] ${ratioClasses[ratio]}`}
      >
        <motion.div
          className="absolute inset-0"
          initial={canReveal ? { clipPath: "inset(100% 0% 0% 0%)" } : false}
          animate={isVisible ? { clipPath: "inset(0% 0% 0% 0%)" } : undefined}
          transition={{ duration: 1.05, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.img
            src={src}
            alt={alt}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            fetchPriority={priority ? "high" : "auto"}
            className="absolute -top-[8%] h-[116%] w-full object-cover"
            initial={canReveal ? { scale: 1.12 } : false}
            animate={isVisible ? { scale: 1 } : undefined}
            transition={{ duration: 1.05, ease: [0.16, 1, 0.3, 1] }}
            style={{
              objectPosition,
              y: canParallax ? imageY : 0,
            }}
          />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#03050a]/70 via-transparent to-[#03050a]/10"
            aria-hidden="true"
          />
        </motion.div>
        <span className="pointer-events-none absolute bottom-3 left-3 z-10 h-px w-12 bg-cyan-400/80" aria-hidden="true" />
      </div>
      {caption ? (
        <figcaption className="mt-3 flex items-start justify-between gap-4 text-xs leading-relaxed text-slate-400">
          <span>{caption}</span>
          <span className="shrink-0 font-mono tabular-nums text-slate-500" aria-hidden="true">
            4L / 01
          </span>
        </figcaption>
      ) : null}
    </figure>
  );
};

export default React.memo(ParallaxImage);
