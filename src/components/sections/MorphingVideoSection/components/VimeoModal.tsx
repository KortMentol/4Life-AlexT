import { lenis } from "@/lib/lenis";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useRef } from "react";

interface VimeoModalProps {
  isOpen: boolean;
  onClose: () => void;
  tier: "low" | "medium" | "high";
  videoUrl: string;
}

export const VimeoModal: React.FC<VimeoModalProps> = ({ isOpen, onClose, tier, videoUrl }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  // Perfect Scroll Lock / Unlock
  useEffect(() => {
    if (isOpen) {
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
      document.documentElement.style.overflow = "hidden";
      document.documentElement.style.touchAction = "none";
      lenis?.stop();
    } else {
      closeTimeoutRef.current = setTimeout(() => {
        document.body.style.overflow = "";
        document.body.style.touchAction = "";
        document.documentElement.style.overflow = "";
        document.documentElement.style.touchAction = "";
        lenis?.start();
      }, 450);
    }
    return () => {
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
      document.documentElement.style.overflow = "";
      document.documentElement.style.touchAction = "";
      lenis?.start();
    };
  }, [isOpen]);

  // Prevent background wheel scrolling while open
  useEffect(() => {
    const el = modalRef.current;
    if (!el || !isOpen) return;
    const preventWheel = (e: WheelEvent) => e.preventDefault();
    el.addEventListener("wheel", preventWheel, { passive: false });
    return () => el.removeEventListener("wheel", preventWheel);
  }, [isOpen]);

  return (
    <div
      ref={modalRef}
      style={{ pointerEvents: isOpen ? "auto" : "none" }}
      className="fixed inset-0 z-[200] touch-action-none"
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="vimeo-modal"
            className="fixed inset-0 flex items-center justify-center p-4 md:p-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Backdrop: solid color for low tier to save GPU fill-rate, blur for High/Medium */}
            <div
              className={[
                "absolute inset-0",
                tier === "low" ? "bg-[#03050a]/98" : "bg-[#03050a]/90 backdrop-blur-xl",
              ].join(" ")}
              onClick={onClose}
            />

            <motion.div
              className="relative w-full max-w-6xl"
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={onClose}
                className="absolute -top-14 right-0 md:-top-10 md:-right-10 z-50 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all hover:scale-110 active:scale-95 focus:outline-none"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>

              <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl border border-white/10">
                {/* Embedded Vimeo Player. Unmounts completely when modal is closed */}
                <iframe
                  src={videoUrl}
                  allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                  frameBorder="0"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                  title="Vimeo Presentation"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
