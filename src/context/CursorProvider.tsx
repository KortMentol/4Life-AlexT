import React, { useCallback, useState } from "react";
import { CursorContext, CursorContextType } from "./CursorContext.helpers";

interface CursorProviderProps {
  children: React.ReactNode;
}

export const CursorProvider: React.FC<CursorProviderProps> = ({ children }) => {
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const setHovering = useCallback((hovering: boolean) => {
    setIsHovering(hovering);
  }, []);

  const setClicking = useCallback((clicking: boolean) => {
    setIsClicking(clicking);
  }, []);

  const updateMousePosition = useCallback((x: number, y: number) => {
    setMousePosition({ x, y });
  }, []);

  const contextValue: CursorContextType = {
    isHovering,
    isClicking,
    mousePosition,
    setHovering,
    setClicking,
    updateMousePosition,
  };

  return (
    <CursorContext.Provider value={contextValue}>
      {children}
    </CursorContext.Provider>
  );
};
