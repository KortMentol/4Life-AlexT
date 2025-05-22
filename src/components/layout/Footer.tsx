import { NavLink } from 'react-router-dom';
import { Shield, Mail, Phone } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand and Copyright */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Shield className="h-6 w-6 text-blue-400" />
              <span className="text-xl font-bold">АЛЕКСАНДР ТОЩЕВ</span>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              © {currentYear} Александр Геннадьевич Тощев. Все права защищены. 
              Сайт носит информационный характер и не является публичной офертой.
            </p>
          </div>

          {/* Important Information */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Важная информация</h4>
            <p className="text-gray-400 text-sm">
              БИОЛОГИЧЕСКИ АКТИВНАЯ ДОБАВКА К ПИЩЕ. НЕ ЯВЛЯЕТСЯ ЛЕКАРСТВЕННЫМ СРЕДСТВОМ. 
              Перед применением рекомендуется проконсультироваться со специалистом.
            </p>
          </div>

          {/* Duplicate Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Контакты</h4>
            <div className="flex items-center gap-2 mb-2">
              <Phone className="h-4 w-4 text-blue-400" />
              <a href="tel:+79152561177" className="text-gray-400 hover:text-white transition-colors">
                +7 (915) 256-11-77
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-blue-400" />
              <a href="mailto:atosotxvnew@gmail.com" className="text-gray-400 hover:text-white transition-colors">
                atosotxvnew@gmail.com
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Ссылки</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Политика конфиденциальности
                </a>
              </li>
              <li>
                <a 
                  href="https://russia.4life.com/12299550" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Официальный сайт 4Life Евразия (с моим ID)
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="pt-6 border-t border-gray-800">
          <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <li>
              <NavLink to="/" className="text-sm text-gray-400 hover:text-white transition-colors">
                Главная
              </NavLink>
            </li>
            <li>
              <NavLink to="/about" className="text-sm text-gray-400 hover:text-white transition-colors">
                Обо мне
              </NavLink>
            </li>
            <li>
              <NavLink to="/products" className="text-sm text-gray-400 hover:text-white transition-colors">
                Продукция 4Life
              </NavLink>
            </li>
            <li>
              <NavLink to="/purchase" className="text-sm text-gray-400 hover:text-white transition-colors">
                Как приобрести
              </NavLink>
            </li>
            <li>
              <NavLink to="/partnership" className="text-sm text-gray-400 hover:text-white transition-colors">
                Партнерство
              </NavLink>
            </li>
            <li>
              <NavLink to="/testimonials" className="text-sm text-gray-400 hover:text-white transition-colors">
                Отзывы
              </NavLink>
            </li>
            <li>
              <NavLink to="/contact" className="text-sm text-gray-400 hover:text-white transition-colors">
                Контакты
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;