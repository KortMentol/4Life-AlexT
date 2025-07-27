// === START OF FILE: src/hooks/useNativeScroll.ts ===

import { useMotionValue, useMotionValueEvent, useScroll, useSpring } from "framer-motion";
import { useRef } from "react";

interface UseNativeScrollOptions {
  headerHeight: number;
  topOffset?: number;
  disabled?: boolean;
}

export type { UseNativeScrollOptions };

export function useNativeScroll({ headerHeight, topOffset = 8, disabled = false }: UseNativeScrollOptions) {
  const { scrollY } = useScroll();
  const lastScrollY = useRef(0);

  const headerY = useSpring(0, { stiffness: 250, damping: 30, mass: 0.5 });
  const headerOpacity = useMotionValue(1);

  useMotionValueEvent(scrollY, "change", (latest: number) => {
    if (disabled) {
      headerY.set(0);
      headerOpacity.set(1);
      return;
    }

    const direction = latest > lastScrollY.current && latest > 50 ? "down" : "up";

    if (direction === "down") {
      headerY.set(-(headerHeight + topOffset * 2));
      headerOpacity.set(0);
    } else {
      headerY.set(0);
      headerOpacity.set(1);
    }

    lastScrollY.current = latest;
  });

  return { headerY, headerOpacity };
}
// === END OF FILE: src/hooks/useNativeScroll.ts ===
