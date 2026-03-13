// src/pages/ProductsPage.tsx

/**
 * @module src/pages/ProductsPage.tsx
 * @description Awwwards 2025 Ultra Performance - 144 FPS + Apple-level smoothness
 * @author Kort
 * @version 9.0.0 - Performance Optimized
 */

import { FAQItem, ProductCatalogGrid, ProductDetailModal, ProductFilters } from "@/components/ui";
import type { ProductDetailModalHandle } from "@/components/ui/ProductDetailModal";
import type { FilterState } from "@/components/ui/ProductFilters";
import { DetailedProduct, productsData } from "@/data/productsData";
import { usePerformanceTier, useProductList } from "@/hooks";
import { SEO } from "@/seo/SEO";
import { motion } from "framer-motion";
import React, { useCallback, useMemo, useRef, useState } from "react";

import productsHeroVideo from "@/assets/videos/backgrounds/ProductsPage/Hero-section/bg-video-ProductsPage.mp4";

// FAQ данные
const faqData = [
  {
    question: "Что такое Трансфер Факторы?",
    answer:
      "Трансфер Факторы — это молекулы иммунной памяти, которые передают информацию от опытных иммунных клеток к незрелым. Они обучают вашу иммунную систему быстрее распознавать угрозы, эффективнее реагировать и запоминать прошлые атаки. Технология защищена патентами США и клинически доказана.",
  },
  {
    question: "Как принимать продукты 4Life?",
    answer:
      "Базовые продукты (TF Classic, Tri-Factor) принимаются по 2-3 капсулы в день во время еды. Целевые формулы (Cardio, GluCoach) — согласно инструкции на упаковке. Для максимального эффекта рекомендуется регулярный прием курсами от 3 месяцев. Всегда запивайте полным стаканом воды.",
  },
  {
    question: "Безопасны ли продукты 4Life?",
    answer:
      "Да, абсолютно безопасны. Все продукты производятся на сертифицированных GMP-заводах, проходят многоступенчатый контроль качества и соответствуют международным стандартам. Трансфер Факторы — это натуральные компоненты из молозива и яичного желтка, которые организм распознает как свои.",
  },
  {
    question: "Можно ли совмещать продукты 4Life с лекарствами?",
    answer:
      "Продукты 4Life — это нутрицевтики, не лекарства. Они совместимы с большинством препаратов, но при серьезных заболеваниях или приеме иммуносупрессоров рекомендуется консультация врача. Трансфер Факторы не заменяют лечение, а дополняют его.",
  },
  {
    question: "Как быстро появится эффект?",
    answer:
      "Первые изменения (прилив энергии, улучшение самочувствия) многие замечают через 1-2 недели. Полный эффект для иммунной системы проявляется через 2-3 месяца регулярного приема. Для целевых формул (Cardio, Recall) — от 4 недель. Результат индивидуален и зависит от исходного состояния здоровья.",
  },
  {
    question: "Чем 4Life отличается от обычных витаминов?",
    answer:
      "Витамины — это строительный материал. Трансфер Факторы — это информация и обучение для иммунитета. Они не просто восполняют дефицит, а обучают иммунные клетки работать умнее. Это революционная технология, не имеющая аналогов. Плюс продукты 4Life содержат синергичные комплексы витаминов, минералов и растительных экстрактов.",
  },
  {
    question: "Подходят ли продукты детям и беременным?",
    answer:
      "Трансфер Факторы безопасны для детей от 2 лет (дозировка по весу). Для беременных и кормящих рекомендуется консультация врача, хотя компоненты натуральные и присутствуют в грудном молоке. Детям особенно полезны RioVida и базовые формулы для укрепления иммунитета.",
  },
];

const ProductsPage: React.FC = () => {
  const tier = usePerformanceTier();
  const [selectedProduct, setSelectedProduct] = useState<DetailedProduct | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const { addToList } = useProductList();

  const [filters, setFilters] = useState<FilterState>({
    search: "",
    categories: [],
    sortBy: "name",
    sortOrder: "asc",
    priceRange: [
      productsData.reduce((min, p) => Math.min(min, p.lp), Infinity),
      productsData.reduce((max, p) => Math.max(max, p.lp), -Infinity),
    ],
  });

  const modalRef = useRef<ProductDetailModalHandle>(null);
  const heroRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const allCategories = useMemo(() => {
    const categoriesSet = new Set<string>();
    productsData.forEach((product) => product.categories.forEach((cat) => categoriesSet.add(cat)));
    return Array.from(categoriesSet).sort();
  }, []);

  const filteredProducts = useMemo(() => {
    let filtered = productsData.filter(
      (product) =>
        (!filters.search ||
          product.name.toLowerCase().includes(filters.search.toLowerCase()) ||
          product.shortDescription.toLowerCase().includes(filters.search.toLowerCase())) &&
        (filters.categories.length === 0 || filters.categories.every((cat) => product.categories.includes(cat))) &&
        product.lp >= filters.priceRange[0] &&
        product.lp <= filters.priceRange[1]
    );

    return filtered.sort((a, b) => {
      let comp = 0;
      if (filters.sortBy === "name") comp = a.name.localeCompare(b.name);
      else if (filters.sortBy === "lp") comp = a.lp - b.lp;
      else if (filters.sortBy === "newest") comp = productsData.indexOf(b) - productsData.indexOf(a);
      return filters.sortOrder === "desc" ? -comp : comp;
    });
  }, [filters]);

  const handleProductClick = useCallback(
    (product: DetailedProduct) => {
      if (isAnimating) return;
      setSelectedProduct(product);
      setIsOpen(true);
      setIsAnimating(false);
    },
    [isAnimating]
  );

  const handleCloseModal = useCallback(() => {
    setIsOpen(false);
    setTimeout(() => {
      setSelectedProduct(null);
      const lenis = (window as any).lenis;
      if (lenis) {
        lenis.start();
        lenis.resize();
      }
    }, 100);
  }, []);

  const handleFiltersChange = useCallback((newFilters: FilterState) => setFilters(newFilters), []);
  const handleFAQToggle = useCallback(
    (index: number) => {
      setOpenFAQ(openFAQ === index ? null : index);
    },
    [openFAQ]
  );
  const handleAddToCart = useCallback(
    (product: DetailedProduct) => {
      if (isAnimating) return;
      addToList(product, 1);
    },
    [isAnimating, addToList]
  );

  // Адаптивные параметры анимаций под тиры
  const animConfig = useMemo(() => {
    if (tier === "low") {
      return {
        hero: { duration: 0.4, ease: "easeOut" },
        content: { duration: 0.3, ease: "easeOut" },
        stagger: 0,
      };
    } else if (tier === "medium") {
      return {
        hero: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
        content: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
        stagger: 0.05,
      };
    } else {
      return {
        hero: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] },
        content: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
        stagger: 0.08,
      };
    }
  }, [tier]);

  return (
    <div className="min-h-screen bg-gray-900 relative">
      <div className="fixed inset-0 z-0 bg-gray-950" />
      <SEO
        title="Продукты 4Life - Инновационные решения для здоровья"
        description="Полный каталог продуктов 4Life с Трансфер Факторами для поддержки иммунитета, хорошего самочувствия и активного долголетия."
        path="/products"
        type="website"
      />

      <section ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden z-10">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="absolute inset-0 w-full h-full object-cover z-0"
        >
          <source src={productsHeroVideo} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/40 z-10" />
        <div className="relative z-20 text-center text-white px-6 max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={animConfig.hero}>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">Каталог здоровья</h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
              Откройте для себя инновационные продукты 4Life с Трансфер Факторами
            </p>
            <motion.button
              whileHover={tier !== "low" ? { scale: 1.05 } : undefined}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-lg font-semibold transition-colors duration-300"
              onClick={() => window.scrollTo({ top: window.innerHeight, behavior: "smooth" })}
            >
              Исследовать продукты
            </motion.button>
          </motion.div>
        </div>
      </section>

      <section className="relative py-20 z-10">
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="mb-12" style={{ opacity: 1 }}>
            <ProductFilters
              categories={allCategories}
              onFiltersChange={handleFiltersChange}
              totalProducts={productsData.length}
              filteredCount={filteredProducts.length}
            />
          </div>
          <div style={{ opacity: 1 }}>
            <ProductCatalogGrid
              products={filteredProducts}
              onProductClick={handleProductClick}
              onAddToCart={handleAddToCart}
              dimmedCardId={null}
              isAnimating={isAnimating}
            />
          </div>
        </div>
      </section>

      <section className="relative py-20 z-10">
        <div className="relative max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={animConfig.content}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">Часто задаваемые вопросы</h2>
            <p className="text-xl text-white/70">Ответы на самые популярные вопросы о продуктах 4Life</p>
          </motion.div>
          <div className="space-y-4">
            {faqData.map((item, index) => (
              <FAQItem
                key={index}
                question={item.question}
                answer={item.answer}
                index={index}
                isOpen={openFAQ === index}
                onToggle={handleFAQToggle}
              />
            ))}
          </div>
        </div>
      </section>

      <ProductDetailModal
        ref={modalRef}
        product={selectedProduct}
        products={filteredProducts}
        isOpen={isOpen}
        onClose={handleCloseModal}
        hideImageInitially={tier === "high"}
      />
    </div>
  );
};

export default React.memo(ProductsPage);
