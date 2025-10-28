/**
 * @module src/components/ui/CustomScrollbar.tsx
 * @description Профессиональный кастомный скроллбар с максимальной производительностью и идеальным дизайном
 * @author Kort
 * @version 6.0.0 - Professional Grade
 * @usage
 * 1. src/components/layout/Layout.tsx - Основной лайаут для глобального скроллбара
 * @example
 * <CustomScrollbar />
 */
import { useIsMobile } from "@/hooks";
import { usePerformanceTier } from "@/hooks/usePerformanceTier";
import { lenis } from "@/lib/lenis";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

interface LenisScrollEvent {
  progress: number;
}

const CustomScrollbar: React.FC = () => {
  const isMobile = useIsMobile();
  const tier = usePerformanceTier();
  const location = useLocation();
  
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [thumbHeight, setThumbHeight] = useState(50);
  const [thumbY, setThumbY] = useState(0);

  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const dragStartYRef = useRef(0);
  const dragStartThumbYRef = useRef(0);
  const maxThumbYRef = useRef(0);
  const scrollableHeightRef = useRef(0);

  // Оптимизированное обновление размеров
  const updateDimensions = useCallback(() => {
    const vh = window.innerHeight;
    const ch = document.documentElement.scrollHeight;
    const sh = Math.max(0, ch - vh);
    
    scrollableHeightRef.current = sh;
    
    if (sh <= 0) return;
    
    const ratio = vh / ch;
    const minHeight = isMobile ? 32 : 40;
    const maxHeight = vh * 0.9;
    const newThumbHeight = Math.max(minHeight, Math.min(maxHeight, vh * ratio));
    
    setThumbHeight(newThumbHeight);
    maxThumbYRef.current = vh - newThumbHeight;
  }, [isMobile]);

  // Показ/скрытие с правильной логикой
  const showScrollbar = useCallback(() => {
    setIsVisible(true);
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
  }, []);

  const hideScrollbar = useCallback(() => {
    if (isDragging || isHovering) return;
    
    hideTimeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 1200);
  }, [isDragging, isHovering]);

  // Обработка скролла с мгновенной синхронизацией ползунка
  const handleScroll = useCallback((e: LenisScrollEvent) => {
    if (isDragging) return;
    
    const newThumbY = e.progress * maxThumbYRef.current;
    
    // Мгновенное обновление без setState для максимальной плавности
    if (thumbRef.current) {
      thumbRef.current.style.transform = `translateX(-50%) translateY(${newThumbY}px)`;
    }
    setThumbY(newThumbY);
    
    showScrollbar();
    hideScrollbar();
  }, [isDragging, showScrollbar, hideScrollbar]);

  // Правильное перетаскивание с синхронизацией
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsDragging(true);
    dragStartYRef.current = e.clientY;
    dragStartThumbYRef.current = thumbY;
    
    const handleMouseMove = (e: MouseEvent) => {
      const deltaY = e.clientY - dragStartYRef.current;
      const newThumbY = Math.max(0, Math.min(maxThumbYRef.current, dragStartThumbYRef.current + deltaY));
      
      // Мгновенное обновление позиции ползунка
      if (thumbRef.current) {
        thumbRef.current.style.transform = `translateX(-50%) translateY(${newThumbY}px)`;
      }
      setThumbY(newThumbY);
      
      // Вычисляем и применяем скролл
      const progress = maxThumbYRef.current > 0 ? newThumbY / maxThumbYRef.current : 0;
      const targetScroll = progress * scrollableHeightRef.current;
      
      lenis.scrollTo(targetScroll, { immediate: true });
      
      // Перезапускаем таймер скрытия (фикс для позиции 0)
      showScrollbar();
      hideScrollbar();
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
      hideScrollbar();
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [thumbY, hideScrollbar]);

  // Обработка наведения на область скроллбара
  const handleMouseEnter = useCallback(() => {
    if (isMobile) return;
    setIsHovering(true);
    showScrollbar();
  }, [isMobile, showScrollbar]);

  const handleMouseLeave = useCallback(() => {
    if (isMobile) return;
    setIsHovering(false);
    hideScrollbar();
  }, [isMobile, hideScrollbar]);

  // Основные эффекты
  useEffect(() => {
    if (!lenis) return;
    
    updateDimensions();
    
    const resizeObserver = new ResizeObserver(updateDimensions);
    resizeObserver.observe(document.body);
    
    lenis.on('scroll', handleScroll);
    
    // Показ при активности пользователя
    const handleActivity = () => {
      // Не показываем кастомный скроллбар если меню открыто
      if (document.body.classList.contains('menu-open')) return;
      showScrollbar();
      hideScrollbar();
    };
    
    window.addEventListener('wheel', handleActivity, { passive: true });
    
    return () => {
      resizeObserver.disconnect();
      lenis.off('scroll', handleScroll);
      window.removeEventListener('wheel', handleActivity);
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, [handleScroll, updateDimensions, showScrollbar, hideScrollbar, isMobile]);

  // Пересчет при смене страницы
  useEffect(() => {
    const timer = setTimeout(() => {
      updateDimensions();
      if (window.scrollY > 0) {
        showScrollbar();
        hideScrollbar();
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, [location.pathname, updateDimensions, showScrollbar, hideScrollbar]);

  // Не показываем, если нет скролла, меню открыто или low tier
  if (tier === 'low' || scrollableHeightRef.current <= 0 || document.body.classList.contains('menu-open')) {
    return null;
  }

  const trackWidth = isMobile ? 2 : 3;
  const thumbWidth = isMobile ? 4 : 6;
  const containerWidth = isMobile ? 8 : 12;

  return (
    <>
      {/* Невидимая зона hover только для ПК */}
      {!isMobile && (
        <div
          className="fixed top-0 right-0 h-full z-[9998]"
          style={{
            width: 24,
            pointerEvents: 'auto'
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        />
      )}
      
      {/* Основной скроллбар */}
      <div
        ref={containerRef}
        className="fixed top-0 right-0 h-full z-[9999] flex items-center justify-center"
        style={{
          width: containerWidth,
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          pointerEvents: isVisible ? 'auto' : 'none'
        }}
      >
        {/* Дорожка - Как у Immersive Garden */}
        <div
          ref={trackRef}
          className="relative h-full rounded-full"
          style={{
            width: trackWidth,
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            border: '1px solid rgba(0, 0, 0, 0.1)'
          }}
        >
          {/* Ползунок - Профессиональный стиль */}
          <div
            ref={thumbRef}
            className="absolute rounded-full cursor-grab active:cursor-grabbing"
            style={{
              width: thumbWidth,
              height: thumbHeight,
              left: '50%',
              transform: `translateX(-50%) translateY(${thumbY}px)`,
              backgroundColor: isHovering || isDragging ? '#FFFFFF' : '#F5F5F5',
              border: '1px solid rgba(0, 0, 0, 0.2)',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.3)',
              transition: 'background-color 0.15s ease',
              willChange: 'transform'
            }}
            onMouseDown={handleMouseDown}
          />
        </div>
      </div>
    </>
  );
};

export default React.memo(CustomScrollbar);
