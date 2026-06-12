import { rafLoop } from "@/lib/rafLoop";
import { useEffect, useRef } from "react";
import { useIsMobile } from "./useIsMobile";

// ─── Десктоп ──────────────────────────────────────────────────────────────────
const HEADER_HEIGHT = 80;
const LERP_DESKTOP = 0.06;
const SNAP_TRANSITION = "transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)";

function getHeader(): HTMLElement | null {
  return document.querySelector(".header-premium");
}

export function useNativeScroll({ disabled = false }: { disabled?: boolean }) {
  const isMobile = useIsMobile();

  // Десктоп refs
  const targetYRef = useRef(0);
  const displayYRef = useRef(0);
  const prevScrollRef = useRef(0);

  const showHeader = () => {
    targetYRef.current = 0;
    displayYRef.current = 0;
    prevScrollRef.current = window.scrollY;

    const h = getHeader();
    if (h) {
      h.style.transition = SNAP_TRANSITION;
      h.style.transform = "translateY(0px) translateZ(0)";
      h.style.opacity = "1";
      h.style.visibility = "visible";

      // DEBUG: Логируем что хедер показан
      if (import.meta.env.DEV) {
        console.log("🔧 showHeader called - header should be visible");
      }
    } else {
      // DEBUG: Хедер не найден
      if (import.meta.env.DEV) {
        console.warn("⚠️ showHeader called but header not found in DOM");
      }
    }
  };

  // КРИТИЧНО: Показываем хедер при маунте ДО подписки на RAF
  // Используем retry логику на случай если хедер еще не смонтирован
  useEffect(() => {
    let attempts = 0;
    const maxAttempts = 10;

    const tryShowHeader = () => {
      const h = getHeader();
      if (h) {
        h.style.transition = "none";
        h.style.transform = "translateY(0px) translateZ(0)";
        h.style.opacity = "1";
        h.style.visibility = "visible";

        if (import.meta.env.DEV) {
          console.log("✅ Header initialized successfully");
        }
      } else if (attempts < maxAttempts) {
        attempts++;
        if (import.meta.env.DEV) {
          console.log(`⏳ Header not found, retry ${attempts}/${maxAttempts}`);
        }
        setTimeout(tryShowHeader, 50);
      } else {
        if (import.meta.env.DEV) {
          console.error("❌ Failed to initialize header after", maxAttempts, "attempts");
        }
      }
    };

    tryShowHeader();
  }, []);

  useEffect(() => {
    window.addEventListener("force-header-show", showHeader);
    return () => window.removeEventListener("force-header-show", showHeader);
  }, []);

  useEffect(() => {
    if (disabled) return;

    const header = getHeader();
    if (!header) return;

    // КРИТИЧНО: Принудительно показываем хедер при маунте
    header.style.transition = "none";
    header.style.transform = "translateY(0px) translateZ(0)";
    header.style.opacity = "1";

    prevScrollRef.current = window.scrollY;

    // ─── МОБАЙЛ: Статичный хедер (Awwwards 2026 Mobile Perfomance) ───
    if (isMobile) {
      header.style.transition = "none";
      header.style.transform = `translateY(0px) translateZ(0)`;
      // Отключаем физику на мобилках для 100% совместимости с нативным URL-баром
      return () => {};
    }

    // ─── ДЕСКТОП: RAF lerp ────────────────────────────────────────────────────
    // КРИТИЧНО: Флаг для игнорирования первого кадра и нефизических скачков
    let isFirstTick = true;
    let isPreloaderPresent = true;

    const unsub = rafLoop.subscribe((scroll) => {
      // 1. При первом кадре просто запоминаем позицию, чтобы не было ложного скачка от 0 к текущему скроллу
      if (isFirstTick) {
        prevScrollRef.current = scroll;
        isFirstTick = false;
        return;
      }

      // Check preloader presence in DOM only while it exists
      if (isPreloaderPresent) {
        isPreloaderPresent = document.getElementById("preloader") !== null;
      }

      // BYPASS CHECKS:
      // If a route transition, POP navigation, active scroll restoration, or the preloader is present,
      // silently synchronize scroll coordinates without applying translation transforms to the header.
      if (
        window.__isRoutingLock ||
        window.__popTransitionInProgress ||
        window.__isScrollRestorationActive ||
        isPreloaderPresent
      ) {
        prevScrollRef.current = scroll;
        return;
      }

      const delta = scroll - prevScrollRef.current;
      prevScrollRef.current = scroll;

      // 2. Игнорируем нефизические скачки (например, программное восстановление скролла при релоаде)
      if (Math.abs(delta) > 150) {
        // Пропускаем этот кадр, не меняя целевую позицию хедера
        if (import.meta.env.DEV) {
          console.log("🚫 Ignoring non-physical scroll jump:", delta);
        }
      }
      // 3. Обрабатываем обычный человеческий скролл
      else if (Math.abs(delta) > 1) {
        targetYRef.current = delta > 0 ? -HEADER_HEIGHT : 0;
      }

      // 4. Плавное движение хедера к цели
      const diff = targetYRef.current - displayYRef.current;
      if (Math.abs(diff) > 0.1) {
        displayYRef.current += diff * LERP_DESKTOP;
        const header = getHeader();
        if (header) {
          header.style.transition = "none";
          header.style.transform = `translateY(${displayYRef.current}px) translateZ(0)`;
        }
      } else if (displayYRef.current !== targetYRef.current) {
        // Точная доводка, чтобы остановить вычисления
        displayYRef.current = targetYRef.current;
        const header = getHeader();
        if (header) {
          header.style.transition = "none";
          header.style.transform = `translateY(${displayYRef.current}px) translateZ(0)`;
        }
      }
    });

    return unsub;
  }, [disabled, isMobile]);

  return { showHeader };
}
