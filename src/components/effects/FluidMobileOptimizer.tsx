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
          dyeResolution: 768, // Оптимизировано для мобильных
          simResolution: 96, // Оптимизировано для мобильных
          bloomIterations: 6, // Оптимизировано для мобильных
          sunraysResolution: 128, // Оптимизировано для мобильных
          densityDissipation: 0.98,
          velocityDissipation: 0.99,
          pressure: 0.8,
          pressureIterations: 16, // Оптимизировано для мобильных
          curl: 30,
          splatRadius: 0.25,
          splatForce: 6000,
          brightness: 0.7,
          bloomIntensity: 0.4,
          bloomThreshold: 0.8,
          bloomSoftKnee: 0.7,
          sunraysWeight: 0.6,
          hover: true,
          colorful: true,
        });
        
        // Добавляем класс для мобильной оптимизации
        document.body.classList.add('fluid-mobile-optimize');
        
        // Делаем все фоны прозрачными на мобильных устройствах
        makeAllBackgroundsTransparent();
        
        // Не создаем начальных всплесков на мобильных устройствах
      } else if (fluidInstance) {
        // Возвращаем стандартные настройки для десктопа
        fluidInstance.setConfig({
          dyeResolution: 1024,
          simResolution: 128,
          bloomIterations: 8,
          sunraysResolution: 196,
          densityDissipation: 1,
          velocityDissipation: 0.2,
          pressure: 0.8,
          curl: 30,
          splatRadius: 0.15,
          splatForce: 4000,
          brightness: 0.7,
          bloomIntensity: 0.4,
          sunraysWeight: 0.6,
        });
        
        document.body.classList.remove('fluid-mobile-optimize');
        restoreBackgrounds();
      }
    };
    
    // Функция для применения стилей на мобильных устройствах
    const makeAllBackgroundsTransparent = () => {
      // Добавляем стиль для всех секций
      const style = document.createElement('style');
      style.id = 'fluid-mobile-styles';
      style.textContent = `
        @media (max-width: 767px) {
          /* Основные секции делаем полупрозрачными как на ПК */
          section:not(.parallax-section):not([class*="parallax"]),
          div[class*="bg-"]:not(.hamburger-menu):not(.theme-toggle):not(.mobile-menu) {
            background: rgba(255, 255, 255, 0.7) !important;
            backdrop-filter: blur(5px) !important;
            -webkit-backdrop-filter: blur(5px) !important;
          }
          
          .dark section:not(.parallax-section):not([class*="parallax"]),
          .dark div[class*="bg-"]:not(.hamburger-menu):not(.theme-toggle):not(.mobile-menu) {
            background: rgba(26, 26, 26, 0.7) !important;
            backdrop-filter: blur(5px) !important;
            -webkit-backdrop-filter: blur(5px) !important;
          }
          
          /* Параллакс секции оставляем непрозрачными */
          .parallax-section, [class*="parallax"] {
            background-attachment: scroll !important;
            background-position: center top !important;
            background-size: 100% auto !important;
            background-repeat: no-repeat !important;
            position: relative !important;
            z-index: 10 !important;
          }
          
          /* Карточки делаем точно как на ПК */
          .feature-item, .feature-card {
            background: #ffffff !important;
            border-radius: 10px !important;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1) !important;
            border: none !important;
            overflow: hidden !important;
          }
          
          .dark .feature-item, .dark .feature-card {
            background: #2a2a2a !important;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3) !important;
          }
          
          /* Иконки в карточках */
          .feature-item .feature-icon, .feature-card .feature-icon {
            background: var(--icon-bg, #e6f2ff) !important;
            color: var(--icon-color, #3b82f6) !important;
          }
          
          /* Увеличиваем размер иконки щита с галочкой */
          .disclaimer-icon, 
          .shield-icon, 
          [class*="disclaimer"] svg, 
          [class*="disclaimer"] img,
          [class*="shield"] svg,
          [class*="shield"] img {
            width: 32px !important;
            height: 32px !important;
            min-width: 32px !important;
            min-height: 32px !important;
            font-size: 32px !important;
          }
          
          /* Сохраняем текст видимым */
          section *, div[class*="bg-"] * {
            position: relative;
            z-index: 2;
          }
          
          /* Увеличиваем контрастность текста */
          .dark\\:text-gray-200 {
            color: rgba(255, 255, 255, 0.95) !important;
          }
          
          .text-gray-800 {
            color: rgba(30, 30, 30, 0.95) !important;
          }
          
          /* Сохраняем стили кнопок точно как на ПК */
          .btn-modern,
          .btn-primary-modern,
          a.btn {
            background: var(--primary-gradient, linear-gradient(135deg, #3b82f6, #6366f1)) !important;
            color: white !important;
            opacity: 1 !important;
            border-radius: 8px !important;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1) !important;
          }
          
          /* Стеклянные кнопки */
          .glass-btn,
          .glass-effect,
          [class*="glassmorphism"],
          a[class*="glass"] {
            background: rgba(255, 255, 255, 0.2) !important;
            backdrop-filter: blur(10px) !important;
            -webkit-backdrop-filter: blur(10px) !important;
            border: 1px solid rgba(255, 255, 255, 0.3) !important;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1) !important;
            color: white !important;
          }
          
          /* Исправляем гамбургер меню */
          .hamburger-menu,
          .theme-toggle {
            background: transparent !important;
            backdrop-filter: none !important;
            -webkit-backdrop-filter: none !important;
            box-shadow: none !important;
            border: none !important;
          }
          
          /* Мобильное меню */
          .mobile-menu {
            background: rgba(255, 255, 255, 0.95) !important;
            backdrop-filter: blur(10px) !important;
            -webkit-backdrop-filter: blur(10px) !important;
          }
          
          .dark .mobile-menu {
            background: rgba(30, 30, 30, 0.95) !important;
          }
          
          /* Специальные стили для второй параллакс секции */
          #partnership-parallax, .partnership-section {
            background-position: center top !important;
            background-size: 100% auto !important;
            background-repeat: no-repeat !important;
            overflow: hidden !important;
            min-height: 600px !important;
          }
          
          #partnership-parallax img, .partnership-section img {
            width: 100% !important;
            height: auto !important;
            object-fit: cover !important;
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            z-index: -1 !important;
          }
        }
      `;
      document.head.appendChild(style);
      
      // Сохраняем оригинальные стили, но не меняем их напрямую для кнопок и карточек
      document.querySelectorAll('section, div[class*="bg-"], div[class*="from-"], div[class*="to-"]').forEach(el => {
        // Проверяем, не является ли элемент кнопкой, карточкой или контейнером кнопки
        const isButton = el.tagName === 'BUTTON' || 
                         el.classList.contains('btn-modern') || 
                         el.classList.contains('btn-primary-modern') ||
                         el.classList.contains('glass-btn') ||
                         el.classList.contains('glass-effect') ||
                         el.classList.toString().includes('glassmorphism');
                         
        const isCard = el.classList.contains('card-modern') ||
                       el.classList.toString().includes('card') ||
                       el.classList.toString().includes('shadow');
        
        // Сохраняем оригинальные стили только для обычных элементов
        if (!el.getAttribute('data-original-style') && !isButton && !isCard) {
          el.setAttribute('data-original-style', el.getAttribute('style') || '');
          el.setAttribute('data-original-class', el.className);
        }
      });
      
      // Исправляем параллакс на мобильных устройствах
      document.querySelectorAll('.parallax-section').forEach(el => {
        el.classList.add('mobile-fixed-bg');
      });
    };
    
    // Функция для восстановления оригинальных фонов
    const restoreBackgrounds = () => {
      const styleElement = document.getElementById('fluid-mobile-styles');
      if (styleElement) {
        styleElement.remove();
      }
      
      document.querySelectorAll('[data-original-style]').forEach(el => {
        const originalStyle = el.getAttribute('data-original-style');
        const originalClass = el.getAttribute('data-original-class');
        
        if (originalStyle) {
          el.setAttribute('style', originalStyle);
        } else {
          el.removeAttribute('style');
        }
        
        if (originalClass) {
          el.className = originalClass;
        }
        
        el.removeAttribute('data-original-style');
        el.removeAttribute('data-original-class');
      });
    };
    
    // Проверяем при монтировании компонента
    checkMobile();
    
    // Добавляем слушатель изменения размера окна
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      document.body.classList.remove('fluid-mobile-optimize');
      restoreBackgrounds();
    };
  }, [fluidInstance, setFluidBrightness]);
  
  // Компонент не рендерит никакого UI
  return null;
};

export default FluidMobileOptimizer;