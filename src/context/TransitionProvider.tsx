import React, { createContext, ReactNode, useContext, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { PixelTransition, TransitionHandle as PixelTransitionHandle } from "../components/transitions/PixelTransition";
import { WaveTransition, TransitionHandle as WaveTransitionHandle } from "../components/transitions/WaveTransition";
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
  const pixelOverlayRef = useRef<PixelTransitionHandle>(null);
  const waveOverlayRef = useRef<WaveTransitionHandle>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { resetFluid } = useFluid();
  const isMobile = useIsMobile();

  const transitionTo = (path: string) => {
    if (isTransitioning || location.pathname === path) return;
    setIsTransitioning(true);

    const overlay = isMobile ? waveOverlayRef.current : pixelOverlayRef.current;

    overlay?.play("in").then(() => {
      navigate(path);
      // Небольшая задержка, чтобы React успел начать рендеринг новой страницы "под капотом"
      setTimeout(() => {
        resetFluid(); // Сбрасываем fluid-эффект на черном экране
        overlay.play("out").then(() => {
          setIsTransitioning(false);
        });
      }, 150);
    });
  };

  useEffect(() => {
    // Анимация появления при первой загрузке сайта
    const overlay = isMobile ? waveOverlayRef.current : pixelOverlayRef.current;
    overlay?.play("out");
  }, [isMobile]); // Запускаем при смене типа устройства (редко, но надежно)

  return (
    <TransitionContext.Provider value={{ transitionTo }}>
      {children}
      {/* Оба компонента всегда в DOM, но используется только один. Они ничего не весят в простое. */}
      <PixelTransition ref={pixelOverlayRef} />
      <WaveTransition ref={waveOverlayRef} />
    </TransitionContext.Provider>
  );
};
