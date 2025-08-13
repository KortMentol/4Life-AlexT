import React, { createContext, ReactNode, useContext, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { PixelTransition, TransitionHandle } from "../components/transitions/PixelTransition";
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
  const isMobile = useIsMobile(); // <-- Определяем тип устройства

  const transitionTo = (path: string) => {
    // Не запускаем переход, если он уже идет или мы пытаемся перейти на ту же страницу
    if (isTransitioning || location.pathname === path) return;

    // <-- Ключевое изменение: если это мобильное устройство, просто переходим по ссылке
    if (isMobile) {
      navigate(path);
      return;
    }

    // Логика для десктопа
    setIsTransitioning(true);
    // 1. Анимация "входа" (экран закрывается)
    overlayRef.current?.play("in").then(() => {
      // 2. В момент, когда экран черный, меняем страницу
      navigate(path);
      // 3. Небольшая задержка, чтобы React успел отрендерить новую страницу
      setTimeout(() => {
        // 4. Анимация "выхода" (экран открывается, показывая новый контент)
        overlayRef.current?.play("out").then(() => {
          setIsTransitioning(false);
        });
      }, 50); // 50ms достаточно
    });
  };

  // При первой загрузке сайта плавно убираем оверлей (только на десктопе)
  useEffect(() => {
    if (!isMobile) {
      overlayRef.current?.play("out");
    }
  }, [isMobile]);

  return (
    <TransitionContext.Provider value={{ transitionTo }}>
      {children}
      {/* Компонент перехода рендерится всегда, но используется только на десктопе */}
      <PixelTransition ref={overlayRef} />
    </TransitionContext.Provider>
  );
};
