/**
 * @module components/debug/PerformanceDebug
 * @description Настольная плавающая панель для мониторинга FPS, FT и аппаратных характеристик (DEV).
 * Все иконки строго импортируются из единого пульта @/utils/icons.
 *
 * @author Kort
 * @version 5.1.1
 */

import { DeviceSpecs, calculatePerformanceScore, detectDeviceSpecs } from "@/utils/devicePerformance/devicePerformance";
import { getTierOverride } from "@/utils/effectsDebug/effectsDebugStore";
import { Icons } from "@/utils/icons";
import React, { useEffect, useState } from "react";
import styles from "./PerformanceDebug.module.css";

const PerformanceDebug: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isCompact, setIsCompact] = useState(true);
  const [showInfo, setShowInfo] = useState(false);
  const [staticScore, setStaticScore] = useState(0);
  const [tier, setTier] = useState<"low" | "medium" | "high" | "current" | "current">("medium");
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

  const fpsTextRef = React.useRef<HTMLSpanElement>(null);
  const ftTextRef = React.useRef<HTMLSpanElement>(null);
  const compactFpsTextRef = React.useRef<HTMLSpanElement>(null);
  const compactFtTextRef = React.useRef<HTMLSpanElement>(null);

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
      const finalTier = override !== "current" ? override : hardwareTier;
      setTier(finalTier);

      console.log("📱 PerformanceDebug initialized:", {
        score,
        tier: finalTier,
        specs,
      });
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

        if (fpsTextRef.current) fpsTextRef.current.textContent = String(calculatedFps);
        if (compactFpsTextRef.current) compactFpsTextRef.current.textContent = String(calculatedFps);
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
    [handleMouseMove],
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
      element.style.top = "16px";
      element.style.right = "16px";
    }
  }, []);

  const toggleCompactMode = (e: React.MouseEvent) => {
    if (wasDragging.current) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    setIsCompact((prev) => !prev);
  };

  const getScoreColor = (score: number) => {
    return score >= 80 ? styles.valueGood : score >= 55 ? styles.valueWarning : styles.valueBad;
  };

  if (!isVisible) return null;
  return (
    <div
      ref={dragRef}
      className={`${styles.debugContainer} ${isCompact ? styles.compactMode : ""}`}
      aria-expanded={!isCompact}
    >
      {/* Header */}
      <div
        className={styles.debugHeader}
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
        onClick={toggleCompactMode}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
            fontSize: "0.7rem",
            color: "rgba(255, 255, 255, 0.9)",
          }}
        >
          <Icons.Move size={13} style={{ color: "rgba(255, 255, 255, 0.5)", cursor: "move" }} />
          <Icons.Gauge size={13} style={{ color: "rgba(255, 255, 255, 0.5)" }} />
          <span>{isCompact ? "Perf" : "Perf Debug"}</span>
        </div>

        {isCompact && (
          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              fontSize: "0.65rem",
              marginLeft: "auto",
              marginRight: "0.5rem",
              whiteSpace: "nowrap",
            }}
          >
            <span style={{ display: "flex", gap: "0.2rem", alignItems: "baseline" }}>
              <span style={{ color: "rgba(255, 255, 255, 0.6)" }}>FPS:</span>
              <span
                ref={compactFpsTextRef}
                className={styles.valueGood}
                style={{
                  fontVariantNumeric: "tabular-nums",
                  minWidth: "24px",
                  textAlign: "right",
                  display: "inline-block",
                }}
              >
                --
              </span>
            </span>
            <span style={{ display: "flex", gap: "0.2rem", alignItems: "baseline" }}>
              <span style={{ color: "rgba(255, 255, 255, 0.6)" }}>FT:</span>
              <span
                ref={compactFtTextRef}
                style={{
                  fontVariantNumeric: "tabular-nums",
                  minWidth: "36px",
                  textAlign: "right",
                  display: "inline-block",
                }}
              >
                --ms
              </span>
            </span>
          </div>
        )}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.2rem",
            marginLeft: isCompact ? "0" : "auto",
          }}
        >
          {!isCompact && (
            <button
              className={styles.iconBtn}
              onClick={(e) => {
                e.stopPropagation();
                setShowInfo((p) => !p);
              }}
              title="Show info"
            >
              <Icons.Info size={14} />
            </button>
          )}
          <button
            className={styles.iconBtn}
            onClick={(e) => {
              e.stopPropagation();
              setIsCompact((p) => !p);
            }}
            title={isCompact ? "Expand" : "Collapse"}
          >
            {isCompact ? <Icons.ChevronDown size={14} /> : <Icons.ChevronUp size={14} />}
          </button>
          <button
            className={styles.iconBtn}
            onClick={(e) => {
              e.stopPropagation();
              setIsVisible(false);
            }}
            title="Close debugger"
          >
            <Icons.X size={14} />
          </button>
        </div>
      </div>

      {/* Body */}
      {!isCompact && (
        <div className={styles.debugBody}>
          {/* Info Popover */}
          {showInfo && (
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                position: "absolute",
                top: "40px",
                right: "10px",
                left: "10px",
                background: "#0b0f19",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
                padding: "12px",
                zIndex: 100,
                boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "8px",
                }}
              >
                <h4
                  style={{
                    fontSize: "0.75rem",
                    color: "#4ade80",
                    margin: 0,
                  }}
                >
                  Metrics Explained
                </h4>
                <button
                  style={{
                    background: "none",
                    border: "none",
                    color: "#ef4444",
                    cursor: "pointer",
                    fontSize: "1rem",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowInfo(false);
                  }}
                >
                  ✕
                </button>
              </div>
              <p
                style={{
                  fontSize: "0.65rem",
                  color: "rgba(255, 255, 255, 0.7)",
                  margin: "4px 0",
                }}
              >
                <strong>Icons.Gauge:</strong> Frames Per Second. Higher is smoother.
              </p>
              <p
                style={{
                  fontSize: "0.65rem",
                  color: "rgba(255, 255, 255, 0.7)",
                  margin: "4px 0",
                }}
              >
                <strong>Icons.Clock:</strong> Frame Time (ms). Lower is faster.
              </p>
              <p
                style={{
                  fontSize: "0.65rem",
                  color: "rgba(255, 255, 255, 0.7)",
                  margin: "4px 0",
                }}
              >
                <strong>Icons.Star:</strong> Static hardware performance rating.
              </p>
            </div>
          )}

          {/* Metrics Grid */}
          <div className={styles.metricsGrid}>
            <div className={styles.metricItem} title="Frames Per Second">
              <div className={styles.metricIcon}>
                <Icons.Gauge size={16} />
              </div>
              <span className={styles.metricLabel}>FPS</span>
              <span ref={fpsTextRef} className={`${styles.metricValue} ${styles.valueGood}`}>
                --
              </span>
            </div>
            <div className={styles.metricItem} title="Frame Time">
              <div className={styles.metricIcon}>
                <Icons.Clock size={16} />
              </div>
              <span className={styles.metricLabel}>Frame</span>
              <span ref={ftTextRef} className={styles.metricValue}>
                --ms
              </span>
            </div>
            <div className={styles.metricItem} title={`Performance Score: ${staticScore} (${tier.toUpperCase()})`}>
              <div className={styles.metricIcon}>
                <Icons.Star size={16} />
              </div>
              <span className={styles.metricLabel}>Score</span>
              <span className={`${styles.metricValue} ${getScoreColor(staticScore)}`}>{staticScore}</span>
            </div>
          </div>

          <div className={styles.sectionDivider} />

          {/* Device Info */}
          <div className={styles.deviceInfoSection}>
            <div className={styles.infoRow} title={`RAM: ${deviceSpecs.ram}`}>
              <strong>
                <Icons.HardDrive size={12} className={styles.infoIcon} />
                RAM
              </strong>
              <span className={styles.infoValue}>{deviceSpecs.ram}</span>
            </div>
            <div className={styles.infoRow} title={`CPU: ${deviceSpecs.cpuCores} cores`}>
              <strong>
                <Icons.Cpu size={12} className={styles.infoIcon} />
                CPU
              </strong>
              <span className={styles.infoValue}>{deviceSpecs.cpuCores} cores</span>
            </div>
            <div className={styles.infoRow} title={`GPU: ${deviceSpecs.gpu}`}>
              <strong>
                <Icons.PieChart size={12} className={styles.infoIcon} />
                GPU
              </strong>
              <span className={styles.infoValue}>{deviceSpecs.gpu}</span>
            </div>
            <div className={styles.infoRow} title={`WebGL: ${deviceSpecs.webglVersion}`}>
              <strong>
                <Icons.Zap size={12} className={styles.infoIcon} />
                WebGL
              </strong>
              <span className={styles.infoValue}>{deviceSpecs.webglVersion}</span>
            </div>
            <div className={styles.infoRow} title={`Touch: ${deviceSpecs.touchSupport ? "Yes" : "No"}`}>
              <strong>
                <Icons.Smartphone size={12} className={styles.infoIcon} />
                Touch
              </strong>
              <span className={styles.infoValue}>{deviceSpecs.touchSupport ? "Yes" : "No"}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PerformanceDebug;
