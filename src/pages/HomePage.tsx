import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  Briefcase,
  Globe,
  Mail,
  Microscope,
  Phone,
  Shield,
} from "lucide-react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import SectionHeading from "../components/ui/SectionHeading";
import TestimonialCard from "../components/ui/TestimonialCard";
import CallToAction from "../components/ui/CallToAction";
import { Icons } from "../utils/icons";

// Импорт анимационных вариантов
import { cardVariants, containerVariants, itemVariants } from "../animations/variants";

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
      </Helmet>
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative w-full h-screen flex items-center justify-center text-white overflow-hidden"
      >
        {/* Фон с параллаксом */}
        <motion.div
          style={{ y: useTransform(useScroll().scrollY, [0, 800], ["0%", "20%"]) }}
          className="absolute inset-0 z-0"
        >
          <img
            src="/assets/images/backgrounds/woods_hero_section.jpg"
            alt="4Life Science and Wellness"
            className="w-full h-full object-cover brightness-[.6] dark:brightness-[.4] transition-all duration-700 ease-in-out"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 dark:to-black/70" />
        </motion.div>

        {/* Глассморфический блок контента */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
          style={{ opacity: useTransform(useScroll().scrollY, [0, 400], [1, 0]) }}
          className="relative z-10 p-8 md:p-12 lg:p-16 bg-white/10 dark:bg-black/10 backdrop-blur-xl rounded-3xl shadow-glass border border-white/20 dark:border-white/10 text-center max-w-4xl mx-auto transform hover:shadow-glass-lg transition-all duration-500 ease-in-out"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.7, ease: "easeOut" }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tighter shadow-text-lg"
          >
            Раскройте Потенциал <span className="text-blue-300 dark:text-blue-400">Вашего Иммунитета</span> с 4Life
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.7, ease: "easeOut" }}
            className="mt-6 text-lg md:text-xl text-gray-100 dark:text-gray-200 leading-relaxed max-w-3xl mx-auto shadow-text-md"
          >
            Инвестируйте в качество жизни, ясность ума и энергию каждого дня.
            Начните свое преображение с передовыми Трансфер Факторами и научным подходом к здоровью.
          </motion.p>

          <div className="mt-10 flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <CallToAction
              primaryButtonText="Узнать, как приобрести продукцию"
              primaryButtonLink="/how-to-buy"
              primaryButtonIcon={Icons.ShoppingCart}
              secondaryButtonText="Исследовать продукты"
              secondaryButtonLink="/products"
              secondaryButtonIcon={Icons.FlaskConical}
              isExternal={false}
              className="mt-0"
            />
          </div>
        </motion.div>
      </motion.section>

      {/* About Us Section */}
      <section className="py-16 md:py-24 bg-white dark:bg-gray-900 relative">
        <div className="container mx-auto px-4 relative z-10">
          <SectionHeading
            title="О нас: Ваше путешествие к здоровью с 4Life"
            subtitle="Наука, успех, сервис — вместе строим жизнь"
          />

          <div className="flex flex-col lg:flex-row items-center gap-12 mt-12">
            {/* Image / Visual */}
            <motion.div
              className="lg:w-1/2"
              variants={itemVariants}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="w-full h-64 bg-gray-200 dark:bg-gray-700 rounded-xl shadow-2xl flex items-center justify-center">
                <span className="text-gray-500 dark:text-gray-400">Изображение не найдено</span>
              </div>
            </motion.div>

            {/* Content */}
            <motion.div
              className="lg:w-1/2 text-left"
              variants={itemVariants}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
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
                    <h4 className="font-semibold text-gray-800 dark:text-white text-md">Бизнес и развитие</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Возможности для построения успешного бизнеса.
                    </p>
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
              <motion.div className="bg-gray-50 rounded-lg p-8 shadow-md text-left" variants={itemVariants}>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Наша миссия</h3>
                <p className="text-gray-700 mb-4">
                  Мы стремимся помочь каждому человеку достичь оптимального здоровья и благополучия через научно
                  обоснованные продукты и создание возможностей для финансовой независимости.
                </p>
                <p className="text-gray-700">
                  Наш подход основан на сочетании инновационных разработок в области трансфер-факторов и личной
                  поддержки каждого клиента и партнера.
                </p>
              </motion.div>

              <motion.div className="bg-gray-50 rounded-lg p-8 shadow-md text-left" variants={itemVariants}>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">О Александре Тощеве</h3>
                <p className="text-gray-700 mb-4">
                  Сертифицированный консультант по продуктам 4Life с более чем 10-летним опытом работы. Достиг статуса
                  Gold Leader и создал успешную команду партнеров по всей России.
                </p>
                <p className="text-gray-700">
                  Моя цель — помочь каждому клиенту найти оптимальное решение для укрепления здоровья, а каждому
                  партнеру — раскрыть свой потенциал и достичь финансовых целей.
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
              <div>
                <h3 className="text-2xl font-bold mb-4">Контакты</h3>
                <ul className="space-y-4">
                  <li>
                    <div className="btn-primary flex items-center gap-2 transition-transform hover:scale-105 active:scale-95 space-x-3">
                      <Phone className="w-6 h-6 text-primary" />
                      <a href="tel:+79276245790" className="text-gray-800 hover:text-primary">
                        +7 (927) 624-57-90
                      </a>
                    </div>
                  </li>
                  <li>
                    <div className="btn-primary flex items-center gap-2 transition-transform hover:scale-105 active:scale-95 space-x-3">
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

// Экспортируем компонент по умолчанию
export default HomePage;
