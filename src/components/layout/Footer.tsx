import { Helmet } from "react-helmet-async";
import { FaTelegram, FaWhatsapp, FaEnvelope, FaPhone } from "react-icons/fa";
import { Link } from "react-router-dom";
import { mainNav } from "../../config/site";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <Helmet>
        <title>4Life с Александром Тощевым - Контакты и Информация</title>
        <meta
          name="description"
          content="Контактная информация и социальные сети 4Life с Александром Тощевым. Свяжитесь с нами для консультаций и заказа продукции."
        />
        <meta name="robots" content="index, follow" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="4Life с Александром Тощевым - Контакты и Информация" />
        <meta
          name="twitter:description"
          content="Контактная информация и социальные сети 4Life с Александром Тощевым. Свяжитесь с нами для консультаций и заказа продукции."
        />
        <meta name="twitter:image" content="/images/og-contact.jpg" />
        <link rel="canonical" href="https://alexander-toshchev-4life.ru/contact" />
      </Helmet>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* О нас */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold mb-4">4Life</h3>
            <p className="text-gray-300 text-lg leading-relaxed">
              4Life - не просто продукты для здоровья, это философия жизни, основанная на научных исследованиях и
              проверенных результатах. Мы помогаем людям обрести здоровье, энергию и качество жизни.
            </p>
            <p className="text-gray-300 text-lg">
              Свяжитесь со мной для консультаций и заказа продукции. Я всегда готов помочь вам на пути к здоровью и
              благополучию.
            </p>
          </div>

          {/* Быстрые ссылки */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold mb-4">Быстрые ссылки</h3>
            <ul className="space-y-3">
              {mainNav.map((item) => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className="text-gray-300 hover:text-white transition-colors duration-300"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Каналы связи */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold mb-4">Контакты</h3>
            <div className="space-y-4">
              <a
                href="tel:+79267728717"
                className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors group"
                aria-label="Позвонить по телефону"
              >
                <div className="bg-purple-600 p-2 rounded-full group-hover:bg-purple-700 transition-colors">
                  <FaPhone className="h-5 w-5" />
                </div>
                <span className="text-lg font-medium">+7 926 772 8717</span>
              </a>
              <a
                href="mailto:atosotxvnew@gmail.com"
                className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors group"
                aria-label="Отправить Email"
              >
                <div className="bg-blue-500 p-2 rounded-full group-hover:bg-blue-600 transition-colors">
                  <FaEnvelope className="h-5 w-5" />
                </div>
                <span className="text-lg">atosotxvnew@gmail.com</span>
              </a>
              <a
                href="https://wa.me/79152561177"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors group"
                aria-label="Связаться через WhatsApp"
              >
                <div className="bg-green-500 p-2 rounded-full group-hover:bg-green-600 transition-colors">
                  <FaWhatsapp className="h-5 w-5" />
                </div>
                <span className="text-lg">WhatsApp</span>
              </a>
              <a
                href="https://t.me/+79152561177"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors group"
                aria-label="Связаться через Telegram"
              >
                <div className="bg-blue-400 p-2 rounded-full group-hover:bg-blue-500 transition-colors">
                  <FaTelegram className="h-5 w-5" />
                </div>
                <span className="text-lg">Telegram</span>
              </a>
            </div>
          </div>
        </div>

        {/* Дисклеймер */}
        <div className="mt-16 border-t border-gray-800 pt-8 text-center text-gray-300 text-sm">
          <div className="space-y-4">
            <p className="text-sm text-gray-300">© 2025 Александр Тощев. Все права защищены.</p>
            <p className="text-sm text-gray-300">
              Продукция 4Life не является лекарственным средством. Перед применением рекомендуется проконсультироваться
              со специалистом. Результаты могут отличаться.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
