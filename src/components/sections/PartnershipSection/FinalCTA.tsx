import { Button } from "@/components/ui";
import { Icons } from "@/utils/icons";
import { AnimatePresence, motion, useInView, useTransform } from "framer-motion";
import React, { useRef } from "react";
import { IS_TOUCH, type SharedProps } from "./types";

const FinalCTA: React.FC<SharedProps> = ({ scrollYProgress, tier, isDark }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, margin: "-15%" });
  const [isHovered, setIsHovered] = React.useState(false);

  // Только useTransform — compositor-only
  const y = useTransform(scrollYProgress, [0.72, 0.88], [IS_TOUCH ? 20 : 50, 0]);
  const opacity = useTransform(scrollYProgress, [0.72, 0.85], [0, 1]);

  const mainTextColor = isDark ? "text-white/65" : "text-slate-700/80";
  const accentTextColor = isDark ? "text-white/90" : "text-slate-900";
  const noteColor = isDark ? "text-white/25" : "text-slate-500/60";

  return (
    <motion.div
      ref={ref}
      className="relative flex items-center justify-center px-6 py-24 md:py-32"
      style={{
        y: tier !== "low" ? y : 0,
        opacity: tier !== "low" ? opacity : 1,
      }}
    >
      <div className="text-center max-w-3xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className={`text-xl sm:text-2xl md:text-3xl font-light leading-relaxed mb-12 ${mainTextColor}`}
        >
          Ваш актив — это не склад продукции.
          <br />
          <span className={accentTextColor}>Ваш актив — лояльное комьюнити и отлаженная система.</span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="relative inline-block"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <AnimatePresence>
            {isHovered && tier === "high" && !IS_TOUCH && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 0.5, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 blur-xl"
              />
            )}
          </AnimatePresence>

          <Button
            to="/partnership"
            variant="primary"
            size="lg"
            className="from-cyan-500 to-blue-600 shadow-2xl shadow-cyan-500/20 rounded-full px-10 py-5 text-lg font-medium"
            icon={
              <motion.span animate={{ x: isHovered && !IS_TOUCH ? 4 : 0 }} transition={{ duration: 0.2 }}>
                <Icons.ArrowRight className="w-5 h-5" />
              </motion.span>
            }
          >
            Обсудить сотрудничество
          </Button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.35 }}
          className={`mt-6 text-sm font-light ${noteColor}`}
        >
          Консультация ни к чему не обязывает. Просто оценим совпадение целей.
        </motion.p>
      </div>
    </motion.div>
  );
};

export default React.memo(FinalCTA);
