/**
 * @module Button
 * @description Awwwards 2026 — Clinical Obsidian Button Component.
 * ИСПРАВЛЕНИЕ: Добавлена поддержка передачи кастомного style для инкапсулированной замены
 * CSS-переменных заливки кнопок (--btn-fill-1, --btn-fill-2).
 * @version 4.3.0
 */

import { useTransition } from "@/context";
import { usePerformanceTier } from "@/hooks";
import { scrollToTop } from "@/utils/navigationUtils";
import React, { useState } from "react";
import { useLocation } from "react-router-dom";

interface ButtonProps {
  children?: React.ReactNode;
  to?: string;
  href?: string;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  variant?: "primary" | "secondary" | "icon";
  size?: "sm" | "md" | "lg";
  className?: string;
  style?: React.CSSProperties; // ПОДДЕРЖКА CUSTOM STYLE ДЛЯ ГРАДИЕНТОВ
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  isExternal?: boolean;
  disabled?: boolean;
  "aria-label"?: string;
  animateEntrance?: boolean;
  delayMs?: number;
}

const Button: React.FC<ButtonProps> = ({
  children,
  to,
  href,
  onClick,
  variant = "primary",
  size = "md",
  className = "",
  style = {}, // Инициализируем пустой объект
  icon,
  iconPosition = "right",
  isExternal = false,
  disabled = false,
  "aria-label": ariaLabel,
  animateEntrance = false,
  delayMs = 0,
}) => {
  const { transitionTo } = useTransition();
  const location = useLocation();
  const tier = usePerformanceTier();

  const [animationCompleted, setAnimationCompleted] = useState(false);

  const handleInternalLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (disabled) return;

    if (to && location.pathname === to) {
      scrollToTop({ immediate: false });
    } else if (to) {
      transitionTo(to);
    }

    if (onClick) onClick(e);
  };

  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    if (onClick) onClick(e);
  };

  const variantClasses = {
    primary: "btn-primary-obsidian",
    secondary: "btn-secondary-ghost",
    icon: "btn-secondary-ghost btn-icon-action",
  };

  const sizeClasses = {
    sm: variant === "icon" ? "w-8 h-8" : "px-5 py-2.5 text-xs",
    md: variant === "icon" ? "w-10 h-10" : "px-7 py-3.5 text-sm",
    lg: variant === "icon" ? "w-12 h-12" : "px-9 py-4 text-base",
  };

  const disabledClasses = disabled ? "opacity-40 cursor-not-allowed pointer-events-none" : "";

  const animationClass = animateEntrance && !animationCompleted ? "animate-hero-fade-in-up" : "";
  const initialOpacityClass = animateEntrance && !animationCompleted ? "opacity-0" : "";

  const allClasses = `btn-base tier-${tier} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${animationClass} ${initialOpacityClass} ${className}`;

  const content = (
    <>
      {icon && iconPosition === "left" && <span className="flex-shrink-0 z-10">{icon}</span>}
      {children && <span className="z-10">{children}</span>}
      {icon && iconPosition === "right" && <span className="flex-shrink-0 z-10">{icon}</span>}
    </>
  );

  // МЕРЖИМ КАСТОМНЫЕ СТИЛИ С АНИМАЦИЕЙ
  const renderProps = {
    className: allClasses,
    style: {
      ...style,
      ...(animateEntrance && !animationCompleted ? { animationDelay: `${delayMs}ms` } : {}),
    },
    onAnimationEnd: () => {
      setAnimationCompleted(true);
    },
    "aria-label": ariaLabel,
  };

  if (to) {
    return (
      <a href={to} onClick={handleInternalLinkClick} {...renderProps}>
        {content}
      </a>
    );
  }

  if (href) {
    return (
      <a
        href={href}
        onClick={onClick}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        {...renderProps}
      >
        {content}
      </a>
    );
  }

  return (
    <button onClick={handleButtonClick} disabled={disabled} {...renderProps}>
      {content}
    </button>
  );
};

export default Button;
