# Module: Developer Debug Panels

## @description

This module provides a suite of high-performance developer tools to monitor system performance metrics and toggle heavy graphical features dynamically in real-time.

## @components

- **`PerformanceDebug.tsx` / `PerformanceDebugMobile.tsx`**: Real-time FPS, Frame Time, and hardware specifications monitors.
- **`EffectsDebugPanel.tsx` / `EffectsDebugMobile.tsx`**: Interactive controls to toggle individual WebGL, CSS 3D, and GSAP animation features for performance profiling.

## @architecture & Optimizations

- **Zero React Re-render Overhead**: To prevent profiling tools from impacting the very FPS they measure, the real-time update loop (FPS and Frame Time) bypasses React's Virtual DOM entirely, updating raw DOM nodes directly via refs.
- **Mobile Bottom-Sheet Stacking**: On mobile, both panels are locked to the bottom viewport. A lightweight event dispatcher coordinates their heights dynamically, preventing layout overlaps.
- **Touch Optimization**: On mobile, hover tooltips are disabled, and tap-target areas are expanded (clicking any row element toggles its associated checkbox).
- **Desktop Draggable Panels**: Desktop panels are fully draggable with smart positioning and hover tooltips that adapt to available screen space (left/right positioning).

## @usage

Rendered conditionally in `src/App.tsx` during development mode only:

```tsx
{
  import.meta.env.DEV &&
    (isMobile ? (
      <>
        <PerformanceDebugMobile />
        <EffectsDebugMobile />
      </>
    ) : (
      <>
        <PerformanceDebug />
        <EffectsDebugPanel />
      </>
    ));
}
```

## @performance-metrics

- **FPS (Frames Per Second)**: Live frame rate calculation with color-coded indicators (green >= 50, yellow >= 30, red < 30)
- **Frame Time**: Average frame render time in milliseconds (calculated over 10-frame window)
- **Performance Score**: Static hardware score (0-100) calculated on mount
- **Performance Tier**: Device classification (low/medium/high) with tier override support
- **Device Specs**: Detailed hardware information (RAM, CPU cores, GPU, WebGL version, touch support)

## @tier-presets

The Effects Debug Panel includes tier preset buttons (Auto/Low/Medium/High) that apply predefined configurations:

- **Auto**: Uses hardware-detected tier (default)
- **Low**: Disables all heavy effects (WebGL fluid, 3D grids, blur, transitions)
- **Medium**: Balanced profile (enables core effects, disables high-tier features like sunrays, high pressure)
- **High**: Full visual suite enabled (all effects at maximum quality)

Changing tier presets triggers a page reload to ensure clean state initialization.

## @author

Kort

## @version

2.0.0

## @see

- `src/utils/devicePerformance/devicePerformance.ts`: Hardware detection and performance scoring
- `src/utils/effectsDebug/effectsDebugStore.ts`: Effects debug state management
- `src/hooks/usePerformanceTier.ts`: Performance tier hook
- `src/hooks/useEffectsDebug.ts`: Effects debug hooks (useFeatureFlag, useEffectsDebugFlag)
