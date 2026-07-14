/**
 * @module VimeoModal
 * @description Модальное окно для воспроизведения Vimeo.
 * ИСПРАВЛЕНИЕ: Слой маски (backdrop-filter) физически отделен от контейнера контента,
 * чтобы предотвратить баг Chrome с отключением блюра во время анимации прозрачности.
 * Для Low-тира блюр отключен, но сохранено плотное затемнение 85%.
 * @version 4.0.0
 */

import SciFiCloseButton from "@/components/ui/SciFiCloseButton";
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

  // Блокировка скролла
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

  useEffect(() => {
    const el = modalRef.current;
    if (!el || !isOpen) return;
    const preventWheel = (e: WheelEvent) => e.preventDefault();
    el.addEventListener("wheel", preventWheel, { passive: false });
    return () => el.removeEventListener("wheel", preventWheel);
  }, [isOpen]);

  const isLow = tier === "low";
  const overlayBg = isLow ? "rgba(3, 5, 10, 0.85)" : "rgba(3, 5, 10, 0.4)";
  const overlayBlur = isLow ? "none" : "blur(24px) saturate(150%)";

  return (
    <div
      ref={modalRef}
      style={{ pointerEvents: isOpen ? "auto" : "none" }}
      className="fixed inset-0 z-[200] touch-action-none"
    >
      <AnimatePresence>
        {isOpen && (
          <>
            {/* 1. ИЗОЛИРОВАННЫЙ СЛОЙ МАСКИ (Без внутренних transform) */}
            <motion.div
              key="vimeo-overlay"
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              style={{
                backgroundColor: overlayBg,
                backdropFilter: overlayBlur,
                WebkitBackdropFilter: overlayBlur,
              }}
              onClick={onClose}
            />

            {/* 2. СЛОЙ КОНТЕНТА */}
            <motion.div
              key="vimeo-content"
              className="absolute inset-0 flex items-center justify-center p-4 md:p-12 pointer-events-none"
            >
              <motion.div
                className="relative w-full max-w-6xl pointer-events-auto"
                initial={{ scale: 0.95, y: 20, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.95, y: 20, opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="absolute -top-14 right-0 md:-top-10 md:-right-10 z-50">
                  <SciFiCloseButton onClick={onClose} />
                </div>

                <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl border border-cyan-500/20">
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
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
