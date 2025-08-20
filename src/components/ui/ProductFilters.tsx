/**
 * @module src/components/ui/ProductFilters.tsx
 * @description Продвинутая система фильтрации продуктов с поиском, сортировкой и категориями.
 * Включает анимированные переходы и оптимизированную производительность.
 * @author Kort
 * @version 1.0.0
 * @usage
 * 1. `src/pages/ProductsPageNew.tsx` - основная система фильтрации
 * @example
 * <ProductFilters 
 *   onFiltersChange={handleFiltersChange}
 *   totalProducts={products.length}
 * />
 */


import { Icons } from '@/utils/icons';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useCallback, useState } from 'react';
import { productsData } from '@/data/productsData';

// Динамические границы LP на основании данных продуктов (с фолбэком для пустого списка)
const RAW_LP_MIN = productsData.reduce((min, p) => Math.min(min, p.lp), Infinity);
const RAW_LP_MAX = productsData.reduce((max, p) => Math.max(max, p.lp), -Infinity);
const LP_MIN = Number.isFinite(RAW_LP_MIN) ? RAW_LP_MIN : 0;
const LP_MAX = Number.isFinite(RAW_LP_MAX) ? RAW_LP_MAX : 100;

export interface FilterState {
  search: string;
  categories: string[];
  sortBy: 'name' | 'lp' | 'newest';
  sortOrder: 'asc' | 'desc';
  priceRange: [number, number];
}

interface ProductFiltersProps {
  categories: string[];
  onFiltersChange: (filters: FilterState) => void;
  totalProducts: number;
  filteredCount: number;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({
  categories,
  onFiltersChange,
  totalProducts,
  filteredCount
}) => {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    categories: [],
    sortBy: 'name',
    sortOrder: 'asc',
    priceRange: [LP_MIN, LP_MAX]
  });
  
  const [isExpanded, setIsExpanded] = useState(false);

  const updateFilters = useCallback((newFilters: Partial<FilterState>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  }, [filters, onFiltersChange]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    updateFilters({ search: e.target.value });
  }, [updateFilters]);

  const toggleCategory = useCallback((category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category];
    updateFilters({ categories: newCategories });
  }, [filters.categories, updateFilters]);

  const clearFilters = useCallback(() => {
    const clearedFilters: FilterState = {
      search: '',
      categories: [],
      sortBy: 'name',
      sortOrder: 'asc',
      priceRange: [LP_MIN, LP_MAX]
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  }, [onFiltersChange]);

  const hasActiveFilters = filters.search || filters.categories.length > 0;

  return (
    <div className="w-full">
      {/* Основная панель фильтров */}
      <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
        {/* Поиск и основные контролы */}
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mb-6">
          {/* Поиск */}
          <div className="relative flex-1 max-w-md">
            <Icons.Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Поиск продуктов..."
              value={filters.search}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400/50 focus:bg-white/10 transition-all duration-300"
            />
            {filters.search && (
              <button
                onClick={() => updateFilters({ search: '' })}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                <Icons.X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Сортировка */}
          <div className="flex items-center gap-3">
            <select
              value={`${filters.sortBy}-${filters.sortOrder}`}
              onChange={(e) => {
                const [sortBy, sortOrder] = e.target.value.split('-') as [typeof filters.sortBy, typeof filters.sortOrder];
                updateFilters({ sortBy, sortOrder });
              }}
              className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-400/50 transition-all duration-300"
            >
              <option value="name-asc">По названию (А-Я)</option>
              <option value="name-desc">По названию (Я-А)</option>
              <option value="lp-asc">По цене (возр.)</option>
              <option value="lp-desc">По цене (убыв.)</option>
              <option value="newest-desc">Сначала новые</option>
            </select>

            {/* Кнопка расширения фильтров */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-2 px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 rounded-lg border border-cyan-500/30 transition-all duration-300"
            >
              <Icons.Filter className="w-4 h-4" />
              Фильтры
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <Icons.ChevronDown className="w-4 h-4" />
              </motion.div>
            </button>
          </div>
        </div>

        {/* Расширенные фильтры */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="pt-6 border-t border-white/10 space-y-6">
                {/* Категории */}
                <div>
                  <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                    <Icons.Tag className="w-4 h-4 text-cyan-400" />
                    Категории
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => {
                      const isSelected = filters.categories.includes(category);
                      return (
                        <motion.button
                          key={category}
                          onClick={() => toggleCategory(category)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                            isSelected
                              ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/25'
                              : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white border border-white/10'
                          }`}
                        >
                          {category}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* Диапазон цен */}
                <div>
                  <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                    <Icons.DollarSign className="w-4 h-4 text-cyan-400" />
                    Диапазон LP
                  </h3>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400 text-sm">От</span>
                      <input
                        type="number"
                        min={LP_MIN}
                        max={LP_MAX}
                        value={filters.priceRange[0]}
                        onChange={(e) => updateFilters({ 
                          priceRange: [
                            Math.min(
                              Math.max(Number(e.target.value) || LP_MIN, LP_MIN),
                              filters.priceRange[1]
                            ),
                            filters.priceRange[1]
                          ] 
                        })}
                        className="w-20 px-2 py-1 bg-white/5 border border-white/10 rounded text-white text-sm focus:outline-none focus:border-cyan-400/50"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400 text-sm">До</span>
                      <input
                        type="number"
                        min={LP_MIN}
                        max={LP_MAX}
                        value={filters.priceRange[1]}
                        onChange={(e) => updateFilters({ 
                          priceRange: [
                            filters.priceRange[0],
                            Math.max(
                              Math.min(Number(e.target.value) || LP_MAX, LP_MAX),
                              filters.priceRange[0]
                            )
                          ] 
                        })}
                        className="w-20 px-2 py-1 bg-white/5 border border-white/10 rounded text-white text-sm focus:outline-none focus:border-cyan-400/50"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Статистика и сброс */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/10">
          <div className="text-sm text-gray-400">
            Показано <span className="text-cyan-400 font-medium">{filteredCount}</span> из{' '}
            <span className="text-white font-medium">{totalProducts}</span> продуктов
          </div>
          
          {hasActiveFilters && (
            <motion.button
              onClick={clearFilters}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all duration-300"
            >
              <Icons.X className="w-4 h-4" />
              Сбросить фильтры
            </motion.button>
          )}
        </div>
      </div>

      {/* Активные фильтры */}
      <AnimatePresence>
        {hasActiveFilters && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-4 flex flex-wrap gap-2"
          >
            {filters.search && (
              <motion.div
                layout
                className="flex items-center gap-2 px-3 py-2 bg-cyan-500/20 text-cyan-300 rounded-lg border border-cyan-500/30"
              >
                <Icons.Search className="w-3 h-3" />
                <span className="text-sm">"{filters.search}"</span>
                <button
                  onClick={() => updateFilters({ search: '' })}
                  className="text-cyan-300 hover:text-white transition-colors"
                >
                  <Icons.X className="w-3 h-3" />
                </button>
              </motion.div>
            )}
            
            {filters.categories.map((category) => (
              <motion.div
                key={category}
                layout
                className="flex items-center gap-2 px-3 py-2 bg-purple-500/20 text-purple-300 rounded-lg border border-purple-500/30"
              >
                <Icons.Tag className="w-3 h-3" />
                <span className="text-sm">{category}</span>
                <button
                  onClick={() => toggleCategory(category)}
                  className="text-purple-300 hover:text-white transition-colors"
                >
                  <Icons.X className="w-3 h-3" />
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductFilters;