export type Theme = "light" | "dark";

export interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

export const useTheme = (): ThemeContextType => {
  return {
    theme: "dark" as const,
    toggleTheme: () => {},
    setTheme: () => {},
  };
};