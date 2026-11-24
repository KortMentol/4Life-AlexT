/// <reference types="vite/client" />
/// <reference types="node" />
/// <reference path="./types/external-modules.d.ts" />

declare module "@fontsource-variable/manrope";
declare module "@fontsource-variable/syne";
declare module "@fontsource-variable/jetbrains-mono";
declare module "@fontsource/cormorant-garamond/400-italic.css";
declare module "@fontsource/cormorant-garamond/500-italic.css";
declare module "@fontsource/cormorant-garamond/600-italic.css";

interface Window {
  __menuTransitionInProgress?: boolean;
  __isRoutingLock?: boolean;
  __popTransitionInProgress?: boolean;
  __isScrollRestorationActive?: boolean;
}
