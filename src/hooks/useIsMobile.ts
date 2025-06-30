import { useMemo } from "react";

/**
 * Хук для определения, является ли устройство мобильным, на основе User-Agent.
 * @returns {boolean} Возвращает true, если устройство мобильное, иначе false.
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
