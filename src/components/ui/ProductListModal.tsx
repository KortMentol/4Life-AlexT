/**
 * @module src/components/ui/ProductListModal.tsx
 * @description Singleton Clinical Obsidian Order List Modal (v8.0 — Awwwards SOTY Edition).
 * Mounted ONCE at app root (inside Router + ProductListProvider) so desktop & mobile Header icons,
 * Contextual Bottom LP Loyalty Dock, and ProductDetailModal all share one clean modal instance.
 */

import LpInfoPopover from "@/components/ui/LpInfoPopover";
import SmoothModalScroll from "@/components/ui/SmoothModalScroll";
import { MAX_QTY_PER_PRODUCT, MAX_TOTAL_CART_ITEMS } from "@/context/ProductListProvider";
import { productsData } from "@/data/productsData";
import { usePerformanceTier } from "@/hooks";
import { useProductList } from "@/hooks/useProductList";
import { lenis } from "@/lib/lenis";
import { siteConfig } from "@/site-config/site";
import {
  buildCompactQrWhatsAppUrl,
  buildConsultationMessage,
  buildRc67OrderMessage,
  buildTelegramOrderUrl,
  calculateTotalLp,
  calculateTotalRub,
  estimateRetailRub,
  formatRub,
} from "@/utils/catalogHelpers";
import { Icons } from "@/utils/icons";
import { generateQrMatrix, qrMatrixToSvgPath } from "@/utils/qrCodeSvg";
import { acquireScrollLock } from "@/utils/scrollLock";
import { AnimatePresence, motion, useIsPresent } from "framer-motion";
import React, { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useLocation, useNavigate } from "react-router-dom";

interface DustParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  age: number;
  life: number;
}

async function copyTextSafe(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Fallback below
  }

  try {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
    return true;
  } catch {
    return false;
  }
}

const DUST_COLORS = ["#22d3ee", "#67e8f9", "#e2e8f0", "#38bdf8"] as const;

function CartPresenceBridge({ children }: { children: (isPresent: boolean) => ReactNode }) {
  const isPresent = useIsPresent();
  return <>{children(isPresent)}</>;
}

const ProductListModal: React.FC = () => {
  const tier = usePerformanceTier();
  const isLow = tier === "low";
  const location = useLocation();
  const navigate = useNavigate();

  const {
    items,
    removeFromList,
    updateItemQuantity,
    getTotalItems,
    clearList,
    isModalOpen: isOpen,
    closeModal: closeContextModal,
  } = useProductList();

  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [copiedOrder, setCopiedOrder] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const [showReceiptPreview, setShowReceiptPreview] = useState(false);
  const [showDesktopBridge, setShowDesktopBridge] = useState(false);
  const noticeTimerRef = useRef<number | null>(null);
  const copyResetTimerRef = useRef<number | null>(null);
  const idResetTimerRef = useRef<number | null>(null);

  // Canvas 2D Bio-Particle Disintegration refs
  const panelRef = useRef<HTMLDivElement>(null);
  const dustCanvasRef = useRef<HTMLCanvasElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const rowRefs = useRef<Map<string, HTMLLIElement>>(new Map());
  const particlesRef = useRef<DustParticle[]>([]);
  const dustRafRef = useRef<number | null>(null);
  const dustLastTsRef = useRef<number>(0);

  const totalItems = getTotalItems();

  const enrichedItems = useMemo(() => {
    const byId = new Map(productsData.map((p) => [p.id, p]));
    return items.map((item) => {
      const fresh = byId.get(item.id);
      return {
        ...item,
        lp: fresh?.lp ?? item.lp,
        image: fresh?.image ?? item.image,
        priceRub: fresh?.priceRub ?? item.priceRub ?? 0,
      };
    });
  }, [items]);

  const totalLp = useMemo(() => calculateTotalLp(enrichedItems), [enrichedItems]);
  const totalRub = useMemo(() => calculateTotalRub(enrichedItems), [enrichedItems]);
  const totalRetailRub = useMemo(
    () => enrichedItems.reduce((sum, item) => sum + estimateRetailRub(item.priceRub) * item.quantity, 0),
    [enrichedItems],
  );

  const rc67OrderText = useMemo(
    () =>
      buildRc67OrderMessage(
        enrichedItems,
        siteConfig.distributor.fourLifeId,
        siteConfig.distributor.shortName,
      ),
    [enrichedItems],
  );

  const consultationText = useMemo(() => buildConsultationMessage(enrichedItems), [enrichedItems]);

  const rc67WhatsAppUrl = useMemo(
    () => `${siteConfig.office.whatsapp}?text=${encodeURIComponent(rc67OrderText)}`,
    [rc67OrderText],
  );

  const rc67TelegramUrl = useMemo(
    () => buildTelegramOrderUrl(siteConfig.office.telegram, rc67OrderText),
    [rc67OrderText],
  );

  const compactQrUrl = useMemo(() => {
    const digits = siteConfig.office.phoneRaw.replace(/\D/g, "");
    return buildCompactQrWhatsAppUrl(enrichedItems, digits, siteConfig.distributor.fourLifeId);
  }, [enrichedItems]);

  const alexWhatsAppUrl = useMemo(
    () => `${siteConfig.contact.whatsapp}?text=${encodeURIComponent(consultationText)}`,
    [consultationText],
  );

  const alexTelegramUrl = useMemo(
    () => buildTelegramOrderUrl(siteConfig.contact.telegram, consultationText),
    [consultationText],
  );

  const qrData = useMemo(() => {
    if (!isOpen || enrichedItems.length === 0) return null;
    const matrix = generateQrMatrix(compactQrUrl);
    return {
      version: matrix.version,
      size: matrix.size,
      pathD: qrMatrixToSvgPath(matrix.modules),
    };
  }, [isOpen, enrichedItems.length, compactQrUrl]);

  const stopDustLoop = useCallback(() => {
    if (dustRafRef.current !== null) {
      cancelAnimationFrame(dustRafRef.current);
      dustRafRef.current = null;
    }
    particlesRef.current = [];
  }, []);

  const spawnBioDust = useCallback(
    (sourceEl: HTMLElement | null) => {
      if (isLow || !sourceEl) return;
      if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
      }
      const panel = panelRef.current;
      const canvas = dustCanvasRef.current;
      if (!panel || !canvas) return;

      const panelRect = panel.getBoundingClientRect();
      const targetRect = sourceEl.getBoundingClientRect();
      if (panelRect.width <= 0 || panelRect.height <= 0 || targetRect.width <= 0) return;

      const dpr = tier === "high" ? Math.min(window.devicePixelRatio || 1, 2) : 1;
      const targetW = Math.round(panelRect.width * dpr);
      const targetH = Math.round(panelRect.height * dpr);
      if (canvas.width !== targetW || canvas.height !== targetH) {
        canvas.width = targetW;
        canvas.height = targetH;
      }

      const count = tier === "high" ? 96 : 42;
      const lifeMs = tier === "high" ? 420 : 340;
      const relLeft = targetRect.left - panelRect.left;
      const relTop = targetRect.top - panelRect.top;

      for (let i = 0; i < count; i++) {
        const px = relLeft + Math.random() * targetRect.width;
        const py = relTop + Math.random() * targetRect.height;
        const speed = 35 + Math.random() * 140;
        const angle = -Math.PI * 0.45 + (Math.random() - 0.5) * 1.4;
        particlesRef.current.push({
          x: px,
          y: py,
          vx: Math.cos(angle) * speed * (Math.random() > 0.35 ? 1 : -0.6),
          vy: Math.sin(angle) * speed - 24,
          size: tier === "high" ? 1.2 + Math.random() * 2.0 : 1.4 + Math.random() * 1.5,
          color: DUST_COLORS[i % DUST_COLORS.length]!,
          alpha: 0.78 + Math.random() * 0.22,
          age: 0,
          life: lifeMs * (0.72 + Math.random() * 0.45),
        });
      }

      if (dustRafRef.current !== null) return;
      dustLastTsRef.current = performance.now();

      const step = (ts: number) => {
        const dt = Math.min(48, Math.max(8, ts - dustLastTsRef.current));
        dustLastTsRef.current = ts;
        const dtSec = dt / 1000;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          stopDustLoop();
          return;
        }

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, panelRect.width, panelRect.height);

        const nextAlive: DustParticle[] = [];
        for (const p of particlesRef.current) {
          p.age += dt;
          if (p.age >= p.life) continue;

          p.x += p.vx * dtSec;
          p.y += p.vy * dtSec;
          p.vx *= 0.96;
          p.vy = p.vy * 0.96 - 14 * dtSec;

          const progress = p.age / p.life;
          const fade = Math.max(0, 1 - progress * progress);

          ctx.globalAlpha = p.alpha * fade;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * (1 - progress * 0.35), 0, Math.PI * 2);
          ctx.fill();
          nextAlive.push(p);
        }
        ctx.globalAlpha = 1;
        particlesRef.current = nextAlive;

        if (nextAlive.length > 0) {
          dustRafRef.current = requestAnimationFrame(step);
        } else {
          ctx.clearRect(0, 0, panelRect.width, panelRect.height);
          dustRafRef.current = null;
        }
      };

      dustRafRef.current = requestAnimationFrame(step);
    },
    [isLow, tier, stopDustLoop],
  );

  const showNotice = useCallback((msg: string) => {
    setActionNotice(msg);
    if (noticeTimerRef.current !== null) {
      window.clearTimeout(noticeTimerRef.current);
    }
    noticeTimerRef.current = window.setTimeout(() => {
      setActionNotice(null);
    }, 5500);
  }, []);

  const closeModal = useCallback(() => {
    stopDustLoop();
    setShowReceiptPreview(false);
    setShowDesktopBridge(false);
    closeContextModal();
  }, [stopDustLoop, closeContextModal]);

  useEffect(() => {
    if (!isOpen) return;
    const releaseScrollLock = acquireScrollLock();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      stopDustLoop();
      releaseScrollLock();
    };
  }, [isOpen, closeModal, stopDustLoop]);

  useEffect(() => {
    return () => {
      stopDustLoop();
      if (noticeTimerRef.current !== null) window.clearTimeout(noticeTimerRef.current);
      if (copyResetTimerRef.current !== null) window.clearTimeout(copyResetTimerRef.current);
      if (idResetTimerRef.current !== null) window.clearTimeout(idResetTimerRef.current);
    };
  }, [stopDustLoop]);

  const handleGoToCatalog = useCallback(() => {
    closeModal();
    if (location.pathname === "/products") {
      window.setTimeout(() => {
        const archive = document.getElementById("catalog-archive");
        if (!archive) return;
        if (lenis) {
          lenis.scrollTo(archive, { offset: -76, duration: 0.9 });
        } else {
          const top = archive.getBoundingClientRect().top + window.scrollY - 76;
          window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
        }
      }, 180);
    } else {
      navigate("/products");
    }
  }, [closeModal, location.pathname, navigate]);

  const handleRemoveWithDust = useCallback(
    (productId: string) => {
      const rowEl = rowRefs.current.get(productId) ?? null;
      spawnBioDust(rowEl);
      removeFromList(productId);
    },
    [removeFromList, spawnBioDust],
  );

  const handleClearWithDust = useCallback(() => {
    spawnBioDust(listRef.current);
    clearList();
  }, [clearList, spawnBioDust]);

  const handleCopyOrder = useCallback(async () => {
    await copyTextSafe(rc67OrderText);
    setCopiedOrder(true);
    if (copyResetTimerRef.current !== null) window.clearTimeout(copyResetTimerRef.current);
    copyResetTimerRef.current = window.setTimeout(() => setCopiedOrder(false), 3000);
    showNotice("Текст заказа скопирован в буфер обмена — вставьте его в любой мессенджер или SMS.");
  }, [rc67OrderText, showNotice]);

  const handleCopyPartnerId = useCallback(async () => {
    await copyTextSafe(siteConfig.distributor.fourLifeId);
    setCopiedId(true);
    if (idResetTimerRef.current !== null) window.clearTimeout(idResetTimerRef.current);
    idResetTimerRef.current = window.setTimeout(() => setCopiedId(false), 2600);
    showNotice(`Партнёрский ID ${siteConfig.distributor.fourLifeId} скопирован в буфер.`);
  }, [showNotice]);

  const handleWhatsAppRc67Click = useCallback(() => {
    void copyTextSafe(rc67OrderText);
    showNotice("Заказ подставлен в WhatsApp РЦ 67 (и на всякий случай скопирован в буфер).");
  }, [rc67OrderText, showNotice]);

  const handleTelegramRc67Click = useCallback(() => {
    void copyTextSafe(rc67OrderText);
    showNotice(
      "Заказ подставлен в Telegram РЦ 67 (и скопирован в буфер на случай, если приложение откроет пустое поле).",
    );
  }, [rc67OrderText, showNotice]);

  const handleMaxRc67Click = useCallback(() => {
    void copyTextSafe(rc67OrderText);
    showNotice(
      `Заказ скопирован в буфер — вставьте его в MAX по номеру склада РЦ 67: ${siteConfig.office.phone}.`,
    );
  }, [rc67OrderText, showNotice]);

  const handleAlexTelegramClick = useCallback(() => {
    void copyTextSafe(consultationText);
    showNotice("Список подставлен в Telegram Александра (и продублирован в буфер обмена).");
  }, [consultationText, showNotice]);

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <CartPresenceBridge key="product-list-modal">
          {(isPresent) => (
            <div className="pointer-events-none fixed inset-0 z-[9995] flex items-center justify-center p-2.5 sm:p-5">
              {/* Backdrop — flips wheel-through synchronously on exit frame 0 via useIsPresent() */}
              <motion.div
                key="cart-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.22 }}
                onClick={isPresent ? closeModal : undefined}
                onWheel={isPresent ? (e) => e.stopPropagation() : undefined}
                data-lenis-prevent={isPresent ? "" : undefined}
                style={{ pointerEvents: isPresent ? "auto" : "none" }}
                className={`fixed inset-0 ${tier === "high" ? "bg-[#03050a]/82 backdrop-blur-[8px]" : "bg-[#03050a]/92"}`}
              />

              {/* Clinical Obsidian Invoice Dialog */}
              <motion.div
                ref={panelRef}
                key="cart-panel"
                role="dialog"
                aria-modal="true"
                aria-label="Ваш список заказа"
                data-lenis-prevent={isPresent ? "" : undefined}
                initial={{ opacity: 0, scale: 0.97, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97, y: 12 }}
                transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
                style={{ pointerEvents: isPresent ? "auto" : "none" }}
                className="relative z-10 w-full max-w-3xl max-h-[92dvh] flex flex-col overflow-hidden rounded-3xl bg-[#060b16] border border-white/[0.1] shadow-[0_32px_90px_rgba(0,0,0,0.85)] text-white"
              >
            {/* Canvas 2D Bio-Particle Disintegration Overlay (High/Medium only) */}
            {!isLow && (
              <canvas
                ref={dustCanvasRef}
                aria-hidden="true"
                data-cart-dust-canvas
                className="pointer-events-none absolute inset-0 w-full h-full z-30"
              />
            )}

            {/* Fixed Clean Top Header (Zero redundant ID/discount pill) */}
            <div className="flex items-start justify-between gap-3 px-5 sm:px-7 py-4 border-b border-white/[0.08] bg-[#050912] flex-shrink-0">
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="typography-h3 text-white">Ваш список заказа</h2>
                  {totalItems > 0 && (
                    <span className="typography-mono text-xs text-cyan-300/90 tabular-nums">
                      ({totalItems} шт.)
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400">
                  Цены склада РЦ 67 по ID {siteConfig.distributor.fourLifeId} (−25% от 1 шт.)
                </p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                aria-label="Закрыть список заказа"
                className="w-9 h-9 rounded-full flex items-center justify-center bg-white/[0.05] hover:bg-white/[0.11] border border-white/[0.1] text-slate-300 hover:text-white transition-colors cursor-pointer flex-shrink-0"
              >
                <Icons.X className="w-4 h-4" />
              </button>
            </div>

            {/* Single Smooth Inertial Scrollable Body with GPU Overlay Scrollbar */}
            <SmoothModalScroll
              className="flex-1 min-h-0"
              contentClassName="px-4 sm:px-7 py-4 sm:py-5 pr-5 sm:pr-8"
              showTopFade
              showBottomFade
              fadeColor="#060b16"
              dataScrollAttr="data-cart-content-scroll"
            >
              {enrichedItems.length === 0 ? (
                <div className="py-10 sm:py-12 text-center space-y-6">
                  <div
                    className="w-16 h-16 rounded-2xl bg-[#081224] border border-cyan-300/20 flex items-center justify-center mx-auto"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle at 50% 35%, rgba(34,211,238,0.16), rgba(8,18,36,0.95) 75%)",
                    }}
                  >
                    <Icons.ShoppingBag className="w-7 h-7 text-cyan-300/80" />
                  </div>

                  <div className="space-y-2 max-w-md mx-auto">
                    <p className="typography-h3 text-white">Список заказа пока пуст</p>
                    <p className="text-sm text-slate-400 leading-relaxed text-pretty">
                      Добавьте нужные формулы из каталога — скидка −25% и готовый текст заявки сформируются
                      автоматически.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1">
                    <button
                      type="button"
                      onClick={handleGoToCatalog}
                      data-cart-empty-cta="true"
                      className="h-11 px-6 rounded-full inline-flex items-center justify-center gap-2 bg-cyan-400/18 hover:bg-cyan-400/28 border border-cyan-300/55 text-sm font-semibold text-white transition-colors active:scale-95 cursor-pointer"
                    >
                      <span>Перейти к формулам</span>
                      <Icons.ArrowRight className="w-4 h-4 text-cyan-300" />
                    </button>

                    <a
                      href={siteConfig.contact.telegram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-11 px-5 rounded-full inline-flex items-center justify-center gap-2 bg-white/[0.04] hover:bg-white/[0.09] border border-white/[0.1] text-sm font-medium text-slate-200 hover:text-white transition-colors"
                    >
                      <Icons.Telegram className="w-4 h-4 text-sky-400" />
                      <span>Помочь с выбором</span>
                    </a>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 sm:space-y-5">
                  {/* Items List */}
                  <ul ref={listRef} className="divide-y divide-white/[0.07]">
                    <AnimatePresence initial={false}>
                      {enrichedItems.map((item) => (
                        <motion.li
                          key={item.id}
                          ref={(el) => {
                            if (el) rowRefs.current.set(item.id, el);
                            else rowRefs.current.delete(item.id);
                          }}
                          layout={!isLow}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.96 }}
                          transition={{ duration: isLow ? 0.16 : 0.22, ease: [0.16, 1, 0.3, 1] }}
                          className="py-3 first:pt-0 flex items-center gap-3 sm:gap-4"
                        >
                          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#091326] border border-white/[0.08] flex items-center justify-center flex-shrink-0 p-1">
                            <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm sm:text-[15px] font-semibold text-white leading-snug line-clamp-2 sm:truncate">
                              {item.name}
                            </h4>
                            <div className="text-xs sm:text-sm tabular-nums mt-0.5 flex flex-wrap items-center gap-x-2.5 gap-y-0.5">
                              {item.priceRub > 0 && (
                                <span className="text-slate-200 font-medium">
                                  ≈ {formatRub(item.priceRub * item.quantity)}
                                </span>
                              )}
                              <span className="typography-mono text-xs text-slate-400">
                                {item.lp * item.quantity} LP
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            <button
                              type="button"
                              onClick={() => {
                                if (item.quantity <= 1) {
                                  handleRemoveWithDust(item.id);
                                } else {
                                  updateItemQuantity(item.id, item.quantity - 1);
                                }
                              }}
                              aria-label={`Уменьшить количество ${item.name}`}
                              className="w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/[0.14] border border-white/[0.09] flex items-center justify-center text-white transition-colors cursor-pointer active:scale-90"
                            >
                              <Icons.Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="text-sm font-semibold tabular-nums min-w-[1.5rem] text-center">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                              disabled={item.quantity >= MAX_QTY_PER_PRODUCT || totalItems >= MAX_TOTAL_CART_ITEMS}
                              aria-label={`Увеличить количество ${item.name}`}
                              className="w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/[0.14] border border-white/[0.09] flex items-center justify-center text-white transition-colors cursor-pointer active:scale-90 disabled:opacity-35 disabled:cursor-not-allowed"
                            >
                              <Icons.Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRemoveWithDust(item.id)}
                            aria-label={`Удалить ${item.name}`}
                            data-cart-remove={item.id}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 transition-colors cursor-pointer flex-shrink-0"
                          >
                            <Icons.Trash2 className="w-4 h-4" />
                          </button>
                        </motion.li>
                      ))}
                    </AnimatePresence>
                  </ul>

                  {/* Clean Totals Row (no misleading LP loyalty bar) */}
                  <div className="py-3.5 border-y border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <button
                      type="button"
                      onClick={handleClearWithDust}
                      data-cart-clear
                      className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-rose-400 transition-colors cursor-pointer whitespace-nowrap self-start sm:self-auto"
                    >
                      <Icons.Trash2 className="w-3.5 h-3.5" />
                      <span>Очистить список</span>
                    </button>

                    <div className="flex items-baseline justify-between sm:justify-end gap-3">
                      <span className="text-xs uppercase tracking-[0.16em] text-slate-400">Итого:</span>
                      <div className="flex items-baseline gap-2.5 flex-wrap justify-end">
                        {totalRub > 0 && (
                          <span
                            data-cart-total-rub
                            className="font-heading text-xl sm:text-2xl font-bold text-white tabular-nums"
                          >
                            ≈ {formatRub(totalRub)}
                          </span>
                        )}
                        {totalRetailRub > totalRub && (
                          <span
                            data-cart-total-retail
                            className="text-xs text-slate-500 line-through tabular-nums"
                          >
                            {formatRub(totalRetailRub)}
                          </span>
                        )}
                        <span
                          data-cart-total-lp
                          className="inline-flex items-center gap-1.5 typography-mono text-sm font-medium text-cyan-300/90 tabular-nums"
                        >
                          <span>· {totalLp} LP</span>
                          <LpInfoPopover
                            context="cart"
                            align="right"
                            placement="top"
                            onNavigateBefore={closeModal}
                          />
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* COMPACT MOSCOW WAREHOUSE ORDERING BLOCK (Clinical Obsidian Restraint) */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-[#080f1e] border border-white/[0.09] space-y-4">
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-xs uppercase tracking-[0.16em] text-cyan-400/90 font-semibold">
                          Официальный склад в Москве · СДЭК по РФ
                        </span>
                        <button
                          type="button"
                          onClick={handleCopyPartnerId}
                          data-cart-inline-id="true"
                          title="Нажмите, чтобы скопировать партнёрский ID"
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.09] text-xs text-slate-300 hover:text-white transition-colors cursor-pointer tabular-nums"
                        >
                          <span className="typography-mono">
                            {copiedId
                              ? `ID ${siteConfig.distributor.fourLifeId} скопирован`
                              : `ID ${siteConfig.distributor.fourLifeId} · Тощев А.`}
                          </span>
                          {copiedId ? (
                            <Icons.Check className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                          ) : (
                            <Icons.Copy className="w-3 h-3 text-slate-400 flex-shrink-0" />
                          )}
                        </button>
                      </div>

                      <h3 className="text-base sm:text-lg font-heading font-semibold text-white">
                        Отправить список на оформление
                      </h3>
                      <p className="text-sm text-slate-400 leading-relaxed text-pretty">
                        Менеджер склада РЦ 67 подтвердит наличие свежей партии, итоговую сумму со скидкой −25% и
                        доставку — партнёрский ID подставится автоматически.
                      </p>
                    </div>

                    {/* Inline Status Confirmation Banner */}
                    <AnimatePresence>
                      {actionNotice && (
                        <motion.div
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          role="status"
                          data-cart-action-notice="true"
                          className="px-3.5 py-2.5 rounded-xl bg-cyan-500/12 border border-cyan-400/35 text-xs sm:text-sm text-cyan-100 flex items-start gap-2 leading-relaxed"
                        >
                          <Icons.Check className="w-4 h-4 text-cyan-300 flex-shrink-0 mt-0.5" />
                          <span>{actionNotice}</span>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* 3 Unified Monochrome Obsidian Glass Messenger Buttons (Only Icons Carry Subtle Brand Color) */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <a
                        href={rc67WhatsAppUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-cart-whatsapp-rc67="true"
                        onClick={handleWhatsAppRc67Click}
                        className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white/[0.045] hover:bg-white/[0.095] border border-white/[0.1] hover:border-white/[0.22] text-white text-sm font-semibold transition-colors active:scale-[0.98]"
                      >
                        <Icons.WhatsApp className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        <span>WhatsApp</span>
                      </a>

                      <a
                        href={rc67TelegramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-cart-telegram-rc67="true"
                        onClick={handleTelegramRc67Click}
                        className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white/[0.045] hover:bg-white/[0.095] border border-white/[0.1] hover:border-white/[0.22] text-white text-sm font-semibold transition-colors active:scale-[0.98]"
                      >
                        <Icons.Telegram className="w-4 h-4 text-sky-400 flex-shrink-0" />
                        <span>Telegram</span>
                      </a>

                      <a
                        href={siteConfig.office.max}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-cart-max-rc67="true"
                        onClick={handleMaxRc67Click}
                        className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white/[0.045] hover:bg-white/[0.095] border border-white/[0.1] hover:border-white/[0.22] text-white text-sm font-semibold transition-colors active:scale-[0.98]"
                      >
                        <Icons.Max className="w-4 h-4 text-indigo-300 flex-shrink-0" />
                        <span>MAX</span>
                      </a>
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed text-pretty">
                      WhatsApp и Telegram подставляют список сразу (и дублируют в буфер). Для MAX текст копируется
                      автоматически — откройте чат по номеру{" "}
                      <span className="selectable-text text-slate-200 tabular-nums">{siteConfig.office.phone}</span> и
                      нажмите «Вставить».
                    </p>

                    {/* Compact Secondary Actions: Copy + Preview + Collapsible Desktop QR/Phone Bridge */}
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={handleCopyOrder}
                        data-cart-copy-order="true"
                        className={`flex-1 min-w-[200px] flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border text-sm font-medium transition-colors cursor-pointer active:scale-[0.99] ${
                          copiedOrder
                            ? "bg-emerald-500/15 border-emerald-400/45 text-emerald-200"
                            : "bg-white/[0.05] hover:bg-white/[0.09] border-white/[0.1] text-slate-100"
                        }`}
                      >
                        {copiedOrder ? (
                          <>
                            <Icons.Check className="w-4 h-4 text-emerald-400" />
                            <span>Текст заказа скопирован</span>
                          </>
                        ) : (
                          <>
                            <Icons.Copy className="w-4 h-4 text-cyan-400" />
                            <span>Скопировать заказ</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => setShowReceiptPreview((prev) => !prev)}
                        aria-expanded={showReceiptPreview}
                        className="py-2.5 px-4 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.08] text-xs font-medium text-slate-300 hover:text-white transition-colors cursor-pointer whitespace-nowrap"
                      >
                        {showReceiptPreview ? "Скрыть текст" : "Проверить текст"}
                      </button>

                      <button
                        type="button"
                        onClick={() => setShowDesktopBridge((prev) => !prev)}
                        aria-expanded={showDesktopBridge}
                        data-cart-toggle-bridge="true"
                        className="hidden md:inline-flex items-center gap-1.5 py-2.5 px-4 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.08] text-xs font-medium text-slate-300 hover:text-white transition-colors cursor-pointer whitespace-nowrap"
                      >
                        <Icons.QrCode className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{showDesktopBridge ? "Скрыть QR / звонок" : "QR / Заказ звонком"}</span>
                      </button>
                    </div>

                    {showReceiptPreview && (
                      <pre className="selectable-text p-3.5 rounded-xl bg-[#040812] border border-white/[0.08] text-xs text-slate-300 whitespace-pre-wrap font-mono leading-relaxed select-all">
                        {rc67OrderText}
                      </pre>
                    )}

                    {/* MOBILE-ONLY DIRECT CALL CARD */}
                    <div className="md:hidden pt-3 border-t border-white/[0.08] space-y-2">
                      <a
                        href={`tel:${siteConfig.office.phoneRaw}`}
                        className="w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.12] text-sm font-semibold text-white transition-colors active:scale-[0.98]"
                      >
                        <Icons.Phone className="w-4 h-4 text-cyan-300 flex-shrink-0" />
                        <span className="selectable-text tabular-nums">
                          Позвонить на склад · {siteConfig.office.phone}
                        </span>
                      </a>
                      <p className="text-xs text-slate-400 text-center">
                        При звонке назовите ID{" "}
                        <span className="selectable-text text-slate-200 font-semibold tabular-nums">
                          {siteConfig.distributor.fourLifeId}
                        </span>{" "}
                        ({siteConfig.distributor.shortName})
                      </p>
                    </div>

                    {/* DESKTOP COLLAPSIBLE 2-COLUMN BRIDGE (QR + Direct Phone Order) */}
                    {showDesktopBridge && (
                      <div className="hidden md:grid grid-cols-2 gap-4 pt-3.5 border-t border-white/[0.08]">
                        <div className="p-4 rounded-xl bg-[#050a15] border border-white/[0.08] flex items-center gap-4">
                          {qrData && (
                            <div
                              className="bg-white p-2 rounded-xl flex-shrink-0 shadow-md"
                              aria-label="QR-код для отправки заказа в WhatsApp"
                            >
                              <svg
                                width="104"
                                height="104"
                                viewBox={`-3 -3 ${qrData.size + 6} ${qrData.size + 6}`}
                                shapeRendering="crispEdges"
                                role="img"
                                aria-label="QR-код заказа WhatsApp"
                                data-cart-qr-svg
                                data-qr-version={qrData.version}
                              >
                                <rect
                                  x="-3"
                                  y="-3"
                                  width={qrData.size + 6}
                                  height={qrData.size + 6}
                                  fill="#ffffff"
                                />
                                <path d={qrData.pathD} fill="#03050a" />
                              </svg>
                            </div>
                          )}
                          <div className="space-y-1.5">
                            <div className="inline-flex items-center gap-1.5 text-cyan-400">
                              <Icons.QrCode className="w-4 h-4" />
                              <span className="text-xs uppercase tracking-[0.14em] font-semibold">
                                Перенос на телефон
                              </span>
                            </div>
                            <p className="text-xs text-slate-300 leading-relaxed text-pretty">
                              Наведите камеру смартфона — готовый чек сразу откроется в WhatsApp.
                            </p>
                          </div>
                        </div>

                        <div className="p-4 rounded-xl bg-[#050a15] border border-white/[0.08] flex flex-col justify-between gap-2.5">
                          <div className="space-y-0.5">
                            <span className="text-xs text-slate-400 block">Заказ звонком на склад:</span>
                            <a
                              href={`tel:${siteConfig.office.phoneRaw}`}
                              className="selectable-text font-heading text-xl font-bold text-white hover:text-cyan-400 transition-colors tabular-nums block"
                            >
                              {siteConfig.office.phone}
                            </a>
                            <span className="text-xs text-slate-400 block">
                              Пн–Пт 10:00–20:00 · Сб 10:00–17:00 (МСК)
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={handleCopyPartnerId}
                            title="Нажмите, чтобы скопировать партнёрский ID"
                            className="w-full text-left p-2.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/16 border border-cyan-400/25 transition-colors flex items-center justify-between gap-2 cursor-pointer active:scale-[0.99]"
                          >
                            <div className="min-w-0">
                              <span className="text-xs text-cyan-300/90 block">Назовите при звонке:</span>
                              <span className="selectable-text font-heading text-sm font-bold text-white tabular-nums block truncate">
                                {copiedId
                                  ? `ID ${siteConfig.distributor.fourLifeId} скопирован`
                                  : `ID ${siteConfig.distributor.fourLifeId} (${siteConfig.distributor.shortName})`}
                              </span>
                            </div>
                            {copiedId ? (
                              <Icons.Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                            ) : (
                              <Icons.Copy className="w-3.5 h-3.5 text-cyan-300/80 flex-shrink-0" />
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Slim Personal Consultation Footer */}
                  <div className="pt-2 border-t border-white/[0.07] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm text-slate-400">
                    <span>Нужен совет по сочетанию или схеме приёма? Написать Александру:</span>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <a
                        href={alexWhatsAppUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.09] border border-white/[0.08] text-xs sm:text-sm text-slate-200 font-medium transition-colors"
                      >
                        <Icons.WhatsApp className="w-3.5 h-3.5 text-emerald-400" />
                        <span>WhatsApp</span>
                      </a>
                      <a
                        href={alexTelegramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={handleAlexTelegramClick}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.09] border border-white/[0.08] text-xs sm:text-sm text-slate-200 font-medium transition-colors"
                      >
                        <Icons.Telegram className="w-3.5 h-3.5 text-sky-400" />
                        <span>Telegram</span>
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </SmoothModalScroll>
              </motion.div>
            </div>
          )}
        </CartPresenceBridge>
      )}
    </AnimatePresence>,
    document.body,
  );
};

export default React.memo(ProductListModal);
