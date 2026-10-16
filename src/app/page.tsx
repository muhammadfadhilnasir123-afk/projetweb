'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { fetchProducts } from '@/lib/supabase';
import { Product, ProductType } from '@/lib/types';
import { ProductCard } from '@/components/ProductCard';
import { ProductDetailModal } from '@/components/ProductDetailModal';
import {
  Search,
  SlidersHorizontal,
  Download,
  Package,
  Sparkles,
  ArrowUpDown,
  BookOpen,
  Layout,
  Palette,
  Code2,
  Coffee,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';

function CatalogContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'digital' | 'physical'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Sync with URL query parameter
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat === 'digital') {
      setTypeFilter('digital');
      setCategoryFilter('all');
    } else if (cat === 'physical') {
      setTypeFilter('physical');
      setCategoryFilter('all');
    }
  }, [searchParams]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await fetchProducts();
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filtered and Sorted products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Search query filter (title, description, category)
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = p.title.toLowerCase().includes(q);
          const matchDesc = p.description?.toLowerCase().includes(q);
          const matchCat = p.category.toLowerCase().includes(q);
          if (!matchTitle && !matchDesc && !matchCat) return false;
        }

        // Type filter
        if (typeFilter !== 'all' && p.product_type !== typeFilter) {
          return false;
        }

        // Category filter
        if (categoryFilter !== 'all' && p.category !== categoryFilter) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        return (b.sales_count || 0) - (a.sales_count || 0); // 'featured'
      });
  }, [products, searchQuery, typeFilter, categoryFilter, sortBy]);

  // Unique categories list
  const availableCategories = useMemo(() => {
    const list = Array.from(new Set(products.map((p) => p.category)));
    return list;
  }, [products]);

  const resetFilters = () => {
    setSearchQuery('');
    setTypeFilter('all');
    setCategoryFilter('all');
    setSortBy('featured');
  };

  return (
    <div className="min-h-screen pb-16">
      {/* Hero Showcase Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-950 via-zinc-900 to-zinc-950 text-white pt-16 pb-20 px-4 sm:px-6 lg:px-8 border-b border-zinc-800">
        {/* Ambient Glows */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-semibold text-indigo-300">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Koleksi Terkurasi E-Book, Template UI, Gadget & Merchandise</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            E-Commerce & Katalog Produk <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400">
              Digital & Fisik Terlengkap
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-zinc-300 leading-relaxed font-normal">
            Dapatkan source code berkualitas, template UI profesional, preset foto sinematik, serta perlengkapan kerja & merchandise developer langsung di satu tempat.
          </p>

          {/* Interactive Live Search Input */}
          <div className="max-w-2xl mx-auto mt-6">
            <div className="relative flex items-center shadow-2xl rounded-2xl overflow-hidden border border-white/15 bg-white/10 backdrop-blur-xl focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-400/30 transition">
              <Search className="w-5 h-5 ml-4 text-zinc-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari produk: Next.js, Figma, Preset, Keyboard, Kaos..."
                className="w-full py-4 pl-3 pr-10 bg-transparent text-white placeholder-zinc-400 text-sm focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="mr-3 text-xs text-zinc-400 hover:text-white px-2 py-1 bg-white/10 rounded-md"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Feature Badges Counter */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs text-zinc-400 font-medium">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Unduhan Instan (Digital)
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-blue-400" />
              Pengiriman Cepat (Fisik)
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-purple-400" />
              Database Supabase Terproteksi
            </span>
          </div>
        </div>
      </section>

      {/* Main Catalog Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {/* Filters and Controls Bar */}
        <div className="space-y-4 mb-8">
          {/* Top Filter Row: Type Pills & Sorter */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
            {/* Type Filter Buttons */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              <button
                onClick={() => {
                  setTypeFilter('all');
                  setCategoryFilter('all');
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
                  typeFilter === 'all'
                    ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-sm'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                }`}
              >
                Semua Produk ({products.length})
              </button>

              <button
                onClick={() => {
                  setTypeFilter('digital');
                  setCategoryFilter('all');
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition shrink-0 ${
                  typeFilter === 'digital'
                    ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                }`}
              >
                <Download className="w-3.5 h-3.5" />
                <span>Produk Digital ({products.filter((p) => p.product_type === 'digital').length})</span>
              </button>

              <button
                onClick={() => {
                  setTypeFilter('physical');
                  setCategoryFilter('all');
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition shrink-0 ${
                  typeFilter === 'physical'
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                }`}
              >
                <Package className="w-3.5 h-3.5" />
                <span>Produk Fisik ({products.filter((p) => p.product_type === 'physical').length})</span>
              </button>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <span className="text-xs text-zinc-400 flex items-center gap-1 font-medium">
                <ArrowUpDown className="w-3.5 h-3.5" />
                Urutkan:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="text-xs font-semibold py-1.5 px-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="featured">Paling Populer</option>
                <option value="price-asc">Harga Terendah</option>
                <option value="price-desc">Harga Tertinggi</option>
                <option value="rating">Rating Tertinggi</option>
              </select>
            </div>
          </div>

          {/* Sub Categories Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs">
            <span className="text-zinc-400 font-medium shrink-0">Kategori:</span>
            <button
              onClick={() => setCategoryFilter('all')}
              className={`px-3 py-1 rounded-full transition font-medium shrink-0 ${
                categoryFilter === 'all'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
              }`}
            >
              Semua
            </button>
            {availableCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1 rounded-full transition font-medium shrink-0 ${
                  categoryFilter === cat
                    ? 'bg-indigo-600 text-white'
                    : 'bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results Counter & Reset Filter */}
        <div className="flex items-center justify-between mb-6 text-xs text-zinc-500">
          <p>
            Menampilkan <span className="font-bold text-zinc-900 dark:text-zinc-100">{filteredProducts.length}</span> produk
            {searchQuery && (
              <span> untuk pencarian &ldquo;{searchQuery}&rdquo;</span>
            )}
          </p>
          {(searchQuery || typeFilter !== 'all' || categoryFilter !== 'all') && (
            <button
              onClick={resetFilters}
              className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-semibold"
            >
              <RefreshCw className="w-3 h-3" />
              Reset Semua Filter
            </button>
          )}
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div
                key={n}
                className="h-80 rounded-2xl bg-zinc-200 dark:bg-zinc-800/60 animate-pulse border border-zinc-200/50 dark:border-zinc-800/50"
              />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-20 text-center bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 p-8 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-500 flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-200">
              Tidak Ada Produk yang Sesuai
            </h3>
            <p className="text-xs text-zinc-500 max-w-md mx-auto mt-1 mb-6">
              Coba ganti kata kunci pencarian atau bersihkan filter kategori Anda untuk melihat semua produk yang tersedia.
            </p>
            <button
              onClick={resetFilters}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-md"
            >
              Tampilkan Semua Produk
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={(p) => setSelectedProduct(p)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Quick View Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
}

export default function HomePage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen py-20 text-center text-xs text-zinc-500">Memuat Katalog FadhilStore...</div>}>
      <CatalogContent />
    </React.Suspense>
  );
}
