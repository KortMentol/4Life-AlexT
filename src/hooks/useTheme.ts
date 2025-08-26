import { useContext } from "react";
import { ThemeContext } from "@/context/ThemeContext.helpers";
import { ThemeContextType } from "@/context/ThemeContext.types";

/**
 * @module src/hooks/useTheme.ts
 * @description Хук для получения доступа к контексту `ThemeContext`. Предоставляет компонентам простой API для получения текущей темы и функций для её изменения.
 * @author Kort
 * @version 1.0.0
 * @returns {ThemeContextType} Объект контекста, содержащий текущую тему (`theme`) и функции `toggleTheme`, `setTheme`.
 * @throws {Error} Выбрасывает ошибку, если хук используется вне `ThemeProvider`.
 * @see ThemeProvider - Провайдер, который необходимо использовать выше по дереву компонентов.
 * @usage
 * 1. `src/components/layout/Header.tsx`: Для переключения темы.
 * 2. `src/components/ui/DynamicLogo.tsx`: Для смены логотипа в зависимости от темы.
 * 3. `src/components/effects/FluidEffect.tsx`: Для изменения цветов эффекта.
 * @example
 * const { theme, toggleTheme } = useTheme();
 *
 * return (
 *   <button onClick={toggleTheme}>
 *     Current theme: {theme}
 *   </button>
 * );
 */
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
