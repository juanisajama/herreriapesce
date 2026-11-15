import type { Database } from "@/integrations/supabase/types";

type ReviewRow = {
  id: string;
  first_name: string;
  last_name: string;
  rating: number;
  comment: string | null;
  created_at: string;
};

type ReviewsDatabase = Omit<Database, "public"> & {
  public: Omit<Database["public"], "Tables"> & {
    Tables: Database["public"]["Tables"] & {
      reviews: {
        Row: ReviewRow;
        Insert: {
          first_name: string;
          last_name: string;
          rating: number;
          comment: string;
          id?: string;
          created_at?: string;
        };
        Update: Partial<{
          first_name: string;
          last_name: string;
          rating: number;
          comment: string;
          id: string;
          created_at: string;
        }>;
        Relationships: [];
      };
    };
  };
};

export type Review = ReviewRow;
export type { ReviewsDatabase };
