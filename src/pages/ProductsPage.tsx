import { motion } from 'framer-motion';
import SectionHeading from '../components/ui/SectionHeading';
import ProductCard from '../components/ui/ProductCard';
import CallToAction from '../components/ui/CallToAction';

const ProductsPage = () => {
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
              Продукция 4Life®: Научный подход к поддержке Вашего иммунитета
            </h1>
          </motion.div>
        </div>
      </section>

      {/* What are Transfer Factors */}
      <section className="section bg-white">
        <div className="container-custom">
          <SectionHeading 
            title="Трансфер Факторы: 'Молекулы иммунной памяти' для Вашего организма" 
          />

          <motion.div 
            className="grid md:grid-cols-2 gap-12 items-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div>
              <p className="text-lg text-gray-700 mb-4">
                Основу многих продуктов 4Life составляют Трансфер Факторы – уникальные пептидные молекулы, которые играют ключевую роль в функционировании иммунной системы. Впервые они были открыты доктором Шервудом Лоуренсом в 1949 году. Он обнаружил, что иммунный &apos;опыт&apos; может передаваться от одного организма к другому через экстракт лейкоцитов.
              </p>
              <p className="text-lg text-gray-700 mb-4">
                Компания 4Life Research усовершенствовала эту концепцию, разработав запатентованные технологии получения Трансфер Факторов из молозива коров (UltraFactor XF® и OvoFactor® из желтков куриных яиц). Эти молекулы являются природными компонентами, идентичными тем, что вырабатываются в организме человека, и служат для &apos;обучения&apos; и &apos;настройки&apos; иммунных клеток.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3">Как работают Трансфер Факторы 4Life:</h3>
              <ul className="space-y-6">
                <li className="flex">
                  <div className="bg-blue-100 rounded-full h-10 w-10 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                    <span className="text-blue-600 font-semibold">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Распознавание</h4>
                    <p className="text-gray-600">Помогают иммунным клеткам быстрее и точнее идентифицировать потенциальные угрозы (вирусы, бактерии, атипичные клетки).</p>
                  </div>
                </li>
                <li className="flex">
                  <div className="bg-blue-100 rounded-full h-10 w-10 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                    <span className="text-blue-600 font-semibold">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Реагирование</h4>
                    <p className="text-gray-600">Способствуют адекватному иммунному ответу – его активации при необходимости или, наоборот, снижению гиперактивности (например, при аллергических или аутоиммунных реакциях), приводя систему в баланс.</p>
                  </div>
                </li>
                <li className="flex">
                  <div className="bg-blue-100 rounded-full h-10 w-10 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                    <span className="text-blue-600 font-semibold">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Запоминание</h4>
                    <p className="text-gray-600">Помогают иммунной системе &apos;запомнить&apos; характеристики угроз, чтобы при повторном столкновении реакция была более быстрой и эффективной.</p>
                  </div>
                </li>
              </ul>
              <p className="text-sm text-gray-500 mt-4 italic">
                Продукция 4Life с Трансфер Факторами не является лекарством и не предназначена для лечения заболеваний. Она создана для интеллектуальной поддержки и оптимизации работы Вашей иммунной системы.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Key Products */}
      <section className="section bg-gray-50">
        <div className="container-custom">
          <SectionHeading 
            title="Ключевые продукты с Трансфер Факторами" 
            subtitle="Ассортимент 4Life включает разнообразные продукты для поддержки иммунитета и общего оздоровления. Ниже представлены некоторые из флагманских продуктов на основе Трансфер Факторов."
            centered
          />

          <div className="grid md:grid-cols-3 gap-8">
            <ProductCard 
              image="https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg"
              title="4Life Transfer Factor® Classic"
              description="Базовый продукт, содержащий концентрированные трансфер факторы из молозива коров (UltraFactor XF®). Обеспечивает фундаментальную поддержку естественной способности иммунной системы правильно реагировать на вызовы. Отлично подходит для ежедневной поддержки."
            />
            <ProductCard 
              image="https://images.pexels.com/photos/3683056/pexels-photo-3683056.jpeg"
              title="4Life Transfer Factor® Tri-Factor® Formula"
              description="Усовершенствованная формула, сочетающая трансфер факторы из молозива коров (UltraFactor XF®) и желтков куриных яиц (OvoFactor®), а также низкомолекулярные фракции NanoFactor® для более широкой и сбалансированной иммунной поддержки."
            />
            <ProductCard 
              image="https://images.pexels.com/photos/3683042/pexels-photo-3683042.jpeg"
              title="4Life Transfer Factor Plus® Tri-Factor® Formula"
              description="Наиболее мощная формула иммунной поддержки от 4Life. Содержит Tri-Factor® Formula, усиленную фирменной смесью растительных компонентов (кордицепс, агарик бразильский, грибы майтаке и шиитаке, цинк и другие), которые синергично повышают активность иммунных клеток."
            />
          </div>

          <p className="text-center text-gray-600 mt-8 italic">
            Это лишь некоторые из продуктов 4Life. Полный каталог, подробные описания, состав и актуальные цены доступны на официальном сайте компании.
          </p>
        </div>
      </section>

      {/* Product Lines */}
      <section className="section bg-white">
        <div className="container-custom">
          <SectionHeading 
            title="Ознакомьтесь со всем ассортиментом продукции 4Life" 
            centered
          />

          <motion.div 
            className="max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-lg text-gray-700 mb-6 text-center">
              Компания 4Life предлагает широкий спектр продуктов, направленных на поддержку различных систем организма, контроль веса, повышение энергии и общее улучшение самочувствия. Среди основных линеек:
            </p>

            <div className="bg-gray-50 rounded-lg p-6 shadow-sm mb-8">
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="bg-blue-500 rounded-full p-1 mr-3 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                  <span className="text-gray-700">
                    <strong>Поддержка иммунной системы с Трансфер Фактор</strong>
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-500 rounded-full p-1 mr-3 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                  <span className="text-gray-700">
                    <strong>Целенаправленный Трансфер Фактор</strong> (для конкретных систем: сердечно-сосудистой, нервной, эндокринной и др.)
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-500 rounded-full p-1 mr-3 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                  <span className="text-gray-700">
                    <strong>Digest4Life®</strong> (поддержка пищеварительной системы)
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-500 rounded-full p-1 mr-3 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                  <span className="text-gray-700">
                    <strong>4LifeTransform®</strong> (продукты для трансформации тела и активного образа жизни)
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-500 rounded-full p-1 mr-3 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                  <span className="text-gray-700">
                    <strong>РиоВида®</strong> (антиоксидантная поддержка с суперфруктами и Трансфер Фактором)
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-500 rounded-full p-1 mr-3 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                  <span className="text-gray-700">
                    <strong>Энерджи Гоу Стикс®</strong> (природный заряд бодрости и энергии)
                  </span>
                </li>
              </ul>
            </div>

            <p className="text-center text-gray-700 mb-8">
              Чтобы ознакомиться с полным каталогом продукции, актуальными ценами и оформить заказ с Вашей скидкой, перейдите в официальный интернет-магазин 4Life, используя мой ID.
            </p>

            <div className="text-center">
              <a 
                href="https://russia.4life.com/12299550" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                Перейти в официальный магазин 4Life (ID 12299550)
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-8 bg-gray-50">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-sm text-gray-500 italic">
              Продукция, упомянутая на этом сайте, не предназначена для диагностики, лечения или предотвращения каких-либо заболеваний. Перед применением БАД рекомендуется проконсультироваться с врачом. Информация на сайте относится к рынку Евразии.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <CallToAction
        title="Хотите узнать, как приобрести продукцию со скидкой?"
        description="Зарегистрируйтесь как Приоритетный клиент с моим ID 12299550 и получайте скидку до 25% от розничной цены."
        primaryButtonText="Как приобрести продукцию"
        primaryButtonLink="/purchase"
        secondaryButtonText="Получить консультацию"
        secondaryButtonLink="/contact"
      />
    </>
  );
};

export default ProductsPage;