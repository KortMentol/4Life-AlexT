/**
 * @module src/utils/effectsDebug/effectsDebugStore.ts
 * @description Singleton store для управления флагами эффектов.
 * Внедряет взаимное исключение текстовых эффектов на ПК (Blur vs Opacity).
 * Автоматически сбрасывает ручные направления до чистых пресетов тира при перезагрузке,
 * если тир принудительно переопределен пользователем (low/medium/high).
 *
 * THE FIX:
 * - На Low-Tier параметр `morphingBackground` теперь принудительно установлен в `true`.
 * - Это позволяет отображать сверхлегкий статический фон с зернистым засветом,
 *   избегая "скучной гробовой темноты" и сохраняя 100% производительность.
 *
 * @author Kort
 * @version 4.2.0
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
  scrollTextBlur: boolean;
  scrollTextOpacity: boolean;
  scrollTextBlockOpacity: boolean;
  scrollNumberAnimation: boolean;
  videoProgressOrb: boolean;
  renderVideoBlocks: boolean;
  blockVideoTranslateZHigh: boolean;
  molecularNetHighNodes: boolean;
  cardScrollGather: boolean;
  parallaxBackground: boolean;
  morphingBackground: boolean;
  grid3dMaskFade: boolean;
  headerGlass: boolean;
  premiumTransitions: boolean;
  auroraText: boolean;
  textShineAnimation: boolean;
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
  scrollTextBlur: true,
  scrollTextOpacity: false,
  scrollTextBlockOpacity: true,
  scrollNumberAnimation: true,
  videoProgressOrb: true,
  renderVideoBlocks: true,
  blockVideoTranslateZHigh: true,
  molecularNetHighNodes: true,
  cardScrollGather: true,
  parallaxBackground: true,
  morphingBackground: true, // По умолчанию включен
  grid3dMaskFade: true,
  headerGlass: true,
  premiumTransitions: true,
  auroraText: true,
  textShineAnimation: true,
};

const getPresetForTier = (tier: PerformanceTierOverride): Partial<EffectsDebugFlags> => {
  if (tier === "low") {
    return {
      webglFluid: false,
      grid3d: false,
      scrollTextBlur: false,
      scrollTextOpacity: false,
      scrollTextBlockOpacity: false,
      scrollNumberAnimation: false,
      videoProgressOrb: true,
      blockVideoTranslateZHigh: false,
      molecularNetHighNodes: false,
      cardScrollGather: false,
      parallaxBackground: false,
      morphingBackground: true, // THE FIX: Включаем легкий фон на Low-Tier, чтобы избежать черноты
      headerGlass: false,
      premiumTransitions: false,
      auroraText: false,
      renderVideoBlocks: true,
      textShineAnimation: false,
      grid3dMaskFade: false,
    };
  }

  if (tier === "medium") {
    return {
      webglFluid: true,
      webglFluidPressureHigh: false,
      webglFluidSunrays: false,
      grid3d: true,
      grid3dFilterBlur: false,
      scrollTextBlur: false,
      scrollTextOpacity: true,
      scrollTextBlockOpacity: true,
      blockVideoTranslateZHigh: false,
      molecularNetHighNodes: false,
      videoProgressOrb: true,
      scrollNumberAnimation: true,
      cardScrollGather: true,
      renderVideoBlocks: true,
      parallaxBackground: true,
      morphingBackground: true,
      headerGlass: true,
      premiumTransitions: true,
      auroraText: true,
      grid3dMaskFade: false,
    };
  }

  if (tier === "high") {
    return {
      webglFluid: true,
      webglFluidPressureHigh: true,
      webglFluidSunrays: true,
      webglFluidShading: true,
      grid3d: true,
      grid3dFilterBlur: true,
      scrollTextBlur: true,
      scrollTextOpacity: false,
      scrollTextBlockOpacity: true,
      scrollNumberAnimation: true,
      videoProgressOrb: true,
      renderVideoBlocks: true,
      blockVideoTranslateZHigh: true,
      molecularNetHighNodes: true,
      cardScrollGather: true,
      parallaxBackground: true,
      morphingBackground: true,
      grid3dMaskFade: true,
      headerGlass: true,
      premiumTransitions: true,
      auroraText: true,
      textShineAnimation: true,
    };
  }

  return {};
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

      if (parsed.tierOverride && parsed.tierOverride !== "auto") {
        const preset = getPresetForTier(parsed.tierOverride);
        return { ...DEFAULTS, ...parsed, ...preset };
      }

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
    const newFlags = { ...this.flags, [key]: value };

    if (key !== "tierOverride") {
      newFlags.tierOverride = "auto";
    }

    if (key === "scrollTextBlur" && value === true) {
      newFlags.scrollTextOpacity = false;
    }
    if (key === "scrollTextOpacity" && value === true) {
      newFlags.scrollTextBlur = false;
    }

    this.flags = newFlags;
    this.save();
    this.notify();
  }

  reset(): void {
    this.flags = { ...DEFAULTS };
    this.save();
    this.notify();
  }

  applyTierPreset(tier: PerformanceTierOverride): void {
    const newFlags = { ...DEFAULTS };
    newFlags.tierOverride = tier;

    if (tier !== "auto") {
      const preset = getPresetForTier(tier);
      this.flags = { ...newFlags, ...preset };
    } else {
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
