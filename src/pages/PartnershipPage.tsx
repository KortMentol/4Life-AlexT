import { motion } from "framer-motion";
import { ArrowRight, Award, Clock, DollarSign, Lightbulb } from "lucide-react";
import { FC } from "react";
import { Helmet } from "react-helmet-async";
import { Tilt } from "react-tilt";
import {
  headingVariants,
  itemVariants,
  staggerContainer,
} from "../animations/variants";
import CallToAction from "../components/ui/CallToAction";
import SectionHeading from "../components/ui/SectionHeading";

type PartnershipPageProps = object;

const PartnershipPage: FC<PartnershipPageProps> = () => {
  return (
    <>
      <Helmet>
        <title>
          Партнерство 4Life - Стать частью команды Александра Тощева
        </title>
        <meta
          name="description"
          content="Узнайте о возможностях партнерства с 4Life и Александром Тощевым. Стабильный доход, профессиональный рост и поддержка опытного лидера."
        />
        <meta
          property="og:title"
          content="Партнерство 4Life - Стать частью команды Александра Тощева"
        />
        <meta
          property="og:description"
          content="Узнайте о возможностях партнерства с 4Life и Александром Тощевым. Стабильный доход, профессиональный рост и поддержка опытного лидера."
        />
        <meta property="og:image" content="/images/og-partnership.jpg" />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://alexander-toshchev-4life.ru/partnership"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Партнерство 4Life - Стать частью команды Александра Тощева"
        />
        <meta
          name="twitter:description"
          content="Узнайте о возможностях партнерства с 4Life и Александром Тощевым. Стабильный доход, профессиональный рост и поддержка опытного лидера."
        />
        <meta name="twitter:image" content="/images/og-partnership.jpg" />
      </Helmet>
      <div className="min-h-screen text-gray-800 dark:text-gray-200">
        {/* Hero Section */}
        <section className="relative py-24 md:py-32 bg-gradient-to-br from-purple-100/70 to-pink-200/70 dark:from-gray-800/70 dark:to-gray-900/70 text-center overflow-hidden">
          <div
            className="absolute inset-0 z-0 opacity-30"
            style={{
              backgroundImage: "url(https://i.ibb.co/Yc53L8w/hero-pattern.png)",
              backgroundRepeat: "repeat",
              backgroundSize: "contain",
            }}
          />
          <div className="container mx-auto px-4 relative z-10">
            <motion.h1
              className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight mb-4 drop-shadow-lg"
              variants={headingVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
            >
              Станьте Частью Команды 4Life
            </motion.h1>
            <motion.p
              className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto"
              variants={itemVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
            >
              Узнайте о возможностях построения успешного бизнеса с 4Life и
              поддержкой Александра Тощева.
            </motion.p>
          </div>
        </section>

        {/* Секция: Преимущества Партнерства */}
        <section className="py-16 md:py-24 bg-white/70 dark:bg-gray-800/70 relative">
          <div className="container mx-auto px-4 relative z-10">
            <SectionHeading
              title="Преимущества Партнерства"
              subtitle="Почему стоит присоединиться к нашей команде"
            />
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12"
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
            >
              {/* Преимущество 1 */}
              <motion.div
                className="relative z-10"
                variants={itemVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: 1.0 }}
              >
                <Tilt
                  options={{
                    max: 15,
                    perspective: 1000,
                    scale: 1.05,
                    speed: 400,
                    transition: true,
                    reset: true,
                  }}
                >
                  <div className="bg-gray-100 dark:bg-gray-900 p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300">
                    <DollarSign className="h-12 w-12 text-green-500 mb-4" />
                    <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-2">
                      Стабильный Доход
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Возможность создать пассивный доход через систему
                      многоуровневого маркетинга.
                    </p>
                  </div>
                </Tilt>
              </motion.div>
              {/* Преимущество 2 */}
              <motion.div
                className="relative z-10"
                variants={itemVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: 1.2 }}
              >
                <Tilt
                  options={{
                    max: 15,
                    perspective: 1000,
                    scale: 1.05,
                    speed: 400,
                    transition: true,
                    reset: true,
                  }}
                >
                  <div className="bg-gray-100 dark:bg-gray-900 p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300">
                    <Clock className="h-12 w-12 text-blue-500 mb-4" />
                    <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-2">
                      Гибкий График
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Работайте когда удобно, без жесткого графика и привязки к
                      офису.
                    </p>
                  </div>
                </Tilt>
              </motion.div>
              {/* Преимущество 3 */}
              <motion.div
                className="relative z-10"
                variants={itemVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: 1.4 }}
              >
                <Tilt
                  options={{
                    max: 15,
                    perspective: 1000,
                    scale: 1.05,
                    speed: 400,
                    transition: true,
                    reset: true,
                  }}
                >
                  <div className="bg-gray-100 dark:bg-gray-900 p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300">
                    <Award className="h-12 w-12 text-purple-500 mb-4" />
                    <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-2">
                      Профессиональный Рост
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Обучение и развитие навыков лидерства, продаж и управления
                      командой.
                    </p>
                  </div>
                </Tilt>
              </motion.div>
              {/* Преимущество 4 */}
              <motion.div
                className="relative z-10"
                variants={itemVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: 1.6 }}
              >
                <Tilt
                  options={{
                    max: 15,
                    perspective: 1000,
                    scale: 1.05,
                    speed: 400,
                    transition: true,
                    reset: true,
                  }}
                >
                  <div className="bg-gray-100 dark:bg-gray-900 p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300">
                    <Lightbulb className="h-12 w-12 text-yellow-500 mb-4" />
                    <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-2">
                      Инновации
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Работайте с передовыми продуктами и технологиями 4Life.
                    </p>
                  </div>
                </Tilt>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Начните Свой Путь */}
        <section className="py-16 md:py-24 bg-white/70 dark:bg-gray-800/70">
          <div className="container mx-auto px-4 text-center">
            <SectionHeading
              title="Начните Свой Путь к Успеху"
              subtitle="Свяжитесь со мной, чтобы узнать, как присоединиться к 4Life."
            />
            <motion.div
              className="flex flex-col lg:flex-row-reverse items-center gap-12 mt-12"
              variants={itemVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
            >
              <motion.div
                className="lg:w-1/2 relative z-10"
                variants={itemVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: 0.2 }}
              >
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                  Стать партнером 4Life легко. Свяжитесь со мной, и я расскажу
                  вам о первых шагах, помогу зарегистрироваться и начать
                  обучение. Не упустите свой шанс построить успешную карьеру в
                  индустрии здоровья и благополучия.
                </p>
                <motion.a
                  href="/contact"
                  className="btn btn-primary text-lg px-8 py-4 inline-flex items-center space-x-2 group"
                  variants={itemVariants}
                  initial="hidden"
                  animate="show"
                  transition={{ delay: 1.0 }}
                >
                  <span>Связаться и начать</span>
                  <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </motion.a>
              </motion.div>
              <motion.div
                className="lg:w-1/2 relative z-10"
                variants={itemVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: 0.4 }}
              >
                <img
                  src="https://i.ibb.co/jGGmH1Q/4life-partnership-benefits.jpg"
                  alt="Начните свой путь с 4Life"
                  className="rounded-xl shadow-2xl w-full h-auto object-cover"
                  loading="lazy"
                />
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Финальный CTA */}
        <CallToAction
          title="Готовы к новому этапу в своей жизни?"
          description="Свяжитесь со мной, чтобы обсудить ваши возможности в 4Life."
          primaryButtonText="Стать партнером"
          primaryButtonLink="/contact"
          secondaryButtonText="Узнать о продуктах"
          secondaryButtonLink="/products"
        />
      </div>
    </>
  );
};

export default PartnershipPage;
