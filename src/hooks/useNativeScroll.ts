/**
 * @module src/hooks/useNativeScroll.ts
 * @description Продвинутый хук для управления поведением хедера при нативном скролле страницы. Обеспечивает плавное появление/исчезновение хедера, изменение его прозрачности, размытия фона и других визуальных эффектов в зависимости от направления и величины скролла. Использует Framer Motion для создания плавных анимаций с физически корректным поведением на основе пружинной модели.
 * @author Kort
 * @version 1.0.0
 * @see https://www.framer.com/motion/motionvalue/ - Документация по MotionValue в Framer Motion
 * @usage
 * 1. `src/components/layout/Header.tsx`: Для создания эффекта "умного" хедера, который скрывается при скролле вниз и появляется при скролле вверх.
 * 2. `src/components/layout/StickyHeader.tsx`: Для создания липкого хедера с изменяющимися визуальными свойствами при скролле.
 * 3. `src/components/navigation/ProgressBar.tsx`: Для отображения индикатора прогресса прокрутки страницы.
 * @example
 * // Базовое использование в компоненте хедера
 * const { headerY, headerOpacity, isScrolled } = useNativeScroll({ headerHeight: 80 });
 * 
 * // Применение к компоненту
 * <motion.header
 *   style={{ 
 *     y: headerY,
 *     opacity: headerOpacity,
 *     boxShadow: isScrolled ? "0 4px 20px rgba(0,0,0,0.1)" : "none"
 *   }}
 * >
 *   { Содержимое хедера }
 * </motion.header>
 */
import { useEffect, useRef } from 'react';
import { useMotionValue, useSpring, useTransform } from 'framer-motion';
import { throttle } from '../utils/performanceUtils';

/**
 * Параметры для настройки поведения скролла
 * @interface UseNativeScrollOptions
 */
export interface UseNativeScrollOptions {
  /** Высота хедера в пикселях */
  headerHeight: number;
  /** Вертикальный отступ хедера в пикселях (по умолчанию: 0) */
  topOffset?: number;
  /** Порог скролла в пикселях, после которого хедер считается прокрученным (по умолчанию: 50) */
  threshold?: number;
  /** Настройки пружинной анимации для плавности движения */
  springConfig?: {
    /** Жесткость пружины (по умолчанию: 100) */
    stiffness?: number;
    /** Затухание пружины (по умолчанию: 20) */
    damping?: number;
    /** Масса объекта (по умолчанию: 0.5) */
    mass?: number;
  };
}

/**
 * Результат работы хука useNativeScroll
 * @interface UseNativeScrollReturn
 */
export interface UseNativeScrollReturn {
  /** Текущая позиция скролла в пикселях */
  scrollY: number;
  /** Текущее направление скролла: 'up' (вверх), 'down' (вниз) или null (не определено) */
  scrollDirection: 'up' | 'down' | null;
  /** MotionValue для отслеживания прогресса скрытия хедера (0 = полностью видимый, 1 = полностью скрытый) */
  scrollProgress: ReturnType<typeof useMotionValue<number>>;
  /** MotionValue для вертикального положения хедера с пружинной анимацией */
  headerY: ReturnType<typeof useSpring>;
  /** MotionValue для прозрачности элементов хедера в зависимости от скролла */
  headerOpacity: ReturnType<typeof useMotionValue<number>>;
  /** MotionValue для размытия фона хедера в зависимости от скролла */
  backdropBlur: ReturnType<typeof useMotionValue<string>>;
  /** MotionValue для насыщенности фона хедера в зависимости от скролла */
  backdropSaturate: ReturnType<typeof useMotionValue<string>>;
  /** MotionValue для яркости фона хедера в зависимости от скролла */
  backdropBrightness: ReturnType<typeof useMotionValue<string>>;
  /** Флаг, указывающий, прокручена ли страница ниже порогового значения */
  isScrolled: boolean;
}

/**
 * Хук для управления поведением хедера при нативном скролле
 * @param options - Объект с настройками поведения скролла
 * @returns Объект с состоянием скролла и значениями для анимации хедера
 */
export const useNativeScroll = ({
  headerHeight,
  topOffset = 0,
  threshold = 50,
  springConfig = {
    stiffness: 100,
    damping: 20,
    mass: 0.5
  }
}: UseNativeScrollOptions): UseNativeScrollReturn => {
  // Сохраняем предыдущую позицию скролла для определения направления
  const lastScrollY = useRef(0);
  // Текущее направление скролла
  const scrollDirection = useRef<'up' | 'down' | null>(null);
  // Прогресс скрытия хедера (0 = видимый, 1 = скрытый)
  const scrollProgress = useMotionValue(0);
  // Текущая позиция скролла
  const currentScrollY = useRef(0);
  // Флаг, указывающий, прокручена ли страница ниже порога
  const isScrolled = currentScrollY.current > threshold;
  
  // Создаем пружинную анимацию для плавного движения хедера
  const headerY = useSpring(0, {
    stiffness: springConfig.stiffness || 180, // Увеличиваем жесткость для более быстрого отклика
    damping: springConfig.damping || 26, // Увеличиваем затухание для более плавного движения
    mass: springConfig.mass || 0.4 // Уменьшаем массу для более быстрого движения
  });

  // Прозрачность элементов хедера в зависимости от прогресса скрытия
  const headerOpacity = useTransform(
    scrollProgress,
    [0, 0.5, 1],
    [1, 0.5, 0]
  );

  // Размытие фона хедера в зависимости от прогресса скрытия
  const backdropBlur = useTransform(
    scrollProgress,
    [0, 1],
    ["blur(12px)", "blur(8px)"]
  );

  // Насыщенность фона хедера в зависимости от прогресса скрытия
  const backdropSaturate = useTransform(
    scrollProgress,
    [0, 1],
    ["saturate(180%)", "saturate(140%)"]
  );

  // Яркость фона хедера в зависимости от прогресса скрытия
  const backdropBrightness = useTransform(
    scrollProgress,
    [0, 1],
    ["brightness(1.05)", "brightness(0.95)"]
  );

  // Обработка нативного скролла для управления хедером
  useEffect(() => {
    /**
     * Обработчик события скролла
     * Вычисляет направление скролла и прогресс скрытия хедера
     */
    const handleScroll = () => {
      // Получаем текущую позицию скролла
      currentScrollY.current = window.scrollY;
      
      // Определяем направление скролла
      if (currentScrollY.current > lastScrollY.current) {
        scrollDirection.current = "down";
      } else if (currentScrollY.current < lastScrollY.current) {
        scrollDirection.current = "up";
      }
      
      // Вычисляем прогресс скрытия/показа хедера
      // 0 = полностью видимый, 1 = полностью скрытый
      let progress = 0;
      
      // При скролле вниз - скрываем (независимо от положения на странице)
      if (scrollDirection.current === "down") {
        // Плавное скрытие при скролле вниз
        progress = 1;
      } 
      // При скролле вверх - показываем
      else if (scrollDirection.current === "up") {
        progress = 0;
      }
      
      // Обновляем значения для анимации
      scrollProgress.set(progress);
      headerY.set(-(headerHeight + topOffset + 20) * progress); // Добавляем 20px для гарантированного полного скрытия
      
      // Сохраняем текущую позицию для следующего вызова
      lastScrollY.current = currentScrollY.current;
    };
    
    // Используем тротлинг для оптимизации производительности
    const throttledHandleScroll = throttle(handleScroll, 5); // Уменьшаем задержку для более плавного отклика

    // Добавляем слушатель события скролла
    window.addEventListener("scroll", throttledHandleScroll, { passive: true });
    
    // Инициализация при монтировании
    handleScroll();
    
    // Удаляем слушатель при размонтировании
    return () => window.removeEventListener("scroll", throttledHandleScroll);
  }, [headerHeight, headerY, scrollProgress]);

  return {
    scrollY: currentScrollY.current,
    scrollDirection: scrollDirection.current,
    scrollProgress,
    headerY,
    headerOpacity,
    backdropBlur,
    backdropSaturate,
    backdropBrightness,
    isScrolled
  };
};