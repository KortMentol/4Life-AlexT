import { NavLink } from "react-router-dom";
import { Icons } from "../../utils/icons";
const { Shield, Mail, Phone } = Icons;

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
              {currentYear} Александр Геннадьевич Тощев. Все права защищены.
            </p>
            <p className="text-sm text-gray-500 mt-4 mb-4">
              <strong>Важно:</strong> Продукция 4Life Research не предназначена для диагностики, лечения или предотвращения каких-либо заболеваний. Биологически активные добавки к пище не являются лекарственными средствами. Перед использованием проконсультируйтесь со специалистом. Результаты индивидуальны. Сведения на сайте носят информационный характер и не являются публичной офертой.
            </p>
          </div>

          {/* Important Information */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Важная информация</h4>
            <p className="text-gray-400 text-sm">
              БИОЛОГИЧЕСКИ АКТИВНАЯ ДОБАВКА К ПИЩЕ. НЕ ЯВЛЯЕТСЯ ЛЕКАРСТВЕННЫМ СРЕДСТВОМ.
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Имеются противопоказания. Необходима консультация специалиста.
            </p>
          </div>

          {/* Duplicate Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Контакты</h4>
            <div className="flex items-center gap-2 mb-2">
              <Phone className="h-4 w-4 text-blue-400" />
              <a 
                href="tel:+79152561177" 
                className="text-gray-400 hover:text-white transition-colors inline-flex items-center"
                aria-label="Позвонить по номеру +7 (915) 256-11-77"
              >
                <span>+7 (915) 256-11-77</span>
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-blue-400" />
              <a 
                href="mailto:atosotxvnew@gmail.com" 
                className="text-gray-400 hover:text-white transition-colors inline-flex items-center"
                aria-label="Написать письмо на atosotxvnew@gmail.com"
              >
                <span>atosotxvnew@gmail.com</span>
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Ссылки</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://russia.4life.com/12299550"
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="text-gray-400 hover:text-white transition-colors inline-flex items-center"
                  aria-label="Перейти на официальный сайт 4Life Евразия (откроется в новой вкладке)"
                >
                  <span>Официальный сайт 4Life Евразия (с моим ID)</span>
                  <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
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
