/**
 * MediaGallery — Swiper-галерея медиа (фото + видео).
 * На мобилке: свайп по галерее переключает медиа-слайды.
 * Дополнительные колбэки onSwipeLeft/Right для переключения продукта
 * (вызываются когда пользователь свайпает за пределы галереи).
 * На десктопе: миниатюры слева.
 */
import { GalleryItem } from "@/data/productsData";
import React, { useCallback, useEffect, useRef } from "react";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { MediaSlide } from "./MediaSlide";

interface MediaGalleryProps {
  gallery: GalleryItem[];
  activeIndex: number;
  onIndexChange: (index: number) => void;
  isDark: boolean;
  isMobile: boolean;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
}

export const MediaGallery: React.FC<MediaGalleryProps> = ({
  gallery,
  activeIndex,
  onIndexChange,
  isDark,
  isMobile,
  onSwipeLeft,
  onSwipeRight,
}) => {
  const swiperRef = useRef<SwiperType | null>(null);

  // Синхронизируем Swiper с внешним activeIndex
  useEffect(() => {
    const s = swiperRef.current;
    if (!s || s.destroyed) return;
    if (s.activeIndex !== activeIndex) s.slideTo(activeIndex, 0);
  }, [activeIndex]);

  const handleSlideChange = useCallback(
    (s: SwiperType) => {
      onIndexChange(s.activeIndex);
    },
    [onIndexChange],
  );

  // Переключение продукта при свайпе за пределы галереи
  const handleReachEnd = useCallback(() => {
    if (isMobile && onSwipeLeft) onSwipeLeft();
  }, [isMobile, onSwipeLeft]);

  const handleReachBeginning = useCallback(() => {
    if (isMobile && onSwipeRight) onSwipeRight();
  }, [isMobile, onSwipeRight]);

  if (!gallery.length) return null;

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <Swiper
        modules={[Pagination]}
        onSwiper={(s) => {
          swiperRef.current = s;
        }}
        onSlideChange={handleSlideChange}
        onReachEnd={handleReachEnd}
        onReachBeginning={handleReachBeginning}
        initialSlide={activeIndex}
        pagination={
          isMobile
            ? {
                clickable: true,
                bulletClass: "modal-gallery-bullet",
                bulletActiveClass: "modal-gallery-bullet--active",
              }
            : false
        }
        allowTouchMove={isMobile}
        speed={280}
        style={{ width: "100%", height: "100%" }}
        className="modal-gallery-swiper"
      >
        {gallery.map((item, i) => (
          <SwiperSlide key={i} style={{ width: "100%", height: "100%" }}>
            <MediaSlide item={item} isActive={i === activeIndex} />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Desktop thumbnails */}
      {!isMobile && gallery.length > 1 && (
        <div
          style={{
            position: "absolute",
            left: 12,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 10,
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          {gallery.map((item, i) => {
            const thumb =
              item.type === "video" ? (item.poster ?? item.src) : item.src;
            const active = i === activeIndex;
            return (
              <button
                key={i}
                onClick={() => onIndexChange(i)}
                aria-label={item.alt ?? `Медиа ${i + 1}`}
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 10,
                  overflow: "hidden",
                  flexShrink: 0,
                  border: active
                    ? `2px solid ${isDark ? "#22d3ee" : "#3b82f6"}`
                    : "2px solid transparent",
                  opacity: active ? 1 : 0.5,
                  transform: active ? "scale(1.05)" : "scale(1)",
                  transition: "all 0.2s ease",
                  cursor: "pointer",
                  background: "none",
                  padding: 0,
                }}
              >
                <img
                  src={thumb}
                  alt=""
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  loading="lazy"
                />
                {item.type === "video" && (
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "rgba(0,0,0,0.3)",
                    }}
                  >
                    <svg
                      width="14"
                      height="14"
                      fill="white"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
