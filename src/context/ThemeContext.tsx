import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';

/**
 * Доступные темы приложения
 */
export type Theme = 'light' | 'dark';

/**
 * Интерфейс контекста темы
 */
interface ThemeContextType {
  /** Текущая тема */
  theme: Theme;
  /** Функция для переключения темы */
  toggleTheme: () => void;
  /** Функция для установки конкретной темы */
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * Провайдер темы для приложения
 */
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Инициализация темы из localStorage с проверкой валидности
  const [currentTheme, setCurrentTheme] = useState<Theme>(() => {
    const storedTheme = localStorage.getItem('theme');
    // Проверяем, что значение соответствует типу Theme
    if (storedTheme === 'light' || storedTheme === 'dark') {
      return storedTheme;
    }
    
    // Если нет сохраненной темы или она невалидна, используем системные настройки
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    
    return 'light';
  });

  // Применяем тему к документу
  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(currentTheme);
    localStorage.setItem('theme', currentTheme);
  }, [currentTheme]);

  // Функция для установки конкретной темы
  const setTheme = useCallback((theme: Theme) => {
    setCurrentTheme(theme);
  }, []);

  // Функция для переключения темы
  const toggleTheme = useCallback(() => {
    setCurrentTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  }, []);

  // Отслеживаем изменения системной темы
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      // Обновляем тему только если пользователь не установил её вручную
      if (!localStorage.getItem('theme')) {
        setCurrentTheme(e.matches ? 'dark' : 'light');
      }
    };
    
    // Добавляем слушатель изменений
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      // Для старых браузеров
      mediaQuery.addListener(handleChange);
    }
    
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        // Для старых браузеров
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  return (
    <ThemeContext.Provider value={{ theme: currentTheme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Хук для доступа к контексту темы
 * @returns Объект с текущей темой и функциями для её изменения
 * @throws Ошибку, если используется вне ThemeProvider
 */
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
