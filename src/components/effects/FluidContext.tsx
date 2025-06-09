import React, { createContext, useContext, useState, ReactNode } from 'react';

interface FluidContextType {
  multipleSplats: (amount: number) => void;
  setFluidBrightness: (brightness: number) => void;
  fluidInstance: any | null;
  setFluidInstance: (instance: any) => void;
}

const FluidContext = createContext<FluidContextType | null>(null);

export const useFluid = () => {
  const context = useContext(FluidContext);
  if (!context) {
    throw new Error('useFluid must be used within a FluidProvider');
  }
  return context;
};

interface FluidProviderProps {
  children: ReactNode;
}

export const FluidProvider: React.FC<FluidProviderProps> = ({ children }) => {
  const [fluidInstance, setFluidInstance] = useState<any | null>(null);

  const multipleSplats = (amount: number) => {
    if (fluidInstance) {
      fluidInstance.multipleSplats(amount);
    }
  };

  const setFluidBrightness = (brightness: number) => {
    if (fluidInstance) {
      fluidInstance.setConfig({
        brightness,
      });
    }
  };

  return (
    <FluidContext.Provider
      value={{
        multipleSplats,
        setFluidBrightness,
        fluidInstance,
        setFluidInstance,
      }}
    >
      {children}
    </FluidContext.Provider>
  );
};

export default FluidContext;