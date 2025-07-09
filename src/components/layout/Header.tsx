/**
 * @module src/components/layout/Header.tsx
 * @description Адаптивный компонент шапки сайта. На мобильных устройствах отображает кнопку-гамбургер и название, на десктопе — полноценное навигационное меню. Реализует эффект "headroom.js", скрываясь при прокрутке вниз и появляясь при прокрутке вверх для экономии места на экране. Содержит логотип, навигацию, переключатель темы и иконку списка продуктов.
 * @author Kort
 * @version 1.0.0
 * @see MobileMenu - Используется для отображения навигации на мобильных устройствах.
 * @see DynamicLogo - Отображает логотип сайта.
 * @see HamburgerButton - Кнопка для открытия/закрытия мобильного меню.
 * @see TextShineEffect - Применяется к имени дистрибьютора для визуального эффекта.
 * @usage
 * 1. `src/components/layout/Layout.tsx`: Вставляется вверху основного макета, чтобы присутствовать на всех страницах сайта.
 * @example
 * <Layout>
 *   <Header />
 *   <main>...</main>
 *   <Footer />
 * </Layout>
 */
import { lenis } from "@/lib/lenis";
import MobileMenu from "./MobileMenu";
import {
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import { Moon, Sun } from "lucide-react";
import React, { useLayoutEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import DynamicLogo from "../ui/DynamicLogo";
import HamburgerButton from "../ui/HamburgerButton";
import ProductListIcon from "../ui/ProductListIcon";
import TextShineEffect from "../effects/TextShineEffect";

import { useTheme } from "../../hooks/useTheme";
import { mainNav, siteConfig } from "../../site-config/site";

const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const [isHidden, setIsHidden] = useState(false);

  // Scroll-linked header movement: измеряем фактическую высоту, чтобы скрывать на 100 %
  const headerRef = React.useRef<HTMLElement>(null);
  const [headerHeight, setHeaderHeight] = React.useState(0);
  useLayoutEffect(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.offsetHeight);
    }
  }, []);

  const { scrollY } = useScroll();
  const lastY = React.useRef(0);

  // Продвинутая логика скрытия/показа хедера
  // Основана на принципах headroom.js для лучшего UX
  useMotionValueEvent(scrollY, "change", (y) => {
    const SCROLL_DOWN_THRESHOLD = 15; // Порог для скрытия (вниз)
    const SCROLL_UP_THRESHOLD = 5; // Порог для показа (вверх)
    const direction = y - lastY.current;

    // Устанавливаем состояние скролла для фона в любом случае
    setScrolled(y > 50);

    // 1. В безопасной зоне наверху или при достижении конца страницы - всегда показывать
    // (проверка на конец страницы может быть добавлена дополнительно)
    if (y < headerHeight) {
      setIsHidden(false);
      lastY.current = y;
      return;
    }

    // 2. Основная логика: скрывать при уверенном скролле вниз, показывать при любом скролле вверх
    if (direction > SCROLL_DOWN_THRESHOLD) {
      // Уверенный скролл вниз — скрываем хедер
      setIsHidden(true);
    } else if (direction < -SCROLL_UP_THRESHOLD) {
      // Скролл вверх — показываем хедер
      setIsHidden(false);
    }

    lastY.current = y;
  });

  const location = useLocation();
  const navigate = useNavigate();

  const handleLogoClick = () => {
    // Проверяем, мобильное ли устройство
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (location.pathname !== "/") {
      lenis.stop();
      lenis.velocity = 0;
      navigate("/");

      if (isMobile) {
        // На мобильных используем нативный скролл
        window.scrollTo(0, 0);
      } else {
        // На десктопе используем Lenis
        window.scrollTo(0, 0);
        requestAnimationFrame(() => {
          lenis.scrollTo(0, { immediate: true });
          setTimeout(() => lenis.start(), 50);
        });
      }
    } else {
      // Если уже на главной странице
      if (isMobile) {
        // На мобильных используем нативный скролл
        window.scrollTo({
          top: 0,
          behavior: "auto", // Мгновенный скролл
        });
      } else {
        // На десктопе используем Lenis
        lenis.scrollTo(0, {
          duration: 1.2,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        });
      }
    }
  };

  const handleHamburgerClick = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  return (
    <>
      <motion.header
        ref={headerRef}
        role="banner"
        variants={{
          visible: { y: 0 },
          hidden: { y: "-100%" },
        }}
        animate={isHidden ? "hidden" : "visible"}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        style={{
          top: "env(safe-area-inset-top)",
        }}
        className="fixed w-full z-40 top-0 py-3 md:py-4 bg-white/90 dark:bg-gray-900/90 md:backdrop-blur-md shadow"
      >
        <div className="container max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Left Section: Hamburger on Mobile, Logo + Name on Desktop */}
            <div className="flex items-center">
              <div className="md:hidden relative z-[100] no-highlight">
                <HamburgerButton
                  isOpen={mobileMenuOpen}
                  toggle={handleHamburgerClick}
                  scrolled={scrolled}
                />
              </div>
              <button
                onClick={handleLogoClick}
                className="hidden md:flex items-center space-x-4 group"
                aria-label="Главная страница"
              >
                <div className="relative z-10 transition-transform duration-300 group-hover:scale-105">
                  <DynamicLogo alt="4Life Logo" size="md" />
                </div>
                <div>
                  <TextShineEffect
                    text={siteConfig.distributor.name}
                    className="font-bold text-base leading-tight text-gray-800 dark:text-gray-100"
                  />
                  <div
                    className={`text-sm font-medium ${theme === "light" ? "text-amber-600" : "text-amber-300"}`}
                  >
                    Builder Elite
                  </div>
                </div>
              </button>
            </div>

            {/* Center Section: Logo on Mobile, Nav on Desktop */}
            <div className="flex-1 flex justify-center items-center">
              {/* Name and Status for Mobile */}
              <div className="md:hidden">
                <button
                  onClick={() => {
                    // Проверяем, мобильное ли устройство
                    const isMobile = /iPhone|iPad|iPod|Android/i.test(
                      navigator.userAgent,
                    );

                    if (location.pathname === "/") {
                      if (isMobile) {
                        // На мобильных используем нативный скролл для мгновенного отклика
                        window.scrollTo({
                          top: 0,
                          behavior: "auto", // Используем 'auto' вместо 'smooth' для мгновенного скролла
                        });
                      } else {
                        // На десктопе используем Lenis
                        lenis.scrollTo(0, {
                          duration: 1.2,
                          easing: (t) =>
                            Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                        });
                      }
                    } else {
                      // Если не на главной странице, используем стандартную навигацию
                      handleLogoClick();
                    }
                  }}
                  className="flex flex-col items-center group"
                  aria-label="Главная страница"
                >
                  <div className="text-center">
                    <TextShineEffect
                      text={siteConfig.distributor.name}
                      className="font-bold text-sm leading-tight text-gray-900 dark:text-white"
                    />
                    <div
                      className={`text-xs font-medium ${theme === "light" ? "text-amber-600" : "text-amber-300"}`}
                    >
                      Builder Elite
                    </div>
                  </div>
                </button>
              </div>

              {/* Navigation for Desktop */}
              <nav
                role="navigation"
                className="hidden md:flex items-center space-x-1 h-full"
              >
                {mainNav.map((item) => (
                  <div
                    key={item.href}
                    className="relative flex items-center h-full"
                  >
                    <NavLink
                      to={item.href}
                      onClick={(e) => {
                        if (location.pathname === item.href) {
                          e.preventDefault();

                          // Проверяем, мобильное ли устройство
                          const isMobile = /iPhone|iPad|iPod|Android/i.test(
                            navigator.userAgent,
                          );

                          if (isMobile) {
                            // На мобильных используем нативный скролл
                            window.scrollTo({
                              top: 0,
                              behavior: "auto", // Мгновенный скролл
                            });
                          } else {
                            // На десктопе используем Lenis
                            lenis.scrollTo(0, {
                              duration: 1.2,
                              easing: (t) =>
                                Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                            });
                          }
                        }
                      }}
                      className="flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 relative"
                    >
                      {({ isActive }) => (
                        <>
                          <span
                            className={
                              isActive
                                ? "text-blue-600 dark:text-blue-400"
                                : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                            }
                          >
                            {item.title}
                          </span>
                          {isActive && (
                            <motion.span
                              className="absolute bottom-1.5 left-0 right-0 h-0.5 bg-blue-500 dark:bg-blue-400"
                              layoutId="underline"
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
              </nav>
            </div>

            {/* Right Section: Icons */}
            <div className="flex items-center justify-end">
              <div className="hidden md:flex items-center space-x-2 bg-gray-100 dark:bg-gray-800/80 rounded-full p-1 transition-all duration-300 shadow-inner">
                <ProductListIcon />
                <div className="w-px h-5 bg-gray-300 dark:bg-gray-600"></div>
                <button
                  type="button"
                  onClick={toggleTheme}
                  className={`p-2 rounded-full ${theme === "light" ? "text-gray-600 hover:bg-gray-200" : "text-gray-400 hover:bg-gray-700"} transition-colors duration-300`}
                  aria-label="Переключить тему"
                >
                  {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
                </button>
              </div>
              <div className="md:hidden">
                <ProductListIcon />
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </>
  );
};

export default Header;
