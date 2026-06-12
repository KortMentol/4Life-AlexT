/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class", // Активируем темную тему по классу
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "var(--primary)",
        secondary: "var(--secondary)",
        accent: "var(--accent)",
        text: "var(--text)",
        "text-muted": "var(--text-muted)",
        bg: "var(--bg)",
        "bg-muted": "var(--bg-muted)",
        border: "var(--border)",
        // Сохраняем старые цвета для обратной совместимости
        background: {
          DEFAULT: "#f9fafb",
          dark: "#1a1a1a",
        },
      },
      fontFamily: {
        sans: ['"Manrope Variable"', "sans-serif"],
        heading: ['"Syne Variable"', "sans-serif"],
      },
      boxShadow: {
        "3xl": "0 35px 60px -15px rgba(0, 0, 0, 0.4)",
        "glass-sm": "0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)",
        "glass-md": "0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)",
        "4life": "0 4px 6px -1px rgba(0, 123, 255, 0.1), 0 2px 4px -2px rgba(0, 123, 255, 0.06)",
        glass: "0 4px 30px rgba(0, 0, 0, 0.1)",
        "glass-lg": "0 8px 40px rgba(0, 0, 0, 0.2)",
        "text-lg": "0 2px 8px rgba(0, 0, 0, 0.4)",
        "text-md": "0 1px 4px rgba(0, 0, 0, 0.3)",
        "text-sm": "0 1px 2px rgba(0, 0, 0, 0.2)",
        glow: "var(--glow)",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-left": {
          "0%": { opacity: "0", transform: "translateX(-50px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "slide-in-right": {
          "0%": { opacity: "0", transform: "translateX(50px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "pulse-slow": {
          "0%, 100%": { opacity: ".7" },
          "50%": { opacity: ".3" },
        },
        "pulse-fast": {
          "0%, 100%": { transform: "scale(1)", opacity: "1" },
          "50%": { transform: "scale(1.05)", opacity: ".9" },
        },
        aurora: {
          "0%": {
            "background-position": "0% 50%",
            transform: "rotate(-5deg) scale(0.9)",
          },
          "25%": {
            "background-position": "50% 100%",
            transform: "rotate(5deg) scale(1.1)",
          },
          "50%": {
            "background-position": "100% 50%",
            transform: "rotate(-3deg) scale(0.95)",
          },
          "75%": {
            "background-position": "50% 0%",
            transform: "rotate(3deg) scale(1.05)",
          },
          "100%": {
            "background-position": "0% 50%",
            transform: "rotate(-5deg) scale(0.9)",
          },
        },
      },
      animation: {
        "fade-in": "fade-in 0.8s ease-out forwards",
        "slide-in-left": "slide-in-left 0.7s ease-out forwards",
        "slide-in-right": "slide-in-right 0.7s ease-out forwards",
        "pulse-slow": "pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "pulse-fast": "pulse-fast 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        aurora: "aurora 8s ease-in-out infinite alternate",
      },
      spacing: {
        128: "32rem",
        144: "36rem",
        160: "40rem",
        180: "45rem",
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "3rem",
      },
      zIndex: {
        background: "-20",
        fluid: "-10",
        parallax: "0",
        content: "10",
        header: "100",
        overlay: "200",
      },
      maxWidth: {
        "8xl": "90rem",
      },
    },
  },
  plugins: [
    /** @param {{ addUtilities: Function }} param0 */
    function ({ addUtilities }) {
      const newUtilities = {
        ".pt-safe": {
          paddingTop: "env(safe-area-inset-top)",
        },
        ".pb-safe": {
          paddingBottom: "env(safe-area-inset-bottom)",
        },
        ".pl-safe": {
          paddingLeft: "env(safe-area-inset-left)",
        },
        ".pr-safe": {
          paddingRight: "env(safe-area-inset-right)",
        },
      };
      addUtilities(newUtilities);
    },
  ],
};
