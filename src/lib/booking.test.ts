import { describe, it, expect } from "vitest";
import { depositAmount, isDateBlocked, buildWhatsAppMessage, whatsappUrl } from "./booking";
import { getProduct } from "@/data/products";

describe("booking rules", () => {
  it("accessories require 10% deposit", () => {
    expect(getProduct("ganchos-x3")!.depositPercent).toBe(10);
    expect(depositAmount(18000, 10)).toBe(1800);
  });
  it("chulengo requires 30% deposit", () => {
    expect(getProduct("parrilla-chulengo")!.depositPercent).toBe(30);
    expect(depositAmount(380000, 30)).toBe(114000);
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
    const msg = buildWhatsAppMessage({ productName: "Parrilla", date: new Date(2026, 11, 10), delivery: "retiro", price: 380000, depositPercent: 30 });
    expect(msg).toContain("114.000");
    expect(whatsappUrl(msg).startsWith("https://wa.me/5491165961753?text=")).toBe(true);
  });
});
