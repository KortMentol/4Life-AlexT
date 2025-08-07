/**
 * @module src/lib/scrollLockState.ts
 * @description Глобальное состояние для синхронной блокировки скролла.
 * Используется для немедленной передачи состояния блокировки между App.tsx и useNativeScroll.ts,
 * минуя асинхронную природу React state, чтобы избежать задержек.
 * @author Kort
 * @version 1.0.0
 */
export const scrollLockState = {
  isLocked: false,
};
