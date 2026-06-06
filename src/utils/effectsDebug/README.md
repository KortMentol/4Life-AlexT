# Module: Effects Debug Store

## @description

A lightweight, reactive state manager that controls the visibility of advanced visual effects (such as WebGL, CSS 3D transforms, and page transitions) and handles performance tier overrides. Provides a centralized way to toggle individual effects for performance profiling and debugging.

## @architecture

- **Persistent Storage**: Flags are stored inside `localStorage` under the key `"4life_effects_debug"` to preserve developer configurations across hot-reloads and page refreshes.
- **Tier Presets**: Changing the tier override (Auto, Low, Medium, High) applies predefined feature presets and reloads the page to ensure clean state initialization.
- **Reactive Listeners**: Uses a pub/sub pattern to notify debug panels and visual components of runtime flag adjustments instantly.
- **Singleton Pattern**: Single instance shared across the entire application to ensure state consistency.

## @available-flags

The store manages the following effect flags:

### WebGL Fluid Effects

- `webglFluid`: Master toggle for fluid simulation
- `webglFluidPressureHigh`: Poisson solver iterations (50 vs 20)
- `webglFluidSunrays`: Volumetric light scattering shader
- `webglFluidShading`: Specular highlights and normal mapping

### CSS 3D Effects

- `grid3d`: 3D CSS parallax grid (HomePage section 2)
- `grid3dFilterBlur`: Backdrop filter blur on grid elements

### GSAP Animations

- `scrollTextWordByWord`: Word-by-word typography reveal
- `blockVideoTranslateZHigh`: 3D parallax magnitude (±400px vs ±200px)
- `molecularNetHighNodes`: SVG network node density (12 vs 7 nodes)
- `cardScrollGather`: Scroll-driven card physics
- `parallaxBackground`: Fixed layer depth parallax

### Global UI & Transitions

- `headerGlass`: Glassmorphism blur on header capsule
- `premiumTransitions`: Awwwards-level page transitions (pixel/wave morphs)
- `auroraText`: Animated gradient text on hero titles

### Tier Override

- `tierOverride`: Performance tier override ("auto" | "low" | "medium" | "high")

## @tier-presets

The `applyTierPreset()` method applies the following configurations:

### Low Tier

Disables all heavy effects:

- ❌ All WebGL fluid features
- ❌ 3D grids and blur
- ❌ High-magnitude parallax
- ❌ Premium transitions
- ❌ Aurora text animations

### Medium Tier

Balanced profile:

- ✅ WebGL fluid (base quality)
- ❌ High pressure iterations, sunrays, shading
- ✅ 3D grids
- ❌ Grid blur
- ✅ Standard parallax and transitions
- ❌ High-density networks

### High/Auto Tier

Full visual suite:

- ✅ All effects enabled at maximum quality

## @usage

### Reading Flags in Components

```typescript
import { useFeatureFlag } from "@/hooks";

// Automatically falls back to the hardware tier condition in production
const isFluidEnabled = useFeatureFlag("webglFluid", tier === "high");
```

### Reading a Single Flag

```typescript
import { useEffectsDebugFlag } from "@/hooks";

const isFluidEnabled = useEffectsDebugFlag("webglFluid");
```

### Reading All Flags

```typescript
import { useEffectsDebug } from "@/hooks";

const flags = useEffectsDebug();
console.log(flags.webglFluid, flags.headerGlass);
```

### Setting Flags Programmatically

```typescript
import { effectsDebugStore } from "@/utils/effectsDebug/effectsDebugStore";

// Set a single flag
effectsDebugStore.setFlag("webglFluid", false);

// Apply a tier preset
effectsDebugStore.applyTierPreset("low");
window.location.reload(); // Required for clean state

// Reset to defaults
effectsDebugStore.reset();
```

## @dev-mode-behavior

The `useFeatureFlag` hook has smart behavior based on environment:

- **DEV mode**: Always returns the debug panel toggle state, allowing manual control
- **PROD mode**: Ignores debug store, returns the `prodCondition` parameter (typically tied to hardware tier)

This ensures debug controls only affect development builds, while production uses hardware-based tier logic.

## @storage-format

Flags are stored in localStorage as JSON:

```json
{
  "tierOverride": "auto",
  "webglFluid": true,
  "webglFluidPressureHigh": true,
  "webglFluidSunrays": true,
  "webglFluidShading": true,
  "grid3d": true,
  "grid3dFilterBlur": true,
  "scrollTextWordByWord": true,
  "blockVideoTranslateZHigh": true,
  "molecularNetHighNodes": true,
  "cardScrollGather": true,
  "parallaxBackground": true,
  "headerGlass": true,
  "premiumTransitions": true,
  "auroraText": true
}
```

## @debugging

Access the Effects Debug Panel in DEV mode:

- **Desktop**: Draggable floating panel (bottom-right corner)
- **Mobile**: Bottom-sheet panel (stacks above Performance Debug)

The panel provides:

- Tier preset buttons (Auto/Low/Medium/High)
- Individual effect toggles with dependency handling
- Reset button to restore defaults
- Hover tooltips with technical descriptions (desktop only)

## @author

Kort

## @version

1.0.0

## @see

- `src/hooks/useEffectsDebug.ts`: React hooks for consuming flags
- `src/components/debug/EffectsDebugPanel.tsx`: Desktop debug UI
- `src/components/debug/EffectsDebugMobile.tsx`: Mobile debug UI
