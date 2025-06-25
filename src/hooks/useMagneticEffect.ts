import { useEffect, useRef } from "react";

/**
 * Опции для хука магнитного эффекта
 */
interface UseMagneticEffectOptions {
  strength?: number;
  distance?: number;
  ease?: number;
}

export const useMagneticEffect = <T extends HTMLElement = HTMLElement>(
  options: UseMagneticEffectOptions = {},
) => {
  const { strength = 0.3, distance = 100, ease = 0.1 } = options;
  const elementRef = useRef<T>(null);
  const animationFrameRef = useRef<number>();
  const mousePositionRef = useRef({ x: 0, y: 0 });
  const elementPositionRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;
      const dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      if (dist < distance) {
        const force = (distance - dist) / distance;
        mousePositionRef.current = {
          x: deltaX * strength * force,
          y: deltaY * strength * force,
        };
      } else {
        mousePositionRef.current = { x: 0, y: 0 };
      }
    };

    const handleMouseLeave = () => {
      mousePositionRef.current = { x: 0, y: 0 };
    };

    const animate = () => {
      const targetX = mousePositionRef.current.x;
      const targetY = mousePositionRef.current.y;

      elementPositionRef.current.x +=
        (targetX - elementPositionRef.current.x) * ease;
      elementPositionRef.current.y +=
        (targetY - elementPositionRef.current.y) * ease;

      element.style.transform = `translate3d(${elementPositionRef.current.x}px, ${elementPositionRef.current.y}px, 0)`;

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    document.addEventListener("mousemove", handleMouseMove);
    element.addEventListener("mouseleave", handleMouseLeave);
    animate();

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      element.removeEventListener("mouseleave", handleMouseLeave);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [strength, distance, ease]);

  return elementRef as React.RefObject<T>;
};
