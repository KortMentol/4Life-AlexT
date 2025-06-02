import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { siteConfig, mainNav } from '../../config/site';
import { useTheme } from '../../context/ThemeContext';

const Header = () => {
  const [scrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header
      role="banner"
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/90 dark:bg-gray-900/90 shadow-lg' : 'bg-transparent'
      }`}
    >
      <motion.div
        className="container mx-auto px-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between h-16">
          <NavLink to="/" className="flex items-center space-x-2" aria-label="Главная страница">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/e/ea/4Life_Research_logo.svg"
              alt="4Life Logo"
              className="h-8"
            />
            <span className="font-bold text-xl text-primary">
              {siteConfig.distributor.name}
            </span>
          </NavLink>

          <nav role="navigation" className="hidden md:flex items-center space-x-8">
            {mainNav.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
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
              {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
            </button>
          </nav>

          <div className="hidden md:flex items-center space-x-4" role="region" aria-label="Основные действия">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-primary text-white px-4 py-2 rounded-full hover:bg-primary-dark transition-colors flex items-center space-x-2"
            >
              <Menu size={20} />
              <span>Купить</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-primary text-white px-4 py-2 rounded-full hover:bg-primary-dark transition-colors flex items-center space-x-2"
            >
              <Menu size={20} />
              <span>Партнерство</span>
            </motion.button>
          </div>
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
          <div
            id="mobile-menu"
            className="md:hidden mt-4 space-y-2"
            role="menu"
          >
            {mainNav.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                onClick={toggleMobileMenu}
              >
                {item.title}
              </NavLink>
            ))}
          </div>
        )}
      </motion.div>
    </header>
  );
};

export default Header;
