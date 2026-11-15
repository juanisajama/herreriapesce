import { Link } from "@tanstack/react-router";
import { Ruler, Weight, Wrench } from "lucide-react";
import type { Product } from "@/data/products";
import { formatARS } from "@/lib/booking";
import { Button } from "@/components/ui/button";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="plate group flex flex-col overflow-hidden rounded-md transition hover:border-primary hover:shadow-fire">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img src={product.image} alt={product.name} loading="lazy" width={1024} height={768} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        <span className="absolute left-3 top-3 rounded-sm bg-fire px-2 py-1 text-xs font-bold uppercase text-primary-foreground">
          Seña {product.depositPercent}%
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="text-2xl">{product.name}</h3>
        <p className="text-sm text-muted-foreground">{product.short}</p>
        <ul className="space-y-1.5 text-sm">
          <li className="flex gap-2"><Ruler className="h-4 w-4 shrink-0 text-primary" />{product.dimensions}</li>
          <li className="flex gap-2"><Weight className="h-4 w-4 shrink-0 text-primary" />{product.capacity}</li>
          <li className="flex gap-2"><Wrench className="h-4 w-4 shrink-0 text-primary" />{product.material}</li>
        </ul>
        <div className="mt-auto flex items-end justify-between border-t border-border pt-4">
          <div>
            <p className="text-xs uppercase text-muted-foreground">Precio</p>
            <p className="font-display text-3xl text-fire">{formatARS(product.price)}</p>
          </div>
          <Button asChild className="bg-fire font-bold uppercase text-primary-foreground">
            <Link to="/producto/$id" params={{ id: product.id }}>Reservar</Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
