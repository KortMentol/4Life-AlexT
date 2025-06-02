import { motion } from "framer-motion";
import SectionHeading from "../components/ui/SectionHeading";
import { Icons } from "../utils/icons";
const { Mail, MapPin, Phone } = Icons;
import { Helmet } from 'react-helmet-async';

const ContactPage = () => {
  return (
    <>
      <Helmet>
        <title>Контакты - Связь с Александром Тощевым и 4Life</title>
        <meta name="description" content="Свяжитесь со мной для консультации по продукции 4Life, оформления заказа или обсуждения партнерства. Узнайте больше о возможностях сотрудничества." />
        <meta property="og:title" content="Контакты - Связь с Александром Тощевым и 4Life" />
        <meta property="og:description" content="Свяжитесь со мной для консультации по продукции 4Life, оформления заказа или обсуждения партнерства. Узнайте больше о возможностях сотрудничества." />
        <meta property="og:image" content="/images/og-contact.jpg" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://alexander-toshchev-4life.ru/contact" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Контакты - Связь с Александром Тощевым и 4Life" />
        <meta name="twitter:description" content="Свяжитесь со мной для консультации по продукции 4Life, оформления заказа или обсуждения партнерства. Узнайте больше о возможностях сотрудничества." />
        <meta name="twitter:image" content="/images/og-contact.jpg" />
      </Helmet>
      {/* Hero Section */}
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="container-custom">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Свяжитесь со мной для консультации и сотрудничества</h1>
            <p className="text-xl text-gray-600">
              Я всегда открыт для общения и готов ответить на Ваши вопросы относительно продукции 4Life, помочь с
              оформлением заказа или обсудить возможности партнерства. Пожалуйста, выберите удобный для Вас способ
              связи.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="section bg-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <SectionHeading title="Контактная информация" />

              <div className="bg-gray-50 rounded-lg p-8 shadow-sm">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
                  <div className="shrink-0">
                    <img
                      src="https://images.pexels.com/photos/5081971/pexels-photo-5081971.jpeg"
                      alt="Александр Тощев"
                      className="w-32 h-32 rounded-full object-cover shadow-md"
                    />
                  </div>
                  <div className="text-center md:text-left">
                    <h3 className="text-2xl font-bold mb-2">Тощев Александр Геннадьевич</h3>
                    <p className="text-gray-600 mb-3">Билдер Элит 4Life Research</p>
                    <div className="space-y-6">
                      <div className="flex items-start">
                        <div className="bg-blue-100 p-3 rounded-full mr-4">
                          <Phone className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-800">Телефон</h4>
                          <a
                            href="tel:+79152561177"
                            className="text-blue-600 hover:text-blue-800 transition-colors text-lg font-medium"
                          >
                            +7 (915) 256-11-77
                          </a>
                          <p className="text-sm text-gray-500 mt-1">Доступен в WhatsApp, Telegram, Viber</p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="bg-blue-100 p-3 rounded-full mr-4">
                          <Mail className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-800">Email</h4>
                          <a
                            href="mailto:atosotxvnew@gmail.com"
                            className="text-blue-600 hover:text-blue-800 transition-colors text-lg font-medium"
                          >
                            atosotxvnew@gmail.com
                          </a>
                          <p className="text-sm text-gray-500 mt-1">Отвечаю в течение 24 часов</p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="bg-blue-100 p-3 rounded-full mr-4">
                          <MapPin className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-800">Местоположение</h4>
                          <p className="text-gray-600">Москва, Россия</p>
                          <p className="text-sm text-gray-500 mt-1">
                            Доступен для личных встреч по предварительной договоренности
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-200">
                      <h3 className="text-lg font-semibold mb-4">Часы работы</h3>
                      <div className="space-y-2 text-gray-700">
                        <p className="flex justify-between">
                          <span>Понедельник - Пятница:</span>
                          <span className="font-medium">9:00 - 20:00</span>
                        </p>
                        <p className="flex justify-between">
                          <span>Суббота:</span>
                          <span className="font-medium">10:00 - 18:00</span>
                        </p>
                        <p className="flex justify-between">
                          <span>Воскресенье:</span>
                          <span className="font-medium">Выходной</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <a
                  href="https://wa.me/79152561177"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-500 text-white py-3 px-4 rounded-md flex items-center justify-center hover:bg-green-600 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  <span>Написать в WhatsApp</span>
                </a>
                <a
                  href="https://t.me/+79152561177"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-500 text-white py-3 px-4 rounded-md flex items-center justify-center hover:bg-blue-600 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                  </svg>
                  <span>Написать в Telegram</span>
                </a>
              </div>

              <p className="text-gray-600 text-sm italic mb-8">
                При обращении, пожалуйста, укажите, что Вы нашли информацию на этом сайте. Если Вы оставляете сообщение,
                пожалуйста, укажите предпочтительный способ для обратной связи.
              </p>

              <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <MapPin className="h-5 w-5 text-blue-600 mr-2" />
                  Официальный Региональный Центр 4Life (РЦ67) в Москве
                </h3>
                <p className="text-gray-700 mb-4">
                  Вы также можете получить консультацию и приобрести продукцию 4Life в официальном Региональном Центре
                  компании в Москве. Важно: Для корректного оформления заказа на мой ID 12299550 и получения скидки,
                  пожалуйста, свяжитесь со мной ПЕРЕД визитом в офис для согласования деталей.
                </p>
                <p className="text-gray-700 font-medium mb-4">
                  г. Москва, ул. Селезнёвская, д. 11А, строение 2, 2-й этаж, офис 220А (РЦ67 4Life Research).
                </p>
                <div className="w-full h-60 rounded-lg overflow-hidden">
                  <iframe
                    src="https://2gis.ru/moscow/firm/70000001083400547/57.604224%2C55.78122/18?m=37.604213%2C55.781186%2F18.31"
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    title="Карта офиса 4Life в Москве"
                  ></iframe>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Closing Message */}
      <section className="py-12 bg-gray-50">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-xl text-gray-700 font-medium">
              Буду рад помочь Вам на пути к здоровью и благополучию с 4Life!
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactPage;
