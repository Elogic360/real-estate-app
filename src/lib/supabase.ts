import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          first_name: string | null;
          last_name: string | null;
          email: string;
          phone_number: string | null;
          hashed_password: string;
          role: 'master_admin' | 'admin' | 'partner' | 'user';
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          first_name?: string | null;
          last_name?: string | null;
          email: string;
          phone_number?: string | null;
          hashed_password: string;
          role?: 'master_admin' | 'admin' | 'partner' | 'user';
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          first_name?: string | null;
          last_name?: string | null;
          email?: string;
          phone_number?: string | null;
          hashed_password?: string;
          role?: 'master_admin' | 'admin' | 'partner' | 'user';
          is_active?: boolean;
          created_at?: string;
        };
      };
      plots: {
        Row: {
          id: string;
          plot_number: string | null;
          title: string;
          description: string | null;
          area_sqm: number;
          price: number;
          image_urls: string[] | null;
          usage_type: string | null;
          status: 'available' | 'locked' | 'pending_payment' | 'sold';
          council_id: number | null;
          geom: any;
          uploaded_by_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          plot_number?: string | null;
          title: string;
          description?: string | null;
          area_sqm: number;
          price: number;
          image_urls?: string[] | null;
          usage_type?: string | null;
          status?: 'available' | 'locked' | 'pending_payment' | 'sold';
          council_id?: number | null;
          geom?: any;
          uploaded_by_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          plot_number?: string | null;
          title?: string;
          description?: string | null;
          area_sqm?: number;
          price?: number;
          image_urls?: string[] | null;
          usage_type?: string | null;
          status?: 'available' | 'locked' | 'pending_payment' | 'sold';
          council_id?: number | null;
          geom?: any;
          uploaded_by_id?: string | null;
          created_at?: string;
        };
      };
    };
  };
};