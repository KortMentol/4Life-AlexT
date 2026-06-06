/**
 * MediaSlide — рендерит одно изображение или видео в галерее.
 * Видео: автоплей при isActive, пауза при неактивном слайде.
 */
import { GalleryItem } from "@/data/productsData";
import React, { useEffect, useRef } from "react";

interface MediaSlideProps {
  item: GalleryItem;
  isActive: boolean;
}

export const MediaSlide: React.FC<MediaSlideProps> = ({ item, isActive }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (isActive) {
      v.play().catch(() => {});
    } else {
      v.pause();
      v.currentTime = 0;
    }
  }, [isActive]);

  if (item.type === "video") {
    return (
      <div className="relative w-full h-full bg-black flex items-center justify-center">
        <video
          ref={videoRef}
          src={item.src}
          poster={item.poster}
          loop
          muted
          playsInline
          preload="metadata"
          className="w-full h-full object-contain"
        />
        {/* Play overlay when paused */}
        {!isActive && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-14 h-14 rounded-full bg-black/50 border border-white/30 flex items-center justify-center backdrop-blur-sm">
              <svg
                className="w-6 h-6 text-white ml-1"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="w-full h-full flex items-center justify-center">
      <img
        src={item.src}
        alt={item.alt ?? ""}
        loading={isActive ? "eager" : "lazy"}
        decoding="async"
        className="w-full h-full object-contain"
      />
    </div>
  );
};
