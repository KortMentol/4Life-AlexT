import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { mainNav, siteConfig } from "../../config/site";
import { useTheme } from "../../context/ThemeContext";
import DynamicLogo from "../ui/DynamicLogo";
import HamburgerButton from "../ui/HamburgerButton";
import MegaMenu from "./MegaMenu";
import MobileMenu from "./MobileMenu";
import TextShineEffect from "./TextShineEffect";

const Header: React.FC = () => {
  const [scrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMenuItem, setActiveMenuItem] = useState<string | null>(null);
  const { theme, toggleTheme } = useTheme();
  const headerRef = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Отслеживание скролла
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      // Отмечаем, что происходит скролл
      isScrollingRef.current = true;

      // Сбрасываем предыдущий таймер, если он был
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      // Устанавливаем новый таймер для определения окончания скролла
      scrollTimeoutRef.current = setTimeout(() => {
        isScrollingRef.current = false;
      }, 100);
    };

    // Проверяем начальное положение скролла
    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  // Обработчик клика по навигации
  const handleNavClick = () => {
    // Плавная прокрутка вверх
    const lenisInstance = (window as any).lenis;
    if (lenisInstance) {
      lenisInstance.scrollTo(0, { duration: 1.2 });
    } else {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  // Обработчики для мега-меню
  const handleMenuMouseEnter = (href: string) => {
    setActiveMenuItem(href);
  };

  const handleMenuMouseLeave = () => {
    setActiveMenuItem(null);
  };

  return (
    <>
      <header
        ref={headerRef}
        role="banner"
        className={`fixed w-full z-40 transition-all duration-300 top-0 ${
          scrolled
            ? "py-2 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-lg"
            : "py-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md"
        }`}
        style={{
          WebkitBackdropFilter: scrolled ? "blur(8px)" : "none",
          backdropFilter: scrolled ? "blur(8px)" : "none",
          top: "env(safe-area-inset-top)",
        }}
        onMouseLeave={handleMenuMouseLeave}
      >
        <div className="container max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Логотип и название */}
            <NavLink
              to="/"
              className="flex items-center space-x-3 group"
              aria-label="Главная страница"
              onClick={(e) => {
                const currentPath = window.location.pathname;
                if (currentPath === "/") {
                  e.preventDefault();
                  // Очищаем хэш из URL при клике на логотип
                  if (window.location.hash) {
                    window.history.pushState("", document.title, window.location.pathname);
                  }
                  handleNavClick();
                }
              }}
            >
              <div className="relative z-10 transition-transform duration-300 group-hover:scale-105">
                <DynamicLogo alt="4Life Logo" className="" size="md" />
              </div>

              <div className="flex flex-col">
                <span className={`font-bold text-xl leading-tight transition-colors duration-300 whitespace-nowrap`}>
                  <TextShineEffect text={siteConfig.distributor.name} duration={10} />
                </span>
                <span
                  className={`text-xs font-medium ${
                    scrolled || theme === "light" ? "dark:text-amber-300 text-amber-600" : "text-amber-300"
                  } whitespace-nowrap`}
                >
                  Builder Elite
                </span>
              </div>
            </NavLink>

            {/* Десктопная навигация */}
            <nav role="navigation" className="hidden md:flex items-center space-x-1">
              {mainNav.map((item) => (
                <div key={item.href} className="relative" onMouseEnter={() => handleMenuMouseEnter(item.href)}>
                  <NavLink
                    to={item.href}
                    onClick={handleNavClick}
                    className={({ isActive }) =>
                      `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 relative overflow-hidden ${
                        isActive
                          ? "text-blue-600 dark:text-blue-400"
                          : scrolled || theme === "light"
                          ? "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                          : "text-gray-300 hover:text-blue-400 hover:bg-gray-800/50"
                      }`
                    }
                    aria-label={item.title}
                    aria-expanded={activeMenuItem === item.href}
                    aria-haspopup="true"
                  >
                    {({ isActive }) => (
                      <>
                        {item.title}
                        {isActive && (
                          <motion.span
                            className="absolute bottom-0 left-0 h-0.5 bg-blue-500 dark:bg-blue-400"
                            initial={{ width: 0 }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 0.3 }}
                          />
                        )}
                      </>
                    )}
                  </NavLink>
                </div>
              ))}

              {/* Кнопка переключения темы */}
              <button
                type="button"
                onClick={toggleTheme}
                className={`ml-2 p-2 rounded-full ${
                  scrolled || theme === "light"
                    ? "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                    : "text-gray-400 hover:bg-gray-700"
                } transition-colors duration-300`}
                aria-label="Переключить тему"
              >
                {theme === "dark" ? <Moon size={20} /> : <Sun size={20} />}
              </button>
            </nav>

            {/* Мобильная навигация */}
            <div className="md:hidden flex items-center">
              {/* Кнопка переключения темы */}
              <button
                type="button"
                onClick={toggleTheme}
                className={`mr-2 p-2 rounded-full ${
                  scrolled || theme === "light"
                    ? "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                    : "text-gray-400 hover:bg-gray-700"
                } transition-colors duration-300`}
                aria-label="Переключить тему"
              >
                {theme === "dark" ? <Moon size={20} /> : <Sun size={20} />}
              </button>

              {/* Кнопка гамбургер */}
              <HamburgerButton
                isOpen={mobileMenuOpen}
                toggle={() => setMobileMenuOpen(!mobileMenuOpen)}
                scrolled={scrolled}
              />
            </div>
          </div>
        </div>

        {/* Мега-меню для десктопа */}
        <MegaMenu
          activeItem={activeMenuItem}
          onMouseEnter={handleMenuMouseEnter}
          onMouseLeave={handleMenuMouseLeave}
          scrolled={scrolled}
          handleNavClick={handleNavClick}
        />
      </header>

      {/* Мобильное меню */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        scrolled={scrolled}
        handleNavClick={handleNavClick}
      />
    </>
  );
};

export default Header;
