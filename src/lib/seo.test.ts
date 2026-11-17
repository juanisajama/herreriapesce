import { describe, expect, it } from "vitest";

import { createSeoHead } from "./seo";

describe("createSeoHead", () => {
  it("uses absolute canonical and social image URLs for each route", () => {
    const head = createSeoHead({
      title: "Parrilla tambor | Herrería Pesce",
      description: "Parrilla artesanal en San Martín.",
      path: "/producto/parrilla-chulengo",
      image: "/assets/chulengo.jpg",
    });

    expect(head.links).toContainEqual({
      rel: "canonical",
      href: "https://herreriapesce.a-juansajama.workers.dev/producto/parrilla-chulengo",
    });
    expect(head.meta).toContainEqual({
      property: "og:url",
      content: "https://herreriapesce.a-juansajama.workers.dev/producto/parrilla-chulengo",
    });
    expect(head.meta).toContainEqual({
      property: "og:image",
      content: "https://herreriapesce.a-juansajama.workers.dev/assets/chulengo.jpg",
    });
    expect(head.meta).toContainEqual({
      name: "twitter:card",
      content: "summary_large_image",
    });
  });
});
