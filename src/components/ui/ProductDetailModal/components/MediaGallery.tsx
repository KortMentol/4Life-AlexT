/**
 * @module MediaGallery
 * @description 4-slot product media gallery: Slot 0 bottle on Ambient Color Podium,
 * Slots 1-2 atmospheric photos, Slot 3 auto-playing video with dedicated switcher bar.
 */

import { GalleryItem } from "@/data/productsData";
import { Icons } from "@/utils/icons";
import React, { useCallback, useEffect, useRef } from "react";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";
import { MediaSlide } from "./MediaSlide";

interface MediaGalleryProps {
  gallery: GalleryItem[];
  activeIndex: number;
  onIndexChange: (index: number) => void;
  isMobile: boolean;
  auraColor: string;
}

export const MediaGallery: React.FC<MediaGalleryProps> = ({
  gallery,
  activeIndex,
  onIndexChange,
  isMobile,
  auraColor,
}) => {
  const swiperRef = useRef<SwiperType | null>(null);

  useEffect(() => {
    const s = swiperRef.current;
    if (!s || s.destroyed) return;
    if (s.activeIndex !== activeIndex) s.slideTo(activeIndex, 220);
  }, [activeIndex]);

  const handleSlideChange = useCallback(
    (s: SwiperType) => {
      onIndexChange(s.activeIndex);
    },
    [onIndexChange],
  );

  if (!gallery.length) return null;

  return (
    <div className="flex flex-col w-full h-full gap-3">
      {/* Main viewport */}
      <div className="relative flex-1 min-h-0 w-full rounded-2xl overflow-hidden bg-[#060a14] border border-white/[0.07]">
        <Swiper
          onSwiper={(s) => {
            swiperRef.current = s;
          }}
          onSlideChange={handleSlideChange}
          initialSlide={activeIndex}
          allowTouchMove={isMobile}
          speed={280}
          style={{ width: "100%", height: "100%" }}
          className="modal-gallery-swiper"
        >
          {gallery.map((item, i) => (
            <SwiperSlide key={`${item.type}-${i}`} style={{ width: "100%", height: "100%" }}>
              <MediaSlide item={item} isActive={i === activeIndex} isBottleSlide={i === 0} auraColor={auraColor} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* 4-slot media switcher: 3 photos + 4th Video slot */}
      <div className="grid grid-cols-4 gap-2.5 flex-shrink-0">
        {gallery.map((item, i) => {
          const active = i === activeIndex;
          const isVideo = item.type === "video";
          const thumb = isVideo ? (item.poster ?? gallery[1]?.src ?? "") : item.src;

          return (
            <button
              key={`thumb-${i}`}
              type="button"
              onClick={() => onIndexChange(i)}
              aria-label={isVideo ? "Смотреть видео о продукте" : (item.alt ?? `Фото ${i + 1}`)}
              aria-pressed={active}
              className={`relative h-14 md:h-16 rounded-xl overflow-hidden border transition-all duration-200 cursor-pointer flex items-center justify-center bg-[#060a14] active:scale-95 ${
                active
                  ? "border-cyan-400 shadow-[0_0_16px_rgba(6,182,212,0.25)] opacity-100"
                  : "border-white/[0.08] opacity-60 hover:opacity-95 hover:border-white/25"
              }`}
            >
              {isVideo ? (
                <>
                  {thumb && (
                    <img
                      src={thumb}
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover opacity-35"
                      loading="lazy"
                    />
                  )}
                  <span className="relative z-10 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-white">
                    <Icons.Play fill="currentColor" stroke="none" className="w-3 h-3 text-cyan-400" />
                    <span>Видео</span>
                  </span>
                </>
              ) : (
                <img
                  src={thumb}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className={`w-full h-full ${i === 0 ? "object-contain p-1.5" : "object-cover"}`}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};