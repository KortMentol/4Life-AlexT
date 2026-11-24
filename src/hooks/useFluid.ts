import { useContext } from "react";
import { FluidContext } from "@/context/FluidContext.helpers";

export const useFluid = () => {
  const context = useContext(FluidContext);
  if (!context) {
    throw new Error("useFluid must be used within a FluidProvider");
  }
  return context;
};
