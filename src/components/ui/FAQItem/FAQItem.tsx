/**
 * @module src/components/ui/FAQItem/FAQItem.tsx
 * @description Awwwards 2026+ Swiss Editorial Hairline Accordion Item.
 *
 * Craft & Performance Architecture:
 * - Zero dated sci-fi corner brackets, double divider lines, or glowing cyan boxes.
 * - Pure CSS Grid height transition (`grid-template-rows: 0fr -> 1fr`) + GPU `transform: rotate(45deg)`
 *   on the `+` trigger (smoother and lighter than Framer Motion `height: "auto"` layout reflow).
 * - Unified visual grammar with ProductDetailModal Swiss disclosures across /products and /how-to-buy.
 */

import { Icons } from "@/utils/icons";
import React, { useId } from "react";
import { Link } from "react-router-dom";

export interface FAQActionLink {
  label: string;
  to: string;
}

interface FAQItemProps {
  question: string;
  answer: string;
  index: number;
  isOpen?: boolean;
  onToggle?: (index: number) => void;
  actionLink?: FAQActionLink;
}

const FAQItem: React.FC<FAQItemProps> = ({
  question,
  answer,
  index,
  isOpen = false,
  onToggle,
  actionLink,
}) => {
  const panelId = useId();
  const formattedIndex = String(index + 1).padStart(2, "0");

  return (
    <div
      data-faq-item={formattedIndex}
      data-faq-open={isOpen ? "true" : "false"}
      className={`group border-b border-white/[0.09] first:border-t transition-colors duration-200 ${
        isOpen ? "bg-white/[0.02]" : "hover:bg-white/[0.012]"
      }`}
    >
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={() => onToggle?.(index)}
        className="w-full py-5 sm:py-6 px-3 sm:px-4 flex items-center justify-between gap-4 sm:gap-6 text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cyan-400/65"
      >
        <div className="flex items-baseline gap-4 sm:gap-5 min-w-0">
          <span
            aria-hidden="true"
            className={`typography-mono text-xs tabular-nums flex-shrink-0 transition-colors duration-200 ${
              isOpen ? "text-cyan-400" : "text-slate-500 group-hover:text-slate-300"
            }`}
          >
            {formattedIndex}
          </span>
          <h3
            className={`font-heading text-base sm:text-lg md:text-[19px] font-medium leading-snug transition-colors duration-200 text-balance ${
              isOpen ? "text-white" : "text-slate-200 group-hover:text-white"
            }`}
          >
            {question}
          </h3>
        </div>

        {/* Unmistakable Swiss + / × GPU-rotated affordance */}
        <span
          aria-hidden="true"
          className={`w-8 h-8 rounded-full border flex items-center justify-center flex-shrink-0 transition-colors duration-200 ${
            isOpen
              ? "border-cyan-400/50 bg-white/[0.07] text-cyan-300"
              : "border-white/[0.12] bg-white/[0.02] text-slate-400 group-hover:border-white/30 group-hover:text-white"
          }`}
        >
          <Icons.Plus
            className={`w-3.5 h-3.5 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${
              isOpen ? "rotate-45" : "rotate-0"
            }`}
          />
        </span>
      </button>

      {/* Pure CSS Grid smooth expand — zero Framer Motion height:auto layout jitter */}
      <div
        id={panelId}
        role="region"
        aria-hidden={!isOpen}
        className={`grid transition-[grid-template-rows,opacity] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="pl-11 sm:pl-[52px] pr-4 sm:pr-12 pb-6 pt-0.5 space-y-3">
            <p className="selectable-text text-sm sm:text-[15px] text-slate-300 leading-relaxed text-pretty">
              {answer}
            </p>
            {actionLink && (
              <Link
                to={actionLink.to}
                tabIndex={isOpen ? 0 : -1}
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-cyan-300 hover:text-cyan-200 transition-colors"
              >
                <span>{actionLink.label}</span>
                <Icons.ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQItem;
