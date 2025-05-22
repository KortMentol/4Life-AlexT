import { motion } from 'framer-motion';
import SectionHeading from '../components/ui/SectionHeading';
import TestimonialCard from '../components/ui/TestimonialCard';
import CallToAction from '../components/ui/CallToAction';

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
            <h1 className="text-4xl md:text-5xl font-bold mb-8">
              Отзывы клиентов и партнеров 4Life®
            </h1>
            <p className="text-xl text-gray-600">
              Результаты применения продукции 4Life и опыт сотрудничества с компанией вдохновляют тысячи людей по всему миру. Ниже приведены некоторые отзывы. Помните, что индивидуальные результаты могут отличаться.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Product Testimonials */}
      <section className="section bg-white">
        <div className="container-custom">
          <SectionHeading 
            title="Отзывы о продукции 4Life" 
            centered
          />

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
              name="Фрэнсис Степлтон"
              location="США"
              text="Эти продукты феноменальны, они изменили мою жизнь. Мне 50, но все вокруг говорят, что моей энергичности позавидуют двадцатилетние!"
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
              name="Елена К."
              location="Новосибирск"
              text="РиоВида Стикс - невероятно удобный продукт для моего активного образа жизни. Беру с собой в поездки, на тренировки. Приятный вкус и заметный прилив энергии без 'химического' эффекта энергетиков. Большое спасибо за рекомендацию!"
            />
          </div>
        </div>
      </section>

      {/* Partnership Testimonials */}
      <section className="section bg-gray-50">
        <div className="container-custom">
          <SectionHeading 
            title="Отзывы о партнерстве с Александром Тощевым" 
            centered
          />

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
      <section className="py-12 bg-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-sm text-gray-500 italic mb-8">
              Представленные отзывы отражают личный опыт конкретных людей. Результаты от применения продукции 4Life могут быть индивидуальны и зависят от множества факторов. Продукция 4Life не предназначена для диагностики, лечения или предотвращения каких-либо заболеваний. БАД. Перед применением проконсультируйтесь со специалистом.
            </p>
            
            <div className="bg-blue-50 p-8 rounded-lg border border-blue-100">
              <h3 className="text-xl font-semibold mb-4">Поделитесь своим опытом</h3>
              <p className="text-gray-700 mb-6">
                Если Вы уже используете продукцию 4Life или являетесь партнером, и хотите поделиться своим отзывом, пожалуйста, свяжитесь со мной.
              </p>
              <a href="/contact" className="btn btn-primary inline-block">
                Оставить отзыв
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