import { useProductList } from "@/context/ProductListContext";
import { Product } from "@/types/Product";
import { motion } from "framer-motion";
import { ArrowRight, Eye, ShoppingCart } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

export interface ProductCardProps {
  product: Product;
  delay?: number;
  onQuickView: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, delay = 0, onQuickView }) => {
  const { image, name, shortDescription, link } = product;
  const { addToList } = useProductList();

  const handleAddToCart = () => addToList(product, 1);

  return (
    <motion.div
      className="card-modern group h-full flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.97 }}
    >
      {/* Изображение с оверлеем */}
      <div className="relative overflow-hidden rounded-t-lg">
        {/* Кнопка Quick View */}
        <button
          onClick={() => onQuickView(product)}
          className="absolute top-4 left-4 z-10 p-2 rounded-full bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 backdrop-blur-sm"
          aria-label="Быстрый просмотр"
        >
          <Eye className="h-4 w-4 text-gray-700 dark:text-gray-300" />
        </button>

        {/* Изображение */}
        {link ? (
          <Link to={link} className="block">
            <div className="relative aspect-[4/3] overflow-hidden">
              <img
                src={image}
                alt={name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </Link>
        ) : (
          <div className="relative aspect-[4/3] overflow-hidden">
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        )}
      </div>

      {/* Контент */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="font-bold text-lg mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {link ? <Link to={link}>{name}</Link> : name}
        </h3>

        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2 flex-grow">{shortDescription}</p>

        <div className="mt-auto flex flex-col gap-3">
          <motion.button
            onClick={handleAddToCart}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            className="w-full inline-flex items-center justify-center gap-2 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <ShoppingCart className="h-4 w-4" />
            Добавить в Список
          </motion.button>

          {link && (
            <Link
              to={link}
              className="inline-flex items-center justify-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors text-sm"
            >
              <span>Подробнее</span>
              <ArrowRight className="h-4 w-4 ml-1 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
