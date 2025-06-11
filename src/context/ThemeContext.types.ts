/**
 * Доступные темы приложения
 */
export type Theme = "light" | "dark";

/**
 * Тип контекста темы
 */
export interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}
