import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname } = useLocation();
  const prevPathnameRef = useRef(pathname);
  const isInitialMount = useRef(true);

  useEffect(() => {
    // Skip scroll on initial mount
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return undefined;
    }

    // Only scroll if the pathname has changed
    if (prevPathnameRef.current !== pathname) {
      // Save the current pathname for the next comparison
      prevPathnameRef.current = pathname;
      
      // Use Lenis to scroll to top if available, otherwise fallback to native
      const scrollToTop = () => {
        const lenisInstance = (window as any).lenis;
        if (lenisInstance) {
          // Use Lenis for smooth scrolling
          lenisInstance.scrollTo(0, { immediate: false });
        } else {
          // Fallback for browsers without Lenis
          if ('scrollBehavior' in document.documentElement.style) {
            window.scrollTo({
              top: 0,
              behavior: 'smooth'
            });
          } else {
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;
          }
        }
      };

      // Execute scroll
      scrollToTop();

      // Add a small delay and try again in case content is loaded asynchronously
      const timer = setTimeout(scrollToTop, 100);
      
      // Cleanup function
      return () => clearTimeout(timer);
    }
    
    // Return undefined explicitly when no cleanup is needed
    return undefined;
  }, [pathname]);

  return null;
}
