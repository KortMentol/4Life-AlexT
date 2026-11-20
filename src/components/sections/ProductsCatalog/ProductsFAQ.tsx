/**
 * @module src/components/sections/ProductsCatalog/ProductsFAQ.tsx
 * @description Секция часто задаваемых вопросов о продуктах
 * @author Kort
 * @version 1.0.0
 */

import { FAQItem } from "@/components/ui";
import { useIsMobile, usePerformanceTier } from "@/hooks";
import { motion } from "framer-motion";
import React, { useCallback, useState } from "react";

const faqData = [
  {
    question: "Что означает Transfer Factor?",
    answer:
      "Так 4Life называет ингредиенты и формулы в части своей линейки. Состав различается от продукта к продукту, поэтому точный перечень компонентов смотрите на актуальной упаковке и в официальном описании для вашего рынка.",
  },
  {
    question: "Как разобраться в составе?",
    answer:
      "Карточка продукта помогает сориентироваться; полный перечень ингредиентов и сведения для конкретного рынка указаны на актуальной упаковке и в материалах производителя.",
  },
  {
    question: "Как принимать формулы 4Life?",
    answer:
      "Способ и количество приёма указаны в инструкции к конкретному продукту. Универсальной схемы для всей линейки нет.",
  },
  {
    question: "Можно ли сочетать продукты с лекарствами?",
    answer:
      "Возможные взаимодействия зависят от состава и вашей ситуации. Если вы принимаете лекарства, беременны или кормите грудью, либо у вас есть хроническое состояние, заранее обсудите состав с врачом или фармацевтом.",
  },
  {
    question: "Что известно о производстве и качестве?",
    answer:
      "Производитель публикует сведения о своих стандартах и процессах контроля. Актуальные документы, сертификаты и информацию о конкретном продукте лучше сверять в официальных материалах 4Life для нужного региона.",
  },
  {
    question: "Подойдут ли формулы именно мне?",
    answer:
      "Это зависит от состава продукта, индивидуальной переносимости и ваших обстоятельств. Изучите маркировку и, если остаются вопросы о здоровье или совместимости, обратитесь к медицинскому специалисту.",
  },
  {
    question: "Как узнать цену и наличие?",
    answer:
      "Цены, ассортимент и способы получения могут меняться. Актуальные стоимость и наличие можно узнать в РЦ 67; контакты центра собраны на странице заказа.",
  },
];

const ProductsFAQ: React.FC = () => {
  const tier = usePerformanceTier();
  const isMobile = useIsMobile();
  const isMatteSurface = tier !== "low" && !isMobile;
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const handleFAQToggle = useCallback(
    (index: number) => {
      setOpenFAQ(openFAQ === index ? null : index);
    },
    [openFAQ],
  );

  return (
    <section
      aria-labelledby="products-faq-title"
      className="relative z-20 isolate overflow-hidden border-t border-white/[0.08] px-4 py-20 md:px-8 md:py-28"
      style={{
        backgroundColor: isMatteSurface ? "rgba(5, 8, 17, 0.88)" : "#050811",
        backdropFilter: isMatteSurface ? "blur(8px) saturate(112%)" : "none",
        WebkitBackdropFilter: isMatteSurface ? "blur(8px) saturate(112%)" : "none",
      }}
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_15%_0%,rgba(6,182,212,0.11),transparent_42%)]" />
      <div className="relative mx-auto grid max-w-[1440px] gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:sticky lg:top-32 lg:col-span-4 lg:self-start">
          <p className="typography-label mb-4 text-cyan-400">Каталог · ответы по составу</p>
          <motion.h2
            id="products-faq-title"
            initial={tier === "low" || isMobile ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="typography-h2 max-w-md text-left text-white"
          >
            Частые вопросы
          </motion.h2>
          <p className="typography-body mt-5 max-w-md text-slate-400">
            Состав и способы применения зависят от конкретного продукта и его маркировки.
          </p>
        </div>
        <div className="divide-y divide-white/[0.08] border-y border-white/[0.08] lg:col-span-8">
          {faqData.map((item, index) => (
            <FAQItem
              key={item.question}
              question={item.question}
              answer={item.answer}
              index={index}
              isOpen={openFAQ === index}
              onToggle={handleFAQToggle}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default React.memo(ProductsFAQ);
