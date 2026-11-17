import { createFileRoute } from "@tanstack/react-router";
import { PRODUCTS } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";
import whatsappLogo from "@/assets/6c784972cbf5806215d46fbda8b0c46a-removebg-preview.png";
import { createSeoHead } from "@/lib/seo";

export const Route = createFileRoute("/catalogo")({
  head: () =>
    createSeoHead({
      title: "Catálogo de Parrillas, Chulengos y Herrería | Herrería Pesce",
      description:
        "Conocé nuestras parrillas tambor, chulengos, fogoneros y productos de herrería artesanal. Fabricación en San Martín, Buenos Aires, con envíos a GBA y CABA.",
      path: "/catalogo",
    }),
  component: Catalogo,
});

function Catalogo() {
  const sortedProducts = [...PRODUCTS].sort((a, b) => {
    if (a.soldOut !== b.soldOut) return a.soldOut ? 1 : -1;
    return b.price - a.price;
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-14">
      <p className="text-sm font-bold uppercase tracking-[0.3em] text-primary">Hecho en el taller</p>
      <h1 className="text-6xl">Catálogo</h1>
      <p className="mt-2 max-w-xl text-muted-foreground">
        Elegí un producto para reservar tu fecha de entrega o retiro por{" "}
        <img
          src={whatsappLogo}
          alt="WhatsApp"
          width={500}
          height={500}
          className="inline-block h-[1em] w-[1em] align-[-0.15em] object-contain"
        />
      </p>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {sortedProducts.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
    </div>
  );
}
