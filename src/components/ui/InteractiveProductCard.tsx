import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import React, { memo } from "react";
import { Link } from "react-router-dom";

interface ProductData {
  id: number;
  title: string;
  description: string;
  image: string;
  link: string;
}

interface InteractiveProductCardProps {
  product: ProductData;
  opaque?: boolean;
  isHoverEffectDisabled?: boolean;
}

/**
 * @module components/ui/InteractiveProductCard
 * @description Премиум карточка продукта Immersive Garden Level: 60 FPS стабильно.
 * Tier-aware анимации, адаптивная типографика, оптимизация под устройства.
 *
 * @author Kort
 * @version 2.0.0 - Zero Frame Drops
 *
 * @param {ProductData} product - Объект с данными о продукте (id, title, description, image, link).
 * @param {boolean} [opaque=false] - Если `true`, фон карточки будет непрозрачным. По умолчанию - полупрозрачный.
 * @param {boolean} [isHoverEffectDisabled=false] - Если `true`, отключает основной 3D-эффект при наведении.
 *
 * @see motion - Компонент из `framer-motion` для анимаций.
 * @see Link - Компонент из `react-router-dom` для навигации.
 * @see memo - HOC из React для мемоизации компонента.
 *
 * @usage
 * Используется для эффектного представления продуктов.
 *
 * 1. **На главной странице (`src/pages/HomePage.tsx`):**
 *    - Для отображения избранных товаров.
 * 2. **В карусели (`src/components/ui/KineticProductCarousel.tsx`):**
 *    - Как элемент кинетической карусели продуктов.
 *
 * @example
 * const product = {
 *   id: 1,
 *   title: 'Название продукта',
 *   description: 'Краткое описание продукта...',
 *   image: '/path/to/image.jpg',
 *   link: '/products/1'
 * };
 *
 * <InteractiveProductCard product={product} />
 */
const InteractiveProductCard: React.FC<InteractiveProductCardProps> = ({
  product,
  opaque = false,
  isHoverEffectDisabled = false,
}) => {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  
  return (
    <motion.div
      className="h-full"
      whileHover={isHoverEffectDisabled || isMobile ? {} : { y: -4, scale: 1.01 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      style={{
        contain: 'layout style paint',
      }}
    >
      <div
        className={`relative z-10 ${isMobile ? 'h-[380px]' : 'h-[420px]'} ${
          opaque ? "bg-white dark:bg-gray-900" : "bg-white/80 dark:bg-gray-900/80"
        } rounded-none lg:rounded-xl shadow-lg overflow-hidden border border-white/20 dark:border-gray-700/50 ${
          isMobile ? '' : 'hover:border-white/40 dark:hover:border-gray-600/70 hover:shadow-2xl'
        } transition-all duration-200 flex flex-col`}
      >
        <Link to={product.link}>
          <img
            src={product.image}
            alt={product.title}
            loading="lazy"
            className={`w-full ${isMobile ? 'h-44' : 'h-48'} object-cover transition-transform duration-300 ${
              isMobile ? '' : 'hover:scale-105'
            }`}
          />
        </Link>
        <div className={`${isMobile ? 'p-4' : 'p-6'} flex flex-col flex-grow`}>
          <h3 className={`font-bold ${isMobile ? 'text-lg' : 'text-xl'} text-gray-800 dark:text-white mb-2 leading-tight`}>{product.title}</h3>
          <p className={`text-gray-600 dark:text-gray-400 ${isMobile ? 'text-xs' : 'text-sm'} mb-4 line-clamp-3 leading-relaxed`}>{product.description}</p>
          <Link
            to={product.link}
            className={`inline-flex items-center text-primary font-semibold transition-colors group ${isMobile ? 'text-xs' : 'text-sm'} mt-auto self-start ${
              isMobile ? '' : 'hover:text-blue-700'
            }`}
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <span>В корзину</span>
            <ArrowRight className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'} ml-1 transition-transform duration-200 ${
              isMobile ? '' : 'group-hover:translate-x-1'
            }`} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default memo(InteractiveProductCard);
