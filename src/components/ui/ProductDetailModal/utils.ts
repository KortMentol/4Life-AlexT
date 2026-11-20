import { DetailedProduct, GalleryItem } from "@/data/productsData";

const sharedOverviewVideo = "/videos/why-4life-transfer-factor.webm";

const getProductAura = (product: DetailedProduct): string => {
  const categories = product.categories.map((category) => category.toLocaleLowerCase("ru"));
  if (categories.some((category) => category.includes("энергия") || category.includes("спорт"))) return "rgba(6,182,212,0.24)";
  if (categories.some((category) => category.includes("красота") || category.includes("женск"))) return "rgba(185,151,74,0.22)";
  if (categories.some((category) => category.includes("пищевар") || category.includes("детокс"))) return "rgba(34,197,94,0.19)";
  if (categories.some((category) => category.includes("сердце") || category.includes("мозг"))) return "rgba(129,140,248,0.22)";
  return "rgba(6,182,212,0.20)";
};

export function buildGallery(product: DetailedProduct): GalleryItem[] {
  const gallery = product.gallery ?? [];
  const atmosphericImages = gallery.filter((item) => item.type === "image").slice(0, 2);
  const productAura = getProductAura(product);
  const cover: GalleryItem = {
    type: "image",
    src: product.image,
    alt: product.name,
    isProductCover: true,
    auraColor: productAura,
  };
  const extraImages: GalleryItem[] = atmosphericImages.map((item) => ({
    ...item,
    auraColor: productAura,
  }));
  const video = gallery.find((item) => item.type === "video" && !item.src.includes("w3schools.com"));
  const videoSlide: GalleryItem = {
    type: "video",
    src: video?.src ?? sharedOverviewVideo,
    poster: video?.poster ?? atmosphericImages[0]?.src ?? product.image,
    alt: video?.alt ?? `Общий обзор 4Life; видео не является инструкцией по применению ${product.name}`,
  };

  while (extraImages.length < 2) {
    extraImages.push({
      type: "image",
      src: product.image,
      alt: `${product.name} — изображение продукта`,
      auraColor: productAura,
    });
  }

  return [cover, extraImages[0]!, extraImages[1]!, videoSlide];
}

export const IS_TOUCH =
  typeof window !== "undefined"
    ? "ontouchstart" in window || navigator.maxTouchPoints > 0
    : false;
