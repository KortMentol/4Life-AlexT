import { motion } from "framer-motion";
import CallToAction from "../components/ui/CallToAction";
import SectionHeading from "../components/ui/SectionHeading";
import TestimonialCard from "../components/ui/TestimonialCard";
import { itemVariants, headingVariants, staggerContainer } from "../animations/variants";

const testimonials = [
  {
    id: "testimonial-sarah-m",
    image: "/images/avatar-sarah.webp",
    name: "Sarah M.",
    title: "Предприниматель, 35 лет",
    quote:
      "Я начала принимать 4Life Transfer Factor Tri-Factor Formula несколько месяцев назад по рекомендации подруги. Раньше я часто чувствовала себя уставшей и подверженной сезонным простудам. Сейчас я полна энергии, и мой иммунитет стал заметно крепче! Я очень довольна результатами и рекомендую этот продукт всем, кто хочет поддержать свое здоровье естественным путем.",
  },
  {
    id: "testimonial-david-k",
    image: "/images/avatar-david.webp",
    name: "David K.",
    title: "Спортсмен, 42 года",
    quote:
      "Как человек, ведущий активный образ жизни и занимающийся спортом, я искал качественную поддержку для своего организма. 4Life Transfer Factor Plus стал для меня настоящим открытием. Он помогает мне быстрее восстанавливаться после тренировок и поддерживать высокий уровень работоспособности. Отличный продукт!",
  },
  {
    id: "testimonial-irina-p",
    image: "/images/avatar-irina.webp",
    name: "Ирина П.",
    title: "Мама, 38 лет",
    quote:
      "Я принимаю Трансфер Фактор Плюс уже больше года. За это время я заметила значительное улучшение общего самочувствия и стрессоустойчивости. Особенно заметна разница в осенне-зимний период - в то время как коллеги часто болеют, я продолжаю активно работать. Очень благодарна Александру за подробную консультацию по продукту.",
  },
  {
    id: "testimonial-mikhail-s",
    image: "/images/avatar-mikhail.webp",
    name: "Михаил С.",
    title: "Бизнесмен, 29 лет",
    quote:
      "Для меня как для человека, часто контактирующего с большим количеством людей, поддержка иммунитета крайне важна. Начал принимать 4Life Transfer Factor Tri-Factor Formula по совету Александра и отметил, что стал намного реже подхватывать сезонные вирусы. Буду продолжать прием и дальше!",
  },
  {
    id: "testimonial-elena-48",
    image: "/images/avatar-elena.webp",
    name: "Елена",
    title: "Пенсионерка, 48 лет",
    quote:
      "После курса 4Life Transfer Factor Tri-Factor Formula заметила значительное улучшение общего самочувствия. Раньше часто болела простудами, теперь это стало редкостью. Особенно впечатлил эффект после поездки в командировку – обычно возвращалась с простудой, а в этот раз осталась в отличной форме.",
  },
  {
    id: "testimonial-dmitry-35",
    image: "/images/avatar-dmitry.webp",
    name: "Дмитрий",
    title: "Спортсмен, 35 лет",
    quote:
      "Как спортсмен, я всегда ищу натуральные способы поддержки организма. 4Life Transfer Factor Plus стал отличным дополнением к моему режиму. После интенсивных тренировок восстанавливаюсь быстрее, и энергия держится весь день.",
  },
  {
    id: "testimonial-anna-55",
    image: "/images/avatar-anna.webp",
    name: "Анна",
    title: "Путешественница, 55 лет",
    quote:
      "RioVida Stix – это настоящая находка для моей активной жизни! Удобно брать с собой в командировки, вкус приятный. Особенно заметила улучшение сна и общего самочувствия. Рекомендую всем, кто ведет активный образ жизни!",
  },
  {
    id: "testimonial-sergey-40",
    image: "/images/avatar-sergey.webp",
    name: "Сергей",
    title: "Специалист IT, 40 лет",
    quote:
      "Благодарю Александра за рекомендацию 4Life Transfer Factor Classic. После месяца приема почувствовал значительное улучшение общего самочувствия. Особенно рад, что продукт помогает поддерживать здоровье без искусственных стимуляторов.",
  },
];

const TestimonialsPage = () => {
  return (
    <>
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
      <section className="section bg-white">
        <div className="container-custom">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
          >
            <SectionHeading title="Отзывы о продукции 4Life" centered />
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
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
