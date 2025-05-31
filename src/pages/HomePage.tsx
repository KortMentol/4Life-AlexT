import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import CallToAction from "../components/ui/CallToAction";
import FeatureItem from "../components/ui/FeatureItem";
import SectionHeading from "../components/ui/SectionHeading";
import TestimonialCard from "../components/ui/TestimonialCard";
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

      {/* Mission Section */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto text-center"
          >
            <SectionHeading
              title="Моя Миссия: Просвещать и Помогать"
              subtitle="Как Builder Elite 4Life"
              description="Я посвятил себя одной цели: помочь вам понять силу вашего иммунитета и построить жизнь, полную здоровья и возможностей. Я здесь, чтобы быть вашим надежным проводником."
              centered
            />
            <div className="mt-8 grid md:grid-cols-3 gap-6">
              <div className="p-6 bg-white rounded-lg shadow-sm">
                <div className="text-blue-600 mb-3">
                  <Shield className="w-10 h-10 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Здоровье</h3>
                <p className="text-gray-600">Помогаю укрепить иммунную систему с помощью научно обоснованных продуктов 4Life</p>
              </div>
              <div className="p-6 bg-white rounded-lg shadow-sm">
                <div className="text-blue-600 mb-3">
                  <Microscope className="w-10 h-10 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Знания</h3>
                <p className="text-gray-600">Делись проверенной информацией о Трансфер Факторах и их роли в организме</p>
              </div>
              <div className="p-6 bg-white rounded-lg shadow-sm">
                <div className="text-blue-600 mb-3">
                  <Award className="w-10 h-10 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Поддержка</h3>
                <p className="text-gray-600">Обеспечиваю персональное сопровождение каждому, кто выбирает путь к здоровью с 4Life</p>
              </div>
            </div>
          </motion.div>
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
          <SectionHeading title="Трансфер Факторы: Ваш Иммунный Интеллект" centered />
          <motion.div
            className="max-w-3xl mx-auto text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-lg text-gray-700 mb-6">
              Трансфер Факторы – это уникальные сигнальные молекулы, обнаруженные компанией 4Life Research более 25 лет назад. 
              Они действуют как 'посланники иммунного опыта', обучая иммунную систему распознавать, реагировать и запоминать 
              потенциальные угрозы, что способствует укреплению естественной защиты организма.
            </p>
            <p className="text-lg text-gray-700 mb-8">
              Научные исследования подтверждают безопасность и эффективность Трансфер Факторов в поддержке здорового 
              функционирования иммунной системы. Продукция производится с соблюдением международных стандартов качества GMP.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureItem
              icon={Microscope}
              title="Научное Обоснование"
              description="Более 25 лет исследований и более 40 патентов, подтверждающих механизм действия Трансфер Факторов"
            />
            <FeatureItem
              icon={Shield}
              title="Иммунный Интеллект"
              description="Уникальный механизм обучения иммунной системы распознаванию и запоминанию потенциальных угроз"
            />
            <FeatureItem
              icon={Award}
              title="Стандарты Качества"
              description="Производство по международным стандартам GMP с независимым контролем качества и безопасности"
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
          <SectionHeading title="Партнерство с 4Life: Рост и Поддержка" centered />
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              className="card p-8 h-full flex flex-col"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <h3 className="text-xl font-semibold mb-3">Постройте бизнес на основе знаний и этики</h3>
              <p className="text-gray-600 mb-6 flex-grow">
                Присоединяйтесь к сообществу профессионалов, которые ценят научный подход и этичное ведение бизнеса. 
                Вместе с Александром Тощевым вы получите:
              </p>
              <ul className="list-disc list-inside text-gray-600 mb-6">
                <li>Персональную поддержку и обучение</li>
                <li>Доступ к проверенным инструментам и стратегиям</li>
                <li>Возможность развития собственного дела с 4Life</li>
              </ul>
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg mb-6">
                <p className="text-blue-800 font-medium">
                  <span className="font-bold">Важно:</span> Результаты работы зависят от ваших усилий и подхода. 
                  Мы предоставляем знания и инструменты, но успех определяете вы.
                </p>
              </div>
              <Link to="/partnership" className="btn btn-primary">
                {" "}
                Узнать больше о партнерстве{" "}
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

      {/* Testimonials Section */}
      <section className="section bg-gray-50">
        <div className="container-custom">
          <SectionHeading title="Реальные Истории Успеха" centered />
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-lg text-gray-700 mb-8">
              Эти люди нашли поддержку здоровья и новые возможности благодаря продукции 4Life и профессионализму Александра Тощева.
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              <TestimonialCard
                name="Елена, 48 лет"
                location="Москва"
                text="После курса 4Life Transfer Factor Tri-Factor Formula заметила значительное улучшение общего самочувствия. Раньше часто болела простудами, теперь это стало редкостью. Особенно впечатлил эффект после поездки в командировку – обычно возвращалась с простудой, а в этот раз осталась в отличной форме."
              />
              <TestimonialCard
                name="Дмитрий, 35 лет"
                location="Санкт-Петербург"
                text="Как спортсмен, я всегда ищу натуральные способы поддержки организма. 4Life Transfer Factor Plus стал для меня настоящим открытием. После интенсивных тренировок восстанавливаюсь быстрее, и энергия держится весь день."
              />
              <TestimonialCard
                name="Анна, 55 лет"
                location="Новосибирск"
                text="RioVida Stix – это настоящая находка для моей активной жизни! Удобно брать с собой в командировки, вкус приятный. Особенно заметила улучшение сна и общего самочувствия. Рекомендую всем, кто ведет активный образ жизни!"
              />
            </div>
            <div className="text-center mt-8">
              <Link to="/testimonials" className="btn btn-outline">
                {" "}
                Читать все отзывы{" "}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <CallToAction
        title="Начните Ваш Путь к Здоровью и Новым Возможностям с Александром Тощевым"
        description="Я готов стать вашим надежным проводником в мире 4Life. Узнайте, как получить доступ к уникальным продуктам и строить этичный бизнес."
        primaryButtonText="Получить ID для Покупки"
        primaryButtonLink="/purchase"
        secondaryButtonText="Узнать о Партнерстве"
        secondaryButtonLink="/partnership"
      />
    </>
  );
};

export default HomePage;
