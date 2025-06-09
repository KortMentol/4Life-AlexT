import React, { useEffect } from 'react';
import { useFluid } from './FluidContext';

// Компонент для оптимизации эффекта fluid на мобильных устройствах
const FluidMobileOptimizer: React.FC = () => {
  const { fluidInstance, setFluidBrightness } = useFluid();
  
  useEffect(() => {
    // Определяем, является ли устройство мобильным
    const checkMobile = () => {
      const isMobile = window.innerWidth < 768 || 
                    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      // Применяем оптимизированные настройки для мобильных устройств
      if (fluidInstance && isMobile) {
        fluidInstance.setConfig({
          dyeResolution: 512,
          simResolution: 64,
          bloomIterations: 4,
          sunraysResolution: 128,
          densityDissipation: 2,
          velocityDissipation: 0.6,
        });
        
        // Добавляем класс для мобильной оптимизации
        document.body.classList.add('fluid-mobile-optimize');
      } else if (fluidInstance) {
        // Возвращаем стандартные настройки для десктопа
        fluidInstance.setConfig({
          dyeResolution: 1024,
          simResolution: 128,
          bloomIterations: 8,
          sunraysResolution: 196,
          densityDissipation: 3,
          velocityDissipation: 0.5,
        });
        
        document.body.classList.remove('fluid-mobile-optimize');
      }
    };
    
    // Проверяем при монтировании компонента
    checkMobile();
    
    // Добавляем слушатель изменения размера окна
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      document.body.classList.remove('fluid-mobile-optimize');
    };
  }, [fluidInstance, setFluidBrightness]);
  
  // Компонент не рендерит никакого UI
  return null;
};

export default FluidMobileOptimizer;