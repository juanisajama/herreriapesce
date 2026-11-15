import { createFileRoute, Link } from "@tanstack/react-router";
import { Hammer, CalendarCheck, MessageCircle } from "lucide-react";
import hero from "@/assets/hero.jpg";
import { PRODUCTS } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";
import { ReviewsSection } from "@/components/ReviewsSection";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Herrería Pesce · Hierro forjado a mano en San Martín" },
      { name: "description", content: "Parrillas chulengo, soportes de pared y accesorios de hierro artesanales. Reservá tu fecha y confirmá por WhatsApp." },
      { property: "og:title", content: "Herrería Pesce · Hierro forjado a mano" },
      { property: "og:description", content: "Parrillas, soportes y accesorios de hierro hechos en San Martín, Buenos Aires." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <section className="relative isolate overflow-hidden">
        <img src={hero} alt="Herrero forjando hierro al rojo en el yunque" width={1920} height={1088} className="absolute inset-0 -z-10 h-full w-full object-cover" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-background via-background/80 to-background/20" />
        <div className="mx-auto max-w-6xl px-4 py-28 md:py-40">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.3em] text-primary">San Martín · Buenos Aires</p>
          <h1 className="max-w-2xl text-6xl leading-none md:text-8xl">
            Hierro forjado <span className="text-fire">a fuego</span> y a mano.
          </h1>
          <p className="mt-6 max-w-lg text-lg text-muted-foreground">
            Parrillas, soportes y accesorios hechos para durar. Elegí tu producto, reservá la fecha y cerrá por WhatsApp.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button
              asChild
              size="lg"
              className="h-14 bg-fire px-8 text-base font-bold uppercase text-primary-foreground shadow-fire transition-transform hover:scale-105 md:px-10 md:text-lg"
            >
              <Link to="/catalogo">Ver catálogo</Link>
            </Button>
            <Button
              asChild
              size="lg"
              className="h-14 bg-whatsapp px-8 text-base font-bold uppercase text-whatsapp-foreground shadow-lg transition-transform hover:scale-105 hover:bg-whatsapp/90 md:px-10 md:text-lg"
            >
              <a href="https://wa.me/5491165961753" target="_blank" rel="noreferrer">
                <MessageCircle aria-hidden="true" />
                Consultar
              </a>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-4 px-4 py-16 md:grid-cols-3">
        {[
          { icon: Hammer, t: "Elegí tu pieza", d: "Hecha a mano en nuestro taller." },
          { icon: CalendarCheck, t: "Reservá la fecha", d: "Retiro gratis o envío en AMBA." },
          { icon: MessageCircle, t: "Confirmá por WhatsApp", d: "Transferís la seña y listo." },
        ].map(({ icon: Icon, t, d }, i) => (
          <div key={t} className="plate rounded-md p-6">
            <span className="font-display text-5xl text-steel">0{i + 1}</span>
            <Icon className="mt-2 h-7 w-7 text-primary" />
            <h3 className="mt-3 text-2xl">{t}</h3>
            <p className="text-sm text-muted-foreground">{d}</p>
          </div>
        ))}
      </section>

      <ReviewsSection />

      <section className="mx-auto max-w-6xl px-4">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="text-5xl">Destacados</h2>
          <Link to="/catalogo" className="text-sm font-bold uppercase text-primary">Ver todo →</Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PRODUCTS.slice(0, 3).map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>
    </>
  );
}
