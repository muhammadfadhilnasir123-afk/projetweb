'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { fetchProductById } from '@/lib/supabase';
import { Product } from '@/lib/types';
import { formatIDR } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import {
  ChevronLeft,
  Star,
  Download,
  Package,
  ShoppingBag,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Truck,
  Plus,
  Minus,
  ExternalLink,
  Share2
} from 'lucide-react';

function ProductDetailContent() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      if (!params?.id) return;
      setIsLoading(true);
      const data = await fetchProductById(params.id as string);
      setProduct(data);
      setIsLoading(false);
    }
    loadProduct();
  }, [params?.id]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 animate-pulse space-y-8">
        <div className="h-6 w-48 bg-zinc-200 dark:bg-zinc-800 rounded" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="aspect-square bg-zinc-200 dark:bg-zinc-800 rounded-3xl" />
          <div className="space-y-4">
            <div className="h-8 w-3/4 bg-zinc-200 dark:bg-zinc-800 rounded" />
            <div className="h-6 w-1/4 bg-zinc-200 dark:bg-zinc-800 rounded" />
            <div className="h-24 bg-zinc-200 dark:bg-zinc-800 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
          Produk Tidak Ditemukan
        </h2>
        <p className="text-zinc-500 text-sm mt-2">
          Produk yang Anda cari mungkin telah dihapus atau link tidak sesuai.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500 transition"
        >
          <ChevronLeft className="w-4 h-4" />
          Kembali ke Katalog
        </Link>
      </div>
    );
  }

  const isDigital = product.product_type === 'digital';
  const isOutOfStock = !isDigital && product.stock <= 0;
  const maxStock = isDigital ? 9999 : product.stock;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    router.push('/checkout');
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between gap-4 mb-6 text-xs text-zinc-500">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition"
        >
          <ChevronLeft className="w-4 h-4" />
          Kembali ke Katalog
        </Link>

        <button
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition text-zinc-700 dark:text-zinc-300"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>{copied ? 'Link Disalin!' : 'Bagikan Produk'}</span>
        </button>
      </div>

      {/* Main Detail Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Product Image Showcase */}
        <div className="space-y-4">
          <div className="relative aspect-[4/3] sm:aspect-square w-full rounded-3xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-md">
            <img
              src={product.image_url}
              alt={product.title}
              className="w-full h-full object-cover"
            />

            {/* Product Type Floating Badge */}
            <div className="absolute top-4 left-4">
              {isDigital ? (
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-500 text-white backdrop-blur-md shadow-lg">
                  <Download className="w-4 h-4" />
                  Produk Digital (Download Instan)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-blue-600 text-white backdrop-blur-md shadow-lg">
                  <Package className="w-4 h-4" />
                  Produk Fisik (Dikirim)
                </span>
              )}
            </div>
          </div>

          {/* Guarantees Box */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-zinc-100/70 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-indigo-500 shrink-0" />
              <div>
                <span className="font-bold text-zinc-900 dark:text-white block">Jaminan Keaslian</span>
                <span className="text-[10px] text-zinc-500">100% Produk Original Terverifikasi</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-zinc-100/70 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 flex items-center gap-2.5">
              {isDigital ? (
                <>
                  <Zap className="w-5 h-5 text-emerald-500 shrink-0" />
                  <div>
                    <span className="font-bold text-zinc-900 dark:text-white block">Download Otomatis</span>
                    <span className="text-[10px] text-zinc-500">Akses link file langsung aktif</span>
                  </div>
                </>
              ) : (
                <>
                  <Truck className="w-5 h-5 text-blue-500 shrink-0" />
                  <div>
                    <span className="font-bold text-zinc-900 dark:text-white block">Packing Ekstra Aman</span>
                    <span className="text-[10px] text-zinc-500">Bubble wrap tebal & resi kurir</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Product Details & Purchase Form */}
        <div className="flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">
                {product.category}
              </span>
              <div className="flex items-center gap-1 text-amber-500 text-xs font-semibold">
                <Star className="w-4 h-4 fill-current" />
                <span>{product.rating}</span>
                <span className="text-zinc-400">({product.sales_count} terjual)</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
              {product.title}
            </h1>

            {/* Price display */}
            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800/80 flex items-center justify-between">
              <div>
                <span className="text-xs text-zinc-400 block font-medium">Harga Resmi</span>
                <span className="text-3xl font-black text-indigo-600 dark:text-indigo-400">
                  {formatIDR(product.price)}
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs text-zinc-400 block">Ketersediaan</span>
                <span className={`text-xs font-bold ${isOutOfStock ? 'text-rose-500' : 'text-emerald-500'}`}>
                  {isDigital ? 'Tersedia (Akses Instan)' : isOutOfStock ? 'Stok Habis' : `Tersisa ${product.stock} unit`}
                </span>
              </div>
            </div>

            {/* Spec info badge */}
            {product.file_spec && (
              <div className="p-3.5 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 text-xs">
                <span className="font-bold text-indigo-950 dark:text-indigo-200 block mb-0.5">
                  {isDigital ? '📦 Spesifikasi Berkas:' : '🚚 Info Fisik & Kemasan:'}
                </span>
                <p className="text-zinc-600 dark:text-zinc-400">{product.file_spec}</p>
              </div>
            )}

            {/* Description */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                Deskripsi Produk
              </h3>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Features checkmarks */}
            {product.features && product.features.length > 0 && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                  Keunggulan & Apa yang Anda Dapatkan:
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {product.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-zinc-700 dark:text-zinc-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Quantity & Buy Actions */}
          <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800 space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Jumlah:</span>
              <div className="flex items-center border border-zinc-300 dark:border-zinc-700 rounded-xl px-3 py-1.5 bg-white dark:bg-zinc-800">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white disabled:opacity-30"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center text-xs font-bold">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(maxStock, quantity + 1))}
                  disabled={quantity >= maxStock}
                  className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white disabled:opacity-30"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="text-xs text-zinc-500">
                Total: <b className="text-zinc-900 dark:text-white">{formatIDR(product.price * quantity)}</b>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`w-full py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition ${
                  isOutOfStock
                    ? 'bg-zinc-200 text-zinc-400 border-zinc-200 cursor-not-allowed dark:bg-zinc-800'
                    : isAdded
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'border-indigo-600 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/40'
                }`}
              >
                {isAdded ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Ditambahkan ke Keranjang!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Tambah ke Keranjang</span>
                  </>
                )}
              </button>

              <button
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className="w-full py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition disabled:opacity-50"
              >
                <Zap className="w-4 h-4" />
                <span>Beli Sekarang</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductDetailPage() {
  return (
    <React.Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-20 text-center text-xs text-zinc-500">Memuat detail produk...</div>}>
      <ProductDetailContent />
    </React.Suspense>
  );
}
