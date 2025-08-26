// src/components/ui/ProductGridCard.tsx

import { DetailedProduct } from "@/data/productsData";
import { preloadImage } from "@/utils/imageUtils";
import { motion } from "framer-motion";
import { forwardRef } from "react";
import { Icons } from "@/utils/icons";

interface ProductGridCardProps {
  product: DetailedProduct;
  onClick: () => void;
}

const ProductGridCard = forwardRef<HTMLDivElement, ProductGridCardProps>(({ product, onClick }, ref) => {
  // [OPTIMIZATION] Вся сложная JS-логика для 3D-эффекта удалена.
  // Вместо этого мы будем использовать более производительные CSS и Framer Motion whileHover.

  const handlePreload = () => {
    preloadImage(product.image);
  };

  return (
    <motion.div
      ref={ref}
      onClick={onClick}
      onMouseEnter={handlePreload}
      onTouchStart={handlePreload}
      className="group relative aspect-[4/5] w-full cursor-pointer overflow-hidden rounded-2xl border border-white/5 transition-shadow duration-300 hover:shadow-2xl hover:shadow-cyan-500/10"
      // [REFACTOR] layoutId теперь только на корневом элементе. Это ключевое изменение.
      layoutId={`product-card-${product.id}`}
      // [OPTIMIZATION] Простая и эффективная анимация при наведении.
      whileHover={{ scale: 1.05, y: -5 }}
      transition={{ type: "spring", stiffness: 400, damping: 15 }}
    >
      <motion.img
        src={product.image}
        alt={product.name}
        loading="lazy"
        className="absolute inset-[-10%] h-[120%] w-[120%] object-cover transition-transform duration-700 ease-in-out group-hover:scale-105" // [OPTIMIZATION] Простой scale эффект через CSS
        style={{
          willChange: "transform",
        }}
      />

      <div
        className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"
        style={{ transform: "translateZ(20px)" }}
      />

      {/* [OPTIMIZATION] Эффект свечения теперь полностью на CSS, без JS. */}
      <div className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-[radial-gradient(400px_at_50%_50%,rgba(0,255,255,0.15),transparent_80%)]" />

      <div
        className="absolute inset-0 flex flex-col justify-end p-6 text-white"
        style={{ transform: "translateZ(50px)" }}
      >
        <motion.div
          transition={{ delay: 0.1 }}
          className="transition-transform duration-500 group-hover:-translate-y-2"
        >
          {/* [REFACTOR] layoutId убран с дочерних элементов */}
          <h3 className="text-2xl font-bold tracking-tight">{product.name}</h3>
          <p className="mt-1 text-sm text-white/80 line-clamp-2">{product.shortDescription}</p>
        </motion.div>

        <motion.div
          className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 transition-all duration-300 group-hover:scale-110 group-hover:bg-cyan-400/30"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Icons.ArrowRight className="h-5 w-5" />
        </motion.div>
      </div>
    </motion.div>
  );
});

ProductGridCard.displayName = "ProductGridCard";

export default ProductGridCard;
