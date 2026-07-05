/**
 * @module src/hooks/useEffectsDebug.ts
 * @description React hooks for subscribing to effects debug flags.
 * Implements a robust and future-proof "Dynamic Proxy Bypass" (Engine Power) logic.
 *
 * @author Geminis AI & Kort
 * @version 3.0.0
 */

import { EffectsDebugFlags, effectsDebugStore } from "@/utils/effectsDebug/effectsDebugStore";
import { useEffect, useState } from "react";

export const useEffectsDebug = (): EffectsDebugFlags => {
  const [flags, setFlags] = useState<EffectsDebugFlags>(() => effectsDebugStore.getFlags());

  useEffect(() => {
    if (!import.meta.env.DEV) return;
    const unsub = effectsDebugStore.subscribe(setFlags);
    return unsub;
  }, []);

  // [ДИНАМИЧЕСКИЙ МАСТЕР-ОБХОД / ENGINE POWER BYPASS]
  // Если глобальное питание выключено (globalPower === false), мы "на лету"
  // перехватываем все флаги декоративных эффектов и принудительно возвращаем false.
  // Это полностью исключает хардкод и автоматически покроет любые новые флаги в будущем.
  if (import.meta.env.DEV && !flags.globalPower) {
    const bypassedFlags = { ...flags };
    (Object.keys(bypassedFlags) as (keyof EffectsDebugFlags)[]).forEach((key) => {
      if (key !== "globalPower" && key !== "tierOverride") {
        (bypassedFlags as any)[key] = false;
      }
    });
    return bypassedFlags;
  }

  return flags;
};

export const useEffectsDebugFlag = <K extends keyof EffectsDebugFlags>(key: K): EffectsDebugFlags[K] => {
  const flags = useEffectsDebug();
  return flags[key];
};

export const useFeatureFlag = (flagKey: keyof EffectsDebugFlags, prodCondition: boolean): boolean => {
  const flags = useEffectsDebug();
  if (import.meta.env.DEV) {
    return flags[flagKey] as boolean;
  }
  return prodCondition;
};
