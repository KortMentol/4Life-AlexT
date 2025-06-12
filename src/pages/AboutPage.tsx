import { motion } from "framer-motion";
import { FlaskConical, Headphones, TrendingUp } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { containerVariants, itemVariants } from "../animations/variants";
import CallToAction from "../components/ui/CallToAction";
import SectionHeading from "../components/ui/SectionHeading";

const AboutPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>
          О 4Life - Наука, Миссия и Ваше Будущее с Александром Тощевым
        </title>
        <meta
          name="description"
          content="Узнайте о научном подходе 4Life к здоровью и благополучию. Инновационные продукты с Трансфер Факторами для укрепления иммунитета."
        />
        <meta
          property="og:title"
          content="О 4Life - Наука, Миссия и Ваше Будущее с Александром Тощевым"
        />
        <meta
          property="og:description"
          content="Узнайте о научном подходе 4Life к здоровью и благополучию. Инновационные продукты с Трансфер Факторами для укрепления иммунитета."
        />
        <meta property="og:image" content="/images/og-about.jpg" />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://alexander-toshchev-4life.ru/about"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="О 4Life - Наука, Миссия и Ваше Будущее с Александром Тощевым"
        />
        <meta
          name="twitter:description"
          content="Узнайте о научном подходе 4Life к здоровью и благополучию. Инновационные продукты с Трансфер Факторами для укрепления иммунитета."
        />
        <meta name="twitter:image" content="/images/og-about.jpg" />
      </Helmet>
      <div className="min-h-screen text-gray-800 dark:text-gray-200 relative">
        {/* Hero Section */}
        <section className="relative py-24 md:py-32 bg-gradient-to-br from-blue-100/0 to-indigo-200/0 dark:from-gray-800/0 dark:to-gray-900/0 text-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent dark:from-black/30 dark:to-transparent z-0"></div>
          <div
            className="absolute inset-0 z-0 opacity-30"
            style={{
              backgroundImage: "url(https://i.ibb.co/Yc53L8w/hero-pattern.png)",
              backgroundRepeat: "repeat",
              backgroundSize: "contain",
            }}
          ></div>
          <div className="container mx-auto px-4 relative z-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px 0px" }}
              transition={{ duration: 0.6 }}
              className="relative z-10"
            >
              <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight mb-4 drop-shadow-lg">
                О 4Life: Наука, Миссия и Ваше Будущее
              </h1>
            </motion.div>
            <motion.p
              className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto"
              variants={itemVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
            >
              Узнайте о научном подходе 4Life к здоровью и благополучию.
              Инновационные продукты с Трансфер Факторами для укрепления
              иммунитета.
            </motion.p>
          </div>
        </section>

        {/* Science Section */}
        <section className="py-16 md:py-24 bg-white/0 dark:bg-gray-800/0 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-white/50 to-transparent dark:from-black/20 dark:to-transparent z-0"></div>
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px 0px" }}
              transition={{ duration: 0.5 }}
              className="relative z-10"
            >
              <SectionHeading
                title="Научный подход 4Life"
                subtitle="Инновации на основе научных исследований"
              />
            </motion.div>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 relative z-10"
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-50px 0px" }}
            >
              {/* Элемент 1 */}
              <motion.div
                className="bg-gray-100 dark:bg-gray-900 p-6 rounded-lg shadow-md"
                variants={itemVariants}
              >
                <FlaskConical className="h-12 w-12 text-blue-500 mb-4" />
                <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-2">
                  Научные исследования
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Все продукты 4Life разрабатываются на основе глубоких научных
                  исследований и клинических испытаний.
                </p>
              </motion.div>
              {/* Элемент 2 */}
              <motion.div
                className="bg-gray-100 dark:bg-gray-900 p-6 rounded-lg shadow-md"
                variants={itemVariants}
              >
                <TrendingUp className="h-12 w-12 text-green-500 mb-4" />
                <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-2">
                  Непрерывное развитие
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Компания постоянно инвестирует в научные изыскания для
                  создания все более эффективных решений.
                </p>
              </motion.div>
              {/* Элемент 3 */}
              <motion.div
                className="bg-gray-100 dark:bg-gray-900 p-6 rounded-lg shadow-md"
                variants={itemVariants}
              >
                <Headphones className="h-12 w-12 text-purple-500 mb-4" />
                <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-2">
                  Персонализированный подход
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Наши продукты разработаны с учетом индивидуальных потребностей
                  каждого человека.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Финальный CTA */}
        <CallToAction
          title="Хотите узнать больше о 4Life?"
          description="Свяжитесь со мной, и я расскажу вам о научном подходе компании и ее уникальных продуктах."
          primaryButtonText="Получить консультацию"
          primaryButtonLink="/contact"
          secondaryButtonText="Узнать о продуктах"
          secondaryButtonLink="/products"
        />
      </div>
    </>
  );
};

export default AboutPage;
