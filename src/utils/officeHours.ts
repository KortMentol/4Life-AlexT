/**
 * @module src/utils/officeHours.ts
 * @description Deterministic Moscow (UTC+3) office-hours evaluator for Regional Center RC 67.
 * Verified RF schedule (November 2026):
 *  - Mon–Fri: 10:00–20:00 MSK (walk-in pickup & warehouse dispatch)
 *  - Sat:     10:00–17:00 MSK (walk-in pickup & warehouse dispatch)
 *  - Sun:     Online messenger order intake only (physical office closed; opens Mon 10:00 MSK)
 */

export interface OfficeStatus {
  isOpen: boolean;
  isSundayOnlineOnly: boolean;
  statusLabel: string;
  detailLabel: string;
  moscowTimeFormatted: string;
}

export function getRc67OfficeStatus(now: Date = new Date()): OfficeStatus {
  // Moscow is fixed UTC+3 year-round (no DST)
  const utcMs = now.getTime() + now.getTimezoneOffset() * 60_000;
  const mskDate = new Date(utcMs + 3 * 3_600_000);

  const day = mskDate.getDay(); // 0 = Sun, 1..5 = Mon..Fri, 6 = Sat
  const hours = mskDate.getHours();
  const minutes = mskDate.getMinutes();
  const minuteOfDay = hours * 60 + minutes;

  const hh = String(hours).padStart(2, "0");
  const mm = String(minutes).padStart(2, "0");
  const moscowTimeFormatted = `${hh}:${mm} МСК`;

  // Sunday: physical warehouse desk closed; messenger applications accepted 24/7
  if (day === 0) {
    return {
      isOpen: false,
      isSundayOnlineOnly: true,
      statusLabel: "Воскресенье — приём онлайн-заявок",
      detailLabel: "Выдача на складе откроется в понедельник в 10:00 МСК — заявку в мессенджер можно отправить сейчас",
      moscowTimeFormatted,
    };
  }

  const isSaturday = day === 6;
  const openMinute = 10 * 60; // 10:00
  const closeMinute = isSaturday ? 17 * 60 : 20 * 60; // 17:00 Sat, 20:00 Mon–Fri
  const closeLabel = isSaturday ? "17:00" : "20:00";

  const isOpen = minuteOfDay >= openMinute && minuteOfDay < closeMinute;

  if (isOpen) {
    return {
      isOpen: true,
      isSundayOnlineOnly: false,
      statusLabel: "Открыт сейчас",
      detailLabel: `Выдача заказов сегодня до ${closeLabel} МСК`,
      moscowTimeFormatted,
    };
  }

  const nextOpenLabel =
    minuteOfDay < openMinute
      ? "Открытие сегодня в 10:00 МСК — список можно отправить уже сейчас"
      : isSaturday
        ? "Выдача откроется в понедельник в 10:00 МСК — онлайн-заявку можно отправить уже сейчас"
        : "Откроется завтра в 10:00 МСК — список можно отправить заранее";

  return {
    isOpen: false,
    isSundayOnlineOnly: false,
    statusLabel: "Сейчас закрыт · приём онлайн",
    detailLabel: nextOpenLabel,
    moscowTimeFormatted,
  };
}
