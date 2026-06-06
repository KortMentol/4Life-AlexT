/**
 * ProductCarousel — Swiper-карусель продуктов внизу модалки.
 * centeredSlides: активный продукт всегда по центру с подсветкой.
 * При свайпе — переключает модалку на соседний продукт.
 */
import { DetailedProduct } from "@/data/productsData";
import React, { useCallback, useEffect, useRef } from "react";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/free-mode";
import { FreeMode } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

interface ProductCarouselProps {
  products: DetailedProduct[];
  activeIndex: number;
  onSelect: (id: string) => void;
  isDark: boolean;
}

export const ProductCarousel: React.FC<ProductCarouselProps> = ({
  products,
  activeIndex,
  onSelect,
  isDark,
}) => {
  const swiperRef = useRef<SwiperType | null>(null);

  // Синхронизируем позицию Swiper с activeIndex извне
  useEffect(() => {
    const swiper = swiperRef.current;
    if (!swiper || swiper.destroyed) return;
    if (swiper.activeIndex !== activeIndex) {
      swiper.slideTo(activeIndex, 300);
    }
  }, [activeIndex]);

  const handleSlideChange = useCallback(
    (swiper: SwiperType) => {
      const p = products[swiper.activeIndex];
      if (p && swiper.activeIndex !== activeIndex) {
        onSelect(p.id);
      }
    },
    [activeIndex, onSelect, products],
  );

  if (products.length <= 1) return null;

  return (
    <div
      className={`flex-shrink-0 border-t ${isDark ? "border-white/[0.08]" : "border-slate-200"}`}
    >
      <Swiper
        modules={[FreeMode]}
        onSwiper={(s) => {
          swiperRef.current = s;
        }}
        onSlideChange={handleSlideChange}
        initialSlide={activeIndex}
        slidesPerView="auto"
        centeredSlides
        freeMode={{ enabled: true, sticky: false, momentumRatio: 0.5 }}
        speed={300}
        allowTouchMove
        className="w-full py-3 px-2"
      >
        {products.map((p, i) => {
          const isActive = i === activeIndex;
          return (
            <SwiperSlide
              key={p.id}
              style={{ width: "auto" }}
              className="flex-shrink-0"
            >
              <button
                onClick={() => onSelect(p.id)}
                aria-label={p.name}
                aria-pressed={isActive}
                className={`relative mx-1.5 flex-shrink-0 transition-all duration-300 focus:outline-none rounded-2xl overflow-hidden ${
                  isActive
                    ? "w-[72px] h-[72px] scale-100 opacity-100"
                    : "w-[56px] h-[56px] scale-95 opacity-40 hover:opacity-65"
                } ${isDark ? "bg-white/5" : "bg-slate-100"}`}
              >
                {/* Active ring */}
                {isActive && (
                  <span
                    className={`absolute inset-0 rounded-2xl ring-2 pointer-events-none ${
                      isDark ? "ring-cyan-400" : "ring-blue-500"
                    }`}
                  />
                )}
                <img
                  src={p.image}
                  alt={p.name}
                  loading="lazy"
                  className="w-full h-full object-contain p-2"
                />
              </button>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};
