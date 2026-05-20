import { rafLoop } from "@/lib/rafLoop";
import { scrollLockState } from "@/lib/scrollLockState";
import { useEffect, useRef } from "react";
import { useIsMobile } from "./useIsMobile";

// ─── Десктоп ──────────────────────────────────────────────────────────────────
const HEADER_HEIGHT = 80;
const LERP_DESKTOP = 0.06;
const SNAP_TRANSITION = "transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)";

// ─── Мобайл: spring-параметры (те же что были с Lenis) ────────────────────────
// stiffness: жёсткость пружины — чем выше тем быстрее
// damping: затухание — чем выше тем меньше колебаний
// mass: инерция — чем выше тем "тяжелее" ощущение
const SPRING_STIFFNESS = 400;
const SPRING_DAMPING = 40;
const SPRING_MASS = 0.8;

// Порог скорости (px/ms) для инерционного снапа при touchend
const VELOCITY_SNAP_THRESHOLD = 0.15;

function getHeader(): HTMLElement | null {
  return document.querySelector(".header-premium");
}

/**
 * Простой spring-симулятор без зависимостей.
 * Работает через физику: position, velocity, force.
 * Вызывается каждый RAF-кадр.
 */
class SpringValue {
  position = 0; // текущее значение [-HEADER_HEIGHT .. 0]
  velocity = 0; // текущая скорость
  target = 0; // целевое значение

  constructor(initial = 0) {
    this.position = initial;
    this.target = initial;
  }

  /** Один шаг симуляции. dt — время в секундах. */
  step(dt: number): boolean {
    // Ограничиваем dt чтобы не было взрывов при потере фокуса вкладки
    const safeDt = Math.min(dt, 0.064);

    const force =
      -SPRING_STIFFNESS * (this.position - this.target) -
      SPRING_DAMPING * this.velocity;

    this.velocity += (force / SPRING_MASS) * safeDt;
    this.position += this.velocity * safeDt;

    // Считаем settled если близко к цели и скорость мала
    const settled =
      Math.abs(this.position - this.target) < 0.1 &&
      Math.abs(this.velocity) < 0.1;

    if (settled) {
      this.position = this.target;
      this.velocity = 0;
    }

    return !settled; // true = ещё анимируется
  }

  setTarget(t: number) {
    this.target = Math.max(-HEADER_HEIGHT, Math.min(0, t));
  }

  /** Мгновенно установить позицию и цель (без анимации) */
  snap(value: number) {
    this.position = value;
    this.target = value;
    this.velocity = 0;
  }
}

export function useNativeScroll({ disabled = false }: { disabled?: boolean }) {
  const isMobile = useIsMobile();

  // Десктоп refs
  const targetYRef = useRef(0);
  const displayYRef = useRef(0);
  const prevScrollRef = useRef(0);

  // Сохраняем spring между re-mount (не пересоздаём при disabled)
  const springRef = useRef<SpringValue | null>(null);

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
          console.error(
            "❌ Failed to initialize header after",
            maxAttempts,
            "attempts",
          );
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

    // ─── МОБАЙЛ: spring от пальца ─────────────────────────────────────────────
    if (isMobile) {
      header.style.transition = "none";

      // Используем существующий spring или создаём новый
      if (!springRef.current) {
        springRef.current = new SpringValue(0);
      }
      const spring = springRef.current;

      // Устанавливаем текущую позицию хедера (может быть GSAP анимировал)
      const currentY = parseFloat(
        getComputedStyle(header).transform.split(",")[5] || "0",
      );
      if (!isNaN(currentY) && Math.abs(currentY) < HEADER_HEIGHT) {
        spring.position = currentY;
        spring.target = currentY;
      }

      header.style.transform = `translateY(${spring.position}px) translateZ(0)`;

      // Состояние касания
      let isTouching = false;
      let touchStartY = 0;
      let headerStartPos = 0;
      let lastTouchY = 0;
      let lastTouchTime = 0;
      let touchVelocity = 0; // px/ms — для инерционного снапа

      // RAF для spring-анимации (только когда нужно)
      let rafId: number | null = null;
      let lastFrameTime = 0;

      const startRAF = () => {
        if (rafId !== null) return;
        lastFrameTime = performance.now();
        const tick = (now: number) => {
          const dt = (now - lastFrameTime) / 1000;
          lastFrameTime = now;

          const stillAnimating = spring.step(dt);
          header.style.transform = `translateY(${spring.position}px) translateZ(0)`;

          if (stillAnimating) {
            rafId = requestAnimationFrame(tick);
          } else {
            rafId = null;
          }
        };
        rafId = requestAnimationFrame(tick);
      };

      const stopRAF = () => {
        if (rafId !== null) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
      };

      const onTouchStart = (e: TouchEvent) => {
        if (!e.touches[0]) return;
        isTouching = true;
        touchStartY = e.touches[0].clientY;
        lastTouchY = touchStartY;
        lastTouchTime = performance.now();
        touchVelocity = 0;

        // Запоминаем текущую позицию spring — двигаем от неё
        headerStartPos = spring.position;

        // Останавливаем spring-анимацию — мгновенный отклик на касание
        stopRAF();
        spring.velocity = 0;
        spring.target = spring.position;
      };

      const onTouchMove = (e: TouchEvent) => {
        if (!isTouching || !e.touches[0]) return;
        if (scrollLockState.isLocked) return;

        const touchY = e.touches[0].clientY;
        const now = performance.now();
        const dt = now - lastTouchTime;

        // Скорость пальца px/ms
        if (dt > 0) {
          touchVelocity = (lastTouchY - touchY) / dt;
        }
        lastTouchY = touchY;
        lastTouchTime = now;

        // Дельта пальца от начала касания → новая позиция хедера
        const deltaY = touchStartY - touchY; // вверх = положительная
        const newPos = Math.max(
          -HEADER_HEIGHT,
          Math.min(0, headerStartPos - deltaY),
        );

        // Прямое движение без spring во время касания — пиксель в пиксель
        spring.position = newPos;
        spring.target = newPos;
        header.style.transform = `translateY(${newPos}px) translateZ(0)`;
      };

      const onTouchEnd = () => {
        if (!isTouching) return;
        isTouching = false;
        if (scrollLockState.isLocked) return;

        const currentPos = spring.position;

        let snapTarget: number;

        if (Math.abs(touchVelocity) > VELOCITY_SNAP_THRESHOLD) {
          // Быстрый свайп — снапим в направлении скорости пальца
          snapTarget = touchVelocity > 0 ? -HEADER_HEIGHT : 0;
        } else {
          // Медленное движение — снапим по половине
          snapTarget = currentPos < -HEADER_HEIGHT / 2 ? -HEADER_HEIGHT : 0;
        }

        spring.setTarget(snapTarget);
        // Передаём скорость пальца в spring для инерционного продолжения
        spring.velocity = -touchVelocity * 60; // конвертируем px/ms → px/s
        startRAF();
      };

      document.addEventListener("touchstart", onTouchStart, { passive: true });
      document.addEventListener("touchmove", onTouchMove, { passive: true });
      document.addEventListener("touchend", onTouchEnd, { passive: true });
      document.addEventListener("touchcancel", onTouchEnd, { passive: true });

      return () => {
        stopRAF();
        document.removeEventListener("touchstart", onTouchStart);
        document.removeEventListener("touchmove", onTouchMove);
        document.removeEventListener("touchend", onTouchEnd);
        document.removeEventListener("touchcancel", onTouchEnd);
      };
    }

    // ─── ДЕСКТОП: RAF lerp ────────────────────────────────────────────────────
    // КРИТИЧНО: Флаг для игнорирования первого кадра и нефизических скачков
    let isFirstTick = true;

    const unsub = rafLoop.subscribe((scroll) => {
      // 1. При первом кадре просто запоминаем позицию, чтобы не было ложного скачка от 0 к текущему скроллу
      if (isFirstTick) {
        prevScrollRef.current = scroll;
        isFirstTick = false;
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
