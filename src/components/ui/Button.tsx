import { motion } from "framer-motion";
import React from "react";
import { useLocation } from "react-router-dom";
import { useTransition } from "@/context";
import { scrollToTop } from "@/utils/navigationUtils";

interface ButtonProps {
  children: React.ReactNode;
  to?: string;
  href?: string;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  icon?: React.ReactNode; // <-- ИЗМЕНЕНИЕ: Тип иконки теперь React.ReactNode, чтобы принимать JSX-элементы
  iconPosition?: "left" | "right";
  isExternal?: boolean;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  to,
  href,
  onClick,
  variant = "primary",
  size = "md",
  className = "",
  icon, // <-- Иконка теперь приходит как готовый узел
  iconPosition = "right",
  isExternal = false,
  disabled = false,
}) => {
  const { transitionTo } = useTransition();
  const location = useLocation();

  const handleInternalLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (disabled) return;

    if (to && location.pathname === to) {
      scrollToTop({ immediate: false });
    } else if (to) {
      transitionTo(to);
    }

    if (onClick) {
      onClick(e);
    }
  };

  const baseClasses = "btn-modern inline-flex items-center justify-center gap-2 font-medium transition-all rounded-lg";
  const variantClasses = {
    primary: "btn-primary-modern",
    secondary: "btn-secondary-modern",
    outline: "border-2 border-current hover:bg-opacity-10 hover:bg-white",
    ghost: "hover:bg-opacity-10 hover:bg-white",
  };
  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3",
    lg: "px-8 py-4 text-lg",
  };
  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "";
  const allClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}`;

  const content = (
    <>
      {icon && iconPosition === "left" && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
      {icon && iconPosition === "right" && <span className="flex-shrink-0">{icon}</span>}
    </>
  );

  if (to) {
    return (
      <motion.div whileHover={{ scale: disabled ? 1 : 1.02 }} whileTap={{ scale: disabled ? 1 : 0.98 }}>
        <a href={to} className={allClasses} onClick={handleInternalLinkClick}>
          {content}
        </a>
      </motion.div>
    );
  }

  if (href) {
    return (
      <motion.div whileHover={{ scale: disabled ? 1 : 1.02 }} whileTap={{ scale: disabled ? 1 : 0.98 }}>
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
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
    >
      {content}
    </motion.button>
  );
};

export default Button;
