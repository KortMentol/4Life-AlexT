import { motion } from "framer-motion";
import React from "react";

interface CategoryFilterProps {
  categories: string[];
  selected: string[];
  toggleCategory: (category: string) => void;
  clearSelection: () => void;
}

const chipVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 },
};

const CategoryFilter: React.FC<CategoryFilterProps> = ({ categories, selected, toggleCategory, clearSelection }) => {
  return (
    <div className="sticky top-20 z-20 w-full py-4 backdrop-blur-md bg-white/30 dark:bg-gray-800/30 rounded-xl shadow-inner flex flex-wrap gap-2 justify-center">
      {categories.map((cat) => {
        const isActive = selected.includes(cat);
        return (
          <motion.button
            key={cat}
            variants={chipVariants}
            initial="hidden"
            animate="visible"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => toggleCategory(cat)}
            className={`px-4 py-1 rounded-full border transition-colors duration-200 text-sm font-medium backdrop-blur-sm ${
              isActive
                ? "bg-blue-600/70 text-white border-blue-500 shadow-md"
                : "bg-white/50 dark:bg-gray-900/40 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-blue-50/60 dark:hover:bg-blue-500/20"
            }`}
          >
            {cat}
          </motion.button>
        );
      })}
      {selected.length > 0 && (
        <button
          onClick={clearSelection}
          className="ml-2 px-3 py-1 rounded-full text-xs bg-red-500/80 hover:bg-red-600 text-white transition-colors"
        >
          Сбросить
        </button>
      )}
    </div>
  );
};

export default CategoryFilter;
