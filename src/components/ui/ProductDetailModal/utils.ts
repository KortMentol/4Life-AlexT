import cellularMacroImg from "@/assets/images/cellular_macro_obsidian_1795192950822.jpg";
import showcaseOpticsImg from "@/assets/images/showcase_immune_optics_1795221771793.jpg";
import utahLabImg from "@/assets/images/utah_cgmp_laboratory_1795192951687.jpg";
import chapterQualityImg from "@/assets/images/video_chapter_quality_1795221773477.jpg";
import chapterScienceImg from "@/assets/images/video_chapter_science_1795221772449.jpg";
import chapterVitalityImg from "@/assets/images/video_chapter_vitality_1795221772807.jpg";
import { DetailedProduct, GalleryItem } from "@/data/productsData";
import { buildNormalizedGallery } from "@/utils/catalogHelpers";

const LOCAL_GALLERY_POOL = [
  chapterScienceImg,
  chapterQualityImg,
  cellularMacroImg,
  utahLabImg,
  showcaseOpticsImg,
  chapterVitalityImg,
] as const;

function hashString(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i += 1) {
    h = (h * 31 + input.charCodeAt(i)) >>> 0;
  }
  return h;
}

/**
 * Normalizes product gallery into 4 crisp local-asset-backed slots (zero broken external Unsplash URLs).
 */
export function buildGallery(product: DetailedProduct): GalleryItem[] {
  const normalized = buildNormalizedGallery(product);
  const seed = hashString(product.id);
  const localPhoto1 = LOCAL_GALLERY_POOL[seed % LOCAL_GALLERY_POOL.length] ?? chapterScienceImg;
  const localPhoto2 = LOCAL_GALLERY_POOL[(seed + 2) % LOCAL_GALLERY_POOL.length] ?? chapterQualityImg;
  const localPoster = LOCAL_GALLERY_POOL[(seed + 4) % LOCAL_GALLERY_POOL.length] ?? cellularMacroImg;

  return normalized.map((item, idx) => {
    if (idx === 0) return item;
    if (item.type === "video") {
      return {
        ...item,
        poster: item.poster && !item.poster.includes("unsplash.com") ? item.poster : localPoster,
      };
    }
    const isExternalStock = item.src.includes("unsplash.com");
    if (!isExternalStock) return item;
    return {
      ...item,
      src: idx === 1 ? localPhoto1 : localPhoto2,
    };
  });
}

export const IS_TOUCH =
  typeof window !== "undefined"
    ? "ontouchstart" in window || navigator.maxTouchPoints > 0
    : false;