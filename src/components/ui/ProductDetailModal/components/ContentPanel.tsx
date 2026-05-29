/**
 * ContentPanel — весь текстовый контент продукта.
 * Используется и на мобилке (в скроллируемой области), и на десктопе.
 */
import { DetailedProduct } from "@/data/productsData";
import { Icons } from "@/utils/icons";
import React from "react";

interface ContentPanelProps {
  product: DetailedProduct;
  isDark: boolean;
  isMobile: boolean;
  onAddToCart: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export const ContentPanel: React.FC<ContentPanelProps> = ({ product, isDark, isMobile, onAddToCart }) => {
  const qty = product.capsules ? `${product.capsules} капсул` : product.servings ? `${product.servings} порций` : null;

  const t = {
    text: isDark ? "text-white" : "text-slate-900",
    muted: isDark ? "text-slate-400" : "text-slate-500",
    subtle: isDark ? "text-slate-500" : "text-slate-400",
    border: isDark ? "border-white/[0.08]" : "border-slate-200",
    tag: isDark
      ? "bg-white/5 text-slate-300 border border-white/10"
      : "bg-slate-100 text-slate-600 border border-slate-200",
    support: isDark
      ? "bg-emerald-500/10 text-emerald-300 border border-emerald-400/20"
      : "bg-emerald-50 text-emerald-700 border border-emerald-200",
    science: isDark ? "bg-blue-500/5 border border-blue-400/10" : "bg-blue-50 border border-blue-200",
    scienceText: isDark ? "text-slate-400" : "text-slate-600",
    scienceLabel: isDark ? "text-blue-400/70" : "text-blue-600",
    composition: isDark ? "text-slate-500" : "text-slate-500",
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
      <div
        className={`flex items-center gap-4 py-3 px-4 rounded-2xl border ${t.border} ${isDark ? "bg-white/[0.02]" : "bg-slate-50"}`}
      >
        <div>
          <p className={`text-[9px] uppercase tracking-widest font-semibold mb-0.5 ${t.subtle}`}>Цена</p>
          <p
            className={`text-2xl font-bold bg-gradient-to-r bg-clip-text text-transparent ${isDark ? "from-cyan-400 to-blue-400" : "from-blue-600 to-cyan-500"}`}
          >
            {product.lp} LP
          </p>
        </div>
        {qty && (
          <>
            <div className={`w-px h-8 ${isDark ? "bg-white/10" : "bg-slate-200"}`} />
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
                <div
                  className={`mt-1 w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0 ${isDark ? "bg-emerald-400/15 border border-emerald-400/30" : "bg-emerald-100 border border-emerald-300"}`}
                >
                  <Icons.Check className={`w-2 h-2 ${isDark ? "text-emerald-400" : "text-emerald-600"}`} />
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
            className={`w-full flex items-center justify-center gap-2.5 py-3.5 rounded-2xl font-semibold text-base text-white transition-all duration-200 active:scale-[0.98] shadow-lg ${
              isDark
                ? "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-cyan-500/20 hover:shadow-cyan-500/30"
                : "bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 shadow-blue-500/20"
            }`}
          >
            <Icons.ShoppingCart className="w-5 h-5" />
            <span>Добавить в список</span>
          </button>
          <p className={`text-center text-xs mt-2 ${t.subtle}`}>Консультация по подбору — бесплатно</p>
        </div>
      )}
    </div>
  );
};
