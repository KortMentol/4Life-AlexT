// Исправление позиционирования иконок
(function () {
  // Функция для немедленного применения стилей до загрузки DOM
  function applyEarlyFix() {
    // Создаем стили, которые будут применены немедленно
    const styleEl = document.createElement("style");
    styleEl.textContent = `
      .mt-10.md\\:mt-12.flex.items-start.justify-center.text-white\\/70 {
        display: flex !important;
        align-items: baseline !important;
      }
      .mt-10.md\\:mt-12.flex.items-start.justify-center.text-white\\/70 .text-blue-300 {
        position: relative !important;
        top: 0.25em !important;
        flex-shrink: 0 !important;
        margin-right: 12px !important;
        width: 24px !important;
        height: 24px !important;
        min-width: 24px !important;
        min-height: 24px !important;
      }
      
      /* Специальные стили для иконки в элементе "Продукция 4Life не заменяет медикаментозное лечение" */
      .inline-flex.items-center.gap-2.px-4.py-2.rounded-full svg,
      .inline-flex.items-center.gap-2.px-4.py-2.rounded-full .text-blue-300,
      .disclaimer svg,
      .disclaimer .text-blue-300,
      .disclaimer-container svg,
      .disclaimer-container .text-blue-300 {
        width: 16px !important;
        height: 16px !important;
        min-width: 16px !important;
        min-height: 16px !important;
        margin-right: 8px !important;
        position: relative !important;
        top: 0.125em !important;
      }
      
      [class*="scientific"], [class*="shield"] {
        display: flex !important;
        align-items: baseline !important;
      }
      
      [class*="scientific"] svg, [class*="scientific"] img,
      [class*="shield"] svg, [class*="shield"] img {
        width: 24px !important;
        height: 24px !important;
        min-width: 24px !important;
        min-height: 24px !important;
        margin-right: 12px !important;
        flex-shrink: 0 !important;
      }
    `;
    document.head.appendChild(styleEl);
  }

  // Применяем стили немедленно
  applyEarlyFix();

  function fixIcons() {
    // Элемент "Научно доказанная эффективность с 1998 года"
    const scientificElements = document.querySelectorAll(
      '.mt-10.md\\:mt-12.flex.items-start.justify-center.text-white\\/70, [class*="scientific"]',
    );
    scientificElements.forEach(function (el) {
      el.style.display = "flex";
      el.style.alignItems = "baseline";

      const icon = el.querySelector(".text-blue-300, svg, img");
      if (icon) {
        icon.style.flexShrink = "0";
        icon.style.marginRight = "12px";
        icon.style.position = "relative";
        icon.style.top = "0.25em";
        icon.style.width = "24px";
        icon.style.height = "24px";
        icon.style.minWidth = "24px";
        icon.style.minHeight = "24px";
      }
    });

    // Элемент "Продукция 4Life не заменяет медикаментозное лечение"
    const disclaimerElements = document.querySelectorAll(
      '.inline-flex.items-center.gap-2.px-4.py-2.rounded-full, [class*="disclaimer"]',
    );
    disclaimerElements.forEach(function (el) {
      el.style.alignItems = "baseline";

      const icon = el.querySelector(".text-blue-300, svg, img");
      if (icon) {
        // Фиксируем размер иконки по высоте текста
        icon.style.width = "16px";
        icon.style.height = "16px";
        icon.style.minWidth = "16px";
        icon.style.minHeight = "16px";
        icon.style.flexShrink = "0";
        icon.style.marginRight = "8px";
        icon.style.position = "relative";
        icon.style.top = "0.125em";
      }
    });
  }

  // Запускаем функцию сразу
  fixIcons();

  // Запускаем функцию при загрузке DOM
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", fixIcons);
  } else {
    fixIcons(); // DOM уже загружен
  }

  // Запускаем функцию при изменении размера окна
  window.addEventListener("resize", fixIcons);

  // Запускаем функцию через небольшую задержку для гарантии
  setTimeout(fixIcons, 100);

  // Запускаем функцию периодически для обработки динамически добавленных элементов
  setInterval(fixIcons, 1000);
})();
