import { 
  Phone, 
  Mail, 
  Shield, 
  HeartHandshake, 
  DollarSign, 
  ArrowRight, 
  Microscope, 
  Globe, 
  Briefcase, 
  FlaskConical, 
  Handshake as LucideHandshake,
  Zap
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { fadeIn, fadeInFromBottom, fadeInFromTop, fadeInFromLeft, fadeInFromRight } from "../lib/animations";
import SectionHeading from "../components/ui/SectionHeading";
import TestimonialCard from "../components/ui/TestimonialCard";

const testimonials = [
  {
    id: "testimonial-home-elena",
    image: "/images/avatar-elena.webp",
    name: "Елена",
    title: "Пенсионерка, 48 лет",
    quote: "После курса 4Life Transfer Factor Tri-Factor Formula заметила значительное улучшение общего самочувствия. Раньше часто болела простудами, теперь это стало редкостью. Особенно впечатлил эффект после поездки в командировку – обычно возвращалась с простудой, а в этот раз осталась в отличной форме.",
    delay: 0.2
  },
  {
    id: "testimonial-home-dmitry",
    image: "/images/avatar-dmitry.webp",
    name: "Дмитрий",
    title: "Спортсмен, 35 лет",
    quote: "Как спортсмен, я всегда ищу натуральные способы поддержки организма. 4Life Transfer Factor Plus стал для меня настоящим открытием. После интенсивных тренировок восстанавливаюсь быстрее, и энергия держится весь день.",
    delay: 0.4
  },
  {
    id: "testimonial-home-anna",
    image: "/images/avatar-anna.webp",
    name: "Анна",
    title: "Мама, 38 лет",
    quote: "Я принимаю Трансфер Фактор Плюс уже больше года. За это время я заметила значительное улучшение общего самочувствия и стрессоустойчивости. Особенно заметна разница в осенне-зимний период - в то время как коллеги часто болеют, я продолжаю активно работать. Очень благодарна Александру за подробную консультацию по продукту.",
    delay: 0.6
  }
];

const HomePage = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center text-center overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        {/* Background Visual - Dynamic/Animated */}
        <div
          className="absolute inset-0 z-0 opacity-40"
          style={{
            backgroundImage: "url('https://i.ibb.co/Yc53L8w/hero-pattern.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            animation: 'pan 30s linear infinite alternate',
          }}
        />

        {/* Content */}
        <div className="relative z-10 px-4 max-w-4xl mx-auto">
          <motion.h1
            className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight mb-6 drop-shadow-lg"
            variants={fadeInFromTop}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0 }}
          >
            Проснись{" "}
            <span className="text-primary block md:inline">полным энергии, ясности ума</span>{" "}
            и желания творить великие дела с <span className="text-4life-blue">4Life</span>
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto"
            variants={fadeInFromBottom}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Инвестируй в свое здоровье сегодня, чтобы наслаждаться каждым днем полноценно и счастливо. 
            Мы поможем тебе раскрыть жизненную силу и обрести новые возможности.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-12"
            variants={fadeInFromBottom}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Link to="/purchase" className="btn btn-primary text-lg px-8 py-4 flex items-center space-x-3 group">
                <span>Приобрести продукцию 4Life</span>
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Link to="/partnership" className="btn btn-outline text-lg px-8 py-4 flex items-center space-x-3 group">
                <span>Узнать о партнерстве</span>
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </motion.div>
          </motion.div>

          {/* Key Benefits / Value Proposition */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.9, duration: 0.8 }}
          >
            <motion.div
              className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm p-6 rounded-xl shadow-lg flex flex-col items-center text-center border border-gray-200 dark:border-gray-700"
              variants={fadeInFromBottom}
              transition={{ delay: 1.0, duration: 0.6 }}
            >
              <Shield className="h-10 w-10 text-primary mb-3" />
              <h3 className="font-semibold text-lg text-gray-800 dark:text-white">Крепкий Иммунитет</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Научная поддержка вашей защиты.</p>
            </motion.div>

            <motion.div
              className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm p-6 rounded-xl shadow-lg flex flex-col items-center text-center border border-gray-200 dark:border-gray-700"
              variants={fadeInFromBottom}
              transition={{ delay: 1.2, duration: 0.6 }}
            >
              <Zap className="h-10 w-10 text-yellow-500 mb-3" />
              <h3 className="font-semibold text-lg text-gray-800 dark:text-white">Поток Энергии</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Каждый день полон новых возможностей.</p>
            </motion.div>

            <motion.div
              className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm p-6 rounded-xl shadow-lg flex flex-col items-center text-center border border-gray-200 dark:border-gray-700"
              variants={fadeInFromBottom}
              transition={{ delay: 1.4, duration: 0.6 }}
            >
              <HeartHandshake className="h-10 w-10 text-red-500 mb-3" />
              <h3 className="font-semibold text-lg text-gray-800 dark:text-white">Помощь и Развитие</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Наставничество на пути к успеху.</p>
            </motion.div>

            <motion.div
              className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm p-6 rounded-xl shadow-lg flex flex-col items-center text-center border border-gray-200 dark:border-gray-700"
              variants={fadeInFromBottom}
              transition={{ delay: 1.6, duration: 0.6 }}
            >
              <DollarSign className="h-10 w-10 text-green-500 mb-3" />
              <h3 className="font-semibold text-lg text-gray-800 dark:text-white">Финансовые Возможности</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Стройте большой бизнес с 4Life.</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-16 md:py-24 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="О нас: Ваше путешествие к здоровью с 4Life"
            subtitle="Наука, успех, сервис — вместе строим жизнь"
          />

          <div className="flex flex-col lg:flex-row items-center gap-12 mt-12">
            {/* Image / Visual */}
            <motion.div
              className="lg:w-1/2"
              variants={fadeInFromLeft}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              <img
                src="https://i.ibb.co/VDy9JgJ/about-us-4life.jpg"
                alt="Путешествие с 4Life"
                className="rounded-xl shadow-2xl w-full h-auto object-cover transform hover:scale-102 transition-transform duration-500"
              />
            </motion.div>

            {/* Content */}
            <motion.div
              className="lg:w-1/2 text-left"
              variants={fadeInFromRight}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-6">
                Впервые услышав о трансфер факторах более двадцати лет назад, мы пустились в увлекательное путешествие, которое изменило нашу жизнь и жизни тысяч людей по всему миру. Трансфер факторы — это уникальные молекулы, передающие ценные иммунные знания и память между клетками организма, что является революцией в области иммунной системы.
              </p>
              <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-8">
                С 1998 года 4Life выросла в активно развивающуюся сеть людей, объединенных миссией 'Вместе Строить Жизнь' посредством науки, успеха и сервиса. Мы заслужили репутацию компании, которая идет по пути новаторства, научных исследований в области иммунологии, и общей поддержки здоровья.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div
                  className="flex items-start space-x-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow-sm"
                  variants={fadeInFromBottom}
                  transition={{ delay: 0.2, duration: 0.6 }}
                >
                  <Microscope className="text-primary h-6 w-6 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-white text-md">Научные исследования и патенты</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">В основе всех продуктов 4Life лежит глубокая научная база.</p>
                  </div>
                </motion.div>
                <motion.div
                  className="flex items-start space-x-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow-sm"
                  variants={fadeInFromBottom}
                  transition={{ delay: 0.4, duration: 0.6 }}
                >
                  <Globe className="text-blue-500 h-6 w-6 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-white text-md">Мировая компания с миссией</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Объединяем людей по всему миру для лучшей жизни.</p>
                  </div>
                </motion.div>
                <motion.div
                  className="flex items-start space-x-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow-sm"
                  variants={fadeInFromBottom}
                  transition={{ delay: 0.6, duration: 0.6 }}
                >
                  <Shield className="text-green-500 h-6 w-6 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-white text-md">Гарантия качества и безопасности</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Все продукты проходят строгий контроль качества.</p>
                  </div>
                </motion.div>
                <motion.div
                  className="flex items-start space-x-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow-sm"
                  variants={fadeInFromBottom}
                  transition={{ delay: 0.8, duration: 0.6 }}
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

      {/* Testimonials Section */}
      <section className="section bg-gray-50">
        <div className="container-custom">
          <SectionHeading title="Реальные Истории Успеха" centered />
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-lg text-gray-700 mb-8">
              Эти люди нашли поддержку здоровья и новые возможности благодаря продукции 4Life и профессионализму Александра Тощева.
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial) => (
                <motion.div
                  key={testimonial.id}
                  variants={fadeIn}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                  custom={testimonial.delay}
                >
                  <TestimonialCard
                    name={testimonial.name}
                    image={testimonial.image}
                    title={testimonial.title}
                    quote={testimonial.quote}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="section bg-white">
        <div className="container-custom">
          <SectionHeading title="Свяжитесь со мной" centered />
          <motion.div
            className="max-w-4xl mx-auto text-center"
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
                <p className="text-gray-700 mb-4">
                  г. Уфа, ул. З. Валиди, д. 10/1
                </p>
                <p className="text-gray-700 mb-4">
                  Район: Центральный
                </p>
                <p className="text-gray-700">
                  Метро: Салават Куждабаев
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">4Life с Александром Тощевым</h3>
              <p className="text-gray-400">
                Помогаем людям улучшить здоровье и построить успешный бизнес с помощью продукции 4Life.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Навигация</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="text-gray-400 hover:text-white">Главная</Link>
                </li>
                <li>
                  <Link to="/products" className="text-gray-400 hover:text-white">Продукты</Link>
                </li>
                <li>
                  <Link to="/partnership" className="text-gray-400 hover:text-white">Партнерство</Link>
                </li>
                <li>
                  <Link to="/testimonials" className="text-gray-400 hover:text-white">Отзывы</Link>
                </li>
                <li>
                  <Link to="/contact" className="text-gray-400 hover:text-white">Контакты</Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Социальные сети</h3>
              <div className="flex space-x-4">
                <a href="https://t.me/alexander_toschev" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                  <LucideHandshake className="h-6 w-6" />
                </a>
                <a href="https://instagram.com/alexander_toschev" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                  <FlaskConical className="h-6 w-6" />
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} 4Life с Александром Тощевым. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default HomePage;
