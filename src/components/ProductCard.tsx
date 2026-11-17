import { Ruler, Weight, Wrench } from "lucide-react";
import { useState } from "react";
import { getOriginalPrice, type Product } from "@/data/products";
import { formatARS } from "@/lib/booking";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { ProductDetailDialog } from "@/components/ProductDetailDialog";

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className="group relative h-full">
        <article className="plate flex h-full flex-col overflow-hidden rounded-md transition group-hover:border-primary group-hover:shadow-fire">
          <div className="relative aspect-[4/3] overflow-hidden bg-card p-1">
            <img
              src={product.image}
              alt={product.name}
              loading={priority ? "eager" : "lazy"}
              decoding="async"
              fetchPriority={priority ? "high" : "auto"}
              width={1200}
              height={896}
              className="h-full w-full rounded-sm object-cover transition duration-500 group-hover:scale-105"
            />
            <span className="absolute left-3 top-3 rounded-sm bg-fire px-2 py-1 text-xs font-bold uppercase text-primary-foreground">
              {product.discountPercent}% OFF
            </span>
            {product.soldOut && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/70">
                <span className="-rotate-6 rounded-sm border-2 border-primary bg-background px-4 py-2 font-display text-3xl uppercase tracking-widest text-primary">
                  Sold out
                </span>
              </div>
            )}
          </div>
          <div className="flex flex-1 flex-col gap-3 p-5">
            <h3 className="text-2xl">{product.name}</h3>
            <p className="text-sm text-muted-foreground">{product.short}</p>
            <ul className="space-y-1.5 text-sm">
              <li className="flex gap-2">
                <Ruler aria-hidden="true" className="h-4 w-4 shrink-0 text-primary" />
                {product.dimensions}
              </li>
              <li className="flex gap-2">
                <Weight aria-hidden="true" className="h-4 w-4 shrink-0 text-primary" />
                {product.capacity}
              </li>
              <li className="flex gap-2">
                <Wrench aria-hidden="true" className="h-4 w-4 shrink-0 text-primary" />
                {product.material}
              </li>
            </ul>
            <div className="mt-auto flex items-end justify-between border-t border-border pt-4">
              <div>
                <p className="text-xs uppercase text-muted-foreground">Precio</p>
                <div className="flex flex-wrap items-baseline gap-x-2">
                  <p className="font-display text-3xl text-fire">{formatARS(product.price)}</p>
                  <del className="text-sm text-muted-foreground">
                    {formatARS(getOriginalPrice(product))}
                  </del>
                </div>
              </div>
              <span
                className={`text-sm font-bold uppercase ${
                  product.soldOut ? "text-muted-foreground" : "text-primary"
                }`}
              >
                {product.soldOut ? "Sin stock" : "Ver detalle"}
              </span>
            </div>
          </div>
        </article>
        <DialogTrigger asChild>
          <button
            type="button"
            aria-label={`Ver detalle de ${product.name}`}
            className="absolute inset-0 z-10 cursor-pointer rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
          />
        </DialogTrigger>
      </div>
      <ProductDetailDialog product={product} />
    </Dialog>
  );
}
