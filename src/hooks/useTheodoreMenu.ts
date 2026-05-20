import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

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

  const closeMenu = useCallback(() => {
    if (isMenuOpen) {
      isMenuActionRef.current = true;
      navigate(-1);
    }
  }, [isMenuOpen, navigate]);

  return {
    isMenuOpen,
    toggleMenu,
    closeMenu,
    isMenuActionRef,
    wasMenuOpenRef,
  };
};
