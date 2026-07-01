/**
 * @module src/components/debug/EffectsDebugPanel
 * @description Настольная панель управления эффектами (DEV).
 * Показывает активный режим в заголовке. Поддерживает восстановление "Last Preset".
 * Содержит атрибут `data-lenis-prevent` для блокировки скролла подлежащей страницы.
 * Все названия параметров переведены на английский язык для консистентности системы.
 *
 * @author Kort
 * @version 5.2.1
 */

import { useMediaQuery } from "@/hooks";
import { EffectsDebugFlags, PerformanceTierOverride, effectsDebugStore } from "@/utils/effectsDebug/effectsDebugStore";
import { ChevronDown, ChevronUp, Info, Move, Sliders, X } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import styles from "./EffectsDebugPanel.module.css";

// ─── Effect Help Data — All translated to English ─────────────────────────────

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
    desc: "Applies a high-performance CSS mask-image linear gradient on the static wrapper to smoothly fade grid boundaries.",
    loc: "HomePage Grid Background",
  },
  morphingBackground: {
    desc: "Renders the heavy biotech grid, glowing orbs, and noise overlay in the MorphingVideoSection background.",
    loc: "MorphingVideoSection Background",
  },
  scrollTextBlur: {
    desc: "High-performance GSAP ScrollTrigger typography parser animating word opacity, blur (6px) and skew per scroll frame.",
    loc: "HomePage Text Sections",
  },
  scrollTextOpacity: {
    desc: "Lightweight GSAP ScrollTrigger typography parser animating word opacity only. Completely safe for standard office PCs.",
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
    desc: "Direct-DOM calculated circular SVG progress tracker and play indicator in the center of the card.",
    loc: "HomePage Video Blocks",
  },
  renderVideoBlocks: {
    desc: "Globally enables or disables all three video blocks (01/02/03). Zero FPS cost when disabled.",
    loc: "HomePage Video Blocks",
  },
  molecularNetHighNodes: {
    desc: "Scales dynamic SVG vertices to 12 nodes with connection lines and custom orbital drift physics.",
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
    desc: "Shimmer text shine animation on the header name text.",
    loc: "Global Header Names",
  },
  bgGlowLights: {
    desc: "Toggles the ambient volumetric glowing circles (cyan and blue) in the background.",
    loc: "HomePage & MorphingVideoSection Background",
  },
};

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

const EffectsDebugPanel: React.FC = () => {
  const [flags, setFlags] = useState<EffectsDebugFlags>(() => effectsDebugStore.getFlags());
  const [isCompact, setIsCompact] = useState(true);
  const [isVisible, setIsVisible] = useState(true);
  const [hoveredDescription, setHoveredDescription] = useState<string | null>(null);
  const [hoveredLocation, setHoveredLocation] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<"left" | "right">("left");
  const [tooltipTop, setTooltipTop] = useState<number>(60);

  const [isLastPresetDisabled, setIsLastPresetDisabled] = useState(() => effectsDebugStore.isLastPresetDisabled());

  useEffect(() => {
    const unsub = effectsDebugStore.subscribe((newFlags) => {
      setFlags(newFlags);
      setIsLastPresetDisabled(effectsDebugStore.isLastPresetDisabled());
    });
    return unsub;
  }, []);

  const dragRef = useRef<HTMLDivElement>(null);
  const startPos = useRef({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const elementPos = useRef({ x: 0, y: 0 });
  const wasDragging = useRef(false);
  const hasDragged = useRef(false);

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
      if (clientX === undefined || clientY === undefined) return;
      const deltaX = clientX - startPos.current.x;
      const deltaY = clientY - startPos.current.y;
      const newX = elementPos.current.x + deltaX;
      const newY = elementPos.current.y + deltaY;
      el.style.left = `${newX}px`;
      el.style.top = `${newY}px`;
      el.style.right = "auto";
      startPos.current = { x: clientX, y: clientY };
      elementPos.current = { x: newX, y: newY };

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
      if (clientX === undefined || clientY === undefined) return;
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

  useEffect(() => {
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("touchmove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchend", handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  const handleToggle = useCallback((key: keyof EffectsDebugFlags, value: boolean) => {
    effectsDebugStore.setFlag(key, value);
  }, []);

  const handleTier = useCallback((tier: PerformanceTierOverride) => {
    effectsDebugStore.applyTierPreset(tier);
  }, []);

  const handleRestoreLastPreset = useCallback(() => {
    effectsDebugStore.restoreLastPreset();
  }, []);

  const handleReset = useCallback(() => {
    effectsDebugStore.reset();
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

      const el = dragRef.current;
      if (el) {
        const rect = el.getBoundingClientRect();
        const tooltipWidth = 252;
        const spaceLeft = rect.left;
        const spaceRight = window.innerWidth - rect.right;

        if (spaceLeft >= tooltipWidth) {
          setTooltipPosition("left");
        } else if (spaceRight >= tooltipWidth) {
          setTooltipPosition("right");
        } else {
          setTooltipPosition("right");
        }

        if (mouseY !== undefined) {
          const relativeY = mouseY - rect.top;
          const tooltipHeight = 120;
          const centeredY = Math.max(40, relativeY - tooltipHeight / 2);
          setTooltipTop(centeredY);
        }
      }
    } else {
      setHoveredDescription(null);
      setHoveredLocation(null);
    }
  }, []);

  const isTabletScreen = useMediaQuery("(max-width: 1023px)");
  const isMobileScreen = useMediaQuery("(max-width: 767px)");

  if (!isVisible) return null;

  const tierBtns: {
    label: string;
    value: PerformanceTierOverride;
    cls: string;
  }[] = [
    { label: "Current", value: "current", cls: styles.tierBtnAuto ?? "" },
    { label: "Low", value: "low", cls: styles.tierBtnLow ?? "" },
    { label: "Mid", value: "medium", cls: styles.tierBtnMedium ?? "" },
    { label: "High", value: "high", cls: styles.tierBtnHigh ?? "" },
  ];

  return (
    <div ref={dragRef} className={`${styles.container} ${isCompact ? styles.containerCompact : ""}`}>
      {hoveredDescription && (
        <div
          className={styles.floatingHelper}
          style={{
            ...(tooltipPosition === "left"
              ? { right: "100%", marginRight: "12px" }
              : { left: "100%", marginLeft: "12px" }),
            top: `${tooltipTop}px`,
            transition: "left 0.2s ease, right 0.2s ease, top 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
            <Info size={13} style={{ color: "#00ffff", flexShrink: 0 }} />
            <span style={{ fontSize: "0.62rem", color: "#00ffff", textTransform: "uppercase", whiteSpace: "nowrap" }}>
              {hoveredLocation}
            </span>
          </div>
          <div style={{ fontSize: "0.68rem", color: "rgba(255, 255, 255, 0.7)" }}>{hoveredDescription}</div>
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
          <span>Effects Debug ({flags.tierOverride})</span>
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

      {!isCompact && (
        <div
          className={styles.body}
          data-lenis-prevent
          onClick={(e) => e.stopPropagation()}
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
        >
          <div className={styles.sectionLabel}>Preset Modes</div>
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

          <button
            className={styles.resetBtn}
            disabled={isLastPresetDisabled}
            onClick={handleRestoreLastPreset}
            style={{
              marginTop: "0.2rem",
              marginBottom: "0.6rem",
              opacity: isLastPresetDisabled ? 0.35 : 1,
              cursor: isLastPresetDisabled ? "not-allowed" : "pointer",
              border: isLastPresetDisabled ? "1px dashed rgba(255,255,255,0.08)" : "1px solid rgba(0,212,255,0.3)",
              color: isLastPresetDisabled ? "rgba(255,255,255,0.3)" : "#00ffff",
              background: isLastPresetDisabled ? "transparent" : "rgba(0,212,255,0.05)",
            }}
          >
            {isLastPresetDisabled ? "Last Preset (Empty)" : "↺ Restore Last Preset"}
          </button>

          <div className={styles.divider} />

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

          <div className={styles.sectionLabel}>Biotech Background Grid</div>
          <ToggleRow
            label="grid edge mask-fade"
            flagKey="grid3dMaskFade"
            flags={flags}
            onChange={handleToggle}
            onHover={handleHover}
          />
          {/* КРИТИЧЕСКИЙ ФИКС: Название переведено на английский язык */}
          <ToggleRow
            label="Background glow (orbs)"
            flagKey="bgGlowLights"
            flags={flags}
            onChange={handleToggle}
            onHover={handleHover}
          />

          <div className={styles.divider} />

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

          <div className={styles.sectionLabel}>ScrollText</div>
          <ToggleRow
            label="Word-by-word (Blur)"
            flagKey="scrollTextBlur"
            flags={flags}
            onChange={handleToggle}
            onHover={handleHover}
          />
          <ToggleRow
            label="Word-by-word (Opacity)"
            flagKey="scrollTextOpacity"
            flags={flags}
            onChange={handleToggle}
            onHover={handleHover}
          />

          <div className={styles.divider} />

          <div className={styles.sectionLabel}>Scroll Number</div>
          <ToggleRow
            label="Scroll number filling"
            flagKey="scrollNumberAnimation"
            flags={flags}
            onChange={handleToggle}
            onHover={handleHover}
          />

          <div className={styles.divider} />

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

          <div className={styles.sectionLabel}>MolecularNet (Partnership)</div>
          <ToggleRow
            label="12 nodes (vs 7)"
            flagKey="molecularNetHighNodes"
            flags={flags}
            onChange={handleToggle}
            onHover={handleHover}
          />

          <div className={styles.divider} />

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

          <div className={styles.sectionLabel}>Parallax Background (sections 1,3,5)</div>
          <ToggleRow
            label="Parallax background (on/off)"
            flagKey="parallaxBackground"
            flags={flags}
            onChange={handleToggle}
            onHover={handleHover}
          />

          <div className={styles.divider} />

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

          {!isMobileScreen && (
            <ToggleRow
              label="Text shimmer animation"
              flagKey="textShineAnimation"
              flags={flags}
              onChange={handleToggle}
              onHover={handleHover}
            />
          )}

          <button className={styles.resetBtn} onClick={handleReset}>
            ↺ Reset to Hardware Defaults
          </button>
        </div>
      )}
    </div>
  );
};

export default EffectsDebugPanel;
