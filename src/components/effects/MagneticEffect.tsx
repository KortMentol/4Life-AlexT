import React from "react";
import { useMagneticEffect } from "@/hooks/useMagneticEffect";

interface MagneticEffectProps {
  children: React.ReactNode;
  strength?: number;
  distance?: number;
  ease?: number;
  className?: string;
}

/**
 * Компонент, создающий магнитный эффект для своих дочерних элементов
 * Элемент притягивается к курсору мыши при приближении
 */
const MagneticEffect: React.FC<MagneticEffectProps> = ({
  children,
  strength = 0.3,
  distance = 100,
  ease = 0.1,
  className = "",
}) => {
  // Используем хук useMagneticEffect для создания эффекта
  const elementRef = useMagneticEffect({
    strength,
    distance,
    ease,
  });

  return (
    <div
      ref={elementRef}
      className={`transition-transform duration-300 ease-out ${className}`}
    >
      {children}
    </div>
  );
};

export default MagneticEffect;
