/**
 * @module src/components/sections/PartnershipSection/PartnershipSection.tsx
 * @description Awwwards-уровень секция о партнерстве с 4Life в sci-fi стиле будущего.
 * Использует параллакс фон из плиток, ScrollText эффекты и футуристичный дизайн.
 * @author Kort
 * @version 2.0.0
 * @usage
 * 1. src/pages/HomePage.tsx - Секция 4 между MorphingVideoSection и финальной CTA секцией
 * @example
 * <PartnershipSection />
 */

import { Button, ScrollNumber } from "@/components/ui";
import ScrollText from "@/components/ui/ScrollText";
import { usePerformanceTier } from "@/hooks/usePerformanceTier";
import { Icons } from "@/utils/icons";
import React, { useEffect, useMemo, useRef } from "react";

// Проверка на мобильное устройство
const isMobile = () => window.innerWidth < 768;

const PartnershipSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const block1Ref = useRef<HTMLDivElement>(null);
  const block2Ref = useRef<HTMLDivElement>(null);
  const block3Ref = useRef<HTMLDivElement>(null);
  const tier = usePerformanceTier();

  // Мемоизируем проверку мобильного устройства
  const isOnMobile = useMemo(() => isMobile(), []);

  useEffect(() => {
    // Отключаем параллакс на мобильных для производительности
    if (isOnMobile) return;

    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const scrolled = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);

      let strength = 60;
      if (tier === "medium") strength = 30;
      if (tier === "low") strength = 0;

      const yPos = (scrolled - 0.5) * strength;
      const bg = sectionRef.current.querySelector(".parallax-bg") as HTMLElement;
      if (bg) {
        bg.style.transform = `translate3d(0, ${yPos}%, 0)`;
      }
    };

    let ticking = false;
    const optimizedScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", optimizedScroll, { passive: true });
    return () => window.removeEventListener("scroll", optimizedScroll);
  }, [isOnMobile, tier]);

  return (
    <section ref={sectionRef} className="relative min-h-[300vh] overflow-hidden bg-transparent">
      {/* Параллакс фон - плитки как у MorphingVideoSection */}
      <div className="absolute inset-0 -z-30 overflow-hidden">
        <div
          className="parallax-bg absolute inset-0 w-full"
          style={{
            height: "calc(100% + 200px)",
            top: "-100px",
            transform: "translate3d(0, 0, 0)",
            willChange: "transform",
            backfaceVisibility: "hidden",
            contain: window.innerWidth < 768 ? "layout style paint" : "none",
          }}
        >
          <div
            className="w-full h-full bg-repeat opacity-100 dark:opacity-0 transition-opacity duration-500"
            style={{
              backgroundImage: `url(/images/backgrounds/light-pattern.webp)`,
              backgroundSize: "400px 400px",
              filter: "brightness(0.9) contrast(1.05)",
            }}
          />
          {/* ПК версия темного фона */}
          <div
            className="absolute inset-0 w-full h-full bg-repeat opacity-0 dark:opacity-100 transition-opacity duration-500 hidden md:block"
            style={{
              backgroundImage: `url(/images/backgrounds/dark-pattern.png)`,
              backgroundSize: "400px 400px",
              filter: "brightness(0.6) contrast(1.1)",
            }}
          />
          {/* Мобильная версия темного фона (светлее на 10%) */}
          <div
            className="absolute inset-0 w-full h-full bg-repeat opacity-0 dark:opacity-100 transition-opacity duration-500 block md:hidden"
            style={{
              backgroundImage: `url(/images/backgrounds/dark-pattern.png)`,
              backgroundSize: "400px 400px",
              filter: "brightness(0.7) contrast(1.1)",
            }}
          />
        </div>
      </div>

      {/* Заголовок секции */}
      <div className="relative z-30 px-4 pt-24 pb-12 text-center">
        <div className="mx-auto max-w-4xl">
          <h2
            className="mb-4 text-sm font-medium uppercase tracking-[0.2em]"
            style={{
              background: "linear-gradient(90deg, #0ea5e9, #06b6d4, #0ea5e9)",
              backgroundSize: "200% 100%",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              // Убираем анимацию на мобильных
              animation: isOnMobile ? "none" : "gradient-shift 6s ease-in-out infinite",
              // Упрощаем эффекты на мобильных
              textShadow: isOnMobile ? "none" : "0 0 20px rgba(14, 165, 233, 0.3)",
              filter: isOnMobile ? "none" : "drop-shadow(0 0 8px rgba(14, 165, 233, 0.2))",
            }}
          >
            Возможности • Развитие • Сообщество
          </h2>
          <h3
            className="mb-8 text-4xl font-semibold md:text-6xl"
            style={{
              background: "linear-gradient(135deg, #1e293b 0%, #334155 30%, #475569 60%, #1e293b 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              // Убираем тени на мобильных
              filter: isOnMobile ? "none" : "drop-shadow(0 0 2px rgba(59, 130, 246, 0.4))",
              position: "relative",
              lineHeight: "1.2",
              paddingBottom: "0.1em",
            }}
          >
            Путь к новым горизонтам
          </h3>
          <ScrollText className="mx-auto max-w-4xl text-lg leading-relaxed">
            Откройте для себя мир возможностей, где ваша страсть к здоровому образу жизни становится источником дохода и
            личностного роста. Присоединяйтесь к глобальному сообществу единомышленников.
          </ScrollText>
        </div>
      </div>

      <div className="relative">
        {/* Блок 01 - Возможности */}
        <div ref={block1Ref} className="relative">
          <div className="sticky top-0 z-20 flex h-screen items-center justify-center">
            <div className="container mx-auto px-4 md:px-8 max-w-6xl">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-3 order-2 lg:order-1">
                  <ScrollNumber
                    number="01"
                    className="text-[8rem] md:text-[12rem] lg:text-[16rem] font-thin leading-none"
                  />
                </div>
                <div className="lg:col-span-9 order-1 lg:order-2 space-y-6">
                  <h4
                    className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-light leading-tight"
                    style={{
                      background: "linear-gradient(135deg, #1e293b 0%, #334155 50%, #1e293b 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      filter: isOnMobile ? "none" : "drop-shadow(0 0 1px rgba(59, 130, 246, 0.3))",
                      position: "relative",
                    }}
                  >
                    Дополнительные источники дохода
                  </h4>
                  <ScrollText className="text-base md:text-lg lg:text-xl leading-relaxed text-gray-600 dark:text-cyan-300 max-w-4xl">
                    Дополнительные источники дохода открываются перед теми, кто готов делиться знаниями о здоровье. Это
                    не просто продажи — это миссия помочь людям обрести лучшую версию себя, получая за это достойное
                    вознаграждение.
                  </ScrollText>
                </div>
              </div>
            </div>
          </div>
          <div className="relative z-10 min-h-[100vh]"></div>
        </div>

        {/* Блок 02 - Развитие */}
        <div ref={block2Ref} className="relative">
          <div className="sticky top-0 z-20 flex h-screen items-center justify-center">
            <div className="container mx-auto px-4 md:px-8 max-w-6xl">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-9 order-1 space-y-6 text-right">
                  <h4
                    className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-light leading-tight"
                    style={{
                      background: "linear-gradient(135deg, #1e293b 0%, #334155 50%, #1e293b 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      filter: isOnMobile ? "none" : "drop-shadow(0 0 1px rgba(59, 130, 246, 0.3))",
                      position: "relative",
                    }}
                  >
                    Личностный рост и экспертность
                  </h4>
                  <ScrollText className="text-base md:text-lg lg:text-xl leading-relaxed text-gray-600 dark:text-cyan-300 max-w-4xl ml-auto">
                    Погружение в мир здорового образа жизни становится частью вашего личностного роста. Изучение
                    принципов питания, иммунитета, биохимии организма расширяет горизонты и формирует экспертность в
                    области, которая всегда будет актуальна.
                  </ScrollText>
                </div>
                <div className="lg:col-span-3 order-2 flex justify-end lg:justify-center xl:justify-end">
                  <ScrollNumber
                    number="02"
                    className="text-[8rem] md:text-[12rem] lg:text-[16rem] font-thin leading-none lg:translate-x-8"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="relative z-10 min-h-[100vh]"></div>
        </div>

        {/* Блок 03 - Сообщество */}
        <div ref={block3Ref} className="relative">
          <div className="sticky top-0 z-20 flex h-screen items-center justify-center">
            <div className="container mx-auto px-4 md:px-8 max-w-6xl">
              <div className="text-center space-y-8">
                <ScrollNumber
                  number="03"
                  className="text-[10rem] md:text-[16rem] lg:text-[20rem] font-thin leading-none"
                />
                <div className="space-y-6">
                  <h4
                    className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-light leading-tight max-w-4xl mx-auto"
                    style={{
                      background: "linear-gradient(135deg, #1e293b 0%, #334155 50%, #1e293b 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      filter: isOnMobile ? "none" : "drop-shadow(0 0 1px rgba(59, 130, 246, 0.3))",
                      position: "relative",
                    }}
                  >
                    Сообщество единомышленников
                  </h4>
                  <ScrollText className="text-base md:text-lg lg:text-xl leading-relaxed text-gray-600 dark:text-cyan-300 max-w-4xl mx-auto">
                    Вокруг вас формируется круг единомышленников — людей, которые ценят качество жизни и стремятся к
                    совершенству. Это не просто бизнес-партнеры, это команда, которая поддерживает друг друга на пути к
                    общим целям.
                  </ScrollText>
                </div>
              </div>
            </div>
          </div>
          <div className="relative z-10 min-h-[100vh]"></div>
        </div>

        {/* Пространство после секции */}
        <div className="h-[36vh] lg:h-[45vh]"></div>
      </div>

      {/* CTA секция */}
      <div className="relative z-30 px-4 py-24 text-center">
        <div className="mx-auto max-w-4xl">
          <h3
            className="mb-8 text-3xl font-semibold md:text-4xl"
            style={{
              background: "linear-gradient(135deg, #1e293b 0%, #334155 50%, #1e293b 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter: isOnMobile ? "none" : "drop-shadow(0 0 1px rgba(59, 130, 246, 0.3))",
            }}
          >
            Готовы узнать о возможностях?
          </h3>
          <ScrollText className="mx-auto mb-12 max-w-3xl text-lg leading-relaxed">
            Узнайте, как стать частью глобального сообщества 4Life и открыть для себя новые горизонты развития и дохода.
          </ScrollText>

          <Button
            to="/partnership"
            variant="primary"
            size="lg"
            className="from-cyan-600 to-blue-600 shadow-lg"
            icon={<Icons.Users className="w-5 h-5" />}
          >
            <span className="hidden sm:inline">Узнать о возможностях партнерства</span>
            <span className="inline sm:hidden">Узнать о партнерстве</span>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default React.memo(PartnershipSection);
