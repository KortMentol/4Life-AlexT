// Тип для темы
export type Theme = "light" | "dark";

// Интерфейс контекста темы
export interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}
