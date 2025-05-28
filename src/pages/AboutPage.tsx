import { motion } from "framer-motion";
import CallToAction from "../components/ui/CallToAction";
import SectionHeading from "../components/ui/SectionHeading";

const AboutPage = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="container-custom">
          <motion.div
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center">
              АЛЕКСАНДР ТОЩЕВ: Ваш Билдер Элит и Наставник в Мире 4Life
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Personal Presentation */}
      <section className="section bg-white">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <img
                src="https://images.pexels.com/photos/5081971/pexels-photo-5081971.jpeg"
                alt="Александр Тощев"
                className="rounded-lg shadow-xl"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-lg text-gray-700 mb-4">
                Рад приветствовать Вас на моем персональном сайте! Меня зовут Александр Геннадьевич Тощев. Я являюсь
                независимым партнером компании 4Life Research в статусе Билдер Элит.
              </p>
              <p className="text-lg text-gray-700 mb-4">
                Мой путь в 4Life начался с личного интереса к продуктам, способным эффективно поддерживать иммунную
                систему. Глубоко изучив научную базу Трансфер Факторов и философию компании, я осознал, что это не
                просто качественные БАДы, а целая система знаний и возможностей для улучшения качества жизни.
              </p>
              <p className="text-lg text-gray-700 mb-4">
                Я убежден, что здоровье – это наш самый ценный актив, а информированный подход к его поддержанию – ключ
                к долголетию и активной жизни. Моя цель – не просто &apos;продать&apos; продукт, а предоставить Вам всю
                необходимую информацию, чтобы Вы могли сделать осознанный выбор.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Philosophy and Approach */}
      <section className="section bg-gray-50">
        <div className="container-custom">
          <SectionHeading title="Мои принципы в работе и жизни" />

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              className="card p-6 h-full"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <h3 className="text-xl font-semibold mb-3">Экспертность и честность</h3>
              <p className="text-gray-600">
                Я постоянно изучаю информацию о продуктах 4Life, данные исследований и делюсь только проверенными
                сведениями. Я не даю медицинских консультаций, но могу подробно рассказать о составе, механизме действия
                и особенностях применения продукции 4Life.
              </p>
            </motion.div>

            <motion.div
              className="card p-6 h-full"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <h3 className="text-xl font-semibold mb-3">Индивидуальный подход</h3>
              <p className="text-gray-600">
                Я понимаю, что у каждого человека свои потребности и цели. Поэтому я всегда готов выслушать Вас и помочь
                подобрать программу, которая будет оптимальна именно для Вас, исходя из Ваших задач и образа жизни.
              </p>
            </motion.div>

            <motion.div
              className="card p-6 h-full"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <h3 className="text-xl font-semibold mb-3">Поддержка и наставничество</h3>
              <p className="text-gray-600">
                Для тех, кто заинтересован не только в продуктах, но и в развитии собственного дела с 4Life, я предлагаю
                свое наставничество. Являясь лидером &apos;Команды Компетентных Лидеров&apos;, я помогаю партнерам
                освоить все аспекты бизнеса и достичь успеха. Мой девиз: &apos;Со мной способные становятся
                способнее&apos;.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why 4Life? */}
      <section className="section bg-white">
        <div className="container-custom">
          <SectionHeading title="Мой выбор – компания 4Life Research" />

          <motion.div
            className="max-w-3xl"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-lg text-gray-700 mb-6">
              Выбор 4Life Research для меня был не случайным. Эта компания зарекомендовала себя как:
            </p>

            <ul className="space-y-4 mb-8">
              <li className="flex items-start">
                <span className="bg-green-500 rounded-full p-1 mr-3 mt-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-white"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
                <span className="text-gray-700">
                  <strong>Лидер в науке об иммунитете:</strong> Собственные патенты, научный совет, постоянные
                  исследования.
                </span>
              </li>
              <li className="flex items-start">
                <span className="bg-green-500 rounded-full p-1 mr-3 mt-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-white"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
                <span className="text-gray-700">
                  <strong>Производитель качественной продукции:</strong> Строгий контроль на всех этапах производства
                  (стандарты GMP).
                </span>
              </li>
              <li className="flex items-start">
                <span className="bg-green-500 rounded-full p-1 mr-3 mt-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-white"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
                <span className="text-gray-700">
                  <strong>Компания с миссией:</strong> &apos;Вместе Строить Жизнь Людей через Науку, Успех и
                  Сервис&apos;.
                </span>
              </li>
              <li className="flex items-start">
                <span className="bg-green-500 rounded-full p-1 mr-3 mt-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-white"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
                <span className="text-gray-700">
                  <strong>Надежный партнер:</strong> Прозрачная и выгодная система вознаграждений для Аффилиатов.
                </span>
              </li>
            </ul>

            <p className="text-lg text-gray-700 italic">
              Я горжусь тем, что являюсь частью этой глобальной команды и могу предлагать Вам продукты, которым доверяю
              сам.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Call to Action */}
      <CallToAction
        title="Остались вопросы?"
        description="Если у Вас есть вопросы о продукции, или Вы хотите обсудить возможности сотрудничества, пожалуйста, свяжитесь со мной."
        primaryButtonText="Перейти к контактной информации"
        primaryButtonLink="/contact"
      />
    </>
  );
};

export default AboutPage;
