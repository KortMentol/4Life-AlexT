/**
 * @module src/components/ui/FAQItem/FAQItem.tsx
 * @description Профессиональный sci-fi аккордеон как на Awwwards сайтах
 * @author Kort
 * @version 4.0.0
 * @param {string} question - Вопрос для отображения в заголовке аккордеона
 * @param {string} answer - Ответ для отображения в раскрывающемся контенте
 * @param {number} index - Индекс элемента для анимации с задержкой
 * @see ProductsPage - основная страница, где используется компонент
 * @usage
 * 1. **src/pages/ProductsPage.tsx**: В FAQ секции для отображения часто задаваемых вопросов о продуктах 4Life
 * @example
 * <FAQItem
 *   question="Что такое трансфер факторы?"
 *   answer="Трансфер факторы — это пептидные цепи..."
 *   index={0}
 * />
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FAQItemProps {
  question: string;
  answer: string;
  index: number;
  isOpen?: boolean;
  onToggle?: (index: number) => void;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer, index, isOpen = false, onToggle }) => {

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      className="relative group mb-4"
      style={{ contain: 'content' }}
    >
      {/* Оптимизированный контейнер для мобильных */}
      <div className="relative bg-black/30 rounded-2xl border border-cyan-400/20 overflow-hidden group-hover:border-cyan-400/40 transition-all duration-300">
        
        {/* Упрощенные углы для лучшей производительности */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-cyan-400/40" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-cyan-400/40" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-cyan-400/40" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-cyan-400/40" />
        
        {/* Заголовок */}
        <button
          onClick={() => onToggle?.(index)}
          className="w-full p-6 flex items-center justify-between text-left relative z-10 group/btn"
        >
          <h3 className="text-lg md:text-xl font-semibold text-white pr-6 group-hover/btn:text-cyan-400 transition-colors duration-300">
            {question}
          </h3>
          
          {/* Sci-fi иконка */}
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="flex-shrink-0 w-8 h-8 flex items-center justify-center"
          >
            <div className="relative w-5 h-5">
              <div className="absolute inset-0 border border-cyan-400/60 transform rotate-45" />
              <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-cyan-400/80 rounded-full -translate-x-1/2 -translate-y-1/2" />
              <div className="absolute top-0 left-1/2 w-px h-1 bg-cyan-400/60 -translate-x-1/2" />
              <div className="absolute bottom-0 left-1/2 w-px h-1 bg-cyan-400/60 -translate-x-1/2" />
            </div>
          </motion.div>
        </button>
        
        {/* Контент */}
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ 
                height: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
                opacity: { duration: 0.3, delay: isOpen ? 0.1 : 0 }
              }}
              className="overflow-hidden"
            >
              <motion.div
                initial={{ y: -10 }}
                animate={{ y: 0 }}
                exit={{ y: -10 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="px-6 pb-6"
              >
                {/* Разделитель */}
                <div className="w-full h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent mb-4" />
                
                <p className="text-white/80 leading-relaxed text-base">
                  {answer}
                </p>
                
                {/* Нижний акцент */}
                <div className="mt-4 w-16 h-px bg-gradient-to-r from-cyan-400/60 to-transparent" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Упрощенный эффект для мобильных */}
        <div className="absolute inset-0 bg-cyan-400/3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>
    </motion.div>
  );
};

export default FAQItem;