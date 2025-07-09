import React, { useState, useEffect } from "react";
import { FluidInstance } from "./FluidContext.types";
import { FluidContext, FluidProviderProps } from "./FluidContext.helpers";

/**
 * @module src/context/FluidProvider.tsx
 * @description Провайдер контекста для управления WebGL-эффектом жидкости. Он инициализирует инстанс эффекта, определяет, является ли устройство мобильным, и предоставляет дочерним компонентам функции для взаимодействия с анимацией (например, `multipleSplats`, `setFluidBrightness`).
 * @author Kort
 * @version 1.0.0
 * @param {React.ReactNode} children - Дочерние компоненты, которые получат доступ к контексту.
 * @see FluidEffect - Компонент, который непосредственно рендерит и использует инстанс эффекта.
 * @usage
 * 1. `src/components/layout/Layout.tsx`: Оборачивает `FluidEffect`, чтобы связать его с контекстом.
 * 2. `src/App.tsx`: Используется для предоставления контекста на определенных страницах (возможно, избыточно).
 * @example
 * <FluidProvider>
 *   <MyApp />
 * </FluidProvider>
 */
export const FluidProvider: React.FC<FluidProviderProps> = ({ children }) => {
  const [fluidInstance, setFluidInstance] = useState<FluidInstance | null>(
    null,
  );
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // Определяем, является ли устройство мобильным
  useEffect(() => {
    const checkMobile = () => {
      const mobile =
        window.innerWidth < 768 ||
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent,
        );
      setIsMobile(mobile);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  const multipleSplats = (amount: number) => {
    if (fluidInstance && typeof fluidInstance.multipleSplats === "function") {
      fluidInstance.multipleSplats(amount);
    }
  };

  const setFluidBrightness = (brightness: number) => {
    if (fluidInstance && typeof fluidInstance.setConfig === "function") {
      fluidInstance.setConfig({ brightness });
    }
  };

  return (
    <FluidContext.Provider
      value={{
        multipleSplats,
        setFluidBrightness,
        fluidInstance,
        setFluidInstance,
        isMobile,
      }}
    >
      {children}
    </FluidContext.Provider>
  );
};
