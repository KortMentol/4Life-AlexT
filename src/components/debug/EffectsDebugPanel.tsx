/**
 * @module src/components/debug/EffectsDebugPanel
 * @description GUI panel for testing HIGH-tier effects.
 * Allows toggling tier (low/medium/high/auto) and individual effects.
 * DEV mode only. Positioned below PerformanceDebug.
 *
 * @author Kort
 * @version 3.0.0
 */

import { useMediaQuery } from "@/hooks";
import { EffectsDebugFlags, PerformanceTierOverride, effectsDebugStore } from "@/utils/effectsDebug/effectsDebugStore";
import { ChevronDown, ChevronUp, Info, Move, Sliders, X } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import styles from "./EffectsDebugPanel.module.css";

// ─── Effect Help Data ─────────────────────────────────────────────────────────

const EFFECT_HELP: Record<string, { desc: string; loc: string }> = {
  webglFluid: {
    desc: "Real-time GPU-accelerated Navier-Stokes fluid dynamics simulation reacting to mouse velocity.",
    loc: "HomePage Background",
  },
  webglFluidPressureHigh: {
    desc: "Scales Poisson pressure solver iterations to 50 for ultra-precise, high-fidelity smoke and liquid borders.",
    loc: "HomePage Background",
  },
  webglFluidSunrays: {
    desc: "Generates volumetric light scattering (crepuscular rays) dynamically projecting through the fluid canvas.",
    loc: "HomePage Background",
  },
  webglFluidShading: {
    desc: "Applies specular highlights and normal map bump-shading to give the fluid a 3D volumetric glass look.",
    loc: "HomePage Background",
  },
  grid3d: {
    desc: "Hardware-accelerated 3D CSS parallax grid rotating and translating elements along the Z-axis on scroll.",
    loc: "HomePage Section 2",
  },
  grid3dFilterBlur: {
    desc: "Applies a lightweight, dynamic CSS backdrop-filter blur to create a premium depth-of-field lens effect.",
    loc: "HomePage Grid Background",
  },
  grid3dMaskFade: {
    desc: "Applies an expensive linear-gradient mask to fade the top and bottom boundaries of the background grid. Heavy on mobile fill-rate.",
    loc: "HomePage Grid Background",
  },
  morphingBackground: {
    desc: "Renders the heavy biotech grid, glowing orbs, and noise overlay in the MorphingVideoSection background.",
    loc: "MorphingVideoSection Background",
  },
  scrollTextWordByWord: {
    desc: "High-performance GSAP ScrollTrigger typography parser animating word opacity and skew per scroll frame.",
    loc: "HomePage Text Sections",
  },
  scrollNumberAnimation: {
    desc: "Scroll-driven color fill of digits 01, 02, 03.",
    loc: "HomePage Section 2",
  },
  blockVideoTranslateZHigh: {
    desc: "Boosts 3D perspective scroll magnitude on why-us video blocks to ±400px for intense spatial immersion.",
    loc: "HomePage Video Blocks",
  },
  videoProgressOrb: {
    desc: "Direct-DOM calculated circular SVG progress tracker and play indicator in the center of the card. Non-reactive animation loop (0ms React render overhead).",
    loc: "HomePage Video Blocks",
  },
  renderVideoBlocks: {
    desc: "Globally enables or disables all three video blocks (01/02/03). Zero FPS cost when disabled — no video elements, no rAF, no IntersectionObserver.",
    loc: "HomePage Video Blocks",
  },
  molecularNetHighNodes: {
    desc: "Scales dynamic SVG vertices to 12 nodes with bounding-box connection lines and custom orbital drift physics.",
    loc: "Partnership Section 1",
  },
  cardScrollGather: {
    desc: "Scroll-driven spatial physics: pushes popular product cards laterally, converging them into position on viewport focus.",
    loc: "HomePage Products Grid",
  },
  parallaxBackground: {
    desc: "Enables fixed compositing viewport layer parallax on background textures for mainpage sections 1, 3, and 5.",
    loc: "HomePage Background",
  },
  headerGlass: {
    desc: "Activates 12px hardware-accelerated backdrop blur and border-glow on the fixed header capsule.",
    loc: "Global Header",
  },
  premiumTransitions: {
    desc: "Enables pixelated block transitions on desktop and organic wave morph transitions on touch screens.",
    loc: "Global Page Routing",
  },
  auroraText: {
    desc: "Triggers GPU-accelerated translation and multi-stop colorful gradient rotation on Hero typography.",
    loc: "HomePage Hero Titles",
  },
  textShineAnimation: {
    desc: "Shimmer text shine animation.",
    loc: "Global Header Names",
  },
};

// ─── Toggle Row ───────────────────────────────────────────────────────────────

const ToggleRow: React.FC<{
  label: string;
  flagKey: keyof EffectsDebugFlags;
  flags: EffectsDebugFlags;
  disabled?: boolean;
  onChange: (key: keyof EffectsDebugFlags, value: boolean) => void;
  onHover: (key: keyof EffectsDebugFlags | null, mouseY?: number) => void;
}> = ({ label, flagKey, flags, disabled = false, onChange, onHover }) => {
  const value = flags[flagKey] as boolean;
  const id = `efx-${flagKey}`;

  const handleMouseEnter = (e: React.MouseEvent) => {
    onHover(flagKey, e.clientY);
  };

  return (
    <div className={styles.toggleRow} onMouseEnter={handleMouseEnter} onMouseLeave={() => onHover(null)}>
      <label htmlFor={id} className={`${styles.toggleLabel} ${disabled ? styles.toggleLabelDisabled : ""}`}>
        {label}
      </label>
      <label className={styles.toggle}>
        <input
          id={id}
          type="checkbox"
          checked={value}
          disabled={disabled}
          onChange={(e) => onChange(flagKey, e.target.checked)}
          onClick={(e) => e.stopPropagation()}
        />
        <span className={styles.toggleSlider} />
      </label>
    </div>
  );
};

// ─── Main Panel ───────────────────────────────────────────────────────────────

const EffectsDebugPanel: React.FC = () => {
  const [flags, setFlags] = useState<EffectsDebugFlags>(() => effectsDebugStore.getFlags());
  const [isCompact, setIsCompact] = useState(true);
  const [isVisible, setIsVisible] = useState(true);
  const [hoveredDescription, setHoveredDescription] = useState<string | null>(null);
  const [hoveredLocation, setHoveredLocation] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<"left" | "right">("left");
  const [tooltipTop, setTooltipTop] = useState<number>(60);

  // Subscribe to store changes
  useEffect(() => {
    const unsub = effectsDebugStore.subscribe(setFlags);
    return unsub;
  }, []);

  // ─── Drag logic ─────────────────────────────────────────────────────────────
  const dragRef = useRef<HTMLDivElement>(null);
  const startPos = useRef({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const elementPos = useRef({ x: 0, y: 0 });
  const wasDragging = useRef(false);
  const hasDragged = useRef(false);

  // Initial position — below PerformanceDebug
  useEffect(() => {
    const el = dragRef.current;
    if (!el) return;
    el.style.position = "fixed";
    el.style.top = "70px";
    el.style.right = "16px";
    el.style.left = "auto";
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!isDragging.current) return;
      hasDragged.current = true;
      const el = dragRef.current;
      if (!el) return;
      const clientX = "touches" in e ? (e.touches[0]?.clientX ?? 0) : e.clientX;
      const clientY = "touches" in e ? (e.touches[0]?.clientY ?? 0) : e.clientY;
      if (!clientX && !clientY) return;
      const deltaX = clientX - startPos.current.x;
      const deltaY = clientY - startPos.current.y;
      const newX = elementPos.current.x + deltaX;
      const newY = elementPos.current.y + deltaY;
      el.style.left = `${newX}px`;
      el.style.top = `${newY}px`;
      el.style.right = "auto";
      startPos.current = { x: clientX, y: clientY };
      elementPos.current = { x: newX, y: newY };

      // Update tooltip position while dragging if tooltip is visible
      if (hoveredDescription) {
        const rect = el.getBoundingClientRect();
        const tooltipWidth = 240 + 12;
        const spaceLeft = rect.left;
        const spaceRight = window.innerWidth - rect.right;

        if (spaceLeft >= tooltipWidth) {
          setTooltipPosition("left");
        } else if (spaceRight >= tooltipWidth) {
          setTooltipPosition("right");
        }
      }
    },
    [hoveredDescription],
  );

  const handleMouseUp = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!isDragging.current) return;
      const el = dragRef.current;
      if (el) {
        const rect = el.getBoundingClientRect();
        elementPos.current = { x: rect.left, y: rect.top };
      }
      if (hasDragged.current) {
        wasDragging.current = true;
        setTimeout(() => {
          wasDragging.current = false;
        }, 0);
      }
      isDragging.current = false;
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("touchmove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchend", handleMouseUp);
      e.preventDefault();
    },
    [handleMouseMove],
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      const el = dragRef.current;
      if (!el) return;
      const clientX = "touches" in e ? (e.touches[0]?.clientX ?? 0) : e.clientX;
      const clientY = "touches" in e ? (e.touches[0]?.clientY ?? 0) : e.clientY;
      if (!clientX && !clientY) return;
      const rect = el.getBoundingClientRect();
      startPos.current = { x: clientX, y: clientY };
      elementPos.current = { x: rect.left, y: rect.top };
      isDragging.current = true;
      hasDragged.current = false;
      el.style.left = `${rect.left}px`;
      el.style.top = `${rect.top}px`;
      el.style.right = "auto";
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("touchmove", handleMouseMove, {
        passive: false,
      });
      document.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("touchend", handleMouseUp);
      e.preventDefault();
      e.stopPropagation();
    },
    [handleMouseMove, handleMouseUp],
  );

  // Cleanup
  useEffect(() => {
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("touchmove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchend", handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  // ─── Handlers ─────────────────────────────────────────────────────────────

  const handleToggle = useCallback((key: keyof EffectsDebugFlags, value: boolean) => {
    effectsDebugStore.setFlag(key, value);
  }, []);

  const handleTier = useCallback((tier: PerformanceTierOverride) => {
    effectsDebugStore.applyTierPreset(tier);
    window.location.reload();
  }, []);

  const handleReset = useCallback(() => {
    effectsDebugStore.reset();
    window.location.reload();
  }, []);

  const toggleCompact = useCallback((e: React.MouseEvent) => {
    if (wasDragging.current) return;
    e.stopPropagation();
    setIsCompact((p) => !p);
  }, []);

  const handleHover = useCallback((key: keyof EffectsDebugFlags | null, mouseY?: number) => {
    if (key && EFFECT_HELP[key]) {
      setHoveredDescription(EFFECT_HELP[key]!.desc);
      setHoveredLocation(EFFECT_HELP[key]!.loc);

      // Smart positioning: check available space
      const el = dragRef.current;
      if (el) {
        const rect = el.getBoundingClientRect();
        const tooltipWidth = 252; // 240 + 12 margin
        const spaceLeft = rect.left;
        const spaceRight = window.innerWidth - rect.right;

        // Prefer left, but switch to right if not enough space
        if (spaceLeft >= tooltipWidth) {
          setTooltipPosition("left");
        } else if (spaceRight >= tooltipWidth) {
          setTooltipPosition("right");
        } else {
          // Not enough space on either side, prefer right as fallback
          setTooltipPosition("right");
        }

        // Calculate tooltip position relative to hovered element
        if (mouseY !== undefined) {
          const relativeY = mouseY - rect.top;
          // Center tooltip vertically relative to the hovered row
          const tooltipHeight = 120; // Approximate height
          const centeredY = Math.max(40, relativeY - tooltipHeight / 2);
          setTooltipTop(centeredY);
        }
      }
    } else {
      setHoveredDescription(null);
      setHoveredLocation(null);
    }
  }, []);

  // ⚠️ ВАЖНО: useMediaQuery хуки должны быть ДО раннего возврата (правила React Hooks)
  const isTabletScreen = useMediaQuery("(max-width: 1023px)"); // Natively disables Grid3D
  const isMobileScreen = useMediaQuery("(max-width: 767px)"); // Natively disables Card Scatter/Gather

  if (!isVisible) return null;

  const tierBtns: {
    label: string;
    value: PerformanceTierOverride;
    cls: string;
  }[] = [
    { label: "Auto", value: "auto", cls: styles.tierBtnAuto ?? "" },
    { label: "Low", value: "low", cls: styles.tierBtnLow ?? "" },
    { label: "Mid", value: "medium", cls: styles.tierBtnMedium ?? "" },
    { label: "High", value: "high", cls: styles.tierBtnHigh ?? "" },
  ];

  return (
    <div ref={dragRef} className={`${styles.container} ${isCompact ? styles.containerCompact : ""}`}>
      {/* Floating Help Card - Aligned, compact and highly professional */}
      {hoveredDescription && (
        <div
          className={styles.floatingHelper}
          style={{
            ...(tooltipPosition === "left"
              ? { right: "100%", marginRight: "12px" }
              : { left: "100%", marginLeft: "12px" }),
            top: `${tooltipTop}px`,
            // Silky smooth vertical glide cubic-bezier
            transition: "left 0.2s ease, right 0.2s ease, top 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          {/* Header Row: Info Icon + Cyan Location metadata */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              marginBottom: "8px",
            }}
          >
            <Info size={13} style={{ color: "#00ffff", flexShrink: 0 }} />
            <span
              style={{
                fontSize: "0.62rem",
                color: "#00ffff",
                textTransform: "uppercase",
                whiteSpace: "nowrap",
              }}
            >
              {hoveredLocation}
            </span>
          </div>

          {/* Description Row */}
          <div
            style={{
              fontSize: "0.68rem",
              color: "rgba(255, 255, 255, 0.7)",
            }}
          >
            {hoveredDescription}
          </div>
        </div>
      )}

      {/* Header */}
      <div
        className={styles.header}
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
        onClick={toggleCompact}
      >
        <div className={styles.headerLeft}>
          <Move size={13} />
          <Sliders size={13} />
          <span>Effects Debug</span>
        </div>
        <div className={styles.headerActions}>
          <button
            className={styles.iconBtn}
            onClick={(e) => {
              e.stopPropagation();
              setIsCompact((p) => !p);
            }}
            title={isCompact ? "Expand" : "Collapse"}
          >
            {isCompact ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
          </button>
          <button
            className={styles.iconBtn}
            onClick={(e) => {
              e.stopPropagation();
              setIsVisible(false);
            }}
            title="Close"
          >
            <X size={15} />
          </button>
        </div>
      </div>

      {/* Body */}
      {!isCompact && (
        <div
          className={styles.body}
          onClick={(e) => e.stopPropagation()}
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
        >
          {/* ── Tier Preset ── */}
          <div className={styles.sectionLabel}>Tier Preset</div>
          <div className={styles.tierRow}>
            {tierBtns.map(({ label, value, cls }) => (
              <button
                key={value}
                className={`${styles.tierBtn} ${cls} ${flags.tierOverride === value ? styles.tierBtnActive : ""}`}
                onClick={() => handleTier(value)}
              >
                {label}
              </button>
            ))}
          </div>

          <div className={styles.divider} />

          {/* ── WebGL Fluid ── */}
          <div className={styles.sectionLabel}>WebGL Fluid</div>
          <ToggleRow
            label="Fluid effect (on/off)"
            flagKey="webglFluid"
            flags={flags}
            onChange={handleToggle}
            onHover={handleHover}
          />
          <div className={styles.subGroup}>
            <ToggleRow
              label="pressureIterations: 50 (vs 20)"
              flagKey="webglFluidPressureHigh"
              flags={flags}
              disabled={!flags.webglFluid}
              onChange={handleToggle}
              onHover={handleHover}
            />
            <ToggleRow
              label="sunrays shader"
              flagKey="webglFluidSunrays"
              flags={flags}
              disabled={!flags.webglFluid}
              onChange={handleToggle}
              onHover={handleHover}
            />
            <ToggleRow
              label="shading shader"
              flagKey="webglFluidShading"
              flags={flags}
              disabled={!flags.webglFluid}
              onChange={handleToggle}
              onHover={handleHover}
            />
          </div>

          <div className={styles.divider} />

          {/* ── Biotech Background Grid ── */}
          <div className={styles.sectionLabel}>Biotech Background Grid</div>
          <ToggleRow
            label="grid edge mask-fade"
            flagKey="grid3dMaskFade"
            flags={flags}
            onChange={handleToggle}
            onHover={handleHover}
          />

          <div className={styles.divider} />

          {/* ── Grid3D ── only show if width >= 1024px */}
          {!isTabletScreen && (
            <>
              <div className={styles.sectionLabel}>Grid 3D (MorphingVideo)</div>
              <ToggleRow
                label="Grid3D (on/off)"
                flagKey="grid3d"
                flags={flags}
                onChange={handleToggle}
                onHover={handleHover}
              />
              <div className={styles.subGroup}>
                <ToggleRow
                  label="filter:blur on elements"
                  flagKey="grid3dFilterBlur"
                  flags={flags}
                  disabled={!flags.grid3d}
                  onChange={handleToggle}
                  onHover={handleHover}
                />
              </div>

              <div className={styles.divider} />
            </>
          )}

          {/* ── ScrollText ── */}
          <div className={styles.sectionLabel}>ScrollText</div>
          <ToggleRow
            label="Word-by-word animation (vs opacity)"
            flagKey="scrollTextWordByWord"
            flags={flags}
            onChange={handleToggle}
            onHover={handleHover}
          />

          <div className={styles.divider} />

          {/* ── Scroll Number ── Independent parameter (NOT nested under ScrollText) */}
          <div className={styles.sectionLabel}>Scroll Number</div>
          <ToggleRow
            label="Scroll number filling"
            flagKey="scrollNumberAnimation"
            flags={flags}
            onChange={handleToggle}
            onHover={handleHover}
          />

          <div className={styles.divider} />

          {/* ── BlockVideo ── */}
          <div className={styles.sectionLabel}>BlockVideo translateZ</div>
          <ToggleRow
            label="translateZ ±400 (vs ±200)"
            flagKey="blockVideoTranslateZHigh"
            flags={flags}
            onChange={handleToggle}
            onHover={handleHover}
          />

          <div className={styles.sectionLabel}>Video Central Progress Orb</div>
          <ToggleRow
            label="Progress Orb (on/off)"
            flagKey="videoProgressOrb"
            flags={flags}
            onChange={handleToggle}
            onHover={handleHover}
          />

          <div className={styles.sectionLabel}>Morphing Background</div>
          <ToggleRow
            label="Background elements (on/off)"
            flagKey="morphingBackground"
            flags={flags}
            onChange={handleToggle}
            onHover={handleHover}
          />
          <div className={styles.divider} />

          <div className={styles.sectionLabel}>Render Video Blocks 01/02/03</div>
          <ToggleRow
            label="Video blocks (on/off)"
            flagKey="renderVideoBlocks"
            flags={flags}
            onChange={handleToggle}
            onHover={handleHover}
          />

          <div className={styles.divider} />

          {/* ── MolecularNet ── */}
          <div className={styles.sectionLabel}>MolecularNet (Partnership)</div>
          <ToggleRow
            label="12 nodes (vs 7)"
            flagKey="molecularNetHighNodes"
            flags={flags}
            onChange={handleToggle}
            onHover={handleHover}
          />

          <div className={styles.divider} />

          {/* ── Cards ── only show if width >= 768px */}
          {!isMobileScreen && (
            <>
              <div className={styles.sectionLabel}>Cards (Products Section)</div>
              <ToggleRow
                label="Card scatter/gather on scroll"
                flagKey="cardScrollGather"
                flags={flags}
                onChange={handleToggle}
                onHover={handleHover}
              />

              <div className={styles.divider} />
            </>
          )}

          {/* ── Parallax Background ── */}
          <div className={styles.sectionLabel}>Parallax Background (sections 1,3,5)</div>
          <ToggleRow
            label="Parallax background (on/off)"
            flagKey="parallaxBackground"
            flags={flags}
            onChange={handleToggle}
            onHover={handleHover}
          />

          <div className={styles.divider} />

          {/* ── Global UI & Animations ── */}
          <div className={styles.sectionLabel}>Global UI & Animations</div>
          <ToggleRow
            label="Header glassmorphism"
            flagKey="headerGlass"
            flags={flags}
            onChange={handleToggle}
            onHover={handleHover}
          />
          <ToggleRow
            label="Premium page transitions"
            flagKey="premiumTransitions"
            flags={flags}
            onChange={handleToggle}
            onHover={handleHover}
          />
          <ToggleRow
            label="Aurora text animation"
            flagKey="auroraText"
            flags={flags}
            onChange={handleToggle}
            onHover={handleHover}
          />

          {/* ── Text Shimmer ── Independent parameter (NOT nested, only show if width >= 768px) */}
          {!isMobileScreen && (
            <ToggleRow
              label="Text shimmer animation"
              flagKey="textShineAnimation"
              flags={flags}
              onChange={handleToggle}
              onHover={handleHover}
            />
          )}

          {/* ── Reset ── */}
          <button className={styles.resetBtn} onClick={handleReset}>
            ↺ Reset all &amp; reload
          </button>
        </div>
      )}
    </div>
  );
};

export default EffectsDebugPanel;
