import React from "react";

/**
 * @description Описывает инстанс WebGL-эффекта, предоставляя методы для управления им.
 */
export interface FluidInstance {
  multipleSplats?: (amount: number) => void;
  setConfig?: (config: Record<string, unknown>) => void;
  [key: string]: unknown;
}

/**
 * @description Определяет структуру данных, предоставляемых `FluidContext`.
 */
export interface FluidContextType {
  multipleSplats: (amount: number) => void;
  setFluidBrightness: (brightness: number) => void;
  fluidInstance: FluidInstance | null;
  setFluidInstance: React.Dispatch<React.SetStateAction<FluidInstance | null>>;
  isMobile: boolean;
}

/**
 * @description Определяет пропсы для компонента `FluidProvider`.
 */
export interface FluidProviderProps {
  children: React.ReactNode;
}
