import React, { useEffect, useRef } from 'react';
import { useFluid } from './FluidContext';

interface FluidSplashEffectProps {
  children: React.ReactNode;
  splashAmount?: number;
  triggerOnScroll?: boolean;
  triggerOnHover?: boolean;
  className?: string;
}

const FluidSplashEffect: React.FC<FluidSplashEffectProps> = ({
  children,
  splashAmount = 5,
  triggerOnScroll = true,
  triggerOnHover = true,
  className = '',
}) => {
  const { multipleSplats } = useFluid();
  const elementRef = useRef<HTMLDivElement>(null);
  const hasTriggeredRef = useRef(false);
  
  // Эффект для создания всплесков при прокрутке
  useEffect(() => {
    if (!triggerOnScroll) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasTriggeredRef.current) {
            multipleSplats(splashAmount);
            hasTriggeredRef.current = true;
            
            // Сбрасываем флаг через некоторое время, чтобы эффект мог сработать снова
            setTimeout(() => {
              hasTriggeredRef.current = false;
            }, 3000);
          }
        });
      },
      { threshold: 0.3 }
    );
    
    if (elementRef.current) {
      observer.observe(elementRef.current);
    }
    
    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [multipleSplats, splashAmount, triggerOnScroll]);
  
  // Обработчики событий для создания всплесков при наведении
  const handleMouseEnter = () => {
    if (triggerOnHover) {
      multipleSplats(Math.floor(splashAmount / 2) + 1);
    }
  };
  
  const handleMouseLeave = () => {
    if (triggerOnHover) {
      multipleSplats(Math.floor(splashAmount / 3));
    }
  };
  
  return (
    <div 
      ref={elementRef} 
      className={className}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
};

export default FluidSplashEffect;