import { motion } from "framer-motion";
import { Award, BookOpen, Heart, Users } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { containerVariants, itemVariants } from "../animations/variants";
import CallToAction from "../components/ui/CallToAction";
import SectionHeading from "../components/ui/SectionHeading";

const AboutMePage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Обо мне - Александр Тощев | Независимый Дистрибьютор 4Life</title>
        <meta
          name="description"
          content="Александр Тощев - независимый дистрибьютор 4Life. Мой путь к здоровью и как я помогаю другим улучшить качество жизни с помощью продуктов 4Life."
        />
        <meta property="og:title" content="Обо мне - Александр Тощев | Независимый Дистрибьютор 4Life" />
        <meta
          property="og:description"
          content="Александр Тощев - независимый дистрибьютор 4Life. Мой путь к здоровью и как я помогаю другим улучшить качество жизни."
        />
        <meta property="og:image" content="/images/og-about-me.jpg" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://alexander-toshchev-4life.ru/about-me" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <div className="min-h-screen text-gray-800 dark:text-gray-200 relative">
        {/* Hero Section */}
        <section className="relative py-24 md:py-32 bg-gradient-to-br from-blue-100/70 to-indigo-200/70 dark:from-gray-800/70 dark:to-gray-900/70 text-center overflow-hidden">
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
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-900 dark:text-white">Обо мне</h1>
              <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
                Мой путь к здоровью и как я помогаю другим достичь благополучия
              </p>
            </motion.div>
          </div>
        </section>

        {/* My Story Section */}
        <section className="py-16 md:py-24 bg-white/70 dark:bg-gray-800/70">
          <div className="container mx-auto px-4">
            <SectionHeading title="Моя история" subtitle="Как всё начиналось" className="text-center mb-12" />
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px 0px" }}
              className="max-w-4xl mx-auto"
            >
              <motion.div variants={itemVariants} className="mb-8">
                <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-6">
                  Всё началось с моего собственного пути к здоровью. Столкнувшись с проблемами самочувствия, я начал
                  искать натуральные способы укрепления организма. Так я открыл для себя 4Life и трансфер-факторы,
                  которые изменили мою жизнь.
                </p>
                <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300">
                  Увидев потрясающие результаты на себе, я понял, что должен делиться этим знанием с другими. Теперь я
                  помогаю людям обрести здоровье, энергию и улучшить качество жизни с помощью инновационных продуктов
                  4Life.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* My Values Section */}
        <section className="py-16 md:py-24 bg-gray-50/70 dark:bg-gray-900/70">
          <div className="container mx-auto px-4">
            <SectionHeading title="Мои ценности" subtitle="Во что я верю" className="text-center mb-12" />
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px 0px" }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              {[
                {
                  icon: <Heart className="w-12 h-12 text-red-500 mb-4 mx-auto" />,
                  title: "Здоровье",
                  description: "Верю, что здоровье - это основа счастливой и полноценной жизни.",
                },
                {
                  icon: <BookOpen className="w-12 h-12 text-blue-500 mb-4 mx-auto" />,
                  title: "Образование",
                  description: "Учусь постоянно и делюсь знаниями о здоровом образе жизни.",
                },
                {
                  icon: <Users className="w-12 h-12 text-green-500 mb-4 mx-auto" />,
                  title: "Сообщество",
                  description: "Создаю поддерживающее сообщество единомышленников.",
                },
                {
                  icon: <Award className="w-12 h-12 text-yellow-500 mb-4 mx-auto" />,
                  title: "Качество",
                  description: "Использую и рекомендую только проверенные продукты высочайшего качества.",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="card-above-fluid p-6 rounded-xl shadow-lg text-center"
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <div className="mb-4">{item.icon}</div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{item.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{item.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Why I Do This Section */}
        <section className="py-16 md:py-24 bg-white/70 dark:bg-gray-800/70">
          <div className="container mx-auto px-4">
            <SectionHeading title="Почему я это делаю" subtitle="Моя миссия" className="text-center mb-12" />
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px 0px" }}
              className="max-w-4xl mx-auto"
            >
              <motion.div variants={itemVariants} className="mb-8">
                <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-6">
                  Я верю, что каждый заслуживает жить полной, здоровой и счастливой жизнью. Моя миссия - помогать людям
                  обретать здоровье через образование и качественные продукты 4Life.
                </p>
                <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300">
                  Присоединяйтесь ко мне в этом путешествии к лучшей версии себя. Вместе мы сможем достичь невероятных
                  результатов и создать сообщество здоровых и счастливых людей.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Call to Action */}
        <CallToAction
          title="Готовы начать свой путь к здоровью?"
          buttonText="Связаться со мной"
          buttonLink="/contact"
          className="bg-gradient-to-r from-blue-600/90 to-indigo-700/90 relative z-10"
        />
      </div>
    </>
  );
};

export default AboutMePage;
