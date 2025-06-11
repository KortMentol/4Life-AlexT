import { useContext } from "react";
import { FluidContext } from "./FluidContext.helpers";

/**
 * Хук для доступа к FluidContext
 * @returns Контекст FluidContext
 * @throws Ошибку, если используется вне FluidProvider
 */
export const useFluid = () => {
  const context = useContext(FluidContext);
  if (!context) {
    throw new Error("useFluid must be used within a FluidProvider");
  }
  return context;
};
