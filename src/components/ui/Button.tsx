/**
 * @module Button
 * @description Awwwards 2026 — Button with ripple micro-interaction, tier-aware.
 * Ripple: compositor-only, originates at click/touch point.
 * Focus ring: WCAG 2.1 AA compliant.
 * @version 2.0.0
 */

import { useTransition } from "@/context";
import { scrollToTop } from "@/utils/navigationUtils";
import { motion } from "framer-motion";
import React, { useCallback, useRef } from "react";
import { useLocation } from "react-router-dom";

interface ButtonProps {
  children: React.ReactNode;
  to?: string;
  href?: string;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  isExternal?: boolean;
  disabled?: boolean;
}

// ─── Ripple ───────────────────────────────────────────────────────────────────

interface RippleItem {
  id: number;
  x: number;
  y: number;
  size: number;
}

const useRipple = (enabled: boolean) => {
  const [ripples, setRipples] = React.useState<RippleItem[]>([]);
  const nextId = useRef(0);

  const addRipple = useCallback(
    (e: React.MouseEvent | React.TouchEvent, el: HTMLElement) => {
      if (!enabled) return;
      const rect = el.getBoundingClientRect();
      const clientX = "touches" in e ? (e.touches[0]?.clientX ?? 0) : e.clientX;
      const clientY = "touches" in e ? (e.touches[0]?.clientY ?? 0) : e.clientY;
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      const size = Math.max(rect.width, rect.height) * 2;
      const id = nextId.current++;
      setRipples((prev) => [...prev, { id, x, y, size }]);
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id));
      }, 600);
    },
    [enabled],
  );

  return { ripples, addRipple };
};

// ─── Button ───────────────────────────────────────────────────────────────────

const Button: React.FC<ButtonProps> = ({
  children,
  to,
  href,
  onClick,
  variant = "primary",
  size = "md",
  className = "",
  icon,
  iconPosition = "right",
  isExternal = false,
  disabled = false,
}) => {
  const { transitionTo } = useTransition();
  const location = useLocation();
  // Ripple enabled on medium+high — определяем через CSS media query вместо JS хука
  // Это убирает usePerformanceTier из каждой кнопки
  const rippleEnabled = !disabled;
  const { ripples, addRipple } = useRipple(rippleEnabled);

  const handleInternalLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (disabled) return;
    addRipple(e, e.currentTarget);
    if (to && location.pathname === to) {
      scrollToTop({ immediate: false });
    } else if (to) {
      transitionTo(to);
    }
    if (onClick) onClick(e);
  };

  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    addRipple(e, e.currentTarget);
    if (onClick) onClick(e);
  };

  const baseClasses =
    "btn-modern relative overflow-hidden inline-flex items-center justify-center gap-2 font-medium transition-all rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2";
  const variantClasses = {
    primary: "btn-primary-modern",
    secondary: "btn-secondary-modern",
    outline: "border-2 border-current hover:bg-white/10",
    ghost: "hover:bg-white/10",
  };
  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3",
    lg: "px-8 py-4 text-lg",
  };
  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "";
  const allClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}`;

  const rippleEls = ripples.map((r) => (
    <span
      key={r.id}
      className="absolute rounded-full pointer-events-none animate-ripple"
      style={{
        left: r.x - r.size / 2,
        top: r.y - r.size / 2,
        width: r.size,
        height: r.size,
        background: "rgba(255,255,255,0.25)",
      }}
    />
  ));

  const content = (
    <>
      {icon && iconPosition === "left" && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
      {icon && iconPosition === "right" && <span className="flex-shrink-0">{icon}</span>}
      {rippleEls}
    </>
  );

  if (to) {
    return (
      <motion.div
        whileHover={disabled ? {} : { scale: 1.02 }}
        whileTap={disabled ? {} : { scale: 0.98 }}
        style={{ WebkitTapHighlightColor: "transparent" }}
      >
        <a href={to} className={allClasses} onClick={handleInternalLinkClick}>
          {content}
        </a>
      </motion.div>
    );
  }

  if (href) {
    return (
      <motion.div
        whileHover={disabled ? {} : { scale: 1.02 }}
        whileTap={disabled ? {} : { scale: 0.98 }}
        style={{ WebkitTapHighlightColor: "transparent" }}
      >
        <a
          href={href}
          className={allClasses}
          onClick={onClick}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
        >
          {content}
        </a>
      </motion.div>
    );
  }

  return (
    <motion.button
      className={allClasses}
      onClick={handleButtonClick}
      disabled={disabled}
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      style={{ WebkitTapHighlightColor: "transparent" }}
    >
      {content}
    </motion.button>
  );
};

export default Button;
