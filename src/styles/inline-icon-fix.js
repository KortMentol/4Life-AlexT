// Исправление позиционирования иконок
(function() {
  function fixIcons() {
    // Элемент "Научно доказанная эффективность с 1998 года"
    const scientificElements = document.querySelectorAll('.mt-10.md\\:mt-12.flex.items-start.justify-center.text-white\\/70');
    scientificElements.forEach(function(el) {
      el.style.display = 'inline-flex';
      el.style.alignItems = 'center';
      
      const icon = el.querySelector('.text-blue-300');
      if (icon) {
        icon.style.flexShrink = '0';
        icon.style.marginTop = '0';
        icon.style.marginRight = '0.5rem';
        icon.style.position = 'relative';
        icon.style.top = '-1px';
      }
    });

    // Элемент "Продукция 4Life не заменяет медикаментозное лечение"
    const disclaimerElements = document.querySelectorAll('.inline-flex.items-center.gap-2.px-4.py-2.rounded-full');
    disclaimerElements.forEach(function(el) {
      const icon = el.querySelector('.text-blue-300');
      if (icon) {
        // Фиксируем размер иконки
        icon.style.width = '16px';
        icon.style.height = '16px';
        icon.style.minWidth = '16px';
        icon.style.minHeight = '16px';
        icon.style.flexShrink = '0';
      }
    });
  }

  // Запускаем функцию сразу
  fixIcons();
  
  // Запускаем функцию при загрузке DOM
  document.addEventListener('DOMContentLoaded', fixIcons);
  
  // Запускаем функцию при изменении размера окна
  window.addEventListener('resize', fixIcons);
  
  // Запускаем функцию через небольшую задержку для гарантии
  setTimeout(fixIcons, 500);
}());