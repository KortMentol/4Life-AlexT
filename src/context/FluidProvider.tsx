import React, { useState, useEffect } from "react";
import { FluidInstance } from "./FluidContext.types";
import { FluidContext, FluidProviderProps } from "./FluidContext.helpers";

/**
 * Провайдер FluidContext
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
