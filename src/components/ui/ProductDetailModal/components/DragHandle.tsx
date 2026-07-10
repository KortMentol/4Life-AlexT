/**
 * DragHandle — визуальная ручка для bottom sheet.
 * Показывает пользователю что панель можно тянуть вниз.
 */
import React from "react";

export const DragHandle: React.FC = () => (
  <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
    <div
      className="w-10 h-1 rounded-full bg-white/20"
    />
  </div>
);
