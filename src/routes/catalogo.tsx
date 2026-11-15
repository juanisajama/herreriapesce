import { createFileRoute } from "@tanstack/react-router";
import { PRODUCTS } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";
import whatsappLogo from "@/assets/6c784972cbf5806215d46fbda8b0c46a-removebg-preview.png";

export const Route = createFileRoute("/catalogo")({
  head: () => ({
    meta: [
      { title: "Catálogo · Herrería Pesce" },
      { name: "description", content: "Ganchos, parrilla chulengo, soportes de bici y bolsa de box, barra de ejercicio. Medidas, capacidad, precio y seña." },
      { property: "og:title", content: "Catálogo · Herrería Pesce" },
      { property: "og:description", content: "Productos de herrería artesanal con medidas, capacidad y precio." },
    ],
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
