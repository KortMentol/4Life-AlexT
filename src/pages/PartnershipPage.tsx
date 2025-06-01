import { motion } from 'framer-motion';
import SectionHeading from '../components/ui/SectionHeading';
import CallToAction from '../components/ui/CallToAction';
import { DollarSign, Clock, Award, Lightbulb, ArrowRight } from 'lucide-react';
import { itemVariants } from '../animations/variants';

const PartnershipPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 bg-gradient-to-br from-purple-100 to-pink-200 dark:from-gray-800 dark:to-gray-900 text-center overflow-hidden">
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
            Партнерство с 4Life: Ваши Возможности Роста
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            Откройте для себя путь к финансовой свободе и личному развитию.
          </motion.p>
        </div>
      </section>

      {/* Бизнес-возможности с 4Life */}
      <section className="py-16 md:py-24 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Бизнес-возможности с 4Life: Постройте свой успешный бизнес"
            subtitle="Гибкий путь к финансовой независимости и личному росту."
          />
          <motion.div
            className="flex flex-col lg:flex-row items-center gap-12 mt-12"
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.div className="lg:w-1/2" variants={itemVariants} initial="hidden" animate="visible">
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                4Life предлагает уникальную возможность не только улучшить свое здоровье, но и построить прибыльный,
                устойчивый бизнес. Наша бизнес-модель основана на сетевом маркетинге, который позволяет вам получать
                доход от продвижения продукции 4Life и построения собственной команды.
              </p>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                Это гибкий путь к финансовой независимости, который подходит каждому, независимо от опыта. Вы будете
                получать поддержку на каждом этапе, развивать лидерские качества и влиять на жизни других людей.
              </p>
            </motion.div>
            <motion.div className="lg:w-1/2" variants={itemVariants} initial="hidden" animate="visible">
              <img
                src="https://images.pexels.com/photos/3184433/pexels-photo-3184433.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                alt="Сотрудничество и партнерство"
                className="rounded-xl shadow-2xl w-full h-auto object-cover"
                loading="lazy"
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Преимущества Партнерства */}
      <section className="py-16 md:py-24 bg-gray-100 dark:bg-gray-900">
        <div className="container mx-auto px-4 text-center">
          <SectionHeading
            title="Что вы получите, став партнером 4Life"
            subtitle="Инструменты и поддержка для вашего успеха."
          />
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12"
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            {/* Преимущество 1 */}
            <motion.div
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex flex-col items-center text-center"
              variants={itemVariants}
              initial="hidden"
              animate="visible"
            >
              <DollarSign className="h-10 w-10 text-emerald-500 mb-4" />
              <h3 className="font-bold text-xl text-gray-800 dark:text-white mb-2">Высокий Потенциал Дохода</h3>
              <p className="text-gray-600 dark:text-gray-400">
                4Life предлагает щедрый компенсационный план, позволяющий получать до 64% от прибыли компании.
              </p>
            </motion.div>
            {/* Преимущество 2 */}
            <motion.div
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex flex-col items-center text-center"
              variants={itemVariants}
              transition={{ delay: 0.4 }}
            >
              <Clock className="h-10 w-10 text-yellow-500 mb-4" />
              <h3 className="font-bold text-xl text-gray-800 dark:text-white mb-2">Гибкий График и Свобода</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Работайте тогда, когда вам удобно, из любой точки мира. Вы сами себе начальник.
              </p>
            </motion.div>
            {/* Преимущество 3 */}
            <motion.div
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex flex-col items-center text-center"
              variants={itemVariants}
              transition={{ delay: 0.6 }}
            >
              <Award className="h-10 w-10 text-red-500 mb-4" />
              <h3 className="font-bold text-xl text-gray-800 dark:text-white mb-2">
                Персональная Поддержка и Обучение
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Вы получите все необходимые инструменты, обучение и наставничество для быстрого старта.
              </p>
            </motion.div>
            {/* Преимущество 4 */}
            <motion.div
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex flex-col items-center text-center"
              variants={itemVariants}
              transition={{ delay: 0.8 }}
            >
              <Lightbulb className="h-10 w-10 text-orange-500 mb-4" />
              <h3 className="font-bold text-xl text-gray-800 dark:text-white mb-2">Инновационная Продукция</h3>
              <motion.a
                href="/products"
                className="text-gray-600 dark:text-gray-400"
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 1.0 }}
              >
                <p>Продвигайте продукты, которые действительно работают и имеют высокий спрос.</p>
              </motion.a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Начните Свой Путь */}
      <section className="py-16 md:py-24 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4 text-center">
          <SectionHeading
            title="Начните Свой Путь к Успеху"
            subtitle="Свяжитесь со мной, чтобы узнать, как присоединиться к 4Life."
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
                Стать партнером 4Life легко. Свяжитесь со мной, и я расскажу вам о первых шагах, помогу
                зарегистрироваться и начать обучение. Не упустите свой шанс построить успешную карьеру в индустрии
                здоровья и благополучия.
              </p>
              <motion.a
                href="/contact"
                className="btn btn-primary text-lg px-8 py-4 inline-flex items-center space-x-2 group"
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 1.0 }}
              >
                <span>Связаться и начать</span>
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </motion.a>
            </motion.div>
            <motion.div className="lg:w-1/2" variants={itemVariants} transition={{ delay: 0.4 }}>
              <img
                src="https://i.ibb.co/jGGmH1Q/4life-partnership-benefits.jpg"
                alt="Начните свой путь с 4Life"
                className="rounded-xl shadow-2xl w-full h-auto object-cover"
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
  );
};

export default PartnershipPage;
