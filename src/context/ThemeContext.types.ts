/** @description Определяет доступные темы приложения. */
export type Theme = "light" | "dark";

/** @description Определяет структуру данных, предоставляемых `ThemeContext`. */
export interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}
