/**
 * @module src/components/sections/ProductsCatalog/ProductsHero.tsx
 * @description Awwwards SOTY 2027+ Luminous Obsidian Opening for /products.
 * Positions ambient golden particle video cleanly in the right focal field over pure #03050a obsidian,
 * fading out the lab still-life fallback completely once video is ready (zero double-exposure bleed),
 * with HomePage-grade cubic Fade-to-Void bottom dissolve and subtle desktop editorial scroll recession.
 */

import heroObsidianLabImg from "@/assets/images/products_hero_obsidian_lab_1795409513409.jpg";
import { PageEntrance } from "@/components/transitions/PageEntrance";
import { Button } from "@/components/ui";
import { useIsMobile, usePerformanceTier } from "@/hooks";
import { Icons } from "@/utils/icons";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";

const productsHeroVideo = "/videos/bg-video-products-page.mp4";

interface ProductsHeroProps {
  totalCount: number;
  onExploreCatalog: () => void;
}

interface HeroParallaxMediaProps {
  sectionRef: React.RefObject<HTMLElement | null>;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  isVideoReady: boolean;
  onVideoReady: () => void;
  enableVideo: boolean;
}

const HeroParallaxMedia: React.FC<HeroParallaxMediaProps> = ({
  sectionRef,
  videoRef,
  isVideoReady,
  onVideoReady,
  enableVideo,
}) => {
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const mediaY = useTransform(scrollYProgress, [0, 1], ["0%", "14%"]);
  const mediaScale = useTransform(scrollYProgress, [0, 1], [1.02, 1.08]);

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden bg-[#03050a]"
      style={{ y: mediaY, scale: mediaScale, willChange: "transform" }}
    >
      {/* Still-life fallback fades out completely to 0 once video renders (zero ghost flasks bleed-through) */}
      <img
        src={heroObsidianLabImg}
        alt=""
        fetchPriority="high"
        decoding="async"
        data-hero-fallback-img="true"
        className={`w-full h-full object-cover object-[74%_center] sm:object-center brightness-[1.2] contrast-[1.05] transition-opacity duration-700 ${
          enableVideo && isVideoReady ? "opacity-0" : "opacity-100"
        }`}
      />

      {/* Right-shifted golden particle nebula with seamless radial/linear obsidian edge softening */}
      {enableVideo && (
        <div
          data-hero-video-stage="true"
          className={`absolute inset-y-0 right-0 w-full lg:w-[82%] translate-x-[10%] md:translate-x-[15%] lg:translate-x-[16%] transition-opacity duration-700 ${
            isVideoReady ? "opacity-100" : "opacity-0"
          }`}
        >
          <video
            ref={videoRef as React.RefObject<HTMLVideoElement>}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            disablePictureInPicture
            onLoadedData={onVideoReady}
            onCanPlay={onVideoReady}
            className="w-full h-full object-cover object-center"
          >
            <source src={productsHeroVideo} type="video/mp4" />
          </video>

          {/* Soft obsidian feathering on the left edge of the shifted video stage so zero seam is visible */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 w-[34%]"
            style={{
              backgroundImage: "linear-gradient(90deg, #03050a 0%, rgba(3,5,10,0.82) 38%, rgba(3,5,10,0) 100%)",
            }}
          />
        </div>
      )}
    </motion.div>
  );
};

interface HeroContentParallaxProps {
  sectionRef: React.RefObject<HTMLElement | null>;
  children: React.ReactNode;
}

const HeroContentParallax: React.FC<HeroContentParallaxProps> = ({ sectionRef, children }) => {
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const contentY = useTransform(scrollYProgress, [0, 1], [0, 44]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.72, 1], [1, 0.72, 0.18]);

  return (
    <motion.div
      data-hero-scroll-recess="true"
      className="relative z-10 w-full"
      style={{ y: contentY, opacity: contentOpacity }}
    >
      {children}
    </motion.div>
  );
};

const ProductsHero: React.FC<ProductsHeroProps> = ({ totalCount, onExploreCatalog }) => {
  const tier = usePerformanceTier();
  const isMobile = useIsMobile();
  const isLow = tier === "low";
  const enableParallax = !isLow && !isMobile;

  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const saveDataEnabled =
    typeof navigator !== "undefined" &&
    Boolean((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData);
  const enableVideo = !prefersReducedMotion && !saveDataEnabled;

  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isHeroVisible = useInView(sectionRef, { margin: "80px 0px 80px 0px" });
  const [isVideoReady, setIsVideoReady] = useState(false);

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    if (vid.readyState >= 2) setIsVideoReady(true);
    if (!isVideoReady) return;
    if (isHeroVisible) {
      vid.play().catch(() => {});
    } else {
      vid.pause();
    }
  }, [isHeroVisible, isVideoReady]);

  const heroContent = (
    <PageEntrance className="relative z-10 w-full max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 pt-36 pb-16 sm:pb-20 lg:pb-24">
      <div className="max-w-2xl space-y-6">
        <div data-entrance="badge" className="inline-flex items-center gap-3">
          <span className="w-7 h-px bg-cyan-400/90" aria-hidden="true" />
          <p className="typography-label text-cyan-300">
            Коллекция 4Life · {totalCount} формул · Оригинал из США
          </p>
        </div>

        <div data-entrance="title">
          <h1 className="typography-display text-white [text-shadow:0_4px_24px_rgba(0,0,0,0.65)]">
            Формулы{" "}
            <span className="font-light text-cyan-300">иммунной</span>{" "}
            памяти
          </h1>
        </div>

        <div data-entrance="lead">
          <p className="typography-lead text-slate-200/95 max-w-xl">
            Оригинальные пептидные комплексы Transfer Factor и целевая нутрицевтика напрямую со склада в Москве.
          </p>
        </div>

        <div data-entrance="buttons" className="pt-2">
          <Button
            variant="primary"
            size="lg"
            onClick={onExploreCatalog}
            icon={<Icons.ChevronDown className="w-4 h-4 text-cyan-300" />}
          >
            Выбрать формулу
          </Button>
        </div>
      </div>
    </PageEntrance>
  );

  return (
    <section
      ref={sectionRef}
      data-products-hero="true"
      className="relative min-h-[64svh] lg:min-h-[74svh] w-full bg-[#03050a] overflow-hidden flex items-end"
    >
      {/* Background Architectural Media */}
      {enableParallax && !prefersReducedMotion ? (
        <HeroParallaxMedia
          sectionRef={sectionRef}
          videoRef={videoRef}
          isVideoReady={isVideoReady}
          onVideoReady={() => setIsVideoReady(true)}
          enableVideo={enableVideo}
        />
      ) : (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden bg-[#03050a]">
          <img
            src={heroObsidianLabImg}
            alt=""
            fetchPriority="high"
            decoding="async"
            data-hero-fallback-img="true"
            className={`w-full h-full object-cover object-[74%_center] sm:object-center brightness-[1.18] transition-opacity duration-700 ${
              enableVideo && isVideoReady ? "opacity-0" : "opacity-100"
            }`}
          />
          {enableVideo && (
            <div
              data-hero-video-stage="true"
              className={`absolute inset-y-0 right-0 w-full lg:w-[82%] translate-x-[10%] md:translate-x-[15%] lg:translate-x-[16%] transition-opacity duration-700 ${
                isVideoReady ? "opacity-100" : "opacity-0"
              }`}
            >
              <video
                ref={videoRef}
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                disablePictureInPicture
                onLoadedData={() => setIsVideoReady(true)}
                onCanPlay={() => setIsVideoReady(true)}
                className="w-full h-full object-cover object-center"
              >
                <source src={productsHeroVideo} type="video/mp4" />
              </video>
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 left-0 w-[34%]"
                style={{
                  backgroundImage:
                    "linear-gradient(90deg, #03050a 0%, rgba(3,5,10,0.82) 38%, rgba(3,5,10,0) 100%)",
                }}
              />
            </div>
          )}
        </div>
      )}

      {/* Subtle Sapphire-Obsidian Studio Depth */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          backgroundImage:
            "radial-gradient(56% 70% at 78% 45%, rgba(56, 189, 248, 0.14) 0%, rgba(3, 5, 10, 0) 76%), radial-gradient(48% 58% at 16% 74%, rgba(30, 64, 175, 0.16) 0%, rgba(3, 5, 10, 0) 74%)",
        }}
      />

      {/* Measured Contrast Scrim — clean dark obsidian behind left headline, luminous particles on right */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          backgroundImage:
            "linear-gradient(94deg, #03050a 0%, rgba(3,5,10,0.92) 30%, rgba(3,5,10,0.48) 54%, rgba(3,5,10,0.06) 80%, rgba(3,5,10,0.34) 100%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(3,5,10,0.58) 0%, rgba(3,5,10,0.04) 24%, rgba(3,5,10,0.08) 64%, rgba(3,5,10,0.78) 88%, #03050a 100%)",
        }}
      />

      {/* HomePage-Grade Cubic "Fade to Void" Bottom Edge Dissolve (0px seam into #catalog-archive) */}
      <div
        aria-hidden="true"
        data-hero-bottom-fade="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-36 sm:h-44 z-[2]"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(3,5,10,0) 0%, rgba(3,5,10,0.12) 28%, rgba(3,5,10,0.42) 56%, rgba(3,5,10,0.82) 82%, #03050a 100%)",
        }}
      />

      {/* Editorial Opening Composition with Subtle Desktop Scroll Recession */}
      {enableParallax && !prefersReducedMotion ? (
        <HeroContentParallax sectionRef={sectionRef}>{heroContent}</HeroContentParallax>
      ) : (
        heroContent
      )}
    </section>
  );
};

export default React.memo(ProductsHero);
