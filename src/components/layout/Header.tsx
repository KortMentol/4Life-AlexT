/**
 * @module src/components/layout/Header.tsx
 * @description Адаптивный компонент шапки сайта с нативным скроллом. Реализует эффект следования за скроллом, плавно появляясь и исчезая в зависимости от направления прокрутки. Содержит логотип, навигацию, переключатель темы и иконку списка продуктов с эффектами гласморфизма.
 * @author Kort
 * @version 2.1.0
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
import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import React, { useState, useRef, useLayoutEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

import HeaderComets from "../effects/HeaderComets";

import HamburgerButton from "../ui/HamburgerButton";
import ProductListIcon from "../ui/ProductListIcon";
import TextShineEffect from "../effects/TextShineEffect";
import MobileMenu from "./MobileMenu";

import { useTheme } from "../../hooks/useTheme";
import { useNativeScroll } from "../../hooks/useNativeScroll";

import { useGlassmorphism } from "../../hooks/useGlassmorphism";
import { mainNav, siteConfig } from "../../site-config/site";
import { headerVariants, navItemVariants, logoVariants } from "../../animations/headerAnimations";
import { isMobileDevice } from "../../utils/deviceUtils";
import { scrollToTop, handleLinkClick } from "../../utils/navigationUtils";

const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  const headerRef = useRef<HTMLElement>(null);
  const [headerHeight, setHeaderHeight] = useState(0);

  useLayoutEffect(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.offsetHeight);
    }
  }, []);

  const { headerY, headerOpacity } = useNativeScroll({ headerHeight, topOffset: 8 });
  const { style: glassmorphismStyle } = useGlassmorphism();

  // Обработка прокрутки для глассморфизма происходит в хуке useGlassmorphism





  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  const handleHamburgerClick = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogoClick = () => {
    if (location.pathname === "/") {
      scrollToTop({ immediate: isMobileDevice() });
    } else {
      navigate("/");
    }
  };

  return (
    <>
      <motion.header
        ref={headerRef}
        role="banner"
        variants={headerVariants}
        initial="visible"
        animate="visible"
        style={{
          y: headerY,
          ...glassmorphismStyle,
        }}
        className={`fixed left-0 right-0 mx-auto w-full max-w-7xl z-40 top-2 py-2 md:py-2 px-4 md:px-6 rounded-full glassmorphism header-glow-effect header-modern}`}>
        <div className="header-gradient-move absolute inset-0 rounded-full"></div>
        <HeaderComets />
        <div className="container max-w-7xl mx-auto px-4 relative z-10">
          <div className="flex items-center justify-between">
            {/* Left Section: Hamburger on Mobile, Logo + Name on Desktop */}
            <div className="flex items-center">
              <div className="md:hidden relative z-[100] no-highlight -ml-1 flex items-center">
                <HamburgerButton
                  isOpen={mobileMenuOpen}
                  toggle={handleHamburgerClick}
                />
              </div>
              <button
                onClick={handleLogoClick}
                className="hidden md:flex items-center space-x-4 group"
                aria-label="Главная страница"
              >
                {/* Обертка для применения адаптивного цвета */}
                <div>
                  <motion.div 
                    className="relative z-10 transition-transform duration-300 group-hover:scale-105"
                    style={{ opacity: headerOpacity }}
                    variants={logoVariants}
                    initial="initial"
                    animate="animate"
                    whileHover="hover"
                  >
                    {/* Используем разные версии логотипа в зависимости от темы */}
                    <img 
                      src={isDark ? "/src/assets/images/brand/4life-logo-light.svg" : "/src/assets/images/brand/4life-logo.svg"} 
                      alt="4Life Logo" 
                      className="h-9 w-auto" />
                  </motion.div>
                </div>
                <motion.div style={{ 
                  opacity: headerOpacity, 
                  color: isDark ? "white" : "#1e293b",
                  textShadow: isDark ? "0 1px 2px rgba(0,0,0,0.3)" : "0 1px 1px rgba(0,0,0,0.1)" 
                }} className="header-adaptive-text font-bold">
                  <TextShineEffect
                    text={siteConfig.distributor.name}
                    className="font-bold text-base leading-tight"
                  />
                  <div className="text-sm font-medium" style={{ 
                    color: "#e6b800", 
                    textShadow: isDark ? "0 1px 2px rgba(0,0,0,0.5)" : "0 1px 2px rgba(0,0,0,0.3)",
                    fontWeight: "600"
                  }}>
                    Builder Elite
                  </div>
                </motion.div>
              </button>
            </div>

            {/* Center Section: Logo on Mobile, Nav on Desktop */}
            <div className="flex-1 flex justify-center items-center">
              {/* Name and Status for Mobile */}
              <div className="md:hidden">
                <button
                  onClick={() => {
                    if (location.pathname === "/") {
                      scrollToTop({ immediate: isMobileDevice() });
                    } else {
                      handleLogoClick();
                    } 
                  }}
                  className="flex flex-col items-center group"
                  aria-label="Главная страница">
                  <motion.div
                    className="text-center header-adaptive-text font-bold"
                    style={{ 
                      opacity: headerOpacity, 
                      color: isDark ? "white" : "#1e293b",
                      textShadow: isDark ? "0 1px 2px rgba(0,0,0,0.3)" : "0 1px 1px rgba(0,0,0,0.1)" 
                    }}>
                    <TextShineEffect
                      text={siteConfig.distributor.name}
                      className="font-bold text-sm leading-tight"
                    />
                    <div className="text-xs font-medium" style={{ 
                      color: "#e6b800", 
                      textShadow: isDark ? "0 1px 2px rgba(0,0,0,0.5)" : "0 1px 2px rgba(0,0,0,0.3)",
                      fontWeight: "600"
                    }}>
                      Builder Elite
                    </div>
                  </motion.div>
                </button>
              </div>

              {/* Navigation for Desktop */}
              <motion.nav
                role="navigation"
                className="hidden md:flex items-center space-x-1 h-full"
                style={{ opacity: headerOpacity }}>
                {mainNav.map((item, index) => (
                  <motion.div
                    key={item.href}
                    className="relative flex items-center h-full"
                    variants={navItemVariants}
                    initial="initial"
                    animate="animate"
                    whileHover="hover"
                    whileTap="tap"
                    custom={index}>
                    <NavLink
                      to={item.href}
                      onClick={(e) =>
                        handleLinkClick(e, navigate, item.href, location.pathname, {
                          immediate: isMobileDevice(),
                        })
                      }
                      className="flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 relative">
                      {({ isActive }) => (
                        <>
                          <span
                            className={`header-adaptive-text transition-opacity duration-300 ${isActive ? "font-semibold opacity-100" : "opacity-80 hover:opacity-100"}`}
                            style={{ 
                              color: isDark ? "white" : "#1e293b",
                              textShadow: isDark ? "0 1px 2px rgba(0,0,0,0.3)" : "0 1px 1px rgba(0,0,0,0.1)" 
                            }}>
                            {item.title}
                          </span>
                          {isActive && (
                            <motion.span
                              className="absolute bottom-1.5 left-0 right-0 h-0.5" // Подчеркивание тоже будет адаптивным
                              style={{ backgroundColor: isDark ? "white" : "#1e293b" }}
                              layoutId="underline"
                              initial={{ width: 0 }}
                              animate={{ width: "100%" }}
                              transition={{ duration: 0.3 }}
                            />
                          )}
                        </>
                      )}
                    </NavLink>
                  </motion.div>
                ))}
              </motion.nav>
            </div>

            {/* Right Section: Icons */}
            <motion.div
              className="flex items-center justify-end"
              style={{ opacity: headerOpacity }}>
              <motion.div 
                className="hidden md:flex items-center space-x-2"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 25, delay: 0.2 }}
                style={{ color: isDark ? "white" : "#1e293b" }}
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  style={{ color: isDark ? "white" : "#1e293b" }}
                >
                  <ProductListIcon />
                </motion.div>
                <div className="w-px h-6 mx-1" style={{ opacity: 0.7, backgroundColor: isDark ? "white" : "#1e293b" }}></div>
                <motion.button
                  type="button"
                  onClick={toggleTheme}
                  className="p-2 rounded-full transition-colors duration-300 header-adaptive-text"
                  aria-label="Переключить тему"
                  whileHover={{ scale: 1.1, rotate: 15 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  style={{ color: isDark ? "white" : "#1e293b" }}
                >
                  {isDark ? <Sun size={18} /> : <Moon size={18} />}
                </motion.button>
              </motion.div>
              <motion.div
                className="md:hidden"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                style={{ color: isDark ? "white" : "#1e293b" }}>
                <ProductListIcon />
              </motion.div>
            </motion.div>
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