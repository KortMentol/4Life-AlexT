import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { headingVariants, itemVariants, staggerContainer } from "../animations/variants";
import CallToAction from "../components/ui/CallToAction";
import SectionHeading from "../components/ui/SectionHeading";
import TestimonialCard from "../components/ui/TestimonialCard";

interface Testimonial {
  id: string;
  name: string;
  title: string;
  quote: string;
  image: string;
}

const testimonials: Testimonial[] = [
  {
    id: "testimonial-anna",
    name: "Анна К.",
    title: "Мама, 35 лет",
    quote: "Благодаря продуктам 4Life и поддержке Александра, я чувствую себя моложе и энергичнее! Мой иммунитет стал значительно крепче.",
    image: "/placeholder-avatar-anna.jpg",
  },
  {
    id: "testimonial-ivan",
    name: "Иван С.",
    title: "Бизнесмен, 42 года",
    quote: "Я долго искал надежного партнера в MLM-бизнесе. Александр не просто дистрибьютор, а настоящий наставник. Мой доход растет!",
    image: "/placeholder-avatar-ivan.jpg",
  },
  {
    id: "testimonial-elena",
    name: "Елена В.",
    title: "Пенсионерка, 55 лет",
    quote: "Проблемы со здоровьем преследовали меня годами. Комплексный подход, рекомендованный Александром, изменил мою жизнь к лучшему.",
    image: "/placeholder-avatar-elena.jpg",
  },
];

const TestimonialsPage = () => {
  return (
    <>
      <Helmet>
        <title>Отзывы о продукции 4Life - Реальные истории клиентов Александра Тощева</title>
        <meta
          name="description"
          content="Читайте реальные отзывы о продукции 4Life и опыте работы с Александром Тощевым. Узнайте, как наши продукты помогли улучшить здоровье и бизнес наших клиентов."
        />
        <meta property="og:title" content="Отзывы о продукции 4Life - Реальные истории клиентов Александра Тощева" />
        <meta
          property="og:description"
          content="Читайте реальные отзывы о продукции 4Life и опыте работы с Александром Тощевым. Узнайте, как наши продукты помогли улучшить здоровье и бизнес наших клиентов."
        />
        <meta property="og:image" content="/images/og-testimonials.jpg" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="/testimonials" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Отзывы о продукции 4Life - Реальные истории клиентов Александра Тощева" />
        <meta
          name="twitter:description"
          content="Читайте реальные отзывы о продукции 4Life и опыте работы с Александром Тощевым. Узнайте, как наши продукты помогли улучшить здоровье и бизнес наших клиентов."
        />
        <meta name="twitter:image" content="/images/og-testimonials.jpg" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://ВАШ_ДОМЕН.ru/testimonials" /> {/* ЗАМЕНИТЬ НА РЕАЛЬНЫЙ ДОМЕН */}
      </Helmet>
      {/* Hero Section */}
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="container-custom">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.h1
              variants={headingVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              className="text-4xl md:text-5xl font-bold mb-8"
            >
              Реальные истории успеха с 4Life®
            </motion.h1>
            <motion.div
              variants={itemVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              className="space-y-4"
            >
              <p className="text-xl text-gray-600">
                Представленные отзывы – это истории реальных людей, которые нашли поддержку здоровья и новые возможности
                благодаря продукции 4Life и профессионализму Александра Тощева.
              </p>
              <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg">
                <p className="text-amber-800 font-medium">
                  <span className="font-bold">Важно:</span> Индивидуальные результаты могут отличаться. Продукция 4Life
                  не является лекарственным средством и не предназначена для диагностики, лечения или профилактики
                  заболеваний. Перед применением рекомендуется проконсультироваться с врачом.
                </p>
              </div>
            </motion.div>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12"
            >
              {testimonials.map((testimonial) => (
                <motion.div
                  key={testimonial.id}
                  variants={itemVariants}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.3 }}
                >
                  <TestimonialCard
                    image={testimonial.image}
                    name={testimonial.name}
                    title={testimonial.title}
                    quote={testimonial.quote}
                  />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Product Testimonials */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Истории Успеха"
            description="Реальные истории людей, которые достигли успеха с помощью продукции 4Life и поддержки Александра Тощева"
            centered={true}
          />
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div key={index} variants={itemVariants}>
                <TestimonialCard
                  image={testimonial.image}
                  name={testimonial.name}
                  title={testimonial.title}
                  quote={testimonial.quote}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Partnership Testimonials */}
      <section className="section bg-gray-50">
        <div className="container-custom">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
          >
            <SectionHeading title="Отзывы о партнерстве с Александром Тощевым" centered />
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto"
            >
              <motion.div
                variants={itemVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.3 }}
              >
                <TestimonialCard
                  image="https://i.ibb.co/C07Bf5R/testimonial-anna.jpg"
                  name="Наталья В."
                  title="Предприниматель, 45 лет"
                  quote="Сотрудничество с Александром Геннадьевичем – это большая удача. Он не только прекрасный знаток продукции, но и мудрый наставник. Благодаря его поддержке и обучению в 'Команде Компетентных Лидеров', я смогла быстро стартовать в бизнесе и уже вижу первые результаты. Рекомендую Александра как надежного спонсора!"
                />
              </motion.div>
              <motion.div
                variants={itemVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.3 }}
              >
                <TestimonialCard
                  image="https://i.ibb.co/3pYv26G/testimonial-dmitry.jpg"
                  name="Сергей Д."
                  title="Специалист IT, 38 лет"
                  quote="Когда я решил начать бизнес с 4Life, у меня было много вопросов и сомнений. Александр всегда находил время для подробных консультаций, делился рабочими инструментами и стратегиями. Его подход к бизнесу - профессиональный и системный, без пустых обещаний и давления. Благодарен за поддержку и знания!"
                />
              </motion.div>
              <motion.div
                variants={itemVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.3 }}
              >
                <TestimonialCard
                  image="https://i.ibb.co/VMy1L3D/testimonial-elena.jpg"
                  name="Марина Л."
                  title="Менеджер, 42 года"
                  quote="Самое ценное для меня в наставничестве Александра - его способность объяснять сложные вещи простым языком и выстраивать индивидуальную стратегию развития. За полгода сотрудничества мне удалось не только улучшить собственное здоровье, но и создать стабильный дополнительный доход. Спасибо за вдохновение и поддержку!"
                />
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Disclaimer and Share Experience */}
      <section className="section bg-white">
        <div className="container-custom">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.div
              variants={itemVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              className="max-w-3xl mx-auto text-center"
            >
              <motion.div
                variants={itemVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.3 }}
                className="bg-yellow-50 p-6 rounded-lg mb-8"
              >
                <motion.h4
                  variants={headingVariants}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.3 }}
                  className="text-red-600 font-semibold mb-2"
                >
                  Важно знать
                </motion.h4>
                <motion.p
                  variants={itemVariants}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.3 }}
                  className="text-sm text-gray-600"
                >
                  Представленные отзывы отражают личный опыт конкретных людей. Результаты от применения продукции 4Life
                  могут быть индивидуальны и зависят от множества факторов. Продукция 4Life не предназначена для
                  диагностики, лечения или предотвращения заболеваний. БАД. Перед применением проконсультируйтесь со
                  специалистом.
                </motion.p>
              </motion.div>
              <motion.div
                variants={itemVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.3 }}
                className="bg-blue-50 p-8 rounded-lg border border-blue-100"
              >
                <motion.h3
                  variants={headingVariants}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.3 }}
                  className="text-xl font-semibold mb-4"
                >
                  Поделитесь своей историей успеха
                </motion.h3>
                <motion.p
                  variants={itemVariants}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.3 }}
                  className="text-gray-700 mb-6"
                >
                  Если Вы уже используете продукцию 4Life или являетесь партнером, и хотите поделиться своей историей,
                  пожалуйста, свяжитесь со мной. Ваши отзывы помогают другим людям сделать правильный выбор!
                </motion.p>
                <a href="/contact" className="btn btn-primary inline-block">
                  Рассказать свою историю
                </a>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="section bg-gray-50">
        <div className="container-custom">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.div
              variants={itemVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              className="max-w-4xl mx-auto"
            >
              <CallToAction
                title="Начните свой путь к здоровью с 4Life"
                description="Присоединяйтесь к тысячам людей, которые уже улучшили свое здоровье и жизнь благодаря продукции 4Life"
                primaryButtonText="Выбрать продукт"
                primaryButtonLink="https://russia.4life.com/12299550"
                secondaryButtonText="Стать партнером"
                secondaryButtonLink="/partnership"
                isExternal
              />
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default TestimonialsPage;
