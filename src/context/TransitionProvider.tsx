import { WaveTransition, TransitionHandle as WaveTransitionHandle } from "@/components/transitions/WaveTransition";
import { useFluid } from "@/hooks";
import React, { createContext, ReactNode, startTransition, useContext, useRef, useState } from "react";
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
  const waveOverlayRef = useRef<WaveTransitionHandle>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const { resetFluid } = useFluid();

  const transitionTo = (path: string) => {
    if (isTransitioning || location.pathname === path) return;

    setIsTransitioning(true);
    window.__isRoutingLock = true;
    window.__menuTransitionInProgress = true;
    window.dispatchEvent(new CustomEvent("menu-transition-start"));

    const overlay = waveOverlayRef.current;

    overlay?.play("in").then(() => {
      startTransition(() => navigate(path));

      setTimeout(() => {
        resetFluid();

        const playOutPromise = overlay.play("out");

        setIsTransitioning(false);
        window.__isRoutingLock = false;
        window.__menuTransitionInProgress = false;
        window.dispatchEvent(new CustomEvent("menu-transition-complete"));

        playOutPromise.then(() => {
          // Wave fully exited
        });
      }, 350);
    });
  };

  return (
    <TransitionContext.Provider value={{ transitionTo }}>
      {children}
      <WaveTransition ref={waveOverlayRef} />
    </TransitionContext.Provider>
  );
};
