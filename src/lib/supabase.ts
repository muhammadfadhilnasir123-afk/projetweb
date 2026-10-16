import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { INITIAL_PRODUCTS } from './products-data';
import { Product, Order, OrderItem, OrderStatus } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = (): boolean => {
  return (
    Boolean(supabaseUrl) &&
    Boolean(supabaseAnonKey) &&
    !supabaseUrl.includes('your-supabase-url') &&
    supabaseUrl.startsWith('http')
  );
};

// Singleton Supabase Client (if configured)
let supabaseInstance: SupabaseClient | null = null;

export const getSupabase = (): SupabaseClient | null => {
  if (!isSupabaseConfigured()) return null;
  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  }
  return supabaseInstance;
};

// Local storage keys for mock/fallback mode
const STORAGE_KEY_PRODUCTS = 'fadhil_ecommerce_products';
const STORAGE_KEY_ORDERS = 'fadhil_ecommerce_orders';

// Initial orders seed for demo mode
const INITIAL_DEMO_ORDERS: Order[] = [
  {
    id: 'ORD-2026-881',
    user_id: 'user-demo-01',
    customer_name: 'Fadhil Rahman',
    customer_email: 'fadhil@example.com',
    customer_phone: '081234567890',
    order_type: 'digital',
    total_amount: 448000,
    status: 'Selesai',
    payment_method: 'QRIS / Instant E-Wallet',
    notes: 'Terima kasih, produk digital langsung saya download.',
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    items: [
      {
        product_id: 'prod-001',
        product_title: 'E-Book: Masterclass Fullstack Next.js & Supabase',
        product_type: 'digital',
        price: 149000,
        quantity: 1,
        download_url: 'https://drive.google.com/uc?export=download&id=sample_ebook_nextjs'
      },
      {
        product_id: 'prod-002',
        product_title: 'Nexus UI Kit: Modern SaaS Dashboard Design System',
        product_type: 'digital',
        price: 299000,
        quantity: 1,
        download_url: 'https://drive.google.com/uc?export=download&id=sample_nexus_ui_kit'
      }
    ]
  },
  {
    id: 'ORD-2026-882',
    user_id: 'user-demo-02',
    customer_name: 'Siti Sarah',
    customer_email: 'siti.sarah@gmail.com',
    customer_phone: '085799881122',
    shipping_address: 'Jl. Sudirman No. 45, Tower B Lt. 12',
    shipping_city: 'Jakarta Selatan',
    shipping_postal_code: '12190',
    order_type: 'physical',
    total_amount: 1475000,
    status: 'Diproses',
    payment_method: 'Transfer Bank BCA',
    notes: 'Mohon packing bubble wrap tebal ya min.',
    created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
    items: [
      {
        product_id: 'prod-005',
        product_title: 'Keychron K2 Pro Wireless Mechanical Keyboard',
        product_type: 'physical',
        price: 1450000,
        quantity: 1
      }
    ]
  },
  {
    id: 'ORD-2026-883',
    user_id: 'user-demo-03',
    customer_name: 'Budi Santoso',
    customer_email: 'budi.santoso@yahoo.com',
    customer_phone: '081377889900',
    shipping_address: 'Jl. Dago Asri No. 18',
    shipping_city: 'Bandung',
    shipping_postal_code: '40135',
    order_type: 'hybrid',
    total_amount: 254000,
    status: 'Menunggu Pembayaran',
    payment_method: 'Virtual Account Mandiri',
    notes: 'Kirim via kurir ekspres',
    created_at: new Date(Date.now() - 1800000).toISOString(),
    items: [
      {
        product_id: 'prod-003',
        product_title: 'Cinematic Mood Lightroom Presets (15 Presets Pack)',
        product_type: 'digital',
        price: 89000,
        quantity: 1,
        download_url: 'https://drive.google.com/uc?export=download&id=sample_cinematic_presets'
      },
      {
        product_id: 'prod-006',
        product_title: 'Developer Oversized Heavyweight T-Shirt "Eat Sleep Code"',
        product_type: 'physical',
        price: 165000,
        quantity: 1
      }
    ]
  }
];

// Helper to get local mock items
function getLocalProducts(): Product[] {
  if (typeof window === 'undefined') return INITIAL_PRODUCTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PRODUCTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
      return INITIAL_PRODUCTS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_PRODUCTS;
  }
}

function saveLocalProducts(products: Product[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(products));
}

function getLocalOrders(): Order[] {
  if (typeof window === 'undefined') return INITIAL_DEMO_ORDERS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ORDERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(INITIAL_DEMO_ORDERS));
      return INITIAL_DEMO_ORDERS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_DEMO_ORDERS;
  }
}

function saveLocalOrders(orders: Order[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(orders));
}

// ----------------- Data Access Functions -----------------

export async function fetchProducts(): Promise<Product[]> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data as Product[];
      }
    } catch (err) {
      console.warn('Gagal fetch dari Supabase, beralih ke cache lokal:', err);
    }
  }
  return getLocalProducts();
}

export async function fetchProductById(id: string): Promise<Product | null> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (!error && data) {
        return data as Product;
      }
    } catch (err) {
      console.warn('Gagal fetch detail dari Supabase, cek lokal:', err);
    }
  }
  const local = getLocalProducts();
  return local.find((p) => p.id === id) || null;
}

export async function createProduct(productData: Omit<Product, 'id'>): Promise<Product> {
  const newProduct: Product = {
    ...productData,
    id: `prod-${Date.now()}`,
    created_at: new Date().toISOString()
  };

  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([newProduct])
        .select()
        .single();

      if (!error && data) {
        return data as Product;
      }
    } catch (err) {
      console.warn('Gagal insert ke Supabase, simpan lokal:', err);
    }
  }

  const local = getLocalProducts();
  const updated = [newProduct, ...local];
  saveLocalProducts(updated);
  return newProduct;
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (!error && data) {
        return data as Product;
      }
    } catch (err) {
      console.warn('Gagal update di Supabase, update lokal:', err);
    }
  }

  const local = getLocalProducts();
  const index = local.findIndex((p) => p.id === id);
  if (index === -1) return null;
  const updatedProduct = { ...local[index], ...updates };
  local[index] = updatedProduct;
  saveLocalProducts(local);
  return updatedProduct;
}

export async function deleteProduct(id: string): Promise<boolean> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (!error) return true;
    } catch (err) {
      console.warn('Gagal delete di Supabase, delete lokal:', err);
    }
  }

  const local = getLocalProducts();
  const filtered = local.filter((p) => p.id !== id);
  saveLocalProducts(filtered);
  return true;
}

export async function fetchOrders(): Promise<Order[]> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*, items:order_items(*)')
        .order('created_at', { ascending: false });

      if (!error && data) {
        return data as Order[];
      }
    } catch (err) {
      console.warn('Gagal fetch orders dari Supabase, gunakan lokal:', err);
    }
  }
  return getLocalOrders();
}

export async function fetchUserOrders(userEmail: string, userId?: string): Promise<Order[]> {
  const all = await fetchOrders();
  return all.filter((o) => (userId && o.user_id === userId) || o.customer_email.toLowerCase() === userEmail.toLowerCase());
}

export async function fetchOrderById(id: string): Promise<Order | null> {
  const orders = await fetchOrders();
  return orders.find((o) => o.id === id) || null;
}

export async function createOrder(
  orderInput: Omit<Order, 'id' | 'created_at'>,
  items: OrderItem[]
): Promise<Order> {
  const orderId = `ORD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const timestamp = new Date().toISOString();

  const newOrder: Order = {
    ...orderInput,
    id: orderId,
    created_at: timestamp,
    items: items.map((it) => ({ ...it, order_id: orderId }))
  };

  const supabase = getSupabase();
  if (supabase) {
    try {
      // Insert to orders table
      const { error: orderError } = await supabase.from('orders').insert([
        {
          id: newOrder.id,
          user_id: newOrder.user_id || null,
          customer_name: newOrder.customer_name,
          customer_email: newOrder.customer_email,
          customer_phone: newOrder.customer_phone,
          shipping_address: newOrder.shipping_address || null,
          shipping_city: newOrder.shipping_city || null,
          shipping_postal_code: newOrder.shipping_postal_code || null,
          order_type: newOrder.order_type,
          total_amount: newOrder.total_amount,
          status: newOrder.status,
          payment_method: newOrder.payment_method,
          notes: newOrder.notes || null,
          created_at: newOrder.created_at
        }
      ]);

      if (!orderError) {
        // Insert order_items
        const itemsToInsert = items.map((item) => ({
          order_id: newOrder.id,
          product_id: item.product_id,
          product_title: item.product_title,
          product_type: item.product_type,
          price: item.price,
          quantity: item.quantity,
          download_url: item.download_url || null
        }));

        await supabase.from('order_items').insert(itemsToInsert);
        return newOrder;
      }
    } catch (err) {
      console.warn('Gagal insert order ke Supabase, fallback ke lokal:', err);
    }
  }

  // Fallback to local storage
  const currentOrders = getLocalOrders();
  const updatedOrders = [newOrder, ...currentOrders];
  saveLocalOrders(updatedOrders);
  return newOrder;
}

export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<boolean> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId);

      if (!error) return true;
    } catch (err) {
      console.warn('Gagal update status di Supabase:', err);
    }
  }

  const orders = getLocalOrders();
  const idx = orders.findIndex((o) => o.id === orderId);
  if (idx !== -1) {
    orders[idx].status = status;
    saveLocalOrders(orders);
    return true;
  }
  return false;
}
