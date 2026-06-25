/**
 * @module src/hooks/useEffectsDebug.ts
 * @description Хук для чтения флагов эффектов из effectsDebugStore.
 * Подписывается на изменения — компонент перерендерится при смене флага.
 * Только DEV режим — в production возвращает дефолтные значения без подписки.
 *
 * @author Kort
 * @version 1.0.0
 */

import {
  EffectsDebugFlags,
  effectsDebugStore,
} from "@/utils/effectsDebug/effectsDebugStore";
import { useEffect, useState } from "react";

export const useEffectsDebug = (): EffectsDebugFlags => {
  const [flags, setFlags] = useState<EffectsDebugFlags>(() =>
    effectsDebugStore.getFlags(),
  );

  useEffect(() => {
    if (!import.meta.env.DEV) return;
    const unsub = effectsDebugStore.subscribe(setFlags);
    return unsub;
  }, []);

  return flags;
};

export const useEffectsDebugFlag = <K extends keyof EffectsDebugFlags>(
  key: K,
): EffectsDebugFlags[K] => {
  const flags = useEffectsDebug();
  return flags[key];
};

export const useFeatureFlag = (
  flagKey: keyof EffectsDebugFlags,
  prodCondition: boolean,
): boolean => {
  const flags = useEffectsDebug();
  if (import.meta.env.DEV) {
    return flags[flagKey] as boolean;
  }
  return prodCondition;
};