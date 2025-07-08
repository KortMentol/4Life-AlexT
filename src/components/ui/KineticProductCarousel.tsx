import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";

// Импортируем модули и стили для эффекта Куба и Пагинации
import "swiper/css";
import "swiper/css/effect-cube";
import "swiper/css/pagination";
import { EffectCube, Pagination } from "swiper/modules";

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
 *    - Для демонстрации избранных или популярных товаров в компактном формате.
 *
 * @example
 * const featuredProducts = [
 *   { id: 1, title: 'Продукт 1', ..., link: '/p/1' },
 *   { id: 2, title: 'Продукт 2', ..., link: '/p/2' },
 * ];
 *
 * <KineticProductCarousel products={featuredProducts} />
 */
const KineticProductCarousel: React.FC<KineticCarouselProps> = ({ products }) => {
  // При loop=true Swiper сам обрабатывает дублирование слайдов.
  // Использования оригинального массива `products` достаточно, даже для 3 элементов.
  if (!products || products.length === 0) {
    return null; // Или можно вернуть компонент-заглушку
  }

  return (
    // Контейнер для центрирования карусели по вертикали и горизонтали
    // Внешние отступы убраны и должны задаваться на родительской странице
    <div className="w-full flex justify-center">
      <Swiper
        effect={"cube"}
        grabCursor={true}
        cubeEffect={{
          shadow: false, // Отключаем тени для производительности
          slideShadows: false, // Отключаем тени для производительности
          shadowOffset: 20,
          shadowScale: 0.94,
        }}
        loop={true}
        pagination={{
          clickable: true,
        }}
        modules={[EffectCube, Pagination]}
        // Задаем адаптивную ширину самой карусели, чтобы центрирование работало
        className="w-[80vw] max-w-sm"
        slidesPerView={1}
        centeredSlides={true}
      >
        {products.map((product) => (
          <SwiperSlide key={product.id} className="flex justify-center items-center">
            {/* Внутренний div для задания ширины больше не нужен */}
            <InteractiveProductCard product={product} opaque={true} isHoverEffectDisabled={true} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default KineticProductCarousel;
