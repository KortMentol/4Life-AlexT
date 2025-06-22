import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
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

const KineticProductCarousel: React.FC<KineticCarouselProps> = ({ products }) => {
  return (
    <div className="w-full">
      <Swiper
        spaceBetween={26}
        slidesPerView={1.2}
        centeredSlides={true}
        loop={true}
        loopAdditionalSlides={1}
        watchSlidesProgress={true}
        grabCursor={true}
        touchRatio={1}
        threshold={10}
        followFinger={true}
        allowTouchMove={true}
        simulateTouch={true}
        className="w-full"
      >
        {[...products, ...products].map((product, index) => (
          <SwiperSlide key={`${product.id}-${index}`} className="flex justify-center">
            <div className="w-[80vw] max-w-sm">
              <InteractiveProductCard product={product} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default KineticProductCarousel;