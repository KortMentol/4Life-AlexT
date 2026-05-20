import { AuroraText } from "@/components/magicui/aurora-text";
import {
  FinalCTASection,
  MorphingVideoSection,
  PartnershipSection,
} from "@/components/sections";
import { Button, ParallaxSection } from "@/components/ui";
import { usePerformanceTier } from "@/hooks";
import { SEO } from "@/seo/SEO";
import { Icons } from "@/utils/icons";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import React, { lazy, Suspense, useRef } from "react";

// Media imports
import bg2Img from "@/assets/images/backgrounds/HomePage/2.jpg";
import renuvoImg from "@/assets/images/products/MobileVersions/Mobile_renuvo.webp";
import tfPlusImg from "@/assets/images/products/MobileVersions/Mobile_tf-plus.webp";
import tfTrifactorImg from "@/assets/images/products/MobileVersions/Mobile_tf-trifactor.webp";

import heroBgMobile from "@/assets/images/backgrounds/HomePage/bg-hero-Mobile.webp";
import heroBgPC from "@/assets/images/backgrounds/HomePage/bg-hero-PC.webp";
import heroVideoWebm from "@/assets/videos/backgrounds/HomePage/Hero-section/Why 4Life Transfer Factor®_.webm";

// --- LAZY LOADED COMPONENTS ---
const ImmersiveProductShowcase = lazy(
  () => import("@/components/ui/ImmersiveProductShowcase"),
);

// Определяем тач один раз
const IS_TOUCH =
  typeof window !== "undefined"
    ? "ontouchstart" in window || navigator.maxTouchPoints > 0
    : false;

// Варианты анимации для страницы
const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.5, ease: "easeInOut" } },
  exit: { opacity: 0, transition: { duration: 0.3, ease: "easeInOut" } },
};

// Stagger-анимация для Hero элементов при входе
const heroItemVariants = {
  hidden: { opacity: 0, y: 28, filter: "blur(4px)" },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.9,
      delay: 0.1 + i * 0.12,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

// Определяем компонент HomePage
const HomePage: React.FC = () => {
  const tier = usePerformanceTier();
  const heroRef = useRef<HTMLDivElement>(null);
  const heroSectionRef = useRef<HTMLDivElement>(null);

  // Scroll-driven: Hero контент уплывает вверх при скролле
  // Только на desktop high/medium — на touch и low статика
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  // Когда Hero уходит за экран — MotionValues замораживаются, RAF освобождается
  const heroInView = useInView(heroSectionRef, { once: false, margin: "0px" });

  const shouldAnimate = !IS_TOUCH && tier !== "low";
  // Если Hero не виден — передаём статичные значения чтобы Framer Motion не тикал
  const heroContentY = useTransform(
    heroScroll,
    [0, 1],
    shouldAnimate && heroInView ? ["0%", "18%"] : ["0%", "0%"],
  );
  const heroContentOpacity = useTransform(
    heroScroll,
    [0, 0.65],
    shouldAnimate && heroInView ? [1, 0] : [1, 1],
  );

  const popularProducts = [
    {
      id: 1,
      title: "Трай-Фактор Формула",
      description:
        "Революционное достижение науки о трансферцевтиках, поднимает здоровье иммунной системы на новый уровень",
      image: tfPlusImg,
      link: "/products",
    },
    {
      id: 2,
      title: "Трансфер Фактор Плюс",
      description:
        "Помогает работе вашего иммунитета и поддерживает оптимальное здоровье, самочувствие и качество жизни",
      image: tfTrifactorImg,
      link: "/products",
    },
    {
      id: 3,
      title: "Трансфер Фактор Ренуво",
      description:
        "Запатентованная адаптогенная формула для системного восстановления организма в условиях современного стресса",
      image: renuvoImg,
      link: "/products",
    },
  ];

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
    >
      <SEO
        title="4Life с Александром Тощевым - Здоровье, Благополучие, Бизнес"
        description="Официальный сайт Александра Тощева: узнайте о продуктах 4Life для укрепления иммунитета, улучшения здоровья и возможностях партнерства для финансовой свободы."
        path="/"
        type="website"
        includeOrganizationAndPerson
        includeWebSiteSearch
      />

      {/* Вертикальная навигация по секциям убрана — на главной есть header */}

      <div ref={heroSectionRef}>
        <ParallaxSection
          backgroundVideo={heroVideoWebm}
          backgroundImageMobile={heroBgMobile}
          backgroundImagePC={heroBgPC}
          altText="Здоровье и благополучие с 4Life"
          height="h-screen"
          contentClasses="flex flex-col items-center justify-center text-center py-8 pt-24"
          skipPreload={true}
          edgeFade={{
            bottom: 140,
            colorLight: "#ffffff",
            colorDark: "#000000",
          }}
        >
          {/* Scroll-driven wrapper: весь контент уплывает вверх при скролле */}
          <motion.div
            ref={heroRef}
            className="max-w-4xl px-4 md:px-6 flex flex-col justify-between"
            style={{ y: heroContentY, opacity: heroContentOpacity }}
          >
            {/* Badge — появляется первым */}
            <motion.div
              className="mb-2 md:mb-4"
              variants={heroItemVariants}
              initial="hidden"
              animate="visible"
              custom={0}
            >
              <span className="px-3 py-1 md:px-4 md:py-1 bg-blue-600/30 text-blue-100 rounded-full text-xs md:text-sm font-medium border border-blue-400/30">
                Обучение вашего иммунитета
              </span>
            </motion.div>

            {/* H1 — появляется вторым */}
            <motion.h1
              className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 md:mb-6 mt-4 md:mt-0"
              variants={heroItemVariants}
              initial="hidden"
              animate="visible"
              custom={1}
            >
              <span className="block mb-1 md:mb-2">
                Раскройте потенциал своего здоровья
              </span>
              <span className="block mb-1 md:mb-2">
                <AuroraText
                  colors={["#007BFF", "#60A5FA", "#FFFFFF", "#38BDF8"]}
                  speed={1.5}
                >
                  с научным подходом 4Life
                </AuroraText>
              </span>
            </motion.h1>

            {/* Subtitle — третьим */}
            <motion.p
              className="text-lg md:text-2xl text-white/90 mb-6 md:mb-10 leading-relaxed max-w-3xl mx-auto"
              variants={heroItemVariants}
              initial="hidden"
              animate="visible"
              custom={2}
            >
              Продукты 4Life Transfer Factor — это не просто добавка. Это
              интеллект для вашей иммунной системы, который помогает ей работать
              эффективнее.
            </motion.p>

            {/* Кнопки — четвёртыми */}
            <motion.div
              className="flex flex-col sm:flex-row gap-3 md:gap-5 justify-center items-center"
              variants={heroItemVariants}
              initial="hidden"
              animate="visible"
              custom={3}
            >
              <Button
                to="/products"
                variant="primary"
                size="lg"
                className="group from-blue-600 to-blue-500 shadow-lg min-w-[245px] sm:min-w-0"
                icon={
                  <Icons.ArrowRight className="w-4 h-4 md:w-5 md:h-5 transition-transform duration-300 group-hover:translate-x-1" />
                }
              >
                Каталог здоровья
              </Button>

              <Button
                to="/how-to-buy"
                variant="secondary"
                size="lg"
                className="group bg-white/10 border-white/30 min-w-[245px] sm:min-w-0"
                icon={
                  <Icons.ShoppingCart className="w-4 h-4 md:w-5 md:h-5 transition-all duration-300 group-hover:rotate-12" />
                }
              >
                Как приобрести
              </Button>
            </motion.div>

            {/* Trust line — последней */}
            <motion.div
              className="mt-10 md:mt-12 flex items-start justify-center text-white/70"
              variants={heroItemVariants}
              initial="hidden"
              animate="visible"
              custom={4}
            >
              <Icons.Microscope className="w-4 h-4 md:w-5 md:h-5 text-blue-300 mt-0.5 mr-0.5 md:mr-1" />
              <span className="text-xs md:text-sm">
                Научно доказанная эффективность с 1998 года
              </span>
            </motion.div>
          </motion.div>
        </ParallaxSection>
      </div>

      {/* Стык 1: Hero → MorphingVideo — двусторонняя вуаль */}

      {/* MorphingVideoSection */}
      <div className="relative">
        <MorphingVideoSection />
      </div>

      <section id="products">
        <ParallaxSection
          backgroundImage={bg2Img}
          lazyLoad={true}
          altText="Продукты 4Life для укрепления иммунитета"
          height="auto"
          edgeFade={{
            top: 160,
            bottom: 150,
            colorLight: "#ffffff",
            colorDark: "#030712",
          }}
        >
          <div className="py-16 sm:py-20">
            <div className="container max-w-7xl mx-auto px-6">
              {/* Section header */}
              <div className="text-center mb-14">
                <span className="section-accent-line" />
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-white/60 mb-4">
                  Научный подход к здоровью
                </p>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-5 leading-tight">
                  <span className="bg-gradient-to-r from-cyan-400 via-blue-300 to-blue-400 bg-clip-text text-transparent">
                    Инновационные продукты
                  </span>
                  <span className="block text-white/90">для иммунитета</span>
                </h2>
                <p className="text-lg text-white/70 leading-relaxed max-w-xl mx-auto font-light">
                  Целевые формулы 4Life Transfer Factor — от сердечно-сосудистой
                  до когнитивной функции.
                </p>
              </div>
            </div>

            <div className="container max-w-7xl mx-auto">
              <Suspense fallback={<div className="h-[480px] w-full" />}>
                {/* px-20 даёт место для разлёта боковых карточек */}
                <div className="px-20">
                  <ImmersiveProductShowcase products={popularProducts} />
                </div>
              </Suspense>

              <div className="mt-14 mb-8 text-center px-6">
                <Button
                  to="/products"
                  variant="secondary"
                  size="lg"
                  className="group bg-white/15 border-white/25 backdrop-blur-sm hover:bg-white/25 rounded-full"
                  icon={
                    <Icons.ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
                  }
                >
                  Весь каталог
                </Button>
              </div>
            </div>
          </div>
        </ParallaxSection>
      </section>

      {/* Стык 3: Products → Partnership — вуаль внутри Products (fadeBottom) */}

      <PartnershipSection />

      <FinalCTASection />
    </motion.div>
  );
};

export default React.memo(HomePage);
