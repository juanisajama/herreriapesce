CREATE TABLE public.blocked_ranges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id text,
  start_date date NOT NULL,
  end_date date NOT NULL,
  reason text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.blocked_ranges TO anon, authenticated;
GRANT ALL ON public.blocked_ranges TO service_role;
ALTER TABLE public.blocked_ranges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read blocked ranges" ON public.blocked_ranges FOR SELECT TO anon, authenticated USING (true);