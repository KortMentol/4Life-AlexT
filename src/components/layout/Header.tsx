import { motion } from "framer-motion";
import { Menu, Moon, Sun, X } from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { mainNav, siteConfig } from "../../config/site";
import { useTheme } from "../../context/ThemeContext";

const Header = () => {
  const [scrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Функция для обработки клика по навигации
  const handleNavClick = () => {
    // Принудительно скроллим вверх
    window.scrollTo(0, 0);
    // Закрываем мобильное меню, если оно открыто
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header
      role="banner"
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-white/90 dark:bg-gray-900/90 shadow-lg" : "bg-transparent"
      }`}
    >
      <motion.div
        className="container mx-auto px-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between h-16">
          <NavLink to="/" className="flex items-center space-x-2 group" aria-label="Главная страница">
            <img
              src="/assets/images/brand/4life-logo.svg"
              alt="4Life Logo"
              className="h-8 w-auto mr-2"
            />
            <div className="flex flex-col">
              <span className="font-bold text-xl text-primary leading-tight">{siteConfig.distributor.name}</span>
              <span className="text-xs font-medium text-amber-600 dark:text-amber-400 opacity-90 group-hover:opacity-100 transition-opacity">
                Builder Elite
              </span>
            </div>
          </NavLink>

          <nav role="navigation" className="hidden md:flex items-center space-x-8">
            {mainNav.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                onClick={handleNavClick}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium ${
                    isActive
                      ? "bg-primary text-white"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`
                }
                aria-label={item.title}
              >
                {item.title}
              </NavLink>
            ))}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300"
              aria-label="Переключить тему"
            >
              {theme === "dark" ? <Sun size={24} /> : <Moon size={24} />}
            </button>
          </nav>

          {/* Кнопки 'Купить' и 'Партнерство' удалены по запросу */}
        </div>
        <button
          type="button"
          onClick={toggleMobileMenu}
          className="md:hidden p-2 rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
          aria-label="Переключить мобильное меню"
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        {isMobileMenuOpen && (
          <div id="mobile-menu" className="md:hidden mt-4 space-y-2 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg" role="menu">
            {mainNav.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                onClick={() => {
                  handleNavClick();
                  toggleMobileMenu();
                }}
                className={({ isActive }) =>
                  `block px-4 py-2 text-base rounded-md ${
                    isActive
                      ? "bg-primary text-white"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`
                }
                role="menuitem"
              >
                {item.title}
              </NavLink>
            ))}
            <button
              type="button"
              onClick={() => {
                toggleTheme();
                toggleMobileMenu();
              }}
              className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-2"
              aria-label="Переключить тему"
            >
              {theme === "dark" ? (
                <>
                  <Sun size={18} />
                  <span>Светлая тема</span>
                </>
              ) : (
                <>
                  <Moon size={18} />
                  <span>Темная тема</span>
                </>
              )}
            </button>
          </div>
        )}
      </motion.div>
    </header>
  );
};

export default Header;
