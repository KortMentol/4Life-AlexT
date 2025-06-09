import React, { useEffect } from 'react';

// Компонент для исправления параллакс эффекта на всех секциях
const FixParallaxEffect: React.FC = () => {
  useEffect(() => {
    // Функция для применения параллакс эффекта к секции
    const applyParallaxEffect = (selector: string) => {
      const elements = document.querySelectorAll(selector);
      
      elements.forEach(element => {
        const el = element as HTMLElement;
        
        // Сохраняем оригинальные стили
        if (!el.getAttribute('data-original-style')) {
          el.setAttribute('data-original-style', el.getAttribute('style') || '');
        }
        
        // Применяем параллакс эффект
        el.style.backgroundAttachment = 'fixed';
        el.style.backgroundPosition = 'center center';
        el.style.backgroundSize = 'cover';
        el.style.backgroundRepeat = 'no-repeat';
        
        // Добавляем класс для отслеживания
        el.classList.add('parallax-fixed');
      });
    };
    
    // Применяем эффект к нужным секциям
    applyParallaxEffect('.parallax-section, [class*="parallax"], section[id*="parallax"], .cta-section, .partnership-section, .products-section');
    
    // Обработчик изменения размера окна
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      const elements = document.querySelectorAll('.parallax-fixed');
      
      elements.forEach(element => {
        const el = element as HTMLElement;
        
        if (isMobile) {
          el.style.backgroundAttachment = 'scroll';
        } else {
          el.style.backgroundAttachment = 'fixed';
        }
      });
    };
    
    // Вызываем обработчик при монтировании
    handleResize();
    
    // Добавляем слушатель изменения размера окна
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      
      // Восстанавливаем оригинальные стили
      const elements = document.querySelectorAll('.parallax-fixed');
      elements.forEach(element => {
        const el = element as HTMLElement;
        const originalStyle = el.getAttribute('data-original-style');
        
        if (originalStyle) {
          el.setAttribute('style', originalStyle);
        } else {
          el.removeAttribute('style');
        }
        
        el.classList.remove('parallax-fixed');
      });
    };
  }, []);
  
  return null;
};

export default FixParallaxEffect;