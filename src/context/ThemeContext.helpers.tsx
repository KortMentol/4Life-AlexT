import { createContext } from "react";
import { ThemeContextType } from "./ThemeContext.types";

export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined,
);

export interface ThemeProviderProps {
  children: React.ReactNode;
}
