export type ProductType = 'digital' | 'physical';

export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  category: string;
  product_type: ProductType;
  image_url: string;
  download_url?: string;
  file_spec?: string;
  stock: number;
  rating: number;
  sales_count: number;
  features?: string[];
  created_at?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type OrderStatus = 'Menunggu Pembayaran' | 'Diproses' | 'Selesai' | 'Dibatalkan';

export interface OrderItem {
  id?: string;
  order_id?: string;
  product_id: string;
  product_title: string;
  product_type: ProductType;
  price: number;
  quantity: number;
  download_url?: string;
}

export interface Order {
  id: string;
  user_id?: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address?: string;
  shipping_city?: string;
  shipping_postal_code?: string;
  order_type: 'digital' | 'physical' | 'hybrid';
  total_amount: number;
  status: OrderStatus;
  payment_method: string;
  notes?: string;
  created_at: string;
  items?: OrderItem[];
}

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  role: 'customer' | 'admin';
}
