import { motion } from "framer-motion";
import React from "react";

interface SciFiCloseButtonProps {
  onClick: () => void;
}

const SciFiCloseButton = React.forwardRef<
  HTMLButtonElement,
  SciFiCloseButtonProps
>(({ onClick }, ref) => {
  return (
    <motion.button
      ref={ref}
      onClick={onClick}
      className="relative w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-200 focus:outline-none [-webkit-tap-highlight-color:transparent] bg-slate-800/80 border border-cyan-400/30 text-cyan-300 hover:bg-slate-700/80 hover:border-cyan-400/50"
      whileTap={{ scale: 0.95 }}
      aria-label="Закрыть"
    >
      <div className="absolute inset-0 rounded-full blur-sm bg-cyan-400/10" />
      <div className="relative z-10">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-cyan-300"
          stroke="currentColor"
        >
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </div>
      <div className="absolute inset-0 rounded-full opacity-0 hover:opacity-100 transition-opacity duration-200 bg-cyan-400/5" />
    </motion.button>
  );
});

SciFiCloseButton.displayName = "SciFiCloseButton";
export default SciFiCloseButton;