'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Product } from '@/lib/types';
import { formatIDR } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import {
  X,
  Star,
  CheckCircle2,
  Download,
  Package,
  ShoppingBag,
  ExternalLink,
  ShieldCheck,
  Zap,
  Plus,
  Minus
} from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  if (!product) return null;

  const isDigital = product.product_type === 'digital';
  const maxStock = isDigital ? 9999 : product.stock;
  const isOutOfStock = !isDigital && product.stock <= 0;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-3xl bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Image side */}
            <div className="relative aspect-square md:aspect-auto bg-zinc-100 dark:bg-zinc-800">
              <img
                src={product.image_url}
                alt={product.title}
                className="w-full h-full object-cover"
              />

              {/* Type Badge */}
              <div className="absolute top-4 left-4">
                {isDigital ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-500 text-white shadow-md">
                    <Download className="w-4 h-4" />
                    Produk Digital (Download Instan)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-blue-600 text-white shadow-md">
                    <Package className="w-4 h-4" />
                    Produk Fisik (Dikirim ke Rumah)
                  </span>
                )}
              </div>
            </div>

            {/* Content side */}
            <div className="p-6 md:p-8 flex flex-col justify-between max-h-[85vh] overflow-y-auto">
              <div>
                {/* Category & Rating */}
                <div className="flex items-center justify-between text-xs text-zinc-500 mb-2">
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                    {product.category}
                  </span>
                  <div className="flex items-center gap-1 text-amber-500 font-semibold">
                    <Star className="w-4 h-4 fill-current" />
                    <span>{product.rating}</span>
                    <span className="text-zinc-400 font-normal">({product.sales_count} terjual)</span>
                  </div>
                </div>

                <h3 className="text-xl font-black text-zinc-900 dark:text-white leading-tight">
                  {product.title}
                </h3>

                {/* Price */}
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                    {formatIDR(product.price)}
                  </span>
                  {!isDigital && (
                    <span className="text-xs text-zinc-500">
                      • Stok: <b className="text-zinc-800 dark:text-zinc-200">{product.stock}</b>
                    </span>
                  )}
                </div>

                {/* Specs */}
                {product.file_spec && (
                  <div className="mt-3 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/80 text-xs text-zinc-600 dark:text-zinc-300">
                    <span className="font-semibold text-zinc-900 dark:text-white block mb-0.5">
                      {isDigital ? '📦 Spesifikasi File:' : '🚚 Info Produk Fisik:'}
                    </span>
                    {product.file_spec}
                  </div>
                )}

                {/* Description */}
                <p className="mt-4 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {product.description}
                </p>

                {/* Features */}
                {product.features && product.features.length > 0 && (
                  <div className="mt-4 space-y-1.5">
                    <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                      Yang Anda Dapatkan:
                    </p>
                    <ul className="space-y-1">
                      {product.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-zinc-600 dark:text-zinc-400">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center gap-3">
                  {/* Quantity Stepper */}
                  <div className="flex items-center border border-zinc-300 dark:border-zinc-700 rounded-xl px-3 py-2 bg-zinc-50 dark:bg-zinc-800">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white disabled:opacity-30"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center text-xs font-bold">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(maxStock, quantity + 1))}
                      disabled={quantity >= maxStock}
                      className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white disabled:opacity-30"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                    className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md transition ${
                      isOutOfStock
                        ? 'bg-zinc-200 text-zinc-400 cursor-not-allowed dark:bg-zinc-800'
                        : isAdded
                        ? 'bg-emerald-600 text-white'
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Berhasil Ditambahkan!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        <span>Tambah ke Keranjang ({formatIDR(product.price * quantity)})</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="mt-3 flex items-center justify-between text-[11px] text-zinc-500">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
                    Transaksi Aman & Terverifikasi
                  </span>
                  <Link
                    href={`/product/${product.id}`}
                    onClick={onClose}
                    className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                  >
                    <span>Halaman Lengkap</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
