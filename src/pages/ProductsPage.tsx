import ProductsFAQ from "@/components/sections/ProductsCatalog/ProductsFAQ";
import ProductsGrid, { CatalogFilter, CatalogGridColumns } from "@/components/sections/ProductsCatalog/ProductsGrid";
import ProductsHero from "@/components/sections/ProductsCatalog/ProductsHero";
import ProductDetailModal from "@/components/ui/ProductDetailModal";
import { DetailedProduct, productsData } from "@/data/productsData";
import { useProductList } from "@/hooks/useProductList";
import { lenis } from "@/lib/lenis";
import { SEO } from "@/seo/SEO";
import { Icons } from "@/utils/icons";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

import "@/styles/pages/products-page.css";

const CATALOG_FILTERS: CatalogFilter[] = [
  { id: "all", label: "Все формулы" },
  { id: "immune", label: "Иммунитет и защита", categories: ["Иммунитет", "Защита клеток"] },
  {
    id: "energy",
    label: "Энергия и долголетие",
    categories: ["Энергия и тонус", "Активное долголетие", "Баланс и анти-стресс"],
  },
  {
    id: "organs",
    label: "Сердце, мозг и органы",
    categories: ["Сердце и сосуды", "Память и фокус", "Женское здоровье", "Мужское здоровье", "Красота и уход"],
  },
  { id: "gut", label: "Пищеварение и детокс", categories: ["Пищеварение", "Детокс и очищение"] },
  { id: "sport", label: "Спорт и метаболизм", categories: ["Спорт и фитнес", "Контроль веса"] },
];

const PROGRAMS = [
  {
    id: "immune-intelligence",
    title: "Базовый Иммунный Интеллект",
    productIds: ["tf-trifactor", "tf-plus"],
    note: "Трай-Фактор Формула + Трансфер Фактор Плюс",
  },
  {
    id: "cellular-energy",
    title: "Клеточная Перезагрузка и Энергия",
    productIds: ["renuvo", "energy-go-stix"],
    note: "Ренуво + Энерджи Гоу Стикс",
  },
  {
    id: "microbiome-detox",
    title: "Чистый Микробиом и Детокс",
    productIds: ["pre-o-biotics", "super-detox"],
    note: "Пре/О Биотики + Супер Детокс",
  },
] as const;

const categoryMatches = (product: DetailedProduct, filter: CatalogFilter) => {
  if (!filter.categories?.length) return true;
  return product.categories.some((category) => {
    const normalizedCategory = category.toLocaleLowerCase("ru");
    return filter.categories?.some((term) => {
      const normalizedTerm = term.toLocaleLowerCase("ru");
      return normalizedCategory.includes(normalizedTerm) || normalizedTerm.includes(normalizedCategory);
    });
  });
};

const productMatchesSearch = (product: DetailedProduct, query: string) => {
  if (!query) return true;
  const searchableText = [
    product.name,
    product.shortDescription,
    product.mainDescription,
    ...product.categories,
    ...product.keyIngredients,
  ]
    .join(" ")
    .toLocaleLowerCase("ru");
  return searchableText.includes(query);
};

const ProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchValue, setSearchValue] = useState("");
  const [gridColumns, setGridColumns] = useState<CatalogGridColumns>(4);
  const [addedProgramId, setAddedProgramId] = useState<string | null>(null);
  const { addToList } = useProductList();
  const gridAnchorRef = useRef<HTMLDivElement>(null);
  const lastClickedProductId = useRef<string | null>(null);

  const requestedFilterId = searchParams.get("cat");
  const activeFilter = CATALOG_FILTERS.some((filter) => filter.id === requestedFilterId)
    ? requestedFilterId ?? "all"
    : "all";
  const activeFilterConfig = CATALOG_FILTERS.find((filter) => filter.id === activeFilter) ?? CATALOG_FILTERS[0]!;
  const normalizedSearch = searchValue.trim().toLocaleLowerCase("ru");

  const filteredProducts = useMemo(
    () => productsData.filter((product) => categoryMatches(product, activeFilterConfig) && productMatchesSearch(product, normalizedSearch)),
    [activeFilterConfig, normalizedSearch],
  );

  const modalProductId = searchParams.get("productId");
  const selectedProduct = useMemo(
    () => productsData.find((product) => product.id === modalProductId) ?? null,
    [modalProductId],
  );
  const modalProducts = useMemo(() => {
    if (!selectedProduct || filteredProducts.some((product) => product.id === selectedProduct.id)) return filteredProducts;
    return [selectedProduct, ...filteredProducts];
  }, [filteredProducts, selectedProduct]);

  const handleFilterChange = useCallback(
    (filterId: string) => {
      if (gridAnchorRef.current) lenis?.scrollTo(gridAnchorRef.current, { offset: -110, duration: 0.65 });
      setSearchParams(
        (previous) => {
          const next = new URLSearchParams(previous);
          if (filterId === "all") next.delete("cat");
          else next.set("cat", filterId);
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const handleClearFilters = useCallback(() => {
    setSearchValue("");
    setSearchParams(
      (previous) => {
        const next = new URLSearchParams(previous);
        next.delete("cat");
        return next;
      },
      { replace: true },
    );
  }, [setSearchParams]);

  const handleProductClick = useCallback(
    (product: DetailedProduct) => {
      lastClickedProductId.current = product.id;
      setSearchParams(
        (previous) => {
          const next = new URLSearchParams(previous);
          next.set("productId", product.id);
          return next;
        },
        { replace: false },
      );
    },
    [setSearchParams],
  );

  const handleCloseProduct = useCallback(() => {
    setSearchParams(
      (previous) => {
        const next = new URLSearchParams(previous);
        next.delete("productId");
        return next;
      },
      { replace: true },
    );
    const clickedId = lastClickedProductId.current;
    if (!clickedId) return;
    window.requestAnimationFrame(() => {
      const card = document.querySelector(`[data-product-id="${clickedId}"]`);
      if (card instanceof HTMLElement) lenis?.scrollTo(card, { offset: -120, duration: 0.6 });
    });
  }, [setSearchParams]);

  const handleAddProgram = useCallback(
    (productIds: readonly string[], programId: string) => {
      const selectedProducts = productIds
        .map((id) => productsData.find((product) => product.id === id))
        .filter((product): product is DetailedProduct => product !== undefined);
      if (selectedProducts.length !== 2) return;
      selectedProducts.forEach((product) => addToList(product, 1));
      setAddedProgramId(programId);
    },
    [addToList],
  );

  const handleNavigateProduct = useCallback(
    (index: number) => {
      const product = modalProducts[index];
      if (!product) return;
      lastClickedProductId.current = product.id;
      setSearchParams(
        (previous) => {
          const next = new URLSearchParams(previous);
          next.set("productId", product.id);
          return next;
        },
        { replace: true },
      );
    },
    [modalProducts, setSearchParams],
  );

  return (
    <main className="relative min-h-screen bg-[#03050a]">
      <SEO
        title="Каталог формул 4Life"
        description="Состав, формат и баллы лояльности продуктов 4Life. Сверяйте маркировку с актуальной упаковкой и задавайте вопросы перед заказом."
        path="/products"
      />

      <ProductsHero />

      <section ref={gridAnchorRef} className="relative z-10 border-t border-white/[0.06] bg-[#03050a] pt-16 shadow-[0_-28px_60px_rgba(0,0,0,0.48)] md:pt-24">
        <ProductsGrid
          products={filteredProducts}
          allProducts={productsData}
          filters={CATALOG_FILTERS}
          activeFilter={activeFilter}
          onFilterChange={handleFilterChange}
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          gridColumns={gridColumns}
          onGridColumnsChange={setGridColumns}
          onProductClick={handleProductClick}
          onClearFilters={handleClearFilters}
        />
      </section>

      <section aria-labelledby="synergy-programs-title" className="relative z-10 mx-auto max-w-[1440px] bg-[#03050a] px-4 pb-16 md:px-8 md:pb-24">
        <div className="mb-7 grid gap-5 border-b border-white/[0.08] pb-6 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <p className="typography-label mb-3 text-cyan-400">Сочетания из каталога</p>
            <h2 id="synergy-programs-title" className="typography-h2 text-white">Готовые синергичные программы</h2>
          </div>
          <p className="md:col-span-5 typography-body text-slate-400">
            Это подборки продуктов, а не медицинские назначения. Состав, переносимость и способы применения обсуждайте с врачом и сверяйте с этикеткой.
          </p>
        </div>

        <div className="divide-y divide-white/[0.08] border-y border-white/[0.08]">
          {PROGRAMS.map((program, index) => {
            const products = program.productIds
              .map((id) => productsData.find((product) => product.id === id))
              .filter((product): product is DetailedProduct => product !== undefined);
            const totalLp = products.reduce((sum, product) => sum + product.lp, 0);
            const isAdded = addedProgramId === program.id;

            return (
              <article key={program.id} className="grid gap-4 py-6 md:grid-cols-12 md:items-center md:gap-6 md:py-7">
                <p className="typography-label text-cyan-400 md:col-span-1">0{index + 1}</p>
                <div className="md:col-span-5">
                  <h3 className="typography-h3 text-white">{program.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{program.note}</p>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-300 md:col-span-3">
                  <span className="typography-label tabular-nums text-white">{totalLp} LP</span>
                  <span aria-hidden="true" className="h-4 w-px bg-white/[0.12]" />
                  <span>{products.length} продукта</span>
                </div>
                <div className="md:col-span-3 md:justify-self-end">
                  <button
                    type="button"
                    onClick={() => handleAddProgram(program.productIds, program.id)}
                    disabled={products.length !== 2}
                    className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-cyan-400/30 px-4 py-3 text-left text-sm text-cyan-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isAdded ? "Добавлено в список" : "Добавить программу в список"}
                    <Icons.ArrowRight aria-hidden="true" className="size-4 shrink-0" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section id="products-faq" className="relative z-20 isolate">
        <ProductsFAQ />
      </section>

      <ProductDetailModal
        product={selectedProduct}
        products={modalProducts}
        isOpen={Boolean(selectedProduct)}
        onClose={handleCloseProduct}
        onNavigate={handleNavigateProduct}
      />

      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {addedProgramId ? "Программа добавлена в список заказа." : ""}
      </div>
    </main>
  );
};

export default React.memo(ProductsPage);
