import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import React from "react";
import { useTheme } from "@/hooks/useTheme";

const SciFiThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <motion.button
      onClick={toggleTheme}
      className="relative w-16 h-8 rounded-full p-1 focus:outline-none"
      style={{
        background: isDark
          ? "linear-gradient(135deg, #1e293b 0%, #334155 100%)"
          : "linear-gradient(135deg, #e2e8f0 0%, #cbd5e0 100%)",
        boxShadow: isDark
          ? "0 0 20px rgba(0, 255, 255, 0.3), inset 0 2px 4px rgba(0, 0, 0, 0.3)"
          : "0 0 20px rgba(59, 130, 246, 0.2), inset 0 2px 4px rgba(0, 0, 0, 0.1)",
        border: isDark
          ? "1px solid rgba(0, 255, 255, 0.3)"
          : "1px solid rgba(59, 130, 246, 0.3)",
      }}
      whileTap={{ scale: 0.95 }}
      aria-label="Переключить тему"
    >
      {/* Неоновая подсветка */}
      <motion.div
        className="absolute inset-0 rounded-full opacity-50"
        style={{
          background: isDark
            ? "radial-gradient(circle, rgba(0, 255, 255, 0.1) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)",
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Движущийся индикатор */}
      <motion.div
        className="relative w-6 h-6 rounded-full flex items-center justify-center"
        style={{
          background: isDark
            ? "linear-gradient(135deg, #00ffff 0%, #0080ff 100%)"
            : "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
          boxShadow: isDark
            ? "0 0 15px rgba(0, 255, 255, 0.8), 0 0 30px rgba(0, 255, 255, 0.4)"
            : "0 0 15px rgba(59, 130, 246, 0.6), 0 0 30px rgba(59, 130, 246, 0.3)",
        }}
        animate={{
          x: isDark ? 32 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 30,
          mass: 1.2,
        }}
      >
        {/* Внутреннее свечение */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: isDark
              ? "radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%)"
              : "radial-gradient(circle, rgba(255, 255, 255, 0.4) 0%, transparent 70%)",
          }}
          animate={{
            scale: [0.8, 1.2, 0.8],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Иконка */}
        <motion.div
          className="relative z-10 text-white"
          animate={{ rotate: isDark ? 180 : 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          {isDark ? <Moon size={14} /> : <Sun size={14} />}
        </motion.div>
      </motion.div>

      {/* Трек с неоновыми точками */}
      <div className="absolute top-1/2 left-2 right-2 h-0.5 -translate-y-1/2 -z-10">
        <div
          className="w-full h-full rounded-full"
          style={{
            background: isDark
              ? "linear-gradient(90deg, transparent 0%, rgba(0, 255, 255, 0.3) 50%, transparent 100%)"
              : "linear-gradient(90deg, transparent 0%, rgba(59, 130, 246, 0.3) 50%, transparent 100%)",
          }}
        />
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full top-1/2 -translate-y-1/2"
            style={{
              left: `${25 + i * 25}%`,
              background: isDark ? "#00ffff" : "#3b82f6",
              boxShadow: isDark
                ? "0 0 4px rgba(0, 255, 255, 0.8)"
                : "0 0 4px rgba(59, 130, 246, 0.8)",
            }}
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </motion.button>
  );
};

export default SciFiThemeToggle;
