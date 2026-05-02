import { scrollToTop } from "@/utils/navigationUtils";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

/**
 * @description
 * Custom hook for managing TheodoreMenu state and navigation.
 * Handles menu open/close logic, browser history integration, and navigation coordination.
 *
 * @returns {Object} Menu control interface
 * @property {boolean} isMenuOpen - Current menu state
 * @property {Function} toggleMenu - Toggle menu open/close
 * @property {Function} closeMenu - Close menu programmatically
 * @property {Function} navigateFromMenu - Navigate from menu with proper cleanup
 * @property {React.MutableRefObject<boolean>} isMenuActionRef - Flag for menu action detection
 * @property {React.MutableRefObject<boolean>} wasMenuOpenRef - Previous menu state tracker
 *
 * @example
 * const { isMenuOpen, toggleMenu, closeMenu, navigateFromMenu } = useTheodoreMenu();
 */
export const useTheodoreMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMenuActionRef = useRef(false);
  const wasMenuOpenRef = useRef(false);

  // Reset menu action flag after state update
  useEffect(() => {
    isMenuActionRef.current = false;
  }, [isMenuOpen]);

  // Track previous menu state
  useEffect(() => {
    wasMenuOpenRef.current = isMenuOpen;
  }, [isMenuOpen]);

  // Sync menu state with browser history (back/forward buttons)
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      setIsMenuOpen(event.state?.menuOpen === true);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  /**
   * Toggle menu open/close state with history API integration
   */
  const toggleMenu = useCallback(() => {
    const currentPath = location.pathname + location.search;
    isMenuActionRef.current = true;

    if (isMenuOpen) {
      navigate(-1);
    } else {
      const currentState = window.history.state || {};
      window.history.pushState(
        { ...currentState, menuOpen: true },
        "",
        currentPath,
      );
      setIsMenuOpen(true);
    }
  }, [isMenuOpen, navigate, location.pathname, location.search]);

  /**
   * Close menu programmatically
   */
  const closeMenu = useCallback(() => {
    if (isMenuOpen) {
      isMenuActionRef.current = true;
      navigate(-1);
    }
  }, [isMenuOpen, navigate]);

  /**
   * Navigate from menu with proper scroll and cleanup handling
   * @param {string} href - Target route
   * @param {boolean} isSame - Whether navigating to the same page
   */
  const navigateFromMenu = useCallback(
    (href: string, isSame: boolean) => {
      if (isSame) {
        scrollToTop({ immediate: false });
        closeMenu();
      } else {
        navigate(href);
      }
    },
    [closeMenu, navigate],
  );

  return {
    isMenuOpen,
    toggleMenu,
    closeMenu,
    navigateFromMenu,
    isMenuActionRef,
    wasMenuOpenRef,
  };
};
