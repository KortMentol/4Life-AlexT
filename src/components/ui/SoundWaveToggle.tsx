/**
 * @module src/components/ui/SoundWaveToggle.tsx
 * @description Precision biophysical audio controller for Header capsule.
 * Plays /audio/backgroundSound.mp3 with smooth volume ramping, automatic ducking
 * when video modals open or tab is hidden, and zero-re-render SVG wave physics.
 */

import React, { useCallback, useEffect, useRef, useState } from "react";

const AUDIO_SRC = "/audio/backgroundSound.mp3";
const TARGET_VOLUME = 0.35;

const TAUT_STRING_PATH = "M 3 10 C 8 8.6, 11 11.4, 14 10 C 17 8.6, 20 11.4, 25 10";
const SECONDARY_IDLE_PATH = "M 3 10 C 9 10.9, 12 9.1, 14 10 C 16 10.9, 19 9.1, 25 10";

function buildWavePath(phase: number, amplitude: number, freqMult: number, phaseOffset: number): string {
  const startX = 3;
  const endX = 25;
  const steps = 11;
  const stepX = (endX - startX) / steps;
  let d = `M ${startX} 10`;

  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    const x = startX + i * stepX;
    const envelope = Math.sin(t * Math.PI);
    const wave =
      Math.sin(t * Math.PI * 2 * freqMult + phase + phaseOffset) * 0.72 +
      Math.sin(t * Math.PI * 3.5 * freqMult - phase * 1.35 + phaseOffset) * 0.28;
    const y = 10 + wave * amplitude * envelope;
    d += ` L ${x.toFixed(2)} ${y.toFixed(2)}`;
  }

  return d;
}

const SoundWaveToggle: React.FC<{ className?: string }> = ({ className = "" }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const primaryPathRef = useRef<SVGPathElement>(null);
  const secondaryPathRef = useRef<SVGPathElement>(null);

  const isPlayingRef = useRef(false);
  const isDuckedRef = useRef(false);
  const rafIdRef = useRef<number | null>(null);
  const phaseRef = useRef(0);
  const pluckAmpRef = useRef(0);

  const audioElRef = useRef<HTMLAudioElement | null>(null);
  const fadeIntervalRef = useRef<number | null>(null);

  const stopRaf = useCallback(() => {
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
  }, []);

  const resetPathsToIdle = useCallback(() => {
    primaryPathRef.current?.setAttribute("d", TAUT_STRING_PATH);
    secondaryPathRef.current?.setAttribute("d", SECONDARY_IDLE_PATH);
  }, []);

  const runWaveLoop = useCallback(() => {
    const tick = () => {
      const active = isPlayingRef.current;
      const ducked = isDuckedRef.current;

      if (active) {
        phaseRef.current += ducked ? 0.04 : 0.11;
        const amp = ducked ? 1.4 : 5.4;
        primaryPathRef.current?.setAttribute("d", buildWavePath(phaseRef.current, amp, 1.15, 0));
        secondaryPathRef.current?.setAttribute(
          "d",
          buildWavePath(phaseRef.current * 0.82, amp * 0.72, 1.45, 1.4),
        );
        rafIdRef.current = requestAnimationFrame(tick);
        return;
      }

      if (pluckAmpRef.current > 0.08) {
        phaseRef.current += 0.24;
        pluckAmpRef.current *= 0.91;
        primaryPathRef.current?.setAttribute("d", buildWavePath(phaseRef.current, pluckAmpRef.current, 1.2, 0));
        secondaryPathRef.current?.setAttribute(
          "d",
          buildWavePath(phaseRef.current * 0.9, pluckAmpRef.current * 0.55, 1.5, 1.1),
        );
        rafIdRef.current = requestAnimationFrame(tick);
        return;
      }

      pluckAmpRef.current = 0;
      resetPathsToIdle();
      rafIdRef.current = null;
    };

    if (rafIdRef.current === null) {
      rafIdRef.current = requestAnimationFrame(tick);
    }
  }, [resetPathsToIdle]);

  const rampVolume = useCallback(
    (audio: HTMLAudioElement, targetVol: number, durationMs: number, pauseAtEnd = false) => {
      if (fadeIntervalRef.current !== null) {
        window.clearInterval(fadeIntervalRef.current);
        fadeIntervalRef.current = null;
      }
      const steps = 20;
      const stepMs = Math.max(16, Math.round(durationMs / steps));
      const startVol = audio.volume;
      let currentStep = 0;

      fadeIntervalRef.current = window.setInterval(() => {
        currentStep++;
        const progress = Math.min(1, currentStep / steps);
        audio.volume = Math.max(0, Math.min(1, startVol + (targetVol - startVol) * progress));
        if (progress >= 1) {
          if (fadeIntervalRef.current !== null) {
            window.clearInterval(fadeIntervalRef.current);
            fadeIntervalRef.current = null;
          }
          if (pauseAtEnd) audio.pause();
        }
      }, stepMs);
    },
    [],
  );

  const applyDucking = useCallback(
    (shouldDuck: boolean) => {
      isDuckedRef.current = shouldDuck;
      if (!isPlayingRef.current || !audioElRef.current) return;
      rampVolume(audioElRef.current, shouldDuck ? 0 : TARGET_VOLUME, 500, false);
    },
    [rampVolume],
  );

  const startAudio = useCallback(async () => {
    if (!audioElRef.current) {
      const el = new Audio(AUDIO_SRC);
      el.loop = true;
      el.preload = "auto";
      el.volume = 0;
      audioElRef.current = el;
    }

    try {
      await audioElRef.current.play();
      if (!isPlayingRef.current) {
        audioElRef.current.pause();
        return;
      }
      rampVolume(audioElRef.current, isDuckedRef.current ? 0 : TARGET_VOLUME, 1200, false);
    } catch {
      isPlayingRef.current = false;
      setIsPlaying(false);
    }
  }, [rampVolume]);

  const stopAudio = useCallback(() => {
    if (audioElRef.current) {
      rampVolume(audioElRef.current, 0, 800, true);
    }
  }, [rampVolume]);

  const handleToggle = useCallback(() => {
    const next = !isPlayingRef.current;
    isPlayingRef.current = next;
    setIsPlaying(next);

    if (next) {
      try {
        const navWithAudio = navigator as Navigator & { audioSession?: { type: string } };
        if (navWithAudio.audioSession) {
          navWithAudio.audioSession.type = "playback";
        }
      } catch {
        // Ignore on unsupported browsers
      }
      runWaveLoop();
      void startAudio();
    } else {
      stopAudio();
      pluckAmpRef.current = 2.4;
      runWaveLoop();
    }
  }, [runWaveLoop, startAudio, stopAudio]);

  const handleMouseEnter = useCallback(() => {
    if (!isPlayingRef.current) {
      pluckAmpRef.current = 2.6;
      runWaveLoop();
    }
  }, [runWaveLoop]);

  // Subtle 6-second living string breath while idle
  useEffect(() => {
    if (typeof window === "undefined") return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const breathTimer = window.setInterval(() => {
      if (!isPlayingRef.current && !document.hidden && pluckAmpRef.current < 0.2) {
        pluckAmpRef.current = 1.6;
        runWaveLoop();
      }
    }, 6000);

    return () => {
      window.clearInterval(breathTimer);
    };
  }, [runWaveLoop]);

  // Auto-duck on video modal open and tab visibility change
  useEffect(() => {
    const handleModalState = (e: Event) => {
      const detail = (e as CustomEvent<{ isOpen?: boolean }>).detail;
      applyDucking(Boolean(detail?.isOpen));
    };

    const handleVisibility = () => {
      applyDucking(document.hidden);
    };

    window.addEventListener("modal-state-change", handleModalState);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      window.removeEventListener("modal-state-change", handleModalState);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [applyDucking]);

  // Strict resource cleanup on unmount
  useEffect(() => {
    return () => {
      stopRaf();
      if (fadeIntervalRef.current !== null) {
        window.clearInterval(fadeIntervalRef.current);
      }
      if (audioElRef.current) {
        audioElRef.current.pause();
        audioElRef.current.src = "";
        audioElRef.current = null;
      }
    };
  }, [stopRaf]);

  return (
    <button
      type="button"
      onClick={handleToggle}
      onMouseEnter={handleMouseEnter}
      aria-label={isPlaying ? "Выключить фоновый звук" : "Включить фоновый звук"}
      aria-pressed={isPlaying}
      title={isPlaying ? "Выключить звук" : "Включить фоновый звук"}
      data-sound-toggle="true"
      data-sound-playing={isPlaying ? "true" : "false"}
      className={`w-9 h-9 rounded-full flex items-center justify-center relative group focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 bg-white/[0.03] hover:bg-white/[0.08] border ${
        isPlaying ? "border-cyan-400/50" : "border-white/[0.1] hover:border-cyan-400/40"
      } transition-colors duration-300 active:scale-95 ${className}`}
    >
      <svg
        width="24"
        height="18"
        viewBox="0 0 28 20"
        fill="none"
        aria-hidden="true"
        className="overflow-visible"
      >
        <path
          ref={secondaryPathRef}
          d={SECONDARY_IDLE_PATH}
          stroke="#06b6d4"
          strokeWidth="1.25"
          strokeLinecap="round"
          opacity="0.4"
        />
        <path
          ref={primaryPathRef}
          d={TAUT_STRING_PATH}
          stroke="#22d3ee"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle cx="2" cy="10" r="1.2" fill={isPlaying ? "#22d3ee" : "#94a3b8"} />
        <circle cx="26" cy="10" r="1.2" fill={isPlaying ? "#22d3ee" : "#94a3b8"} />
      </svg>
    </button>
  );
};

export default React.memo(SoundWaveToggle);
