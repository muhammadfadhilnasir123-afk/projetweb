import { Product } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-001',
    title: 'E-Book: Masterclass Fullstack Next.js & Supabase',
    slug: 'ebook-masterclass-nextjs-supabase',
    description: 'Panduan lengkap dari dasar hingga mahir membangun aplikasi web modern skala produksi dengan Next.js App Router, Tailwind CSS, TypeScript, dan Supabase backend.',
    price: 149000,
    category: 'E-Book',
    product_type: 'digital',
    image_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    download_url: 'https://drive.google.com/uc?export=download&id=sample_ebook_nextjs',
    file_spec: 'Format PDF & ePub • 320 Halaman • Full Color',
    stock: 9999,
    rating: 4.9,
    sales_count: 428,
    features: [
      '320 Halaman materi terstruktur',
      'Studi kasus aplikasi SaaS nyata',
      'Akses update gratis selamanya',
      'Termasuk cheat sheet arsitektur DB'
    ]
  },
  {
    id: 'prod-002',
    title: 'Nexus UI Kit: Modern SaaS Dashboard Design System',
    slug: 'nexus-ui-kit-saas-dashboard',
    description: 'Design system dan komponen UI terlengkap untuk Figma. Memiliki lebih dari 400+ komponen responsive, auto-layout 5.0, dark mode, dan siap diimplementasikan ke Tailwind CSS.',
    price: 299000,
    category: 'Template UI',
    product_type: 'digital',
    image_url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
    download_url: 'https://drive.google.com/uc?export=download&id=sample_nexus_ui_kit',
    file_spec: 'Figma (.fig) File • 400+ Varian Komponen • Icon Set',
    stock: 9999,
    rating: 5.0,
    sales_count: 215,
    features: [
      'Komponen Auto Layout 5.0 interaktif',
      'Tersedia Dark Mode & Light Mode',
      'Terintegrasi Tailwind CSS tokens',
      'Termasuk lisensi komersial tak terbatas'
    ]
  },
  {
    id: 'prod-003',
    title: 'Cinematic Mood Lightroom Presets (15 Presets Pack)',
    slug: 'cinematic-mood-lightroom-presets',
    description: 'Koleksi 15 preset warna sinematik premium untuk Adobe Lightroom Desktop & Mobile. Sangat cocok untuk fotografi travel, street, portrait, dan konten media sosial.',
    price: 89000,
    category: 'Preset',
    product_type: 'digital',
    image_url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
    download_url: 'https://drive.google.com/uc?export=download&id=sample_cinematic_presets',
    file_spec: '15 File .XMP & .DNG • Kompatibel Mobile & Desktop',
    stock: 9999,
    rating: 4.8,
    sales_count: 532,
    features: [
      '15 varian preset sinematik',
      'Kompatibel iOS, Android, Mac, Windows',
      'Panduan instalasi 1 menit',
      'Peningkatan tone warna instan'
    ]
  },
  {
    id: 'prod-004',
    title: 'SaaS Starter Boilerplate: Next.js + Stripe + Supabase',
    slug: 'saas-starter-boilerplate',
    description: 'Source code boilerplate siap pakai untuk meluncurkan produk SaaS Anda dalam hitungan hari. Sudah terpasang Auth, Billing Stripe / Midtrans, Email transactional, dan Admin Dashboard.',
    price: 499000,
    category: 'Source Code',
    product_type: 'digital',
    image_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
    download_url: 'https://github.com/sample/saas-starter-boilerplate',
    file_spec: 'Akses GitHub Private Repo • TypeScript • Dokumen Lengkap',
    stock: 9999,
    rating: 4.9,
    sales_count: 147,
    features: [
      'Full TypeScript & Next.js App Router',
      'Supabase Database + Row Level Security',
      'Integrasi Payment Gateway siap pakai',
      'Setup email otomatis via Resend'
    ]
  },
  {
    id: 'prod-005',
    title: 'Keychron K2 Pro Wireless Mechanical Keyboard',
    slug: 'keychron-k2-pro-wireless-keyboard',
    description: 'Keyboard mekanik nirkabel 75% dengan switch Gateron G Pro Brown, keycaps PBT OSA profile, konektivitas Bluetooth 5.1 & Type-C, serta backlight RGB yang memukau.',
    price: 1450000,
    category: 'Aksesoris & Gadget',
    product_type: 'physical',
    image_url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
    file_spec: 'Berat: 950g • Dimensi: 316 x 130 x 40mm • Garansi Resmi 1 Tahun',
    stock: 24,
    rating: 4.9,
    sales_count: 98,
    features: [
      'Gateron G Pro Mechanical Switches',
      'Double-shot PBT Keycaps tahan aus',
      'Baterai tahan hingga 300 jam',
      'Dukungan QMK/VIA programmable'
    ]
  },
  {
    id: 'prod-006',
    title: 'Developer Oversized Heavyweight T-Shirt "Eat Sleep Code"',
    slug: 'developer-oversized-heavyweight-tshirt',
    description: 'Kaos oversized premium berbahan 100% Cotton Combed 24s Heavyweight dengan sablon Discharge berkualitas tinggi. Sangat nyaman, adem, dan pas untuk daily outfit developer.',
    price: 165000,
    category: 'Merchandise',
    product_type: 'physical',
    image_url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
    file_spec: 'Bahan Cotton 24s • Ukuran S, M, L, XL, XXL • Warna Hitam Jet',
    stock: 65,
    rating: 4.7,
    sales_count: 340,
    features: [
      'Bahan 100% Cotton Combed 24s',
      'Potongan Oversized modern',
      'Sablon awet tidak mudah retak',
      'Bebas susut setelah pencucian'
    ]
  },
  {
    id: 'prod-007',
    title: 'Minimalist Matte Thermal Tumbler 500ml',
    slug: 'minimalist-matte-thermal-tumbler',
    description: 'Tumbler stainless steel 304 food-grade dengan lapisan powder coating matte anti gores. Menjaga suhu kopi tetap panas hingga 12 jam atau minuman dingin hingga 24 jam.',
    price: 185000,
    category: 'Merchandise',
    product_type: 'physical',
    image_url: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=800&q=80',
    file_spec: 'Kapasitas: 500ml • Material: Stainless Steel 304 • BPA Free',
    stock: 42,
    rating: 4.9,
    sales_count: 180,
    features: [
      'Double-wall vacuum insulation',
      'Tahan panas 12 jam & dingin 24 jam',
      'Tutup anti tumpah dengan segel silikon',
      'Desain ergonomis & estetik'
    ]
  },
  {
    id: 'prod-008',
    title: 'Single Origin Specialty Coffee Beans - Gayo Aceh (250g)',
    slug: 'single-origin-specialty-coffee-gayo',
    description: 'Biji kopi arabika pilihan dari pegunungan Gayo, Aceh. Disangrai dengan profil Medium Roast untuk menghasilkan notes rasa floral, caramel, dan subtle citrus acidity yang menyegarkan.',
    price: 95000,
    category: 'Aksesoris & Gadget',
    product_type: 'physical',
    image_url: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=800&q=80',
    file_spec: 'Netto: 250 gram • Roast Date: Selalu Segar (Freshly Roasted)',
    stock: 50,
    rating: 4.8,
    sales_count: 275,
    features: [
      '100% Arabika Grade 1 Gayo',
      'Profil Roasting: Medium Roast',
      'Tasting Notes: Caramel, Floral, Citrus',
      'Kemasan one-way valve kedap udara'
    ]
  }
];
