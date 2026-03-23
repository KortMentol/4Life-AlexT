import { Button } from "@/components/ui";
import { useIsMobile } from "@/hooks/useIsMobile";
import { usePerformanceTier } from "@/hooks/usePerformanceTier";
import { useTheme } from "@/hooks/useTheme";
import { Icons } from "@/utils/icons";
import { motion, useScroll, useTransform } from "framer-motion";
import React, { useRef } from "react";

const PartnershipSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  
  const tier = usePerformanceTier();
  const isMobile = useIsMobile();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset:["start end", "end start"],
  });

  // --- МАТЕМАТИКА ПАРАЛЛАКСА (Только CSS transforms, 0 нагрузки на CPU) ---
  const isLowPerf = isMobile || tier === "low";
  
  const bgY = useTransform(
    scrollYProgress,
    [0, 1],
    isLowPerf ? ["-8%", "8%"] : ["-35%", "35%"]
  );
  
  const contentY = useTransform(
    scrollYProgress,
    [0, 1],
    isLowPerf ? ["-4%", "4%"] : ["20%", "-20%"]
  );

  const bgImageLight = "https://images.unsplash.com/photo-1604871000636-074fa5117945?q=80&w=1920&auto=format&fit=crop";
  const bgImageDark = "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1920&auto=format&fit=crop";
  const activeBg = isDark ? bgImageDark : bgImageLight;

  if (tier === "low") {
    return (
      <section className={`relative min-h-screen py-24 overflow-hidden ${isDark ? 'bg-gray-950' : 'bg-gray-100'}`}>
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `url(${activeBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="relative z-10 container mx-auto px-4 max-w-5xl text-center">
          <h2 className={`text-4xl md:text-6xl font-serif tracking-tight mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Путь к новым горизонтам
          </h2>
          <p className={`text-lg md:text-xl leading-relaxed mb-12 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Откройте для себя мир возможностей, где ваша страсть к здоровому образу жизни становится источником дохода.
          </p>
          <Button to="/partnership" variant="primary" size="lg" className="from-cyan-600 to-blue-600" icon={<Icons.ArrowRight className="w-5 h-5" />}>
            Узнать о партнерстве
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section 
      ref={sectionRef} 
      className={`relative overflow-hidden scene-3d-container ${isDark ? 'bg-[#050505]' : 'bg-[#e5e7eb]'}`}
      style={{ minHeight: isMobile ? "auto" : "220vh", paddingBottom: isMobile ? "6rem" : "0" }}
    >
      {/* === СЛОЙ 1: ГЛУБОКИЙ ФОН === */}
      <motion.div 
        className="absolute inset-0 gpu-layer-bg pointer-events-none"
        style={{ y: bgY }}
      >
        <div
          className="w-full h-full bg-cover bg-center"
          style={{
            backgroundImage: `url(${activeBg})`,
            // Статичный блюр - рендерится 1 раз, не грузит GPU при скролле
            filter: isDark ? "brightness(0.35) blur(6px)" : "brightness(0.95) blur(6px)",
            transform: "scale(1.1)" 
          }}
        />
      </motion.div>

      {/* === СЛОЙ 2: КОНТЕНТ НА СТЕКЛЕ === */}
      <motion.div 
        className={`relative z-10 container mx-auto px-4 ${isMobile ? 'pt-24' : 'pt-40'} gpu-layer-text`}
        style={{ y: contentY }}
      >
        <div className="text-center max-w-5xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease:[0.16, 1, 0.3, 1] }}
          >
            <span className={`text-xs md:text-sm font-semibold uppercase tracking-[0.3em] mb-6 block ${isDark ? 'text-cyan-500' : 'text-blue-600'}`}>
              Независимость • Экспертность • Сообщество
            </span>
            <h2 className={`text-5xl md:text-7xl lg:text-[7rem] font-serif leading-[0.9] mb-8 text-glass-engraved ${isDark ? 'dark' : ''}`}>
              Путь к новым<br />горизонтам
            </h2>
            <p className={`text-lg md:text-2xl font-light leading-relaxed max-w-3xl mx-auto mb-20 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Откройте для себя мир, где страсть к здоровому образу жизни 
              трансформируется в стабильный доход и личностный рост.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 max-w-6xl mx-auto mb-32">
          {[
            {
              title: "Свобода действий",
              desc: "Стройте бизнес в своем ритме. Превратите знания о здоровье в стабильный источник дохода без привязки к офису.",
              icon: Icons.Globe,
            },
            {
              title: "Профессиональный рост",
              desc: "Развивайте экспертность в области нутрициологии и построения команд под руководством опытных наставников.",
              icon: Icons.Award,
            },
            {
              title: "Глобальное сообщество",
              desc: "Станьте частью международной команды единомышленников, объединенных целью улучшать качество жизни людей.",
              icon: Icons.Users,
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.15, ease:[0.16, 1, 0.3, 1] }}
              className={`p-8 md:p-10 rounded-2xl backdrop-blur-md transition-transform duration-500 hover:-translate-y-2 ${
                isDark 
                  ? 'bg-white/[0.02] border border-white/10' 
                  : 'bg-black/[0.02] border border-black/10'
              }`}
              style={{ contain: "layout paint" }}
            >
              <item.icon strokeWidth={1} className={`w-10 h-10 mb-8 ${isDark ? 'text-cyan-400' : 'text-blue-600'}`} />
              <h3 className={`text-2xl font-serif mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {item.title}
              </h3>
              <p className={`font-light leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease:[0.16, 1, 0.3, 1] }}
          className="text-center pb-24"
        >
          <Button to="/partnership" variant="primary" size="lg" className="from-cyan-600 to-blue-600 shadow-2xl px-12 py-5 text-lg font-medium rounded-full" icon={<Icons.ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />}>
            Стать партнером 4Life
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default React.memo(PartnershipSection);
