import { useState, type FormEvent } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { ChevronDown, MessageSquareQuote, Plus, Star } from "lucide-react";
import { toast } from "sonner";
import { RatingStars } from "@/components/RatingStars";
import { addReview } from "@/lib/reviews.functions";
import { reviewsQuery } from "@/lib/reviews.queries";
import type { Review } from "@/lib/reviews.types";
import { initialReviews } from "@/data/reviews";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

function ReviewCard({
  review,
}: {
  review: Pick<Review, "id" | "first_name" | "last_name" | "rating"> & {
    comment?: string | null;
  };
}) {
  return (
    <article className="plate flex h-full flex-col rounded-md p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-3xl tracking-wide text-fire">
            {review.first_name} {review.last_name}
          </h3>
          <RatingStars rating={review.rating} />
        </div>
        <MessageSquareQuote aria-hidden="true" className="h-5 w-5 shrink-0 text-primary" />
      </div>
      {review.comment && (
        <p className="mt-4 border-l-2 border-primary pl-3 text-base font-semibold leading-relaxed text-foreground">
          “{review.comment}”
        </p>
      )}
    </article>
  );
}

export function ReviewsSection() {
  const queryClient = useQueryClient();
  const { data: savedReviews, isPending } = useQuery(reviewsQuery);
  const submitReview = useServerFn(addReview);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [rating, setRating] = useState("");
  const [busy, setBusy] = useState(false);

  const reviews = savedReviews ?? [];
  const allReviews = [...reviews, ...initialReviews];
  const average = allReviews.reduce((sum, review) => sum + review.rating, 0) / allReviews.length;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const firstName = formData.get("first_name");
    const lastName = formData.get("last_name");
    const comment = formData.get("comment");

    if (
      typeof firstName !== "string" ||
      typeof lastName !== "string" ||
      typeof comment !== "string" ||
      !rating
    ) {
      return;
    }

    setBusy(true);
    try {
      await submitReview({
        data: {
          first_name: firstName,
          last_name: lastName,
          rating: Number(rating),
          comment,
        },
      });
      toast.success("¡Gracias por compartir tu reseña!");
      setDialogOpen(false);
      setRating("");
      form.reset();
      await queryClient.invalidateQueries({ queryKey: reviewsQuery.queryKey });
    } catch {
      toast.error("No se pudo guardar la reseña. Intentá nuevamente.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section id="reviews" className="mx-auto max-w-6xl px-4 py-16">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-primary">
            Experiencias
          </p>
          <h2 className="text-5xl">Reseñas</h2>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                aria-label={`Ver otras reseñas (${reviews.length})`}
              >
                <span className="hidden sm:inline">Otras reseñas ({reviews.length})</span>
                <span className="sm:hidden">Otras ({reviews.length})</span>
                <ChevronDown aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Reseñas recibidas</DropdownMenuLabel>
              {reviews.length ? (
                reviews.map((review) => (
                  <DropdownMenuItem key={review.id} className="flex-col items-start gap-1">
                    <span className="font-semibold">
                      {review.first_name} {review.last_name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {review.rating.toLocaleString("es-AR")}{" "}
                      {review.rating === 1 ? "estrella" : "estrellas"}
                    </span>
                    {review.comment && (
                      <span className="line-clamp-2 text-xs text-muted-foreground">
                        “{review.comment}”
                      </span>
                    )}
                  </DropdownMenuItem>
                ))
              ) : (
                <DropdownMenuItem disabled>Aún no hay otras reseñas</DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button
                size="sm"
                className="bg-fire font-bold uppercase text-primary-foreground shadow-fire"
              >
                <Plus aria-hidden="true" />
                <span className="hidden sm:inline">Dejar reseña</span>
                <span className="sm:hidden">Reseñar</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-3xl">Dejá tu reseña</DialogTitle>
                <DialogDescription>
                  Contanos quién sos y cómo puntuás tu experiencia.
                </DialogDescription>
              </DialogHeader>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="space-y-2 text-sm font-medium">
                    Nombre
                    <Input name="first_name" autoComplete="given-name" maxLength={60} required />
                  </label>
                  <label className="space-y-2 text-sm font-medium">
                    Apellido
                    <Input name="last_name" autoComplete="family-name" maxLength={60} required />
                  </label>
                </div>
                <label className="block space-y-2 text-sm font-medium">
                  Tu reseña
                  <Textarea
                    name="comment"
                    placeholder="Contanos qué te pareció el producto o la atención…"
                    maxLength={500}
                    rows={4}
                    required
                  />
                </label>
                <fieldset className="space-y-2">
                  <legend className="text-sm font-medium">Puntuación</legend>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <span key={value}>
                        <input
                          id={`review-rating-${value}`}
                          className="peer sr-only"
                          type="radio"
                          name="rating"
                          value={value}
                          checked={rating === String(value)}
                          onChange={(event) => setRating(event.currentTarget.value)}
                          aria-label={`${value} ${value === 1 ? "estrella" : "estrellas"}`}
                          required={value === 1}
                        />
                        <label
                          htmlFor={`review-rating-${value}`}
                          className={`inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-md transition-colors hover:text-primary peer-focus-visible:ring-2 peer-focus-visible:ring-ring ${
                            Number(rating) >= value ? "text-primary" : "text-steel"
                          }`}
                        >
                          <Star aria-hidden="true" className="h-8 w-8 fill-current" />
                        </label>
                      </span>
                    ))}
                    <span className="ml-2 text-sm text-muted-foreground" aria-live="polite">
                      {rating ? `${rating} / 5` : "Elegí tu puntuación"}
                    </span>
                  </div>
                </fieldset>
                <DialogFooter>
                  <Button
                    type="submit"
                    disabled={busy || !rating}
                    className="bg-fire font-bold uppercase text-primary-foreground"
                  >
                    {busy ? "Guardando..." : "Enviar reseña"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[0.8fr_2.2fr]">
        <div className="plate flex flex-col justify-center rounded-md p-6">
          <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Puntuación media
          </p>
          <div className="mt-2 flex items-center gap-3">
            <span className="font-display text-6xl text-fire">
              {average.toLocaleString("es-AR", {
                minimumFractionDigits: 1,
                maximumFractionDigits: 1,
              })}
            </span>
            <span className="text-muted-foreground">/ 5</span>
          </div>
          <RatingStars rating={average} size="h-5 w-5" />
          <p className="mt-2 text-sm text-muted-foreground">
            ({allReviews.length} {allReviews.length === 1 ? "reseña" : "reseñas"})
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {initialReviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      </div>
      {isPending && <p className="mt-4 text-sm text-muted-foreground">Cargando nuevas reseñas…</p>}
    </section>
  );
}
