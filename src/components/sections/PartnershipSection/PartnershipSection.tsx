/**
 * @module src/components/sections/PartnershipSection/PartnershipSection.tsx
 * @description Секция о партнерстве с 4Life в sci-fi стиле с параллакс-фоном и текстовыми эффектами.
 * Рассказывает о возможностях MLM-бизнеса и преимуществах сотрудничества.
 * @author Kort
 * @version 1.0.0
 */

import React, { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

// Компонент для текста с эффектом окрашивания при скролле
const ScrollText: React.FC<{ children: string; className?: string }> = ({ children, className = "" }) => {
  const containerRef = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.9", "start 0.25"]
  });

  const words = children.split(" ");

  return (
    <p ref={containerRef} className={`relative ${className}`}>
      {words.map((word, i) => {
        const start = i / words.length;
        const end = start + (1 / words.length);
        return (
          <Word key={i} progress={scrollYProgress} range={[start, end]}>
            {word}
          </Word>
        );
      })}
    </p>
  );
};

const Word: React.FC<{ children: string; progress: any; range: [number, number] }> = ({ children, progress, range }) => {
  const opacity = useTransform(progress, range, [0.3, 1]);

  return (
    <span className="relative mr-3 mt-3 inline-block">
      <span className="absolute opacity-30 dark:opacity-20">{children}</span>
      <motion.span 
        style={{ 
          opacity,
          color: 'rgb(34, 197, 94)' // green-500 for light
        }}
        className="dark:text-emerald-500"
      >
        {children}
      </motion.span>
    </span>
  );
};

const PartnershipSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const block1Ref = useRef<HTMLDivElement>(null);
  const block2Ref = useRef<HTMLDivElement>(null);
  const block3Ref = useRef<HTMLDivElement>(null);

  // Параллакс для фона - теперь через CSS

  // Чистый CSS параллакс для максимального FPS
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      
      const rect = sectionRef.current.getBoundingClientRect();
      const scrolled = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
      const yPos = (scrolled - 0.5) * 20; // -10% to 10%
      
      const bg = sectionRef.current.querySelector('.parallax-bg') as HTMLElement;
      if (bg) {
        bg.style.transform = `translate3d(0, ${yPos}%, 0)`;
      }
    };
    
    let ticking = false;
    const optimizedScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', optimizedScroll, { passive: true });
    return () => window.removeEventListener('scroll', optimizedScroll);
  }, []);

  return (
    <section ref={sectionRef} className="relative min-h-[300vh] overflow-hidden bg-transparent">
      {/* Параллакс фон - плитки как у Immersive Garden */}
      <div className="absolute inset-0 -z-30 overflow-hidden">
        <div 
          className="parallax-bg absolute inset-0 w-full"
          style={{ 
            height: 'calc(100% + 200px)',
            top: '-100px',
            transform: 'translate3d(0, 0, 0)',
            willChange: 'transform',
            backfaceVisibility: 'hidden'
          }}
        >
          <div 
            className="w-full h-full bg-repeat opacity-100 dark:opacity-0 transition-opacity duration-500"
            style={{
              backgroundImage: `url(/images/backgrounds/light-pattern.webp)`,
              backgroundSize: '400px 400px',
              backgroundPosition: '0 0'
            }}
          />
          <div 
            className="absolute inset-0 w-full h-full bg-repeat opacity-0 dark:opacity-100 transition-opacity duration-500"
            style={{
              backgroundImage: `url(/images/backgrounds/dark-pattern.png)`,
              backgroundSize: '400px 400px',
              backgroundPosition: '0 0',
              filter: 'brightness(0.6) contrast(1.1)'
            }}
          />
        </div>
      </div>

      {/* Заголовок секции */}
      <div className="relative z-30 px-4 py-24 text-center">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-green-600 dark:text-green-400">
            Партнерство • Развитие • Успех
          </h2>
          <h3 className="mb-8 text-4xl font-semibold text-gray-900 dark:text-white md:text-6xl">
            Бизнес с 4Life
          </h3>
          <ScrollText className="mx-auto max-w-4xl text-lg leading-relaxed">
            Присоединяйтесь к глобальному сообществу предпринимателей, которые строят успешный бизнес, помогая людям улучшить качество жизни через инновационные продукты для здоровья.
          </ScrollText>
        </div>
      </div>

      {/* Блок 01 - Гибкий доход */}
      <div ref={block1Ref} className="relative z-20 min-h-screen px-4 py-16">
        <div className="mx-auto max-w-6xl text-center">
          <div className="mb-8 text-8xl font-light text-gray-300 dark:text-gray-600">01</div>
          <h4 className="mb-6 text-3xl font-semibold text-gray-900 dark:text-white md:text-5xl">
            Гибкий доход
          </h4>
          <h5 className="mb-8 text-xl font-bold uppercase tracking-[0.2em] text-green-500">
            ФИНАНСОВАЯ СВОБОДА
          </h5>
          <ScrollText className="mx-auto max-w-5xl text-lg leading-relaxed">
            Зарабатывайте на продажах и развитии своей партнерской сети без ограничения по времени. Система вознаграждений 4Life позволяет получать до 64% от оборота, включая бонусы с рекомендаций и кешбэк 20% при покупках свыше 100 баллов жизни ежемесячно.
          </ScrollText>
        </div>
      </div>

      {/* Блок 02 - Обучение и поддержка */}
      <div ref={block2Ref} className="relative z-20 min-h-screen px-4 py-16">
        <div className="mx-auto max-w-6xl text-center">
          <div className="mb-8 text-8xl font-light text-gray-300 dark:text-gray-600">02</div>
          <h4 className="mb-6 text-3xl font-semibold text-gray-900 dark:text-white md:text-5xl">
            Обучение и поддержка
          </h4>
          <h5 className="mb-8 text-xl font-bold uppercase tracking-[0.2em] text-green-600">
            ЭКСПЕРТИЗА
          </h5>
          <ScrollText className="mx-auto max-w-5xl text-lg leading-relaxed">
            Доступ к проверенной бизнес-модели, готовым инструментам и персональной поддержке на всех этапах. Научно-консультативный совет из врачей и иммунологов обеспечивает экспертную базу знаний для работы с клиентами.
          </ScrollText>
        </div>
      </div>

      {/* Блок 03 - Глобальные возможности */}
      <div ref={block3Ref} className="relative z-20 min-h-screen px-4 py-16">
        <div className="mx-auto max-w-6xl text-center">
          <div className="mb-8 text-8xl font-light text-gray-300 dark:text-gray-600">03</div>
          <h4 className="mb-6 text-3xl font-semibold text-gray-900 dark:text-white md:text-5xl">
            Глобальные возможности
          </h4>
          <h5 className="mb-8 text-xl font-bold uppercase tracking-[0.2em] text-green-600">
            СТАБИЛЬНОСТЬ
          </h5>
          <ScrollText className="mx-auto max-w-5xl text-lg leading-relaxed">
            Стройте бизнес с крупной международной компанией, работающей в 50+ странах с 1998 года. 4Life обеспечивает стабильность, официальные выплаты и безупречную репутацию на рынке здоровья и wellness.
          </ScrollText>
        </div>
      </div>

      {/* CTA секция */}
      <div className="relative z-30 px-4 py-24 text-center">
        <div className="mx-auto max-w-4xl">
          <h3 className="mb-8 text-3xl font-semibold text-gray-900 dark:text-white md:text-4xl">
            Готовы начать свой путь к успеху?
          </h3>
          <ScrollText className="mx-auto mb-12 max-w-3xl text-lg leading-relaxed">
            Присоединяйтесь к команде компетентных лидеров и получите персональную консультацию по развитию бизнеса с 4Life. Первый шаг к финансовой независимости начинается здесь.
          </ScrollText>
          
          <div className="flex flex-col gap-6 sm:flex-row sm:justify-center">
            <motion.a
              href="https://russia.4life.com/12299550/signup/PC"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-green-600 to-blue-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl"
            >
              Стать партнером
            </motion.a>
            
            <motion.a
              href="/contact"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center justify-center rounded-lg border-2 border-green-600 px-8 py-4 text-lg font-semibold text-green-600 transition-all duration-300 hover:bg-green-600 hover:text-white dark:border-green-400 dark:text-green-400 dark:hover:bg-green-400 dark:hover:text-gray-900"
            >
              Получить консультацию
            </motion.a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnershipSection;