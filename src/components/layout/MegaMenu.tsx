import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";

interface MegaMenuProps {
  activeItem: string | null;
  onMouseEnter: (href: string) => void;
  onMouseLeave: () => void;
  scrolled: boolean;
  handleNavClick: () => void;
}

// Структура для контента мега-меню
const megaMenuContent: Record<
  string,
  {
    title: string;
    description: string;
    links: { title: string; href: string; icon?: string }[];
  } | null
> = {
  "/": {
    title: "Главная страница",
    description: "Основные разделы сайта",
    links: [
      { title: "О нашей компании", href: "/#about" },
      { title: "Продукты для иммунитета", href: "/#products" },
      { title: "Бизнес с 4Life", href: "/#business" },
      { title: "Связаться с нами", href: "/#contact" },
    ],
  },
  "/products": {
    title: "Продукты 4Life",
    description: "Инновационные продукты для поддержки иммунной системы",
    links: [
      { title: "Transfer Factor Plus", href: "/products#transfer-factor-plus" },
      { title: "Transfer Factor Tri-Factor", href: "/products#tri-factor" },
      { title: "RioVida", href: "/products#riovida" },
      { title: "Управление весом", href: "/products#weight" },
      { title: "Красота и уход", href: "/products#beauty" },
      { title: "Все продукты", href: "/products" },
    ],
  },
  "/how-to-buy": {
    title: "Как приобрести",
    description: "Простые способы заказать продукцию 4Life",
    links: [
      { title: "Заказ через дистрибьютора", href: "/how-to-buy#distributor" },
      { title: "Регистрация клиента", href: "/how-to-buy#registration" },
      { title: "Доставка и оплата", href: "/how-to-buy#delivery" },
      { title: "Скидки и акции", href: "/how-to-buy#discounts" },
    ],
  },
  "/about": {
    title: "О компании 4Life",
    description: "История, миссия и ценности компании",
    links: [
      { title: "История компании", href: "/about#history" },
      { title: "Научные исследования", href: "/about#science" },
      { title: "Сертификаты и награды", href: "/about#certificates" },
      { title: "Социальная ответственность", href: "/about#social" },
    ],
  },
  "/about-me": {
    title: "Обо мне",
    description: "Информация о вашем дистрибьюторе",
    links: [
      { title: "Моя история с 4Life", href: "/about-me#story" },
      { title: "Достижения и опыт", href: "/about-me#achievements" },
      { title: "Моя команда", href: "/about-me#team" },
      { title: "Отзывы клиентов", href: "/about-me#testimonials" },
    ],
  },
  "/partnership": {
    title: "Партнерство с 4Life",
    description: "Возможности для бизнеса и личностного роста",
    links: [
      { title: "Преимущества", href: "/partnership#benefits" },
      { title: "Маркетинговый план", href: "/partnership#marketing-plan" },
      { title: "Истории успеха", href: "/partnership#success-stories" },
      { title: "Обучение и поддержка", href: "/partnership#training" },
      { title: "Стать партнером", href: "/partnership#join" },
    ],
  },
  "/contact": null,
};

const MegaMenu: React.FC<MegaMenuProps> = ({
  activeItem,
  onMouseEnter,
  onMouseLeave,
  // scrolled не используется
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<string | null>(null);

  // Проверяем, есть ли контент для активного элемента
  const hasContent = activeItem && megaMenuContent[activeItem];

  // Функция для определения активного раздела на основе скролла
  useEffect(() => {
    if (location.pathname !== "/") return;

    const checkScroll = () => {
      // Проверяем только для главной страницы
      const sections = [
        { id: "about", offset: 0 },
        { id: "products", offset: 0 },
        { id: "business", offset: 0 },
        { id: "contact", offset: 0 },
      ];

      // Находим все секции на странице
      sections.forEach((section) => {
        const element = document.getElementById(section.id);
        if (element) {
          section.offset = element.offsetTop - 150; // Учитываем отступ для шапки
        }
      });

      // Сортируем секции по их положению на странице
      sections.sort((a, b) => a.offset - b.offset);

      // Определяем текущую активную секцию
      const scrollPosition = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight;
      const windowHeight = window.innerHeight;
      let currentSection = null;

      // Проверяем, находимся ли мы в нижней части страницы
      const isNearBottom = scrollPosition + windowHeight >= scrollHeight - 100;

      if (isNearBottom) {
        // Если мы близко к низу страницы, активируем последнюю секцию
        currentSection = "contact";
      } else {
        // Иначе определяем секцию по скроллу
        for (let i = 0; i < sections.length; i++) {
          const section = sections[i];
          if (section && scrollPosition >= section.offset) {
            currentSection = section.id;
          } else {
            break;
          }
        }
      }

      // Обновляем URL с хешем при изменении активной секции
      if (currentSection && currentSection !== activeSection) {
        // Используем history.replaceState для обновления URL без перезагрузки страницы
        const newUrl = `/#${currentSection}`;
        window.history.replaceState(null, "", newUrl);
      } else if (!currentSection && location.hash) {
        // Если нет активной секции, но есть хеш в URL, удаляем его
        window.history.replaceState(null, "", "/");
      }

      setActiveSection(currentSection);
    };

    // Добавляем слушатель события скролла
    window.addEventListener("scroll", checkScroll);

    // Проверяем при монтировании компонента
    checkScroll();

    // Удаляем слушатель при размонтировании
    return () => {
      window.removeEventListener("scroll", checkScroll);
    };
  }, [location.pathname, activeSection]);

  // Обработчик клика по ссылке в мега-меню
  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    e.preventDefault();
    onMouseLeave();

    // Проверяем, содержит ли ссылка хэш
    if (href.includes("#")) {
      const parts = href.split("#");
      const path = parts[0];
      const hash = parts.length > 1 ? parts[1] : "";
      const currentPath = location.pathname;

      // Если мы уже на нужной странице
      if ((path === "/" && currentPath === "/") || path === currentPath) {
        // Проверяем, существует ли элемент с таким id
        const element = hash ? document.getElementById(hash) : null;

        if (element) {
          // Проверяем, находится ли элемент в видимой области
          const rect = element.getBoundingClientRect();
          const isInView =
            rect.top >= 0 &&
            rect.top <= 150 && // Допустимое отклонение от верха экрана
            rect.left >= 0 &&
            rect.right <=
              (window.innerWidth || document.documentElement.clientWidth);

          // Если элемент уже в видимой области, просто закрываем меню без скролла
          if (isInView) {
            return;
          }

          // Если элемент не в видимой области, прокручиваем к нему и обновляем URL
          setTimeout(() => {
            // Обновляем URL с хэшем без перезагрузки страницы
            navigate(`${path}#${hash}`, { replace: false });

            const lenisInstance = (window as any).lenis;
            if (lenisInstance) {
              lenisInstance.scrollTo(element, { offset: -100 });
            } else {
              element.scrollIntoView({ behavior: "smooth", block: "start" });
              window.scrollBy(0, -100);
            }
          }, 100);
        } else {
          // Если элемент не найден, используем React Router для навигации
          navigate(href);
        }
      } else {
        // Если мы на другой странице, используем React Router с хэшем для истории браузера
        // Используем React Router для бесшовной навигации с сохранением хэша в истории
        navigate(`${path || "/"}${hash ? "#" + hash : ""}`);
      }
    } else {
      // Если ссылка без хэша, используем React Router
      navigate(href);
    }
  };

  // Функция для определения активного класса
  const isLinkActive = (linkHref: string): boolean => {
    // Для главной страницы используем активную секцию
    if (location.pathname === "/" && linkHref.includes("#")) {
      const hash = linkHref.split("#")[1];
      return hash === activeSection;
    }

    // Для других страниц используем стандартную логику
    if (linkHref.includes("#")) {
      const parts = linkHref.split("#");
      const path = parts[0];
      const hash = parts.length > 1 ? parts[1] : "";

      // Проверяем URL и хэш
      const urlMatch = location.pathname === path;
      const hashMatch = location.hash === (hash ? "#" + hash : "");

      // Если есть хэш в URL, проверяем его соответствие
      if (location.hash) {
        return urlMatch && hashMatch;
      }

      // Если хэша нет, проверяем только URL и активную секцию
      return urlMatch && (hash === activeSection || !hash);
    } else {
      return location.pathname === linkHref;
    }
  };

  return (
    <AnimatePresence>
      {activeItem && hasContent && (
        <motion.div
          className="absolute left-0 right-0 top-full z-40 w-full"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          onMouseEnter={() => {
            if (activeItem) onMouseEnter(activeItem);
          }}
          onMouseLeave={onMouseLeave}
        >
          <div
            className={`w-full shadow-lg bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-t border-gray-200/10`}
            style={{
              WebkitBackdropFilter: "blur(8px)",
              backdropFilter: "blur(8px)",
            }}
          >
            <div className="container max-w-7xl mx-auto py-6 px-4">
              {/* Заголовок и описание */}
              <div className="mb-4">
                <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  {hasContent?.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {hasContent?.description}
                </p>
              </div>

              {/* Ссылки, выровненные по навигационным элементам */}
              <div className="relative">
                {/* Используем абсолютное позиционирование для точного выравнивания */}
                <div className="absolute -top-20 left-0 right-0">
                  {/* Контейнер для выравнивания по центру */}
                  <div className="flex justify-center">
                    {/* Контейнер для позиционирования меню */}
                    <div className="w-full max-w-7xl relative">
                      {/* Главная */}
                      {activeItem === "/" && (
                        <div className="absolute left-[39.2%] transform -translate-x-1/4">
                          <ul className="space-y-1 min-w-[180px]">
                            {hasContent.links.map((link) => (
                              <li key={link.href}>
                                <a
                                  href={link.href}
                                  onClick={(e) => handleLinkClick(e, link.href)}
                                  className={`block px-3 py-2 rounded-md text-sm transition-colors duration-300 ${
                                    isLinkActive(link.href)
                                      ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-blue-600 dark:hover:text-blue-400"
                                  }`}
                                >
                                  {link.title}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Продукты */}
                      {activeItem === "/products" && (
                        <div className="absolute left-[50%] transform -translate-x-1/2">
                          <ul className="space-y-1 min-w-[180px]">
                            {hasContent.links.map((link) => (
                              <li key={link.href}>
                                <a
                                  href={link.href}
                                  onClick={(e) => handleLinkClick(e, link.href)}
                                  className={`block px-3 py-2 rounded-md text-sm transition-colors duration-300 ${
                                    isLinkActive(link.href)
                                      ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-blue-600 dark:hover:text-blue-400"
                                  }`}
                                >
                                  {link.title}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Как приобрести */}
                      {activeItem === "/how-to-buy" && (
                        <div className="absolute left-[59.55%] transform -translate-x-1/2">
                          <ul className="space-y-1 min-w-[180px]">
                            {hasContent.links.map((link) => (
                              <li key={link.href}>
                                <a
                                  href={link.href}
                                  onClick={(e) => handleLinkClick(e, link.href)}
                                  className={`block px-3 py-2 rounded-md text-sm transition-colors duration-300 ${
                                    isLinkActive(link.href)
                                      ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-blue-600 dark:hover:text-blue-400"
                                  }`}
                                >
                                  {link.title}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* О 4Life */}
                      {activeItem === "/about" && (
                        <div className="absolute left-[72.5%] transform -translate-x-1/2">
                          <ul className="space-y-1 min-w-[180px]">
                            {hasContent.links.map((link) => (
                              <li key={link.href}>
                                <a
                                  href={link.href}
                                  onClick={(e) => handleLinkClick(e, link.href)}
                                  className={`block px-3 py-2 rounded-md text-sm transition-colors duration-300 ${
                                    isLinkActive(link.href)
                                      ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-blue-600 dark:hover:text-blue-400"
                                  }`}
                                >
                                  {link.title}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Обо Мне */}
                      {activeItem === "/about-me" && (
                        <div className="absolute left-[77.3%] transform -translate-x-1/2">
                          <ul className="space-y-1 min-w-[180px]">
                            {hasContent.links.map((link) => (
                              <li key={link.href}>
                                <a
                                  href={link.href}
                                  onClick={(e) => handleLinkClick(e, link.href)}
                                  className={`block px-3 py-2 rounded-md text-sm transition-colors duration-300 ${
                                    isLinkActive(link.href)
                                      ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-blue-600 dark:hover:text-blue-400"
                                  }`}
                                >
                                  {link.title}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Партнерство */}
                      {activeItem === "/partnership" && (
                        <div className="absolute left-[85.3%] transform -translate-x-1/2">
                          <ul className="space-y-1 min-w-[180px]">
                            {hasContent.links.map((link) => (
                              <li key={link.href}>
                                <a
                                  href={link.href}
                                  onClick={(e) => handleLinkClick(e, link.href)}
                                  className={`block px-3 py-2 rounded-md text-sm transition-colors duration-300 ${
                                    isLinkActive(link.href)
                                      ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-blue-600 dark:hover:text-blue-400"
                                  }`}
                                >
                                  {link.title}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {/* Пустой блок для сохранения высоты меню */}
                <div className="h-40"></div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MegaMenu;
