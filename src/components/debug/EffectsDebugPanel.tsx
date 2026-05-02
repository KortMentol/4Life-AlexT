/**
 * @module src/components/debug/EffectsDebugPanel
 * @description GUI-панель для тестирования HIGH-тир эффектов.
 * Позволяет переключать тир (low/medium/high/auto) и отдельные эффекты.
 * Только DEV режим. Позиционируется под PerformanceDebug.
 *
 * @author Kort
 * @version 1.0.0
 */

import {
  EffectsDebugFlags,
  PerformanceTierOverride,
  effectsDebugStore,
} from "@/utils/effectsDebug/effectsDebugStore";
import { ChevronDown, ChevronUp, Move, Sliders, X } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import styles from "./EffectsDebugPanel.module.css";

// ─── Toggle Row ───────────────────────────────────────────────────────────────

const ToggleRow: React.FC<{
  label: string;
  flagKey: keyof EffectsDebugFlags;
  flags: EffectsDebugFlags;
  disabled?: boolean;
  onChange: (key: keyof EffectsDebugFlags, value: boolean) => void;
}> = ({ label, flagKey, flags, disabled = false, onChange }) => {
  const value = flags[flagKey] as boolean;
  const id = `efx-${flagKey}`;

  return (
    <div className={styles.toggleRow}>
      <label
        htmlFor={id}
        className={`${styles.toggleLabel} ${disabled ? styles.toggleLabelDisabled : ""}`}
      >
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
  const [flags, setFlags] = useState<EffectsDebugFlags>(() =>
    effectsDebugStore.getFlags(),
  );
  const [isCompact, setIsCompact] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  // Подписываемся на изменения store
  useEffect(() => {
    const unsub = effectsDebugStore.subscribe(setFlags);
    return unsub;
  }, []);

  // ─── Drag logic (копия из PerformanceDebug) ───────────────────────────────
  const dragRef = useRef<HTMLDivElement>(null);
  const startPos = useRef({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const elementPos = useRef({ x: 0, y: 0 });
  const wasDragging = useRef(false);
  const hasDragged = useRef(false);

  // Начальная позиция — под PerformanceDebug (примерно top: 4rem + высота панели + gap)
  useEffect(() => {
    const el = dragRef.current;
    if (!el) return;
    el.style.position = "fixed";
    el.style.top = "4rem";
    el.style.right = "calc(1rem + 320px + 0.5rem)"; // левее PerformanceDebug
    el.style.left = "auto";
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent | TouchEvent) => {
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
  }, []);

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

  const handleToggle = useCallback(
    (key: keyof EffectsDebugFlags, value: boolean) => {
      effectsDebugStore.setFlag(key, value);
    },
    [],
  );

  const handleTier = useCallback((tier: PerformanceTierOverride) => {
    effectsDebugStore.setFlag("tierOverride", tier);
    // Перезагружаем страницу — тир читается синхронно при инициализации
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
      ref={dragRef}
      className={`${styles.container} ${isCompact ? styles.containerCompact : ""}`}
    >
      {/* Header */}
      <div
        className={styles.header}
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
      >
        <div className={styles.headerLeft}>
          <Move size={13} />
          <Sliders size={13} />
          <span>Effects Debug</span>
        </div>
        <div className={styles.headerActions}>
          <button
            className={styles.iconBtn}
            onClick={toggleCompact}
            title={isCompact ? "Развернуть" : "Свернуть"}
          >
            {isCompact ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
          </button>
          <button
            className={styles.iconBtn}
            onClick={(e) => {
              e.stopPropagation();
              setIsVisible(false);
            }}
            title="Закрыть"
          >
            <X size={15} />
          </button>
        </div>
      </div>

      {/* Body */}
      {!isCompact && (
        <div className={styles.body} onClick={(e) => e.stopPropagation()}>
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
            label="Fluid эффект (вкл/выкл)"
            flagKey="webglFluid"
            flags={flags}
            onChange={handleToggle}
          />
          <div className={styles.subGroup}>
            <ToggleRow
              label="pressureIterations: 50 (vs 20)"
              flagKey="webglFluidPressureHigh"
              flags={flags}
              disabled={!flags.webglFluid}
              onChange={handleToggle}
            />
            <ToggleRow
              label="sunrays шейдер"
              flagKey="webglFluidSunrays"
              flags={flags}
              disabled={!flags.webglFluid}
              onChange={handleToggle}
            />
            <ToggleRow
              label="shading шейдер"
              flagKey="webglFluidShading"
              flags={flags}
              disabled={!flags.webglFluid}
              onChange={handleToggle}
            />
          </div>

          <div className={styles.divider} />

          {/* ── Grid3D ── */}
          <div className={styles.sectionLabel}>Grid 3D (MorphingVideo)</div>
          <ToggleRow
            label="Grid3D (вкл/выкл)"
            flagKey="grid3d"
            flags={flags}
            onChange={handleToggle}
          />
          <div className={styles.subGroup}>
            <ToggleRow
              label="filter:blur на элементах"
              flagKey="grid3dFilterBlur"
              flags={flags}
              disabled={!flags.grid3d}
              onChange={handleToggle}
            />
          </div>

          <div className={styles.divider} />

          {/* ── ScrollText ── */}
          <div className={styles.sectionLabel}>ScrollText</div>
          <ToggleRow
            label="Пословная анимация (vs opacity)"
            flagKey="scrollTextWordByWord"
            flags={flags}
            onChange={handleToggle}
          />

          <div className={styles.divider} />

          {/* ── BlockVideo ── */}
          <div className={styles.sectionLabel}>BlockVideo translateZ</div>
          <ToggleRow
            label="translateZ ±400 (vs ±200)"
            flagKey="blockVideoTranslateZHigh"
            flags={flags}
            onChange={handleToggle}
          />

          <div className={styles.divider} />

          {/* ── MolecularNet ── */}
          <div className={styles.sectionLabel}>MolecularNet (Partnership)</div>
          <ToggleRow
            label="12 nodes (vs 7)"
            flagKey="molecularNetHighNodes"
            flags={flags}
            onChange={handleToggle}
          />

          <div className={styles.divider} />

          {/* ── Cards Scroll Gather ── */}
          <div className={styles.sectionLabel}>Cards (Products Section)</div>
          <ToggleRow
            label="Разлёт/схождение при скролле"
            flagKey="cardScrollGather"
            flags={flags}
            onChange={handleToggle}
          />

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
