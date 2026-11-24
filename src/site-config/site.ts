/**
 * @module src/site-config/site.ts
 * @description Single source of truth for Alexander Toshchev (Partner ID 12299550)
 * and Regional Center RC 67 Moscow warehouse details.
 */

export const siteConfig = {
  name: "4Life Biophysics — Александр Тощев",
  description:
    "Независимый дистрибьютор 4Life Research в России (ID 12299550). Оригинальные формулы Трансфер Фактор со скидкой 25%, прямые поставки через РЦ 67 Москва и наставничество.",
  url: "https://4life-toshchev.ru",
  ogImage: "/favicon.svg",
  links: {
    telegram: "https://t.me/+79152561177",
    whatsapp: "https://wa.me/79152561177",
  },
  distributor: {
    name: "Александр Тощев",
    shortName: "Тощев Александр",
    rank: "Builder Elite",
    title: "Независимый дистрибьютор 4Life & Наставник",
    fourLifeId: "12299550",
    signupUrl: "https://russia.4life.com/12299550/signup/PC",
  },
  contact: {
    fourLifeId: "12299550",
    phone: "+7 (915) 256-11-77",
    phoneRaw: "+79152561177",
    whatsapp: "https://wa.me/79152561177",
    telegram: "https://t.me/+79152561177",
    email: "contact@4life-toshchev.ru",
    address: "Москва, Россия",
    callSchedule:
      "Звонки: Будни 19:00–21:00 МСК | Сб 18:00–20:00 | Вс 11:00–13:00. В мессенджерах — круглосуточно.",
  },
  office: {
    name: "Региональный Центр 4Life РЦ 67",
    address: "г. Москва, м. Новослободская, ул. Селезнёвская, 11А, стр. 2, офис 220А (2-й этаж)",
    phone: "8 (929) 681-10-22",
    phoneRaw: "+79296811022",
    whatsapp: "https://wa.me/79296811022",
    telegram: "https://t.me/+79296811022",
    max: "https://max.ru",
  },
};

export const mainNav = [
  {
    title: "Главная",
    href: "/",
  },
  {
    title: "Продукты",
    href: "/products",
  },
  {
    title: "Как приобрести?",
    href: "/how-to-buy",
  },
  {
    title: "О 4Life",
    href: "/about",
  },
  {
    title: "Обо Мне",
    href: "/about-me",
  },
  {
    title: "Партнерство",
    href: "/partnership",
  },
  {
    title: "Контакты",
    href: "/contact",
  },
];

export const footerNav = [...mainNav];