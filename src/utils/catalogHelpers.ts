/**
 * @module src/utils/catalogHelpers.ts
 * @description Pure domain logic for catalog category grouping, Ambient Color Podium auras,
 * 4-slide media normalization, synergy programs with exact RC 67 RUB totals,
 * strict Russian city/region CDEK validation (90+ verified cities), and RC 67 receipt formatting.
 */

import type { DetailedProduct, GalleryItem } from "@/data/productsData";

export type CatalogFilterGroupId =
  | "all"
  | "immunity"
  | "energy"
  | "organs"
  | "digestion"
  | "sport";

export interface CatalogFilterGroup {
  id: CatalogFilterGroupId;
  label: string;
  categories: readonly string[];
}

export const CATALOG_FILTER_GROUPS: readonly CatalogFilterGroup[] = [
  {
    id: "all",
    label: "Все формулы",
    categories: [],
  },
  {
    id: "immunity",
    label: "Иммунитет и Защита",
    categories: ["Иммунитет", "Защита клеток"],
  },
  {
    id: "energy",
    label: "Энергия и Долголетие",
    categories: ["Энергия и тонус", "Активное долголетие", "Баланс и анти-стресс"],
  },
  {
    id: "organs",
    label: "Сердце, Мозг и Органы",
    categories: [
      "Сердце и сосуды",
      "Память и фокус",
      "Женское здоровье",
      "Мужское здоровье",
      "Красота и уход",
    ],
  },
  {
    id: "digestion",
    label: "Пищеварение и Детокс",
    categories: ["Пищеварение", "Детокс и очищение"],
  },
  {
    id: "sport",
    label: "Спорт и Метаболизм",
    categories: ["Спорт и фитнес", "Контроль веса"],
  },
];

export interface SynergyProgram {
  id: string;
  index: string;
  title: string;
  subtitle: string;
  description: string;
  synergyEffect: string;
  systemsCovered: readonly string[];
  productIds: readonly [string, string];
  totalLp: number;
  totalRub: number;
  accentColor: string;
}

export const SYNERGY_PROGRAMS: readonly SynergyProgram[] = [
  {
    id: "base-immune-intelligence",
    index: "01",
    title: "Базовый Иммунный Интеллект",
    subtitle: "Трай-Фактор Формула + Трансфер Фактор Плюс",
    description:
      "Проверенная пара на каждый день: Трай-Фактор помогает иммунитету точно распознавать угрозы, а Плюс усиливает защитный резерв в сезон простуд и высоких нагрузок.",
    synergyEffect: "Обучение иммунитета + рост активности защитных клеток (до 437%)",
    systemsCovered: ["Базовая защита", "Сезонный резерв", "Восстановление"],
    productIds: ["tf-trifactor", "tf-plus"],
    totalLp: 95,
    totalRub: 11200, // 4850 + 6350
    accentColor: "rgba(6, 182, 212, 0.22)",
  },
  {
    id: "cellular-reset-energy",
    index: "02",
    title: "Энергия и Устойчивость к Стрессу",
    subtitle: "Ренуво + Энерджи Гоу Стикс",
    description:
      "Поддержка организма при высоком темпе жизни: Ренуво помогает спокойнее переносить стресс и быстрее восстанавливаться, а Энерджи Гоу Стикс даёт ровную бодрость без резкого спада.",
    synergyEffect: "Защита от стресса + ровная энергия на 4–6 часов без спада",
    systemsCovered: ["Антистресс", "Ясность ума", "Ровный тонус"],
    productIds: ["renuvo", "energy-go-stix"],
    totalLp: 78, // 42 + 36
    totalRub: 10050, // 5500 + 4550
    accentColor: "rgba(245, 158, 11, 0.20)",
  },
  {
    id: "clean-microbiome-detox",
    index: "03",
    title: "Чистая Печень и Микрофлора ЖКТ",
    subtitle: "Пре/О Биотики + Супер Детокс",
    description:
      "Мягкая поддержка печени и восстановление баланса полезной микрофлоры кишечника — основы пищеварения, лёгкости и 70% иммунной защиты организма.",
    synergyEffect: "Поддержка печени + живая защита микрофлоры кишечника",
    systemsCovered: ["Печень и лёгкость", "Микрофлора ЖКТ (70% иммунитета)", "Усвоение нутриентов"],
    productIds: ["pre-o-biotics", "super-detox"],
    totalLp: 53,
    totalRub: 7350, // 4500 + 2850
    accentColor: "rgba(16, 185, 129, 0.20)",
  },
];

export type CatalogViewMode = "gallery" | "ledger";

export interface FlagshipSpotlightSpec {
  readonly productId: string;
  readonly index: string;
  readonly roleLabel: string;
  readonly headline: string;
  readonly mechanism: string;
  readonly protocol: string;
  readonly metricLabel: string;
  readonly metricValue: string;
  readonly accentGlow: string;
}

export const FLAGSHIP_SPOTLIGHT_SPECS: readonly FlagshipSpotlightSpec[] = [
  {
    productId: "tf-trifactor",
    index: "01",
    roleLabel: "Базовый интеллект",
    headline: "Трай-Фактор Формула",
    mechanism:
      "Тройной концентрат пептидов молозива, желтка и нанофракций обучает иммунные клетки распознавать угрозы и вовремя завершать реакцию без перегрузки.",
    protocol: "2 капсулы в день · курс 30 дней",
    metricLabel: "Концентрация ТФ",
    metricValue: "300 мг",
    accentGlow: "rgba(34, 211, 238, 0.24)",
  },
  {
    productId: "tf-plus",
    index: "02",
    roleLabel: "Максимальный отклик",
    headline: "Трансфер Фактор Плюс",
    mechanism:
      "Флагманский комплекс с матрицей Кордивант (кордицепс, шиитаке, майтаке, алоэ и цинк). Клинически изученное усиление активности NK-клеток.",
    protocol: "3 капсулы в день · усиленная фаза",
    metricLabel: "Активность NK-клеток",
    metricValue: "+437%",
    accentGlow: "rgba(56, 189, 248, 0.26)",
  },
  {
    productId: "renuvo",
    index: "03",
    roleLabel: "Клеточная адаптация",
    headline: "Трансфер Фактор Ренуво",
    mechanism:
      "Адаптогенная формула с ашвагандой, куркумином, ресвератролом и Трай-Фактором. Снижает физиологический износ при высоком темпе, стрессе и тренировках.",
    protocol: "4 капсулы в день · утро и вечер",
    metricLabel: "Адаптогенный фокус",
    metricValue: "120 капс.",
    accentGlow: "rgba(245, 158, 11, 0.22)",
  },
];

export function getCategoryGroupCounts(
  products: readonly DetailedProduct[],
): Record<CatalogFilterGroupId, number> {
  const counts: Record<CatalogFilterGroupId, number> = {
    all: products.length,
    immunity: 0,
    energy: 0,
    organs: 0,
    digestion: 0,
    sport: 0,
  };

  for (const group of CATALOG_FILTER_GROUPS) {
    if (group.id === "all") continue;
    counts[group.id] = products.filter((product) =>
      product.categories.some((cat) => group.categories.includes(cat)),
    ).length;
  }

  return counts;
}

export function formatRub(amount: number): string {
  const safe = Number.isFinite(amount) && amount > 0 ? Math.round(amount) : 0;
  return `${safe.toLocaleString("ru-RU")} ₽`;
}

/**
 * Estimates standard retail price (without −25% partner ID discount),
 * rounded cleanly to the nearest 50 RUB for calm editorial price framing.
 */
export function estimateRetailRub(discountedPriceRub: number): number {
  if (!Number.isFinite(discountedPriceRub) || discountedPriceRub <= 0) return 0;
  return Math.round(discountedPriceRub / 0.75 / 50) * 50;
}

/**
 * Compact pack size label for catalog cards (e.g. "90 капс.", "30 порций").
 */
export function formatPackSize(product: Pick<DetailedProduct, "capsules" | "servings">): string {
  if (typeof product.capsules === "number" && product.capsules > 0) {
    return `${product.capsules} капс.`;
  }
  if (typeof product.servings === "number" && product.servings > 0) {
    return `${product.servings} порций`;
  }
  return "";
}

/**
 * Blueprint 5: Ambient Color Podium aura lookup based on primary product category.
 */
export function getCategoryAura(categories: readonly string[]): string {
  const primary = categories[0] ?? "";

  if (primary === "Иммунитет" || primary === "Защита клеток") {
    return "rgba(6, 182, 212, 0.20)";
  }
  if (
    primary === "Энергия и тонус" ||
    primary === "Активное долголетие" ||
    primary === "Баланс и анти-стресс"
  ) {
    return "rgba(245, 158, 11, 0.18)";
  }
  if (primary === "Пищеварение" || primary === "Детокс и очищение") {
    return "rgba(16, 185, 129, 0.18)";
  }
  if (
    primary === "Сердце и сосуды" ||
    primary === "Женское здоровье" ||
    primary === "Красота и уход"
  ) {
    return "rgba(244, 63, 94, 0.18)";
  }
  if (
    primary === "Спорт и фитнес" ||
    primary === "Контроль веса" ||
    primary === "Мужское здоровье" ||
    primary === "Память и фокус"
  ) {
    return "rgba(59, 130, 246, 0.20)";
  }

  return "rgba(6, 182, 212, 0.20)";
}

/**
 * Filters products by semantic category group and instant search query.
 */
export function filterProducts(
  products: readonly DetailedProduct[],
  activeGroupId: CatalogFilterGroupId,
  searchQuery: string,
): DetailedProduct[] {
  const group = CATALOG_FILTER_GROUPS.find((g) => g.id === activeGroupId);
  const normalizedQuery = searchQuery.trim().toLowerCase();

  return products.filter((product) => {
    const matchesGroup =
      !group ||
      group.id === "all" ||
      product.categories.some((cat) => group.categories.includes(cat));

    if (!matchesGroup) return false;
    if (!normalizedQuery) return true;

    const haystack = [
      product.name,
      product.shortDescription,
      product.mainDescription,
      ...product.categories,
      ...product.mainSupport,
      ...product.keyIngredients,
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(normalizedQuery);
  });
}

const DEFAULT_FALLBACK_VIDEO = "https://www.w3schools.com/html/mov_bbb.mp4";
const DEFAULT_FALLBACK_PHOTO =
  "https://images.unsplash.com/photo-1576671081837-49000212a370?w=800&auto=format&fit=crop&q=80";

/**
 * Guarantees a strict 4-slot gallery structure for every product:
 * Slot 0: Original bottle image on Ambient Color Podium
 * Slot 1 & 2: Two atmospheric lifestyle/lab images from product.gallery
 * Slot 3: Product video item
 */
export function buildNormalizedGallery(product: DetailedProduct): GalleryItem[] {
  const raw = product.gallery ?? [];
  const rawImages = raw.filter((item) => item.type === "image");
  const rawVideo = raw.find((item) => item.type === "video");

  const slide0: GalleryItem = {
    type: "image",
    src: product.image,
    alt: product.name,
  };

  const slide1: GalleryItem = rawImages[0] ?? {
    type: "image",
    src: DEFAULT_FALLBACK_PHOTO,
    alt: `${product.name} — формула`,
  };

  const slide2: GalleryItem = rawImages[1] ?? rawImages[0] ?? {
    type: "image",
    src: DEFAULT_FALLBACK_PHOTO,
    alt: `${product.name} — детали`,
  };

  const slide3: GalleryItem = rawVideo ?? {
    type: "video",
    src: DEFAULT_FALLBACK_VIDEO,
    poster: slide1.src,
    alt: `Видео о продукте ${product.name}`,
  };

  return [slide0, slide1, slide2, slide3];
}

export interface OrderLineItem {
  name: string;
  quantity: number;
  lp: number;
  priceRub?: number;
}

export function calculateTotalLp(items: readonly OrderLineItem[]): number {
  return items.reduce((sum, item) => sum + item.lp * item.quantity, 0);
}

export function calculateTotalRub(items: readonly OrderLineItem[]): number {
  return items.reduce((sum, item) => sum + (item.priceRub ?? 0) * item.quantity, 0);
}

export interface LoyaltyProgress {
  readonly stage: "to50" | "to125" | "max";
  readonly percent: number;
  readonly remainingLp: number;
  readonly nextTargetLp: 50 | 125;
  readonly shortLabel: string;
  readonly detailLabel: string;
}

/**
 * Computes official 4Life Eurasia Loyalty Program LP progress milestones:
 * - 50 LP: Loyalty Program qualification (10–15% points cashback)
 * - 125 LP: Free "Product of the Month" bonus
 */
export function getLoyaltyProgress(totalLp: number): LoyaltyProgress {
  const safeLp = Number.isFinite(totalLp) && totalLp > 0 ? Math.floor(totalLp) : 0;

  if (safeLp < 50) {
    const remainingLp = 50 - safeLp;
    return {
      stage: "to50",
      percent: Math.min(100, Math.round((safeLp / 50) * 100)),
      remainingLp,
      nextTargetLp: 50,
      shortLabel: `Ещё ${remainingLp} LP до 50 LP`,
      detailLabel: `До Программы Лояльности (кэшбэк 10–15% баллами) осталось ${remainingLp} LP`,
    };
  }

  if (safeLp < 125) {
    const remainingLp = 125 - safeLp;
    return {
      stage: "to125",
      percent: Math.min(100, Math.round(((safeLp - 50) / 75) * 100)),
      remainingLp,
      nextTargetLp: 125,
      shortLabel: `50 LP ✓ · ещё ${remainingLp} LP до подарка`,
      detailLabel: `50 LP выполнено (кэшбэк 10–15%) · ещё ${remainingLp} LP до бесплатного «Продукта месяца»`,
    };
  }

  return {
    stage: "max",
    percent: 100,
    remainingLp: 0,
    nextTargetLp: 125,
    shortLabel: "125+ LP · Продукт месяца ✓",
    detailLabel: "Достигнут порог 125 LP — кэшбэк 15% баллами + бесплатный «Продукт месяца»",
  };
}

/**
 * Formats the structured RC 67 Moscow warehouse order message with automatic Partner ID 12299550
 * and approximate wholesale RUB total.
 */
export function buildRc67OrderMessage(
  items: readonly OrderLineItem[],
  partnerId: string = "12299550",
  distributorShortName: string = "Тощев Александр",
): string {
  const totalLp = calculateTotalLp(items);
  const totalRub = calculateTotalRub(items);
  const lines = items.map((item) => {
    const rubPart = item.priceRub ? ` • ≈ ${formatRub(item.priceRub * item.quantity)}` : "";
    return `• ${item.name} — ${item.quantity} шт. (${item.lp * item.quantity} LP${rubPart})`;
  });

  const totalLine =
    totalRub > 0
      ? `Итого: ${totalLp} LP (≈ ${formatRub(totalRub)} по прайсу склада РЦ 67 −25%)`
      : `Итого: ${totalLp} LP`;

  return [
    "Здравствуйте! Хочу оформить заказ в РЦ 67 (Москва):",
    ...lines,
    totalLine,
    "",
    `Прошу рассчитать со скидкой по партнёрскому ID: ${partnerId} (${distributorShortName}).`,
  ].join("\n");
}

function compactProductLabel(name: string): string {
  return name
    .replace(/^Трансфер Фактор\s+/i, "ТФ ")
    .replace(/\s+Формула$/i, "")
    .replace(/^4Life\s+/i, "")
    .trim();
}

/**
 * Formats a compact RC 67 order message tailored for instant smartphone QR scanning.
 * Keeps total UTF-8 percent-encoded WhatsApp URL strictly <= 225 bytes (QR Version 5–9).
 */
export function buildCompactQrOrderMessage(
  items: readonly OrderLineItem[],
  partnerId: string = "12299550",
  _distributorCompactName: string = "Тощев А.",
): string {
  const totalLp = calculateTotalLp(items);
  const header = `РЦ67 ID ${partnerId}:`;
  const footer = `Итого ${totalLp} LP`;

  const MAX_URL_BYTES = 225;
  const basePrefixLen = "https://wa.me/79296811022?text=".length;

  const chosenLines: string[] = [];
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (!item) continue;
    const candidateLine = `- ${compactProductLabel(item.name)} x${item.quantity}`;
    const remaining = items.length - (i + 1);
    const tail = remaining > 0 ? [`+${remaining}`, footer] : [footer];
    const draft = [header, ...chosenLines, candidateLine, ...tail].join("\n");
    const encodedLen = basePrefixLen + encodeURIComponent(draft).length;

    if (encodedLen <= MAX_URL_BYTES) {
      chosenLines.push(candidateLine);
    } else if (chosenLines.length === 0) {
      const shortName = compactProductLabel(item.name).slice(0, 12);
      chosenLines.push(`- ${shortName} x${item.quantity}`);
      if (remaining > 0) chosenLines.push(`+${remaining}`);
      break;
    } else {
      chosenLines.push(`+${items.length - i}`);
      break;
    }
  }

  return [header, ...chosenLines, footer].join("\n");
}

export function buildCompactQrWhatsAppUrl(
  items: readonly OrderLineItem[],
  phoneDigits: string = "79296811022",
  partnerId: string = "12299550",
): string {
  const compactText = buildCompactQrOrderMessage(items, partnerId);
  return `https://wa.me/${phoneDigits}?text=${encodeURIComponent(compactText)}`;
}

/**
 * Builds an official Telegram deep link (`https://t.me/+phone?text=...`) with pre-filled draft text.
 * Supported by Telegram mobile & desktop clients when recipient phone lookup is permitted.
 */
export function buildTelegramOrderUrl(baseTelegramUrl: string, message: string): string {
  const cleanBase = baseTelegramUrl.trim().replace(/[?&]+$/, "");
  const trimmedMessage = message.trim();
  if (!trimmedMessage) return cleanBase;
  const separator = cleanBase.includes("?") ? "&" : "?";
  return `${cleanBase}${separator}text=${encodeURIComponent(trimmedMessage)}`;
}

export function buildConsultationMessage(items: readonly OrderLineItem[]): string {
  if (items.length === 0) {
    return "Здравствуйте, Александр! Нужна персональная консультация по подбору формул 4Life и схеме приёма.";
  }
  const totalLp = calculateTotalLp(items);
  const totalRub = calculateTotalRub(items);
  const lines = items.map(
    (item) => `• ${item.name} — ${item.quantity} шт. (${item.lp * item.quantity} LP)`,
  );

  const totalLine =
    totalRub > 0 ? `Итого: ${totalLp} LP (≈ ${formatRub(totalRub)})` : `Итого: ${totalLp} LP`;

  return [
    "Здравствуйте, Александр! Нужна ваша консультация по выбору и схеме приёма для этого списка:",
    ...lines,
    totalLine,
  ].join("\n");
}

// ============================================================================
// STRICT RUSSIAN CITY / REGION CDEK VALIDATION (ZERO FAKE "г. Фывапрол" BUG)
// ============================================================================

export interface RussianCityEtaResult {
  isRecognized: boolean;
  city: string;
  eta: string;
  corridor: string;
  regionLabel: string;
  fallbackNotice?: string;
}

export const POPULAR_RUSSIAN_CITIES: readonly Omit<RussianCityEtaResult, "isRecognized">[] = [
  { city: "Санкт-Петербург", eta: "1–2 дня", corridor: "Северо-Запад • ПВЗ и курьер", regionLabel: "Центр и СЗФО" },
  { city: "Омск", eta: "3–4 дня", corridor: "Сибирь • ПВЗ и курьер", regionLabel: "Западная Сибирь" },
  { city: "Екатеринбург", eta: "2–3 дня", corridor: "Урал • ПВЗ и курьер", regionLabel: "Уральский округ" },
  { city: "Новосибирск", eta: "3–4 дня", corridor: "Сибирь • ПВЗ и курьер", regionLabel: "Сибирский округ" },
  { city: "Казань", eta: "2–3 дня", corridor: "Поволжье • ПВЗ и курьер", regionLabel: "Приволжский округ" },
  { city: "Краснодар", eta: "2–3 дня", corridor: "Юг РФ • ПВЗ и курьер", regionLabel: "Южный округ" },
  { city: "Сочи", eta: "2–3 дня", corridor: "Черноморское побережье • ПВЗ", regionLabel: "Южный округ" },
  { city: "Ростов-на-Дону", eta: "2–3 дня", corridor: "Юг РФ • ПВЗ и курьер", regionLabel: "Южный округ" },
  { city: "Самара", eta: "2–3 дня", corridor: "Поволжье • ПВЗ и курьер", regionLabel: "Приволжский округ" },
  { city: "Нижний Новгород", eta: "1–2 дня", corridor: "Центр / Поволжье • ПВЗ", regionLabel: "Приволжский округ" },
  { city: "Красноярск", eta: "3–5 дней", corridor: "Восточная Сибирь • ПВЗ", regionLabel: "Сибирский округ" },
  { city: "Уфа", eta: "2–3 дня", corridor: "Урал / Поволжье • ПВЗ", regionLabel: "Приволжский округ" },
  { city: "Воронеж", eta: "1–2 дня", corridor: "Центральный ФО • ПВЗ", regionLabel: "Центральный округ" },
  { city: "Пермь", eta: "2–4 дня", corridor: "Урал • ПВЗ и курьер", regionLabel: "Приволжский округ" },
  { city: "Тюмень", eta: "3–4 дня", corridor: "Западная Сибирь • ПВЗ", regionLabel: "Уральский округ" },
  { city: "Иркутск", eta: "4–5 дней", corridor: "Восточная Сибирь • Авиа СДЭК", regionLabel: "Сибирский округ" },
  { city: "Улан-Удэ", eta: "4–6 дней", corridor: "Байкал / ДФО • Авиа СДЭК", regionLabel: "Дальневосточный округ" },
  { city: "Хабаровск", eta: "4–6 дней", corridor: "Дальний Восток • Авиа СДЭК", regionLabel: "Дальневосточный округ" },
  { city: "Владивосток", eta: "5–6 дней", corridor: "Приморье • Авиа СДЭК", regionLabel: "Дальневосточный округ" },
  { city: "Калининград", eta: "3–5 дней", corridor: "Авиа СДЭК • ПВЗ и курьер", regionLabel: "Северо-Западный округ" },
] as const;

interface CityZoneEntry {
  canonical: string;
  aliases: readonly string[];
  eta: string;
  corridor: string;
  regionLabel: string;
}

const EXTENDED_RUSSIAN_CITIES: readonly CityZoneEntry[] = [
  // Moscow & MO
  { canonical: "Москва", aliases: ["москва", "мск", "зеленоград", "химки", "мытищи", "подольск", "балашиха", "королёв", "королев", "одинцово", "красногорск", "люберцы", "домодедово", "серпухов", "коломна", "дубна"], eta: "В день заказа", corridor: "Москва и МО • Самовывоз РЦ 67 / курьер", regionLabel: "Московский регион" },
  // Center & NWFO (1–2 days)
  { canonical: "Тверь", aliases: ["тверь"], eta: "1–2 дня", corridor: "Центральный ФО • ПВЗ и курьер", regionLabel: "Центральный округ" },
  { canonical: "Тула", aliases: ["тула"], eta: "1–2 дня", corridor: "Центральный ФО • ПВЗ и курьер", regionLabel: "Центральный округ" },
  { canonical: "Калуга", aliases: ["калуга", "обнинск"], eta: "1–2 дня", corridor: "Центральный ФО • ПВЗ и курьер", regionLabel: "Центральный округ" },
  { canonical: "Рязань", aliases: ["рязань"], eta: "1–2 дня", corridor: "Центральный ФО • ПВЗ и курьер", regionLabel: "Центральный округ" },
  { canonical: "Ярославль", aliases: ["ярославль", "рыбинск"], eta: "1–2 дня", corridor: "Центральный ФО • ПВЗ и курьер", regionLabel: "Центральный округ" },
  { canonical: "Владимир", aliases: ["владимир", "муром", "ковров"], eta: "1–2 дня", corridor: "Центральный ФО • ПВЗ и курьер", regionLabel: "Центральный округ" },
  { canonical: "Смоленск", aliases: ["смоленск"], eta: "1–2 дня", corridor: "Центральный ФО • ПВЗ и курьер", regionLabel: "Центральный округ" },
  { canonical: "Брянск", aliases: ["брянск"], eta: "1–2 дня", corridor: "Центральный ФО • ПВЗ и курьер", regionLabel: "Центральный округ" },
  { canonical: "Курск", aliases: ["курск"], eta: "1–2 дня", corridor: "Центральный ФО • ПВЗ и курьер", regionLabel: "Центральный округ" },
  { canonical: "Орёл", aliases: ["орёл", "орел"], eta: "1–2 дня", corridor: "Центральный ФО • ПВЗ и курьер", regionLabel: "Центральный округ" },
  { canonical: "Липецк", aliases: ["липецк", "елец"], eta: "1–2 дня", corridor: "Центральный ФО • ПВЗ и курьер", regionLabel: "Центральный округ" },
  { canonical: "Белгород", aliases: ["белгород", "старый оскол"], eta: "1–2 дня", corridor: "Центральный ФО • ПВЗ и курьер", regionLabel: "Центральный округ" },
  { canonical: "Иваново", aliases: ["иваново"], eta: "1–2 дня", corridor: "Центральный ФО • ПВЗ и курьер", regionLabel: "Центральный округ" },
  { canonical: "Кострома", aliases: ["кострома"], eta: "1–2 дня", corridor: "Центральный ФО • ПВЗ и курьер", regionLabel: "Центральный округ" },
  { canonical: "Тамбов", aliases: ["тамбов"], eta: "1–2 дня", corridor: "Центральный ФО • ПВЗ и курьер", regionLabel: "Центральный округ" },
  { canonical: "Псков", aliases: ["псков"], eta: "1–2 дня", corridor: "СЗФО • ПВЗ и курьер", regionLabel: "Северо-Западный округ" },
  { canonical: "Великий Новгород", aliases: ["великий новгород", "новгород"], eta: "1–2 дня", corridor: "СЗФО • ПВЗ и курьер", regionLabel: "Северо-Западный округ" },
  { canonical: "Вологда", aliases: ["вологда", "череповец"], eta: "1–2 дня", corridor: "СЗФО • ПВЗ и курьер", regionLabel: "Северо-Западный округ" },
  { canonical: "Петрозаводск", aliases: ["петрозаводск", "карелия"], eta: "2–3 дня", corridor: "СЗФО • ПВЗ и курьер", regionLabel: "Северо-Западный округ" },
  { canonical: "Мурманск", aliases: ["мурманск"], eta: "2–4 дня", corridor: "СЗФО • ПВЗ и курьер", regionLabel: "Северо-Западный округ" },
  { canonical: "Архангельск", aliases: ["архангельск", "северодвинск"], eta: "2–3 дня", corridor: "СЗФО • ПВЗ и курьер", regionLabel: "Северо-Западный округ" },
  { canonical: "Сыктывкар", aliases: ["сыктывкар", "ухта", "коми"], eta: "2–4 дня", corridor: "СЗФО • ПВЗ и курьер", regionLabel: "Северо-Западный округ" },
  // Volga & South (2–3 days)
  { canonical: "Анапа", aliases: ["анапа"], eta: "2–3 дня", corridor: "Юг РФ • ПВЗ и курьер", regionLabel: "Южный округ" },
  { canonical: "Геленджик", aliases: ["геленджик"], eta: "2–3 дня", corridor: "Юг РФ • ПВЗ и курьер", regionLabel: "Южный округ" },
  { canonical: "Новороссийск", aliases: ["новороссийск"], eta: "2–3 дня", corridor: "Юг РФ • ПВЗ и курьер", regionLabel: "Южный округ" },
  { canonical: "Ставрополь", aliases: ["ставрополь"], eta: "2–3 дня", corridor: "СКФО • ПВЗ и курьер", regionLabel: "Северный Кавказ" },
  { canonical: "Пятигорск", aliases: ["пятигорск", "кисловодск", "ессентуки", "минеральные воды"], eta: "2–3 дня", corridor: "КМВ • ПВЗ и курьер", regionLabel: "Северный Кавказ" },
  { canonical: "Волгоград", aliases: ["волгоград", "волжский"], eta: "2–3 дня", corridor: "Юг РФ • ПВЗ и курьер", regionLabel: "Южный округ" },
  { canonical: "Астрахань", aliases: ["астрахань"], eta: "2–3 дня", corridor: "Юг РФ • ПВЗ и курьер", regionLabel: "Южный округ" },
  { canonical: "Саратов", aliases: ["саратов", "энгельс"], eta: "2–3 дня", corridor: "Поволжье • ПВЗ и курьер", regionLabel: "Приволжский округ" },
  { canonical: "Пенза", aliases: ["пенза"], eta: "2–3 дня", corridor: "Поволжье • ПВЗ и курьер", regionLabel: "Приволжский округ" },
  { canonical: "Ульяновск", aliases: ["ульяновск", "димитровград"], eta: "2–3 дня", corridor: "Поволжье • ПВЗ и курьер", regionLabel: "Приволжский округ" },
  { canonical: "Тольятти", aliases: ["тольятти", "сызрань"], eta: "2–3 дня", corridor: "Поволжье • ПВЗ и курьер", regionLabel: "Приволжский округ" },
  { canonical: "Оренбург", aliases: ["оренбург", "орск"], eta: "2–4 дня", corridor: "Поволжье / Урал • ПВЗ", regionLabel: "Приволжский округ" },
  { canonical: "Ижевск", aliases: ["ижевск", "удмуртия"], eta: "2–3 дня", corridor: "Поволжье • ПВЗ и курьер", regionLabel: "Приволжский округ" },
  { canonical: "Киров", aliases: ["киров"], eta: "2–3 дня", corridor: "Поволжье • ПВЗ и курьер", regionLabel: "Приволжский округ" },
  { canonical: "Чебоксары", aliases: ["чебоксары", "чувашия"], eta: "2–3 дня", corridor: "Поволжье • ПВЗ и курьер", regionLabel: "Приволжский округ" },
  { canonical: "Йошкар-Ола", aliases: ["йошкар-ола", "йошкар ола"], eta: "2–3 дня", corridor: "Поволжье • ПВЗ и курьер", regionLabel: "Приволжский округ" },
  { canonical: "Саранск", aliases: ["саранск", "мордовия"], eta: "2–3 дня", corridor: "Поволжье • ПВЗ и курьер", regionLabel: "Приволжский округ" },
  { canonical: "Набережные Челны", aliases: ["набережные челны", "челны", "нижнекамск", "альметьевск"], eta: "2–3 дня", corridor: "Татарстан • ПВЗ и курьер", regionLabel: "Приволжский округ" },
  { canonical: "Махачкала", aliases: ["махачкала", "дербент", "каспийск", "дагестан"], eta: "2–4 дня", corridor: "СКФО • ПВЗ и курьер", regionLabel: "Северный Кавказ" },
  { canonical: "Грозный", aliases: ["грозный"], eta: "2–4 дня", corridor: "СКФО • ПВЗ и курьер", regionLabel: "Северный Кавказ" },
  { canonical: "Нальчик", aliases: ["нальчик"], eta: "2–4 дня", corridor: "СКФО • ПВЗ и курьер", regionLabel: "Северный Кавказ" },
  { canonical: "Владикавказ", aliases: ["владикавказ"], eta: "2–4 дня", corridor: "СКФО • ПВЗ и курьер", regionLabel: "Северный Кавказ" },
  { canonical: "Симферополь", aliases: ["симферополь", "ялта", "керчь", "евпатория", "крым"], eta: "3–4 дня", corridor: "Крым • ПВЗ и курьер", regionLabel: "Южный округ" },
  { canonical: "Севастополь", aliases: ["севастополь"], eta: "3–4 дня", corridor: "Крым • ПВЗ и курьер", regionLabel: "Южный округ" },
  { canonical: "Таганрог", aliases: ["таганрог", "шахты", "новочеркасск"], eta: "2–3 дня", corridor: "Юг РФ • ПВЗ и курьер", regionLabel: "Южный округ" },
  // Ural & Siberia (3–4 days)
  { canonical: "Челябинск", aliases: ["челябинск", "миасс", "златоуст"], eta: "2–3 дня", corridor: "Урал • ПВЗ и курьер", regionLabel: "Уральский округ" },
  { canonical: "Магнитогорск", aliases: ["магнитогорск"], eta: "3–4 дня", corridor: "Урал • ПВЗ и курьер", regionLabel: "Уральский округ" },
  { canonical: "Курган", aliases: ["курган"], eta: "3–4 дня", corridor: "Урал • ПВЗ и курьер", regionLabel: "Уральский округ" },
  { canonical: "Сургут", aliases: ["сургут"], eta: "3–4 дня", corridor: "ХМАО • ПВЗ и курьер", regionLabel: "Уральский округ" },
  { canonical: "Нижневартовск", aliases: ["нижневартовск", "нефтеюганск"], eta: "3–5 дней", corridor: "ХМАО • ПВЗ и курьер", regionLabel: "Уральский округ" },
  { canonical: "Ханты-Мансийск", aliases: ["ханты-мансийск", "ханты мансийск"], eta: "3–5 дней", corridor: "ХМАО • ПВЗ и курьер", regionLabel: "Уральский округ" },
  { canonical: "Новый Уренгой", aliases: ["новый уренгой", "ноябрьск", "салехард"], eta: "4–5 дней", corridor: "ЯНАО • Авиа СДЭК", regionLabel: "Уральский округ" },
  { canonical: "Томск", aliases: ["томск", "северск"], eta: "3–4 дня", corridor: "Западная Сибирь • ПВЗ", regionLabel: "Сибирский округ" },
  { canonical: "Кемерово", aliases: ["кемерово", "кузбасс"], eta: "3–4 дня", corridor: "Сибирь • ПВЗ и курьер", regionLabel: "Сибирский округ" },
  { canonical: "Новокузнецк", aliases: ["новокузнецк", "прокопьевск"], eta: "3–4 дня", corridor: "Сибирь • ПВЗ и курьер", regionLabel: "Сибирский округ" },
  { canonical: "Барнаул", aliases: ["барнаул", "бийск", "алтай", "горно-алтайск"], eta: "3–4 дня", corridor: "Алтай • ПВЗ и курьер", regionLabel: "Сибирский округ" },
  { canonical: "Абакан", aliases: ["абакан", "хакасия", "кызыл"], eta: "3–5 дней", corridor: "Южная Сибирь • ПВЗ", regionLabel: "Сибирский округ" },
  { canonical: "Братск", aliases: ["братск", "ангарск"], eta: "4–5 дней", corridor: "Восточная Сибирь • Авиа СДЭК", regionLabel: "Сибирский округ" },
  { canonical: "Норильск", aliases: ["норильск"], eta: "5–7 дней", corridor: "Крайний Север • Авиа СДЭК", regionLabel: "Сибирский округ" },
  { canonical: "Стерлитамак", aliases: ["стерлитамак", "салават", "нефтекамск"], eta: "2–3 дня", corridor: "Башкортостан • ПВЗ", regionLabel: "Приволжский округ" },
  { canonical: "Нижний Тагил", aliases: ["нижний тагил", "каменск-уральский"], eta: "2–3 дня", corridor: "Урал • ПВЗ и курьер", regionLabel: "Уральский округ" },
  // Far East (4–6 days)
  { canonical: "Чита", aliases: ["чита", "забайкалье"], eta: "4–6 дней", corridor: "Забайкалье • Авиа СДЭК", regionLabel: "Дальневосточный округ" },
  { canonical: "Благовещенск", aliases: ["благовещенск"], eta: "4–6 дней", corridor: "Приамурье • Авиа СДЭК", regionLabel: "Дальневосточный округ" },
  { canonical: "Якутск", aliases: ["якутск", "якутия"], eta: "5–7 дней", corridor: "Якутия • Авиа СДЭК", regionLabel: "Дальневосточный округ" },
  { canonical: "Магадан", aliases: ["магадан"], eta: "5–7 дней", corridor: "Колыма • Авиа СДЭК", regionLabel: "Дальневосточный округ" },
  { canonical: "Южно-Сахалинск", aliases: ["южно-сахалинск", "сахалин"], eta: "5–7 дней", corridor: "Сахалин • Авиа СДЭК", regionLabel: "Дальневосточный округ" },
  { canonical: "Петропавловск-Камчатский", aliases: ["петропавловск-камчатский", "камчатка"], eta: "5–7 дней", corridor: "Камчатка • Авиа СДЭК", regionLabel: "Дальневосточный округ" },
  { canonical: "Комсомольск-на-Амуре", aliases: ["комсомольск-на-амуре", "комсомольск"], eta: "5–6 дней", corridor: "Дальний Восток • Авиа СДЭК", regionLabel: "Дальневосточный округ" },
  { canonical: "Находка", aliases: ["находка", "уссурийск", "артём", "артем"], eta: "5–6 дней", corridor: "Приморье • Авиа СДЭК", regionLabel: "Дальневосточный округ" },
  { canonical: "Биробиджан", aliases: ["биробиджан"], eta: "4–6 дней", corridor: "Дальний Восток • Авиа СДЭК", regionLabel: "Дальневосточный округ" },
] as const;

export const UNRECOGNIZED_CITY_NOTICE =
  "Город не найден в быстрой базе — менеджер РЦ 67 рассчитает доставку СДЭК/Почтой РФ индивидуально по вашему индексу";

/**
 * Validates Russian city input against 90+ verified cities & regions.
 * Never fabricates fake ETAs for gibberish ("Фывапрол", "Марс", random numbers).
 */
export function resolveRussianCityEta(rawQuery: string): RussianCityEtaResult {
  const cleaned = rawQuery.trim().replace(/^г\.\s*/i, "");
  if (!cleaned) {
    return { isRecognized: true, ...POPULAR_RUSSIAN_CITIES[1]! }; // Default showcase: Omsk
  }

  const lower = cleaned.toLowerCase();

  // Require at least 2 characters for prefix/contains matching so single-letter noise doesn't false-match
  if (lower.length < 2) {
    return {
      isRecognized: false,
      city: cleaned,
      eta: "По запросу",
      corridor: "Индивидуальный расчёт СДЭК / Почта РФ",
      regionLabel: "Расчёт по почтовому индексу",
      fallbackNotice: UNRECOGNIZED_CITY_NOTICE,
    };
  }

  // 1. Exact or prefix match in POPULAR_RUSSIAN_CITIES
  const popMatch =
    POPULAR_RUSSIAN_CITIES.find((c) => c.city.toLowerCase() === lower) ??
    (lower.length >= 3 ? POPULAR_RUSSIAN_CITIES.find((c) => c.city.toLowerCase().startsWith(lower)) : undefined);

  if (popMatch) {
    return { isRecognized: true, ...popMatch };
  }

  // 2. Match in EXTENDED_RUSSIAN_CITIES (exact or prefix >= 3 chars)
  const extMatch =
    EXTENDED_RUSSIAN_CITIES.find(
      (entry) =>
        entry.canonical.toLowerCase() === lower ||
        entry.aliases.some((alias) => alias === lower),
    ) ??
    (lower.length >= 3
      ? EXTENDED_RUSSIAN_CITIES.find(
          (entry) =>
            entry.canonical.toLowerCase().startsWith(lower) ||
            entry.aliases.some((alias) => alias.startsWith(lower)),
        )
      : undefined);

  if (extMatch) {
    return {
      isRecognized: true,
      city: extMatch.canonical,
      eta: extMatch.eta,
      corridor: extMatch.corridor,
      regionLabel: extMatch.regionLabel,
    };
  }

  // 3. Honest fallback — never pretend gibberish is a real Russian city
  return {
    isRecognized: false,
    city: cleaned,
    eta: "По запросу",
    corridor: "Индивидуальный расчёт СДЭК / Почта РФ",
    regionLabel: "Расчёт по почтовому индексу",
    fallbackNotice: UNRECOGNIZED_CITY_NOTICE,
  };
}
