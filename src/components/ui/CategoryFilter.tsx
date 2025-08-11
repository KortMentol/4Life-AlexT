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

/**
 * @module components/ui/CategoryFilter
 * @description Компонент для фильтрации контента по категориям.
 * Отображает список категорий в виде кликабельных "чипов". Пользователь может выбрать одну или несколько категорий для фильтрации.
 * Также имеется кнопка для сброса выбранных фильтров. Компонент использует `framer-motion` для анимации чипов.
 *
 * @author Kort
 * @version 1.0.0
 *
 * @param {string[]} categories - Массив строк со всеми доступными категориями.
 * @param {string[]} selected - Массив строк с именами выбранных в данный момент категорий.
 * @param {(category: string) => void} toggleCategory - Callback-функция, вызываемая при клике на чип категории.
 * @param {() => void} clearSelection - Callback-функция, вызываемая при клике на кнопку "Сбросить".
 *
 * @see motion - Компонент из `framer-motion` для анимаций.
 *
 * @usage
 * Используется на странице продуктов для фильтрации списка товаров.
 *
 * 1. **На странице "Продукты" (`src/pages/ProductsPage.tsx`):**
 *    - Позволяет пользователям легко отсортировать каталог по интересующим их категориям.
 *
 * @example
 * const allCategories = ['Здоровье', 'Красота', 'Спорт'];
 * const [selected, setSelected] = useState(['Здоровье']);
 *
 * const toggle = (cat) => {
 *   setSelected(prev =>
 *     prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
 *   );
 * };
 *
 * <CategoryFilter
 *   categories={allCategories}
 *   selected={selected}
 *   toggleCategory={toggle}
 *   clearSelection={() => setSelected([])}
 * />
 */
const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selected,
  toggleCategory,
  clearSelection,
}) => {
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
