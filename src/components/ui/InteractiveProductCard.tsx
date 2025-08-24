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
 * @description Интерактивная карточка продукта с 3D-эффектом при наведении.
 * Использует `framer-motion` для создания анимации подъема, поворота и масштабирования. Для оптимизации производительности обернута в `React.memo` и использует аппаратное ускорение (`transform-gpu`).
 *
 * @author Kort
 * @version 1.0.0
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
  return (
    <motion.div
      className="h-full transform-gpu" // Добавляем transform-gpu для аппаратного ускорения
      whileHover={isHoverEffectDisabled ? {} : { y: -5, rotateY: 5, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      style={{
        transformPerspective: 1000,
        transformStyle: "preserve-3d",
      }}
    >
      <div
        className={`relative z-10 h-full min-h-[420px] ${
          opaque ? "bg-white dark:bg-gray-900" : "bg-white/80 dark:bg-gray-900/80"
        } rounded-xl shadow-lg overflow-hidden border border-white/20 dark:border-gray-700/50 hover:border-white/40 dark:hover:border-gray-600/70 card-hover-effect hover:shadow-2xl transition-all duration-300 flex flex-col`}
      >
        <Link to={product.link}>
          <img
            src={product.image}
            alt={product.title}
            loading="lazy"
            className="w-full h-48 object-cover transition-transform duration-500 hover:scale-105"
          />
        </Link>
        <div className="p-6 flex flex-col flex-grow">
          <h3 className="font-bold text-xl text-gray-800 dark:text-white mb-2">{product.title}</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">{product.description}</p>
          <Link
            to={product.link}
            // --- ИЗМЕНЕНИЕ ЗДЕСЬ: добавлен класс `self-start` ---
            className="inline-flex items-center text-primary hover:text-blue-700 font-semibold transition-colors group text-sm mt-auto self-start"
          >
            <span>В корзину</span>
            <ArrowRight className="h-5 w-5 ml-1 group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default memo(InteractiveProductCard);
