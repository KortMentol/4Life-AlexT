import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ShoppingCart } from "lucide-react";

export interface ProductCardProps {
  title: string;
  description: string;
  image: string;
  link: string;
  price?: string;
  badge?: string;
  isNew?: boolean;
  isBestseller?: boolean;
  delay?: number; // Добавляем свойство delay для анимации
}

const ProductCard: React.FC<ProductCardProps> = ({
  title,
  description,
  image,
  link,
  price,
  badge,
  isNew = false,
  isBestseller = false,
  delay = 0,
}) => {
  return (
    <motion.div
      className="card-modern group h-full flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay }}
      whileHover={{ y: -5 }}
    >
      {/* Изображение с оверлеем */}
      <div className="relative overflow-hidden rounded-t-lg">
        {/* Бейджи */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
          {isNew && (
            <span className="px-3 py-1 bg-blue-500 text-white text-xs font-medium rounded-full">
              Новинка
            </span>
          )}
          {isBestseller && (
            <span className="px-3 py-1 bg-amber-500 text-white text-xs font-medium rounded-full">
              Хит продаж
            </span>
          )}
          {badge && (
            <span className="px-3 py-1 bg-green-500 text-white text-xs font-medium rounded-full">
              {badge}
            </span>
          )}
        </div>

        {/* Изображение */}
        <Link to={link} className="block">
          <div className="relative aspect-[4/3] overflow-hidden">
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        </Link>

        {/* Кнопка быстрого просмотра */}
        <div className="absolute bottom-0 left-0 w-full p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <Link
            to={link}
            className="w-full flex items-center justify-center gap-2 py-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-blue-600 dark:text-blue-400 font-medium rounded-lg hover:bg-white dark:hover:bg-gray-800 transition-colors"
          >
            <ShoppingCart size={16} />
            <span>Быстрый просмотр</span>
          </Link>
        </div>
      </div>

      {/* Контент */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="font-bold text-lg mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          <Link to={link}>{title}</Link>
        </h3>

        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2 flex-grow">
          {description}
        </p>

        <div className="flex items-center justify-between mt-auto">
          {price && <span className="font-bold text-lg">{price}</span>}

          <Link
            to={link}
            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors group/link text-sm"
          >
            <span>Подробнее</span>
            <ArrowRight className="h-4 w-4 ml-1 group-hover/link:translate-x-1 transition-transform duration-200" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
