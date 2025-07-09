import { useState, useCallback } from "react";

/**
 * @module src/hooks/useMobileMenuState.ts
 * @description Хук для инкапсуляции логики управления состоянием мобильного меню (открыто/закрыто). Предоставляет состояние и функции для его изменения (`closeMobileMenu`, `toggleMobileMenu`).
 * @author Kort
 * @version 1.0.0
 * @returns {{mobileMenuOpen: boolean, setMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>, closeMobileMenu: () => void, toggleMobileMenu: () => void}} Объект, содержащий состояние `mobileMenuOpen` и функции для его управления.
 * @usage
 * 1. `src/App.tsx`: Используется для управления состоянием мобильного меню на глобальном уровне.
 * @example
 * const { mobileMenuOpen, toggleMobileMenu } = useMobileMenuState();
 * 
 * return (
 *   <>
 *     <Header onMenuClick={toggleMobileMenu} />
 *     <MobileMenu isOpen={mobileMenuOpen} />
 *   </>
 * );
 */
export const useMobileMenuState = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen((prev) => !prev);
  }, []);

  return {
    mobileMenuOpen,
    setMobileMenuOpen,
    closeMobileMenu,
    toggleMobileMenu,
  };
};

export default useMobileMenuState;
