/**
 * @module components/debug/EffectsDebugMobile
 * @description Сенсорная панель управления эффектами на мобильных (DEV).
 *
 * ИСПРАВЛЕНИЕ:
 * - Полностью удален неактивный ползунок `headerGlass`.
 *   Добавлены новые тумблеры `renderCardsBackground` и `renderHeader`.
 *
 * @author Kort
 * @version 5.1.0
 */

import { EffectsDebugFlags, PerformanceTierOverride, effectsDebugStore } from "@/utils/effectsDebug/effectsDebugStore";
import { ChevronDown, ChevronUp, Sliders, X } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import styles from "./EffectsDebugMobile.module.css";

const ToggleRowMobile: React.FC<{
  label: string;
  flagKey: keyof EffectsDebugFlags;
  flags: EffectsDebugFlags;
  onChange: (key: keyof EffectsDebugFlags, value: boolean) => void;
}> = ({ label, flagKey, flags, onChange }) => {
  const value = flags[flagKey] as boolean;
  const id = `efx-mob-${flagKey}`;

  const handleRowClick = () => {
    onChange(flagKey, !value);
  };

  return (
    <div className={styles.toggleRow} onClick={handleRowClick}>
      <span className={styles.toggleLabel}>{label}</span>
      <label className={styles.toggle} onClick={(e) => e.stopPropagation()}>
        <input id={id} type="checkbox" checked={value} onChange={(e) => onChange(flagKey, e.target.checked)} />
        <span className={styles.toggleSlider} />
      </label>
    </div>
  );
};

const EffectsDebugMobile: React.FC = () => {
  const [flags, setFlags] = useState<EffectsDebugFlags>(() => effectsDebugStore.getFlags());
  const [isCompact, setIsCompact] = useState(true);
  const [isVisible, setIsVisible] = useState(true);
  const [offsetY, setOffsetY] = useState(45);

  const [isLastPresetDisabled, setIsLastPresetDisabled] = useState(() => effectsDebugStore.isLastPresetDisabled());

  useEffect(() => {
    const unsub = effectsDebugStore.subscribe((newFlags) => {
      setFlags(newFlags);
      setIsLastPresetDisabled(effectsDebugStore.isLastPresetDisabled());
    });
    return unsub;
  }, []);

  useEffect(() => {
    const handleLayoutChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail.panel === "perf") {
        setOffsetY(customEvent.detail.isCompact ? 45 : 0);
      }
    };
    window.addEventListener("mobile-debug-layout-change", handleLayoutChange);
    return () => window.removeEventListener("mobile-debug-layout-change", handleLayoutChange);
  }, []);

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
    window.location.reload();
  }, []);

  const toggleCompact = useCallback(() => {
    setIsCompact((prev) => !prev);
  }, []);

  if (!isVisible) return null;

  const tierBtns: {
    label: string;
    value: PerformanceTierOverride;
  }[] = [
    { label: "Current", value: "current" },
    { label: "Low", value: "low" },
    { label: "Mid", value: "medium" },
    { label: "High", value: "high" },
  ];

  return (
    <div
      className={`${styles.container} ${isCompact ? styles.containerCompact : ""}`}
      style={{
        transform: isCompact ? `translateY(calc(100% - ${offsetY + 45}px))` : "translateY(0)",
        zIndex: isCompact ? 99997 : 99999,
      }}
    >
      {/* Header */}
      <div className={styles.header} onClick={toggleCompact}>
        <div className={styles.headerLeft}>
          <Sliders size={13} />
          <span>Effects Debug ({flags.tierOverride})</span>
        </div>
        <div className={styles.headerActions}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleCompact();
            }}
          >
            {isCompact ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsVisible(false);
            }}
          >
            <X size={15} />
          </button>
        </div>
      </div>

      {/* Body */}
      {!isCompact && (
        <div className={styles.body} data-lenis-prevent>
          <div className={styles.sectionLabel}>Performance Tier</div>
          <div className={styles.tierRow}>
            {tierBtns.map(({ label, value }) => (
              <button
                key={value}
                className={`${styles.tierBtn} ${flags.tierOverride === value ? styles.tierBtnActive : ""}`}
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

          {/* ─── TYPOGRAPHY ─── */}
          <div className={styles.sectionLabel}>Typography & Motion</div>
          <ToggleRowMobile
            label="Block Opacity Fade-in"
            flagKey="scrollTextBlockOpacity"
            flags={flags}
            onChange={handleToggle}
          />
          <ToggleRowMobile label="Aurora Text Animation" flagKey="auroraText" flags={flags} onChange={handleToggle} />

          <div className={styles.divider} />

          {/* ─── MEDIA & VIDEOS ─── */}
          <div className={styles.sectionLabel}>Video Blocks (01/02/03)</div>
          <ToggleRowMobile
            label="Render Video Blocks"
            flagKey="renderVideoBlocks"
            flags={flags}
            onChange={handleToggle}
          />
          <ToggleRowMobile
            label="Central Progress Orb"
            flagKey="videoProgressOrb"
            flags={flags}
            onChange={handleToggle}
          />

          <div className={styles.divider} />

          {/* ─── BACKGROUNDS & LAYERS ─── */}
          <div className={styles.sectionLabel}>Backgrounds & Grids</div>
          <ToggleRowMobile
            label="Morphing Background"
            flagKey="morphingBackground"
            flags={flags}
            onChange={handleToggle}
          />
          <ToggleRowMobile label="Grid Edge Mask Fade" flagKey="grid3dMaskFade" flags={flags} onChange={handleToggle} />
          <ToggleRowMobile
            label="Background glow (orbs)"
            flagKey="bgGlowLights"
            flags={flags}
            onChange={handleToggle}
          />
          <ToggleRowMobile
            label="Parallax BG (Sections 1,3,5)"
            flagKey="parallaxBackground"
            flags={flags}
            onChange={handleToggle}
          />

          <div className={styles.divider} />

          {/* ─── GLOBAL SYSTEM INTERACTION ─── */}
          <div className={styles.sectionLabel}>Global UI & Extras</div>
          <ToggleRowMobile
            label="Premium Nav Transitions"
            flagKey="premiumTransitions"
            flags={flags}
            onChange={handleToggle}
          />
          <ToggleRowMobile
            label="Partnership SVG Nodes (12v7)"
            flagKey="molecularNetHighNodes"
            flags={flags}
            onChange={handleToggle}
          />

          {/* ─── НОВЫЕ ТУМБЛЕРЫ ОТЛАДКИ КОНТЕЙНЕРОВ ─── */}
          <div className={styles.divider} />
          <div className={styles.sectionLabel}>Isolate Layout Containers</div>
          <ToggleRowMobile
            label="Render Cards Background"
            flagKey="renderCardsBackground"
            flags={flags}
            onChange={handleToggle}
          />
          <ToggleRowMobile
            label="Render Header Component"
            flagKey="renderHeader"
            flags={flags}
            onChange={handleToggle}
          />

          <button className={styles.resetBtn} onClick={handleReset}>
            ↺ Reset to Hardware Defaults
          </button>
        </div>
      )}
    </div>
  );
};

export default React.memo(EffectsDebugMobile);
