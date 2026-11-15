import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { es } from "date-fns/locale";
import { ArrowLeft, Store, Truck, MessageCircle } from "lucide-react";
import { getProduct } from "@/data/products";
import { blockedRangesQuery } from "@/lib/queries";
import {
  DELIVERY_LABELS, buildWhatsAppMessage, depositAmount, formatARS, formatOrderPrice, isDateBlocked, whatsappUrl,
  type DeliveryMode,
} from "@/lib/booking";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/producto/$id")({
  loader: async ({ params, context }) => {
    const product = getProduct(params.id);
    if (!product) throw notFound();
    await context.queryClient.ensureQueryData(blockedRangesQuery);
    return { name: product.name, short: product.short };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.name} · Herrería Pesce` },
          { name: "description", content: `${loaderData.short} Reservá tu fecha y confirmá por WhatsApp.` },
          { property: "og:title", content: `${loaderData.name} · Herrería Pesce` },
          { property: "og:description", content: loaderData.short },
        ]
      : [{ title: "Producto · Herrería Pesce" }, { name: "robots", content: "noindex" }],
  }),
  notFoundComponent: () => (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <h1 className="text-5xl">Producto no encontrado</h1>
      <Link to="/catalogo" className="mt-4 inline-block text-primary">Volver al catálogo</Link>
    </div>
  ),
  component: ProductPage,
});

function ProductPage() {
  const { id } = Route.useParams();
  const product = getProduct(id)!;
  const { data: ranges } = useSuspenseQuery(blockedRangesQuery);
  const [date, setDate] = useState<Date>();
  const [delivery, setDelivery] = useState<DeliveryMode>();
  const [open, setOpen] = useState(false);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const sena = depositAmount(product.price, product.depositPercent);
  const ready = !!date && !!delivery;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <Link to="/catalogo" className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
        <ArrowLeft className="h-4 w-4" /> Catálogo
      </Link>
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <img src={product.image} alt={product.name} width={1024} height={768} className="w-full rounded-md border border-border object-cover" />
          <h1 className="mt-6 text-5xl">{product.name}</h1>
          <p className="text-muted-foreground">{product.short}</p>
          <dl className="mt-6 grid grid-cols-2 gap-3 text-sm">
            <Spec k="Medidas" v={product.dimensions} />
            <Spec k="Capacidad" v={product.capacity} />
            <Spec k="Material" v={product.material} />
            <Spec k="Seña requerida" v={`${product.depositPercent}% · ${formatARS(sena)}`} />
          </dl>
          <p className="mt-6 font-display text-5xl text-fire">{formatARS(product.price)}</p>
        </div>

        {product.soldOut ? (
          <section className="plate flex flex-col items-center justify-center gap-4 rounded-md p-8 text-center">
            <span className="rounded-sm border-2 border-primary px-4 py-2 font-display text-4xl uppercase tracking-widest text-primary">Sold out</span>
            <p className="text-muted-foreground">Por ahora no tenemos stock de este producto. Consultanos por WhatsApp y te avisamos cuando vuelva.</p>
            <Button asChild size="lg" className="bg-whatsapp font-bold uppercase text-whatsapp-foreground hover:bg-whatsapp/90">
              <a href={whatsappUrl(`¡Hola Herrería Pesce! Quería saber cuándo vuelve a haber stock de: ${product.name}`)} target="_blank" rel="noreferrer">
                <MessageCircle className="h-5 w-5" /> Consultar stock
              </a>
            </Button>
          </section>
        ) : (
        <div className="space-y-8">
          <section className="plate rounded-md p-5">
            <h2 className="text-3xl"><span className="text-primary">1.</span> Elegí la fecha</h2>
            <p className="mb-3 text-sm text-muted-foreground">Las fechas en gris no tienen disponibilidad.</p>
            <Calendar
              mode="single"
              locale={es}
              selected={date}
              onSelect={setDate}
              disabled={(d) => d < today || isDateBlocked(d, product.id, ranges)}
              className="mx-auto rounded-md border border-border bg-card p-3 pointer-events-auto [--cell-size:2.6rem]"
            />
          </section>

          <section className="plate rounded-md p-5">
            <h2 className="mb-3 text-3xl"><span className="text-primary">2.</span> Modalidad de entrega</h2>
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
                      delivery === m ? "border-primary bg-primary/10" : "border-border hover:border-steel",
                    )}
                  >
                    <Icon className="h-6 w-6 text-primary" />
                    <span className="font-semibold">{DELIVERY_LABELS[m]}</span>
                  </button>
                );
              })}
            </div>
          </section>

          <Button size="lg" disabled={!ready} onClick={() => setOpen(true)} className="w-full bg-fire py-6 text-lg font-bold uppercase text-primary-foreground shadow-fire">
            Confirmar reserva
          </Button>
        </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-display text-3xl">Resumen de tu reserva</DialogTitle>
            <DialogDescription>Revisá los datos y confirmá por WhatsApp para transferir la seña.</DialogDescription>
          </DialogHeader>
          {date && delivery && (
            <>
              <dl className="space-y-2 text-sm">
                <Row k="Producto" v={product.name} />
                <Row k="Fecha" v={date.toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })} />
                <Row k="Modalidad" v={DELIVERY_LABELS[delivery]} />
                <Row k="Precio" v={formatOrderPrice(product.price, delivery)} />
                <div className="flex justify-between border-t border-border pt-3 text-base">
                  <dt className="font-bold">Seña a transferir ({product.depositPercent}%)</dt>
                  <dd className="font-display text-2xl text-fire">{formatARS(sena)}</dd>
                </div>
              </dl>
              <Button asChild size="lg" className="mt-2 w-full bg-whatsapp font-bold uppercase text-whatsapp-foreground hover:bg-whatsapp/90">
                <a
                  href={whatsappUrl(buildWhatsAppMessage({ productName: product.name, date, delivery, price: product.price, depositPercent: product.depositPercent }))}
                  target="_blank"
                  rel="noreferrer"
                >
                  <MessageCircle className="h-5 w-5" /> Enviar por WhatsApp
                </a>
              </Button>
            </>
          )}
        </DialogContent>
      </Dialog>
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

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-muted-foreground">{k}</dt>
      <dd className="text-right font-semibold">{v}</dd>
    </div>
  );
}
