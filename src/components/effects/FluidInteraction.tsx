import React, { useEffect, useRef } from 'react';
import { useFluid } from './FluidContext';

interface FluidInteractionProps {
  children: React.ReactNode;
  lowerBrightness?: boolean;
  brightnessValue?: number;
  defaultBrightness?: number;
  className?: string;
}

const FluidInteraction: React.FC<FluidInteractionProps> = ({
  children,
  lowerBrightness = true,
  brightnessValue = 0.2,
  defaultBrightness = 0.4,
  className = '',
}) => {
  const { setFluidBrightness } = useFluid();
  const elementRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!elementRef.current || !lowerBrightness) return;
    
    let hoverTimer: ReturnType<typeof setTimeout> | null = null;
    let isHovered = false;
    
    function resetHoverTimer() {
      if (hoverTimer) {
        clearTimeout(hoverTimer);
      }
      
      hoverTimer = setTimeout(() => {
        if (!isHovered) {
          setFluidBrightness(defaultBrightness);
        }
      }, 1000);
    }
    
    function handleMouseEnter() {
      isHovered = true;
      setFluidBrightness(brightnessValue);
      resetHoverTimer();
    }
    
    function handleMouseLeave() {
      isHovered = false;
      resetHoverTimer();
    }
    
    elementRef.current.addEventListener('mouseenter', handleMouseEnter);
    elementRef.current.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      if (elementRef.current) {
        elementRef.current.removeEventListener('mouseenter', handleMouseEnter);
        elementRef.current.removeEventListener('mouseleave', handleMouseLeave);
      }
      
      if (hoverTimer) {
        clearTimeout(hoverTimer);
        hoverTimer = null;
      }
    };
  }, [lowerBrightness, brightnessValue, defaultBrightness, setFluidBrightness]);
  
  return (
    <div ref={elementRef} className={className}>
      {children}
    </div>
  );
};

export default FluidInteraction;