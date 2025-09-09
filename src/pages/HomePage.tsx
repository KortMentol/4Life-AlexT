import { AuroraText } from "@/components/magicui/aurora-text";
import { MorphingVideoSection } from "@/components/sections";
import { Button, ParallaxSection, SectionHeading } from "@/components/ui";
import { useTransition } from "@/context";
import { SEO } from "@/seo/SEO";
import { Icons } from "@/utils/icons";
import { scrollToTop } from "@/utils/navigationUtils";
import { motion } from "framer-motion";
import React, { lazy, Suspense } from "react";
import { useLocation } from "react-router-dom";

// Media imports
import tfPlusImg from "@/assets/images/products/tf-plus.webp";
import tfTrifactorImg from "@/assets/images/products/tf-trifactor.webp";
import renuvoImg from "@/assets/images/products/renuvo.webp";
import bg2Img from "@/assets/images/backgrounds/HomePage/2.jpg";
import bg5Img from "@/assets/images/backgrounds/HomePage/5.jpg";
import heroVideoWebm from "@/assets/videos/backgrounds/HomePage/Hero-section/Why 4Life Transfer Factor®_.webm";
import heroBgMobile from "@/assets/images/backgrounds/HomePage/bg-hero-Mobile.webp";
import heroBgPC from "@/assets/images/backgrounds/HomePage/bg-hero-PC.webp";

// --- LAZY LOADED COMPONENTS ---
const StaticFeature = lazy(() => import("@/components/ui/StaticFeature"));
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
  // --- Хуки для умной навигации ---
  const { transitionTo } = useTransition();
  const location = useLocation();

  // --- Умный обработчик клика для уникальных ссылок (как кнопка партнерства) ---
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    if (location.pathname === href) {
      scrollToTop({ immediate: false });
    } else {
      transitionTo(href);
    }
  };

  const GLOBAL_PARALLAX_STRENGTH = 40;

  const benefits = [
    {
      icon: Icons.DollarSign,
      title: "Гибкий доход",
      description: "Зарабатывайте на продажах и развитии своей партнерской сети без ограничения по времени",
    },
    {
      icon: Icons.Users,
      title: "Обучение и поддержка",
      description: "Доступ к проверенной бизнес-модели, готовым инструментам и персональной поддержке на всех этапах",
    },
    {
      icon: Icons.Globe,
      title: "Глобальные возможности",
      description:
        "Стройте бизнес с крупной международной компанией, которая обеспечивает стабильность, официальные выплаты и безупречную репутацию на рынке",
    },
  ];
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
        contentClasses="flex flex-col items-center justify-center text-center py-8"
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
              className="group from-blue-600 to-blue-500 shadow-lg"
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
              className="group bg-white/10 border-white/30"
              icon={
                <Icons.ShoppingCart className="w-4 h-4 md:w-5 md:h-5 transition-all duration-300 group-hover:rotate-12" />
              }
            >
              Получить скидку
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
                  <div className="h-1.5 w-[120px] bg-gradient-to-r from-blue-400 via-blue-300 to-blue-200 rounded-full shadow-sm shadow-blue-500/30"></div>
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
              <div className="mt-12 text-center px-6">
                <Button
                  to="/products"
                  variant="secondary"
                  size="lg"
                  className="group bg-white/20 border-white/30 backdrop-blur-sm"
                  icon={
                    <Icons.ArrowRight className="w-5 h-5 relative z-10 transition-all duration-300 group-hover:translate-x-1" />
                  }
                >
                  Посмотреть все
                </Button>
              </div>
              <div className="mt-10 text-center px-6">
                <div className="inline-flex items-center px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-white/10 border border-white/20">
                  <Icons.ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-blue-300 flex-shrink-0" />
                  <span className="text-white/80 text-sm sm:text-base ml-2 sm:ml-3">
                    Продукция 4Life не заменяет медикаментозное лечение
                  </span>
                </div>
              </div>
            </div>
          </div>
        </ParallaxSection>
      </section>

      <section id="business" className="relative py-24">
        <div className="absolute inset-0 bg-white dark:bg-gray-900 -z-20"></div>
        <div className="container max-w-7xl mx-auto px-6 relative z-10">
          <SectionHeading
            title="Бизнес с 4Life"
            subtitle="Партнерство для финансовой свободы"
            description="Станьте партнером 4Life и получите доступ к проверенной бизнес-модели, поддержке команды и стабильному доходу. Присоединяйтесь к моей команде и развивайте бизнес в удобном для вас темпе."
            centered={true}
            className="max-w-3xl mx-auto"
            subtitleClassName="text-blue-600 dark:text-blue-400 font-semibold tracking-wide"
            titleClassName="font-extrabold tracking-tight text-gray-800 dark:text-white"
          />
          <Suspense fallback={<div className="mt-16 h-[300px] w-full" />}>
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-10">
              {benefits.map((benefit, index) => (
                <StaticFeature
                  key={index}
                  icon={benefit.icon}
                  title={benefit.title}
                  description={benefit.description}
                />
              ))}
            </div>
          </Suspense>

          {/* ▼▼▼ ИСПРАВЛЕННАЯ УНИКАЛЬНАЯ КНОПКА ▼▼▼ */}
          <div className="mt-16 text-center">
            <motion.a
              href="/partnership"
              onClick={(e) => handleLinkClick(e, "/partnership")}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="group relative inline-flex items-center justify-center p-0.5 rounded-lg font-medium text-gray-900 bg-gradient-to-r from-green-400 to-blue-500 hover:text-white focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 transition-all duration-300"
            >
              <span className="relative px-8 py-4 transition-all ease-in duration-150 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                <span className="relative flex items-center gap-2">
                  <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent dark:text-transparent dark:bg-gradient-to-r dark:from-green-300 dark:to-blue-400 group-hover:text-white transition-colors duration-150">
                    Узнать о возможностях партнерства
                  </span>
                  <Icons.ArrowRight className="w-5 h-5 text-blue-600 dark:text-blue-400 transition-all duration-300 group-hover:translate-x-1 group-hover:text-white" />
                </span>
              </span>
            </motion.a>
          </div>

          <div className="mt-16 max-w-3xl mx-auto bg-white/0 dark:bg-gray-800/0 p-8 rounded-xl border border-green-100/30 dark:border-green-900/30 shadow-lg">
            <div className="flex items-start">
              <Icons.Quote className="w-10 h-10 text-green-400 dark:text-green-500 mr-4 flex-shrink-0" />
              <div>
                <p className="text-gray-700 dark:text-gray-300 italic mb-4">
                  &ldquo;В наши дни люди всему знают цену, но ничего не умеют ценить. Инвестируйте в своё здоровье
                  сегодня, чтобы наслаждаться каждым днём полноценно и счастливо!&rdquo;
                </p>
                <p className="text-right text-gray-500 dark:text-gray-400 font-medium">— Оскар Уайльд</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ParallaxSection
        backgroundImage={bg5Img}
        altText="Присоединяйтесь к команде 4Life"
        height="h-[120vh]"
        parallaxStrength={GLOBAL_PARALLAX_STRENGTH}
        contentClasses="flex flex-col items-center justify-center text-center py-24"
        imageBrightness="brightness-[.5]"
      >
        <div className="container max-w-7xl mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="flex justify-center mb-8">
              <div className="h-1.5 w-[120px] bg-gradient-to-r from-blue-400 via-blue-300 to-blue-200 rounded-full shadow-sm shadow-blue-500/30"></div>
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              <span className="block mb-2">Готовы инвестировать</span>
              <AuroraText colors={["#007BFF", "#FFFFFF", "#38BDF8", "#60A5FA"]} speed={1.4}>
                в своё здоровье и будущее?
              </AuroraText>
            </h2>

            <p className="text-xl text-white/90 mb-12 leading-relaxed max-w-2xl mx-auto">
              Присоединяйтесь к нашей команде и получите персональную консультацию по продуктам и бизнес-возможностям
              4Life. Сделайте первый шаг к здоровью и финансовой независимости.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Button
                href="https://russia.4life.com/12299550"
                isExternal
                variant="primary"
                size="lg"
                className="group"
                icon={<Icons.ShoppingCart className="w-5 h-5 transition-all duration-300 group-hover:rotate-12" />}
              >
                Купить продукты
              </Button>
              <Button
                href="https://russia.4life.com/12299550/signup/PC"
                isExternal
                variant="secondary"
                size="lg"
                className="group"
                icon={<Icons.UserPlus className="w-5 h-5 transition-all duration-300 group-hover:scale-110" />}
              >
                Стать партнером
              </Button>
            </div>

            <div className="mt-12 flex justify-center">
              <div className="inline-flex items-center px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-white/10 border border-white/20">
                <Icons.Shield className="w-4 h-4 sm:w-5 sm:h-5 text-blue-300 flex-shrink-0" />
                <span className="text-white/80 text-sm sm:text-base ml-2 sm:ml-3">
                  Используйте ID <span className="text-blue-300 font-medium">12299550</span> для получения скидки
                </span>
              </div>
            </div>
          </div>
        </div>
      </ParallaxSection>
    </motion.div>
  );
};

export default HomePage;
