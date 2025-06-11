import React from "react";

export interface FluidInstance {
  multipleSplats?: (amount: number) => void;
  setConfig?: (config: Record<string, unknown>) => void;
  [key: string]: unknown;
}

export interface FluidContextType {
  multipleSplats: (amount: number) => void;
  setFluidBrightness: (brightness: number) => void;
  fluidInstance: FluidInstance | null;
  setFluidInstance: React.Dispatch<React.SetStateAction<FluidInstance | null>>;
  isMobile: boolean;
}

export interface FluidProviderProps {
  children: React.ReactNode;
}
