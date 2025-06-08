/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SITE_URL: string;
  readonly VITE_OG_IMAGE: string;
  readonly VITE_CONTACT_EMAIL: string;
  readonly VITE_CONTACT_PHONE: string;
  readonly VITE_4LIFE_ID: string;
  readonly VITE_TELEGRAM_URL: string;
  readonly VITE_WHATSAPP_URL: string;
  readonly VITE_FACEBOOK_URL: string;
  readonly VITE_INSTAGRAM_URL: string;
  readonly VITE_TWITTER_URL: string;
  readonly VITE_YOUTUBE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}