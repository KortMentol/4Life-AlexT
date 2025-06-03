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
      return;
    }

    // Only scroll if the pathname has changed
    if (prevPathnameRef.current !== pathname) {
      // Save the current pathname for the next comparison
      prevPathnameRef.current = pathname;
      
      // Force scroll to top with smooth behavior
      const scrollToTop = () => {
        // Try different methods to ensure cross-browser compatibility
        if ('scrollBehavior' in document.documentElement.style) {
          // For modern browsers
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
        } else {
          // For older browsers
          document.documentElement.scrollTop = 0;
          document.body.scrollTop = 0;
        }
      };

      // Execute scroll
      scrollToTop();

      // Add a small delay and try again in case content is loaded asynchronously
      const timer = setTimeout(scrollToTop, 100);
      
      // Cleanup function
      return () => clearTimeout(timer);
    }
  }, [pathname]);

  return null;
}
