/// <reference types="vite/client" />
/// <reference path="./types/headlessui-react.d.ts" />
/// <reference path="./types/external-modules.d.ts" />
/// <reference path="./types/emotion.d.ts" />

interface ImportMetaEnv {
  /** @description Основной URL-адрес сайта. */
  readonly VITE_SITE_URL: string;
  /** @description URL изображения для Open Graph (используется при шеринге в соцсетях). */
  readonly VITE_OG_IMAGE: string;
  /** @description Контактный email-адрес. */
  readonly VITE_CONTACT_EMAIL: string;
  /** @description Контактный номер телефона для связи с сайтом. */
  readonly VITE_CONTACT_PHONE: string;
  /** @description Уникальный идентификатор партнера 4Life. */
  readonly VITE_4LIFE_ID: string;
  /** @description URL-адрес профиля в Telegram. */
  readonly VITE_TELEGRAM_URL: string;
  /** @description URL-адрес для связи в WhatsApp. */
  readonly VITE_WHATSAPP_URL: string;
  /** @description Физический адрес офиса. */
  readonly VITE_OFFICE_ADDRESS: string;
  /** @description Контактный номер телефона дистрибьютора. */
  readonly VITE_DISTRIBUTOR_PHONE: string;
}

interface Window {
  __menuTransitionInProgress?: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
