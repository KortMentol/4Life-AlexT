import React, { useEffect } from 'react';

// Компонент для исправления параллакс секций на мобильных устройствах
const FixParallaxMobile: React.FC = () => {
  useEffect(() => {
    // Определяем, является ли устройство мобильным
    const isMobile = window.innerWidth < 768 || 
                  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
      // Находим все секции с параллаксом
      const parallaxSections = document.querySelectorAll('.parallax-section, [class*="parallax"]');
      
      // Исправляем стили для мобильных устройств
      parallaxSections.forEach(section => {
        // Сохраняем оригинальные стили
        if (!section.getAttribute('data-original-parallax-style')) {
          section.setAttribute('data-original-parallax-style', section.getAttribute('style') || '');
          section.setAttribute('data-original-parallax-class', section.className);
        }
        
        // Применяем фиксированные стили для мобильных
        const sectionElement = section as HTMLElement;
        sectionElement.style.backgroundAttachment = 'scroll';
        sectionElement.style.backgroundPosition = 'center top';
        sectionElement.style.backgroundSize = '100% auto';
        sectionElement.style.backgroundRepeat = 'no-repeat';
        sectionElement.style.position = 'relative';
        sectionElement.style.zIndex = '10';
        
        // Добавляем класс для отключения fluid эффекта на параллакс секциях
        section.classList.add('no-fluid-effect');
      });
      
      // Исправляем все параллакс секции одинаково
      const fixParallaxSection = (sectionId: string) => {
        const section = document.getElementById(sectionId);
        if (!section) return;
        
        const sectionElement = section as HTMLElement;
        sectionElement.style.backgroundAttachment = 'fixed';
        sectionElement.style.backgroundPosition = 'center center';
        sectionElement.style.backgroundSize = 'cover';
        sectionElement.style.backgroundRepeat = 'no-repeat';
        sectionElement.style.position = 'relative';
        sectionElement.style.zIndex = '10';
        sectionElement.style.minHeight = '600px';
      };
      
      // Применяем одинаковые стили ко всем параллакс секциям
      fixParallaxSection('partnership-parallax');
      
      // Добавляем стили для блокировки fluid эффекта на параллакс секциях
      const style = document.createElement('style');
      style.id = 'parallax-fix-styles';
      style.textContent = `
        @media (max-width: 767px) {
          .parallax-section, [class*="parallax"] {
            background-attachment: scroll !important;
            background-position: center center !important;
            background-size: cover !important;
            background-repeat: no-repeat !important;
            position: relative !important;
            z-index: 10 !important;
          }
          
          /* Все параллакс секции делаем одинаковыми */
          #partnership-parallax, .partnership-section {
            background-attachment: scroll !important;
            background-position: center center !important;
            background-size: cover !important;
            background-repeat: no-repeat !important;
            position: relative !important;
            z-index: 10 !important;
            min-height: 600px !important;
          }
          
          /* Стили для карточек внутри параллакс секций */
          .parallax-section .card, 
          .parallax-section .feature-card,
          .parallax-section .feature-item,
          [class*="parallax"] .card,
          [class*="parallax"] .feature-card,
          [class*="parallax"] .feature-item {
            background: #ffffff !important;
            border-radius: 10px !important;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1) !important;
            border: none !important;
            overflow: hidden !important;
          }
          
          .dark .parallax-section .card,
          .dark .parallax-section .feature-card,
          .dark .parallax-section .feature-item,
          .dark [class*="parallax"] .card,
          .dark [class*="parallax"] .feature-card,
          .dark [class*="parallax"] .feature-item {
            background: #2a2a2a !important;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3) !important;
          }
          
          /* Иконки в карточках */
          .feature-item .feature-icon, .feature-card .feature-icon {
            background: var(--icon-bg, #e6f2ff) !important;
            color: var(--icon-color, #3b82f6) !important;
          }
        }
        
        /* Исправление для десктопа */
        @media (min-width: 768px) {
          .parallax-section, [class*="parallax"] {
            background-attachment: fixed !important;
            background-position: center center !important;
            background-size: cover !important;
          }
          
          #partnership-parallax, .partnership-section {
            background-attachment: fixed !important;
            background-position: center center !important;
            background-size: cover !important;
          }
        }
      `;
      document.head.appendChild(style);
      
      // Обработчик изменения размера окна
      const handleResize = () => {
        const isStillMobile = window.innerWidth < 768;
        
        if (!isStillMobile) {
          // Восстанавливаем оригинальные стили при переходе на десктоп
          parallaxSections.forEach(section => {
            const originalStyle = section.getAttribute('data-original-parallax-style');
            const originalClass = section.getAttribute('data-original-parallax-class');
            
            if (originalStyle) {
              section.setAttribute('style', originalStyle);
            }
            
            if (originalClass) {
              section.className = originalClass;
            }
            
            section.classList.remove('no-fluid-effect');
          });
          
          // Удаляем стили
          const styleElement = document.getElementById('parallax-fix-styles');
          if (styleElement) {
            styleElement.remove();
          }
        }
      };
      
      window.addEventListener('resize', handleResize);
      
      return () => {
        window.removeEventListener('resize', handleResize);
        
        // Восстанавливаем оригинальные стили при размонтировании
        parallaxSections.forEach(section => {
          const originalStyle = section.getAttribute('data-original-parallax-style');
          const originalClass = section.getAttribute('data-original-parallax-class');
          
          if (originalStyle) {
            section.setAttribute('style', originalStyle);
          }
          
          if (originalClass) {
            section.className = originalClass;
          }
          
          section.classList.remove('no-fluid-effect');
        });
        
        // Удаляем стили
        const styleElement = document.getElementById('parallax-fix-styles');
        if (styleElement) {
          styleElement.remove();
        }
      };
    }
    
    return () => {};
  }, []);
  
  return null;
};

export default FixParallaxMobile;