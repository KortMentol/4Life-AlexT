import { AnimatePresence, motion } from "framer-motion";
import React, { useCallback, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import ParallaxSection from "../components/ui/ParallaxSection";
import SectionHeading from "../components/ui/SectionHeading";
import StaticCard from "../components/ui/StaticCard";
import StaticFeature from "../components/ui/StaticFeature";
import { Icons } from "../utils/icons";

// Кастомный хук для копирования в буфер обмена
const useCopyToClipboard = (text: string) => {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = useCallback(async (): Promise<(() => void) | void> => {
    // Не показываем уведомление, если уже показано
    if (isCopied) return;

    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);

      // Сбрасываем состояние через 2 секунды
      const timer = setTimeout(() => {
        setIsCopied(false);
      }, 2000);

      return () => clearTimeout(timer);
    } catch (err) {
      console.error("Ошибка при копировании: ", err);
      return undefined;
    }
  }, [text, isCopied]);

  return { isCopied, copyToClipboard };
};

// Определяем компонент HomePage
const HomePage: React.FC = () => {
  const { isCopied, copyToClipboard } = useCopyToClipboard("12299550");

  // Данные для секции преимуществ
  const features = [
    {
      icon: Icons.ShieldCheck,
      title: "Натуральный состав",
      description: "Продукты 4Life созданы из полностью натуральных компонентов и не содержат химических добавок",
    },
    {
      icon: Icons.HeartPulse,
      title: "Укрепление иммунитета",
      description: "Наши продукты научно доказано повышают активность клеток иммунной системы до 437%",
    },
    {
      icon: Icons.PieChart,
      title: "Проверенные результаты",
      description: "Более 25 лет исследований и тысячи довольных клиентов по всему миру",
    },
  ];

  // Данные для секции преимуществ бизнеса
  const benefits = [
    {
      icon: Icons.DollarSign,
      title: "Гибкий доход",
      description: "Зарабатывайте на продажах и развитии своей партнерской сети без ограничения по времени",
    },
    {
      icon: Icons.Users,
      title: "Обучение и поддержка",
      description: "Полное обучение от экспертов и готовые инструменты для старта и развития бизнеса",
    },
    {
      icon: Icons.Globe,
      title: "Глобальные возможности",
      description: "Развивайте бизнес в более чем 50 странах мира с одной из самых надежных МЛМ-компаний",
    },
  ];

  // Популярные продукты
  const popularProducts = [
    {
      id: 1,
      title: "Трансфер Фактор Плюс",
      description:
        "Усиленная формула для поддержки иммунной системы. Содержит эксклюзивную смесь Трансфер Факторов и нутриентов для усиления иммунного ответа.",
      image: "/src/assets/images/products/tf-plus.png",
      link: "/products/transfer-factor-plus",
    },
    {
      id: 2,
      title: "Трансфер Фактор Трай-Фактор",
      description:
        "Классическая формула для ежедневной поддержки иммунитета. Оптимальное сочетание эффективности и доступности.",
      image: "/src/assets/images/products/tf-tri-factor.png",
      link: "/products/transfer-factor-tri-factor",
    },
    {
      id: 3,
      title: "Белл Ви",
      description:
        "Комплексная поддержка женского здоровья. Специально разработанная формула для красоты и благополучия женщины.",
      image: "/src/assets/images/products/belle-vie.png",
      link: "/products/belle-vie",
    },
  ];

  return (
    <>
      <Helmet>
        <title>4Life с Александром Тощевым - Здоровье, Благополучие, Бизнес</title>
        <meta
          name="description"
          content="Официальный сайт Александра Тощева: узнайте о продуктах 4Life для укрепления иммунитета, улучшения здоровья и возможностях партнерства для финансовой свободы."
        />
        <meta property="og:title" content="4Life с Александром Тощевым - Здоровье, Благополучие, Бизнес" />
        <meta
          property="og:description"
          content="Официальный сайт Александра Тощева: узнайте о продуктах 4Life для укрепления иммунитета, улучшения здоровья и возможностях партнерства для финансовой свободы."
        />
        <meta property="og:image" content="/src/assets/images/og-home.jpg" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://alexander-toshchev-4life.ru/" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      {/* Главная секция с параллаксом и видео фоном */}
      <ParallaxSection
        backgroundVideo="/src/assets/videos/backgrounds/Why 4Life Transfer Factor®_.webm"
        backgroundImageMobile="/src/assets/images/backgrounds/bg-hero-Mobile.webp"
        backgroundImagePC="/src/assets/images/backgrounds/bg-hero-PC.webp"
        altText="Здоровье и благополучие с 4Life"
        height="min-h-screen h-[110vh] md:h-screen"
        parallaxSpeed={0.2}
        contentClasses="flex flex-col items-center justify-center text-center py-8"
        skipPreload={true} // Указываем, что изображение уже предварительно загружено
      >
        <motion.div
          className="max-w-4xl px-4 md:px-6 flex flex-col justify-between"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mb-2 md:mb-4"
          >
            <span className="px-3 py-1 md:px-4 md:py-1 bg-blue-600/30 text-blue-100 rounded-full text-xs md:text-sm font-medium border border-blue-400/30">
              Компания иммунной системы
            </span>
          </motion.div>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 md:mb-6 mt-4 md:mt-0">
            <span className="block mb-1 md:mb-2">Инвестируйте в своё здоровье</span>
            <span className="block mb-1 md:mb-2 bg-gradient-to-r from-blue-300 to-blue-100 bg-clip-text text-transparent">
              с научным подходом
            </span>
            <span className="bg-gradient-to-r from-blue-300 to-white bg-clip-text text-transparent">4Life</span>
          </h1>

          <p className="text-lg md:text-2xl text-white/90 mb-6 md:mb-10 leading-relaxed max-w-3xl mx-auto">
            Откройте для себя силу Трансфер Факторов — молекул, которые поддерживают здоровую работу вашей иммунной
            системы
          </p>

          <div className="flex flex-col sm:flex-row gap-3 md:gap-5 justify-center">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
              <Link
                to="/products"
                className="group relative inline-flex items-center justify-center gap-2 px-6 py-3 md:px-8 md:py-4 rounded-lg overflow-hidden bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium transition-all duration-300 shadow-lg w-full sm:w-auto"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="relative z-10">Исследовать продукты</span>
                <Icons.ArrowRight className="w-4 h-4 md:w-5 md:h-5 relative z-10 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
              <Link
                to="/how-to-buy"
                className="group relative inline-flex items-center justify-center gap-2 px-6 py-3 md:px-8 md:py-4 rounded-lg overflow-hidden bg-white/10 border border-white/30 text-white font-medium transition-all duration-300 w-full sm:w-auto"
              >
                <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="relative z-10">Как приобрести</span>
                <Icons.ShoppingCart className="w-4 h-4 md:w-5 md:h-5 relative z-10 transition-all duration-300 group-hover:rotate-12" />
                <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-blue-300 group-hover:w-full transition-all duration-500 ease-in-out"></span>
              </Link>
            </motion.div>
          </div>

          <motion.div
            className="mt-10 md:mt-12 flex items-start justify-center text-white/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <Icons.Microscope className="w-4 h-4 md:w-5 md:h-5 text-blue-300 mt-0.5 mr-0.5 md:mr-1" />
            <span className="text-xs md:text-sm">Научно доказанная эффективность с 1998 года</span>
          </motion.div>
        </motion.div>
      </ParallaxSection>


      {/* Секция о нас */}
      <section
        id="about"
        className="relative py-24"
      >
        {/* Белый фон (z-index: -20) */}
        <div className="absolute inset-0 bg-white dark:bg-gray-900 -z-20"></div>
        
        {/* Fluid эффект (z-index: -10) */}
        <div className="absolute inset-0 -z-10">
          {/* Здесь будет ваш fluid эффект */}
        </div>
        
        {/* Контент секции (z-index: 10) */}
        <div className="relative z-10">
          <div className="container max-w-7xl mx-auto px-6">
            <SectionHeading
              title="О нашей компании"
              subtitle="Иммунная наука, подтвержденная исследованиями"
              description="4Life Research – это глобальная компания в области велнеса, основанная в 1998 году, специализирующаяся на научных разработках, производстве и распространении натуральных продуктов для поддержки иммунной системы."
              centered={true}
              className="max-w-3xl mx-auto"
              subtitleClassName="text-gray-700 dark:text-blue-400"
              titleClassName="text-gray-800 dark:text-white"
              descriptionClassName="mx-auto max-w-2xl text-center"
            />

            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-10">
              {features.map((feature, index) => (
                <StaticFeature
                  key={index}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  color="from-blue-500 to-blue-600"
                  className="border-blue-100 dark:border-blue-900/50"
                />
              ))}
            </div>

            <motion.div className="mt-16 text-center" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/about"
                className="group relative inline-flex items-center gap-2 px-8 py-4 rounded-lg overflow-hidden bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium shadow-lg transition-all duration-300"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="relative z-10">Узнать больше о компании</span>
                <Icons.ArrowRight className="w-5 h-5 relative z-10 transition-all duration-300 group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Секция продуктов с параллаксом */}
      <section id="products">
        <ParallaxSection
          backgroundImage="/src/assets/images/backgrounds/2.jpg"
          altText="Продукты 4Life для укрепления иммунитета"
          height="auto"
          parallaxSpeed={0.15}
          contentClasses="py-24"
          skipPreload={true} // Указываем, что изображение уже предварительно загружено
        >
          <div className="container max-w-7xl mx-auto px-6">
            <div className="opacity-100">
              {/* Декоративный элемент - полоска */}
              <div className="flex justify-center mb-8">
                <div className="h-1.5 w-[120px] bg-gradient-to-r from-blue-400 via-blue-300 to-blue-200 rounded-full shadow-sm shadow-blue-500/30"></div>
              </div>

              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 text-center">
                <span className="block mb-2 text-lg md:text-xl font-medium text-white">Научный подход к здоровью</span>
                <span className="bg-gradient-to-r from-blue-300 to-white bg-clip-text text-transparent">
                  Инновационные продукты для иммунитета
                </span>
              </h2>

              <p className="text-xl text-white/90 mb-12 leading-relaxed max-w-2xl mx-auto text-center">
                Продукты 4Life создаются на основе запатентованной технологии Трансфер Факторов — молекул, передающих
                иммунологическую память и поддерживающих здоровую работу иммунной системы.
              </p>
            </div>
          </div>

          <div className="container max-w-7xl mx-auto px-6">
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
              {popularProducts.map((product) => (
                <div key={product.id}>
                  <StaticCard
                    title={product.title}
                    description={product.description}
                    image={product.image}
                    link={product.link}
                  />
                </div>
              ))}
            </div>

            <motion.div className="mt-16 text-center" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/products"
                className="group relative inline-flex items-center gap-2 px-8 py-4 rounded-lg overflow-hidden border border-white/30 bg-white/20 backdrop-blur-sm text-white font-medium shadow-lg transition-all duration-300"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-blue-500/80 to-blue-400/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1">
                  Посмотреть все
                </span>
                <Icons.ArrowRight className="w-5 h-5 relative z-10 transition-all duration-300 group-hover:translate-x-1" />
                <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-blue-300 group-hover:w-full transition-all duration-500 ease-in-out"></span>
              </Link>
            </motion.div>

            <div className="mt-10 text-center">
              <div className="inline-flex items-center px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-white/10 border border-white/20">
                <Icons.ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-blue-300 flex-shrink-0" />
                <span className="text-white/80 text-sm sm:text-base ml-2 sm:ml-3">
                  Продукция 4Life не заменяет медикаментозное лечение
                </span>
              </div>
            </div>
          </div>
        </ParallaxSection>
      </section>

      {/* Секция бизнес-возможностей */}
      <section
        id="business"
        className="relative py-24"
      >
        {/* Белый фон (z-index: -20) */}
        <div className="absolute inset-0 bg-white dark:bg-gray-900 -z-20"></div>
        
        {/* Fluid эффект (z-index: -10) */}
        <div className="absolute inset-0 -z-10">
          {/* Здесь будет ваш fluid эффект */}
        </div>

        <div className="container max-w-7xl mx-auto px-6 relative z-10">
          <div className="opacity-100">
            <SectionHeading
              title="Бизнес с 4Life"
              subtitle="Партнерство для финансовой свободы"
              description="Станьте партнером 4Life и получите доступ к проверенной бизнес-модели, поддержке команды и стабильному доходу. Развивайте бизнес в удобном для вас темпе."
              centered={true}
              className="max-w-3xl mx-auto"
              subtitleClassName="text-primary-blue dark:text-blue-400 font-semibold tracking-wide text-gray-700"
              titleClassName="font-extrabold tracking-tight text-gray-800 dark:text-white"
            />
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-10">
            {benefits.map((benefit, index) => (
              <StaticFeature
                key={index}
                icon={benefit.icon}
                title={benefit.title}
                description={benefit.description}
                color="from-green-500 to-green-600"
              />
            ))}
          </div>

          <div className="mt-16 text-center">
            <motion.div
              className="inline-block p-[2px] rounded-lg bg-gradient-to-r from-green-500 to-blue-500"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                to="/partnership"
                className="group relative inline-flex items-center gap-2 px-8 py-4 rounded-lg overflow-hidden bg-white dark:bg-gray-800 transition-all duration-300 font-medium"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent relative z-10">
                  Узнать о возможностях партнерства
                </span>
                <Icons.ArrowRight className="w-5 h-5 text-blue-600 dark:text-blue-400 relative z-10 transition-all duration-300 group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </div>

          {/* Цитата */}
          <div className="mt-16 max-w-3xl mx-auto bg-white/0 dark:bg-gray-800/0 p-8 rounded-xl border border-green-100/30 dark:border-green-900/30 shadow-lg">
            <div className="flex items-start">
              <Icons.Quote className="w-10 h-10 text-green-400 dark:text-green-500 mr-4 flex-shrink-0" />
              <div>
                <p className="text-gray-700 dark:text-gray-300 italic mb-4">
                  &quot;В наши дни люди всему знают цену, но ничего не умеют ценить. Инвестируйте в своё здоровье
                  сегодня, чтобы наслаждаться каждым днём полноценно и счастливо!&quot;
                </p>
                <p className="text-right text-gray-500 dark:text-gray-400 font-medium">— Оскар Уайльд</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Секция призыва к действию с параллаксом */}
      <ParallaxSection
        backgroundImage="/src/assets/images/backgrounds/5.jpg"
        altText="Присоединяйтесь к команде 4Life"
        height="100vh"
        parallaxSpeed={0.2}
        contentClasses="py-32 pb-16 min-h-screen flex items-center"
        imageBrightness="brightness-[.5]"
      >
        <div className="container max-w-7xl mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto">
            {/* Декоративный элемент */}
            <div className="flex justify-center mb-8">
              <div className="h-1.5 w-[120px] bg-gradient-to-r from-blue-400 via-blue-300 to-blue-200 rounded-full shadow-sm shadow-blue-500/30"></div>
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              <span className="block mb-2">Готовы инвестировать</span>
              <span className="bg-gradient-to-r from-blue-300 to-white bg-clip-text text-transparent">
                в своё здоровье и будущее?
              </span>
            </h2>

            <p className="text-xl text-white/90 mb-12 leading-relaxed max-w-2xl mx-auto">
              Присоединяйтесь к нашей команде сегодня и получите персональную консультацию по продуктам и
              бизнес-возможностям 4Life. Сделайте первый шаг к здоровью и финансовой независимости.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <a
                  href="https://russia.4life.com/12299550"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative inline-flex items-center gap-2 px-8 py-4 rounded-lg overflow-hidden bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium shadow-lg transition-all duration-300"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <Icons.ShoppingCart className="w-5 h-5 relative z-10 transition-all duration-300 group-hover:rotate-12" />
                  <span className="relative z-10">Купить продукты</span>
                  <span className="absolute -bottom-1 left-0 right-0 h-[3px] bg-white/30 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                </a>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <a
                  href="https://russia.4life.com/12299550/signup/PC"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative inline-flex items-center gap-2 px-8 py-4 rounded-lg overflow-hidden bg-white/10 border border-white/30 text-white font-medium transition-all duration-300"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-blue-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <Icons.UserPlus className="w-5 h-5 relative z-10 transition-all duration-300 group-hover:scale-110" />
                  <span className="relative z-10">Стать партнером</span>
                  <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-blue-300 group-hover:w-full transition-all duration-500 ease-in-out"></span>
                </a>
              </motion.div>
            </div>

            {/* Дополнительная информация */}
            <div className="mt-12 flex justify-center">
              <div className="inline-flex items-center px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-white/10 border border-white/20">
                <Icons.Shield className="w-4 h-4 sm:w-5 sm:h-5 text-blue-300 flex-shrink-0" />
                <div className="relative ml-2 sm:ml-3">
                  <div className="flex flex-wrap items-baseline justify-center gap-x-1.5">
                    <span className="text-white/80 text-sm sm:text-base whitespace-nowrap">Используйте ID</span>

                    <div className="relative inline-flex flex-col">
                      <button
                        type="button"
                        onClick={() => copyToClipboard()}
                        className="relative text-blue-300 hover:text-blue-200 font-medium transition-all duration-200 group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-opacity-50"
                        aria-label="Скопировать ID"
                      >
                        <span className="relative inline-block transition-all duration-200 text-blue-300 group-hover:text-blue-200">
                          <span className="relative z-10"> 12299550 </span>
                          <span className="absolute inset-0 w-full h-full border-b border-solid border-blue-300 group-hover:border-blue-200 transition-colors duration-200"></span>
                        </span>
                      </button>

                      <AnimatePresence>
                        {isCopied && (
                          <motion.div
                            className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-4 py-1.5 bg-white/95 dark:bg-gray-800/95 rounded-md shadow-lg z-50 whitespace-nowrap min-w-[110px] text-center"
                            initial={{ opacity: 0, y: -5, scale: 0.95 }}
                            animate={{
                              opacity: 1,
                              y: 8,
                              scale: 1,
                              transition: {
                                type: "spring",
                                damping: 25,
                                stiffness: 400,
                                duration: 0.2,
                              },
                            }}
                            exit={{
                              opacity: 0,
                              y: 0,
                              scale: 0.95,
                              transition: {
                                duration: 0.15,
                              },
                            }}
                          >
                            <div className="relative flex items-center justify-center gap-2">
                              <svg
                                className="w-3.5 h-3.5 text-green-400 flex-shrink-0"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <motion.path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2.5}
                                  d="M5 13l4 4L19 7"
                                  initial={{ pathLength: 0, pathOffset: 1 }}
                                  animate={{ pathLength: 1, pathOffset: 0 }}
                                  transition={{
                                    duration: 0.2,
                                    ease: "easeOut",
                                  }}
                                />
                              </svg>
                              <span className="text-sm font-medium text-gray-800 dark:text-gray-100">Скопировано</span>
                            </div>
                            {/* Стрелка указывающая на кнопку */}
                            <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white/95 dark:bg-gray-800/95 rotate-45 transform origin-center -z-10"></div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <span className="text-white/80 text-sm sm:text-base whitespace-nowrap">для получения скидки</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ParallaxSection>
    </>
  );
};

export default HomePage;
