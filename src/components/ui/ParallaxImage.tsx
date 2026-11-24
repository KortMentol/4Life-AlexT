/**
 * @module src/components/ui/ParallaxImage.tsx
 * @description 1-to-1 Cross-Browser Scroll-Driven Editorial Image Plate:
 * - On modern engines supporting `animation-timeline: view()` (Chrome 115+, Safari 26+, Firefox 159+):
 *   runs off-main-thread native CSS Scroll-Driven curtain reveal & window parallax (0 JS scroll overhead).
 * - On older engines (e.g. older Firefox Mobile / Safari):
 *   mounts `<FramerParallaxImageInner />` with mathematically identical `useScroll` + `useTransform` parity.
 * - On Low Tier or `prefers-reduced-motion`: crisp static editorial framing with 0 scroll hooks.
 */

import { usePerformanceTier } from "@/hooks";
import { motion, useScroll, useTransform } from "framer-motion";
import React, { useMemo, useRef } from "react";

export interface ParallaxImageProps {
  src: string;
  alt: string;
  caption?: string;
  className?: string;
  imgClassName?: string;
  aspectClassName?: string;
  priority?: boolean;
}

const supportsNativeSDA = (): boolean => {
  if (typeof window === "undefined" || typeof CSS === "undefined" || typeof CSS.supports !== "function") {
    return false;
  }
  return CSS.supports("animation-timeline", "view()");
};

interface FramerParallaxImageInnerProps {
  src: string;
  alt: string;
  imgClassName: string;
  priority: boolean;
  targetRef: React.RefObject<HTMLElement | null>;
}

/**
 * Isolated Framer Motion scroll-parity subcomponent.
 * Only mounted when `!isLowTier && !useNativeSda`, ensuring zero JS scroll listeners
 * on Low Tier devices and browsers with native CSS Scroll-Driven Animations.
 */
const FramerParallaxImageInner: React.FC<FramerParallaxImageInnerProps> = ({
  src,
  alt,
  imgClassName,
  priority,
  targetRef,
}) => {
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"],
  });

  const parallaxY = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);
  const parallaxScale = useTransform(scrollYProgress, [0, 1], [1.06, 1]);
  const curtainClip = useTransform(
    scrollYProgress,
    [0, 0.32],
    ["inset(12% 0% 12% 0% round 1.75rem)", "inset(0% 0% 0% 0% round 1.75rem)"],
  );
  const curtainOpacity = useTransform(scrollYProgress, [0, 0.28], [0.6, 1]);

  return (
    <motion.div
      className="relative w-full h-full overflow-hidden"
      style={priority ? undefined : { clipPath: curtainClip, opacity: curtainOpacity }}
    >
      <motion.img
        src={src}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        referrerPolicy="no-referrer"
        style={{ y: parallaxY, scale: parallaxScale }}
        className={`w-full h-[116%] -top-[8%] relative object-cover ${imgClassName}`}
      />
    </motion.div>
  );
};

export const ParallaxImage: React.FC<ParallaxImageProps> = ({
  src,
  alt,
  caption,
  className = "",
  imgClassName = "",
  aspectClassName = "aspect-[16/10]",
  priority = false,
}) => {
  const tier = usePerformanceTier();
  const isLowTier = tier === "low";
  const useNativeSda = useMemo(() => supportsNativeSDA(), []);
  const containerRef = useRef<HTMLElement>(null);

  return (
    <figure
      ref={containerRef}
      className={`relative overflow-hidden rounded-[1.75rem] bg-[#050811] border border-white/[0.08] ${aspectClassName} ${className}`}
    >
      {isLowTier ? (
        <div className="relative w-full h-full">
          <img
            src={src}
            alt={alt}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            referrerPolicy="no-referrer"
            className={`w-full h-full object-cover ${imgClassName}`}
          />
        </div>
      ) : useNativeSda ? (
        <div className={`relative w-full h-full overflow-hidden ${priority ? "" : "sda-curtain-frame"}`}>
          <img
            src={src}
            alt={alt}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            referrerPolicy="no-referrer"
            className={`w-full h-[116%] -top-[8%] relative object-cover sda-parallax-img ${imgClassName}`}
          />
        </div>
      ) : (
        <FramerParallaxImageInner
          src={src}
          alt={alt}
          imgClassName={imgClassName}
          priority={priority}
          targetRef={containerRef}
        />
      )}

      {/* Measured contrast scrim for editorial caption legibility */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(3,5,10,0.22) 0%, rgba(3,5,10,0.08) 45%, rgba(3,5,10,0.82) 100%)",
        }}
      />

      {caption && (
        <figcaption className="absolute bottom-4 left-5 right-5 z-10 pointer-events-none">
          <span className="typography-mono text-[11px] tracking-[0.14em] text-white/70">{caption}</span>
        </figcaption>
      )}
    </figure>
  );
};

export default React.memo(ParallaxImage);
