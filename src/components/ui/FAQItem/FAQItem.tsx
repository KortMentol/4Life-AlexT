/**
 * @module src/components/ui/FAQItem/FAQItem.tsx
 * @description Профессиональный sci-fi аккордеон как на Awwwards сайтах
 * @author Kort
 * @version 4.2.0 - Cleaned (2026) — темная тема зафиксирована
 */

import React from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePerformanceTier } from "@/hooks";

interface FAQItemProps {
  question: string;
  answer: string;
  index: number;
  isOpen?: boolean;
  onToggle?: (index: number) => void;
}

const FAQItem: React.FC<FAQItemProps> = ({
  question,
  answer,
  index,
  isOpen = false,
  onToggle,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const tier = usePerformanceTier();
  const shouldAnimate = tier !== "low" && !prefersReducedMotion;
  const triggerId = `faq-trigger-${index}`;
  const panelId = `faq-panel-${index}`;

  return (
    <motion.div
      initial={shouldAnimate ? { opacity: 0, y: 12 } : false}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: shouldAnimate ? index * 0.05 : 0, duration: shouldAnimate ? 0.45 : 0, ease: [0.16, 1, 0.3, 1] }}
      className="group border-b border-white/[0.08] last:border-b-0"
    >
      <button
        id={triggerId}
        type="button"
        onClick={() => onToggle?.(index)}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="flex min-h-20 w-full items-center justify-between gap-6 py-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cyan-400"
      >
        <h3 className="typography-h3 text-left text-white transition-colors duration-200 group-hover:text-cyan-200">
          {question}
        </h3>
        <span
          aria-hidden="true"
          className="flex size-9 shrink-0 items-center justify-center rounded-full border border-white/15 text-xl font-light text-cyan-300 transition-colors group-hover:border-cyan-300/60"
        >
          {isOpen ? "−" : "+"}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={panelId}
            role="region"
            aria-labelledby={triggerId}
            initial={shouldAnimate ? { opacity: 0, y: -8 } : false}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldAnimate ? { opacity: 0, y: -6 } : undefined}
            transition={{ duration: shouldAnimate ? 0.25 : 0, ease: [0.16, 1, 0.3, 1] }}
            className="pb-6 pr-12"
          >
            <p className="max-w-3xl text-base leading-7 text-slate-300">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default FAQItem;
