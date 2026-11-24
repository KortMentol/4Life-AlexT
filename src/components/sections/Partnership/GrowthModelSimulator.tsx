/**
 * @module src/components/sections/Partnership/GrowthModelSimulator.tsx
 * @description Executive Life Rewards visual simulator aligned 100% with verified RF / Eurasia rules (Nov 2026):
 * - 4 verified presets: Builder Elite -> Diamond -> Presidential Diamond -> Bronze / Silver International
 * - Live 4-orbit NetworkConstellationSVG (L1 -> L2 -> L3 -> L4+ Глубина)
 * - Exact TV (Team Volume >= 600 LP Builder Bonus rule) & L3V telemetry
 * - Automatic qualification rank badge + large ₽ / мес and $ / мес dual readout
 * - 1-click inline glossary + progressive disclosure full LP parameter fine tuning
 */

import type { Palette } from "@/components/sections/PartnershipSection/constants";
import type { PerformanceTier } from "@/hooks/usePerformanceTier";
import { Icons } from "@/utils/icons";
import {
  calculateLifeRewards,
  DEFAULT_USD_TO_RUB_RATE,
  LOYALTY_MONTHLY_CAP_BL,
  type PartnershipScenarioInput,
} from "@/utils/partnershipEconomics";
import { AnimatePresence, motion } from "framer-motion";
import React, { useMemo, useState } from "react";

interface GrowthModelSimulatorProps {
  palette: Palette;
  tier: PerformanceTier;
}

interface PresetModel {
  id: string;
  index: string;
  rankTitle: string;
  subtitle: string;
  rangeRub: string;
  duplicationRatio: { l2PerL1: number; l3PerL2: number; l4PerL3: number };
  values: PartnershipScenarioInput;
}

const SCALE_PRESETS: readonly PresetModel[] = [
  {
    id: "builder-elite",
    index: "01",
    rankTitle: "Builder Elite",
    subtitle: "Командный объём TV ≥ 600 LP и премия 3×3",
    rangeRub: "~45 000 – 55 000 ₽",
    duplicationRatio: { l2PerL1: 3, l3PerL2: 0, l4PerL3: 0 },
    values: {
      personalLp: 150,
      newOrdersLp: 400,
      level1Partners: 3,
      level2Partners: 9,
      level3Partners: 0,
      level4PlusPartners: 0,
      avgPartnerLp: 150,
    },
  },
  {
    id: "diamond",
    index: "02",
    rankTitle: "Diamond",
    subtitle: "6 партнёров L1 • L3V ≥ 3 000 LP • Gen 4 (6%)",
    rangeRub: "~75 000 – 115 000 ₽",
    duplicationRatio: { l2PerL1: 3, l3PerL2: 0.67, l4PerL3: 0.85 },
    values: {
      personalLp: 200,
      newOrdersLp: 1000,
      level1Partners: 6,
      level2Partners: 18,
      level3Partners: 12,
      level4PlusPartners: 10,
      avgPartnerLp: 125,
    },
  },
  {
    id: "presidential",
    index: "03",
    rankTitle: "Presidential Diamond",
    subtitle: "8 партнёров L1 • L3V ≥ 10 000 LP • $800 + Gen 4 (12%)",
    rangeRub: "~340 000 – 450 000 ₽",
    duplicationRatio: { l2PerL1: 3, l3PerL2: 2, l4PerL3: 2.5 },
    values: {
      personalLp: 250,
      newOrdersLp: 2200,
      level1Partners: 8,
      level2Partners: 24,
      level3Partners: 48,
      level4PlusPartners: 120,
      avgPartnerLp: 125,
    },
  },
  {
    id: "international",
    index: "04",
    rankTitle: "Bronze / Silver Int.",
    subtitle: "10 партнёров L1 • L3V ≥ 20 000 LP • OV ≥ 50 000 LP",
    rangeRub: "~850 000 – 1,3+ млн ₽",
    duplicationRatio: { l2PerL1: 4, l3PerL2: 3, l4PerL3: 2.9 },
    values: {
      personalLp: 300,
      newOrdersLp: 3600,
      level1Partners: 10,
      level2Partners: 40,
      level3Partners: 120,
      level4PlusPartners: 350,
      avgPartnerLp: 125,
    },
  },
] as const;

interface GlossaryTerm {
  id: string;
  label: string;
  definition: string;
}

const GLOSSARY_TERMS: readonly GlossaryTerm[] = [
  {
    id: "lp",
    label: "LP и Программа Лояльности РФ",
    definition: `LP (Life Points) — единая международная балльная единица 4Life. 100–125 LP — примерно 2–3 формулы в месяц. В Программе Лояльности РФ от 50 LP возвращается 10% (1–3 мес.) → 12% (4–12 мес.) → 15% (с 13-го мес., лимит ${LOYALTY_MONTHLY_CAP_BL} БЛ/мес), а от 125 LP добавляется бесплатный Продукт Месяца.`,
  },
  {
    id: "builder",
    label: "Builder Bonus ($50 / $200 / $800)",
    definition:
      "Обязательное базовое условие в РФ: личный заказ по Лояльности ≥ 100 LP, минимум 3 активных партнёра L1 и командный объём TV (вы + L1) ≥ 600 LP ($50). Ступень 2 ($200) добавляет 9 партнёров L2 (≥ 900 LP), ступень 3 ($800) — 27 партнёров L3 (≥ 2 700 LP).",
  },
  {
    id: "infinity",
    label: "Поколения (Gen 4–10) и Premier Pool",
    definition:
      "На повторных заказах работают L1 = 2%, L2 = 12%, L3 = 5%. С ранга Diamond открывается Gen 4 = 6% (12% на Presidential+), на старших рангах — Gen 5–6 = 3%, Gen 7–10 = 2% и доля в глобальном Premier Pool.",
  },
] as const;

const NetworkConstellationSVG: React.FC<{
  level1: number;
  level2: number;
  level3: number;
  level4Plus: number;
  gold: string;
  cream: string;
  isLow: boolean;
}> = ({ level1, level2, level3, level4Plus, gold, cream, isLow }) => {
  const l1Slots = 6;
  const l2Slots = 10;
  const l3Slots = 14;
  const l4Slots = 18;

  const l1Count = Math.min(Math.max(level1, 0), l1Slots);
  const l2Count = Math.min(Math.max(Math.ceil(level2 / 3), 0), l2Slots);
  const l3Count = Math.min(Math.max(Math.ceil(level3 / 4), 0), l3Slots);
  const l4Count = Math.min(Math.max(level4Plus > 0 ? Math.max(2, Math.ceil(Math.sqrt(level4Plus) * 0.65)) : 0, 0), l4Slots);

  const getX = (idx: number, total: number, padX: number) => {
    if (total <= 1) return 260;
    return padX + (idx / (total - 1)) * (520 - padX * 2);
  };

  return (
    <div className="relative w-full">
      <svg
        viewBox="0 0 520 278"
        className="w-full h-auto overflow-visible select-none"
        role="img"
        aria-label={`Схема команды: L1 ${level1}, L2 ${level2}, L3 ${level3}, L4+ ${level4Plus} чел.`}
      >
        <defs>
          <radialGradient id="constellationGlowV7" cx="50%" cy="14%" r="65%">
            <stop offset="0%" stopColor={gold} stopOpacity="0.24" />
            <stop offset="60%" stopColor="#38BDF8" stopOpacity={level4Plus > 0 ? "0.08" : "0"} />
            <stop offset="100%" stopColor={gold} stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect x="0" y="0" width="520" height="278" fill="url(#constellationGlowV7)" />

        {/* 4 Horizontal Orbit Baselines: L1 -> L2 -> L3 -> L4+ */}
        {[
          { y: 82, text: `L1 (2%) · ${level1} ЧЕЛ.` },
          { y: 142, text: `L2 (12%) · ${level2} ЧЕЛ.` },
          { y: 202, text: `L3 (5%) · ${level3} ЧЕЛ.` },
          { y: 256, text: `GEN 4–10 INFINITY · ${level4Plus} ЧЕЛ.` },
        ].map((row) => (
          <g key={row.y}>
            <line
              x1="10"
              y1={row.y}
              x2="510"
              y2={row.y}
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="1"
              strokeDasharray="2 5"
              vectorEffect="non-scaling-stroke"
            />
            <text
              x="10"
              y={row.y - 6}
              fill="rgba(148,163,184,0.68)"
              fontSize="8.5"
              letterSpacing="1.5"
              fontFamily="JetBrains Mono Variable, monospace"
            >
              {row.text}
            </text>
          </g>
        ))}

        {/* Bezier Filaments: Apex -> L1 */}
        {Array.from({ length: l1Slots }).map((_, i) => {
          const active = i < l1Count;
          const x = getX(i, l1Slots, 92);
          return (
            <path
              key={`e1-${i}`}
              d={`M 260 28 C 260 56, ${x} 54, ${x} 82`}
              fill="none"
              stroke={active ? gold : "rgba(255,255,255,0.06)"}
              strokeOpacity={active ? 0.78 : 1}
              strokeWidth={active ? 1.4 : 0.75}
              vectorEffect="non-scaling-stroke"
              style={{ transition: isLow ? "none" : "stroke 300ms ease, stroke-opacity 300ms ease" }}
            />
          );
        })}

        {/* Bezier Filaments: L1 -> L2 */}
        {Array.from({ length: l2Slots }).map((_, i) => {
          const active = i < l2Count;
          const parentIdx = Math.min(Math.floor((i * l1Slots) / l2Slots), l1Slots - 1);
          const px = getX(parentIdx, l1Slots, 92);
          const x = getX(i, l2Slots, 56);
          return (
            <path
              key={`e2-${i}`}
              d={`M ${px} 82 C ${px} 112, ${x} 110, ${x} 142`}
              fill="none"
              stroke={active ? "#E2C379" : "rgba(255,255,255,0.045)"}
              strokeOpacity={active ? 0.56 : 1}
              strokeWidth={active ? 1.05 : 0.7}
              vectorEffect="non-scaling-stroke"
              style={{ transition: isLow ? "none" : "stroke 300ms ease, stroke-opacity 300ms ease" }}
            />
          );
        })}

        {/* Bezier Filaments: L2 -> L3 */}
        {Array.from({ length: l3Slots }).map((_, i) => {
          const active = i < l3Count;
          const parentIdx = Math.min(Math.floor((i * l2Slots) / l3Slots), l2Slots - 1);
          const px = getX(parentIdx, l2Slots, 56);
          const x = getX(i, l3Slots, 34);
          return (
            <path
              key={`e3-${i}`}
              d={`M ${px} 142 C ${px} 172, ${x} 170, ${x} 202`}
              fill="none"
              stroke={active ? "#38BDF8" : "rgba(255,255,255,0.04)"}
              strokeOpacity={active ? 0.48 : 1}
              strokeWidth={active ? 0.95 : 0.65}
              vectorEffect="non-scaling-stroke"
              style={{ transition: isLow ? "none" : "stroke 300ms ease, stroke-opacity 300ms ease" }}
            />
          );
        })}

        {/* Bezier Filaments: L3 -> L4+ Infinity Orbit */}
        {Array.from({ length: l4Slots }).map((_, i) => {
          const active = i < l4Count;
          const parentIdx = Math.min(Math.floor((i * l3Slots) / l4Slots), l3Slots - 1);
          const px = getX(parentIdx, l3Slots, 34);
          const x = getX(i, l4Slots, 22);
          return (
            <path
              key={`e4-${i}`}
              d={`M ${px} 202 C ${px} 230, ${x} 228, ${x} 256`}
              fill="none"
              stroke={active ? "#22D3EE" : "rgba(255,255,255,0.03)"}
              strokeOpacity={active ? 0.48 : 1}
              strokeWidth={active ? 0.9 : 0.6}
              vectorEffect="non-scaling-stroke"
              style={{ transition: isLow ? "none" : "stroke 300ms ease, stroke-opacity 300ms ease" }}
            />
          );
        })}

        {/* Apex Partner Node */}
        <circle cx="260" cy="28" r="10" fill="rgba(201,166,89,0.2)" stroke={gold} strokeWidth="1.2" />
        <circle cx="260" cy="28" r="4" fill={cream} />
        <text
          x="260"
          y="12"
          textAnchor="middle"
          fill={cream}
          fontSize="9"
          letterSpacing="2"
          fontFamily="JetBrains Mono Variable, monospace"
        >
          ВАШ ID
        </text>

        {/* Orbit 1..4 Nodes */}
        {Array.from({ length: l1Slots }).map((_, i) => {
          const active = i < l1Count;
          return (
            <circle
              key={`n1-${i}`}
              cx={getX(i, l1Slots, 92)}
              cy="82"
              r={active ? 4.8 : 2.8}
              fill={active ? gold : "#0d1322"}
              stroke={active ? cream : "rgba(255,255,255,0.16)"}
              strokeWidth="1"
            />
          );
        })}
        {Array.from({ length: l2Slots }).map((_, i) => {
          const active = i < l2Count;
          return (
            <circle
              key={`n2-${i}`}
              cx={getX(i, l2Slots, 56)}
              cy="142"
              r={active ? 3.8 : 2.2}
              fill={active ? "#E2C379" : "#0b101d"}
              stroke={active ? "rgba(240,237,232,0.72)" : "rgba(255,255,255,0.12)"}
              strokeWidth="0.9"
            />
          );
        })}
        {Array.from({ length: l3Slots }).map((_, i) => {
          const active = i < l3Count;
          return (
            <circle
              key={`n3-${i}`}
              cx={getX(i, l3Slots, 34)}
              cy="202"
              r={active ? 3.2 : 1.8}
              fill={active ? "#38BDF8" : "#090e1a"}
              stroke={active ? "rgba(186,230,253,0.75)" : "rgba(255,255,255,0.09)"}
              strokeWidth="0.8"
            />
          );
        })}
        {Array.from({ length: l4Slots }).map((_, i) => {
          const active = i < l4Count;
          return (
            <circle
              key={`n4-${i}`}
              cx={getX(i, l4Slots, 22)}
              cy="256"
              r={active ? 2.9 : 1.6}
              fill={active ? "#22D3EE" : "#070c17"}
              stroke={active ? "rgba(165,243,252,0.85)" : "rgba(255,255,255,0.08)"}
              strokeWidth="0.75"
            />
          );
        })}
      </svg>
    </div>
  );
};

export const GrowthModelSimulator: React.FC<GrowthModelSimulatorProps> = ({ palette, tier }) => {
  const isLow = tier === "low";
  const [activePresetId, setActivePresetId] = useState<string>("diamond");
  const [scenario, setScenario] = useState<PartnershipScenarioInput>(SCALE_PRESETS[1]!.values);
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [activeGlossaryId, setActiveGlossaryId] = useState<string | null>(null);

  const activePreset = useMemo(
    () => SCALE_PRESETS.find((p) => p.id === activePresetId) ?? SCALE_PRESETS[1]!,
    [activePresetId],
  );

  const rewards = useMemo(() => calculateLifeRewards(scenario), [scenario]);

  const handleSelectPreset = (preset: PresetModel) => {
    setActivePresetId(preset.id);
    setScenario(preset.values);
  };

  // Smooth frontline scaler synced proportionally with active model's duplication depth
  const handleFrontlineScale = (frontlineCount: number) => {
    const ratio = activePreset.duplicationRatio;
    const nextL2 = Math.round(frontlineCount * ratio.l2PerL1);
    const nextL3 = Math.round(nextL2 * ratio.l3PerL2);
    const nextL4 = Math.round(nextL3 * ratio.l4PerL3);
    setScenario((prev) => ({
      ...prev,
      level1Partners: frontlineCount,
      level2Partners: Math.min(nextL2, 60),
      level3Partners: Math.min(nextL3, 150),
      level4PlusPartners: Math.min(nextL4, 1500),
    }));
  };

  const updateField = (field: keyof PartnershipScenarioInput, value: number) => {
    setScenario((prev) => ({ ...prev, [field]: value }));
  };

  const activeGlossary = GLOSSARY_TERMS.find((g) => g.id === activeGlossaryId) ?? null;

  const recurringL1L3Usd = rewards.level1IncomeUsd + rewards.level2IncomeUsd + rewards.level3IncomeUsd;
  const qualifiesBonusProduct = scenario.personalLp >= 125;

  return (
    <div className="space-y-10">
      {/* 4 Verified RF / Eurasia Scale Presets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-y border-white/[0.1] divide-y sm:divide-y-0 sm:divide-x divide-white/[0.08]">
        {SCALE_PRESETS.map((preset) => {
          const isSelected = preset.id === activePresetId;
          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => handleSelectPreset(preset)}
              aria-pressed={isSelected}
              data-sim-preset={preset.id}
              className="relative text-left py-6 px-1 sm:px-5 first:sm:pl-0 last:sm:pr-0 cursor-pointer group transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C9A659]"
            >
              <div className="flex items-baseline justify-between gap-2 mb-2">
                <span
                  className="typography-mono text-xs tracking-[0.2em]"
                  style={{ color: isSelected ? palette.gold : "rgba(148,163,184,0.55)" }}
                >
                  {preset.index}
                </span>
                <span className="typography-mono text-[10px] text-slate-400">{preset.rangeRub}</span>
              </div>
              <p
                className="font-heading text-base md:text-lg font-semibold transition-colors"
                style={{ color: isSelected ? palette.cream : "rgba(240,237,232,0.62)" }}
              >
                {preset.rankTitle}
              </p>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed text-pretty">{preset.subtitle}</p>

              {isSelected && (
                <motion.span
                  layoutId={isLow ? undefined : "preset-active-bar"}
                  aria-hidden="true"
                  className="absolute bottom-0 left-0 right-0 h-[2px]"
                  style={{ backgroundColor: palette.gold }}
                  transition={{ type: "spring", stiffness: 320, damping: 32 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Main Split Stage: 4-Orbit Constellation + Dual ₽ / $ Executive Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        {/* Left 7 cols */}
        <div className="lg:col-span-7 space-y-8">
          <div className="p-6 md:p-8 rounded-[1.75rem] bg-[#060a14] border border-white/[0.08]">
            <div className="flex flex-wrap items-baseline justify-between gap-4 mb-5">
              <div>
                <span className="typography-mono text-[10px] uppercase tracking-[0.22em] text-slate-500 block">
                  Орбиты команды (L1 2% • L2 12% • L3 5% • Gen 4+)
                </span>
                <h3 className="typography-h3 text-white mt-1">Архитектура товарооборота</h3>
              </div>
              <div className="text-right">
                <span className="typography-mono text-xs text-[#C9A659] block">
                  TV: {rewards.teamVolumeLp.toLocaleString("ru-RU")} LP · L3V:{" "}
                  {rewards.l3VolumeLp.toLocaleString("ru-RU")} LP
                </span>
                <span className="typography-mono text-[11px] text-slate-400">
                  Команда: {rewards.totalPartners.toLocaleString("ru-RU")} чел. · OV:{" "}
                  {rewards.totalOrgLp.toLocaleString("ru-RU")} LP
                </span>
              </div>
            </div>

            <NetworkConstellationSVG
              level1={scenario.level1Partners}
              level2={scenario.level2Partners}
              level3={scenario.level3Partners}
              level4Plus={scenario.level4PlusPartners ?? 0}
              gold={palette.gold}
              cream={palette.cream}
              isLow={isLow}
            />

            {/* Primary intuitive 1-slider control */}
            <div className="mt-7 pt-6 border-t border-white/[0.08] space-y-3">
              <div className="flex items-baseline justify-between gap-4">
                <label htmlFor="primary-frontline-slider" className="text-sm md:text-base font-medium text-white">
                  Активные лидеры в вашей 1-й линии
                </label>
                <span className="typography-mono text-xl font-semibold" style={{ color: palette.gold }}>
                  {scenario.level1Partners} чел.
                </span>
              </div>
              <input
                id="primary-frontline-slider"
                type="range"
                min={1}
                max={12}
                step={1}
                value={Math.min(Math.max(scenario.level1Partners, 1), 12)}
                onChange={(e) => handleFrontlineScale(Number(e.target.value))}
                className="w-full h-1.5 rounded-full bg-white/10 accent-[#C9A659] cursor-pointer"
              />
              <div className="flex items-center justify-between text-xs text-slate-500 typography-mono">
                <span>1 · старт</span>
                <span>3 · Builder</span>
                <span>6 · Diamond</span>
                <span>8–10+ · Presidential / Int.</span>
              </div>
            </div>
          </div>

          {/* 1-Click Glossary Strip */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              <span className="typography-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">
                Правила РФ 2026:
              </span>
              {GLOSSARY_TERMS.map((term) => {
                const isOpen = activeGlossaryId === term.id;
                return (
                  <button
                    key={term.id}
                    type="button"
                    onClick={() => setActiveGlossaryId(isOpen ? null : term.id)}
                    aria-expanded={isOpen}
                    className={`text-xs md:text-sm underline underline-offset-4 decoration-dashed transition-colors cursor-pointer ${
                      isOpen ? "text-[#C9A659] decoration-[#C9A659]" : "text-slate-300 decoration-white/30 hover:text-white"
                    }`}
                  >
                    {term.label}
                  </button>
                );
              })}
            </div>

            <AnimatePresence initial={false}>
              {activeGlossary && (
                <motion.div
                  key={activeGlossary.id}
                  initial={isLow ? false : { opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={isLow ? undefined : { opacity: 0, y: -4 }}
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                  className="p-4 rounded-2xl bg-[#070c18] border border-[#C9A659]/25 text-xs md:text-sm text-slate-200 leading-relaxed flex items-start justify-between gap-4"
                >
                  <p className="text-pretty">{activeGlossary.definition}</p>
                  <button
                    type="button"
                    onClick={() => setActiveGlossaryId(null)}
                    aria-label="Закрыть пояснение"
                    className="text-slate-400 hover:text-white cursor-pointer flex-shrink-0 mt-0.5"
                  >
                    <Icons.X className="w-4 h-4" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Progressive Disclosure: Full 6-Parameter LP Fine Tuning */}
          <div className="border-t border-white/[0.08] pt-5">
            <button
              type="button"
              onClick={() => setShowAdvanced((v) => !v)}
              aria-expanded={showAdvanced}
              className="inline-flex items-center gap-2.5 text-xs md:text-sm font-medium text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <Icons.ChevronDown
                className={`w-4 h-4 text-[#C9A659] transition-transform duration-300 ${showAdvanced ? "rotate-180" : ""}`}
              />
              <span>{showAdvanced ? "Скрыть точную настройку LP" : "Точная настройка всех 6 параметров LP"}</span>
            </button>

            <AnimatePresence initial={false}>
              {showAdvanced && (
                <motion.div
                  initial={isLow ? false : { opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={isLow ? undefined : { opacity: 0, height: 0 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {[
                      { key: "personalLp" as const, label: "Личный объём (>100 LP = 20%)", unit: "LP", min: 100, max: 500, step: 25 },
                      { key: "newOrdersLp" as const, label: "Новые первые заказы (25%)", unit: "LP", min: 0, max: 6000, step: 100 },
                      { key: "level1Partners" as const, label: "Партнёры L1 (2%)", unit: "чел.", min: 0, max: 15, step: 1 },
                      { key: "level2Partners" as const, label: "Партнёры L2 (12%)", unit: "чел.", min: 0, max: 60, step: 2 },
                      { key: "level3Partners" as const, label: "Партнёры L3 (5%)", unit: "чел.", min: 0, max: 150, step: 3 },
                      { key: "level4PlusPartners" as const, label: "Глубина Gen 4–10 (6–14%)", unit: "чел.", min: 0, max: 1200, step: 10 },
                    ].map((ctrl) => (
                      <div key={ctrl.key} className="space-y-2">
                        <div className="flex items-baseline justify-between gap-2">
                          <label htmlFor={`adv-${ctrl.key}`} className="text-xs text-slate-300">
                            {ctrl.label}
                          </label>
                          <span className="typography-mono text-sm font-semibold text-[#C9A659]">
                            {scenario[ctrl.key] ?? 0} {ctrl.unit}
                          </span>
                        </div>
                        <input
                          id={`adv-${ctrl.key}`}
                          type="range"
                          min={ctrl.min}
                          max={ctrl.max}
                          step={ctrl.step}
                          value={scenario[ctrl.key] ?? 0}
                          onChange={(e) => updateField(ctrl.key, Number(e.target.value))}
                          className="w-full h-1.5 rounded-full bg-white/10 accent-[#C9A659] cursor-pointer"
                        />
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right 5 cols: Dual ₽ / $ Executive Monthly Statement + Automatic Rank Badge */}
        <div className="lg:col-span-5 space-y-7 lg:pt-1">
          <div className="space-y-4">
            {/* Automatic Rank Qualification Strip */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-[#C9A659]/10 border border-[#C9A659]/35">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C9A659] flex-shrink-0" aria-hidden="true" />
              <span
                data-testid="simulator-rank"
                className="typography-mono text-[11px] uppercase tracking-[0.14em] leading-snug text-[#F0EDE8]"
              >
                Квалификация: <strong style={{ color: palette.gold }}>{rewards.achievedRank}</strong>
              </span>
            </div>

            <div className="space-y-1.5">
              <span className="typography-mono text-[11px] uppercase tracking-[0.22em] block text-slate-400">
                Ориентир ежемесячного дохода
              </span>
              <p
                data-testid="simulator-total-rub"
                className="font-heading text-3xl sm:text-4xl xl:text-[2.65rem] font-semibold typography-mono tracking-tight leading-tight flex flex-wrap items-baseline gap-x-2"
                style={{ color: palette.cream }}
              >
                <span className="whitespace-nowrap">
                  ≈ {rewards.totalEstimatedRub.toLocaleString("ru-RU")} ₽
                </span>
                <span className="text-base sm:text-lg font-normal text-slate-400 whitespace-nowrap">
                  / мес
                </span>
              </p>
              <p
                data-testid="simulator-total"
                className="typography-mono text-xl sm:text-2xl font-medium whitespace-nowrap"
                style={{ color: palette.gold }}
              >
                ${rewards.totalEstimatedUsd.toLocaleString("ru-RU")} / мес
              </p>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              Плюс по Программе Лояльности РФ:{" "}
              <span className="text-white font-semibold typography-mono">+{rewards.loyaltyPointsEarned} БЛ</span>{" "}
              (до 15% с 13-го мес., лимит {LOYALTY_MONTHLY_CAP_BL} БЛ)
              {qualifiesBonusProduct ? " + бесплатный Продукт Месяца (от 125 LP)." : "."}
            </p>
          </div>

          {/* Clean Hairline Financial Breakdown */}
          <dl className="border-y border-white/[0.1] divide-y divide-white/[0.08] text-sm">
            <div className="py-3 flex items-baseline justify-between gap-4">
              <dt className="text-slate-400">Быстрый старт 25% (Rapid Rewards)</dt>
              <dd className="typography-mono font-semibold text-[#F0EDE8]">
                ${rewards.rapidRewardsUsd.toLocaleString("ru-RU")}
              </dd>
            </div>
            <div className="py-3 flex items-baseline justify-between gap-4">
              <dt className="text-slate-400">Личный возврат 20% свыше 100 LP</dt>
              <dd className="typography-mono font-semibold text-[#F0EDE8]">
                ${rewards.personalCashbackUsd.toLocaleString("ru-RU")}
              </dd>
            </div>
            <div className="py-3 flex items-baseline justify-between gap-4">
              <dt className="text-slate-400">Повторные заказы (L1 2% • L2 12% • L3 5%)</dt>
              <dd className="typography-mono font-semibold text-[#F0EDE8]">
                ${recurringL1L3Usd.toLocaleString("ru-RU")}
              </dd>
            </div>
            <div className="py-3 flex items-baseline justify-between gap-4">
              <dt className={rewards.level4PlusIncomeUsd > 0 ? "text-cyan-200 font-medium" : "text-slate-400"}>
                Поколения вглубь Gen 4–10 (Infinity)
              </dt>
              <dd className="typography-mono font-semibold text-cyan-300">
                ${rewards.level4PlusIncomeUsd.toLocaleString("ru-RU")}
              </dd>
            </div>
            <div className="py-3 flex items-baseline justify-between gap-4">
              <dt className={rewards.builderBonusUsd > 0 ? "text-white font-medium" : "text-slate-400"}>
                {rewards.builderBonusTier > 0
                  ? `Builder Bonus 3×3 (ступень ${rewards.builderBonusTier} • TV ≥ 600 LP)`
                  : "Builder Bonus 3×3 (нужно ≥3 L1 и TV ≥ 600 LP)"}
              </dt>
              <dd
                className="typography-mono font-semibold"
                style={{ color: rewards.builderBonusUsd > 0 ? palette.gold : "rgba(240,237,232,0.5)" }}
              >
                ${rewards.builderBonusUsd.toLocaleString("ru-RU")}
              </dd>
            </div>
            {rewards.premierPoolUsd > 0 && (
              <div className="py-3 flex items-baseline justify-between gap-4">
                <dt className="text-[#F0EDE8] font-medium">Глобальный Premier Pool (доля мирового оборота)</dt>
                <dd className="typography-mono font-semibold" style={{ color: palette.gold }}>
                  ${rewards.premierPoolUsd.toLocaleString("ru-RU")}
                </dd>
              </div>
            )}
          </dl>

          <p className="text-xs text-slate-500 leading-relaxed text-pretty">
            Расчёт иллюстративный по правилам 4Life Евразия (1 LP ≈ $1 комиссионного объёма, ориентир ~
            {DEFAULT_USD_TO_RUB_RATE} ₽/$1; в РФ выплаты конвертируются по внутреннему курсу компании). Реальный доход
            зависит от товарооборота и регулярности команды.
          </p>
        </div>
      </div>
    </div>
  );
};

export default React.memo(GrowthModelSimulator);
