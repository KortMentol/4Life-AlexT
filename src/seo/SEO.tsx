import React from "react";
import { Helmet } from "react-helmet-async";
import { siteConfig } from "@/site-config/site";

export type BreadcrumbItem = {
  name: string;
  url: string;
};

export type SEOProps = {
  title: string;
  description: string;
  path: string; // URL path starting with '/'
  image?: string; // absolute or relative url
  type?: "website" | "article" | "profile" | string;
  noIndex?: boolean;
  breadcrumbs?: BreadcrumbItem[];
  includeOrganizationAndPerson?: boolean; // put org/person JSON-LD (e.g., on Home)
  includeWebSiteSearch?: boolean; // add WebSite SearchAction JSON-LD (usually Home)
};

const toAbsoluteUrl = (maybeUrl?: string): string | undefined => {
  if (!maybeUrl) return undefined;
  if (maybeUrl.startsWith("http://") || maybeUrl.startsWith("https://")) return maybeUrl;
  const base = siteConfig.url.replace(/\/$/, "");
  const rel = maybeUrl.startsWith("/") ? maybeUrl : `/${maybeUrl}`;
  return `${base}${rel}`;
};

const mergeTitle = (title: string) => {
  const brand = siteConfig.name;
  // Avoid duplicating brand if already present
  return title.includes(brand) ? title : `${title} | ${brand}`;
};

const buildBreadcrumbsJSONLD = (items: BreadcrumbItem[] | undefined) => {
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
  sameAs: [
    siteConfig.socialLinks?.instagram,
    siteConfig.socialLinks?.youtube,
    siteConfig.socialLinks?.twitter,
    siteConfig.socialLinks?.facebook,
  ].filter(Boolean),
});

const buildPersonJSONLD = () => ({
  "@context": "https://schema.org",
  "@type": "Person",
  name: siteConfig.distributor?.name || "",
  url: `${siteConfig.url}/about-me`,
  image: toAbsoluteUrl(siteConfig.ogImage || "/favicon.svg"),
  jobTitle: siteConfig.distributor?.title || "",
  worksFor: { "@type": "Organization", name: "4Life" },
  sameAs: [
    siteConfig.socialLinks?.instagram,
    siteConfig.socialLinks?.youtube,
    siteConfig.socialLinks?.twitter,
    siteConfig.socialLinks?.facebook,
  ].filter(Boolean),
});

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

  const jsonLd: any[] = [];
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

      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      {url && <meta property="og:url" content={url} />}
      {absoluteImage && <meta property="og:image" content={absoluteImage} />}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={description} />
      {absoluteImage && <meta name="twitter:image" content={absoluteImage} />}

      {jsonLd.length > 0 && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  );
};

export default SEO;
