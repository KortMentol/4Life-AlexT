import React from 'react';
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import ParallaxSection from "../components/ui/ParallaxSection";
import { Icons } from "../utils/icons";
import SectionHeading from "../components/ui/SectionHeading";
import CallToAction from "../components/ui/CallToAction";
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
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Ваш путь к здоровью и финансовой свободе
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8">
            Инновационные продукты для иммунитета и возможности бизнеса с мировым брендом 4Life
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/products" className="px-8 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors duration-300">
              Наши продукты
            </Link>
            <Link to="/partnership" className="px-8 py-3 rounded-lg bg-transparent border-2 border-white hover:bg-white/10 text-white font-medium transition-colors duration-300">
              Бизнес с 4Life
            </Link>
          </div>
        </motion.div>
      </ParallaxSection>

      {/* Секция о нас */}
      <section className="py-20 bg-white">
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
                className="bg-gray-50 p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
              >
                <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center mb-5">
                  <feature.icon className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Link to="/about" className="inline-block px-8 py-3 rounded-lg border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors duration-300 font-medium">
              Узнать больше о компании
            </Link>
          </div>
        </div>
      </section>

      {/* Секция продуктов с параллаксом */}
      <ParallaxSection
        backgroundImage="/assets/images/backgrounds/2.jpg"
        altText="Продукты 4Life для укрепления иммунитета"
        height="auto"
        parallaxSpeed={0.15}
        contentClasses="py-20"
      >
        <div className="container max-w-7xl mx-auto px-6">
          <SectionHeading 
            title="Наши продукты"
            subtitle="Научный подход к иммунитету"
            description="Продукты 4Life создаются на основе запатентованной технологии Трансфер Факторов — молекул, передающих иммунологическую память и поддерживающих здоровую работу иммунной системы."
            className="text-white"
          />
          
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            {popularProducts.map((product) => (
              <ProductCard 
                key={product.id}
                title={product.title}
                description={product.description}
                image={product.image}
                link={product.link}
              />
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Link to="/products" className="inline-block px-8 py-3 rounded-lg bg-white text-blue-600 hover:bg-blue-50 transition-colors duration-300 font-medium">
              Посмотреть все продукты
            </Link>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-white/80 text-sm italic">
              * Я не являюсь врачом, и продукция 4Life не заменяет медикаментозное лечение
            </p>
          </div>
        </div>
      </ParallaxSection>

      {/* Секция бизнес-возможностей */}
      <section className="py-20 bg-white">
        <div className="container max-w-7xl mx-auto px-6">
          <SectionHeading 
            title="Бизнес с 4Life"
            subtitle="Партнерство для финансовой свободы"
            description="Станьте партнером 4Life и получите доступ к проверенной бизнес-модели, поддержке команды и стабильному доходу. Развивайте бизнес в удобном для вас темпе."
          />
          
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-10">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                className="bg-gray-50 p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
              >
                <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mb-5">
                  <benefit.icon className="w-7 h-7 text-green-600" />
                </div>
                <h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Link to="/partnership" className="inline-block px-8 py-3 rounded-lg border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition-colors duration-300 font-medium">
              Узнать о возможностях партнерства
            </Link>
          </div>
        </div>
      </section>

      {/* Секция призыва к действию с параллаксом */}
      <ParallaxSection
        backgroundImage="/assets/images/backgrounds/5.jpg"
        altText="Присоединяйтесь к команде 4Life"
        height="auto"
        parallaxSpeed={0.2}
        contentClasses="py-24"
      >
        <div className="container max-w-7xl mx-auto px-6 text-center">
          <motion.div
            className="max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Готовы начать свой путь к здоровью и благополучию?
            </h2>
            <p className="text-xl text-white/90 mb-10">
              Присоединяйтесь к нашей команде сегодня и получите персональную консультацию по продуктам и бизнес-возможностям 4Life
            </p>
            
            <CallToAction 
              primaryButtonText="Купить продукты"
              secondaryButtonText="Стать партнером"
              primaryButtonLink="https://russia.4life.com/12299550"
              secondaryButtonLink="https://russia.4life.com/12299550/signup/PC"
              className="justify-center"
            />
          </motion.div>
        </div>
      </ParallaxSection>

      {/* Контактная секция */}
      <section className="py-16 bg-gray-50">
        <div className="container max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-4">Остались вопросы?</h2>
              <p className="text-lg text-gray-600 mb-6">
                Я всегда готов ответить на ваши вопросы о продуктах 4Life и бизнес-возможностях. Свяжитесь со мной удобным для вас способом.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                    <Icons.Phone className="w-5 h-5 text-blue-600" />
                  </div>
                  <span>+7 (XXX) XXX-XX-XX</span>
                </div>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                    <Icons.Mail className="w-5 h-5 text-blue-600" />
                  </div>
                  <span>contact@alexander-toshchev-4life.ru</span>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              className="bg-white p-8 rounded-xl shadow-sm"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold mb-6 text-center">Запросить консультацию</h3>
              <form className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Ваше имя</label>
                  <input type="text" id="name" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" id="email" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Ваш вопрос</label>
                  <textarea id="message" rows={4} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"></textarea>
                </div>
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-300">
                  Отправить запрос
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;
