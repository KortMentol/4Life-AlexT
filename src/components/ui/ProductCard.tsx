import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { fadeInFromBottom, scaleOnHover } from "../../lib/animations";

interface ProductCardProps {
  image: string;
  title: string;
  description: string;
  link: string;
  delay?: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ image, title, description, link, delay = 0 }) => {
  return (
    <motion.div
      className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-white/20 dark:border-gray-700/50 hover:border-white/40 dark:hover:border-gray-600/70"
      variants={fadeInFromBottom}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      transition={{ delay: delay, duration: 0.6 }}
      whileHover={{
        y: -5,
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      }}
    >
      <Link to={link}>
        <motion.img
          src={image}
          alt={title}
          loading="lazy"
          className="w-full h-48 object-cover transition-transform duration-500"
          variants={scaleOnHover}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        />
      </Link>
      <div className="p-6">
        <h3 className="font-bold text-xl text-gray-800 dark:text-white mb-2">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">{description}</p>
        <Link
          to={link}
          className="inline-flex items-center text-primary hover:text-blue-700 font-semibold transition-colors group text-sm"
        >
          <span>Купить</span>
          <ArrowRight className="h-5 w-5 ml-1 group-hover:translate-x-1 transition-transform duration-200" />
        </Link>
      </div>
    </motion.div>
  );
};

export default ProductCard;
