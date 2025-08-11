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
  isScrollingLocked: boolean;
}

const Header: React.FC<HeaderProps> = ({ isMenuOpen, setIsMenuOpen, isScrollingLocked }) => {
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
    headerHeight,
    topOffset: 8,
    disabled: isMenuOpen || isScrollingLocked,
  });

  // Наведение для tubelight: при hover лампа переезжает на пункт, при уходе — возвращается к активному
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rafRef = useRef<number | null>(null);
  

  

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
        className={`fixed left-0 right-0 mx-auto w-full max-w-7xl z-40 top-2 py-2 md:py-2 px-4 md:px-6 rounded-full border shadow-lg ${isDark ? "bg-neutral-900 border-neutral-800" : "bg-white border-slate-200"}`}
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
                  <TextShineEffect
                    text={siteConfig.distributor.name}
                    className="font-semibold text-sm leading-tight"
                  />
                  <div
                    className={`text-xs font-medium mt-0.5 ${isDark ? "" : "px-1.5 py-0.5 rounded-md bg-black/5"}`}
                    style={{
                      color: isDark ? "#e6b800" : "#b38600",
                      textShadow: isDark
                        ? "0 1px 2px rgba(0,0,0,0.5)"
                        : "0 1px 1px rgba(0,0,0,0.25)",
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
                className="hidden md:flex items-center justify-center h-full"
                style={{ marginLeft: "4rem" }}
                onMouseLeave={() => setHoveredIndex(null)}
                onMouseMove={(e) => {
                  const x = e.clientX;
                  if (rafRef.current) cancelAnimationFrame(rafRef.current);
                  rafRef.current = requestAnimationFrame(() => {
                    const OVERLAP = 14; // px: лёгкое наслоение hitbox соседних пунктов
                    let best = -1;
                    let bestEdge = Infinity;
                    let bestCenter = Infinity;
                    itemRefs.current.forEach((el, idx) => {
                      if (!el) return;
                      const rect = el.getBoundingClientRect();
                      const center = rect.left + rect.width / 2;
                      const left = rect.left - OVERLAP;
                      const right = rect.right + OVERLAP;
                      let distEdge = 0;
                      if (x < left) distEdge = left - x;
                      else if (x > right) distEdge = x - right;

                      const distCenter = Math.abs(center - x);
                      if (distEdge < bestEdge || (distEdge === bestEdge && distCenter < bestCenter)) {
                        bestEdge = distEdge;
                        bestCenter = distCenter;
                        best = idx;
                      }
                    });
                    if (best !== -1 && best !== hoveredIndex) {
                      setHoveredIndex(best);
                    }
                  });
                }}
              >
                <div className="relative flex items-center gap-2">
                  
                  {mainNav.map((item, index) => (
                    <motion.div
                      key={item.href}
                      ref={(el) => (itemRefs.current[index] = el)}
                      className="relative flex items-center h-full"
                      variants={navItemVariants}
                      initial="initial"
                      animate="animate"
                      whileTap="tap"
                      custom={index}
                    >
                      <NavLink
                        to={item.href}
                        onClick={(e) =>
                          handleLinkClick(e, navigate, item.href, location.pathname, { immediate: isMobileDevice() })
                        }
                        onMouseEnter={() => setHoveredIndex(index)}
                        className="flex items-center px-3 py-1.5 rounded-xl text-[14px] font-medium relative whitespace-nowrap tracking-tight"
                      >
                        {({ isActive }) => {
                          const showLamp = hoveredIndex === index || (hoveredIndex === null && isActive);
                          return (
                            <>
                              <span
                                className={`relative z-10 header-adaptive-text ${
                                  isActive ? "font-semibold" : "opacity-90"
                                }`}
                                style={{
                                  color: isDark ? "white" : "#1e293b",
                                  textShadow: isDark
                                    ? "0 1px 2px rgba(0,0,0,0.3)"
                                    : "0 1px 1px rgba(0,0,0,0.1)",
                                }}
                              >
                                {item.title}
                              </span>
                              {showLamp && (
                                <motion.div
                                  layoutId="lamp"
                                  className={`absolute inset-0 w-full rounded-xl z-0 shadow-sm ${
                                    isDark
                                      ? "bg-neutral-700/90"
                                      : "bg-slate-300/90"
                                  }`}
                                  initial={false}
                                  transition={{ type: "spring", stiffness: 150, damping: 30, mass: 1.1 }}
                                >
                                  <div
                                    className={`absolute -top-2 left-1/2 -translate-x-1/2 w-7 h-1 rounded-t-full drop-shadow ${
                                      isDark ? "bg-white/90" : "bg-[#0a0a0a]/90"
                                    }`}
                                  >
                                    <div
                                      className={`absolute w-10 h-5 rounded-full blur-md -top-2 -left-2 ${
                                        isDark ? "bg-white/20" : "bg-black/20"
                                      }`}
                                    />
                                    <div
                                      className={`absolute w-7 h-5 rounded-full blur-md -top-1 ${
                                        isDark ? "bg-white/15" : "bg-black/15"
                                      }`}
                                    />
                                  </div>
                                </motion.div>
                              )}
                            </>
                          );
                        }}
                      </NavLink>
                    </motion.div>
                  ))}
                </div>
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
