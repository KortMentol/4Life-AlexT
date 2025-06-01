import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { fadeInFromBottom, scaleOnHover } from '../../lib/animations';
import { ArrowRight } from 'lucide-react';

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
      className="bg-white dark:bg-gray-900 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden border border-gray-200 dark:border-gray-700"
      variants={fadeInFromBottom}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
      transition={{ delay: delay, duration: 0.6 }}
      whileHover="hover"
    >
      <Link to={link}>
        <motion.img
          src={image}
          alt={title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          variants={scaleOnHover}
        />
      </Link>
      <div className="p-6">
        <h3 className="font-bold text-xl text-gray-800 dark:text-white mb-2">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">{description}</p>
        <Link
          to={link}
          className="inline-flex items-center text-primary hover:text-blue-700 font-semibold transition-colors group text-sm"
        >
          <span>Подробнее</span>
          <ArrowRight className="h-5 w-5 ml-1 group-hover:translate-x-1 transition-transform duration-200" />
        </Link>
      </div>
    </motion.div>
  );
};

export default ProductCard;
