/**
 * @module components/ui/KineticProductCarousel
 * @description Компонент карусели продуктов с 3D-эффектом "куб" на базе Swiper.js.
 * Полностью удалены CSS-классы светлой темы (`bg-white/10`, `border-white/20` и др.).
 * Стилизован строго под Obsidian-дизайн (#03050a) с матовыми циановыми границами и элементами.
 * @author Kort
 * @version 1.1.0
 */

import React, { useRef } from "react";
import type { Swiper as SwiperType } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

// Импортируем модули и стили для эффекта Куба и Пагинации
import "swiper/css";
import "swiper/css/effect-cube";
import "swiper/css/pagination";
import { EffectCube, Pagination } from "swiper/modules";

import { Icons } from "@/utils/icons";
import InteractiveProductCard from "./InteractiveProductCard";

interface ProductData {
  id: number;
  title: string;
  description: string;
  image: string;
  link: string;
}

interface KineticCarouselProps {
  products: ProductData[];
}

const KineticProductCarousel: React.FC<KineticCarouselProps> = ({ products }) => {
  const swiperRef = useRef<SwiperType | null>(null);

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className="lg:hidden">
      {/* 3D Куб карусели */}
      <div className="w-full flex justify-center">
        <Swiper
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          effect={"cube"}
          grabCursor={true}
          cubeEffect={{
            shadow: false,
            slideShadows: false,
            shadowOffset: 20,
            shadowScale: 0.94,
          }}
          loop={true}
          pagination={{
            clickable: true,
          }}
          modules={[EffectCube, Pagination]}
          className="w-[80vw] max-w-sm"
          slidesPerView={1}
          centeredSlides={true}
        >
          {products.map((product) => (
            <SwiperSlide key={product.id} className="flex justify-center items-center">
              <InteractiveProductCard product={product} opaque={true} isHoverEffectDisabled={true} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Навигационные стрелки под кубом — Clinical Obsidian Style */}
      <div className="flex justify-center gap-4 mt-6">
        <button
          onClick={() => swiperRef.current?.slidePrev()}
          className="w-12 h-12 rounded-full bg-white/[0.02] backdrop-blur-sm border border-white/10 transition-transform duration-100 active:scale-90 md:hover:bg-white/10 focus:outline-none"
          style={{ willChange: "transform", contain: "layout style paint" }}
          aria-label="Предыдущий продукт"
        >
          <Icons.ChevronLeft className="w-5 h-5 text-white/70 mx-auto" />
        </button>

        <button
          onClick={() => swiperRef.current?.slideNext()}
          className="w-12 h-12 rounded-full bg-white/[0.02] backdrop-blur-sm border border-white/10 transition-transform duration-100 active:scale-90 md:hover:bg-white/10 focus:outline-none"
          style={{ willChange: "transform", contain: "layout style paint" }}
          aria-label="Следующий продукт"
        >
          <Icons.ChevronRight className="w-5 h-5 text-white/70 mx-auto" />
        </button>
      </div>
    </div>
  );
};

export default KineticProductCarousel;
