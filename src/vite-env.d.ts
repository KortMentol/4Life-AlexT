/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** @description Основной URL-адрес сайта. */
  readonly VITE_SITE_URL: string;
  /** @description URL изображения для Open Graph (используется при шеринге в соцсетях). */
  readonly VITE_OG_IMAGE: string;
  /** @description Контактный email-адрес. */
  readonly VITE_CONTACT_EMAIL: string;
  /** @description Контактный номер телефона. */
  readonly VITE_CONTACT_PHONE: string;
  /** @description Уникальный идентификатор партнера 4Life. */
  readonly VITE_4LIFE_ID: string;
  /** @description URL-адрес профиля в Telegram. */
  readonly VITE_TELEGRAM_URL: string;
  /** @description URL-адрес для связи в WhatsApp. */
  readonly VITE_WHATSAPP_URL: string;
  /** @description URL-адрес профиля в Facebook. */
  readonly VITE_FACEBOOK_URL: string;
  /** @description URL-адрес профиля в Instagram. */
  readonly VITE_INSTAGRAM_URL: string;
  /** @description URL-адрес профиля в Twitter. */
  readonly VITE_TWITTER_URL: string;
  /** @description URL-адрес канала на YouTube. */
  readonly VITE_YOUTUBE_URL: string;
  /** @description Контактный номер телефона Александра Тощева. */
  readonly VITE_ALEX_PHONE_NUMBER: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
