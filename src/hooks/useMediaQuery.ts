import { useEffect, useState } from "react";

interface QueryEntry {
  mql: MediaQueryList;
  callbacks: Set<(matches: boolean) => void>;
  handler: (e: MediaQueryListEvent) => void;
}

const queryMap = new Map<string, QueryEntry>();

function getOrCreateEntry(query: string): QueryEntry {
  let entry = queryMap.get(query);
  if (!entry) {
    const mql = window.matchMedia(query);
    const callbacks = new Set<(matches: boolean) => void>();
    const handler = (e: MediaQueryListEvent) => {
      callbacks.forEach((cb) => cb(e.matches));
    };
    mql.addEventListener("change", handler);
    entry = { mql, callbacks, handler };
    queryMap.set(query, entry);
  }
  return entry;
}

function subscribe(query: string, cb: (matches: boolean) => void): () => void {
  const entry = getOrCreateEntry(query);
  entry.callbacks.add(cb);
  return () => {
    entry.callbacks.delete(cb);
    if (entry.callbacks.size === 0) {
      entry.mql.removeEventListener("change", entry.handler);
      queryMap.delete(query);
    }
  };
}

export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    setMatches(window.matchMedia(query).matches);

    const unsubscribe = subscribe(query, setMatches);
    return unsubscribe;
  }, [query]);

  return matches;
};

export const useIsMobile = (): boolean => useMediaQuery("(max-width: 767px)");
export const useIsTablet = (): boolean =>
  useMediaQuery("(min-width: 768px) and (max-width: 1023px)");
export const useIsDesktop = (): boolean => useMediaQuery("(min-width: 1024px)");
export const useIsLargeDesktop = (): boolean =>
  useMediaQuery("(min-width: 1280px)");
export const useIsXLargeDesktop = (): boolean =>
  useMediaQuery("(min-width: 1536px)");

export const useOrientation = (): "portrait" | "landscape" => {
  const isPortrait = useMediaQuery("(orientation: portrait)");
  return isPortrait ? "portrait" : "landscape";
};

export const useHoverSupport = (): boolean => {
  return useMediaQuery("(hover: hover)");
};

export const useReducedMotion = (): boolean => {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
};

export const useHighContrast = (): boolean => {
  return useMediaQuery("(prefers-contrast: more)");
};

export const useReducedTransparency = (): boolean => {
  return useMediaQuery("(prefers-reduced-transparency: reduce)");
};
