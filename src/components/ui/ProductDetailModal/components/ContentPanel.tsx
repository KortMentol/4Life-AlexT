/**
 * ContentPanel — весь текстовый контент продукта.
 * Используется и на мобилке (в скроллируемой области), и на десктопе.
 * Все иконки строго импортируются из единого пульта @/utils/icons.
 */
import { DetailedProduct } from "@/data/productsData";
import { Icons } from "@/utils/icons";
import React from "react";

interface ContentPanelProps {
  product: DetailedProduct;
  isMobile: boolean;
  onAddToCart: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export const ContentPanel: React.FC<ContentPanelProps> = ({ product, isMobile, onAddToCart }) => {
  const qty = product.capsules ? `${product.capsules} капсул` : product.servings ? `${product.servings} порций` : null;

  const t = {
    text: "text-white",
    muted: "text-slate-400",
    subtle: "text-slate-500",
    border: "border-white/[0.08]",
    tag: "bg-white/5 text-slate-300 border border-white/10",
    support: "bg-emerald-500/10 text-emerald-300 border border-emerald-400/20",
    science: "bg-blue-500/5 border border-blue-400/10",
    scienceText: "text-slate-400",
    scienceLabel: "text-blue-400/70",
    composition: "text-slate-500",
  };

  return (
    <div className="space-y-5">
      {/* Categories */}
      <div className="flex flex-wrap gap-1.5">
        {product.categories.map((cat) => (
          <span key={cat} className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg ${t.tag}`}>
            {cat}
          </span>
        ))}
      </div>

      {/* Name */}
      <h2
        className={`font-bold leading-tight tracking-tight ${t.text} ${isMobile ? "text-2xl" : "text-2xl md:text-3xl"}`}
      >
        {product.name}
      </h2>

      {/* Price + volume */}
      <div className={`flex items-center gap-4 py-3 px-4 rounded-2xl border ${t.border} bg-white/[0.02]`}>
        <div>
          <p className={`text-[9px] uppercase tracking-widest font-semibold mb-0.5 ${t.subtle}`}>Цена</p>
          <p className="text-2xl font-bold bg-gradient-to-r bg-clip-text text-transparent from-cyan-400 to-blue-400">
            {product.lp} LP
          </p>
        </div>
        {qty && (
          <>
            <div className="w-px h-8 bg-white/10" />
            <div>
              <p className={`text-[9px] uppercase tracking-widest font-semibold mb-0.5 ${t.subtle}`}>Объём</p>
              <p className={`text-sm font-medium ${t.muted}`}>{qty}</p>
            </div>
          </>
        )}
      </div>

      {/* Description */}
      <p className={`text-sm leading-relaxed ${t.muted}`}>{product.mainDescription}</p>

      {/* Main support */}
      {product.mainSupport.length > 0 && (
        <div className="space-y-2">
          <p className={`text-[10px] font-bold uppercase tracking-widest ${t.subtle}`}>Поддерживает</p>
          <div className="flex flex-wrap gap-1.5">
            {product.mainSupport.map((s) => (
              <span key={s} className={`px-2.5 py-1 text-xs rounded-lg font-medium ${t.support}`}>
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Key benefits */}
      {product.keyBenefits.length > 0 && (
        <div className="space-y-2">
          <p className={`text-[10px] font-bold uppercase tracking-widest ${t.subtle}`}>Преимущества</p>
          <ul className="space-y-2">
            {product.keyBenefits.map((b, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <div className="mt-1 w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0 bg-emerald-400/15 border border-emerald-400/30">
                  <Icons.Check className="w-2 h-2 text-emerald-400" />
                </div>
                <span className={`text-xs leading-relaxed ${t.muted}`}>{b}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* How to use */}
      <div className="space-y-1.5">
        <p className={`text-[10px] font-bold uppercase tracking-widest ${t.subtle}`}>Применение</p>
        <p className={`text-xs leading-relaxed ${t.muted}`}>{product.howToUse}</p>
      </div>

      {/* Scientific evidence */}
      {product.scientificEvidence && (
        <div className={`p-4 rounded-2xl space-y-1.5 ${t.science}`}>
          <div className="flex items-center gap-2">
            <Icons.FlaskConical className={`w-3.5 h-3.5 flex-shrink-0 ${t.scienceLabel}`} />
            <span className={`text-[10px] font-bold uppercase tracking-widest ${t.scienceLabel}`}>Научная база</span>
          </div>
          <p className={`text-xs leading-relaxed ${t.scienceText}`}>{product.scientificEvidence}</p>
        </div>
      )}

      {/* Composition */}
      {product.composition && (
        <div className="space-y-1.5 pb-2">
          <p className={`text-[10px] font-bold uppercase tracking-widest ${t.subtle}`}>Состав</p>
          <p className={`text-[11px] leading-relaxed ${t.composition}`}>{product.composition}</p>
        </div>
      )}

      {/* Desktop CTA */}
      {!isMobile && (
        <div className={`pt-4 border-t ${t.border}`}>
          <button
            onClick={onAddToCart}
            className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-2xl font-semibold text-base text-white transition-all duration-200 active:scale-[0.98] shadow-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-cyan-500/20 hover:shadow-cyan-500/30"
          >
            {/* ИСПРАВЛЕНИЕ: Иконка ShoppingCart заменена на ShoppingBag для сквозной гармонии с хедером */}
            <Icons.ShoppingBag className="w-5 h-5" />
            <span>Добавить в список</span>
          </button>
          <p className={`text-center text-xs mt-2 ${t.subtle}`}>Консультация по подбору — бесплатно</p>
        </div>
      )}
    </div>
  );
};
