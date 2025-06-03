import { motion } from "framer-motion";
import {
  ArrowRight,
  Briefcase,
  DollarSign,
  Globe,
  HeartHandshake,
  Mail,
  Microscope,
  Phone,
  Shield,
  Zap,
} from "lucide-react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ParallaxBanner } from "react-scroll-parallax";
import SectionHeading from "../components/ui/SectionHeading";
import TestimonialCard from "../components/ui/TestimonialCard";

// Импорт анимационных вариантов
import { buttonVariants, cardVariants, containerVariants, headingVariants, itemVariants } from "../animations/variants";

// Удаляем дублирующий импорт motion, так как он уже импортирован выше

const testimonials = [
  {
    id: "testimonial-home-elena",
    image:
      "https://images.pexels.com/photos/1036620/pexels-photo-1036620.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    name: "Елена",
    title: "Пенсионерка, 48 лет",
    quote:
      "После курса 4Life Transfer Factor Tri-Factor Formula заметила значительное улучшение общего самочувствия. Раньше часто болела простудами, теперь это стало редкостью. Особенно впечатлил эффект после поездки в командировку – обычно возвращалась с простудой, а в этот раз осталась в отличной форме.",
    delay: 0.2,
  },
  {
    id: "testimonial-home-dmitry",
    image:
      "https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    name: "Дмитрий",
    title: "Спортсмен, 35 лет",
    quote:
      "Как спортсмен, я всегда ищу натуральные способы поддержки организма. 4Life Transfer Factor Plus стал для меня настоящим открытием. После интенсивных тренировок восстанавливаюсь быстрее, и энергия держится весь день.",
    delay: 0.4,
  },
  {
    id: "testimonial-home-anna",
    image:
      "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    name: "Анна",
    title: "Мама, 38 лет",
    quote:
      "Я принимаю Трансфер Фактор Плюс уже больше года. За это время я заметила значительное улучшение общего самочувствия и стрессоустойчивости. Особенно заметна разница в осенне-зимний период - в то время как коллеги часто болеют, я продолжаю активно работать. Очень благодарна Александру за подробную консультацию по продукту.",
    delay: 0.6,
  },
];

const HomePage: React.FC = () => {
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
        <meta property="og:image" content="/images/og-home.jpg" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://alexander-toshchev-4life.ru/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="4Life с Александром Тощевым - Здоровье, Благополучие, Бизнес" />
        <meta
          name="twitter:description"
          content="Официальный сайт Александра Тощева: узнайте о продуктах 4Life для укрепления иммунитета, улучшения здоровья и возможностях партнерства для финансовой свободы."
        />
        <meta name="twitter:image" content="/images/og-home.jpg" />
      </Helmet>
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* Parallax Background */}
        <ParallaxBanner
          layers={[
            {
              image: "/images/hero-bg.jpg",
              speed: -20,
              opacity: [0.8, 1],
              scale: [1.05, 1.15],
              shouldAlwaysCompleteAnimation: true,
            },
          ]}
          className="absolute inset-0 z-0"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/70 to-purple-600/70 dark:from-gray-900/70 dark:to-gray-800/70" />
        </ParallaxBanner>

        <div className="relative z-10 w-full max-w-5xl mx-auto text-center flex justify-center">
          <div className="flex flex-col items-center text-center space-y-8 px-4 w-full">
            <motion.h1
              className="text-4xl md:text-6xl font-extrabold text-white drop-shadow-lg"
              variants={headingVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
            >
              Проснись <span className="text-primary block md:inline">полным энергии, ясности ума</span> и желания творить
              великие дела с <span className="text-4life-blue">4Life</span>
            </motion.h1>

            <motion.p
              className="text-lg md:text-xl text-gray-100 dark:text-gray-200 max-w-2xl leading-relaxed"
              variants={itemVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
            >
              Инвестируй в свое здоровье сегодня, чтобы наслаждаться каждым днем полноценно и счастливо. Мы поможем тебе
              раскрыть жизненную силу и обрести новые возможности.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row justify-center items-center gap-4 w-full max-w-2xl mx-auto"
              variants={itemVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
            >
              <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap" className="w-full sm:w-auto">
                <Link to="/purchase" className="btn btn-primary text-lg px-8 py-4 flex items-center justify-center sm:justify-start space-x-3 group w-full">
                  <span>Приобрести продукцию 4Life</span>
                  <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </motion.div>
              <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap" className="w-full sm:w-auto">
                <Link to="/partnership" className="btn btn-outline text-lg px-8 py-4 flex items-center justify-center sm:justify-start space-x-3 group w-full">
                  <span>Узнать о партнерстве</span>
                  <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </motion.div>
            </motion.div>
          </div>

          {/* Key Benefits / Value Proposition */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12 max-w-5xl mx-auto px-4 w-full"
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
          >
            <motion.div
              className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm p-6 rounded-xl shadow-lg flex flex-col items-center text-center border border-gray-200 dark:border-gray-700"
              variants={itemVariants}
              initial="hidden"
              animate="show"
            >
              <Shield className="h-10 w-10 text-primary mb-3" />
              <h3 className="font-semibold text-lg text-gray-800 dark:text-white">Крепкий Иммунитет</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Научная поддержка вашей защиты.</p>
            </motion.div>

            <motion.div
              className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm p-6 rounded-xl shadow-lg flex flex-col items-center text-center border border-gray-200 dark:border-gray-700"
              variants={itemVariants}
              initial="hidden"
              animate="show"
            >
              <Zap className="h-10 w-10 text-yellow-500 mb-3" />
              <h3 className="font-semibold text-lg text-gray-800 dark:text-white">Поток Энергии</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Каждый день полон новых возможностей.</p>
            </motion.div>

            <motion.div
              className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm p-6 rounded-xl shadow-lg flex flex-col items-center text-center border border-gray-200 dark:border-gray-700"
              variants={itemVariants}
              initial="hidden"
              animate="show"
            >
              <HeartHandshake className="h-10 w-10 text-red-500 mb-3" />
              <h3 className="font-semibold text-lg text-gray-800 dark:text-white">Помощь и Развитие</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Наставничество на пути к успеху.</p>
            </motion.div>

            <motion.div
              className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm p-6 rounded-xl shadow-lg flex flex-col items-center text-center border border-gray-200 dark:border-gray-700"
              variants={itemVariants}
              initial="hidden"
              animate="show"
            >
              <DollarSign className="h-10 w-10 text-green-500 mb-3" />
              <h3 className="font-semibold text-lg text-gray-800 dark:text-white">Финансовые Возможности</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Стройте большой бизнес с 4Life.</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-16 md:py-24 bg-white dark:bg-gray-900 relative">
        <div className="container mx-auto px-4 relative z-10">
          <SectionHeading
            title="О нас: Ваше путешествие к здоровью с 4Life"
            subtitle="Наука, успех, сервис — вместе строим жизнь"
          />

          <div className="flex flex-col lg:flex-row items-center gap-12 mt-12">
            {/* Image / Visual */}
            <motion.div className="lg:w-1/2" variants={itemVariants} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="w-full h-64 bg-gray-200 dark:bg-gray-700 rounded-xl shadow-2xl flex items-center justify-center">
                <span className="text-gray-500 dark:text-gray-400">Изображение не найдено</span>
              </div>
            </motion.div>

            {/* Content */}
            <motion.div className="lg:w-1/2 text-left" variants={itemVariants} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-6">
                Впервые услышав о трансфер факторах более двадцати лет назад, мы пустились в увлекательное путешествие,
                которое изменило нашу жизнь и жизни тысяч людей по всему миру. Трансфер факторы — это уникальные
                молекулы, передающие ценные иммунные знания и память между клетками организма, что является революцией в
                области иммунной системы.
              </p>
              <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-8">
                С 1998 года 4Life выросла в активно развивающуюся сеть людей, объединенных миссией 'Вместе Строить
                Жизнь' посредством науки, успеха и сервиса. Мы заслужили репутацию компании, которая идет по пути
                новаторства, научных исследований в области иммунологии, и общей поддержки здоровья.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div
                  className="flex items-start space-x-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow-sm"
                  variants={itemVariants}
                  initial="hidden"
                  animate="show"
                >
                  <Microscope className="text-primary h-6 w-6 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-white text-md">
                      Научные исследования и патенты
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      В основе всех продуктов 4Life лежит глубокая научная база.
                    </p>
                  </div>
                </motion.div>
                <motion.div
                  className="flex items-start space-x-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow-sm"
                  variants={itemVariants}
                  initial="hidden"
                  animate="show"
                >
                  <Globe className="text-blue-500 h-6 w-6 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-white text-md">Мировая компания с миссией</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Объединяем людей по всему миру для лучшей жизни.
                    </p>
                  </div>
                </motion.div>
                <motion.div
                  className="flex items-start space-x-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow-sm"
                  variants={itemVariants}
                  initial="hidden"
                  animate="show"
                >
                  <Shield className="text-green-500 h-6 w-6 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-white text-md">
                      Гарантия качества и безопасности
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Все продукты проходят строгий контроль качества.
                    </p>
                  </div>
                </motion.div>
                <motion.div
                  className="flex items-start space-x-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow-sm"
                  variants={itemVariants}
                  initial="hidden"
                  animate="show"
                >
                  <Briefcase className="text-purple-500 h-6 w-6 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-white text-md">Бизнес возможности</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Стройте успешный бизнес с 4Life.</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="section bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-900 dark:to-gray-950 relative py-20 md:py-28 overflow-hidden">
        <div className="container-custom relative z-10">
          <SectionHeading title="О нас: Ваше путешествие к здоровью и процветанию" centered />
          <motion.div
            className="max-w-4xl mx-auto text-center relative z-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-lg text-gray-700 mb-8">
              Уже более 10 лет я помогаю людям улучшать качество жизни с помощью инновационных продуктов 4Life и
              создавать стабильный доход через партнерскую программу.
            </p>
            
            <motion.div 
              className="grid md:grid-cols-2 gap-8 mt-12 relative z-10"
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
            >
              <motion.div 
                className="bg-gray-50 rounded-lg p-8 shadow-md text-left"
                variants={itemVariants}
              >
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Наша миссия</h3>
                <p className="text-gray-700 mb-4">
                  Мы стремимся помочь каждому человеку достичь оптимального здоровья и благополучия через 
                  научно обоснованные продукты и создание возможностей для финансовой независимости.
                </p>
                <p className="text-gray-700">
                  Наш подход основан на сочетании инновационных разработок в области трансфер-факторов 
                  и личной поддержки каждого клиента и партнера.
                </p>
              </motion.div>
              
              <motion.div 
                className="bg-gray-50 rounded-lg p-8 shadow-md text-left"
                variants={itemVariants}
              >
                <h3 className="text-2xl font-bold text-gray-800 mb-4">О Александре Тощеве</h3>
                <p className="text-gray-700 mb-4">
                  Сертифицированный консультант по продуктам 4Life с более чем 10-летним опытом работы. 
                  Достиг статуса Gold Leader и создал успешную команду партнеров по всей России.
                </p>
                <p className="text-gray-700">
                  Моя цель — помочь каждому клиенту найти оптимальное решение для укрепления здоровья, 
                  а каждому партнеру — раскрыть свой потенциал и достичь финансовых целей.
                </p>
              </motion.div>
            </motion.div>
            
            <motion.div 
              className="mt-12 relative z-10"
              variants={itemVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
            >
              <Link to="/about" className="btn btn-primary inline-flex items-center">
                Узнать больше о нас
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section bg-gray-50 dark:bg-gray-900 relative py-20 md:py-28 overflow-hidden">
        <div className="container-custom relative z-10">
          <SectionHeading title="Реальные Истории Успеха" centered />
          <motion.div
            className="max-w-7xl mx-auto relative z-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px 0px" }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-lg text-gray-700 mb-8">
              Эти люди нашли поддержку здоровья и новые возможности благодаря продукции 4Life и профессионализму
              Александра Тощева.
            </p>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2, margin: "-50px 0px" }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {testimonials.map((testimonial) => (
                <motion.div
                  key={testimonial.id}
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.3 }}
                  className="relative z-10 h-full"
                >
                  <TestimonialCard
                    name={testimonial.name}
                    image={testimonial.image}
                    title={testimonial.title}
                    quote={testimonial.quote}
                  />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="section bg-white relative">
        <div className="container-custom relative z-10">
          <SectionHeading title="Свяжитесь со мной" centered />
          <motion.div
            className="max-w-4xl mx-auto text-center relative z-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-lg text-gray-700 mb-8">
              Готов ответить на все ваши вопросы и помочь подобрать оптимальное решение для вашего здоровья.
            </p>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-bold mb-4">Контакты</h3>
                <ul className="space-y-4">
                  <li>
                    <div className="flex items-center space-x-3">
                      <Phone className="w-6 h-6 text-primary" />
                      <a href="tel:+79276245790" className="text-gray-800 hover:text-primary">
                        +7 (927) 624-57-90
                      </a>
                    </div>
                  </li>
                  <li>
                    <div className="flex items-center space-x-3">
                      <Mail className="w-6 h-6 text-primary" />
                      <a href="mailto:alexander.toschev@gmail.com" className="text-gray-800 hover:text-primary">
                        alexander.toschev@gmail.com
                      </a>
                    </div>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-4">Адрес</h3>
                <p className="text-gray-700 mb-4">г. Уфа, ул. З. Валиди, д. 10/1</p>
                <p className="text-gray-700 mb-4">Район: Центральный</p>
                <p className="text-gray-700">Метро: Салават Куждабаев</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

    </>
  );
};

export default HomePage;
