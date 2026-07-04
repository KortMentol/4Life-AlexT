/**
 * @module src/components/debug/EffectsDebugPanel
 * @description Настольная панель управления эффектами (DEV).
 * Показывает активный режим в заголовке. Поддерживает восстановление "Last Preset".
 * Содержит атрибут `data-lenis-prevent` для блокировки скролла подлежащей страницы.
 *
 * ВНЕДРЕНО (ФАЗА 2):
 * - Топологический роутинг: группы формируются динамически на основе FLAGS_METADATA
 *   и выводятся сверху вниз по сайту.
 * - Device Filtering: панель игнорирует мобильные ползунки.
 * - Stealth Mode: исчезает при переходах (router transitions).
 * - "noUncheckedIndexedAccess" Safety: полная совместимость со строгими правилами TypeScript.
 *
 * @author Geminis AI & Kort
 * @version 7.0.0
 */

import { useMediaQuery } from "@/hooks";
import {
  EffectsDebugFlags,
  FLAGS_METADATA,
  PerformanceTierOverride,
  effectsDebugStore,
} from "@/utils/effectsDebug/effectsDebugStore";
import { ChevronDown, ChevronUp, Info, Move, Sliders, X } from "lucide-react";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import styles from "./EffectsDebugPanel.module.css";

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

  // Подписка на стор
  useEffect(() => {
    const unsub = effectsDebugStore.subscribe((newFlags) => {
      setFlags(newFlags);
      setIsLastPresetDisabled(effectsDebugStore.isLastPresetDisabled());
    });
    return unsub;
  }, []);

  // Stealth Mode: плавное скрытие на время переходов
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

  const handleHover = useCallback((key: keyof EffectsDebugFlags | null, mouseY?: number) => {
    if (key && FLAGS_METADATA[key as keyof typeof FLAGS_METADATA]) {
      const meta = FLAGS_METADATA[key as keyof typeof FLAGS_METADATA];
      if (!meta) return;
      setHoveredDescription(meta.desc);
      setHoveredLocation(meta.category);

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

  const isMobileScreen = useMediaQuery("(max-width: 767px)");

  // --- УМНАЯ ФИЛЬТРАЦИЯ И ГРУППИРОВКА ---
  const currentPath = location.pathname;

  const activeGroups = useMemo(() => {
    const groups: Record<string, (keyof typeof FLAGS_METADATA)[]> = {};

    (Object.keys(FLAGS_METADATA) as (keyof typeof FLAGS_METADATA)[]).forEach((key) => {
      const meta = FLAGS_METADATA[key];
      if (!meta) return;

      // Оставляем флаги: Глобальные (all) или текущей страницы, И (устройства "all" или "desktop")
      const routeMatch = meta.routes.includes("all") || meta.routes.includes(currentPath as any);
      const deviceMatch = meta.device === "all" || meta.device === "desktop";

      if (routeMatch && deviceMatch) {
        if (!groups[meta.category]) {
          groups[meta.category] = [];
        }

        // Надежное извлечение массива и добавление элемента без undefined-конфликтов
        const groupArray = groups[meta.category];
        if (groupArray) {
          groupArray.push(key);
        }
      }
    });

    return groups;
  }, [currentPath]);

  if (!isVisible || isMobileScreen) return null;

  const tierBtns: { label: string; value: PerformanceTierOverride; cls: string }[] = [
    { label: "Current", value: "current", cls: styles.tierBtnAuto ?? "" },
    { label: "Low", value: "low", cls: styles.tierBtnLow ?? "" },
    { label: "Mid", value: "medium", cls: styles.tierBtnMedium ?? "" },
    { label: "High", value: "high", cls: styles.tierBtnHigh ?? "" },
  ];

  return (
    <div
      ref={dragRef}
      className={`${styles.container} ${isCompact ? styles.containerCompact : ""}`}
      style={{
        opacity: isTransitioning ? 0 : 1,
        pointerEvents: isTransitioning ? "none" : "auto",
        transition: "opacity 0.4s ease, transform 0.3s ease",
      }}
    >
      {/* Tooltip Overlay */}
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
            <Info size={13} style={{ color: "#00ffff", flexShrink: 0 }} />
            <span style={{ fontSize: "0.62rem", color: "#00ffff", textTransform: "uppercase", whiteSpace: "nowrap" }}>
              {hoveredLocation}
            </span>
          </div>
          <div style={{ fontSize: "0.68rem", color: "rgba(255, 255, 255, 0.7)" }}>{hoveredDescription}</div>
        </div>
      )}

      {/* Header */}
      <div className={styles.header} onMouseDown={handleMouseDown} onClick={toggleCompact}>
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
          >
            {isCompact ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
          </button>
          <button
            className={styles.iconBtn}
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
        <div
          className={styles.body}
          data-lenis-prevent
          onClick={(e) => e.stopPropagation()}
          onWheel={(e) => e.stopPropagation()}
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

          {/* ДИНАМИЧЕСКИЙ РЕНДЕР ГРУПП НА ОСНОВЕ МЕТАДАННЫХ */}
          {Object.entries(activeGroups).map(([category, flagKeys]) => {
            if (!flagKeys) return null;

            const mainFlags = flagKeys.filter((k) => {
              const meta = FLAGS_METADATA[k];
              return meta && !meta.dependsOn;
            });

            const subFlags = flagKeys.filter((k) => {
              const meta = FLAGS_METADATA[k];
              return meta && meta.dependsOn;
            });

            return (
              <React.Fragment key={category}>
                <div className={styles.divider} />
                <div className={styles.sectionLabel}>{category}</div>

                {mainFlags.map((key) => {
                  const meta = FLAGS_METADATA[key];
                  if (!meta) return null;
                  return (
                    <ToggleRow
                      key={key}
                      label={meta.label}
                      flagKey={key}
                      flags={flags}
                      onChange={handleToggle}
                      onHover={handleHover}
                    />
                  );
                })}

                {subFlags.length > 0 && (
                  <div className={styles.subGroup}>
                    {subFlags.map((key) => {
                      const meta = FLAGS_METADATA[key];
                      if (!meta) return null;

                      const dependency = meta.dependsOn;
                      const isDisabled = dependency ? !flags[dependency] : false;

                      return (
                        <ToggleRow
                          key={key}
                          label={meta.label}
                          flagKey={key}
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
