import { createContext } from "react";

export interface CursorContextType {
  isHovering: boolean;
  isClicking: boolean;
  mousePosition: { x: number; y: number };
  setHovering: (hovering: boolean) => void;
  setClicking: (clicking: boolean) => void;
  updateMousePosition: (x: number, y: number) => void;
}

export const CursorContext = createContext<CursorContextType | undefined>(
  undefined,
);
