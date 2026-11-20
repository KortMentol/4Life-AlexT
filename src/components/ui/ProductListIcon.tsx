import { useProductList } from "@/hooks/useProductList";
import { siteConfig } from "@/site-config/site";
import { generateQrMatrix } from "@/utils/qrCodeSvg";
import { Icons } from "@/utils/icons";
import { Dialog, Transition } from "@headlessui/react";
import { motion } from "framer-motion";
import React, { Fragment, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { usePerformanceTier } from "@/hooks/usePerformanceTier";
import "./ProductListIcon.css";

interface ProductListIconProps {
  className?: string;
}

const copyText = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.setAttribute("aria-hidden", "true");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    const copied = document.execCommand("copy");
    textarea.remove();
    return copied;
  }
};

const OrderQr: React.FC<{ value: string }> = ({ value }) => {
  const matrix = useMemo(() => {
    try {
      return generateQrMatrix(value);
    } catch {
      return null;
    }
  }, [value]);

  const path = useMemo(() => {
    if (!matrix) return "";
    const segments: string[] = [];
    matrix.forEach((row, y) => {
      row.forEach((isDark, x) => {
        if (isDark) segments.push(`M${x + 4},${y + 4}h1v1h-1z`);
      });
    });
    return segments.join("");
  }, [matrix]);

  if (!matrix) {
    return <p className="max-w-xs text-sm leading-relaxed text-slate-500">Список слишком длинный для QR. Скопируйте текст заказа или отправьте его в WhatsApp.</p>;
  }

  const dimension = matrix.length + 8;
  return (
    <svg className="h-44 w-44 rounded-lg bg-white p-2" viewBox={`0 0 ${dimension} ${dimension}`} role="img" aria-label="QR-код для открытия готового заказа в WhatsApp">
      <rect width={dimension} height={dimension} fill="#fff" />
      <path d={path} fill="#03050a" shapeRendering="crispEdges" />
    </svg>
  );
};

const ProductListIcon: React.FC<ProductListIconProps> = ({ className }) => {
  const { items, removeFromList, updateItemQuantity, getTotalItems, clearList } = useProductList();
  const tier = usePerformanceTier();
  const [isOpen, setIsOpen] = useState(false);
  const [toast, setToast] = useState("");

  const totalLp = useMemo(() => items.reduce((total, item) => total + item.lp * item.quantity, 0), [items]);
  const orderText = useMemo(() => {
    const rows = items.map((item) => `• ${item.name} — ${item.quantity} шт. (${item.lp} LP/шт.; ${item.lp * item.quantity} LP)`);
    return [
      "Здравствуйте! Хочу оформить заказ в РЦ 67 (Москва):",
      "",
      ...rows,
      "",
      `Итого: ${totalLp} LP`,
      "",
      `Прошу проверить цену и условия по партнёрскому ID: ${siteConfig.distributor.fourLifeId} (${siteConfig.distributor.name}).`,
    ].join("\n");
  }, [items, totalLp]);
  const whatsappUrl = useMemo(
    () => `https://wa.me/${siteConfig.office.phoneRaw.replace(/\D/g, "")}?text=${encodeURIComponent(orderText)}`,
    [orderText],
  );

  useEffect(() => {
    window.dispatchEvent(new CustomEvent("modal-state-change", { detail: { isOpen } }));
    return () => {
      window.dispatchEvent(new CustomEvent("modal-state-change", { detail: { isOpen: false } }));
    };
  }, [isOpen]);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(""), 4200);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const handleCopyOrder = async () => {
    const copied = await copyText(orderText);
    setToast(copied ? "Заказ скопирован — вставьте его в чат склада." : "Не удалось скопировать. Выделите текст заказа вручную.");
  };

  const handleOpenTelegram = async () => {
    window.open(siteConfig.office.telegram, "_blank", "noopener,noreferrer");
    const copied = await copyText(orderText);
    setToast(copied ? "Заказ скопирован — вставьте его в чат склада." : "Открылся Telegram. Скопируйте текст заказа вручную.");
  };

  const handleOpenMax = async () => {
    window.open(siteConfig.office.max, "_blank", "noopener,noreferrer");
    const copied = await copyText(orderText);
    setToast(copied ? `Текст заказа скопирован. Отправьте его в MAX по номеру ${siteConfig.office.phone}.` : `Открылся MAX. Номер склада: ${siteConfig.office.phone}.`);
  };

  const handleConsultation = (messenger: "whatsapp" | "telegram") => {
    const baseUrl = messenger === "whatsapp" ? siteConfig.contact.whatsapp : siteConfig.contact.telegram;
    const separator = baseUrl.includes("?") ? "&" : "?";
    window.open(`${baseUrl}${separator}text=${encodeURIComponent(orderText)}`, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      <motion.button
        type="button"
        data-product-list-icon
        className={`product-list-icon relative rounded-full p-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${className ?? ""}`}
        onClick={() => setIsOpen(true)}
        whileTap={tier === "low" ? undefined : { scale: 0.96 }}
        aria-label={`Список заказа, ${getTotalItems()} товаров`}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
      >
        <Icons.ShoppingBag className="h-6 w-6 header-adaptive-text" aria-hidden="true" />
        {getTotalItems() > 0 ? (
          <span className="absolute -right-0.5 -top-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full border border-[#03050a] bg-cyan-400 px-1 text-[10px] font-bold tabular-nums text-[#03050a]">
            {getTotalItems()}
          </span>
        ) : null}
      </motion.button>

      <Transition show={isOpen} as={Fragment} appear>
        <Dialog as="div" className="relative z-[100]" onClose={() => setIsOpen(false)}>
          <Transition.Child as={Fragment} enter="ease-out duration-250" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 bg-black/80" aria-hidden="true" />
          </Transition.Child>
          <div className="fixed inset-0 overflow-y-auto overscroll-contain p-3 md:p-6" data-lenis-prevent>
            <div className="flex min-h-full items-center justify-center">
              <Transition.Child as={Fragment} enter="ease-out duration-250" enterFrom="opacity-0 translate-y-3 scale-[0.98]" enterTo="opacity-100 translate-y-0 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 translate-y-0 scale-100" leaveTo="opacity-0 translate-y-3 scale-[0.98]">
                <Dialog.Panel className="relative w-full max-w-5xl overflow-hidden rounded-3xl border border-white/[0.09] bg-[#050811] text-left text-white shadow-2xl">
                  <header className="flex items-start justify-between gap-5 border-b border-white/[0.08] px-5 py-5 md:px-8 md:py-7">
                    <div>
                      <Dialog.Title className="typography-h3 text-white">Ваш список заказа</Dialog.Title>
                      <p className="mt-2 text-sm text-slate-400">Партнёрский ID {siteConfig.distributor.fourLifeId} ({siteConfig.distributor.name}) приложен к сообщению.</p>
                      <p className="mt-1 text-xs leading-relaxed text-slate-500">Итоговую цену и право на скидку подтвердите у продавца до оплаты.</p>
                    </div>
                    <button type="button" onClick={() => setIsOpen(false)} className="rounded-full p-2 text-slate-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400" aria-label="Закрыть список заказа">
                      <Icons.X className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </header>

                  {items.length === 0 ? (
                    <div className="px-5 py-16 text-center md:px-8">
                      <Icons.ShoppingBag className="mx-auto h-8 w-8 text-slate-500" aria-hidden="true" />
                      <p className="typography-h3 mt-5 text-white">Список пока пуст</p>
                      <p className="mt-2 text-sm text-slate-400">Добавьте формулы из каталога — здесь появятся позиции и сумма LP.</p>
                      <Link to="/products" onClick={() => setIsOpen(false)} className="mt-6 inline-flex items-center gap-2 text-sm text-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400">
                        Открыть каталог <Icons.ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </Link>
                    </div>
                  ) : (
                    <>
                      <div className="max-h-[46dvh] overflow-y-auto px-5 md:px-8" data-lenis-prevent>
                        <ul className="divide-y divide-white/[0.08]">
                          {items.map((item) => (
                            <li key={item.id} className="flex items-center gap-3 py-4 md:gap-5">
                              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-white/[0.06] bg-[radial-gradient(circle_at_50%_55%,rgba(6,182,212,0.16),transparent_68%),#080d18] p-2">
                                <img src={item.image} alt="" className="h-full w-full object-contain" loading="lazy" decoding="async" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <h3 className="text-sm font-medium text-white md:text-base">{item.name}</h3>
                                <p className="mt-1 text-xs text-slate-400">{item.lp} LP / шт.</p>
                              </div>
                              <div className="flex items-center gap-2" role="group" aria-label={`Количество: ${item.quantity}`}>
                                <button type="button" onClick={() => updateItemQuantity(item.id, item.quantity - 1)} className="rounded-full border border-white/[0.12] p-2 text-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400" aria-label={`Уменьшить количество ${item.name}`}>
                                  <Icons.Minus className="h-3.5 w-3.5" aria-hidden="true" />
                                </button>
                                <span className="min-w-6 text-center font-mono text-sm tabular-nums text-white">{item.quantity}</span>
                                <button type="button" onClick={() => updateItemQuantity(item.id, item.quantity + 1)} className="rounded-full border border-white/[0.12] p-2 text-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400" aria-label={`Увеличить количество ${item.name}`}>
                                  <Icons.Plus className="h-3.5 w-3.5" aria-hidden="true" />
                                </button>
                              </div>
                              <button type="button" onClick={() => removeFromList(item.id)} className="rounded-full p-2 text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400" aria-label={`Удалить ${item.name}`}>
                                <Icons.Trash2 className="h-4 w-4" aria-hidden="true" />
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex flex-col gap-5 border-t border-white/[0.08] px-5 py-5 md:flex-row md:items-center md:justify-between md:px-8">
                        <div className="flex items-end gap-4">
                          <div>
                            <span className="typography-label text-slate-500">Итого</span>
                            <p className="mt-1 font-mono text-2xl tabular-nums text-white">{totalLp} <span className="text-sm text-slate-400">LP</span></p>
                          </div>
                          <button type="button" onClick={clearList} className="mb-1 text-xs text-slate-500 underline decoration-white/20 underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400">Очистить список</button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <button type="button" onClick={() => window.open(whatsappUrl, "_blank", "noopener,noreferrer")} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-cyan-400 px-5 text-sm font-semibold text-[#03050a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
                            <Icons.WhatsApp className="h-4 w-4" aria-hidden="true" /> WhatsApp РЦ 67
                          </button>
                          <button type="button" onClick={handleOpenTelegram} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/[0.12] px-5 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400">
                            <Icons.Telegram className="h-4 w-4" aria-hidden="true" /> Telegram
                          </button>
                          <button type="button" onClick={handleOpenMax} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/[0.12] px-5 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400">
                            <Icons.Max className="h-4 w-4" aria-hidden="true" /> MAX
                          </button>
                          <button type="button" onClick={handleCopyOrder} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/[0.12] px-4 text-sm text-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400" aria-label="Скопировать готовый текст заказа">
                            <Icons.Copy className="h-4 w-4" aria-hidden="true" /> <span className="sr-only md:not-sr-only">Скопировать</span>
                          </button>
                        </div>
                      </div>

                      <div className="hidden grid-cols-2 gap-4 border-t border-white/[0.08] px-8 py-6 md:grid">
                        <div className="flex flex-col justify-center border-r border-white/[0.08] pr-6">
                          <span className="typography-label text-slate-500">Заказ по телефону</span>
                          <a href={`tel:${siteConfig.office.phoneRaw}`} className="mt-3 font-heading text-2xl text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400">{siteConfig.office.phone}</a>
                          <p className="mt-3 text-sm leading-relaxed text-slate-400">Назовите сотруднику выбранные позиции и партнёрский ID {siteConfig.distributor.fourLifeId} ({siteConfig.distributor.name}).</p>
                        </div>
                        <div className="flex items-center justify-between gap-5 pl-2">
                          <div>
                            <span className="typography-label text-slate-500">Открыть заказ на телефоне</span>
                            <p className="mt-3 max-w-xs text-sm leading-relaxed text-slate-400">Наведите камеру смартфона — WhatsApp откроет готовый текст.</p>
                          </div>
                          <OrderQr value={whatsappUrl} />
                        </div>
                      </div>

                      <div className="flex flex-col gap-4 border-t border-white/[0.08] px-5 py-5 md:flex-row md:items-center md:justify-between md:px-8">
                        <div>
                          <span className="typography-label text-slate-500">Личная консультация</span>
                          <p className="mt-1 text-xs text-slate-400">Список будет приложен к сообщению Александру.</p>
                        </div>
                        <div className="flex gap-2">
                          <button type="button" onClick={() => handleConsultation("whatsapp")} className="rounded-full border border-white/[0.12] px-4 py-2.5 text-sm text-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400">WhatsApp</button>
                          <button type="button" onClick={() => handleConsultation("telegram")} className="rounded-full border border-white/[0.12] px-4 py-2.5 text-sm text-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400">Telegram</button>
                        </div>
                      </div>
                    </>
                  )}
                  <div className="px-5 pb-4 md:px-8">
                    <p className="text-xs leading-relaxed text-slate-500">БАДы не являются лекарством. Информация о продуктах не заменяет консультацию врача. LP — баллы из каталога, не цена в рублях.</p>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
          <div className="sr-only" role="status" aria-live="polite">{toast}</div>
          {toast ? <div className="fixed bottom-5 left-1/2 z-[110] -translate-x-1/2 rounded-full border border-white/[0.1] bg-[#080d18] px-5 py-3 text-sm text-white shadow-xl" aria-hidden="true">{toast}</div> : null}
        </Dialog>
      </Transition>
    </>
  );
};

export default ProductListIcon;
