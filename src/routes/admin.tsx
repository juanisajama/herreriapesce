import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import type { DateRange } from "react-day-picker";
import { es } from "date-fns/locale";
import { toast } from "sonner";
import { Lock, Trash2 } from "lucide-react";
import { PRODUCTS, getProduct } from "@/data/products";
import { blockedRangesQuery } from "@/lib/queries";
import { toISODate } from "@/lib/booking";
import { adminLogin, adminLogout, getAdminStatus, addBlockedRange, deleteBlockedRange } from "@/lib/admin.functions";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Administración · Herrería Pesce" },
      { name: "description", content: "Panel privado de disponibilidad." },
      { property: "og:title", content: "Administración · Herrería Pesce" },
      { property: "og:description", content: "Panel privado." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  loader: () => getAdminStatus(),
  component: AdminPage,
});

function AdminPage() {
  const { admin } = Route.useLoaderData();
  return admin ? <Panel /> : <Login />;
}

function Login() {
  const router = useRouter();
  const login = useServerFn(adminLogin);
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);
  return (
    <div className="mx-auto max-w-sm px-4 py-24">
      <form
        className="plate space-y-4 rounded-md p-6"
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          const password = new FormData(e.currentTarget).get("password") as string;
          const { ok } = await login({ data: { password } });
          setBusy(false);
          if (ok) router.invalidate();
          else setError(true);
        }}
      >
        <Lock className="h-8 w-8 text-primary" />
        <h1 className="text-4xl">Panel del taller</h1>
        <Input name="password" type="password" placeholder="Contraseña" autoComplete="current-password" required />
        {error && <p className="text-sm text-destructive">Contraseña incorrecta</p>}
        <Button type="submit" disabled={busy} className="w-full bg-fire font-bold uppercase text-primary-foreground hover:bg-primary-hover">Entrar</Button>
      </form>
    </div>
  );
}

function Panel() {
  const router = useRouter();
  const qc = useQueryClient();
  const { data: ranges } = useSuspenseQuery(blockedRangesQuery);
  const add = useServerFn(addBlockedRange);
  const del = useServerFn(deleteBlockedRange);
  const logout = useServerFn(adminLogout);
  const [productId, setProductId] = useState("all");
  const [range, setRange] = useState<DateRange>();
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);

  const refresh = () => qc.invalidateQueries({ queryKey: blockedRangesQuery.queryKey });

  async function save() {
    if (!range?.from) return;
    setBusy(true);
    try {
      await add({
        data: {
          product_id: productId === "all" ? null : productId,
          start_date: toISODate(range.from),
          end_date: toISODate(range.to ?? range.from),
          reason: reason.trim() || null,
        },
      });
      toast.success("Fechas bloqueadas");
      setRange(undefined);
      setReason("");
      await refresh();
    } catch {
      toast.error("No se pudo guardar");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-5xl">Disponibilidad</h1>
        <Button variant="outline" onClick={async () => { await logout(); router.invalidate(); }}>Salir</Button>
      </div>
      <div className="grid gap-8 lg:grid-cols-2">
        <section className="plate space-y-4 rounded-md p-5">
          <h2 className="text-3xl">Bloquear fechas</h2>
          <Select value={productId} onValueChange={setProductId}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los productos (taller lleno)</SelectItem>
              {PRODUCTS.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <Calendar mode="range" locale={es} selected={range} onSelect={setRange} className="mx-auto rounded-md border border-border bg-card p-3 pointer-events-auto [--cell-size:2.4rem]" />
          <Input placeholder="Motivo (opcional): sin stock, taller lleno…" value={reason} onChange={(e) => setReason(e.target.value)} maxLength={200} />
          <Button disabled={!range?.from || busy} onClick={save} className="w-full bg-fire font-bold uppercase text-primary-foreground hover:bg-primary-hover">
            Bloquear rango
          </Button>
        </section>
        <section className="plate rounded-md p-5">
          <h2 className="mb-4 text-3xl">Bloqueos activos</h2>
          {ranges.length === 0 && <p className="text-sm text-muted-foreground">No hay fechas bloqueadas.</p>}
          <ul className="space-y-2">
            {ranges.map((r) => (
              <li key={r.id} className="flex items-center justify-between gap-3 rounded-md border border-border bg-card p-3 text-sm">
                <div>
                  <p className="font-semibold">{r.product_id ? getProduct(r.product_id)?.name ?? r.product_id : "Todos los productos"}</p>
                  <p className="text-muted-foreground">{fmt(r.start_date)} → {fmt(r.end_date)}{r.reason ? ` · ${r.reason}` : ""}</p>
                </div>
                <Button size="icon" variant="ghost" aria-label="Eliminar bloqueo" onClick={async () => { await del({ data: { id: r.id } }); toast.success("Bloqueo eliminado"); refresh(); }}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

function fmt(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}
