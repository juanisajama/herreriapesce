CREATE TABLE public.product_inventory (
  product_id text PRIMARY KEY,
  sold_out boolean NOT NULL DEFAULT false,
  stock integer CHECK (stock IS NULL OR stock >= 0),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.product_inventory TO anon, authenticated;
GRANT ALL ON public.product_inventory TO service_role;
ALTER TABLE public.product_inventory ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read product inventory" ON public.product_inventory FOR SELECT TO anon, authenticated USING (true);