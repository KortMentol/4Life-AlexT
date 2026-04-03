import { motion, useInView, useTransform } from "framer-motion";
import { Shield, Users, Zap } from "lucide-react";
import React, { useMemo, useRef } from "react";
import FeatureCard from "./FeatureCard";
import { IS_TOUCH, type FeatureCardData, type SharedProps } from "./types";

const FeaturesGrid: React.FC<SharedProps> = ({ scrollYProgress, tier, isDark }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, margin: "-15%" });

  const features: FeatureCardData[] = useMemo(
    () => [
      {
        id: 1,
        title: "Готовая инфраструктура",
        description:
          "Забудьте о закупках и логистике. Распределительные центры берут на себя доставку и сервис. Ваша задача — консалтинг.",
        icon: Zap,
        image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&auto=format&fit=crop&q=80",
        accent: "from-cyan-500 to-blue-600",
      },
      {
        id: 2,
        title: "Прозрачная экономика",
        description:
          "Понятная финансовая модель с выплатами до 64%. Никаких скрытых условий — только чистая математика усилий.",
        icon: Shield,
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80",
        accent: "from-emerald-500 to-teal-600",
      },
      {
        id: 3,
        title: "Наставничество",
        description: "Прямой доступ к опыту и алгоритмам запуска. Индивидуальное сопровождение до первых результатов.",
        icon: Users,
        image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80",
        accent: "from-violet-500 to-purple-600",
      },
    ],
    [],
  );

  // Только useTransform — compositor-only
  const y = useTransform(scrollYProgress, [0.42, 0.58], [IS_TOUCH ? 20 : 60, 0]);
  const opacity = useTransform(scrollYProgress, [0.42, 0.55], [0, 1]);

  const headingColor = isDark ? "text-white/90" : "text-slate-900/90";
  const subColor = isDark ? "text-white/35" : "text-slate-600/70";

  return (
    <motion.div
      ref={ref}
      className="relative min-h-screen flex items-center justify-center px-6 py-20"
      style={{
        y: tier !== "low" ? y : 0,
        opacity: tier !== "low" ? opacity : 1,
      }}
    >
      <div className="max-w-6xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-14"
        >
          <h3 className={`text-3xl sm:text-4xl md:text-5xl font-light tracking-tight mb-4 ${headingColor}`}>
            Почему это работает
          </h3>
          <p className={`text-lg max-w-xl mx-auto font-light ${subColor}`}>
            Система, где наука встречается с предпринимательством
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-7">
          {features.map((card, i) => (
            <FeatureCard key={card.id} card={card} index={i} tier={tier} isActive={isInView} isDark={isDark} />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default React.memo(FeaturesGrid);
