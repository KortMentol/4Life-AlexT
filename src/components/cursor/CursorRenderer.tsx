import React from "react";
import { useTheme } from "../../hooks/useTheme";
import CinematicCursor from "./CinematicCursor";
import ParticleSystem from "./ParticleSystem";
import { CursorProvider } from "@/context/CursorProvider";
import { useCursor } from "@/hooks/useCursor";

interface CursorRendererProps {
  children: React.ReactNode;
}

export const CursorRenderer: React.FC<CursorRendererProps> = ({ children }) => {
  return (
    <CursorProvider>
      <CursorRendererContent>{children}</CursorRendererContent>
    </CursorProvider>
  );
};

const CursorRendererContent: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { mousePosition, isHovering, isClicking } = useCursor();
  const { theme } = useTheme();

  return (
    <>
      {children}
      <CinematicCursor />
      <ParticleSystem
        mouseX={mousePosition.x}
        mouseY={mousePosition.y}
        isActive={isHovering || isClicking}
        theme={theme}
      />
    </>
  );
};
