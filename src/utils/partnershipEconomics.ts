/**
 * @module src/utils/partnershipEconomics.ts
 * @description Pure deterministic calculation engine for the official 4Life Life Rewards Plan
 * in Russia & Eurasia (eurasia.4life.com, verified November 2026):
 *  - Rapid Rewards: 25% of first-order LP of personally enrolled customers/partners
 *  - Personal excess cashback (> 100 LP): 20%
 *  - Unilevel repeat orders: L1 = 2%, L2 = 12%, L3 = 5%
 *  - Generations (Infinity L4+): Gen 4 = 6% (Diamond) / 12% (Presidential+), Gen 5–6 = 3%, Gen 7–10 = 2%
 *  - Builder Bonus ($50 / $200 / $800):
 *      - Mandatory base rule: personalLp >= 100 AND Team Volume (TV = personal + L1) >= 600 LP AND L1 >= 3
 *      - Tier 1 ($50): Base rule
 *      - Tier 2 ($200): Base + L2 >= 9 AND L2 volume >= 900 LP
 *      - Tier 3 ($800): Base + Tier 2 + L3 >= 27 AND L3 volume >= 2,700 LP
 *  - Loyalty Program RF 2026: 10% (mo 1–3) -> 12% (mo 4–12) -> 15% (mo 13+), cap 150 BL/mo + Bonus Product >= 125 LP
 * Zero React/DOM dependencies — directly unit-testable via `node:test`.
 */

export type PartnershipRank =
  | "Associate"
  | "Builder"
  | "Builder Elite"
  | "Diamond"
  | "Presidential Diamond"
  | "Bronze / Silver International"
  | "Gold / Platinum International";

export interface PartnershipScenarioInput {
  /** Monthly personal LP volume (e.g., 100..500 LP) */
  personalLp: number;
  /** Monthly new customer/partner first-order LP volume (Rapid Rewards 25%) */
  newOrdersLp: number;
  /** Active qualifying partners on Level 1 (2%) */
  level1Partners: number;
  /** Active qualifying partners on Level 2 (12%) */
  level2Partners: number;
  /** Active qualifying partners on Level 3 (5%) */
  level3Partners: number;
  /** Active qualifying partners on Level 4+ deep generations */
  level4PlusPartners?: number;
  /** Average monthly LP per active partner (defaults to 100 LP) */
  avgPartnerLp?: number;
  /** Illustrative USD -> RUB conversion rate (defaults to 95 ₽/$1) */
  usdToRubRate?: number;
}

export interface PartnershipEconomicsResult {
  rapidRewardsUsd: number;
  personalCashbackUsd: number;
  level1IncomeUsd: number;
  level2IncomeUsd: number;
  level3IncomeUsd: number;
  level4PlusIncomeUsd: number;
  premierPoolUsd: number;
  builderBonusUsd: number;
  builderBonusTier: 0 | 1 | 2 | 3;
  loyaltyPointsEarned: number;
  teamVolumeLp: number;
  l3VolumeLp: number;
  totalPartners: number;
  totalOrgLp: number;
  totalEstimatedUsd: number;
  totalEstimatedRub: number;
  achievedRank: PartnershipRank;
}

export const DEFAULT_USD_TO_RUB_RATE = 95;
export const LOYALTY_MONTHLY_CAP_BL = 150;

function clampNonNegative(value: number): number {
  return Number.isFinite(value) && value > 0 ? value : 0;
}

export function calculateLifeRewards(input: PartnershipScenarioInput): PartnershipEconomicsResult {
  const personalLp = clampNonNegative(input.personalLp);
  const newOrdersLp = clampNonNegative(input.newOrdersLp);
  const l1 = Math.floor(clampNonNegative(input.level1Partners));
  const l2 = Math.floor(clampNonNegative(input.level2Partners));
  const l3 = Math.floor(clampNonNegative(input.level3Partners));
  const l4Plus = Math.floor(clampNonNegative(input.level4PlusPartners ?? 0));
  const avgPartnerLp = Math.max(50, clampNonNegative(input.avgPartnerLp ?? 100));
  const usdToRubRate = clampNonNegative(input.usdToRubRate ?? DEFAULT_USD_TO_RUB_RATE) || DEFAULT_USD_TO_RUB_RATE;

  const l1VolumeLp = Math.round(l1 * avgPartnerLp);
  const l2VolumeLp = Math.round(l2 * avgPartnerLp);
  const l3OnlyVolumeLp = Math.round(l3 * avgPartnerLp);

  // Team Volume (TV) = personal LP + L1 volume (official RF Builder Bonus qualification metric)
  const teamVolumeLp = Math.round(personalLp + l1VolumeLp);
  // 3-Level Volume (L3V) = personal + L1 + L2 + L3
  const l3VolumeLp = Math.round(personalLp + l1VolumeLp + l2VolumeLp + l3OnlyVolumeLp);

  const totalPartners = l1 + l2 + l3 + l4Plus;
  const totalOrgLp = Math.round(personalLp + totalPartners * avgPartnerLp);

  // RF / Eurasia percentages (strictly preserved)
  const rapidRewardsUsd = Math.round(newOrdersLp * 0.25);
  const personalCashbackUsd = personalLp > 100 ? Math.round((personalLp - 100) * 0.2) : 0;

  const level1IncomeUsd = Math.round(l1VolumeLp * 0.02);
  const level2IncomeUsd = Math.round(l2VolumeLp * 0.12);
  const level3IncomeUsd = Math.round(l3OnlyVolumeLp * 0.05);

  // Official 4Life Eurasia rank qualifications:
  // - Associate: 100 LP
  // - Builder: 100 LP + 3 personally enrolled
  // - Builder Elite: 100 LP + 3 personally enrolled + 1,000 LP TV (or 1,000 LP L3V with TV >= 600)
  // - Diamond: 100 LP + 6 personally enrolled + 3,000 LP L3V
  // - Presidential Diamond: 100 LP + 8 personally enrolled + 10,000 LP L3V
  // - Bronze / Silver International: 100 LP + 10 personally enrolled + 20,000 LP L3V + 50,000 LP OV
  // - Gold / Platinum International: 100 LP + 10 personally enrolled + 20,000 LP L3V + 250,000 LP OV
  let achievedRank: PartnershipRank = "Associate";
  if (personalLp >= 100 && l1 >= 10 && l3VolumeLp >= 20_000 && totalOrgLp >= 250_000) {
    achievedRank = "Gold / Platinum International";
  } else if (personalLp >= 100 && l1 >= 10 && l3VolumeLp >= 20_000 && totalOrgLp >= 50_000) {
    achievedRank = "Bronze / Silver International";
  } else if (personalLp >= 100 && l1 >= 8 && l3VolumeLp >= 10_000) {
    achievedRank = "Presidential Diamond";
  } else if (personalLp >= 100 && l1 >= 6 && l3VolumeLp >= 3_000) {
    achievedRank = "Diamond";
  } else if (personalLp >= 100 && l1 >= 3 && (teamVolumeLp >= 1_000 || (teamVolumeLp >= 600 && l3VolumeLp >= 1_000))) {
    achievedRank = "Builder Elite";
  } else if (personalLp >= 100 && l1 >= 3) {
    achievedRank = "Builder";
  }

  // Generations / Infinity on L4+ volume (Gen 4 = 6% Diamond / 12% Presidential+, Gen 5-6 = 3%, Gen 7-10 = 2%)
  let infinityRate = 0;
  if (achievedRank === "Gold / Platinum International") {
    infinityRate = 0.14;
  } else if (achievedRank === "Bronze / Silver International") {
    infinityRate = 0.13;
  } else if (achievedRank === "Presidential Diamond") {
    infinityRate = 0.12;
  } else if (achievedRank === "Diamond") {
    infinityRate = 0.06;
  }
  const level4PlusIncomeUsd = l4Plus > 0 && infinityRate > 0 ? Math.round(l4Plus * avgPartnerLp * infinityRate) : 0;

  // Global Premier Pool share (Gold / Platinum International)
  const premierPoolUsd =
    achievedRank === "Gold / Platinum International"
      ? Math.round(totalOrgLp * 0.02)
      : achievedRank === "Bronze / Silver International"
        ? Math.round(totalOrgLp * 0.01)
        : 0;

  // Builder Bonus RF rule: mandatory Personal >= 100 LP AND Team Volume (TV) >= 600 LP AND >= 3 active L1
  let builderBonusTier: 0 | 1 | 2 | 3 = 0;
  let builderBonusUsd = 0;

  if (personalLp >= 100 && l1 >= 3 && teamVolumeLp >= 600) {
    if (l2 >= 9 && l2VolumeLp >= 900 && l3 >= 27 && l3OnlyVolumeLp >= 2_700) {
      builderBonusTier = 3;
      builderBonusUsd = 800;
    } else if (l2 >= 9 && l2VolumeLp >= 900) {
      builderBonusTier = 2;
      builderBonusUsd = 200;
    } else {
      builderBonusTier = 1;
      builderBonusUsd = 50;
    }
  }

  // Loyalty Program RF (June 2026): up to 15% from month 13, monthly cap 150 BL
  const loyaltyPointsEarned =
    personalLp >= 50 ? Math.min(LOYALTY_MONTHLY_CAP_BL, Math.round(personalLp * 0.15)) : 0;

  const totalEstimatedUsd =
    rapidRewardsUsd +
    personalCashbackUsd +
    level1IncomeUsd +
    level2IncomeUsd +
    level3IncomeUsd +
    level4PlusIncomeUsd +
    premierPoolUsd +
    builderBonusUsd;

  const totalEstimatedRub = Math.round(totalEstimatedUsd * usdToRubRate);

  return {
    rapidRewardsUsd,
    personalCashbackUsd,
    level1IncomeUsd,
    level2IncomeUsd,
    level3IncomeUsd,
    level4PlusIncomeUsd,
    premierPoolUsd,
    builderBonusUsd,
    builderBonusTier,
    loyaltyPointsEarned,
    teamVolumeLp,
    l3VolumeLp,
    totalPartners,
    totalOrgLp,
    totalEstimatedUsd,
    totalEstimatedRub,
    achievedRank,
  };
}

export type LoyaltyTenureId = "m1_3" | "m4_12" | "m13_plus";

export interface BuyerSavingsInput {
  /** Number of standard 4Life bottles/formulas per month (1..6) */
  bottlesPerMonth: number;
  /** Loyalty program tenure stage in RF (10% -> 12% -> 15%) */
  loyaltyTenure: LoyaltyTenureId;
}

export interface BuyerSavingsResult {
  bottles: number;
  estimatedLp: number;
  retailPriceRub: number;
  wholesalePriceRub: number;
  wholesaleDiscountRub: number;
  loyaltyRatePercent: 0 | 10 | 12 | 15;
  loyaltyPointsBl: number;
  loyaltyValueRub: number;
  hasBonusProduct: boolean;
  bonusProductValueRub: number;
  totalMonthlyBenefitRub: number;
  tierLabel: string;
}

const AVG_BOTTLE_LP = 44; // e.g., Tri-Factor (40 LP) / Plus (55 LP) / Renuvo (42 LP) average
const AVG_BOTTLE_WHOLESALE_RUB = 5000;
const AVG_BOTTLE_RETAIL_RUB = 6670; // ~25% wholesale discount vs retail
const RUB_PER_LOYALTY_POINT = 115;
const BONUS_PRODUCT_VALUE_RUB = 4200; // Average wholesale value of monthly Bonus Product (3 800–4 500 ₽)

/**
 * Pure deterministic savings calculator for /how-to-buy (RF 2026 Loyalty rules):
 *  - 1 bottle (<50 LP): -25% wholesale via Partner ID 12299550 without registration
 *  - 2 bottles (>=50 LP): -25% + Loyalty Points cashback (10% mo 1-3 -> 12% mo 4-12 -> 15% mo 13+, cap 150 BL)
 *  - 3+ bottles (>=125 LP): -25% + Loyalty Points + Free Bonus Product of the Month (~4 200 ₽)
 */
export function calculateBuyerLoyaltySavings(input: BuyerSavingsInput): BuyerSavingsResult {
  const bottles = Math.min(6, Math.max(1, Math.round(clampNonNegative(input.bottlesPerMonth) || 1)));
  const estimatedLp = bottles * AVG_BOTTLE_LP;
  const wholesalePriceRub = bottles * AVG_BOTTLE_WHOLESALE_RUB;
  const retailPriceRub = bottles * AVG_BOTTLE_RETAIL_RUB;
  const wholesaleDiscountRub = retailPriceRub - wholesalePriceRub;

  const qualifiesLoyalty = estimatedLp >= 50;
  const loyaltyRatePercent: 0 | 10 | 12 | 15 = !qualifiesLoyalty
    ? 0
    : input.loyaltyTenure === "m13_plus"
      ? 15
      : input.loyaltyTenure === "m4_12"
        ? 12
        : 10;

  const loyaltyPointsBl = qualifiesLoyalty
    ? Math.min(LOYALTY_MONTHLY_CAP_BL, Math.round((estimatedLp * loyaltyRatePercent) / 100))
    : 0;
  const loyaltyValueRub = loyaltyPointsBl * RUB_PER_LOYALTY_POINT;

  const hasBonusProduct = estimatedLp >= 125;
  const bonusProductValueRub = hasBonusProduct ? BONUS_PRODUCT_VALUE_RUB : 0;

  const totalMonthlyBenefitRub = wholesaleDiscountRub + loyaltyValueRub + bonusProductValueRub;

  const tierLabel = hasBonusProduct
    ? "Максимум: −25% + Баллы Лояльности + Продукт Месяца в подарок"
    : qualifiesLoyalty
      ? "Выгодный курс: −25% + накопительные Баллы Лояльности"
      : "Старт без регистрации: оптовая скидка −25% по ID 12299550";

  return {
    bottles,
    estimatedLp,
    retailPriceRub,
    wholesalePriceRub,
    wholesaleDiscountRub,
    loyaltyRatePercent,
    loyaltyPointsBl,
    loyaltyValueRub,
    hasBonusProduct,
    bonusProductValueRub,
    totalMonthlyBenefitRub,
    tierLabel,
  };
}
