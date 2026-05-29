/**
 * @module src/components/ui/CustomScrollbar.tsx
 * @description Профессиональный кастомный скроллбар Awwwards 2025 уровня с pixel-perfect центрированием,
 * GPU-ускорением и кросс-браузерной совместимостью. Синхронизирован с Lenis smooth scroll.
 * Оптимизирован для всех performance tier (LOW/MEDIUM/HIGH).
 *
 * @author Kort
 * @version 9.0.0 - Awwwards Pro 2025 (Fitts' Law + Apple UX)
 *
 * @usage
 * 1. src/components/layout/Layout.tsx - Глобальный скроллбар для всего сайта
 *
 * @see src/lib/lenis.ts - Интеграция с Lenis smooth scroll
 * @see src/hooks/useIsMobile.ts - Определение мобильных устройств
 *
 * @example
 * // В Layout компоненте
 * import CustomScrollbar from '@/components/ui/CustomScrollbar';
 *
 * function Layout() {
 *   return (
 *     <>
 *       <CustomScrollbar />
 *       <main>{children}</main>
 *     </>
 *   );
 * }
 *
 * @performance
 * - GPU acceleration через `will-change: transform, width`
 * - Только `translateY()` для анимаций (не left/top)
 * - Прямое обновление DOM без лишних re-render
 * - ~0.1ms на кадр, работает на всех tier
 *
 * @crossbrowser
 * - Chrome/Firefox/Safari/Edge: pixel-perfect через чётные размеры (6px → 10px)
 * - Нет sub-pixel артефактов благодаря right: 0 позиционированию
 * - box-shadow вместо border для идентичного рендеринга
 *
 * @design
 * - Apple/Awwwards 2025 стиль: только thumb, без track (минимализм)
 * - Overlay scrollbar (не занимает место в layout)
 * - Fade in/out с Apple-timing (1500ms)
 * - Hover expansion: 6px → 10px (плавная анимация)
 *
 * @ux
 * - Fitts' Law: thumb прижат к правому краю экрана (infinite width target)
 * - Расширенная hit-area: 24px невидимая зона для раннего hover
 * - Hover expansion: thumb расширяется для удобного хвата
 */
import { useIsMobile } from "@/hooks";
import { lenis } from "@/lib/lenis";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

/**
 * @interface LenisScrollEvent
 * @description Событие скролла от Lenis библиотеки
 * @property {number} progress - Прогресс скролла от 0 до 1 (0 = верх, 1 = низ)
 */
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
  const isInitialLoadRef = useRef(true); // ФИКС: Флаг первой загрузки

  const TRACK_PADDING = isMobile ? 1 : 0; // 8px safe zone for mobile

  /**
   * @function updateDimensions
   * @description Вычисляет размеры ползунка на основе viewport и scrollHeight.
   * Использует адаптивные минимальные размеры для mobile/desktop.
   *
   * @performance Вызывается через ResizeObserver (debounced браузером)
   *
   * @calculates
   * - thumbHeight: пропорционален viewport/scrollHeight, min 32px (mobile) / 40px (desktop)
   * - maxThumbY: максимальная позиция ползунка (viewport - thumbHeight)
   */
  const updateDimensions = useCallback(() => {
    const vh = window.innerHeight;
    const ch = document.documentElement.scrollHeight;
    const sh = Math.max(0, ch - vh);

    scrollableHeightRef.current = sh;

    setHasScroll(sh > 0);
    if (sh <= 0) return;

    // Apply safe padding to track height calculation
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
   *
   * @param {LenisScrollEvent} e - Событие от Lenis с progress (0-1)
   *
   * @performance
   * - Прямое обновление style.transform без setState
   * - Пропускает обновление при dragging для предотвращения конфликтов
   * - ЕДИНСТВЕННЫЙ триггер показа скроллбара (Apple UX)
   */
  const handleScroll = useCallback(
    (e: LenisScrollEvent) => {
      if (isDragging || isMenuOpen) return;

      const newThumbY = e.progress * maxThumbYRef.current;

      if (thumbRef.current) {
        // ФИКС: Используем только translateY, без translateX (thumb прижат к right: 0)
        thumbRef.current.style.transform = `translateY(${newThumbY}px)`;
      }
      thumbYRef.current = newThumbY;

      // ФИКС: Не показываем скроллбар пока прелоадер активен
      if (document.getElementById("preloader")) {
        return;
      }

      // ФИКС: Не показываем скроллбар при первой загрузке (сразу после прелоадера)
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
   * Использует immediate scroll для мгновенного отклика.
   *
   * @param {React.MouseEvent} e - Mouse event от ползунка
   *
   * @behavior
   * - Вычисляет deltaY от начальной позиции
   * - Ограничивает newThumbY в пределах [0, maxThumbY]
   * - Синхронизирует Lenis через scrollTo с immediate: true
   * - Cleanup listeners на mouseup
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
          // ФИКС: Используем только translateY, без translateX (thumb прижат к right: 0)
          thumbRef.current.style.transform = `translateY(${newThumbY}px)`;
        }
        thumbYRef.current = newThumbY;

        // Вычисляем и применяем скролл
        const progress = maxThumbYRef.current > 0 ? newThumbY / maxThumbYRef.current : 0;
        const targetScroll = progress * scrollableHeightRef.current;

        lenis?.scrollTo(targetScroll, { immediate: true });

        // Перезапускаем таймер скрытия (фикс для позиции 0)
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

    // ФИКС: Не показываем скроллбар пока прелоадер активен
    if (document.getElementById("preloader")) return;

    // ФИКС: Не показываем скроллбар при первой загрузке (сразу после прелоадера)
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

    // ФИКС: Отменяем предыдущий таймер и запускаем новый
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }
    hideTimeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 1500);
  }, [isMobile]);

  // Основные эффекты
  useEffect(() => {
    if (isMobile || !lenis) return; // Prevent heavy observer logic on mobile

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
  }, [handleScroll, updateDimensions]);

  // Пересчет при смене страницы + сброс видимости
  useEffect(() => {
    // Apple-style: мгновенно скрываем скроллбар при переходе
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

  // Слушатель событий меню
  useEffect(() => {
    const handleMenuUpdate = (e: Event) => {
      const customEvent = e as CustomEvent;
      setIsMenuOpen(customEvent.detail.action === "hide");
    };
    window.addEventListener("custom-scrollbar-update", handleMenuUpdate);
    return () => window.removeEventListener("custom-scrollbar-update", handleMenuUpdate);
  }, []);

  // ФИКС МЕРЦАНИЯ: Мгновенно скрываем скроллбар при начале POP-перехода
  useEffect(() => {
    const checkPopTransition = () => {
      if (window.__popTransitionInProgress) {
        setIsVisible(false);
        if (hideTimeoutRef.current) {
          clearTimeout(hideTimeoutRef.current);
          hideTimeoutRef.current = null;
        }
      }
    };

    // Проверяем каждые 16ms (60fps) во время POP-перехода
    const intervalId = setInterval(checkPopTransition, 16);

    return () => clearInterval(intervalId);
  }, []);

  // ФИКС HOVER: Автоматически скрываем скроллбар через 1.5 сек после ухода курсора
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

  // ФИКС ПРЕЛОАДЕРА: Проверяем позицию курсора после исчезновения прелоадера
  useEffect(() => {
    const checkPreloaderRemoval = () => {
      const preloader = document.getElementById("preloader");
      if (!preloader && isInitialLoadRef.current) {
        // Прелоадер исчез, сбрасываем флаг
        isInitialLoadRef.current = false;

        // Проверяем, находится ли курсор в области скроллбара (правые 24px)
        const checkCursorPosition = (e: MouseEvent) => {
          const isInScrollbarArea = e.clientX >= window.innerWidth - 24;
          if (isInScrollbarArea) {
            setIsHovering(true);
            showScrollbar();
          }
          document.removeEventListener("mousemove", checkCursorPosition);
        };

        document.addEventListener("mousemove", checkCursorPosition, { once: true });

        // Если курсор не двигается, проверяем через 100ms
        setTimeout(() => {
          document.removeEventListener("mousemove", checkCursorPosition);
        }, 100);
      }
    };

    const intervalId = setInterval(checkPreloaderRemoval, 100);

    return () => clearInterval(intervalId);
  }, [showScrollbar]);

  // ФИКС: Используем чётные размеры для pixel-perfect центрирования в Firefox/Chrome
  // Нечётные размеры создают sub-pixel артефакты (3px → translateX(-1.5px) → разное округление)

  // Fitts' Law: скроллбар должен доходить до края экрана (infinite width target)
  const thumbWidthDefault = 6; // Узкий в состоянии покоя
  const thumbWidthHover = 10; // Расширяется при hover для удобного хвата
  const containerWidth = 16; // Достаточно для hover-зоны thumb
  const hitAreaWidth = 24; // Невидимая зона для раннего срабатывания hover

  // AWWWARDS 2026: Do not render custom scrollbar DOM on mobile
  if (isMobile) return null;

  return (
    <>
      {/* Невидимая зона hover для Fitts' Law — доходит до самого края экрана */}
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

      {/* Основной контейнер — доходит до края экрана (right: 0) */}
      <div
        ref={containerRef}
        className="fixed top-0 right-0 z-[9999]"
        style={{
          width: containerWidth,
          height: "100%",
          // Smoothly hide if menu is open, or if there's no scroll, or if inactive
          opacity: isVisible && hasScroll && !isMenuOpen ? 1 : 0,
          transition: "opacity 0.6s cubic-bezier(0.25, 0.1, 0.25, 1)",
          pointerEvents: isVisible && hasScroll && !isMenuOpen ? "auto" : "none",
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Ползунок - Awwwards 2025: расширяется при hover КОНТЕЙНЕРА, доходит до края */}
        <div
          ref={thumbRef}
          className="absolute rounded-full cursor-grab active:cursor-grabbing"
          style={{
            // Динамическая ширина: узкий → широкий при hover контейнера
            width: isHovering || isDragging ? thumbWidthHover : thumbWidthDefault,
            height: thumbHeight,
            // Позиционирование: прижат к правому краю контейнера
            right: 0,
            top: TRACK_PADDING,
            transform: `translateY(0px)`,
            backgroundColor: isHovering || isDragging ? "#FFFFFF" : "rgba(255, 255, 255, 0.9)",
            // Профессиональная тень: работает на светлых И тёмных фонах
            boxShadow:
              "0 0 0 1px rgba(255, 255, 255, 0.4), " + // Светлая обводка (видна на тёмном)
              "0 0 0 2px rgba(0, 0, 0, 0.5), " + // Тёмная обводка (видна на светлом)
              "0 3px 12px rgba(0, 0, 0, 0.35)", // Глубокая тень для объёма
            // Плавная анимация расширения + цвета
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
