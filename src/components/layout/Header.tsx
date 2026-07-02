/**
 * @module src/components/layout/Header.tsx
 * @description Premium SOTD 2026 Header Capsule.
 * Implements clean, conflict-free coordinate-scrolling and modular modal animation layers.
 * THE FIX: data-tier directly respects the glass toggle to allow accurate debugging
 * and prevents the low-tier CSS override from blocking the glassmorphism blur.
 * @author Geminis AI & Kort
 */

import { motion } from "framer-motion";
import { gsap } from "gsap";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

import { logoVariants } from "@/animations/headerAnimations";
import TextShineEffect from "@/components/effects/TextShineEffect";
import { HamburgerButton, ProductListIcon, TubelightNavbar } from "@/components/ui";
import { useTransition } from "@/context";
import { useFeatureFlag, useIsMobile, useNativeScroll, usePerformanceTier } from "@/hooks";
import { siteConfig } from "@/site-config/site";
import "@/styles/header-premium.css";
import { scrollToTop } from "@/utils/navigationUtils";

import logoLight from "@/assets/images/brand/4life-logo-light.svg";

interface HeaderProps {
  isMenuOpen: boolean;
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Header: React.FC<HeaderProps> = ({ isMenuOpen, setIsMenuOpen }) => {
  const location = useLocation();
  const { transitionTo } = useTransition();
  const isMobile = useIsMobile();
  const tier = usePerformanceTier();

  // Истинный переключатель: если мы на Low тире, но юзер дернул ползунок в "on" — вернет true
  const isGlassEnabled = useFeatureFlag("headerGlass", tier !== "low");

  const headerRef = useRef<HTMLElement>(null);
  const isMenuAnimatingRef = useRef(false);
  const [modalVisible, setModalVisible] = useState(true);
  const [, setIsModalOpen] = useState(false);
  const isModalOpenRef = useRef(false);

  const { showHeader } = useNativeScroll({
    disabled: isMenuOpen || isMenuAnimatingRef.current || isModalOpenRef.current,
  });

  useEffect(() => {
    if (headerRef.current) {
      headerRef.current.style.transform = "translateY(0px) translateZ(0)";
      headerRef.current.style.opacity = "1";
      headerRef.current.style.visibility = "visible";
    }
  }, []);

  useEffect(() => {
    if (isModalOpenRef.current) return;
    showHeader();
    const handleForceShow = () => showHeader();
    window.addEventListener("force-header-show", handleForceShow);
    return () => window.removeEventListener("force-header-show", handleForceShow);
  }, [showHeader]);

  const menuTlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

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
      tl.play();
    } else {
      tl.reverse();
    }
  }, [isMenuOpen]);

  useEffect(() => {
    const handleModalState = (e: Event) => {
      const customEvent = e as CustomEvent;
      const isModalOpen = customEvent.detail.isOpen;
      isModalOpenRef.current = isModalOpen;
      setIsModalOpen(isModalOpen);

      if (menuTlRef.current) {
        if (isModalOpen) {
          setModalVisible(false);
        } else {
          setModalVisible(true);
        }
      }
    };

    window.addEventListener("modal-state-change", handleModalState);
    return () => window.removeEventListener("modal-state-change", handleModalState);
  }, []);

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

  const cssVars = useMemo(
    () => ({
      "--header-dark-glow-rgb": "0, 212, 255",
    }),
    [],
  );

  return (
    <motion.header
      // THE FIX: Передаем "high" (или любой тир выше low), если эффекты включены ползунком,
      // чтобы CSS не блокировал размытие (backdrop-filter) через директиву !important.
      data-tier={isGlassEnabled ? "high" : "low"}
      ref={headerRef}
      animate={{ opacity: modalVisible ? 1 : 0, visibility: modalVisible ? "visible" : "hidden" }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      role="banner"
      style={{ ...cssVars, contain: "layout style paint" } as React.CSSProperties}
      className="header-premium header-premium--dark"
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
                <img src={logoLight} alt="4Life Logo" className="h-8 w-auto relative z-10" />
              </motion.div>
              <motion.div
                style={{
                  color: "white",
                  textShadow: "0 1px 2px rgba(0,0,0,0.3)",
                }}
                className="flex flex-col items-center"
              >
                <TextShineEffect
                  text={siteConfig.distributor.name}
                  className="font-semibold text-sm leading-tight whitespace-nowrap"
                />
                <div
                  className="text-xs font-medium mt-0.5"
                  style={{
                    color: "#e6b800",
                    textShadow: "0 1px 2px rgba(0,0,0,0.5)",
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
                    color: "white",
                    textShadow: "0 1px 2px rgba(0,0,0,0.3)",
                  }}
                >
                  <TextShineEffect
                    text={siteConfig.distributor.name}
                    className="font-semibold text-[13px] sm:text-sm leading-none whitespace-nowrap"
                  />
                  <div
                    className="text-[10px] sm:text-xs font-medium mt-[2px]"
                    style={{
                      color: "#e6b800",
                      textShadow: "0 1px 2px rgba(0,0,0,0.5)",
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
              style={{ color: "white" }}
            >
              <div>
                <ProductListIcon />
              </div>
              <div className="w-px h-6 mx-1 bg-white/60" />
              <div className="w-9 h-9" />
            </motion.div>
            <div
              className="md:hidden"
              style={{
                color: "white",
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
