/**
 * @module FinalCTASection
 * @description Editorial contact invitation with tier-aware motion.
 * ИСПРАВЛЕНИЯ: Интегрирован идеальный Fade to Void сверху.
 * Удалены жесткие линии (мосты).
 * @version 3.0.0
 */

import { Button, ParallaxSection } from "@/components/ui";
import { usePerformanceTier } from "@/hooks";
import { Icons } from "@/utils/icons";
import { motion, useInView, useReducedMotion } from "framer-motion";
import React, { useRef } from "react";

import bg5Img from "@/assets/images/backgrounds/HomePage/5.jpg";

const FinalCTASection: React.FC = () => {
  const tier = usePerformanceTier();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-15%" });
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = tier !== "low" && !prefersReducedMotion;

  return (
    <ParallaxSection
      backgroundImage={bg5Img}
      altText="Сёрфер у океана на закате, иллюстрация спокойного выбора"
      height="auto"
      contentClasses="flex flex-col items-center justify-center text-center py-32 md:py-48"
      imageBrightness="brightness-[.25]"
      edgeFade={{ top: 250, colorDark: "#03050a" }}
    >
      <div ref={ref} className="container max-w-5xl mx-auto px-6">
        <p className="typography-label mb-6 text-cyan-300">Вопросы по ассортименту и заказу</p>

        {/* Heading */}
        <motion.h2
          initial={shouldAnimate ? { opacity: 0, y: 18 } : false}
          animate={shouldAnimate && isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="text-3xl md:text-5xl lg:text-6xl font-light text-white leading-tight mb-6 tracking-tight"
        >
          Есть вопросы?
          <span className="font-semibold bg-gradient-to-r from-cyan-300 to-white bg-clip-text text-transparent">
            Связь рядом.
          </span>
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={shouldAnimate ? { opacity: 0, y: 12 } : false}
          animate={shouldAnimate && isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="text-lg md:text-xl text-white/70 mb-10 leading-relaxed max-w-2xl mx-auto font-light"
        >
          Александр расскажет об ассортименте и порядке оформления заказа. Актуальные состав и условия доступны до решения о покупке.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={shouldAnimate ? { opacity: 0, y: 12 } : false}
          animate={shouldAnimate && isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row justify-center gap-4 items-center"
        >
          <Button
            to="/contact"
            variant="primary"
            size="lg"
            className="from-cyan-500 to-cyan-600 shadow-2xl shadow-cyan-500/20 rounded-full px-8"
            icon={<Icons.MessageCircle className="w-5 h-5" />}
          >
            Связаться с Александром
          </Button>

          <Button
            to="/products"
            variant="secondary"
            size="lg"
            className="bg-white/10 border-white/25 backdrop-blur-sm rounded-full px-8 hover:bg-white/20"
            icon={<Icons.ArrowRight className="w-5 h-5" />}
          >
            Каталог продуктов
          </Button>
        </motion.div>

        {/* Trust line */}
        <motion.div
          initial={shouldAnimate ? { opacity: 0 } : false}
          animate={shouldAnimate && isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-10 flex items-center justify-center gap-2 text-white/40 text-sm"
        >
          <Icons.Info className="w-4 h-4 text-cyan-400/60 flex-shrink-0" />
          <span>Продукты, заказ и партнёрство — в разных разделах сайта</span>
        </motion.div>
      </div>
    </ParallaxSection>
  );
};

export default React.memo(FinalCTASection);
