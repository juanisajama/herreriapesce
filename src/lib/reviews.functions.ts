import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { SupabaseClient } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import type { Review, ReviewsDatabase } from "./reviews.types";

const reviewClient = supabase as unknown as SupabaseClient<ReviewsDatabase>;

export const getReviews = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await reviewClient
    .from("reviews")
    .select("id, first_name, last_name, rating, comment, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[reviews] Failed to load reviews", error);
    throw new Error("No se pudieron cargar las reseñas");
  }

  return (data ?? []) as Review[];
});

export const addReview = createServerFn({ method: "POST" })
  .validator((data: unknown) =>
    z
      .object({
        first_name: z.string().trim().min(1).max(60),
        last_name: z.string().trim().min(1).max(60),
        rating: z
          .number()
          .min(1)
          .max(5)
          .refine((rating) => Number.isInteger(rating * 2)),
        comment: z.string().trim().min(1).max(500),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const adminClient = supabaseAdmin as unknown as SupabaseClient<ReviewsDatabase>;
    const { data: review, error } = await adminClient
      .from("reviews")
      .insert(data)
      .select("id, first_name, last_name, rating, comment, created_at")
      .single();

    if (error) {
      console.error("[reviews] Failed to save review", error);
      throw new Error("No se pudo guardar la reseña");
    }

    return review as Review;
  });
