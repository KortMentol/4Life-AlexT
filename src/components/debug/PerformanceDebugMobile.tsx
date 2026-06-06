/**
 * @module components/debug/PerformanceDebugMobile
 * @description Highly optimized touch-friendly performance overlay.
 * @author Kort
 * @version 2.0.0
 */

import { DeviceSpecs, calculatePerformanceScore, detectDeviceSpecs } from "@/utils/devicePerformance/devicePerformance";
import { getTierOverride } from "@/utils/effectsDebug/effectsDebugStore"; // <-- FIX: Import missing function
import {
  Bug,
  ChevronDown,
  ChevronUp,
  Clock,
  Cpu,
  Gauge,
  HardDrive,
  PieChart,
  Smartphone,
  Star,
  X,
  Zap,
} from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import styles from "./PerformanceDebugMobile.module.css";

const PerformanceDebugMobile: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isCompact, setIsCompact] = useState(true);
  const [staticScore, setStaticScore] = useState(0);
  const [tier, setTier] = useState<"low" | "medium" | "high">("medium");
  const [deviceSpecs, setDeviceSpecs] = useState<DeviceSpecs>({
    ram: "Unknown",
    cpuCores: 0,
    cpuFrequency: "Unknown",
    gpu: "Unknown",
    webglVersion: "Unknown",
    screenResolution: "Unknown",
    pixelRatio: 1,
    touchSupport: false,
    connectionType: "Unknown",
  });

  // WebGPU-level 2026 platform check: True mobile touch device vs PC simulated viewport
  const isPhysicalMobile = React.useMemo(() => {
    if (typeof navigator === "undefined") return false;
    return /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }, []);

  // Direct DOM Refs for zero re-renders
  const fpsTextRef = useRef<HTMLSpanElement>(null);
  const ftTextRef = useRef<HTMLSpanElement>(null);
  const compactFpsTextRef = useRef<HTMLSpanElement>(null);
  const compactFtTextRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let animationId: number;
    let lastTime = performance.now();
    let lastFrameTime = performance.now();
    const frameTimeHistory: number[] = [];

    try {
      const specs = detectDeviceSpecs();
      setDeviceSpecs(specs);
      const { score, tier: hardwareTier } = calculatePerformanceScore(specs);
      setStaticScore(score);

      const override = getTierOverride();
      const finalTier = override !== "auto" ? override : hardwareTier;
      setTier(finalTier as "low" | "medium" | "high");
    } catch (error) {
      console.error("❌ Error initializing PerformanceDebug:", error);
    }

    const performanceLoop = () => {
      const currentTime = performance.now();
      const deltaTime = currentTime - lastFrameTime;
      frameTimeHistory.push(deltaTime);
      if (frameTimeHistory.length > 10) frameTimeHistory.shift();

      if (currentTime - lastTime >= 500) {
        const avgFrameTime = frameTimeHistory.reduce((a, b) => a + b, 0) / frameTimeHistory.length;
        const calculatedFps = Math.round(1000 / avgFrameTime);
        const calculatedFt = Math.round(avgFrameTime * 100) / 100;

        // Directly update DOM text values
        if (fpsTextRef.current) {
          fpsTextRef.current.textContent = String(calculatedFps);
          fpsTextRef.current.className = `${styles.metricValue} ${calculatedFps >= 50 ? styles.valueGood : calculatedFps >= 30 ? styles.valueWarning : styles.valueBad}`;
        }
        if (compactFpsTextRef.current) {
          compactFpsTextRef.current.textContent = String(calculatedFps);
          compactFpsTextRef.current.className = `${calculatedFps >= 50 ? styles.valueGood : calculatedFps >= 30 ? styles.valueWarning : styles.valueBad}`;
        }
        if (ftTextRef.current) ftTextRef.current.textContent = `${calculatedFt}ms`;
        if (compactFtTextRef.current) compactFtTextRef.current.textContent = `${calculatedFt}ms`;

        lastTime = currentTime;
      }
      lastFrameTime = currentTime;
      animationId = requestAnimationFrame(performanceLoop);
    };
    performanceLoop();

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, []);

  const toggleCompactMode = useCallback(() => {
    setIsCompact((prev) => !prev);
    // Notify the other panel that layout state has changed
    window.dispatchEvent(
      new CustomEvent("mobile-debug-layout-change", { detail: { isCompact: !isCompact, panel: "perf" } }),
    );
  }, [isCompact]);

  const getScoreColor = (score: number) => {
    if (score >= 75) return styles.valueGood;
    if (score >= 40) return styles.valueWarning;
    return styles.valueBad;
  };

  if (!isVisible) return null;

  return (
    <div className={`${styles.debugContainer} ${isCompact ? styles.compactMode : ""}`}>
      <div className={styles.debugHeader} onClick={toggleCompactMode} role="button" tabIndex={0}>
        {isCompact ? (
          <>
            <div className={styles.headerMetrics}>
              <div className={styles.headerTitle}>
                <Bug size={13} />
                <span>Perf ({isPhysicalMobile ? "Touch" : "PC"})</span>
              </div>
              <div className={styles.metricItemCompact} style={{ marginLeft: "auto" }}>
                <span className={styles.label}>FPS:</span>
                <span ref={compactFpsTextRef} className={styles.valueGood}>
                  --
                </span>
              </div>
              <div className={styles.metricItemCompact}>
                <span className={styles.label}>Frame:</span>
                <span ref={compactFtTextRef}>--ms</span>
              </div>
            </div>
            <div className={styles.headerActions}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleCompactMode();
                }}
              >
                <ChevronUp size={16} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsVisible(false);
                }}
              >
                <X size={16} />
              </button>
            </div>
          </>
        ) : (
          <>
            <div className={styles.headerTitle} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Bug size={14} />
              <span>Performance Debug ({isPhysicalMobile ? "Touch" : "PC"})</span>
            </div>
            <div className={styles.headerActions}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleCompactMode();
                }}
              >
                <ChevronDown size={16} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsVisible(false);
                }}
              >
                <X size={16} />
              </button>
            </div>
          </>
        )}
      </div>

      {!isCompact && (
        <div className={styles.debugBody}>
          <div className={styles.metricsGrid}>
            <div className={styles.metricItem}>
              <div className={styles.metricIcon}>
                <Gauge size={14} />
              </div>
              <span className={styles.metricLabel}>FPS</span>
              <span ref={fpsTextRef} className={`${styles.metricValue} ${styles.valueGood}`}>
                --
              </span>
            </div>
            <div className={styles.metricItem}>
              <div className={styles.metricIcon}>
                <Clock size={14} />
              </div>
              <span className={styles.metricLabel}>Frame</span>
              <span ref={ftTextRef} className={styles.metricValue}>
                --ms
              </span>
            </div>
            <div className={styles.metricItem} style={{ gridColumn: "span 2" }}>
              <div className={styles.metricIcon}>
                <Star size={14} />
              </div>
              <span className={styles.metricLabel}>Score</span>
              <span className={`${styles.metricValue} ${getScoreColor(staticScore)}`}>
                {staticScore} ({tier.toUpperCase()})
              </span>
            </div>
          </div>

          <div className={styles.sectionDivider} />

          <div className={styles.deviceInfoSection}>
            <div className={styles.infoRow}>
              <div className={styles.infoIcon}>
                <HardDrive size={14} />
              </div>
              <strong>RAM:</strong>
              <span className={styles.infoValue}>{deviceSpecs.ram}</span>
            </div>
            <div className={styles.infoRow}>
              <div className={styles.infoIcon}>
                <Cpu size={14} />
              </div>
              <strong>CPU:</strong>
              <span className={styles.infoValue}>{deviceSpecs.cpuCores} cores</span>
            </div>
            <div className={styles.infoRow}>
              <div className={styles.infoIcon}>
                <PieChart size={14} />
              </div>
              <strong>GPU:</strong>
              <span className={styles.infoValue}>{deviceSpecs.gpu}</span>
            </div>
            <div className={styles.infoRow}>
              <div className={styles.infoIcon}>
                <Zap size={14} />
              </div>
              <strong>WebGL:</strong>
              <span className={styles.infoValue}>{deviceSpecs.webglVersion}</span>
            </div>
            <div className={styles.infoRow}>
              <div className={styles.infoIcon}>
                <Smartphone size={14} />
              </div>
              <strong>Touch:</strong>
              <span className={styles.infoValue}>{deviceSpecs.touchSupport ? "Yes" : "No"}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(PerformanceDebugMobile);
