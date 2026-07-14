/**
 * @module src/components/sections/ProductsCatalog/ProductsHero.tsx
 * @description Секция Hero для каталога продуктов.
 * Переведена на единую высокопроизводительную оркестровку PageEntrance.
 * Интегрирован унифицированный компонент Button.
 * @author Geminis AI & Kort
 * @version 13.0.0
 */

import { PageEntrance } from "@/components/transitions/PageEntrance";
import { Button } from "@/components/ui";
import { usePerformanceTier } from "@/hooks";
import { lenis } from "@/lib/lenis";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import React, { useEffect, useRef } from "react";

const productsHeroVideo = "/videos/bg-video-products-page.mp4";

const ProductsHero: React.FC = () => {
  const tier = usePerformanceTier();
  const spacerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isHeroVisible = useInView(spacerRef, { margin: "0px" });

  const { scrollYProgress } = useScroll({
    target: spacerRef,
    offset: ["start start", "end start"],
  });

  const isLowTier = tier === "low";
  const isHighTier = tier === "high";

  const scale = useTransform(scrollYProgress, [0, 1], [1, isLowTier ? 1 : 0.85]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, isLowTier ? 0.3 : 0.1]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 1], [0, isHighTier ? 1 : 0]);

  const dynamicWillChange = useTransform(opacity, (val) => (val > 0.02 ? "transform, opacity" : "auto"));

  useEffect(() => {
    if (!videoRef.current) return;
    if (isHeroVisible) {
      videoRef.current.play().catch(() => {});
    } else {
      videoRef.current.pause();
    }
  }, [isHeroVisible]);

  const handleExploreScroll = () => {
    if (lenis) {
      lenis.scrollTo(window.innerHeight, { duration: 1.2 });
    } else {
      window.scrollTo({
        top: window.innerHeight,
        behavior: "smooth",
      });
    }
  };

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
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            disablePictureInPicture
            className="w-full h-full object-cover"
          >
            <source src={productsHeroVideo} type="video/mp4" />
          </video>
          {isHighTier && (
            <motion.div
              className="absolute inset-0 backdrop-blur-2xl bg-black/10 pointer-events-none"
              style={{ opacity: overlayOpacity, willChange: "opacity" }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
        </motion.div>
      </div>

      {/* Приклеенный контент поверх видео c оркестровкой PageEntrance */}
      <div className="fixed inset-0 w-full h-screen z-0 flex items-center justify-center pointer-events-none">
        <PageEntrance className="text-center px-6 max-w-5xl mx-auto text-white">
          {/* Title */}
          <div data-entrance="title" className="mb-6">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight drop-shadow-2xl">
              Каталог здоровья
            </h1>
          </div>

          {/* Lead Description */}
          <div data-entrance="lead" className="mb-10">
            <p className="text-lg md:text-2xl text-white/90 max-w-2xl mx-auto font-medium drop-shadow-lg leading-relaxed text-pretty">
              Откройте для себя инновации 4Life
              <br />с Трансфер Факторами
            </p>
          </div>

          {/* Action Button Container */}
          <div data-entrance="buttons" className="flex justify-center items-center pointer-events-auto">
            <Button
              variant="primary"
              size="lg"
              onClick={handleExploreScroll}
              className="w-[85vw] max-w-[280px] sm:w-auto sm:max-w-none"
            >
              Исследовать
            </Button>
          </div>
        </PageEntrance>
      </div>

      <div ref={spacerRef} className="h-[100vh] w-full" />
    </>
  );
};

export default React.memo(ProductsHero);
