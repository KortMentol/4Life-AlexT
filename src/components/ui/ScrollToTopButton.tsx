import { lenis } from "@/lib/lenis";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp } from "lucide-react";
import React, { useEffect, useState } from "react";

const buttonVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 },
};

const Particle = () => {
  const randomX = (Math.random() - 0.5) * 25;
  const randomY = 30 + Math.random() * 20;
  const randomDuration = 0.5 + Math.random() * 0.5;

  return (
    <motion.div
      className="absolute bottom-0 w-1.5 h-1.5 rounded-full bg-gradient-to-t from-yellow-400 via-orange-500 to-red-600"
      style={{ x: randomX }}
      initial={{ y: 0, opacity: 0.7, scale: 1 }}
      animate={{ y: randomY, opacity: 0, scale: 0 }}
      transition={{ duration: randomDuration, ease: "easeOut" }}
    />
  );
};

const RocketExhaust: React.FC<{ count: number }> = ({ count }) => (
  <div className="absolute inset-0 flex justify-center">
    {Array.from({ length: count }).map((_, i) => (
      <Particle key={i} />
    ))}
  </div>
);

const ScrollToTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  // Определяем мобильное устройство по coarse pointer
  const isMobile = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;
  const particles = isMobile ? 8 : 20;

  useEffect(() => {
    const toggleVisibility = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? scrollTop / docHeight : 0;
      setIsVisible(progress > 0.15);
    };

    window.addEventListener("scroll", toggleVisibility, { passive: true });
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

    const scrollToTop = () => {
    // Останавливаем текущую прокрутку, чтобы сразу начать подниматься наверх
    if (!isMobile) {
      try {
        lenis.stop();
      } catch (_) {/* ignore */}
    }

    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 1500);

    if (isMobile) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Перезапускаем Lenis, чтобы анимация сработала корректно после stop()
      lenis.start();
      lenis.scrollTo(0, {
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
    }
  };

  return (
    <motion.button
      onPointerDown={scrollToTop}
      onClick={scrollToTop}
      variants={buttonVariants}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      whileHover={{ scale: 1.1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`fixed bottom-6 right-4 md:bottom-8 md:right-8 z-50 p-2.5 md:p-3 bg-gray-900/60 dark:bg-white/60 text-white dark:text-gray-900 rounded-full shadow-lg backdrop-blur-sm ${isVisible ? 'pointer-events-auto' : 'pointer-events-none'}`}
      aria-label="Вернуться наверх"
    >
            <AnimatePresence>{isClicked && <RocketExhaust count={particles} />}</AnimatePresence>
      <ChevronUp className="relative z-10 w-5 h-5 md:w-6 md:h-6" />
    </motion.button>
  );
};

export default ScrollToTopButton;
