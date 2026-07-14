/**
 * @module src/pages/HowToBuyPage.tsx
 * @description Страница "Как приобрести продукцию 4Life" в стиле Immersive Garden.
 * Интегрирован единый оркестратор входа PageEntrance для бесшовной анимации переходов.
 * @author Kort & AI
 * @version 2.1.0
 */

import { PageEntrance } from "@/components/transitions/PageEntrance";
import { Button, FAQItem } from "@/components/ui";
import { usePerformanceTier } from "@/hooks";
import { SEO } from "@/seo/SEO";
import { Icons } from "@/utils/icons";
import { motion } from "framer-motion";
import React, { useState } from "react";

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.5, ease: "easeInOut" } },
  exit: { opacity: 0, transition: { duration: 0.3, ease: "easeInOut" } },
};

const HowToBuyPage: React.FC = () => {
  const tier = usePerformanceTier();
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const handleFAQToggle = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const benefits = [
    {
      icon: Icons.BadgePercent,
      title: "Скидка 25%",
      description: "Покупайте напрямую у 4Life по привилегированной цене Приоритетного Клиента",
    },
    {
      icon: Icons.Gift,
      title: "Бонусы и акции",
      description: "Участвуйте в ежемесячных акциях и получайте подарки от компании",
    },
    {
      icon: Icons.Truck,
      title: "Доставка по России",
      description: "Быстрая и надёжная доставка в любой регион через офис в Москве",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Зарегистрируйтесь как Приоритетный Клиент",
      description:
        "Пройдите быструю регистрацию на официальном сайте 4Life. Мой ID уже указан автоматически — вы получите доступ к скидкам и программе лояльности.",
      action: {
        text: "Зарегистрироваться",
        link: "https://russia.4life.com/12299550/signup/PC",
        external: true,
      },
    },
    {
      number: "02",
      title: "Свяжитесь со мной для консультации",
      description:
        "Напишите мне в удобный мессенджер. Я помогу подобрать продукты, расскажу о дозировках и отвечу на все вопросы.",
      action: {
        text: "Написать в WhatsApp",
        link: "https://wa.me/79152561177",
        external: true,
      },
    },
    {
      number: "03",
      title: "Оформите заказ через офис",
      description:
        "С вашим ID Приоритетного Клиента свяжитесь с офисом в Москве для оформления заказа. Вы получите скидку и сможете выбрать удобный способ получения.",
      action: {
        text: "Контакты офиса",
        link: "/contact",
        external: false,
      },
    },
  ];

  const faqData = [
    {
      question: "Зачем регистрироваться как Приоритетный Клиент?",
      answer:
        "Регистрация дает вам скидку 25% на все продукты, доступ к эксклюзивным акциям и программе лояльности. Это бесплатно и занимает 2 минуты.",
    },
    {
      question: "Как получить продукцию после заказа?",
      answer:
        "После оформления заказа через офис вы можете выбрать доставку курьером или самовывоз из офиса в Москве. Доставка осуществляется по всей России.",
    },
    {
      question: "Могу ли я купить без регистрации?",
      answer:
        "Да, но без регистрации вы не получите скидку 25% и доступ к программе лояльности. Регистрация занимает всего 2 минуты и дает значительные преимущества.",
    },
    {
      question: "Как долго действует статус Приоритетного Клиента?",
      answer:
        "Статус действует бессрочно. Вы сохраняете все привилегии и скидки на протяжении всего времени сотрудничества с 4Life.",
    },
  ];

  return (
    <motion.div initial="initial" animate="animate" exit="exit" variants={pageVariants}>
      <SEO
        title="Как приобрести продукцию 4Life - Александр Тощев"
        description="Узнайте, как легко приобрести продукцию 4Life в статусе Приоритетного Клиента и получить доступ к скидкам 25%. Пошаговая инструкция."
        path="/how-to-buy"
        type="website"
      />

      {/* Hero Section с оркестрированным PageEntrance */}
      <section className="relative py-24 md:py-32 bg-gradient-to-br from-gray-950 to-gray-900 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: "radial-gradient(circle at 2px 2px, rgba(59, 130, 246, 0.3) 1px, transparent 0)",
              backgroundSize: "32px 32px",
            }}
          />
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <PageEntrance className="flex flex-col items-center justify-center">
            {/* Title */}
            <div data-entrance="title" className="mb-6">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
                Как приобрести
                <br />
                <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  продукты 4Life
                </span>
              </h1>
            </div>

            {/* Lead Description */}
            <div data-entrance="lead" className="max-w-3xl mx-auto">
              <p className="text-xl md:text-2xl text-gray-300 leading-relaxed text-pretty">
                Получите лучшие условия и экспертную поддержку, следуя простым шагам
              </p>
            </div>
          </PageEntrance>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 md:py-32 bg-gray-950">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Преимущества Приоритетного Клиента</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Зарегистрируйтесь один раз и получайте выгоду от каждой покупки
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={tier !== "low" ? { y: -8 } : {}}
                className="p-8 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-800"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-900/30 mb-6">
                  <benefit.icon className="w-8 h-8 text-cyan-400" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{benefit.title}</h3>
                <p className="text-gray-400 leading-relaxed">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-gray-900 to-gray-950">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Три простых шага</h2>
            <p className="text-xl text-gray-300">От регистрации до получения продукции</p>
          </motion.div>

          <div className="space-y-12">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
                className="relative"
              >
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  {/* Number */}
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center">
                      <span className="text-3xl font-bold text-white">{step.number}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">{step.title}</h3>
                    <p className="text-lg text-gray-300 mb-6 leading-relaxed">{step.description}</p>
                    <Button
                      to={step.action.link}
                      variant="primary"
                      size="lg"
                      className="from-blue-600 to-cyan-600"
                      icon={<Icons.ArrowRight className="w-5 h-5" />}
                      {...(step.action.external && {
                        onClick: (e: React.MouseEvent) => {
                          e.preventDefault();
                          window.open(step.action.link, "_blank", "noopener,noreferrer");
                        },
                      })}
                    >
                      {step.action.text}
                    </Button>
                  </div>
                </div>

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute left-10 top-20 w-0.5 h-12 bg-gradient-to-b from-blue-600 to-cyan-600" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 md:py-32 bg-gray-950">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Часто задаваемые вопросы</h2>
          </motion.div>

          <div className="space-y-4">
            {faqData.map((item, index) => (
              <FAQItem
                key={index}
                question={item.question}
                answer={item.answer}
                index={index}
                isOpen={openFAQ === index}
                onToggle={handleFAQToggle}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-blue-900 to-cyan-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Остались вопросы?</h2>
            <p className="text-xl text-white/90 mb-10 leading-relaxed">
              Свяжитесь со мной, и я помогу разобраться со всеми деталями
            </p>
            <Button
              to="/contact"
              variant="secondary"
              size="lg"
              className="bg-gray-900 text-cyan-400 hover:bg-gray-800"
              icon={<Icons.MessageCircle className="w-5 h-5" />}
            >
              Получить консультацию
            </Button>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
};

export default React.memo(HowToBuyPage);
