import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search } from "lucide-react";
import {
  filterProducts,
  PRODUCT_CATEGORIES,
  PRODUCTS,
  type ProductCategoryFilter,
} from "@/data/products";
import { ProductCard } from "@/components/ProductCard";
import whatsappLogo from "@/assets/6c784972cbf5806215d46fbda8b0c46a-removebg-preview.png";
import { createSeoHead } from "@/lib/seo";
import { Input } from "@/components/ui/input";

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
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<ProductCategoryFilter>("all");
  const filteredProducts = filterProducts(PRODUCTS, search, category).sort((a, b) => {
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
      <section className="mt-8 space-y-5" aria-label="Buscar y filtrar productos">
        <div className="relative max-w-xl">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar por nombre o descripción..."
            aria-label="Buscar productos por nombre o descripción"
            className="h-12 pl-10"
          />
        </div>

        <div
          className="flex gap-2 overflow-x-auto pb-2"
          role="group"
          aria-label="Filtrar productos por categoría"
        >
          {[
            { label: "Todos", value: "all" as const },
            ...PRODUCT_CATEGORIES.map((item) => ({ label: item, value: item })),
          ].map((item) => {
            const isSelected = category === item.value;

            return (
              <button
                key={item.value}
                type="button"
                aria-pressed={isSelected}
                onClick={() => setCategory(item.value)}
                className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                  isSelected
                    ? "border-fire bg-fire text-primary-foreground"
                    : "border-border bg-card text-foreground hover:border-primary hover:text-primary"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </section>

      <p className="mt-3 text-sm text-muted-foreground" aria-live="polite">
        {filteredProducts.length} {filteredProducts.length === 1 ? "producto" : "productos"}
      </p>
      {filteredProducts.length > 0 ? (
        <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="animate-in fade-in-0 slide-in-from-bottom-2 duration-300"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      ) : (
        <div className="plate mt-4 rounded-md p-8 text-center">
          <p className="text-lg font-semibold">No encontramos productos</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Probá con otro término o elegí una categoría diferente.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setCategory("all");
            }}
            className="mt-4 text-sm font-bold text-primary underline-offset-4 hover:underline"
          >
            Limpiar búsqueda y filtros
          </button>
        </div>
      )}
    </div>
  );
}
