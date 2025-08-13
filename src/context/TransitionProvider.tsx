// src/context/TransitionProvider.tsx

import React, { createContext, ReactNode, useContext, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { PixelTransition, TransitionHandle } from "../components/transitions/PixelTransition";
import { useFluid } from "../hooks/useFluid";
import { useIsMobile } from "../hooks/useIsMobile";

interface TransitionContextType {
  transitionTo: (path: string) => void;
}

const TransitionContext = createContext<TransitionContextType | null>(null);

export const useTransition = () => {
  const context = useContext(TransitionContext);
  if (!context) {
    throw new Error("useTransition must be used within a TransitionProvider");
  }
  return context;
};

export const TransitionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const overlayRef = useRef<TransitionHandle>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const isMobile = useIsMobile();
  const { resetFluid } = useFluid(); // <-- ПОЛУЧАЕМ ФУНКЦИЮ СБРОСА

  const transitionTo = (path: string) => {
    if (isTransitioning || location.pathname === path) return;
    if (isMobile) {
      navigate(path);
      return;
    }
    setIsTransitioning(true);
    overlayRef.current?.play("in").then(() => {
      navigate(path);
      setTimeout(() => {
        resetFluid(); // Сбрасываем fluid-эффект на черном экране
        overlayRef.current?.play("out").then(() => {
          setIsTransitioning(false);
        });
      }, 150); // Увеличенная и более надежная пауза
    });
  };

  useEffect(() => {
    if (!isMobile) {
      overlayRef.current?.play("out");
    }
  }, [isMobile]);

  return (
    <TransitionContext.Provider value={{ transitionTo }}>
      {children}
      <PixelTransition ref={overlayRef} />
    </TransitionContext.Provider>
  );
};
