/**
 * @module src/pages/HomePage.tsx
 * @description Главная страница в стиле "Clinical Obsidian" с оркестровкой входа 2026.
 * ИСПРАВЛЕНИЯ:
 * 1. [Hero CTA Contrast]: Нижний edgeFade скорректирован с 250px до 120px, а центральный
 *    оверлей видео ослаблен до via-black/20. Кнопки больше не тонут в темноте и считываются
 *    на 100% четко с первого взгляда.
 * 2. [Seamless Transition Intact]: Переход между Hero и MorphingVideo остается абсолютно бесшовным
 *    за счет встречного верхнего 250px фейда в MorphingVideoSection.
 * @author Kort & AI
 * @version 5.2.0
 */

import { AuroraText } from "@/components/magicui/aurora-text";
import { FinalCTASection, MorphingVideoSection, PartnershipSection } from "@/components/sections";
import { PageEntrance } from "@/components/transitions/PageEntrance";
import { Button, ParallaxSection } from "@/components/ui";
import { useEffectsDebug, usePerformanceTier } from "@/hooks";
import { SEO } from "@/seo/SEO";
import { Icons } from "@/utils/icons";
import { motion, useScroll, useTransform } from "framer-motion";
import React, { lazy, Suspense, useEffect, useRef, useState } from "react";

// Media imports
import bg2Img from "@/assets/images/backgrounds/HomePage/2.webp";
import renuvoImg from "@/assets/images/products/MobileVersions/Mobile_renuvo.webp";
import tfPlusImg from "@/assets/images/products/MobileVersions/Mobile_tf-plus.webp";
import tfTrifactorImg from "@/assets/images/products/MobileVersions/Mobile_tf-trifactor.webp";

import heroBgMobile from "@/assets/images/backgrounds/HomePage/bg-hero-Mobile.webp";
import heroBgPC from "@/assets/images/backgrounds/HomePage/bg-hero-PC.webp";

const heroVideoWebm = "/videos/why-4life-transfer-factor.webm";

const ImmersiveProductShowcase = lazy(() => import("@/components/ui/ImmersiveProductShowcase"));

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.5, ease: "easeInOut" } },
  exit: { opacity: 0, transition: { duration: 0.3, ease: "easeInOut" } },
};

const HomePage: React.FC = () => {
  const efxFlags = useEffectsDebug();
  const [vh, setVh] = useState(800);
  const currentTier = usePerformanceTier();
  const [tier, setTier] = useState<string>("medium");

  const heroRef = useRef<HTMLDivElement>(null);
  const heroSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setVh(window.innerHeight);
    setTier(currentTier);
  }, [currentTier]);

  const { scrollY } = useScroll();

  const shouldAnimateHero = efxFlags.heroScrollAnimation;

  const rawY = useTransform(scrollY, [0, vh], [0, vh * 0.2]);
  const heroContentY = useTransform(rawY, (latest) => {
    if (!shouldAnimateHero) return "0px";
    return `${latest}px`;
  });

  const heroContentOpacity = useTransform(scrollY, [0, vh * 0.65], [1, 0]);

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
        description="Официальный сайт Александра Тощева: узнайте о продуктах 4Life для укрепления иммунитета, улучшения здоровья и возможностях партнерства."
        path="/"
        type="website"
        includeOrganizationAndPerson
        includeWebSiteSearch
      />

      <div ref={heroSectionRef}>
        <ParallaxSection
          backgroundVideo={heroVideoWebm}
          backgroundImageMobile={heroBgMobile}
          backgroundImagePC={heroBgPC}
          altText="Здоровье и благополучие с 4Life"
          height="h-screen"
          contentClasses="flex flex-col items-center justify-center text-center py-8 pt-24"
          skipPreload={true}
          edgeFade={{ bottom: 120, colorDark: "#03050a" }} // 120px не достает до кнопок, но мягко гасит видео
        >
          {/* Сбалансированный оверлей: чистый верх/низ и прозрачный центр для кнопок */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/80 via-black/20 to-black/70 z-0" />

          <PageEntrance className="relative z-10 w-full max-w-5xl mx-auto px-4 md:px-6 flex flex-col justify-center items-center h-full">
            <motion.div
              ref={heroRef}
              className="flex flex-col justify-center items-center w-full"
              style={{
                y: heroContentY,
                willChange: "transform",
              }}
            >
              <div data-entrance="badge" className="mb-8 md:mb-10">
                <motion.span
                  className={`inline-flex items-center px-5 py-2 rounded-full border border-white/15 bg-white/5 text-[10px] md:text-xs font-bold tracking-[0.2em] text-white uppercase shadow-[0_4px_24px_rgba(0,0,0,0.5)] ${tier !== "low" ? "backdrop-blur-md" : ""}`}
                  style={{ opacity: shouldAnimateHero ? heroContentOpacity : 1 }}
                >
                  Обучение вашего иммунитета
                </motion.span>
              </div>

              <div data-entrance="title" className="w-full mb-10 md:mb-14">
                <motion.h1
                  className="typography-display text-center w-full drop-shadow-[0_0_30px_rgba(0,0,0,0.8)]"
                  style={{ opacity: shouldAnimateHero ? heroContentOpacity : 1 }}
                >
                  Раскройте потенциал своего здоровья{" "}
                  <AuroraText colors={["#00ffff", "#3b82f6", "#ffffff", "#8b5cf6"]} speed={1.5}>
                    с научным подходом 4Life
                  </AuroraText>
                </motion.h1>
              </div>

              <div
                data-entrance="buttons"
                className="flex flex-col sm:flex-row gap-4 md:gap-5 justify-center items-center w-full mt-4"
              >
                <motion.div
                  className="flex flex-col sm:flex-row gap-4 md:gap-5 justify-center items-center w-full"
                  style={{ opacity: shouldAnimateHero ? heroContentOpacity : 1 }}
                >
                  <Button
                    to="/products"
                    variant="primary"
                    size="lg"
                    className="w-[85vw] max-w-[280px] sm:w-auto sm:max-w-none shadow-[0_10px_30px_rgba(0,212,255,0.15)]"
                    icon={<Icons.ArrowRight className="w-5 h-5 transition-transform duration-300" />}
                  >
                    Каталог здоровья
                  </Button>

                  <Button
                    to="/how-to-buy"
                    variant="secondary"
                    size="lg"
                    className="w-[85vw] max-w-[280px] sm:w-auto sm:max-w-none shadow-[0_10px_30px_rgba(0,0,0,0.3)]"
                    icon={<Icons.Info className="w-5 h-5 transition-transform duration-300" />}
                  >
                    Как приобрести
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </PageEntrance>
        </ParallaxSection>
      </div>

      <div className="relative">
        <MorphingVideoSection />
      </div>

      <section id="products">
        <ParallaxSection
          backgroundImage={bg2Img}
          lazyLoad={true}
          altText="Продукты 4Life для укрепления иммунитета"
          height="auto"
          edgeFade={{ top: 250, bottom: 250, colorDark: "#03050a" }}
        >
          <div className="py-24 sm:py-32">
            <div className="container max-w-7xl mx-auto px-6">
              <div className="text-center mb-20">
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-white/60 mb-4">
                  Научный подход к здоровью
                </p>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-5 leading-tight">
                  <span className="bg-gradient-to-r from-cyan-400 via-blue-300 to-blue-400 bg-clip-text text-transparent drop-shadow-md">
                    Инновационные продукты
                  </span>
                  <span className="block text-white/90">для иммунитета</span>
                </h2>
                <p className="text-lg text-white/70 leading-relaxed max-w-xl mx-auto font-light">
                  Целевые формулы 4Life Transfer Factor — от сердечно-сосудистой до когнитивной функции.
                </p>
              </div>
            </div>

            <div className="container max-w-7xl mx-auto">
              <Suspense fallback={<div className="h-[480px] w-full" />}>
                <div className="px-20">
                  <ImmersiveProductShowcase products={popularProducts} />
                </div>
              </Suspense>

              <div className="mt-20 mb-8 text-center px-6">
                <Button
                  to="/products"
                  variant="secondary"
                  size="lg"
                  className="group"
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

      <PartnershipSection />
      <FinalCTASection />
    </motion.div>
  );
};

export default React.memo(HomePage);
