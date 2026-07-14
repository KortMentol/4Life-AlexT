/**
 * @module src/pages/ContactPage.tsx
 * @description Страница "Контакты" в стиле Immersive Garden 2026.
 * Интегрирован единый оркестратор входа PageEntrance для бесшовной анимации переходов.
 * Полностью вычищен легаси-код и хардкод-анимации.
 * @author Kort & AI
 * @version 2.2.0
 */

import { PageEntrance } from "@/components/transitions/PageEntrance";
import { usePerformanceTier } from "@/hooks";
import { SEO } from "@/seo/SEO";
import { Icons } from "@/utils/icons";
import { motion } from "framer-motion";
import React from "react";

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
      icon: Icons.WhatsApp,
      link: "https://wa.me/79152561177",
      color: "from-green-500/10 to-green-600/5 border-green-500/20 text-green-400 hover:border-green-400/40",
      description: "Быстрый ответ в мессенджере",
    },
    {
      name: "Telegram",
      icon: Icons.Telegram,
      link: "https://t.me/+79152561177",
      color: "from-blue-500/10 to-blue-600/5 border-blue-500/20 text-blue-400 hover:border-blue-400/40",
      description: "Удобное общение в Telegram",
    },
    {
      name: "Позвонить",
      icon: Icons.Phone,
      link: "tel:+79152561177",
      color: "from-purple-500/10 to-purple-600/5 border-purple-500/20 text-purple-400 hover:border-purple-400/40",
      description: "Прямой звонок для консультации",
    },
  ];

  return (
    <motion.div initial="initial" animate="animate" exit="exit" variants={pageVariants}>
      <SEO
        title="Свяжитесь с Александром Тощевым - 4Life | Контакты"
        description="Узнайте, как связаться с Александром Тощевым для консультации по продукции 4Life или возможностям партнерства. WhatsApp, Telegram, Телефон."
        path="/contact"
        type="website"
      />

      <section className="min-h-screen flex items-center justify-center py-20 px-4 bg-gradient-to-br from-gray-950 to-gray-900">
        <div className="container mx-auto max-w-5xl">
          {/* Hero с оркестрацией PageEntrance */}
          <div className="text-center mb-16">
            <PageEntrance className="flex flex-col items-center justify-center">
              {/* Title */}
              <div data-entrance="title" className="mb-6">
                <h1 className="text-4xl md:text-6xl font-bold text-white">Свяжитесь со мной</h1>
              </div>

              {/* Lead Description */}
              <div data-entrance="lead" className="max-w-3xl mx-auto">
                <p className="text-xl md:text-2xl text-gray-300 leading-relaxed text-pretty">
                  Готовы начать свой путь к здоровью и благополучию? У меня есть ответы на ваши вопросы, и я готов
                  помочь на каждом этапе
                </p>
              </div>
            </PageEntrance>
          </div>

          {/* Карточки контактов */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {contactMethods.map((method, index) => (
              <motion.a
                key={index}
                href={method.link}
                target={method.link.startsWith("tel:") ? "_self" : "_blank"}
                rel={method.link.startsWith("tel:") ? "" : "noopener noreferrer"}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={tier !== "low" ? { y: -6, scale: 1.01 } : {}}
                whileTap={{ scale: 0.98 }}
                className={`group relative p-8 rounded-2xl bg-gradient-to-br ${method.color} border shadow-xl overflow-hidden transition-all duration-300`}
                style={{ WebkitTapHighlightColor: "transparent" }}
              >
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
                      backgroundSize: "24px 24px",
                    }}
                  />
                </div>

                <div className="relative z-10 flex flex-col items-center text-center">
                  <method.icon
                    className="w-12 h-12 mb-5 transition-transform duration-300 group-hover:scale-110"
                    strokeWidth={1.5}
                  />
                  <h3 className="text-2xl font-bold mb-2 text-white">{method.name}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{method.description}</p>
                </div>

                <div className="absolute inset-0 bg-white/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </motion.a>
            ))}
          </div>

          <div className="text-center">
            <div className="inline-flex items-center gap-3 px-6 py-4 rounded-full bg-blue-900/10 border border-blue-900/20">
              <Icons.Clock className="w-5 h-5 text-cyan-400" />
              <p className="text-gray-300 text-sm font-medium">
                Отвечаю в течение нескольких часов. Выберите удобный способ связи
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="p-6 rounded-2xl bg-gray-900/50 border border-white/[0.05]"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-900/20 flex items-center justify-center border border-blue-800/30">
                  <Icons.MessageCircle className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">Консультация по продуктам</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Помогу подобрать оптимальные продукты 4Life для ваших целей и объясню, как они работают
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="p-6 rounded-2xl bg-gray-900/50 border border-white/[0.05]"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-purple-900/20 flex items-center justify-center border border-purple-800/30">
                  <Icons.Users className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">Партнерство</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Расскажу о возможностях построения бизнеса с 4Life и помогу начать
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
