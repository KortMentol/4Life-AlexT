// Тип для экземпляра Fluid (можно расширить по мере необходимости)
import WebGLFluidEnhanced from "webgl-fluid-enhanced";
// Если TS не ругается:
export type FluidInstance = InstanceType<typeof WebGLFluidEnhanced>;
// Если всё равно ошибка — временно:
// export type FluidInstance = any;

