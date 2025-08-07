import { DeviceSpecs, calculatePerformanceScore, detectDeviceSpecs } from "@/utils/devicePerformance/devicePerformance";
import {
  Bug,
  ChevronDown,
  ChevronUp,
  Clock,
  Cpu,
  Gauge,
  HardDrive,
  Info,
  Monitor,
  Move,
  PieChart,
  Smartphone,
  Star,
  Wifi,
  X,
  Zap,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import styles from "./PerformanceDebug.module.css";

// Используем DeviceSpecs из единой системы

/**
 * @module components/debug/PerformanceDebug
 * @description
 * `PerformanceDebug` — это плавающая UI-панель для разработчиков, предназначенная для мониторинга производительности приложения в реальном времени.
 * Она отображает ключевые метрики, такие как FPS, время кадра, и статический "балл производительности", рассчитанный на основе характеристик устройства.
 * Компонент является десктопной версией отладочной панели.
 *
 * @author Kort
 * @version 1.0.0
 *
 * @usage
 * Компонент используется в корневом файле приложения для обеспечения постоянного доступа к метрикам в режиме разработки:
 * 1. **`src/App.tsx` (строка 211):** Рендерится условно, когда `isMobile` имеет значение `false`, предоставляя оверлей с данными о производительности на десктопных устройствах.
 *
 * @example
 * // Вставляется в App.tsx без пропсов
 * <PerformanceDebug />
 */
const PerformanceDebug: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isCompact, setIsCompact] = useState(true); // По умолчанию компактный режим
  const [showInfo, setShowInfo] = useState(false);
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

    let frameCount = 0;
    const frameTimeHistory: number[] = [];

    try {
      const specs = detectDeviceSpecs();
      setDeviceSpecs(specs);

      const { score, tier: detectedTier } = calculatePerformanceScore(specs);
      setStaticScore(score);
      setTier(detectedTier);

      console.log("📱 PerformanceDebug initialized:", {
        score,
        tier: detectedTier,
        specs,
      });
    } catch (error) {
      console.error("❌ Error initializing PerformanceDebug:", error);
    }

    const performanceLoop = () => {
      const currentTime = performance.now();
      const deltaTime = currentTime - lastFrameTime;

      frameCount++;
      frameTimeHistory.push(deltaTime);
      if (frameTimeHistory.length > 10) frameTimeHistory.shift();

      if (currentTime - lastTime >= 500) {
        const avgFrameTime = frameTimeHistory.reduce((a, b) => a + b, 0) / frameTimeHistory.length;
        setFps(Math.round(1000 / avgFrameTime));
        setFrameTime(Math.round(avgFrameTime * 100) / 100);

        lastTime = currentTime;
        frameCount = 0;
      }

      lastFrameTime = currentTime;
      animationId = requestAnimationFrame(performanceLoop);
    };

    performanceLoop();

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, []);

  const toggleCompactMode = (e?: React.MouseEvent | React.TouchEvent) => {
    if (wasDragging.current) {
      e?.preventDefault();
      e?.stopPropagation();
      return;
    }

    setIsCompact((prev) => !prev);
  };

  const dragRef = React.useRef<HTMLDivElement>(null);
  const startPos = React.useRef({ x: 0, y: 0 });
  const isDragging = React.useRef(false);
  const elementPos = React.useRef({ x: 0, y: 0 });
  const wasDragging = React.useRef(false);
  const hasDragged = React.useRef(false);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    const element = dragRef.current;
    if (!element) return;

    const clientX = "touches" in e ? e.touches[0]?.clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0]?.clientY : e.clientY;

    if (clientX === undefined || clientY === undefined) return;

    const rect = element.getBoundingClientRect();

    startPos.current = { x: clientX, y: clientY };
    elementPos.current = { x: rect.left, y: rect.top };

    isDragging.current = true;
    hasDragged.current = false;

    element.classList.add("dragging");

    element.style.position = "fixed";
    element.style.left = `${rect.left}px`;
    element.style.top = `${rect.top}px`;
    element.style.right = "auto";
    element.style.transform = "none";

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("touchmove", handleMouseMove, { passive: false });
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("touchend", handleMouseUp);

    e.preventDefault();
    e.stopPropagation();
  };

  const handleMouseMove = React.useCallback((e: MouseEvent | TouchEvent) => {
    if (!isDragging.current) return;

    hasDragged.current = true;

    const element = dragRef.current;
    if (!element) return;

    const clientX = "touches" in e ? e.touches[0]?.clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0]?.clientY : e.clientY;

    if (clientX === undefined || clientY === undefined) return;

    const deltaX = clientX - startPos.current.x;
    const deltaY = clientY - startPos.current.y;

    const newX = elementPos.current.x + deltaX;
    const newY = elementPos.current.y + deltaY;

    element.style.position = "fixed";
    element.style.left = `${newX}px`;
    element.style.top = `${newY}px`;
    element.style.right = "auto";
    element.style.transform = "none";

    startPos.current = { x: clientX, y: clientY };
    elementPos.current = { x: newX, y: newY };
  }, []);

  const handleMouseUp = React.useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!isDragging.current) return;

      const element = dragRef.current;
      if (element) {
        element.classList.remove("dragging");

        const rect = element.getBoundingClientRect();
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
      e.stopPropagation();
    },
    [handleMouseMove]
  );

  React.useEffect(() => {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("touchmove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
    document.removeEventListener("touchend", handleMouseUp);
  }, [handleMouseMove, handleMouseUp]);

  React.useEffect(() => {
    const element = dragRef.current;
    if (element) {
      element.style.position = "fixed";
      element.style.top = "4rem";
      element.style.right = "1rem";
    }
  }, []);

  const getValueColor = (value: number) => {
    return value >= 50 ? styles.valueGood : value >= 30 ? styles.valueWarning : styles.valueBad;
  };

  const getScoreColor = (score: number) => {
    return score >= 80 ? styles.valueGood : score >= 55 ? styles.valueWarning : styles.valueBad;
  };

  if (!isVisible) return null;
  return (
    <div
      ref={dragRef}
      className={`${styles.debugContainer} ${isCompact ? styles.compactMode : ""}`}
      onClick={toggleCompactMode}
    >
      <div className={styles.debugHeader} onMouseDown={handleMouseDown} onTouchStart={handleMouseDown}>
        <div className={styles.dragHandle} data-drag-handle>
          <Move size={16} className={styles.dragIcon} />
        </div>
        {isCompact ? (
          <div className={styles.headerMetricsCompact}>
            <div className={styles.metricItem} title={`FPS: ${fps}`}>
              <span>FPS:</span> <span className={getValueColor(fps)}>{fps}</span>
            </div>
            <div className={styles.metricItem} title={`Frame Time: ${frameTime}ms`}>
              <span>Frame:</span> <span>{frameTime}ms</span>
            </div>
          </div>
        ) : (
          <div className={styles.headerTitle}>
            <Bug size={16} />
            <span>Performance Debug</span>
          </div>
        )}
        <div className={styles.headerActions}>
          {!isCompact && (
            <button onClick={() => setShowInfo(true)} title="Подробнее о метриках">
              <Info size={18} />
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsCompact((p) => !p);
            }}
          >
            {isCompact ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
          <button onClick={() => setIsVisible(false)} title="Закрыть дебаггер">
            <X size={18} />
          </button>
        </div>
      </div>

      {!isCompact && (
        <div className={styles.debugBody}>
          <div className={styles.metricsGrid}>
            <div className={styles.metricItem} title={`Frames Per Second: ${fps}`}>
              <div className={styles.metricIcon}>
                <Gauge size={14} />
              </div>
              <span className={styles.metricLabel}>FPS:</span>
              <span className={`${styles.metricValue} ${getValueColor(fps)}`}>{fps}</span>
            </div>
            <div className={styles.metricItem} title={`Frame Time: ${frameTime}ms`}>
              <div className={styles.metricIcon}>
                <Clock size={14} />
              </div>
              <span className={styles.metricLabel}>Frame:</span>
              <span className={styles.metricValue}>{frameTime}ms</span>
            </div>
            <div
              className={styles.metricItem}
              title={`Static Performance Score: ${staticScore} (${tier.toUpperCase()})`}
            >
              <div className={styles.metricIcon}>
                <Star size={14} />
              </div>
              <span className={styles.metricLabel}>Score:</span>
              <span className={`${styles.metricValue} ${getScoreColor(staticScore)}`}>
                {staticScore} ({tier.toUpperCase()})
              </span>
            </div>
          </div>
          <div className={styles.sectionDivider} />
          <div className={styles.deviceInfoSection}>
            <div className={styles.infoRow} title={`RAM: ${deviceSpecs.ram}`}>
              <div className={styles.infoIcon}>
                <HardDrive size={14} />
              </div>
              <strong>RAM:</strong>
              <span className={styles.infoValue}>{deviceSpecs.ram}</span>
            </div>
            <div className={styles.infoRow} title={`CPU: ${deviceSpecs.cpuCores} cores @ ${deviceSpecs.cpuFrequency}`}>
              <div className={styles.infoIcon}>
                <Cpu size={14} />
              </div>
              <strong>CPU:</strong>
              <span className={styles.infoValue}>
                {deviceSpecs.cpuCores} cores @ {deviceSpecs.cpuFrequency}
              </span>
            </div>
            <div className={styles.infoRow} title={`GPU: ${deviceSpecs.gpu}`}>
              <div className={styles.infoIcon}>
                <PieChart size={14} />
              </div>
              <strong>GPU:</strong>
              <span className={styles.infoValue}>{deviceSpecs.gpu}</span>
            </div>
            <div className={styles.infoRow} title={`WebGL: ${deviceSpecs.webglVersion}`}>
              <div className={styles.infoIcon}>
                <Zap size={14} />
              </div>
              <strong>WebGL:</strong>
              <span className={styles.infoValue}>{deviceSpecs.webglVersion}</span>
            </div>
            <div className={styles.infoRow} title={`Screen: ${deviceSpecs.screenResolution}`}>
              <div className={styles.infoIcon}>
                <Monitor size={14} />
              </div>
              <strong>Screen:</strong>
              <span className={styles.infoValue}>{deviceSpecs.screenResolution}</span>
            </div>
            <div className={styles.infoRow} title={`Touch Support: ${deviceSpecs.touchSupport ? "Yes" : "No"}`}>
              <div className={styles.infoIcon}>
                <Smartphone size={14} />
              </div>
              <strong>Touch:</strong>
              <span className={styles.infoValue}>{deviceSpecs.touchSupport ? "Yes" : "No"}</span>
            </div>
            <div className={styles.infoRow} title={`Connection: ${deviceSpecs.connectionType}`}>
              <div className={styles.infoIcon}>
                <Wifi size={14} />
              </div>
              <strong>Connection:</strong>
              <span className={styles.infoValue}>{deviceSpecs.connectionType}</span>
            </div>
          </div>

          {showInfo && (
            <div className={styles.infoModal}>
              <div className={styles.infoContent}>
                <h4>Performance Metrics Explained</h4>
                <p>
                  <strong>
                    <Gauge size={14} /> FPS:
                  </strong>{" "}
                  Frames per second. Higher is better.
                </p>
                <p>
                  <strong>
                    <Clock size={14} /> Frame:
                  </strong>{" "}
                  Time to render a frame. Lower is better.
                </p>

                <p>
                  <strong>
                    <Star size={14} /> Score:
                  </strong>{" "}
                  Overall performance score based on device specs.
                </p>
                <button onClick={() => setShowInfo(false)}>Close</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PerformanceDebug;
