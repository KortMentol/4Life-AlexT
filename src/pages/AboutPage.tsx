import { motion } from "framer-motion";
import { FlaskConical, Headphones, TrendingUp } from "lucide-react";
import CallToAction from "../components/ui/CallToAction";
import SectionHeading from "../components/ui/SectionHeading";
import { itemVariants } from '../animations/variants';

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 bg-gradient-to-br from-blue-100 to-indigo-200 dark:from-gray-800 dark:to-gray-900 text-center overflow-hidden">
        <div
          className="absolute inset-0 z-0 opacity-30"
          style={{
            backgroundImage: "url(https://i.ibb.co/Yc53L8w/hero-pattern.png)",
            backgroundRepeat: "repeat",
            backgroundSize: "contain",
          }}
        ></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.h1
            className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight mb-4 drop-shadow-lg"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            О 4Life: Наука, Миссия и Ваше Будущее
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            Откройте для себя историю инноваций и стремления к лучшему здоровью для каждого.
          </motion.p>
        </div>
      </section>

      {/* Секция: Наша История и Миссия */}
      <section className="py-16 md:py-24 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Наша История и Миссия: Более 20 лет инноваций в поддержке иммунитета"
            subtitle="С 1998 года мы меняем жизни к лучшему."
          />
          <motion.div
            className="flex flex-col lg:flex-row items-center gap-12 mt-12"
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.div className="lg:w-1/2" variants={itemVariants} transition={{ delay: 0.2 }}>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                Впервые услышав о трансфер факторах более двух десятилетий назад, мы начали увлекательное путешествие,
                которое изменило нашу жизнь и жизни тысяч людей по всему миру. Трансфер факторы — это уникальные
                молекулы, передающие ценные иммунные знания и память между клетками организма.
              </p>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                С 1998 года 4Life превратилась в глобальную сеть людей, объединенных миссией 'Вместе Строить Жизнь'
                посредством науки, успеха и сервиса. Мы заслужили репутацию компании, которая идет по пути новаторства,
                научных исследований в области иммунной системы и общей поддержки здоровья.
              </p>
            </motion.div>
            <motion.div className="lg:w-1/2" variants={itemVariants} transition={{ delay: 0.4 }}>
              <img
                src="https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                alt="Александр Тощев - Лидер 4Life"
                className="rounded-xl shadow-2xl w-full h-auto object-cover"
                loading="lazy"
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Секция: Наши Ценности и Философия */}
      <section className="py-16 md:py-24 bg-gray-100 dark:bg-gray-900">
        <div className="container mx-auto px-4 text-center">
          <SectionHeading
            title="Наши Ценности и Философия: Наука. Успех. Сервис."
            subtitle="Три столпа, на которых строится наш путь."
          />
          <motion.div
            className="flex flex-col lg:flex-row items-center gap-12 mt-12"
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.div className="lg:w-1/2" variants={itemVariants} transition={{ delay: 0.2 }}>
              <img
                src="https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                alt="Ценности 4Life: Наука и инновации"
                className="rounded-xl shadow-2xl w-full h-auto object-cover"
                loading="lazy"
              />
            </motion.div>
            <motion.div
              className="lg:w-1/2 grid grid-cols-1 md:grid-cols-2 gap-8 text-left"
              variants={itemVariants}
              transition={{ delay: 0.4 }}
            >
              {/* Ценность 1 */}
              <motion.div
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex items-start space-x-4"
                variants={itemVariants}
                transition={{ delay: 0.6 }}
              >
                <FlaskConical className="h-8 w-8 text-blue-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-xl text-gray-800 dark:text-white mb-2">Наука</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Мы инвестируем в передовые исследования для создания самых эффективных продуктов. Наши формулы
                    запатентованы и научно обоснованы.
                  </p>
                </div>
              </motion.div>
              {/* Ценность 2 */}
              <motion.div
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex items-start space-x-4"
                variants={itemVariants}
                transition={{ delay: 0.8 }}
              >
                <TrendingUp className="h-8 w-8 text-green-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-xl text-gray-800 dark:text-white mb-2">Успех</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    4Life предоставляет не только продукты, но и возможности для финансовой свободы и личного роста
                    через нашу проверенную бизнес-модель.
                  </p>
                </div>
              </motion.div>
              {/* Ценность 3 */}
              <motion.div
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex items-start space-x-4"
                variants={itemVariants}
                transition={{ delay: 1.0 }}
              >
                <Headphones className="h-8 w-8 text-purple-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-xl text-gray-800 dark:text-white mb-2">Сервис</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Мы стремимся предоставить лучший сервис и поддержку нашим клиентам и партнерам на каждом этапе их
                    пути.
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Секция: 4Life в Мире */}
      <section className="py-16 md:py-24 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="4Life в Мире: Глобальное Присутствие"
            subtitle="Присоединяйтесь к международному сообществу здоровья и успеха."
          />
          <motion.div
            className="flex flex-col lg:flex-row-reverse items-center gap-12 mt-12"
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.div className="lg:w-1/2" variants={itemVariants} transition={{ delay: 0.2 }}>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                4Life – это не просто компания, это глобальное сообщество. Мы представлены в десятках стран по всему
                миру, объединяя миллионы людей, которые стремятся к здоровью и благополучию. Присоединяясь к 4Life, вы
                становитесь частью международной семьи.
              </p>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                Наше видение – мир, где каждый может раскрыть свой потенциал здоровья и построить успешную жизнь с
                поддержкой единомышленников.
              </p>
            </motion.div>
            <motion.div className="lg:w-1/2" variants={itemVariants} transition={{ delay: 0.4 }}>
              <img
                src="https://i.ibb.co/3s8sF5h/4life-global.jpg"
                alt="4Life Глобальное Присутствие"
                className="rounded-xl shadow-2xl w-full h-auto object-cover"
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Финальный CTA */}
      <CallToAction
        title="Готовы начать свое путешествие с 4Life?"
        description="Свяжитесь со мной, чтобы узнать больше о продуктах и возможностях партнерства."
        primaryButtonText="Связаться сейчас"
        primaryButtonLink="/contact"
        secondaryButtonText="Узнать о партнерстве"
        secondaryButtonLink="/partnership"
      />
    </div>
  );
};

export default AboutPage;
