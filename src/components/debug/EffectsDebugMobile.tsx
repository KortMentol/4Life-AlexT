/**
 * @module components/debug/EffectsDebugMobile
 * @description Сенсорная панель управления эффектами на мобильных (DEV).
 *
 * ВНЕДРЕНО (ФАЗА 2):
 * - Топологический роутинг: ползунки группируются и выводятся по смысловому порядку сверху вниз.
 * - Device Filtering: панель автоматически отсекает все тяжелые десктопные ползунки.
 * - Stealth Mode: панель плавно растворяется при переходах, чтобы не ломать эстетику пелены.
 * - TS Safety: решены все конфликты со строгим режимом компиляции TypeScript.
 *
 * @author Geminis AI & Kort
 * @version 7.0.0
 */

import {
  EffectsDebugFlags,
  FLAGS_METADATA,
  PerformanceTierOverride,
  effectsDebugStore,
} from "@/utils/effectsDebug/effectsDebugStore";
import { ChevronDown, ChevronUp, Sliders, X } from "lucide-react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
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
    if (!disabled) {
      onChange(flagKey, !value);
    }
  };

  return (
    <div className={`${styles.toggleRow} ${disabled ? styles.toggleRowDisabled : ""}`} onClick={handleRowClick}>
      <span className={`${styles.toggleLabel} ${disabled ? styles.toggleLabelDisabled : ""}`}>{label}</span>
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
  const location = useLocation();
  const [flags, setFlags] = useState<EffectsDebugFlags>(() => effectsDebugStore.getFlags());
  const [isCompact, setIsCompact] = useState(true);
  const [isVisible, setIsVisible] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false); // Stealth mode
  const [offsetY, setOffsetY] = useState(45);

  const [isLastPresetDisabled, setIsLastPresetDisabled] = useState(() => effectsDebugStore.isLastPresetDisabled());

  // Подписка на стор флагов
  useEffect(() => {
    const unsub = effectsDebugStore.subscribe((newFlags) => {
      setFlags(newFlags);
      setIsLastPresetDisabled(effectsDebugStore.isLastPresetDisabled());
    });
    return unsub;
  }, []);

  // Синхронизация высоты с PerformanceDebugMobile
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

  // Stealth Mode: прячем панель при переходах
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

  const toggleCompact = useCallback(() => {
    setIsCompact((prev) => !prev);
  }, []);

  // --- УМНАЯ ФИЛЬТРАЦИЯ И ГРУППИРОВКА ---
  const currentPath = location.pathname;

  const activeGroups = useMemo(() => {
    const groups: Record<string, (keyof typeof FLAGS_METADATA)[]> = {};

    (Object.keys(FLAGS_METADATA) as (keyof typeof FLAGS_METADATA)[]).forEach((key) => {
      const meta = FLAGS_METADATA[key];
      if (!meta) return;

      // Оставляем флаги: Глобальные (all) или текущей страницы, И (устройства "all" или "mobile")
      const routeMatch = meta.routes.includes("all") || meta.routes.includes(currentPath as any);
      const deviceMatch = meta.device === "all" || meta.device === "mobile";

      if (routeMatch && deviceMatch) {
        if (!groups[meta.category]) {
          groups[meta.category] = [];
        }

        // Надежное добавление элемента без undefined-конфликтов
        const groupArray = groups[meta.category];
        if (groupArray) {
          groupArray.push(key);
        }
      }
    });

    return groups;
  }, [currentPath]);

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
        opacity: isTransitioning ? 0 : 1,
        pointerEvents: isTransitioning ? "none" : "auto",
        transition: "opacity 0.4s ease, transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
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
                    <ToggleRowMobile key={key} label={meta.label} flagKey={key} flags={flags} onChange={handleToggle} />
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
                        <ToggleRowMobile
                          key={key}
                          label={meta.label}
                          flagKey={key}
                          flags={flags}
                          disabled={isDisabled}
                          onChange={handleToggle}
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

export default React.memo(EffectsDebugMobile);
