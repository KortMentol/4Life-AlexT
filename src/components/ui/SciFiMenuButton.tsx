import React from "react";
import { motion } from "framer-motion";

interface SciFiMenuButtonProps {
  isOpen: boolean;
  toggle: () => void;
}

const SciFiMenuButton: React.FC<SciFiMenuButtonProps> = ({ isOpen, toggle }) => {
  return (
    <motion.button
      onClick={toggle}
      className="relative w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-400/30 backdrop-blur-sm hover:from-cyan-500/30 hover:to-blue-600/30 hover:border-cyan-400/50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 [-webkit-tap-highlight-color:transparent]"
      whileTap={{ scale: 0.95 }}
      aria-expanded={isOpen}
      aria-label={isOpen ? "Закрыть меню" : "Открыть меню"}
    >
      {/* Неоновое свечение */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-cyan-400/10 to-blue-500/10 blur-sm" />
      
      {/* Иконка */}
      <div className="relative z-10 flex items-center justify-center w-full h-full">
        {isOpen ? (
          // Крестик
          <svg width="18" height="18" viewBox="0 0 24 24" className="text-cyan-300">
            <path
              d="M18 6L6 18M6 6l12 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          // Гамбургер
          <svg width="18" height="18" viewBox="0 0 24 24" className="text-cyan-300">
            <path
              d="M3 12h18M3 6h18M3 18h18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
      
      {/* Дополнительное свечение при hover */}
      <div className="absolute inset-0 rounded-lg bg-cyan-400/5 opacity-0 hover:opacity-100 transition-opacity duration-200" />
    </motion.button>
  );
};

export default SciFiMenuButton;