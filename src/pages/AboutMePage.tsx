/**
 * @module src/pages/AboutMePage.tsx
 * @description Immersive Garden 2026 - Личная страница дистрибьютора
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

const AboutMePage: React.FC = () => {
  const tier = usePerformanceTier();
  const isMobile = useIsMobile();
  const heroRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const shouldAnimate = !isMobile && tier !== "low";
  const heroY = useTransform(scrollYProgress, [0, 1], shouldAnimate ? ["0%", "25%"] : ["0%", "0%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.4]);

  const values = [
    {
      icon: Icons.Heart,
      title: "Здоровье",
      description: "Верю, что здоровье — это основа счастливой и полноценной жизни каждого человека.",
    },
    {
      icon: Icons.Users,
      title: "Помощь людям",
      description: "Моя цель — делиться знаниями и помогать другим обретать здоровье и благополучие.",
    },
    {
      icon: Icons.TrendingUp,
      title: "Развитие",
      description: "Постоянно учусь и совершенствуюсь, чтобы предоставлять лучшую поддержку своим клиентам.",
    },
  ];

  return (
    <motion.div initial="initial" animate="animate" exit="exit" variants={pageVariants}>
      <SEO
        title="Обо мне - Александр Тощев | Независимый Дистрибьютор 4Life"
        description="Александр Тощев - независимый дистрибьютор 4Life. Мой путь к здоровью и как я помогаю другим улучшить качество жизни с помощью продуктов 4Life."
        path="/about-me"
        type="website"
      />

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-[75vh] flex items-center justify-center overflow-hidden">
        <motion.div
          className="absolute inset-0 z-0"
          style={{ y: heroY, opacity: heroOpacity }}
        >
          <div
            className="w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: "url(https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=2099&auto=format&fit=crop)",
              filter: "brightness(0.35)",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-white dark:to-black" />
        </motion.div>

        <div className="relative z-10 container mx-auto px-4 py-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="mb-6">
              <span className="px-4 py-2 bg-blue-600/30 text-blue-100 rounded-full text-sm font-medium border border-blue-400/30">
                Александр Тощев
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Помогаю людям
              <br />
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                обретать здоровье
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Независимый дистрибьютор 4Life. Объясняю сложное простым языком и помогаю найти путь к благополучию
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 md:py-32 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="order-2 lg:order-1"
            >
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                Моя история
              </h2>
              <div className="space-y-6 text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                <p>
                  Всё началось с моего собственного пути к здоровью. Столкнувшись с проблемами самочувствия, я начал искать натуральные способы укрепления организма. Так я открыл для себя 4Life и Трансфер Факторы, которые изменили мою жизнь.
                </p>
                <p>
                  Увидев потрясающие результаты на себе, я понял, что должен делиться этим знанием с другими. Теперь я помогаю людям обрести здоровье, энергию и улучшить качество жизни с помощью инновационных продуктов 4Life.
                </p>
                <p>
                  Я не врач и не продавец. Я — предприниматель, который создает партнерскую программу по просвещению о молекулах иммунитета. Моя задача — объяснить простым языком, как работают Трансфер Факторы и как они могут помочь вам.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="order-1 lg:order-2"
            >
              <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1974&auto=format&fit=crop"
                  alt="Александр Тощев"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Мои ценности
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Принципы, которыми я руководствуюсь в работе
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={tier !== "low" ? { y: -8 } : {}}
                className="p-8 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border border-gray-200 dark:border-gray-700 text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-6">
                  <value.icon className="w-8 h-8 text-blue-600 dark:text-cyan-400" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 md:py-32 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Почему я это делаю
            </h2>
            <div className="space-y-6 text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              <p>
                Я верю, что каждый заслуживает жить полной, здоровой и счастливой жизнью. Моя миссия — помогать людям обретать здоровье через образование и качественные продукты 4Life.
              </p>
              <p>
                Со мной способные становятся способнее. Я помогаю не только клиентам, но и врачам, докторам наук, объясняя сложные вещи простым языком.
              </p>
              <p>
                Присоединяйтесь ко мне в этом путешествии к лучшей версии себя. Вместе мы сможем достичь невероятных результатов и создать сообщество здоровых и счастливых людей.
              </p>
            </div>
          </motion.div>
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
              Готовы начать свой путь?
            </h2>
            <p className="text-xl text-white/90 mb-10 leading-relaxed">
              Свяжитесь со мной, и я помогу вам сделать первый шаг к здоровью и благополучию
            </p>
            <Button
              to="/contact"
              variant="secondary"
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100 dark:bg-gray-900 dark:text-cyan-400 dark:hover:bg-gray-800"
              icon={<Icons.MessageCircle className="w-5 h-5" />}
            >
              Связаться со мной
            </Button>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
};

export default React.memo(AboutMePage);
