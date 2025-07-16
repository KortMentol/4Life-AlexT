/**
 * @module src/utils/colorUtils.ts
 * @description Библиотека утилит для работы с цветами в различных форматах (HEX, RGB, HSL, RGBA). Предоставляет функции для преобразования между цветовыми форматами, манипуляции с цветами (осветление, затемнение), добавления прозрачности и определения контрастных цветов. Все функции оптимизированы для работы с UI-компонентами и поддерживают безопасную обработку недопустимых или отсутствующих значений.
 * @author Kort
 * @version 1.0.0
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/color_value - Документация по цветовым форматам в CSS
 * @usage
 * 1. `src/hooks/useThemeColors.ts`: Для создания цветовой палитры с различными уровнями прозрачности.
 * 2. `src/components/ui/Button.tsx`: Для динамического изменения цветов при наведении и нажатии.
 * 3. `src/components/effects/GradientText.tsx`: Для создания градиентных текстовых эффектов.
 * 4. `src/hooks/useGlassmorphism.ts`: Для настройки цветов и прозрачности эффекта гласморфизма.
 * 5. `src/utils/themeUtils.ts`: Для генерации цветовых схем на основе базовых цветов.
 * @example
 * // Преобразование HEX в RGB
 * const rgb = hexToRgb('#3b82f6');
 * console.log(rgb); // { r: 59, g: 130, b: 246 }
 * 
 * // Создание цвета с прозрачностью
 * const buttonBg = hexToRgba('#3b82f6', 0.2);
 * console.log(buttonBg); // rgba(59, 130, 246, 0.2)
 * 
 * // Осветление и затемнение цветов
 * const lighterBlue = lightenColor('#3b82f6', 0.2);
 * const darkerBlue = darkenColor('#3b82f6', 0.2);
 * 
 * // Определение контрастного цвета для фона
 * const textColor = getContrastColor('#3b82f6'); // #FFFFFF
 */

/**
 * Преобразует HEX-цвет в формат RGB
 * @param hex HEX-цвет в формате #RRGGBB или #RGB (с # или без)
 * @returns Объект с RGB-компонентами {r, g, b} или null при некорректном входном значении
 */
export const hexToRgb = (hex: string | undefined): { r: number; g: number; b: number } | null => {
  if (!hex) return null;
  
  // Используем явное приведение типов для результатов регулярного выражения
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result || !result[1] || !result[2] || !result[3]) return null;
  
  const r = parseInt(result[1] as string, 16);
  const g = parseInt(result[2] as string, 16);
  const b = parseInt(result[3] as string, 16);
  
  return { r, g, b };
};

/**
 * Преобразует RGB-компоненты в HEX-цвет
 * @param r Красный компонент (0-255)
 * @param g Зеленый компонент (0-255)
 * @param b Синий компонент (0-255)
 * @returns HEX-цвет в формате #RRGGBB
 */
export const rgbToHex = (r: number, g: number, b: number): string => {
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
};

/**
 * Преобразует RGB-цвет в формат HSL (Hue, Saturation, Lightness)
 * @param r Красный компонент (0-255)
 * @param g Зеленый компонент (0-255)
 * @param b Синий компонент (0-255)
 * @returns Объект с HSL-компонентами {h, s, l}, где h: 0-1, s: 0-1, l: 0-1
 */
export const rgbToHsl = (r: number, g: number, b: number): { h: number; s: number; l: number } => {
  // Нормализуем RGB значения в диапазон 0-1
  r /= 255;
  g /= 255;
  b /= 255;

  // Находим максимальное и минимальное значения для определения яркости и насыщенности
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  // Если max и min равны, то цвет ахроматический (серый)
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    // Определяем оттенок в зависимости от того, какой компонент максимальный
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }

    h /= 6;
  }

  return { h, s, l };
};

/**
 * Преобразует HSL-цвет в формат RGB
 * @param h Оттенок (0-1)
 * @param s Насыщенность (0-1)
 * @param l Яркость (0-1)
 * @returns Объект с RGB-компонентами {r, g, b}, где r, g, b: 0-255
 */
export const hslToRgb = (h: number, s: number, l: number): { r: number; g: number; b: number } => {
  let r, g, b;

  // Если насыщенность равна 0, то цвет ахроматический (серый)
  if (s === 0) {
    r = g = b = l;
  } else {
    // Вспомогательная функция для вычисления RGB компонентов
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    // Вычисляем промежуточные значения для RGB
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    // Вычисляем RGB компоненты
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  // Преобразуем значения из диапазона 0-1 в 0-255
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
};

/**
 * Осветляет HEX-цвет на указанную величину
 * @param hex HEX-цвет в формате #RRGGBB
 * @param amount Величина осветления в диапазоне 0-1
 * @returns Осветленный HEX-цвет
 */
export const lightenColor = (hex: string | undefined, amount: number): string => {
  if (!hex) return '#000000';
  
  // Используем безопасное преобразование
  const safeHex = hex;
  const rgb = hexToRgb(safeHex);
  if (!rgb) return safeHex;

  // Преобразуем в HSL, увеличиваем яркость и преобразуем обратно в HEX
  const { h, s, l } = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const newL = Math.min(1, l + amount); // Ограничиваем максимальную яркость до 1
  const newRgb = hslToRgb(h, s, newL);

  return rgbToHex(newRgb.r, newRgb.g, newRgb.b);
};

/**
 * Затемняет HEX-цвет на указанную величину
 * @param hex HEX-цвет в формате #RRGGBB
 * @param amount Величина затемнения в диапазоне 0-1
 * @returns Затемненный HEX-цвет
 */
export const darkenColor = (hex: string | undefined, amount: number): string => {
  if (!hex) return '#000000';
  
  // Используем безопасное преобразование
  const safeHex = hex;
  const rgb = hexToRgb(safeHex);
  if (!rgb) return safeHex;

  // Преобразуем в HSL, уменьшаем яркость и преобразуем обратно в HEX
  const { h, s, l } = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const newL = Math.max(0, l - amount); // Ограничиваем минимальную яркость до 0
  const newRgb = hslToRgb(h, s, newL);

  return rgbToHex(newRgb.r, newRgb.g, newRgb.b);
};

/**
 * Создает RGBA-цвет из HEX-цвета с указанной прозрачностью
 * @param hex HEX-цвет в формате #RRGGBB
 * @param alpha Значение прозрачности в диапазоне 0-1
 * @returns RGBA-цвет в формате rgba(r, g, b, a)
 */
export const hexToRgba = (hex: string | undefined, alpha: number): string => {
  const safeHex = hex || '#000000';
  const rgb = hexToRgb(safeHex);
  if (!rgb) return safeHex;

  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
};

/**
 * Определяет контрастный цвет (черный или белый) для указанного фонового цвета
 * @param hex HEX-цвет фона
 * @returns Контрастный цвет (#000000 для светлого фона или #FFFFFF для темного)
 */
export const getContrastColor = (hex: string | undefined): string => {
  const safeHex = hex || '#000000';
  const rgb = hexToRgb(safeHex);
  if (!rgb) return '#000000';

  // Формула для определения яркости цвета по стандарту WCAG
  // Учитывает разную чувствительность человеческого глаза к разным цветам
  const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;

  // Возвращаем черный для светлых цветов и белый для темных
  return brightness > 128 ? '#000000' : '#FFFFFF';
};