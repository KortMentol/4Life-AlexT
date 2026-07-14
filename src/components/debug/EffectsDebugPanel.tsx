/**
 * @module src/components/debug/EffectsDebugPanel
 * @description Настольная панель управления эффектами (DEV).
 * Полностью исправлен рендер древовидных зависимостей (sub-flags рендерятся строго под своими родителями).
 * @author Geminis AI & Kort
 * @version 7.4.0
 */

import { useMediaQuery } from "@/hooks";
import {
  EffectsDebugFlags,
  FLAGS_METADATA,
  PerformanceTierOverride,
  effectsDebugStore,
} from "@/utils/effectsDebug/effectsDebugStore";
import { Icons } from "@/utils/icons";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import styles from "./EffectsDebugPanel.module.css";

const CUSTOM_HELP: Record<string, { desc: string; loc: string }> = {
  "preset-current": {
    desc: "Custom configuration. Reflects your manually modified effect overrides.",
    loc: "Preset Modes",
  },
  "preset-low": {
    desc: "Preset for low-end hardware. Disables heavy WebGL, 3D grids, and complex animations to guarantee 60 FPS.",
    loc: "Preset Modes",
  },
  "preset-medium": {
    desc: "Preset for mid-range hardware. Balances visual aesthetics with performance, enabling core effects like shading.",
    loc: "Preset Modes",
  },
  "preset-high": {
    desc: "Preset for flagship systems. Enables full high-end visual suite, volumetric lighting, and physics.",
    loc: "Preset Modes",
  },
  "restore-preset": { desc: "Restores your last customized configuration preset.", loc: "System Tools" },
  "global-power": {
    desc: "Master Switch (Soft Bypass). Freezes all decorative animations and WebGL to measure baseline layout performance without losing your custom configurations.",
    loc: "System Power",
  },
};

const ToggleRow: React.FC<{
  label: string;
  flagKey: keyof EffectsDebugFlags;
  flags: EffectsDebugFlags;
  disabled?: boolean;
  onChange: (key: keyof EffectsDebugFlags, value: boolean) => void;
  onHover: (key: keyof EffectsDebugFlags | string | null, mouseY?: number) => void;
}> = ({ label, flagKey, flags, disabled = false, onChange, onHover }) => {
  const value = flags[flagKey] as boolean;
  const id = `efx-${flagKey}`;

  const handleMouseEnter = (e: React.MouseEvent) => {
    onHover(flagKey, e.clientY);
  };

  return (
    <div
      className={`${styles.toggleRow} ${disabled ? styles.toggleRowDisabled : ""}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => onHover(null)}
    >
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
  const location = useLocation();
  const [flags, setFlags] = useState<EffectsDebugFlags>(() => effectsDebugStore.getFlags());
  const [isCompact, setIsCompact] = useState(true);
  const [isVisible, setIsVisible] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
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

  useEffect(() => {
    const handleStart = () => setIsTransitioning(true);
    const handleEnd = () => setIsTransitioning(false);

    window.addEventListener("menu-transition-start", handleStart);
    window.addEventListener("menu-transition-complete", handleEnd);
    window.addEventListener("pop-transition-start", handleStart);
    window.addEventListener("pop-transition-complete", handleEnd);

    return () => {
      window.removeEventListener("menu-transition-start", handleStart);
      window.removeEventListener("menu-transition-complete", handleEnd);
      window.removeEventListener("pop-transition-start", handleStart);
      window.removeEventListener("pop-transition-complete", handleEnd);
    };
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

  const handleMouseUp = React.useCallback(
    (_e: MouseEvent | TouchEvent) => {
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
      document.addEventListener("touchmove", handleMouseMove, { passive: false });
      document.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("touchend", handleMouseUp);
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

  const handleHover = useCallback((key: keyof EffectsDebugFlags | string | null, mouseY?: number) => {
    if (!key) {
      setHoveredDescription(null);
      setHoveredLocation(null);
      return;
    }

    if (typeof key === "string" && key in CUSTOM_HELP) {
      const item = CUSTOM_HELP[key];
      if (item) {
        setHoveredDescription(item.desc);
        setHoveredLocation(item.loc);
      }
    } else if (FLAGS_METADATA[key as keyof typeof FLAGS_METADATA]) {
      const meta = FLAGS_METADATA[key as keyof typeof FLAGS_METADATA];
      if (meta) {
        setHoveredDescription(meta.desc);
        setHoveredLocation(meta.category);
      }
    } else {
      setHoveredDescription(null);
      setHoveredLocation(null);
      return;
    }

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
  }, []);

  const isMobileScreen = useMediaQuery("(max-width: 767px)");
  const currentPath = location.pathname;

  const activeGroups = useMemo(() => {
    const groups: Record<string, (keyof typeof FLAGS_METADATA)[]> = {};

    (Object.keys(FLAGS_METADATA) as (keyof typeof FLAGS_METADATA)[]).forEach((key) => {
      const meta = FLAGS_METADATA[key];
      if (!meta) return;

      const routeMatch = meta.routes.includes("all") || meta.routes.includes(currentPath as any);
      const deviceMatch = meta.device === "all" || meta.device === "desktop";

      if (routeMatch && deviceMatch) {
        if (!groups[meta.category]) {
          groups[meta.category] = [];
        }

        const groupArray = groups[meta.category];
        if (groupArray) {
          groupArray.push(key);
        }
      }
    });

    return groups;
  }, [currentPath]);

  if (!isVisible || isMobileScreen) return null;

  const tierBtns: { label: string; value: PerformanceTierOverride; key: string }[] = [
    { label: "Current", value: "current", key: "preset-current" },
    { label: "Low", value: "low", key: "preset-low" },
    { label: "Mid", value: "medium", key: "preset-medium" },
    { label: "High", value: "high", key: "preset-high" },
  ];

  return (
    <div
      ref={dragRef}
      className={`${styles.container} ${isCompact ? styles.containerCompact : ""}`}
      style={{
        display: "flex",
        flexDirection: "column",
        maxHeight: isCompact ? "36px" : "85vh",
        opacity: isTransitioning ? 0 : 1,
        pointerEvents: isTransitioning ? "none" : "auto",
        transition: "opacity 0.4s ease, transform 0.3s ease, max-height 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        overflow: isCompact ? "hidden" : "visible",
      }}
    >
      {hoveredDescription && !isCompact && (
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
            <Icons.Info size={13} style={{ color: "#00ffff", flexShrink: 0 }} />
            <span style={{ fontSize: "0.62rem", color: "#00ffff", textTransform: "uppercase", whiteSpace: "nowrap" }}>
              {hoveredLocation}
            </span>
          </div>
          <div style={{ fontSize: "0.68rem", color: "rgba(255, 255, 255, 0.7)" }}>{hoveredDescription}</div>
        </div>
      )}

      {/* Header */}
      <div className={styles.header} onMouseDown={handleMouseDown} onClick={toggleCompact} style={{ flexShrink: 0 }}>
        <div className={styles.headerLeft}>
          <Icons.Move size={13} />
          <Icons.Sliders size={13} />
          <span>Effects Debug ({flags.tierOverride})</span>
        </div>
        <div className={styles.headerActions}>
          <button
            className={styles.iconBtn}
            onClick={(e) => {
              e.stopPropagation();
              setIsCompact((p) => !p);
            }}
          >
            {isCompact ? <Icons.ChevronDown size={16} /> : <Icons.ChevronUp size={16} />}
          </button>
          <button
            className={styles.iconBtn}
            onClick={(e) => {
              e.stopPropagation();
              setIsVisible(false);
            }}
          >
            <Icons.X size={15} />
          </button>
        </div>
      </div>

      {/* Presets and Master Power */}
      {!isCompact && (
        <div
          style={{
            padding: "0.6rem 0.65rem 0.6rem 0.65rem",
            borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
            flexShrink: 0,
            background: "rgba(15, 23, 42, 0.95)",
          }}
        >
          <div className={styles.sectionLabel}>Preset Modes</div>
          <div className={styles.tierRow}>
            {tierBtns.map(({ label, value, key }) => (
              <button
                key={value}
                className={`${styles.tierBtn} ${styles.tierBtnAuto} ${flags.tierOverride === value ? styles.tierBtnActive : ""}`}
                onClick={() => handleTier(value)}
                onMouseEnter={(e) => handleHover(key, e.clientY)}
                onMouseLeave={() => handleHover(null)}
              >
                {label}
              </button>
            ))}
          </div>

          <button
            className={styles.resetBtn}
            disabled={isLastPresetDisabled}
            onClick={handleRestoreLastPreset}
            onMouseEnter={(e) => handleHover("restore-preset", e.clientY)}
            onMouseLeave={() => handleHover(null)}
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

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: "0.6rem",
              padding: "0.45rem 0.5rem",
              borderRadius: "0.5rem",
              background: flags.globalPower ? "rgba(6,212,255,0.04)" : "rgba(239,68,68,0.04)",
              border: flags.globalPower ? "1px solid rgba(6,212,255,0.18)" : "1px solid rgba(239,68,68,0.18)",
              transition: "all 0.25s ease",
              boxShadow: flags.globalPower ? "0 0 12px rgba(6,212,255,0.05)" : "none",
              cursor: "pointer",
            }}
            onClick={() => handleToggle("globalPower", !flags.globalPower)}
            onMouseEnter={(e) => handleHover("global-power", e.clientY)}
            onMouseLeave={() => handleHover(null)}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
              <span
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: flags.globalPower ? "#00ffff" : "#ef4444",
                  boxShadow: flags.globalPower ? "0 0 8px #00ffff" : "0 0 8px #ef4444",
                  transition: "all 0.25s ease",
                }}
              />
              <span
                style={{
                  fontSize: "0.65rem",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  color: flags.globalPower ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.35)",
                  transition: "color 0.25s ease",
                }}
              >
                Engine Power
              </span>
            </div>
            <label className={styles.toggle} style={{ width: 28, height: 16 }} onClick={(e) => e.stopPropagation()}>
              <input
                id="master-power-toggle"
                type="checkbox"
                checked={flags.globalPower}
                onChange={(e) => handleToggle("globalPower", e.target.checked)}
              />
              <span className={styles.toggleSlider} style={{ borderRadius: "8px" }} />
            </label>
          </div>
        </div>
      )}

      {/* Dynamic Sliders List */}
      {!isCompact && (
        <div
          className={styles.body}
          data-lenis-prevent
          style={{
            flexGrow: 1,
            overflowY: "auto",
            padding: "0.2rem 0.65rem 0.6rem 0.65rem",
          }}
          onClick={(e) => e.stopPropagation()}
          onWheel={(e) => e.stopPropagation()}
        >
          {Object.entries(activeGroups).map(([category, flagKeys]) => {
            if (!flagKeys) return null;

            const mainFlags = flagKeys.filter((k) => {
              const meta = FLAGS_METADATA[k];
              return meta && !meta.dependsOn;
            });

            return (
              <React.Fragment key={category}>
                <div className={styles.divider} />
                <div className={styles.sectionLabel}>{category}</div>

                {mainFlags.map((key) => {
                  const meta = FLAGS_METADATA[key];
                  if (!meta) return null;

                  // ─── РЕШЕНИЕ: Ищем зависимые суб-ползунки строго под их родителем ───
                  const childFlags = flagKeys.filter((k) => {
                    const m = FLAGS_METADATA[k];
                    return m && m.dependsOn === key;
                  });

                  return (
                    <React.Fragment key={key}>
                      <ToggleRow
                        label={meta.label}
                        flagKey={key}
                        flags={flags}
                        disabled={!flags.globalPower}
                        onChange={handleToggle}
                        onHover={handleHover}
                      />

                      {childFlags.length > 0 && (
                        <div className={styles.subGroup}>
                          {childFlags.map((childKey) => {
                            const childMeta = FLAGS_METADATA[childKey];
                            if (!childMeta) return null;
                            const isDisabled = !flags.globalPower || !flags[key];

                            return (
                              <ToggleRow
                                key={childKey}
                                label={childMeta.label}
                                flagKey={childKey}
                                flags={flags}
                                disabled={isDisabled}
                                onChange={handleToggle}
                                onHover={handleHover}
                              />
                            );
                          })}
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
              </React.Fragment>
            );
          })}

          <div className={styles.divider} />
          <button className={styles.resetBtn} onClick={handleReset}>
            ↺ Reset to Hardware Defaults
          </button>
        </div>
      )}
    </div>
  );
};

export default EffectsDebugPanel;
