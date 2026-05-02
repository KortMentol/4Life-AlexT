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
    // Подписываемся на изменения store
    const unsub = effectsDebugStore.subscribe(setFlags);
    return unsub;
  }, []);

  return flags;
};

/**
 * Читает один конкретный флаг — для компонентов которым нужен только один флаг.
 * Чуть эффективнее чем useEffectsDebug() если нужен только один флаг.
 */
export const useEffectsDebugFlag = <K extends keyof EffectsDebugFlags>(
  key: K,
): EffectsDebugFlags[K] => {
  const flags = useEffectsDebug();
  return flags[key];
};
