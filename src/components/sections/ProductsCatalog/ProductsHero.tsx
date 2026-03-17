import productsHeroVideo from "@/assets/videos/backgrounds/ProductsPage/Hero-section/bg-video-ProductsPage.mp4";
import { usePerformanceTier } from "@/hooks";
import { lenis } from "@/lib/lenis";
import { motion, useMotionTemplate, useScroll, useTransform } from "framer-motion";
import React, { useRef } from "react";

const ProductsHero: React.FC = () => {
  const tier = usePerformanceTier();
  const spacerRef = useRef<HTMLDivElement>(null);

  // Считываем прогресс скролла только в зоне первого экрана
  const { scrollYProgress } = useScroll({
    target: spacerRef,
    offset: ["start start", "end start"],
  });

  const isLowTier = tier === "low";
  const isHighTier = tier === "high";

  // Zero-Render Физика:
  // Scale (уход вглубь) отключен на слабых устройствах
  const scale = useTransform(scrollYProgress, [0, 1], [1, isLowTier ? 1 : 0.85]);
  // Opacity (уход в темноту) работает везде
  const opacity = useTransform(scrollYProgress, [0, 1], [1, isLowTier ? 0.3 : 0.1]);
  // Blur (размытие) работает ТОЛЬКО на High Tier
  const blurRaw = useTransform(scrollYProgress, [0, 1], [0, isHighTier ? 16 : 0]);
  const filter = useMotionTemplate`blur(${blurRaw}px)`;

  return (
    <>
      {/* Приклеенное видео на фоне */}
      <div className="fixed inset-0 w-full h-screen z-0 pointer-events-none bg-black">
        <motion.div
          className="w-full h-full origin-center"
          style={{
            scale,
            opacity,
            filter,
            transform: "translateZ(0)",
            willChange: "transform, opacity, filter",
          }}
        >
          <video autoPlay muted loop playsInline disablePictureInPicture className="w-full h-full object-cover">
            <source src={productsHeroVideo} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
        </motion.div>
      </div>

      {/* Приклеенный текст поверх видео */}
      <div className="fixed inset-0 w-full h-screen z-0 flex items-center justify-center pointer-events-none">
        <motion.div
          style={{ opacity, scale, transform: "translateZ(0)", willChange: "transform, opacity" }}
          className="text-center px-6 max-w-5xl mx-auto text-white"
        >
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold mb-6 tracking-tight drop-shadow-2xl">
            Каталог здоровья
          </h1>
          <p className="text-lg md:text-2xl text-white/90 max-w-2xl mx-auto font-medium drop-shadow-lg mb-10">
            Откройте для себя инновации 4Life с Трансфер Факторами
          </p>
          <button
            style={{ pointerEvents: "auto" }}
            onClick={() => lenis.scrollTo(window.innerHeight, { duration: 1.2 })}
            className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-lg font-semibold shadow-2xl active:scale-95 transition-transform"
          >
            Исследовать
          </button>
        </motion.div>
      </div>

      {/* Невидимый блок, который создает физическое место для скролла */}
      <div ref={spacerRef} className="h-[100vh] w-full" />
    </>
  );
};

export default React.memo(ProductsHero);
