/**
 * @module src/pages/PartnershipPage.tsx
 * @description Immersive Garden 2026 - Партнерство с 4Life
 * Профессиональная страница без тяжелых библиотек, с адаптацией под все устройства
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

const PartnershipPage: React.FC = () => {
  const tier = usePerformanceTier();
  const isMobile = useIsMobile();
  const heroRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const shouldAnimate = !isMobile && tier !== "low";
  const heroY = useTransform(scrollYProgress, [0, 1], shouldAnimate ? ["0%", "30%"] : ["0%", "0%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.3]);

  const benefits = [
    {
      icon: Icons.DollarSign,
      title: "Стабильный доход",
      description: "Создайте пассивный доход через систему многоуровневого маркетинга с выплатами до 64%",
    },
    {
      icon: Icons.Clock,
      title: "Гибкий график",
      description: "Работайте когда удобно, без жесткого графика и привязки к офису. Полная свобода действий",
    },
    {
      icon: Icons.Award,
      title: "Профессиональный рост",
      description: "Обучение и развитие навыков лидерства, продаж и управления командой от опытных наставников",
    },
    {
      icon: Icons.Users,
      title: "Глобальное сообщество",
      description: "Станьте частью международной команды единомышленников в 50+ странах мира",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Свяжитесь со мной",
      description: "Напишите мне в удобный мессенджер, и я расскажу о возможностях партнерства с 4Life",
    },
    {
      number: "02",
      title: "Пройдите обучение",
      description: "Получите доступ к обучающим материалам и поддержке опытных наставников",
    },
    {
      number: "03",
      title: "Начните развивать бизнес",
      description: "Стройте свою команду и получайте доход от продаж и рекомендаций",
    },
  ];

  return (
    <motion.div initial="initial" animate="animate" exit="exit" variants={pageVariants}>
      <SEO
        title="Партнерство 4Life - Стать частью команды Александра Тощева"
        description="Узнайте о возможностях партнерства с 4Life и Александром Тощевым. Стабильный доход, профессиональный рост и поддержка опытного лидера."
        path="/partnership"
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
              backgroundImage: "url(https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop)",
              filter: "brightness(0.4)",
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
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Путь к новым
              <br />
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                горизонтам
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Откройте для себя мир, где страсть к здоровому образу жизни трансформируется в стабильный доход и личностный рост
            </p>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
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
              Преимущества партнерства
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Почему стоит присоединиться к нашей команде
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={tier !== "low" ? { y: -8 } : {}}
                className="p-8 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border border-gray-200 dark:border-gray-700"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-6">
                  <benefit.icon className="w-8 h-8 text-blue-600 dark:text-cyan-400" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Как начать
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Три простых шага к вашему бизнесу
            </p>
          </motion.div>

          <div className="space-y-12">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
                className="flex flex-col md:flex-row gap-8 items-start"
              >
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center">
                    <span className="text-3xl font-bold text-white">{step.number}</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    {step.title}
                  </h3>
                  <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-20 md:py-32 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                Начните свой путь к успеху
              </h2>
              <div className="space-y-6 text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                <p>
                  Стать партнером 4Life легко. Свяжитесь со мной, и я расскажу вам о первых шагах, помогу зарегистрироваться и начать обучение.
                </p>
                <p>
                  Не упустите свой шанс построить успешную карьеру в индустрии здоровья и благополучия. Вместе мы создадим команду профессионалов, которые помогают людям жить лучше.
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
                  src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2070&auto=format&fit=crop"
                  alt="Команда 4Life"
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
              Готовы к новому этапу?
            </h2>
            <p className="text-xl text-white/90 mb-10 leading-relaxed">
              Свяжитесь со мной, чтобы обсудить ваши возможности в 4Life и начать путь к финансовой свободе
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                to="/contact"
                variant="secondary"
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100 dark:bg-gray-900 dark:text-cyan-400 dark:hover:bg-gray-800"
                icon={<Icons.MessageCircle className="w-5 h-5" />}
              >
                Стать партнером
              </Button>
              <Button
                to="/products"
                variant="secondary"
                size="lg"
                className="bg-white/10 border-white/30 hover:bg-white/20"
                icon={<Icons.ArrowRight className="w-5 h-5" />}
              >
                Узнать о продуктах
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
};

export default React.memo(PartnershipPage);
