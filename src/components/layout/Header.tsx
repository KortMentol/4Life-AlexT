import { motion } from "framer-motion";
import { gsap } from "gsap";
import { Moon, Sun } from "lucide-react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

import { logoVariants } from "@/animations/headerAnimations";
import TextShineEffect from "@/components/effects/TextShineEffect";
import { HamburgerButton, ProductListIcon, TubelightNavbar } from "@/components/ui";
import { useTransition } from "@/context";
import { useFeatureFlag, useIsMobile, useNativeScroll, usePerformanceTier, useTheme } from "@/hooks";
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
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";
  const { transitionTo } = useTransition();
  const isMobile = useIsMobile();
  const tier = usePerformanceTier();
  const isGlassEnabled = useFeatureFlag("headerGlass", tier !== "low");

  const headerRef = useRef<HTMLElement>(null);
  const isMenuAnimatingRef = useRef(false);
  const [modalVisible, setModalVisible] = useState(true);
  const [, setIsModalOpen] = useState(false);
  const isModalOpenRef = useRef(false);

  const { showHeader } = useNativeScroll({
    disabled: isMenuOpen || isMenuAnimatingRef.current || isModalOpenRef.current,
  });

  // КРИТИЧНО: Принудительно показываем хедер при первом рендере
  useEffect(() => {
    if (headerRef.current) {
      headerRef.current.style.transform = "translateY(0px) translateZ(0)";
      headerRef.current.style.opacity = "1";
      headerRef.current.style.visibility = "visible";
    }
  }, []); // Пустой массив зависимостей - выполнится только один раз

  // Показываем хедер при маунте (первая загрузка) и по событию force-header-show.
  // force-header-show диспатчится из RouteChangeHandler после восстановления скролла —
  // уже после того как пелена перехода закрыла экран.
  // НЕ вызываем showHeader() при каждой смене location — это показывало хедер
  // до закрытия пелены.
  // ВАЖНО: если модалка открыта при маунте — не показываем хедер (он и так скрыт через opacity)
  useEffect(() => {
    if (isModalOpenRef.current) return; // модалка уже открыта — хедер остаётся скрытым
    showHeader();
    const handleForceShow = () => showHeader();
    window.addEventListener("force-header-show", handleForceShow);
    return () => window.removeEventListener("force-header-show", handleForceShow);
  }, [showHeader]);

  // Хедер при открытии/закрытии меню
  const menuTlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    // Создаём timeline один раз если его нет
    if (!menuTlRef.current) {
      menuTlRef.current = gsap
        .timeline({
          paused: true,
          onStart: () => {
            isMenuAnimatingRef.current = true;
          },
          onComplete: () => {
            isMenuAnimatingRef.current = false;
          },
          onReverseComplete: () => {
            isMenuAnimatingRef.current = false;
          },
        })
        .to(header, {
          y: "-120%",
          duration: 0.8,
          ease: "power4.inOut",
        });
    }

    const tl = menuTlRef.current;

    if (isMenuOpen) {
      // Играем вперёд из текущей позиции
      tl.play();
    } else {
      // Реверсируем из текущей позиции
      tl.reverse();
    }
  }, [isMenuOpen]);

  // Слушатель для плавного скрытия/показа хедера при открытии модалки (без движения — только opacity)
  useEffect(() => {
    const handleModalState = (e: Event) => {
      const customEvent = e as CustomEvent;
      const isModalOpen = customEvent.detail.isOpen;
      isModalOpenRef.current = isModalOpen;
      setIsModalOpen(isModalOpen);
      
      if (!isModalOpen) {
        // Задержка перед показом хедера — даём модалке завершить exit-анимацию
        setTimeout(() => {
          setModalVisible(true);
          setIsModalOpen(false);
        }, 0);
      } else {
        setModalVisible(false);
        // ОСТАВЛЯЕМ хедер там где он был — motion сам плавно анимирует opacity → 0
        // НЕ трогаем трансформ — хедер может быть скрыт под экраном, motion управляет видимостью
        if (menuTlRef.current) {
          menuTlRef.current.pause();
          menuTlRef.current.progress(1);
        }
      }
    };

    window.addEventListener("modal-state-change", handleModalState);
    return () => window.removeEventListener("modal-state-change", handleModalState);
  }, []);

  // Показываем хедер при маунте (первая загрузка) и по событию force-header-show.
  // ВАЖНО: если модалка открыта при маунте — не показываем хедер (он и так скрыт через opacity)
  useEffect(() => {
    if (isModalOpenRef.current) return; // модалка уже открыта — хедер остаётся скрытым
    showHeader();
    const handleForceShow = () => showHeader();
    window.addEventListener("force-header-show", handleForceShow);
    return () => window.removeEventListener("force-header-show", handleForceShow);
  }, [showHeader]);

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
    [isDark],
  );

  return (
    <motion.header
      data-tier={isGlassEnabled ? tier : "low"}
      ref={headerRef}
      animate={{ opacity: modalVisible ? 1 : 0, visibility: modalVisible ? "visible" : "hidden" }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      role="banner"
      style={{ ...cssVars, contain: "layout style paint" } as React.CSSProperties}
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
                className={`relative z-10 transition-transform duration-200 ${isMobile ? "" : "group-hover:scale-105"}`}
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
                  className="text-[10px] md:text-xs font-medium mt-0.5 md:mt-1"
                  style={{
                    color: isDark ? "#e6b800" : "#8a6600",
                    textShadow: isDark ? "0 1px 2px rgba(0,0,0,0.5)" : "none",
                    fontWeight: 600,
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
                    className="text-[10px] md:text-xs font-medium mt-0.5 md:mt-1"
                    style={{
                      color: isDark ? "#e6b800" : "#8a6600",
                      textShadow: isDark ? "0 1px 2px rgba(0,0,0,0.5)" : "none",
                      fontWeight: 600,
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
                contain: "layout style paint",
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
