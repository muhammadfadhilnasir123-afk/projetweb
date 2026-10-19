-- ====================================================================
-- FADHIL STORE - SUPABASE DATABASE SCHEMA & RLS POLICIES
-- E-Commerce & Katalog Produk Digital & Fisik
-- Next.js (App Router, Tailwind CSS, TypeScript) + Supabase
-- ====================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create PROFILES Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  email TEXT,
  role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Create PRODUCTS Table
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL CHECK (price >= 0),
  category TEXT NOT NULL,
  product_type TEXT NOT NULL CHECK (product_type IN ('digital', 'physical')),
  image_url TEXT NOT NULL,
  download_url TEXT,
  file_spec TEXT,
  stock INTEGER DEFAULT 0 CHECK (stock >= 0),
  rating NUMERIC DEFAULT 5.0,
  sales_count INTEGER DEFAULT 0,
  features TEXT[],
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. Create ORDERS Table
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  shipping_address TEXT,
  shipping_city TEXT,
  shipping_postal_code TEXT,
  order_type TEXT NOT NULL CHECK (order_type IN ('digital', 'physical', 'hybrid')),
  total_amount NUMERIC NOT NULL CHECK (total_amount >= 0),
  status TEXT DEFAULT 'Menunggu Pembayaran' CHECK (status IN ('Menunggu Pembayaran', 'Diproses', 'Selesai', 'Dibatalkan')),
  payment_method TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. Create ORDER_ITEMS Table
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id TEXT REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  product_id TEXT NOT NULL,
  product_title TEXT NOT NULL,
  product_type TEXT NOT NULL,
  price NUMERIC NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  download_url TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Helper function to check if caller is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- --- PROFILES POLICIES ---
-- Users can view their own profile; admins can view all profiles
CREATE POLICY "Users can view own profile or admin can view all"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id OR public.is_admin());

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- --- PRODUCTS POLICIES ---
-- Everyone can read products (Public read)
CREATE POLICY "Public products viewable by everyone"
  ON public.products FOR SELECT
  USING (true);

-- Admins can insert, update, delete products
CREATE POLICY "Admins can insert products"
  ON public.products FOR INSERT
  WITH CHECK (public.is_admin() OR auth.role() = 'service_role');

CREATE POLICY "Admins can update products"
  ON public.products FOR UPDATE
  USING (public.is_admin() OR auth.role() = 'service_role');

CREATE POLICY "Admins can delete products"
  ON public.products FOR DELETE
  USING (public.is_admin() OR auth.role() = 'service_role');

-- --- ORDERS POLICIES ---
-- Anyone (or authenticated user) can insert a new order at checkout
CREATE POLICY "Allow customers to place orders"
  ON public.orders FOR INSERT
  WITH CHECK (true);

-- Users can view their own orders; admins can view all orders
CREATE POLICY "Users can view own orders, admins can view all"
  ON public.orders FOR SELECT
  USING (
    (auth.uid() IS NOT NULL AND auth.uid() = user_id)
    OR public.is_admin()
    OR auth.role() = 'service_role'
  );

-- Admins can update order status
CREATE POLICY "Admins can update orders"
  ON public.orders FOR UPDATE
  USING (public.is_admin() OR auth.role() = 'service_role');

-- --- ORDER_ITEMS POLICIES ---
-- Allow inserting items during order placement
CREATE POLICY "Allow insert order items"
  ON public.order_items FOR INSERT
  WITH CHECK (true);

-- View order items if user owns order or is admin
CREATE POLICY "View order items"
  ON public.order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
      AND (orders.user_id = auth.uid() OR public.is_admin() OR auth.role() = 'service_role')
    )
  );

-- ====================================================================
-- AUTO-CREATE PROFILE ON USER SIGNUP TRIGGER
-- ====================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'customer')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ====================================================================
-- SEED INITIAL PRODUCTS DATA
-- ====================================================================

INSERT INTO public.products (id, title, slug, description, price, category, product_type, image_url, download_url, file_spec, stock, rating, sales_count, features)
VALUES
(
  'prod-001',
  'E-Book: Masterclass Fullstack Next.js & Supabase',
  'ebook-masterclass-nextjs-supabase',
  'Panduan lengkap dari dasar hingga mahir membangun aplikasi web modern skala produksi dengan Next.js App Router, Tailwind CSS, TypeScript, dan Supabase backend.',
  149000,
  'E-Book & Panduan Praktis',
  'digital',
  'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
  'https://drive.google.com/uc?export=download&id=sample_ebook_nextjs',
  'Format PDF & ePub • 320 Halaman • Full Color',
  9999,
  4.9,
  428,
  ARRAY['320 Halaman materi terstruktur', 'Studi kasus aplikasi SaaS nyata', 'Akses update gratis selamanya', 'Termasuk cheat sheet arsitektur DB']
),
(
  'prod-002',
  'Nexus UI Kit: Modern SaaS Dashboard Design System',
  'nexus-ui-kit-saas-dashboard',
  'Design system dan komponen UI terlengkap untuk Figma. Memiliki lebih dari 400+ komponen responsive, auto-layout 5.0, dark mode, dan siap diimplementasikan ke Tailwind CSS.',
  299000,
  'Template & Aset Digital',
  'digital',
  'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
  'https://drive.google.com/uc?export=download&id=sample_nexus_ui_kit',
  'Figma (.fig) File • 400+ Varian Komponen • Icon Set',
  9999,
  5.0,
  215,
  ARRAY['Komponen Auto Layout 5.0 interaktif', 'Tersedia Dark Mode & Light Mode', 'Terintegrasi Tailwind CSS tokens', 'Termasuk lisensi komersial tak terbatas']
),
(
  'prod-003',
  'Cinematic Mood Lightroom Presets (15 Presets Pack)',
  'cinematic-mood-lightroom-presets',
  'Koleksi 15 preset warna sinematik premium untuk Adobe Lightroom Desktop & Mobile. Sangat cocok untuk fotografi travel, street, portrait, dan konten media sosial.',
  89000,
  'Template & Aset Digital',
  'digital',
  'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
  'https://drive.google.com/uc?export=download&id=sample_cinematic_presets',
  '15 File .XMP & .DNG • Kompatibel Mobile & Desktop',
  9999,
  4.8,
  532,
  ARRAY['15 varian preset sinematik', 'Kompatibel iOS, Android, Mac, Windows', 'Panduan instalasi 1 menit', 'Peningkatan tone warna instan']
),
(
  'prod-004',
  'SaaS Starter Boilerplate: Next.js + Stripe + Supabase',
  'saas-starter-boilerplate',
  'Source code boilerplate siap pakai untuk meluncurkan produk SaaS Anda dalam hitungan hari. Sudah terpasang Auth, Billing Stripe / Midtrans, Email transactional, dan Admin Dashboard.',
  499000,
  'Template & Aset Digital',
  'digital',
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
  'https://github.com/sample/saas-starter-boilerplate',
  'Akses GitHub Private Repo • TypeScript • Dokumen Lengkap',
  9999,
  4.9,
  147,
  ARRAY['Full TypeScript & Next.js App Router', 'Supabase Database + Row Level Security', 'Integrasi Payment Gateway siap pakai', 'Setup email otomatis via Resend']
),
(
  'prod-005',
  'Keychron K2 Pro Wireless Mechanical Keyboard',
  'keychron-k2-pro-wireless-keyboard',
  'Keyboard mekanik nirkabel 75% dengan switch Gateron G Pro Brown, keycaps PBT OSA profile, konektivitas Bluetooth 5.1 & Type-C, serta backlight RGB yang memukau.',
  1450000,
  'Aksesoris & Kebutuhan Harian',
  'physical',
  'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
  NULL,
  'Berat: 950g • Dimensi: 316 x 130 x 40mm • Garansi Resmi 1 Tahun',
  24,
  4.9,
  98,
  ARRAY['Gateron G Pro Mechanical Switches', 'Double-shot PBT Keycaps tahan aus', 'Baterai tahan hingga 300 jam', 'Dukungan QMK/VIA programmable']
),
(
  'prod-006',
  'Developer Oversized Heavyweight T-Shirt "Eat Sleep Code"',
  'developer-oversized-heavyweight-tshirt',
  'Kaos oversized premium berbahan 100% Cotton Combed 24s Heavyweight dengan sablon Discharge berkualitas tinggi. Sangat nyaman, adem, dan pas untuk daily outfit developer.',
  165000,
  'Pakaian Nyaman (Fashion)',
  'physical',
  'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
  NULL,
  'Bahan Cotton 24s • Ukuran S, M, L, XL, XXL • Warna Hitam Jet',
  65,
  4.7,
  340,
  ARRAY['Bahan 100% Cotton Combed 24s', 'Potongan Oversized modern', 'Sablon awet tidak mudah retak', 'Bebas susut setelah pencucian']
),
(
  'prod-007',
  'Minimalist Matte Thermal Tumbler 500ml',
  'minimalist-matte-thermal-tumbler',
  'Tumbler stainless steel 304 food-grade dengan lapisan powder coating matte anti gores. Menjaga suhu kopi tetap panas hingga 12 jam atau minuman dingin hingga 24 jam.',
  185000,
  'Aksesoris & Kebutuhan Harian',
  'physical',
  'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=800&q=80',
  NULL,
  'Kapasitas: 500ml • Material: Stainless Steel 304 • BPA Free',
  42,
  4.9,
  180,
  ARRAY['Double-wall vacuum insulation', 'Tahan panas 12 jam & dingin 24 jam', 'Tutup anti tumpah dengan segel silikon', 'Desain ergonomis & estetik']
),
(
  'prod-008',
  'Single Origin Specialty Coffee Beans - Gayo Aceh (250g)',
  'single-origin-specialty-coffee-gayo',
  'Biji kopi arabika pilihan dari pegunungan Gayo, Aceh. Disangrai dengan profil Medium Roast untuk menghasilkan notes rasa floral, caramel, dan subtle citrus acidity yang menyegarkan.',
  95000,
  'Aksesoris & Kebutuhan Harian',
  'physical',
  'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=800&q=80',
  NULL,
  'Netto: 250 gram • Roast Date: Selalu Segar (Freshly Roasted)',
  50,
  4.8,
  275,
  ARRAY['100% Arabika Grade 1 Gayo', 'Profil Roasting: Medium Roast', 'Tasting Notes: Caramel, Floral, Citrus', 'Kemasan one-way valve kedap udara']
)
ON CONFLICT (id) DO NOTHING;
