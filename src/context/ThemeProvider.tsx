import React, { useCallback, useEffect, useState } from "react";
import { ThemeContext, ThemeProviderProps } from "./ThemeContext.helpers";
import { Theme } from "./ThemeContext.types";

/**
 * @module src/context/ThemeProvider.tsx
 * @description Провайдер для управления темой оформления (светлая/темная). Определяет начальную тему на основе настроек пользователя в `localStorage` или системных настроек. Предоставляет функции для переключения и установки темы. Автоматически применяет нужный класс к `<html>`.
 * @author Kort
 * @version 1.0.0
 * @param {React.ReactNode} children - Дочерние компоненты, которые получат доступ к контексту.
 * @usage
 * 1. `src/main.tsx`: Оборачивает все приложение для глобального доступа к теме.
 * 2. `src/App.tsx`: (Избыточно) Также оборачивает приложение.
 * @example
 * <ThemeProvider>
 *   <App />
 * </ThemeProvider>
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Инициализация темы из localStorage с проверкой валидности
  const [currentTheme, setCurrentTheme] = useState<Theme>(() => {
    const storedTheme = localStorage.getItem("theme");
    // Проверяем, что значение соответствует типу Theme
    if (storedTheme === "light" || storedTheme === "dark") {
      return storedTheme;
    }

    // Если нет сохраненной темы или она невалидна, используем системные настройки
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      return "dark";
    }

    return "light";
  });

  // Применяем тему к документу
  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(currentTheme);
    localStorage.setItem("theme", currentTheme);
  }, [currentTheme]);

  // Функция для установки конкретной темы
  const setTheme = useCallback((theme: Theme) => {
    setCurrentTheme(theme);
  }, []);

  // Функция для переключения темы
  const toggleTheme = useCallback(() => {
    setCurrentTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  }, []);

  // Отслеживаем изменения системной темы
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (e: MediaQueryListEvent) => {
      // Обновляем тему только если пользователь не установил её вручную
      if (!localStorage.getItem("theme")) {
        setCurrentTheme(e.matches ? "dark" : "light");
      }
    };

    // Добавляем слушатель изменений
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
    } else {
      // Для старых браузеров
      mediaQuery.addListener(handleChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", handleChange);
      } else {
        // Для старых браузеров
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  return (
    <ThemeContext.Provider
      value={{ theme: currentTheme, toggleTheme, setTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
