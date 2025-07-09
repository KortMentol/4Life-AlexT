import { createContext } from "react";
import { ThemeContextType } from "./ThemeContext.types";

/** @description Контекст для управления темой приложения (светлая/темная). */
export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined,
);

export interface ThemeProviderProps {
  children: React.ReactNode;
}
