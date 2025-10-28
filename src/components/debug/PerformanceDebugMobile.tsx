import {
  DeviceSpecs,
  calculatePerformanceScore,
  detectDeviceSpecs,
} from "@/utils/devicePerformance/devicePerformance";
import {
  Bug,
  ChevronDown,
  ChevronUp,
  Clock,
  Cpu,
  Gauge,
  HardDrive,
  Info,
  PieChart,
  Smartphone,
  Star,
  X,
  Zap,
} from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import styles from "./PerformanceDebugMobile.module.css";

/**
 * @module components/debug/PerformanceDebugMobile
 * @description
 * `PerformanceDebugMobile` — это компактная, оптимизированная для сенсорных экранов версия плавающей UI-панели для мониторинга производительности.
 * Отображает ключевые метрики (FPS, время кадра, балл производительности) и адаптирована для мобильных устройств.
 *
 * @author Kort
 * @version 1.0.0
 *
 * @usage
 * Компонент используется в корневом файле приложения для отладки на мобильных устройствах:
 * 1. **`src/App.tsx` (строка 211):** Рендерится условно, когда `isMobile` имеет значение `true`, предоставляя оверлей с данными о производительности.
 *
 * @example
 * // Вставляется в App.tsx без пропсов
 * <PerformanceDebugMobile />
 */
const PerformanceDebugMobile: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isCompact, setIsCompact] = useState(true);
  const [fps, setFps] = useState(0);

  const [frameTime, setFrameTime] = useState(0);
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

  useEffect(() => {
    let animationId: number;
    let lastTime = performance.now();
    let lastFrameTime = performance.now();
    const frameTimeHistory: number[] = [];

    try {
      const specs = detectDeviceSpecs();
      setDeviceSpecs(specs);
      const { score, tier: detectedTier } = calculatePerformanceScore(specs);
      setStaticScore(score);
      setTier(detectedTier);
    } catch (error) {
      console.error("❌ Error initializing PerformanceDebug:", error);
    }

    const performanceLoop = () => {
      const currentTime = performance.now();
      const deltaTime = currentTime - lastFrameTime;
      frameTimeHistory.push(deltaTime);
      if (frameTimeHistory.length > 10) frameTimeHistory.shift();

      if (currentTime - lastTime >= 500) {
        const avgFrameTime =
          frameTimeHistory.reduce((a, b) => a + b, 0) / frameTimeHistory.length;
        setFps(Math.round(1000 / avgFrameTime));
        setFrameTime(Math.round(avgFrameTime * 100) / 100);
        lastTime = currentTime;
      }
      lastFrameTime = currentTime;
      animationId = requestAnimationFrame(performanceLoop);
    };
    performanceLoop();

    // Предотвращаем скролл фона при скролле дебагера
    const debugBody = document.querySelector(`.${styles.debugBody}`);
    if (debugBody) {
      const preventBackgroundScroll = (e: Event) => {
        e.stopPropagation();
      };
      debugBody.addEventListener('touchstart', preventBackgroundScroll, { passive: true });
      debugBody.addEventListener('touchmove', preventBackgroundScroll, { passive: true });
      
      return () => {
        if (animationId) cancelAnimationFrame(animationId);
        debugBody.removeEventListener('touchstart', preventBackgroundScroll);
        debugBody.removeEventListener('touchmove', preventBackgroundScroll);
      };
    }

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, []);

  const toggleCompactMode = useCallback(() => {
    setIsCompact((prev) => !prev);
  }, []);

  const getValueColor = (value: number) => {
    if (value >= 55) return styles.valueGood;
    if (value >= 40) return styles.valueWarning;
    return styles.valueBad;
  };

  const getScoreColor = (score: number) => {
    if (score >= 75) return styles.valueGood;
    if (score >= 40) return styles.valueWarning;
    return styles.valueBad;
  };

  if (!isVisible) return null;

  const containerClasses = `${styles.debugContainer} ${isCompact ? styles.compactMode : ""}`;

  return (
    <div className={containerClasses}>
      <div
        className={styles.debugHeader}
        onClick={toggleCompactMode}
        role="button"
        tabIndex={0}
        aria-expanded={!isCompact}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            e.stopPropagation();
            toggleCompactMode();
          }
        }}
      >
        {isCompact ? (
          <>
            <div className={styles.headerMetrics}>
              <div className={styles.metricItemCompact}>
                <span className={styles.label}>FPS:</span>
                <span className={`${styles.value} ${getValueColor(fps)}`}>
                  {fps}
                </span>
              </div>
              <div className={styles.metricItemCompact}>
                <span className={styles.label}>Frame:</span>
                <span className={styles.value}>{frameTime}ms</span>
              </div>
            </div>
            <div className={styles.headerActions}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleCompactMode();
                }}
              >
                {isCompact ? (
                  <ChevronUp size={20} />
                ) : (
                  <ChevronDown size={20} />
                )}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsVisible(false);
                }}
              >
                <X size={20} />
              </button>
            </div>
          </>
        ) : (
          <>
            <div
              className={styles.headerTitle}
              style={{ display: "flex", alignItems: "center", gap: 8 }}
            >
              <span className={styles.metricIcon}>
                <Bug size={18} />
              </span>
              <span>Performance Debug</span>
            </div>
            <div className={styles.headerActions}>
              <button
                onClick={(e) => {
                  e.stopPropagation(); /* TODO: setShowInfo(true) */
                }}
              >
                <Info size={18} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleCompactMode();
                }}
              >
                {isCompact ? (
                  <ChevronUp size={20} />
                ) : (
                  <ChevronDown size={20} />
                )}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsVisible(false);
                }}
              >
                <X size={20} />
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
                <Gauge size={16} />
              </div>
              <span className={styles.metricLabel}>FPS</span>
              <span className={`${styles.metricValue} ${getValueColor(fps)}`}>
                {fps}
              </span>
            </div>
            <div className={styles.metricItem}>
              <div className={styles.metricIcon}>
                <Clock size={16} />
              </div>
              <span className={styles.metricLabel}>Frame</span>
              <span className={styles.metricValue}>{frameTime}ms</span>
            </div>
            <div className={styles.metricItem}>
              <div className={styles.metricIcon}>
                <Star size={16} />
              </div>
              <span className={styles.metricLabel}>Score</span>
              <span
                className={`${styles.metricValue} ${getScoreColor(staticScore)}`}
              >
                {staticScore} ({tier.toUpperCase()})
              </span>
            </div>
          </div>

          <div className={styles.sectionDivider} />

          <div className={styles.deviceInfoSection}>
            <div className={styles.infoRow}>
              <div className={styles.infoIcon}>
                <HardDrive size={16} />
              </div>
              <strong>RAM:</strong>
              <span className={styles.infoValue}>{deviceSpecs.ram}</span>
            </div>
            <div className={styles.infoRow}>
              <div className={styles.infoIcon}>
                <Cpu size={16} />
              </div>
              <strong>CPU:</strong>
              <span className={styles.infoValue}>
                {deviceSpecs.cpuCores} cores
              </span>
            </div>
            <div className={styles.infoRow}>
              <div className={styles.infoIcon}>
                <PieChart size={16} />
              </div>
              <strong>GPU:</strong>
              <span className={styles.infoValue}>{deviceSpecs.gpu}</span>
            </div>
            <div className={styles.infoRow}>
              <div className={styles.infoIcon}>
                <Zap size={16} />
              </div>
              <strong>WebGL:</strong>
              <span className={styles.infoValue}>
                {deviceSpecs.webglVersion}
              </span>
            </div>
            <div className={styles.infoRow}>
              <div className={styles.infoIcon}>
                <Smartphone size={16} />
              </div>
              <strong>Touch:</strong>
              <span className={styles.infoValue}>
                {deviceSpecs.touchSupport ? "Yes" : "No"}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(PerformanceDebugMobile);
