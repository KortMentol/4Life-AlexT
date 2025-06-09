import React, { useEffect, useRef } from 'react';
import WebGLFluidEnhanced from 'webgl-fluid-enhanced';

const FluidEffect: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const simulationRef = useRef<WebGLFluidEnhanced | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Инициализация симуляции
    simulationRef.current = new WebGLFluidEnhanced(containerRef.current);
    
    // Настройка параметров
    simulationRef.current.setConfig({
      colorPalette: ['#3b82f6', '#6366f1', '#8b5cf6', '#d946ef', '#ec4899'],
      transparent: true,
      brightness: 0.7,
      densityDissipation: 1,
      velocityDissipation: 0.2,
      pressure: 0.8,
      pressureIterations: 20,
      curl: 30,
      splatRadius: 0.15,
      splatForce: 4000,
      shading: true,
      colorful: true,
      colorUpdateSpeed: 10,
      hover: true,
      bloom: true,
      bloomIterations: 8,
      bloomResolution: 256,
      bloomIntensity: 0.4,
      bloomThreshold: 0.8,
      bloomSoftKnee: 0.7,
      sunrays: true,
      sunraysResolution: 196,
      sunraysWeight: 0.6,
    });
    
    // Запуск симуляции
    simulationRef.current.start();
    
    // Создаем начальные всплески
    simulationRef.current.multipleSplats(5);

    return () => {
      if (simulationRef.current) {
        simulationRef.current.stop();
        simulationRef.current = null;
      }
    };
  }, []);

  return (
    <div className="fixed left-0 top-0 w-full h-full" style={{ zIndex: 5 }}>
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
};

export default FluidEffect;