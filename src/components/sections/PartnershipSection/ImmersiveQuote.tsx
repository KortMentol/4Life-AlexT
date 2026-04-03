import { motion, useInView, useTransform } from "framer-motion";
import React, { useRef } from "react";
import { IS_TOUCH, type SharedProps } from "./types";

const ImmersiveQuote: React.FC<SharedProps> = ({ scrollYProgress, tier, isDark }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, margin: "-25%" });

  // Только useTransform — compositor-only, 0 нагрузки на main thread
  const scale = useTransform(scrollYProgress, [0.15, 0.32, 0.45], [IS_TOUCH ? 0.97 : 0.92, 1, IS_TOUCH ? 0.99 : 0.96]);
  const opacity = useTransform(scrollYProgress, [0.15, 0.28, 0.48], [0, 1, 0.2]);
  const y = useTransform(scrollYProgress, [0.15, 0.32, 0.48], [IS_TOUCH ? 30 : 80, 0, IS_TOUCH ? -15 : -40]);

  const textColor = isDark ? "text-white/90" : "text-slate-900/90";
  const footerColor = isDark ? "text-white/35" : "text-slate-600/60";
  const quoteMarkColor = isDark ? "text-cyan-500/8" : "text-cyan-600/10";

  if (tier === "low") {
    return (
      <motion.div
        ref={ref}
        className="relative flex items-center justify-center px-6 py-20 md:py-28"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-15%" }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <blockquote className="relative">
            <span
              className={`absolute -top-10 -left-4 md:-left-6 text-7xl md:text-8xl font-serif select-none pointer-events-none ${quoteMarkColor}`}
            >
              &ldquo;
            </span>
            <p
              className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light leading-snug tracking-tight ${textColor}`}
            >
              Люди устали от рекламы. Они покупают <span className="text-cyan-400">доверие</span>,{" "}
              <span className="text-blue-400">экспертность</span> и{" "}
              <span className="text-violet-400">личное отношение</span>.
            </p>
            <footer className={`mt-10 text-lg font-light ${footerColor}`}>— Философия партнерства 4Life</footer>
          </blockquote>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className="relative flex items-center justify-center px-6 py-32 md:py-48"
      style={{
        y,
        opacity,
        scale,
      }}
    >
      <div className="max-w-4xl mx-auto text-center">
        <motion.blockquote
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          <span
            className={`absolute -top-10 -left-4 md:-left-6 text-7xl md:text-8xl font-serif select-none pointer-events-none ${quoteMarkColor}`}
          >
            &ldquo;
          </span>

          <p
            className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light leading-snug tracking-tight ${textColor}`}
          >
            Люди устали от рекламы. Они покупают <span className="text-cyan-400">доверие</span>,{" "}
            <span className="text-blue-400">экспертность</span> и{" "}
            <span className="text-violet-400">личное отношение</span>.
          </p>

          <footer className={`mt-10 text-lg font-light ${footerColor}`}>— Философия партнерства 4Life</footer>
        </motion.blockquote>
      </div>
    </motion.div>
  );
};

export default React.memo(ImmersiveQuote);
