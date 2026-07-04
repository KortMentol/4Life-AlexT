/**
 * @module src/utils/effectsDebug/effectsDebugStore.ts
 * @description Реактивный синглтон-стор для управления флагами эффектов.
 *
 * ИСПРАВЛЕНИЕ:
 * - Удален неактивный флаг `headerGlass` (поскольку backdrop-blur из хедера убран полностью).
 * - Добавлены новые отладочные флаги `renderCardsBackground` (управление подложкой)
 *   и `renderHeader` (физическое размонтирование хедера из DOM).
 *
 * @author Geminis AI & Kort
 * @version 5.4.0
 */

import {
  PerformanceTier,
  calculatePerformanceScore,
  detectDeviceSpecs,
} from "@/utils/devicePerformance/devicePerformance";

export type PerformanceTierOverride = "current" | "low" | "medium" | "high";

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
  premiumTransitions: boolean;
  auroraText: boolean;
  textShineAnimation: boolean;
  bgGlowLights: boolean;
  // Новые отладочные флаги
  renderCardsBackground: boolean;
  renderHeader: boolean;
}

const STORAGE_KEY = "4life_effects_debug";
const LAST_PRESET_KEY = "4life_last_preset";

const DEFAULTS: EffectsDebugFlags = {
  tierOverride: "current",
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
  premiumTransitions: true,
  auroraText: true,
  textShineAnimation: true,
  bgGlowLights: true,
  renderCardsBackground: true,
  renderHeader: true,
};

export const getPresetForTier = (tier: "low" | "medium" | "high"): Partial<EffectsDebugFlags> => {
  if (tier === "low") {
    return {
      webglFluid: false,
      webglFluidPressureHigh: false,
      webglFluidSunrays: false,
      webglFluidShading: false,
      grid3d: false,
      grid3dFilterBlur: false,
      scrollTextBlur: false,
      scrollTextOpacity: false,
      scrollTextBlockOpacity: false,
      scrollNumberAnimation: false,
      videoProgressOrb: true,
      blockVideoTranslateZHigh: false,
      molecularNetHighNodes: false,
      cardScrollGather: false,
      parallaxBackground: false,
      morphingBackground: true,
      premiumTransitions: false,
      auroraText: false,
      renderVideoBlocks: true,
      textShineAnimation: false,
      grid3dMaskFade: false,
      bgGlowLights: true,
      renderCardsBackground: true,
      renderHeader: true,
    };
  }

  if (tier === "medium") {
    return {
      webglFluid: true,
      webglFluidPressureHigh: false,
      webglFluidSunrays: false,
      webglFluidShading: false,
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
      premiumTransitions: true,
      auroraText: true,
      textShineAnimation: false,
      grid3dMaskFade: false,
      bgGlowLights: true,
      renderCardsBackground: true,
      renderHeader: true,
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
      premiumTransitions: true,
      auroraText: true,
      textShineAnimation: true,
      bgGlowLights: true,
      renderCardsBackground: true,
      renderHeader: true,
    };
  }

  return {};
};

const KEYS_TO_COMPARE: (keyof EffectsDebugFlags)[] = [
  "webglFluid",
  "webglFluidPressureHigh",
  "webglFluidSunrays",
  "webglFluidShading",
  "grid3d",
  "grid3dFilterBlur",
  "scrollTextBlur",
  "scrollTextOpacity",
  "scrollTextBlockOpacity",
  "scrollNumberAnimation",
  "videoProgressOrb",
  "renderVideoBlocks",
  "blockVideoTranslateZHigh",
  "molecularNetHighNodes",
  "cardScrollGather",
  "parallaxBackground",
  "morphingBackground",
  "grid3dMaskFade",
  "premiumTransitions",
  "auroraText",
  "textShineAnimation",
  "bgGlowLights",
  "renderCardsBackground",
  "renderHeader",
];

type Listener = (flags: EffectsDebugFlags) => void;

class EffectsDebugStore {
  private flags: EffectsDebugFlags;
  private listeners = new Set<Listener>();
  public activeTier: PerformanceTier = "medium";

  constructor() {
    this.flags = this.load();
  }

  private load(): EffectsDebugFlags {
    if (typeof window === "undefined") return { ...DEFAULTS };
    try {
      const specs = detectDeviceSpecs();
      const { tier: hardwareTier } = calculatePerformanceScore(specs);
      this.activeTier = hardwareTier;

      const preset = getPresetForTier(hardwareTier);
      const initialFlags: EffectsDebugFlags = {
        ...DEFAULTS,
        ...preset,
        tierOverride: hardwareTier as PerformanceTierOverride,
      };

      return initialFlags;
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

  private saveLastPreset(flags: EffectsDebugFlags): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(LAST_PRESET_KEY, JSON.stringify(flags));
    } catch {}
  }

  public getLastPreset(): EffectsDebugFlags | null {
    if (typeof window === "undefined") return null;
    try {
      const raw = localStorage.getItem(LAST_PRESET_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  public isLastPresetDisabled(): boolean {
    const last = this.getLastPreset();
    if (!last) return true;
    const matched = this.detectMatchingTier(last);
    return matched !== "current";
  }

  private detectMatchingTier(flags: EffectsDebugFlags): PerformanceTierOverride {
    const tiers: ("low" | "medium" | "high")[] = ["low", "medium", "high"];
    for (const t of tiers) {
      const preset = getPresetForTier(t);
      let match = true;
      for (const k of KEYS_TO_COMPARE) {
        if (flags[k] !== preset[k]) {
          match = false;
          break;
        }
      }
      if (match) return t;
    }
    return "current";
  }

  getFlags(): EffectsDebugFlags {
    return { ...this.flags };
  }

  getFlag<K extends keyof EffectsDebugFlags>(key: K): EffectsDebugFlags[K] {
    return this.flags[key];
  }

  setFlag<K extends keyof EffectsDebugFlags>(key: K, value: EffectsDebugFlags[K]): void {
    const newFlags = { ...this.flags, [key]: value };

    if (key === "scrollTextBlur" && value === true) {
      newFlags.scrollTextOpacity = false;
    }
    if (key === "scrollTextOpacity" && value === true) {
      newFlags.scrollTextBlur = false;
    }

    const matchedTier = this.detectMatchingTier(newFlags);
    newFlags.tierOverride = matchedTier;

    if (matchedTier !== "current") {
      this.activeTier = matchedTier as PerformanceTier;
    } else {
      this.saveLastPreset(newFlags);
    }

    this.flags = newFlags;
    this.save();
    this.notify();
  }

  reset(): void {
    const specs = detectDeviceSpecs();
    const { tier: hardwareTier } = calculatePerformanceScore(specs);
    this.activeTier = hardwareTier;
    this.applyTierPreset(hardwareTier as PerformanceTierOverride);
  }

  applyTierPreset(tier: PerformanceTierOverride): void {
    if (tier === "current") {
      const last = this.getLastPreset();
      if (last) {
        this.flags = { ...last, tierOverride: "current" };

        const specs = detectDeviceSpecs();
        const { tier: hardwareTier } = calculatePerformanceScore(specs);
        this.activeTier = hardwareTier;

        this.save();
        this.notify();
      }
      return;
    }

    const newFlags = { ...DEFAULTS };
    newFlags.tierOverride = tier;

    this.activeTier = tier as PerformanceTier;
    const preset = getPresetForTier(tier as "low" | "medium" | "high");
    this.flags = { ...newFlags, ...preset };

    this.save();
    this.notify();
  }

  restoreLastPreset(): void {
    const last = this.getLastPreset();
    if (last) {
      this.flags = { ...last, tierOverride: "current" };

      const specs = detectDeviceSpecs();
      const { tier: hardwareTier } = calculatePerformanceScore(specs);
      this.activeTier = hardwareTier;

      this.save();
      this.notify();
    }
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
  if (typeof window === "undefined") return "current";
  return effectsDebugStore.getFlag("tierOverride") as PerformanceTierOverride;
};
