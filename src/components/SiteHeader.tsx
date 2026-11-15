import { Link } from "@tanstack/react-router";
import emblem from "@/assets/Emblema_pez-yunque_de_metal_incandescente-removebg-preview.png";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <img src={emblem} alt="" aria-hidden="true" width={32} height={32} className="h-8 w-8 object-contain" />
          <span className="font-display text-2xl tracking-wider">
            HERRERÍA <span className="text-primary">PESCE</span>
          </span>
        </Link>
        <nav className="flex items-center gap-6 text-sm font-semibold uppercase tracking-wide">
          <Link to="/" className="text-muted-foreground hover:text-foreground" activeOptions={{ exact: true }} activeProps={{ className: "text-primary" }}>Inicio</Link>
          <Link to="/catalogo" className="text-muted-foreground hover:text-foreground" activeProps={{ className: "text-primary" }}>Catálogo</Link>
        </nav>
      </div>
      <div className="hazard-line opacity-60" />
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
