export const siteConfig = {
  name: "4Life: Здоровье, Энергия, Возможности",
  description: "Официальный представитель 4Life. Инвестируйте в свое здоровье и будущее с продукцией для иммунной системы, энергией и возможностями партнерства.",
  url: "https://[ДОМЕН_САЙТА]",
  ogImage: "https://[ДОМЕН_САЙТА]/og-image.jpg",
  links: {
    telegram: "https://t.me/[ВАШ_ТЕЛЕГРАМ]",
    whatsapp: "https://wa.me/79031234567",
    phone: "+7 (903) 123-45-67",
    email: "mailto:your.father.email@example.com",
  },
  distributor: {
    name: "Александр Тощев",
    title: "Независимый Дистрибьютор 4Life & Наставник по саморазвитию",
  },
  contact: {
    fourLifeId: "12299550",
    whatsapp: "https://wa.me/79031234567",
    email: "your.father.email@example.com",
    phone: "+7 (903) 123-45-67",
    address: "Москва, Россия", // Добавляем адрес
  },
  // Добавляем социальные сети
  socialLinks: {
    facebook: "https://facebook.com/",
    instagram: "https://instagram.com/",
    twitter: "https://twitter.com/",
    youtube: "https://youtube.com/",
  },
};

export const mainNav = [
  {
    title: "Главная",
    href: "/"
  },
  {
    title: "Продукты",
    href: "/products"
  },
  {
    title: "Как приобрести?",
    href: "/how-to-buy"
  },
  {
    title: "О 4Life",
    href: "/about"
  },
  {
    title: "Обо Мне",
    href: "/about-me"
  },
  {
    title: "Партнерство",
    href: "/partnership"
  },
  {
    title: "Контакты",
    href: "/contact"
  },
];

export const footerNav = [...mainNav];