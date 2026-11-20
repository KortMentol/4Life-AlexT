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

import { FinalCTASection, MorphingVideoSection } from "@/components/sections";
import PartnershipPreview from "@/components/sections/PartnershipPreview";
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

  const shouldAnimateHero = efxFlags.heroScrollAnimation && currentTier === "high";

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
      description: "Формула Transfer Factor. Состав и формат выпуска — в карточке продукта.",
      image: tfTrifactorImg,
      link: "/products",
    },
    {
      id: 2,
      title: "Трансфер Фактор Плюс",
      description:
        "Состав с трансфер-факторами и растительными компонентами для повседневного рациона.",
      image: tfPlusImg,
      link: "/products",
    },
    {
      id: 3,
      title: "Трансфер Фактор Ренуво",
      description:
        "Формула 4Life для повседневного рациона. Подробности — в составе и актуальной маркировке.",
      image: renuvoImg,
      link: "/products",
    },
  ];

  return (
    <motion.div initial="initial" animate="animate" exit="exit" variants={pageVariants}>
      <SEO
        title="4Life с Александром Тощевым — каталог и порядок заказа"
        description="Сайт независимого дистрибьютора: информация о формулах 4Life, составе продуктов, порядке оформления заказа и партнёрской программе."
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
                willChange: shouldAnimateHero ? "transform" : "auto",
              }}
            >
              <div data-entrance="badge" className="mb-8 md:mb-10">
                <motion.span
                  className={`inline-flex items-center px-5 py-2 rounded-full border border-white/15 bg-white/5 text-[10px] md:text-xs font-bold tracking-[0.2em] text-white uppercase shadow-[0_4px_24px_rgba(0,0,0,0.5)] ${tier !== "low" ? "backdrop-blur-md" : ""}`}
                  style={{ opacity: shouldAnimateHero ? heroContentOpacity : 1 }}
                >
                  4Life · формулы · информация · выбор
                </motion.span>
              </div>

              <div data-entrance="title" className="w-full mb-10 md:mb-14">
                <motion.h1
                  className="typography-display text-center w-full drop-shadow-[0_0_30px_rgba(0,0,0,0.8)]"
                  style={{ opacity: shouldAnimateHero ? heroContentOpacity : 1 }}
                >
                  Здоровье начинается с ясного выбора.
                  <span className="block text-cyan-300">Формулы 4Life — понятным языком.</span>
                </motion.h1>
              </div>

              <p data-entrance="lead" className="typography-lead mx-auto mb-8 max-w-2xl text-center text-white/80">
                Составы, история компании и порядок заказа — спокойно, ясно и в одном месте.
              </p>

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
          contentClasses="flex flex-col items-center justify-center w-full"
          edgeFade={{ top: 250, bottom: 250, colorDark: "#03050a" }}
        >
          <div className="py-24 sm:py-32 w-full">
            <div className="container max-w-7xl mx-auto w-full px-4 md:px-8">
              <div className="text-center mb-20">
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-white/60 mb-4">
                  Каталог формул 4Life
                </p>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-5 leading-tight">
                  <span className="bg-gradient-to-r from-cyan-400 via-blue-300 to-blue-400 bg-clip-text text-transparent drop-shadow-md">
                    Разные формулы.
                  </span>
                  <span className="block text-white/90">Состав — в центре внимания.</span>
                </h2>
                <p className="text-lg text-white/70 leading-relaxed max-w-xl mx-auto font-light">
                  В карточках — состав, формат выпуска и сведения по каждой формуле.
                </p>
              </div>
            </div>

            <div className="container max-w-7xl mx-auto w-full px-4 md:px-8">
              <Suspense fallback={<div className="h-[480px] w-full" />}>
                <ImmersiveProductShowcase products={popularProducts} />
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

      <PartnershipPreview />
      <FinalCTASection />
    </motion.div>
  );
};

export default React.memo(HomePage);
