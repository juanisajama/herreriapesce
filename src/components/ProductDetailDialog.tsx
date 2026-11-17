import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { type Product } from "@/data/products";
import { formatARS, whatsappUrl } from "@/lib/booking";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Link } from "@tanstack/react-router";

export function ProductDetailDialog({ product }: { product: Product }) {
  const images = product.gallery?.length ? product.gallery : [product.image];
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariantId, setSelectedVariantId] = useState(product.variants?.[0]?.id ?? "");
  const selectedVariant = product.variants?.find((variant) => variant.id === selectedVariantId);
  const price = selectedVariant?.price ?? product.price;
  const selectedImage = images[selectedImageIndex] ?? product.image;
  const message = [
    `Hola Herrería Pesce, quiero ${product.soldOut ? "consultar stock de" : "consultar/encargar"} este producto:`,
    `• Producto: ${product.name}`,
    selectedVariant ? `• Variante: ${selectedVariant.name}` : "",
    `• Precio: ${formatARS(price)}`,
    "¿Me pasan más información? ¡Gracias!",
  ]
    .filter(Boolean)
    .join("\n");

  return (
    <DialogContent className="max-h-[90vh] w-[calc(100%-1rem)] max-w-4xl overflow-y-auto p-4 sm:p-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="min-w-0">
          <div className="aspect-[4/3] overflow-hidden rounded-md border border-border bg-card">
            <img
              src={selectedImage}
              alt={`${product.name}, imagen ${selectedImageIndex + 1}`}
              width={1200}
              height={900}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-contain"
            />
          </div>
          {images.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
              {images.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  aria-label={`Ver imagen ${index + 1} de ${product.name}`}
                  aria-pressed={selectedImageIndex === index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`h-16 w-20 shrink-0 overflow-hidden rounded-sm border-2 transition-colors ${
                    selectedImageIndex === index
                      ? "border-gold"
                      : "border-border hover:border-gold/60"
                  }`}
                >
                  <img
                    src={image}
                    alt=""
                    aria-hidden="true"
                    width={160}
                    height={120}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="min-w-0">
          <DialogHeader className="pr-8 text-left">
            <DialogTitle className="text-3xl leading-tight">{product.name}</DialogTitle>
            <DialogDescription>{product.short}</DialogDescription>
          </DialogHeader>

          <dl className="mt-5 grid gap-3 sm:grid-cols-2">
            {[
              { label: "Medidas", value: product.dimensions },
              { label: "Material / espesor", value: product.material },
              { label: "Capacidad / carga", value: product.capacity },
              { label: "Terminación", value: product.finish ?? "Consultar opciones disponibles" },
            ].map((spec) => (
              <div key={spec.label} className="rounded-md border border-border bg-card p-3">
                <dt className="text-xs font-semibold uppercase text-muted-foreground">
                  {spec.label}
                </dt>
                <dd className="mt-1 text-sm font-medium">{spec.value}</dd>
              </div>
            ))}
          </dl>

          {!!product.variants?.length && (
            <label className="mt-5 block space-y-2 text-sm font-semibold">
              Variante
              <select
                value={selectedVariantId}
                onChange={(event) => setSelectedVariantId(event.currentTarget.value)}
                className="h-11 w-full rounded-md border border-input bg-background px-3 font-normal text-foreground outline-none transition focus-visible:ring-2 focus-visible:ring-ring"
              >
                {product.variants.map((variant) => (
                  <option key={variant.id} value={variant.id}>
                    {variant.name}
                  </option>
                ))}
              </select>
            </label>
          )}

          <div className="mt-5 border-t border-border pt-4">
            <p className="text-xs font-semibold uppercase text-muted-foreground">Precio</p>
            <p className="font-display text-4xl text-fire">{formatARS(price)}</p>
          </div>

          <div className="mt-5 space-y-3">
            <Button
              asChild
              size="lg"
              className="w-full bg-whatsapp py-6 text-base font-bold uppercase text-whatsapp-foreground hover:bg-whatsapp-hover"
            >
              <a href={whatsappUrl(message)} target="_blank" rel="noreferrer">
                <MessageCircle aria-hidden="true" className="h-5 w-5" />
                {product.soldOut ? "Consultar stock por WhatsApp" : "Consultar / Encargar por WhatsApp"}
              </a>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link to="/producto/$id" params={{ id: product.id }}>
                Ver página y reservar
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </DialogContent>
  );
}
