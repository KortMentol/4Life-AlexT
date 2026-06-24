/**
 * @module components/debug/EffectsDebugMobile
 * @description Touch-optimized Effects Debug Panel with adaptive PC/Touch metadata and row filtering.
 * @author Kort
 * @version 1.1.0
 */

import { useMediaQuery } from "@/hooks";
import { EffectsDebugFlags, PerformanceTierOverride, effectsDebugStore } from "@/utils/effectsDebug/effectsDebugStore";
import { ChevronDown, ChevronUp, Sliders, X } from "lucide-react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import styles from "./EffectsDebugMobile.module.css";

const ToggleRowMobile: React.FC<{
  label: string;
  flagKey: keyof EffectsDebugFlags;
  flags: EffectsDebugFlags;
  disabled?: boolean;
  onChange: (key: keyof EffectsDebugFlags, value: boolean) => void;
}> = ({ label, flagKey, flags, disabled = false, onChange }) => {
  const value = flags[flagKey] as boolean;
  const id = `efx-mob-${flagKey}`;

  const handleRowClick = () => {
    if (disabled) return;
    onChange(flagKey, !value);
  };

  return (
    <div className={`${styles.toggleRow} ${disabled ? styles.toggleRowDisabled : ""}`} onClick={handleRowClick}>
      <span className={styles.toggleLabel}>{label}</span>
      <label className={styles.toggle} onClick={(e) => e.stopPropagation()}>
        <input
          id={id}
          type="checkbox"
          checked={value}
          disabled={disabled}
          onChange={(e) => onChange(flagKey, e.target.checked)}
        />
        <span className={styles.toggleSlider} />
      </label>
    </div>
  );
};

const EffectsDebugMobile: React.FC = () => {
  const [flags, setFlags] = useState<EffectsDebugFlags>(() => effectsDebugStore.getFlags());
  const [isCompact, setIsCompact] = useState(true);
  const [isVisible, setIsVisible] = useState(true);
  const [offsetY, setOffsetY] = useState(45); // Sits on top of PerformanceDebug (45px height)

  // WebGPU-level 2026 platform check: True mobile touch device vs PC simulated viewport
  const isPhysicalMobile = useMemo(() => {
    if (typeof navigator === "undefined") return false;
    return /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }, []);

  useEffect(() => {
    const unsub = effectsDebugStore.subscribe(setFlags);
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
    window.location.reload();
  }, []);

  const handleReset = useCallback(() => {
    effectsDebugStore.reset();
    window.location.reload();
  }, []);

  const toggleCompact = useCallback(() => {
    setIsCompact((prev) => !prev);
  }, []);

  const isTabletScreen = useMediaQuery("(max-width: 1023px)");
  const isMobileScreen = useMediaQuery("(max-width: 767px)");

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
    <div
      className={`${styles.container} ${isCompact ? styles.containerCompact : ""}`}
      style={{
        transform: isCompact ? `translateY(calc(100% - ${offsetY + 45}px))` : "translateY(0)",
        zIndex: isCompact ? 99998 : 99999,
      }}
    >
      {/* Header */}
      <div className={styles.header} onClick={toggleCompact}>
        <div className={styles.headerLeft}>
          <Sliders size={13} />
          <span>Effects Debug ({isPhysicalMobile ? "Touch" : "PC"})</span>
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
        <div className={styles.body}>
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

          {/* Render WebGL & 3D CSS effects ONLY on PC viewport simulation */}
          {!isPhysicalMobile && (
            <>
              <div className={styles.sectionLabel}>WebGL Fluid</div>
              <ToggleRowMobile
                label="Fluid effect (on/off)"
                flagKey="webglFluid"
                flags={flags}
                onChange={handleToggle}
              />
              <div className={styles.subGroup}>
                <ToggleRowMobile
                  label="pressureIterations: 50 (vs 20)"
                  flagKey="webglFluidPressureHigh"
                  flags={flags}
                  disabled={!flags.webglFluid}
                  onChange={handleToggle}
                />
                <ToggleRowMobile
                  label="sunrays shader"
                  flagKey="webglFluidSunrays"
                  flags={flags}
                  disabled={!flags.webglFluid}
                  onChange={handleToggle}
                />
                <ToggleRowMobile
                  label="shading shader"
                  flagKey="webglFluidShading"
                  flags={flags}
                  disabled={!flags.webglFluid}
                  onChange={handleToggle}
                />
              </div>

              <div className={styles.divider} />

              {/* ── Grid3D ── only show if width >= 1024px */}
              {!isTabletScreen && (
                <>
                  <div className={styles.sectionLabel}>Grid 3D (MorphingVideo)</div>
                  <ToggleRowMobile label="Grid3D (on/off)" flagKey="grid3d" flags={flags} onChange={handleToggle} />
                  <div className={styles.subGroup}>
                    <ToggleRowMobile
                      label="filter:blur on elements"
                      flagKey="grid3dFilterBlur"
                      flags={flags}
                      disabled={!flags.grid3d}
                      onChange={handleToggle}
                    />
                  </div>

                  <div className={styles.divider} />
                </>
              )}

              <div className={styles.sectionLabel}>ScrollText</div>
              <ToggleRowMobile
                label="Word-by-word animation (vs opacity)"
                flagKey="scrollTextWordByWord"
                flags={flags}
                onChange={handleToggle}
              />

              <div className={styles.divider} />

              <div className={styles.sectionLabel}>BlockVideo translateZ</div>
              <ToggleRowMobile
                label="translateZ ±400 (vs ±200)"
                flagKey="blockVideoTranslateZHigh"
                flags={flags}
                onChange={handleToggle}
              />

              <div className={styles.divider} />
            </>
          )}

          {/* Video Central Progress Orb — показываем на ВСЕХ устройствах (и мобильных, и ПК) */}
          <div className={styles.sectionLabel}>Video Central Progress Orb</div>
          <ToggleRowMobile
            label="Progress Orb (on/off)"
            flagKey="videoProgressOrb"
            flags={flags}
            onChange={handleToggle}
          />

          <div className={styles.sectionLabel}>Render Video Blocks 01/02/03</div>
          <ToggleRowMobile
            label="Video blocks (on/off)"
            flagKey="renderVideoBlocks"
            flags={flags}
            onChange={handleToggle}
          />

          <div className={styles.divider} />

          {/* Scroll Number filling - Independent parameter, shown on BOTH PC and mobile */}
          <div className={styles.sectionLabel}>Scroll Number</div>
          <ToggleRowMobile
            label="Scroll number filling"
            flagKey="scrollNumberAnimation"
            flags={flags}
            onChange={handleToggle}
          />

          <div className={styles.divider} />

          <div className={styles.sectionLabel}>MolecularNet (Partnership)</div>
          <ToggleRowMobile
            label="12 nodes (vs 7)"
            flagKey="molecularNetHighNodes"
            flags={flags}
            onChange={handleToggle}
          />

          <div className={styles.divider} />

          {/* Cards scatter/gather — only show on PC viewports */}
          {!isPhysicalMobile && !isMobileScreen && (
            <>
              <div className={styles.sectionLabel}>Cards (Products Section)</div>
              <ToggleRowMobile
                label="Card scatter/gather on scroll"
                flagKey="cardScrollGather"
                flags={flags}
                onChange={handleToggle}
              />
              <div className={styles.divider} />
            </>
          )}

          <div className={styles.sectionLabel}>Parallax Background (sections 1,3,5)</div>
          <ToggleRowMobile
            label="Parallax background (on/off)"
            flagKey="parallaxBackground"
            flags={flags}
            onChange={handleToggle}
          />

          <div className={styles.divider} />

          <div className={styles.sectionLabel}>Global UI & Animations</div>
          <ToggleRowMobile label="Header glassmorphism" flagKey="headerGlass" flags={flags} onChange={handleToggle} />
          <ToggleRowMobile
            label="Premium page transitions"
            flagKey="premiumTransitions"
            flags={flags}
            onChange={handleToggle}
          />
          <ToggleRowMobile label="Aurora text animation" flagKey="auroraText" flags={flags} onChange={handleToggle} />

          {/* Text Shimmer — Independent parameter, only show if width >= 768px on PC */}
          {!isPhysicalMobile && !isMobileScreen && (
            <ToggleRowMobile
              label="Text shimmer animation"
              flagKey="textShineAnimation"
              flags={flags}
              onChange={handleToggle}
            />
          )}

          <button className={styles.resetBtn} onClick={handleReset}>
            ↺ Reset all &amp; reload
          </button>
        </div>
      )}
    </div>
  );
};

export default React.memo(EffectsDebugMobile);
