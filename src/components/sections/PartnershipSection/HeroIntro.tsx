import { lenis } from "@/lib/lenis";
import { motion, useInView, useTransform } from "framer-motion";
import { ChevronDown, Sparkles } from "lucide-react";
import React, { useCallback, useRef } from "react";
import { IS_TOUCH, type SharedProps } from "./types";

const HeroIntro: React.FC<SharedProps> = ({ scrollYProgress, tier, isDark }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, margin: "-10%" });

  // На touch — только useTransform без useSpring (compositor-only, не грузит main thread)
  const y = useTransform(scrollYProgress, [0, 0.3], [0, IS_TOUCH ? -30 : -80]);
  const opacity = useTransform(scrollYProgress, [0, 0.22], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.22], [1, IS_TOUCH ? 1 : 0.96]);

  // Клик "Погружение" — всегда скроллит к следующему блоку (ImmersiveQuote)
  // Ищем следующий sibling в content-div, не фиксированное смещение
  const handleScrollDown = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    // Следующий элемент после HeroIntro в DOM
    const next = el.nextElementSibling as HTMLElement | null;
    if (next) {
      lenis.scrollTo(next, {
        offset: 0,
        duration: 1.6,
        easing: (t: number) => 1 - Math.pow(1 - t, 4),
      });
    } else {
      // Fallback: скролл на один экран вниз от начала секции
      const section = el.closest("section");
      if (section) {
        lenis.scrollTo(section.getBoundingClientRect().top + window.scrollY + window.innerHeight, {
          duration: 1.6,
          easing: (t: number) => 1 - Math.pow(1 - t, 4),
        });
      }
    }
  }, []);

  const textColor = isDark ? "text-white/90" : "text-slate-900/90";
  const subtitleColor = isDark ? "text-white/60" : "text-slate-700/80";
  const badgeBg = isDark
    ? "bg-cyan-500/10 border-cyan-500/20 text-cyan-400"
    : "bg-cyan-600/10 border-cyan-600/25 text-cyan-700";
  const indicatorColor = isDark ? "text-white/30" : "text-slate-500/60";

  return (
    <motion.div
      ref={ref}
      className="relative min-h-screen flex flex-col items-center justify-center px-6 py-20"
      style={{
        y: tier !== "low" ? y : 0,
        opacity,
        scale: tier !== "low" ? scale : 1,
      }}
    >
      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="mb-8"
      >
        <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium ${badgeBg}`}>
          <Sparkles className="w-4 h-4" />
          Партнерство нового поколения
        </span>
      </motion.div>

      {/* Heading */}
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="text-center max-w-5xl"
      >
        <span
          className={`block text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light tracking-tight leading-[0.95] mb-4 ${textColor}`}
        >
          Масштабируйте
        </span>
        <span className="block text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light tracking-tight leading-[0.95]">
          <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400 bg-clip-text text-transparent">
            свою экспертизу
          </span>
        </span>
      </motion.h2>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`mt-8 text-lg sm:text-xl md:text-2xl text-center max-w-2xl leading-relaxed font-light ${subtitleColor}`}
      >
        Бизнес на науке и доверии. Экологичная модель, где вы становитесь экспертом-проводником к качественной жизни.
      </motion.p>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 1.2 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2"
      >
        <button
          onClick={handleScrollDown}
          aria-label="Прокрутить вниз"
          className={`flex flex-col items-center gap-2 cursor-pointer select-none px-4 py-3 rounded-2xl transition-opacity duration-200 hover:opacity-70 active:opacity-50 ${indicatorColor}`}
          style={{ WebkitTapHighlightColor: "transparent", background: "transparent", border: "none" }}
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-2"
          >
            <span className="text-xs uppercase tracking-[0.25em]">Погружение</span>
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </button>
      </motion.div>
    </motion.div>
  );
};

export default React.memo(HeroIntro);
