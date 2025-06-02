import { motion } from "framer-motion";
import React from "react";
import { Helmet } from "react-helmet-async";
import { FaEnvelope, FaTelegram, FaWhatsapp } from "react-icons/fa";
import { fadeIn, headingVariants, itemVariants } from "../animations/variants";

const ContactPage: React.FC = () => {
  const contactMethods = [
    {
      name: "WhatsApp",
      icon: FaWhatsapp,
      link: "https://wa.me/79152561177",
      colorClass: "bg-green-500 hover:bg-green-600",
      description: "Мгновенная связь для быстрых вопросов и консультаций.",
    },
    {
      name: "Telegram",
      icon: FaTelegram,
      link: "https://t.me/+79152561177",
      colorClass: "bg-blue-500 hover:bg-blue-600",
      description: "Для развернутых обсуждений и получения подробной информации.",
    },
    {
      name: "Email",
      icon: FaEnvelope,
      link: "mailto:atosotxvnew@gmail.com",
      colorClass: "bg-red-500 hover:bg-red-600",
      description: "Отправьте мне письмо с любыми вопросами или предложениями.",
    },
  ];

  return (
    <>
      <Helmet>
        <title>Свяжитесь с Александром Тощевым - 4Life | Контакты</title>
        <meta
          name="description"
          content="Узнайте, как связаться с Александром Тощевым для консультации по продукции 4Life или возможностям партнерства. Прямые ссылки на WhatsApp, Telegram, Email."
        />
        <meta property="og:title" content="Свяжитесь с Александром Тощевым - 4Life | Контакты" />
        <meta
          property="og:description"
          content="Прямые контакты для связи с Александром Тощевым по вопросам 4Life: WhatsApp, Telegram, Email."
        />
        <meta property="og:image" content="/images/og-contact.jpg" />
        <meta property="og:url" content="https://alexander-toshchev-4life.ru/contact" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <section className="min-h-screen py-16 md:py-24 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-gray-200 flex items-center">
        <div className="container mx-auto px-4 text-center">
          <motion.h1
            className="text-5xl md:text-6xl font-extrabold mb-8 text-blue-800 dark:text-blue-400"
            variants={headingVariants}
            initial="hidden"
            animate="show"
          >
            Свяжитесь со мной
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl max-w-3xl mx-auto mb-12"
            variants={fadeIn("up", "tween", 0.2, 0.6)}
            initial="hidden"
            animate="show"
          >
            Готовы начать свой путь к здоровью и благополучию? У меня есть ответы на ваши вопросы и я готов помочь на
            каждом этапе.
          </motion.p>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
            variants={fadeIn("up", "spring", 0.4, 0.8)}
            initial="hidden"
            animate="show"
          >
            {contactMethods.map((method, index) => (
              <motion.a
                key={index}
                href={method.link}
                target={method.link.startsWith("mailto:") ? "_self" : "_blank"}
                rel={method.link.startsWith("mailto:") ? "" : "noopener noreferrer"}
                className={`flex flex-col items-center p-8 rounded-lg shadow-xl ${method.colorClass} text-white font-bold transition-all duration-300 transform hover:scale-105`}
                variants={itemVariants}
              >
                <method.icon size={48} className="mb-4" />
                <span className="text-3xl mb-2">{method.name}</span>
                <p className="text-sm opacity-90">{method.description}</p>
              </motion.a>
            ))}
          </motion.div>

          <motion.p
            className="text-md mt-16 max-w-3xl mx-auto text-gray-600 dark:text-gray-400"
            variants={fadeIn("up", "tween", 0.6, 0.8)}
            initial="hidden"
            animate="show"
          >
            Я стремлюсь к оперативному общению. Выберите наиболее удобный для вас способ связи, и я отвечу в ближайшее
            время!
          </motion.p>
        </div>
      </section>
    </>
  );
};

export default ContactPage;
