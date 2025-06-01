export const siteConfig = {
  name: "4Life: Здоровье, Энергия, Возможности",
  description: "Официальный представитель 4Life. Инвестируйте в свое здоровье и будущее с продукцией для иммунной системы, энергией и возможностями партнерства.",
  url: "https://[ДОМЕН_САЙТА]",
  ogImage: "https://[ДОМЕН_САЙТА]/og-image.jpg",
  links: {
    telegram: "https://t.me/[ВАШ_ТЕЛЕГРАМ]",
    whatsapp: "https://wa.me/[НОМЕР_ТЕЛЕФОНА]",
    phone: "+[КОД_СТРАНЫ][НОМЕР_ТЕЛЕФОНА]",
    email: "mailto:[EMAIL_ОТЦА]",
  },
  distributor: {
    name: "Александр Тощев",
    title: "Независимый Дистрибьютор 4Life & Наставник по саморазвитию",
  },
};

export const mainNav = [
  {
    title: "Главная",
    href: "/",
  },
  {
    title: "О нас",
    href: "/about",
  },
  {
    title: "Продукты",
    href: "/products",
  },
  {
    title: "Партнерство",
    href: "/partnership",
  },
  {
    title: "Отзывы",
    href: "/testimonials",
  },
  {
    title: "Купить",
    href: "/purchase",
  },
  {
    title: "Контакты",
    href: "/contact",
  },
];

export const footerNav = [...mainNav];
