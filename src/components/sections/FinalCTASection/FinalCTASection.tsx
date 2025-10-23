/**
 * @module src/components/sections/FinalCTASection/FinalCTASection.tsx
 * @description Awwwards-уровень финальная CTA секция с параллакс фоном в sci-fi стиле будущего.
 * Использует ParallaxSection с фоновым изображением и центрированным контентом.
 * @author Kort
 * @version 1.0.0
 * @usage
 * 1. src/pages/HomePage.tsx - Финальная секция 5 после PartnershipSection для призыва к действию
 * @example
 * <FinalCTASection />
 */

import { AuroraText } from "@/components/magicui/aurora-text";
import { Button, ParallaxSection } from "@/components/ui";
import { Icons } from "@/utils/icons";
import React, { useMemo } from "react";

// Импорт фонового изображения
import bg5Img from "@/assets/images/backgrounds/HomePage/5.jpg";

// Проверка на мобильное устройство
const isMobile = () => window.innerWidth < 768;

const FinalCTASection: React.FC = () => {
  // Мемоизируем проверку мобильного устройства
  const isOnMobile = useMemo(() => isMobile(), []);

  // Отключаем параллакс на мобильных для производительности
  const PARALLAX_STRENGTH = isOnMobile ? 0 : 40;

  return (
    <ParallaxSection
      backgroundImage={bg5Img}
      altText="Готовы сделать первый шаг к здоровью"
      height="h-[120vh]"
      parallaxStrength={PARALLAX_STRENGTH}
      contentClasses="flex flex-col items-center justify-center text-center py-24"
      imageBrightness="brightness-[.4] dark:brightness-[.3]"
    >
      <div className="container max-w-7xl mx-auto px-6 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Декоративная линия */}
          <div className="flex justify-center mb-8">
            <div
              className="h-1.5 w-[120px] rounded-full shadow-sm"
              style={{
                background: "linear-gradient(90deg, #0ea5e9, #06b6d4, #0ea5e9)",
                // Убираем тяжелые тени на мобильных
                boxShadow: isOnMobile ? "none" : "0 0 20px rgba(14, 165, 233, 0.4)",
              }}
            ></div>
          </div>

          {/* Заголовок */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            <span className="block mb-2">Готовы сделать</span>
            <AuroraText colors={["#0ea5e9", "#FFFFFF", "#06b6d4", "#38BDF8"]} speed={1.4}>
              первый шаг?
            </AuroraText>
          </h2>

          {/* Подзаголовок */}
          <h3
            className="text-xl md:text-2xl font-medium mb-8"
            style={{
              background: "linear-gradient(90deg, #0ea5e9, #06b6d4, #0ea5e9)",
              backgroundSize: "200% 100%",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              // Отключаем анимацию и эффекты на мобильных
              animation: isOnMobile ? "none" : "gradient-shift 6s ease-in-out infinite",
              textShadow: isOnMobile ? "none" : "0 0 20px rgba(14, 165, 233, 0.3)",
              filter: isOnMobile ? "none" : "drop-shadow(0 0 8px rgba(14, 165, 233, 0.2))",
            }}
          >
            Ваше преображение начинается здесь
          </h3>

          {/* Основной текст */}
          <p className="text-lg md:text-xl text-white/90 mb-12 leading-relaxed max-w-3xl mx-auto">
            Получите персональную консультацию, и я помогу вам понять, как продукты 4Life могут стать частью вашей
            истории успеха, подобрав оптимальные решения и объяснив все нюансы.
          </p>

          {/* Кнопки CTA */}
          <div className="flex flex-col sm:flex-row justify-center gap-6 items-center">
            <Button
              to="/contact"
              variant="primary"
              size="lg"
              className="from-cyan-600 to-blue-600 shadow-xl !px-4 sm:!px-8"
              icon={<Icons.MessageCircle className="w-5 h-5" />}
            >
              Получить консультацию
            </Button>

            <Button
              to="/products"
              variant="secondary"
              size="lg"
              className="bg-white/10 border-white/30 backdrop-blur-sm !px-[2.5rem] sm:!px-8"
              icon={<Icons.ArrowRight className="w-5 h-5" />}
            >
              Изучить продукты
            </Button>
          </div>

          {/* Дополнительная информация */}
          <div className="mt-12 flex flex-col md:flex-row items-center justify-center text-white/70 gap-3 md:gap-0">
            <div className="flex items-center justify-center w-12 h-12 md:w-auto md:h-auto rounded-full bg-cyan-500/10 md:bg-transparent border border-cyan-400/30 md:border-0 backdrop-blur-sm md:backdrop-blur-0">
              <Icons.Shield className="w-5 h-5 md:mr-2 text-cyan-300" />
            </div>
            <span className="text-sm md:text-base text-center md:text-left">Присоединяйтесь к миллионам людей в 50+ странах мира</span>
          </div>
        </div>
      </div>
    </ParallaxSection>
  );
};

export default React.memo(FinalCTASection);
