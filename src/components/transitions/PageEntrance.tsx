/**
 * @module PageEntrance
 * @description Глобальный оркестратор сценического входа (Awwwards Pro 2026+)
 * ИСПРАВЛЕНИЕ: Добавлена гибкая настройка задержки `MOBILE_MENU_SYNC_DELAY` специально
 * для синхронизации текста и закрывающейся волны мобильного меню.
 * @author Kort & AI
 * @version 1.5.0
 */

import { usePerformanceTier } from "@/hooks/usePerformanceTier";
import { gsap } from "gsap";
import React, { useEffect, useRef, useState } from "react";

// --- НАСТРОЙКИ ТАЙМИНГОВ ---
const PRELOADER_DELAY = 550;
const PC_ROUTE_DELAY = 160;
const POP_DELAY = 1;

const MOBILE_MENU_SYNC_DELAY = 0;

interface PageEntranceProps {
  children: React.ReactNode;
  className?: string;
}

export const PageEntrance: React.FC<PageEntranceProps> = ({ children, className }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const tier = usePerformanceTier();

  const [isActive, setIsActive] = useState(false);

  // Флаг защиты от интервала-перехватчика
  const eventTriggeredRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const hasPreloader = document.getElementById("preloader") !== null;
    let timerId: ReturnType<typeof setTimeout> | null = null;

    // ─── ЖЕСТКОЕ РАЗДЕЛЕНИЕ ТАЙМИНГОВ ───
    const triggerStart = (type: "preload" | "route" | "pop" | "mobile-menu") => {
      eventTriggeredRef.current = true;
      if (timerId) clearTimeout(timerId);

      let delay = PC_ROUTE_DELAY;
      if (type === "preload") delay = PRELOADER_DELAY;
      if (type === "pop") delay = POP_DELAY;
      if (type === "mobile-menu") delay = MOBILE_MENU_SYNC_DELAY;

      timerId = setTimeout(() => {
        setIsActive(true);
      }, delay);
    };

    const handlePreloaderStart = () => triggerStart("preload");
    const handlePopTransition = () => triggerStart("pop");

    const handleRouteTransition = (e: Event) => {
      const customEvent = e as CustomEvent;
      // Если сигнал пришел из TheodoreMenu, даем задержку
      if (customEvent.detail && customEvent.detail.fromMobileMenu) {
        triggerStart("mobile-menu");
      } else {
        triggerStart("route");
      }
    };

    window.addEventListener("preloader-outro-start", handlePreloaderStart);
    window.addEventListener("menu-transition-complete", handleRouteTransition);
    window.addEventListener("pop-transition-complete", handlePopTransition);

    // ИДЕАЛЬНЫЙ ФОЛБЭК-ПОЛЛИНГ
    const pollingInterval = setInterval(() => {
      const isTransitionActive = window.__menuTransitionInProgress || window.__popTransitionInProgress;
      if (!hasPreloader && !isTransitionActive && !isActive && !eventTriggeredRef.current) {
        triggerStart("route");
        clearInterval(pollingInterval);
      }
    }, 50);

    return () => {
      if (timerId) clearTimeout(timerId);
      clearInterval(pollingInterval);
      window.removeEventListener("preloader-outro-start", handlePreloaderStart);
      window.removeEventListener("menu-transition-complete", handleRouteTransition);
      window.removeEventListener("pop-transition-complete", handlePopTransition);
    };
  }, [isActive]);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;
    const container = containerRef.current;

    const badge = container.querySelector('[data-entrance="badge"]');
    const title = container.querySelector('[data-entrance="title"]');
    const lead = container.querySelector('[data-entrance="lead"]');
    const buttonsContainer = container.querySelector('[data-entrance="buttons"]');

    const targets = [badge, title, lead, buttonsContainer].filter((el): el is HTMLElement => el !== null);

    if (targets.length === 0) return;

    if (tier === "low") {
      gsap.set(targets, { opacity: 1, y: 0, clearProps: "all" });
      return;
    }

    const tl = gsap.timeline({
      defaults: { ease: "power3.out" },
    });

    tl.fromTo(
      targets,
      { opacity: 0, y: 32 },
      {
        opacity: 1,
        y: 0,
        duration: tier === "high" ? 1.8 : 1.4,
        stagger: 0.15,
        force3D: true,
        onComplete: () => {
          gsap.set(targets, { clearProps: "all" });
        },
      },
    );

    return () => {
      tl.kill();
    };
  }, [isActive, tier]);

  const initialStyle = !isActive && tier !== "low" ? { opacity: 0 } : undefined;

  return (
    <div ref={containerRef} className={className} style={initialStyle}>
      {children}
    </div>
  );
};

export default PageEntrance;
