import { useMediaQuery } from "./useMediaQuery";

/**
 * @module src/hooks/useIsMobile.ts
 * @description Простой хук-обертка над useMediaQuery для определения мобильных устройств.
 * @author Kort
 * @version 2.0.0
 * @returns {boolean} Возвращает `true`, если ширина экрана меньше 768px.
 */
export const useIsMobile = (): boolean => {
  return useMediaQuery("(max-width: 767px)");
};
