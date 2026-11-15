import { describe, it, expect } from "vitest";
import { depositAmount, isDateBlocked, buildProductInquiryMessage, buildWhatsAppMessage, whatsappUrl } from "./booking";
import { getOriginalPrice, getProduct, PRODUCTS } from "@/data/products";

describe("booking rules", () => {
  it("accessories require 10% deposit", () => {
    expect(getProduct("ganchos-x3")!.depositPercent).toBe(10);
    expect(getProduct("ganchos-x3")!.price).toBe(20000);
    expect(depositAmount(20000, 10)).toBe(2000);
  });
  it("chulengo costs 180.000 with 20% deposit", () => {
    const p = getProduct("parrilla-chulengo")!;
    expect(p.price).toBe(180000);
    expect(p.depositPercent).toBe(20);
    expect(depositAmount(p.price, p.depositPercent)).toBe(36000);
  });
  it("bolsa box support costs 50.000", () => {
    expect(getProduct("soporte-bolsa-box")!.price).toBe(50000);
  });
  it("custom shelf brackets are sold as a pair for 18.000", () => {
    const product = getProduct("mensulas-estante-x2")!;
    expect(product.name).toBe("Ménsulas de hierro para estante x2");
    expect(product.price).toBe(18000);
    expect(product.dimensions).toBe("A medida, según pedido");
    expect(product.discountPercent).toBe(50);
  });
  it("coffee table has the requested dimensions and 200.000 price", () => {
    const product = getProduct("mesa-ratona-hierro")!;
    expect(product.price).toBe(200000);
    expect(product.dimensions).toBe("80 cm (ancho) × 50 cm (prof.) × 42 cm (alto)");
    expect(product.material).toContain("tapa de chapa de acero reforzada de 1,2 mm");
    expect(product.material).toContain("patas con regatones");
  });
  it("exercise bar is sold out, others are not", () => {
    expect(getProduct("barra-ejercicio")!.soldOut).toBe(true);
    expect(getProduct("soporte-bici")!.soldOut).toBeFalsy();
  });
  it("shows a 50% discount for every product", () => {
    for (const product of PRODUCTS) {
      expect(product.discountPercent).toBe(50);
      expect(getOriginalPrice(product)).toBe(product.price * 2);
    }
  });
  it("blocks dates inside a product range and global ranges", () => {
    const ranges = [
      { id: "1", product_id: "soporte-bici", start_date: "2026-12-01", end_date: "2026-12-05", reason: null },
      { id: "2", product_id: null, start_date: "2026-12-24", end_date: "2026-12-25", reason: null },
    ];
    expect(isDateBlocked(new Date(2026, 11, 3), "soporte-bici", ranges)).toBe(true);
    expect(isDateBlocked(new Date(2026, 11, 3), "ganchos-x3", ranges)).toBe(false);
    expect(isDateBlocked(new Date(2026, 11, 6), "soporte-bici", ranges)).toBe(false);
    expect(isDateBlocked(new Date(2026, 11, 25), "ganchos-x3", ranges)).toBe(true);
  });
  it("WhatsApp link goes to the workshop number with the deposit", () => {
    const msg = buildWhatsAppMessage({ productName: "Parrilla", date: new Date(2026, 11, 10), delivery: "retiro", price: 180000, depositPercent: 20 });
    expect(msg).toContain("36.000");
    expect(whatsappUrl(msg).startsWith("https://wa.me/5491165961753?text=")).toBe(true);
  });
  it("shows shipping as an extra charge in the reservation price", () => {
    const msg = buildWhatsAppMessage({ productName: "Parrilla", date: new Date(2026, 11, 10), delivery: "envio", price: 180000, depositPercent: 20 });
    expect(msg).toContain("• Precio: $180.000 + ENVÍO");
    expect(msg).toContain("• Seña a transferir (20%): $36.000");
  });
  it("builds a WhatsApp product inquiry without reservation dates or deposits", () => {
    const msg = buildProductInquiryMessage({ productName: "Parrilla", delivery: "envio", price: 180000 });
    expect(msg).toContain("• Producto: Parrilla");
    expect(msg).toContain("• Modalidad: Envío a domicilio (desde $15.000 ARS en AMBA)");
    expect(msg).toContain("• Precio: $180.000 + ENVÍO");
    expect(msg).not.toContain("Fecha");
    expect(msg).not.toContain("Seña");
  });
});
