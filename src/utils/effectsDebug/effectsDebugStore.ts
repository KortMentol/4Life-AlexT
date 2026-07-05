/**
 * @module src/utils/effectsDebug/effectsDebugStore.ts
 * @description Reactive singleton store for managing visual effect flags.
 *
 * ============================================================================
 * 🤖 AI AGENT GUIDELINES FOR ADDING NEW FLAGS:
 * 1. UI Flow: Group flags top-to-bottom as they appear visually on the site.
 *    Use prefixes like "[Global]", "[Home]", "[Partnership]" for categories.
 * 2. Routing: Specify exact routes in `routes` array. Use "all" for global.
 * 3. Device: Use `device` to hide desktop-only effects (e.g. hover physics) from mobile.
 * 4. Dependencies: Use `dependsOn` if a flag requires another to be true.
 * ============================================================================
 *
 * @author Geminis AI & Kort
 * @version 7.1.0
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
  globalPower: boolean; // Master bypass switch (DAW pattern)
  // --- Global ---
  renderHeader: boolean;
  textShineAnimation: boolean;
  premiumTransitions: boolean;
  // --- Home: Hero ---
  parallaxBackground: boolean;
  auroraText: boolean;
  // --- Home: Morphing Video ---
  renderVideoBlocks: boolean;
  blockVideoTranslateZHigh: boolean;
  videoProgressOrb: boolean;
  renderCardsBackground: boolean;
  scrollTextBlur: boolean;
  scrollTextOpacity: boolean;
  scrollTextBlockOpacity: boolean;
  scrollNumberAnimation: boolean;
  morphingBackground: boolean;
  bgGlowLights: boolean;
  grid3d: boolean;
  webglFluid: boolean;
  webglFluidPressureHigh: boolean;
  webglFluidSunrays: boolean;
  webglFluidShading: boolean;
  // --- Home: Featured Products ---
  cardScrollGather: boolean;
  // --- Partnership: Science ---
  molecularNetHighNodes: boolean;
}

export interface FlagMeta {
  label: string;
  category: string; // Group name in the UI
  routes: RoutePath[]; // Route paths where the toggle should be visible
  device: TargetDevice; // Filters rendering on PC vs Touch debug panels
  desc: string; // Hover tooltip description
  dependsOn?: keyof EffectsDebugFlags;
}

/**
 * METADATA MAP
 * The visual rendering order of Groups in the UI matches the sequential key order here.
 * Organised strictly Top-to-Bottom: Global first, then HomePage sections, then specific sub-pages.
 * Note: `globalPower` is intentionally omitted here as it renders in the fixed header area.
 */
export const FLAGS_METADATA: Record<Exclude<keyof EffectsDebugFlags, "tierOverride" | "globalPower">, FlagMeta> = {
  // ─── [GLOBAL] HEADER & LAYOUT ───
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

  // ─── [GLOBAL] ROUTING & UI ───
  premiumTransitions: {
    label: "Premium Page Transitions",
    category: "[Global] Routing & UI",
    routes: ["all"],
    device: "all",
    desc: "Pixelated/wave page transition morphs.",
  },

  // ─── [HOME] 1. HERO SECTION ───
  parallaxBackground: {
    label: "Parallax Backgrounds (Sec 1, 3, 5)",
    category: "[Home] 1. Hero Section",
    routes: ["/"], // Restrict strictly to Homepage to prevent clutter on other pages
    device: "all",
    desc: "Fixed viewport layer parallax on background textures in sections 1, 3 and 5.",
  },
  auroraText: {
    label: "Aurora Text Gradient",
    category: "[Home] 1. Hero Section",
    routes: ["/"],
    device: "all",
    desc: "Multi-stop gradient rotation on Hero titles.",
  },

  // ─── [HOME] 2. MORPHING VIDEO (Visual blocks & layout) ───
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
    desc: "Toggles heavy CSS glass shadows/borders.",
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

  // ─── [HOME] 2. TYPOGRAPHY ───
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
    device: "mobile", // Hidden on PC since desktop always uses word-by-word reveal
    desc: "Fade whole paragraph block at once on mobile/tablet devices.",
  },
  scrollNumberAnimation: {
    label: "Scroll Numbers Fill",
    category: "[Home] 2. Typography",
    routes: ["/"],
    device: "all",
    desc: "Scroll-driven color fill of giant digits.",
  },

  // ─── [HOME] 2. BACKGROUND GRIDS ───
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

  // ─── [HOME] 2. WEBGL DYNAMICS ───
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

  // ─── [HOME] 3. FEATURED PRODUCTS ───
  cardScrollGather: {
    label: "Cards Scatter/Gather",
    category: "[Home] 3. Featured Products",
    routes: ["/"],
    device: "desktop",
    desc: "Scroll-driven spatial physics for product cards.",
  },

  // ─── [PARTNERSHIP] 1. SCIENCE ───
  molecularNetHighNodes: {
    label: "SVG Network (12 vs 7)",
    category: "[Partnership] 1. Science",
    routes: ["/partnership"],
    device: "all",
    desc: "Dynamic SVG vertices with orbital drift physics.",
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
  renderVideoBlocks: true,
  blockVideoTranslateZHigh: true,
  videoProgressOrb: true,
  renderCardsBackground: true,
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
  molecularNetHighNodes: true,
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
      blockVideoTranslateZHigh: false,
      molecularNetHighNodes: false,
      cardScrollGather: false,
      parallaxBackground: false,
      morphingBackground: true,
      premiumTransitions: false,
      auroraText: false,
      renderVideoBlocks: true,
      textShineAnimation: false,
      bgGlowLights: true,
      renderCardsBackground: true,
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
      blockVideoTranslateZHigh: false,
      molecularNetHighNodes: false,
      cardScrollGather: true,
      parallaxBackground: true,
      morphingBackground: true,
      premiumTransitions: true,
      auroraText: true,
      renderVideoBlocks: true,
      textShineAnimation: false,
      bgGlowLights: true,
      renderCardsBackground: true,
      renderHeader: true,
    };
  }

  if (tier === "high") {
    return {
      globalPower: true,
      webglFluid: true,
      webglFluidPressureHigh: true,
      webglFluidSunrays: true,
      webglFluidShading: true,
      grid3d: true,
      scrollTextBlur: true,
      scrollTextOpacity: false,
      scrollTextBlockOpacity: true,
      scrollNumberAnimation: true,
      videoProgressOrb: true,
      blockVideoTranslateZHigh: true,
      molecularNetHighNodes: true,
      cardScrollGather: true,
      parallaxBackground: true,
      morphingBackground: true,
      premiumTransitions: true,
      auroraText: true,
      renderVideoBlocks: true,
      textShineAnimation: true,
      bgGlowLights: true,
      renderCardsBackground: true,
      renderHeader: true,
    };
  }

  return {};
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
