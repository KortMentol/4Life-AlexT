import { productsData } from "@/data/productsData";
import { SEO } from "@/seo/SEO";
import { Icons } from "@/utils/icons";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { isEqual } from "lodash"; // <-- Установите lodash, если еще не установлен: npm install lodash @types/lodash
import React, { useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { containerVariants } from "../animations/variants";
import Button from "../components/ui/Button";
import CategoryFilter from "../components/ui/CategoryFilter";
import { AnimatedGridPattern } from "../components/ui/GridPattern";
import ProductDetailView from "../components/ui/ProductDetailView";
import ProductGridCard from "../components/ui/ProductGridCard";
import Section from "../components/ui/Section";
import SectionHeading from "../components/ui/SectionHeading";

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.5, ease: "easeInOut" } },
  exit: { opacity: 0, transition: { duration: 0.3, ease: "easeInOut" } },
};

const heroTextVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.03 } },
};

const charVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.2, 0.65, 0.3, 0.9] } },
};

const ProductsPage: React.FC = () => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [, setSearchParams] = useSearchParams();
  const pageRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({ target: pageRef, offset: ["start start", "end end"] });
  const filterOpacity = useTransform(scrollYProgress, [0, 0.15], [0, 1]);
  const filterY = useTransform(scrollYProgress, [0, 0.15], [50, 0]);

  const allCategories = useMemo(() => {
    const categoriesSet = new Set<string>();
    productsData.forEach((product) => product.categories.forEach((cat) => categoriesSet.add(cat)));
    return Array.from(categoriesSet).sort();
  }, []);

  const filteredProducts = useMemo(() => {
    if (selectedCategories.length === 0) return productsData;
    return productsData.filter((product) => selectedCategories.every((cat) => product.categories.includes(cat)));
  }, [selectedCategories]);

  // [NEW] Логика для "умных" фильтров
  const disabledCategories = useMemo(() => {
    if (selectedCategories.length === 0) return [];

    const currentProductIds = new Set(filteredProducts.map((p) => p.id));

    return allCategories.filter((cat) => {
      if (selectedCategories.includes(cat)) return false; // Активные фильтры не могут быть неактивными

      const newSelection = [...selectedCategories, cat];
      const potentialProducts = productsData.filter((p) => newSelection.every((c) => p.categories.includes(c)));

      // Деактивируем, если результат будет пустым ИЛИ если результат не изменится
      if (potentialProducts.length === 0) return true;

      const potentialProductIds = new Set(potentialProducts.map((p) => p.id));
      if (isEqual(currentProductIds, potentialProductIds)) return true;

      return false;
    });
  }, [selectedCategories, filteredProducts, allCategories]);

  const toggleCategory = (category: string) => {
    if (disabledCategories.includes(category) && !selectedCategories.includes(category)) return;
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const clearSelection = () => setSelectedCategories([]);
  const handleCardClick = (productId: string) => setSearchParams({ product: productId }, { replace: true });

  const heroTitle = "Протоколы Иммунитета";

  return (
    <motion.div ref={pageRef} initial="initial" animate="animate" exit="exit" variants={pageVariants}>
      <SEO
        title="Продукты 4Life - Каталог для иммунитета и здоровья"
        description="Полный каталог инновационных продуктов 4Life с Трансфер Факторами."
        path="/products"
        type="website"
      />

      <section className="relative h-screen flex items-center justify-center text-center overflow-hidden bg-gray-900">
        <AnimatedGridPattern />
        <div className="relative z-10 p-4">
          <motion.h1
            variants={heroTextVariants}
            initial="hidden"
            animate="visible"
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-white"
            aria-label={heroTitle}
          >
            {heroTitle.split("").map((char, index) => (
              <motion.span key={index} variants={charVariants} className="inline-block">
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-6 text-lg md:text-xl max-w-2xl mx-auto text-gray-300"
          >
            Научно разработанные формулы для калибровки и поддержки вашей иммунной системы.
          </motion.p>
        </div>
      </section>

      <Section background="dark" spacing="none" className="py-24 relative">
        <div className="container mx-auto max-w-7xl px-4">
          <motion.div style={{ opacity: filterOpacity, y: filterY }}>
            <CategoryFilter
              categories={allCategories}
              selected={selectedCategories}
              toggleCategory={toggleCategory}
              clearSelection={clearSelection}
              // disabledCategories={disabledCategories} // Передаем неактивные категории
            />
          </motion.div>

          <motion.div
            key={selectedCategories.join("-")}
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10 mt-12"
          >
            <AnimatePresence>
              {filteredProducts.map((product) => (
                <ProductGridCard key={product.id} product={product} onClick={() => handleCardClick(product.id)} />
              ))}
            </AnimatePresence>
          </motion.div>

          {filteredProducts.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16 text-gray-500"
            >
              <p className="text-xl font-medium">Продукты не найдены</p>
              <p className="mt-2">Попробуйте изменить или сбросить фильтры.</p>
            </motion.div>
          )}
        </div>
      </Section>

      <Section background="dark" spacing="xl" className="border-t border-white/5">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <SectionHeading
              title="Нужна помощь в выборе?"
              subtitle="Персональный подход"
              description="Каждый организм уникален. Я помогу вам подобрать программу, которая будет отвечать именно вашим целям и потребностям. Свяжитесь со мной для бесплатной консультации."
              align="left"
              titleClassName="text-white"
              subtitleClassName="text-cyan-400"
              withLine={true}
              lineColor="blue"
            />
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8"
            >
              <Button to="/contact" variant="primary" size="lg" icon={<Icons.Send />}>
                Получить консультацию
              </Button>
            </motion.div>
          </div>
          <div className="hidden md:block">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <img
                src="/src/assets/images/brand/4life-logo-light.svg"
                alt="Science"
                className="w-full h-auto opacity-10"
              />
            </motion.div>
          </div>
        </div>
      </Section>

      <ProductDetailView />
    </motion.div>
  );
};

export default ProductsPage;
