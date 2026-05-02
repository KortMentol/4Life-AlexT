/**
 * @module PartnershipSection/constants.ts
 * Палитра, данные контента, конфиги анимаций.
 * Всё в одном месте — легко менять без касания JSX.
 */

// ─── Touch detection (вычисляется один раз при загрузке модуля) ───────────────
export const IS_TOUCH =
  typeof window !== "undefined"
    ? "ontouchstart" in window || navigator.maxTouchPoints > 0
    : false;

// ─── Палитра — адаптирована под light/dark тему ───────────────────────────────
export const getPalette = (isDark: boolean) => ({
  bg: isDark ? "#040404" : "#f8f6f2",
  cream: isDark ? "#F0EDE8" : "#1a1814",
  gold: "#B9974A",
  blue: "#1644F8",
  blueDim: isDark ? "#1644F830" : "#1644F815",
  // Белые/тёмные оверлеи с прозрачностью
  overlay10: isDark ? "rgba(240,237,232,0.10)" : "rgba(26,24,20,0.08)",
  overlay20: isDark ? "rgba(240,237,232,0.20)" : "rgba(26,24,20,0.15)",
  overlay40: isDark ? "rgba(240,237,232,0.40)" : "rgba(26,24,20,0.40)",
  overlay60: isDark ? "rgba(240,237,232,0.60)" : "rgba(26,24,20,0.60)",
  // Dot grid
  dotColor: isDark ? "rgba(240,237,232,0.08)" : "rgba(26,24,20,0.06)",
});

export type Palette = ReturnType<typeof getPalette>;

// ─── Главы (ChapterNav) ───────────────────────────────────────────────────────
export const CHAPTERS = ["ВХОД", "ОСНОВА", "МОДЕЛЬ", "ДОХОД", "СТАРТ"] as const;

// ─── Бегущая строка ───────────────────────────────────────────────────────────
export const TICKER_ITEMS = [
  "Associate",
  "Builder",
  "Presidential",
  "Bronze",
  "Silver",
  "Gold",
  "Platinum",
  "Diamond",
] as const;

// ─── Шаги модели ─────────────────────────────────────────────────────────────
export const MODEL_STEPS = [
  {
    n: "01",
    title: "Продукт готов.",
    body: "Производство, сертификация и логистика уже работают. Вы рекомендуете проверенное решение.",
    accentKey: "blue" as const,
  },
  {
    n: "02",
    title: "Система включена.",
    body: "Личный кабинет, выплаты, обучение и поддержка доступны с первого дня.",
    accentKey: "gold" as const,
  },
  {
    n: "03",
    title: "Доверие = доход.",
    body: "Лучшие партнёры делятся тем, что реально помогает, и строят долгосрочные отношения.",
    accentKey: "cream" as const,
  },
] as const;

// ─── Scramble chars ───────────────────────────────────────────────────────────
export const SCRAMBLE_CHARS = "АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ0123456789·—";
