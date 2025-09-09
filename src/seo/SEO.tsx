import { siteConfig } from "@/site-config/site";
import React from "react";
import { Helmet } from "react-helmet-async";

// --- Вспомогательные функции ---
/**
 * Преобразует относительный путь в абсолютный URL.
 * @param path - Относительный путь или полный URL.
 * @returns Абсолютный URL.
 */
const toAbsoluteUrl = (path?: string): string => {
  if (!path) return siteConfig.url;
  // Если путь уже является полным URL, возвращаем его как есть.
  if (path.startsWith("http")) return path;
  // Убираем завершающий слэш у siteConfig.url, если он есть.
  const baseUrl = siteConfig.url.endsWith("/") ? siteConfig.url.slice(0, -1) : siteConfig.url;
  // Убираем начальный слэш у path, если он есть.
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  return `${baseUrl}/${cleanPath}`;
};

/**
 * Объединяет заголовок страницы с названием сайта.
 * @param title - Заголовок страницы.
 * @returns Объединенный заголовок.
 */
const mergeTitle = (title?: string): string => {
  if (!title) return siteConfig.name;
  // Проверяем, содержит ли заголовок уже название сайта, чтобы избежать дублирования.
  return title.includes(siteConfig.name) ? title : `${title} | ${siteConfig.name}`;
};

// --- JSON-LD Schema Builders ---
const buildBreadcrumbsJSONLD = (items?: { name: string; url: string }[]) => {
  if (!items || items.length === 0) return undefined;
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
};

const buildWebSiteSearchJSONLD = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  url: siteConfig.url,
  potentialAction: {
    "@type": "SearchAction",
    target: `${siteConfig.url}/search?q={search_term_string}`,
    query: "required name=search_term_string",
  },
});

const buildOrganizationJSONLD = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteConfig.distributor?.name ? `4Life с ${siteConfig.distributor.name}` : siteConfig.name,
  url: siteConfig.url,
  logo: toAbsoluteUrl("/favicon.svg") || toAbsoluteUrl(siteConfig.ogImage),
  // Удалены ссылки на социальные сети, так как они не используются
});

const buildPersonJSONLD = () => ({
  "@context": "https://schema.org",
  "@type": "Person",
  name: siteConfig.distributor?.name || "",
  url: `${siteConfig.url}/about-me`,
  image: toAbsoluteUrl(siteConfig.ogImage || "/favicon.svg"),
  jobTitle: siteConfig.distributor?.title || "",
  worksFor: { "@type": "Organization", name: "4Life" },
  // Удалены ссылки на социальные сети, так как они не используются
});

export interface SEOProps {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  type?: "website" | "article" | "product";
  noIndex?: boolean;
  breadcrumbs?: { name: string; url: string }[];
  includeOrganizationAndPerson?: boolean;
  includeWebSiteSearch?: boolean;
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  path,
  image,
  type = "website",
  noIndex = false,
  breadcrumbs,
  includeOrganizationAndPerson = false,
  includeWebSiteSearch = false,
}) => {
  const url = toAbsoluteUrl(path) || siteConfig.url;
  const absoluteImage = toAbsoluteUrl(image || siteConfig.ogImage);
  const finalTitle = mergeTitle(title);

  type JsonLdObject = Record<string, unknown>;
  const jsonLd: JsonLdObject[] = [];
  const bc = buildBreadcrumbsJSONLD(breadcrumbs);
  if (bc) jsonLd.push(bc);
  if (includeWebSiteSearch) jsonLd.push(buildWebSiteSearchJSONLD());
  if (includeOrganizationAndPerson) {
    jsonLd.push(buildOrganizationJSONLD());
    jsonLd.push(buildPersonJSONLD());
  }

  return (
    <Helmet>
      <title>{finalTitle}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={noIndex ? "noindex, nofollow" : "index, follow"} />
      <link rel="canonical" href={url} />

      {/* Open Graph */}
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={absoluteImage} />
      <meta property="og:site_name" content={siteConfig.name} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={absoluteImage} />

      {/* JSON-LD */}
      {jsonLd.length > 0 && <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>}
    </Helmet>
  );
};
