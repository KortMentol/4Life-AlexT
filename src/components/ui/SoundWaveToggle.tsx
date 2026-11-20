import React, { useCallback, useEffect, useRef, useState } from "react";

const AMBIENT_AUDIO_PATH = "/audio/ambient.mp3";
const OFF_PATH = "M 2 10 C 6 8.6, 10 11.4, 14 10 C 18 8.6, 22 11.4, 26 10";
const BAR_SAMPLES = 18;

function wavePath(phase: number, frequency: number, amplitude: number): string {
  const points = Array.from({ length: BAR_SAMPLES }, (_, index) => {
    const x = 2 + (24 * index) / (BAR_SAMPLES - 1);
    const envelope = 0.44 + 0.56 * Math.sin((Math.PI * index) / (BAR_SAMPLES - 1));
    const y = 10 + Math.sin((index / (BAR_SAMPLES - 1)) * Math.PI * frequency * 2 + phase) * amplitude * envelope;
    return { x, y };
  });
  const first = points[0];
  if (!first) return OFF_PATH;
  let path = `M ${first.x.toFixed(2)} ${first.y.toFixed(2)}`;
  for (let index = 1; index < points.length; index += 1) {
    const point = points[index];
    const previous = points[index - 1];
    if (!point || !previous) continue;
    const midpointX = (previous.x + point.x) / 2;
    const midpointY = (previous.y + point.y) / 2;
    path += ` Q ${previous.x.toFixed(2)} ${previous.y.toFixed(2)} ${midpointX.toFixed(2)} ${midpointY.toFixed(2)}`;
  }
  const last = points[points.length - 1];
  if (last) path += ` T ${last.x.toFixed(2)} ${last.y.toFixed(2)}`;
  return path;
}

const SoundWaveToggle: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(() => typeof document === "undefined" || document.visibilityState === "visible");
  const [audioMode, setAudioMode] = useState<"idle" | "file" | "synth">("idle");
  const [isHovering, setIsHovering] = useState(false);

  const primaryPathRef = useRef<SVGPathElement>(null);
  const secondaryPathRef = useRef<SVGPathElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const filterRef = useRef<BiquadFilterNode | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const mediaSourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const shutdownTimerRef = useRef<number | null>(null);
  const activationRef = useRef(0);
  const reducedMotionRef = useRef(false);

  const shouldBeAudible = isPlaying && !isModalOpen && isVisible;

  const ensureAudioGraph = useCallback((): AudioContext | null => {
    if (typeof window === "undefined") return null;
    const AudioContextConstructor = window.AudioContext;
    if (!AudioContextConstructor) return null;
    if (audioContextRef.current?.state === "closed") {
      audioContextRef.current = null;
      masterGainRef.current = null;
      filterRef.current = null;
      audioElementRef.current = null;
      mediaSourceRef.current = null;
      oscillatorsRef.current = [];
    }
    if (audioContextRef.current && masterGainRef.current && filterRef.current) return audioContextRef.current;

    const context = new AudioContextConstructor();
    const master = context.createGain();
    const lowPass = context.createBiquadFilter();
    const delay = context.createDelay(1);
    const feedback = context.createGain();
    const wet = context.createGain();
    const lfo = context.createOscillator();
    const lfoDepth = context.createGain();

    master.gain.setValueAtTime(0, context.currentTime);
    lowPass.type = "lowpass";
    lowPass.frequency.setValueAtTime(490, context.currentTime);
    lowPass.Q.setValueAtTime(0.6, context.currentTime);
    delay.delayTime.setValueAtTime(0.35, context.currentTime);
    feedback.gain.setValueAtTime(0.35, context.currentTime);
    wet.gain.setValueAtTime(0.16, context.currentTime);
    lfo.frequency.setValueAtTime(0.08, context.currentTime);
    lfoDepth.gain.setValueAtTime(230, context.currentTime);

    master.connect(lowPass);
    lowPass.connect(context.destination);
    lowPass.connect(delay);
    delay.connect(feedback);
    feedback.connect(delay);
    delay.connect(wet);
    wet.connect(context.destination);
    lfo.connect(lfoDepth);
    lfoDepth.connect(lowPass.frequency);
    lfo.start();

    audioContextRef.current = context;
    masterGainRef.current = master;
    filterRef.current = lowPass;
    return context;
  }, []);

  const startSynth = useCallback(() => {
    const context = audioContextRef.current;
    const master = masterGainRef.current;
    if (!context || !master || oscillatorsRef.current.length > 0) return;

    const notes = [
      { frequency: 146.83, type: "sine" as OscillatorType, detune: -5 },
      { frequency: 185, type: "triangle" as OscillatorType, detune: 4 },
      { frequency: 220, type: "sine" as OscillatorType, detune: -2 },
      { frequency: 277.18, type: "triangle" as OscillatorType, detune: 5 },
      { frequency: 329.63, type: "sine" as OscillatorType, detune: 0 },
    ];

    oscillatorsRef.current = notes.map((note, index) => {
      const oscillator = context.createOscillator();
      const level = context.createGain();
      oscillator.type = note.type;
      oscillator.frequency.setValueAtTime(note.frequency, context.currentTime);
      oscillator.detune.setValueAtTime(note.detune, context.currentTime);
      level.gain.setValueAtTime(index === 0 ? 0.075 : 0.045, context.currentTime);
      oscillator.connect(level);
      level.connect(master);
      oscillator.start();
      return oscillator;
    });
    setAudioMode("synth");
  }, []);

  const rampMasterGain = useCallback((audible: boolean, duration: number) => {
    const context = audioContextRef.current;
    const master = masterGainRef.current;
    if (!context || !master) return;
    const now = context.currentTime;
    master.gain.cancelScheduledValues(now);
    master.gain.setValueAtTime(master.gain.value, now);
    master.gain.linearRampToValueAtTime(audible ? 0.14 : 0, now + duration);
  }, []);

  const stopAudioSources = useCallback(() => {
    const context = audioContextRef.current;
    const audio = audioElementRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      mediaSourceRef.current?.disconnect();
      audioElementRef.current = null;
      mediaSourceRef.current = null;
    }
    for (const oscillator of oscillatorsRef.current) {
      try {
        oscillator.stop();
      } catch {
        // The oscillator may already have stopped during a rapid toggle.
      }
    }
    oscillatorsRef.current = [];
    if (context?.state === "running") void context.suspend();
    setAudioMode("idle");
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedMotionRef.current = mediaQuery.matches;
    const updateMotionPreference = (event: MediaQueryListEvent) => {
      reducedMotionRef.current = event.matches;
    };
    mediaQuery.addEventListener("change", updateMotionPreference);
    return () => mediaQuery.removeEventListener("change", updateMotionPreference);
  }, []);

  useEffect(() => {
    const handleModalState = (event: Event) => {
      const detail = (event as CustomEvent<{ isOpen?: boolean }>).detail;
      setIsModalOpen(Boolean(detail?.isOpen));
    };
    const handleVisibility = () => setIsVisible(document.visibilityState === "visible");
    window.addEventListener("modal-state-change", handleModalState);
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      window.removeEventListener("modal-state-change", handleModalState);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  useEffect(() => {
    if (shutdownTimerRef.current !== null) {
      window.clearTimeout(shutdownTimerRef.current);
      shutdownTimerRef.current = null;
    }

    rampMasterGain(shouldBeAudible, shouldBeAudible ? 1.2 : 0.8);
    if (!shouldBeAudible && audioContextRef.current) {
      shutdownTimerRef.current = window.setTimeout(() => {
        const context = audioContextRef.current;
        if (!context) return;
        if (isPlaying) {
          if (context.state === "running") void context.suspend().catch(() => {});
        } else {
          stopAudioSources();
        }
      }, 900);
    }
    if (shouldBeAudible && audioContextRef.current?.state === "suspended") {
      void audioContextRef.current.resume().catch(() => {});
    }

    return () => {
      if (shutdownTimerRef.current !== null) window.clearTimeout(shutdownTimerRef.current);
    };
  }, [isPlaying, isModalOpen, isVisible, shouldBeAudible, rampMasterGain, stopAudioSources]);

  useEffect(() => {
    if (animationFrameRef.current !== null) {
      window.cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    if (!isPlaying && !isHovering) {
      primaryPathRef.current?.setAttribute("d", OFF_PATH);
      secondaryPathRef.current?.setAttribute("d", OFF_PATH);
      return;
    }
    if (reducedMotionRef.current) return;

    const animateWave = (timestamp: number) => {
      const phase = timestamp * 0.001;
      primaryPathRef.current?.setAttribute("d", wavePath(phase, 1.35, isPlaying ? 3.5 : 1.2));
      secondaryPathRef.current?.setAttribute("d", wavePath(phase * 0.78 + 1.4, 1.08, isPlaying ? 2.3 : 0.8));
      animationFrameRef.current = window.requestAnimationFrame(animateWave);
    };
    animationFrameRef.current = window.requestAnimationFrame(animateWave);
    return () => {
      if (animationFrameRef.current !== null) window.cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    };
  }, [isPlaying, isHovering]);

  useEffect(() => () => {
    if (animationFrameRef.current !== null) window.cancelAnimationFrame(animationFrameRef.current);
    if (shutdownTimerRef.current !== null) window.clearTimeout(shutdownTimerRef.current);
    for (const oscillator of oscillatorsRef.current) {
      try {
        oscillator.stop();
      } catch {
        // The oscillator can already be stopped when the component unmounts.
      }
    }
    audioElementRef.current?.pause();
    mediaSourceRef.current?.disconnect();
    audioElementRef.current = null;
    mediaSourceRef.current = null;
    oscillatorsRef.current = [];
    const context = audioContextRef.current;
    audioContextRef.current = null;
    masterGainRef.current = null;
    filterRef.current = null;
    if (context && context.state !== "closed") void context.close().catch(() => {});
  }, []);

  const handleToggle = useCallback(async () => {
    if (isPlaying) {
      activationRef.current += 1;
      setIsPlaying(false);
      return;
    }

    const activation = activationRef.current + 1;
    activationRef.current = activation;
    const context = ensureAudioGraph();
    if (!context) return;
    try {
      await context.resume();
    } catch {
      return;
    }
    setIsPlaying(true);

    let fileIsAvailable = false;
    try {
      const response = await fetch(AMBIENT_AUDIO_PATH, { method: "HEAD", cache: "force-cache" });
      fileIsAvailable = response.ok && Boolean(response.headers.get("content-type")?.includes("audio"));
    } catch {
      fileIsAvailable = false;
    }

    if (activation !== activationRef.current) return;
    if (fileIsAvailable) {
      const audio = new Audio(AMBIENT_AUDIO_PATH);
      audio.crossOrigin = "anonymous";
      audio.loop = true;
      audio.preload = "auto";
      try {
        const source = context.createMediaElementSource(audio);
        source.connect(masterGainRef.current ?? context.destination);
        audioElementRef.current = audio;
        mediaSourceRef.current = source;
        await audio.play();
        setAudioMode("file");
      } catch {
        audio.pause();
        mediaSourceRef.current?.disconnect();
        audioElementRef.current = null;
        mediaSourceRef.current = null;
        startSynth();
      }
    } else {
      startSynth();
    }
  }, [ensureAudioGraph, isPlaying, startSynth]);

  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => setIsHovering(false);

  return (
    <button
      type="button"
      onClick={() => void handleToggle()}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      aria-label={isPlaying ? "Выключить фоновый звук" : "Включить фоновый звук"}
      aria-pressed={isPlaying}
      title={isPlaying ? "Выключить звук" : "Включить звук"}
      className="group relative flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.1] bg-white/[0.03] transition-colors duration-300 hover:border-cyan-400/40 hover:bg-white/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70 active:scale-[0.96]"
    >
      <svg viewBox="0 0 28 20" className="h-5 w-7 overflow-visible" aria-hidden="true">
        <circle cx="2" cy="10" r="1.2" fill="#22d3ee" />
        <circle cx="26" cy="10" r="1.2" fill="#22d3ee" />
        <path ref={secondaryPathRef} d={OFF_PATH} fill="none" stroke="#06b6d4" strokeWidth="1" opacity="0.4" strokeLinecap="round" />
        <path ref={primaryPathRef} d={OFF_PATH} fill="none" stroke="#22d3ee" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
      <span className="sr-only">
        {audioMode === "file" ? "Воспроизводится фоновая музыка" : audioMode === "synth" ? "Воспроизводится синтезированный эмбиент" : ""}
      </span>
    </button>
  );
};

export default React.memo(SoundWaveToggle);
