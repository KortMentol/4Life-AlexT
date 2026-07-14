// src/utils/effectsDebug/effectsDebugStore.ts
/**
 * @module src/utils/effectsDebug/effectsDebugStore.ts
 * @description Реактивный синглтон-стор для управления флагами эффектов.
 * ИСПРАВЛЕНИЕ: Вычищены флаги удаленной MolecularNet для чистоты стора.
 * @author Kort & AI
 * @version 8.0.0
 */

import {
  PerformanceTier,
  calculatePerformanceScore,
  detectDeviceSpecs,
} from "@/utils/devicePerformance/devicePerformance";

export type PerformanceTierOverride = "current" | "low" | "medium" | "high";
export type TargetDevice = "all" | "desktop" | "mobile";
export type RoutePath =
  | "/"
  | "/products"
  | "/partnership"
  | "/about"
  | "/about-me"
  | "/contact"
  | "/how-to-buy"
  | "all";

export interface EffectsDebugFlags {
  tierOverride: PerformanceTierOverride;
  globalPower: boolean;
  renderHeader: boolean;
  textShineAnimation: boolean;
  premiumTransitions: boolean;

  // Hero Section
  parallaxBackground: boolean;
  auroraText: boolean;
  heroScrollAnimation: boolean;

  // Morphing Video
  renderVideoBlocks: boolean;
  renderCardsBackground: boolean;
  cardsBackdropBlur: boolean;
  blockVideoTranslateZHigh: boolean;
  videoProgressOrb: boolean;
  playButtonBlur: boolean;

  // Typography
  scrollTextBlur: boolean;
  scrollTextOpacity: boolean;
  scrollTextBlockOpacity: boolean;
  scrollNumberAnimation: boolean;

  // Background Grids
  morphingBackground: boolean;
  bgGlowLights: boolean;
  grid3d: boolean;

  // WebGL Dynamics
  webglFluid: boolean;
  webglFluidPressureHigh: boolean;
  webglFluidSunrays: boolean;
  webglFluidShading: boolean;

  // Featured Products
  cardScrollGather: boolean;
}

export interface FlagMeta {
  label: string;
  category: string;
  routes: RoutePath[];
  device: TargetDevice;
  desc: string;
  dependsOn?: keyof EffectsDebugFlags;
}

export const FLAGS_METADATA: Record<Exclude<keyof EffectsDebugFlags, "tierOverride" | "globalPower">, FlagMeta> = {
  renderHeader: {
    label: "Render Header Component",
    category: "[Global] Header & Layout",
    routes: ["all"],
    device: "all",
    desc: "Unmounts the floating header to test baseline scroll performance.",
  },
  textShineAnimation: {
    label: "Text Shimmer Effect",
    category: "[Global] Header & Layout",
    routes: ["all"],
    device: "desktop",
    desc: "Continuous shine animation on headers.",
  },
  premiumTransitions: {
    label: "Premium Page Transitions",
    category: "[Global] Routing & UI",
    routes: ["all"],
    device: "all",
    desc: "Pixelated/wave page transition morphs.",
  },
  parallaxBackground: {
    label: "Parallax Backgrounds",
    category: "[Home] 1. Hero Section",
    routes: ["/"],
    device: "all",
    desc: "Fixed viewport layer parallax on background textures.",
  },
  auroraText: {
    label: "Aurora Text Gradient",
    category: "[Home] 1. Hero Section",
    routes: ["/"],
    device: "all",
    desc: "Multi-stop gradient rotation on Hero titles.",
  },
  heroScrollAnimation: {
    label: "Hero Scroll Reveal",
    category: "[Home] 1. Hero Section",
    routes: ["/"],
    device: "desktop",
    desc: "Smoothly shifts hero content down on scroll.",
  },
  renderVideoBlocks: {
    label: "Render 01/02/03 Video Blocks",
    category: "[Home] 2. Morphing Video",
    routes: ["/"],
    device: "all",
    desc: "Globally enables or disables all three video blocks.",
  },
  renderCardsBackground: {
    label: "Glassmorphism Cards",
    category: "[Home] 2. Morphing Video",
    routes: ["/"],
    device: "all",
    desc: "Renders the glass background borders and shadows.",
  },
  cardsBackdropBlur: {
    label: "Cards Backdrop Blur",
    category: "[Home] 2. Morphing Video",
    routes: ["/"],
    device: "all",
    desc: "Applies expensive backdrop-filter to glass cards.",
    dependsOn: "renderCardsBackground",
  },
  blockVideoTranslateZHigh: {
    label: "TranslateZ ±400px",
    category: "[Home] 2. Morphing Video",
    routes: ["/"],
    device: "desktop",
    desc: "Boosts 3D perspective scroll magnitude.",
  },
  videoProgressOrb: {
    label: "Central Progress Orb",
    category: "[Home] 2. Morphing Video",
    routes: ["/"],
    device: "all",
    desc: "Circular SVG play indicator.",
  },
  playButtonBlur: {
    label: "Play Button Blur",
    category: "[Home] 2. Morphing Video",
    routes: ["/"],
    device: "all",
    desc: "Applies backdrop-filter to central play orb.",
    dependsOn: "videoProgressOrb",
  },
  scrollTextBlur: {
    label: "Text Reveal (Blur)",
    category: "[Home] 2. Typography",
    routes: ["/"],
    device: "desktop",
    desc: "GSAP word opacity + blur (6px) scroll parser.",
  },
  scrollTextOpacity: {
    label: "Text Reveal (Opacity)",
    category: "[Home] 2. Typography",
    routes: ["/"],
    device: "desktop",
    desc: "GSAP word opacity only parser.",
  },
  scrollTextBlockOpacity: {
    label: "Block Opacity Fade-in",
    category: "[Home] 2. Typography",
    routes: ["/"],
    device: "mobile",
    desc: "Fade whole paragraph block at once on mobile/tablet devices.",
  },
  scrollNumberAnimation: {
    label: "Scroll Numbers Fill",
    category: "[Home] 2. Typography",
    routes: ["/"],
    device: "all",
    desc: "Scroll-driven color fill of giant digits.",
  },
  morphingBackground: {
    label: "Biotech Background Base",
    category: "[Home] 2. Background Grids",
    routes: ["/"],
    device: "all",
    desc: "Renders the heavy biotech gradient and noise overlay.",
  },
  bgGlowLights: {
    label: "Ambient Glow Orbs",
    category: "[Home] 2. Background Grids",
    routes: ["/"],
    device: "all",
    desc: "Background volumetric glowing circles.",
  },
  grid3d: {
    label: "Hardware 3D CSS Grid",
    category: "[Home] 2. Background Grids",
    routes: ["/"],
    device: "desktop",
    desc: "CSS parallax grid rotating on Z-axis.",
  },
  webglFluid: {
    label: "WebGL Fluid Engine",
    category: "[Home] 2. WebGL Dynamics",
    routes: ["/"],
    device: "desktop",
    desc: "Real-time GPU Navier-Stokes fluid dynamics.",
  },
  webglFluidPressureHigh: {
    label: "Pressure Solver (50 iter)",
    category: "[Home] 2. WebGL Dynamics",
    routes: ["/"],
    device: "desktop",
    desc: "Ultra-precise smoke borders.",
    dependsOn: "webglFluid",
  },
  webglFluidSunrays: {
    label: "Volumetric Sunrays",
    category: "[Home] 2. WebGL Dynamics",
    routes: ["/"],
    device: "desktop",
    desc: "Light scattering through the fluid.",
    dependsOn: "webglFluid",
  },
  webglFluidShading: {
    label: "Specular 3D Shading",
    category: "[Home] 2. WebGL Dynamics",
    routes: ["/"],
    device: "desktop",
    desc: "Normal map bump-shading for glass look.",
    dependsOn: "webglFluid",
  },
  cardScrollGather: {
    label: "Cards Scatter/Gather",
    category: "[Home] 3. Featured Products",
    routes: ["/"],
    device: "desktop",
    desc: "Scroll-driven spatial physics for product cards.",
  },
};

const STORAGE_KEY = "4life_effects_debug";
const LAST_PRESET_KEY = "4life_last_preset";

const DEFAULTS: EffectsDebugFlags = {
  tierOverride: "current",
  globalPower: true,
  renderHeader: true,
  textShineAnimation: true,
  premiumTransitions: true,
  parallaxBackground: true,
  auroraText: true,
  heroScrollAnimation: true,
  renderVideoBlocks: true,
  renderCardsBackground: true,
  cardsBackdropBlur: true,
  blockVideoTranslateZHigh: true,
  videoProgressOrb: true,
  playButtonBlur: true,
  scrollTextBlur: true,
  scrollTextOpacity: false,
  scrollTextBlockOpacity: true,
  scrollNumberAnimation: true,
  morphingBackground: true,
  bgGlowLights: true,
  grid3d: true,
  webglFluid: true,
  webglFluidPressureHigh: true,
  webglFluidSunrays: true,
  webglFluidShading: true,
  cardScrollGather: true,
};

export const getPresetForTier = (tier: "low" | "medium" | "high"): Partial<EffectsDebugFlags> => {
  if (tier === "low") {
    return {
      globalPower: true,
      webglFluid: false,
      webglFluidPressureHigh: false,
      webglFluidSunrays: false,
      webglFluidShading: false,
      grid3d: false,
      scrollTextBlur: false,
      scrollTextOpacity: false,
      scrollTextBlockOpacity: false,
      scrollNumberAnimation: false,
      videoProgressOrb: true,
      playButtonBlur: false,
      blockVideoTranslateZHigh: false,
      cardScrollGather: false,
      parallaxBackground: false,
      heroScrollAnimation: false,
      morphingBackground: true,
      premiumTransitions: false,
      auroraText: false,
      renderVideoBlocks: true,
      textShineAnimation: false,
      bgGlowLights: true,
      renderCardsBackground: true,
      cardsBackdropBlur: false,
      renderHeader: true,
    };
  }

  if (tier === "medium") {
    return {
      globalPower: true,
      webglFluid: true,
      webglFluidPressureHigh: false,
      webglFluidSunrays: false,
      webglFluidShading: true,
      grid3d: true,
      scrollTextBlur: false,
      scrollTextOpacity: true,
      scrollTextBlockOpacity: true,
      scrollNumberAnimation: true,
      videoProgressOrb: true,
      playButtonBlur: true,
      blockVideoTranslateZHigh: false,
      cardScrollGather: true,
      parallaxBackground: true,
      heroScrollAnimation: true,
      morphingBackground: true,
      premiumTransitions: true,
      auroraText: true,
      renderVideoBlocks: true,
      textShineAnimation: false,
      bgGlowLights: true,
      renderCardsBackground: true,
      cardsBackdropBlur: true,
      renderHeader: true,
    };
  }

  return {
    ...DEFAULTS,
    tierOverride: "high",
  };
};

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

      const savedRaw = localStorage.getItem(STORAGE_KEY);
      if (savedRaw) {
        const saved = JSON.parse(savedRaw);

        if (saved.tierOverride && saved.tierOverride !== "current") {
          this.activeTier = saved.tierOverride as PerformanceTier;
        } else {
          this.activeTier = hardwareTier;
        }

        return { ...initialFlags, ...saved };
      }

      return initialFlags;
    } catch {
      return { ...DEFAULTS };
    }
  }

  private save(): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.flags));
    } catch {}
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
      for (const k of Object.keys(FLAGS_METADATA) as (keyof typeof FLAGS_METADATA)[]) {
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

    if (key === "scrollTextBlur" && value === true) newFlags.scrollTextOpacity = false;
    if (key === "scrollTextOpacity" && value === true) newFlags.scrollTextBlur = false;

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
