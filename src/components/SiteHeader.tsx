import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import emblem from "@/assets/Emblema_pez-yunque_de_metal_incandescente-removebg-preview.png";

export function SiteHeader() {
  const [isCompact, setIsCompact] = useState(false);

  useEffect(() => {
    const updateHeader = () => setIsCompact(window.scrollY > 72);

    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
    return () => window.removeEventListener("scroll", updateHeader);
  }, []);

  const linkStyle = isCompact
    ? "rounded-md border border-border bg-card px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-foreground transition-colors hover:border-primary hover:text-primary"
    : "text-muted-foreground hover:text-foreground";

  return (
    <header
      className={`sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur transition-shadow duration-200 ${
        isCompact ? "shadow-md shadow-background/50" : ""
      }`}
    >
      <div
        className={`mx-auto flex max-w-6xl items-center justify-between px-4 transition-[padding] duration-200 ${
          isCompact ? "py-1.5" : "py-3"
        }`}
      >
        <Link
          to="/"
          aria-label="Herrería Pesce, inicio"
          className="flex items-center gap-2"
        >
          <img
            src={emblem}
            alt=""
            aria-hidden="true"
            width={isCompact ? 28 : 32}
            height={isCompact ? 28 : 32}
            decoding="async"
            className={`object-contain ${isCompact ? "h-7 w-7" : "h-8 w-8"}`}
          />
          <span className={`font-display tracking-wider ${isCompact ? "sr-only" : "text-2xl"}`}>
            HERRERÍA <span className="text-primary">PESCE</span>
          </span>
        </Link>
        <nav
          aria-label="Navegación principal"
          className={`flex items-center font-semibold uppercase tracking-wide ${
            isCompact ? "gap-2" : "gap-6 text-sm"
          }`}
        >
          <Link
            to="/"
            className={linkStyle}
            activeOptions={{ exact: true }}
            activeProps={{ className: "text-primary border-primary" }}
          >
            Inicio
          </Link>
          <Link
            to="/catalogo"
            className={linkStyle}
            activeProps={{ className: "text-primary border-primary" }}
          >
            Catálogo
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-border bg-card">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 text-sm text-muted-foreground md:grid-cols-3">
        <div>
          <p className="font-display text-xl text-foreground">HERRERÍA PESCE</p>
          <p>Herrería artesanal · San Martín, Buenos Aires · 30 años de experiencia</p>
        </div>
        <div>
          <p className="font-semibold text-foreground">Contacto</p>
          <a href="https://wa.me/5491165961753" target="_blank" rel="noreferrer" className="hover:text-primary">WhatsApp +54 9 11 6596-1753</a>
        </div>
        <div>
          <p className="font-semibold text-foreground">Entregas</p>
          <p>Retiro gratis en taller · Envíos en AMBA</p>
        </div>
      </div>
    </footer>
  );
}
