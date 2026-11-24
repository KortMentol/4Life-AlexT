import { acquireScrollLock } from "@/utils/scrollLock";
import { useMotionValue } from "framer-motion";
import { useEffect, useState } from "react";

export function useModalDragSync(isOpen: boolean, isMobile: boolean) {
  const y = useMotionValue(0);

  useEffect(() => {
    if (!isOpen || !isMobile) return;

    y.set(0);

    const unsubscribe = y.on("change", (latest: number) => {
      if (latest <= 0) {
        document.body.style.setProperty("--header-y", "-130%");
        document.body.style.setProperty("--header-opacity", "0");
        return;
      }
      const progress = Math.min(1, latest / (window.innerHeight * 0.5));
      document.body.style.setProperty(
        "--header-y",
        `${-130 + progress * 130}%`,
      );
      document.body.style.setProperty("--header-opacity", `${progress}`);
    });

    return unsubscribe;
  }, [isMobile, isOpen, y]);

  return y;
}

export function useModalBodyLock(isOpen: boolean) {
  useEffect(() => {
    if (!isOpen) return;
    const release = acquireScrollLock();
    return release;
  }, [isOpen]);
}

export function useContentVisibility(isOpen: boolean, isMobile: boolean) {
  const [isContentVisible, setIsContentVisible] = useState(!isMobile);

  useEffect(() => {
    if (!isMobile) {
      setIsContentVisible(true);
      return;
    }
    if (isOpen) {
      const timer = setTimeout(() => setIsContentVisible(true), 350);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => setIsContentVisible(false), 400);
      return () => clearTimeout(timer);
    }
  }, [isOpen, isMobile]);

  return { isContentVisible, setIsContentVisible };
}
