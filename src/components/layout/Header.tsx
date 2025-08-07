import { motion } from "framer-motion";
import { gsap } from "gsap";
import { Moon, Sun } from "lucide-react";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

import { headerVariants, logoVariants, navItemVariants } from "../../animations/headerAnimations";

import { useNativeScroll } from "../../hooks/useNativeScroll"; // <-- ПРАВИЛЬНЫЙ ИМПОРТ
import { useTheme } from "../../hooks/useTheme";
import { mainNav, siteConfig } from "../../site-config/site";
import { isMobileDevice } from "../../utils/deviceUtils";
import { handleLinkClick, scrollToTop } from "../../utils/navigationUtils";
import HeaderComets from "../effects/HeaderComets";
import TextShineEffect from "../effects/TextShineEffect";
import HamburgerButton from "../ui/HamburgerButton";
import ProductListIcon from "../ui/ProductListIcon";

interface HeaderProps {
  isMenuOpen: boolean;
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Header: React.FC<HeaderProps> = ({ isMenuOpen, setIsMenuOpen }) => {
  const headerTimelineRef = useRef<gsap.core.Timeline | null>(null);
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

  const { headerY } = useNativeScroll({
    // <-- ИСПОЛЬЗУЕМ ПРАВИЛЬНЫЙ ХУК
    headerHeight,
    topOffset: 8,
    disabled: isMenuOpen,
  });
 

  useEffect(() => {
    if (!headerRef.current) return;

    headerTimelineRef.current = gsap.timeline({ paused: true }).to(headerRef.current, {
      y: "-110%",
      duration: 0.8,
      ease: "power4.inOut",
    });

    return () => {
      headerTimelineRef.current?.kill();
    };
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      headerTimelineRef.current?.play();
    } else {
      headerTimelineRef.current?.reverse();
    }
  }, [isMenuOpen]);

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
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
          
        }}
        className={`fixed left-0 right-0 mx-auto w-full max-w-7xl z-40 top-2 py-2 md:py-2 px-4 md:px-6 rounded-full glassmorphism`}
      >
        <div className="header-gradient-move absolute inset-0 rounded-full"></div>
        <HeaderComets />
        <div className="container max-w-7xl mx-auto px-4 relative z-10">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center justify-start w-full md:w-auto md:flex-1">
              <div className="md:hidden relative z-[100] no-highlight flex items-center">
                <HamburgerButton isOpen={isMenuOpen} toggle={() => setIsMenuOpen((prev) => !prev)} />
              </div>
              <button
                onClick={handleLogoClick}
                className="hidden md:flex items-center space-x-3 group"
                aria-label="Главная страница"
              >
                <motion.div
                  className="relative z-10 transition-transform duration-300 group-hover:scale-105"
                  variants={logoVariants}
                  initial="initial"
                  animate="animate"
                  whileHover="hover"
                >
                  <img
                    src={
                      isDark
                        ? "/src/assets/images/brand/4life-logo-light.svg"
                        : "/src/assets/images/brand/4life-logo.svg"
                    }
                    alt="4Life Logo"
                    className="h-8 w-auto"
                  />
                </motion.div>
                <motion.div
                  style={{
                    color: isDark ? "white" : "#1e293b",
                    textShadow: isDark ? "0 1px 2px rgba(0,0,0,0.3)" : "0 1px 1px rgba(0,0,0,0.1)",
                  }}
                  className="flex flex-col items-center"
                >
                  <TextShineEffect text={siteConfig.distributor.name} className="font-semibold text-sm leading-tight" />
                  <div
                    className="text-xs font-medium mt-0.5"
                    style={{
                      color: "#e6b800",
                      textShadow: isDark ? "0 1px 2px rgba(0,0,0,0.5)" : "0 1px 2px rgba(0,0,0,0.3)",
                      fontWeight: "500",
                    }}
                  >
                    Builder Elite
                  </div>
                </motion.div>
              </button>
            </div>
            <div className="absolute left-1/2 transform -translate-x-1/2 md:relative md:left-auto md:transform-none md:flex-1 md:flex md:justify-center">
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
                  aria-label="Главная страница"
                >
                  <motion.div
                    className="text-center flex flex-col items-center"
                    style={{
                      color: isDark ? "white" : "#1e293b",
                      textShadow: isDark ? "0 1px 2px rgba(0,0,0,0.3)" : "0 1px 1px rgba(0,0,0,0.1)",
                    }}
                  >
                    <TextShineEffect
                      text={siteConfig.distributor.name}
                      className="font-semibold text-sm leading-tight"
                    />
                    <div
                      className="text-xs font-medium mt-0.5"
                      style={{
                        color: "#e6b800",
                        textShadow: isDark ? "0 1px 2px rgba(0,0,0,0.5)" : "0 1px 2px rgba(0,0,0,0.3)",
                        fontWeight: "500",
                      }}
                    >
                      Builder Elite
                    </div>
                  </motion.div>
                </button>
              </div>
              <motion.nav
                role="navigation"
                className="hidden md:flex items-center justify-center space-x-1 h-full"
                style={{ marginLeft: "4rem" }}
              >
                {mainNav.map((item, index) => (
                  <motion.div
                    key={item.href}
                    className="relative flex items-center h-full"
                    variants={navItemVariants}
                    initial="initial"
                    animate="animate"
                    whileHover="hover"
                    whileTap="tap"
                    custom={index}
                  >
                    <NavLink
                      to={item.href}
                      onClick={(e) =>
                        handleLinkClick(e, navigate, item.href, location.pathname, { immediate: isMobileDevice() })
                      }
                      className="flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 relative whitespace-nowrap"
                    >
                      {({ isActive }) => (
                        <>
                          <span
                            className={`header-adaptive-text transition-opacity duration-300 ${isActive ? "font-semibold opacity-100" : "opacity-80 hover:opacity-100"}`}
                            style={{
                              color: isDark ? "white" : "#1e293b",
                              textShadow: isDark ? "0 1px 2px rgba(0,0,0,0.3)" : "0 1px 1px rgba(0,0,0,0.1)",
                            }}
                          >
                            {item.title}
                          </span>
                          {isActive && (
                            <motion.span
                              className="absolute bottom-1 left-0 right-0 h-px"
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
            <motion.div className="flex items-center justify-end w-full md:w-auto md:flex-1">
              <motion.div
                className="hidden md:flex items-center space-x-3"
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
                <div
                  className="w-px h-6 mx-1"
                  style={{ opacity: 0.7, backgroundColor: isDark ? "white" : "#1e293b" }}
                ></div>
                <motion.button
                  type="button"
                  onClick={toggleTheme}
                  className="p-2 rounded-full transition-colors duration-300"
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
                style={{ color: isDark ? "white" : "#1e293b" }}
              >
                <ProductListIcon />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.header>
    </>
  );
};

export default Header;
