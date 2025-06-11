import { createContext, ReactNode } from "react";
import { FluidInstance } from "../../components/effects/FluidContext.types";

// Тип контекста
export interface FluidContextType {
  multipleSplats: (amount: number) => void;
  setFluidBrightness: (brightness: number) => void;
  fluidInstance: FluidInstance | null;
  setFluidInstance: (instance: FluidInstance | null) => void;
  isMobile: boolean;
}

// Пропсы провайдера
export interface FluidProviderProps {
  children: ReactNode;
}

// Сам контекст
export const FluidContext = createContext<FluidContextType | null>(null);
