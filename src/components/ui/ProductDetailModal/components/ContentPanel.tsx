import { siteConfig } from "@/site-config/site";
import { DetailedProduct, getProductCatalogSummary } from "@/data/productsData";
import { useProductList } from "@/hooks/useProductList";
import { Icons } from "@/utils/icons";
import React, { useMemo } from "react";

interface ContentPanelProps {
  product: DetailedProduct;
  isMobile: boolean;
}

export const ContentPanel: React.FC<ContentPanelProps> = ({ product }) => {
  const { items, addToList } = useProductList();
  const currentItem = items.find((item) => item.id === product.id);
  const quantity = currentItem?.quantity ?? 0;
  const ingredients = useMemo(() => product.keyIngredients ?? [], [product.keyIngredients]);
  const productFormat = product.capsules
    ? `${product.capsules} капсул`
    : product.servings
      ? `${product.servings} порций`
      : "см. упаковку";

  const handleAddToList = () => addToList(product, 1);

  return (
    <div className="flex flex-col gap-7 px-5 py-6 md:gap-8 md:px-8 md:py-8">
      <header>
        <p className="typography-label mb-3 text-cyan-400">4Life · {product.categories.slice(0, 2).join(" / ")}</p>
        <h2 className="typography-h2 text-balance text-white">{product.name}</h2>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">{getProductCatalogSummary(product)}</p>
      </header>

      <dl className="grid grid-cols-3 divide-x divide-white/[0.08] border-y border-white/[0.08] py-4">
        <div className="pr-3">
          <dt className="typography-label text-slate-500">Лояльность</dt>
          <dd className="mt-2 font-mono text-lg tabular-nums text-white">{product.lp} LP</dd>
        </div>
        <div className="px-3">
          <dt className="typography-label text-slate-500">Формат</dt>
          <dd className="mt-2 text-sm text-white">{productFormat}</dd>
        </div>
        <div className="pl-3">
          <dt className="typography-label text-slate-500">ID партнёра</dt>
          <dd className="mt-2 font-mono text-sm tabular-nums text-white">{siteConfig.distributor.fourLifeId}</dd>
        </div>
      </dl>

      <section aria-labelledby="product-composition-title">
        <div className="mb-4 flex items-end justify-between gap-4">
          <h3 id="product-composition-title" className="typography-h3 text-white">Состав и маркировка</h3>
          <span className="typography-label text-slate-500">по каталогу</span>
        </div>
        <p className="text-sm leading-7 text-slate-300">{product.composition}</p>
        {ingredients.length > 0 ? (
          <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2 border-t border-white/[0.08] pt-4">
            {ingredients.map((ingredient, index) => (
              <li key={`${ingredient}-${index}`} className="text-xs leading-5 text-slate-400">
                <span className="mr-2 font-mono tabular-nums text-cyan-400">{String(index + 1).padStart(2, "0")}</span>
                {ingredient}
              </li>
            ))}
          </ul>
        ) : null}
        <p className="mt-4 text-xs leading-6 text-slate-500">Сверяйте полный состав, аллергены и предупреждения с этикеткой конкретного продукта и рынка.</p>
      </section>

      <section className="border-l border-cyan-400/50 pl-4" aria-labelledby="product-evidence-title">
        <h3 id="product-evidence-title" className="typography-label text-cyan-300">Научные данные и патенты</h3>
        <p className="mt-3 text-sm leading-6 text-slate-400">Для этой формулы на странице не приведены проверяемые ссылки на независимые клинические исследования или конкретные патенты. Поэтому количественные медицинские эффекты здесь не заявляются.</p>
      </section>

      <section aria-labelledby="product-use-title">
        <h3 id="product-use-title" className="typography-h3 text-white">Применение</h3>
        <p className="mt-3 text-sm leading-6 text-slate-300">В каталоге указано: {product.howToUse}</p>
        <p className="mt-3 text-xs leading-6 text-slate-500">Информация не заменяет инструкцию производителя и медицинскую консультацию. При беременности, хронических заболеваниях, аллергиях или приёме лекарств уточните применение у врача.</p>
      </section>

      <div className="flex flex-col gap-3 border-t border-white/[0.08] pt-6">
        <button
          type="button"
          onClick={handleAddToList}
          className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-cyan-400 px-5 text-sm font-semibold text-[#03050a] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          aria-label={quantity > 0 ? `Добавить ещё одну упаковку ${product.name} в список заказа` : `Добавить ${product.name} в список заказа`}
        >
          <Icons.ShoppingBag className="size-4" aria-hidden="true" />
          {quantity > 0 ? `✓ В вашем списке (${quantity} шт.) — добавить ещё` : "Добавить в список заказа"}
        </button>
        <p className="text-center text-xs leading-5 text-slate-500">Партнёрский ID будет включён в сообщение. Итоговую цену, скидку и наличие подтвердите перед оплатой.</p>
      </div>
    </div>
  );
};
