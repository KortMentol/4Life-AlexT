/**
 * @module PartnershipSection/constants.ts
 * Палитра, данные контента, конфиги анимаций.
 * ИСПРАВЛЕНИЯ: Базовый цвет (bg) заменен с #040404 на Clinical Obsidian (#03050a)
 * для идеального бесшовного стыка с параллаксом.
 */

// ─── Touch detection (вычисляется один раз при загрузке модуля) ───────────────
export const IS_TOUCH =
  typeof window !== "undefined" ? "ontouchstart" in window || navigator.maxTouchPoints > 0 : false;

// ─── Палитра — зафиксирована под темную тему сайта ───────────────────────────
export const getPalette = () => ({
  bg: "#03050a", // ИСПРАВЛЕНО: Clinical Obsidian
  cream: "#F0EDE8",
  gold: "#B9974A",
  blue: "#1644F8",
  blueDim: "rgba(22, 68, 248, 0.188)",
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
export const CHAPTERS = ["ВХОД", "ОСНОВА", "МОДЕЛЬ", "ЭКОНОМИКА", "СТАРТ"] as const;

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
    title: "Продукт и маркировка.",
    body: "Состав, формат выпуска и допустимые заявления зависят от конкретной формулы и рынка.",
    accentKey: "blue" as const,
  },
  {
    n: "02",
    title: "План и квалификация.",
    body: "Начисления, расходы и условия участия определяются действующими документами программы.",
    accentKey: "gold" as const,
  },
  {
    n: "03",
    title: "Решение без обещаний.",
    body: "Партнёрство требует времени и может включать расходы. Вознаграждение не гарантируется.",
    accentKey: "cream" as const,
  },
] as const;

// ─── Scramble chars ───────────────────────────────────────────────────────────
export const SCRAMBLE_CHARS = "АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ0123456789·—";
