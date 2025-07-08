import React from "react";

interface InteractiveCardProps {
  children: React.ReactNode;
  className?: string;
}

const InteractiveCard: React.FC<InteractiveCardProps> = ({
  children,
  className = "",
}) => {
  const cardClasses = [className].filter(Boolean).join(" ");

  return <div className={cardClasses}>{children}</div>;
};

export default InteractiveCard;
