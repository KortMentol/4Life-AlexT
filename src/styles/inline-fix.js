// Скрипт для исправления параллакс эффекта
(function() {
  // Функция для применения параллакс эффекта
  function fixParallaxSections() {
    // Находим все параллакс секции
    const parallaxSections = document.querySelectorAll('.parallax-section, [class*="parallax"], section[id*="parallax"], .cta-section, .partnership-section, .products-section');
    
    // Проверяем, мобильное ли устройство
    const isMobile = window.innerWidth < 768 || 
                  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Применяем стили
    parallaxSections.forEach(function(section) {
      if (isMobile) {
        section.style.backgroundAttachment = 'scroll';
      } else {
        section.style.backgroundAttachment = 'fixed';
      }
      
      section.style.backgroundPosition = 'center center';
      section.style.backgroundSize = 'cover';
      section.style.backgroundRepeat = 'no-repeat';
    });
    
    // Специальная обработка для второй секции
    const partnershipSection = document.getElementById('partnership-parallax') || 
                              document.querySelector('.partnership-section') ||
                              document.querySelector('.products-section');
    
    if (partnershipSection) {
      if (isMobile) {
        partnershipSection.style.backgroundAttachment = 'scroll';
      } else {
        partnershipSection.style.backgroundAttachment = 'fixed';
      }
      
      partnershipSection.style.backgroundPosition = 'center center';
      partnershipSection.style.backgroundSize = 'cover';
      partnershipSection.style.minHeight = '600px';
    }
  }
  
  // Запускаем функцию при загрузке страницы
  document.addEventListener('DOMContentLoaded', fixParallaxSections);
  
  // Запускаем функцию при изменении размера окна
  window.addEventListener('resize', fixParallaxSections);
})();