import { EffectsDebugFlags, effectsDebugStore } from "@/utils/effectsDebug/effectsDebugStore";
import { useEffect, useState } from "react";

export const useEffectsDebug = (): EffectsDebugFlags => {
  const [flags, setFlags] = useState<EffectsDebugFlags>(() => effectsDebugStore.getFlags());

  useEffect(() => {
    if (!import.meta.env.DEV) return;
    const unsub = effectsDebugStore.subscribe(setFlags);
    return unsub;
  }, []);

  if (import.meta.env.DEV && !flags.globalPower) {
    const bypassedFlags = { ...flags };
    (Object.keys(bypassedFlags) as (keyof EffectsDebugFlags)[]).forEach((key) => {
      if (key !== "globalPower" && key !== "tierOverride") {
        (bypassedFlags as Record<string, unknown>)[key] = false;
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
