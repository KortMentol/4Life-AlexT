/**
 * @module src/pages/ProductsPage.tsx
 * @description Awwwards 2025. Финальная версия страницы продуктов.
 * Оркестрирует ProductHeroSlider (hoanghodev), ProductCatalogGrid с хореографией добавления в корзину (biazo)
 * и бесшовные переходы в ProductDetailModal (Codrops RepeatingImageTransition).
 * @author Kort
 * @version 5.2.0 - TypeScript fixes
 */

import { DetailedProduct, productsData } from "@/data/productsData";
import { SEO } from "@/seo/SEO";

import { FAQItem, ProductCatalogGrid, ProductDetailModal, ProductFilters } from "@/components/ui";
import type { ProductDetailModalHandle } from "@/components/ui/ProductDetailModal";
import type { FilterState } from "@/components/ui/ProductFilters";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

// ИСПРАВЛЕНИЕ 1: Импортируем useProductList
import { useProductList } from "@/hooks/useProductList";
import { getOptimizedImageUrl, optimizeAnimations, optimizeGSAP, preloadCriticalResources } from "@/utils/performance";

// Media imports
import productsHeroVideo from "@/assets/videos/backgrounds/ProductsPage/Hero-section/bg-video-ProductsPage.mp4";

const BACKGROUND_IMAGES = {
  stats:
    "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=1920&h=1080&fit=crop&crop=center&auto=format&q=80",
  filters:
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1920&h=1080&fit=crop&crop=center&auto=format&q=80",
  catalog:
    "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=1920&h=1080&fit=crop&crop=center&auto=format&q=80",
};

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.5, ease: "easeInOut" } },
  exit: { opacity: 0, transition: { duration: 0.3, ease: "easeInOut" } },
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const ProductsPage: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<DetailedProduct | null>(null);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [dimmedCardId, setDimmedCardId] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  // ИСПРАВЛЕНИЕ 1: Получаем addToList из правильного хука
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

  const pageRef = useRef<HTMLDivElement>(null);
  const catalogGridRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<ProductDetailModalHandle>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const heroRef = useRef<HTMLElement>(null);

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

  // Инициализация оптимизаций производительности
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    
    // Предзагрузка критических ресурсов
    preloadCriticalResources();

    // Оптимизация анимаций для слабых устройств
    if (isMobile) {
      optimizeAnimations();
    }

    // Оптимизация GSAP
    if (isMobile) {
      optimizeGSAP();
    }
  }, []);

  // Intersection Observer для паузы видео при скролле
  useEffect(() => {
    const video = videoRef.current;
    const hero = heroRef.current;

    if (!video || !hero) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Пользователь в зоне hero + 300px буфер - включаем видео
            video.play().catch(() => {});
          } else {
            // Пользователь за пределами зоны - ВСЕГДА пауза
            video.pause();
          }
        });
      },
      {
        threshold: 0,
        rootMargin: "300px 0px 300px 0px", // 300px буфер со всех сторон
      }
    );

    observer.observe(hero);

    return () => {
      observer.disconnect();
      video.pause();
    };
  }, []);

  const handleProductClick = useCallback(
    (product: DetailedProduct, element: HTMLDivElement) => {
      if (isAnimating) return;
      setIsAnimating(true);
      setSelectedProduct(product);

      const startImageEl = element.querySelector<HTMLElement>("[data-img-main]");
      const panel = modalRef.current?.getPanel();
      const panelImage = modalRef.current?.getPanelImage();
      const panelContent = modalRef.current?.getPanelContent();

      if (!startImageEl || !panel || !panelImage || !panelContent) {
        setIsAnimating(false);
        setSelectedProduct(null);
        return;
      }

      const config = {
        steps: parseInt(element.dataset.steps || "6", 10),
        stepDuration: parseFloat(element.dataset.stepDuration || "0.3"),
        pathMotion: element.dataset.pathMotion || "sine",
        sineAmplitude: parseFloat(element.dataset.sineAmplitude || "40"),
        stepInterval: parseFloat(element.dataset.stepInterval || "0.04"),
        moverEnterEase: element.dataset.moverEnterEase || "power2.in",
        moverExitEase: element.dataset.moverExitEase || "power3.out",
      };

      const startRect = startImageEl.getBoundingClientRect();
      const panelImageRect = panelImage.getBoundingClientRect();

      const path: { left: number; top: number; width: number; height: number }[] = [];
      for (let i = 0; i < config.steps; i++) {
        const t = (i + 1) / (config.steps + 1);
        const width = lerp(startRect.width, panelImageRect.width, t);
        const height = lerp(startRect.height, panelImageRect.height, t);
        const centerX = lerp(startRect.left + startRect.width / 2, panelImageRect.left + panelImageRect.width / 2, t);
        const centerY = lerp(startRect.top + startRect.height / 2, panelImageRect.top + panelImageRect.height / 2, t);
        const sineOffset = config.pathMotion === "sine" ? Math.sin(t * Math.PI) * config.sineAmplitude : 0;
        path.push({ left: centerX - width / 2, top: centerY - height / 2 + sineOffset, width, height });
      }

      const movers: HTMLElement[] = Array.from({ length: config.steps }, () => {
        const mover = document.createElement("div");
        mover.className = "repeating-image-mover";
        mover.style.backgroundImage = `url(${product.image})`;
        document.body.appendChild(mover);
        return mover;
      });

      const tl = gsap.timeline({
        onComplete: () => {
          movers.forEach((mover) => mover.remove());
          setIsAnimating(false);
        },
      });

      tl.set(element, { opacity: 0 });
      tl.set(panel, { opacity: 1, pointerEvents: "auto" });
      gsap.set(panelContent, { opacity: 0, y: 30 });

      movers.forEach((mover, i) => {
        const delay = i * config.stepInterval;
        tl.fromTo(
          mover,
          { ...path[i], opacity: 0, clipPath: "inset(100% 0% 0% 0%)" },
          {
            opacity: 1,
            clipPath: "inset(0% 0% 0% 0%)",
            duration: config.stepDuration,
            ease: config.moverEnterEase,
          },
          delay
        ).to(
          mover,
          {
            opacity: 0,
            clipPath: "inset(0% 0% 100% 0%)",
            duration: config.stepDuration,
            ease: config.moverExitEase,
          },
          delay + config.stepDuration * 0.7
        );
      });

      tl.fromTo(
        panelImage,
        { clipPath: "inset(100% 0% 0% 0%)" },
        { clipPath: "inset(0% 0% 0% 0%)", duration: config.stepDuration * 2, ease: "power3.out" },
        config.steps * config.stepInterval
      );

      tl.to(panelContent, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, "-=0.5");
    },
    [isAnimating]
  );

  const handleCloseModal = useCallback(() => {
    const panel = modalRef.current?.getPanel();
    const panelImage = modalRef.current?.getPanelImage();
    const panelContent = modalRef.current?.getPanelContent();

    if (!panel || !panelImage || !panelContent || isAnimating) return;

    setIsAnimating(true);
    gsap
      .timeline({
        onComplete: () => {
          gsap.set(panel, { opacity: 0, pointerEvents: "none" });
          gsap.to(`[data-product-id="${selectedProduct?.id}"]`, { opacity: 1, duration: 0.3 });
          setSelectedProduct(null);
          setIsAnimating(false);
        },
      })
      .to(panelContent, { opacity: 0, y: 30, duration: 0.3, ease: "power2.in" })
      .to(panelImage, { clipPath: "inset(100% 0% 0% 0%)", duration: 0.5, ease: "power3.in" }, 0);
  }, [isAnimating, selectedProduct]);

  const handleFiltersChange = useCallback((newFilters: FilterState) => setFilters(newFilters), []);

  const handleFAQToggle = useCallback((index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  }, [openFAQ]);

  const handleAddToCart = useCallback(
    (product: DetailedProduct, sourceElement: HTMLElement) => {
      if (isAnimating) return;

      setIsAnimating(true);
      setDimmedCardId(product.id);

      // Ищем ProductListIcon в хедере
      const headerCartButton = document.querySelector("[data-product-list-icon]") as HTMLElement;
      if (!headerCartButton) {
        setIsAnimating(false);
        setDimmedCardId(null);
        return;
      }

      const sourceRect = sourceElement.getBoundingClientRect();
      const cartRect = headerCartButton.getBoundingClientRect();

      const flyingElements: HTMLElement[] = Array.from({ length: 5 }, () => {
        const el = document.createElement("div");
        el.className = "repeating-image-mover";
        el.style.cssText = `
        width: 60px; height: 60px;
        background-image: url(${product.image});
        left: ${sourceRect.left + sourceRect.width / 2 - 30}px;
        top: ${sourceRect.top + sourceRect.height / 2 - 30}px; opacity: 1;
      `;
        document.body.appendChild(el);
        return el;
      });

      const tl = gsap.timeline({
        onComplete: () => {
          flyingElements.forEach((el) => el.remove());
          addToList(product, 1);
          setDimmedCardId(null);
          setIsAnimating(false);
        },
      });

      tl.to(`[data-product-id="${product.id}"]`, { scale: 1.03, duration: 0.4, ease: "power2.out" }, 0);

      tl.to(
        flyingElements,
        {
          x: cartRect.left - sourceRect.left - sourceRect.width / 2 + cartRect.width / 2,
          y: cartRect.top - sourceRect.top - sourceRect.height / 2 + cartRect.height / 2,
          scale: 0.1,
          opacity: 0,
          duration: 1.0,
          ease: "power3.in",
          stagger: 0.06,
        },
        0.1
      );

      tl.to(`[data-product-id="${product.id}"]`, { scale: 1, duration: 0.6, ease: "elastic.out(1, 0.6)" }, "+=0.2");
    },
    // ИСПРАВЛЕНИЕ 1: Добавляем addToList в зависимости
    [isAnimating, addToList]
  );

  return (
    <motion.div
      ref={pageRef}
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen bg-gray-900 relative"
      style={{ willChange: "transform", transform: "translateZ(0)" }}
    >
      <div
        className="fixed inset-0 z-0 opacity-20"
        style={{
          backgroundImage: `url(${BACKGROUND_IMAGES.catalog})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-gray-900/95 via-gray-900/90 to-gray-900/95" />
      <SEO
        title="Продукты 4Life - Инновационные решения для здоровья"
        description="Полный каталог продуктов 4Life с Трансфер Факторами для поддержки иммунитета, хорошего самочувствия и активного долголетия."
        path="/products"
        type="website"
      />

      {/* Предзагрузка критических ресурсов */}
      <link
        rel="preload"
        as="image"
        href={getOptimizedImageUrl("https://images.unsplash.com/photo-1559757148-5c350d0d3c56", 1920, 80)}
      />
      <link
        rel="preload"
        as="image"
        href={getOptimizedImageUrl("https://images.unsplash.com/photo-1518709268805-4e9042af2176", 1920, 80)}
      />


      {/* Hero Section with Video Background */}
      <section ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Video */}
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

        {/* Video Overlay */}
        <div className="absolute inset-0 bg-black/40 z-10" />

        {/* Hero Content */}
        <div className="relative z-20 text-center text-white px-6 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">Каталог здоровья</h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
              Откройте для себя инновационные продукты 4Life с Трансфер Факторами
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-lg font-semibold transition-colors duration-300"
              onClick={() => window.scrollTo({ top: window.innerHeight, behavior: "smooth" })}
            >
              Исследовать продукты
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Science & Innovation Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url(${getOptimizedImageUrl("https://images.unsplash.com/photo-1559757148-5c350d0d3c56", 1920, 80)})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 via-gray-900/95 to-purple-900/90" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-7xl font-bold text-white mb-6">Наука будущего</h2>
            <p className="text-xl md:text-2xl text-white/80 max-w-4xl mx-auto leading-relaxed">
              Трансфер факторы — революционная технология передачи иммунной информации между клетками
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {[
              {
                title: "Распознавание",
                description: "Обучают иммунную систему распознавать потенциальные угрозы",
                icon: "🔍",
                delay: 0,
              },
              {
                title: "Реагирование",
                description: "Помогают организму быстро и эффективно отвечать на вызовы",
                icon: "⚡",
                delay: 0.2,
              },
              {
                title: "Запоминание",
                description: "Сохраняют иммунную память для будущей защиты",
                icon: "🧠",
                delay: 0.4,
              },
            ].map((item) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: item.delay, duration: 0.6, ease: "easeOut" }}
                whileHover={window.innerWidth >= 768 ? { scale: 1.05, y: -10 } : {}}
                whileTap={window.innerWidth < 768 ? { scale: 0.98 } : {}}
                className="group relative p-8 bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 hover:border-cyan-400/50 transition-all duration-300"
                style={{ 
                  willChange: window.innerWidth < 768 ? 'transform' : 'auto',
                  contain: window.innerWidth < 768 ? 'layout style paint' : 'none'
                }}
              >
                <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">{item.icon}</div>
                <h3 className="text-2xl font-bold text-white mb-4">{item.title}</h3>
                <p className="text-white/70 leading-relaxed">{item.description}</p>
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </motion.div>
            ))}
          </div>

          {/* Interactive Stats */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {[
              { label: "Продуктов", value: productsData.length, suffix: "+" },
              { label: "Лет исследований", value: 25, suffix: "+" },
              { label: "Патентов", value: 82, suffix: "" },
              { label: "Стран", value: 50, suffix: "+" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8 + index * 0.1, duration: 0.5, ease: "backOut" }}
                whileHover={window.innerWidth >= 768 ? { scale: 1.1 } : {}}
                whileTap={window.innerWidth < 768 ? { scale: 0.95 } : {}}
                className="text-center p-6 bg-gradient-to-br from-white/10 to-white/5 rounded-2xl border border-white/20 hover:border-cyan-400/50 transition-all duration-200"
              >
                <div className="text-4xl font-bold text-cyan-400 mb-2">
                  {stat.value}
                  {stat.suffix}
                </div>
                <div className="text-white/80 text-sm uppercase tracking-wider">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Technology Showcase Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage: `url(${getOptimizedImageUrl("https://images.unsplash.com/photo-1518709268805-4e9042af2176", 1920, 80)})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-gray-900/95 via-blue-900/90 to-gray-900/95" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h2 className="text-5xl md:text-6xl font-bold text-white mb-8">
                Трай-Фактор™
                <span className="block text-cyan-400">Формула</span>
              </h2>
              <p className="text-xl text-white/80 mb-8 leading-relaxed">
                Уникальная комбинация трансфер факторов из коровьего молозива и куриного желтка, защищенная патентами
                США и подтвержденная независимыми исследованиями.
              </p>

              <div className="space-y-6">
                {[
                  { title: "УльтраФактор XF", desc: "Из коровьего молозива" },
                  { title: "ОвоФактор", desc: "Из куриного желтка" },
                  { title: "Низкомолекулярные фракции", desc: "Дополнительная поддержка" },
                ].map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                    className="flex items-center space-x-4 p-4 bg-white/5 rounded-xl border border-white/10"
                  >
                    <div className="w-3 h-3 bg-cyan-400 rounded-full" />
                    <div>
                      <div className="text-white font-semibold">{item.title}</div>
                      <div className="text-white/60 text-sm">{item.desc}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              whileInView={{ opacity: 1, x: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative"
            >
              <div className="relative p-8 bg-gradient-to-br from-white/10 to-white/5 rounded-3xl border border-white/20 backdrop-blur-sm">
                <div className="text-center mb-8">
                  <div className="text-6xl font-bold text-cyan-400 mb-2">283%</div>
                  <div className="text-white/80">Увеличение активности NK-клеток</div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "IgA антитела", value: "+73%" },
                    { label: "Иммунный ответ", value: "100%" },
                    { label: "Безопасность", value: "FDA" },
                    { label: "Патенты", value: "17+" },
                  ].map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5 + index * 0.1, duration: 0.4 }}
                      className="text-center p-4 bg-white/5 rounded-xl"
                    >
                      <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                      <div className="text-white/60 text-xs">{stat.label}</div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Floating elements */}
              <motion.div
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-4 -right-4 w-20 h-20 bg-cyan-400/20 rounded-full blur-xl"
              />
              <motion.div
                animate={{ y: [10, -10, 10] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-4 -left-4 w-16 h-16 bg-blue-400/20 rounded-full blur-xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Products Catalog Section */}
      <section className="relative py-20">
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage: `url(${BACKGROUND_IMAGES.catalog})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/90 via-gray-900/80 to-gray-900/95" />

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">Каталог продуктов</h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              Инновационные решения для поддержки иммунной системы и общего здоровья
            </p>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12"
          >
            <ProductFilters
              categories={allCategories}
              onFiltersChange={handleFiltersChange}
              totalProducts={productsData.length}
              filteredCount={filteredProducts.length}
            />
          </motion.div>

          {/* Products Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <ProductCatalogGrid
              ref={catalogGridRef}
              products={filteredProducts}
              onProductClick={handleProductClick}
              onAddToCart={handleAddToCart}
              dimmedCardId={dimmedCardId}
              isAnimating={isAnimating}
            />
          </motion.div>
        </div>
      </section>

      {/* Quality Assurance Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url(${getOptimizedImageUrl("https://images.unsplash.com/photo-1582719471384-894fbb16e074", 1920, 80)})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-bl from-green-900/90 via-gray-900/95 to-blue-900/90" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-7xl font-bold text-white mb-6">Гарантия качества</h2>
            <p className="text-xl md:text-2xl text-white/80 max-w-4xl mx-auto leading-relaxed">
              Каждый продукт проходит строжайший контроль качества и соответствует международным стандартам
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "cGMP",
                subtitle: "Стандарты производства",
                description: "Соблюдение правил надлежащей производственной практики",
                icon: "🏭",
                color: "from-green-500/20 to-emerald-500/20",
              },
              {
                title: "NSF",
                subtitle: "Независимый аудит",
                description: "Подтверждение качества от NSF International",
                icon: "✅",
                color: "from-blue-500/20 to-cyan-500/20",
              },
              {
                title: "FDA",
                subtitle: "Справочник врача",
                description: "Продукты входят в Physicians' Desk Reference",
                icon: "📋",
                color: "from-purple-500/20 to-violet-500/20",
              },
              {
                title: "100%",
                subtitle: "Контроль партий",
                description: "Анализ качества каждой выпускаемой партии",
                icon: "🔬",
                color: "from-orange-500/20 to-red-500/20",
              },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30, rotateY: -15 }}
                whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6, ease: "easeOut" }}
                whileHover={window.innerWidth >= 768 ? { scale: 1.05, rotateY: 5 } : {}}
                whileTap={window.innerWidth < 768 ? { scale: 0.98 } : {}}
                className="group relative p-8 bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 hover:border-white/30 transition-all duration-300"
                style={{ 
                  willChange: window.innerWidth < 768 ? 'transform' : 'auto',
                  transformStyle: window.innerWidth >= 768 ? "preserve-3d" : 'flat',
                  contain: window.innerWidth < 768 ? 'layout style paint' : 'none'
                }}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${item.color} rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                />

                <div className="relative z-10">
                  <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-2">{item.title}</h3>
                  <h4 className="text-lg font-semibold text-cyan-400 mb-4">{item.subtitle}</h4>
                  <p className="text-white/70 leading-relaxed">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Quality Process */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-20 p-8 bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10"
          >
            <h3 className="text-3xl font-bold text-white text-center mb-12">Процесс контроля качества</h3>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { step: "01", title: "Идентификация", desc: "Проверка каждого ингредиента" },
                { step: "02", title: "Чистота", desc: "Анализ на отсутствие примесей" },
                { step: "03", title: "Эффективность", desc: "Тестирование активности" },
                { step: "04", title: "Состав", desc: "Соблюдение формулы" },
              ].map((item, index) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {item.step}
                  </div>
                  <h4 className="text-xl font-semibold text-white mb-2">{item.title}</h4>
                  <p className="text-white/70">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="relative py-20">
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: `url(${getOptimizedImageUrl("https://images.unsplash.com/photo-1576091160399-112ba8d25d1f", 1920, 80)})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-gray-900/95 via-blue-900/90 to-gray-900/95" />

        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">Часто задаваемые вопросы</h2>
            <p className="text-xl text-white/70">Ответы на самые популярные вопросы о продуктах 4Life</p>
          </motion.div>

          <div className="space-y-4">
            {[
              {
                question: "Что такое трансфер факторы?",
                answer:
                  "Трансфер факторы — это пептидные цепи из 40-44 аминокислот, которые переносят иммунную информацию между клетками. Они обучают иммунную систему распознавать, отвечать и запоминать потенциальные угрозы здоровью.",
              },
              {
                question: "Как принимать продукты 4Life?",
                answer:
                  "Рекомендации по применению указаны на каждом продукте. Обычно это 1-3 капсулы в день во время еды, запивая стаканом воды. Продолжительность приема — 1 месяц, при необходимости можно повторить.",
              },
              {
                question: "Есть ли противопоказания?",
                answer:
                  "Продукты 4Life являются биологически активными добавками к пище и не являются лекарственными средствами. Перед применением рекомендуется проконсультироваться с врачом, особенно при беременности, кормлении грудью и наличии хронических заболеваний.",
              },
              {
                question: "Какие исследования подтверждают эффективность?",
                answer:
                  "Продукты 4Life прошли множество независимых исследований. Например, исследования показали увеличение активности NK-клеток до 283% и рост антител IgA на 73%. Продукты ежегодно входят в американский справочник врача (PDR).",
              },
              {
                question: "Можно ли совмещать разные продукты 4Life?",
                answer:
                  "Да, продукты 4Life разработаны для совместного применения и дополняют друг друга. Например, ПРО-ТФ отлично сочетается с 4LifeTransform Бёрн для управления весом и улучшения состава тела.",
              },
            ].map((item, index) => (
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
        // ИСПРАВЛЕНИЕ 2: Удаляем ненужный проп isOpen
        onClose={handleCloseModal}
      />
    </motion.div>
  );
};

export default React.memo(ProductsPage);
