import { GalleryItem } from "@/data/productsData";
import React, { useEffect, useRef } from "react";

interface MediaSlideProps {
  item: GalleryItem;
  isActive: boolean;
}

export const MediaSlide: React.FC<MediaSlideProps> = ({ item, isActive }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const syncPlayback = () => {
      if (isActive && document.visibilityState === "visible") {
        void video.play().catch(() => undefined);
      } else {
        video.pause();
      }
    };

    syncPlayback();
    document.addEventListener("visibilitychange", syncPlayback);
    return () => {
      document.removeEventListener("visibilitychange", syncPlayback);
      video.pause();
      video.currentTime = 0;
    };
  }, [isActive]);

  if (item.type === "video") {
    return (
      <div className="relative flex h-full w-full items-center justify-center bg-[#03050a]">
        <video
          ref={videoRef}
          src={item.src}
          poster={item.poster}
          loop
          muted
          playsInline
          preload="metadata"
          aria-label={item.alt ?? "Видео о продукте"}
          className="h-full w-full object-contain"
        />
      </div>
    );
  }

  const isProductCover = item.isProductCover === true;
  const auraColor = item.auraColor ?? "rgba(6,182,212,0.20)";

  return (
    <div
      className="relative flex h-full w-full items-center justify-center overflow-hidden bg-[#050811]"
      style={
        isProductCover
          ? { backgroundImage: `radial-gradient(ellipse at 50% 60%, ${auraColor}, transparent 64%)` }
          : undefined
      }
    >
      {isProductCover ? (
        <div
          className="pointer-events-none absolute inset-x-[12%] bottom-[14%] h-[28%] rounded-[50%] border border-white/[0.07] bg-white/[0.025]"
          aria-hidden="true"
        />
      ) : null}
      <img
        src={item.src}
        alt={item.alt ?? ""}
        loading={isActive ? "eager" : "lazy"}
        decoding="async"
        className={isProductCover ? "relative z-10 h-full w-full object-contain p-8 md:p-12" : "h-full w-full object-cover"}
      />
    </div>
  );
};
