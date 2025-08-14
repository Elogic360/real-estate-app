export interface User {
  id: string;
  first_name?: string;
  last_name?: string;
  email: string;
  phone_number?: string;
  role: 'master_admin' | 'admin' | 'partner' | 'user';
  is_active: boolean;
  created_at: string;
}

export interface Plot {
  id: string;
  plot_number?: string;
  title: string;
  description?: string;
  area_sqm: number;
  price: number;
  image_urls?: string[];
  usage_type?: string;
  status: 'available' | 'locked' | 'pending_payment' | 'sold';
  council_id?: number;
  geom?: any;
  uploaded_by_id?: string;
  created_at: string;
  council?: Council;
}

export interface Region {
  id: number;
  name: string;
}

export interface District {
  id: number;
  name: string;
  region_id: number;
  region?: Region;
}

export interface Council {
  id: number;
  name: string;
  district_id: number;
  district?: District;
}

export interface Order {
  id: string;
  user_id: string;
  plot_id: string;
  order_status: string;
  created_at: string;
  user?: User;
  plot?: Plot;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

export interface RegisterData {
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string;
  password: string;
}

export interface CartItem {
  plot: Plot;
  addedAt: Date;
}