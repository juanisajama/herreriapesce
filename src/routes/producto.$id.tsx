import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Store, Truck, MessageCircle } from "lucide-react";
import { getOriginalPrice, getProduct } from "@/data/products";
import {
  DELIVERY_LABELS,
  buildProductInquiryMessage,
  formatARS,
  formatOrderPrice,
  whatsappUrl,
  type DeliveryMode,
} from "@/lib/booking";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ProductReviewsPreview } from "@/components/ProductReviewsPreview";
import { createSeoHead } from "@/lib/seo";

export const Route = createFileRoute("/producto/$id")({
  loader: ({ params }) => {
    const product = getProduct(params.id);
    if (!product) throw notFound();
    return { id: product.id, name: product.name, short: product.short, image: product.image };
  },
  head: ({ loaderData }) =>
    loaderData
      ? createSeoHead({
          title: `${loaderData.name} | Herrería Pesce en San Martín`,
          description: `${loaderData.short} Fabricación artesanal en San Martín, Buenos Aires. Consultá disponibilidad y envíos a GBA y CABA.`,
          path: `/producto/${loaderData.id}`,
          image: loaderData.image,
          imageAlt: `${loaderData.name} fabricado por Herrería Pesce`,
        })
      : {
          meta: [{ title: "Producto | Herrería Pesce" }, { name: "robots", content: "noindex" }],
        },
  notFoundComponent: () => (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <h1 className="text-5xl">Producto no encontrado</h1>
      <Link to="/catalogo" className="mt-4 inline-block text-primary">
        Volver al catálogo
      </Link>
    </div>
  ),
  component: ProductPage,
});

function ProductPage() {
  const { id } = Route.useParams();
  const product = getProduct(id)!;
  const [delivery, setDelivery] = useState<DeliveryMode>();
  const [city, setCity] = useState("");
  const inquiryUrl =
    delivery === "envio" && city.trim()
      ? whatsappUrl(
          buildProductInquiryMessage({
            productName: product.name,
            delivery,
            price: product.price,
            city: city.trim(),
          }),
        )
      : delivery === "retiro"
        ? whatsappUrl(
            buildProductInquiryMessage({
              productName: product.name,
              delivery,
              price: product.price,
            }),
          )
        : undefined;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <Link
        to="/catalogo"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" /> Catálogo
      </Link>
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <img
            src={product.image}
            alt={product.name}
            width={1200}
            height={896}
            className="w-full rounded-md border border-border object-cover"
          />
          <h1 className="mt-6 text-5xl">{product.name}</h1>
          <p className="text-muted-foreground">{product.short}</p>
          <dl className="mt-6 grid grid-cols-2 gap-3 text-sm">
            <Spec k="Medidas" v={product.dimensions} />
            <Spec k="Capacidad" v={product.capacity} />
            <Spec k="Material" v={product.material} />
          </dl>
          <div className="mt-6 flex flex-wrap items-baseline gap-3">
            <p className="font-display text-5xl text-fire">{formatARS(product.price)}</p>
            <del className="font-display text-2xl text-muted-foreground">
              {formatARS(getOriginalPrice(product))}
            </del>
            <span className="rounded-sm bg-fire px-2 py-1 text-xs font-bold uppercase text-primary-foreground">
              {product.discountPercent}% OFF
            </span>
          </div>
        </div>

        {product.soldOut ? (
          <section className="plate flex flex-col items-center justify-center gap-4 rounded-md p-8 text-center">
            <span className="rounded-sm border-2 border-primary px-4 py-2 font-display text-4xl uppercase tracking-widest text-primary">
              Sold out
            </span>
            <p className="text-muted-foreground">
              Por ahora no tenemos stock de este producto. Consultanos por WhatsApp y te avisamos
              cuando vuelva.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-whatsapp font-bold uppercase text-whatsapp-foreground hover:bg-whatsapp/90"
            >
              <a
                href={whatsappUrl(
                  `¡Hola Herrería Pesce! Quería saber cuándo vuelve a haber stock de: ${product.name}`,
                )}
                target="_blank"
                rel="noreferrer"
              >
                <MessageCircle className="h-5 w-5" /> Consultar stock
              </a>
            </Button>
          </section>
        ) : (
          <div className="space-y-8">
            <section className="plate rounded-md p-5">
              <h2 className="mb-3 text-3xl">Modalidad de entrega</h2>
              <div className="grid gap-3">
                {(["retiro", "envio"] as const).map((m) => {
                  const Icon = m === "retiro" ? Store : Truck;
                  return (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setDelivery(m)}
                      className={cn(
                        "flex items-center gap-3 rounded-md border p-4 text-left transition",
                        delivery === m
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-steel",
                      )}
                    >
                      <Icon className="h-6 w-6 text-primary" />
                      <span className="font-semibold">{DELIVERY_LABELS[m]}</span>
                    </button>
                  );
                })}
              </div>
              {delivery === "envio" && (
                <div className="mt-4 space-y-2">
                  <Label htmlFor="shipping-city">Ciudad</Label>
                  <Input
                    id="shipping-city"
                    value={city}
                    onChange={(event) => setCity(event.target.value)}
                    placeholder="Ej. San Martín"
                    autoComplete="address-level2"
                    maxLength={100}
                    required
                  />
                </div>
              )}
              {delivery && (
                <p className="mt-4 flex justify-between gap-4 border-t border-border pt-4 text-sm">
                  <span>Precio</span>
                  <span className="font-bold">{formatOrderPrice(product.price, delivery)}</span>
                </p>
              )}
            </section>

            {inquiryUrl ? (
              <Button
                asChild
                size="lg"
                className="w-full bg-whatsapp py-6 text-lg font-bold uppercase text-whatsapp-foreground hover:bg-whatsapp/90"
              >
                <a
                  href={inquiryUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  <MessageCircle className="h-5 w-5" /> Consultar por WhatsApp
                </a>
              </Button>
            ) : (
              <Button size="lg" disabled className="w-full py-6 text-lg font-bold uppercase">
                {delivery === "envio" ? "Ingresá tu ciudad" : "Elegí retiro o envío"}
              </Button>
            )}
          </div>
        )}
      </div>
      <ProductReviewsPreview />
    </div>
  );
}
function Spec({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-md border border-border bg-card p-3">
      <dt className="text-xs uppercase text-muted-foreground">{k}</dt>
      <dd className="font-semibold">{v}</dd>
    </div>
  );
}
