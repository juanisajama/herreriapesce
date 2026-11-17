import chulengoImage from "@/assets/chulengo.jpg";

const SITE_ORIGIN = "https://herreriapesce.a-juansajama.workers.dev";
const DEFAULT_IMAGE = new URL(chulengoImage, SITE_ORIGIN).href;

type SeoHeadOptions = {
  title: string;
  description: string;
  path: string;
  image?: string;
  imageAlt?: string;
};

export function createSeoHead({
  title,
  description,
  path,
  image = DEFAULT_IMAGE,
  imageAlt = "Parrilla tambor chulengo fabricada artesanalmente por Herrería Pesce",
}: SeoHeadOptions) {
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: new URL(path, SITE_ORIGIN).href },
      { property: "og:image", content: new URL(image, SITE_ORIGIN).href },
      { property: "og:image:alt", content: imageAlt },
      { property: "og:image:type", content: "image/jpeg" },
      { property: "og:image:width", content: "1024" },
      { property: "og:image:height", content: "768" },
      { property: "og:locale", content: "es_AR" },
      { property: "og:site_name", content: "Herrería Pesce" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: new URL(image, SITE_ORIGIN).href },
    ],
    links: [{ rel: "canonical", href: new URL(path, SITE_ORIGIN).href }],
  };
}
