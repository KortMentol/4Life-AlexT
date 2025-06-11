import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

import { FluidInstance } from "./FluidContext.types";

interface FluidContextType {
  multipleSplats: (amount: number) => void;
  setFluidBrightness: (brightness: number) => void;
  fluidInstance: FluidInstance | null;
  setFluidInstance: (instance: FluidInstance | null) => void;
  isMobile: boolean;
}

const FluidContext = createContext<FluidContextType | null>(null);

export const useFluid = () => {
  const context = useContext(FluidContext);
  if (!context) {
    throw new Error("useFluid must be used within a FluidProvider");
  }
  return context;
};

interface FluidProviderProps {
  children: ReactNode;
}

export const FluidProvider: React.FC<FluidProviderProps> = ({ children }) => {
  const [fluidInstance, setFluidInstance] = useState<FluidInstance | null>(null);
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

export default FluidContext;
