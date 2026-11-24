/**
 * @module src/components/sections/About/DocumentaryFilmReel.tsx
 * @description Ultra-editorial Documentary Screening Stage for /about.
 * Ready for official 4Life YouTube links (David & Bianca Lisonbee, Utah cGMP plant, Transfer Factor science):
 * simply paste any YouTube URL into `youtubeUrl` inside `ABOUT_DOCUMENTARY_FILMS` below.
 */

import foundersArchiveImg from "@/assets/images/about_founders_archive_1795234148081.jpg";
import immuneCausticsImg from "@/assets/images/biotech_immune_caustics_1795234146065.jpg";
import utahLabImg from "@/assets/images/utah_cgmp_laboratory_1795192951687.jpg";
import { usePerformanceTier } from "@/hooks";
import { Icons } from "@/utils/icons";
import { AnimatePresence, motion } from "framer-motion";
import React, { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";

export interface DocumentaryFilmItem {
  id: string;
  reelCode: string;
  category: string;
  duration: string;
  title: string;
  italicAccent: string;
  synopsis: string;
  location: string;
  stillImage: string;
  stillAlt: string;
  /**
   * Drop any YouTube watch/share/embed URL here (e.g. "https://youtu.be/VIDEO_ID").
   * When set, the cinema modal automatically renders the privacy-enhanced HD YouTube player.
   */
  youtubeUrl?: string;
  archiveHref: string;
}

export const ABOUT_DOCUMENTARY_FILMS: readonly DocumentaryFilmItem[] = [
  {
    id: "founders",
    reelCode: "REEL 01",
    category: "История основателей",
    duration: "04:18",
    title: "Дэвид и Бьянка Лизонби —",
    italicAccent: "как научная статья стала компанией в 70 странах",
    synopsis:
      "В 1998 году в штате Юта основатели 4Life лицензировали патент на экстракцию трансфер-факторов из молозива. Короткий документальный очерк о принципах Science, Success, Service и первых годах лаборатории.",
    location: "Сэнди, Юта • 1998",
    stillImage: foundersArchiveImg,
    stillAlt: "Горы штата Юта и исследовательская лаборатория 4Life в сумерках",
    youtubeUrl: "",
    archiveHref: "https://www.youtube.com/@4LifeResearch",
  },
  {
    id: "cgmp-plant",
    reelCode: "REEL 02",
    category: "Производство cGMP",
    duration: "03:45",
    title: "Собственный завод в Юте —",
    italicAccent: "хроматография и контроль каждой партии",
    synopsis:
      "Взгляд внутрь производственного комплекса 4Life Research: многоступенчатая ультрафильтрация, тестирование сырья на чистоту, фармацевтический стандарт cGMP и международные сертификации Halal и Kosher.",
    location: "Sandy Manufacturing Facility • cGMP",
    stillImage: utahLabImg,
    stillAlt: "Хроматографическая лаборатория и линии контроля чистоты 4Life cGMP",
    youtubeUrl: "",
    archiveHref: "https://www.youtube.com/@4LifeResearch",
  },
  {
    id: "science-tf",
    reelCode: "REEL 03",
    category: "Иммунология",
    duration: "05:02",
    title: "Язык клеточной памяти —",
    italicAccent: "что такое Трансфер Факторы и как они обучают клетки",
    synopsis:
      "Наглядное объяснение открытия доктора Шервуда Лоуренса (1949) и формулы Трай-Фактор: как сигнальные пептиды передают иммунитету опыт распознавания без грубой стимуляции.",
    location: "Трансферцевтика • 1949–2026",
    stillImage: immuneCausticsImg,
    stillAlt: "Оптическая модель низкомолекулярных пептидных фракций Transfer Factor",
    youtubeUrl: "",
    archiveHref: "https://www.youtube.com/@4LifeResearch",
  },
] as const;

function toYouTubeEmbedUrl(rawUrl?: string): string | null {
  if (!rawUrl || !rawUrl.trim()) return null;
  const trimmed = rawUrl.trim();
  const embedMatch = trimmed.match(/youtube(?:-nocookie)?\.com\/embed\/([a-zA-Z0-9_-]{11})/);
  if (embedMatch?.[1]) {
    return `https://www.youtube-nocookie.com/embed/${embedMatch[1]}?autoplay=1&rel=0&modestbranding=1`;
  }
  const shortMatch = trimmed.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (shortMatch?.[1]) {
    return `https://www.youtube-nocookie.com/embed/${shortMatch[1]}?autoplay=1&rel=0&modestbranding=1`;
  }
  const watchMatch = trimmed.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (watchMatch?.[1]) {
    return `https://www.youtube-nocookie.com/embed/${watchMatch[1]}?autoplay=1&rel=0&modestbranding=1`;
  }
  return null;
}

export const DocumentaryFilmReel: React.FC = () => {
  const tier = usePerformanceTier();
  const isLow = tier === "low";
  const [activeIdx, setActiveIdx] = useState(0);
  const [openFilm, setOpenFilm] = useState<DocumentaryFilmItem | null>(null);

  const activeFilm = ABOUT_DOCUMENTARY_FILMS[activeIdx] ?? ABOUT_DOCUMENTARY_FILMS[0]!;
  const embedUrl = toYouTubeEmbedUrl(openFilm?.youtubeUrl);

  const handleClose = useCallback(() => {
    setOpenFilm(null);
  }, []);

  useEffect(() => {
    if (!openFilm) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenFilm(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [openFilm]);

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
        <div className="lg:col-span-7 space-y-4">
          <span className="typography-label text-cyan-400 block">02 — Документальный архив 4Life</span>
          <h2 className="typography-h2 text-white">
            Основатели, лаборатория и{" "}
            <span className="typography-editorial-italic text-cyan-300 font-normal">живые кадры производства</span>
          </h2>
        </div>
        <div className="lg:col-span-5">
          <p className="typography-body text-slate-400 text-pretty">
            Три ключевых сюжета о людях и инженерной культуре за брендом 4Life: от истории Дэвида и Бьянки Лизонби до
            внутреннего контроля чистоты на заводе в штате Юта.
          </p>
        </div>
      </div>

      {/* Main Cinema Theatre Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
        {/* 8-Column Anamorphic 16:9 Screening Frame */}
        <div className="lg:col-span-8">
          <div className="group relative aspect-[16/10] sm:aspect-[16/9] rounded-[1.75rem] overflow-hidden border border-white/[0.1] bg-[#050811]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFilm.id}
                initial={isLow ? { opacity: 1 } : { opacity: 0, scale: 1.03 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={isLow ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0"
              >
                <img
                  src={activeFilm.stillImage}
                  alt={activeFilm.stillAlt}
                  className="w-full h-full object-cover object-center transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0"
                  style={{
                    backgroundImage:
                      "linear-gradient(180deg, rgba(3,5,10,0.68) 0%, rgba(3,5,10,0.22) 44%, rgba(3,5,10,0.92) 100%)",
                  }}
                />
              </motion.div>
            </AnimatePresence>

            {/* Top cinema frame telemetry */}
            <div className="relative z-10 flex items-center justify-between px-6 pt-5 sm:px-8 sm:pt-6">
              <div className="flex items-center gap-3">
                <span className="typography-mono text-[11px] tracking-[0.2em] text-cyan-300">
                  {activeFilm.reelCode}
                </span>
                <span className="w-5 h-px bg-white/25" aria-hidden="true" />
                <span className="typography-mono text-[11px] text-slate-200/80">{activeFilm.location}</span>
              </div>
              <span className="typography-mono text-xs text-white/80">{activeFilm.duration}</span>
            </div>

            {/* Center Play Aperture Trigger */}
            <button
              type="button"
              onClick={() => setOpenFilm(activeFilm)}
              data-open-film={activeFilm.id}
              aria-label={`Открыть просмотр: ${activeFilm.title} ${activeFilm.italicAccent}`}
              className="absolute inset-0 z-10 flex items-center justify-center cursor-pointer focus-visible:outline-none"
            >
              <span className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center bg-[#03050a]/75 border border-cyan-300/55 text-white shadow-[0_0_40px_rgba(6,182,212,0.28)] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-108 group-hover:border-cyan-300 group-active:scale-95">
                <Icons.Play className="w-6 h-6 sm:w-7 sm:h-7 text-cyan-300 translate-x-0.5" />
              </span>
            </button>

            {/* Bottom Editorial Title & Synopsis */}
            <div className="absolute inset-x-0 bottom-0 z-10 p-6 sm:p-8 pointer-events-none space-y-2">
              <h3 className="font-heading text-xl sm:text-2xl lg:text-[1.7rem] font-semibold text-white leading-tight">
                {activeFilm.title}{" "}
                <span className="typography-editorial-italic text-cyan-200 font-normal">{activeFilm.italicAccent}</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-300/90 max-w-2xl leading-relaxed line-clamp-2">
                {activeFilm.synopsis}
              </p>
            </div>
          </div>
        </div>

        {/* 4-Column Film Reel Index */}
        <div className="lg:col-span-4 flex flex-col justify-between border-y border-white/[0.1] divide-y divide-white/[0.08]">
          {ABOUT_DOCUMENTARY_FILMS.map((film, idx) => {
            const isSelected = idx === activeIdx;
            return (
              <button
                key={film.id}
                type="button"
                onClick={() => setActiveIdx(idx)}
                data-select-reel={film.id}
                className="relative py-6 text-left flex flex-col justify-between gap-3 cursor-pointer group transition-colors"
              >
                <div className="flex items-center justify-between gap-3">
                  <span
                    className={`typography-mono text-[11px] tracking-[0.18em] transition-colors ${
                      isSelected ? "text-cyan-400" : "text-slate-500 group-hover:text-slate-300"
                    }`}
                  >
                    {film.reelCode} • {film.category}
                  </span>
                  <span className="typography-mono text-[11px] text-slate-500">{film.duration}</span>
                </div>

                <p
                  className={`font-heading text-base md:text-lg font-semibold leading-snug transition-colors ${
                    isSelected ? "text-white" : "text-slate-300 group-hover:text-white"
                  }`}
                >
                  {film.title}{" "}
                  <span className="font-normal text-slate-400">{film.italicAccent}</span>
                </p>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">{film.location}</span>
                  {isSelected && (
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenFilm(film);
                      }}
                      className="inline-flex items-center gap-1.5 text-cyan-300 hover:text-white font-medium"
                    >
                      <span>Смотреть</span>
                      <Icons.ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>

                {/* Active Left Indicator */}
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-5 bottom-5 w-[2px] bg-cyan-400 transition-transform duration-300 origin-top"
                  style={{
                    transform: isSelected ? "scaleY(1)" : "scaleY(0)",
                    marginLeft: "-1rem",
                  }}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Cinema Screening Modal Portal */}
      {openFilm &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label={openFilm.title}
            data-lenis-prevent
            onClick={handleClose}
            className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-8 bg-[#020409]/92 overscroll-contain"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl rounded-[1.75rem] overflow-hidden bg-[#050811] border border-white/[0.12] shadow-[0_32px_90px_rgba(0,0,0,0.85)]"
            >
              {/* Modal Top Bar */}
              <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-white/[0.08]">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="typography-mono text-xs text-cyan-400">{openFilm.reelCode}</span>
                  <span className="text-sm font-medium text-white truncate">
                    {openFilm.title} {openFilm.italicAccent}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleClose}
                  aria-label="Закрыть просмотр"
                  className="w-9 h-9 rounded-full flex items-center justify-center bg-white/[0.05] hover:bg-white/[0.12] border border-white/[0.1] text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  <Icons.X className="w-4 h-4" />
                </button>
              </div>

              {/* Player Frame */}
              <div className="relative aspect-video bg-[#03050a]">
                {embedUrl ? (
                  <iframe
                    src={embedUrl}
                    title={`${openFilm.title} ${openFilm.italicAccent}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                ) : (
                  <div className="relative w-full h-full flex flex-col justify-end p-6 sm:p-10">
                    <img
                      src={openFilm.stillImage}
                      alt={openFilm.stillAlt}
                      className="absolute inset-0 w-full h-full object-cover opacity-55"
                    />
                    <div
                      aria-hidden="true"
                      className="absolute inset-0"
                      style={{
                        backgroundImage:
                          "linear-gradient(180deg, rgba(3,5,10,0.45) 0%, rgba(3,5,10,0.92) 85%, #050811 100%)",
                      }}
                    />
                    <div className="relative z-10 max-w-2xl space-y-4">
                      <span className="typography-mono text-[11px] uppercase tracking-[0.2em] text-cyan-300 block">
                        Официальный видеоархив 4Life Research • {openFilm.location}
                      </span>
                      <h4 className="typography-h3 text-white">
                        {openFilm.title}{" "}
                        <span className="typography-editorial-italic text-cyan-200 font-normal">
                          {openFilm.italicAccent}
                        </span>
                      </h4>
                      <p className="text-sm text-slate-300 leading-relaxed">{openFilm.synopsis}</p>
                      <div className="pt-2">
                        <a
                          href={openFilm.archiveHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/45 text-xs font-semibold uppercase tracking-[0.14em] text-cyan-200 transition-colors"
                        >
                          <span>Открыть официальный канал 4Life</span>
                          <Icons.ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
};

export default React.memo(DocumentaryFilmReel);
