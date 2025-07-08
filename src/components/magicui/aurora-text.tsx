"use client";

import React, { memo } from "react";

interface AuroraTextProps {
  children: React.ReactNode;
  className?: string;
  colors?: string[];
  speed?: number;
}

/**
 * @module components/magicui/aurora-text
 * @description Компонент для отображения текста с анимированным градиентом, создающим эффект "северного сияния" (Aurora).
 * Эффект достигается за счет анимированного линейного градиента, примененного к тексту.
 *
 * @author Kort
 * @version 1.0.0
 *
 * @param {React.ReactNode} children - Текстовый узел, к которому применяется эффект.
 * @param {string} [className] - Дополнительные CSS-классы для стилизации контейнера.
 * @param {string[]} [colors=['#FF0080', '#7928CA', '#0070F3', '#38bdf8']] - Массив цветов для создания градиента.
 * @param {number} [speed=1] - Множитель скорости анимации.
 *
 * @see React.memo - Компонент обернут в `memo` для оптимизации рендеринга.
 *
 * @usage
 * Компонент используется для создания анимированного градиентного текста в ключевых заголовках на главной странице.
 * 
 * **Точное использование в проекте:**
 * 1. **Главная страница (`src/pages/HomePage.tsx`), главный экран `Hero`:**
 *    - Применяется к тексту `"с научным подходом4Life"` для создания яркого акцента в основном заголовке.
 * 
 * 2. **Главная страница (`src/pages/HomePage.tsx`), секция `StaticFeature`:**
 *    - Применяется к заголовку `"Инновационные продукты для иммунитета"`.
 * 
 * 3. **Главная страница (`src/pages/HomePage.tsx`), финальная секция `CallToAction`:**
 *    - Применяется к части заголовка `"в своё здоровье и будущее?"`.
 *
 * @example
 * // Пример из блока Hero на HomePage.tsx
 * <h1>
 *   Раскройте потенциал своего здоровья
 *   <AuroraText>с научным подходом4Life</AuroraText>
 * </h1>
 */
export const AuroraText = memo(
  ({
    children,
    className = "",
    colors = ["#FF0080", "#7928CA", "#0070F3", "#38bdf8"],
    speed = 1,
  }: AuroraTextProps) => {
    const gradientStyle = {
      backgroundImage: `linear-gradient(135deg, ${colors.join(", ")}, ${
        colors[0]
      })`,
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      animationDuration: `${10 / speed}s`,
    };

    return (
      <span className={`relative inline-block ${className}`}>
        <span className="sr-only">{children}</span>
        <span
          className="relative animate-aurora bg-[length:200%_auto] bg-clip-text text-transparent"
          style={gradientStyle}
          aria-hidden="true"
        >
          {children}
        </span>
      </span>
    );
  },
);

AuroraText.displayName = "AuroraText";
