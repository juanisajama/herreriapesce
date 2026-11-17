import { Star } from "lucide-react";

export function RatingStars({ rating, size = "h-4 w-4" }: { rating: number; size?: string }) {
  return (
    <span
      className="inline-flex items-center gap-0.5"
      role="img"
      aria-label={`Puntuación ${rating.toLocaleString("es-AR")} de 5`}
    >
      {Array.from({ length: 5 }, (_, index) => {
        const fill = Math.min(1, Math.max(0, rating - index));
        return (
          <span key={index} className="relative inline-flex">
            <Star aria-hidden="true" className={`${size} text-steel`} />
            <span
              className="absolute inset-y-0 left-0 overflow-hidden"
              style={{ width: `${fill * 100}%` }}
            >
              <Star aria-hidden="true" className={`${size} fill-gold text-gold`} />
            </span>
          </span>
        );
      })}
    </span>
  );
}
