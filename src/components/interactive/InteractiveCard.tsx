import React from "react";
import MagneticEffect from "../effects/MagneticEffect";

interface InteractiveCardProps {
  children: React.ReactNode;
  className?: string;
  magneticStrength?: number;
  glowEffect?: boolean;
  pulseEffect?: boolean;
}

const InteractiveCard: React.FC<InteractiveCardProps> = ({
  children,
  className = "",
  magneticStrength = 0.15,
  glowEffect = true,
  pulseEffect = false,
}) => {
  const cardClasses = [
    "cursor-interactive",
    glowEffect ? "cursor-glow" : "",
    pulseEffect ? "cursor-pulse" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <MagneticEffect strength={magneticStrength} className={cardClasses}>
      {children}
    </MagneticEffect>
  );
};

export default InteractiveCard;
