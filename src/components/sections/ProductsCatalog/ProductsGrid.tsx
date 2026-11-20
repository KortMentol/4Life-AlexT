import { DetailedProduct, getProductCatalogSummary } from "@/data/productsData";
import { useProductList } from "@/hooks/useProductList";
import { usePerformanceTier } from "@/hooks/usePerformanceTier";
import { Icons } from "@/utils/icons";
import { motion, useReducedMotion } from "framer-motion";
import React, { ChangeEvent } from "react";

export interface CatalogFilter {
  id: string;
  label: string;
  categories?: string[];
}

export type CatalogGridColumns = 2 | 3 | 4;

interface ProductsGridProps {
  products: DetailedProduct[];
  allProducts: DetailedProduct[];
  filters: CatalogFilter[];
  activeFilter: string;
  onFilterChange: (filterId: string) => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
  gridColumns: CatalogGridColumns;
  onGridColumnsChange: (columns: CatalogGridColumns) => void;
  onProductClick: (product: DetailedProduct) => void;
  onClearFilters: () => void;
}

const GRID_CLASS: Record<CatalogGridColumns, string> = {
  2: "grid-cols-1 md:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4",
};

const getProductAura = (product: DetailedProduct): string => {
  const categories = product.categories.map((category) => category.toLocaleLowerCase("ru"));
  if (categories.some((category) => category.includes("энергия") || category.includes("спорт"))) return "rgba(6,182,212,0.22)";
  if (categories.some((category) => category.includes("красота") || category.includes("женское"))) return "rgba(185,151,74,0.20)";
  if (categories.some((category) => category.includes("пищеварение") || category.includes("детокс"))) return "rgba(34,197,94,0.17)";
  if (categories.some((category) => category.includes("сердце") || category.includes("память"))) return "rgba(129,140,248,0.18)";
  return "rgba(6,182,212,0.20)";
};

export const ProductsGrid: React.FC<ProductsGridProps> = ({
  products,
  allProducts,
  filters,
  activeFilter,
  onFilterChange,
  searchValue,
  onSearchChange,
  gridColumns,
  onGridColumnsChange,
  onProductClick,
  onClearFilters,
}) => {
  const tier = usePerformanceTier();
  const prefersReducedMotion = useReducedMotion();
  const { items, addToList } = useProductList();
  const reduceEntrance = tier === "low" || Boolean(prefersReducedMotion);

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    onSearchChange(event.currentTarget.value);
  };

  const getFilterCount = (filter: CatalogFilter): number => {
    if (!filter.categories?.length) return allProducts.length;
    return allProducts.filter((product) =>
      product.categories.some((category) => {
        const normalizedCategory = category.toLocaleLowerCase("ru");
        return filter.categories?.some((term) => {
          const normalizedTerm = term.toLocaleLowerCase("ru");
          return normalizedCategory.includes(normalizedTerm) || normalizedTerm.includes(normalizedCategory);
        });
      }),
    ).length;
  };

  return (
    <section aria-labelledby="product-catalog-title" className="mx-auto w-full max-w-[1440px] px-4 pb-20 md:px-8">
      <div className="mb-7 flex flex-col gap-5 border-b border-white/[0.08] pb-6 md:mb-9 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="typography-label mb-3 text-cyan-400">Линейка 4Life · 17 формул</p>
          <h2 id="product-catalog-title" className="typography-h2 text-white">Каталог формул</h2>
        </div>
        <p className="max-w-lg typography-body text-slate-400">
          Состав и маркировка могут различаться по рынкам и партиям. Перед заказом сверяйте информацию с актуальной упаковкой.
        </p>
      </div>

      <div className="sticky top-[4.5rem] z-30 mb-9 rounded-2xl border border-white/[0.08] bg-[#050811]/95 p-3 shadow-[0_18px_48px_rgba(0,0,0,0.32)] md:px-5 md:py-3.5">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex min-w-0 gap-1 overflow-x-auto pb-1 xl:pb-0" role="tablist" aria-label="Категории продуктов">
            {filters.map((filter) => {
              const isActive = activeFilter === filter.id;
              return (
                <button
                  key={filter.id}
                  id={`catalog-tab-${filter.id}`}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls="catalog-products"
                  onClick={() => onFilterChange(filter.id)}
                  className={`flex shrink-0 items-center gap-2 rounded-xl px-3 py-2.5 text-left text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 md:px-3.5 ${isActive ? "border border-cyan-400/30 bg-cyan-400/[0.08] text-cyan-200" : "border border-transparent text-slate-400"}`}
                >
                  <span>{filter.label}</span>
                  <span className="tabular-nums text-[10px] text-slate-500">{getFilterCount(filter)}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3 xl:shrink-0">
            <label className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-white/[0.08] bg-[#080d18] px-3 py-2.5 focus-within:border-cyan-400/40 xl:w-64 xl:flex-none">
              <Icons.Search aria-hidden="true" className="size-4 shrink-0 text-slate-500" />
              <span className="sr-only">Поиск по названию и описанию</span>
              <input
                type="search"
                value={searchValue}
                onChange={handleSearchChange}
                placeholder="Название или эффект"
                className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
                aria-label="Поиск по названию и описанию продуктов"
              />
            </label>
            <div className="flex shrink-0 items-center gap-1" role="group" aria-label="Количество колонок каталога">
              {([2, 3, 4] as const).map((columns) => (
                <button
                  key={columns}
                  type="button"
                  aria-label={`Сетка: ${columns} колонки`}
                  aria-pressed={gridColumns === columns}
                  onClick={() => onGridColumnsChange(columns)}
                  className={`grid size-10 place-items-center rounded-lg border text-xs tabular-nums transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${gridColumns === columns ? "border-cyan-400/35 bg-cyan-400/[0.08] text-cyan-200" : "border-white/[0.08] text-slate-500"}`}
                >
                  {columns}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div id="catalog-products" role="tabpanel" aria-labelledby={`catalog-tab-${activeFilter}`}>
        <p className="mb-4 typography-label text-slate-500" aria-live="polite">
          {products.length} {products.length === 1 ? "формула" : "формул"}
        </p>
        {products.length > 0 ? (
          <div className={`grid ${GRID_CLASS[gridColumns]} gap-4 md:gap-5`}>
            {products.map((product, index) => {
              const listItem = items.find((item) => item.id === product.id);
              const quantity = listItem?.quantity ?? 0;
              const aura = getProductAura(product);
              const category = product.categories[0] ?? "Формула 4Life";

              return (
                <motion.article
                  key={product.id}
                  initial={reduceEntrance ? false : { opacity: 0, y: 18 }}
                  whileInView={reduceEntrance ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-5%" }}
                  transition={{ duration: 0.55, delay: Math.min(index, 7) * 0.035, ease: [0.16, 1, 0.3, 1] }}
                  className={`group flex min-w-0 flex-col overflow-hidden rounded-[1.6rem] border border-white/[0.08] bg-[#050811] ${gridColumns === 2 ? "md:flex-row" : ""}`}
                >
                  <div
                    className={`relative flex min-h-64 items-center justify-center overflow-hidden bg-[#060a14] p-5 ${gridColumns === 2 ? "md:min-h-80 md:w-[46%]" : ""}`}
                    style={{ backgroundImage: `radial-gradient(ellipse at 50% 58%, ${aura}, transparent 64%)` }}
                  >
                    <button
                      type="button"
                      onClick={() => onProductClick(product)}
                      className="absolute inset-0 z-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cyan-400"
                      aria-label={`Подробнее о продукте: ${product.name}`}
                    />
                    <img
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                      decoding="async"
                      className="pointer-events-none relative z-[1] max-h-56 max-w-full object-contain md:max-h-64"
                    />
                    <div className="pointer-events-none absolute bottom-4 left-5 z-[2] typography-label text-white/55">{category}</div>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        addToList(product, 1);
                      }}
                      aria-label={quantity > 0 ? `В списке заказа ${quantity} штук. Добавить ещё ${product.name}` : `Добавить ${product.name} в список заказа`}
                      title={quantity > 0 ? `В списке: ${quantity}. Добавить ещё` : "Добавить в список заказа"}
                      className={`absolute bottom-3 right-3 z-[3] grid min-h-11 min-w-11 place-items-center rounded-xl border px-3 text-sm font-medium tabular-nums transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 ${quantity > 0 ? "border-cyan-400/50 bg-cyan-400/[0.12] text-cyan-200" : "border-white/[0.12] bg-[#03050a]/85 text-white"}`}
                    >
                      {quantity > 0 ? `✓ ${quantity}` : "+"}
                    </button>
                  </div>

                  <div className={`flex min-w-0 flex-1 flex-col p-5 md:p-6 ${gridColumns === 2 ? "md:justify-center" : ""}`}>
                    <p className="typography-label mb-2 text-cyan-400/80">{product.lp} LP</p>
                    <button
                      type="button"
                      onClick={() => onProductClick(product)}
                      className="text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                    >
                      <h3 className="typography-h3 text-white">{product.name}</h3>
                    </button>
                    <p className="mt-3 typography-body text-slate-400">{getProductCatalogSummary(product)}</p>
                    {gridColumns === 2 ? (
                      <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-500">{product.keyIngredients.slice(0, 4).join(" · ")}</p>
                    ) : null}
                    <div className="mt-auto flex items-end justify-between gap-4 border-t border-white/[0.08] pt-4">
                      <p className="typography-label text-slate-500">
                        {product.servings ? `${product.servings} порций` : "Состав — на упаковке"}
                      </p>
                      <span className="typography-label text-white/70">Подробнее <Icons.ArrowRight aria-hidden="true" className="ml-1 inline size-3.5" /></span>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        ) : (
          <div className="flex min-h-64 flex-col items-center justify-center rounded-3xl border border-dashed border-white/[0.12] px-6 text-center">
            <p className="typography-h3 text-white">Ничего не найдено</p>
            <p className="mt-2 max-w-md typography-body text-slate-400">Измените запрос или вернитесь ко всем формулам.</p>
            <button
              type="button"
              onClick={onClearFilters}
              className="mt-5 rounded-xl border border-cyan-400/30 px-4 py-2.5 text-sm text-cyan-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
            >
              Сбросить фильтры
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default React.memo(ProductsGrid);
