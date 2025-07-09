import { createContext } from "react";
import { FluidContextType, FluidProviderProps } from "./FluidContext.types";

/**
 * @description Контекст для управления WebGL-эффектом жидкости (fluid).
 * Предоставляет дочерним компонентам доступ к инстансу эффекта и функциям для взаимодействия с ним.
 */
export const FluidContext = createContext<FluidContextType | null>(null);

export type { FluidContextType, FluidProviderProps };
