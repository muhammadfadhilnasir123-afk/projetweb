'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { formatIDR } from '@/lib/utils';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ChevronLeft,
  Download,
  Package,
  ShieldCheck,
  Lock,
  Sparkles
} from 'lucide-react';

export default function CartPage() {
  const router = useRouter();
  const {
    items,
    totalItems,
    subtotal,
    removeFromCart,
    updateQuantity,
    clearCart,
    hasPhysicalItems,
    hasDigitalItems
  } = useCart();
  const { user, loginAsDemo } = useAuth();

  const handleProceedToCheckout = () => {
    if (!user) {
      router.push('/login?redirect=/checkout');
    } else {
      router.push('/checkout');
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500 flex items-center justify-center mx-auto mb-4">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
          Keranjang Belanja Anda Kosong
        </h2>
        <p className="text-zinc-500 text-sm mt-2 max-w-md mx-auto">
          Belum ada produk digital maupun produk fisik yang Anda masukkan ke keranjang.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500 transition shadow-lg shadow-indigo-600/30"
        >
          <ChevronLeft className="w-4 h-4" />
          Mulai Belanja Sekarang
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
            Keranjang Belanja
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Periksa rincian produk digital dan fisik sebelum melanjutkan ke pembayaran
          </p>
        </div>

        <button
          onClick={clearCart}
          className="text-xs text-zinc-400 hover:text-rose-500 flex items-center gap-1 self-start sm:self-auto transition"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Kosongkan Semua Keranjang
        </button>
      </div>

      {/* Auth Protection Alert if Not Logged In */}
      {!user && (
        <div className="mb-6 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-amber-900 dark:text-amber-200">
                Login Diperlukan untuk Checkout
              </h4>
              <p className="text-[11px] text-amber-700 dark:text-amber-400">
                Sesuai proteksi autentikasi Supabase, Anda perlu masuk ke akun terlebih dahulu untuk memproses pesanan.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => loginAsDemo('customer')}
              className="px-3 py-1.5 rounded-lg bg-amber-200/60 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 text-xs font-semibold hover:bg-amber-200 transition flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5" />
              1-Click Demo Login
            </button>
            <Link
              href="/login?redirect=/checkout"
              className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-sm"
            >
              Masuk Sekarang
            </Link>
          </div>
        </div>
      )}

      {/* Grid Layout: Items Table & Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => {
            const isDigital = item.product.product_type === 'digital';
            const maxStock = isDigital ? 9999 : item.product.stock;

            return (
              <div
                key={item.product.id}
                className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 flex flex-col sm:flex-row items-start sm:items-center gap-4 shadow-sm"
              >
                {/* Image */}
                <img
                  src={item.product.image_url}
                  alt={item.product.title}
                  className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl bg-zinc-100 dark:bg-zinc-800 shrink-0"
                />

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {isDigital ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                        <Download className="w-3 h-3" />
                        Digital Download
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                        <Package className="w-3 h-3" />
                        Pengiriman Fisik
                      </span>
                    )}
                    <span className="text-[10px] text-zinc-400">{item.product.category}</span>
                  </div>

                  <Link
                    href={`/product/${item.product.id}`}
                    className="font-bold text-sm text-zinc-900 dark:text-zinc-100 line-clamp-1 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                  >
                    {item.product.title}
                  </Link>

                  <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mt-1">
                    {formatIDR(item.product.price)} / unit
                  </p>
                </div>

                {/* Quantity & Item Subtotal */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-zinc-100 dark:border-zinc-800">
                  <div className="flex items-center border border-zinc-300 dark:border-zinc-700 rounded-lg px-2 py-1 bg-zinc-50 dark:bg-zinc-800">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-xs font-bold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      disabled={item.quantity >= maxStock}
                      className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white disabled:opacity-30"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-sm font-black text-zinc-900 dark:text-white">
                      {formatIDR(item.product.price * item.quantity)}
                    </span>
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-zinc-400 hover:text-rose-500 transition p-1"
                      title="Hapus"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Order Summary */}
        <div>
          <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 shadow-md space-y-5 sticky top-24">
            <h3 className="font-bold text-base text-zinc-900 dark:text-white">
              Ringkasan Belanja
            </h3>

            <div className="space-y-3 text-xs text-zinc-600 dark:text-zinc-400 pb-4 border-b border-zinc-100 dark:border-zinc-800">
              <div className="flex justify-between">
                <span>Total Item ({totalItems})</span>
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                  {formatIDR(subtotal)}
                </span>
              </div>

              {hasDigitalItems && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                  <span>Biaya Pengiriman Digital</span>
                  <span className="font-bold">GRATIS (Instan)</span>
                </div>
              )}

              {hasPhysicalItems && (
                <div className="flex justify-between text-blue-600 dark:text-blue-400">
                  <span>Ongkos Kirim Produk Fisik</span>
                  <span className="font-bold">Dihitung saat Checkout</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Biaya Layanan Sistem</span>
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">Rp 0</span>
              </div>
            </div>

            {/* Total */}
            <div className="flex items-baseline justify-between">
              <span className="text-sm font-bold text-zinc-900 dark:text-white">Total Bayar</span>
              <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                {formatIDR(subtotal)}
              </span>
            </div>

            {/* Checkout Button */}
            <button
              onClick={handleProceedToCheckout}
              className="w-full py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition"
            >
              <span>Lanjut ke Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="pt-2 flex items-center justify-center gap-1.5 text-[11px] text-zinc-400">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Checkout aman & data transaksi tersimpan di Supabase</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
