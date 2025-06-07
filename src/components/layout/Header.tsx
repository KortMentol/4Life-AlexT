import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NavLink, useLocation } from 'react-router-dom';
import { Menu, Moon, Sun, X, ChevronRight } from 'lucide-react';
import { mainNav, siteConfig } from '../../config/site';
import { useTheme } from '../../context/ThemeContext';

const Header: React.FC = () => {
  const [scrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const location = useLocation();
  
  // Закрываем меню при изменении маршрута
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);
  
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
  
  // Закрытие меню при клике вне его области и при нажатии Escape
  useEffect(() => {
    if (!isMobileMenuOpen) return;
    
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current && 
        !menuRef.current.contains(event.target as Node) &&
        menuButtonRef.current && 
        !menuButtonRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    };
    
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMobileMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);
    
    // Блокируем скролл при открытом меню
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  // Обработчик клика по навигации
  const handleNavClick = () => {
    // Принудительно закрываем меню без задержки
    setIsMobileMenuOpen(false);
    
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

          {/* Десктопная навигация */}
          <nav role="navigation" className="hidden md:flex items-center space-x-1">
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

          {/* Мобильная кнопка меню */}
          <button
            type="button"
            ref={menuButtonRef}
            onClick={(e) => {
              e.stopPropagation();
              setIsMobileMenuOpen(!isMobileMenuOpen);
            }}
            className={`md:hidden p-2 rounded-md ${scrolled ? 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700' : 'text-gray-300 hover:bg-gray-800/50'} transition-colors duration-300 relative z-[60]`}
            aria-label="Переключить мобильное меню"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={isMobileMenuOpen ? 'close' : 'menu'}
                initial={{ opacity: 0, rotate: isMobileMenuOpen ? -90 : 90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: isMobileMenuOpen ? 90 : -90 }}
                transition={{ duration: 0.2 }}
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </motion.div>
            </AnimatePresence>
          </button>
        </div>

        {/* Мобильное меню с оверлеем */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.div 
                className="mobile-menu-overlay md:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileMenuOpen(false)}
              />
              <motion.div 
                id="mobile-menu" 
                ref={menuRef}
                className="md:hidden fixed left-0 right-0 mx-4 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-xl shadow-lg overflow-hidden z-[55]" 
                role="menu"
                variants={{
                  hidden: { 
                    opacity: 0,
                    height: 0,
                    y: -20,
                    transition: { duration: 0.2, ease: "easeInOut" }
                  },
                  visible: { 
                    opacity: 1,
                    height: "auto",
                    y: 0,
                    transition: { duration: 0.3, ease: "easeOut" }
                  },
                  exit: { 
                    opacity: 0,
                    height: 0,
                    y: -20,
                    transition: { duration: 0.2, ease: "easeInOut" }
                  }
                }}
                initial="hidden"
                animate="visible"
                exit="exit"
                style={{ 
                  WebkitBackdropFilter: 'blur(8px)',
                  backdropFilter: 'blur(8px)',
                  top: 'calc(env(safe-area-inset-top) + 4.5rem)'
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-4 space-y-1">
                  {mainNav.map((item, i) => (
                    <motion.div
                      key={item.href}
                      custom={i}
                      variants={{
                        hidden: { opacity: 0, x: -20 },
                        visible: {
                          opacity: 1,
                          x: 0,
                          transition: {
                            delay: i * 0.05,
                            duration: 0.3
                          }
                        },
                        exit: { opacity: 0, x: -20 }
                      }}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      <NavLink
                        to={item.href}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNavClick();
                        }}
                        className={({ isActive }) =>
                          `flex items-center justify-between px-4 py-3 text-base rounded-lg transition-all duration-300 mobile-menu-item ${
                            isActive
                              ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                          }`
                        }
                        role="menuitem"
                      >
                        {({ isActive }) => (
                          <>
                            <span>{item.title}</span>
                            {isActive && (
                              <ChevronRight size={18} className="text-blue-500 dark:text-blue-400" />
                            )}
                          </>
                        )}
                      </NavLink>
                    </motion.div>
                  ))}
                  
                  {/* Переключатель темы в мобильном меню */}
                  <motion.div
                    key={`theme-toggle-${theme}`}
                    custom={mainNav.length}
                    variants={{
                      hidden: { opacity: 0, x: -20 },
                      visible: {
                        opacity: 1,
                        x: 0,
                        transition: {
                          delay: mainNav.length * 0.05,
                          duration: 0.3
                        }
                      },
                      exit: { opacity: 0, x: -20 }
                    }}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <div 
                      className="flex items-center justify-between px-4 py-3 text-base rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer mobile-menu-item"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleTheme();
                      }}
                      role="menuitem"
                    >
                      <span className="flex-1">
                        {theme === "dark" ? "Светлая тема" : "Темная тема"}
                      </span>
                      <div 
                        className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                          theme === "dark" ? "bg-blue-500" : "bg-gray-300"
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleTheme();
                        }}
                      >
                        <span
                          className={`flex h-5 w-5 items-center justify-center rounded-full bg-white shadow-lg transform transition-transform duration-200 ${
                            theme === "dark" ? "translate-x-5" : "translate-x-0.5"
                          }`}
                        >
                          {theme === "dark" ? (
                            <Sun size={12} className="text-amber-500" />
                          ) : (
                            <Moon size={12} className="text-gray-600" />
                          )}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;