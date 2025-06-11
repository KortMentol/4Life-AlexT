import { createContext } from "react";
import { FluidContextType, FluidProviderProps } from "./FluidContext.types";

// Создаем контекст с начальным значением null
export const FluidContext = createContext<FluidContextType | null>(null);

export type { FluidProviderProps };
