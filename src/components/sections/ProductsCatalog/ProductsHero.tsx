import productsHeroVideo from "@/assets/videos/backgrounds/ProductsPage/Hero-section/bg-video-ProductsPage.mp4";
import { usePerformanceTier } from "@/hooks";
import { lenis } from "@/lib/lenis";
import { motion, useScroll, useTransform } from "framer-motion";
import React, { useRef } from "react";

const ProductsHero: React.FC = () => {
  const tier = usePerformanceTier();
  const spacerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: spacerRef,
    offset: ["start start", "end start"],
  });

  const isLowTier = tier === "low";
  const isHighTier = tier === "high";

  const scale = useTransform(
    scrollYProgress,
    [0, 1],
    [1, isLowTier ? 1 : 0.85],
  );
  const opacity = useTransform(
    scrollYProgress,
    [0, 1],
    [1, isLowTier ? 0.3 : 0.1],
  );
  const overlayOpacity = useTransform(
    scrollYProgress,
    [0, 1],
    [0, isHighTier ? 1 : 0],
  );

  // willChange только пока элемент активно анимируется (opacity > 0.01)
  // Когда hero полностью ушёл — снимаем GPU слой
  const dynamicWillChange = useTransform(opacity, (val) =>
    val > 0.02 ? "transform, opacity" : "auto",
  );

  return (
    <>
      {/* Приклеенное видео на фоне */}
      <div className="fixed inset-0 w-full h-screen z-0 pointer-events-none bg-black">
        <motion.div
          className="w-full h-full origin-center"
          style={{
            scale,
            opacity,
            transform: "translateZ(0)",
            willChange: dynamicWillChange,
          }}
        >
          <video
            autoPlay
            muted
            loop
            playsInline
            disablePictureInPicture
            className="w-full h-full object-cover"
          >
            <source src={productsHeroVideo} type="video/mp4" />
          </video>
          {/* Blur через backdrop-filter overlay — системный композитор, в 10 раз быстрее */}
          {isHighTier && (
            <motion.div
              className="absolute inset-0 backdrop-blur-2xl bg-black/10 pointer-events-none"
              style={{ opacity: overlayOpacity, willChange: "opacity" }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
        </motion.div>
      </div>

      {/* Приклеенный текст поверх видео */}
      <div className="fixed inset-0 w-full h-screen z-0 flex items-center justify-center pointer-events-none">
        <motion.div
          style={{
            opacity,
            scale,
            transform: "translateZ(0)",
            willChange: dynamicWillChange,
          }}
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
            onClick={() => {
              if (lenis) {
                lenis.scrollTo(window.innerHeight, { duration: 1.2 });
              } else {
                window.scrollTo({
                  top: window.innerHeight,
                  behavior: "smooth",
                });
              }
            }}
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
