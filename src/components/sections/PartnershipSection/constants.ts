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

// ─── Палитра — зафиксирована под темную тему сайта ───────────────────────────
export const getPalette = () => ({
  bg: "#040404",
  cream: "#F0EDE8",
  gold: "#B9974A",
  blue: "#1644F8",
  blueDim: "rgba(22, 68, 248, 0.188)", // Эквивалент #1644F830 для экономии вычислений
  // Оверлеи с прозрачностью
  overlay10: "rgba(240,237,232,0.10)",
  overlay20: "rgba(240,237,232,0.20)",
  overlay40: "rgba(240,237,232,0.40)",
  overlay60: "rgba(240,237,232,0.60)",
  // Dot grid
  dotColor: "rgba(240,237,232,0.08)",
});

export type Palette = {
  bg: string;
  cream: string;
  gold: string;
  blue: string;
  blueDim: string;
  overlay10: string;
  overlay20: string;
  overlay40: string;
  overlay60: string;
  dotColor: string;
};

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
