/**
 * @module src/lib/webgl-fluid/config.ts
 * @description Master Configuration File for WebGL Fluid Simulation.
 * Contains detailed, pro-level guidelines for parameter tuning to achieve high-end WebGL physics.
 *
 * @author Geminis AI & Kort
 * @version 2.2.0
 */

const defaultConfig = {
  /**
   * @property {number} simResolution
   * @description Grid size where Navier-Stokes fluid equations are calculated.
   * @range [32, 256]
   * @tuning Increase (e.g., 200) for highly complex, heavy fluid patterns. Decrease (e.g., 128) for lighter rendering.
   */
  simResolution: 200,

  /**
   * @property {number} dyeResolution
   * @description Resolution of the color/dye rendering canvas.
   * @range [128, 2048]
   * @tuning Increase (e.g., 1024) for sharp neon trails. Decrease (e.g., 512) to save 400% of pixel fill-rate on GPU.
   */
  dyeResolution: 1024,

  /**
   * @property {number} captureResolution
   * @description Resolution used when capturing screenshots of the fluid grid.
   * @range [256, 1024]
   */
  captureResolution: 512,

  /**
   * @property {number} densityDissipation
   * @description Rate at which color/smoke fades and dissolves.
   * @range [0.1, 10.0]
   * @tuning Increase (e.g., 4.0) for fast evaporation. Decrease (e.g., 1.5) for long, lingering trails.
   */
  densityDissipation: 1.0,

  /**
   * @property {number} velocityDissipation
   * @description Velocity damping (friction). How fast the fluid movement slows down to a stop.
   * @range [0.1, 5.0]
   * @tuning Increase (e.g., 2.0) for a muddy, viscous drag. Decrease (e.g., 0.2) for high-speed, ice-like gliding.
   */
  velocityDissipation: 0.2,

  /**
   * @property {number} pressure
   * @description Controls local cell pressure and feedback intensity of fluid currents.
   * @range [0.0, 1.0]
   */
  pressure: 0.8,

  /**
   * @property {number} pressureIterations
   * @description Number of Jacobi solver passes per frame to resolve pressure.
   * @range [10, 100]
   * @tuning Increase (e.g., 50) for extreme border precision on GPU. Decrease (e.g., 15) to save massive GPU overhead.
   */
  pressureIterations: 20,

  /**
   * @property {number} curl
   * @description Vorticity confinement strength. Adds microscopic turbulences and organic swirls.
   * @range [0, 50]
   * @tuning Increase (e.g., 30) for beautiful curly smoke. Decrease (e.g., 5) for laminar, linear streams.
   */
  curl: 30,

  /**
   * @property {number} splatRadius
   * @description Radius of the ink injection created by mouse pointer.
   * @range [0.01, 1.0]
   * @tuning Increase for huge, massive paint blobs. Decrease (e.g., 0.22) for sleek, surgical lines.
   */
  splatRadius: 0.25,

  /**
   * @property {number} splatForce
   * @description Velocity and momentum injected into the grid by mouse movement.
   * @range [1000, 10000]
   */
  splatForce: 6000,

  /**
   * @property {boolean} shading
   * @description Activates specular light mapping, normal-map relief and gloss highlights on fluid body.
   */
  shading: true,

  /**
   * @property {boolean} colorful
   * @description Automatically cycles fluid inject colors through the spectrum.
   */
  colorful: true,

  /**
   * @property {number} colorUpdateSpeed
   * @description Speed of color shifting when colorful mode is enabled.
   * @range [1, 50]
   */
  colorUpdateSpeed: 10,

  /**
   * @property {string[]} colorPalette
   * @description Array of custom hex color codes. If empty, falls back to full rainbow spectrum.
   */
  colorPalette: [],

  /**
   * @property {boolean} hover
   * @description Tracks mouse hover movements. If false, only clicks (mousedown) will inject fluid.
   */
  hover: true,

  /**
   * @property {boolean} inverted
   * @description Inverts background and fluid colors.
   */
  inverted: false,

  /**
   * @property {string} backgroundColor
   * @description Hex background color of the canvas (only visible if transparent is false).
   */
  backgroundColor: "#000000",

  /**
   * @property {boolean} transparent
   * @description Makes canvas transparent, letting webpage elements show behind.
   */
  transparent: false,

  /**
   * @property {number} brightness
   * @description General brightness level of the neon colors on screen.
   * @range [0.1, 1.0]
   */
  brightness: 0.5,

  /**
   * @property {boolean} bloom
   * @description Enables post-processing HDR neon glow around fluid edges.
   */
  bloom: true,

  /**
   * @property {number} bloomIterations
   * @description Number of Gaussian blur passes used to compute the bloom halo.
   * @range [2, 12]
   */
  bloomIterations: 8,

  /**
   * @property {number} bloomResolution
   * @description Resolution of the offscreen framebuffer where bloom blur is rendered.
   * @range [128, 512]
   */
  bloomResolution: 256,

  /**
   * @property {number} bloomIntensity
   * @description Intensity/brightness of the neon glow.
   * @range [0.1, 2.0]
   */
  bloomIntensity: 0.8,

  /**
   * @property {number} bloomThreshold
   * @description Luminance threshold above which the fluid starts emitting bloom glow.
   * @range [0.0, 1.0]
   */
  bloomThreshold: 0.6,

  /**
   * @property {number} bloomSoftKnee
   * @description Softness of the transition between non-bloomed and bloomed colors.
   * @range [0.0, 1.0]
   */
  bloomSoftKnee: 0.7,

  /**
   * @property {boolean} sunrays
   * @description Enables volumetric light rays (crepuscular god-rays) projecting through fluid.
   */
  sunrays: true,

  /**
   * @property {number} sunraysResolution
   * @description Resolution of the sunrays occlusion buffer.
   * @range [64, 256]
   */
  sunraysResolution: 196,

  /**
   * @property {number} sunraysWeight
   * @description Weight/intensity of the volumetric god-rays.
   * @range [0.1, 2.0]
   */
  sunraysWeight: 1.0,
};

export { defaultConfig };
