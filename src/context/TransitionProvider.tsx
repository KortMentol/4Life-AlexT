import { PixelTransition, TransitionHandle as PixelTransitionHandle } from "@/components/transitions/PixelTransition";
import { WaveTransition, TransitionHandle as WaveTransitionHandle } from "@/components/transitions/WaveTransition";
import { useFeatureFlag, useFluid, useIsMobile, usePerformanceTier } from "@/hooks";
import React, { createContext, ReactNode, startTransition, useContext, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

declare global {
  interface Window {
    __isRoutingLock?: boolean;
    __menuTransitionInProgress?: boolean;
  }
}

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
  const tier = usePerformanceTier();
  const isTransitionsEnabled = useFeatureFlag("premiumTransitions", tier !== "low");

  const transitionTo = (path: string) => {
    if (isTransitioning || location.pathname === path) return;

    // If transitions are disabled, navigate immediately
    if (!isTransitionsEnabled) {
      startTransition(() => {
        navigate(path);
      });
      return;
    }

    setIsTransitioning(true);
    window.__isRoutingLock = true; // <-- LOCK SCROLL SAVING

    // Broadcast transition start — heavy components pause their init to free the Main Thread.
    window.__menuTransitionInProgress = true;
    window.dispatchEvent(new CustomEvent("menu-transition-start"));

    const overlay = isMobile ? waveOverlayRef.current : pixelOverlayRef.current;

    overlay?.play("in").then(() => {
      startTransition(() => {
        navigate(path);
      });

      // Old mobile CPUs (Snapdragon 845) need extra dark-screen time to finish layout/paint.
      const delay = isMobile ? 400 : 250;

      setTimeout(() => {
        resetFluid();
        overlay.play("out").then(() => {
          setIsTransitioning(false);
          window.__isRoutingLock = false; // <-- UNLOCK SCROLL SAVING

          // Wave is done — GPU/CPU is free. Safe to init heavy GSAP/WebGL.
          window.__menuTransitionInProgress = false;
          window.dispatchEvent(new CustomEvent("menu-transition-complete"));
        });
      }, delay);
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
