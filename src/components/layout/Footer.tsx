import { Helmet } from "react-helmet-async";
import { FaTelegram, FaWhatsapp, FaEnvelope } from "react-icons/fa";
import { Link } from "react-router-dom";

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
              <li>
                <Link 
                  to="/" 
                  className="text-gray-300 hover:text-white transition-colors duration-300"
                >
                  Главная
                </Link>
              </li>
              <li>
                <Link 
                  to="/about" 
                  className="text-gray-300 hover:text-white transition-colors duration-300"
                >
                  О нас
                </Link>
              </li>
              <li>
                <Link 
                  to="/products" 
                  className="text-gray-300 hover:text-white transition-colors duration-300"
                >
                  Продукты
                </Link>
              </li>
              <li>
                <Link 
                  to="/partnership" 
                  className="text-gray-300 hover:text-white transition-colors duration-300"
                >
                  Партнерство
                </Link>
              </li>
              <li>
                <Link 
                  to="/testimonials" 
                  className="text-gray-300 hover:text-white transition-colors duration-300"
                >
                  Отзывы
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  className="text-gray-300 hover:text-white transition-colors duration-300"
                >
                  Контакты
                </Link>
              </li>
            </ul>
          </div>

          {/* Каналы связи */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold mb-4">Каналы связи</h3>
            <div className="flex space-x-6">
              <a
                href="https://wa.me/79152561177"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors group"
                aria-label="Связаться через WhatsApp"
              >
                <div className="flex flex-col items-center group-hover:scale-110 transition-transform duration-300">
                  <FaWhatsapp className="h-8 w-8 text-gray-300 group-hover:text-white" aria-hidden="true" />
                  <span className="text-sm text-gray-300 group-hover:text-white">WhatsApp</span>
                </div>
              </a>
              <a
                href="https://t.me/+79152561177"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors group"
                aria-label="Связаться через Telegram"
              >
                <div className="flex flex-col items-center group-hover:scale-110 transition-transform duration-300">
                  <FaTelegram className="h-8 w-8 text-gray-300 group-hover:text-white" aria-hidden="true" />
                  <span className="text-sm text-gray-300 group-hover:text-white">Telegram</span>
                </div>
              </a>
              <a
                href="mailto:atosotxvnew@gmail.com"
                className="text-gray-300 hover:text-white transition-colors group"
                aria-label="Отправить Email"
              >
                <div className="flex flex-col items-center group-hover:scale-110 transition-transform duration-300">
                  <FaEnvelope className="h-8 w-8 text-gray-300 group-hover:text-white" aria-hidden="true" />
                  <span className="text-sm text-gray-300 group-hover:text-white">Email</span>
                </div>
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
