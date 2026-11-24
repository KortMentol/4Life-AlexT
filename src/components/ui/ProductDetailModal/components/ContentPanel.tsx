/**
 * @module ContentPanel
 * @description Swiss editorial product dossier panel (Awwwards 2027+ Typography & Restraint).
 * Clean, unified visual hierarchy:
 *   Title -> 3-column passport -> Lead -> Indexed Benefits (01–05) -> Dosage ->
 *   Uniform collapsible Swiss disclosures («Научная основа», «Полный состав») -> Official PDF spec.
 */

import LpInfoPopover from "@/components/ui/LpInfoPopover";
import { DetailedProduct } from "@/data/productsData";
import { siteConfig } from "@/site-config/site";
import { estimateRetailRub, formatRub } from "@/utils/catalogHelpers";
import { Icons } from "@/utils/icons";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";

interface ContentPanelProps {
  product: DetailedProduct;
  onClose?: () => void;
}

interface DisclosureRowProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

const DisclosureRow: React.FC<DisclosureRowProps> = ({ title, isOpen, onToggle, children }) => {
  return (
    <div className="border-t border-white/[0.08]">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="w-full py-4 flex items-center justify-between gap-4 text-left group cursor-pointer focus-visible:outline-none focus-visible:text-white"
      >
        <span
          className={`text-xs uppercase tracking-[0.16em] font-semibold transition-colors ${
            isOpen ? "text-white" : "text-slate-300 group-hover:text-white"
          }`}
        >
          {title}
        </span>

        <span
          aria-hidden="true"
          className={`w-7 h-7 rounded-full border flex items-center justify-center transition-colors flex-shrink-0 ${
            isOpen
              ? "border-white/25 bg-white/[0.08] text-white"
              : "border-white/[0.11] bg-white/[0.02] text-slate-400 group-hover:border-white/25 group-hover:text-white"
          }`}
        >
          {isOpen ? <Icons.Minus className="w-3.5 h-3.5" /> : <Icons.Plus className="w-3.5 h-3.5" />}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="disclosure-body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-5 pt-0.5">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const ContentPanel: React.FC<ContentPanelProps> = ({ product, onClose }) => {
  const [openScience, setOpenScience] = useState(false);
  const [openComposition, setOpenComposition] = useState(false);

  // Reset collapsible sections when switching between formulas via Prev/Next
  useEffect(() => {
    setOpenScience(false);
    setOpenComposition(false);
  }, [product.id]);

  const qty = product.capsules
    ? `${product.capsules} капсул`
    : product.servings
      ? `${product.servings} порций`
      : "—";

  const primaryFocus = product.mainSupport[0] ?? product.categories[0] ?? "Системная поддержка";
  const retailRub = estimateRetailRub(product.priceRub);

  return (
    <div className="space-y-6 pb-8">
      {/* Product Title */}
      <h2 className="typography-h2 text-white leading-tight">{product.name}</h2>

      {/* Swiss 3-column passport bar — discounted price −25% + retail ref + LP + packaging + focus */}
      <div className="border-y border-white/[0.09] py-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <span className="block text-xs text-slate-400 mb-1">
            Цена по ID {siteConfig.distributor.fourLifeId} (−25%)
          </span>
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="font-heading text-xl md:text-2xl font-bold text-white tabular-nums leading-tight">
              ≈ {formatRub(product.priceRub)}
            </span>
            {retailRub > product.priceRub && (
              <span
                data-modal-retail-price="true"
                className="text-xs text-slate-500 line-through tabular-nums"
              >
                {formatRub(retailRub)}
              </span>
            )}
          </div>
          <div className="mt-1.5 flex items-center gap-1.5 typography-mono text-xs text-slate-400 tabular-nums whitespace-nowrap">
            <span>{product.lp} LP</span>
            <LpInfoPopover
              context="modal"
              align="left"
              placement="bottom"
              onNavigateBefore={onClose}
            />
            <span className="text-slate-600" aria-hidden="true">
              ·
            </span>
            <span>от 1 шт.</span>
          </div>
        </div>

        <div className="sm:border-l sm:border-white/[0.08] sm:pl-4">
          <span className="block text-xs text-slate-400 mb-1">Упаковка</span>
          <span className="text-base font-medium text-slate-100 tabular-nums">{qty}</span>
        </div>

        <div className="sm:border-l sm:border-white/[0.08] sm:pl-4 min-w-0">
          <span className="block text-xs text-slate-400 mb-1">Назначение</span>
          <span className="block text-base font-medium text-slate-100 leading-snug">{primaryFocus}</span>
        </div>
      </div>

      {/* Lead description (16px readable floor + selectable) */}
      <p className="selectable-text text-base text-slate-200/90 leading-relaxed text-pretty">
        {product.mainDescription}
      </p>

      {/* Key benefits — Swiss indexed hairline list 01–05 */}
      {product.keyBenefits.length > 0 && (
        <div className="space-y-2.5 pt-1">
          <p className="text-xs uppercase tracking-[0.16em] font-semibold text-slate-400">
            Ключевые свойства формулы
          </p>
          <ol className="divide-y divide-white/[0.07] border-y border-white/[0.07]">
            {product.keyBenefits.slice(0, 5).map((benefit, idx) => (
              <li key={idx} className="py-3.5 flex items-baseline gap-4">
                <span className="font-heading text-xs font-semibold text-cyan-400/85 tabular-nums w-6 flex-shrink-0">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <span className="selectable-text text-[15px] text-slate-100 leading-relaxed text-pretty">
                  {benefit}
                </span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* How to use */}
      <div className="space-y-2 pt-1">
        <p className="text-xs uppercase tracking-[0.16em] font-semibold text-slate-400">
          Рекомендации по применению
        </p>
        <p className="selectable-text text-[15px] text-slate-200 leading-relaxed text-pretty">
          {product.howToUse}
        </p>
      </div>

      {/* Uniform Swiss Collapsible Technical Disclosures (Scientific Basis & Full Composition) */}
      <div className="border-b border-white/[0.08]">
        {product.scientificEvidence && (
          <DisclosureRow
            title="Научная основа"
            isOpen={openScience}
            onToggle={() => setOpenScience((prev) => !prev)}
          >
            <p className="selectable-text text-[15px] text-slate-300 leading-relaxed text-pretty">
              {product.scientificEvidence}
            </p>
          </DisclosureRow>
        )}

        {product.composition && (
          <DisclosureRow
            title="Полный состав"
            isOpen={openComposition}
            onToggle={() => setOpenComposition((prev) => !prev)}
          >
            <p className="selectable-text text-sm text-slate-300 leading-relaxed text-pretty">
              {product.composition}
            </p>
          </DisclosureRow>
        )}
      </div>

      {/* Official 4Life Eurasia PDF Product Profile Sheet */}
      {product.pdfUrl && (
        <div className="pt-1">
          <a
            href={product.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between gap-4 py-3.5 px-4 rounded-2xl bg-white/[0.025] hover:bg-white/[0.055] border border-white/[0.09] hover:border-white/[0.2] transition-colors"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <span className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.1] group-hover:border-white/[0.2] flex items-center justify-center flex-shrink-0 text-slate-300 group-hover:text-white transition-colors">
                <Icons.FileText className="w-4 h-4" />
              </span>
              <div className="min-w-0">
                <span className="block text-sm font-semibold text-white truncate">
                  Официальный лист продукта (PDF)
                </span>
                <span className="block text-xs text-slate-400 truncate mt-0.5">
                  Спецификация 4Life Eurasia · состав и дозировки
                </span>
              </div>
            </div>
            <Icons.ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-white flex-shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>
      )}
    </div>
  );
};