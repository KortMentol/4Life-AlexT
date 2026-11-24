/**
 * @module src/components/ui/ProductListIcon.tsx
 * @description Lightweight Header order-list trigger button.
 * Opens the singleton ProductListModal via shared ProductListContext (zero duplicate portals).
 */

import { usePerformanceTier } from "@/hooks";
import { useProductList } from "@/hooks/useProductList";
import { Icons } from "@/utils/icons";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";

interface ProductListIconProps {
  className?: string;
}

const ProductListIcon: React.FC<ProductListIconProps> = ({ className = "" }) => {
  const tier = usePerformanceTier();
  const isLow = tier === "low";
  const { getTotalItems, openModal } = useProductList();
  const totalItems = getTotalItems();

  return (
    <motion.button
      type="button"
      data-product-list-icon
      className={`product-list-icon relative p-2 rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 [-webkit-tap-highlight-color:transparent] cursor-pointer ${className}`}
      onClick={openModal}
      whileHover={!isLow ? { scale: 1.08 } : undefined}
      whileTap={{ scale: 0.92 }}
      aria-label={`Список заказа (${totalItems})`}
    >
      <Icons.ShoppingBag className="h-5 w-5 md:h-6 md:w-6 header-adaptive-text" />
      <AnimatePresence>
        {totalItems > 0 && (
          <motion.span
            key="list-count"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            data-cart-badge
            className="absolute -top-0.5 -right-0.5 inline-flex items-center justify-center min-w-[20px] h-5 px-1 text-[10px] font-bold tabular-nums text-[#03050a] bg-cyan-400 rounded-full border-2 border-[#050811]"
          >
            {totalItems}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

export default React.memo(ProductListIcon);