import React from 'react';

/**
 * Компонент с SVG-фильтрами для создания продвинутых визуальных эффектов
 * Используется для эффектов "вязкости", размытия и других визуальных эффектов
 */
const SVGFilters: React.FC = () => {
  return (
    <svg className="svg-filters" aria-hidden="true">
      <defs>
        {/* Фильтр для эффекта "вязкости" (gooey effect) */}
        <filter id="gooey">
          <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
          <feColorMatrix
            in="blur"
            type="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
            result="gooey"
          />
          <feComposite in="SourceGraphic" in2="gooey" operator="atop" />
        </filter>
        
        {/* Фильтр для эффекта размытия */}
        <filter id="blur-filter">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
        </filter>
        
        {/* Фильтр для эффекта свечения */}
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
          <feFlood floodColor="#4f46e5" floodOpacity="0.7" result="glow-color" />
          <feComposite in="glow-color" in2="blur" operator="in" result="glow-blur" />
          <feComposite in="SourceGraphic" in2="glow-blur" operator="over" />
        </filter>
        
        {/* Фильтр для эффекта тени */}
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#000" floodOpacity="0.2" />
        </filter>
      </defs>
    </svg>
  );
};

export default SVGFilters;