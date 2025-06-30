import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

// Импортируем модули и стили для эффекта Куба и Пагинации
import { EffectCube, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-cube';
import 'swiper/css/pagination';

import InteractiveProductCard from './InteractiveProductCard';

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

const KineticProductCarousel: React.FC<KineticCarouselProps> = ({
  products,
}) => {
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
        effect={'cube'}
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
          <SwiperSlide
            key={product.id}
            className="flex justify-center items-center"
          >
            {/* Внутренний div для задания ширины больше не нужен */}
            <InteractiveProductCard product={product} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default KineticProductCarousel;

