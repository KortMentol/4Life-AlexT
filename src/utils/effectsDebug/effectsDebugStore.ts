/**
 * @module src/utils/effectsDebug/effectsDebugStore.ts
 * @description Singleton store для управления флагами эффектов HIGH тира.
 * Хранит состояние в localStorage — переживает перезагрузку страницы.
 * Только DEV режим. В production не используется.
 *
 * Флаги покрывают все эффекты которые есть на HIGH тире но отсутствуют на MEDIUM:
 * - WebGL Fluid (SectionFluidEffect)
 * - Grid3D (MorphingVideoSection)
 * - Grid3D filter:blur (CSS на .grid__item)
 * - ScrollText пословный режим (ScrollText)
 * - translateZ magnitude на BlockVideo
 * - MolecularNet nodes count (PartnershipSection/Science)
 *
 * @author Kort
 * @version 1.0.0
 */

export type PerformanceTierOverride = "auto" | "low" | "medium" | "high";

export interface EffectsDebugFlags {
  // ─── Tier override ────────────────────────────────────────────────────────
  /** "auto" = определяется автоматически, иначе принудительный тир */
  tierOverride: PerformanceTierOverride;

  // ─── WebGL Fluid (SectionFluidEffect) ────────────────────────────────────
  /** Включить/выключить весь WebGL Fluid эффект */
  webglFluid: boolean;
  /** pressureIterations: 50 (high) vs 20 (reduced) */
  webglFluidPressureHigh: boolean;
  /** sunrays шейдер-проход */
  webglFluidSunrays: boolean;
  /** shading шейдер-проход */
  webglFluidShading: boolean;

  // ─── Grid3D (MorphingVideoSection) ───────────────────────────────────────
  /** Включить/выключить Grid3D в блоках 01/02/03 */
  grid3d: boolean;
  /** filter:blur на .grid__item элементах */
  grid3dFilterBlur: boolean;

  // ─── ScrollText ───────────────────────────────────────────────────────────
  /** true = пословная анимация (high), false = один opacity (medium-режим) */
  scrollTextWordByWord: boolean;

  // ─── BlockVideo translateZ ────────────────────────────────────────────────
  /** true = ±400 (high), false = ±200 (medium) */
  blockVideoTranslateZHigh: boolean;

  // ─── MolecularNet ─────────────────────────────────────────────────────────
  /** true = 12 nodes (high), false = 7 nodes (medium) */
  molecularNetHighNodes: boolean;

  // ─── Cards scroll gather (ImmersiveProductShowcase) ───────────────────────
  /** true = карточки разлетаются/сходятся при скролле, false = статичны */
  cardScrollGather: boolean;

  // ─── Parallax Background ──────────────────────────────────────────────────
  /** true = параллакс фон включен, false = статичный фон */
  parallaxBackground: boolean;
}

const STORAGE_KEY = "4life_effects_debug";

const DEFAULTS: EffectsDebugFlags = {
  tierOverride: "auto",
  webglFluid: true,
  webglFluidPressureHigh: true,
  webglFluidSunrays: true,
  webglFluidShading: true,
  grid3d: true,
  grid3dFilterBlur: true,
  scrollTextWordByWord: true,
  blockVideoTranslateZHigh: true,
  molecularNetHighNodes: true,
  cardScrollGather: true,
  parallaxBackground: true,
};

type Listener = (flags: EffectsDebugFlags) => void;

class EffectsDebugStore {
  private flags: EffectsDebugFlags;
  private listeners = new Set<Listener>();

  constructor() {
    this.flags = this.load();
  }

  private load(): EffectsDebugFlags {
    if (typeof window === "undefined") return { ...DEFAULTS };
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { ...DEFAULTS };
      const parsed = JSON.parse(raw) as Partial<EffectsDebugFlags>;
      // Merge с defaults — новые флаги получают дефолтное значение
      return { ...DEFAULTS, ...parsed };
    } catch {
      return { ...DEFAULTS };
    }
  }

  private save(): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.flags));
    } catch {
      /* silent */
    }
  }

  getFlags(): EffectsDebugFlags {
    return { ...this.flags };
  }

  getFlag<K extends keyof EffectsDebugFlags>(key: K): EffectsDebugFlags[K] {
    return this.flags[key];
  }

  setFlag<K extends keyof EffectsDebugFlags>(
    key: K,
    value: EffectsDebugFlags[K],
  ): void {
    this.flags = { ...this.flags, [key]: value };
    this.save();
    this.notify();
  }

  reset(): void {
    this.flags = { ...DEFAULTS };
    this.save();
    this.notify();
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    const flags = this.getFlags();
    this.listeners.forEach((fn) => fn(flags));
  }
}

// Singleton — один экземпляр на всё приложение
export const effectsDebugStore = new EffectsDebugStore();

/** Читает tierOverride из localStorage синхронно (для usePerformanceTier) */
export const getTierOverride = (): PerformanceTierOverride => {
  if (typeof window === "undefined") return "auto";
  return effectsDebugStore.getFlag("tierOverride");
};
