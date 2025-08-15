import { motion } from "framer-motion";
import React from "react";

interface CategoryFilterProps {
  categories: string[];
  selected: string[];
  toggleCategory: (category: string) => void;
  clearSelection: () => void;
}

const chipVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.5,
      ease: "easeOut",
    },
  }),
};

const CategoryFilter: React.FC<CategoryFilterProps> = ({ categories, selected, toggleCategory, clearSelection }) => {
  return (
    <div className="w-full py-8">
      <div className="text-center mb-6">
        <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400 tracking-widest uppercase">
          Фильтр по категориям
        </h3>
        <div className="w-24 h-px bg-cyan-400/50 mx-auto mt-2" />
      </div>
      <div className="flex flex-wrap gap-3 justify-center">
        {categories.map((cat, i) => {
          const isActive = selected.includes(cat);
          return (
            <motion.button
              key={cat}
              custom={i}
              variants={chipVariants}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleCategory(cat)}
              className={`px-5 py-2 rounded-full border-2 transition-all duration-300 text-sm font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-cyan-500 dark:focus-visible:ring-offset-gray-900 ${
                isActive
                  ? "bg-cyan-400 text-gray-900 border-cyan-400 shadow-lg shadow-cyan-500/20"
                  : "bg-gray-800/20 dark:bg-gray-800/60 border-gray-600/50 text-gray-400 hover:border-cyan-400/80 hover:text-white"
              }`}
            >
              {cat}
            </motion.button>
          );
        })}
        {selected.length > 0 && (
          <motion.button
            onClick={clearSelection}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="ml-2 px-4 py-2 rounded-full text-xs font-semibold bg-red-500/90 hover:bg-red-600 text-white transition-colors border-2 border-transparent"
          >
            Сбросить
          </motion.button>
        )}
      </div>
    </div>
  );
};

export default CategoryFilter;
