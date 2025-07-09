import { useMemo } from "react";

/**
 * @module src/hooks/useIsMobile.ts
 * @description Хук для определения, является ли устройство мобильным. Проверяет строку `navigator.userAgent` на наличие ключевых слов, характерных для мобильных устройств. Результат мемоизируется с помощью `useMemo` для предотвращения повторных вычислений.
 * @author Kort
 * @version 1.0.0
 * @returns {boolean} Возвращает `true`, если User-Agent соответствует мобильному устройству, иначе `false`.
 * @usage
 * 1. `src/components/ui/StaticFeature.tsx`: Используется для условного рендеринга или применения стилей в зависимости от типа устройства.
 * @example
 * const isMobile = useIsMobile();
 * 
 * return (
 *   <div>
 *     {isMobile ? <MobileComponent /> : <DesktopComponent />}
 *   </div>
 * );
 */
export const useIsMobile = (): boolean => {
  const isMobile = useMemo(
    () =>
      typeof window !== "undefined"
        ? /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent
          )
        : false,
    []
  );
  return isMobile;
};
