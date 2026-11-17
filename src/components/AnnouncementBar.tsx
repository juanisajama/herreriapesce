import { useState } from "react";
import { X } from "lucide-react";

const ANNOUNCEMENT_MESSAGE =
  "🔥 ¡50% de descuento en toda la tienda! Aprovechá la promo en todos nuestros productos.";

export function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <aside
      role="region"
      aria-label="Anuncio"
      className="relative flex min-h-10 items-center justify-center bg-fire px-11 py-2 text-primary-foreground"
    >
      <p className="text-center text-xs font-semibold leading-relaxed sm:text-sm">
        {ANNOUNCEMENT_MESSAGE}
      </p>
      <button
        type="button"
        aria-label="Cerrar anuncio"
        onClick={() => setIsVisible(false)}
        className="absolute right-3 inline-flex h-7 w-7 items-center justify-center rounded-sm transition-colors hover:bg-black/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground"
      >
        <X aria-hidden="true" className="h-4 w-4" />
      </button>
    </aside>
  );
}
