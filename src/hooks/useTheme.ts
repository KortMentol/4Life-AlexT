import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext.helpers";
import { ThemeContextType } from "../context/ThemeContext.types";

/**
 * Хук для доступа к контексту темы
 * @returns Объект с текущей темой и функциями для её изменения
 * @throws Ошибку, если используется вне ThemeProvider
 */
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
