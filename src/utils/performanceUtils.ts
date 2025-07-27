// Профессиональная детекция производительности устройства
export const getDevicePerformance = () => {
  const cores = navigator.hardwareConcurrency || 4;
  const memory = (navigator as any).deviceMemory || 4;
  const connection = (navigator as any).connection;
  
  // Определяем уровень производительности
  const isHighEnd = cores >= 8 && memory >= 8;
  const isMidRange = cores >= 4 && memory >= 4;
  const isLowEnd = cores < 4 || memory < 4;
  
  // Учитываем скорость соединения
  const isSlowConnection = connection && 
    (connection.effectiveType === 'slow-2g' || 
     connection.effectiveType === '2g' || 
     connection.effectiveType === '3g');

  return {
    isHighEnd: isHighEnd && !isSlowConnection,
    isMidRange: isMidRange && !isSlowConnection,
    isLowEnd: isLowEnd || isSlowConnection,
    cores,
    memory,
    effectiveType: connection?.effectiveType || 'unknown'
  };
};

// Утилита debounce для оптимизации
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Адаптивные настройки эффектов
export const getAdaptiveEffects = () => {
  const perf = getDevicePerformance();
  
  if (perf.isHighEnd) {
    return {
      blur: 'blur(20px) saturate(180%)',
      transition: { type: "spring", stiffness: 300, damping: 30, mass: 0.8 },
      stagger: 0.05,
      enableComplexGradients: true
    };
  }
  
  if (perf.isMidRange) {
    return {
      blur: 'blur(12px) saturate(150%)',
      transition: { type: "tween", duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
      stagger: 0.03,
      enableComplexGradients: true
    };
  }
  
  // Low-end устройства
  return {
    blur: 'blur(6px)',
    transition: { type: "tween", duration: 0.3, ease: "easeOut" },
    stagger: 0.02,
    enableComplexGradients: false
  };
};