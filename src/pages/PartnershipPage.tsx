import { motion } from "framer-motion";
import CallToAction from "../components/ui/CallToAction";
import FeatureItem from "../components/ui/FeatureItem";
import SectionHeading from "../components/ui/SectionHeading";
import { Icons } from "../utils/icons";
const { Star, PieChart, Clock, Globe, Zap, ExternalLink } = Icons;

const PartnershipPage = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 py-16 md:py-24 text-white">
        <div className="container-custom">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-8">
              Партнерство с 4Life®: Создайте свой источник дохода, улучшая жизни людей
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Компания 4Life Research предлагает уникальную возможность построить успешный бизнес, продвигая продукцию,
              основанную на науке и с доказанной эффективностью. Присоединяйтесь к глобальной команде единомышленников и
              получайте доход, помогая людям улучшать здоровье и качество жизни.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Why Become a 4Life Affiliate */}
      <section className="section bg-white">
        <div className="container-custom">
          <SectionHeading title="Преимущества партнерской программы 4Life" centered />

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureItem
              icon={Star}
              title="Научно обоснованные продукты"
              description="4Life предлагает продукцию, основанную на последних научных исследованиях, с доказанной эффективностью и высоким спросом на рынке."
            />
            <FeatureItem
              icon={PieChart}
              title="Выгодный компенсационный план"
              description="4Life предлагает один из самых конкурентоспособных планов вознаграждения в индустрии, включая бонусы Rapid Rewards, Infinity Commissions и выплаты до 64% от продаж."
            />
            <FeatureItem
              icon={Clock}
              title="Гибкость и свобода"
              description="Вы сами определяете свой график работы, цели и темпы развития. Бизнес с 4Life можно совмещать с основной деятельностью."
            />
            <FeatureItem
              icon={Zap}
              title="Обучение и поддержка"
              description="Компания предоставляет все необходимые инструменты, маркетинговые материалы и обучающие программы."
            />
            <FeatureItem
              icon={Globe}
              title="Международные возможности"
              description="Бизнес с 4Life не имеет границ. Вы можете строить свою команду и привлекать клиентов в десятках стран мира."
            />
          </div>
        </div>
      </section>

      {/* How to Start Business */}
      <section className="section bg-gray-50">
        <div className="container-custom">
          <SectionHeading title="Ваши шаги к успеху с моей поддержкой" centered />

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <div className="hidden md:block absolute left-0 right-0 top-24 h-1 bg-blue-200 z-0"></div>

              <div className="grid md:grid-cols-4 gap-6">
                <motion.div
                  className="relative z-10"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="flex justify-center mb-4">
                    <div className="bg-blue-600 text-white rounded-full h-12 w-12 flex items-center justify-center shadow-lg">
                      <span className="font-bold">1</span>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-md h-full">
                    <h3 className="text-lg font-semibold mb-3 text-center">Свяжитесь со мной для консультации</h3>
                    <p className="text-gray-600 text-center">
                      Мы обсудим Ваши цели, ожидания, и я подробно расскажу о бизнес-модели 4Life, компенсационном плане
                      и первых шагах.
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  className="relative z-10"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                >
                  <div className="flex justify-center mb-4">
                    <div className="bg-blue-600 text-white rounded-full h-12 w-12 flex items-center justify-center shadow-lg">
                      <span className="font-bold">2</span>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-md h-full">
                    <h3 className="text-lg font-semibold mb-3 text-center">Зарегистрируйтесь как Аффилиат</h3>
                    <p className="text-gray-600 text-center">
                      Пройдите простую процедуру регистрации на официальном сайте 4Life, используя мой ID инроллера и
                      спонсора 12299550 (Тощев Александр).
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  className="relative z-10"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                >
                  <div className="flex justify-center mb-4">
                    <div className="bg-blue-600 text-white rounded-full h-12 w-12 flex items-center justify-center shadow-lg">
                      <span className="font-bold">3</span>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-md h-full">
                    <h3 className="text-lg font-semibold mb-3 text-center">Начните использовать продукцию</h3>
                    <p className="text-gray-600 text-center">
                      Личный опыт использования продукции – лучший инструмент для ее продвижения. Изучайте материалы и
                      делитесь своими знаниями.
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  className="relative z-10"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                >
                  <div className="flex justify-center mb-4">
                    <div className="bg-blue-600 text-white rounded-full h-12 w-12 flex items-center justify-center shadow-lg">
                      <span className="font-bold">4</span>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-md h-full">
                    <h3 className="text-lg font-semibold mb-3 text-center">Стройте свою команду</h3>
                    <p className="text-gray-600 text-center">
                      Приглашайте новых партнеров, обучайте их и помогайте им достигать успеха. Вместе с &apos;Командой
                      Компетентных Лидеров&apos; мы будем расти.
                    </p>
                  </div>
                </motion.div>
              </div>

              <div className="flex justify-center mt-10">
                <a
                  href="https://russia.4life.com/12299550/signup/PC"
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="btn btn-primary flex items-center justify-center"
                  aria-label="Зарегистрироваться как Аффилиат (откроется в новой вкладке)"
                >
                  <span>Зарегистрироваться как Аффилиат</span>
                  <ExternalLink className="h-4 w-4 ml-2 flex-shrink-0" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mentor Support */}
      <section className="section bg-white">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <SectionHeading title="Что Вы получаете, присоединяясь к моей команде?" />
              <p className="text-lg text-gray-700 mb-6">
                Как Ваш спонсор и лидер &apos;Команды Компетентных Лидеров&apos;, я обеспечу Вас:
              </p>
              <ul className="space-y-4 mb-6">
                <li className="flex items-start">
                  <div className="bg-blue-100 rounded-full p-1 mr-3 mt-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-blue-600"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="text-gray-700">
                    Персональными консультациями и помощью в разработке индивидуального плана развития.
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="bg-blue-100 rounded-full p-1 mr-3 mt-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-blue-600"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="text-gray-700">Доступом к командным обучающим ресурсам и мероприятиям.</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-blue-100 rounded-full p-1 mr-3 mt-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-blue-600"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="text-gray-700">
                    Поддержкой в решении возникающих вопросов и преодолении трудностей.
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="bg-blue-100 rounded-full p-1 mr-3 mt-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-blue-600"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="text-gray-700">Мотивацией и признанием Ваших достижений.</span>
                </li>
              </ul>
              <p className="text-lg text-gray-700 italic">
                Я заинтересован в Вашем успехе и готов инвестировать свое время и знания в Ваше развитие.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <img
                src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg"
                alt="Команда 4Life"
                className="rounded-lg shadow-xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <CallToAction
        title="Не упустите шанс изменить свою жизнь к лучшему!"
        description="Присоединяйтесь к 4Life и моей команде сегодня! Сделайте первый шаг к финансовой свободе и улучшению жизни людей."
        primaryButtonText="Стать Аффилиатом 4Life"
        primaryButtonLink="https://russia.4life.com/12299550/signup/PC"
        secondaryButtonText="Обсудить возможности партнерства"
        secondaryButtonLink="/contact"
        isExternal={true}
      />
    </>
  );
};

export default PartnershipPage;
