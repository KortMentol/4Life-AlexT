import { useContext } from "react";
import { FluidContext } from "@/context/FluidContext.helpers";

/**
 * @module src/hooks/useFluid.ts
 * @description Хук для получения доступа к контексту `FluidContext`. Предоставляет простой способ для дочерних компонентов получить доступ к функциям управления WebGL-эффектом жидкости.
 * @author Kort
 * @version 1.0.0
 * @returns {FluidContextType} Объект контекста, содержащий инстанс эффекта и функции для взаимодействия с ним.
 * @throws {Error} Выбрасывает ошибку, если хук используется вне `FluidProvider`.
 * @see FluidProvider - Провайдер, который необходимо использовать выше по дереву компонентов.
 * @usage
 * 1. `src/components/effects/FluidEffect.tsx`: Используется для получения функции `setFluidInstance` и передачи инстанса эффекта в контекст.
 * @example
 * const { setFluidBrightness } = useFluid();
 * 
 * const handleButtonClick = () => {
 *   setFluidBrightness(0.8);
 * };
 */
export const useFluid = () => {
  const context = useContext(FluidContext);
  if (!context) {
    throw new Error("useFluid must be used within a FluidProvider");
  }
  return context;
};
