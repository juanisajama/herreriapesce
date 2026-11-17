import {
  ArrowUpRight,
  DoorOpen,
  Fence,
  Hammer,
  MessageCircle,
  PanelsTopLeft,
} from "lucide-react";
import mensulasImage from "@/assets/Gemini_Generated_Image_mo5r6pmo5r6pmo5r.jfif";
import soporteImage from "@/assets/boxnew.jfif";
import mesaImage from "@/assets/Gemini_Generated_Image_v5lapnv5lapnv5la.jfif";
import { Button } from "@/components/ui/button";
import { whatsappUrl } from "@/lib/booking";

const CUSTOM_WORK_MESSAGE =
  "Hola, quiero consultar por un trabajo de herrería a medida. Tengo una idea o proyecto y quisiera recibir un presupuesto.";

const PROJECTS = [
  {
    title: "Ménsulas personalizadas",
    description: "Diseños, medidas y terminaciones pensadas para tu espacio.",
    image: mensulasImage,
    alt: "Ménsulas de hierro fabricadas a medida",
    label: "Diseño a medida",
  },
  {
    title: "Soportes y estructuras reforzadas",
    description: "Soluciones resistentes, fabricadas según el uso y la instalación.",
    image: soporteImage,
    alt: "Soporte de hierro reforzado fabricado en el taller",
    label: "Estructuras",
  },
  {
    title: "Mobiliario y proyectos especiales",
    description: "Piezas únicas de estilo industrial, hechas para durar.",
    image: mesaImage,
    alt: "Mueble de hierro de diseño industrial",
    label: "Proyectos especiales",
  },
];

const CUSTOM_WORK_TYPES = [
  {
    title: "Escaleras metálicas",
    description: "Estructuras adaptadas al espacio, el acceso y el uso.",
    icon: Hammer,
  },
  {
    title: "Rejas para ventanas",
    description: "Diseños y medidas personalizados para cada abertura.",
    icon: Fence,
  },
  {
    title: "Puertas de hierro",
    description: "Hojas y marcos fabricados según tu proyecto.",
    icon: DoorOpen,
  },
  {
    title: "Rejas y portones de entrada",
    description: "Cierres resistentes con diseño a medida.",
    icon: PanelsTopLeft,
  },
];

export function CustomWorkSection() {
  return (
    <section
      id="trabajos-a-medida"
      className="mx-auto max-w-6xl px-4 py-20 md:py-24"
      aria-labelledby="custom-work-title"
    >
      <div className="mb-10 max-w-3xl">
        <p className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.3em] text-primary">
          <Hammer aria-hidden="true" className="h-4 w-4" />
          Herrería a medida
        </p>
        <h2 id="custom-work-title" className="mt-4 text-5xl md:text-6xl">
          Trabajos a medida{" "}
          <span className="text-fire">y proyectos especiales</span>
        </h2>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          Creamos piezas de hierro según tu idea, tus medidas y el uso que necesitás. Contanos tu
          proyecto y coordinamos un presupuesto personalizado.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {PROJECTS.map((project) => (
          <article
            key={project.title}
            className="plate group overflow-hidden rounded-md transition hover:border-primary hover:shadow-fire"
          >
            <div className="aspect-[4/3] overflow-hidden bg-card p-1">
              <img
                src={project.image}
                alt={project.alt}
                width={1200}
                height={900}
                loading="lazy"
                decoding="async"
                className="h-full w-full rounded-sm object-cover transition duration-500 group-hover:scale-105"
              />
            </div>
            <div className="p-5">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                {project.label}
              </p>
              <h3 className="mt-2 text-2xl">{project.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{project.description}</p>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-10">
        <h3 className="text-3xl">También hacemos</h3>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CUSTOM_WORK_TYPES.map(({ title, description, icon: Icon }) => (
            <article key={title} className="plate rounded-md p-5 transition hover:border-primary">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-md bg-primary/10 text-primary">
                <Icon aria-hidden="true" className="h-6 w-6" />
              </span>
              <h4 className="mt-4 text-xl">{title}</h4>
              <p className="mt-2 text-sm text-muted-foreground">{description}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="plate mt-8 flex flex-col gap-6 rounded-md p-6 md:flex-row md:items-center md:justify-between md:p-8">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
            ¿Tenés una idea?
          </p>
          <h3 className="mt-2 text-3xl">La hacemos realidad en hierro.</h3>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            Escribinos por WhatsApp con lo que necesitás y te ayudamos a definir el trabajo.
          </p>
        </div>
        <Button
          asChild
          size="lg"
          className="w-full shrink-0 bg-whatsapp font-bold uppercase text-whatsapp-foreground shadow-lg transition-transform hover:scale-[1.02] hover:bg-whatsapp-hover sm:w-auto"
        >
          <a href={whatsappUrl(CUSTOM_WORK_MESSAGE)} target="_blank" rel="noreferrer">
            <MessageCircle aria-hidden="true" className="h-5 w-5" />
            Pedir presupuesto a medida
            <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
          </a>
        </Button>
      </div>
    </section>
  );
}
