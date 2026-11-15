import type { Review } from "@/lib/reviews.types";

export const initialReviews = [
  {
    id: "initial-diego-alvarez",
    first_name: "Diego",
    last_name: "Alvarez",
    rating: 4.5,
    comment: "Rápido y eficaz.",
  },
  {
    id: "initial-juan-prieto",
    first_name: "Juan",
    last_name: "Prieto",
    rating: 5,
    comment: "Muy buena calidad!",
  },
  {
    id: "initial-joaco-montanez",
    first_name: "Joaco",
    last_name: "Montañez",
    rating: 4,
    comment: "El envío fue eficiente.",
  },
] satisfies Array<Pick<Review, "id" | "first_name" | "last_name" | "rating"> & { comment: string }>;
