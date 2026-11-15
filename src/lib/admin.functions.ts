import { createServerFn } from "@tanstack/react-start";
import { useSession } from "@tanstack/react-start/server";
import { createHash, timingSafeEqual } from "node:crypto";
import { z } from "zod";

type AdminSession = { admin?: boolean };

function sessionConfig() {
  return {
    password: process.env["SESSION_SECRET"]!,
    name: "pesce-admin",
    maxAge: 60 * 60 * 24 * 7,
    cookie: { httpOnly: true, secure: true, sameSite: "lax" as const, path: "/" },
  };
}

function matches(a: string, b: string) {
  return timingSafeEqual(
    createHash("sha256").update(a).digest(),
    createHash("sha256").update(b).digest(),
  );
}

async function requireAdmin() {
  const s = await useSession<AdminSession>(sessionConfig());
  if (!s.data.admin) throw new Error("No autorizado");
}

export const getAdminStatus = createServerFn({ method: "GET" }).handler(async () => {
  const s = await useSession<AdminSession>(sessionConfig());
  return { admin: !!s.data.admin };
});

export const adminLogin = createServerFn({ method: "POST" })
  .inputValidator((d: { password: string }) => z.object({ password: z.string().max(200) }).parse(d))
  .handler(async ({ data }) => {
    const expected = process.env["ADMIN_PASSWORD"];
    if (!expected || !matches(data.password, expected)) return { ok: false };
    const s = await useSession<AdminSession>(sessionConfig());
    await s.update({ admin: true });
    return { ok: true };
  });

export const adminLogout = createServerFn({ method: "POST" }).handler(async () => {
  const s = await useSession<AdminSession>(sessionConfig());
  await s.clear();
  return { ok: true };
});

const dateRe = /^\d{4}-\d{2}-\d{2}$/;

export const addBlockedRange = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z
      .object({
        product_id: z.string().max(60).nullable(),
        start_date: z.string().regex(dateRe),
        end_date: z.string().regex(dateRe),
        reason: z.string().max(200).nullable(),
      })
      .refine((v) => v.start_date <= v.end_date)
      .parse(d),
  )
  .handler(async ({ data }) => {
    await requireAdmin();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("blocked_ranges").insert(data);
    if (error) throw new Error("No se pudo guardar el bloqueo");
    return { ok: true };
  });

export const deleteBlockedRange = createServerFn({ method: "POST" })
  .inputValidator((d: { id: string }) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data }) => {
    await requireAdmin();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("blocked_ranges").delete().eq("id", data.id);
    if (error) throw new Error("No se pudo eliminar");
    return { ok: true };
  });
