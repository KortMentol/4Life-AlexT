import React from "react";
import MagneticEffect from "../effects/MagneticEffect";

interface InteractiveTextProps {
  children: React.ReactNode;
  className?: string;
  magneticStrength?: number;
  waveEffect?: boolean;
  as?: keyof JSX.IntrinsicElements;
}

const InteractiveText: React.FC<InteractiveTextProps> = ({
  children,
  className = "",
  magneticStrength = 0.1,
  waveEffect = false,
  as: Component = "span",
}) => {
  const textClasses = [
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <MagneticEffect strength={magneticStrength}>
      <Component className={textClasses}>{children}</Component>
    </MagneticEffect>
  );
};

export default InteractiveText;
