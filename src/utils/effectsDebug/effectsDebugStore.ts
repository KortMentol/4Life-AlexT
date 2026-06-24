/**
 * @module src/utils/effectsDebug/effectsDebugStore.ts
 * @description Singleton store для управления флагами эффектов HIGH тира.
 * Хранит состояние в localStorage — переживает перезагрузку страницы.
 * Только DEV режим. В production не используется.
 *
 * @author Kort
 * @version 1.1.0
 */

export type PerformanceTierOverride = "auto" | "low" | "medium" | "high";

export interface EffectsDebugFlags {
  tierOverride: PerformanceTierOverride;
  webglFluid: boolean;
  webglFluidPressureHigh: boolean;
  webglFluidSunrays: boolean;
  webglFluidShading: boolean;
  grid3d: boolean;
  grid3dFilterBlur: boolean;
  scrollTextWordByWord: boolean;
  scrollNumberAnimation: boolean; // Scroll-driven color fill of digits 01, 02, 03
  videoProgressOrb: boolean; // Глобальный переключатель кругового прогресс-бара на видео
  renderVideoBlocks: boolean; // Глобальный переключатель всех видео-блоков 01/02/03
  blockVideoTranslateZHigh: boolean;
  molecularNetHighNodes: boolean;
  cardScrollGather: boolean;
  parallaxBackground: boolean;
  // ─── Global UI Components ───
  headerGlass: boolean;
  premiumTransitions: boolean;
  auroraText: boolean;
  textShineAnimation: boolean; // Shimmer text shine animation
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
  scrollNumberAnimation: true,
  videoProgressOrb: true, // По умолчанию включен везде для сохранения целостности дизайна
  renderVideoBlocks: true, // По умолчанию включены все видео-блоки
  blockVideoTranslateZHigh: true,
  molecularNetHighNodes: true,
  cardScrollGather: true,
  parallaxBackground: true,
  headerGlass: true,
  premiumTransitions: true,
  auroraText: true,
  textShineAnimation: true,
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

  setFlag<K extends keyof EffectsDebugFlags>(key: K, value: EffectsDebugFlags[K]): void {
    this.flags = { ...this.flags, [key]: value };
    this.save();
    this.notify();
  }

  reset(): void {
    this.flags = { ...DEFAULTS };
    this.save();
    this.notify();
  }

  applyTierPreset(tier: PerformanceTierOverride): void {
    this.flags.tierOverride = tier;

    if (tier === "low") {
      // Отключаем всё тяжелое
      this.flags.webglFluid = false;
      this.flags.grid3d = false;
      this.flags.scrollTextWordByWord = false;
      this.flags.scrollNumberAnimation = false;
      this.flags.videoProgressOrb = true; // Сохраняем круг для дизайна даже на Low тире
      this.flags.blockVideoTranslateZHigh = false;
      this.flags.molecularNetHighNodes = false;
      this.flags.cardScrollGather = false;
      this.flags.parallaxBackground = false;
      this.flags.headerGlass = false;
      this.flags.premiumTransitions = false;
      this.flags.auroraText = false;
      this.flags.renderVideoBlocks = true;
      this.flags.textShineAnimation = false;
    } else if (tier === "medium") {
      // Отключаем только самые тяжелые High-tier фичи
      this.flags.webglFluid = true;
      this.flags.webglFluidPressureHigh = false;
      this.flags.webglFluidSunrays = false;
      this.flags.grid3d = true;
      this.flags.grid3dFilterBlur = false;
      this.flags.blockVideoTranslateZHigh = false;
      this.flags.molecularNetHighNodes = false;
      this.flags.videoProgressOrb = true;
      this.flags.scrollTextWordByWord = true;
      this.flags.scrollNumberAnimation = true;
      this.flags.cardScrollGather = true;
      this.flags.renderVideoBlocks = true;
      this.flags.parallaxBackground = true;
      this.flags.headerGlass = true;
      this.flags.premiumTransitions = true;
      this.flags.auroraText = true;
    } else {
      // High или Auto - включаем всё по дефолту
      const newFlags = { ...DEFAULTS };
      newFlags.tierOverride = tier;
      this.flags = newFlags;
    }

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

export const effectsDebugStore = new EffectsDebugStore();

export const getTierOverride = (): PerformanceTierOverride => {
  if (typeof window === "undefined") return "auto";
  return effectsDebugStore.getFlag("tierOverride") as PerformanceTierOverride;
};