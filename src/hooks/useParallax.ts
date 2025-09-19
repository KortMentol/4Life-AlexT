import { useEffect, useRef } from 'react';

export const useParallax = (speed: number = 0.5) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const isMobile = window.innerWidth < 768;
    let ticking = false;

    const updateTransform = () => {
      const scrolled = window.pageYOffset;
      const parallax = scrolled * speed;
      element.style.transform = `translate3d(0, ${parallax}px, 0)`;
      
      // CSS оптимизации для мобильных
      if (isMobile) {
        element.style.willChange = 'transform';
        element.style.contain = 'layout style paint';
      }
      
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateTransform);
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return ref;
};