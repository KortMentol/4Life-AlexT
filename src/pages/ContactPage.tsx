/**
 * @module src/pages/ContactPage.tsx
 * @description Immersive Garden 2026 - Страница контактов
 * Минималистичный дизайн с адаптацией под все устройства
 * @author Kort
 * @version 2.0.0
 */

import { SEO } from "@/seo/SEO";
import { motion } from "framer-motion";
import React from "react";
import { usePerformanceTier } from "@/hooks";
import { Icons } from "@/utils/icons";

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.5, ease: "easeInOut" } },
  exit: { opacity: 0, transition: { duration: 0.3, ease: "easeInOut" } },
};

const ContactPage: React.FC = () => {
  const tier = usePerformanceTier();

  const contactMethods = [
    {
      name: "WhatsApp",
      icon: Icons.MessageCircle,
      link: "https://wa.me/79152561177",
      color: "from-green-500 to-green-600",
      description: "Быстрый ответ в мессенджере",
    },
    {
      name: "Telegram",
      icon: Icons.Send,
      link: "https://t.me/+79152561177",
      color: "from-blue-500 to-blue-600",
      description: "Удобное общение в Telegram",
    },
    {
      name: "Позвонить",
      icon: Icons.Phone,
      link: "tel:+79152561177",
      color: "from-purple-500 to-purple-600",
      description: "Прямой звонок для консультации",
    },
  ];

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
    >
      <SEO
        title="Свяжитесь с Александром Тощевым - 4Life | Контакты"
        description="Узнайте, как связаться с Александром Тощевым для консультации по продукции 4Life или возможностям партнерства. WhatsApp, Telegram, Телефон."
        path="/contact"
        type="website"
      />

      <section className="min-h-screen flex items-center justify-center py-20 px-4 bg-gradient-to-br from-gray-950 to-gray-900">
        <div className="container mx-auto max-w-5xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Свяжитесь со мной
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Готовы начать свой путь к здоровью и благополучию? У меня есть
              ответы на ваши вопросы, и я готов помочь на каждом этапе
            </p>
          </motion.div>

          {/* Contact Methods */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {contactMethods.map((method, index) => (
              <motion.a
                key={index}
                href={method.link}
                target={method.link.startsWith("tel:") ? "_self" : "_blank"}
                rel={
                  method.link.startsWith("tel:") ? "" : "noopener noreferrer"
                }
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={tier !== "low" ? { y: -8, scale: 1.02 } : {}}
                whileTap={{ scale: 0.98 }}
                className={`group relative p-8 rounded-2xl bg-gradient-to-br ${method.color} text-white shadow-xl overflow-hidden`}
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
                      backgroundSize: "24px 24px",
                    }}
                  />
                </div>

                {/* Content */}
                <div className="relative z-10">
                  <method.icon
                    className="w-12 h-12 mb-4 transition-transform duration-300 group-hover:scale-110"
                    strokeWidth={1.5}
                  />
                  <h3 className="text-2xl font-bold mb-2">{method.name}</h3>
                  <p className="text-white/90 text-sm">{method.description}</p>
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.a>
            ))}
          </div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-3 px-6 py-4 rounded-full bg-blue-900/20 border border-blue-800">
              <Icons.Clock className="w-5 h-5 text-cyan-400" />
              <p className="text-gray-300">
                Отвечаю в течение нескольких часов. Выберите удобный способ
                связи
              </p>
            </div>
          </motion.div>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="p-6 rounded-2xl bg-gray-900 border border-gray-800"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-900/30 flex items-center justify-center">
                  <Icons.MessageCircle className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">
                    Консультация по продуктам
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Помогу подобрать оптимальные продукты 4Life для ваших целей
                    и объясню, как они работают
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="p-6 rounded-2xl bg-gray-900 border border-gray-800"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-purple-900/30 flex items-center justify-center">
                  <Icons.Users className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">
                    Партнерство
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Расскажу о возможностях построения бизнеса с 4Life и помогу
                    начать
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default React.memo(ContactPage);
