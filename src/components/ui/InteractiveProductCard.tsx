import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface ProductData {
  id: number;
  title: string;
  description: string;
  image: string;
  link: string;
}

interface InteractiveProductCardProps {
  product: ProductData;
}

const InteractiveProductCard: React.FC<InteractiveProductCardProps> = ({
  product,
}) => {
  return (
    <motion.div
      className="h-full"
      whileHover={{ y: -5, rotateY: 5, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      style={{
        transformPerspective: 1000,
        transformStyle: "preserve-3d",
      }}
    >
      <div className="relative z-10 h-full min-h-[420px] bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-white/20 dark:border-gray-700/50 hover:border-white/40 dark:hover:border-gray-600/70 card-hover-effect hover:shadow-2xl transition-all duration-300 flex flex-col">
        <Link to={product.link}>
          <img
            src={product.image}
            alt={product.title}
            loading="lazy"
            className="w-full h-48 object-cover transition-transform duration-500 hover:scale-105"
          />
        </Link>
        <div className="p-6 flex flex-col flex-grow">
          <h3 className="font-bold text-xl text-gray-800 dark:text-white mb-2">
            {product.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
            {product.description}
          </p>
          <Link
            to={product.link}
            className="inline-flex items-center text-primary hover:text-blue-700 font-semibold transition-colors group text-sm mt-auto"
          >
            <span>Купить</span>
            <ArrowRight className="h-5 w-5 ml-1 group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default InteractiveProductCard;
