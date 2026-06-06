# Module: Device Performance Logic

## @description

Analyzes the user's hardware specifications and calculates a performance score (0-100) to classify the device into low, medium, or high performance tiers. Allows the application to adaptively scale back heavy visual layers.

## @detection-algorithm

1. **Platform Detection**: Identifies OS and platform multipliers (Desktop, Mobile, Tablet).
2. **RAM (up to 25 pts)**: Reads `navigator.deviceMemory` with custom corrections for standard browser fingerprinting limits.
3. **CPU Cores (up to 25 pts)**: Analyzes `navigator.hardwareConcurrency` core density.
4. **GPU (up to 50 pts)**:
   - **Primary**: Requests a high-precision `GPUAdapter` via **WebGPU API** to query the exact graphics hardware profile (preloaded in `index.html` during page load, stored in `sessionStorage`).
   - **Fallback**: Falls back to `WEBGL_debug_renderer_info` extension on WebGL 2.0 context if WebGPU is unsupported or blocked.
   - Handles future-proof parsing rules for modern architectures (RTX 50/60, Apple M4/M5, Snapdragon X Elite, MediaTek Immortalis, Intel Arc Battlemage+).

## @webgpu-preloader

The GPU detection runs asynchronously during the preloader animation (`index.html`):

```javascript
// WebGPU preloader snippet
if (navigator.gpu && typeof sessionStorage !== "undefined") {
  navigator.gpu
    .requestAdapter()
    .then(function (adapter) {
      if (adapter) {
        const info = adapter.info;
        if (info && info.device) {
          sessionStorage.setItem("4life_gpu", info.device);
        }
      }
    })
    .catch(function () {});
}
```

This ensures zero performance impact on the main application and provides the most accurate GPU identification available.

## @performance-tiers

The tier boundaries differ between mobile and desktop platforms to account for hardware constraints:

### Desktop Tiers

- **`low`** (Score < 35): Disables all WebGL fluid, 3D grids, and blurring. Falls back to solid, opaque backgrounds.
- **`medium`** (Score 35-64): Balanced profile. Enables word-by-word typography but reduces fluid solver passes and disables high-tier shaders.
- **`high`** (Score >= 65): Complete visual suite enabled (specular shading, sunrays, 12-node networks).

### Mobile Tiers

- **`low`** (Score < 35): Same as desktop low tier.
- **`medium`** (Score 35-54): Same as desktop medium tier, with lower threshold due to mobile hardware constraints.
- **`high`** (Score >= 55): Complete visual suite enabled. Lower threshold than desktop (55 vs 65) because mobile devices have stricter scoring multipliers.

**Note**: Mobile devices receive penalty multipliers during scoring (0.5x for budget GPUs, 0.7x for mid-range, 1.0x only for gaming-class GPUs like Adreno 730+, Mali-G78+, Apple A15+).

## @gpu-detection-rules

The module includes comprehensive GPU vendor detection with future-proof support:

- **NVIDIA**: GeForce RTX 20/30/40/50/60, GTX series, MX series, Quadro
- **AMD**: Radeon RX 5000/6000/7000/8000/9000, Vega, RDNA
- **Apple**: M1/M2/M3/M4/M5, A12-A18 Bionic chips
- **Intel**: Arc (Alchemist/Battlemage+), Iris Xe/Plus, UHD, Core Ultra Graphics
- **Qualcomm**: Adreno 600/700/800 series
- **ARM**: Mali G52/G57/G68/G77/G78/G710/G715, Immortalis G715/G720
- **MediaTek**: Dimensity series

## @usage

```typescript
import { usePerformanceTier } from "@/hooks";

const tier = usePerformanceTier(); // Returns "low" | "medium" | "high"

// Conditionally enable effects based on tier
const enableFluid = tier === "high";
const enableBlur = tier !== "low";
```

## @debugging

Device specs and calculated scores are visible in the Performance Debug panel (DEV mode only):

- Open the floating debug panel (bottom-right on desktop, bottom-sheet on mobile)
- View real-time FPS, frame time, and static performance score
- Inspect detailed device specifications (RAM, CPU, GPU renderer, WebGL version)

## @author

Kort

## @version

2.0.0

## @see

- `src/hooks/usePerformanceTier.ts`: Hook that exposes tier to components
- `src/components/debug/`: Debug panels that visualize these metrics
- `index.html`: WebGPU preloader implementation
