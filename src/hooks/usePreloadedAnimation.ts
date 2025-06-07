import { useState, useEffect } from 'react';

// Хук для предотвращения моргания анимаций при первой загрузке
export const usePreloadedAnimation = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    // Устанавливаем флаг загрузки после монтирования компонента
    setIsLoaded(true);
    
    // Добавляем класс к body для предотвращения моргания
    document.body.classList.add('animations-ready');
    
    return () => {
      document.body.classList.remove('animations-ready');
    };
  }, []);
  
  // Возвращаем объекты с вариантами анимаций
  return {
    isLoaded,
    // Варианты для элементов, которые должны быть видны сразу
    preloadedVariants: {
      visible: { opacity: 1, y: 0 }
    },
    // Варианты для элементов, которые должны появляться с анимацией
    fadeInVariants: {
      hidden: { opacity: 0, y: 20 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: "easeOut" }
      }
    },
    // Классы для предотвращения моргания
    preloadClass: isLoaded ? '' : 'no-flicker'
  };
};

export default usePreloadedAnimation;