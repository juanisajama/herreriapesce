import { queryOptions } from "@tanstack/react-query";
import { getReviews } from "./reviews.functions";

export const reviewsQuery = queryOptions({
  queryKey: ["reviews"],
  queryFn: () => getReviews(),
});
