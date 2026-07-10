/**
 * @module src/components/ui/CustomScrollbar.tsx
 * @description Профессиональный кастомный скроллбар Awwwards 2025 уровня с pixel-perfect центрированием,
 * GPU-ускорением и кросс-браузерной совместимостью. Синхронизирован с Lenis smooth scroll.
 * Оптимизирован для всех performance tier (LOW/MEDIUM/HIGH).
 *
 * @author Kort
 * @version 9.1.1 - Awwwards Pro 2025 (Fitts' Law + Apple UX)
 *
 * @usage
 * 1. src/components/layout/Layout.tsx - Глобальный скроллбар для всего сайта
 */

import { useIsMobile } from "@/hooks";
import { lenis } from "@/lib/lenis";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

interface LenisScrollEvent {
  progress: number;
}

const CustomScrollbar: React.FC = () => {
  const isMobile = useIsMobile();
  const location = useLocation();

  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [thumbHeight, setThumbHeight] = useState(50);
  const [hasScroll, setHasScroll] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const dragStartYRef = useRef(0);
  const dragStartThumbYRef = useRef(0);
  const maxThumbYRef = useRef(0);
  const scrollableHeightRef = useRef(0);
  const thumbYRef = useRef(0);
  const isInitialLoadRef = useRef(true);

  const TRACK_PADDING = isMobile ? 1 : 0;

  /**
   * @function updateDimensions
   * @description Вычисляет размеры ползунка на основе viewport и scrollHeight.
   * Использует адаптивные минимальные размеры для mobile/desktop.
   */
  const updateDimensions = useCallback(() => {
    const vh = window.innerHeight;
    const ch = document.documentElement.scrollHeight;
    const sh = Math.max(0, ch - vh);

    scrollableHeightRef.current = sh;

    setHasScroll(sh > 0);
    if (sh <= 0) return;

    const trackHeight = vh - TRACK_PADDING * 2;
    const ratio = trackHeight / ch;

    const minHeight = isMobile ? 32 : 40;
    const maxHeight = trackHeight * 0.9;

    const newThumbHeight = Math.max(minHeight, Math.min(maxHeight, trackHeight * ratio));

    setThumbHeight(newThumbHeight);
    maxThumbYRef.current = trackHeight - newThumbHeight;
  }, [isMobile, TRACK_PADDING]);

  /**
   * @function showScrollbar
   * @description Показывает скроллбар и отменяет таймер скрытия
   */
  const showScrollbar = useCallback(() => {
    setIsVisible(true);
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
  }, []);

  /**
   * @function hideScrollbar
   * @description Скрывает скроллбар через 1500ms (Apple-style timing), если не hovering/dragging
   */
  const hideScrollbar = useCallback(() => {
    if (isDragging || isHovering) return;

    hideTimeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 1500);
  }, [isDragging, isHovering]);

  /**
   * @function handleScroll
   * @description Синхронизирует позицию ползунка с прогрессом скролла от Lenis.
   * Использует прямое обновление DOM для 60fps плавности.
   */
  const handleScroll = useCallback(
    (e: LenisScrollEvent) => {
      if (isDragging || isMenuOpen) return;

      const newThumbY = e.progress * maxThumbYRef.current;

      if (thumbRef.current) {
        thumbRef.current.style.transform = `translateY(${newThumbY}px)`;
      }
      thumbYRef.current = newThumbY;

      if (document.getElementById("preloader")) {
        return;
      }

      if (isInitialLoadRef.current) {
        isInitialLoadRef.current = false;
        return;
      }

      showScrollbar();
      hideScrollbar();
    },
    [isDragging, isMenuOpen, showScrollbar, hideScrollbar],
  );

  /**
   * @function handleMouseDown
   * @description Обрабатывает drag ползунка с синхронизацией Lenis скролла.
   */
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      setIsDragging(true);
      dragStartYRef.current = e.clientY;
      dragStartThumbYRef.current = thumbYRef.current;

      const handleMouseMove = (e: MouseEvent) => {
        const deltaY = e.clientY - dragStartYRef.current;
        const newThumbY = Math.max(0, Math.min(maxThumbYRef.current, dragStartThumbYRef.current + deltaY));

        if (thumbRef.current) {
          thumbRef.current.style.transform = `translateY(${newThumbY}px)`;
        }
        thumbYRef.current = newThumbY;

        const progress = maxThumbYRef.current > 0 ? newThumbY / maxThumbYRef.current : 0;
        const targetScroll = progress * scrollableHeightRef.current;

        lenis?.scrollTo(targetScroll, { immediate: true });

        showScrollbar();
        hideScrollbar();
      };

      const handleMouseUp = () => {
        setIsDragging(false);
        hideScrollbar();
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [hideScrollbar, showScrollbar],
  );

  /**
   * @function handleMouseEnter
   * @description Показывает скроллбар при наведении (только desktop)
   */
  const handleMouseEnter = useCallback(() => {
    if (isMobile) return;
    if (document.getElementById("preloader")) return;
    if (isInitialLoadRef.current) return;

    setIsHovering(true);
    showScrollbar();
  }, [isMobile, showScrollbar]);

  /**
   * @function handleMouseLeave
   * @description Скрывает скроллбар после ухода курсора (только desktop)
   */
  const handleMouseLeave = useCallback(() => {
    if (isMobile) return;
    setIsHovering(false);

    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }
    hideTimeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 1500);
  }, [isMobile]);

  useEffect(() => {
    if (isMobile || !lenis) return;

    updateDimensions();

    const resizeObserver = new ResizeObserver(updateDimensions);
    resizeObserver.observe(document.body);

    lenis?.on("scroll", handleScroll);

    return () => {
      resizeObserver.disconnect();
      lenis?.off("scroll", handleScroll);
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, [handleScroll, updateDimensions, isMobile]);

  useEffect(() => {
    setIsVisible(false);
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }

    const timer = setTimeout(() => {
      updateDimensions();
    }, 100);

    return () => clearTimeout(timer);
  }, [location.pathname, updateDimensions]);

  useEffect(() => {
    const handleMenuUpdate = (e: Event) => {
      const customEvent = e as CustomEvent;
      setIsMenuOpen(customEvent.detail.action === "hide");
    };
    window.addEventListener("custom-scrollbar-update", handleMenuUpdate);
    return () => window.removeEventListener("custom-scrollbar-update", handleMenuUpdate);
  }, []);

  // РЕАКТИВНЫЙ ФИКС МЕРЦАНИЯ НА СОБЫТИЯХ ШИНЫ (0% CPU В ПРОСТОЕ)
  useEffect(() => {
    const handlePopStart = () => {
      setIsVisible(false);
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = null;
      }
    };

    const handlePopComplete = () => {
      updateDimensions();
    };

    window.addEventListener("pop-transition-start", handlePopStart);
    window.addEventListener("pop-transition-complete", handlePopComplete);

    return () => {
      window.removeEventListener("pop-transition-start", handlePopStart);
      window.removeEventListener("pop-transition-complete", handlePopComplete);
    };
  }, [updateDimensions]);

  useEffect(() => {
    if (!isHovering && isVisible && !isDragging) {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
      hideTimeoutRef.current = setTimeout(() => {
        setIsVisible(false);
      }, 1500);
    }
  }, [isHovering, isVisible, isDragging]);

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>;

    const checkPreloaderRemoval = () => {
      const preloader = document.getElementById("preloader");
      if (!preloader && isInitialLoadRef.current) {
        isInitialLoadRef.current = false;

        const checkCursorPosition = (e: MouseEvent) => {
          const isInScrollbarArea = e.clientX >= window.innerWidth - 24;
          if (isInScrollbarArea) {
            setIsHovering(true);
            showScrollbar();
          }
          document.removeEventListener("mousemove", checkCursorPosition);
        };

        document.addEventListener("mousemove", checkCursorPosition, {
          once: true,
        });

        setTimeout(() => {
          document.removeEventListener("mousemove", checkCursorPosition);
        }, 100);

        // КРИТИЧЕСКОЕ ИСПРАВЛЕНИЕ: Очистка таймера после выполнения
        clearInterval(intervalId);
      }
    };

    intervalId = setInterval(checkPreloaderRemoval, 100);
    return () => clearInterval(intervalId);
  }, [showScrollbar]);

  const thumbWidthDefault = 6;
  const thumbWidthHover = 10;
  const containerWidth = 16;
  const hitAreaWidth = 24;

  if (isMobile) return null;

  return (
    <>
      {!isMobile && (
        <div
          className="fixed top-0 right-0 h-full z-[9998]"
          style={{
            width: hitAreaWidth,
            pointerEvents: "auto",
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        />
      )}

      <div
        ref={containerRef}
        className="fixed top-0 right-0 z-[9999]"
        style={{
          width: containerWidth,
          height: "100%",
          opacity: isVisible && hasScroll && !isMenuOpen ? 1 : 0,
          transition: "opacity 0.6s cubic-bezier(0.25, 0.1, 0.25, 1)",
          pointerEvents: isVisible && hasScroll && !isMenuOpen ? "auto" : "none",
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div
          ref={thumbRef}
          className="absolute rounded-full cursor-grab active:cursor-grabbing"
          style={{
            width: isHovering || isDragging ? thumbWidthHover : thumbWidthDefault,
            height: thumbHeight,
            right: 0,
            top: TRACK_PADDING,
            transform: `translateY(0px)`,
            backgroundColor: isHovering || isDragging ? "#FFFFFF" : "rgba(255, 255, 255, 0.9)",
            boxShadow:
              "0 0 0 1px rgba(255, 255, 255, 0.4), " +
              "0 0 0 2px rgba(0, 0, 0, 0.5), " +
              "0 3px 12px rgba(0, 0, 0, 0.35)",
            transition: "width 0.2s cubic-bezier(0.25, 0.1, 0.25, 1), background-color 0.2s ease, box-shadow 0.2s ease",
            willChange: "transform, width",
          }}
          onMouseDown={handleMouseDown}
        />
      </div>
    </>
  );
};

export default React.memo(CustomScrollbar);
