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
import { useEffectsDebug } from "@/hooks";
import { SEO } from "@/seo/SEO";
import { Icons } from "@/utils/icons";
import { motion, useScroll, useTransform } from "framer-motion";
import React, { lazy, Suspense, useEffect, useRef, useState } from "react";

// Media imports (real 4Life product bottle packshots + original HomePage backgrounds)
import showcaseOpticsImg from "@/assets/images/backgrounds/HomePage/2.webp";
import heroBgMobile from "@/assets/images/backgrounds/HomePage/bg-hero-Mobile.webp";
import heroBgPC from "@/assets/images/backgrounds/HomePage/bg-hero-PC.webp";
import renuvoBottleImg from "@/assets/images/products/renuvo.webp";
import tfPlusBottleImg from "@/assets/images/products/tf-plus.webp";
import tfTrifactorBottleImg from "@/assets/images/products/tf-trifactor.webp";

const ImmersiveProductShowcase = lazy(() => import("@/components/ui/ImmersiveProductShowcase"));

const HomePage: React.FC = () => {
  const efxFlags = useEffectsDebug();
  const [vh, setVh] = useState(800);

  const heroRef = useRef<HTMLDivElement>(null);
  const heroSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setVh(window.innerHeight);
  }, []);

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
      image: tfTrifactorBottleImg,
      link: "/products",
    },
    {
      id: 2,
      title: "Трансфер Фактор Плюс",
      description:
        "Помогает работе вашего иммунитета и поддерживает оптимальное здоровье, самочувствие и качество жизни",
      image: tfPlusBottleImg,
      link: "/products",
    },
    {
      id: 3,
      title: "Трансфер Фактор Ренуво",
      description:
        "Запатентованная адаптогенная формула для системного восстановления организма в условиях современного стресса",
      image: renuvoBottleImg,
      link: "/products",
    },
  ];

  return (
    <div className="relative">
      <SEO
        title="4Life с Александром Тощевым - Здоровье, Благополучие, Бизнес"
        description="Официальный сайт Александра Тощева: узнайте о продуктах 4Life для укрепления иммунитета, улучшения здоровья и возможностях партнерства."
        path="/"
        type="website"
        includeOrganizationAndPerson
        includeWebSiteSearch
      />

      <div ref={heroSectionRef} className="relative z-10 bg-[#03050a]">
        <ParallaxSection
          backgroundImageMobile={heroBgMobile}
          backgroundImagePC={heroBgPC}
          backgroundVideo="/videos/why-4life-transfer-factor.webm"
          altText="Здоровье и благополучие с 4Life"
          height="h-screen"
          imageBrightness="brightness-[.82]"
          contentClasses="flex flex-col items-center justify-center text-center py-8 pt-24"
          skipPreload={true}
          edgeFade={{ bottom: 140, colorDark: "#03050a" }}
        >
          {/* Balanced optical vignette: preserves glowing refraction ribs while guaranteeing razor-sharp white type */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-[#03050a]/65 via-[#03050a]/25 to-[#03050a]/80 z-0" />

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
                <motion.div
                  className="inline-flex items-center gap-3.5"
                  style={{ opacity: shouldAnimateHero ? heroContentOpacity : 1 }}
                >
                  <span className="w-7 h-px bg-cyan-400/80" aria-hidden="true" />
                  <span className="typography-label text-cyan-300/95 drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
                    Обучение вашего иммунитета
                  </span>
                  <span className="w-7 h-px bg-cyan-400/80" aria-hidden="true" />
                </motion.div>
              </div>

              <div data-entrance="title" className="w-full mb-10 md:mb-14">
                <motion.h1
                  className="typography-display font-syne text-center w-full drop-shadow-[0_0_30px_rgba(0,0,0,0.8)]"
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

      <section id="products" className="relative z-10 bg-[#03050a]">
        <ParallaxSection
          backgroundImage={showcaseOpticsImg}
          lazyLoad={true}
          altText="Продукты 4Life для укрепления иммунитета"
          height="auto"
          imageBrightness="brightness-[.62]"
          contentClasses="flex flex-col items-center justify-center w-full"
          edgeFade={{ top: 220, bottom: 220, colorDark: "#03050a" }}
        >
          <div className="relative py-24 sm:py-32 w-full">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 h-[420px] z-0"
              style={{
                backgroundImage:
                  "radial-gradient(ellipse 64% 62% at 50% 42%, rgba(3, 5, 10, 0.72) 0%, rgba(3, 5, 10, 0.32) 55%, transparent 100%)",
              }}
            />
            <div className="relative z-10 container max-w-7xl mx-auto w-full px-4 md:px-8">
              <div className="text-center mb-20">
                <p className="typography-label text-cyan-300/85 mb-4 drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
                  Научный подход к здоровью
                </p>
                <h2 className="typography-h1 text-white mb-5 leading-tight drop-shadow-[0_4px_24px_rgba(0,0,0,0.85)]">
                  <span className="bg-gradient-to-r from-cyan-300 via-sky-200 to-blue-300 bg-clip-text text-transparent">
                    Инновационные продукты
                  </span>
                  <span className="block font-light text-white mt-1">
                    для иммунитета
                  </span>
                </h2>
                <p className="text-lg text-slate-200/90 leading-relaxed max-w-xl mx-auto font-light drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
                  Целевые формулы 4Life Transfer Factor — от сердечно-сосудистой до когнитивной функции.
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

      <div className="relative z-10 bg-[#03050a]">
        <PartnershipSection />
        <FinalCTASection />
      </div>
    </div>
  );
};

export default React.memo(HomePage);