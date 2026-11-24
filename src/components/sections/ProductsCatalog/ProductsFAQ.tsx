/**
 * @module src/components/sections/ProductsCatalog/ProductsFAQ.tsx
 * @description Awwwards 2026+ Zero-Jump Hydraulic Swiss Editorial FAQ Section for /products:
 * - 6 precision buyer-first questions covering mechanism, starting & safety, authenticity,
 *   Anti-MLM −25% discount clarity, honest LP (Life Points) explanation, and realistic course expectations.
 * - All 6 items start CLOSED by default; single-expand (`activeIndex: number | null`) sits strictly
 *   inside the responsive hydraulic floor (`lg:min-h-[860px] xl:min-h-[760px]`) -> `ΔsectionHeight === 0.0px`
 *   on EVERY item (01–06) across 1024px, 1280px, and 1440px+, eliminating Sticky Curtain Footer bounce and left-column sticky jitter.
 * - Generous bottom clearance (`pb-24 lg:pb-24`) prevents the floating ScrollToTop button from ever
 *   overlapping the final accordion trigger on desktop or mobile.
 */

import cellularMacroImg from "@/assets/images/cellular_macro_obsidian_1795192950822.jpg";
import { Button, FAQItem } from "@/components/ui";
import type { FAQActionLink } from "@/components/ui/FAQItem/FAQItem";
import { useIsMobile, usePerformanceTier } from "@/hooks";
import { siteConfig } from "@/site-config/site";
import { Icons } from "@/utils/icons";
import { motion, useScroll, useTransform } from "framer-motion";
import React, { useCallback, useRef, useState } from "react";

interface ProductFaqEntry {
  readonly question: string;
  readonly answer: string;
  readonly actionLink?: FAQActionLink;
}

const FAQ_DATA: readonly ProductFaqEntry[] = [
  {
    question: "Чем Трансфер Факторы отличаются от обычных витаминов?",
    answer:
      "Витамины и минералы — это строительный материал, а Трансфер Факторы — природные сигнальные пептиды иммунной памяти из молозива и яичного желтка. Они не «подстёгивают» иммунитет искусственно, а помогают клеткам быстрее распознавать угрозы и вовремя завершать реакцию без лишней нагрузки.",
  },
  {
    question: "С какой формулы начать и можно ли сочетать несколько сразу?",
    answer:
      "Для спокойного знакомства чаще выбирают Классик или Трай-Фактор, а в период высоких нагрузок — Плюс или Ренуво. Формулы созданы для совместного приёма (готовые пары показаны выше). Это пищевые нутрицевтики (БАД), не лекарства; при беременности, лактации или непереносимости молочного/яичного белка предварительно проконсультируйтесь с врачом.",
  },
  {
    question: "Как гарантируется оригинальность продукции в России?",
    answer:
      "Все формулы производятся на собственном заводе 4Life в штате Юта (США) по стандартам NSF и cGMP и поступают напрямую на официальный склад Регионального Центра РЦ 67 в Москве. Каждая упаковка проходит маркировку «Честный ЗНАК», имеет СГР ЕАЭС и актуальный срок годности свежей партии.",
  },
  {
    question: "Как работает скидка −25% и есть ли скрытые условия?",
    answer:
      "Никакой обязательной регистрации, контрактов или ежемесячных покупок нет — скидка −25% действует даже от 1 упаковки. Вы собираете список в каталоге, партнёрский ID 12299550 подставляется в заявку автоматически, а оплата и выдача (самовывоз в Москве или доставка СДЭК по РФ) идут напрямую через склад РЦ 67.",
  },
  {
    question: "Что такое LP на карточках и нужно ли их учитывать?",
    answer:
      "LP (Life Points) — международные баллы продукции 4Life (например, Трай-Фактор — 40 LP). При разовом заказе по нашему ID считать их не нужно — оплата идёт в рублях со скидкой −25%. Баллы работают в статусе Привилегированного клиента (ПК): от 50 LP/мес дают 10–15% кэшбэка на бесплатные формулы в РЦ 67, а от 125 LP/мес — «Продукт месяца» в подарок.",
    actionLink: {
      label: "Подробнее о статусе ПК и Программе Лояльности",
      to: "/how-to-buy",
    },
  },
  {
    question: "Когда ощущается результат и как долго длится курс?",
    answer:
      "Это не стимулятор с эффектом за один день: более ровный тонус, качество сна и восстановление обычно отмечают через 1–3 недели, а устойчивый фон выстраивается за 2–3 месяца регулярного приёма. Точный способ применения для каждой формулы (капсулы, стики или гель) указан внутри её карточки в каталоге.",
  },
];

interface FaqParallaxBackdropProps {
  sectionRef: React.RefObject<HTMLElement | null>;
}

const FaqParallaxBackdrop: React.FC<FaqParallaxBackdropProps> = ({ sectionRef }) => {
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Pure scroll-driven pixel parallax — decoupled from section height so opening/closing FAQ can NEVER zoom/scale the image
  const bgY = useTransform(scrollYProgress, [0, 1], [-56, 56]);

  return (
    <motion.div
      className="absolute inset-x-0 -top-[90px] h-[1180px]"
      style={{ y: bgY, willChange: "transform" }}
    >
      <img
        src={cellularMacroImg}
        alt=""
        loading="lazy"
        decoding="async"
        className="w-full h-full object-cover object-center opacity-45"
      />
    </motion.div>
  );
};

const ProductsFAQ: React.FC = () => {
  const tier = usePerformanceTier();
  const isMobile = useIsMobile();
  const isLow = tier === "low";
  const enableParallax = !isLow && !isMobile;

  // Single-expand accordion: all closed initially (`null`), clicking an open item closes it,
  // clicking another item smoothly switches focus while keeping total height strictly inside the hydraulic floor.
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const handleFAQToggle = useCallback((index: number) => {
    setActiveIndex((prev) => (prev === index ? null : index));
  }, []);

  return (
    <section
      ref={sectionRef}
      id="products-faq"
      style={{ overflowAnchor: "none" }}
      className="relative overflow-x-clip bg-[#03050a] pt-20 sm:pt-24 lg:pt-28 pb-24 sm:pb-28 lg:pb-24"
    >
      {/* Seamless Luminous Section Boundary */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/25 to-transparent z-20"
      />

      {/* Living Sapphire-Obsidian Cellular Backdrop (0px stretch/zoom when toggling FAQ) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden="true">
        {enableParallax ? (
          <FaqParallaxBackdrop sectionRef={sectionRef} />
        ) : (
          <img
            src={cellularMacroImg}
            alt=""
            loading="lazy"
            decoding="async"
            className="w-full h-[960px] max-w-none object-cover object-top opacity-35"
          />
        )}

        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(65% 60% at 75% 42%, rgba(14, 165, 233, 0.14) 0%, rgba(3, 5, 10, 0) 70%), radial-gradient(48% 50% at 18% 55%, rgba(30, 64, 175, 0.12) 0%, rgba(3, 5, 10, 0) 72%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(180deg, #03050a 0%, rgba(3,5,10,0.58) 18%, rgba(3,5,10,0.68) 82%, #03050a 100%)",
          }}
        />
      </div>

      <div className="relative z-10 max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Quiet Editorial Anchor */}
          <div className="lg:col-span-5 lg:sticky lg:top-32 space-y-7">
            <div className="space-y-4">
              <span className="typography-label text-cyan-400/90 block">Частые вопросы</span>
              <h2 className="typography-h2 text-white">
                Коротко{" "}
                <span className="font-light text-cyan-300">о главном</span>
              </h2>
              <p className="typography-body text-slate-300 max-w-md">
                Шесть прямых ответов о составе, баллах LP, оригинальности и скидке −25% — без лишней теории.
              </p>
            </div>

            <div className="pt-6 border-t border-white/[0.1] space-y-4">
              <p className="text-sm text-slate-300 leading-relaxed text-pretty max-w-md">
                Не уверены, с чего начать? Напишите Александру — подскажем спокойную связку из 1–2 формул под вашу
                задачу.
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Button
                  href={siteConfig.contact.telegram}
                  isExternal
                  variant="primary"
                  size="sm"
                  icon={<Icons.Telegram className="w-4 h-4 text-cyan-300" />}
                >
                  Написать в Telegram
                </Button>
                <Button
                  to="/how-to-buy"
                  variant="secondary"
                  size="sm"
                  icon={<Icons.ArrowRight className="w-4 h-4" />}
                >
                  Как оформить заказ
                </Button>
              </div>
            </div>
          </div>

          {/* Right Hydraulic Zero-Jump Swiss Editorial Ledger (0.0px ΔH across all 6 items on 1024px, 1280px, 1440px+) */}
          <div className="lg:col-span-7 lg:min-h-[860px] xl:min-h-[760px] lg:pr-4" data-faq-list="true">
            {FAQ_DATA.map((item, index) => (
              <FAQItem
                key={item.question}
                question={item.question}
                answer={item.answer}
                actionLink={item.actionLink}
                index={index}
                isOpen={activeIndex === index}
                onToggle={handleFAQToggle}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default React.memo(ProductsFAQ);
