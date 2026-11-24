import { siteConfig } from "@/site-config/site";
import React, { useEffect } from "react";

const toAbsoluteUrl = (path?: string): string => {
  if (!path) return siteConfig.url;
  if (path.startsWith("http")) return path;
  const baseUrl = siteConfig.url.endsWith("/") ? siteConfig.url.slice(0, -1) : siteConfig.url;
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  return `${baseUrl}/${cleanPath}`;
};

const mergeTitle = (title?: string): string => {
  if (!title) return siteConfig.name;
  return title.includes(siteConfig.name) ? title : `${title} | ${siteConfig.name}`;
};

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
});

const buildPersonJSONLD = () => ({
  "@context": "https://schema.org",
  "@type": "Person",
  name: siteConfig.distributor?.name || "",
  url: `${siteConfig.url}/about-me`,
  image: toAbsoluteUrl(siteConfig.ogImage || "/favicon.svg"),
  jobTitle: siteConfig.distributor?.title || "",
  worksFor: { "@type": "Organization", name: "4Life" },
});

const upsertMeta = (attr: "name" | "property", key: string, content: string) => {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
};

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
  const finalDesc = description ?? siteConfig.description;

  useEffect(() => {
    document.title = finalTitle;
    upsertMeta("name", "description", finalDesc);
    upsertMeta("name", "robots", noIndex ? "noindex, nofollow" : "index, follow");
    upsertMeta("property", "og:title", finalTitle);
    upsertMeta("property", "og:description", finalDesc);
    upsertMeta("property", "og:type", type);
    upsertMeta("property", "og:url", url);
    upsertMeta("property", "og:image", absoluteImage);
    upsertMeta("property", "og:site_name", siteConfig.name);
    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", finalTitle);
    upsertMeta("name", "twitter:description", finalDesc);
    upsertMeta("name", "twitter:image", absoluteImage);

    let canonical = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = url;

    const jsonLd: Record<string, unknown>[] = [];
    const bc = buildBreadcrumbsJSONLD(breadcrumbs);
    if (bc) jsonLd.push(bc);
    if (includeWebSiteSearch) jsonLd.push(buildWebSiteSearchJSONLD());
    if (includeOrganizationAndPerson) {
      jsonLd.push(buildOrganizationJSONLD());
      jsonLd.push(buildPersonJSONLD());
    }

    const scriptId = "seo-json-ld-4life";
    let scriptEl = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (jsonLd.length > 0) {
      if (!scriptEl) {
        scriptEl = document.createElement("script");
        scriptEl.id = scriptId;
        scriptEl.type = "application/ld+json";
        document.head.appendChild(scriptEl);
      }
      scriptEl.textContent = JSON.stringify(jsonLd);
    } else if (scriptEl) {
      scriptEl.remove();
    }
  }, [
    finalTitle,
    finalDesc,
    noIndex,
    type,
    url,
    absoluteImage,
    breadcrumbs,
    includeWebSiteSearch,
    includeOrganizationAndPerson,
  ]);

  return null;
};