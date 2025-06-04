import React from 'react';
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import ParallaxSection from "../components/ui/ParallaxSection";
import { Icons } from "../utils/icons";
import SectionHeading from "../components/ui/SectionHeading";
import ProductCard from "../components/ui/ProductCard";

// Анимационные варианты для элементов
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" }
  }
};

// Определяем компонент HomePage
const HomePage: React.FC = () => {
  // Данные для секции преимуществ
  const features = [
    {
      icon: Icons.ShieldCheck,
      title: "Натуральный состав",
      description: "Продукты 4Life созданы из полностью натуральных компонентов и не содержат химических добавок"
    },
    {
      icon: Icons.HeartPulse,
      title: "Укрепление иммунитета",
      description: "Наши продукты научно доказано повышают активность клеток иммунной системы до 437%"
    },
    {
      icon: Icons.PieChart,
      title: "Проверенные результаты",
      description: "Более 25 лет исследований и тысячи довольных клиентов по всему миру"
    },
  ];
  
  // Данные для секции преимуществ бизнеса
  const benefits = [
    {
      icon: Icons.DollarSign,
      title: "Гибкий доход",
      description: "Зарабатывайте на продажах и развитии своей партнерской сети без ограничения по времени"
    },
    {
      icon: Icons.Users,
      title: "Обучение и поддержка",
      description: "Полное обучение от экспертов и готовые инструменты для старта и развития бизнеса"
    },
    {
      icon: Icons.Globe,
      title: "Глобальные возможности",
      description: "Развивайте бизнес в более чем 50 странах мира с одной из самых надежных МЛМ-компаний"
    },
  ];
  
  // Популярные продукты
  const popularProducts = [
    {
      id: 1,
      title: "Трансфер Фактор Плюс",
      description: "Усиленная формула для поддержки иммунной системы. Содержит эксклюзивную смесь Трансфер Факторов и нутриентов для усиления иммунного ответа.",
      image: "/assets/images/products/tf-plus.png",
      link: "/products/transfer-factor-plus"
    },
    {
      id: 2,
      title: "Трансфер Фактор Трай-Фактор",
      description: "Классическая формула для ежедневной поддержки иммунитета. Оптимальное сочетание эффективности и доступности.",
      image: "/assets/images/products/tf-tri-factor.png",
      link: "/products/transfer-factor-tri-factor"
    },
    {
      id: 3,
      title: "Белл Ви",
      description: "Комплексная поддержка женского здоровья. Специально разработанная формула для красоты и благополучия женщины.",
      image: "/assets/images/products/belle-vie.png",
      link: "/products/belle-vie"
    }
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
        <meta property="og:image" content="/assets/images/og-home.jpg" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://alexander-toshchev-4life.ru/" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      {/* Главная секция с параллаксом */}
      <ParallaxSection
        backgroundImage="/assets/images/backgrounds/1.jpg"
        altText="Здоровье и благополучие с 4Life"
        height="h-screen"
        parallaxSpeed={0.2}
        contentClasses="flex flex-col items-center justify-center text-center"
      >
        <motion.div
          className="max-w-4xl px-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mb-4"
          >
            <span className="px-4 py-1 bg-blue-600/30 backdrop-blur-sm text-blue-100 rounded-full text-sm font-medium border border-blue-400/30">
              Компания иммунной системы
            </span>
          </motion.div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            <span className="block mb-2">Инвестируйте в своё здоровье</span>
            <span className="text-blue-300">с научным подходом 4Life</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 mb-10 leading-relaxed">
            Откройте для себя силу Трансфер Факторов — молекул, 
            которые передают иммунологическую память и поддерживают 
            здоровую работу вашей иммунной системы
          </p>
          
          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link 
                to="/products" 
                className="px-8 py-4 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white font-medium transition-all duration-300 shadow-lg hover:shadow-blue-500/30 flex items-center gap-2"
              >
                <span>Исследовать продукты</span>
                <Icons.ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link 
                to="/how-to-buy" 
                className="px-8 py-4 rounded-lg bg-white/10 backdrop-blur-sm border border-white/30 hover:bg-white/20 text-white font-medium transition-all duration-300 flex items-center gap-2"
              >
                <span>Как приобрести</span>
                <Icons.ShoppingCart className="w-5 h-5" />
              </Link>
            </motion.div>
          </div>
          
          <motion.div 
            className="mt-12 flex items-center justify-center gap-2 text-white/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            <Icons.Shield className="w-5 h-5 text-blue-300" />
            <span className="text-sm">Научно доказанная эффективность с 1998 года</span>
          </motion.div>
        </motion.div>
      </ParallaxSection>

      {/* Секция о нас */}
      <section className="py-24 bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="container max-w-7xl mx-auto px-6">
          <SectionHeading 
            title="О нашей компании"
            subtitle="Иммунная наука, подтвержденная исследованиями"
            description="4Life Research – это глобальная компания в области велнеса, основанная в 1998 году, специализирующаяся на научных разработках, производстве и распространении натуральных продуктов для поддержки иммунной системы."
          />
          
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-10">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-8 rounded-xl border border-blue-100 dark:border-blue-900/50 shadow-lg hover:shadow-xl transition-all duration-500 relative overflow-hidden group"
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{ y: -5 }}
              >
                {/* Декоративный элемент */}
                <div className="absolute -right-12 -top-12 w-24 h-24 bg-blue-100 dark:bg-blue-900 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700"></div>
                
                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-6 shadow-md transform -rotate-6 group-hover:rotate-0 transition-transform duration-300">
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{feature.description}</p>
                </div>
                
                {/* Нижняя декоративная линия */}
                <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-400 to-blue-600 w-0 group-hover:w-full transition-all duration-700"></div>
              </motion.div>
            ))}
          </div>
          
          <motion.div 
            className="mt-16 text-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link 
              to="/about" 
              className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-300 font-medium shadow-lg hover:shadow-blue-500/30"
            >
              <span>Узнать больше о компании</span>
              <Icons.ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Секция продуктов с параллаксом */}
      <ParallaxSection
        backgroundImage="/assets/images/backgrounds/2.jpg"
        altText="Продукты 4Life для укрепления иммунитета"
        height="auto"
        parallaxSpeed={0.15}
        contentClasses="py-24"
      >
        <div className="container max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <SectionHeading 
              title="Инновационные продукты для иммунитета"
              subtitle="Научный подход к здоровью"
              description="Продукты 4Life создаются на основе запатентованной технологии Трансфер Факторов — молекул, передающих иммунологическую память и поддерживающих здоровую работу иммунной системы."
              className="text-white"
              centered={true}
            />
          </motion.div>
          
          {/* Декоративный элемент */}
          <motion.div 
            className="flex justify-center mb-12"
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <div className="w-20 h-1 bg-gradient-to-r from-blue-300 to-blue-100"></div>
          </motion.div>
          
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            {popularProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <ProductCard 
                  title={product.title}
                  description={product.description}
                  image={product.image}
                  link={product.link}
                  delay={index * 0.1}
                />
              </motion.div>
            ))}
          </div>
          
          <motion.div 
            className="mt-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link 
              to="/products" 
              className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-white/90 backdrop-blur-sm text-blue-600 hover:bg-white transition-all duration-300 font-medium shadow-lg"
            >
              <span>Исследовать все продукты</span>
              <Icons.ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
          
          <motion.div 
            className="mt-10 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
              <Icons.ShieldCheck className="w-4 h-4 text-blue-300" />
              <p className="text-white/90 text-sm">
                Продукция 4Life не заменяет медикаментозное лечение
              </p>
            </div>
          </motion.div>
        </div>
      </ParallaxSection>

      {/* Секция бизнес-возможностей */}
      <section className="py-24 bg-gradient-to-b from-white to-green-50 dark:from-gray-900 dark:to-gray-800 relative overflow-hidden">
        {/* Декоративные элементы */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-green-300 dark:bg-green-700 mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-blue-300 dark:bg-blue-700 mix-blend-multiply filter blur-3xl"></div>
        </div>
        
        <div className="container max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <SectionHeading 
              title="Бизнес с 4Life"
              subtitle="Партнерство для финансовой свободы"
              description="Станьте партнером 4Life и получите доступ к проверенной бизнес-модели, поддержке команды и стабильному доходу. Развивайте бизнес в удобном для вас темпе."
              centered={true}
            />
          </motion.div>
          
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-10">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-8 rounded-xl border border-green-100 dark:border-green-900/50 shadow-lg hover:shadow-xl transition-all duration-500 group"
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{ y: -8, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.1)" }}
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mb-6 shadow-md transform group-hover:scale-110 transition-transform duration-300">
                  <benefit.icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300">{benefit.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{benefit.description}</p>
                
                {/* Индикатор при наведении */}
                <div className="w-0 h-1 bg-gradient-to-r from-green-400 to-green-600 mt-6 group-hover:w-full transition-all duration-500"></div>
              </motion.div>
            ))}
          </div>
          
          <motion.div 
            className="mt-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <div className="inline-block p-[2px] rounded-lg bg-gradient-to-r from-green-500 to-blue-500">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link 
                  to="/partnership" 
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-white dark:bg-gray-800 hover:bg-opacity-80 transition-all duration-300 font-medium"
                >
                  <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">Узнать о возможностях партнерства</span>
                  <Icons.ArrowRight className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </Link>
              </motion.div>
            </div>
          </motion.div>
          
          {/* Цитата */}
          <motion.div 
            className="mt-16 max-w-3xl mx-auto bg-white/60 dark:bg-gray-800/60 backdrop-blur-md p-8 rounded-xl border border-green-100 dark:border-green-900/50 shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="flex items-start">
              <Icons.Quote className="w-10 h-10 text-green-400 dark:text-green-500 mr-4 flex-shrink-0" />
              <div>
                <p className="text-gray-700 dark:text-gray-300 italic mb-4">
                  "В наши дни люди всему знают цену, но ничего не умеют ценить. Инвестируйте в своё здоровье сегодня, чтобы наслаждаться каждым днём полноценно и счастливо!"
                </p>
                <p className="text-right text-gray-500 dark:text-gray-400 font-medium">— Оскар Уайльд</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Секция призыва к действию с параллаксом */}
      <ParallaxSection
        backgroundImage="/assets/images/backgrounds/5.jpg"
        altText="Присоединяйтесь к команде 4Life"
        height="auto"
        parallaxSpeed={0.2}
        contentClasses="py-32"
        imageBrightness="brightness-[.5]"
      >
        <div className="container max-w-7xl mx-auto px-6 text-center">
          <motion.div
            className="max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {/* Декоративный элемент */}
            <motion.div 
              className="flex justify-center mb-8"
              initial={{ width: 0 }}
              whileInView={{ width: "100px" }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
            >
              <div className="h-1 bg-gradient-to-r from-blue-400 to-blue-300"></div>
            </motion.div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              <span className="block mb-2">Готовы инвестировать</span>
              <span className="text-blue-300">в своё здоровье и будущее?</span>
            </h2>
            
            <p className="text-xl text-white/90 mb-12 leading-relaxed">
              Присоединяйтесь к нашей команде сегодня и получите персональную консультацию 
              по продуктам и бизнес-возможностям 4Life. Сделайте первый шаг к здоровью и финансовой независимости.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <a 
                  href="https://russia.4life.com/12299550" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white font-medium transition-all duration-300 shadow-lg hover:shadow-blue-500/30"
                >
                  <Icons.ShoppingCart className="w-5 h-5" />
                  <span>Купить продукты</span>
                </a>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <a 
                  href="https://russia.4life.com/12299550/signup/PC" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-white/10 backdrop-blur-sm border border-white/30 hover:bg-white/20 text-white font-medium transition-all duration-300"
                >
                  <Icons.UserPlus className="w-5 h-5" />
                  <span>Стать партнером</span>
                </a>
              </motion.div>
            </div>
            
            {/* Дополнительная информация */}
            <motion.div 
              className="mt-12 flex justify-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                <Icons.Shield className="w-4 h-4 text-blue-300" />
                <p className="text-white/80 text-sm">
                  Используйте ID 12299550 для получения скидки
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </ParallaxSection>

      {/* Контактная секция */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 relative overflow-hidden">
        {/* Декоративные элементы */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-50 dark:bg-blue-900/30 opacity-50 clip-path-contact z-0"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-blue-100 dark:bg-blue-800 opacity-30 z-0"></div>
        
        <div className="container max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute -top-10 -left-10 w-20 h-20 border-t-4 border-l-4 border-blue-400 dark:border-blue-600 opacity-30"></div>
              
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800 dark:text-white">
                <span className="block">Остались вопросы?</span>
                <span className="text-blue-600 dark:text-blue-400">Я всегда на связи</span>
              </h2>
              
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                Готов ответить на ваши вопросы о продуктах 4Life, бизнес-возможностях 
                и помочь сделать первый шаг к улучшению вашего здоровья и благополучия.
              </p>
              
              <div className="space-y-6">
                <motion.div 
                  className="flex items-center group"
                  whileHover={{ x: 5 }}
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mr-5 shadow-md group-hover:shadow-blue-300/50 dark:group-hover:shadow-blue-500/50 transition-shadow duration-300">
                    <Icons.Phone className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Телефон для связи</p>
                    <p className="text-lg font-medium text-gray-800 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">+7 (XXX) XXX-XX-XX</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="flex items-center group"
                  whileHover={{ x: 5 }}
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mr-5 shadow-md group-hover:shadow-blue-300/50 dark:group-hover:shadow-blue-500/50 transition-shadow duration-300">
                    <Icons.Mail className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Электронная почта</p>
                    <p className="text-lg font-medium text-gray-800 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">contact@alexander-toshchev-4life.ru</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="flex items-center group"
                  whileHover={{ x: 5 }}
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mr-5 shadow-md group-hover:shadow-green-300/50 dark:group-hover:shadow-green-500/50 transition-shadow duration-300">
                    <Icons.Whatsapp className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">WhatsApp</p>
                    <p className="text-lg font-medium text-gray-800 dark:text-gray-200 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">Написать в WhatsApp</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
            
            <motion.div
              className="bg-white dark:bg-gray-800 p-10 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="absolute -bottom-10 -right-10 w-20 h-20 border-b-4 border-r-4 border-blue-400 dark:border-blue-600 opacity-30"></div>
              
              <h3 className="text-2xl font-bold mb-8 text-center text-gray-800 dark:text-white">Запросить консультацию</h3>
              
              <form className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Ваше имя</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      id="name" 
                      className="w-full p-4 pl-12 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50 dark:bg-gray-700 dark:text-white focus:bg-white dark:focus:bg-gray-600" 
                      placeholder="Иван Иванов"
                    />
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                      <Icons.User className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                    </div>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                  <div className="relative">
                    <input 
                      type="email" 
                      id="email" 
                      className="w-full p-4 pl-12 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50 dark:bg-gray-700 dark:text-white focus:bg-white dark:focus:bg-gray-600" 
                      placeholder="example@mail.ru"
                    />
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                      <Icons.Mail className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                    </div>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Ваш вопрос</label>
                  <div className="relative">
                    <textarea 
                      id="message" 
                      rows={4} 
                      className="w-full p-4 pl-12 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50 dark:bg-gray-700 dark:text-white focus:bg-white dark:focus:bg-gray-600" 
                      placeholder="Опишите ваш вопрос или запрос..."
                    ></textarea>
                    <div className="absolute left-4 top-6">
                      <Icons.Send className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                    </div>
                  </div>
                </div>
                
                <motion.button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white font-medium py-4 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-blue-500/30 flex items-center justify-center gap-2"
                  whileHover={{ y: -2 }}
                  whileTap={{ y: 1 }}
                >
                  <span>Отправить запрос</span>
                  <Icons.Send className="w-5 h-5" />
                </motion.button>
                
                <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
                  Ваши данные защищены и не будут переданы третьим лицам
                </p>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Добавляем стиль для clip-path */}
      <style>{`
        .clip-path-contact {
          clip-path: polygon(30% 0, 100% 0, 100% 100%, 0% 100%);
        }
      `}</style>
    </>
  );
};

export default HomePage;
