import { scrollTo as lenisScrollTo } from "@/lib/lenis";
import { NavigateFunction } from "react-router-dom";

export const scrollToTop = (options: { duration?: number; immediate?: boolean; y?: number } = {}): void => {
  const { duration = 1.5, immediate = false, y = 0 } = options;

  lenisScrollTo(y, {
    immediate,
    duration,
    easing: (t: number) => (t < 0.5 ? 16 * t * t * t * t * t : 1 - Math.pow(-2 * t + 2, 5) / 2),
  });

  window.dispatchEvent(new CustomEvent("force-header-show"));
};

export const handleLinkClick = (
  e: React.MouseEvent,
  navigate: NavigateFunction,
  path: string,
  currentPath: string,
  options: { immediate?: boolean } = {},
): void => {
  e.preventDefault();

  if (currentPath === path) {
    scrollToTop({ immediate: options.immediate });
  } else {
    navigate(path);
  }
};
