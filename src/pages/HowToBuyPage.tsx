import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Helmet } from "react-helmet-async";

import TextShineEffect from "@/components/layout/TextShineEffect";
import Accordion, { AccordionItem } from "@/components/ui/Accordion";
import { Icons } from "@/utils/icons";
import SectionHeading from "../components/ui/SectionHeading";

// Страница описывает процесс покупки 4Life в 2 шага и преимущества ПК
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

  // Преимущества для Приоритетного Клиента
  const pcBenefits = [
    {
      icon: Icons.BadgePercent,
      title: "Скидка 25% на все продукты",
      desc: "Покупайте напрямую у 4Life по привилегированной цене.",
    },
    {
      icon: Icons.Gift,
      title: "Бонусы и акции",
      desc: "Участвуйте в ежемесячных акциях и получайте подарки.",
    },
    {
      icon: Icons.Truck,
      title: "Доставка по всей России",
      desc: "Быстрая и надёжная доставка в любой регион России.",
    },
  ];

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

      {/* Hero */}
      <section className="relative py-28 md:py-40 bg-gradient-to-br from-blue-50/40 to-purple-100/20 dark:from-gray-800/50 dark:to-gray-900/20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.15),transparent_70%)]" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7 }}
            className="text-4xl md:text-6xl font-extrabold leading-tight mb-6"
          >
            <TextShineEffect text="Как Приобрести Продукты 4Life" duration={8} />
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto"
          >
            Получите лучшие условия и экспертную поддержку, следуя простым шагам.
          </motion.p>
        </div>
      </section>

      {/* Основная секция страницы */}
      <section className="py-16 bg-gradient-to-br from-gray-50/0 to-white/0 dark:from-gray-900/0 dark:to-gray-800/0 text-gray-900 dark:text-white">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Анимированный контейнер для всего содержимого страницы */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="bg-white/0 dark:bg-gray-700/0 rounded-lg shadow-2xl p-8 md:p-12 border border-gray-200/30 dark:border-gray-600/30 backdrop-blur-sm text-center"
          >
            {/* Заголовок секции с описанием */}
            <SectionHeading
              title="Приобретение продукции 4Life"
              description="Получите доступ к эксклюзивным скидкам и преимуществам, став Приоритетным Клиентом 4Life через мой ID. Это быстро и просто!"
              centered={true}
            />

            {/* Блок с инструкциями и ID */}
            <div className="flex flex-col items-center space-y-8">
              <motion.div
                variants={itemVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.3 }}
                className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl relative z-10"
              >
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
              <motion.div
                variants={itemVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.3 }}
                className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mt-8 relative z-10"
              >
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
          {/* Преимущества ПК */}
          <motion.div
            className="mt-20 grid grid-cols-1 sm:grid-cols-2 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
          >
            {pcBenefits.map((card, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="flex items-start p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200/30 dark:border-gray-600/30"
              >
                <card.icon className="w-8 h-8 text-purple-600 flex-shrink-0 mr-4" />
                <div>
                  <h3 className="font-bold text-lg mb-1">{card.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{card.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Шаг 1 */}
          <motion.div
            className="mt-24"
            variants={itemVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
          >
            <SectionHeading
              title="Шаг 1. Станьте Приоритетным Клиентом"
              description="Регистрация займёт 2 минуты и откроет доступ к скидкам и программе лояльности."
              centered
            />
          </motion.div>
          {/* (Кнопки остаются как были) */}

          {/* Шаг 2 */}
          <motion.div
            className="mt-24"
            variants={itemVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
          >
            <SectionHeading
              title="Шаг 2. Как оформить заказ?"
              description="Следуйте простым подсказкам в интерактивном гайде."
              centered
            />

            <Accordion
              className="mt-8"
              items={
                [
                  {
                    id: 1,
                    title: "1. Добавьте продукты в корзину",
                    content: (
                      <p>
                        На странице «Продукты» нажмите «Добавить в корзину» на интересующих позициях. Количество можно
                        изменить в любое время.
                      </p>
                    ),
                  },
                  {
                    id: 2,
                    title: "2. Укажите мой ID 12299550",
                    content: (
                      <p>
                        В форме оформления заказа введите мой ID дистрибьютора, чтобы сохранить скидку и получить
                        персональную поддержку.
                      </p>
                    ),
                  },
                  {
                    id: 3,
                    title: "3. Выберите способ доставки и оплаты",
                    content: (
                      <p>
                        Доступны карта, СБП и другие методы оплаты. Доставка курьером или в пункт выдачи Boxberry /
                        СДЭК.
                      </p>
                    ),
                  },
                  {
                    id: 4,
                    title: "4. Получите подтверждение и наслаждайтесь результатом",
                    content: (
                      <p>После оплаты вы получите трек-номер. Я буду на связи, чтобы ответить на любые вопросы.</p>
                    ),
                  },
                ] as AccordionItem[]
              }
            />
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default HowToBuyPage;
