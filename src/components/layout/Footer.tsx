import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { FaEnvelope, FaTelegram, FaWhatsapp } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <Helmet>
        <title>4Life с Александром Тощевым - Контакты и Информация</title>
        <meta
          name="description"
          content="Контактная информация и социальные сети 4Life с Александром Тощевым. Свяжитесь с нами для консультаций и заказа продукции."
        />
      </Helmet>

      <div className="container mx-auto px-4">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* О нас */}
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
            <h3 className="text-xl font-semibold mb-4">О нас</h3>
            <p className="text-gray-400 mb-4">
              4Life - это не просто продукты для здоровья, это философия жизни, основанная на научных исследованиях и
              проверенных результатах. Мы помогаем людям обрести здоровье, энергию и качество жизни.
            </p>
            <p className="text-gray-400">
              Свяжитесь с нами для консультаций и заказа продукции. Мы всегда готовы помочь вам на пути к здоровью и
              благополучию.
            </p>
          </motion.div>

          {/* Быстрые ссылки */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className="text-xl font-semibold mb-4">Быстрые ссылки</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                  Главная
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition-colors">
                  О нас
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-400 hover:text-white transition-colors">
                  Продукты
                </Link>
              </li>
              <li>
                <Link to="/partnership" className="text-gray-400 hover:text-white transition-colors">
                  Партнерство
                </Link>
              </li>
              <li>
                <Link to="/testimonials" className="text-gray-400 hover:text-white transition-colors">
                  Отзывы
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Контакты
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Каналы связи */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-xl font-semibold mb-4">Каналы связи</h3>
            <div className="flex space-x-4">
              <a
                href="https://wa.me/79152561177"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors group"
                aria-label="Связаться через WhatsApp"
              >
                <div className="flex flex-col items-center">
                  <FaWhatsapp className="h-6 w-6" aria-hidden="true" />
                  <span className="text-xs mt-1">WhatsApp</span>
                </div>
              </a>
              <a
                href="https://t.me/+79152561177"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors group"
                aria-label="Связаться через Telegram"
              >
                <div className="flex flex-col items-center">
                  <FaTelegram className="h-6 w-6" aria-hidden="true" />
                  <span className="text-xs mt-1">Telegram</span>
                </div>
              </a>
              <a
                href="mailto:atosotxvnew@gmail.com"
                className="text-gray-400 hover:text-white transition-colors group"
                aria-label="Отправить Email"
              >
                <div className="flex flex-col items-center">
                  <FaEnvelope className="h-6 w-6" aria-hidden="true" />
                  <span className="text-xs mt-1">Email</span>
                </div>
              </a>
            </div>
          </motion.div>
        </motion.div>

        {/* Дисклеймер */}
        <motion.div
          className="mt-12 border-t border-gray-800 pt-8 text-center text-gray-400 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <p className="mb-4">
            Продукция 4Life не является лекарственным средством. Перед применением рекомендуется проконсультироваться со
            специалистом. Результаты могут отличаться.
          </p>
          <p className="mt-2">
            Все права защищены 2025 4Life с Александром Тощевым. При использовании материалов сайта активная ссылка на
            источник обязательна.
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
