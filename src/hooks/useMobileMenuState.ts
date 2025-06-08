import { useState, useCallback } from 'react';

/**
 * Хук для управления состоянием мобильного меню
 * @returns Объект с состоянием и методами управления мобильным меню
 */
export const useMobileMenuState = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);
  
  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen(prev => !prev);
  }, []);
  
  return { 
    mobileMenuOpen, 
    setMobileMenuOpen, 
    closeMobileMenu,
    toggleMobileMenu
  };
};

export default useMobileMenuState;