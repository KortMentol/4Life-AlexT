import { motion } from "framer-motion";
import { gsap } from "gsap";
import { Moon, Sun } from "lucide-react";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

import { headerVariants, logoVariants } from "@/animations/headerAnimations";
import { useTransition } from "@/context";
import { useIsMobile, useNativeScroll, useTheme } from "@/hooks";
import { siteConfig } from "@/site-config/site";
import { scrollToTop } from "@/utils/navigationUtils";
import HeaderComets from "@/components/effects/HeaderComets";
import TextShineEffect from "@/components/effects/TextShineEffect";
import { HamburgerButton, ProductListIcon, TubelightNavbar } from "@/components/ui";

// Logo imports
import logoLight from "@/assets/images/brand/4life-logo-light.svg";
import logoDark from "@/assets/images/brand/4life-logo.svg";



interface HeaderProps {
  isMenuOpen: boolean;
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isScrollingLocked: boolean;
}

const Header: React.FC<HeaderProps> = ({ isMenuOpen, setIsMenuOpen, isScrollingLocked }) => {
  const headerTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";
  const { transitionTo } = useTransition();
  const isMobile = useIsMobile();

  const headerRef = useRef<HTMLElement>(null);
  const [headerHeight, setHeaderHeight] = useState(0);

  useLayoutEffect(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.offsetHeight);
    }
  }, []);

  const { headerY, forceShowHeader } = useNativeScroll({
    headerHeight,
    topOffset: 8,
    disabled: isMenuOpen || isScrollingLocked,
  });

  // Этот useEffect слушает наше кастомное событие и показывает хедер
  useEffect(() => {
    const handleForceShow = () => {
      forceShowHeader();
    };
    window.addEventListener("force-header-show", handleForceShow);
    return () => {
      window.removeEventListener("force-header-show", handleForceShow);
    };
  }, [forceShowHeader]);

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

  useEffect(() => {
    forceShowHeader();
  }, [location.pathname, location.search, location.hash]);

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

  // ... остальной JSX код хедера остается без изменений ...
  return (
    <motion.header
      ref={headerRef}
      role="banner"
      variants={headerVariants}
      initial="visible"
      animate="visible"
      style={{ y: headerY }}
      className={`fixed left-0 right-0 mx-auto w-full max-w-7xl z-40 top-2 py-2 md:py-2 px-4 md:px-6 rounded-full border shadow-lg ${isDark ? "bg-neutral-900/80 border-cyan-400/20 backdrop-blur-md" : "bg-white/80 border-slate-200 backdrop-blur-md"}`}
    >
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
                  src={isDark ? logoLight : logoDark}
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
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <ProductListIcon />
              </motion.div>
              <div className="w-px h-6 mx-1 bg-slate-700 dark:bg-slate-100" />
              <motion.button
                type="button"
                onClick={toggleTheme}
                className="p-2 rounded-full transition-colors duration-300"
                aria-label="Переключить тему"
                whileHover={{ scale: 1.1, rotate: 15 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
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
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
