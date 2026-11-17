import whatsappLogo from "@/assets/6c784972cbf5806215d46fbda8b0c46a-removebg-preview.png";
import { whatsappUrl } from "@/lib/booking";

const CONTACT_MESSAGE = "Hola! Estuve viendo la web y quería hacerles una consulta.";

export function FloatingWhatsAppButton() {
  return (
    <a
      href={whatsappUrl(CONTACT_MESSAGE)}
      target="_blank"
      rel="noreferrer"
      aria-label="Contactar a Herrería Pesce por WhatsApp"
      className="group fixed bottom-5 right-5 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp shadow-lg shadow-black/20 transition duration-200 hover:scale-105 hover:bg-whatsapp-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <img
        src={whatsappLogo}
        alt=""
        aria-hidden="true"
        width={500}
        height={500}
        decoding="async"
        className="h-9 w-9 object-contain"
      />
      <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-300 opacity-75" />
        <span className="relative inline-flex h-4 w-4 rounded-full bg-green-400 ring-2 ring-background" />
      </span>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-1/2 right-full mr-3 hidden translate-y-1/2 whitespace-nowrap rounded-md border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground opacity-0 shadow-lg transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 md:block"
      >
        Respondemos al toque
      </span>
    </a>
  );
}
