/**
 * @module components/ui/KineticProductCarousel
 * @description Мобильный 3D-Куб слайдер продуктов.
 *
 * ИСПРАВЛЕНИЯ ЭТАПА 3 (Awwwards Pro):
 * 1. [Increased Girth / Proportions]: Ширина куба увеличена до w-[82vw] max-w-[310px] при сохранении aspect-[3/4].
 *    Куб больше не выглядит сжатым столбом, он обрел монументальный объем и устойчивость.
 * 2. [No More Truncation / Tailored Copy]: Полностью удален line-clamp. Описания переписаны на емкие
 *    10-словные тезисы, которые идеально и полностью помещаются на экране смартфона без троеточий.
 * 3. [Smoked Obsidian Glow]: Плоский фон заменен на переливающийся биотех-градиент с лазерной
 *    неоново-циановой рамкой (border-cyan-500/20) и внутренним свечением.
 * 4. [scale(1.35) Integrated]: Твой масштаб и аппаратное ускорение интегрированы в инлайн-стиль transform.
 *
 * @author Geminis AI & Kort
 * @version 16.0.0
 */

import { useTransition } from "@/context";
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

// Емкие, вдохновляющие описания строго по брошюре 4Life (без троеточий и перегруза)
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

  if (!products || products.length === 0) {
    return null;
  }

  const handleCardClick = (id: number) => {
    const productId = PRODUCT_ID_MAP[id] ?? "tf-classic";
    transitionTo(`/products?productId=${productId}`);
  };

  return (
    <div className="lg:hidden w-full py-12 relative z-10" data-lenis-prevent>
      <div className="w-full flex justify-center bg-transparent">
        <Swiper
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          onSlideChange={(swiper) => {
            setActiveIndex(swiper.realIndex);
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
          loop={true}
          modules={[EffectCube]}
          // Куб расширен до w-[82vw] max-w-[310px] для премиальной солидности
          className="w-[82vw] max-w-[310px] aspect-[3/4] bg-transparent"
          style={{ overflow: "visible" }}
          slidesPerView={1}
          centeredSlides={true}
        >
          {products.map((product, index) => {
            const info = MOBILE_PRODUCT_HUD_INFO[index] ?? MOBILE_PRODUCT_HUD_INFO[0]!;
            return (
              <SwiperSlide
                key={product.id}
                className="flex flex-col justify-center items-center bg-transparent overflow-visible"
                style={{ backfaceVisibility: "hidden", transform: "translateZ(0)" }}
              >
                {/* ── ВЫТЯНУТАЯ ОБСИДИАНОВАЯ КАПСУЛА CUBE CARD (w-full h-full убрал зазоры) ── */}
                <div
                  onClick={() => handleCardClick(product.id)}
                  className="w-full h-full aspect-[3/4] p-6 rounded-[2rem] border text-left relative overflow-hidden flex flex-col justify-between bg-gradient-to-br from-[#0c1322] to-[#03050a] border-cyan-500/20 shadow-2xl"
                  style={{
                    backfaceVisibility: "hidden",
                    transform: "translateZ(0)",
                    contain: "layout style paint",
                  }}
                >
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />

                  {/* Крупное парящее изображение с твоим scale(1.35) */}
                  <div className="flex-1 flex items-center justify-center py-4 bg-transparent min-h-0">
                    <img
                      src={product.image}
                      alt={product.title}
                      loading="lazy"
                      className="h-[95%] max-h-[190px] object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.7)]"
                      // Твой идеальный скейл и аппаратное ускорение
                      style={{ backfaceVisibility: "hidden", transform: "scale(1.35) translateZ(0)" }}
                    />
                  </div>

                  {/* Описание */}
                  <div className="w-full text-left">
                    <h3 className="font-bold text-base text-white mb-1.5 leading-snug">{info.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed mb-4 text-pretty">{info.desc}</p>

                    <div className="relative self-start inline-flex items-center gap-1.5 text-cyan-400 font-bold text-xs uppercase tracking-widest cursor-pointer group/cta">
                      <span className="relative z-10">ПОДРОБНЕЕ</span>
                      {/* Утонченный лазерный шлейф */}
                      <span
                        className="absolute bottom-[-3px] left-0 h-[1px] w-full bg-gradient-to-r from-cyan-400/60 to-transparent"
                        style={{ clipPath: "polygon(0 0, 100% 40%, 100% 60%, 0 100%)" }}
                      />
                      <Icons.ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>

      {/* ─── СВЕРХСОВРЕМЕННЫЙ ЛИНЕЙНЫЙ ИНДИКАТОР ПРОГРЕССА (Awwwards 2026) ─── */}
      <div className="flex justify-center items-center mt-6">
        <div className="w-24 h-[2px] bg-white/10 rounded-full overflow-hidden relative">
          <div
            className="h-full bg-cyan-400 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${((activeIndex + 1) / products.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Навигационные стрелки — Clinical Obsidian Style */}
      <div className="flex justify-center gap-4 mt-6">
        <button
          onClick={() => swiperRef.current?.slidePrev()}
          className="w-11 h-11 rounded-full flex items-center justify-center bg-white/[0.03] border border-white/10 active:scale-90 transition-transform duration-100 focus:outline-none"
          style={{ willChange: "transform", contain: "layout style paint" }}
          aria-label="Предыдущий продукт"
        >
          <Icons.ChevronLeft className="w-5 h-5 text-slate-400" />
        </button>

        <button
          onClick={() => swiperRef.current?.slideNext()}
          className="w-11 h-11 rounded-full flex items-center justify-center bg-white/[0.03] border border-white/10 active:scale-90 transition-transform duration-100 focus:outline-none"
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
