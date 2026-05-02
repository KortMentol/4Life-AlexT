/**
 * @module src/components/ui/ShoppingCartAnimation.tsx
 * @description Визуальный компонент корзины покупок.
 * Отображает кнопку и панель с товарами, получая данные из ProductListContext.
 * @author Kort
 * @version 2.2.0 - Fully type-safe
 */

import { DetailedProduct } from "@/data/productsData";
import { useProductList } from "@/hooks/useProductList";
import { Icons } from "@/utils/icons";
import { AnimatePresence, motion } from "framer-motion";
import { gsap } from "gsap";
import React, { useCallback, useEffect, useRef } from "react";

interface CartButtonProps {
  itemCount: number;
  onClick: () => void;
}

const CartButton: React.FC<CartButtonProps> = ({ itemCount, onClick }) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const numberRef = useRef<HTMLSpanElement>(null);
  const bgRef = useRef<HTMLSpanElement>(null);
  const prevItemCount = useRef(itemCount);

  useEffect(() => {
    if (itemCount > prevItemCount.current && buttonRef.current) {
      gsap
        .timeline()
        .to(numberRef.current, { scale: 0, duration: 0.1 })
        .to(bgRef.current, { scale: 1.2, duration: 0.4, ease: "power3.out" })
        .to(bgRef.current, {
          scale: 1,
          duration: 0.8,
          ease: "elastic.out(1, 0.5)",
        })
        .to(
          numberRef.current,
          { scale: 1, duration: 0.8, ease: "elastic.out(1, 0.5)" },
          "-=0.6",
        );
    }
    prevItemCount.current = itemCount;
  }, [itemCount]);

  return (
    <button
      ref={buttonRef}
      onClick={onClick}
      className="fixed top-6 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-black/20 backdrop-blur-md border border-white/20 rounded-full text-white hover:bg-black/30 transition-all duration-300 group"
    >
      <span className="text-sm font-medium">Корзина</span>
      <div className="relative">
        <Icons.ShoppingCart className="w-6 h-6" />
        <AnimatePresence>
          {itemCount > 0 && (
            <>
              <motion.span
                ref={bgRef}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute -top-2 -right-2 w-5 h-5 bg-cyan-500 rounded-full"
              />
              <motion.span
                ref={numberRef}
                key={itemCount}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center text-xs font-bold text-white"
              >
                {itemCount}
              </motion.span>
            </>
          )}
        </AnimatePresence>
      </div>
    </button>
  );
};

interface ShoppingCartAnimationProps {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

const ShoppingCartAnimation: React.FC<ShoppingCartAnimationProps> = ({
  isOpen,
  onToggle,
  onClose,
}) => {
  const { items, removeFromList, updateItemQuantity, clearList } =
    useProductList();
  const cartRef = useRef<HTMLDivElement>(null);

  const cartVariants = {
    closed: {
      x: "100%",
      transition: { type: "spring", stiffness: 400, damping: 40 },
    },
    open: {
      x: "0%",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        staggerChildren: 0.07,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    closed: { opacity: 0, x: 50 },
    open: { opacity: 1, x: 0 },
  };

  const getTotalPrice = useCallback(() => {
    // --- ИСПРАВЛЕНИЕ: Теперь `item.lp` доступно без приведения типов ---
    return items.reduce((total, item) => total + item.lp * item.quantity, 0);
  }, [items]);

  return (
    <>
      <CartButton
        itemCount={items.reduce((acc, item) => acc + item.quantity, 0)}
        onClick={onToggle}
      />

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={cartRef}
            variants={cartVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed top-0 right-0 h-full w-full max-w-md bg-gray-900/95 backdrop-blur-xl border-l border-white/10 z-50 flex flex-col"
          >
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Корзина</h2>
              <button
                onClick={onClose}
                className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
              >
                <Icons.X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <motion.div
                  variants={itemVariants}
                  className="text-center py-12"
                >
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-800 rounded-full flex items-center justify-center">
                    <Icons.ShoppingCart className="w-8 h-8 text-gray-500" />
                  </div>
                  <p className="text-gray-400">Корзина пуста</p>
                </motion.div>
              ) : (
                <motion.div variants={cartVariants} className="space-y-4">
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      variants={itemVariants}
                      layout
                      className="flex gap-4 p-4 bg-white/[0.02] rounded-lg border border-white/10"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="text-white font-medium text-sm line-clamp-2">
                          {item.name}
                        </h3>
                        {/* --- ИСПРАВЛЕНИЕ: Теперь `item.lp` доступно без приведения типов --- */}
                        <p className="text-cyan-400 font-bold mt-1">
                          {item.lp} LP
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                updateItemQuantity(item.id, item.quantity - 1)
                              }
                              className="w-6 h-6 bg-white/10 hover:bg-white/20 rounded text-white text-sm flex items-center justify-center"
                            >
                              -
                            </button>
                            <span className="text-white text-sm w-8 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateItemQuantity(item.id, item.quantity + 1)
                              }
                              className="w-6 h-6 bg-white/10 hover:bg-white/20 rounded text-white text-sm flex items-center justify-center"
                            >
                              +
                            </button>
                          </div>
                          <button
                            onClick={() => removeFromList(item.id)}
                            className="text-red-400 hover:text-red-300 text-sm"
                          >
                            Удалить
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>

            {items.length > 0 && (
              <motion.div
                variants={itemVariants}
                className="p-6 border-t border-white/10 bg-gray-900/50"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-white font-medium">Итого:</span>
                  <span className="text-2xl font-bold text-cyan-400">
                    {getTotalPrice()} LP
                  </span>
                </div>
                <button className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-white font-semibold rounded-lg transition-colors">
                  Оформить заказ
                </button>
                <div className="flex justify-between mt-4">
                  <p className="text-xs text-gray-400 text-center">
                    Доставка и налоги рассчитываются при оформлении
                  </p>
                  <button
                    onClick={clearList}
                    className="text-xs text-red-400 hover:text-red-300 transition-colors"
                  >
                    Очистить корзину
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// Хук для использования корзины
export const useShoppingCart = () => {
  const { addToList } = useProductList();

  const addToCart = useCallback(
    (product: DetailedProduct, sourceElement: HTMLElement) => {
      // Диспетчер событий для запуска анимации на странице
      const event = new CustomEvent("animate-add-to-cart", {
        detail: { product, sourceElement, addToList },
      });
      window.dispatchEvent(event);
    },
    [addToList],
  );

  return { addToCart };
};

export default ShoppingCartAnimation;
