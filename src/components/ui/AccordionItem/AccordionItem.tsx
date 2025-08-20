/**
 * @module src/components/ui/AccordionItem.tsx
 * @description Компонент аккордеона для FAQ секции с плавными анимациями GSAP и современным дизайном
 * @author Kort
 * @version 1.0.0
 * @param {string} question - Вопрос для отображения в заголовке аккордеона
 * @param {string} answer - Ответ для отображения в раскрывающемся контенте
 * @param {number} index - Индекс элемента для анимации с задержкой
 * @see ProductsPage - основная страница, где используется компонент
 * @usage
 * 1. **src/pages/ProductsPage.tsx**: В FAQ секции для отображения часто задаваемых вопросов о продуктах 4Life
 * @example
 * <AccordionItem
 *   question="Что такое трансфер факторы?"
 *   answer="Трансфер факторы — это пептидные цепи..."
 *   index={0}
 * />
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ChevronDownIcon } from '@heroicons/react/24/solid';

interface AccordionItemProps {
  question: string;
  answer: string;
  index: number;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ question, answer, index }) => {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current && iconRef.current) {
      if (isOpen) {
        gsap.to(contentRef.current, {
          height: 'auto',
          opacity: 1,
          duration: 0.5,
          ease: 'power2.out'
        });
        gsap.to(iconRef.current, {
          rotation: 180,
          duration: 0.3,
          ease: 'power2.out'
        });
      } else {
        gsap.to(contentRef.current, {
          height: 0,
          opacity: 0,
          duration: 0.3,
          ease: 'power2.in'
        });
        gsap.to(iconRef.current, {
          rotation: 0,
          duration: 0.3,
          ease: 'power2.out'
        });
      }
    }
  }, [isOpen]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="group"
    >
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-cyan-400/30 transition-all duration-300 overflow-hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full p-6 text-left flex items-center justify-between hover:bg-white/5 transition-colors duration-300"
        >
          <h3 className="text-lg md:text-xl font-semibold text-white pr-4 group-hover:text-cyan-400 transition-colors duration-300">
            {question}
          </h3>
          <div ref={iconRef} className="flex-shrink-0">
            <ChevronDownIcon className="w-6 h-6 text-cyan-400" />
          </div>
        </button>
        
        <div
          ref={contentRef}
          className="overflow-hidden"
          style={{ height: 0, opacity: 0 }}
        >
          <div className="px-6 pb-6">
            <div className="w-full h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent mb-4" />
            <p className="text-white/80 leading-relaxed">
              {answer}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AccordionItem;