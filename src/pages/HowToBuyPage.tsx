import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Helmet } from "react-helmet-async";

import SectionHeading from "../components/ui/SectionHeading";

// 2. Определение функционального компонента HowToBuyPage
const HowToBuyPage = () => {
  // 3. Определение вариантов анимаций для Framer Motion
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  const buttonVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
  };

  // 4. JSX-разметка компонента
  return (
    <>
      {/* 5. Настройка мета-тегов страницы для SEO с помощью Helmet */}
      <Helmet>
        <title>Как приобрести продукцию 4Life - Александр Тощев</title>
        <meta
          name="description"
          content="Узнайте, как легко приобрести продукцию 4Life в статусе Приоритетного Клиента и получить доступ к скидкам. Свяжитесь для консультации."
        />
        <meta property="og:title" content="Как приобрести продукцию 4Life - Александр Тощев" />
        <meta
          property="og:description"
          content="Узнайте, как легко приобрести продукцию 4Life в статусе Приоритетного Клиента и получить доступ к скидкам. Свяжитесь для консультации."
        />
        <meta property="og:image" content="https://ВАШ_ДОМЕН.ru/images/og-purchase.jpg" />{" "}
        {/* ЗАМЕНИТЬ НА РЕАЛЬНУЮ КАРТИНКУ */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ВАШ_ДОМЕН.ru/purchase" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Как приобрести продукцию 4Life - Александр Тощев" />
        <meta
          name="twitter:description"
          content="Узнайте, как легко приобрести продукцию 4Life в статусе Приоритетного Клиента и получить доступ к скидкам. Свяжитесь для консультации."
        />
        <meta name="twitter:image" content="https://ВАШ_ДОМЕН.ru/images/og-purchase.jpg" />{" "}
        {/* ЗАМЕНИТЬ НА РЕАЛЬНУЮ КАРТИНКУ */}
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://ВАШ_ДОМЕН.ru/purchase" /> {/* ЗАМЕНИТЬ НА РЕАЛЬНЫЙ ДОМЕН */}
      </Helmet>

      {/* Основная секция страницы */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-white min-h-[calc(100vh-var(--header-height)-var(--footer-height))] flex items-center justify-center">
        <div className="container mx-auto px-4 max-w-4xl mt-16 md:mt-20">
          {/* Анимированный контейнер для всего содержимого страницы */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="bg-white dark:bg-gray-700 rounded-lg shadow-2xl p-8 md:p-12 border border-gray-200 dark:border-gray-600 backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90 text-center"
          >
            {/* Заголовок секции с описанием */}
            <SectionHeading
              title="Приобретение продукции 4Life"
              description="Получите доступ к эксклюзивным скидкам и преимуществам, став Приоритетным Клиентом 4Life через мой ID. Это быстро и просто!"
              centered={true}
            />

            {/* Блок с инструкциями и ID */}
            <div className="flex flex-col items-center space-y-8">
              <motion.div variants={itemVariants} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl relative z-10">
                <p className="mb-4">
                  Для максимально выгодного приобретения продукции 4Life и получения доступа к специальным ценам, я
                  рекомендую зарегистрироваться в статусе **Приоритетного Клиента**. Это бесплатная регистрация, которая
                  позволит вам покупать напрямую у компании, используя мой дистрибьюторский ID.
                </p>
                <p className="mb-4 font-semibold text-blue-600 dark:text-blue-400">Мой ID: 12299550</p>
                <p>
                  Вы можете зарегистрироваться, перейдя по прямой ссылке, или связаться со мной для получения подробной
                  консультации и помощи с регистрацией.
                </p>
              </motion.div>

              {/* Контейнер для кнопок призыва к действию */}
              <div className="flex flex-col md:flex-row gap-4 w-full justify-center mt-6">
                {/* Кнопка 1: Регистрация Приоритетного Клиента */}
                <motion.a
                  href="https://russia.4life.com/12299550/signup/PC"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white font-bold rounded-lg shadow-xl hover:bg-blue-700 transition-all duration-300 transform group text-lg md:text-xl flex-1 max-w-xs md:max-w-none"
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  Зарегистрироваться как Приоритетный Клиент{" "}
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </motion.a>

                {/* Кнопка 2: Перейти в магазин с ID */}
                <motion.a
                  href="https://russia.4life.com/12299550"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-8 py-4 bg-gray-200 text-gray-800 font-semibold rounded-lg shadow-lg hover:bg-gray-300 transition-all duration-300 transform group text-lg md:text-xl flex-1 max-w-xs md:max-w-none dark:bg-gray-800 dark:text-white dark:hover:bg-gray-900"
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  Перейти в мой магазин 4Life{" "}
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </motion.a>
              </div>

              {/* Блок для консультации */}
              <motion.div variants={itemVariants} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mt-8 relative z-10">
                <p className="mb-4">
                  Если у вас возникнут вопросы по выбору продукции, процессу регистрации или вы захотите обсудить
                  преимущества продуктов более подробно, не стесняйтесь связаться со мной.
                </p>
                <motion.a
                  href="/contact"
                  className="inline-flex items-center justify-center px-6 py-3 bg-purple-600 text-white font-bold rounded-lg shadow-md hover:bg-purple-700 transition-all duration-300 transform group text-base md:text-lg"
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  Получить консультацию{" "}
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </motion.a>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default HowToBuyPage;
