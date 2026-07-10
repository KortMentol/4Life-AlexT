/**
 * @module src/components/effects/CssVeilBackground.tsx
 * @description Высокопроизводительный CSS-фон для футера, адаптивный к темам.
 * Используется как fallback для low/medium performance tier.
 * @author Kort (реализация по ТЗ от Gemini)
 * @version 1.0.0
 */
import React from "react";

const CssVeilBackground: React.FC = () => {
  return <div className="css-veil-background" data-theme="dark" />;
};

export default React.memo(CssVeilBackground);
