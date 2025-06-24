import { createContext } from "react";
import { FluidContextType, FluidProviderProps } from "./FluidContext.types";

// Сам контекст
export const FluidContext = createContext<FluidContextType | null>(null);

export type { FluidContextType, FluidProviderProps };
