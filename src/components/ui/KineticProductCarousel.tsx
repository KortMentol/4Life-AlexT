/**
 * @module components/ui/KineticProductCarousel
 * @description Мобильный 3D-Куб слайдер продуктов.
 *
 * ОПТИМИЗАЦИЯ ТАКТИЛЬНОСТИ И ПЕРЕХОДОВ (Awwwards 2026):
 * 1. [State-Locked Active Feedback]: При тапе на карточку её состояние блокируется через
 *    `clickedCardId`. Карточка застывает в нажатом положении (scale 0.93), лазерная полоса
 *    и стрелка горят непрерывно вплоть до перекрытия экрана волной перехода. Это убирает флик.
 * 2. [Cinematic Focus Dimming]: При выборе карточки остальные элементы карусели плавно
 *    затухают (opacity 0.4) и уменьшаются, направляя всё внимание на активный продукт.
 * 3. [Performance Degradation]: На low-tier устройствах полностью отключаются тяжелые
 *    многослойные тени внутри 3D-куба, что спасает FPS при свайпе.
 *
 * @author Geminis AI & Kort
 * @version 18.1.0
 */

import { useTransition } from "@/context";
import { usePerformanceTier } from "@/hooks";
import { Icons } from "@/utils/icons";
import React, { useRef, useState } from "react";
import type { Swiper as SwiperType } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/effect-cube";
import { EffectCube } from "swiper/modules";

interface ProductData {
  id: number;
  title: string;
  description: string;
  image: string;
  link: string;
}

interface KineticCarouselProps {
  products: ProductData[];
}

const PRODUCT_ID_MAP: Record<number, string> = {
  1: "tf-trifactor",
  2: "tf-plus",
  3: "renuvo",
};

const MOBILE_PRODUCT_HUD_INFO = [
  {
    title: "Трай-Фактор Формула",
    desc: "Интеллектуальный тренер. Быстро обучает ваши иммунные клетки для точной защиты всего организма.",
  },
  {
    title: "Трансфер Фактор Плюс",
    desc: "Абсолютная броня здоровья. Повышает активность клеток-киллеров на рекордные 437%.",
  },
  {
    title: "Ренуво",
    desc: "Клеточная перезагрузка. Адаптогенная формула для снижения стресса и восстановления тонуса.",
  },
];

const KineticProductCarousel: React.FC<KineticCarouselProps> = ({ products }) => {
  const swiperRef = useRef<SwiperType | null>(null);
  const { transitionTo } = useTransition();
  const [activeIndex, setActiveIndex] = useState(0);

  // ФИКС ТИРОВ ДЛЯ КУБА: На low устройствах отключаем дроп-шадоу внутри 3D-трансформации
  const tier = usePerformanceTier();
  const isLowTier = tier === "low";

  // Локальный стейт фиксации клика для предотвращения флика перед волной
  const [clickedCardId, setClickedCardId] = useState<number | null>(null);

  if (!products || products.length === 0) {
    return null;
  }

  const handleCardClick = (id: number) => {
    if (clickedCardId !== null) return; // Защита от двойного тапа

    setClickedCardId(id);
    const productId = PRODUCT_ID_MAP[id] ?? "tf-classic";

    transitionTo(`/products?productId=${productId}`);
  };

  const isAnyClicked = clickedCardId !== null;

  return (
    <div className="lg:hidden w-full py-12 relative z-10" data-lenis-prevent>
      <div className="w-full flex justify-center bg-transparent">
        <Swiper
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          onSlideChange={(swiper) => {
            if (!isAnyClicked) {
              setActiveIndex(swiper.realIndex);
            }
          }}
          effect={"cube"}
          grabCursor={true}
          edgeSwipeDetection={true}
          edgeSwipeThreshold={20}
          cubeEffect={{
            shadow: false,
            slideShadows: false,
            shadowOffset: 0,
            shadowScale: 0,
          }}
          loop={!isAnyClicked} // Блокируем свайп во время перехода
          allowTouchMove={!isAnyClicked}
          modules={[EffectCube]}
          className="w-[82vw] max-w-[310px] aspect-[3/4] bg-transparent"
          style={{ overflow: "visible" }}
          slidesPerView={1}
          centeredSlides={true}
        >
          {products.map((product, index) => {
            const info = MOBILE_PRODUCT_HUD_INFO[index] ?? MOBILE_PRODUCT_HUD_INFO[0]!;
            const isClicked = clickedCardId === product.id;

            return (
              <SwiperSlide
                key={product.id}
                className="flex flex-col justify-center items-center bg-transparent overflow-visible"
                style={{ backfaceVisibility: "hidden", transform: "translateZ(0)" }}
              >
                <div
                  onClick={() => handleCardClick(product.id)}
                  className={`group w-full h-full aspect-[3/4] p-6 rounded-[2rem] border text-left relative overflow-hidden flex flex-col justify-between transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    isClicked
                      ? `scale-[0.93] border-cyan-400/60 ${isLowTier ? "bg-[#050811]" : "shadow-[0_0_35px_rgba(6,182,212,0.35)] bg-gradient-to-br from-[#0c1322] to-[#03050a]"}`
                      : isAnyClicked
                        ? `opacity-40 scale-[0.97] border-cyan-500/5 pointer-events-none ${isLowTier ? "bg-[#050811]" : "bg-gradient-to-br from-[#0c1322] to-[#03050a]"}`
                        : `border-cyan-500/20 active:scale-95 ${isLowTier ? "bg-[#050811]" : "shadow-2xl bg-gradient-to-br from-[#0c1322] to-[#03050a]"}`
                  }`}
                  style={{
                    backfaceVisibility: "hidden",
                    transform: "translateZ(0)",
                    contain: "layout style paint",
                  }}
                >
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />

                  {/* Крупное парящее изображение */}
                  <div className="flex-1 flex items-center justify-center py-4 bg-transparent min-h-0">
                    <img
                      src={product.image}
                      alt={product.title}
                      loading="lazy"
                      decoding="async"
                      className={`h-[95%] max-h-[190px] object-contain transition-all duration-500 ease-out ${
                        isLowTier
                          ? "" // Отключаем drop-shadow на слабом железе
                          : isClicked
                            ? "drop-shadow-[0_25px_50px_rgba(6,182,212,0.4)]"
                            : "drop-shadow-[0_20px_40px_rgba(0,0,0,0.7)]"
                      }`}
                      style={{ backfaceVisibility: "hidden", transform: "scale(1.35) translateZ(0)" }}
                    />
                  </div>

                  {/* Описание */}
                  <div className="w-full text-left">
                    <h3 className="font-bold text-base text-white mb-1.5 leading-snug">{info.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed mb-4 text-pretty">{info.desc}</p>

                    <div className="relative self-start inline-flex items-center gap-1.5 text-cyan-400 font-bold text-xs uppercase tracking-widest cursor-pointer">
                      <span className="relative z-10">ПОДРОБНЕЕ</span>

                      <span
                        className={`absolute bottom-[-3px] left-0 h-[1px] w-full bg-gradient-to-r from-cyan-400/80 to-transparent origin-left transition-all duration-500 ease-out pointer-events-none ${
                          isClicked
                            ? "scale-x-100 opacity-100"
                            : "scale-x-0 opacity-0 group-active:scale-x-100 group-active:opacity-100"
                        }`}
                        style={{ clipPath: "polygon(0 0, 100% 40%, 100% 60%, 0 100%)" }}
                      />

                      <Icons.ArrowRight
                        className={`w-3.5 h-3.5 transition-transform duration-300 ease-out ${
                          isClicked ? "translate-x-1.5 text-cyan-300" : "group-active:translate-x-1"
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>

      {/* Линейный индикатор прогресса */}
      <div className="flex justify-center items-center mt-6">
        <div className="w-24 h-[2px] bg-white/10 rounded-full overflow-hidden relative">
          <div
            className="h-full bg-cyan-400 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${((activeIndex + 1) / products.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Навигационные стрелки */}
      <div className="flex justify-center gap-4 mt-6">
        <button
          onClick={() => swiperRef.current?.slidePrev()}
          disabled={isAnyClicked}
          className={`w-11 h-11 rounded-full flex items-center justify-center bg-white/[0.03] border border-white/10 transition-all duration-300 focus:outline-none ${
            isAnyClicked ? "opacity-10 scale-90 pointer-events-none" : "active:scale-90"
          }`}
          style={{ willChange: "transform", contain: "layout style paint" }}
          aria-label="Предыдущий продукт"
        >
          <Icons.ChevronLeft className="w-5 h-5 text-slate-400" />
        </button>

        <button
          onClick={() => swiperRef.current?.slideNext()}
          disabled={isAnyClicked}
          className={`w-11 h-11 rounded-full flex items-center justify-center bg-white/[0.03] border border-white/10 transition-all duration-300 focus:outline-none ${
            isAnyClicked ? "opacity-10 scale-90 pointer-events-none" : "active:scale-90"
          }`}
          style={{ willChange: "transform", contain: "layout style paint" }}
          aria-label="Следующий продукт"
        >
          <Icons.ChevronRight className="w-5 h-5 text-slate-400" />
        </button>
      </div>
    </div>
  );
};

export default KineticProductCarousel;
