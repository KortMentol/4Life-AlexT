import React, { useEffect, useRef } from 'react';
import WebGLFluidEnhanced from 'webgl-fluid-enhanced';
import { useFluid } from './FluidContext';

interface FluidSimulationProps {
  colorPalette?: string[];
  brightness?: number;
  transparent?: boolean;
  className?: string;
}

const FluidSimulation: React.FC<FluidSimulationProps> = ({
  colorPalette = ['#4285f4', '#ea4335', '#fbbc05', '#34a853', '#ff6d01'],
  brightness = 1.0,
  transparent = true,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const simulationRef = useRef<WebGLFluidEnhanced | null>(null);
  const { setFluidInstance } = useFluid();

  useEffect(() => {
    if (!containerRef.current) return;

    // Инициализация симуляции
    simulationRef.current = new WebGLFluidEnhanced(containerRef.current);
    
    // Настройка параметров
    simulationRef.current.setConfig({
      colorPalette,
      transparent,
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
    
    // Сохраняем экземпляр в контексте
    setFluidInstance(simulationRef.current);

    return () => {
      if (simulationRef.current) {
        simulationRef.current.stop();
        simulationRef.current = null;
        setFluidInstance(null);
      }
    };
  }, [colorPalette, transparent, brightness, setFluidInstance]);

  return (
    <div className={`fixed left-0 top-0 h-full w-full pointer-events-none z-50 ${className}`}>
      <div ref={containerRef} className="h-full w-full" />
    </div>
  );
};

export default FluidSimulation;