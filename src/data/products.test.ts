import { describe, expect, it } from "vitest";

import { filterProducts, PRODUCTS } from "./products";

describe("filterProducts", () => {
  it("searches product names and descriptions without case or accent sensitivity", () => {
    expect(filterProducts(PRODUCTS, "MENSULAS", "all").map((product) => product.id)).toEqual([
      "mensulas-estante-x2",
    ]);
    expect(
      filterProducts(PRODUCTS, "patas reforzadas", "all").map((product) => product.id),
    ).toEqual(["parrilla-chulengo"]);
  });

  it("returns only products in the selected category", () => {
    expect(filterProducts(PRODUCTS, "", "Fitness").map((product) => product.id)).toEqual([
      "soporte-bici",
      "soporte-bolsa-box",
      "barra-ejercicio",
    ]);
  });
});
