import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";

// Импортируем модули и стили для эффекта Куба и Пагинации
import "swiper/css";
import "swiper/css/effect-cube";
import "swiper/css/pagination";
import { EffectCube, Pagination } from "swiper/modules";

import InteractiveProductCard from "./InteractiveProductCard";
import { Icons } from "@/utils/icons";

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

/**
 * @module components/ui/KineticProductCarousel
 * @description Компонент карусели продуктов с 3D-эффектом "куб".
 * Построен на базе библиотеки Swiper.js и отображает `InteractiveProductCard` в качестве слайдов.
 * Поддерживает сенсорное управление (grabCursor) и пагинацию. Эффект наведения на карточках отключен для лучшего взаимодействия с каруселью.
 *
 * @author Kort
 * @version 1.0.0
 *
 * @param {ProductData[]} products - Массив объектов с данными о продуктах для отображения в карусели.
 *
 * @see Swiper - Основной компонент карусели из библиотеки Swiper.js.
 * @see SwiperSlide - Компонент для отдельного слайда.
 * @see InteractiveProductCard - Компонент карточки продукта, используемый в качестве слайда.
 * @see EffectCube - Модуль Swiper.js для создания эффекта 3D-куба.
 *
 * @usage
 * Используется для интерактивного и привлекающего внимание отображения списка продуктов.
 *
 * 1. **На главной странице (`src/pages/HomePage.tsx`):**
 *    - Для демонстрации избранных или популярных товаров в компактном формате с навигационными стрелками под кубом.
 *
 * @example
 * const featuredProducts = [
 *   { id: 1, title: 'Продукт 1', ..., link: '/p/1' },
 *   { id: 2, title: 'Продукт 2', ..., link: '/p/2' },
 * ];
 *
 * <KineticProductCarousel products={featuredProducts} />
 */
const KineticProductCarousel: React.FC<KineticCarouselProps> = ({
  products,
}) => {
  const swiperRef = useRef<SwiperType | null>(null);

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className="lg:hidden">
      {/* Куб */}
      <div className="w-full flex justify-center">
        <Swiper
          onSwiper={(swiper) => { swiperRef.current = swiper; }}
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
            <SwiperSlide
              key={product.id}
              className="flex justify-center items-center"
            >
              <InteractiveProductCard
                product={product}
                opaque={true}
                isHoverEffectDisabled={true}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      
      {/* Навигационные стрелки под кубом */}
      <div className="flex justify-center gap-4 mt-6">
        <button
          onClick={() => swiperRef.current?.slidePrev()}
          className="w-12 h-12 rounded-full bg-white/10 dark:bg-white/5 backdrop-blur-sm border border-white/20 dark:border-white/10 transition-transform duration-100 active:scale-90 md:hover:bg-white/20 md:dark:hover:bg-white/10 focus:outline-none"
          style={{ willChange: 'transform', contain: 'layout style paint' }}
          aria-label="Предыдущий продукт"
        >
          <Icons.ChevronLeft className="w-5 h-5 text-white/80 dark:text-white/70 mx-auto" />
        </button>
        
        <button
          onClick={() => swiperRef.current?.slideNext()}
          className="w-12 h-12 rounded-full bg-white/10 dark:bg-white/5 backdrop-blur-sm border border-white/20 dark:border-white/10 transition-transform duration-100 active:scale-90 md:hover:bg-white/20 md:dark:hover:bg-white/10 focus:outline-none"
          style={{ willChange: 'transform', contain: 'layout style paint' }}
          aria-label="Следующий продукт"
        >
          <Icons.ChevronRight className="w-5 h-5 text-white/80 dark:text-white/70 mx-auto" />
        </button>
      </div>
    </div>
  );
};

export default KineticProductCarousel;
