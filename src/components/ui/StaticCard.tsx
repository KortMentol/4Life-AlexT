import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface StaticCardProps {
  image: string;
  title: string;
  description: string;
  link: string;
  icon?: React.ReactNode;
}

/**
 * Статичная карточка без анимации появления для предотвращения моргания
 */
const StaticCard: React.FC<StaticCardProps> = ({ 
  image, 
  title, 
  description, 
  link,
  icon
}) => {
  return (
    <div className="relative z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-white/20 dark:border-gray-700/50 hover:border-white/40 dark:hover:border-gray-600/70 hover:-translate-y-1 card-hover-effect">
      <Link to={link}>
        <img
          src={image}
          alt={title}
          loading="lazy"
          className="w-full h-48 object-cover transition-transform duration-500 hover:scale-105"
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
      {icon && (
        <div className="absolute top-4 right-4">
          {icon}
        </div>
      )}
    </div>
  );
};

export default StaticCard;