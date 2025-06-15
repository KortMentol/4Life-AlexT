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

const RocketExhaust = () => (
  <div className="absolute inset-0 flex justify-center">
    {Array.from({ length: 20 }).map((_, i) => (
      <Particle key={i} />
    ))}
  </div>
);

const ScrollToTopButton: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility, { passive: true });
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

    const scrollToTop = () => {
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 1500); // Длительность анимации выхлопа

    lenis.scrollTo(0, {
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
  };

  return (
    <motion.button
      onClick={scrollToTop}
      variants={buttonVariants}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      whileHover={{ scale: 1.1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`fixed bottom-8 right-8 z-50 p-3 bg-gray-900/60 dark:bg-white/60 text-white dark:text-gray-900 rounded-full shadow-lg backdrop-blur-sm ${isVisible ? 'pointer-events-auto' : 'pointer-events-none'}`}
      aria-label="Вернуться наверх"
    >
            <AnimatePresence>{isClicked && <RocketExhaust />}</AnimatePresence>
      <ChevronUp size={24} className="relative z-10" />
    </motion.button>
  );
};

export default ScrollToTopButton;
