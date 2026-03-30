import { AuroraText } from "@/components/magicui/aurora-text";
import { FinalCTASection, MorphingVideoSection, PartnershipSection } from "@/components/sections";
import { Button, ParallaxSection } from "@/components/ui";
import { SEO } from "@/seo/SEO";
import { Icons } from "@/utils/icons";
import { motion } from "framer-motion";
import React, { lazy, Suspense } from "react";

// Media imports
import bg2Img from "@/assets/images/backgrounds/HomePage/2.jpg";
import renuvoImg from "@/assets/images/products/renuvo.webp";
import tfPlusImg from "@/assets/images/products/tf-plus.webp";
import tfTrifactorImg from "@/assets/images/products/tf-trifactor.webp";

import heroBgMobile from "@/assets/images/backgrounds/HomePage/bg-hero-Mobile.webp";
import heroBgPC from "@/assets/images/backgrounds/HomePage/bg-hero-PC.webp";
import heroVideoWebm from "@/assets/videos/backgrounds/HomePage/Hero-section/Why 4Life Transfer Factor®_.webm";

// --- LAZY LOADED COMPONENTS ---
const KineticProductCarousel = lazy(() => import("@/components/ui/KineticProductCarousel"));
const InteractiveProductCard = lazy(() => import("@/components/ui/InteractiveProductCard"));

// Варианты анимации для страницы
const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.5, ease: "easeInOut" } },
  exit: { opacity: 0, transition: { duration: 0.3, ease: "easeInOut" } },
};

// Определяем компонент HomePage
const HomePage: React.FC = () => {
  const GLOBAL_PARALLAX_STRENGTH = 40;

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
    <motion.div initial="initial" animate="animate" exit="exit" variants={pageVariants}>
      <SEO
        title="4Life с Александром Тощевым - Здоровье, Благополучие, Бизнес"
        description="Официальный сайт Александра Тощева: узнайте о продуктах 4Life для укрепления иммунитета, улучшения здоровья и возможностях партнерства для финансовой свободы."
        path="/"
        type="website"
        includeOrganizationAndPerson
        includeWebSiteSearch
      />

      <ParallaxSection
        backgroundVideo={heroVideoWebm}
        backgroundImageMobile={heroBgMobile}
        backgroundImagePC={heroBgPC}
        altText="Здоровье и благополучие с 4Life"
        height="h-screen"
        parallaxStrength={GLOBAL_PARALLAX_STRENGTH}
        contentClasses="flex flex-col items-center justify-center text-center py-8 pt-24"
        skipPreload={true}
      >
        <div className="max-w-4xl px-4 md:px-6 flex flex-col justify-between">
          <div className="mb-2 md:mb-4">
            <span className="px-3 py-1 md:px-4 md:py-1 bg-blue-600/30 text-blue-100 rounded-full text-xs md:text-sm font-medium border border-blue-400/30">
              Обучение вашего иммунитета
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 md:mb-6 mt-4 md:mt-0">
            <span className="block mb-1 md:mb-2">Раскройте потенциал своего здоровья</span>
            <span className="block mb-1 md:mb-2">
              <AuroraText colors={["#007BFF", "#60A5FA", "#FFFFFF", "#38BDF8"]} speed={1.5}>
                с научным подходом 4Life
              </AuroraText>
            </span>
          </h1>

          <p className="text-lg md:text-2xl text-white/90 mb-6 md:mb-10 leading-relaxed max-w-3xl mx-auto">
            Продукты 4Life Transfer Factor — это не просто добавка. Это интеллект для вашей иммунной системы, который
            помогает ей работать эффективнее.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 md:gap-5 justify-center items-center">
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
          </div>

          <div className="mt-10 md:mt-12 flex items-start justify-center text-white/70">
            <Icons.Microscope className="w-4 h-4 md:w-5 md:h-5 text-blue-300 mt-0.5 mr-0.5 md:mr-1" />
            <span className="text-xs md:text-sm">Научно доказанная эффективность с 1998 года</span>
          </div>
        </div>
      </ParallaxSection>

      <MorphingVideoSection />

      <section id="products">
        <ParallaxSection
          backgroundImage={bg2Img}
          lazyLoad={true}
          altText="Продукты 4Life для укрепления иммунитета"
          height="auto"
          parallaxStrength={GLOBAL_PARALLAX_STRENGTH}
          skipPreload={true}
        >
          <div className="py-12 sm:py-16">
            <div className="container max-w-7xl mx-auto px-6">
              <div className="opacity-100">
                <div className="flex justify-center mb-8">
                  <div className="h-1.5 w-[120px] bg-gradient-to-r from-blue-400 via-blue-300 to-blue-200 rounded-full shadow-sm shadow-blue-500/30 anti-pixel-snap"></div>
                </div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 text-center">
                  <span className="block mb-2 text-lg md:text-xl font-medium text-white">
                    Научный подход к вашему здоровью
                  </span>
                  <AuroraText colors={["#007BFF", "#FFFFFF", "#3B82F6", "#60A5FA"]} speed={1.3}>
                    Инновационные продукты для иммунитета
                  </AuroraText>
                </h2>
                <p className="text-xl text-white/90 mb-12 leading-relaxed max-w-2xl mx-auto text-center">
                  Откройте для себя целевые формулы 4Life Transfer Factor, разработанные для поддержки различных систем
                  организма — от сердечно-сосудистой до когнитивной функции. Каждый продукт создан для достижения
                  максимального результата.
                </p>
              </div>
            </div>
            <div className="container max-w-7xl mx-auto">
              <Suspense fallback={<div className="mt-12 h-[500px] w-full" />}>
                <div className="mt-12">
                  <div className="hidden lg:grid grid-cols-3 gap-8 px-6">
                    {popularProducts.map((product) => (
                      <div key={product.id}>
                        <InteractiveProductCard product={product} />
                      </div>
                    ))}
                  </div>
                  <div className="block lg:hidden -mx-6">
                    <KineticProductCarousel products={popularProducts} />
                  </div>
                </div>
              </Suspense>
              <div className="mt-16 mb-10 text-center px-6" style={{ contain: "layout style paint" }}>
                <Button
                  to="/products"
                  variant="secondary"
                  size="lg"
                  className="group bg-white/20 border-white/30 backdrop-blur-sm hover:bg-white/30 transition-colors duration-150"
                  icon={
                    <Icons.ArrowRight
                      className="w-5 h-5 relative z-10 transition-transform duration-150 group-hover:translate-x-1"
                      style={{ willChange: "transform" }}
                    />
                  }
                >
                  Посмотреть все
                </Button>
              </div>
            </div>
          </div>
        </ParallaxSection>
      </section>

      <PartnershipSection />

      <FinalCTASection />
    </motion.div>
  );
};

export default React.memo(HomePage);
