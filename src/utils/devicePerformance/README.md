# Модуль: Device Performance Logic

## @description

Этот модуль содержит всю логику для определения уровня производительности клиентского устройства. Он экспортирует две ключевые функции: `detectDeviceSpecs` для сбора данных и `calculatePerformanceScore` для их анализа. Цель модуля — предоставить приложению простой способ адаптации под возможности пользователя (например, отключать ресурсоемкие анимации на слабых устройствах).

## @author

Kort

## @version

1.0.0

## @see

- `src/hooks/usePerformanceTier.ts`: Хук, который использует этот модуль для предоставления `tier` компонентам.
- `src/components/debug/`: Debug-панели, которые визуализируют данные из этого модуля.

## Алгоритм оценки

Оценка производительности (`score`) вычисляется как сумма баллов по нескольким параметрам:

1.  **Тип платформы (базовые очки):**
    - Desktop: `+50`
    - Tablet: `+35`
    - iOS: `+30`
    - Android: `+25`
2.  **RAM:**
    - Очки варьируются от `+5` (<=2GB) до `+35` (>=16GB). Используется `navigator.deviceMemory` или эвристика по количеству ядер CPU.
3.  **CPU Cores:**
    - Очки варьируются от `+4` (<2 ядра) до `+30` (>=16 ядер). Используется `navigator.hardwareConcurrency`.
4.  **GPU:**
    - Оценивается поддержка WebGL 2.0.
    - Анализируется рендерер (`UNMASKED_RENDERER_WEBGL`) для определения производителя (NVIDIA, AMD, Intel, Apple, Adreno, Mali) и присвоения баллов в зависимости от производительности серии.

## Уровни производительности (Tiers)

- **`low`**: score < 50
- **`medium`**: score >= 50 и < 80
- **`high`**: score >= 80

## @usage

Хук `usePerformanceTier` является основным способом использования этого модуля в приложении.

```tsx
// в src/hooks/usePerformanceTier.ts
import { detectDeviceSpecs, calculatePerformanceScore } from "@/utils/devicePerformance";

const specs = detectDeviceSpecs();
const { tier } = calculatePerformanceScore(specs);
```
