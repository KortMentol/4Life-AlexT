/**
 * @module src/components/ui/ProductDetailModal.tsx
 * @description Модальное окно, адаптированное для приема анимации RepeatingImageTransition.
 * Управляется через GSAP из родительского компонента.
 * @author Kort
 * @version 4.0.0 - Refactored for GSAP control
 */

import { DetailedProduct } from "@/data/productsData";
import { Icons } from "@/utils/icons";
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from "react";
import SciFiCloseButton from "./SciFiCloseButton";
import { useShoppingCart } from "./ShoppingCartAnimation";

interface ProductDetailModalProps {
  product: DetailedProduct | null;
  onClose: () => void;
}

// Новый тип для Handle, чтобы родитель мог получить доступ к DOM-элементам
export interface ProductDetailModalHandle {
  getPanel: () => HTMLDivElement | null;
  getPanelImage: () => HTMLDivElement | null;
  getPanelContent: () => HTMLDivElement | null;
}

const ProductDetailModal = forwardRef<ProductDetailModalHandle, ProductDetailModalProps>(
  ({ product, onClose }, ref) => {
    const { addToCart } = useShoppingCart();
    const modalRef = useRef<HTMLDivElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);
    const panelImageRef = useRef<HTMLDivElement>(null);
    const panelContentRef = useRef<HTMLDivElement>(null);
    const closeButtonRef = useRef<HTMLButtonElement>(null);
    const previouslyFocusedElementRef = useRef<HTMLElement | null>(null);

    // Предоставляем доступ к внутренним элементам через ref
    useImperativeHandle(ref, () => ({
      getPanel: () => panelRef.current,
      getPanelImage: () => panelImageRef.current,
      getPanelContent: () => panelContentRef.current,
    }));

    const handleAddToCart = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        if (product) {
          const buttonElement = (e.target as HTMLElement).closest("button");
          if (buttonElement) {
            addToCart(product, buttonElement);
          }
        }
      },
      [product, addToCart]
    );

    // Блокировка скролла и управление фокусом
    useEffect(() => {
      if (product) {
        // Открыто
        previouslyFocusedElementRef.current = document.activeElement as HTMLElement;
        document.body.style.overflow = "hidden";
        setTimeout(() => closeButtonRef.current?.focus(), 600); // Даем время на анимацию
      } else {
        // Закрыто
        document.body.style.overflow = "";
        previouslyFocusedElementRef.current?.focus?.();
      }
      return () => {
        document.body.style.overflow = "";
      };
    }, [product]);

    // Закрытие по клавише Escape
    useEffect(() => {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape" && product) {
          onClose();
        }
      };
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }, [product, onClose]);

    if (!product) return null;

    return (
      // Контейнер модального окна, который всегда рендерится, но видим только при анимации
      <div
        ref={modalRef}
        className="fixed inset-0 z-[9998] pointer-events-none" // Неактивен по умолчанию
      >
        <div
          ref={panelRef}
          className="fixed inset-0 w-full h-full p-6 md:p-8 opacity-0 pointer-events-none" // Скрыт по умолчанию
          style={{ willChange: "transform, clip-path, opacity" }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative w-full h-full grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Левая часть - изображение */}
            <div
              ref={panelImageRef}
              className="relative w-full h-full rounded-2xl"
              style={{
                backgroundImage: `url(${product.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                willChange: "transform, clip-path",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-gray-900/80" />
            </div>
            {/* Правая часть - контент */}
            <div
              ref={panelContentRef}
              className="relative p-8 lg:p-12 flex flex-col justify-center space-y-6 overflow-y-auto text-white"
            >
              <div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {product.categories.map((category: string) => (
                    <span
                      key={category}
                      className="px-3 py-1 text-sm bg-cyan-500/20 text-cyan-300 rounded-full border border-cyan-500/30"
                    >
                      {category}
                    </span>
                  ))}
                </div>
                <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight">{product.name}</h1>
                <p className="text-lg text-gray-300 leading-relaxed">{product.mainDescription}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Основная поддержка:</h3>
                <div className="flex flex-wrap gap-2">
                  {product.mainSupport.map((support: string) => (
                    <span
                      key={support}
                      className="px-3 py-2 bg-green-500/20 text-green-300 rounded-lg border border-green-500/30 text-sm"
                    >
                      {support}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Ключевые преимущества:</h3>
                <ul className="space-y-2">
                  {product.keyBenefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3 text-gray-300">
                      <Icons.Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-sm leading-relaxed">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-white/10">
                <div className="text-3xl font-bold text-cyan-400">{product.lp} LP</div>
                <button
                  onClick={handleAddToCart}
                  className="flex items-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/25"
                >
                  <Icons.ShoppingCart className="w-5 h-5" />В корзину
                </button>
              </div>
            </div>
          </div>
          {/* Кнопка закрытия */}
          <div className="absolute top-4 right-4 z-10">
            <SciFiCloseButton ref={closeButtonRef} onClick={onClose} />
          </div>
        </div>
      </div>
    );
  }
);

ProductDetailModal.displayName = "ProductDetailModal";
export default ProductDetailModal;
