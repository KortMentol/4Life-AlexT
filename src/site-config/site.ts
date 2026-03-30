/**
 * Конфигурация сайта с использованием переменных окружения для чувствительных данных
 */
export const siteConfig = {
  name: "4Life: Здоровье, Энергия, Возможности",
  description:
    "Официальный представитель 4Life. Инвестируйте в свое здоровье и будущее с продукцией для иммунной системы, энергией и возможностями партнерства.",
  url: import.meta.env.VITE_SITE_URL || "https://example.com",
  ogImage: import.meta.env.VITE_OG_IMAGE || "/favicon.svg",
  links: {
    telegram: import.meta.env.VITE_TELEGRAM_URL || "https://t.me/username",
    whatsapp: import.meta.env.VITE_WHATSAPP_URL || "https://wa.me/",
  },
  distributor: {
    name: "Александр Тощев",
    title: "Независимый Дистрибьютор 4Life & Наставник по саморазвитию",
  },
  contact: {
    fourLifeId: import.meta.env.VITE_4LIFE_ID || "00000000",
    whatsapp: import.meta.env.VITE_WHATSAPP_URL || "https://wa.me/",
    email: import.meta.env.VITE_CONTACT_EMAIL || "contact@example.com",
    phone: import.meta.env.VITE_DISTRIBUTOR_PHONE || "+7 (XXX) XXX-XX-XX",
    address: import.meta.env.VITE_OFFICE_ADDRESS || "Москва, Россия",
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
