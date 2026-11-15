import { queryOptions } from "@tanstack/react-query";
import { getBlockedRanges } from "./availability.functions";

export const blockedRangesQuery = queryOptions({
  queryKey: ["blocked-ranges"],
  queryFn: () => getBlockedRanges(),
});
