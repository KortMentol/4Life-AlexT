"use client";

import React, { memo, useMemo } from "react";
import { usePerformanceTier } from "@/hooks/usePerformanceTier";

interface AuroraTextProps {
  children: React.ReactNode;
  className?: string;
  colors?: string[];
  speed?: number;
}

/**
 * @module components/magicui/aurora-text
 * @description Компонент для отображения текста с анимированным градиентом, создающим эффект "северного сияния" (Aurora).
 * Эффект адаптируется под производительность устройства через usePerformanceTier().
 *
 * @author Kort
 * @version 2.0.0 (2026 Performance Optimized)
 *
 * @param {React.ReactNode} children - Текстовый узел, к которому применяется эффект.
 * @param {string} [className] - Дополнительные CSS-классы для стилизации контейнера.
 * @param {string[]} [colors=['#FF0080', '#7928CA', '#0070F3', '#38bdf8']] - Массив цветов для создания градиента.
 * @param {number} [speed=1] - Множитель скорости анимации.
 *
 * @see React.memo - Компонент обернут в `memo` для оптимизации рендеринга.
 * @see usePerformanceTier - Адаптивная логика под производительность устройства.
 *
 * @usage
 * Компонент используется для создания анимированного градиентного текста в ключевых заголовках на главной странице.
 * Анимация адаптируется под производительность: HIGH (полная), MEDIUM (упрощенная), LOW (статичная).
 *
 * **Точное использование в проекте:**
 * 1. **Главная страница (`src/pages/HomePage.tsx`), главный экран `Hero`:**
 *    - Применяется к тексту `"с научным подходом4Life"` для создания яркого акцента в основном заголовке.
 *
 * 2. **Главная страница (`src/pages/HomePage.tsx`), секция `StaticFeature`:**
 *    - Применяется к заголовку `"Инновационные продукты для иммунитета"`.
 *
 * 3. **Главная страница (`src/pages/HomePage.tsx`), финальная секция `CallToAction`:**
 *    - Применяется к части заголовка `"первый шаг?"`.
 *
 * @example
 * // Пример из блока Hero на HomePage.tsx
 * <h1>
 *   Раскройте потенциал своего здоровья
 *   <AuroraText>с научным подходом4Life</AuroraText>
 * </h1>
 */
const AuroraTextComponent = memo(
  ({
    children,
    className = "",
    colors = ["#FF0080", "#7928CA", "#0070F3", "#38bdf8"],
    speed = 1,
  }: AuroraTextProps) => {
    // 2026 PERFORMANCE TIER SYSTEM
    const performanceTier = usePerformanceTier();
    
    // Мемоизируем класс анимации на основе производительности
    const animationClass = useMemo(() => {
      switch (performanceTier) {
        case 'high':
          return 'animate-aurora-high';
        case 'medium':
          return 'animate-aurora-medium';
        case 'low':
        default:
          return 'animate-aurora-low'; // Статичный градиент для слабых устройств
      }
    }, [performanceTier]);
    
    // Адаптивная скорость анимации
    const adaptiveSpeed = useMemo(() => {
      if (performanceTier === 'low') return 0; // Отключаем анимацию
      if (performanceTier === 'medium') return speed * 0.7; // Замедляем на 30%
      return speed; // Полная скорость для HIGH
    }, [performanceTier, speed]);
    
    const gradientStyle = {
      backgroundImage: `linear-gradient(135deg, ${colors.join(", ")}, ${
        colors[0]
      })`,
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      // Адаптивная длительность анимации
      animationDuration: adaptiveSpeed > 0 ? `${10 / adaptiveSpeed}s` : "0s",
    };

    return (
      <span className={`relative inline-block ${className}`}>
        <span className="sr-only">{children}</span>
        <span
          className={`relative bg-[length:200%_auto] bg-clip-text text-transparent ${
            performanceTier !== 'low' ? animationClass : 'animate-aurora-low'
          }`}
          style={gradientStyle}
          aria-hidden="true"
        >
          {children}
        </span>
      </span>
    );
  },
);

AuroraTextComponent.displayName = "AuroraText";

export const AuroraText = React.memo(AuroraTextComponent);
