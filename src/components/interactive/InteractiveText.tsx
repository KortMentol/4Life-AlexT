import React from "react";


interface InteractiveTextProps {
  children: React.ReactNode;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

const InteractiveText: React.FC<InteractiveTextProps> = ({
  children,
  className = "",
  as: Component = "span",
}) => {
  return (
    <Component className={className}>{children}</Component>
  );
};

export default InteractiveText;
