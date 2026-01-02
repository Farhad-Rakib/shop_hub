import { createClient } from '@supabase/supabase-js';

export const DB_CONFIG = {
  provider: process.env.DB_PROVIDER || 'supabase',
  
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
  
  neon: {
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  },
};

let supabaseClient: ReturnType<typeof createClient> | null = null;

export function getSupabaseClient() {
  if (!supabaseClient) {
    supabaseClient = createClient(
      DB_CONFIG.supabase.url!,
      DB_CONFIG.supabase.anonKey!
    );
  }
  return supabaseClient;
}

export function getDatabaseClient() {
  if (DB_CONFIG.provider === 'neon') {
    throw new Error('Neon PostgreSQL support requires installing pg package. Run: npm install pg');
  }
  return getSupabaseClient();
}

export const supabase = getSupabaseClient();

export type Category = {
  id: string;
  name: string;
  slug: string;
  created_at: string;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category_id: string | null;
  image_url: string;
  stock: number;
  created_at: string;
  updated_at: string;
};

export type Order = {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  total_amount: number;
  status: string;
  created_at: string;
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  created_at: string;
};
