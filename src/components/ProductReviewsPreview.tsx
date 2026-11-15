import { useQuery } from "@tanstack/react-query";
import { RatingStars } from "@/components/RatingStars";
import { reviewsQuery } from "@/lib/reviews.queries";
import { initialReviews } from "@/data/reviews";

export function ProductReviewsPreview() {
  const { data: savedReviews } = useQuery(reviewsQuery);
  const allReviews = [...(savedReviews ?? []), ...initialReviews];
  const average = allReviews.reduce((sum, review) => sum + review.rating, 0) / allReviews.length;

  return (
    <section className="mt-16 border-t border-border pt-10" aria-labelledby="product-reviews-title">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-1 text-sm font-bold uppercase tracking-[0.2em] text-primary">
            Opiniones de clientes
          </p>
          <h2 id="product-reviews-title" className="text-4xl">
            Lo que dicen nuestros clientes
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <div>
            <p className="font-display text-3xl text-fire">
              {average.toLocaleString("es-AR", {
                minimumFractionDigits: 1,
                maximumFractionDigits: 1,
              })}
              <span className="text-base text-muted-foreground"> / 5</span>
            </p>
            <p className="text-xs text-muted-foreground">
              ({allReviews.length} {allReviews.length === 1 ? "reseña" : "reseñas"})
            </p>
          </div>
          <a href="/#reviews" className="text-sm font-bold uppercase text-primary hover:underline">
            Ver todas →
          </a>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {initialReviews.slice(0, 2).map((review) => (
          <article key={review.id} className="plate rounded-md p-5">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-2xl text-fire">
                {review.first_name} {review.last_name}
              </h3>
              <RatingStars rating={review.rating} />
            </div>
            <p className="mt-3 border-l-2 border-primary pl-3 font-medium text-foreground">
              “{review.comment}”
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
