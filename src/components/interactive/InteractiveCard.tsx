import React from "react";
import MagneticEffect from "../effects/MagneticEffect";

interface InteractiveCardProps {
  children: React.ReactNode;
  className?: string;
  magneticStrength?: number;
}

const InteractiveCard: React.FC<InteractiveCardProps> = ({
  children,
  className = "",
  magneticStrength = 0.15,
}) => {
  const cardClasses = [
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
