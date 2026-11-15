import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { BlockedRange } from "./booking";

export const getBlockedRanges = createServerFn({ method: "GET" }).handler(async () => {
  // Runtime env vars take priority; fall back to the public values inlined at build time
  // (hosts like Netlify don't load .env at runtime).
  const url = process.env["SUPABASE_URL"] || import.meta.env["VITE_SUPABASE_URL"];
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"] || import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"];
  if (!url || !key) {
    console.error("[availability] Missing SUPABASE_URL / SUPABASE_PUBLISHABLE_KEY");
    return [] as BlockedRange[];
  }
  try {
    const sb = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: {
        fetch: (input, init) => {
          const h = new Headers(init?.headers);
          if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
          h.set("apikey", key);
          return fetch(input, { ...init, headers: h });
        },
      },
    });
    const { data, error } = await sb
      .from("blocked_ranges")
      .select("id, product_id, start_date, end_date, reason")
      .order("start_date");
    if (error) {
      console.error(error);
      return [] as BlockedRange[];
    }
    return (data ?? []) as BlockedRange[];
  } catch (err) {
    console.error("[availability] Failed to load blocked ranges", err);
    return [] as BlockedRange[];
  }
});
