import { keyframes } from "@emotion/react";

// Современная анимация блеска с градиентом
export const shimmer = keyframes`
  0% {
    background-position: -200% center;
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
  100% {
    background-position: 200% center;
    opacity: 0.5;
  }
`;

// Анимация блеска для текста
export const textShimmer = keyframes`
  0% {
    background-position: -200% center;
  }
  100% {
    background-position: 200% center;
  }
`;

// Анимация блеска для SVG логотипа
export const logoShimmer = keyframes`
  0% {
    transform: translateX(-100%);
    opacity: 0;
  }
  50% {
    opacity: 0.8;
  }
  100% {
    transform: translateX(100%);
    opacity: 0;
  }
`;

// CSS стили для анимации блеска текста
export const shimmerTextStyles = {
  display: "inline-block",
  backgroundImage:
    "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,0) 100%)",
  backgroundSize: "200% 100%",
  backgroundRepeat: "no-repeat",
  backgroundClip: "text",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  animation: `${textShimmer} 3s ease-in-out infinite`,
  position: "relative",
  overflow: "hidden",
};

// CSS стили для анимации блеска логотипа
export const shimmerLogoStyles = {
  position: "relative",
  overflow: "hidden",
  "&::after": {
    content: '""',
    position: "absolute",
    top: "-50%",
    left: "-50%",
    width: "200%",
    height: "200%",
    background:
      "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
    transform: "rotate(30deg)",
    animation: `${logoShimmer} 4s ease-in-out infinite`,
  },
};
