import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import CallToAction from "../components/ui/CallToAction";
import FeatureItem from "../components/ui/FeatureItem";
import SectionHeading from "../components/ui/SectionHeading";
import { Icons } from "../utils/icons";
const { Shield, Microscope, Award } = Icons;

const HomePage = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white min-h-[80vh] flex items-center">
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div className="container-custom relative z-10 py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
              <img
                src="https://images.pexels.com/photos/5081971/pexels-photo-5081971.jpeg"
                alt="Александр Тощев"
                className="rounded-lg shadow-2xl max-w-full"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                АЛЕКСАНДР ТОЩЕВ: Ваш проводник в мир здоровья и возможностей с 4Life®
              </h1>
              <p className="text-xl mb-8 text-blue-100">
                Откройте для себя силу Трансфер Факторов®, укрепите иммунитет и получите персональную поддержку от
                Билдер Элит 4Life. Ваша скидка от 15% при регистрации с ID 12299550.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/products" className="btn btn-secondary">
                  {" "}
                  Узнать больше о Трансфер Факторах{" "}
                </Link>
                <Link to="/contact" className="btn bg-white text-blue-600 hover:bg-blue-50">
                  {" "}
                  Получить консультацию{" "}
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Alexander Section */}
      <section className="section bg-white">
        <div className="container-custom">
          <SectionHeading title="Приветствую Вас! Меня зовут Александр Тощев." centered />
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-lg text-gray-700 mb-6">
              Я – предприниматель и Билдер Элит компании 4Life Research. Моя миссия – помогать людям достигать
              благополучия как в сфере здоровья, так и в личном развитии. Я глубоко убежден в научной обоснованности и
              эффективности продуктов 4Life, в основе которых лежат уникальные Трансфер Факторы.
            </p>
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg mb-6">
              <p className="text-blue-800 font-medium">
                <span className="font-bold">Важно:</span> Я не являюсь врачом, и продукция 4Life не заменяет медикаментозное лечение. 
                Перед применением БАД рекомендуется проконсультироваться с врачом.
              </p>
            </div>
            <p className="text-lg text-gray-700 mb-6">
              Моя задача – предоставить Вам исчерпывающую информацию, основанную на официальных данных компании и научных исследованиях, 
              помочь разобраться в ассортименте и подобрать оптимальные решения для поддержки Вашего организма.
            </p>
            <p className="text-lg text-gray-700 mb-8">
              Мой принцип: 'Со мной способные становятся способнее'. Я готов делиться знаниями и опытом, чтобы Вы могли
              сделать осознанный выбор в пользу своего здоровья и, при желании, рассмотреть возможности для развития
              собственного дела с 4Life.
            </p>
            <Link to="/about" className="btn btn-outline">
              {" "}
              Подробнее обо мне и моем подходе{" "}
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 4Life Transfer Factor Section */}
      <section className="section bg-gray-50">
        <div className="container-custom">
          <SectionHeading title="4Life Трансфер Фактор® – Интеллектуальная поддержка Вашей иммунной системы" centered />
          <motion.div
            className="max-w-3xl mx-auto text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-lg text-gray-700 mb-6">
              Более 25 лет компания 4Life Research является мировым лидером в науке об иммунной системе. Ключевой
              компонент наших продуктов – Трансфер Факторы. Это не витамины, минералы или травы. Это сигнальные
              молекулы-посредники, которые передают иммунной системе 'информацию' и 'опыт', помогая ей более эффективно
              Распознавать потенциальные угрозы, адекватно на них Отвечать и Запоминать их для будущей защиты.
            </p>
            <p className="text-lg text-gray-700 mb-8">
              Продукция 4Life производится в соответствии с высочайшими стандартами качества и прошла множество
              исследований, подтверждающих ее профиль безопасности и эффективности.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureItem
              icon={Microscope}
              title="Научно-обосновано"
              description="В основе продуктов – научные исследования, патенты и разработки, подтвержденные международными экспертами"
            />
            <FeatureItem
              icon={Shield}
              title="Поддержка иммунитета"
              description="Трансфер Факторы помогают иммунным клеткам эффективнее распознавать угрозы, адекватно реагировать и запоминать опыт"
            />
            <FeatureItem
              icon={Award}
              title="Высокое качество"
              description="Строгий контроль на всех этапах производства в соответствии с международными стандартами GMP"
            />
          </div>
          <div className="text-center mt-12">
            <Link to="/products" className="btn btn-primary">
              {" "}
              Изучить продукцию 4Life{" "}
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="section bg-white">
        <div className="container-custom">
          <SectionHeading title="Начните свой путь к здоровью и успеху уже сегодня" centered />
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              className="card p-8 h-full flex flex-col"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <h3 className="text-xl font-semibold mb-3">Приобретайте продукцию со скидкой</h3>
              <p className="text-gray-600 mb-6 flex-grow">
                Зарегистрируйтесь как Приоритетный клиент с моим ID 12299550 и получайте скидку от 15% на всю продукцию
                4Life.
              </p>
              <Link to="/purchase" className="btn btn-primary">
                {" "}
                Условия приобретения и регистрации{" "}
              </Link>
            </motion.div>
            <motion.div
              className="card p-8 h-full flex flex-col"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <h3 className="text-xl font-semibold mb-3">Рассмотрите возможности партнерства</h3>
              <p className="text-gray-600 mb-6 flex-grow">
                Узнайте, как Вы можете не только улучшить свое здоровье, но и создать источник дохода, став Аффилиатом
                4Life.
              </p>
              <Link to="/partnership" className="btn btn-primary">
                {" "}
                Узнать о партнерской программе{" "}
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <CallToAction
        title="Готовы сделать первый шаг?"
        description="Свяжитесь со мной для получения консультации или оставьте сообщение, и я отвечу на все Ваши вопросы о продукции 4Life и возможностях сотрудничества."
        primaryButtonText="Связаться сейчас"
        primaryButtonLink="/contact"
        secondaryButtonText="Узнать о продукции"
        secondaryButtonLink="/products"
      />
    </>
  );
};

export default HomePage;
