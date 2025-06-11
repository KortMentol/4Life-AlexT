import React from "react";

interface StaticFeatureProps {
  icon: React.ElementType;
  title: string;
  description: string;
  color?: string;
  className?: string;
}

/**
 * Статичный компонент для отображения преимуществ без анимации появления
 */
const StaticFeature: React.FC<StaticFeatureProps> = ({
  icon: Icon,
  title,
  description,
  color = "from-green-500 to-green-600",
  className = "",
}) => {
  return (
    <div
      className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-8 rounded-xl border border-green-100 dark:border-green-900/50 shadow-lg hover:shadow-xl transition-all duration-500 group hover:-translate-y-2 ${className}`}
    >
      <div
        className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mb-6 shadow-md transform group-hover:scale-110 transition-transform duration-300`}
      >
        <Icon className="w-8 h-8 text-white" />
      </div>

      <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
        {description}
      </p>

      {/* Индикатор при наведении */}
      <div className="w-0 h-1 bg-gradient-to-r from-green-400 to-green-600 mt-6 group-hover:w-full transition-all duration-500"></div>
    </div>
  );
};

export default StaticFeature;
