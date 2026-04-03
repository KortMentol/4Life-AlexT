/**
 * @module FinalCTASection
 * @description Awwwards 2026 — Final CTA with stats, immersive parallax, tier-aware.
 * @version 2.0.0
 */

import { Button, ParallaxSection } from "@/components/ui";
import { usePerformanceTier } from "@/hooks";
import { Icons } from "@/utils/icons";
import { motion, useInView } from "framer-motion";
import React, { useRef } from "react";

import bg5Img from "@/assets/images/backgrounds/HomePage/5.jpg";

const stats = [
  { value: "50+", label: "стран мира" },
  { value: "25+", label: "лет науки" },
  { value: "283%", label: "рост NK-клеток" },
];

const FinalCTASection: React.FC = () => {
  const tier = usePerformanceTier();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-15%" });

  const staggerDelay = tier === "low" ? 0 : 0.1;

  return (
    <ParallaxSection
      backgroundImage={bg5Img}
      altText="Готовы сделать первый шаг к здоровью"
      height="auto"
      contentClasses="flex flex-col items-center justify-center text-center py-20 md:py-28"
      imageBrightness="brightness-[.35] dark:brightness-[.25]"
      edgeFade={{ top: 160 }}
    >
      <div ref={ref} className="container max-w-5xl mx-auto px-6">
        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex justify-center gap-8 md:gap-16 mb-12"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * staggerDelay, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center gap-1"
            >
              <span className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                {stat.value}
              </span>
              <span className="text-xs md:text-sm text-white/50 uppercase tracking-wider font-medium">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="h-px w-32 mx-auto mb-12 origin-center"
          style={{ background: "linear-gradient(90deg, transparent, rgba(6,182,212,0.6), transparent)" }}
        />

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="text-3xl md:text-5xl lg:text-6xl font-light text-white leading-tight mb-6 tracking-tight"
        >
          Готовы сделать{" "}
          <span className="font-semibold bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400 bg-clip-text text-transparent">
            первый шаг?
          </span>
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="text-lg md:text-xl text-white/70 mb-10 leading-relaxed max-w-2xl mx-auto font-light"
        >
          Получите персональную консультацию. Я помогу подобрать продукты под ваши цели и объясню как они работают — без
          давления и обязательств.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row justify-center gap-4 items-center"
        >
          <Button
            to="/contact"
            variant="primary"
            size="lg"
            className="from-cyan-500 to-blue-600 shadow-2xl shadow-cyan-500/20 rounded-full px-8"
            icon={<Icons.MessageCircle className="w-5 h-5" />}
          >
            Получить консультацию
          </Button>

          <Button
            to="/products"
            variant="secondary"
            size="lg"
            className="bg-white/10 border-white/25 backdrop-blur-sm rounded-full px-8 hover:bg-white/20"
            icon={<Icons.ArrowRight className="w-5 h-5" />}
          >
            Изучить продукты
          </Button>
        </motion.div>

        {/* Trust line */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-10 flex items-center justify-center gap-2 text-white/40 text-sm"
        >
          <Icons.Shield className="w-4 h-4 text-cyan-400/60 flex-shrink-0" />
          <span>Консультация бесплатна и ни к чему не обязывает</span>
        </motion.div>
      </div>
    </ParallaxSection>
  );
};

export default React.memo(FinalCTASection);
