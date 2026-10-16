'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { formatIDR } from '@/lib/utils';
import {
  X,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Download,
  Package,
  Sparkles
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    items,
    totalItems,
    subtotal,
    removeFromCart,
    updateQuantity,
    clearCart,
    hasPhysicalItems,
    hasDigitalItems,
    isCartDrawerOpen,
    setIsCartDrawerOpen
  } = useCart();

  if (!isCartDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-zinc-950 shadow-2xl flex flex-col border-l border-zinc-200 dark:border-zinc-800 animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-indigo-600" />
              <h2 className="font-bold text-zinc-900 dark:text-white text-base">
                Keranjang Belanja ({totalItems})
              </h2>
            </div>
            <button
              onClick={() => setIsCartDrawerOpen(false)}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
              aria-label="Tutup Keranjang"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-zinc-500">
                <div className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-400 mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-semibold text-zinc-800 dark:text-zinc-200 text-sm">
                  Keranjang Masih Kosong
                </h3>
                <p className="text-xs text-zinc-500 mt-1 max-w-xs">
                  Yuk jelajahi katalog produk digital dan produk fisik kami sekarang!
                </p>
                <button
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="mt-5 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-500 transition"
                >
                  Mulai Belanja
                </button>
              </div>
            ) : (
              <>
                {/* Product Type Notice */}
                <div className="space-y-2">
                  {hasDigitalItems && (
                    <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-[11px] text-emerald-800 dark:text-emerald-300">
                      <Download className="w-4 h-4 shrink-0 text-emerald-600" />
                      <span>Produk digital dapat langsung diunduh seketika setelah checkout.</span>
                    </div>
                  )}
                  {hasPhysicalItems && (
                    <div className="flex items-center gap-2 p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-[11px] text-blue-800 dark:text-blue-300">
                      <Package className="w-4 h-4 shrink-0 text-blue-600" />
                      <span>Produk fisik akan dikirim ke alamat Anda dengan packing aman.</span>
                    </div>
                  )}
                </div>

                {/* List items */}
                {items.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex gap-3 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800/60"
                  >
                    <img
                      src={item.product.image_url}
                      alt={item.product.title}
                      className="w-18 h-18 object-cover rounded-lg bg-zinc-200 shrink-0"
                    />

                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 line-clamp-1">
                            {item.product.title}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-zinc-400 hover:text-rose-500 transition"
                            title="Hapus"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <span className="text-[10px] text-zinc-500">
                          {item.product.product_type === 'digital' ? '⚡ Digital' : '📦 Fisik'} •{' '}
                          {formatIDR(item.product.price)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-zinc-200/60 dark:border-zinc-800/60">
                        {/* Quantity Stepper */}
                        <div className="flex items-center gap-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-2 py-0.5">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold w-4 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400">
                          {formatIDR(item.product.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>

          {/* Footer Subtotal & Checkout */}
          {items.length > 0 && (
            <div className="p-5 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-500">Subtotal Belanja</span>
                <span className="text-lg font-black text-zinc-900 dark:text-white">
                  {formatIDR(subtotal)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/cart"
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="w-full text-center py-2.5 px-3 border border-zinc-300 dark:border-zinc-700 rounded-xl text-xs font-semibold text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                >
                  Lihat Keranjang
                </Link>

                <Link
                  href="/checkout"
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="w-full text-center py-2.5 px-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/20 transition"
                >
                  <span>Checkout</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <button
                onClick={clearCart}
                className="w-full text-center text-[11px] text-zinc-400 hover:text-rose-500 transition py-1"
              >
                Kosongkan Keranjang
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
