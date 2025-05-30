import { motion } from "framer-motion";
import CallToAction from "../components/ui/CallToAction";
import SectionHeading from "../components/ui/SectionHeading";
import TestimonialCard from "../components/ui/TestimonialCard";

const TestimonialsPage = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="container-custom">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-8">Реальные истории успеха с 4Life®</h1>
            <div className="space-y-4">
              <p className="text-xl text-gray-600">
                Представленные отзывы – это истории реальных людей, которые нашли поддержку здоровья и новые возможности
                благодаря продукции 4Life и профессионализму Александра Тощева.
              </p>
              <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg">
                <p className="text-amber-800 font-medium">
                  <span className="font-bold">Важно:</span> Индивидуальные результаты могут отличаться. 
                  Продукция 4Life не является лекарственным средством и не предназначена для диагностики, лечения или 
                  профилактики заболеваний. Перед применением рекомендуется проконсультироваться с врачом.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Product Testimonials */}
      <section className="section bg-white">
        <div className="container-custom">
          <SectionHeading title="Отзывы о продукции 4Life" centered />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <TestimonialCard
              name="Sarah M."
              location="Канада"
              text="Я начала принимать 4Life Transfer Factor Tri-Factor Formula несколько месяцев назад по рекомендации подруги. Раньше я часто чувствовала себя уставшей и подверженной сезонным простудам. Сейчас я полна энергии, и мой иммунитет стал заметно крепче! Я очень довольна результатами и рекомендую этот продукт всем, кто хочет поддержать свое здоровье естественным путем."
            />
            <TestimonialCard
              name="David K."
              location="Великобритания"
              text="Как человек, ведущий активный образ жизни и занимающийся спортом, я искал качественную поддержку для своего организма. 4Life Transfer Factor Plus стал для меня настоящим открытием. Он помогает мне быстрее восстанавливаться после тренировок и поддерживать высокий уровень работоспособности. Отличный продукт!"
            />
            <TestimonialCard
              name="Ирина П."
              location="Москва"
              text="Я принимаю Трансфер Фактор Плюс уже больше года. За это время я заметила значительное улучшение общего самочувствия и стрессоустойчивости. Особенно заметна разница в осенне-зимний период - в то время как коллеги часто болеют, я продолжаю активно работать. Очень благодарна Александру за подробную консультацию по продукту."
            />
            <TestimonialCard
              name="Михаил С."
              location="Санкт-Петербург"
              text="Для меня как для человека, часто контактирующего с большим количеством людей, поддержка иммунитета крайне важна. Начал принимать 4Life Transfer Factor Tri-Factor Formula по совету Александра и отметил, что стал намного реже подхватывать сезонные вирусы. Буду продолжать прием и дальше!"
            />
            <TestimonialCard
              name="Елена, 48 лет"
              location="Москва"
              text="После курса 4Life Transfer Factor Tri-Factor Formula заметила значительное улучшение общего самочувствия. Раньше часто болела простудами, теперь это стало редкостью. Особенно впечатлил эффект после поездки в командировку – обычно возвращалась с простудой, а в этот раз осталась в отличной форме."
            />
            <TestimonialCard
              name="Дмитрий, 35 лет"
              location="Санкт-Петербург"
              text="Как спортсмен, я всегда ищу натуральные способы поддержки организма. 4Life Transfer Factor Plus стал отличным дополнением к моему режиму. После интенсивных тренировок восстанавливаюсь быстрее, и энергия держится весь день."
            />
            <TestimonialCard
              name="Анна, 55 лет"
              location="Новосибирск"
              text="RioVida Stix – это настоящая находка для моей активной жизни! Удобно брать с собой в командировки, вкус приятный. Особенно заметила улучшение сна и общего самочувствия. Рекомендую всем, кто ведет активный образ жизни!"
            />
            <TestimonialCard
              name="Сергей, 40 лет"
              location="Канада"
              text="Благодарю Александра за рекомендацию 4Life Transfer Factor Classic. После месяца приема почувствовал значительное улучшение общего самочувствия. Особенно рад, что продукт помогает поддерживать здоровье без искусственных стимуляторов."
            />
          </div>
        </div>
      </section>

      {/* Partnership Testimonials */}
      <section className="section bg-gray-50">
        <div className="container-custom">
          <SectionHeading title="Отзывы о партнерстве с Александром Тощевым" centered />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <TestimonialCard
              name="Наталья В."
              location="Аффилиат 4Life"
              text="Сотрудничество с Александром Геннадьевичем – это большая удача. Он не только прекрасный знаток продукции, но и мудрый наставник. Благодаря его поддержке и обучению в 'Команде Компетентных Лидеров', я смогла быстро стартовать в бизнесе и уже вижу первые результаты. Рекомендую Александра как надежного спонсора!"
            />
            <TestimonialCard
              name="Сергей Д."
              location="Аффилиат 4Life"
              text="Когда я решил начать бизнес с 4Life, у меня было много вопросов и сомнений. Александр всегда находил время для подробных консультаций, делился рабочими инструментами и стратегиями. Его подход к бизнесу - профессиональный и системный, без пустых обещаний и давления. Благодарен за поддержку и знания!"
            />
            <TestimonialCard
              name="Марина Л."
              location="Аффилиат 4Life"
              text="Самое ценное для меня в наставничестве Александра - его способность объяснять сложные вещи простым языком и выстраивать индивидуальную стратегию развития. За полгода сотрудничества мне удалось не только улучшить собственное здоровье, но и создать стабильный дополнительный доход. Спасибо за вдохновение и поддержку!"
            />
          </div>
        </div>
      </section>

      {/* Disclaimer and Share Experience */}
      <section className="section bg-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <div className="bg-yellow-50 p-6 rounded-lg mb-8">
              <h4 className="text-red-600 font-semibold mb-2">Важно знать</h4>
              <p className="text-sm text-gray-600">
                Представленные отзывы отражают личный опыт конкретных людей. Результаты от применения продукции 4Life
                могут быть индивидуальны и зависят от множества факторов. Продукция 4Life не предназначена для
                диагностики, лечения или предотвращения заболеваний. БАД. Перед применением проконсультируйтесь со
                специалистом.
              </p>
            </div>
            <div className="bg-blue-50 p-8 rounded-lg border border-blue-100">
              <h3 className="text-xl font-semibold mb-4">Поделитесь своей историей успеха</h3>
              <p className="text-gray-700 mb-6">
                Если Вы уже используете продукцию 4Life или являетесь партнером, и хотите поделиться своей историей,
                пожалуйста, свяжитесь со мной. Ваши отзывы помогают другим людям сделать правильный выбор!
              </p>
              <a href="/contact" className="btn btn-primary inline-block">
                {" "}
                Рассказать свою историю{" "}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <CallToAction
        title="Присоединяйтесь к тысячам довольных клиентов 4Life"
        description="Начните свой путь к здоровью, благополучию и новым возможностям уже сегодня! Я готов помочь Вам на каждом этапе."
        primaryButtonText="Приобрести продукцию со скидкой"
        primaryButtonLink="/purchase"
        secondaryButtonText="Узнать о партнерстве"
        secondaryButtonLink="/partnership"
      />
    </>
  );
};

export default TestimonialsPage;
