import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { Moon, Sun } from 'lucide-react';
import { mainNav, siteConfig } from '../../config/site';
import { useTheme } from '../../context/ThemeContext';

const Header: React.FC = () => {
  const [scrolled, setIsScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();
  
  // Отслеживание скролла
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    // Проверяем начальное положение скролла
    handleScroll();

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
        behavior: 'smooth'
      });
    }
  };

  return (
    <header
      role="banner"
      className={`fixed w-full z-50 transition-all duration-300 top-0 ${
        scrolled 
          ? 'py-2 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-lg' 
          : 'py-4 bg-transparent'
      }`}
      style={{ 
        WebkitBackdropFilter: scrolled ? 'blur(8px)' : 'none',
        backdropFilter: scrolled ? 'blur(8px)' : 'none',
        top: 'env(safe-area-inset-top)',
        position: 'fixed'
      }}
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
              if (currentPath === '/') {
                e.preventDefault();
                handleNavClick();
              }
            }}
          >
            <div className="relative z-10 transition-transform duration-300 group-hover:scale-105">
              <img
                src="/assets/images/brand/4life-logo.svg"
                alt="4Life Logo"
                className="h-9 w-auto"
              />
            </div>
            
            <div className="flex flex-col">
              <span className={`font-bold text-xl leading-tight ${scrolled ? 'dark:text-white text-blue-800' : 'text-white'} transition-colors duration-300 whitespace-nowrap`}>
                {siteConfig.distributor.name}
              </span>
              <span className={`text-xs font-medium ${scrolled ? 'dark:text-amber-300 text-amber-600' : 'text-amber-300'} whitespace-nowrap`}>
                Builder Elite
              </span>
            </div>
          </NavLink>

          {/* Навигация */}
          <nav role="navigation" className="flex items-center space-x-1">
            {mainNav.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                onClick={handleNavClick}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 relative overflow-hidden ${
                    isActive
                      ? scrolled ? 'text-blue-600 dark:text-blue-400' : 'text-blue-400'
                      : scrolled ? 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800/50' : 'text-gray-300 hover:text-blue-400 hover:bg-gray-800/50'
                  }`
                }
                aria-label={item.title}
              >
                {({ isActive }) => (
                  <>
                    {item.title}
                    {isActive && (
                      <motion.span 
                        className="absolute bottom-0 left-0 h-0.5 bg-blue-500 dark:bg-blue-400"
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
            
            {/* Кнопка переключения темы */}
            <button
              type="button"
              onClick={toggleTheme}
              className={`ml-2 p-2 rounded-full ${scrolled ? 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700' : 'text-gray-400 hover:bg-gray-700'} transition-colors duration-300`}
              aria-label="Переключить тему"
            >
              {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
          </nav>

        </div>
      </div>
    </header>
  );
};

export default Header;