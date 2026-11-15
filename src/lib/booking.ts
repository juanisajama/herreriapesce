export const WHATSAPP_NUMBER = "5491165961753";

export type DeliveryMode = "retiro" | "envio";

export const DELIVERY_LABELS: Record<DeliveryMode, string> = {
  retiro: "Retiro gratis en taller (San Martín)",
  envio: "Envío a domicilio (desde $15.000 ARS en AMBA)",
};

export type BlockedRange = {
  id: string;
  product_id: string | null;
  start_date: string; // yyyy-MM-dd
  end_date: string;
  reason: string | null;
};

export function formatARS(n: number) {
  return "$" + Math.round(n).toLocaleString("es-AR");
}

export function formatOrderPrice(price: number, delivery: DeliveryMode) {
  const formattedPrice = formatARS(price);
  return delivery === "envio" ? `${formattedPrice} + ENVÍO` : formattedPrice;
}

export function depositAmount(price: number, percent: number) {
  return Math.round((price * percent) / 100);
}

export function toISODate(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function isDateBlocked(date: Date, productId: string, ranges: BlockedRange[]) {
  const iso = toISODate(date);
  return ranges.some(
    (r) =>
      (r.product_id === null || r.product_id === productId) &&
      iso >= r.start_date &&
      iso <= r.end_date,
  );
}

export function buildWhatsAppMessage(args: {
  productName: string;
  date: Date;
  delivery: DeliveryMode;
  price: number;
  depositPercent: number;
}) {
  const fecha = args.date.toLocaleDateString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const sena = depositAmount(args.price, args.depositPercent);
  return [
    "¡Hola Herrería Pesce! Quiero reservar:",
    `• Producto: ${args.productName}`,
    `• Fecha de entrega/retiro: ${fecha}`,
    `• Modalidad: ${DELIVERY_LABELS[args.delivery]}`,
    `• Precio: ${formatOrderPrice(args.price, args.delivery)}`,
    `• Seña a transferir (${args.depositPercent}%): ${formatARS(sena)}`,
    args.delivery === "envio" ? "Quedo atento al costo del envío según mi zona." : "",
    "¿Me pasan los datos para transferir? ¡Gracias!",
  ]
    .filter(Boolean)
    .join("\n");
}

export function whatsappUrl(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
