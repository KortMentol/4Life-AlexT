/**
 * @module MediaSlide
 * @description Renders a single modal media slot:
 * Slot 0 (isBottleSlide): unified monochrome architectural studio lightbox (matches catalog cards).
 * Slots 1–2: atmospheric photo with obsidian edge vignette.
 * Slot 3: auto-playing video when active.
 */

import { GalleryItem } from "@/data/productsData";
import { Icons } from "@/utils/icons";
import React, { useEffect, useRef } from "react";

interface MediaSlideProps {
  item: GalleryItem;
  isActive: boolean;
  isBottleSlide?: boolean;
  auraColor?: string;
}

const MODAL_LIGHTBOX_BG =
  "radial-gradient(ellipse 74% 58% at 50% 24%, rgba(186, 230, 253, 0.09) 0%, rgba(14, 165, 233, 0.032) 44%, rgba(5, 10, 20, 0) 78%), linear-gradient(180deg, rgba(255, 255, 255, 0.035) 0%, rgba(5, 10, 20, 0) 36%)";

export const MediaSlide: React.FC<MediaSlideProps> = ({
  item,
  isActive,
  isBottleSlide = false,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (isActive) {
      v.play().catch(() => {});
    } else {
      v.pause();
      v.currentTime = 0;
    }
  }, [isActive]);

  if (item.type === "video") {
    return (
      <div className="relative w-full h-full bg-[#03050a] flex items-center justify-center">
        <video
          ref={videoRef}
          src={item.src}
          muted
          loop
          playsInline
          preload="metadata"
          className="w-full h-full object-cover"
        />
        {!isActive && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-black/30">
            <div className="w-14 h-14 rounded-full bg-[#050811]/80 border border-cyan-400/40 flex items-center justify-center">
              <Icons.Play fill="currentColor" stroke="none" className="w-6 h-6 text-cyan-400 ml-0.5" />
            </div>
          </div>
        )}
      </div>
    );
  }

  if (isBottleSlide) {
    return (
      <div
        className="relative w-full h-full bg-[#060b15] flex items-center justify-center overflow-hidden p-7 md:p-10"
        style={{ backgroundImage: MODAL_LIGHTBOX_BG }}
      >
        {/* Pure pre-baked radial contact shadow under bottle (zero AI reticle circles, zero blur filter) */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 w-48 h-7 rounded-full"
          style={{
            backgroundImage:
              "radial-gradient(ellipse at center, rgba(0, 0, 0, 0.88) 0%, rgba(0, 0, 0, 0.34) 48%, transparent 74%)",
          }}
        />

        <img
          src={item.src}
          alt={item.alt ?? ""}
          loading="eager"
          decoding="async"
          className="relative z-10 max-h-[86%] max-w-[82%] w-auto h-auto object-contain"
        />
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-[#050811] flex items-center justify-center overflow-hidden">
      <img
        src={item.src}
        alt={item.alt ?? ""}
        loading={isActive ? "eager" : "lazy"}
        decoding="async"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#03050a]/75 via-transparent to-[#03050a]/25 pointer-events-none" />
    </div>
  );
};