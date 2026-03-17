import { motion } from "framer-motion";
import { gsap } from "gsap";
import { Moon, Sun } from "lucide-react";
import React, { useEffect, useMemo, useRef } from "react";
import { useLocation } from "react-router-dom";

import { headerVariants, logoVariants } from "@/animations/headerAnimations";
import TextShineEffect from "@/components/effects/TextShineEffect";
import { HamburgerButton, ProductListIcon, TubelightNavbar } from "@/components/ui";
import { useTransition } from "@/context";
import { useIsMobile, useNativeScroll, usePerformanceTier, useTheme } from "@/hooks";
import { siteConfig } from "@/site-config/site";
import "@/styles/header-premium.css";
import { scrollToTop } from "@/utils/navigationUtils";

// Logo imports
import logoLight from "@/assets/images/brand/4life-logo-light.svg";
import logoDark from "@/assets/images/brand/4life-logo.svg";

interface HeaderProps {
  isMenuOpen: boolean;
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Header: React.FC<HeaderProps> = ({ isMenuOpen, setIsMenuOpen }) => {
  const headerTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";
  const { transitionTo } = useTransition();
  const isMobile = useIsMobile();
  const tier = usePerformanceTier();

  const headerRef = useRef<HTMLElement>(null);

  const { headerY } = useNativeScroll({ disabled: isMenuOpen });

  // Принудительно показываем хедер при переходах и перезагрузке
  useEffect(() => {
    // При монтировании компонента (перезагрузка страницы) - хедер всегда виден
    headerY.set(0);

    // Слушаем event от RouteChangeHandler
    const handleForceShow = () => {
      headerY.set(0);
    };

    window.addEventListener('force-header-show', handleForceShow);
    return () => window.removeEventListener('force-header-show', handleForceShow);
  }, [headerY]);

  // Слушаем изменения маршрута - всегда показываем хедер
  useEffect(() => {
    headerY.set(0);
  }, [location.pathname, headerY]);

  useEffect(() => {
    if (!headerRef.current) return;
    headerTimelineRef.current = gsap.timeline({ paused: true }).to(headerRef.current, {
      y: "-120%",
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
    if (isMobile) {
      scrollToTop({ immediate: false });
    } else {
      if (location.pathname === "/") {
        scrollToTop({ immediate: false });
      } else {
        transitionTo("/");
      }
    }
  };

  // Мемоизация CSS переменных для производительности
  const cssVars = useMemo(
    () => ({
      "--header-glow-rgb": isDark ? "0, 212, 255" : "59, 130, 246",
    }),
    [isDark]
  );

  return (
    <motion.header
      data-tier={tier}
      ref={headerRef}
      role="banner"
      variants={headerVariants}
      initial="visible"
      animate="visible"
      style={{
        y: headerY,
        ...cssVars,
        contain: 'layout style paint',
      }}
      className={`header-premium ${isDark ? "header-premium--dark" : "header-premium--light"}`}
    >

      <div className="header-content">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center justify-start w-full md:w-auto md:flex-1">
            <div className="md:hidden relative z-[100] no-highlight flex items-center">
              <HamburgerButton isOpen={isMenuOpen} toggle={() => setIsMenuOpen((prev) => !prev)} />
            </div>
            <button
              onClick={handleLogoClick}
              className="hidden md:flex items-center space-x-3 group relative"
              aria-label="Главная страница"
            >
              <motion.div
                className={`relative z-10 transition-transform duration-200 ${isMobile ? '' : 'group-hover:scale-105'}`}
                variants={logoVariants}
                initial="initial"
                animate="animate"
                whileHover={undefined}
              >
                <img src={isDark ? logoLight : logoDark} alt="4Life Logo" className="h-8 w-auto relative z-10" />
              </motion.div>
              <motion.div
                style={{
                  color: isDark ? "white" : "#1e293b",
                  textShadow: isDark ? "0 1px 2px rgba(0,0,0,0.3)" : "0 1px 1px rgba(0,0,0,0.1)",
                }}
                className="flex flex-col items-center"
              >
                <TextShineEffect
                  text={siteConfig.distributor.name}
                  className="font-semibold text-sm leading-tight whitespace-nowrap"
                />
                <div
                  className={"text-xs font-medium mt-0.5"}
                  style={{
                    color: isDark ? "#e6b800" : "#b38600",
                    textShadow: isDark ? "0 1px 2px rgba(0,0,0,0.5)" : "0 1px 1px rgba(0,0,0,0.25)",
                    fontWeight: 500,
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
                onClick={handleLogoClick}
                className="flex flex-col items-center group"
                aria-label="Прокрутить вверх"
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
                    className="font-semibold text-sm leading-tight whitespace-nowrap"
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

            <TubelightNavbar />
          </div>

          <div className="flex items-center justify-end w-full md:w-auto md:flex-1">
            <motion.div
              className="hidden md:flex items-center space-x-3"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 25,
                delay: 0.2,
              }}
              style={{ color: isDark ? "white" : "#1e293b" }}
            >
              <div>
                <ProductListIcon />
              </div>
              <div className="w-px h-6 mx-1 bg-slate-700 dark:bg-slate-100" />
              <button
                type="button"
                onClick={toggleTheme}
                className="p-2 rounded-full transition-colors duration-200"
                aria-label="Переключить тему"
              >
                {isDark ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            </motion.div>
            <div
              className="md:hidden"
              style={{ 
                color: isDark ? "white" : "#1e293b",
                contain: 'layout style paint'
              }}
            >
              <ProductListIcon />
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default React.memo(Header);
