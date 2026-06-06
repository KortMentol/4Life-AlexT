import { lenis } from "@/lib/lenis";
import { useMotionValue } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * Синхронизирует CSS-переменные хедера с Y-координатой свайпа (только тач).
 * Возвращает MotionValue<number> для передачи в motion.div style.y
 */
export function useModalDragSync(isOpen: boolean, isMobile: boolean) {
  const y = useMotionValue(0);

  useEffect(() => {
    if (!isOpen || !isMobile) return;

    // Сбрасываем y при открытии
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

/**
 * Блокирует скролл страницы при открытой модалке.
 * На десктопе останавливает Lenis. На тач — body.inert + классы.
 */
export function useModalBodyLock(isOpen: boolean, isMobile: boolean) {
  useEffect(() => {
    const root = document.getElementById("root");

    if (isOpen) {
      document.body.classList.add("modal-open");
      document.documentElement.classList.add("modal-open");
      if (root) root.inert = true;
      if (!isMobile) lenis?.stop();
    }

    return () => {
      document.body.classList.remove("modal-open");
      document.documentElement.classList.remove("modal-open");
      if (root) root.inert = false;
      if (!isMobile) lenis?.start();
    };
  }, [isOpen, isMobile]);
}

/**
 * Откладывает рендер тяжёлого контента на тач-устройствах
 * до завершения анимации открытия (350ms = время spring).
 */
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
      // Сбрасываем после закрытия с задержкой (даём exit-анимации завершиться)
      const timer = setTimeout(() => setIsContentVisible(false), 400);
      return () => clearTimeout(timer);
    }
  }, [isOpen, isMobile]);

  return { isContentVisible, setIsContentVisible };
}
