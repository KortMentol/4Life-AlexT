/**
 * @module src/pages/AboutPage.tsx
 * @description Immersive Garden 2026 - О компании 4Life
 * Профессиональная страница с адаптацией под все устройства и тиры производительности
 * @author Kort
 * @version 2.0.0
 */

import { SEO } from "@/seo/SEO";
import { motion, useScroll, useTransform } from "framer-motion";
import React, { useRef } from "react";
import { usePerformanceTier, useIsMobile } from "@/hooks";
import { Button } from "@/components/ui";
import { Icons } from "@/utils/icons";

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.5, ease: "easeInOut" } },
  exit: { opacity: 0, transition: { duration: 0.3, ease: "easeInOut" } },
};

const AboutPage: React.FC = () => {
  const tier = usePerformanceTier();
  const isMobile = useIsMobile();
  const heroRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  // Параллакс только для desktop high/medium tier
  const shouldAnimate = !isMobile && tier !== "low";
  const heroY = useTransform(
    scrollYProgress,
    [0, 1],
    shouldAnimate ? ["0%", "30%"] : ["0%", "0%"],
  );
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.3]);

  const features = [
    {
      icon: Icons.Award,
      title: "Научные исследования",
      description:
        "Более 25 лет инвестиций в научные разработки и клинические испытания продуктов с Трансфер Факторами.",
    },
    {
      icon: Icons.Globe,
      title: "Глобальное присутствие",
      description:
        "Продукция 4Life доступна в более чем 50 странах мира, помогая миллионам людей укреплять здоровье.",
    },
    {
      icon: Icons.Shield,
      title: "Качество и безопасность",
      description:
        "Производство по стандартам cGMP с многоступенчатым контролем качества на каждом этапе.",
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
        title="О 4Life - Наука, Миссия и Инновации | Александр Тощев"
        description="Узнайте о научном подходе 4Life к здоровью и благополучию. Инновационные продукты с Трансфер Факторами для укрепления иммунитета с 1998 года."
        path="/about"
        type="website"
      />

      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative min-h-[70vh] flex items-center justify-center overflow-hidden"
      >
        {/* Background Image with Parallax */}
        <motion.div
          className="absolute inset-0 z-0"
          style={{ y: heroY, opacity: heroOpacity }}
        >
          <div
            className="w-full h-full bg-cover bg-center"
            style={{
              backgroundImage:
                "url(https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2070&auto=format&fit=crop)",
              filter: "brightness(0.4)",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-white dark:to-black" />
        </motion.div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 py-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Наука на службе
              <br />
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                вашего здоровья
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              С 1998 года компания 4Life исследует иммунную систему, создавая
              продукты, которые помогают организму работать эффективнее
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 md:py-32 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Миссия 4Life
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Мы верим, что каждый человек заслуживает жить полной, здоровой
              жизнью. Наша миссия — предоставлять научно обоснованные решения
              для поддержки иммунной системы, помогая людям достигать
              оптимального здоровья и благополучия.
            </p>
          </motion.div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={tier !== "low" ? { y: -8 } : {}}
                className="p-8 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border border-gray-200 dark:border-gray-700"
              >
                <feature.icon
                  className="w-12 h-12 text-blue-600 dark:text-cyan-400 mb-6"
                  strokeWidth={1.5}
                />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* History Section */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                История инноваций
              </h2>
              <div className="space-y-6 text-gray-600 dark:text-gray-300 leading-relaxed">
                <p>
                  В 1998 году основатели 4Life открыли революционный способ
                  извлечения Трансфер Факторов из молозива коров и яичного
                  желтка. Эта технология стала основой для создания уникальных
                  продуктов, которые помогают иммунной системе работать умнее.
                </p>
                <p>
                  Сегодня 4Life — это глобальная компания с
                  научно-исследовательским центром, собственным производством и
                  командой ученых, которые продолжают исследовать возможности
                  Трансфер Факторов.
                </p>
                <p>
                  Каждый продукт проходит строгий контроль качества и
                  соответствует международным стандартам cGMP, гарантируя
                  безопасность и эффективность.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?q=80&w=2070&auto=format&fit=crop"
                  alt="Научная лаборатория 4Life"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-blue-600 to-cyan-600 dark:from-blue-900 dark:to-cyan-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Готовы узнать больше?
            </h2>
            <p className="text-xl text-white/90 mb-10 leading-relaxed">
              Свяжитесь со мной, и я расскажу о научном подходе 4Life и помогу
              подобрать продукты для ваших целей
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                to="/contact"
                variant="secondary"
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100 dark:bg-gray-900 dark:text-cyan-400 dark:hover:bg-gray-800"
                icon={<Icons.MessageCircle className="w-5 h-5" />}
              >
                Получить консультацию
              </Button>
              <Button
                to="/products"
                variant="secondary"
                size="lg"
                className="bg-white/10 border-white/30 hover:bg-white/20"
                icon={<Icons.ArrowRight className="w-5 h-5" />}
              >
                Изучить продукты
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
};

export default React.memo(AboutPage);
