import DynamicLogo from "@/shared/ui/DynamicLogo";
import HamburgerButton from "@/shared/ui/HamburgerButton";
import MegaMenu from "@/widgets/MegaMenu";
import MobileMenu from "@/widgets/MobileMenu";
import TextShineEffect from "@/widgets/TextShineEffect";
import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import React, { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { lenis } from "@/lib/lenis";

import { mainNav, siteConfig } from "../../config/site";
import { useTheme } from "../../context/useTheme";

const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMenuItem, setActiveMenuItem] = useState<string | null>(null);
  const { theme, toggleTheme } = useTheme();

  const location = useLocation();
  const navigate = useNavigate();

  const handleLogoClick = () => {
    if (location.pathname !== "/") {
      // Если не на главной странице, переходим на главную
      lenis.stop();
      lenis.velocity = 0; // Сбрасываем инерцию
      navigate("/");

      // Принудительно скроллим вверх
      window.scrollTo(0, 0);

      // Используем requestAnimationFrame для гарантии выполнения после рендеринга
      requestAnimationFrame(() => {
        lenis.scrollTo(0, { immediate: true });

        // Запускаем Lenis с небольшой задержкой
        setTimeout(() => {
          lenis.start();
        }, 50);
      });
    } else {
      // Если уже на главной странице, просто скроллим вверх
      lenis.scrollTo(0, {
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
    }
  };

  // Обработчик для гамбургера
  const handleHamburgerClick = () => {
    setMobileMenuOpen((prev) => !prev);
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
        role="banner"
        className="fixed w-full z-40 transition-all duration-300 top-0 py-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-lg"
        style={{
          WebkitBackdropFilter: "blur(8px)",
          backdropFilter: "blur(8px)",
          top: "env(safe-area-inset-top)",
        }}
        onMouseLeave={handleMenuMouseLeave}
      >
        <div className="container max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Логотип и название */}
            <button
              onClick={handleLogoClick}
              className="flex items-center space-x-3 group"
              aria-label="Главная страница"
            >
              <div className="relative z-10 transition-transform duration-300 group-hover:scale-105">
                <DynamicLogo alt="4Life Logo" className="" size="md" />
              </div>

              <div className="flex flex-col">
                <button
                  onClick={handleLogoClick}
                  className={`font-bold text-xl leading-tight transition-colors duration-300 whitespace-nowrap cursor-pointer bg-transparent border-0 p-0 text-left`}
                >
                  <TextShineEffect
                    text={siteConfig.distributor.name}
                    duration={10}
                  />
                </button>
                <button
                  onClick={handleLogoClick}
                  className={`text-xs font-medium ${theme === "light" ? "text-amber-600" : "text-amber-300"} whitespace-nowrap cursor-pointer bg-transparent border-0 p-0 text-left`}
                >
                  Builder Elite
                </button>
              </div>
            </button>

            {/* Десктопная навигация */}
            <nav
              role="navigation"
              className="hidden md:flex items-center space-x-1"
            >
              {mainNav.map((item) => (
                <div
                  key={item.href}
                  className="relative"
                  onMouseEnter={() => handleMenuMouseEnter(item.href)}
                >
                  <NavLink
                    to={item.href}
                    onClick={(e) => {
                      const { pathname } = location;
                      // Если кликнули на текущую страницу, скроллим вверх
                      if (pathname === item.href) {
                        e.preventDefault();
                        lenis.scrollTo(0, {
                          duration: 1.2,
                          easing: (t) =>
                            Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                        });
                      }
                    }}
                    className={({ isActive }) =>
                      `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 relative overflow-hidden ${
                        isActive
                          ? "text-blue-600 dark:text-blue-400"
                          : theme === "light"
                            ? "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
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
                  theme === "light"
                    ? "text-gray-600 hover:bg-gray-100"
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
                  theme === "light"
                    ? "text-gray-600 hover:bg-gray-100"
                    : "text-gray-400 hover:bg-gray-700"
                } transition-colors duration-300`}
                aria-label="Переключить тему"
              >
                {theme === "dark" ? <Moon size={20} /> : <Sun size={20} />}
              </button>

              {/* Кнопка гамбургер */}
              <HamburgerButton
                isOpen={mobileMenuOpen}
                toggle={handleHamburgerClick}
              />
            </div>
          </div>
        </div>

        {/* Мега-меню для десктопа */}
        <MegaMenu />
      </header>

      {/* Мобильное меню */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </>
  );
};

export default Header;
