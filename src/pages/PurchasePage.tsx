import { motion } from 'framer-motion';
import { Icons } from '../utils/icons';
const { Check, ExternalLink } = Icons;
import SectionHeading from '../components/ui/SectionHeading';
import CallToAction from '../components/ui/CallToAction';

const PurchasePage = () => {
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
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center">
              Приобретайте продукцию 4Life® с выгодой до 25% и моей поддержкой
            </h1>
            <p className="text-xl text-gray-600 text-center">
              Став Приоритетным клиентом или Аффилиатом компании 4Life с моим персональным ID 12299550 (Тощев Александр), Вы получаете доступ к специальным ценам (скидка от 15% до 25% от розничной цены), а также мою информационную поддержку и консультации.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Online Registration and Order */}
      <section className="section bg-white">
        <div className="container-custom">
          <SectionHeading 
            title="Способ 1: Регистрация и заказ на официальном сайте 4Life" 
            centered
          />

          <div className="max-w-4xl mx-auto">
            <div className="mb-12">
              <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg mb-8">
                <p className="text-blue-700 font-medium">
                  Регистрация на официальном сайте – самый простой и удобный способ начать пользоваться продукцией 4Life со скидкой.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <motion.div 
                  className="card p-6 h-full flex flex-col"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="bg-gray-100 rounded-full h-12 w-12 flex items-center justify-center mb-4">
                    <span className="text-blue-600 font-bold text-xl">1</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Перейдите на страницу регистрации</h3>
                  <p className="text-gray-600 mb-4 flex-grow">
                    Нажмите на кнопку ниже. Мой ID инроллера и спонсора 12299550 (Тощев Александр) будет указан автоматически. Это гарантирует, что Вы попадете в мою структуру и получите все преимущества.
                  </p>
                  <a 
                    href="https://russia.4life.com/12299550/signup/PC" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn btn-primary flex items-center justify-center"
                  >
                    <span>Зарегистрироваться как Приоритетный клиент/Аффилиат</span>
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </a>
                </motion.div>

                <motion.div 
                  className="card p-6 h-full flex flex-col"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                >
                  <div className="bg-gray-100 rounded-full h-12 w-12 flex items-center justify-center mb-4">
                    <span className="text-blue-600 font-bold text-xl">2</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Заполните анкету</h3>
                  <p className="text-gray-600 mb-4 flex-grow">
                    Укажите Ваши личные данные, адрес доставки. Все поля, отмеченные звездочкой, обязательны для заполнения. Используйте буквы русского алфавита.
                  </p>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-700">
                      <strong>№ инроллера:</strong> 12299550<br />
                      <strong>№ спонсора:</strong> 12299550<br />
                      <strong>Имя спонсора:</strong> Тощев Александр
                    </p>
                  </div>
                </motion.div>

                <motion.div 
                  className="card p-6 h-full flex flex-col"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                >
                  <div className="bg-gray-100 rounded-full h-12 w-12 flex items-center justify-center mb-4">
                    <span className="text-blue-600 font-bold text-xl">3</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Подтвердите регистрацию и совершайте покупки</h3>
                  <p className="text-gray-600 mb-4 flex-grow">
                    После успешной регистрации Вы получите доступ в личный кабинет на сайте 4Life, где сможете самостоятельно выбирать продукцию, ознакомиться с актуальными акциями и оформлять заказы с доставкой.
                  </p>
                  <a 
                    href="https://russia.4life.com/12299550" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn btn-primary flex items-center justify-center"
                  >
                    <span>Перейти в магазин после регистрации</span>
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </a>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Consultation and Moscow Office */}
      <section className="section bg-gray-50">
        <div className="container-custom">
          <SectionHeading 
            title="Способ 2: Помощь с выбором и заказ через офис в Москве" 
            centered
          />

          <div className="max-w-4xl mx-auto">
            <motion.div 
              className="grid md:grid-cols-2 gap-12 items-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div>
                <p className="text-lg text-gray-700 mb-6">
                  Если Вам требуется индивидуальная консультация по подбору продукции, или Вы предпочитаете оформить заказ при личном визите в официальный Региональный Центр (РЦ) компании 4Life в Москве, пожалуйста, свяжитесь со мной предварительно. Я помогу Вам с выбором и предоставлю всю необходимую информацию для оформления заказа с использованием моего ID 12299550 для получения скидки.
                </p>

                <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
                  <h3 className="text-xl font-semibold mb-4">Контактная информация:</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-2" />
                      <span>Телефон: <a href="tel:+79152561177" className="text-blue-600 hover:underline">+7 (915) 256-11-77</a></span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-2" />
                      <span>Email: <a href="mailto:atosotxvnew@gmail.com" className="text-blue-600 hover:underline">atosotxvnew@gmail.com</a></span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-2" />
                      <span>WhatsApp/Telegram: <a href="https://wa.me/79152561177" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Написать в WhatsApp</a></span>
                    </li>
                  </ul>
                </div>

                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-lg">
                  <p className="text-yellow-800 text-sm">
                    <strong>Важно:</strong> Пожалуйста, обратите внимание, что для получения скидки и корректного оформления заказа через офис на мой ID, необходимо предварительно согласовать Ваш визит со мной.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4">Адрес офиса РЦ67 в Москве:</h3>
                <p className="text-gray-700 mb-4">
                  Ул. Селезнёвская, 11А, строение 2, 2-й этаж, офис 220А (4Life Research РЦ67).
                </p>
                <div className="rounded-lg overflow-hidden shadow-lg">
                  <iframe 
                    src="https://2gis.ru/moscow/firm/70000001083400547/57.604224%2C55.78122/18?m=37.604213%2C55.781186%2F18.31" 
                    width="100%" 
                    height="300" 
                    frameBorder="0" 
                    title="Карта офиса 4Life в Москве"
                  ></iframe>
                </div>
                <div className="mt-4 text-center">
                  <a 
                    href="https://2gis.ru/moscow/firm/70000001083400547?floor=1&m=37.604213%2C55.781186%2F18.31" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn btn-outline inline-flex items-center"
                  >
                    <span>Показать офис на карте (2GIS)</span>
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Advantages */}
      <section className="section bg-white">
        <div className="container-custom">
          <SectionHeading 
            title="Ваши выгоды при регистрации с моим ID" 
            centered
          />

          <motion.div 
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-gray-50 rounded-lg p-8 shadow-sm">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <ul className="space-y-6">
                    <li className="flex">
                      <div className="bg-green-100 rounded-full h-10 w-10 flex items-center justify-center mr-4 flex-shrink-0">
                        <Check className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Доступ к партнерским ценам</h4>
                        <p className="text-gray-600">Экономия от 15% до 25% по сравнению с розничными ценами.</p>
                      </div>
                    </li>
                    <li className="flex">
                      <div className="bg-green-100 rounded-full h-10 w-10 flex items-center justify-center mr-4 flex-shrink-0">
                        <Check className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Бонус за личные покупки</h4>
                        <p className="text-gray-600">Возможность получать кэшбэк (20% от месячного объема LP, превышающего 100 LP, начиная с 4-го месяца для Приоритетных клиентов).</p>
                      </div>
                    </li>
                  </ul>
                </div>

                <div>
                  <ul className="space-y-6">
                    <li className="flex">
                      <div className="bg-green-100 rounded-full h-10 w-10 flex items-center justify-center mr-4 flex-shrink-0">
                        <Check className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Гарантия удовлетворенности</h4>
                        <p className="text-gray-600">30-дневная гарантия возврата денег на продукцию (согласно политике компании).</p>
                      </div>
                    </li>
                    <li className="flex">
                      <div className="bg-green-100 rounded-full h-10 w-10 flex items-center justify-center mr-4 flex-shrink-0">
                        <Check className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Моя персональная поддержка</h4>
                        <p className="text-gray-600">Консультации по продукции и помощь в решении возникающих вопросов.</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Call to Action */}
      <CallToAction
        title="Готовы начать?"
        description="Перейдите к регистрации или свяжитесь со мной для получения дополнительной информации и помощи с выбором продукции."
        primaryButtonText="Зарегистрироваться (ID 12299550)"
        primaryButtonLink="https://russia.4life.com/12299550/signup/PC"
        secondaryButtonText="Связаться для консультации"
        secondaryButtonLink="/contact"
        isExternal={true}
      />
    </>
  );
};

export default PurchasePage;